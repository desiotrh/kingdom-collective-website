import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import contentRoutes from './routes/content.js';
import productRoutes from './routes/products.js';
import analyticsRoutes from './routes/analytics.js';
import paymentRoutes from './routes/payments.js';
import webhookRoutes from './routes/webhooks.js';
import adminRoutes from './routes/admin.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';
import { connectDatabase, initializeFirebase, initializeServices, getDatabaseStatus, getDatabaseStats } from './config/database.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ==============================================
// MIDDLEWARE SETUP
// ==============================================

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://kingdom-studios.app', 'https://app.kingdom-studios.app']
    : ['http://localhost:8081', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
}));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined', { 
  stream: { write: (message) => logger.info(message.trim()) }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ==============================================
// HEALTH CHECK ENDPOINT
// ==============================================
app.get('/health', (req, res) => {
  const dbStats = getDatabaseStats();
  
  res.status(200).json({
    status: 'OK',
    message: 'Kingdom Studios API is running',
    version: process.env.API_VERSION || 'v1',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: dbStats,
    services: {
      auth: 'active',
      content: 'active',
      analytics: 'active'
    }
  });
});

// ==============================================
// API ROUTES
// ==============================================
const apiPrefix = `/api/${process.env.API_VERSION || 'v1'}`;

app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/users`, userRoutes);
app.use(`${apiPrefix}/content`, contentRoutes);
app.use(`${apiPrefix}/products`, productRoutes);
app.use(`${apiPrefix}/analytics`, analyticsRoutes);
app.use(`${apiPrefix}/payments`, paymentRoutes);
app.use(`${apiPrefix}/admin`, adminRoutes);

// Webhooks (no API prefix for better webhook compatibility)
app.use('/webhooks', webhookRoutes);

// ==============================================
// API DOCUMENTATION
// ==============================================
app.get(`${apiPrefix}/docs`, (req, res) => {
  res.json({
    name: 'Kingdom Studios API',
    version: process.env.API_VERSION || 'v1',
    description: 'Backend API for Kingdom Studios - Faith-based content creation platform',
    endpoints: {
      auth: {
        'POST /auth/register': 'Register new user',
        'POST /auth/login': 'User login',
        'POST /auth/logout': 'User logout',
        'POST /auth/refresh': 'Refresh access token',
        'POST /auth/forgot-password': 'Request password reset',
        'POST /auth/reset-password': 'Reset password with token',
      },
      users: {
        'GET /users/profile': 'Get user profile',
        'PUT /users/profile': 'Update user profile',
        'DELETE /users/account': 'Delete user account',
        'GET /users/preferences': 'Get user preferences',
        'PUT /users/preferences': 'Update user preferences',
      },
      content: {
        'POST /content/generate': 'Generate AI content',
        'GET /content/history': 'Get content generation history',
        'POST /content/save': 'Save generated content',
        'GET /content/templates': 'Get content templates',
        'POST /content/schedule': 'Schedule content posting',
      },
      products: {
        'GET /products': 'Get user products',
        'POST /products': 'Create new product',
        'GET /products/:id': 'Get product details',
        'PUT /products/:id': 'Update product',
        'DELETE /products/:id': 'Delete product',
        'POST /products/sync': 'Sync with e-commerce platforms',
      },
      analytics: {
        'GET /analytics/overview': 'Get analytics overview',
        'GET /analytics/content': 'Get content analytics',
        'GET /analytics/products': 'Get product analytics',
        'GET /analytics/revenue': 'Get revenue analytics',
        'POST /analytics/track': 'Track custom event',
      },
      payments: {
        'POST /payments/create-intent': 'Create payment intent',
        'POST /payments/create-subscription': 'Create subscription',
        'GET /payments/methods': 'Get payment methods',
        'POST /payments/setup-intent': 'Create setup intent',
        'GET /payments/subscriptions': 'Get user subscriptions',
      }
    },
    authentication: 'Bearer token required for most endpoints',
    rateLimit: `${process.env.RATE_LIMIT_MAX_REQUESTS || 100} requests per ${(parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000) / 60000} minutes`,
  });
});

// ==============================================
// 404 HANDLER
// ==============================================
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The requested endpoint ${req.method} ${req.originalUrl} was not found`,
    availableEndpoints: `${req.protocol}://${req.get('host')}${apiPrefix}/docs`
  });
});

// ==============================================
// ERROR HANDLING MIDDLEWARE
// ==============================================
app.use(errorHandler);

// ==============================================
// SERVER STARTUP
// ==============================================
async function startServer() {
  try {
    // Initialize database connections
    await connectDatabase();
    logger.info('Database connected successfully');

    // Initialize Firebase Admin
    await initializeFirebase();
    logger.info('Firebase Admin initialized');

    // Initialize external services
    await initializeServices();
    logger.info('External services initialized');

    // Start the server
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Kingdom Studios API server running on port ${PORT}`);
      logger.info(`📖 API Documentation: http://localhost:${PORT}${apiPrefix}/docs`);
      logger.info(`💚 Health Check: http://localhost:${PORT}/health`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Graceful shutdown handling
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, shutting down gracefully');
      server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT received, shutting down gracefully');
      server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception thrown:', error);
  process.exit(1);
});

// Start the server
startServer();

export default app;

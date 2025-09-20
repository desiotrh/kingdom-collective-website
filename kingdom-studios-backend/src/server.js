import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Import enterprise infrastructure
import EnterpriseScaleInfrastructure from './services/EnterpriseScaleInfrastructure.js';
import EnterpriseDatabaseOptimizer from './services/EnterpriseDatabaseOptimizer.js';

// Import monitoring services
import { router as monitoringRoutes, monitoringDashboard, analyticsEngine, performanceMonitoring } from './routes/enterpriseMonitoring.js';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import contentRoutes from './routes/content.js';
import productRoutes from './routes/products.js';
import analyticsRoutes from './routes/analytics.js';
import paymentRoutes from './routes/payments.js';
import webhookRoutes, { stripeWebhookHandler } from './routes/webhooks.js';
import adminRoutes from './routes/admin.js';
import enterpriseContentRoutes, { initializeEnterpriseContentService } from './routes/enterpriseContent.js';
import facebookRoutes from './routes/facebook.js';

// Import unified API routes
import unifiedApiRoutes from './routes/unifiedApi.js';
import pdfRoutes from './routes/pdf.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { 
  createAdvancedRateLimit,
  createSlowDown,
  createTimeoutMiddleware,
  createDeduplicationMiddleware,
  createMetricsMiddleware,
  createSecurityMiddleware,
  createValidationMiddleware,
  createCorsConfig
} from './middleware/enterpriseMiddleware.js';
import { logger } from './utils/logger.js';
import { connectDatabase, initializeFirebase, initializeServices, getDatabaseStatus, getDatabaseStats } from './config/database.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize enterprise infrastructure
const enterpriseInfra = new EnterpriseScaleInfrastructure();
const dbOptimizer = new EnterpriseDatabaseOptimizer();

// Initialize enterprise middleware
const rateLimiters = createAdvancedRateLimit();
const slowDown = createSlowDown();
const timeoutMiddleware = createTimeoutMiddleware();
const deduplicationMiddleware = createDeduplicationMiddleware();
const metricsMiddleware = createMetricsMiddleware();
const securityMiddleware = createSecurityMiddleware();
const validationMiddleware = createValidationMiddleware();
const corsConfig = createCorsConfig();

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

// Enterprise security middleware
app.use(securityMiddleware);

// Request timeout middleware
app.use(timeoutMiddleware);

// CORS configuration with enterprise settings
app.use(cors(corsConfig));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined', { 
  stream: { write: (message) => logger.info(message.trim()) }
}));

// Enterprise metrics middleware
app.use(metricsMiddleware.middleware);

// Enterprise slow down middleware
app.use(slowDown);

// Rate limiting with enterprise configuration
app.use('/api/auth', rateLimiters.authLimiter);
app.use('/api/', rateLimiters.apiLimiter);

// Request validation middleware
app.use(validationMiddleware);

// Request deduplication middleware
app.use(deduplicationMiddleware);

// Stripe webhook requires raw body for signature verification
app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), stripeWebhookHandler);

// Body parsing middleware (must come after raw webhook route above)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ==============================================
// HEALTH CHECK ENDPOINT
// ==============================================
app.get('/health', async (req, res) => {
  const dbStats = getDatabaseStats();
  const enterpriseMetrics = enterpriseInfra.getMetrics();
  const dbOptimizerStats = await dbOptimizer.getDatabaseStats();
  const requestMetrics = metricsMiddleware.getMetrics();
  
  res.status(200).json({
    status: 'OK',
    message: 'Kingdom Studios API is running',
    version: process.env.API_VERSION || 'v1',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: dbStats,
    enterpriseMetrics: enterpriseMetrics,
    dbOptimizer: dbOptimizerStats,
    requestMetrics: requestMetrics,
    memoryUsage: {
      rss: Math.round(process.memoryUsage().rss / 1024 / 1024) + 'MB',
      heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
      heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB'
    },
    services: {
      auth: 'active',
      content: 'active',
      analytics: 'active',
      enterpriseInfra: 'active',
      dbOptimizer: 'active',
      enterpriseContent: 'active'
    }
  });
});

// ==============================================
// ENTERPRISE METRICS ENDPOINT
// ==============================================
app.get('/metrics', async (req, res) => {
  try {
    const metrics = {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      requests: metricsMiddleware.getMetrics(),
      infrastructure: enterpriseInfra.getMetrics(),
      database: await dbOptimizer.getDatabaseStats(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      environment: process.env.NODE_ENV
    };

    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    logger.error('Failed to get metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve metrics'
    });
  }
});

// ==============================================
// API ROUTES
// ==============================================
const apiPrefix = `/api/${process.env.API_VERSION || 'v1'}`;

app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/users`, userRoutes);
app.use(`${apiPrefix}/content`, contentRoutes);
app.use(`${apiPrefix}/enterprise-content`, enterpriseContentRoutes);
app.use(`${apiPrefix}/products`, productRoutes);
app.use(`${apiPrefix}/analytics`, analyticsRoutes);
app.use(`${apiPrefix}/payments`, paymentRoutes);
app.use(`${apiPrefix}/admin`, adminRoutes);
app.use(`${apiPrefix}/facebook`, facebookRoutes);

// Unified API routes for all Kingdom apps
app.use(`${apiPrefix}/unified`, unifiedApiRoutes);

// PDF service routes for Kingdom Stand
app.use(`${apiPrefix}/pdf`, pdfRoutes);

// Enterprise monitoring routes
app.use(`${apiPrefix}/monitoring`, monitoringRoutes);

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
      },
      pdf: {
        'POST /pdf/convert': 'Convert documents to PDF format',
        'POST /pdf/merge': 'Merge multiple PDFs into one',
        'POST /pdf/ocr': 'Extract text from PDFs using OCR',
        'POST /pdf/stamp': 'Add stamps or watermarks to PDFs',
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
    // Initialize enterprise database optimizer first
    await dbOptimizer.initialize();
    logger.info('Enterprise database optimizer initialized');

    // Initialize database connections
    await connectDatabase();
    logger.info('Database connected successfully');

    // Initialize enterprise scale infrastructure
    await enterpriseInfra.initialize(app);
    logger.info('Enterprise scale infrastructure initialized');

    // Initialize enterprise content service
    initializeEnterpriseContentService(enterpriseInfra);
    logger.info('Enterprise content service initialized');

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

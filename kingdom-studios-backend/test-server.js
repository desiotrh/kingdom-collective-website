/**
 * Test Server for Performance Testing
 * Simplified version without MongoDB dependency
 */

import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import helmet from 'helmet';

const app = express();
const PORT = process.env.TEST_PORT || 3000;

// Basic middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Basic rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP'
});
app.use('/api/', limiter);

// Simulated database for testing
const mockDatabase = {
  users: [],
  content: [],
  metrics: {
    requests: 0,
    errors: 0,
    startTime: Date.now()
  }
};

// Health endpoint
app.get('/health', (req, res) => {
  mockDatabase.metrics.requests++;
  
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.floor((Date.now() - mockDatabase.metrics.startTime) / 1000),
    environment: process.env.NODE_ENV || 'test',
    version: '1.0.0',
    database: {
      status: 'connected',
      type: 'mock'
    },
    services: {
      api: 'running',
      cache: 'running',
      queue: 'running'
    },
    metrics: {
      totalRequests: mockDatabase.metrics.requests,
      totalErrors: mockDatabase.metrics.errors,
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage()
    }
  });
});

// Metrics endpoint
app.get('/metrics', (req, res) => {
  mockDatabase.metrics.requests++;
  
  res.json({
    timestamp: new Date().toISOString(),
    uptime: Math.floor((Date.now() - mockDatabase.metrics.startTime) / 1000),
    requests: mockDatabase.metrics.requests,
    errors: mockDatabase.metrics.errors,
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    system: {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      pid: process.pid
    }
  });
});

// Enterprise content endpoints for testing
app.get('/api/v1/enterprise-content/templates', (req, res) => {
  mockDatabase.metrics.requests++;
  
  // Simulate some processing time
  setTimeout(() => {
    res.json({
      templates: [
        {
          id: '1',
          name: 'Performance Test Template',
          category: 'test',
          performance: 'optimized'
        },
        {
          id: '2',
          name: 'Load Test Template',
          category: 'load',
          performance: 'enterprise'
        }
      ],
      total: 2,
      page: 1,
      timestamp: new Date().toISOString()
    });
  }, Math.random() * 100); // Random 0-100ms delay
});

app.post('/api/v1/enterprise-content/generate', (req, res) => {
  mockDatabase.metrics.requests++;
  
  // Simulate content generation processing
  setTimeout(() => {
    res.json({
      id: `content_${Date.now()}`,
      content: 'Generated test content for performance testing',
      timestamp: new Date().toISOString(),
      processingTime: Math.random() * 1000 + 500, // 500-1500ms
      cached: Math.random() > 0.5
    });
  }, Math.random() * 200 + 100); // Random 100-300ms delay
});

// Batch processing endpoint
app.post('/api/v1/enterprise-content/batch', (req, res) => {
  mockDatabase.metrics.requests++;
  const { items = [] } = req.body;
  
  // Simulate batch processing
  setTimeout(() => {
    res.json({
      batchId: `batch_${Date.now()}`,
      items: items.map((item, index) => ({
        id: `item_${index}`,
        status: 'processed',
        result: `Batch result for ${item.name || item.id || index}`
      })),
      total: items.length,
      timestamp: new Date().toISOString(),
      processingTime: items.length * 50 + Math.random() * 100
    });
  }, Math.max(items.length * 10, 50)); // Scale with batch size
});

// Stats endpoint
app.get('/api/v1/enterprise-content/stats', (req, res) => {
  mockDatabase.metrics.requests++;
  
  res.json({
    totalContent: mockDatabase.content.length,
    totalRequests: mockDatabase.metrics.requests,
    totalErrors: mockDatabase.metrics.errors,
    uptime: Math.floor((Date.now() - mockDatabase.metrics.startTime) / 1000),
    performance: {
      avgResponseTime: Math.random() * 100 + 50,
      successRate: 99.5,
      throughput: mockDatabase.metrics.requests / Math.max((Date.now() - mockDatabase.metrics.startTime) / 1000, 1)
    },
    timestamp: new Date().toISOString()
  });
});

// Admin cache management
app.post('/api/v1/enterprise-content/admin/cache/clear', (req, res) => {
  mockDatabase.metrics.requests++;
  
  res.json({
    message: 'Cache cleared successfully (simulated)',
    timestamp: new Date().toISOString(),
    itemsCleared: Math.floor(Math.random() * 1000)
  });
});

// Error simulation endpoint for testing error handling
app.get('/api/test/error', (req, res) => {
  mockDatabase.metrics.requests++;
  mockDatabase.metrics.errors++;
  
  res.status(500).json({
    error: 'Simulated error for testing',
    timestamp: new Date().toISOString()
  });
});

// Slow endpoint for testing timeouts
app.get('/api/test/slow', (req, res) => {
  mockDatabase.metrics.requests++;
  const delay = parseInt(req.query.delay) || 5000;
  
  setTimeout(() => {
    res.json({
      message: 'Slow response completed',
      delay: delay,
      timestamp: new Date().toISOString()
    });
  }, delay);
});

// 404 handler
app.use('*', (req, res) => {
  mockDatabase.metrics.errors++;
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

// Error handler
app.use((err, req, res, next) => {
  mockDatabase.metrics.errors++;
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Test Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📈 Metrics: http://localhost:${PORT}/metrics`);
  console.log(`🧪 Ready for performance testing!`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;

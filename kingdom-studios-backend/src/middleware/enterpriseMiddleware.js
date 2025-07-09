/**
 * Enterprise Middleware for Kingdom Studios Backend
 * Advanced middleware for 10K-100K+ concurrent users
 */

import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import timeout from 'express-timeout-handler';
import { logger } from '../utils/logger.js';

/**
 * Advanced rate limiting with multiple tiers
 */
export const createAdvancedRateLimit = () => {
  // Strict rate limiting for auth endpoints
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs for auth
    message: {
      error: 'Too many authentication attempts, please try again later.',
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      retryAfter: 15 * 60 // 15 minutes
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      // Use IP + user agent for more specific limiting
      return req.ip + ':' + (req.headers['user-agent'] || 'unknown');
    },
    handler: (req, res) => {
      logger.warn('Auth rate limit exceeded:', {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        endpoint: req.path
      });
      res.status(429).json({
        error: 'Too many authentication attempts, please try again later.',
        code: 'AUTH_RATE_LIMIT_EXCEEDED',
        retryAfter: 15 * 60
      });
    }
  });

  // General API rate limiting
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 1000 requests per windowMs
    message: {
      error: 'API rate limit exceeded, please try again later.',
      code: 'API_RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Skip rate limiting for health checks
      return req.path === '/health';
    }
  });

  // Content generation rate limiting (more strict)
  const contentLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 50, // limit each IP to 50 content generations per 5 minutes
    message: {
      error: 'Content generation rate limit exceeded.',
      code: 'CONTENT_RATE_LIMIT_EXCEEDED',
      retryAfter: 5 * 60
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      // Use user ID if authenticated, otherwise IP
      return req.user?.id || req.ip;
    }
  });

  return {
    authLimiter,
    apiLimiter,
    contentLimiter
  };
};

/**
 * Progressive slow down middleware
 */
export const createSlowDown = () => {
  return slowDown({
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 500, // allow 500 requests per 15 minutes without delay
    delayMs: () => 100, // add 100ms delay per request after delayAfter
    maxDelayMs: 2000, // max delay of 2 seconds
    skipFailedRequests: true,
    skipSuccessfulRequests: false,
    validate: { delayMs: false }, // Disable deprecation warning
    handler: (req, res, next, options) => {
      logger.info('Slow down limit reached:', {
        ip: req.ip,
        path: req.path,
        delay: options.delay
      });
      next();
    }
  });
};

/**
 * Request timeout middleware
 */
export const createTimeoutMiddleware = () => {
  return timeout.handler({
    timeout: 30000, // 30 seconds
    onTimeout: (req, res) => {
      logger.error('Request timeout:', {
        ip: req.ip,
        method: req.method,
        path: req.path,
        userAgent: req.headers['user-agent']
      });
      
      res.status(504).json({
        error: 'Request timeout',
        message: 'The request took too long to process',
        code: 'REQUEST_TIMEOUT'
      });
    },
    onDelayedResponse: (req, method, args, requestTime) => {
      logger.warn('Delayed response detected:', {
        method,
        requestTime,
        path: req.path
      });
    }
  });
};

/**
 * Request deduplication middleware
 */
export const createDeduplicationMiddleware = () => {
  const activeRequests = new Map();

  return async (req, res, next) => {
    // Only deduplicate GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const requestKey = generateRequestKey(req);
    const existingRequest = activeRequests.get(requestKey);

    if (existingRequest) {
      logger.info('Deduplicating request:', requestKey);
      
      try {
        const result = await existingRequest;
        return res.json(result);
      } catch (error) {
        // If existing request failed, continue with new request
        activeRequests.delete(requestKey);
      }
    }

    // Wrap the response in a promise for future deduplication
    const requestPromise = new Promise((resolve, reject) => {
      const originalSend = res.send;
      const originalJson = res.json;
      
      res.send = function(data) {
        activeRequests.delete(requestKey);
        resolve(data);
        return originalSend.call(this, data);
      };
      
      res.json = function(data) {
        activeRequests.delete(requestKey);
        resolve(data);
        return originalJson.call(this, data);
      };

      // Handle errors
      res.on('error', (error) => {
        activeRequests.delete(requestKey);
        reject(error);
      });

      // Clean up after response
      res.on('finish', () => {
        setTimeout(() => {
          activeRequests.delete(requestKey);
        }, 5000); // Clean up after 5 seconds
      });
    });

    activeRequests.set(requestKey, requestPromise);
    next();
  };
};

/**
 * Generate unique request key for deduplication
 */
function generateRequestKey(req) {
  const { method, path, query } = req;
  const userId = req.user?.id || req.ip;
  const queryString = JSON.stringify(query);
  
  return `${method}:${path}:${userId}:${queryString}`;
}

/**
 * Request metrics middleware
 */
export const createMetricsMiddleware = () => {
  const metrics = {
    totalRequests: 0,
    activeRequests: 0,
    errorRequests: 0,
    averageResponseTime: 0,
    endpoints: new Map()
  };

  return {
    middleware: (req, res, next) => {
      const startTime = Date.now();
      metrics.totalRequests++;
      metrics.activeRequests++;

      const endpoint = `${req.method} ${req.route?.path || req.path}`;
      
      if (!metrics.endpoints.has(endpoint)) {
        metrics.endpoints.set(endpoint, {
          count: 0,
          totalTime: 0,
          errors: 0
        });
      }

      const endpointMetrics = metrics.endpoints.get(endpoint);
      endpointMetrics.count++;

      res.on('finish', () => {
        metrics.activeRequests--;
        const duration = Date.now() - startTime;
        
        // Update average response time
        const currentAvg = metrics.averageResponseTime;
        const totalRequests = metrics.totalRequests;
        metrics.averageResponseTime = 
          ((currentAvg * (totalRequests - 1)) + duration) / totalRequests;

        // Update endpoint metrics
        endpointMetrics.totalTime += duration;
        
        if (res.statusCode >= 400) {
          metrics.errorRequests++;
          endpointMetrics.errors++;
        }

        // Log slow requests
        if (duration > 1000) {
          logger.warn('Slow request detected:', {
            endpoint,
            duration: duration + 'ms',
            statusCode: res.statusCode
          });
        }
      });

      next();
    },
    getMetrics: () => {
      const endpointStats = {};
      for (const [endpoint, stats] of metrics.endpoints) {
        endpointStats[endpoint] = {
          ...stats,
          averageTime: stats.count > 0 ? Math.round(stats.totalTime / stats.count) : 0,
          errorRate: stats.count > 0 ? Math.round((stats.errors / stats.count) * 100) : 0
        };
      }

      return {
        ...metrics,
        endpoints: endpointStats,
        errorRate: metrics.totalRequests > 0 ? 
          Math.round((metrics.errorRequests / metrics.totalRequests) * 100) : 0
      };
    }
  };
};

/**
 * Security headers middleware
 */
export const createSecurityMiddleware = () => {
  return (req, res, next) => {
    // Additional security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    
    // API-specific headers
    res.setHeader('X-API-Version', process.env.API_VERSION || 'v1');
    res.setHeader('X-Response-Time', Date.now().toString());
    
    next();
  };
};

/**
 * Request validation middleware
 */
export const createValidationMiddleware = () => {
  return (req, res, next) => {
    // Validate content type for POST/PUT requests
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      const contentType = req.headers['content-type'];
      
      if (!contentType || !contentType.includes('application/json')) {
        return res.status(400).json({
          error: 'Invalid content type',
          message: 'Content-Type must be application/json',
          code: 'INVALID_CONTENT_TYPE'
        });
      }
    }

    // Validate request size
    const contentLength = req.headers['content-length'];
    if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) { // 10MB
      return res.status(413).json({
        error: 'Request too large',
        message: 'Request body exceeds maximum size of 10MB',
        code: 'REQUEST_TOO_LARGE'
      });
    }

    next();
  };
};

/**
 * CORS configuration for enterprise scale
 */
export const createCorsConfig = () => {
  const allowedOrigins = process.env.NODE_ENV === 'production' 
    ? [
        'https://kingdom-studios.app',
        'https://app.kingdom-studios.app',
        'https://admin.kingdom-studios.app'
      ]
    : [
        'http://localhost:8081',
        'http://localhost:3000',
        'http://localhost:19006', // Expo dev server
        'exp://localhost:8081' // Expo client
      ];

  return {
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn('CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS policy'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-API-Key',
      'X-Requested-With',
      'Accept',
      'Origin'
    ],
    exposedHeaders: [
      'X-Total-Count',
      'X-Page-Count',
      'X-Current-Page',
      'X-API-Version',
      'X-Response-Time'
    ],
    maxAge: 86400 // 24 hours
  };
};

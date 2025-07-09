/**
 * Enterprise Content Routes
 * Optimized routes for high-scale content generation
 */

import express from 'express';
import { body, query, validationResult } from 'express-validator';
import EnterpriseContentService from '../services/EnterpriseContentService.js';
import { createAdvancedRateLimit } from '../middleware/enterpriseMiddleware.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Initialize enterprise content service
let enterpriseContentService = null;

// Initialize the service with enterprise infrastructure
export const initializeEnterpriseContentService = (enterpriseInfra) => {
  enterpriseContentService = new EnterpriseContentService(enterpriseInfra);
  logger.info('✅ Enterprise Content Service initialized');
};

// Rate limiters
const rateLimiters = createAdvancedRateLimit();

// Validation middleware
const validateContentGeneration = [
  body('type')
    .isIn(['social-post', 'blog-outline', 'video-script', 'devotional', 'product-description', 'email-sequence'])
    .withMessage('Invalid content type'),
  body('prompt')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Prompt must be between 10 and 1000 characters'),
  body('customizations')
    .optional()
    .isObject()
    .withMessage('Customizations must be an object'),
  body('priority')
    .optional()
    .isIn(['high', 'standard', 'low'])
    .withMessage('Invalid priority level')
];

const validateBatchGeneration = [
  body('requests')
    .isArray({ min: 1, max: 10 })
    .withMessage('Requests must be an array with 1-10 items'),
  body('requests.*.type')
    .isIn(['social-post', 'blog-outline', 'video-script', 'devotional', 'product-description', 'email-sequence'])
    .withMessage('Invalid content type in request'),
  body('requests.*.prompt')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Each prompt must be between 10 and 1000 characters')
];

/**
 * @route POST /api/v1/content/generate
 * @desc Generate AI content with enterprise optimizations
 * @access Private
 */
router.post('/generate', 
  rateLimiters.contentLimiter,
  validateContentGeneration,
  async (req, res) => {
    try {
      // Check validation results
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      if (!enterpriseContentService) {
        return res.status(503).json({
          success: false,
          message: 'Content generation service not available',
          code: 'SERVICE_UNAVAILABLE'
        });
      }

      const {
        type,
        prompt,
        customizations = {},
        priority = 'standard'
      } = req.body;

      const userId = req.user?.id;
      const startTime = Date.now();

      logger.info('Content generation request:', {
        type,
        userId,
        priority,
        promptLength: prompt.length
      });

      const result = await enterpriseContentService.generateContent({
        type,
        prompt,
        userId,
        customizations,
        priority
      });

      const duration = Date.now() - startTime;

      logger.info('Content generation completed:', {
        type,
        userId,
        duration: duration + 'ms',
        success: result.success
      });

      res.json({
        success: true,
        data: result,
        metadata: {
          requestId: req.id,
          duration: duration + 'ms',
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      logger.error('Content generation error:', {
        error: error.message,
        userId: req.user?.id,
        type: req.body?.type
      });

      // Handle specific error types
      if (error.message.includes('rate limit')) {
        return res.status(429).json({
          success: false,
          message: error.message,
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: 60
        });
      }

      if (error.message.includes('quota exceeded')) {
        return res.status(503).json({
          success: false,
          message: 'Content generation temporarily unavailable',
          code: 'QUOTA_EXCEEDED'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Content generation failed',
        code: 'GENERATION_ERROR'
      });
    }
  }
);

/**
 * @route POST /api/v1/content/generate-batch
 * @desc Generate multiple pieces of content in batch
 * @access Private
 */
router.post('/generate-batch',
  rateLimiters.contentLimiter,
  validateBatchGeneration,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      if (!enterpriseContentService) {
        return res.status(503).json({
          success: false,
          message: 'Content generation service not available'
        });
      }

      const { requests } = req.body;
      const userId = req.user?.id;
      const startTime = Date.now();

      logger.info('Batch content generation request:', {
        requestCount: requests.length,
        userId
      });

      // Add userId to each request
      const enhancedRequests = requests.map(request => ({
        ...request,
        userId,
        priority: request.priority || 'standard'
      }));

      const results = await enterpriseContentService.generateBatchContent(enhancedRequests);
      const duration = Date.now() - startTime;

      // Process results
      const processedResults = results.map((result, index) => ({
        index,
        success: result.status === 'fulfilled',
        data: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason.message : null
      }));

      const successCount = processedResults.filter(r => r.success).length;

      logger.info('Batch content generation completed:', {
        requestCount: requests.length,
        successCount,
        duration: duration + 'ms',
        userId
      });

      res.json({
        success: true,
        data: processedResults,
        metadata: {
          requestId: req.id,
          totalRequests: requests.length,
          successfulRequests: successCount,
          duration: duration + 'ms',
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      logger.error('Batch content generation error:', {
        error: error.message,
        userId: req.user?.id
      });

      res.status(500).json({
        success: false,
        message: 'Batch content generation failed',
        code: 'BATCH_GENERATION_ERROR'
      });
    }
  }
);

/**
 * @route GET /api/v1/content/templates
 * @desc Get available content templates
 * @access Private
 */
router.get('/templates', async (req, res) => {
  try {
    if (!enterpriseContentService) {
      return res.status(503).json({
        success: false,
        message: 'Content service not available'
      });
    }

    const templates = enterpriseContentService.getContentTemplates();

    res.json({
      success: true,
      data: templates,
      metadata: {
        templateCount: Object.keys(templates).length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Error fetching templates:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch templates'
    });
  }
});

/**
 * @route GET /api/v1/content/stats
 * @desc Get content generation statistics
 * @access Private
 */
router.get('/stats', async (req, res) => {
  try {
    if (!enterpriseContentService) {
      return res.status(503).json({
        success: false,
        message: 'Content service not available'
      });
    }

    const stats = enterpriseContentService.getGenerationStats();

    res.json({
      success: true,
      data: stats,
      metadata: {
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Error fetching content stats:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});

/**
 * @route POST /api/v1/content/clear-cache
 * @desc Clear content generation caches (admin only)
 * @access Private (Admin)
 */
router.post('/clear-cache', async (req, res) => {
  try {
    // Check if user is admin (implement your admin check logic)
    if (!req.user?.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    if (!enterpriseContentService) {
      return res.status(503).json({
        success: false,
        message: 'Content service not available'
      });
    }

    enterpriseContentService.clearCaches();

    logger.info('Content caches cleared by admin:', {
      adminId: req.user.id,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Content caches cleared successfully'
    });

  } catch (error) {
    logger.error('Error clearing content cache:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to clear cache'
    });
  }
});

/**
 * @route GET /api/v1/content/health
 * @desc Health check for content generation service
 * @access Public
 */
router.get('/health', async (req, res) => {
  try {
    const isHealthy = !!enterpriseContentService;
    const stats = isHealthy ? enterpriseContentService.getGenerationStats() : null;

    res.json({
      success: true,
      status: isHealthy ? 'healthy' : 'unavailable',
      service: 'enterprise-content-generation',
      stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      status: 'error',
      service: 'enterprise-content-generation',
      error: error.message
    });
  }
});

export default router;

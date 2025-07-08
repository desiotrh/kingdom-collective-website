import express from 'express';
import OpenAI from 'openai';
import axios from 'axios';
import { rateLimit } from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';
import { isMockMode, MockDB } from '../config/database.js';
import Content from '../models/Content.js';

const router = express.Router();

// Initialize AI services
let openai = null;
let openrouterApiKey = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

if (process.env.OPENROUTER_API_KEY) {
  openrouterApiKey = process.env.OPENROUTER_API_KEY;
}

// Rate limiting for content generation
const contentGenerationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 50 : 100, // Limit content generation requests
  message: {
    error: 'Too many content generation requests. Please try again later.',
    code: 'CONTENT_GENERATION_RATE_LIMIT'
  }
});

// Content generation validation
const validateContentRequest = [
  body('type').isIn(['text', 'image', 'video']).withMessage('Invalid content type'),
  body('prompt').isLength({ min: 10, max: 2000 }).withMessage('Prompt must be 10-2000 characters'),
  body('faithMode').optional().isBoolean().withMessage('Faith mode must be boolean'),
  body('platform').optional().isString().withMessage('Platform must be string'),
  body('settings').optional().isObject().withMessage('Settings must be object'),
];

// ==============================================
// CONTENT GENERATION ENDPOINTS
// ==============================================

/**
 * POST /api/content/generate
 * Generate AI content based on user prompt
 */
router.post('/generate', 
  authenticateToken, 
  contentGenerationLimiter,
  validateContentRequest,
  async (req, res) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { type, prompt, faithMode = false, platform, settings = {} } = req.body;
      const userId = req.user.id;

      logger.info(`Content generation request: ${type} for user ${userId}`, {
        type,
        faithMode,
        platform,
        promptLength: prompt.length
      });

      // Generate content based on type
      let generatedContent;
      let metadata = {
        type,
        faithMode,
        platform,
        generationMethod: 'unknown',
        timestamp: Date.now(),
        userId
      };

      if (type === 'text') {
        const result = await generateTextContent(prompt, faithMode, platform, settings);
        generatedContent = result.content;
        metadata.generationMethod = result.method;
        metadata.wordCount = result.content.split(' ').length;
      } else if (type === 'image') {
        const result = await generateImageContent(prompt, faithMode, settings);
        generatedContent = result.content;
        metadata.generationMethod = result.method;
        metadata.imageSpecs = result.specs;
      } else if (type === 'video') {
        const result = await generateVideoContent(prompt, faithMode, platform, settings);
        generatedContent = result.content;
        metadata.generationMethod = result.method;
        metadata.scriptLength = result.content.length;
      }

      // TODO: Save to database
      const contentRecord = {
        id: `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        content: generatedContent,
        metadata,
        createdAt: new Date().toISOString(),
        userId
      };

      // Log analytics event
      logger.info('Content generated successfully', {
        userId,
        contentType: type,
        faithMode,
        platform,
        generationMethod: metadata.generationMethod
      });

      res.json({
        success: true,
        data: contentRecord,
        message: 'Content generated successfully'
      });

    } catch (error) {
      logger.error('Content generation failed', {
        error: error.message,
        stack: error.stack,
        userId: req.user?.id
      });

      res.status(500).json({
        success: false,
        error: 'Content generation failed',
        message: error.message
      });
    }
  }
);

/**
 * GET /api/content/history
 * Get user's content generation history
 */
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 20, offset = 0, type } = req.query;

    // TODO: Implement database query
    // For now, return mock data
    const mockHistory = Array.from({ length: Math.min(limit, 10) }, (_, i) => ({
      id: `content_${Date.now() - i * 1000}_${Math.random().toString(36).substr(2, 9)}`,
      type: type || 'text',
      content: `Mock generated content ${i + 1}`,
      metadata: {
        type: type || 'text',
        faithMode: Math.random() > 0.5,
        generationMethod: 'mock',
        timestamp: Date.now() - i * 1000
      },
      createdAt: new Date(Date.now() - i * 1000).toISOString(),
      userId
    }));

    res.json({
      success: true,
      data: mockHistory,
      message: 'Content history retrieved successfully'
    });

  } catch (error) {
    logger.error('Failed to retrieve content history', {
      error: error.message,
      userId: req.user?.id
    });

    res.status(500).json({
      success: false,
      error: 'Failed to retrieve content history'
    });
  }
});

/**
 * DELETE /api/content/:contentId
 * Delete generated content
 */
router.delete('/:contentId', authenticateToken, async (req, res) => {
  try {
    const { contentId } = req.params;
    const userId = req.user.id;

    // TODO: Implement database deletion
    logger.info('Content deletion requested', { contentId, userId });

    res.json({
      success: true,
      message: 'Content deleted successfully'
    });

  } catch (error) {
    logger.error('Failed to delete content', {
      error: error.message,
      contentId: req.params.contentId,
      userId: req.user?.id
    });

    res.status(500).json({
      success: false,
      error: 'Failed to delete content'
    });
  }
});

// ==============================================
// CONTENT GENERATION HELPERS
// ==============================================

async function generateTextContent(prompt, faithMode, platform, settings) {
  // Build system prompt based on faith mode and platform
  const systemPrompt = buildSystemPrompt('text', faithMode, platform);
  
  try {
    // Try OpenAI first
    if (openai) {
      const completion = await openai.chat.completions.create({
        model: settings.model || 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: settings.maxTokens || 1000,
        temperature: settings.temperature || 0.7,
      });

      return {
        content: completion.choices[0]?.message?.content || 'Generation failed',
        method: 'openai'
      };
    }
    
    // Try OpenRouter as fallback
    if (openrouterApiKey) {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: settings.model || 'anthropic/claude-3-haiku',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          max_tokens: settings.maxTokens || 1000,
          temperature: settings.temperature || 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${openrouterApiKey}`,
            'HTTP-Referer': process.env.API_BASE_URL || 'http://localhost:3000',
            'X-Title': 'Kingdom Studios API',
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        content: response.data.choices[0]?.message?.content || 'Generation failed',
        method: 'openrouter'
      };
    }

    // Return mock content if no AI services available
    return {
      content: generateMockContent('text', faithMode, platform),
      method: 'mock'
    };

  } catch (error) {
    logger.error('AI service error', { error: error.message });
    
    // Return mock content as fallback
    return {
      content: generateMockContent('text', faithMode, platform),
      method: 'fallback'
    };
  }
}

async function generateImageContent(prompt, faithMode, settings) {
  try {
    // For now, return a mock image generation response
    // In a real implementation, this would call DALL-E, Midjourney, or Stable Diffusion
    
    return {
      content: JSON.stringify({
        imageUrl: 'https://via.placeholder.com/1024x1024?text=Generated+Image',
        prompt: prompt,
        style: faithMode ? 'inspirational' : 'professional',
        dimensions: settings.dimensions || '1024x1024'
      }),
      method: 'mock',
      specs: {
        dimensions: settings.dimensions || '1024x1024',
        style: faithMode ? 'inspirational' : 'professional'
      }
    };

  } catch (error) {
    logger.error('Image generation error', { error: error.message });
    throw error;
  }
}

async function generateVideoContent(prompt, faithMode, platform, settings) {
  try {
    // Generate video script content
    const scriptPrompt = `Create a detailed video script for: ${prompt}
Platform: ${platform || 'general'}
Faith Mode: ${faithMode ? 'Include biblical principles and Kingdom perspective' : 'Use general business approach'}

Please format as a proper video script with:
- Hook/Intro
- Main content points
- Call to action
- Estimated duration`;

    const textResult = await generateTextContent(scriptPrompt, faithMode, platform, settings);
    
    return {
      content: textResult.content,
      method: textResult.method
    };

  } catch (error) {
    logger.error('Video content generation error', { error: error.message });
    throw error;
  }
}

function buildSystemPrompt(contentType, faithMode, platform) {
  const basePersonality = faithMode 
    ? "You are a Kingdom-minded creative assistant helping Christians build businesses that honor God and advance His Kingdom. Include relevant biblical wisdom and Kingdom business principles."
    : "You are a professional creative assistant helping entrepreneurs build successful businesses. Focus on proven strategies and best practices.";

  const platformGuidance = platform ? `\nOptimize content for ${platform} platform requirements and best practices.` : '';

  const contentTypeInstructions = {
    text: "Create engaging, actionable content that provides real value to the reader.",
    image: "Describe visual concepts that would create compelling, professional imagery.",
    video: "Structure content for video format with clear segments and engaging flow."
  };

  return `${basePersonality}${platformGuidance}\n\n${contentTypeInstructions[contentType] || contentTypeInstructions.text}`;
}

function generateMockContent(type, faithMode, platform) {
  const mockTemplates = {
    text: {
      faith: `🙏 **Walking in Divine Purpose**\n\nAs Kingdom entrepreneurs, we're called to build businesses that reflect God's character and advance His purposes. Here's how to align your business with biblical principles:\n\n✨ **Stewardship Over Ownership**: Remember that everything belongs to God - we're simply stewards of the resources He's entrusted to us.\n\n💎 **Excellence as Worship**: "Whatever you do, work at it with all your heart, as working for the Lord" (Colossians 3:23)\n\n🤝 **Serving Others**: True Kingdom business is about creating value for others, not just profit for ourselves.\n\n*This is mock content generated for development. Configure your AI service for personalized generation.*`,
      
      business: `🚀 **Building Your Business Empire**\n\nSuccess in business isn't just about having a great idea - it's about execution, persistence, and strategic thinking. Here's your roadmap to sustainable growth:\n\n📊 **Data-Driven Decisions**: Use analytics to guide your strategy, not gut feelings alone.\n\n🎯 **Customer-Centric Approach**: Your customers' success is your success. Focus on solving real problems.\n\n⚡ **Rapid Iteration**: Test fast, fail fast, learn fast. Speed beats perfection in today's market.\n\n*This is mock content generated for development. Configure your AI service for personalized generation.*`
    }
  };

  const template = faithMode ? mockTemplates.text.faith : mockTemplates.text.business;
  return `${template}\n\nPlatform: ${platform || 'General'}\nGenerated: ${new Date().toLocaleString()}`;
}

export default router;

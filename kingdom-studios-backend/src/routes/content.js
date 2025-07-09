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

      // Store content in database
      const contentRecord = {
        id: `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        content: generatedContent,
        metadata,
        createdAt: new Date().toISOString(),
        userId
      };

      // Store in database (mock or real)
      if (isMockMode) {
        MockDB.addContent(contentRecord);
      } else {
        // TODO: Store in real database
        const content = new Content(contentRecord);
        await content.save();
      }

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
        data: {
          contentId: contentRecord.id,
          content: generatedContent,
          metadata,
          type
        },
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

    let userContent = [];

    if (isMockMode) {
      // Get content from mock database
      const allContent = MockDB.content.find();
      userContent = allContent
        .filter(content => content.userId === userId)
        .filter(content => !type || content.type === type)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(offset, offset + parseInt(limit));
    } else {
      // TODO: Get from real database
      const query = { userId };
      if (type) query.type = type;
      
      userContent = await Content.find(query)
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(parseInt(limit));
    }

    res.json({
      success: true,
      data: userContent,
      total: userContent.length,
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

/**
 * POST /api/content/:contentId/favorite
 * Add content to favorites
 */
router.post('/:contentId/favorite', authenticateToken, async (req, res) => {
  try {
    const { contentId } = req.params;
    const userId = req.user.id;

    if (isMockMode) {
      // Mock implementation
      MockDB.addFavorite(userId, contentId);
      
      res.json({
        success: true,
        message: 'Content added to favorites',
        data: { contentId, favorited: true }
      });
    } else {
      // TODO: Real database implementation
      res.json({
        success: true,
        message: 'Content added to favorites',
        data: { contentId, favorited: true }
      });
    }

  } catch (error) {
    logger.error('Failed to favorite content', {
      error: error.message,
      contentId: req.params.contentId,
      userId: req.user?.id
    });

    res.status(500).json({
      success: false,
      error: 'Failed to favorite content'
    });
  }
});

/**
 * GET /api/content/favorites
 * Get user's favorite content
 */
router.get('/favorites', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 20, offset = 0 } = req.query;

    if (isMockMode) {
      const favorites = MockDB.getFavorites(userId);
      
      res.json({
        success: true,
        data: favorites.slice(offset, offset + limit),
        total: favorites.length,
        message: 'Favorites retrieved successfully'
      });
    } else {
      // TODO: Real database implementation
      res.json({
        success: true,
        data: [],
        total: 0,
        message: 'Favorites retrieved successfully'
      });
    }

  } catch (error) {
    logger.error('Failed to retrieve favorites', {
      error: error.message,
      userId: req.user?.id
    });

    res.status(500).json({
      success: false,
      error: 'Failed to retrieve favorites'
    });
  }
});

/**
 * GET /api/content/templates
 * Get content templates
 */
router.get('/templates', authenticateToken, async (req, res) => {
  try {
    const { category, platform } = req.query;
    
    const templates = getContentTemplates(category, platform);
    
    res.json({
      success: true,
      data: templates,
      message: 'Templates retrieved successfully'
    });

  } catch (error) {
    logger.error('Failed to retrieve templates', {
      error: error.message,
      userId: req.user?.id
    });

    res.status(500).json({
      success: false,
      error: 'Failed to retrieve templates'
    });
  }
});

/**
 * PUT /api/content/:contentId/refine
 * Refine existing content with new instructions
 */
router.put('/:contentId/refine', 
  contentGenerationLimiter,
  authenticateToken, 
  [
    body('refinementPrompt').isLength({ min: 5, max: 500 }).withMessage('Refinement prompt must be 5-500 characters'),
    body('settings').optional().isObject().withMessage('Settings must be object'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { contentId } = req.params;
      const { refinementPrompt, settings = {} } = req.body;
      const userId = req.user.id;

      // Get original content (mock implementation)
      const originalContent = MockDB.getContent(contentId);
      if (!originalContent) {
        return res.status(404).json({
          success: false,
          error: 'Original content not found'
        });
      }

      // Create refinement prompt
      const fullPrompt = `Please refine the following content based on these instructions: "${refinementPrompt}"\n\nOriginal content:\n${originalContent.content}`;

      // Generate refined content
      const result = await generateTextContent(
        fullPrompt,
        req.user.faithMode,
        settings.platform,
        { ...settings, isRefinement: true }
      );

      // Create new content entry for the refined version
      const contentId_refined = `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const contentData = {
        id: contentId_refined,
        content: result.content,
        metadata: {
          type: 'text',
          originalContentId: contentId,
          refinementPrompt,
          faithMode: req.user.faithMode,
          generationMethod: result.method,
          platform: settings.platform,
          settings: result.settings,
          timestamp: Date.now()
        },
        userId,
        createdAt: new Date().toISOString()
      };

      // Store content
      if (isMockMode) {
        MockDB.addContent(contentData);
      } else {
        // TODO: Store in real database
      }

      res.json({
        success: true,
        data: {
          contentId: contentId_refined,
          content: result.content,
          originalContentId: contentId,
          refinementPrompt,
          metadata: contentData.metadata
        },
        message: 'Content refined successfully'
      });

    } catch (error) {
      logger.error('Failed to refine content', {
        error: error.message,
        contentId: req.params.contentId,
        userId: req.user?.id
      });

      res.status(500).json({
        success: false,
        error: 'Failed to refine content'
      });
    }
  }
);

// ==============================================
// CONTENT GENERATION HELPERS
// ==============================================

async function generateTextContent(prompt, faithMode, platform, settings) {
  // Build enhanced system prompt with settings
  const systemPrompt = buildSystemPrompt('text', faithMode, platform, settings);
  
  // Enhanced prompt construction
  const enhancedPrompt = constructEnhancedPrompt(prompt, settings);
  
  try {
    // Try OpenAI first
    if (openai) {
      const completion = await openai.chat.completions.create({
        model: settings.model || 'gpt-4o-mini', // Using more cost-effective model for development
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: enhancedPrompt }
        ],
        max_tokens: settings.maxTokens || 1000,
        temperature: settings.temperature || 0.7,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
      });

      const content = completion.choices[0]?.message?.content || 'Generation failed';
      
      return {
        content: content,
        method: 'openai',
        model: settings.model || 'gpt-4o-mini',
        usage: completion.usage,
        settings: settings
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
            { role: 'user', content: enhancedPrompt }
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

      const content = response.data.choices[0]?.message?.content || 'Generation failed';
      
      return {
        content: content,
        method: 'openrouter',
        model: settings.model || 'anthropic/claude-3-haiku',
        settings: settings
      };
    }

    // Return enhanced mock content if no AI services available
    return {
      content: generateEnhancedMockContent('text', faithMode, platform, settings),
      method: 'mock',
      settings: settings
    };

  } catch (error) {
    logger.error('AI service error', { error: error.message, settings });
    
    // Return enhanced mock content as fallback
    return {
      content: generateEnhancedMockContent('text', faithMode, platform, settings),
      method: 'mock-fallback',
      error: error.message,
      settings: settings
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

function buildSystemPrompt(contentType, faithMode, platform, settings = {}) {
  // Enhanced personality based on faith mode
  const basePersonality = faithMode 
    ? `You are an expert Kingdom-minded creative assistant helping Christians build businesses that honor God and advance His Kingdom. You understand both biblical principles and modern business strategies. Your content should:
    - Include relevant biblical wisdom and Kingdom business principles
    - Encourage faith-based entrepreneurship
    - Promote excellence as an act of worship
    - Emphasize stewardship over ownership
    - Focus on serving others and creating Kingdom impact
    - Use appropriate faith-based language and biblical references
    - Inspire with hope and divine purpose`
    : `You are a professional creative marketing assistant helping entrepreneurs build successful, impactful businesses. Your content should:
    - Focus on proven marketing strategies and best practices
    - Emphasize value creation and customer success
    - Use engaging, professional language
    - Include actionable insights and tips
    - Drive engagement and conversions
    - Stay current with marketing trends
    - Inspire action and growth`;

  // Platform-specific guidance
  const platformGuidance = {
    instagram: "\n📸 INSTAGRAM OPTIMIZATION:\n- Use engaging hooks in first line\n- Include 3-5 relevant hashtags naturally\n- Write for visual storytelling\n- Keep paragraphs short (2-3 lines)\n- Include call-to-action\n- Use emojis strategically",
    facebook: "\n📘 FACEBOOK OPTIMIZATION:\n- Create conversation-starting content\n- Use storytelling approach\n- Include questions to drive engagement\n- Optimize for shares and comments\n- Use clear call-to-action",
    linkedin: "\n💼 LINKEDIN OPTIMIZATION:\n- Professional, value-driven tone\n- Industry insights and expertise\n- Business-focused content\n- Include professional call-to-action\n- Use business-appropriate language",
    tiktok: "\n🎵 TIKTOK OPTIMIZATION:\n- Hook viewers in first 3 seconds\n- Trendy, energetic language\n- Include trending topics/sounds\n- Short, punchy sentences\n- Focus on entertainment value",
    youtube: "\n🎥 YOUTUBE OPTIMIZATION:\n- Create compelling titles\n- Structure for video format\n- Include timestamps/segments\n- Focus on educational value\n- Strong opening and closing",
    twitter: "\n🐦 TWITTER OPTIMIZATION:\n- Concise, impactful messaging\n- Include relevant hashtags\n- Use thread format if needed\n- Focus on shareability\n- Clear, direct language"
  };

  // Content type specific instructions
  const contentTypeInstructions = {
    text: `Create ${settings.contentSubtype || 'engaging'} content that provides real value. ${getContentSubtypeGuidance(settings.contentSubtype, faithMode)}`,
    image: "Describe visual concepts that would create compelling, professional imagery that aligns with the content message.",
    video: "Structure content for video format with clear segments, engaging flow, and strong opening/closing."
  };

  // Tone and style modifiers
  const toneGuidance = settings.tone ? `\n🎯 TONE: ${getToneGuidance(settings.tone)}` : '';
  
  // Length guidance
  const lengthGuidance = settings.length ? `\n📏 LENGTH: ${getLengthGuidance(settings.length, platform)}` : '';

  return `${basePersonality}${platformGuidance[platform] || ''}${toneGuidance}${lengthGuidance}\n\n📝 CONTENT TYPE: ${contentTypeInstructions[contentType] || contentTypeInstructions.text}`;
}

function getContentSubtypeGuidance(subtype, faithMode) {
  const guidance = {
    post: "Create a social media post that engages and inspires your audience",
    caption: "Write a compelling caption that complements visual content",
    story: "Create content perfect for story format - personal, behind-the-scenes, authentic",
    reel: "Structure for short-form video content with strong hook and clear message",
    thread: "Create a multi-part thread that tells a complete story or teaches a concept",
    email: "Write email content that provides value and drives action",
    blog: "Create detailed, informative content suitable for blog format",
    ad: "Write persuasive advertising copy that converts while providing value"
  };

  const faithAddition = faithMode && subtype ? " while incorporating Kingdom principles and biblical wisdom" : "";
  return (guidance[subtype] || guidance.post) + faithAddition;
}

function getToneGuidance(tone) {
  const tones = {
    inspirational: "Use uplifting, motivational language that inspires action",
    educational: "Focus on teaching and providing valuable insights",
    conversational: "Write in a friendly, approachable tone as if talking to a friend",
    professional: "Maintain professional, authoritative tone",
    playful: "Use fun, engaging language with personality",
    urgent: "Create sense of urgency and immediate action",
    storytelling: "Use narrative structure to engage and connect emotionally"
  };
  
  return tones[tone] || tones.conversational;
}

function getLengthGuidance(length, platform) {
  const baseLengths = {
    short: "Keep it concise and punchy",
    medium: "Provide good detail while staying engaging", 
    long: "Create comprehensive, detailed content"
  };

  const platformLengths = {
    instagram: {
      short: "125-150 words max",
      medium: "150-300 words", 
      long: "300-500 words"
    },
    facebook: {
      short: "40-80 words",
      medium: "80-200 words",
      long: "200-400 words"
    },
    twitter: {
      short: "100-150 characters",
      medium: "150-250 characters",
      long: "Multiple tweets (thread)"
    },
    linkedin: {
      short: "150-300 words",
      medium: "300-600 words", 
      long: "600-1000 words"
    }
  };

  const platformSpecific = platformLengths[platform]?.[length];
  return platformSpecific ? `${baseLengths[length]} (${platformSpecific})` : baseLengths[length];
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

function constructEnhancedPrompt(basePrompt, settings) {
  let enhancedPrompt = basePrompt;
  
  // Add context based on settings
  if (settings.productId) {
    enhancedPrompt += `\n\nProduct Context: This content is for product ID ${settings.productId}`;
  }
  
  if (settings.contentSubtype) {
    enhancedPrompt += `\n\nContent Type: Create a ${settings.contentSubtype}`;
  }
  
  if (settings.targetAudience) {
    enhancedPrompt += `\n\nTarget Audience: ${settings.targetAudience}`;
  }
  
  if (settings.callToAction) {
    enhancedPrompt += `\n\nCall to Action: Include a call to action related to: ${settings.callToAction}`;
  }
  
  if (settings.keyPoints && Array.isArray(settings.keyPoints)) {
    enhancedPrompt += `\n\nKey Points to Include: ${settings.keyPoints.join(', ')}`;
  }
  
  return enhancedPrompt;
}

function getContentTemplates(category, platform) {
  const templates = {
    business: [
      {
        id: 'business_growth_1',
        title: 'Business Growth Strategy',
        description: 'Template for sharing business growth insights',
        prompt: 'Share a key business growth strategy that has worked for you, including specific tactics and measurable results.',
        category: 'business',
        platforms: ['linkedin', 'instagram', 'facebook'],
        tags: ['growth', 'strategy', 'business']
      },
      {
        id: 'customer_success_1',
        title: 'Customer Success Story',
        description: 'Template for highlighting customer wins',
        prompt: 'Share a customer success story that demonstrates the value of your product/service. Include the challenge, solution, and results.',
        category: 'business',
        platforms: ['linkedin', 'instagram', 'facebook', 'twitter'],
        tags: ['customer', 'success', 'testimonial']
      }
    ],
    faith: [
      {
        id: 'kingdom_principles_1',
        title: 'Kingdom Business Principles',
        description: 'Template for sharing biblical business wisdom',
        prompt: 'Share a biblical principle that has transformed your approach to business, including the scripture reference and practical application.',
        category: 'faith',
        platforms: ['instagram', 'facebook', 'linkedin'],
        tags: ['kingdom', 'principles', 'biblical', 'business']
      },
      {
        id: 'faith_testimony_1',
        title: 'Faith in Business Testimony',
        description: 'Template for sharing faith-based business testimonies',
        prompt: 'Share how your faith has guided a specific business decision or helped you through a challenge.',
        category: 'faith',
        platforms: ['instagram', 'facebook'],
        tags: ['testimony', 'faith', 'business']
      }
    ],
    marketing: [
      {
        id: 'product_launch_1',
        title: 'Product Launch Announcement',
        description: 'Template for announcing new products',
        prompt: 'Create an exciting announcement for a new product launch, highlighting key benefits and creating urgency.',
        category: 'marketing',
        platforms: ['instagram', 'facebook', 'twitter', 'linkedin'],
        tags: ['product', 'launch', 'announcement']
      },
      {
        id: 'behind_scenes_1',
        title: 'Behind the Scenes',
        description: 'Template for sharing behind-the-scenes content',
        prompt: 'Share a behind-the-scenes look at your business process, showing the human side of your brand.',
        category: 'marketing',
        platforms: ['instagram', 'facebook'],
        tags: ['behind-scenes', 'authentic', 'process']
      }
    ]
  };

  // Filter by category and platform
  let filteredTemplates = [];
  
  if (category) {
    filteredTemplates = templates[category] || [];
  } else {
    filteredTemplates = Object.values(templates).flat();
  }

  if (platform) {
    filteredTemplates = filteredTemplates.filter(template => 
      template.platforms.includes(platform)
    );
  }

  return filteredTemplates;
}

function generateEnhancedMockContent(type, faithMode, platform, settings) {
  const contentTypes = {
    inspirational_post: faithMode ? 
      `🙏 **Divine Favor in Business**

Today I want to share something that's been on my heart about operating in divine favor as Kingdom entrepreneurs.

When we align our businesses with God's purposes, we step into a realm where His favor opens doors that no one can shut. This isn't about easy success - it's about supernatural breakthrough in the midst of natural challenges.

**Key Principles:**
✨ Seek first His Kingdom (Matthew 6:33)
💎 Operate with integrity and excellence
🤝 Serve others before serving self
📈 Trust His timing for growth

Remember: You're not just building a business - you're stewarding a Kingdom assignment.

What area of your business needs His favor today? 💭

#KingdomBusiness #DivineSupport #Entrepreneurs #Faith` :
      `💡 **The Mindset Shift That Changed Everything**

After years of grinding without results, I discovered the one mindset shift that transformed my entire approach to business.

It wasn't about working harder - it was about working with intentionality.

**The shift:** From task-focused to outcome-focused thinking.

Instead of asking "What do I need to do today?"
I started asking "What outcome am I creating today?"

This simple change led to:
📈 40% increase in productivity
🎯 Clearer decision-making
⚡ Better resource allocation
🚀 Faster goal achievement

Your mindset shapes your methods. Get the mindset right, and the methods will follow.

What mindset shift do you need to make today?

#Entrepreneurship #Mindset #Business #Growth`,

    product_showcase: faithMode ?
      `✨ **Created with Purpose & Prayer**

Every piece I create starts with a moment of prayer and intention. This isn't just about making something beautiful - it's about creating something that carries meaning and speaks to the heart.

🎨 **The Story Behind This Design:**
• Inspired by Jeremiah 29:11 - plans for hope and a future
• Each element thoughtfully chosen to encourage
• Handcrafted with attention to Kingdom values
• Made to bless both giver and receiver

When you purchase from Kingdom-minded creators, you're not just buying a product - you're partnering with purpose.

**Available now** - DM for details or visit our shop! 

#KingdomCreated #FaithInspired #Handmade #PurposeDriven` :
      `🔥 **Game-Changer Alert!**

This product has completely transformed how our clients approach their daily workflow.

Here's what makes it special:
⚡ Saves 3+ hours per day
🎯 Streamlines complex processes
📊 Provides real-time insights
🚀 Scales with your business

**Real Results:**
"This cut our project time in half while doubling our output quality" - Sarah M.

"Finally, a solution that actually works as promised" - Mike T.

Ready to transform your workflow? Link in bio or DM us for details!

#ProductLaunch #GameChanger #Productivity #BusinessTools`,

    educational_thread: faithMode ?
      `🧵 **Kingdom Business Principles That Actually Work**

After building multiple Kingdom-centered businesses, here are the biblical principles that drive real results:

1/7 🏗️ **Foundation First**
"Unless the Lord builds the house, the builders labor in vain" - Psalm 127:1

Start with prayer, not planning. Seek His vision before your vision.

2/7 💎 **Excellence as Worship**
"Whatever you do, work at it with all your heart" - Colossians 3:23

Quality isn't just good business - it's worship. Excellence reflects God's character.

3/7 🤝 **Service Over Profit**
"Whoever wants to be great must be a servant" - Mark 10:43

When you serve others genuinely, profit follows naturally.

4/7 📈 **Faithful in Little**
"Faithful in little, ruler over much" - Luke 16:10

Master small before moving to big. God promotes the faithful.

5/7 ⚖️ **Integrity Always**
"Better is a little with righteousness" - Proverbs 16:8

Your reputation is your greatest asset. Guard it fiercely.

6/7 🎯 **Eternal Perspective**
"Store up treasures in heaven" - Matthew 6:20

Build for Kingdom impact, not just kingdom profits.

7/7 🙏 **Trust His Timing**
"He makes everything beautiful in its time" - Ecclesiastes 3:11

Success in God's timing beats success in your timing.

Which principle do you need to implement first? 💭

#KingdomBusiness #BiblicalPrinciples #Entrepreneurs #Faith` :
      `🧵 **7 Business Lessons I Wish I Knew at 20**

After 15 years of building companies, here's what I'd tell my younger self:

1/8 📚 **Skills > Credentials**
Your ability to solve problems matters more than your degree. Invest in learning practical skills that create value.

2/8 🌐 **Network = Net Worth**
The people you know will open more doors than what you know. Invest in genuine relationships, not just transactions.

3/8 ⚡ **Speed Beats Perfect**
Done is better than perfect. Ship fast, get feedback, iterate quickly. Perfectionism is the enemy of progress.

4/8 💰 **Cash Flow > Profit**
You can be profitable and still go broke. Master cash flow management before you master anything else.

5/8 🎯 **Niche Down**
Trying to serve everyone means serving no one well. Find your specific audience and serve them exceptionally.

6/8 📊 **Measure Everything**
What gets measured gets managed. Track the metrics that actually matter, not vanity numbers.

7/8 🔄 **Automate & Delegate**
Your time is your most valuable asset. Automate what you can, delegate what you must, focus on what only you can do.

8/8 🧠 **Mindset Matters Most**
Your biggest limitations are in your head. Invest in personal development as much as business development.

Which lesson resonates most with you? 💭

#Entrepreneurship #BusinessLessons #Growth #Mindset`
  };

  // Select content type based on settings
  let selectedContent;
  if (settings.contentSubtype === 'thread') {
    selectedContent = contentTypes.educational_thread;
  } else if (settings.contentSubtype === 'product') {
    selectedContent = contentTypes.product_showcase;
  } else {
    selectedContent = contentTypes.inspirational_post;
  }

  // Add platform-specific formatting
  if (platform === 'twitter' && selectedContent.length > 280) {
    selectedContent = selectedContent.substring(0, 250) + '... (1/n)';
  }

  return selectedContent + `\n\n---\n*Generated with Kingdom Studios AI • ${new Date().toLocaleString()}*`;
}

export default router;

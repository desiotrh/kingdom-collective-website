/**
 * Enterprise Content Generation Service
 * Optimized for 10K-100K+ concurrent users with advanced AI integration
 */

import OpenAI from 'openai';
import { logger } from '../utils/logger.js';

class EnterpriseContentService {
  constructor(enterpriseInfra) {
    this.enterpriseInfra = enterpriseInfra;
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 30000, // 30 second timeout
      maxRetries: 3,
    });
    
    // Content generation cache
    this.contentCache = new Map();
    this.templateCache = new Map();
    
    // Deduplication tracking
    this.activeGenerations = new Map();
    
    // Rate limiting for AI API calls
    this.aiRateLimit = {
      requests: 0,
      resetTime: Date.now() + 60000, // Reset every minute
      maxRequests: 100 // Max 100 AI requests per minute
    };

    this.initializeTemplates();
  }

  /**
   * Initialize content templates for faster generation
   */
  async initializeTemplates() {
    const templates = {
      'social-post': {
        system: 'You are a faith-based content creator specializing in inspirational social media posts.',
        structure: 'Create an engaging, faith-based social media post that inspires and encourages.',
        maxTokens: 150,
        temperature: 0.8
      },
      'blog-outline': {
        system: 'You are a Christian blogger who creates detailed, scripture-based content outlines.',
        structure: 'Create a comprehensive blog post outline with main points and supporting scriptures.',
        maxTokens: 500,
        temperature: 0.7
      },
      'video-script': {
        system: 'You are a faith-based video content creator who writes engaging, inspirational scripts.',
        structure: 'Create a video script that combines storytelling with biblical principles.',
        maxTokens: 800,
        temperature: 0.8
      },
      'devotional': {
        system: 'You are a devotional writer who creates daily spiritual content for believers.',
        structure: 'Write a daily devotional with scripture, reflection, and prayer.',
        maxTokens: 400,
        temperature: 0.6
      },
      'product-description': {
        system: 'You are a Christian product marketer who writes compelling, value-driven descriptions.',
        structure: 'Create a product description that highlights benefits and aligns with Christian values.',
        maxTokens: 300,
        temperature: 0.7
      },
      'email-sequence': {
        system: 'You are an email marketing specialist for faith-based businesses.',
        structure: 'Create an email that builds relationship and provides value to Christian audiences.',
        maxTokens: 600,
        temperature: 0.8
      }
    };

    for (const [type, template] of Object.entries(templates)) {
      this.templateCache.set(type, template);
    }

    logger.info('✅ Content templates initialized');
  }

  /**
   * Generate content with enterprise optimizations
   */
  async generateContent(request) {
    const {
      type,
      prompt,
      userId,
      customizations = {},
      priority = 'standard'
    } = request;

    try {
      // Create deduplication key
      const dedupKey = this.createDeduplicationKey(type, prompt, userId);
      
      // Check for existing generation
      const existingGeneration = this.activeGenerations.get(dedupKey);
      if (existingGeneration) {
        logger.info('Deduplicating content generation request');
        return await existingGeneration;
      }

      // Check cache first
      const cachedResult = await this.getCachedContent(dedupKey);
      if (cachedResult) {
        logger.info('Returning cached content');
        return cachedResult;
      }

      // Create generation promise
      const generationPromise = this.performContentGeneration({
        type,
        prompt,
        userId,
        customizations,
        priority
      });

      // Store in active generations for deduplication
      this.activeGenerations.set(dedupKey, generationPromise);

      // Execute generation
      const result = await generationPromise;

      // Cache the result
      await this.cacheContent(dedupKey, result);

      // Clean up active generation
      this.activeGenerations.delete(dedupKey);

      return result;

    } catch (error) {
      logger.error('Content generation failed:', error);
      throw error;
    }
  }

  /**
   * Perform the actual content generation
   */
  async performContentGeneration(request) {
    const { type, prompt, userId, customizations, priority } = request;

    // Check AI rate limits
    await this.checkAIRateLimit();

    // Get template
    const template = this.templateCache.get(type);
    if (!template) {
      throw new Error(`Unknown content type: ${type}`);
    }

    // Build the prompt
    const fullPrompt = this.buildPrompt(prompt, template, customizations);

    // Add to appropriate queue based on priority
    const queueName = priority === 'high' ? 'high-priority' : 'standard';
    
    if (this.enterpriseInfra) {
      return await this.enterpriseInfra.addTask(queueName, 'content-generation', {
        type,
        prompt: fullPrompt,
        userId,
        template,
        customizations
      });
    } else {
      // Fallback to direct generation if infrastructure not available
      return await this.generateWithOpenAI(fullPrompt, template);
    }
  }

  /**
   * Generate content using OpenAI
   */
  async generateWithOpenAI(prompt, template) {
    const startTime = Date.now();

    try {
      this.incrementAIRateLimit();

      const completion = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: template.system
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: template.maxTokens,
        temperature: template.temperature,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
      });

      const content = completion.choices[0].message.content.trim();
      const tokensUsed = completion.usage.total_tokens;
      const duration = Date.now() - startTime;

      logger.info('Content generated successfully:', {
        tokensUsed,
        duration: duration + 'ms',
        model: completion.model
      });

      return {
        success: true,
        content,
        metadata: {
          tokensUsed,
          duration,
          model: completion.model,
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      
      logger.error('OpenAI generation failed:', {
        error: error.message,
        duration: duration + 'ms',
        type: error.type,
        code: error.code
      });

      // Handle specific OpenAI errors
      if (error.code === 'rate_limit_exceeded') {
        throw new Error('AI service temporarily overloaded. Please try again in a moment.');
      } else if (error.code === 'invalid_request_error') {
        throw new Error('Invalid content generation request. Please check your input.');
      } else if (error.code === 'insufficient_quota') {
        throw new Error('AI service quota exceeded. Please contact support.');
      }

      throw new Error('Content generation temporarily unavailable. Please try again.');
    }
  }

  /**
   * Build optimized prompt
   */
  buildPrompt(userPrompt, template, customizations) {
    let prompt = `${template.structure}\n\nUser Request: ${userPrompt}`;

    // Add customizations
    if (customizations.tone) {
      prompt += `\nTone: ${customizations.tone}`;
    }
    if (customizations.length) {
      prompt += `\nLength: ${customizations.length}`;
    }
    if (customizations.audience) {
      prompt += `\nTarget Audience: ${customizations.audience}`;
    }
    if (customizations.style) {
      prompt += `\nStyle: ${customizations.style}`;
    }
    if (customizations.keywords) {
      prompt += `\nInclude Keywords: ${customizations.keywords.join(', ')}`;
    }
    if (customizations.callToAction) {
      prompt += `\nCall to Action: ${customizations.callToAction}`;
    }

    return prompt;
  }

  /**
   * Create deduplication key
   */
  createDeduplicationKey(type, prompt, userId) {
    const hash = this.simpleHash(prompt + type + (userId || 'anonymous'));
    return `content:${type}:${hash}`;
  }

  /**
   * Simple hash function for deduplication
   */
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Cache content result
   */
  async cacheContent(key, content) {
    try {
      // Cache in memory for quick access
      this.contentCache.set(key, {
        content,
        timestamp: Date.now()
      });

      // Cache in Redis if available
      if (this.enterpriseInfra) {
        await this.enterpriseInfra.setCacheValue(key, content, 3600); // 1 hour TTL
      }

      // Clean up old cache entries
      if (this.contentCache.size > 1000) {
        const oldestKey = this.contentCache.keys().next().value;
        this.contentCache.delete(oldestKey);
      }
    } catch (error) {
      logger.error('Failed to cache content:', error);
    }
  }

  /**
   * Get cached content
   */
  async getCachedContent(key) {
    try {
      // Check memory cache first
      const memoryCached = this.contentCache.get(key);
      if (memoryCached) {
        const age = Date.now() - memoryCached.timestamp;
        if (age < 3600000) { // 1 hour
          return memoryCached.content;
        }
        this.contentCache.delete(key);
      }

      // Check Redis cache
      if (this.enterpriseInfra) {
        return await this.enterpriseInfra.getCacheValue(key);
      }
    } catch (error) {
      logger.error('Failed to get cached content:', error);
    }

    return null;
  }

  /**
   * Check AI rate limits
   */
  async checkAIRateLimit() {
    const now = Date.now();
    
    // Reset rate limit if time window passed
    if (now > this.aiRateLimit.resetTime) {
      this.aiRateLimit.requests = 0;
      this.aiRateLimit.resetTime = now + 60000; // Next minute
    }

    // Check if rate limit exceeded
    if (this.aiRateLimit.requests >= this.aiRateLimit.maxRequests) {
      const waitTime = this.aiRateLimit.resetTime - now;
      throw new Error(`AI rate limit exceeded. Try again in ${Math.ceil(waitTime / 1000)} seconds.`);
    }
  }

  /**
   * Increment AI rate limit counter
   */
  incrementAIRateLimit() {
    this.aiRateLimit.requests++;
  }

  /**
   * Get content templates
   */
  getContentTemplates() {
    const templates = {};
    for (const [type, template] of this.templateCache) {
      templates[type] = {
        description: template.structure,
        maxTokens: template.maxTokens,
        temperature: template.temperature
      };
    }
    return templates;
  }

  /**
   * Batch content generation
   */
  async generateBatchContent(requests) {
    const results = [];
    const batchSize = 5; // Process 5 at a time to avoid overwhelming AI service

    for (let i = 0; i < requests.length; i += batchSize) {
      const batch = requests.slice(i, i + batchSize);
      
      const batchResults = await Promise.allSettled(
        batch.map(request => this.generateContent(request))
      );

      results.push(...batchResults);

      // Small delay between batches
      if (i + batchSize < requests.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  /**
   * Get generation statistics
   */
  getGenerationStats() {
    return {
      cacheSize: this.contentCache.size,
      activeGenerations: this.activeGenerations.size,
      aiRateLimit: {
        requests: this.aiRateLimit.requests,
        maxRequests: this.aiRateLimit.maxRequests,
        resetTime: new Date(this.aiRateLimit.resetTime).toISOString()
      },
      templateCount: this.templateCache.size
    };
  }

  /**
   * Clear caches
   */
  clearCaches() {
    this.contentCache.clear();
    this.activeGenerations.clear();
    logger.info('Content service caches cleared');
  }
}

export default EnterpriseContentService;

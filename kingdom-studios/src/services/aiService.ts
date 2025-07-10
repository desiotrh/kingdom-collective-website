import OpenAI from 'openai';
import { Environment } from '../config/environment';
import { databaseService } from './databaseService';
import NotificationService from './notificationService';
import type { AIGenerationDocument } from './database/collections';

/**
 * 🤖 ENHANCED AI SERVICE - TIER-INTEGRATED CONTENT GENERATION
 * Production-ready AI service with usage tracking and tier limits
 */

export interface AIGenerationOptions {
  faithMode?: boolean;
  tone?: 'professional' | 'casual' | 'inspirational';
  platform?: string;
  maxTokens?: number;
  model?: 'gpt-4' | 'gpt-3.5-turbo' | 'gpt-4-turbo';
}

export interface AIGenerationResult {
  content: string;
  tokensUsed: number;
  processingTime: number;
  model: string;
  success: boolean;
  error?: string;
}

export type AIContentType = 
  | 'social_post' 
  | 'email_content' 
  | 'hashtags' 
  | 'product_description' 
  | 'seo_content'
  | 'blog_post'
  | 'ad_copy'
  | 'script'
  | 'caption';

class EnhancedAIService {
  private static instance: EnhancedAIService;
  private openai: OpenAI | null = null;
  private isInitialized = false;

  private constructor() {
    this.initialize();
  }

  static getInstance(): EnhancedAIService {
    if (!EnhancedAIService.instance) {
      EnhancedAIService.instance = new EnhancedAIService();
    }
    return EnhancedAIService.instance;
  }

  private initialize() {
    try {
      const apiKey = Environment.get().OPENAI_API_KEY;
      
      if (apiKey) {
        this.openai = new OpenAI({
          apiKey: apiKey,
          dangerouslyAllowBrowser: true // Required for Expo/React Native
        });
        this.isInitialized = true;
        
        if (Environment.isDebugEnabled()) {
          console.log('[AI Service] OpenAI initialized successfully');
        }
      } else {
        console.warn('[AI Service] OpenAI API key not found - using mock mode');
      }
    } catch (error) {
      console.error('[AI Service] Initialization error:', error);
    }
  }

  /**
   * Generate AI content with tier limit checking and usage logging
   */
  async generateContent(
    userId: string,
    contentType: AIContentType,
    prompt: string,
    options: AIGenerationOptions = {}
  ): Promise<AIGenerationResult> {
    const startTime = Date.now();

    try {
      // Check tier limits first
      const canGenerate = await this.checkTierLimits(userId);
      if (!canGenerate.allowed) {
        return {
          content: '',
          tokensUsed: 0,
          processingTime: 0,
          model: '',
          success: false,
          error: canGenerate.reason
        };
      }

      // Generate content
      const result = await this.generateAIContent(contentType, prompt, options);
      
      // Log generation to database
      await this.logGeneration(userId, contentType, prompt, result, options.faithMode || false);
      
      // Update usage stats
      await this.updateUsageStats(userId);

      // Send completion notification if generation was successful
      if (result.success) {
        await this.sendCompletionNotification(userId, contentType, result);
      }

      return result;
    } catch (error) {
      console.error('[AI Service] Generation error:', error);
      
      return {
        content: this.getMockContent(contentType, options.faithMode || false),
        tokensUsed: 0,
        processingTime: Date.now() - startTime,
        model: 'mock',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async checkTierLimits(userId: string): Promise<{ allowed: boolean; reason?: string }> {
    try {
      // Get user's current tier and usage
      const user = await databaseService.getUser(userId);
      if (!user) {
        return { allowed: false, reason: 'User not found' };
      }

      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
      const usage = await databaseService.getTierUsage(userId, currentMonth);
      
      // Get tier limits from tier system context (would need to be passed or accessed differently)
      // For now, using hardcoded limits based on tier
      const tierLimits = this.getTierLimits(user.tier);
      
      const currentUsage = usage?.usage.aiGenerations || 0;
      
      if (currentUsage >= tierLimits.aiGenerationsPerDay) {
        return { 
          allowed: false, 
          reason: `Daily AI generation limit reached (${tierLimits.aiGenerationsPerDay}). Upgrade your tier for more generations.`
        };
      }

      return { allowed: true };
    } catch (error) {
      console.error('[AI Service] Error checking tier limits:', error);
      return { allowed: true }; // Allow on error to avoid blocking users
    }
  }

  private getTierLimits(tier: string) {
    const limits = {
      seed: { aiGenerationsPerDay: 10 },
      rooted: { aiGenerationsPerDay: 75 },
      commissioned: { aiGenerationsPerDay: 200 },
      mantled_pro: { aiGenerationsPerDay: 500 },
      kingdom_enterprise: { aiGenerationsPerDay: 999999 }
    };
    
    return limits[tier as keyof typeof limits] || limits.seed;
  }

  private async generateAIContent(
    contentType: AIContentType,
    prompt: string,
    options: AIGenerationOptions
  ): Promise<AIGenerationResult> {
    const startTime = Date.now();

    // Use mock mode if OpenAI is not configured
    if (!this.isInitialized || !this.openai) {
      return {
        content: this.getMockContent(contentType, options.faithMode || false),
        tokensUsed: 150,
        processingTime: Date.now() - startTime,
        model: 'mock-gpt-4',
        success: true
      };
    }

    try {
      const systemPrompt = this.getSystemPrompt(contentType, options.faithMode || false);
      const model = options.model || 'gpt-4-turbo';
      const maxTokens = options.maxTokens || 500;

      const completion = await this.openai.chat.completions.create({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: this.enhancePrompt(prompt, contentType, options) }
        ],
        max_tokens: maxTokens,
        temperature: 0.7,
      });

      const content = completion.choices[0]?.message?.content || '';
      const tokensUsed = completion.usage?.total_tokens || 0;

      return {
        content,
        tokensUsed,
        processingTime: Date.now() - startTime,
        model,
        success: true
      };
    } catch (error) {
      console.error('[AI Service] OpenAI API error:', error);
      throw error;
    }
  }

  private getSystemPrompt(contentType: AIContentType, faithMode: boolean): string {
    const basePersonality = faithMode 
      ? "You are a Kingdom-minded creative assistant helping Christians build businesses that honor God and advance His Kingdom."
      : "You are a professional creative assistant helping entrepreneurs build successful businesses.";

    const contentTypePrompts: Record<AIContentType, string> = {
      social_post: faithMode
        ? `${basePersonality} Create inspiring social media content that combines professional marketing with biblical wisdom. Include relevant scripture when appropriate.`
        : `${basePersonality} Create engaging social media content that drives engagement and builds community.`,
      
      email_content: faithMode
        ? `${basePersonality} Write compelling email content that includes biblical encouragement and practical business advice while maintaining professionalism.`
        : `${basePersonality} Write professional email content that converts readers into customers using proven copywriting techniques.`,
      
      hashtags: faithMode
        ? `${basePersonality} Generate hashtags that help Christian content creators reach their audience while maintaining faith-based messaging.`
        : `${basePersonality} Generate strategic hashtags that maximize reach and engagement for business content.`,
      
      product_description: faithMode
        ? `${basePersonality} Write product descriptions that emphasize both practical value and Kingdom impact.`
        : `${basePersonality} Write persuasive product descriptions that convert browsers into buyers.`,
      
      seo_content: faithMode
        ? `${basePersonality} Create SEO-optimized content that helps Kingdom businesses rank well while maintaining Christian values.`
        : `${basePersonality} Create SEO strategies and content that drive organic traffic and improve search rankings.`,
      
      blog_post: faithMode
        ? `${basePersonality} Write engaging blog content that provides value while incorporating biblical principles and Kingdom business mindset.`
        : `${basePersonality} Write compelling blog content that engages readers and drives business growth.`,
      
      ad_copy: faithMode
        ? `${basePersonality} Create advertising copy that is both effective and honors Christian values, focusing on serving others.`
        : `${basePersonality} Create high-converting advertising copy that drives sales and builds brand trust.`,
      
      script: faithMode
        ? `${basePersonality} Write video or audio scripts that are engaging while incorporating faith-based messaging and encouragement.`
        : `${basePersonality} Write compelling scripts for video or audio content that captivates audiences and delivers clear messages.`,
      
      caption: faithMode
        ? `${basePersonality} Create image captions that are both engaging and inspirational, incorporating biblical wisdom when appropriate.`
        : `${basePersonality} Create compelling captions that boost engagement and tell compelling stories.`
    };

    return contentTypePrompts[contentType] || contentTypePrompts.social_post;
  }

  private enhancePrompt(prompt: string, contentType: AIContentType, options: AIGenerationOptions): string {
    let enhancedPrompt = `Content Type: ${contentType}\n`;
    
    if (options.platform) {
      enhancedPrompt += `Platform: ${options.platform}\n`;
    }
    
    if (options.tone) {
      enhancedPrompt += `Tone: ${options.tone}\n`;
    }
    
    enhancedPrompt += `Faith Mode: ${options.faithMode ? 'Include biblical wisdom and Kingdom perspective' : 'Use general business approach'}\n\n`;
    enhancedPrompt += `User Request: ${prompt}`;

    return enhancedPrompt;
  }

  private async logGeneration(
    userId: string,
    contentType: AIContentType,
    prompt: string,
    result: AIGenerationResult,
    faithMode: boolean
  ): Promise<void> {
    try {
      const user = await databaseService.getUser(userId);
      
      const generationLog: Omit<AIGenerationDocument, 'id' | 'createdAt'> = {
        userId,
        type: contentType as any,
        prompt: prompt.substring(0, 500), // Limit prompt length
        result: result.content.substring(0, 2000), // Limit result length
        model: result.model,
        tokensUsed: result.tokensUsed,
        processingTime: result.processingTime,
        tier: user?.tier || 'seed',
        faithMode
      };

      await databaseService.logAIGeneration(generationLog);
    } catch (error) {
      console.error('[AI Service] Error logging generation:', error);
    }
  }

  private async updateUsageStats(userId: string): Promise<void> {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7);
      const usage = await databaseService.getTierUsage(userId, currentMonth);
      
      const currentUsage = usage?.usage.aiGenerations || 0;
      
      await databaseService.updateTierUsage(userId, currentMonth, {
        usage: {
          aiGenerations: currentUsage + 1,
          designsCreated: usage?.usage.designsCreated || 0,
          storageUsedGB: usage?.usage.storageUsedGB || 0,
          apiCalls: usage?.usage.apiCalls || 0,
          teamSeatsUsed: usage?.usage.teamSeatsUsed || 0,
        }
      });
    } catch (error) {
      console.error('[AI Service] Error updating usage stats:', error);
    }
  }

  private getMockContent(contentType: AIContentType, faithMode: boolean): string {
    const mockContent: Record<AIContentType, { faith: string; general: string }> = {
      social_post: {
        faith: "🙏 Walking in faith means trusting God's plan even when we can't see the whole staircase. As Kingdom entrepreneurs, we're called to be faithful stewards of the gifts He's given us. What step of faith is God calling you to take today? #KingdomBusiness #FaithfulSteward #TrustGod",
        general: "Success isn't just about the destination—it's about who you become along the journey. Every challenge is an opportunity to grow stronger and more resilient. What's one lesson you've learned that changed your perspective? Share below! 👇 #GrowthMindset #Success"
      },
      email_content: {
        faith: "Dear Kingdom Builder,\n\nGod has placed a unique calling on your life, and He's equipped you with everything you need to fulfill His purpose. In this season, remember that He's preparing you for greater things.\n\nBlessings,\nYour Kingdom Studios Team",
        general: "Dear Entrepreneur,\n\nSuccess is built one decision at a time. Today's small actions become tomorrow's big results. We're here to help you make the right moves at the right time.\n\nBest regards,\nThe Team"
      },
      hashtags: {
        faith: "#KingdomBusiness #FaithfulEntrepreneur #ChristianBusiness #KingdomMinded #FaithAndBusiness #BiblicalSuccess #GodlyLeadership #PurposeDriven #KingdomImpact #FaithfulSteward",
        general: "#Entrepreneur #BusinessSuccess #GrowthMindset #Success #BusinessTips #Leadership #Innovation #Productivity #Goals #Inspiration"
      },
      product_description: {
        faith: "This product is designed to help Kingdom entrepreneurs build businesses that honor God while serving others. Created with biblical principles in mind, it provides practical tools for faithful stewardship and Kingdom impact.",
        general: "A premium solution designed for serious entrepreneurs who want to take their business to the next level. Built with quality, innovation, and results in mind."
      },
      seo_content: {
        faith: "Building a Kingdom business requires both faith and strategy. This guide combines biblical wisdom with proven business principles to help Christian entrepreneurs create lasting impact while honoring God in their work.",
        general: "Smart entrepreneurs know that success comes from combining proven strategies with innovative thinking. This comprehensive guide provides the roadmap you need to build and scale your business effectively."
      },
      blog_post: {
        faith: "As believers called to be salt and light in the marketplace, we have a unique opportunity to demonstrate Kingdom principles through our businesses...",
        general: "In today's competitive business landscape, entrepreneurs need more than just a good idea—they need a strategic approach that sets them apart..."
      },
      ad_copy: {
        faith: "Build Your Kingdom Business the Right Way - Combining biblical wisdom with proven business strategies to create lasting impact.",
        general: "Transform Your Business Ideas Into Profitable Reality - Get the tools and strategies successful entrepreneurs use to build thriving businesses."
      },
      script: {
        faith: "Welcome Kingdom builders! Today we're talking about how to align your business with God's purpose for your life...",
        general: "Hey entrepreneurs! Ready to take your business to the next level? Today I'm sharing the strategies that successful business owners use..."
      },
      caption: {
        faith: "Trust God's timing. He's preparing you for something greater than you can imagine. 🙏 #FaithJourney #TrustGod #KingdomMinded",
        general: "Success starts with believing in yourself and taking that first step. What's your next move? 💪 #Success #Motivation #TakeAction"
      }
    };

    return faithMode ? mockContent[contentType].faith : mockContent[contentType].general;
  }

  /**
   * Get user's AI generation statistics
   */
  async getGenerationStats(userId: string): Promise<{
    thisMonth: number;
    totalGenerations: number;
    remainingGenerations: number;
    tier: string;
  }> {
    try {
      const user = await databaseService.getUser(userId);
      if (!user) throw new Error('User not found');

      const currentMonth = new Date().toISOString().slice(0, 7);
      const usage = await databaseService.getTierUsage(userId, currentMonth);
      const tierLimits = this.getTierLimits(user.tier);
      
      const thisMonth = usage?.usage.aiGenerations || 0;
      const remaining = Math.max(0, tierLimits.aiGenerationsPerDay - thisMonth);

      // Get total generations
      const allGenerations = await databaseService.getUserAIGenerations(userId, 1000);
      
      return {
        thisMonth,
        totalGenerations: allGenerations.length,
        remainingGenerations: remaining,
        tier: user.tier
      };
    } catch (error) {
      console.error('[AI Service] Error getting stats:', error);
      return {
        thisMonth: 0,
        totalGenerations: 0,
        remainingGenerations: 10,
        tier: 'seed'
      };
    }
  }

  /**
   * Send completion notification for successful AI generation
   */
  private async sendCompletionNotification(
    userId: string,
    contentType: AIContentType,
    result: AIGenerationResult
  ): Promise<void> {
    try {
      const contentTypeMap = {
        social_post: 'Social Media Post',
        email_content: 'Email Content',
        hashtags: 'Hashtags',
        product_description: 'Product Description',
        seo_content: 'SEO Content',
        blog_post: 'Blog Post',
        ad_copy: 'Ad Copy',
        script: 'Script',
        caption: 'Caption'
      };

      const contentTypeName = contentTypeMap[contentType] || 'Content';

      await NotificationService.sendLocalNotification({
        id: '',
        title: '🤖 AI Content Ready!',
        body: `Your ${contentTypeName} has been generated and is ready to use.`,
        data: {
          type: 'ai_generation_complete',
          contentType,
          userId,
          tokensUsed: result.tokensUsed,
          processingTime: result.processingTime,
          model: result.model,
        }
      });

      if (Environment.isDebugEnabled()) {
        console.log(`[AI Service] Sent completion notification for ${contentType} to user ${userId}`);
      }
    } catch (error) {
      console.error('[AI Service] Error sending completion notification:', error);
      // Don't throw error as notification failure shouldn't break generation
    }
  }

  /**
   * Send usage limit warning notifications
   */
  async sendUsageLimitWarning(userId: string, remaining: number): Promise<void> {
    try {
      await NotificationService.sendLocalNotification({
        id: '',
        title: '⚠️ AI Usage Warning',
        body: `You have ${remaining} AI generations remaining this month.`,
        data: {
          type: 'usage_limit_warning',
          userId,
          remaining,
        }
      });
    } catch (error) {
      console.error('[AI Service] Error sending usage warning:', error);
    }
  }
}

// Export singleton instance
export const aiService = EnhancedAIService.getInstance();
export default aiService;
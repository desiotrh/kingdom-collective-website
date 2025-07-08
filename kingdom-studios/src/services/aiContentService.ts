import OpenAI from 'openai';
import axios from 'axios';
import { Environment } from '../config/environment';
import { BackendAPI, ContentRequest } from './backendAPI';
import { AnalyticsTracking } from './analyticsTracking';

class AIContentService {
  private static instance: AIContentService;
  private openai: OpenAI | null = null;
  private openrouterApiKey: string | null = null;
  private config: any;

  private constructor() {
    this.config = Environment.get();
    this.initializeServices();
  }

  static getInstance(): AIContentService {
    if (!AIContentService.instance) {
      AIContentService.instance = new AIContentService();
    }
    return AIContentService.instance;
  }

  private initializeServices() {
    // Initialize OpenAI
    if (this.config.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: this.config.OPENAI_API_KEY,
      });
    }
    
    // Initialize OpenRouter
    if (this.config.OPENROUTER_API_KEY) {
      this.openrouterApiKey = this.config.OPENROUTER_API_KEY;
    }

    if (Environment.isDebugEnabled()) {
      console.log('[AI Service] Initialized with providers:', {
        openai: !!this.openai,
        openrouter: !!this.openrouterApiKey,
      });
    }
  }

  // Enhanced prompt templates for different content types
  private getSystemPrompt(contentType: string, faithMode: boolean): string {
    const basePersonality = faithMode 
      ? "You are a Kingdom-minded creative assistant helping Christians build businesses that honor God and advance His Kingdom."
      : "You are a professional creative assistant helping entrepreneurs build successful businesses and create engaging content.";

    const contentSpecificPrompts = {
      social: faithMode
        ? `${basePersonality} Create inspiring social media content that combines professional marketing with biblical wisdom. Include relevant scripture when appropriate and use language that builds faith and encourages Kingdom entrepreneurs.`
        : `${basePersonality} Create engaging social media content that drives engagement and builds community. Use professional copywriting techniques and include compelling calls-to-action.`,
      
      email: faithMode
        ? `${basePersonality} Write compelling email content for Christian entrepreneurs and their audiences. Include elements of testimony, biblical encouragement, and practical business advice. Always maintain a tone that honors God while being professionally effective.`
        : `${basePersonality} Write professional email content that converts readers into customers. Use proven copywriting techniques and maintain an engaging, authentic tone throughout.`,
      
      hashtags: faithMode
        ? `${basePersonality} Generate relevant hashtags that will help Christian content creators reach their target audience while maintaining their faith-based messaging. Include both faith-specific and general business hashtags.`
        : `${basePersonality} Generate strategic hashtags that will maximize reach and engagement for business content. Include both niche-specific and broader appeal hashtags.`,
      
      seo: faithMode
        ? `${basePersonality} Create SEO-optimized content strategies that help Kingdom businesses rank well in search engines while maintaining their Christian values and messaging.`
        : `${basePersonality} Create comprehensive SEO strategies and content plans that drive organic traffic and improve search engine rankings.`,
      
      product: faithMode
        ? `${basePersonality} Write compelling product descriptions and marketing copy for Christian entrepreneurs. Emphasize both the practical value and the Kingdom impact of their products.`
        : `${basePersonality} Write persuasive product descriptions and marketing copy that converts browsers into buyers. Focus on benefits, social proof, and clear value propositions.`
    };

    return contentSpecificPrompts[contentType as keyof typeof contentSpecificPrompts] || contentSpecificPrompts.social;
  }

  // Generate content using OpenAI
  async generateWithOpenAI(
    prompt: string, 
    contentType: string, 
    faithMode: boolean = false,
    options: {
      tone?: 'professional' | 'casual' | 'inspirational';
      platform?: string;
      maxTokens?: number;
    } = {}
  ): Promise<string> {
    if (!this.openai) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = this.getSystemPrompt(contentType, faithMode);
    const maxTokens = options.maxTokens || 500;

    // Enhanced prompt with context
    const enhancedPrompt = `
Content Type: ${contentType}
Platform: ${options.platform || 'General'}
Tone: ${options.tone || 'inspirational'}
Faith Mode: ${faithMode ? 'Enabled - Include biblical wisdom and Kingdom perspective' : 'Disabled - Use general encouragement'}

User Request: ${prompt}

Please create compelling, engaging content that matches the specified parameters. If Faith Mode is enabled, include relevant biblical principles and Kingdom business mindset.
`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: enhancedPrompt }
        ],
        max_tokens: maxTokens,
        temperature: 0.7,
      });

      return completion.choices[0]?.message?.content || 'Content generation failed';
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate content with OpenAI');
    }
  }

  // Generate content using OpenRouter (alternative/backup)
  async generateWithOpenRouter(
    prompt: string, 
    contentType: string, 
    faithMode: boolean = false,
    model: string = 'anthropic/claude-3-haiku'
  ): Promise<string> {
    if (!this.openrouterApiKey) {
      throw new Error('OpenRouter API key not configured');
    }

    const systemPrompt = this.getSystemPrompt(contentType, faithMode);

    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          max_tokens: 500,
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openrouterApiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://kingdomstudios.app',
            'X-Title': 'Kingdom Studios App',
          }
        }
      );

      return response.data.choices[0]?.message?.content || 'Content generation failed';
    } catch (error) {
      console.error('OpenRouter API error:', error);
      throw new Error('Failed to generate content with OpenRouter');
    }
  }

  // Main content generation method with fallback
  async generateContent(
    prompt: string, 
    contentType: 'social' | 'email' | 'hashtags' | 'seo' | 'product',
    options: {
      faithMode?: boolean;
      tone?: 'professional' | 'casual' | 'inspirational';
      platform?: string;
      useBackup?: boolean;
    } = {}
  ): Promise<string> {
    const { faithMode = false, useBackup = false } = options;

    try {
      // Try OpenAI first unless backup is requested
      if (!useBackup && this.openai) {
        return await this.generateWithOpenAI(prompt, contentType, faithMode, options);
      }
      
      // Fallback to OpenRouter
      if (this.openrouterApiKey) {
        return await this.generateWithOpenRouter(prompt, contentType, faithMode);
      }
      
      throw new Error('No AI service available');
    } catch (error) {
      console.error('Content generation error:', error);
      
      // If primary service fails, try backup
      if (!useBackup) {
        try {
          return await this.generateContent(prompt, contentType, { ...options, useBackup: true });
        } catch (backupError) {
          console.error('Backup content generation failed:', backupError);
          return this.generateMockContent(contentType, faithMode);
        }
      }
      
      return this.generateMockContent(contentType, faithMode);
    }
  }

  // Enhanced content generation with backend integration
  async generateContentEnhanced(
    contentType: string,
    prompt: string,
    faithMode: boolean = false,
    platform?: string,
    settings?: Record<string, any>
  ): Promise<{ content: string; metadata: Record<string, any> }> {
    const startTime = Date.now();
    
    try {
      // Track generation start
      await AnalyticsTracking.trackUserAction('content_generation_started', {
        content_type: contentType,
        faith_mode: faithMode,
        platform,
      });

      // Try backend API first (for advanced features and caching)
      if (Environment.get().API_BASE_URL) {
        try {
          const contentRequest: ContentRequest = {
            type: contentType as 'text' | 'image' | 'video',
            prompt,
            faithMode,
            platform,
            settings,
          };

          const backendResponse = await BackendAPI.generateContent(contentRequest);
          
          if (backendResponse.success && backendResponse.data) {
            const generationTime = Date.now() - startTime;
            
            await AnalyticsTracking.trackContentGeneration(contentType, true, {
              generation_time_ms: generationTime,
              method: 'backend_api',
              platform,
            });

            return {
              content: backendResponse.data.content,
              metadata: backendResponse.data.metadata || {},
            };
          }
        } catch (backendError) {
          if (Environment.isDebugEnabled()) {
            console.warn('[AI Service] Backend generation failed, falling back to direct API:', backendError);
          }
        }
      }

      // Fallback to direct API calls
      let content: string;
      let method: string;

      if (this.openai && Environment.isOpenAIConfigured()) {
        content = await this.generateWithOpenAI(prompt, contentType, faithMode);
        method = 'openai_direct';
      } else if (this.openrouterApiKey) {
        content = await this.generateWithOpenRouter(prompt, contentType, faithMode);
        method = 'openrouter_direct';
      } else {
        // Use mock content if no APIs are configured and mocks are enabled
        if (Environment.areMocksEnabled()) {
          content = this.generateMockContent(contentType, faithMode);
          method = 'mock';
        } else {
          throw new Error('No AI service configured and mocks are disabled');
        }
      }

      const generationTime = Date.now() - startTime;
      
      // Track successful generation
      await AnalyticsTracking.trackContentGeneration(contentType, true, {
        generation_time_ms: generationTime,
        method,
        platform,
      });

      return {
        content,
        metadata: {
          contentType,
          faithMode,
          platform,
          generationMethod: method,
          generationTime,
          timestamp: Date.now(),
        },
      };

    } catch (error) {
      const generationTime = Date.now() - startTime;
      
      // Track failed generation
      await AnalyticsTracking.trackContentGeneration(contentType, false, {
        generation_time_ms: generationTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        platform,
      });

      await AnalyticsTracking.trackError(
        error instanceof Error ? error.message : 'Content generation failed',
        {
          content_type: contentType,
          faith_mode: faithMode,
          platform,
        }
      );

      throw error;
    }
  }

  // Generate mock content for development/testing
  private generateMockContent(contentType: string, faithMode: boolean): string {
    const mockContent = {
      social: faithMode
        ? "✨ Walking in purpose and prosperity! Remember, 'For I know the plans I have for you,' declares the Lord. Your Kingdom business is part of His divine plan! 🙏 #KingdomBusiness #FaithfulEntrepreneur"
        : "🚀 Turning dreams into reality, one step at a time! Success isn't just about the destination, it's about the journey and the impact we make along the way. What's your next big move? 💪 #Entrepreneur #Success",
      
      blog: faithMode
        ? "# Walking in Divine Purpose: Building Your Kingdom Business\n\nAs believers called to marketplace ministry, we have the incredible opportunity to impact both the spiritual and economic realms. When we align our business practices with biblical principles, we create ventures that not only generate profit but also advance God's Kingdom...\n\n*This is mock content generated for development purposes.*"
        : "# The Entrepreneur's Journey: From Vision to Victory\n\nEvery successful business starts with a vision - a clear picture of the impact you want to make in the world. But having a vision isn't enough; you need the strategy, determination, and resilience to turn that vision into reality...\n\n*This is mock content generated for development purposes.*",
      
      email: faithMode
        ? "Subject: Your Kingdom Calling in Business\n\nDear Kingdom Entrepreneur,\n\nGod has placed dreams and visions in your heart for a reason. As you build your business, remember that you're not just creating a company - you're establishing a platform for His glory and Kingdom advancement.\n\n*This is mock content - please configure your AI service for actual generation.*"
        : "Subject: Unlock Your Business Potential\n\nDear Entrepreneur,\n\nYour business has unlimited potential, and it all starts with taking the next strategic step. Whether you're just starting out or scaling to new heights, success comes from consistent action and smart decisions.\n\n*This is mock content - please configure your AI service for actual generation.*",
      
      video: faithMode
        ? "**Video Script: Kingdom Business Success**\n\n[INTRO]\nHey Kingdom entrepreneurs! Today we're talking about building businesses that honor God and create lasting impact...\n\n[MAIN CONTENT]\n- Biblical principles for business success\n- Stewarding resources with Kingdom mindset\n- Creating value that serves others\n\n*Mock video script - configure AI service for full generation*"
        : "**Video Script: Business Growth Strategies**\n\n[INTRO]\nWelcome back, entrepreneurs! Today I'm sharing the top 5 strategies that can transform your business this year...\n\n[MAIN CONTENT]\n- Strategy 1: Customer-first approach\n- Strategy 2: Data-driven decisions\n- Strategy 3: Strategic partnerships\n\n*Mock video script - configure AI service for full generation*",
      
      default: faithMode
        ? "This is mock Kingdom-focused content. In Faith Mode, your content will include biblical principles and Kingdom business perspectives. Please configure your AI service to generate actual content."
        : "This is mock business content. Your AI service will generate professional, engaging content tailored to your specific needs. Please configure your AI service to get started."
    };

    return mockContent[contentType as keyof typeof mockContent] || mockContent.default;
  }

  // Generate multiple content variations
  async generateVariations(
    prompt: string, 
    contentType: 'social' | 'email' | 'hashtags' | 'seo' | 'product',
    count: number = 3,
    options: {
      faithMode?: boolean;
      tone?: 'professional' | 'casual' | 'inspirational';
      platform?: string;
    } = {}
  ): Promise<string[]> {
    const variations: string[] = [];
    
    for (let i = 0; i < count; i++) {
      try {
        const variation = await this.generateContent(
          `${prompt} (Variation ${i + 1} - make this unique and different from previous versions)`, 
          contentType, 
          options
        );
        variations.push(variation);
      } catch (error) {
        console.error(`Failed to generate variation ${i + 1}:`, error);
        variations.push(this.generateMockContent(contentType, options.faithMode || false));
      }
    }
    
    return variations;
  }

  // Get available AI models
  getAvailableModels(): { service: string; models: string[] }[] {
    const models = [];
    
    if (this.openai) {
      models.push({
        service: 'OpenAI',
        models: ['gpt-4-turbo-preview', 'gpt-4', 'gpt-3.5-turbo']
      });
    }
    
    if (this.openrouterApiKey) {
      models.push({
        service: 'OpenRouter',
        models: ['anthropic/claude-3-haiku', 'meta-llama/llama-2-70b-chat', 'mistralai/mixtral-8x7b-instruct']
      });
    }
    
    return models;
  }

  // Check service health
  async checkServiceHealth(): Promise<{ openai: boolean; openrouter: boolean }> {
    const health = { openai: false, openrouter: false };
    
    // Test OpenAI
    if (this.openai) {
      try {
        await this.openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: "Test" }],
          max_tokens: 1,
        });
        health.openai = true;
      } catch (error) {
        console.warn('OpenAI health check failed:', error);
      }
    }
    
    // Test OpenRouter
    if (this.openrouterApiKey) {
      try {
        await axios.post(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            model: 'anthropic/claude-3-haiku',
            messages: [{ role: 'user', content: 'Test' }],
            max_tokens: 1,
          },
          {
            headers: {
              'Authorization': `Bearer ${this.openrouterApiKey}`,
              'Content-Type': 'application/json',
            }
          }
        );
        health.openrouter = true;
      } catch (error) {
        console.warn('OpenRouter health check failed:', error);
      }
    }
    
    return health;
  }
}

export default AIContentService.getInstance();

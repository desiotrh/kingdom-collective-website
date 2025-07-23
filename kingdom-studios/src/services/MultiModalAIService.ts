import { Platform } from 'react-native';
import { useTierSystem } from '../contexts/TierSystemContext';
import { useDualMode } from '../contexts/DualModeContext';

export interface AIGenerationRequest {
    prompt: string;
    contentType: 'text' | 'image' | 'text_and_image';
    platform: 'instagram' | 'facebook' | 'tiktok' | 'youtube' | 'twitter' | 'linkedin' | 'pinterest';
    tone: 'inspirational' | 'educational' | 'conversational' | 'professional' | 'playful';
    length: 'short' | 'medium' | 'long';
    imageStyle?: 'realistic' | 'artistic' | 'minimalist' | 'vintage' | 'modern';
    imageAspectRatio?: 'square' | 'portrait' | 'landscape' | 'story';
    faithMode?: boolean;
}

export interface AIGenerationResult {
    success: boolean;
    textContent?: string;
    imageUrl?: string;
    hashtags?: string[];
    error?: string;
    usage?: {
        tokens: number;
        cost: number;
    };
}

export interface GeneratedContent {
    id: string;
    textContent: string;
    imageUrl?: string;
    platform: string;
    tone: string;
    faithMode: boolean;
    createdAt: Date;
    usage: {
        tokens: number;
        cost: number;
    };
}

export class MultiModalAIService {
    private static instance: MultiModalAIService;
    private generatedContent: GeneratedContent[] = [];

    static getInstance(): MultiModalAIService {
        if (!MultiModalAIService.instance) {
            MultiModalAIService.instance = new MultiModalAIService();
        }
        return MultiModalAIService.instance;
    }

    // Main Generation Method
    async generateContent(request: AIGenerationRequest): Promise<AIGenerationResult> {
        try {
            const { checkFeatureAccess, trackUsage } = useTierSystem();
            const { isFaithMode } = useDualMode();

            // Check tier limits
            const hasAccess = await checkFeatureAccess('ai_multimodal');
            if (!hasAccess) {
                throw new Error('Multi-modal AI generation requires Commissioned tier or higher');
            }

            // Validate request
            const validation = this.validateRequest(request);
            if (!validation.isValid) {
                throw new Error(validation.error);
            }

            // Track usage
            await trackUsage('ai_generation', 'multimodal_request');

            // Generate content based on type
            let result: AIGenerationResult = { success: true };

            if (request.contentType === 'text' || request.contentType === 'text_and_image') {
                result.textContent = await this.generateTextContent(request);
                result.hashtags = await this.generateHashtags(request);
            }

            if (request.contentType === 'image' || request.contentType === 'text_and_image') {
                result.imageUrl = await this.generateImage(request);
            }

            // Calculate usage
            result.usage = this.calculateUsage(request);

            // Save generated content
            if (result.success) {
                this.saveGeneratedContent(request, result);
            }

            return result;
        } catch (error) {
            console.error('Multi-modal AI generation failed:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    // Text Generation
    private async generateTextContent(request: AIGenerationRequest): Promise<string> {
        const { isFaithMode } = useDualMode();

        // Enhanced prompts based on platform and tone
        const platformPrompts = {
            instagram: {
                inspirational: isFaithMode
                    ? "Create an inspiring Instagram post that encourages spiritual growth and Kingdom business success"
                    : "Create an inspiring Instagram post that motivates personal and professional growth",
                educational: isFaithMode
                    ? "Create an educational Instagram post about biblical business principles"
                    : "Create an educational Instagram post about business and personal development",
                conversational: isFaithMode
                    ? "Create a conversational Instagram post that shares Kingdom wisdom in a friendly tone"
                    : "Create a conversational Instagram post that engages the audience naturally",
                professional: isFaithMode
                    ? "Create a professional Instagram post about faith-based entrepreneurship"
                    : "Create a professional Instagram post about business and leadership",
                playful: isFaithMode
                    ? "Create a playful Instagram post that shares joy and Kingdom celebration"
                    : "Create a playful Instagram post that's fun and engaging",
            },
            facebook: {
                inspirational: isFaithMode
                    ? "Create an inspiring Facebook post that builds community and shares Kingdom values"
                    : "Create an inspiring Facebook post that builds community and connection",
                educational: isFaithMode
                    ? "Create an educational Facebook post about Christian business practices"
                    : "Create an educational Facebook post about business and personal development",
                conversational: isFaithMode
                    ? "Create a conversational Facebook post that encourages discussion and fellowship"
                    : "Create a conversational Facebook post that encourages discussion",
                professional: isFaithMode
                    ? "Create a professional Facebook post about faith-based business networking"
                    : "Create a professional Facebook post about business networking",
                playful: isFaithMode
                    ? "Create a playful Facebook post that brings joy and Kingdom celebration"
                    : "Create a playful Facebook post that's fun and engaging",
            },
            tiktok: {
                inspirational: isFaithMode
                    ? "Create a short, inspiring TikTok script about Kingdom success and spiritual growth"
                    : "Create a short, inspiring TikTok script about personal success",
                educational: isFaithMode
                    ? "Create a short, educational TikTok script about biblical business wisdom"
                    : "Create a short, educational TikTok script about business tips",
                conversational: isFaithMode
                    ? "Create a short, conversational TikTok script that shares Kingdom wisdom"
                    : "Create a short, conversational TikTok script that's engaging",
                professional: isFaithMode
                    ? "Create a short, professional TikTok script about faith-based entrepreneurship"
                    : "Create a short, professional TikTok script about business",
                playful: isFaithMode
                    ? "Create a short, playful TikTok script that celebrates Kingdom joy"
                    : "Create a short, playful TikTok script that's fun",
            },
        };

        const basePrompt = platformPrompts[request.platform]?.[request.tone] ||
            "Create engaging content for social media";

        const lengthGuide = {
            short: "Keep it concise and impactful (1-2 sentences)",
            medium: "Provide good detail while staying engaging (2-3 sentences)",
            long: "Be comprehensive and detailed (3-4 sentences)",
        };

        const fullPrompt = `${basePrompt}. ${lengthGuide[request.length]}. 
    Topic: ${request.prompt}
    Tone: ${request.tone}
    Platform: ${request.platform}
    ${isFaithMode ? 'Include biblical wisdom and Kingdom perspective' : 'Keep it professional and motivational'}`;

        // Simulate AI text generation
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));

        const mockResponses = {
            instagram: {
                inspirational: isFaithMode
                    ? "🌟 When we align our business with Kingdom principles, success becomes more than profit—it becomes purpose. Every decision, every interaction, every product becomes an opportunity to reflect God's love and excellence. What Kingdom principle guides your business today? #KingdomBusiness #FaithBasedSuccess #DivineExcellence"
                    : "🌟 Success isn't just about what you achieve, but who you become in the process. Every challenge is an opportunity to grow stronger, wiser, and more resilient. What's your biggest growth lesson this week? #PersonalGrowth #SuccessMindset #Resilience",
                educational: isFaithMode
                    ? "📚 Biblical business wisdom: 'The plans of the diligent lead to profit as surely as haste leads to poverty' (Proverbs 21:5). Strategic planning with Kingdom values creates sustainable success. How are you planning with purpose today? #BiblicalWisdom #StrategicPlanning #KingdomBusiness"
                    : "📚 The most successful entrepreneurs understand that knowledge is power, but applied knowledge is transformation. What new skill are you learning this month? #ContinuousLearning #BusinessGrowth #SkillDevelopment",
            },
            facebook: {
                inspirational: isFaithMode
                    ? "🙏 Today's Kingdom reflection: When we build our businesses on the foundation of faith, we create something that lasts beyond profits. Every customer interaction becomes a ministry opportunity, every product a testimony of excellence. How is your business reflecting Kingdom values? #KingdomBusiness #FaithBasedEntrepreneurship #DivineExcellence"
                    : "🙏 Building a business isn't just about making money—it's about making a difference. Every interaction, every decision, every product has the power to impact lives. How are you making a difference today? #PurposeDriven #BusinessImpact #MakingADifference",
            },
            tiktok: {
                inspirational: isFaithMode
                    ? "💫 Kingdom business tip: Start each day with prayer, end with gratitude. Your success is God's glory! #KingdomBusiness #FaithBasedSuccess"
                    : "💫 Success tip: Start each day with intention, end with reflection. Your growth is your choice! #SuccessTips #PersonalGrowth",
            },
        };

        return mockResponses[request.platform]?.[request.tone] ||
            "This is a sample generated content based on your request. The actual AI would generate unique, relevant content here.";
    }

    // Image Generation
    private async generateImage(request: AIGenerationRequest): Promise<string> {
        const { isFaithMode } = useDualMode();

        // Create image prompt based on request
        let imagePrompt = request.prompt;

        if (isFaithMode) {
            imagePrompt += " spiritual, uplifting, Kingdom-inspired, professional, high quality";
        } else {
            imagePrompt += " professional, motivational, high quality, modern";
        }

        // Add style modifiers
        if (request.imageStyle) {
            const styleModifiers = {
                realistic: "photorealistic, detailed",
                artistic: "artistic, creative, visually striking",
                minimalist: "minimalist, clean, simple",
                vintage: "vintage, retro, classic",
                modern: "modern, contemporary, sleek",
            };
            imagePrompt += `, ${styleModifiers[request.imageStyle]}`;
        }

        // Add aspect ratio for platform optimization
        const aspectRatios = {
            square: "1:1 aspect ratio",
            portrait: "4:5 aspect ratio",
            landscape: "16:9 aspect ratio",
            story: "9:16 aspect ratio",
        };

        if (request.imageAspectRatio) {
            imagePrompt += `, ${aspectRatios[request.imageAspectRatio]}`;
        }

        // Simulate image generation
        await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));

        // Return mock image URL (in production, this would be from OpenAI/DALL-E or Replicate)
        return `https://example.com/generated-images/${Date.now()}.jpg`;
    }

    // Hashtag Generation
    private async generateHashtags(request: AIGenerationRequest): Promise<string[]> {
        const { isFaithMode } = useDualMode();

        const baseHashtags = {
            instagram: ['#socialmedia', '#contentcreation', '#digitalmarketing'],
            facebook: ['#business', '#entrepreneurship', '#networking'],
            tiktok: ['#tiktok', '#viral', '#trending'],
            youtube: ['#youtube', '#content', '#creator'],
            twitter: ['#twitter', '#social', '#engagement'],
            linkedin: ['#linkedin', '#professional', '#networking'],
            pinterest: ['#pinterest', '#inspiration', '#creative'],
        };

        const faithHashtags = {
            instagram: ['#kingdombusiness', '#faithbased', '#divineexcellence'],
            facebook: ['#christianbusiness', '#kingdomentrepreneur', '#faithdriven'],
            tiktok: ['#kingdomtiktok', '#faithcontent', '#spiritualgrowth'],
            youtube: ['#kingdomcontent', '#christiancreator', '#faithbased'],
            twitter: ['#kingdomtwitter', '#faithbased', '#christianbusiness'],
            linkedin: ['#christianentrepreneur', '#faithbasedbusiness', '#kingdomnetworking'],
            pinterest: ['#kingdominspiration', '#faithbased', '#christiancreative'],
        };

        const toneHashtags = {
            inspirational: ['#motivation', '#inspiration', '#growth'],
            educational: ['#learning', '#education', '#knowledge'],
            conversational: ['#community', '#engagement', '#connection'],
            professional: ['#professional', '#business', '#leadership'],
            playful: ['#fun', '#joy', '#positivity'],
        };

        let hashtags = [
            ...baseHashtags[request.platform] || [],
            ...toneHashtags[request.tone] || [],
        ];

        if (isFaithMode) {
            hashtags = [
                ...faithHashtags[request.platform] || [],
                ...hashtags,
            ];
        }

        // Add some random trending hashtags
        const trendingHashtags = ['#viral', '#trending', '#fyp', '#explore'];
        hashtags.push(...trendingHashtags.slice(0, 2));

        return hashtags.slice(0, 10); // Limit to 10 hashtags
    }

    // Validation
    private validateRequest(request: AIGenerationRequest): { isValid: boolean; error?: string } {
        if (!request.prompt || request.prompt.trim().length === 0) {
            return { isValid: false, error: 'Prompt is required' };
        }

        if (request.prompt.length > 1000) {
            return { isValid: false, error: 'Prompt cannot exceed 1000 characters' };
        }

        if (!['text', 'image', 'text_and_image'].includes(request.contentType)) {
            return { isValid: false, error: 'Invalid content type' };
        }

        if (!['instagram', 'facebook', 'tiktok', 'youtube', 'twitter', 'linkedin', 'pinterest'].includes(request.platform)) {
            return { isValid: false, error: 'Invalid platform' };
        }

        if (!['inspirational', 'educational', 'conversational', 'professional', 'playful'].includes(request.tone)) {
            return { isValid: false, error: 'Invalid tone' };
        }

        if (!['short', 'medium', 'long'].includes(request.length)) {
            return { isValid: false, error: 'Invalid length' };
        }

        return { isValid: true };
    }

    // Usage Calculation
    private calculateUsage(request: AIGenerationRequest): { tokens: number; cost: number } {
        let tokens = 0;
        let cost = 0;

        // Base tokens for prompt processing
        tokens += request.prompt.length * 0.1;

        // Additional tokens based on content type
        if (request.contentType === 'text' || request.contentType === 'text_and_image') {
            tokens += 500; // Estimated tokens for text generation
            cost += 0.02; // Estimated cost for text generation
        }

        if (request.contentType === 'image' || request.contentType === 'text_and_image') {
            tokens += 1000; // Estimated tokens for image generation
            cost += 0.10; // Estimated cost for image generation
        }

        return { tokens: Math.round(tokens), cost: Math.round(cost * 100) / 100 };
    }

    // Save Generated Content
    private saveGeneratedContent(request: AIGenerationRequest, result: AIGenerationResult): void {
        if (!result.success || !result.textContent) return;

        const content: GeneratedContent = {
            id: `content_${Date.now()}`,
            textContent: result.textContent,
            imageUrl: result.imageUrl,
            platform: request.platform,
            tone: request.tone,
            faithMode: request.faithMode || false,
            createdAt: new Date(),
            usage: result.usage || { tokens: 0, cost: 0 },
        };

        this.generatedContent.push(content);
    }

    // Get Generated Content History
    getGeneratedContent(): GeneratedContent[] {
        return [...this.generatedContent].reverse();
    }

    // Delete Generated Content
    deleteGeneratedContent(contentId: string): boolean {
        const index = this.generatedContent.findIndex(content => content.id === contentId);
        if (index !== -1) {
            this.generatedContent.splice(index, 1);
            return true;
        }
        return false;
    }

    // Get Usage Statistics
    getUsageStatistics(): {
        totalGenerations: number;
        totalTokens: number;
        totalCost: number;
        averageTokensPerGeneration: number;
    } {
        const totalGenerations = this.generatedContent.length;
        const totalTokens = this.generatedContent.reduce((sum, content) => sum + content.usage.tokens, 0);
        const totalCost = this.generatedContent.reduce((sum, content) => sum + content.usage.cost, 0);
        const averageTokensPerGeneration = totalGenerations > 0 ? totalTokens / totalGenerations : 0;

        return {
            totalGenerations,
            totalTokens,
            totalCost,
            averageTokensPerGeneration: Math.round(averageTokensPerGeneration),
        };
    }

    // Platform-Specific Optimization
    getPlatformOptimization(platform: string): {
        recommendedImageSize: string;
        recommendedTextLength: number;
        recommendedHashtagCount: number;
        bestPostingTimes: string[];
    } {
        const optimizations = {
            instagram: {
                recommendedImageSize: '1080x1080',
                recommendedTextLength: 2200,
                recommendedHashtagCount: 30,
                bestPostingTimes: ['9:00 AM', '12:00 PM', '3:00 PM', '7:00 PM'],
            },
            facebook: {
                recommendedImageSize: '1200x630',
                recommendedTextLength: 63206,
                recommendedHashtagCount: 5,
                bestPostingTimes: ['9:00 AM', '1:00 PM', '3:00 PM', '7:00 PM'],
            },
            tiktok: {
                recommendedImageSize: '1080x1920',
                recommendedTextLength: 150,
                recommendedHashtagCount: 5,
                bestPostingTimes: ['12:00 PM', '5:00 PM', '7:00 PM', '9:00 PM'],
            },
            youtube: {
                recommendedImageSize: '1280x720',
                recommendedTextLength: 5000,
                recommendedHashtagCount: 15,
                bestPostingTimes: ['2:00 PM', '6:00 PM', '8:00 PM'],
            },
            twitter: {
                recommendedImageSize: '1200x675',
                recommendedTextLength: 280,
                recommendedHashtagCount: 3,
                bestPostingTimes: ['8:00 AM', '12:00 PM', '5:00 PM'],
            },
            linkedin: {
                recommendedImageSize: '1200x627',
                recommendedTextLength: 3000,
                recommendedHashtagCount: 5,
                bestPostingTimes: ['8:00 AM', '10:00 AM', '12:00 PM', '5:00 PM'],
            },
            pinterest: {
                recommendedImageSize: '1000x1500',
                recommendedTextLength: 500,
                recommendedHashtagCount: 20,
                bestPostingTimes: ['2:00 PM', '8:00 PM', '9:00 PM'],
            },
        };

        return optimizations[platform] || optimizations.instagram;
    }
}

export default MultiModalAIService.getInstance(); 
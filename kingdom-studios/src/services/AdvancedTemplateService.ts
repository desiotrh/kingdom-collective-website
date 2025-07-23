import { Platform } from 'react-native';
import { useTierSystem } from '../contexts/TierSystemContext';
import { useDualMode } from '../contexts/DualModeContext';

export interface ContentTemplate {
    id: string;
    title: string;
    description: string;
    content: string;
    category: TemplateCategory;
    platforms: SocialPlatform[];
    tone: TemplateTone;
    length: 'short' | 'medium' | 'long';
    faithMode: boolean;
    tags: string[];
    usageCount: number;
    createdAt: Date;
    updatedAt: Date;
    isPremium: boolean;
    tierRequired: 'seed' | 'rooted' | 'commissioned' | 'mantled_pro' | 'kingdom_enterprise';
}

export type TemplateCategory =
    | 'business'
    | 'faith'
    | 'motivation'
    | 'marketing'
    | 'personal_brand'
    | 'product_promotion'
    | 'testimonial'
    | 'educational'
    | 'community'
    | 'celebration';

export type TemplateTone =
    | 'inspirational'
    | 'educational'
    | 'conversational'
    | 'professional'
    | 'playful'
    | 'encouraging'
    | 'authoritative'
    | 'friendly';

export type SocialPlatform =
    | 'instagram'
    | 'facebook'
    | 'tiktok'
    | 'youtube'
    | 'twitter'
    | 'linkedin'
    | 'pinterest';

export interface TemplateFilter {
    category?: TemplateCategory;
    platforms?: SocialPlatform[];
    tone?: TemplateTone;
    length?: 'short' | 'medium' | 'long';
    faithMode?: boolean;
    isPremium?: boolean;
    searchTerm?: string;
}

export interface TemplateUsage {
    templateId: string;
    usedAt: Date;
    platform: SocialPlatform;
    modifiedContent?: string;
}

export class AdvancedTemplateService {
    private static instance: AdvancedTemplateService;
    private templates: ContentTemplate[] = [];
    private templateUsage: TemplateUsage[] = [];

    static getInstance(): AdvancedTemplateService {
        if (!AdvancedTemplateService.instance) {
            AdvancedTemplateService.instance = new AdvancedTemplateService();
            AdvancedTemplateService.instance.initializeTemplates();
        }
        return AdvancedTemplateService.instance;
    }

    private initializeTemplates(): void {
        this.templates = [
            // Business Templates
            {
                id: 'business_launch_announcement',
                title: 'Business Launch Announcement',
                description: 'Announce your new business or product launch with excitement and professionalism',
                content: "🚀 Exciting news! I'm thrilled to announce the launch of [Business Name]. After months of preparation and prayer, we're finally ready to serve our community with [Key Benefit]. This isn't just about business—it's about making a difference. Join us on this journey! #NewBusiness #Entrepreneurship #MakingADifference",
                category: 'business',
                platforms: ['instagram', 'facebook', 'linkedin'],
                tone: 'professional',
                length: 'medium',
                faithMode: true,
                tags: ['business', 'launch', 'announcement', 'entrepreneurship'],
                usageCount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
                isPremium: false,
                tierRequired: 'seed',
            },
            {
                id: 'business_launch_announcement_encouragement',
                title: 'Business Launch Announcement',
                description: 'Announce your new business or product launch with excitement and professionalism',
                content: "🚀 Exciting news! I'm thrilled to announce the launch of [Business Name]. After months of preparation and dedication, we're finally ready to serve our community with [Key Benefit]. This isn't just about business—it's about making a difference. Join us on this journey! #NewBusiness #Entrepreneurship #MakingADifference",
                category: 'business',
                platforms: ['instagram', 'facebook', 'linkedin'],
                tone: 'professional',
                length: 'medium',
                faithMode: false,
                tags: ['business', 'launch', 'announcement', 'entrepreneurship'],
                usageCount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
                isPremium: false,
                tierRequired: 'seed',
            },

            // Faith Templates
            {
                id: 'scripture_inspired_business',
                title: 'Scripture-Inspired Business Wisdom',
                description: 'Share biblical wisdom applied to business and entrepreneurship',
                content: "📖 'Commit your work to the Lord, and your plans will be established' - Proverbs 16:3\n\nWhen we align our business decisions with Kingdom principles, success becomes more than profit—it becomes purpose. Every client interaction, every product, every decision becomes an opportunity to reflect God's excellence. How are you committing your work to the Lord today? #KingdomBusiness #BiblicalWisdom #FaithBasedSuccess",
                category: 'faith',
                platforms: ['instagram', 'facebook', 'linkedin'],
                tone: 'inspirational',
                length: 'medium',
                faithMode: true,
                tags: ['faith', 'scripture', 'business', 'kingdom'],
                usageCount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
                isPremium: false,
                tierRequired: 'seed',
            },

            // Motivation Templates
            {
                id: 'daily_encouragement',
                title: 'Daily Encouragement',
                description: 'Start your day with positive motivation and encouragement',
                content: "☀️ Good morning! Today is a new opportunity to create something amazing. Whether you're building a business, pursuing a dream, or simply showing up for your life, remember that every step forward counts. You have what it takes to succeed. Let's make today incredible! #MorningMotivation #DailyEncouragement #YouGotThis",
                category: 'motivation',
                platforms: ['instagram', 'facebook', 'tiktok'],
                tone: 'encouraging',
                length: 'short',
                faithMode: false,
                tags: ['motivation', 'encouragement', 'daily', 'positive'],
                usageCount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
                isPremium: false,
                tierRequired: 'seed',
            },
            {
                id: 'daily_encouragement_faith',
                title: 'Daily Kingdom Encouragement',
                description: 'Start your day with faith-based motivation and Kingdom perspective',
                content: "☀️ Good morning! 'This is the day that the Lord has made; let us rejoice and be glad in it' - Psalm 118:24\n\nToday is a gift from God, filled with opportunities to grow, serve, and shine His light. Whether you're building a Kingdom business or pursuing God's purpose for your life, remember that He is with you every step. Let's make today count for His glory! #KingdomMorning #FaithBasedMotivation #DivinePurpose",
                category: 'motivation',
                platforms: ['instagram', 'facebook', 'tiktok'],
                tone: 'encouraging',
                length: 'short',
                faithMode: true,
                tags: ['faith', 'motivation', 'encouragement', 'kingdom'],
                usageCount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
                isPremium: false,
                tierRequired: 'seed',
            },

            // Marketing Templates
            {
                id: 'product_showcase',
                title: 'Product Showcase',
                description: 'Highlight your product or service with compelling copy',
                content: "✨ Introducing [Product/Service Name] - the solution you've been waiting for!\n\n🌟 Key Benefits:\n• [Benefit 1]\n• [Benefit 2]\n• [Benefit 3]\n\n🎯 Perfect for [Target Audience]\n💡 [Unique Value Proposition]\n\nReady to transform your [Problem Area]? Click the link in bio to learn more! #ProductLaunch #Innovation #Solution",
                category: 'marketing',
                platforms: ['instagram', 'facebook', 'linkedin'],
                tone: 'professional',
                length: 'medium',
                faithMode: false,
                tags: ['marketing', 'product', 'showcase', 'sales'],
                usageCount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
                isPremium: true,
                tierRequired: 'rooted',
            },

            // Personal Brand Templates
            {
                id: 'behind_the_scenes',
                title: 'Behind the Scenes',
                description: 'Share your journey and build authentic connections',
                content: "📸 Behind the scenes of [Your Business/Project]\n\nThis is where the magic happens! From late-night planning sessions to breakthrough moments, every step of this journey has been incredible. Here's what I've learned: [Key Insight]\n\nWhat's your behind-the-scenes story? Share in the comments! #BehindTheScenes #Authenticity #Journey",
                category: 'personal_brand',
                platforms: ['instagram', 'facebook', 'tiktok'],
                tone: 'conversational',
                length: 'short',
                faithMode: false,
                tags: ['behind_the_scenes', 'authenticity', 'journey', 'personal'],
                usageCount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
                isPremium: false,
                tierRequired: 'seed',
            },

            // Educational Templates
            {
                id: 'business_tip',
                title: 'Business Tip',
                description: 'Share valuable business insights and tips',
                content: "💡 Business Tip of the Day:\n\n[Specific Tip or Insight]\n\nWhy this matters: [Explanation]\n\nPro tip: [Additional Advice]\n\nWhat's your favorite business tip? Share below! #BusinessTips #Entrepreneurship #Learning",
                category: 'educational',
                platforms: ['instagram', 'facebook', 'linkedin'],
                tone: 'educational',
                length: 'short',
                faithMode: false,
                tags: ['education', 'business', 'tips', 'learning'],
                usageCount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
                isPremium: false,
                tierRequired: 'seed',
            },

            // Community Templates
            {
                id: 'community_question',
                title: 'Community Question',
                description: 'Engage your audience with thought-provoking questions',
                content: "🤔 Community Question:\n\n[Thought-provoking question related to your niche]\n\nI'd love to hear your thoughts! Drop your answer in the comments below.\n\nLet's learn from each other! #CommunityEngagement #Discussion #LearningTogether",
                category: 'community',
                platforms: ['instagram', 'facebook', 'linkedin'],
                tone: 'conversational',
                length: 'short',
                faithMode: false,
                tags: ['community', 'engagement', 'discussion', 'question'],
                usageCount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
                isPremium: false,
                tierRequired: 'seed',
            },

            // Premium Templates (Higher Tiers)
            {
                id: 'video_script_premium',
                title: 'Video Script Template',
                description: 'Professional video script template for YouTube and TikTok',
                content: "🎬 Video Script: [Topic]\n\nHook (0-5 seconds):\n[Attention-grabbing opening]\n\nIntroduction (5-15 seconds):\n[Brief intro and value proposition]\n\nMain Content (15-45 seconds):\n[Key points and insights]\n\nCall to Action (45-60 seconds):\n[Clear next steps for viewers]\n\n#VideoContent #ScriptWriting #ContentCreation",
                category: 'educational',
                platforms: ['youtube', 'tiktok'],
                tone: 'professional',
                length: 'long',
                faithMode: false,
                tags: ['video', 'script', 'content', 'premium'],
                usageCount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
                isPremium: true,
                tierRequired: 'commissioned',
            },
        ];
    }

    // Get Templates with Filtering
    async getTemplates(filter: TemplateFilter = {}): Promise<ContentTemplate[]> {
        const { currentTier } = useTierSystem();
        const { isFaithMode } = useDualMode();

        let filteredTemplates = this.templates.filter(template => {
            // Tier access check
            const tierOrder = ['seed', 'rooted', 'commissioned', 'mantled_pro', 'kingdom_enterprise'];
            const templateTierIndex = tierOrder.indexOf(template.tierRequired);
            const userTierIndex = tierOrder.indexOf(currentTier);

            if (userTierIndex < templateTierIndex) {
                return false;
            }

            // Category filter
            if (filter.category && template.category !== filter.category) {
                return false;
            }

            // Platform filter
            if (filter.platforms && filter.platforms.length > 0) {
                const hasMatchingPlatform = filter.platforms.some(platform =>
                    template.platforms.includes(platform)
                );
                if (!hasMatchingPlatform) {
                    return false;
                }
            }

            // Tone filter
            if (filter.tone && template.tone !== filter.tone) {
                return false;
            }

            // Length filter
            if (filter.length && template.length !== filter.length) {
                return false;
            }

            // Faith mode filter
            if (filter.faithMode !== undefined && template.faithMode !== filter.faithMode) {
                return false;
            }

            // Premium filter
            if (filter.isPremium !== undefined && template.isPremium !== filter.isPremium) {
                return false;
            }

            // Search term filter
            if (filter.searchTerm) {
                const searchLower = filter.searchTerm.toLowerCase();
                const matchesSearch =
                    template.title.toLowerCase().includes(searchLower) ||
                    template.description.toLowerCase().includes(searchLower) ||
                    template.content.toLowerCase().includes(searchLower) ||
                    template.tags.some(tag => tag.toLowerCase().includes(searchLower));

                if (!matchesSearch) {
                    return false;
                }
            }

            return true;
        });

        // Sort by usage count (most popular first)
        filteredTemplates.sort((a, b) => b.usageCount - a.usageCount);

        return filteredTemplates;
    }

    // Get Template Categories
    getTemplateCategories(): { category: TemplateCategory; count: number; description: string }[] {
        const categories = [
            { category: 'business', description: 'Professional business content and announcements' },
            { category: 'faith', description: 'Scripture-inspired and Kingdom-focused content' },
            { category: 'motivation', description: 'Encouraging and uplifting content' },
            { category: 'marketing', description: 'Product promotion and sales content' },
            { category: 'personal_brand', description: 'Authentic personal branding content' },
            { category: 'product_promotion', description: 'Product showcases and features' },
            { category: 'testimonial', description: 'Customer success stories and reviews' },
            { category: 'educational', description: 'Teaching and learning content' },
            { category: 'community', description: 'Community engagement and discussion' },
            { category: 'celebration', description: 'Milestones and celebration content' },
        ];

        return categories.map(cat => ({
            ...cat,
            count: this.templates.filter(t => t.category === cat.category).length,
        }));
    }

    // Get Template by ID
    getTemplateById(templateId: string): ContentTemplate | null {
        return this.templates.find(template => template.id === templateId) || null;
    }

    // Use Template
    async useTemplate(templateId: string, platform: SocialPlatform, modifiedContent?: string): Promise<boolean> {
        try {
            const template = this.getTemplateById(templateId);
            if (!template) {
                throw new Error('Template not found');
            }

            // Check tier access
            const { currentTier, checkFeatureAccess } = useTierSystem();
            const tierOrder = ['seed', 'rooted', 'commissioned', 'mantled_pro', 'kingdom_enterprise'];
            const templateTierIndex = tierOrder.indexOf(template.tierRequired);
            const userTierIndex = tierOrder.indexOf(currentTier);

            if (userTierIndex < templateTierIndex) {
                throw new Error(`This template requires ${template.tierRequired} tier or higher`);
            }

            // Update usage count
            template.usageCount++;
            template.updatedAt = new Date();

            // Record usage
            const usage: TemplateUsage = {
                templateId,
                usedAt: new Date(),
                platform,
                modifiedContent,
            };
            this.templateUsage.push(usage);

            // Track usage for analytics
            await checkFeatureAccess('template_usage');

            return true;
        } catch (error) {
            console.error('Failed to use template:', error);
            return false;
        }
    }

    // Create Custom Template
    async createCustomTemplate(template: Omit<ContentTemplate, 'id' | 'usageCount' | 'createdAt' | 'updatedAt'>): Promise<string> {
        try {
            const { currentTier, checkFeatureAccess } = useTierSystem();

            // Check if user can create custom templates
            const hasAccess = await checkFeatureAccess('custom_templates');
            if (!hasAccess) {
                throw new Error('Custom template creation requires Commissioned tier or higher');
            }

            const newTemplate: ContentTemplate = {
                ...template,
                id: `custom_${Date.now()}`,
                usageCount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            this.templates.push(newTemplate);
            return newTemplate.id;
        } catch (error) {
            console.error('Failed to create custom template:', error);
            throw error;
        }
    }

    // Update Template
    async updateTemplate(templateId: string, updates: Partial<ContentTemplate>): Promise<boolean> {
        try {
            const template = this.getTemplateById(templateId);
            if (!template) {
                throw new Error('Template not found');
            }

            // Check if user can edit templates
            const { checkFeatureAccess } = useTierSystem();
            const hasAccess = await checkFeatureAccess('template_editing');
            if (!hasAccess) {
                throw new Error('Template editing requires Mantled Pro tier or higher');
            }

            Object.assign(template, updates);
            template.updatedAt = new Date();

            return true;
        } catch (error) {
            console.error('Failed to update template:', error);
            return false;
        }
    }

    // Delete Template
    async deleteTemplate(templateId: string): Promise<boolean> {
        try {
            const template = this.getTemplateById(templateId);
            if (!template) {
                throw new Error('Template not found');
            }

            // Only allow deletion of custom templates
            if (!templateId.startsWith('custom_')) {
                throw new Error('Only custom templates can be deleted');
            }

            const index = this.templates.findIndex(t => t.id === templateId);
            if (index !== -1) {
                this.templates.splice(index, 1);
                return true;
            }

            return false;
        } catch (error) {
            console.error('Failed to delete template:', error);
            return false;
        }
    }

    // Get Template Usage Statistics
    getTemplateUsageStats(): {
        totalTemplates: number;
        totalUsage: number;
        mostUsedTemplate: ContentTemplate | null;
        usageByCategory: Record<TemplateCategory, number>;
        usageByPlatform: Record<SocialPlatform, number>;
    } {
        const totalTemplates = this.templates.length;
        const totalUsage = this.templates.reduce((sum, template) => sum + template.usageCount, 0);
        const mostUsedTemplate = this.templates.reduce((max, template) =>
            template.usageCount > max.usageCount ? template : max
            , this.templates[0] || null);

        const usageByCategory = this.templates.reduce((acc, template) => {
            acc[template.category] = (acc[template.category] || 0) + template.usageCount;
            return acc;
        }, {} as Record<TemplateCategory, number>);

        const usageByPlatform = this.templateUsage.reduce((acc, usage) => {
            acc[usage.platform] = (acc[usage.platform] || 0) + 1;
            return acc;
        }, {} as Record<SocialPlatform, number>);

        return {
            totalTemplates,
            totalUsage,
            mostUsedTemplate,
            usageByCategory,
            usageByPlatform,
        };
    }

    // Get Platform-Specific Templates
    getTemplatesForPlatform(platform: SocialPlatform): ContentTemplate[] {
        return this.templates.filter(template => template.platforms.includes(platform));
    }

    // Get Faith Mode Templates
    getFaithModeTemplates(): ContentTemplate[] {
        return this.templates.filter(template => template.faithMode);
    }

    // Get Premium Templates
    getPremiumTemplates(): ContentTemplate[] {
        return this.templates.filter(template => template.isPremium);
    }

    // Search Templates
    searchTemplates(searchTerm: string): ContentTemplate[] {
        const searchLower = searchTerm.toLowerCase();
        return this.templates.filter(template =>
            template.title.toLowerCase().includes(searchLower) ||
            template.description.toLowerCase().includes(searchLower) ||
            template.content.toLowerCase().includes(searchLower) ||
            template.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
    }

    // Get Template Recommendations
    getTemplateRecommendations(platform: SocialPlatform, category?: TemplateCategory): ContentTemplate[] {
        let recommendations = this.templates.filter(template =>
            template.platforms.includes(platform)
        );

        if (category) {
            recommendations = recommendations.filter(template => template.category === category);
        }

        // Sort by usage count and return top 5
        return recommendations
            .sort((a, b) => b.usageCount - a.usageCount)
            .slice(0, 5);
    }
}

export default AdvancedTemplateService.getInstance(); 
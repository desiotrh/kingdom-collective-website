/**
 * 📊 Business Intelligence & Strategy Service
 * Market trend scanner, content strategy AI, audience behavior dashboard, growth tools suite
 */

import { Platform } from 'react-native';

export interface MarketTrend {
    id: string;
    topic: string;
    category: string;
    trendScore: number;
    growthRate: number;
    volume: number;
    sentiment: 'positive' | 'neutral' | 'negative';
    relatedHashtags: string[];
    influencers: string[];
    contentIdeas: string[];
    faithRelevance?: number;
    opportunity: 'high' | 'medium' | 'low';
}

export interface ContentStrategy {
    id: string;
    userId: string;
    period: 'weekly' | 'monthly' | 'quarterly';
    themes: ContentTheme[];
    topics: ContentTopic[];
    schedule: ContentSchedule;
    goals: ContentGoal[];
    performance: ContentPerformance;
}

export interface ContentTheme {
    id: string;
    name: string;
    description: string;
    hashtags: string[];
    platforms: string[];
    targetAudience: string[];
    faithMode: boolean;
    seasonalRelevance: number;
}

export interface ContentTopic {
    id: string;
    title: string;
    description: string;
    category: string;
    trendingScore: number;
    difficulty: 'easy' | 'medium' | 'hard';
    estimatedEngagement: number;
    faithAlignment?: number;
    contentIdeas: string[];
}

export interface ContentSchedule {
    weeklyPlan: WeeklyContentPlan[];
    optimalTimes: OptimalTime[];
    frequency: ContentFrequency;
    automation: ContentAutomation;
}

export interface WeeklyContentPlan {
    day: string;
    contentTypes: string[];
    themes: string[];
    platforms: string[];
    estimatedTime: number;
}

export interface OptimalTime {
    platform: string;
    dayOfWeek: string;
    timeSlots: string[];
    engagementRate: number;
}

export interface ContentFrequency {
    postsPerDay: number;
    storiesPerDay: number;
    reelsPerWeek: number;
    livesPerMonth: number;
}

export interface ContentAutomation {
    enabled: boolean;
    autoPosting: boolean;
    autoHashtags: boolean;
    autoScheduling: boolean;
    autoEngagement: boolean;
}

export interface ContentGoal {
    id: string;
    name: string;
    type: 'reach' | 'engagement' | 'conversion' | 'growth';
    target: number;
    current: number;
    deadline: Date;
    progress: number;
}

export interface ContentPerformance {
    totalPosts: number;
    averageEngagement: number;
    reachGrowth: number;
    followerGrowth: number;
    topPerformingContent: TopContent[];
}

export interface TopContent {
    id: string;
    title: string;
    platform: string;
    engagement: number;
    reach: number;
    shares: number;
    comments: number;
}

export interface AudienceBehavior {
    userId: string;
    segments: AudienceSegment[];
    insights: AudienceInsight[];
    patterns: BehaviorPattern[];
    recommendations: AudienceRecommendation[];
}

export interface AudienceSegment {
    id: string;
    name: string;
    size: number;
    demographics: Demographics;
    interests: string[];
    behavior: SegmentBehavior;
    engagement: SegmentEngagement;
    value: number;
}

export interface Demographics {
    ageRanges: { [key: string]: number };
    genders: { [key: string]: number };
    locations: { [key: string]: number };
    languages: { [key: string]: number };
}

export interface SegmentBehavior {
    activeHours: { [key: string]: number };
    preferredContent: string[];
    engagementRate: number;
    retentionRate: number;
    churnRisk: number;
}

export interface SegmentEngagement {
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    clicks: number;
}

export interface AudienceInsight {
    id: string;
    type: 'demographic' | 'behavioral' | 'engagement' | 'trend';
    title: string;
    description: string;
    data: any;
    impact: number;
    confidence: number;
}

export interface BehaviorPattern {
    id: string;
    pattern: string;
    frequency: number;
    users: number;
    context: string;
    opportunity: string;
}

export interface AudienceRecommendation {
    id: string;
    type: 'content' | 'timing' | 'platform' | 'engagement';
    title: string;
    description: string;
    impact: number;
    implementation: string;
    priority: 'low' | 'medium' | 'high';
}

export interface GrowthToolsSuite {
    userId: string;
    tools: GrowthTool[];
    strategies: GrowthStrategy[];
    campaigns: GrowthCampaign[];
    metrics: GrowthMetrics;
}

export interface GrowthTool {
    id: string;
    name: string;
    category: 'content' | 'engagement' | 'monetization' | 'analytics';
    description: string;
    isEnabled: boolean;
    effectiveness: number;
    usage: number;
    recommendations: string[];
}

export interface GrowthStrategy {
    id: string;
    name: string;
    type: 'organic' | 'paid' | 'collaboration' | 'viral';
    description: string;
    target: number;
    current: number;
    timeline: number; // days
    resources: string[];
    successRate: number;
}

export interface GrowthCampaign {
    id: string;
    name: string;
    type: 'hashtag' | 'challenge' | 'collaboration' | 'giveaway';
    status: 'planning' | 'active' | 'completed' | 'paused';
    startDate: Date;
    endDate: Date;
    budget: number;
    results: CampaignResults;
}

export interface CampaignResults {
    reach: number;
    engagement: number;
    conversions: number;
    cost: number;
    roi: number;
    participants: number;
}

export interface GrowthMetrics {
    followers: number;
    engagement: number;
    reach: number;
    conversions: number;
    revenue: number;
    growthRate: number;
    viralCoefficient: number;
}

class BusinessIntelligenceService {
    private apiKey: string;
    private baseUrl: string;
    private currentUserId: string;

    constructor() {
        this.apiKey = process.env.EXPO_PUBLIC_BI_API_KEY || '';
        this.baseUrl = process.env.EXPO_PUBLIC_BI_BASE_URL || 'https://api.kingdomstudios.com/bi';
        this.currentUserId = '';
    }

    setCurrentUser(userId: string) {
        this.currentUserId = userId;
    }

    // ==============================
    // 📈 MARKET TREND SCANNER
    // ==============================

    async getMarketTrends(category?: string): Promise<MarketTrend[]> {
        try {
            const url = category
                ? `${this.baseUrl}/trends?category=${category}`
                : `${this.baseUrl}/trends`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to get market trends: ${response.status}`);
            }

            const data = await response.json();
            return data.trends || this.getMockMarketTrends();
        } catch (error) {
            console.error('Get market trends error:', error);
            return this.getMockMarketTrends();
        }
    }

    async getTrendingTopics(platform: string): Promise<string[]> {
        try {
            const response = await fetch(`${this.baseUrl}/trends/platforms/${platform}`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to get trending topics: ${response.status}`);
            }

            const data = await response.json();
            return data.topics || [
                'faith journey',
                'daily devotion',
                'bible study',
                'prayer life',
                'christian community',
            ];
        } catch (error) {
            console.error('Get trending topics error:', error);
            return [
                'faith journey',
                'daily devotion',
                'bible study',
                'prayer life',
                'christian community',
            ];
        }
    }

    async analyzeTrendOpportunity(trendId: string): Promise<any> {
        try {
            const response = await fetch(`${this.baseUrl}/trends/${trendId}/opportunity`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to analyze trend opportunity: ${response.status}`);
            }

            const data = await response.json();
            return data.analysis || {
                opportunity: 'high',
                estimatedReach: 50000,
                competition: 'medium',
                contentIdeas: [
                    'Share personal testimony',
                    'Create educational content',
                    'Start a discussion',
                ],
            };
        } catch (error) {
            console.error('Analyze trend opportunity error:', error);
            return {
                opportunity: 'high',
                estimatedReach: 50000,
                competition: 'medium',
                contentIdeas: [
                    'Share personal testimony',
                    'Create educational content',
                    'Start a discussion',
                ],
            };
        }
    }

    // ==============================
    // 🤖 CONTENT STRATEGY AI
    // ==============================

    async generateContentStrategy(period: string = 'weekly'): Promise<ContentStrategy> {
        try {
            const response = await fetch(`${this.baseUrl}/content-strategy/generate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    period,
                    userId: this.currentUserId,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to generate content strategy: ${response.status}`);
            }

            const data = await response.json();
            return data.strategy || this.getMockContentStrategy();
        } catch (error) {
            console.error('Generate content strategy error:', error);
            return this.getMockContentStrategy();
        }
    }

    async getContentThemes(): Promise<ContentTheme[]> {
        try {
            const response = await fetch(`${this.baseUrl}/content-strategy/themes`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to get content themes: ${response.status}`);
            }

            const data = await response.json();
            return data.themes || this.getMockContentThemes();
        } catch (error) {
            console.error('Get content themes error:', error);
            return this.getMockContentThemes();
        }
    }

    async getContentTopics(category?: string): Promise<ContentTopic[]> {
        try {
            const url = category
                ? `${this.baseUrl}/content-strategy/topics?category=${category}`
                : `${this.baseUrl}/content-strategy/topics`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to get content topics: ${response.status}`);
            }

            const data = await response.json();
            return data.topics || this.getMockContentTopics();
        } catch (error) {
            console.error('Get content topics error:', error);
            return this.getMockContentTopics();
        }
    }

    async updateContentStrategy(strategyId: string, updates: Partial<ContentStrategy>): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/content-strategy/${strategyId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            });

            return response.ok;
        } catch (error) {
            console.error('Update content strategy error:', error);
            return false;
        }
    }

    // ==============================
    // 👥 AUDIENCE BEHAVIOR DASHBOARD
    // ==============================

    async getAudienceBehavior(userId?: string): Promise<AudienceBehavior> {
        try {
            const targetUserId = userId || this.currentUserId;
            const response = await fetch(`${this.baseUrl}/audience/${targetUserId}`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to get audience behavior: ${response.status}`);
            }

            const data = await response.json();
            return data.behavior || this.getMockAudienceBehavior();
        } catch (error) {
            console.error('Get audience behavior error:', error);
            return this.getMockAudienceBehavior();
        }
    }

    async getAudienceSegments(): Promise<AudienceSegment[]> {
        try {
            const response = await fetch(`${this.baseUrl}/audience/segments`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to get audience segments: ${response.status}`);
            }

            const data = await response.json();
            return data.segments || this.getMockAudienceSegments();
        } catch (error) {
            console.error('Get audience segments error:', error);
            return this.getMockAudienceSegments();
        }
    }

    async getAudienceInsights(): Promise<AudienceInsight[]> {
        try {
            const response = await fetch(`${this.baseUrl}/audience/insights`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to get audience insights: ${response.status}`);
            }

            const data = await response.json();
            return data.insights || this.getMockAudienceInsights();
        } catch (error) {
            console.error('Get audience insights error:', error);
            return this.getMockAudienceInsights();
        }
    }

    async getBehaviorPatterns(): Promise<BehaviorPattern[]> {
        try {
            const response = await fetch(`${this.baseUrl}/audience/patterns`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to get behavior patterns: ${response.status}`);
            }

            const data = await response.json();
            return data.patterns || this.getMockBehaviorPatterns();
        } catch (error) {
            console.error('Get behavior patterns error:', error);
            return this.getMockBehaviorPatterns();
        }
    }

    // ==============================
    // 🚀 GROWTH TOOLS SUITE
    // ==============================

    async getGrowthToolsSuite(userId?: string): Promise<GrowthToolsSuite> {
        try {
            const targetUserId = userId || this.currentUserId;
            const response = await fetch(`${this.baseUrl}/growth/${targetUserId}`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to get growth tools suite: ${response.status}`);
            }

            const data = await response.json();
            return data.suite || this.getMockGrowthToolsSuite();
        } catch (error) {
            console.error('Get growth tools suite error:', error);
            return this.getMockGrowthToolsSuite();
        }
    }

    async enableGrowthTool(toolId: string): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/growth/tools/${toolId}/enable`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                },
            });

            return response.ok;
        } catch (error) {
            console.error('Enable growth tool error:', error);
            return false;
        }
    }

    async createGrowthStrategy(strategy: Omit<GrowthStrategy, 'id'>): Promise<string> {
        try {
            const response = await fetch(`${this.baseUrl}/growth/strategies`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...strategy,
                    userId: this.currentUserId,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to create growth strategy: ${response.status}`);
            }

            const data = await response.json();
            return data.strategyId || `strategy_${Date.now()}`;
        } catch (error) {
            console.error('Create growth strategy error:', error);
            throw new Error('Failed to create growth strategy');
        }
    }

    async launchGrowthCampaign(campaign: Omit<GrowthCampaign, 'id' | 'results'>): Promise<string> {
        try {
            const response = await fetch(`${this.baseUrl}/growth/campaigns`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...campaign,
                    userId: this.currentUserId,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to launch growth campaign: ${response.status}`);
            }

            const data = await response.json();
            return data.campaignId || `campaign_${Date.now()}`;
        } catch (error) {
            console.error('Launch growth campaign error:', error);
            throw new Error('Failed to launch growth campaign');
        }
    }

    async getGrowthMetrics(): Promise<GrowthMetrics> {
        try {
            const response = await fetch(`${this.baseUrl}/growth/metrics`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to get growth metrics: ${response.status}`);
            }

            const data = await response.json();
            return data.metrics || this.getMockGrowthMetrics();
        } catch (error) {
            console.error('Get growth metrics error:', error);
            return this.getMockGrowthMetrics();
        }
    }

    // ==============================
    // 🔧 HELPER METHODS
    // ==============================

    private getMockMarketTrends(): MarketTrend[] {
        return [
            {
                id: 'trend_1',
                topic: 'Faith in Action',
                category: 'faith',
                trendScore: 85,
                growthRate: 25,
                volume: 15000,
                sentiment: 'positive',
                relatedHashtags: ['#faithinaction', '#livingfaith', '#blessed'],
                influencers: ['@faithleader', '@inspirational'],
                contentIdeas: [
                    'Share personal testimony of faith in action',
                    'Create content about serving others',
                    'Highlight community service projects',
                ],
                faithRelevance: 95,
                opportunity: 'high',
            },
            {
                id: 'trend_2',
                topic: 'Daily Devotion',
                category: 'spiritual',
                trendScore: 78,
                growthRate: 18,
                volume: 12000,
                sentiment: 'positive',
                relatedHashtags: ['#dailydevotion', '#biblestudy', '#prayer'],
                influencers: ['@devotional', '@biblestudy'],
                contentIdeas: [
                    'Share daily scripture reflections',
                    'Create prayer guides',
                    'Post morning devotionals',
                ],
                faithRelevance: 100,
                opportunity: 'medium',
            },
        ];
    }

    private getMockContentStrategy(): ContentStrategy {
        return {
            id: 'strategy_1',
            userId: 'user_1',
            period: 'weekly',
            themes: this.getMockContentThemes(),
            topics: this.getMockContentTopics(),
            schedule: {
                weeklyPlan: [
                    {
                        day: 'Monday',
                        contentTypes: ['post', 'story'],
                        themes: ['motivation', 'faith'],
                        platforms: ['instagram', 'facebook'],
                        estimatedTime: 30,
                    },
                    {
                        day: 'Wednesday',
                        contentTypes: ['post', 'reel'],
                        themes: ['education', 'community'],
                        platforms: ['instagram', 'tiktok'],
                        estimatedTime: 45,
                    },
                ],
                optimalTimes: [
                    {
                        platform: 'instagram',
                        dayOfWeek: 'Monday',
                        timeSlots: ['9:00 AM', '12:00 PM', '6:00 PM'],
                        engagementRate: 85,
                    },
                ],
                frequency: {
                    postsPerDay: 1,
                    storiesPerDay: 2,
                    reelsPerWeek: 3,
                    livesPerMonth: 1,
                },
                automation: {
                    enabled: true,
                    autoPosting: true,
                    autoHashtags: true,
                    autoScheduling: true,
                    autoEngagement: false,
                },
            },
            goals: [
                {
                    id: 'goal_1',
                    name: 'Increase Engagement',
                    type: 'engagement',
                    target: 10,
                    current: 6,
                    deadline: new Date('2024-12-31'),
                    progress: 60,
                },
            ],
            performance: {
                totalPosts: 45,
                averageEngagement: 8.5,
                reachGrowth: 25,
                followerGrowth: 15,
                topPerformingContent: [
                    {
                        id: 'content_1',
                        title: 'Faith Testimony',
                        platform: 'instagram',
                        engagement: 12.5,
                        reach: 2500,
                        shares: 45,
                        comments: 23,
                    },
                ],
            },
        };
    }

    private getMockContentThemes(): ContentTheme[] {
        return [
            {
                id: 'theme_1',
                name: 'Faith Journey',
                description: 'Personal faith stories and spiritual growth',
                hashtags: ['#faithjourney', '#spiritualgrowth', '#testimony'],
                platforms: ['instagram', 'facebook'],
                targetAudience: ['christians', 'faith_seekers'],
                faithMode: true,
                seasonalRelevance: 90,
            },
            {
                id: 'theme_2',
                name: 'Daily Encouragement',
                description: 'Uplifting messages and motivational content',
                hashtags: ['#encouragement', '#motivation', '#inspiration'],
                platforms: ['instagram', 'tiktok'],
                targetAudience: ['general', 'motivation_seekers'],
                faithMode: false,
                seasonalRelevance: 85,
            },
        ];
    }

    private getMockContentTopics(): ContentTopic[] {
        return [
            {
                id: 'topic_1',
                title: 'Overcoming Challenges with Faith',
                description: 'How faith helps navigate life\'s difficulties',
                category: 'faith',
                trendingScore: 85,
                difficulty: 'medium',
                estimatedEngagement: 12,
                faithAlignment: 95,
                contentIdeas: [
                    'Share personal story of overcoming hardship',
                    'Create video about faith during trials',
                    'Post scripture about strength in weakness',
                ],
            },
        ];
    }

    private getMockAudienceBehavior(): AudienceBehavior {
        return {
            userId: 'user_1',
            segments: this.getMockAudienceSegments(),
            insights: this.getMockAudienceInsights(),
            patterns: this.getMockBehaviorPatterns(),
            recommendations: [
                {
                    id: 'rec_1',
                    type: 'content',
                    title: 'Increase Faith Content',
                    description: 'Your audience engages 40% more with faith-based content',
                    impact: 40,
                    implementation: 'Post 3 faith-focused pieces per week',
                    priority: 'high',
                },
            ],
        };
    }

    private getMockAudienceSegments(): AudienceSegment[] {
        return [
            {
                id: 'segment_1',
                name: 'Faith Community',
                size: 2500,
                demographics: {
                    ageRanges: { '18-24': 20, '25-34': 45, '35-44': 25, '45+': 10 },
                    genders: { 'female': 65, 'male': 35 },
                    locations: { 'US': 80, 'Canada': 10, 'UK': 10 },
                    languages: { 'English': 95, 'Spanish': 5 },
                },
                interests: ['faith', 'spirituality', 'community', 'prayer'],
                behavior: {
                    activeHours: { '9:00': 15, '12:00': 25, '18:00': 35, '21:00': 25 },
                    preferredContent: ['testimonies', 'scripture', 'prayer'],
                    engagementRate: 8.5,
                    retentionRate: 85,
                    churnRisk: 15,
                },
                engagement: {
                    likes: 1200,
                    comments: 450,
                    shares: 300,
                    saves: 200,
                    clicks: 800,
                },
                value: 75,
            },
        ];
    }

    private getMockAudienceInsights(): AudienceInsight[] {
        return [
            {
                id: 'insight_1',
                type: 'behavioral',
                title: 'Peak Engagement Times',
                description: 'Your audience is most active between 6-8 PM',
                data: { peakHours: ['18:00', '19:00', '20:00'] },
                impact: 85,
                confidence: 92,
            },
        ];
    }

    private getMockBehaviorPatterns(): BehaviorPattern[] {
        return [
            {
                id: 'pattern_1',
                pattern: 'Users engage more with video content on weekends',
                frequency: 75,
                users: 1800,
                context: 'Weekend content consumption',
                opportunity: 'Schedule video content for weekends',
            },
        ];
    }

    private getMockGrowthToolsSuite(): GrowthToolsSuite {
        return {
            userId: 'user_1',
            tools: [
                {
                    id: 'tool_1',
                    name: 'Hashtag Optimizer',
                    category: 'content',
                    description: 'Find trending hashtags for maximum reach',
                    isEnabled: true,
                    effectiveness: 85,
                    usage: 12,
                    recommendations: ['Use more faith-specific hashtags', 'Test new hashtag combinations'],
                },
                {
                    id: 'tool_2',
                    name: 'Engagement Booster',
                    category: 'engagement',
                    description: 'Increase engagement with automated responses',
                    isEnabled: false,
                    effectiveness: 70,
                    usage: 0,
                    recommendations: ['Enable to boost community engagement', 'Set up response templates'],
                },
            ],
            strategies: [
                {
                    id: 'strategy_1',
                    name: 'Community Building',
                    type: 'organic',
                    description: 'Build a strong faith community through engagement',
                    target: 5000,
                    current: 2500,
                    timeline: 90,
                    resources: ['Daily engagement', 'Community challenges', 'Live sessions'],
                    successRate: 75,
                },
            ],
            campaigns: [
                {
                    id: 'campaign_1',
                    name: 'Faith Challenge',
                    type: 'challenge',
                    status: 'active',
                    startDate: new Date(),
                    endDate: new Date(Date.now() + 86400000 * 30),
                    budget: 500,
                    results: {
                        reach: 15000,
                        engagement: 1200,
                        conversions: 150,
                        cost: 300,
                        roi: 250,
                        participants: 500,
                    },
                },
            ],
            metrics: {
                followers: 2500,
                engagement: 8.5,
                reach: 15000,
                conversions: 150,
                revenue: 2500,
                growthRate: 25,
                viralCoefficient: 1.2,
            },
        };
    }

    private getMockGrowthMetrics(): GrowthMetrics {
        return {
            followers: 2500,
            engagement: 8.5,
            reach: 15000,
            conversions: 150,
            revenue: 2500,
            growthRate: 25,
            viralCoefficient: 1.2,
        };
    }
}

export const businessIntelligenceService = new BusinessIntelligenceService(); 
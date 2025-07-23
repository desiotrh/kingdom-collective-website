import { Platform } from 'react-native';

export interface AISuggestion {
    id: string;
    type: 'post' | 'topic' | 'prayer' | 'scripture' | 'encouragement' | 'challenge';
    title: string;
    content: string;
    category: string;
    faithMode: boolean;
    confidence: number; // 0-100
    tags: string[];
    targetAudience: string[];
    suggestedTime?: Date;
    priority: 'low' | 'medium' | 'high';
}

export interface AIEncouragement {
    id: string;
    userId: string;
    type: 'inactive-user' | 'new-member' | 'milestone' | 'struggling';
    message: string;
    action: 'message' | 'invite' | 'prayer' | 'resource';
    priority: 'low' | 'medium' | 'high';
    isSent: boolean;
    sentAt?: Date;
    faithMode: boolean;
}

export interface PrayerSuggestion {
    id: string;
    userId: string;
    context: string;
    suggestion: string;
    scriptureReferences: string[];
    prayerPoints: string[];
    faithMode: boolean;
    isPersonalized: boolean;
}

export interface SmartRecommendation {
    id: string;
    userId: string;
    type: 'group' | 'resource' | 'challenge' | 'event' | 'mentor';
    title: string;
    description: string;
    confidence: number;
    reason: string;
    actionUrl: string;
    faithMode: boolean;
}

export interface CommunityAnalytics {
    userId: string;
    engagementLevel: 'low' | 'medium' | 'high';
    activityScore: number; // 0-100
    interests: string[];
    spiritualGifts: string[];
    preferredContent: string[];
    inactiveDays: number;
    lastActivity: Date;
    faithMode: boolean;
}

export class AICommunityService {
    private static instance: AICommunityService;
    private suggestions: Map<string, AISuggestion> = new Map();
    private encouragements: Map<string, AIEncouragement> = new Map();
    private prayerSuggestions: Map<string, PrayerSuggestion> = new Map();
    private recommendations: Map<string, SmartRecommendation> = new Map();
    private analytics: Map<string, CommunityAnalytics> = new Map();

    static getInstance(): AICommunityService {
        if (!AICommunityService.instance) {
            AICommunityService.instance = new AICommunityService();
        }
        return AICommunityService.instance;
    }

    // Generate post suggestions for group leaders
    async generatePostSuggestions(groupId: string, context?: {
        recentTopics?: string[];
        memberInterests?: string[];
        faithMode?: boolean;
    }): Promise<AISuggestion[]> {
        const suggestions: AISuggestion[] = [];

        // Generate topic-based suggestions
        if (context?.recentTopics) {
            suggestions.push(...this.generateTopicBasedSuggestions(context.recentTopics, context.faithMode));
        }

        // Generate interest-based suggestions
        if (context?.memberInterests) {
            suggestions.push(...this.generateInterestBasedSuggestions(context.memberInterests, context.faithMode));
        }

        // Generate faith mode specific suggestions
        if (context?.faithMode) {
            suggestions.push(...this.generateFaithModeSuggestions());
        }

        // Generate general engagement suggestions
        suggestions.push(...this.generateGeneralSuggestions());

        // Sort by confidence and priority
        return suggestions
            .sort((a, b) => {
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                const aScore = a.confidence * priorityOrder[a.priority];
                const bScore = b.confidence * priorityOrder[b.priority];
                return bScore - aScore;
            })
            .slice(0, 10);
    }

    // Generate encouragement nudges for inactive users
    async generateEncouragementNudges(userId: string, analytics: CommunityAnalytics): Promise<AIEncouragement[]> {
        const encouragements: AIEncouragement[] = [];

        if (analytics.inactiveDays > 7) {
            encouragements.push({
                id: `encouragement_${Date.now()}`,
                userId,
                type: 'inactive-user',
                message: this.generateInactiveUserMessage(analytics),
                action: 'message',
                priority: 'high',
                isSent: false,
                faithMode: analytics.faithMode,
            });
        }

        if (analytics.engagementLevel === 'low') {
            encouragements.push({
                id: `encouragement_${Date.now() + 1}`,
                userId,
                type: 'struggling',
                message: this.generateStrugglingUserMessage(analytics),
                action: 'prayer',
                priority: 'medium',
                isSent: false,
                faithMode: analytics.faithMode,
            });
        }

        return encouragements;
    }

    // Generate AI-powered prayer suggestions
    async generatePrayerSuggestions(userId: string, context: string, faithMode: boolean = false): Promise<PrayerSuggestion[]> {
        const suggestions: PrayerSuggestion[] = [];

        // Analyze context and generate personalized prayers
        const prayerContext = this.analyzePrayerContext(context);

        suggestions.push({
            id: `prayer_${Date.now()}`,
            userId,
            context,
            suggestion: this.generatePrayerText(prayerContext, faithMode),
            scriptureReferences: this.getRelevantScriptures(prayerContext),
            prayerPoints: this.generatePrayerPoints(prayerContext),
            faithMode,
            isPersonalized: true,
        });

        // Generate additional prayer variations
        if (faithMode) {
            suggestions.push({
                id: `prayer_${Date.now() + 1}`,
                userId,
                context,
                suggestion: this.generateFaithModePrayer(prayerContext),
                scriptureReferences: this.getFaithModeScriptures(prayerContext),
                prayerPoints: this.generateFaithModePrayerPoints(prayerContext),
                faithMode: true,
                isPersonalized: true,
            });
        }

        return suggestions;
    }

    // Generate smart recommendations
    async generateSmartRecommendations(userId: string, analytics: CommunityAnalytics): Promise<SmartRecommendation[]> {
        const recommendations: SmartRecommendation[] = [];

        // Group recommendations based on interests
        if (analytics.interests.length > 0) {
            recommendations.push(...this.generateGroupRecommendations(userId, analytics));
        }

        // Resource recommendations based on activity
        if (analytics.activityScore > 50) {
            recommendations.push(...this.generateResourceRecommendations(userId, analytics));
        }

        // Challenge recommendations based on engagement
        if (analytics.engagementLevel === 'high') {
            recommendations.push(...this.generateChallengeRecommendations(userId, analytics));
        }

        // Mentor recommendations based on spiritual gifts
        if (analytics.spiritualGifts.length > 0) {
            recommendations.push(...this.generateMentorRecommendations(userId, analytics));
        }

        // Event recommendations based on preferences
        if (analytics.preferredContent.length > 0) {
            recommendations.push(...this.generateEventRecommendations(userId, analytics));
        }

        return recommendations
            .sort((a, b) => b.confidence - a.confidence)
            .slice(0, 5);
    }

    // Update user analytics
    async updateUserAnalytics(userId: string, activity: any): Promise<CommunityAnalytics> {
        let analytics = this.analytics.get(userId);

        if (!analytics) {
            analytics = {
                userId,
                engagementLevel: 'low',
                activityScore: 0,
                interests: [],
                spiritualGifts: [],
                preferredContent: [],
                inactiveDays: 0,
                lastActivity: new Date(),
                faithMode: false,
            };
        }

        // Update analytics based on activity
        analytics.lastActivity = new Date();
        analytics.activityScore = this.calculateActivityScore(analytics, activity);
        analytics.engagementLevel = this.calculateEngagementLevel(analytics.activityScore);
        analytics.interests = this.updateInterests(analytics.interests, activity);
        analytics.spiritualGifts = this.updateSpiritualGifts(analytics.spiritualGifts, activity);
        analytics.preferredContent = this.updatePreferredContent(analytics.preferredContent, activity);

        this.analytics.set(userId, analytics);
        return analytics;
    }

    // Send encouragement nudge
    async sendEncouragementNudge(encouragementId: string): Promise<void> {
        const encouragement = this.encouragements.get(encouragementId);
        if (!encouragement) {
            throw new Error('Encouragement not found');
        }

        encouragement.isSent = true;
        encouragement.sentAt = new Date();

        // Send the actual message/notification
        await this.deliverEncouragement(encouragement);
    }

    // Get user analytics
    async getUserAnalytics(userId: string): Promise<CommunityAnalytics | null> {
        return this.analytics.get(userId) || null;
    }

    // Get community insights
    async getCommunityInsights(groupId: string): Promise<any> {
        const groupAnalytics = Array.from(this.analytics.values());

        return {
            totalMembers: groupAnalytics.length,
            activeMembers: groupAnalytics.filter(a => a.engagementLevel === 'high').length,
            averageActivityScore: groupAnalytics.reduce((sum, a) => sum + a.activityScore, 0) / groupAnalytics.length,
            popularInterests: this.getPopularInterests(groupAnalytics),
            faithModeUsers: groupAnalytics.filter(a => a.faithMode).length,
            inactiveUsers: groupAnalytics.filter(a => a.inactiveDays > 7).length,
        };
    }

    // Private methods
    private generateTopicBasedSuggestions(topics: string[], faithMode?: boolean): AISuggestion[] {
        const suggestions: AISuggestion[] = [];

        topics.forEach(topic => {
            if (faithMode) {
                suggestions.push({
                    id: `suggestion_${Date.now()}_${topic}`,
                    type: 'post',
                    title: `Follow-up on ${topic}`,
                    content: `Let's continue our discussion on ${topic}. What insights have you gained?`,
                    category: 'discussion',
                    faithMode: true,
                    confidence: 85,
                    tags: [topic, 'discussion', 'faith'],
                    targetAudience: ['all'],
                    priority: 'medium',
                });
            }
        });

        return suggestions;
    }

    private generateInterestBasedSuggestions(interests: string[], faithMode?: boolean): AISuggestion[] {
        const suggestions: AISuggestion[] = [];

        interests.forEach(interest => {
            suggestions.push({
                id: `suggestion_${Date.now()}_${interest}`,
                type: 'topic',
                title: `Resource on ${interest}`,
                content: `I found a great resource about ${interest} that might interest the group.`,
                category: 'resource',
                faithMode: faithMode || false,
                confidence: 75,
                tags: [interest, 'resource'],
                targetAudience: ['interested'],
                priority: 'medium',
            });
        });

        return suggestions;
    }

    private generateFaithModeSuggestions(): AISuggestion[] {
        return [
            {
                id: `suggestion_${Date.now()}_prayer`,
                type: 'prayer',
                title: 'Prayer Request Thread',
                content: 'Let\'s lift each other up in prayer. Share your prayer requests below.',
                category: 'prayer',
                faithMode: true,
                confidence: 90,
                tags: ['prayer', 'faith', 'support'],
                targetAudience: ['all'],
                priority: 'high',
            },
            {
                id: `suggestion_${Date.now()}_scripture`,
                type: 'scripture',
                title: 'Scripture of the Day',
                content: 'Today\'s verse: "For I know the plans I have for you," declares the Lord.',
                category: 'scripture',
                faithMode: true,
                confidence: 80,
                tags: ['scripture', 'daily', 'encouragement'],
                targetAudience: ['all'],
                priority: 'medium',
            },
        ];
    }

    private generateGeneralSuggestions(): AISuggestion[] {
        return [
            {
                id: `suggestion_${Date.now()}_general`,
                type: 'post',
                title: 'Weekly Check-in',
                content: 'How is everyone doing this week? Share your highs and lows.',
                category: 'community',
                faithMode: false,
                confidence: 70,
                tags: ['check-in', 'community'],
                targetAudience: ['all'],
                priority: 'medium',
            },
        ];
    }

    private generateInactiveUserMessage(analytics: CommunityAnalytics): string {
        if (analytics.faithMode) {
            return `We miss you in our community! God has placed you here for a reason. Would you like to join our prayer time this week?`;
        }
        return `We miss you in our community! We\'d love to see you back. Is there anything we can help you with?`;
    }

    private generateStrugglingUserMessage(analytics: CommunityAnalytics): string {
        if (analytics.faithMode) {
            return `I sense you might be going through a difficult time. Remember, you\'re not alone. Would you like to talk or have us pray for you?`;
        }
        return `I noticed you might be having a tough time. We\'re here to support you. Would you like to talk?`;
    }

    private analyzePrayerContext(context: string): any {
        // Simple context analysis
        const keywords = context.toLowerCase().split(' ');
        const categories = {
            health: ['sick', 'illness', 'healing', 'health', 'medical'],
            family: ['family', 'marriage', 'children', 'parent'],
            financial: ['money', 'financial', 'job', 'work', 'career'],
            spiritual: ['faith', 'spiritual', 'growth', 'relationship'],
            emotional: ['anxiety', 'depression', 'stress', 'worry', 'fear'],
        };

        const detectedCategories = Object.entries(categories).filter(([category, words]) =>
            words.some(word => keywords.includes(word))
        );

        return {
            categories: detectedCategories.map(([category]) => category),
            keywords,
            urgency: keywords.includes('urgent') || keywords.includes('emergency') ? 'high' : 'normal',
        };
    }

    private generatePrayerText(context: any, faithMode: boolean): string {
        if (faithMode) {
            return `Lord, I lift up this situation to You. You know every detail and You are in control. Please provide comfort, guidance, and Your perfect peace. In Jesus' name, amen.`;
        }
        return `I'm thinking of you and sending positive thoughts your way. You're not alone in this.`;
    }

    private generateFaithModePrayer(context: any): string {
        return `Heavenly Father, I come before You with this request. You are the God of all comfort and the source of all wisdom. Please work in this situation according to Your perfect will. Strengthen faith and bring Your peace. In Jesus' mighty name, amen.`;
    }

    private getRelevantScriptures(context: any): string[] {
        const scriptureMap: any = {
            health: ['James 5:14-15', 'Psalm 103:3'],
            family: ['Proverbs 22:6', 'Ephesians 6:4'],
            financial: ['Philippians 4:19', 'Matthew 6:33'],
            spiritual: ['James 4:8', 'Psalm 119:105'],
            emotional: ['Philippians 4:6-7', 'Isaiah 41:10'],
        };

        return context.categories.flatMap((category: string) => scriptureMap[category] || []);
    }

    private getFaithModeScriptures(context: any): string[] {
        return [
            'Jeremiah 29:11',
            'Romans 8:28',
            'Philippians 4:13',
            'Isaiah 40:31',
        ];
    }

    private generatePrayerPoints(context: any): string[] {
        return [
            'For God\'s guidance and wisdom',
            'For peace and comfort',
            'For strength to endure',
            'For God\'s perfect timing',
        ];
    }

    private generateFaithModePrayerPoints(context: any): string[] {
        return [
            'For spiritual breakthrough',
            'For God\'s healing touch',
            'For increased faith',
            'For God\'s glory to be revealed',
        ];
    }

    private generateGroupRecommendations(userId: string, analytics: CommunityAnalytics): SmartRecommendation[] {
        return analytics.interests.map(interest => ({
            id: `rec_${Date.now()}_${interest}`,
            userId,
            type: 'group',
            title: `${interest} Study Group`,
            description: `Join others interested in ${interest}`,
            confidence: 80,
            reason: `Based on your interest in ${interest}`,
            actionUrl: `/groups/${interest}`,
            faithMode: analytics.faithMode,
        }));
    }

    private generateResourceRecommendations(userId: string, analytics: CommunityAnalytics): SmartRecommendation[] {
        return [
            {
                id: `rec_${Date.now()}_resource`,
                userId,
                type: 'resource',
                title: 'Advanced Study Materials',
                description: 'Deep dive resources based on your activity',
                confidence: 75,
                reason: 'High engagement level detected',
                actionUrl: '/resources/advanced',
                faithMode: analytics.faithMode,
            },
        ];
    }

    private generateChallengeRecommendations(userId: string, analytics: CommunityAnalytics): SmartRecommendation[] {
        return [
            {
                id: `rec_${Date.now()}_challenge`,
                userId,
                type: 'challenge',
                title: 'Leadership Challenge',
                description: 'Step up and lead a small group',
                confidence: 85,
                reason: 'High engagement and leadership potential',
                actionUrl: '/challenges/leadership',
                faithMode: analytics.faithMode,
            },
        ];
    }

    private generateMentorRecommendations(userId: string, analytics: CommunityAnalytics): SmartRecommendation[] {
        return analytics.spiritualGifts.map(gift => ({
            id: `rec_${Date.now()}_${gift}`,
            userId,
            type: 'mentor',
            title: `${gift} Mentor`,
            description: `Connect with a mentor in ${gift}`,
            confidence: 70,
            reason: `Based on your spiritual gift of ${gift}`,
            actionUrl: `/mentors/${gift}`,
            faithMode: analytics.faithMode,
        }));
    }

    private generateEventRecommendations(userId: string, analytics: CommunityAnalytics): SmartRecommendation[] {
        return [
            {
                id: `rec_${Date.now()}_event`,
                userId,
                type: 'event',
                title: 'Community Meetup',
                description: 'Connect with like-minded members',
                confidence: 65,
                reason: 'Based on your content preferences',
                actionUrl: '/events/community',
                faithMode: analytics.faithMode,
            },
        ];
    }

    private calculateActivityScore(analytics: CommunityAnalytics, activity: any): number {
        // Simplified activity score calculation
        let score = analytics.activityScore;

        if (activity.type === 'post') score += 10;
        if (activity.type === 'comment') score += 5;
        if (activity.type === 'like') score += 2;
        if (activity.type === 'share') score += 8;

        return Math.min(score, 100);
    }

    private calculateEngagementLevel(activityScore: number): 'low' | 'medium' | 'high' {
        if (activityScore >= 70) return 'high';
        if (activityScore >= 30) return 'medium';
        return 'low';
    }

    private updateInterests(currentInterests: string[], activity: any): string[] {
        if (activity.tags) {
            return [...new Set([...currentInterests, ...activity.tags])];
        }
        return currentInterests;
    }

    private updateSpiritualGifts(currentGifts: string[], activity: any): string[] {
        // Simplified spiritual gifts detection
        const giftKeywords: any = {
            teaching: ['teach', 'explain', 'study'],
            encouragement: ['encourage', 'support', 'comfort'],
            service: ['serve', 'help', 'assist'],
            leadership: ['lead', 'organize', 'guide'],
        };

        const detectedGifts = Object.entries(giftKeywords).filter(([gift, keywords]) =>
            keywords.some(keyword => activity.content?.toLowerCase().includes(keyword))
        ).map(([gift]) => gift);

        return [...new Set([...currentGifts, ...detectedGifts])];
    }

    private updatePreferredContent(currentContent: string[], activity: any): string[] {
        if (activity.category) {
            return [...new Set([...currentContent, activity.category])];
        }
        return currentContent;
    }

    private getPopularInterests(analytics: CommunityAnalytics[]): any {
        const interestCounts: any = {};

        analytics.forEach(a => {
            a.interests.forEach(interest => {
                interestCounts[interest] = (interestCounts[interest] || 0) + 1;
            });
        });

        return Object.entries(interestCounts)
            .sort(([, a], [, b]) => (b as number) - (a as number))
            .slice(0, 5)
            .map(([interest, count]) => ({ interest, count }));
    }

    private async deliverEncouragement(encouragement: AIEncouragement): Promise<void> {
        console.log(`Delivering encouragement to user ${encouragement.userId}: ${encouragement.message}`);
    }

    // Mock data for development
    getMockSuggestions(): AISuggestion[] {
        return [
            {
                id: 'suggestion_1',
                type: 'post',
                title: 'Prayer Request Thread',
                content: 'Let\'s lift each other up in prayer. Share your prayer requests below.',
                category: 'prayer',
                faithMode: true,
                confidence: 90,
                tags: ['prayer', 'faith', 'support'],
                targetAudience: ['all'],
                priority: 'high',
            },
            {
                id: 'suggestion_2',
                type: 'topic',
                title: 'Bible Study Discussion',
                content: 'What insights did you gain from this week\'s study?',
                category: 'discussion',
                faithMode: true,
                confidence: 85,
                tags: ['bible-study', 'discussion', 'learning'],
                targetAudience: ['all'],
                priority: 'medium',
            },
        ];
    }

    getMockEncouragements(): AIEncouragement[] {
        return [
            {
                id: 'encouragement_1',
                userId: 'user_1',
                type: 'inactive-user',
                message: 'We miss you in our community! God has placed you here for a reason.',
                action: 'message',
                priority: 'high',
                isSent: false,
                faithMode: true,
            },
            {
                id: 'encouragement_2',
                userId: 'user_2',
                type: 'struggling',
                message: 'I sense you might be going through a difficult time. Remember, you\'re not alone.',
                action: 'prayer',
                priority: 'medium',
                isSent: false,
                faithMode: true,
            },
        ];
    }
}

export const aiCommunityService = AICommunityService.getInstance(); 
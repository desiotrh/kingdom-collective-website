import { analyticsService } from './analyticsService';
import { authService } from './authService';

export interface TrendingHashtag {
    hashtag: string;
    platform: string;
    trendScore: number;
    postCount: number;
    growthRate: number;
    relatedHashtags: string[];
    category: string;
}

export interface OptimalPostingTime {
    time: string;
    day: string;
    platform: string;
    confidence: number;
    expectedEngagement: number;
    timezone: string;
}

export interface PlatformFormat {
    platform: string;
    aspectRatio: string;
    maxDuration: number;
    recommendedDuration: number;
    dimensions: { width: number; height: number };
    requirements: string[];
}

export interface CreatorChallenge {
    id: string;
    title: string;
    description: string;
    theme: string;
    duration: number;
    prize: string;
    participants: number;
    deadline: Date;
    hashtags: string[];
    requirements: string[];
    submissions: ChallengeSubmission[];
}

export interface ChallengeSubmission {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    videoUrl: string;
    title: string;
    description: string;
    likes: number;
    votes: number;
    submittedAt: Date;
}

export interface InfluencerCollaboration {
    id: string;
    title: string;
    description: string;
    creatorId: string;
    creatorName: string;
    creatorAvatar: string;
    creatorFollowers: number;
    collaborationType: 'duet' | 'remix' | 'collab' | 'shoutout';
    status: 'open' | 'in_progress' | 'completed';
    deadline: Date;
    participants: CollaborationParticipant[];
}

export interface CollaborationParticipant {
    userId: string;
    userName: string;
    userAvatar: string;
    role: string;
    status: 'invited' | 'accepted' | 'declined' | 'completed';
}

class SocialBoostService {
    private apiBaseUrl: string;

    constructor() {
        this.apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
    }

    /**
     * Get trending hashtags for content
     */
    async getTrendingHashtags(
        content: string,
        platform: string,
        category?: string
    ): Promise<TrendingHashtag[]> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/social/trending-hashtags`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    content,
                    platform,
                    category,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get trending hashtags');
            }

            const hashtags = await response.json();

            analyticsService.trackEvent('trending_hashtags_generated', {
                userId: user.uid,
                platform,
                category,
                hashtagCount: hashtags.length,
            });

            return hashtags;
        } catch (error) {
            console.error('Hashtag generation failed:', error);
            return this.generateMockTrendingHashtags(platform, category);
        }
    }

    /**
     * Generate mock trending hashtags
     */
    private generateMockTrendingHashtags(platform: string, category?: string): TrendingHashtag[] {
        const faithHashtags = [
            { hashtag: '#FaithOverFear', trendScore: 0.95, postCount: 15000, growthRate: 0.25 },
            { hashtag: '#GodIsGood', trendScore: 0.88, postCount: 25000, growthRate: 0.18 },
            { hashtag: '#Blessed', trendScore: 0.82, postCount: 35000, growthRate: 0.15 },
            { hashtag: '#ChristianLife', trendScore: 0.78, postCount: 12000, growthRate: 0.22 },
            { hashtag: '#KingdomClips', trendScore: 0.92, postCount: 5000, growthRate: 0.35 },
        ];

        const encouragementHashtags = [
            { hashtag: '#KeepGoing', trendScore: 0.89, postCount: 18000, growthRate: 0.20 },
            { hashtag: '#YouGotThis', trendScore: 0.85, postCount: 22000, growthRate: 0.16 },
            { hashtag: '#Motivation', trendScore: 0.91, postCount: 45000, growthRate: 0.12 },
            { hashtag: '#Inspiration', trendScore: 0.87, postCount: 32000, growthRate: 0.14 },
            { hashtag: '#PositiveVibes', trendScore: 0.83, postCount: 28000, growthRate: 0.17 },
        ];

        const hashtags = category === 'faith' ? faithHashtags : encouragementHashtags;

        return hashtags.map((tag, index) => ({
            ...tag,
            platform,
            relatedHashtags: hashtags.slice(0, 3).map(t => t.hashtag),
            category: category || 'general',
        }));
    }

    /**
     * Get optimal posting times
     */
    async getOptimalPostingTimes(
        platform: string,
        timezone: string,
        contentType: string,
        targetAudience?: string
    ): Promise<OptimalPostingTime[]> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/social/optimal-posting-times`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    platform,
                    timezone,
                    contentType,
                    targetAudience,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get optimal posting times');
            }

            const times = await response.json();

            analyticsService.trackEvent('optimal_posting_times_generated', {
                userId: user.uid,
                platform,
                timezone,
                contentType,
            });

            return times;
        } catch (error) {
            console.error('Posting time prediction failed:', error);
            return this.generateMockOptimalPostingTimes(platform, timezone);
        }
    }

    /**
     * Generate mock optimal posting times
     */
    private generateMockOptimalPostingTimes(platform: string, timezone: string): OptimalPostingTime[] {
        const times = [
            { time: '09:00', day: 'Monday', confidence: 0.95, expectedEngagement: 0.85 },
            { time: '12:00', day: 'Wednesday', confidence: 0.88, expectedEngagement: 0.78 },
            { time: '18:00', day: 'Friday', confidence: 0.92, expectedEngagement: 0.82 },
            { time: '21:00', day: 'Sunday', confidence: 0.85, expectedEngagement: 0.75 },
        ];

        return times.map(time => ({
            ...time,
            platform,
            timezone,
        }));
    }

    /**
     * Get platform format requirements
     */
    async getPlatformFormats(): Promise<PlatformFormat[]> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/social/platform-formats`, {
                headers: {
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to get platform formats');
            }

            const formats = await response.json();
            return formats;
        } catch (error) {
            console.error('Platform formats failed:', error);
            return this.generateMockPlatformFormats();
        }
    }

    /**
     * Generate mock platform formats
     */
    private generateMockPlatformFormats(): PlatformFormat[] {
        return [
            {
                platform: 'TikTok',
                aspectRatio: '9:16',
                maxDuration: 60,
                recommendedDuration: 15,
                dimensions: { width: 1080, height: 1920 },
                requirements: ['Vertical video', 'High engagement', 'Trending audio'],
            },
            {
                platform: 'Instagram Reels',
                aspectRatio: '9:16',
                maxDuration: 90,
                recommendedDuration: 30,
                dimensions: { width: 1080, height: 1920 },
                requirements: ['Vertical video', 'High quality', 'Relevant hashtags'],
            },
            {
                platform: 'YouTube Shorts',
                aspectRatio: '9:16',
                maxDuration: 60,
                recommendedDuration: 45,
                dimensions: { width: 1080, height: 1920 },
                requirements: ['Vertical video', 'SEO optimized', 'Engaging content'],
            },
            {
                platform: 'Facebook',
                aspectRatio: '16:9',
                maxDuration: 14400,
                recommendedDuration: 60,
                dimensions: { width: 1920, height: 1080 },
                requirements: ['High quality', 'Community engagement', 'Shareable content'],
            },
        ];
    }

    /**
     * Auto-crop video for platform
     */
    async autoCropVideo(
        videoUrl: string,
        platform: string,
        targetAspectRatio: string
    ): Promise<string> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/social/auto-crop`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    videoUrl,
                    platform,
                    targetAspectRatio,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to auto-crop video');
            }

            const result = await response.json();

            analyticsService.trackEvent('video_auto_cropped', {
                userId: user.uid,
                platform,
                targetAspectRatio,
            });

            return result.croppedVideoUrl;
        } catch (error) {
            console.error('Auto-crop failed:', error);
            throw error;
        }
    }

    /**
     * Get active creator challenges
     */
    async getCreatorChallenges(): Promise<CreatorChallenge[]> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/social/creator-challenges`, {
                headers: {
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to get creator challenges');
            }

            const challenges = await response.json();

            analyticsService.trackEvent('creator_challenges_viewed', {
                userId: user.uid,
                challengeCount: challenges.length,
            });

            return challenges;
        } catch (error) {
            console.error('Creator challenges failed:', error);
            return this.generateMockCreatorChallenges();
        }
    }

    /**
     * Generate mock creator challenges
     */
    private generateMockCreatorChallenges(): CreatorChallenge[] {
        return [
            {
                id: 'challenge_1',
                title: 'Faith in Action',
                description: 'Share how your faith inspires action in your daily life',
                theme: 'faith',
                duration: 7,
                prize: '$500 + Featured Creator Spot',
                participants: 1250,
                deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                hashtags: ['#FaithInAction', '#KingdomClips', '#ChristianCreators'],
                requirements: ['15-60 second video', 'Include faith message', 'Use challenge hashtags'],
                submissions: [],
            },
            {
                id: 'challenge_2',
                title: 'Encouragement Week',
                description: 'Create content that lifts others up and spreads positivity',
                theme: 'encouragement',
                duration: 5,
                prize: '$300 + Community Spotlight',
                participants: 890,
                deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                hashtags: ['#EncouragementWeek', '#SpreadJoy', '#PositiveVibes'],
                requirements: ['30-90 second video', 'Uplifting message', 'Original content'],
                submissions: [],
            },
            {
                id: 'challenge_3',
                title: 'Worship Wednesday',
                description: 'Share your favorite worship moments or create worship content',
                theme: 'worship',
                duration: 3,
                prize: '$200 + Worship Playlist Feature',
                participants: 650,
                deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                hashtags: ['#WorshipWednesday', '#PraiseGod', '#WorshipMusic'],
                requirements: ['Worship-focused content', 'Include music', 'Spiritual message'],
                submissions: [],
            },
        ];
    }

    /**
     * Submit to creator challenge
     */
    async submitToChallenge(
        challengeId: string,
        videoUrl: string,
        title: string,
        description: string
    ): Promise<void> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/social/creator-challenges/${challengeId}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    videoUrl,
                    title,
                    description,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit to challenge');
            }

            analyticsService.trackEvent('challenge_submission_created', {
                userId: user.uid,
                challengeId,
                title,
            });
        } catch (error) {
            console.error('Challenge submission failed:', error);
            throw error;
        }
    }

    /**
     * Vote for challenge submission
     */
    async voteForSubmission(challengeId: string, submissionId: string): Promise<void> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/social/creator-challenges/${challengeId}/vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    submissionId,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to vote for submission');
            }

            analyticsService.trackEvent('challenge_submission_voted', {
                userId: user.uid,
                challengeId,
                submissionId,
            });
        } catch (error) {
            console.error('Voting failed:', error);
            throw error;
        }
    }

    /**
     * Get influencer collaboration opportunities
     */
    async getInfluencerCollaborations(): Promise<InfluencerCollaboration[]> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/social/influencer-collaborations`, {
                headers: {
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to get influencer collaborations');
            }

            const collaborations = await response.json();

            analyticsService.trackEvent('influencer_collaborations_viewed', {
                userId: user.uid,
                collaborationCount: collaborations.length,
            });

            return collaborations;
        } catch (error) {
            console.error('Influencer collaborations failed:', error);
            return this.generateMockInfluencerCollaborations();
        }
    }

    /**
     * Generate mock influencer collaborations
     */
    private generateMockInfluencerCollaborations(): InfluencerCollaboration[] {
        return [
            {
                id: 'collab_1',
                title: 'Faith Duet Challenge',
                description: 'Create a duet video about faith and encouragement',
                creatorId: 'creator_1',
                creatorName: 'Faithful Creator',
                creatorAvatar: 'https://example.com/avatar1.jpg',
                creatorFollowers: 50000,
                collaborationType: 'duet',
                status: 'open',
                deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                participants: [],
            },
            {
                id: 'collab_2',
                title: 'Worship Remix',
                description: 'Remix a worship song with your own style',
                creatorId: 'creator_2',
                creatorName: 'Worship Leader',
                creatorAvatar: 'https://example.com/avatar2.jpg',
                creatorFollowers: 75000,
                collaborationType: 'remix',
                status: 'open',
                deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                participants: [],
            },
            {
                id: 'collab_3',
                title: 'Community Shoutout',
                description: 'Give a shoutout to other Kingdom creators',
                creatorId: 'creator_3',
                creatorName: 'Community Builder',
                creatorAvatar: 'https://example.com/avatar3.jpg',
                creatorFollowers: 100000,
                collaborationType: 'shoutout',
                status: 'open',
                deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                participants: [],
            },
        ];
    }

    /**
     * Join influencer collaboration
     */
    async joinCollaboration(collaborationId: string, role: string): Promise<void> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/social/influencer-collaborations/${collaborationId}/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    role,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to join collaboration');
            }

            analyticsService.trackEvent('collaboration_joined', {
                userId: user.uid,
                collaborationId,
                role,
            });
        } catch (error) {
            console.error('Collaboration join failed:', error);
            throw error;
        }
    }

    /**
     * Create influencer collaboration
     */
    async createCollaboration(
        title: string,
        description: string,
        collaborationType: InfluencerCollaboration['collaborationType'],
        deadline: Date
    ): Promise<InfluencerCollaboration> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/social/influencer-collaborations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    title,
                    description,
                    collaborationType,
                    deadline,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create collaboration');
            }

            const collaboration = await response.json();

            analyticsService.trackEvent('collaboration_created', {
                userId: user.uid,
                collaborationId: collaboration.id,
                collaborationType,
            });

            return collaboration;
        } catch (error) {
            console.error('Collaboration creation failed:', error);
            throw error;
        }
    }
}

export const socialBoostService = new SocialBoostService(); 
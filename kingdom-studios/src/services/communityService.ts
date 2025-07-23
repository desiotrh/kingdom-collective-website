import { analyticsService } from './analyticsService';
import { authService } from './authService';

export interface CommunityChallenge {
    id: string;
    title: string;
    description: string;
    theme: string;
    requirements: string[];
    prize: {
        type: 'cash' | 'featured' | 'badge' | 'opportunity';
        value: string;
        description: string;
    };
    duration: number; // days
    participants: ChallengeParticipant[];
    submissions: ChallengeSubmission[];
    status: 'active' | 'voting' | 'completed' | 'upcoming';
    startDate: Date;
    endDate: Date;
    votingEndDate: Date;
    winner?: ChallengeWinner;
}

export interface ChallengeParticipant {
    userId: string;
    userName: string;
    userAvatar: string;
    userFollowers: number;
    joinedAt: Date;
    submissionCount: number;
}

export interface ChallengeSubmission {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    likes: number;
    votes: number;
    comments: ChallengeComment[];
    submittedAt: Date;
    status: 'pending' | 'approved' | 'rejected';
}

export interface ChallengeComment {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    content: string;
    createdAt: Date;
}

export interface ChallengeWinner {
    submissionId: string;
    userId: string;
    userName: string;
    userAvatar: string;
    title: string;
    votes: number;
    announcedAt: Date;
}

export interface MentorshipMatch {
    id: string;
    mentorId: string;
    mentorName: string;
    mentorAvatar: string;
    mentorFollowers: number;
    mentorExpertise: string[];
    menteeId: string;
    menteeName: string;
    menteeAvatar: string;
    menteeFollowers: number;
    menteeGoals: string[];
    status: 'pending' | 'accepted' | 'active' | 'completed' | 'declined';
    createdAt: Date;
    acceptedAt?: Date;
    completedAt?: Date;
    sessions: MentorshipSession[];
}

export interface MentorshipSession {
    id: string;
    matchId: string;
    title: string;
    description: string;
    date: Date;
    duration: number; // minutes
    status: 'scheduled' | 'completed' | 'cancelled';
    notes?: string;
    recordingUrl?: string;
}

export interface ResourceLibrary {
    id: string;
    title: string;
    description: string;
    type: 'b_roll' | 'sound_effects' | 'luts' | 'overlays' | 'templates' | 'tutorials';
    category: string;
    tags: string[];
    fileUrl: string;
    thumbnailUrl: string;
    size: number;
    downloads: number;
    rating: number;
    reviewCount: number;
    creatorId: string;
    creatorName: string;
    creatorAvatar: string;
    isFree: boolean;
    price?: number;
    currency?: string;
    licenseType: 'free' | 'attribution' | 'commercial';
    createdAt: Date;
}

export interface CreatorSpotlight {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    userFollowers: number;
    userBio: string;
    featuredContent: string[];
    achievements: string[];
    expertise: string[];
    socialLinks: {
        instagram?: string;
        tiktok?: string;
        youtube?: string;
        twitter?: string;
    };
    interviewQuestions: SpotlightInterview[];
    isActive: boolean;
    featuredAt: Date;
    endDate: Date;
}

export interface SpotlightInterview {
    id: string;
    question: string;
    answer: string;
    order: number;
}

export interface FeatureRequest {
    id: string;
    title: string;
    description: string;
    category: 'feature' | 'improvement' | 'bug' | 'integration';
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'submitted' | 'under_review' | 'planned' | 'in_progress' | 'completed' | 'declined';
    submittedBy: string;
    submittedByName: string;
    submittedByAvatar: string;
    votes: number;
    voters: string[];
    comments: FeatureRequestComment[];
    createdAt: Date;
    updatedAt: Date;
    plannedFor?: Date;
    completedAt?: Date;
}

export interface FeatureRequestComment {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    content: string;
    createdAt: Date;
}

class CommunityService {
    private apiBaseUrl: string;

    constructor() {
        this.apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
    }

    /**
     * Get active community challenges
     */
    async getCommunityChallenges(status?: CommunityChallenge['status']): Promise<CommunityChallenge[]> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const params = status ? `?status=${status}` : '';
            const response = await fetch(`${this.apiBaseUrl}/community/challenges${params}`, {
                headers: {
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to get community challenges');
            }

            const challenges = await response.json();

            analyticsService.trackEvent('community_challenges_viewed', {
                userId: user.uid,
                status,
                challengeCount: challenges.length,
            });

            return challenges;
        } catch (error) {
            console.error('Community challenges failed:', error);
            return this.generateMockCommunityChallenges();
        }
    }

    /**
     * Generate mock community challenges
     */
    private generateMockCommunityChallenges(): CommunityChallenge[] {
        return [
            {
                id: 'challenge_1',
                title: 'Faith in Action',
                description: 'Create a video showing how your faith inspires positive action in your community',
                theme: 'faith',
                requirements: [
                    '15-60 second video',
                    'Include faith message',
                    'Show community impact',
                    'Use #FaithInAction hashtag',
                ],
                prize: {
                    type: 'featured',
                    value: 'Featured Creator',
                    description: 'Get featured on Kingdom Clips homepage for 1 week',
                },
                duration: 7,
                participants: [
                    {
                        userId: 'user_1',
                        userName: 'Faithful Creator',
                        userAvatar: 'https://example.com/avatar1.jpg',
                        userFollowers: 5000,
                        joinedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                        submissionCount: 1,
                    },
                ],
                submissions: [],
                status: 'active',
                startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                votingEndDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            },
            {
                id: 'challenge_2',
                title: 'Worship Wednesday',
                description: 'Share your favorite worship moment or create worship content',
                theme: 'worship',
                requirements: [
                    'Worship-focused content',
                    'Include music',
                    'Spiritual message',
                    'Use #WorshipWednesday hashtag',
                ],
                prize: {
                    type: 'badge',
                    value: 'Worship Badge',
                    description: 'Earn the exclusive Worship Creator badge',
                },
                duration: 3,
                participants: [],
                submissions: [],
                status: 'upcoming',
                startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
                endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
                votingEndDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            },
        ];
    }

    /**
     * Join community challenge
     */
    async joinChallenge(challengeId: string): Promise<void> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/community/challenges/${challengeId}/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to join challenge');
            }

            analyticsService.trackEvent('challenge_joined', {
                userId: user.uid,
                challengeId,
            });
        } catch (error) {
            console.error('Challenge join failed:', error);
            throw error;
        }
    }

    /**
     * Submit to challenge
     */
    async submitToChallenge(
        challengeId: string,
        title: string,
        description: string,
        videoUrl: string,
        thumbnailUrl: string
    ): Promise<ChallengeSubmission> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/community/challenges/${challengeId}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    title,
                    description,
                    videoUrl,
                    thumbnailUrl,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit to challenge');
            }

            const submission = await response.json();

            analyticsService.trackEvent('challenge_submission_created', {
                userId: user.uid,
                challengeId,
                title,
            });

            return submission;
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

            const response = await fetch(`${this.apiBaseUrl}/community/challenges/${challengeId}/vote`, {
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
            console.error('Challenge voting failed:', error);
            throw error;
        }
    }

    /**
     * Get mentorship opportunities
     */
    async getMentorshipOpportunities(): Promise<MentorshipMatch[]> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/community/mentorship`, {
                headers: {
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to get mentorship opportunities');
            }

            const opportunities = await response.json();

            analyticsService.trackEvent('mentorship_opportunities_viewed', {
                userId: user.uid,
                opportunityCount: opportunities.length,
            });

            return opportunities;
        } catch (error) {
            console.error('Mentorship opportunities failed:', error);
            return this.generateMockMentorshipOpportunities();
        }
    }

    /**
     * Generate mock mentorship opportunities
     */
    private generateMockMentorshipOpportunities(): MentorshipMatch[] {
        return [
            {
                id: 'mentorship_1',
                mentorId: 'mentor_1',
                mentorName: 'Faith Content Expert',
                mentorAvatar: 'https://example.com/mentor1.jpg',
                mentorFollowers: 50000,
                mentorExpertise: ['faith content', 'viral videos', 'community building'],
                menteeId: 'mentee_1',
                menteeName: 'New Creator',
                menteeAvatar: 'https://example.com/mentee1.jpg',
                menteeFollowers: 1000,
                menteeGoals: ['grow audience', 'improve content quality', 'build community'],
                status: 'active',
                createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                acceptedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
                sessions: [
                    {
                        id: 'session_1',
                        matchId: 'mentorship_1',
                        title: 'Content Strategy Session',
                        description: 'Discuss content strategy and audience growth',
                        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                        duration: 60,
                        status: 'scheduled',
                    },
                ],
            },
        ];
    }

    /**
     * Request mentorship
     */
    async requestMentorship(mentorId: string, goals: string[]): Promise<void> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/community/mentorship/request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    mentorId,
                    goals,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to request mentorship');
            }

            analyticsService.trackEvent('mentorship_requested', {
                userId: user.uid,
                mentorId,
                goals,
            });
        } catch (error) {
            console.error('Mentorship request failed:', error);
            throw error;
        }
    }

    /**
     * Get resource library
     */
    async getResourceLibrary(
        type?: ResourceLibrary['type'],
        category?: string,
        isFree?: boolean
    ): Promise<ResourceLibrary[]> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const params = new URLSearchParams();
            if (type) params.append('type', type);
            if (category) params.append('category', category);
            if (isFree !== undefined) params.append('isFree', isFree.toString());

            const response = await fetch(`${this.apiBaseUrl}/community/resources?${params}`, {
                headers: {
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to get resource library');
            }

            const resources = await response.json();

            analyticsService.trackEvent('resource_library_viewed', {
                userId: user.uid,
                type,
                category,
                isFree,
                resourceCount: resources.length,
            });

            return resources;
        } catch (error) {
            console.error('Resource library failed:', error);
            return this.generateMockResourceLibrary();
        }
    }

    /**
     * Generate mock resource library
     */
    private generateMockResourceLibrary(): ResourceLibrary[] {
        return [
            {
                id: 'resource_1',
                title: 'Faith B-Roll Pack',
                description: 'High-quality B-roll footage for faith-based content',
                type: 'b_roll',
                category: 'faith',
                tags: ['faith', 'worship', 'community', 'inspiration'],
                fileUrl: 'https://example.com/faith-broll.zip',
                thumbnailUrl: 'https://example.com/faith-broll-thumb.jpg',
                size: 1024 * 1024 * 500, // 500MB
                downloads: 1250,
                rating: 4.8,
                reviewCount: 89,
                creatorId: 'creator_1',
                creatorName: 'Kingdom Studios',
                creatorAvatar: 'https://example.com/kingdom-avatar.jpg',
                isFree: true,
                licenseType: 'attribution',
                createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
            {
                id: 'resource_2',
                title: 'Worship Sound Effects',
                description: 'Professional sound effects for worship content',
                type: 'sound_effects',
                category: 'worship',
                tags: ['worship', 'audio', 'church', 'music'],
                fileUrl: 'https://example.com/worship-sfx.zip',
                thumbnailUrl: 'https://example.com/worship-sfx-thumb.jpg',
                size: 1024 * 1024 * 200, // 200MB
                downloads: 567,
                rating: 4.9,
                reviewCount: 45,
                creatorId: 'creator_2',
                creatorName: 'Worship Producer',
                creatorAvatar: 'https://example.com/producer-avatar.jpg',
                isFree: false,
                price: 19.99,
                currency: 'USD',
                licenseType: 'commercial',
                createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
            },
            {
                id: 'resource_3',
                title: 'Inspiration LUTs',
                description: 'Color grading presets for inspirational content',
                type: 'luts',
                category: 'inspiration',
                tags: ['color grading', 'inspiration', 'presets', 'cinematic'],
                fileUrl: 'https://example.com/inspiration-luts.zip',
                thumbnailUrl: 'https://example.com/inspiration-luts-thumb.jpg',
                size: 1024 * 1024 * 50, // 50MB
                downloads: 234,
                rating: 4.7,
                reviewCount: 23,
                creatorId: 'creator_3',
                creatorName: 'Inspiration Designer',
                creatorAvatar: 'https://example.com/designer-avatar.jpg',
                isFree: true,
                licenseType: 'free',
                createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
        ];
    }

    /**
     * Download resource
     */
    async downloadResource(resourceId: string): Promise<string> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/community/resources/${resourceId}/download`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to download resource');
            }

            const result = await response.json();

            analyticsService.trackEvent('resource_downloaded', {
                userId: user.uid,
                resourceId,
            });

            return result.downloadUrl;
        } catch (error) {
            console.error('Resource download failed:', error);
            throw error;
        }
    }

    /**
     * Get creator spotlights
     */
    async getCreatorSpotlights(): Promise<CreatorSpotlight[]> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/community/spotlights`, {
                headers: {
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to get creator spotlights');
            }

            const spotlights = await response.json();

            analyticsService.trackEvent('creator_spotlights_viewed', {
                userId: user.uid,
                spotlightCount: spotlights.length,
            });

            return spotlights;
        } catch (error) {
            console.error('Creator spotlights failed:', error);
            return this.generateMockCreatorSpotlights();
        }
    }

    /**
     * Generate mock creator spotlights
     */
    private generateMockCreatorSpotlights(): CreatorSpotlight[] {
        return [
            {
                id: 'spotlight_1',
                userId: 'creator_1',
                userName: 'Faithful Creator',
                userAvatar: 'https://example.com/creator1.jpg',
                userFollowers: 50000,
                userBio: 'Creating inspiring faith-based content that touches hearts and changes lives.',
                featuredContent: [
                    'https://example.com/featured1.mp4',
                    'https://example.com/featured2.mp4',
                    'https://example.com/featured3.mp4',
                ],
                achievements: [
                    '100K+ followers',
                    'Featured Creator 2023',
                    'Community Leader',
                ],
                expertise: ['faith content', 'community building', 'viral videos'],
                socialLinks: {
                    instagram: 'https://instagram.com/faithfulcreator',
                    tiktok: 'https://tiktok.com/@faithfulcreator',
                    youtube: 'https://youtube.com/faithfulcreator',
                },
                interviewQuestions: [
                    {
                        id: 'q1',
                        question: 'What inspires your faith-based content?',
                        answer: 'My relationship with God and the desire to share His love with others.',
                        order: 1,
                    },
                    {
                        id: 'q2',
                        question: 'How do you stay authentic in your content?',
                        answer: 'By being true to my faith and sharing real experiences from my life.',
                        order: 2,
                    },
                ],
                isActive: true,
                featuredAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
            },
        ];
    }

    /**
     * Get feature requests
     */
    async getFeatureRequests(
        status?: FeatureRequest['status'],
        category?: FeatureRequest['category']
    ): Promise<FeatureRequest[]> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const params = new URLSearchParams();
            if (status) params.append('status', status);
            if (category) params.append('category', category);

            const response = await fetch(`${this.apiBaseUrl}/community/feature-requests?${params}`, {
                headers: {
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to get feature requests');
            }

            const requests = await response.json();

            analyticsService.trackEvent('feature_requests_viewed', {
                userId: user.uid,
                status,
                category,
                requestCount: requests.length,
            });

            return requests;
        } catch (error) {
            console.error('Feature requests failed:', error);
            return this.generateMockFeatureRequests();
        }
    }

    /**
     * Generate mock feature requests
     */
    private generateMockFeatureRequests(): FeatureRequest[] {
        return [
            {
                id: 'request_1',
                title: 'Auto-caption generation',
                description: 'Automatically generate captions from video audio with editing capabilities',
                category: 'feature',
                priority: 'high',
                status: 'planned',
                submittedBy: 'user_1',
                submittedByName: 'Content Creator',
                submittedByAvatar: 'https://example.com/user1.jpg',
                votes: 156,
                voters: ['user_1', 'user_2', 'user_3'],
                comments: [
                    {
                        id: 'comment_1',
                        userId: 'user_2',
                        userName: 'Video Editor',
                        userAvatar: 'https://example.com/user2.jpg',
                        content: 'This would save so much time!',
                        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                    },
                ],
                createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                plannedFor: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
            {
                id: 'request_2',
                title: 'Collaborative editing',
                description: 'Allow multiple users to edit the same project simultaneously',
                category: 'feature',
                priority: 'medium',
                status: 'under_review',
                submittedBy: 'user_3',
                submittedByName: 'Team Leader',
                submittedByAvatar: 'https://example.com/user3.jpg',
                votes: 89,
                voters: ['user_3', 'user_4'],
                comments: [],
                createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
                updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            },
        ];
    }

    /**
     * Submit feature request
     */
    async submitFeatureRequest(
        title: string,
        description: string,
        category: FeatureRequest['category'],
        priority: FeatureRequest['priority']
    ): Promise<FeatureRequest> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/community/feature-requests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    title,
                    description,
                    category,
                    priority,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit feature request');
            }

            const request = await response.json();

            analyticsService.trackEvent('feature_request_submitted', {
                userId: user.uid,
                title,
                category,
                priority,
            });

            return request;
        } catch (error) {
            console.error('Feature request submission failed:', error);
            throw error;
        }
    }

    /**
     * Vote for feature request
     */
    async voteForFeatureRequest(requestId: string): Promise<void> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/community/feature-requests/${requestId}/vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to vote for feature request');
            }

            analyticsService.trackEvent('feature_request_voted', {
                userId: user.uid,
                requestId,
            });
        } catch (error) {
            console.error('Feature request voting failed:', error);
            throw error;
        }
    }
}

export const communityService = new CommunityService(); 
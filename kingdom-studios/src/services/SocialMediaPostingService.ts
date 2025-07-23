import { Platform } from 'react-native';
import { useTierSystem } from '../contexts/TierSystemContext';

export interface SocialPost {
    id: string;
    content: string;
    imageUrl?: string;
    videoUrl?: string;
    platforms: SocialPlatform[];
    scheduledTime?: Date;
    status: 'draft' | 'scheduled' | 'published' | 'failed';
    createdAt: Date;
    publishedAt?: Date;
    engagement?: PostEngagement;
}

export interface PostEngagement {
    likes: number;
    comments: number;
    shares: number;
    clicks: number;
    reach: number;
}

export type SocialPlatform = 'instagram' | 'facebook' | 'tiktok' | 'youtube' | 'twitter' | 'linkedin' | 'pinterest';

export interface PlatformConfig {
    platform: SocialPlatform;
    isConnected: boolean;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: Date;
    accountInfo?: AccountInfo;
}

export interface AccountInfo {
    id: string;
    name: string;
    username: string;
    profilePicture?: string;
    followers?: number;
    verified?: boolean;
}

export interface PostingResult {
    success: boolean;
    postId?: string;
    error?: string;
    platform: SocialPlatform;
    url?: string;
}

export class SocialMediaPostingService {
    private static instance: SocialMediaPostingService;
    private platformConfigs: Map<SocialPlatform, PlatformConfig> = new Map();
    private scheduledPosts: SocialPost[] = [];

    static getInstance(): SocialMediaPostingService {
        if (!SocialMediaPostingService.instance) {
            SocialMediaPostingService.instance = new SocialMediaPostingService();
        }
        return SocialMediaPostingService.instance;
    }

    // Platform Connection Methods
    async connectPlatform(platform: SocialPlatform): Promise<boolean> {
        try {
            const { checkFeatureAccess, trackUsage } = useTierSystem();

            // Check if user has access to this platform
            const hasAccess = await checkFeatureAccess(`social_${platform}`);
            if (!hasAccess) {
                throw new Error(`Social media posting to ${platform} requires a higher tier`);
            }

            // Simulate OAuth flow
            const config: PlatformConfig = {
                platform,
                isConnected: true,
                accessToken: `mock_token_${platform}_${Date.now()}`,
                refreshToken: `mock_refresh_${platform}_${Date.now()}`,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
                accountInfo: {
                    id: `user_${platform}_${Date.now()}`,
                    name: `Test ${platform.charAt(0).toUpperCase() + platform.slice(1)} User`,
                    username: `testuser_${platform}`,
                    profilePicture: `https://example.com/profile_${platform}.jpg`,
                    followers: Math.floor(Math.random() * 10000) + 100,
                    verified: Math.random() > 0.7,
                },
            };

            this.platformConfigs.set(platform, config);
            await trackUsage('social_posting', `connected_${platform}`);

            return true;
        } catch (error) {
            console.error(`Failed to connect ${platform}:`, error);
            return false;
        }
    }

    async disconnectPlatform(platform: SocialPlatform): Promise<boolean> {
        try {
            this.platformConfigs.delete(platform);
            return true;
        } catch (error) {
            console.error(`Failed to disconnect ${platform}:`, error);
            return false;
        }
    }

    getConnectedPlatforms(): PlatformConfig[] {
        return Array.from(this.platformConfigs.values()).filter(config => config.isConnected);
    }

    isPlatformConnected(platform: SocialPlatform): boolean {
        return this.platformConfigs.get(platform)?.isConnected || false;
    }

    // Posting Methods
    async postToPlatform(
        platform: SocialPlatform,
        content: string,
        mediaUrls?: string[],
        scheduledTime?: Date
    ): Promise<PostingResult> {
        try {
            const config = this.platformConfigs.get(platform);
            if (!config?.isConnected) {
                throw new Error(`${platform} is not connected`);
            }

            const { checkFeatureAccess, trackUsage } = useTierSystem();
            const hasAccess = await checkFeatureAccess(`social_${platform}_posting`);
            if (!hasAccess) {
                throw new Error(`Posting to ${platform} requires a higher tier`);
            }

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

            const postId = `post_${platform}_${Date.now()}`;
            const result: PostingResult = {
                success: true,
                postId,
                platform,
                url: `https://${platform}.com/posts/${postId}`,
            };

            // Create post object
            const post: SocialPost = {
                id: postId,
                content,
                imageUrl: mediaUrls?.[0],
                videoUrl: mediaUrls?.find(url => url.includes('.mp4')),
                platforms: [platform],
                scheduledTime,
                status: scheduledTime ? 'scheduled' : 'published',
                createdAt: new Date(),
                publishedAt: scheduledTime ? undefined : new Date(),
            };

            if (scheduledTime) {
                this.scheduledPosts.push(post);
            }

            await trackUsage('social_posting', `posted_${platform}`);
            return result;
        } catch (error) {
            console.error(`Failed to post to ${platform}:`, error);
            return {
                success: false,
                platform,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    async postToMultiplePlatforms(
        content: string,
        platforms: SocialPlatform[],
        mediaUrls?: string[],
        scheduledTime?: Date
    ): Promise<PostingResult[]> {
        const results: PostingResult[] = [];

        for (const platform of platforms) {
            const result = await this.postToPlatform(platform, content, mediaUrls, scheduledTime);
            results.push(result);
        }

        return results;
    }

    // Scheduling Methods
    async schedulePost(
        content: string,
        platforms: SocialPlatform[],
        scheduledTime: Date,
        mediaUrls?: string[]
    ): Promise<SocialPost> {
        const post: SocialPost = {
            id: `scheduled_${Date.now()}`,
            content,
            imageUrl: mediaUrls?.[0],
            videoUrl: mediaUrls?.find(url => url.includes('.mp4')),
            platforms,
            scheduledTime,
            status: 'scheduled',
            createdAt: new Date(),
        };

        this.scheduledPosts.push(post);
        return post;
    }

    async getScheduledPosts(): Promise<SocialPost[]> {
        return this.scheduledPosts.filter(post => post.status === 'scheduled');
    }

    async cancelScheduledPost(postId: string): Promise<boolean> {
        const postIndex = this.scheduledPosts.findIndex(post => post.id === postId);
        if (postIndex !== -1) {
            this.scheduledPosts.splice(postIndex, 1);
            return true;
        }
        return false;
    }

    // Instagram Specific Methods
    async postToInstagram(
        content: string,
        imageUrl?: string,
        videoUrl?: string,
        isStory: boolean = false
    ): Promise<PostingResult> {
        try {
            if (!this.isPlatformConnected('instagram')) {
                throw new Error('Instagram is not connected');
            }

            // Instagram-specific validation
            if (isStory && content.length > 2200) {
                throw new Error('Instagram story text cannot exceed 2200 characters');
            }

            if (!isStory && content.length > 2200) {
                throw new Error('Instagram post caption cannot exceed 2200 characters');
            }

            return await this.postToPlatform('instagram', content, [imageUrl, videoUrl].filter(Boolean));
        } catch (error) {
            console.error('Instagram posting failed:', error);
            return {
                success: false,
                platform: 'instagram',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    // Facebook Specific Methods
    async postToFacebook(
        content: string,
        imageUrl?: string,
        videoUrl?: string,
        targetAudience?: 'public' | 'friends' | 'custom'
    ): Promise<PostingResult> {
        try {
            if (!this.isPlatformConnected('facebook')) {
                throw new Error('Facebook is not connected');
            }

            // Facebook-specific validation
            if (content.length > 63206) {
                throw new Error('Facebook post content cannot exceed 63,206 characters');
            }

            return await this.postToPlatform('facebook', content, [imageUrl, videoUrl].filter(Boolean));
        } catch (error) {
            console.error('Facebook posting failed:', error);
            return {
                success: false,
                platform: 'facebook',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    // TikTok Specific Methods
    async postToTikTok(
        content: string,
        videoUrl: string,
        hashtags?: string[]
    ): Promise<PostingResult> {
        try {
            if (!this.isPlatformConnected('tiktok')) {
                throw new Error('TikTok is not connected');
            }

            // TikTok-specific validation
            if (content.length > 150) {
                throw new Error('TikTok caption cannot exceed 150 characters');
            }

            if (!videoUrl) {
                throw new Error('TikTok posts require a video');
            }

            const contentWithHashtags = hashtags ? `${content} ${hashtags.map(tag => `#${tag}`).join(' ')}` : content;
            return await this.postToPlatform('tiktok', contentWithHashtags, [videoUrl]);
        } catch (error) {
            console.error('TikTok posting failed:', error);
            return {
                success: false,
                platform: 'tiktok',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    // YouTube Specific Methods
    async postToYouTube(
        title: string,
        description: string,
        videoUrl: string,
        tags?: string[]
    ): Promise<PostingResult> {
        try {
            if (!this.isPlatformConnected('youtube')) {
                throw new Error('YouTube is not connected');
            }

            // YouTube-specific validation
            if (title.length > 100) {
                throw new Error('YouTube title cannot exceed 100 characters');
            }

            if (description.length > 5000) {
                throw new Error('YouTube description cannot exceed 5000 characters');
            }

            const content = `${title}\n\n${description}\n\n${tags?.map(tag => `#${tag}`).join(' ') || ''}`;
            return await this.postToPlatform('youtube', content, [videoUrl]);
        } catch (error) {
            console.error('YouTube posting failed:', error);
            return {
                success: false,
                platform: 'youtube',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    // Analytics Methods
    async getPostAnalytics(postId: string): Promise<PostEngagement | null> {
        try {
            // Simulate API call for analytics
            await new Promise(resolve => setTimeout(resolve, 500));

            return {
                likes: Math.floor(Math.random() * 1000) + 10,
                comments: Math.floor(Math.random() * 100) + 1,
                shares: Math.floor(Math.random() * 50) + 1,
                clicks: Math.floor(Math.random() * 200) + 5,
                reach: Math.floor(Math.random() * 5000) + 100,
            };
        } catch (error) {
            console.error('Failed to get post analytics:', error);
            return null;
        }
    }

    // Error Handling
    async handlePostingError(error: Error, platform: SocialPlatform): Promise<void> {
        console.error(`Posting error on ${platform}:`, error);

        // Log error for analytics
        const { trackUsage } = useTierSystem();
        await trackUsage('social_posting', `error_${platform}`);

        // Could implement retry logic here
        // Could implement fallback posting methods here
    }

    // Utility Methods
    getPlatformLimits(platform: SocialPlatform): {
        maxTextLength: number;
        maxImages: number;
        maxVideos: number;
        supportsStories: boolean;
        supportsReels: boolean;
    } {
        const limits = {
            instagram: {
                maxTextLength: 2200,
                maxImages: 10,
                maxVideos: 1,
                supportsStories: true,
                supportsReels: true,
            },
            facebook: {
                maxTextLength: 63206,
                maxImages: 30,
                maxVideos: 1,
                supportsStories: false,
                supportsReels: false,
            },
            tiktok: {
                maxTextLength: 150,
                maxImages: 0,
                maxVideos: 1,
                supportsStories: false,
                supportsReels: true,
            },
            youtube: {
                maxTextLength: 5000,
                maxImages: 0,
                maxVideos: 1,
                supportsStories: false,
                supportsReels: false,
            },
            twitter: {
                maxTextLength: 280,
                maxImages: 4,
                maxVideos: 1,
                supportsStories: false,
                supportsReels: false,
            },
            linkedin: {
                maxTextLength: 3000,
                maxImages: 9,
                maxVideos: 1,
                supportsStories: false,
                supportsReels: false,
            },
            pinterest: {
                maxTextLength: 500,
                maxImages: 1,
                maxVideos: 1,
                supportsStories: false,
                supportsReels: false,
            },
        };

        return limits[platform] || limits.instagram;
    }

    validateContent(content: string, platform: SocialPlatform): { isValid: boolean; error?: string } {
        const limits = this.getPlatformLimits(platform);

        if (content.length > limits.maxTextLength) {
            return {
                isValid: false,
                error: `${platform} content cannot exceed ${limits.maxTextLength} characters`,
            };
        }

        return { isValid: true };
    }
}

export default SocialMediaPostingService.getInstance(); 
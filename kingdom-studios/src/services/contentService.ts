/**
 * 📝 CONTENT SERVICE - KINGDOM STUDIOS
 * Handles all content operations through the unified API
 * 
 * This service provides content management functionality:
 * - Content creation and management
 * - Content history and favorites
 * - Content refinement and optimization
 * - Analytics and performance tracking
 */

import { kingdomStudiosApi } from './unifiedApiService';

export interface ContentPost {
  id?: string;
  userId: string;
  title: string;
  content: string;
  platform: string;
  scheduled?: Date;
  published?: boolean;
  publishedAt?: Date;
  analytics?: {
    views: number;
    likes: number;
    shares: number;
    comments: number;
    reach: number;
    engagement: number;
    clicks: number;
  };
  metadata?: {
    hashtags: string[];
    mentions: string[];
    media: Array<{
      type: 'image' | 'video';
      url: string;
      alt?: string;
    }>;
    seoTitle?: string;
    seoDescription?: string;
    keywords?: string[];
    targetAudience?: string[];
    contentStyle?: string;
    tone?: string;
    wordCount?: number;
    readingTime?: number;
  };
  faithMode: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ContentCreateData {
  title: string;
  content: string;
  platform: string;
  scheduled?: Date;
  published?: boolean;
  analytics?: Partial<ContentPost['analytics']>;
  metadata?: Partial<ContentPost['metadata']>;
  faithMode?: boolean;
}

export interface ContentUpdateData {
  title?: string;
  content?: string;
  platform?: string;
  scheduled?: Date;
  published?: boolean;
  analytics?: Partial<ContentPost['analytics']>;
  metadata?: Partial<ContentPost['metadata']>;
}

export interface ContentFilters {
  platform?: string;
  status?: 'draft' | 'scheduled' | 'published';
  faithMode?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
  tags?: string[];
}

export class ContentService {
  private static instance: ContentService;

  private constructor() {}

  static getInstance(): ContentService {
    if (!ContentService.instance) {
      ContentService.instance = new ContentService();
    }
    return ContentService.instance;
  }

  /**
   * Create a new content post
   */
  async saveContentPost(contentData: ContentCreateData): Promise<{ success: boolean; postId?: string; error?: string }> {
    try {
      const result = await kingdomStudiosApi.saveContentPost(contentData);
      
      if (result.success) {
        console.log('[Content] Content post created successfully');
        return { success: true, postId: result.data?.id };
      }
      
      console.error('[Content] Failed to create content post:', result.error);
      return { success: false, error: result.error };
    } catch (error) {
      console.error('[Content] Error creating content post:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create content post' 
      };
    }
  }

  /**
   * Get all content posts for the current user
   */
  async getUserContentPosts(filters?: ContentFilters): Promise<ContentPost[]> {
    try {
      const result = await kingdomStudiosApi.getUserContentPosts(filters);
      
      if (result.success && result.data) {
        return result.data as ContentPost[];
      }
      
      return [];
    } catch (error) {
      console.error('[Content] Error getting user content posts:', error);
      return [];
    }
  }

  /**
   * Get a specific content post by ID
   */
  async getContentPost(postId: string): Promise<ContentPost | null> {
    try {
      const result = await kingdomStudiosApi.getContentPost(postId);
      
      if (result.success && result.data) {
        return result.data as ContentPost;
      }
      
      return null;
    } catch (error) {
      console.error('[Content] Error getting content post:', error);
      return null;
    }
  }

  /**
   * Update a content post
   */
  async updateContentPost(postId: string, updates: ContentUpdateData): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await kingdomStudiosApi.updateContentPost(postId, updates);
      
      if (result.success) {
        console.log('[Content] Content post updated successfully');
        return { success: true };
      }
      
      console.error('[Content] Failed to update content post:', result.error);
      return { success: false, error: result.error };
    } catch (error) {
      console.error('[Content] Error updating content post:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update content post' 
      };
    }
  }

  /**
   * Delete a content post
   */
  async deleteContentPost(postId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await kingdomStudiosApi.deleteContentPost(postId);
      
      if (result.success) {
        console.log('[Content] Content post deleted successfully');
        return { success: true };
      }
      
      console.error('[Content] Failed to delete content post:', result.error);
      return { success: false, error: result.error };
    } catch (error) {
      console.error('[Content] Error deleting content post:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete content post' 
      };
    }
  }

  /**
   * Get favorite posts for the current user
   */
  async getFavoritePosts(): Promise<ContentPost[]> {
    try {
      const result = await kingdomStudiosApi.getFavoritePosts();
      
      if (result.success && result.data) {
        return result.data as ContentPost[];
      }
      
      return [];
    } catch (error) {
      console.error('[Content] Error getting favorite posts:', error);
      return [];
    }
  }

  /**
   * Toggle favorite status for a post
   */
  async toggleFavorite(postId: string): Promise<{ success: boolean; isFavorite?: boolean; error?: string }> {
    try {
      const result = await kingdomStudiosApi.toggleFavorite(postId);
      
      if (result.success) {
        console.log('[Content] Favorite status toggled successfully');
        return { success: true, isFavorite: result.data?.isFavorite };
      }
      
      console.error('[Content] Failed to toggle favorite:', result.error);
      return { success: false, error: result.error };
    } catch (error) {
      console.error('[Content] Error toggling favorite:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to toggle favorite' 
      };
    }
  }

  /**
   * Schedule a content post
   */
  async scheduleContentPost(postId: string, scheduledDate: Date): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await kingdomStudiosApi.scheduleContentPost(postId, scheduledDate);
      
      if (result.success) {
        console.log('[Content] Content post scheduled successfully');
        return { success: true };
      }
      
      console.error('[Content] Failed to schedule content post:', result.error);
      return { success: false, error: result.error };
    } catch (error) {
      console.error('[Content] Error scheduling content post:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to schedule content post' 
      };
    }
  }

  /**
   * Publish a content post
   */
  async publishContentPost(postId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await kingdomStudiosApi.publishContentPost(postId);
      
      if (result.success) {
        console.log('[Content] Content post published successfully');
        return { success: true };
      }
      
      console.error('[Content] Failed to publish content post:', result.error);
      return { success: false, error: result.error };
    } catch (error) {
      console.error('[Content] Error publishing content post:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to publish content post' 
      };
    }
  }

  /**
   * Get content analytics
   */
  async getContentAnalytics(postId: string): Promise<{ success: boolean; analytics?: any; error?: string }> {
    try {
      const result = await kingdomStudiosApi.getContentAnalytics(postId);
      
      if (result.success && result.data) {
        return { success: true, analytics: result.data };
      }
      
      return { success: false, error: result.error };
    } catch (error) {
      console.error('[Content] Error getting content analytics:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get analytics' 
      };
    }
  }

  /**
   * Refine content using AI
   */
  async refineContent(content: string, instructions: string): Promise<{ success: boolean; refinedContent?: string; error?: string }> {
    try {
      const result = await kingdomStudiosApi.refineContent(content, instructions);
      
      if (result.success && result.data) {
        console.log('[Content] Content refined successfully');
        return { success: true, refinedContent: result.data.refinedContent };
      }
      
      console.error('[Content] Failed to refine content:', result.error);
      return { success: false, error: result.error };
    } catch (error) {
      console.error('[Content] Error refining content:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to refine content' 
      };
    }
  }

  /**
   * Generate hashtags for content
   */
  async generateHashtags(content: string, platform: string): Promise<{ success: boolean; hashtags?: string[]; error?: string }> {
    try {
      const result = await kingdomStudiosApi.generateHashtags(content, platform);
      
      if (result.success && result.data) {
        console.log('[Content] Hashtags generated successfully');
        return { success: true, hashtags: result.data.hashtags };
      }
      
      console.error('[Content] Failed to generate hashtags:', result.error);
      return { success: false, error: result.error };
    } catch (error) {
      console.error('[Content] Error generating hashtags:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate hashtags' 
      };
    }
  }

  /**
   * Validate content data
   */
  validateContentData(content: Partial<ContentPost>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!content.title || content.title.trim().length === 0) {
      errors.push('Content title is required');
    }

    if (!content.content || content.content.trim().length === 0) {
      errors.push('Content is required');
    }

    if (content.title && content.title.length > 200) {
      errors.push('Content title must be less than 200 characters');
    }

    if (content.content && content.content.length > 10000) {
      errors.push('Content must be less than 10,000 characters');
    }

    if (content.platform && !['instagram', 'facebook', 'twitter', 'linkedin', 'tiktok', 'youtube'].includes(content.platform)) {
      errors.push('Invalid platform specified');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get default content data
   */
  getDefaultContentData(userId: string): ContentCreateData {
    return {
      title: '',
      content: '',
      platform: 'instagram',
      published: false,
      faithMode: true,
      metadata: {
        hashtags: [],
        mentions: [],
        media: [],
        contentStyle: 'inspirational',
        tone: 'encouraging',
        wordCount: 0,
        readingTime: 0
      }
    };
  }

  /**
   * Get supported platforms
   */
  getSupportedPlatforms(): Array<{ value: string; label: string; icon: string }> {
    return [
      { value: 'instagram', label: 'Instagram', icon: '📸' },
      { value: 'facebook', label: 'Facebook', icon: '📘' },
      { value: 'twitter', label: 'Twitter', icon: '🐦' },
      { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
      { value: 'tiktok', label: 'TikTok', icon: '🎵' },
      { value: 'youtube', label: 'YouTube', icon: '📺' }
    ];
  }

  /**
   * Get content statuses
   */
  getContentStatuses(): Array<{ value: string; label: string; icon: string }> {
    return [
      { value: 'draft', label: 'Draft', icon: '📝' },
      { value: 'scheduled', label: 'Scheduled', icon: '⏰' },
      { value: 'published', label: 'Published', icon: '✅' }
    ];
  }

  /**
   * Calculate reading time
   */
  calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  /**
   * Extract hashtags from content
   */
  extractHashtags(content: string): string[] {
    const hashtagRegex = /#[\w]+/g;
    return content.match(hashtagRegex) || [];
  }

  /**
   * Extract mentions from content
   */
  extractMentions(content: string): string[] {
    const mentionRegex = /@[\w]+/g;
    return content.match(mentionRegex) || [];
  }
}

export const contentService = ContentService.getInstance();

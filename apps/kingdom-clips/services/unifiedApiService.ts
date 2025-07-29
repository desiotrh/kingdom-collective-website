/**
 * 🎬 KINGDOM CLIPS - UNIFIED API SERVICE
 * Replaces Firebase service with the unified API client
 * 
 * This service provides all Kingdom Clips functionality through the unified API:
 * - Video upload and processing
 * - Clip management and storage
 * - Analytics and tracking
 * - Social media integration
 * - Faith-based content features
 */

import { apiClients } from '@kingdom-collective/api';

// ================================
// 🎬 KINGDOM CLIPS API SERVICE
// ================================

export interface ClipData {
  id: string;
  fileName: string;
  storageUrl?: string;
  faithMode: boolean;
  captionStyle: string;
  title: string;
  hashtags: string[];
  thumbnail: string;
  stats: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
  sharedTestimony?: boolean;
  dateCreated: string;
  lastModified: string;
  synced: boolean;
}

export interface VideoProcessingOptions {
  trim?: {
    start: number;
    end: number;
  };
  filters?: string[];
  captions?: boolean;
  faithMode?: boolean;
  captionStyle?: string;
  hashtags?: string[];
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export class KingdomClipsApiService {
  private static instance: KingdomClipsApiService;
  private api = apiClients.clips;

  private constructor() {}

  static getInstance(): KingdomClipsApiService {
    if (!KingdomClipsApiService.instance) {
      KingdomClipsApiService.instance = new KingdomClipsApiService();
    }
    return KingdomClipsApiService.instance;
  }

  // ================================
  // 📹 VIDEO UPLOAD & PROCESSING
  // ================================

  /**
   * Upload video file
   */
  async uploadVideo(
    file: any,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<{ videoId: string; url: string; storagePath: string }> {
    const response = await this.api.uploadVideo(file, (progress) => {
      if (onProgress) {
        onProgress({
          loaded: progress,
          total: 100,
          percentage: progress
        });
      }
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to upload video');
    }

    return response.data;
  }

  /**
   * Process uploaded video
   */
  async processVideo(
    videoId: string,
    options: VideoProcessingOptions = {}
  ): Promise<{ videoId: string; status: string; estimatedTime: string }> {
    const response = await this.api.processVideo(videoId, options);

    if (!response.success) {
      throw new Error(response.error || 'Failed to process video');
    }

    return response.data;
  }

  /**
   * Enhance video with AI features
   */
  async enhanceVideo(
    videoId: string,
    enhancements: {
      autoCaption?: boolean;
      faithMode?: boolean;
      style?: string;
      hashtags?: string[];
    }
  ): Promise<{ videoId: string; status: string }> {
    const response = await this.api.enhanceVideo(videoId, enhancements);

    if (!response.success) {
      throw new Error(response.error || 'Failed to enhance video');
    }

    return response.data;
  }

  /**
   * Export video in different formats
   */
  async exportVideo(
    videoId: string,
    format: 'mp4' | 'mov' | 'avi',
    quality: 'low' | 'medium' | 'high' = 'medium'
  ): Promise<{ videoId: string; downloadUrl: string; format: string }> {
    const response = await this.api.exportVideo(videoId, { format, quality });

    if (!response.success) {
      throw new Error(response.error || 'Failed to export video');
    }

    return response.data;
  }

  // ================================
  // 📱 CLIP MANAGEMENT
  // ================================

  /**
   * Save clip data
   */
  async saveClip(clipData: ClipData): Promise<{ id: string }> {
    const response = await this.api.post('/clips/save', clipData);

    if (!response.success) {
      throw new Error(response.error || 'Failed to save clip');
    }

    return response.data;
  }

  /**
   * Get all clips for current user
   */
  async getClips(page: number = 1, limit: number = 20): Promise<{
    clips: ClipData[];
    total: number;
    pages: number;
  }> {
    const response = await this.api.get('/clips/list', { page, limit });

    if (!response.success) {
      throw new Error(response.error || 'Failed to get clips');
    }

    return response.data;
  }

  /**
   * Get clip by ID
   */
  async getClip(clipId: string): Promise<ClipData> {
    const response = await this.api.get(`/clips/${clipId}`);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get clip');
    }

    return response.data;
  }

  /**
   * Update clip data
   */
  async updateClip(clipId: string, updates: Partial<ClipData>): Promise<ClipData> {
    const response = await this.api.put(`/clips/${clipId}`, updates);

    if (!response.success) {
      throw new Error(response.error || 'Failed to update clip');
    }

    return response.data;
  }

  /**
   * Delete clip
   */
  async deleteClip(clipId: string): Promise<void> {
    const response = await this.api.delete(`/clips/${clipId}`);

    if (!response.success) {
      throw new Error(response.error || 'Failed to delete clip');
    }
  }

  // ================================
  // 📊 ANALYTICS & TRACKING
  // ================================

  /**
   * Get video analytics
   */
  async getVideoAnalytics(videoId: string): Promise<{
    views: number;
    likes: number;
    comments: number;
    shares: number;
    engagementRate: number;
    watchTime: number;
  }> {
    const response = await this.api.get(`/clips/analytics/${videoId}`);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get video analytics');
    }

    return response.data;
  }

  /**
   * Update clip statistics
   */
  async updateClipStats(
    clipId: string,
    stats: Partial<ClipData['stats']>
  ): Promise<void> {
    const response = await this.api.put(`/clips/${clipId}/stats`, stats);

    if (!response.success) {
      throw new Error(response.error || 'Failed to update clip stats');
    }
  }

  /**
   * Track video view
   */
  async trackVideoView(videoId: string): Promise<void> {
    const response = await this.api.post(`/clips/${videoId}/view`);

    if (!response.success) {
      console.warn('Failed to track video view:', response.error);
    }
  }

  /**
   * Track video engagement
   */
  async trackVideoEngagement(
    videoId: string,
    action: 'like' | 'comment' | 'share'
  ): Promise<void> {
    const response = await this.api.post(`/clips/${videoId}/engagement`, {
      action,
    });

    if (!response.success) {
      console.warn('Failed to track video engagement:', response.error);
    }
  }

  // ================================
  // 🙏 FAITH-BASED FEATURES
  // ================================

  /**
   * Mark clip as shared testimony
   */
  async markAsSharedTestimony(clipId: string, shared: boolean): Promise<void> {
    const response = await this.api.put(`/clips/${clipId}/testimony`, {
      shared,
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to update testimony status');
    }
  }

  /**
   * Get faith-based hashtags
   */
  async getFaithHashtags(category?: string): Promise<string[]> {
    const response = await this.api.get('/clips/faith-hashtags', {
      category,
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to get faith hashtags');
    }

    return response.data;
  }

  /**
   * Generate faith-based captions
   */
  async generateFaithCaption(
    videoDescription: string,
    style: 'inspirational' | 'testimony' | 'scripture' = 'inspirational'
  ): Promise<{ caption: string; hashtags: string[] }> {
    const response = await this.api.post('/clips/generate-caption', {
      description: videoDescription,
      style,
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to generate faith caption');
    }

    return response.data;
  }

  // ================================
  // 📱 SOCIAL MEDIA INTEGRATION
  // ================================

  /**
   * Share clip to social media
   */
  async shareToSocialMedia(
    clipId: string,
    platforms: string[],
    message?: string
  ): Promise<{ success: boolean; platformResults: Record<string, any> }> {
    const response = await this.api.post(`/clips/${clipId}/share`, {
      platforms,
      message,
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to share to social media');
    }

    return response.data;
  }

  /**
   * Get sharing history
   */
  async getSharingHistory(clipId: string): Promise<{
    shares: Array<{
      platform: string;
      timestamp: string;
      url: string;
      engagement: number;
    }>;
  }> {
    const response = await this.api.get(`/clips/${clipId}/sharing-history`);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get sharing history');
    }

    return response.data;
  }

  // ================================
  // 🔄 SYNC & BACKUP
  // ================================

  /**
   * Sync clips with cloud
   */
  async syncClips(): Promise<{ synced: number; errors: number }> {
    const response = await this.api.post('/clips/sync');

    if (!response.success) {
      throw new Error(response.error || 'Failed to sync clips');
    }

    return response.data;
  }

  /**
   * Get sync status
   */
  async getSyncStatus(): Promise<{
    lastSync: string;
    pendingUploads: number;
    pendingDownloads: number;
    errors: string[];
  }> {
    const response = await this.api.get('/clips/sync-status');

    if (!response.success) {
      throw new Error(response.error || 'Failed to get sync status');
    }

    return response.data;
  }

  // ================================
  // 🛠️ UTILITY METHODS
  // ================================

  /**
   * Get video processing status
   */
  async getProcessingStatus(videoId: string): Promise<{
    status: 'uploading' | 'processing' | 'enhancing' | 'completed' | 'failed';
    progress: number;
    estimatedTime?: string;
    error?: string;
  }> {
    const response = await this.api.get(`/clips/${videoId}/status`);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get processing status');
    }

    return response.data;
  }

  /**
   * Cancel video processing
   */
  async cancelProcessing(videoId: string): Promise<void> {
    const response = await this.api.post(`/clips/${videoId}/cancel`);

    if (!response.success) {
      throw new Error(response.error || 'Failed to cancel processing');
    }
  }

  /**
   * Get storage usage
   */
  async getStorageUsage(): Promise<{
    used: number;
    total: number;
    percentage: number;
    clips: number;
  }> {
    const response = await this.api.get('/clips/storage-usage');

    if (!response.success) {
      throw new Error(response.error || 'Failed to get storage usage');
    }

    return response.data;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.api.clearCache();
  }

  /**
   * Get API statistics
   */
  async getApiStats(): Promise<any> {
    const response = await this.api.get('/stats');

    if (!response.success) {
      throw new Error(response.error || 'Failed to get API stats');
    }

    return response.data;
  }

  /**
   * Delete user account
   */
  async deleteUser(): Promise<{ success: boolean; message: string }> {
    const response = await this.api.delete('/user');

    if (!response.success) {
      throw new Error(response.error || 'Failed to delete user account');
    }

    return response.data;
  }
}

// Export singleton instance
export const kingdomClipsApi = KingdomClipsApiService.getInstance(); 
/**
 * Social Media Integration Service
 * Handles posting content to multiple social media platforms
 */

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notificationService from './notificationService';
import { AnalyticsTracker } from './AnalyticsTracker';
import firebaseService from './firebaseService';
import { getAuth } from 'firebase/auth';

// Social Media Platform Types
export interface SocialMediaPlatform {
  id: string;
  name: string;
  icon: string;
  color: string;
  isConnected: boolean;
  username?: string;
  accountId?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
}

export interface PostContent {
  text: string;
  images?: string[];
  video?: string;
  hashtags?: string[];
  mentions?: string[];
  scheduledTime?: Date;
}

export interface PostResult {
  platform: string;
  success: boolean;
  postId?: string;
  postUrl?: string;
  error?: string;
}

export interface ScheduledPost {
  id: string;
  content: PostContent;
  platforms: string[];
  scheduledTime: Date;
  status: 'pending' | 'posting' | 'completed' | 'failed';
  results?: PostResult[];
  createdAt: Date;
}

class SocialMediaService {
  private static instance: SocialMediaService;
  // Change connectedPlatforms to Map<string, SocialMediaPlatform[]>
  private connectedPlatforms: Map<string, SocialMediaPlatform[]> = new Map();
  private scheduledPosts: ScheduledPost[] = [];
  private analyticsTracker: AnalyticsTracker;

  // New: Set active account for a platform
  private activeAccounts: Map<string, string> = new Map(); // platformId -> accountId

  private constructor() {
    this.analyticsTracker = AnalyticsTracker.getInstance();
    this.loadConnectedPlatforms();
    this.loadScheduledPosts();
  }

  public static getInstance(): SocialMediaService {
    if (!SocialMediaService.instance) {
      SocialMediaService.instance = new SocialMediaService();
    }
    return SocialMediaService.instance;
  }

  // Platform Management
  public getSupportedPlatforms(): SocialMediaPlatform[] {
    const platforms = [
      { id: 'instagram', name: 'Instagram', icon: '📷', color: '#E4405F' },
      { id: 'facebook', name: 'Facebook', icon: '📘', color: '#1877F2' },
      { id: 'twitter', name: 'Twitter/X', icon: '🐦', color: '#1DA1F2' },
      { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: '#0A66C2' },
      { id: 'tiktok', name: 'TikTok', icon: '🎵', color: '#000000' },
      { id: 'youtube', name: 'YouTube', icon: '📺', color: '#FF0000' },
      { id: 'pinterest', name: 'Pinterest', icon: '📌', color: '#BD081C' },
    ];
    return platforms.map(p => ({
      ...p,
      isConnected: (this.connectedPlatforms.get(p.id)?.length ?? 0) > 0
    }));
  }

  public getConnectedPlatforms(): SocialMediaPlatform[] {
    return this.getSupportedPlatforms().filter(platform => platform.isConnected);
  }

  // New: Get all accounts for a platform
  public getAccountsForPlatform(platformId: string): SocialMediaPlatform[] {
    return this.connectedPlatforms.get(platformId) || [];
  }

  // New: Add an account for a platform
  public async addPlatformAccount(platformId: string, authData: any): Promise<boolean> {
    try {
      const account: SocialMediaPlatform = {
        id: platformId,
        name: this.getPlatformName(platformId),
        icon: this.getPlatformIcon(platformId),
        color: this.getPlatformColor(platformId),
        isConnected: true,
        username: authData.username,
        accountId: authData.accountId,
        accessToken: authData.accessToken,
        refreshToken: authData.refreshToken,
        expiresAt: authData.expiresAt ? new Date(authData.expiresAt) : undefined
      };
      const accounts = this.connectedPlatforms.get(platformId) || [];
      // Prevent duplicate accountId
      if (accounts.some(a => a.accountId === account.accountId)) return false;
      accounts.push(account);
      this.connectedPlatforms.set(platformId, accounts);
      await this.saveConnectedPlatforms();
      this.analyticsTracker.trackPlatformConnection(platformId, true);
      await notificationService.sendLocalNotification({
        id: `platform_connected_${Date.now()}`,
        title: 'Platform Connected! 🎉',
        body: `Successfully connected ${account.name} (@${account.username})`,
        data: { type: 'platform_connected', platformId, accountId: account.accountId }
      });
      const user = getAuth().currentUser;
      if (user) {
        await firebaseService.savePlatformConnection(user.uid, platformId, account);
      }
      return true;
    } catch (error) {
      console.error('Error adding platform account:', error);
      return false;
    }
  }

  // New: Remove an account for a platform
  public async removePlatformAccount(platformId: string, accountId: string): Promise<boolean> {
    try {
      let accounts = this.connectedPlatforms.get(platformId) || [];
      accounts = accounts.filter(a => a.accountId !== accountId);
      if (accounts.length === 0) {
        this.connectedPlatforms.delete(platformId);
      } else {
        this.connectedPlatforms.set(platformId, accounts);
      }
      await this.saveConnectedPlatforms();
      this.analyticsTracker.trackPlatformConnection(platformId, false);
      await notificationService.sendLocalNotification({
        id: `platform_disconnected_${Date.now()}`,
        title: 'Platform Disconnected',
        body: `Disconnected account from ${this.getPlatformName(platformId)}`,
        data: { type: 'platform_disconnected', platformId, accountId }
      });
      const user = getAuth().currentUser;
      if (user) {
        await firebaseService.removePlatformConnection(user.uid, platformId, accountId);
      }
      return true;
    } catch (error) {
      console.error('Error removing platform account:', error);
      return false;
    }
  }

  // New: Set active account for a platform
  public setActiveAccount(platformId: string, accountId: string) {
    this.activeAccounts.set(platformId, accountId);
  }
  public getActiveAccount(platformId: string): SocialMediaPlatform | undefined {
    const accountId = this.activeAccounts.get(platformId);
    return this.getAccountsForPlatform(platformId).find(a => a.accountId === accountId);
  }

  // Content Posting
  public async postToMultiplePlatforms(
    content: PostContent,
    platformIds: string[]
  ): Promise<PostResult[]> {
    const results: PostResult[] = [];

    for (const platformId of platformIds) {
      try {
        const result = await this.postToPlatform(platformId, content);
        results.push(result);
      } catch (error) {
        results.push({
          platform: platformId,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // Track multi-platform posting
    this.analyticsTracker.trackMultiPlatformPost(platformIds, 'social_post', results);

    // Send summary notification
    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;

    await notificationService.sendLocalNotification({
      id: `multi_post_complete_${Date.now()}`,
      title: 'Content Posted! ✨',
      body: `Successfully posted to ${successCount}/${totalCount} platforms`,
      data: { type: 'multi_post_complete', results }
    });

    return results;
  }

  private async postToPlatform(platformId: string, content: PostContent): Promise<PostResult> {
    const account = this.getActiveAccount(platformId) || this.getAccountsForPlatform(platformId)[0];
    if (!account) {
      throw new Error(`No account connected for platform ${platformId}`);
    }
    // Platform-specific posting logic
    switch (platformId) {
      case 'instagram':
        return await this.postToInstagram(content, account);
      case 'facebook':
        return await this.postToFacebook(content, account);
      case 'twitter':
        return await this.postToTwitter(content, account);
      case 'linkedin':
        return await this.postToLinkedIn(content, account);
      case 'tiktok':
        return await this.postToTikTok(content, account);
      case 'youtube':
        return await this.postToYouTube(content, account);
      case 'pinterest':
        return await this.postToPinterest(content, account);
      default:
        throw new Error(`Unsupported platform: ${platformId}`);
    }
  }

  // Platform-specific posting methods (placeholder implementations)
  private async postToInstagram(content: PostContent, platform: SocialMediaPlatform): Promise<PostResult> {
    // In a real implementation, this would use Instagram Basic Display API
    // For now, we'll simulate the posting
    return {
      platform: 'instagram',
      success: true,
      postId: `ig_${Date.now()}`,
      postUrl: `https://instagram.com/p/fake_post_id`
    };
  }

  private async postToFacebook(content: PostContent, platform: SocialMediaPlatform): Promise<PostResult> {
    // Facebook Graph API implementation would go here
    return {
      platform: 'facebook',
      success: true,
      postId: `fb_${Date.now()}`,
      postUrl: `https://facebook.com/fake_post_id`
    };
  }

  private async postToTwitter(content: PostContent, platform: SocialMediaPlatform): Promise<PostResult> {
    // Twitter API v2 implementation would go here
    return {
      platform: 'twitter',
      success: true,
      postId: `tw_${Date.now()}`,
      postUrl: `https://twitter.com/user/status/fake_post_id`
    };
  }

  private async postToLinkedIn(content: PostContent, platform: SocialMediaPlatform): Promise<PostResult> {
    // LinkedIn API implementation would go here
    return {
      platform: 'linkedin',
      success: true,
      postId: `li_${Date.now()}`,
      postUrl: `https://linkedin.com/feed/update/urn:li:share:fake_post_id`
    };
  }

  private async postToTikTok(content: PostContent, platform: SocialMediaPlatform): Promise<PostResult> {
    // TikTok API implementation would go here
    return {
      platform: 'tiktok',
      success: true,
      postId: `tt_${Date.now()}`,
      postUrl: `https://tiktok.com/@user/video/fake_post_id`
    };
  }

  private async postToYouTube(content: PostContent, platform: SocialMediaPlatform): Promise<PostResult> {
    // YouTube Data API implementation would go here
    return {
      platform: 'youtube',
      success: true,
      postId: `yt_${Date.now()}`,
      postUrl: `https://youtube.com/watch?v=fake_video_id`
    };
  }

  private async postToPinterest(content: PostContent, platform: SocialMediaPlatform): Promise<PostResult> {
    // Pinterest API implementation would go here
    return {
      platform: 'pinterest',
      success: true,
      postId: `pin_${Date.now()}`,
      postUrl: `https://pinterest.com/pin/fake_pin_id`
    };
  }

  // Scheduled Posts
  public async schedulePost(
    content: PostContent,
    platforms: string[],
    scheduledTime: Date
  ): Promise<string> {
    const scheduledPost: ScheduledPost = {
      id: `scheduled_${Date.now()}`,
      content,
      platforms,
      scheduledTime,
      status: 'pending',
      createdAt: new Date()
    };

    this.scheduledPosts.push(scheduledPost);
    await this.saveScheduledPosts();

    // Track scheduled post
    this.analyticsTracker.trackScheduledPost(platforms, scheduledTime);

    // Send confirmation notification
    await notificationService.sendLocalNotification({
      id: `post_scheduled_${Date.now()}`,
      title: 'Post Scheduled! ⏰',
      body: `Your post will be published on ${scheduledTime.toLocaleDateString()} at ${scheduledTime.toLocaleTimeString()}`,
      data: { type: 'post_scheduled', postId: scheduledPost.id }
    });

    return scheduledPost.id;
  }

  public getScheduledPosts(): ScheduledPost[] {
    return [...this.scheduledPosts].sort((a, b) =>
      a.scheduledTime.getTime() - b.scheduledTime.getTime()
    );
  }

  public async cancelScheduledPost(postId: string): Promise<boolean> {
    const index = this.scheduledPosts.findIndex(post => post.id === postId);
    if (index === -1) return false;

    this.scheduledPosts.splice(index, 1);
    await this.saveScheduledPosts();
    return true;
  }

  // Utility Methods
  private getPlatformName(platformId: string): string {
    const names: Record<string, string> = {
      instagram: 'Instagram',
      facebook: 'Facebook',
      twitter: 'Twitter/X',
      linkedin: 'LinkedIn',
      tiktok: 'TikTok',
      youtube: 'YouTube',
      pinterest: 'Pinterest'
    };
    return names[platformId] || platformId;
  }

  private getPlatformIcon(platformId: string): string {
    const icons: Record<string, string> = {
      instagram: '📷',
      facebook: '📘',
      twitter: '🐦',
      linkedin: '💼',
      tiktok: '🎵',
      youtube: '📺',
      pinterest: '📌'
    };
    return icons[platformId] || '🌐';
  }

  private getPlatformColor(platformId: string): string {
    const colors: Record<string, string> = {
      instagram: '#E4405F',
      facebook: '#1877F2',
      twitter: '#1DA1F2',
      linkedin: '#0A66C2',
      tiktok: '#000000',
      youtube: '#FF0000',
      pinterest: '#BD081C'
    };
    return colors[platformId] || '#333333';
  }

  // Storage Methods
  private async saveConnectedPlatforms(): Promise<void> {
    try {
      const data: Record<string, SocialMediaPlatform[]> = {};
      for (const [platformId, accounts] of this.connectedPlatforms.entries()) {
        data[platformId] = accounts;
      }
      await AsyncStorage.setItem('social_media_platforms', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving connected platforms:', error);
    }
  }

  private async loadConnectedPlatforms(): Promise<void> {
    try {
      const data = await AsyncStorage.getItem('social_media_platforms');
      if (data) {
        const parsed: Record<string, SocialMediaPlatform[]> = JSON.parse(data);
        this.connectedPlatforms = new Map(Object.entries(parsed));
      }
      const user = getAuth().currentUser;
      if (user) {
        const cloudConnections = await firebaseService.getPlatformConnections(user.uid);
        if (cloudConnections) {
          this.connectedPlatforms = new Map(Object.entries(cloudConnections));
        }
      }
    } catch (error) {
      console.error('Error loading connected platforms:', error);
    }
  }

  private async saveScheduledPosts(): Promise<void> {
    try {
      await AsyncStorage.setItem('scheduled_posts', JSON.stringify(this.scheduledPosts));
    } catch (error) {
      console.error('Error saving scheduled posts:', error);
    }
  }

  private async loadScheduledPosts(): Promise<void> {
    try {
      const data = await AsyncStorage.getItem('scheduled_posts');
      if (data) {
        this.scheduledPosts = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading scheduled posts:', error);
    }
  }
}

export { SocialMediaService };

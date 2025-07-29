/**
 * 🎬 KINGDOM STUDIOS - UNIFIED API SERVICE
 * Replaces individual API services with the unified API client
 * 
 * This service provides all Kingdom Studios functionality through the unified API:
 * - Content generation and management
 * - User authentication and profile management
 * - Subscription and billing
 * - Analytics and tracking
 * - Team collaboration
 * - File uploads and storage
 */

import { apiClients } from '@kingdom-collective/api';
import { TierType, BillingCycle } from '../contexts/TierSystemContext';

// ================================
// 🎬 KINGDOM STUDIOS API SERVICE
// ================================

interface User {
  id: string;
  email: string;
  name: string;
  tier: TierType;
  subscriptionId?: string;
  stripeCustomerId?: string;
  trialEnd?: string;
  subscriptionEnd?: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
  metadata?: Record<string, any>;
}

interface SubscriptionData {
  id: string;
  userId: string;
  tier: TierType;
  billingCycle: BillingCycle;
  status: 'active' | 'trial' | 'past_due' | 'canceled' | 'incomplete';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEnd?: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  amount: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

interface ContentGenerationOptions {
  tone?: 'professional' | 'casual' | 'inspirational';
  platform?: string;
  includeScripture?: boolean;
  targetAudience?: string;
  faithMode?: boolean;
  length?: string;
}

interface ContentGenerationResult {
  content: string;
  metadata: any;
  usage: {
    remaining: number;
    limit: number;
  };
}

interface ContentHistoryItem {
  id: string;
  content: string;
  type: string;
  metadata?: any;
  createdAt: string;
}

interface AnalyticsData {
  contentGenerated: number;
  socialPosts: number;
  emailsSent: number;
  engagementRate: number;
  revenue: number;
  activeUsers: number;
}

export class KingdomStudiosApiService {
  private static instance: KingdomStudiosApiService;
  private api = apiClients.studios;

  private constructor() {}

  static getInstance(): KingdomStudiosApiService {
    if (!KingdomStudiosApiService.instance) {
      KingdomStudiosApiService.instance = new KingdomStudiosApiService();
    }
    return KingdomStudiosApiService.instance;
  }

  // ================================
  // 🔐 AUTHENTICATION & USER MANAGEMENT
  // ================================

  /**
   * Register a new user
   */
  async register(
    email: string,
    password: string,
    name: string,
    mode: 'faith' | 'encouragement'
  ): Promise<{ user: User; token: string }> {
    const response = await this.api.post('/auth/register', {
      email,
      password,
      firstName: name.split(' ')[0],
      lastName: name.split(' ').slice(1).join(' ') || '',
      mode,
    });

    if (!response.success) {
      throw new Error(response.error || 'Registration failed');
    }

    return response.data;
  }

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await this.api.post('/auth/login', {
      email,
      password,
    });

    if (!response.success) {
      throw new Error(response.error || 'Login failed');
    }

    return response.data;
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    const response = await this.api.get('/auth/me');
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to get user profile');
    }

    return response.data;
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: Partial<User>): Promise<User> {
    const response = await this.api.put('/users/profile', updates);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to update profile');
    }

    return response.data;
  }

  // ================================
  // 💳 SUBSCRIPTION & BILLING
  // ================================

  /**
   * Get current subscription
   */
  async getSubscription(): Promise<SubscriptionData> {
    const response = await this.api.get('/payments/subscriptions');
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to get subscription');
    }

    return response.data;
  }

  /**
   * Create new subscription
   */
  async createSubscription(
    tier: TierType,
    billingCycle: BillingCycle,
    paymentMethodId?: string
  ): Promise<SubscriptionData> {
    const response = await this.api.post('/payments/create-subscription', {
      tier,
      billingCycle,
      paymentMethodId,
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to create subscription');
    }

    return response.data;
  }

  /**
   * Update subscription
   */
  async updateSubscription(
    subscriptionId: string,
    updates: { tier?: TierType; billingCycle?: BillingCycle }
  ): Promise<SubscriptionData> {
    const response = await this.api.put(`/payments/subscriptions/${subscriptionId}`, updates);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to update subscription');
    }

    return response.data;
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string, immediately: boolean = false): Promise<void> {
    const response = await this.api.delete(`/payments/subscriptions/${subscriptionId}`, {
      immediately,
    });
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to cancel subscription');
    }
  }

  /**
   * Start trial
   */
  async startTrial(tier: TierType = 'commissioned'): Promise<SubscriptionData> {
    const response = await this.api.post('/payments/create-subscription', {
      tier,
      billingCycle: 'monthly',
      trial: true,
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to start trial');
    }

    return response.data;
  }

  // ================================
  // 🤖 CONTENT GENERATION
  // ================================

  /**
   * Generate AI content
   */
  async generateContent(
    prompt: string,
    type: 'social' | 'email' | 'hashtags' | 'seo' | 'post' | 'story' | 'reel' | 'article',
    options: ContentGenerationOptions = {}
  ): Promise<ContentGenerationResult> {
    const response = await this.api.post('/content/generate', {
      prompt,
      type,
      options,
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to generate content');
    }

    return response.data;
  }

  /**
   * Save generated content
   */
  async saveGeneratedContent(
    content: string,
    type: string,
    metadata?: any
  ): Promise<{ id: string }> {
    const response = await this.api.post('/content/save', {
      content,
      type,
      metadata,
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to save content');
    }

    return response.data;
  }

  /**
   * Get content history
   */
  async getContentHistory(
    page: number = 1,
    limit: number = 20
  ): Promise<{ items: ContentHistoryItem[]; total: number; pages: number }> {
    const response = await this.api.get('/content/history', {
      page,
      limit,
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to get content history');
    }

    return response.data;
  }

  /**
   * Get content templates
   */
  async getContentTemplates(): Promise<any[]> {
    const response = await this.api.get('/content/templates');
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to get templates');
    }

    return response.data;
  }

  /**
   * Schedule content
   */
  async scheduleContent(
    content: string,
    scheduledTime: string,
    platforms: string[]
  ): Promise<{ id: string }> {
    const response = await this.api.post('/content/schedule', {
      content,
      scheduledTime,
      platforms,
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to schedule content');
    }

    return response.data;
  }

  // ================================
  // 📊 ANALYTICS & TRACKING
  // ================================

  /**
   * Get analytics data
   */
  async getAnalytics(timeframe: '7d' | '30d' | '90d' = '30d'): Promise<AnalyticsData> {
    const response = await this.api.get('/analytics/overview', {
      timeframe,
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to get analytics');
    }

    return response.data;
  }

  /**
   * Track custom event
   */
  async trackEvent(event: string, properties?: Record<string, any>): Promise<void> {
    const response = await this.api.post('/analytics/track', {
      event,
      properties,
    });

    if (!response.success) {
      console.warn('Failed to track event:', response.error);
    }
  }

  /**
   * Get usage statistics
   */
  async getUsageStats(): Promise<{
    contentGenerated: number;
    remainingGenerations: number;
    tier: string;
    limit: number;
  }> {
    const response = await this.api.get('/analytics/content');
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to get usage stats');
    }

    return response.data;
  }

  // ================================
  // 👥 TEAM COLLABORATION
  // ================================

  /**
   * Get team members
   */
  async getTeamMembers(): Promise<any[]> {
    const response = await this.api.get('/users/team');
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to get team members');
    }

    return response.data;
  }

  /**
   * Invite team member
   */
  async inviteTeamMember(
    email: string,
    role: 'admin' | 'editor' | 'viewer'
  ): Promise<void> {
    const response = await this.api.post('/users/team/invite', {
      email,
      role,
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to invite team member');
    }
  }

  /**
   * Remove team member
   */
  async removeTeamMember(memberId: string): Promise<void> {
    const response = await this.api.delete(`/users/team/${memberId}`);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to remove team member');
    }
  }

  // ================================
  // 📁 FILE MANAGEMENT
  // ================================

  /**
   * Upload file
   */
  async uploadFile(
    file: any,
    onProgress?: (progress: number) => void
  ): Promise<{ fileId: string; url: string }> {
    const response = await this.api.uploadFile('/files/upload', file, onProgress);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to upload file');
    }

    return response.data;
  }

  /**
   * Get file list
   */
  async getFiles(): Promise<any[]> {
    const response = await this.api.get('/files/list');
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to get files');
    }

    return response.data;
  }

  /**
   * Delete file
   */
  async deleteFile(fileId: string): Promise<void> {
    const response = await this.api.delete(`/files/${fileId}`);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete file');
    }
  }

  // ================================
  // 🔔 NOTIFICATIONS
  // ================================

  /**
   * Get notification settings
   */
  async getNotificationSettings(): Promise<any> {
    const response = await this.api.get('/users/settings/notifications');
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to get notification settings');
    }

    return response.data;
  }

  /**
   * Update notification settings
   */
  async updateNotificationSettings(settings: any): Promise<void> {
    const response = await this.api.put('/users/settings/notifications', settings);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to update notification settings');
    }
  }

  /**
   * Send notification
   */
  async sendNotification(
    userId: string,
    notification: {
      type: 'push' | 'email' | 'in_app';
      title: string;
      message: string;
      data?: any;
    }
  ): Promise<void> {
    const response = await this.api.post('/notifications/send', {
      userId,
      ...notification,
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to send notification');
    }
  }

  // ================================
  // 🛠️ UTILITY METHODS
  // ================================

  /**
   * Get feature flags
   */
  async getFeatureFlags(): Promise<Record<string, boolean>> {
    const response = await this.api.get('/features/flags');
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to get feature flags');
    }

    return response.data;
  }

  /**
   * Get A/B test variant
   */
  async getABTestVariant(testName: string): Promise<{ variant: string }> {
    try {
      const response = await this.api.getABTestVariant(testName);
      return response.data;
    } catch (error) {
      console.error('[API] Error getting AB test variant:', error);
      throw error;
    }
  }

  async deleteUser(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.api.deleteUser();
      return response.data;
    } catch (error) {
      console.error('[API] Error deleting user:', error);
      throw error;
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    // Clear any cached data
    console.log('[API] Cache cleared');
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
}

// Export singleton instance
export const kingdomStudiosApi = KingdomStudiosApiService.getInstance(); 
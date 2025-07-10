import AsyncStorage from '@react-native-async-storage/async-storage';
import aiContentService from './aiContentService';
import { TierType, BillingCycle } from '../contexts/TierSystemContext';

// ==============================
// 🌐 Enhanced Kingdom Studios API Service
// Complete backend integration for tier system
// ==============================

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode?: number;
}

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

// Enhanced API Service for external integrations with tier system
export class APIService {
  private static instance: APIService;
  private baseUrl = process.env.EXPO_PUBLIC_API_URL || 'https://api.kingdomstudios.app';
  private timeout = 30000; // 30 seconds

  private constructor() {}

  static getInstance(): APIService {
    if (!APIService.instance) {
      APIService.instance = new APIService();
    }
    return APIService.instance;
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await AsyncStorage.getItem('userToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || ''}`,
      'X-App-Version': '1.0.0',
    };
  }

  private async makeRequest<T = any>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const headers = await this.getAuthHeaders();

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const responseData = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: responseData.error || 'Request failed',
          statusCode: response.status,
        };
      }

      return {
        success: true,
        data: responseData,
        statusCode: response.status,
      };
    } catch (error: any) {
      console.error(`API Request failed [${method} ${endpoint}]:`, error);
      
      if (error.name === 'AbortError') {
        return {
          success: false,
          error: 'Request timeout',
          statusCode: 408,
        };
      }

      return {
        success: false,
        error: error.message || 'Network error',
        statusCode: 0,
      };
    }
  }

  // ==============================
  // Authentication & User Management
  // ==============================

  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.makeRequest<{ user: User; token: string }>('/auth/login', 'POST', {
      email,
      password,
    });
  }

  async register(
    email: string,
    password: string,
    name: string,
    mode: 'faith' | 'encouragement'
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.makeRequest<{ user: User; token: string }>('/auth/register', 'POST', {
      email,
      password,
      name,
      mode,
    });
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.makeRequest<User>('/users/me');
  }

  async updateProfile(updates: Partial<User>): Promise<ApiResponse<User>> {
    return this.makeRequest<User>('/users/me', 'PUT', updates);
  }

  // ==============================
  // Subscription Management
  // ==============================

  async getSubscription(): Promise<ApiResponse<SubscriptionData>> {
    return this.makeRequest<SubscriptionData>('/subscriptions/current');
  }

  async createSubscription(
    tier: TierType,
    billingCycle: BillingCycle,
    paymentMethodId?: string
  ): Promise<ApiResponse<SubscriptionData>> {
    return this.makeRequest<SubscriptionData>('/subscriptions', 'POST', {
      tier,
      billingCycle,
      paymentMethodId,
    });
  }

  async updateSubscription(
    subscriptionId: string,
    updates: { tier?: TierType; billingCycle?: BillingCycle }
  ): Promise<ApiResponse<SubscriptionData>> {
    return this.makeRequest<SubscriptionData>(`/subscriptions/${subscriptionId}`, 'PUT', updates);
  }

  async cancelSubscription(subscriptionId: string, immediately: boolean = false): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/subscriptions/${subscriptionId}/cancel`, 'POST', { immediately });
  }

  async startTrial(tier: TierType = 'commissioned'): Promise<ApiResponse<SubscriptionData>> {
    return this.makeRequest<SubscriptionData>('/subscriptions/trial', 'POST', { tier });
  }

  // ==============================
  // Enhanced Content Generation with Tier Limits
  // ==============================

  async generateContent(
    prompt: string, 
    type: 'social' | 'email' | 'hashtags' | 'seo' | 'post' | 'story' | 'reel' | 'article',
    options?: {
      tone?: string;
      length?: string;
      includeScripture?: boolean;
      targetAudience?: string;
      faithMode?: boolean;
    }
  ): Promise<ApiResponse<{ content: string; metadata: any; usage: { remaining: number; limit: number } }>> {
    try {
      // Check tier limits first
      const tierLimitResponse = await this.makeRequest<{ canGenerate: boolean; remaining: number; limit: number }>(
        '/content/check-limit'
      );

      if (!tierLimitResponse.success || !tierLimitResponse.data?.canGenerate) {
        return {
          success: false,
          error: 'Generation limit reached for your tier',
          data: tierLimitResponse.data,
        };
      }

      // Generate content using AI service
      const content = await aiContentService.generateContent(prompt, type, {
        faithMode: options?.faithMode || false,
        tone: options?.tone || 'inspirational',
        length: options?.length,
        includeScripture: options?.includeScripture,
        targetAudience: options?.targetAudience,
      });

      // Save generation to backend for tracking
      const saveResponse = await this.makeRequest('/content/track-generation', 'POST', {
        type,
        prompt,
        contentLength: content.length,
        options,
      });

      return {
        success: true,
        data: {
          content,
          metadata: { type, prompt, options },
          usage: tierLimitResponse.data,
        },
      };
    } catch (error: any) {
      console.error('Content generation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate content',
      };
    }
  }

  async saveGeneratedContent(
    content: string,
    type: string,
    metadata?: any
  ): Promise<ApiResponse<{ id: string }>> {
    return this.makeRequest<{ id: string }>('/content/save', 'POST', {
      content,
      type,
      metadata,
    });
  }

  async getContentHistory(
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<{ items: any[]; total: number; pages: number }>> {
    return this.makeRequest<{ items: any[]; total: number; pages: number }>(
      `/content/history?page=${page}&limit=${limit}`
    );
  }

  // ==============================
  // Product Sync with Tier Limits
  // ==============================

  async syncProducts(platform: 'Etsy' | 'Printify' | 'Shopify'): Promise<ApiResponse<any[]>> {
    try {
      // Check tier limits for product sync
      const tierCheck = await this.makeRequest<{ canSync: boolean; limit: number; current: number }>(
        `/products/sync-limit?platform=${platform}`
      );

      if (!tierCheck.success || !tierCheck.data?.canSync) {
        return {
          success: false,
          error: 'Product sync limit reached for your tier',
          data: tierCheck.data,
        };
      }

      // Perform actual sync
      const syncResponse = await this.makeRequest<any[]>(`/products/sync/${platform}`, 'POST');
      
      if (syncResponse.success) {
        // Mock enhanced data for now
        const enhancedProducts = syncResponse.data?.map((product: any) => ({
          ...product,
          id: `${platform}_${Date.now()}_${Math.random()}`,
          platform,
          syncStatus: 'Synced',
          stats: {
            views: Math.floor(Math.random() * 1000),
            sales: Math.floor(Math.random() * 50),
            revenue: Math.floor(Math.random() * 1000),
          },
          lastSync: new Date().toLocaleString(),
        })) || [];

        return {
          success: true,
          data: enhancedProducts,
        };
      }

      return syncResponse;
    } catch (error: any) {
      console.error('Product sync error:', error);
      return {
        success: false,
        error: `Failed to sync ${platform} products`,
      };
    }
  }

  // ==============================
  // Enhanced Analytics with Tier-Based Features
  // ==============================

  async getAnalytics(
    timeframe: '7d' | '30d' | '90d' = '30d'
  ): Promise<ApiResponse<any>> {
    return this.makeRequest<any>(`/analytics?period=${timeframe}`);
  }

  async trackEvent(
    event: string,
    properties?: Record<string, any>
  ): Promise<ApiResponse<void>> {
    return this.makeRequest<void>('/analytics/events', 'POST', {
      event,
      properties,
      timestamp: new Date().toISOString(),
    });
  }

  // ==============================
  // Admin Operations (Enhanced)
  // ==============================

  async getUsers(
    page: number = 1,
    limit: number = 50,
    filters?: {
      tier?: TierType;
      status?: string;
      search?: string;
    }
  ): Promise<ApiResponse<{ users: User[]; total: number; pages: number }>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.tier && { tier: filters.tier }),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.search && { search: filters.search }),
    });

    return this.makeRequest<{ users: User[]; total: number; pages: number }>(
      `/admin/users?${params.toString()}`
    );
  }

  async updateUserTier(
    userId: string,
    tier: TierType,
    reason: string
  ): Promise<ApiResponse<User>> {
    return this.makeRequest<User>(`/admin/users/${userId}/tier`, 'PUT', { tier, reason });
  }

  async applyUserDiscount(
    userId: string,
    discountPercent: number,
    durationMonths: number,
    reason: string
  ): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/admin/users/${userId}/discount`, 'POST', {
      discountPercent,
      durationMonths,
      reason,
    });
  }

  async getUsageStats(): Promise<ApiResponse<any>> {
    return this.makeRequest<any>('/subscriptions/usage');
  }

  // ==============================
  // Notification Management
  // ==============================

  async getNotificationSettings(): Promise<ApiResponse<any>> {
    return this.makeRequest<any>('/users/notification-settings');
  }

  async updateNotificationSettings(settings: any): Promise<ApiResponse<void>> {
    return this.makeRequest<void>('/users/notification-settings', 'PUT', settings);
  }

  async sendNotification(
    userId: string,
    notification: {
      type: 'push' | 'email' | 'in_app';
      title: string;
      message: string;
      data?: any;
    }
  ): Promise<ApiResponse<void>> {
    return this.makeRequest<void>('/admin/notifications/send', 'POST', {
      userId,
      ...notification,
    });
  }

  // ==============================
  // Team Management (Enterprise)
  // ==============================

  async getTeamMembers(): Promise<ApiResponse<any[]>> {
    return this.makeRequest<any[]>('/teams/members');
  }

  async inviteTeamMember(
    email: string,
    role: 'admin' | 'editor' | 'viewer'
  ): Promise<ApiResponse<void>> {
    return this.makeRequest<void>('/teams/invite', 'POST', { email, role });
  }

  async removeTeamMember(memberId: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/teams/members/${memberId}`, 'DELETE');
  }

  // ==============================
  // Webhook Management
  // ==============================

  async handleStripeWebhook(
    eventType: string,
    data: any
  ): Promise<ApiResponse<void>> {
    return this.makeRequest<void>('/webhooks/stripe', 'POST', {
      type: eventType,
      data,
    });
  }

  // ==============================
  // Feature Flags & A/B Testing
  // ==============================

  async getFeatureFlags(): Promise<ApiResponse<Record<string, boolean>>> {
    return this.makeRequest<Record<string, boolean>>('/features/flags');
  }

  async getABTestVariant(testName: string): Promise<ApiResponse<{ variant: string }>> {
    return this.makeRequest<{ variant: string }>(`/features/ab-test/${testName}`);
  }
}

export default APIService.getInstance();

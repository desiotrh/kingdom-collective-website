/**
 * 🚀 KINGDOM LAUNCHPAD - UNIFIED API SERVICE
 * Replaces Firebase with unified API endpoints
 *
 * This service provides all Kingdom Launchpad functionality through the unified API:
 * - Product management and creation
 * - E-commerce platform integration
 * - Content generation and management
 * - Analytics and business intelligence
 * - Team collaboration and automation
 * - Payment processing and billing
 * - Marketing and social media tools
 */

import { apiClients } from '@kingdom-collective/api';

// Types for Kingdom Launchpad
export interface Product {
  id?: string;
  userId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  platform: string;
  status: 'draft' | 'active' | 'paused' | 'archived';
  images: string[];
  variants?: ProductVariant[];
  analytics?: {
    views: number;
    sales: number;
    revenue: number;
    conversionRate: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  sku?: string;
  inventory?: number;
}

export interface ContentItem {
  id?: string;
  userId: string;
  productId?: string;
  type: 'description' | 'marketing' | 'social' | 'email';
  title: string;
  content: string;
  platform?: string;
  status: 'draft' | 'scheduled' | 'published';
  scheduledAt?: Date;
  publishedAt?: Date;
  analytics?: {
    views: number;
    engagement: number;
    conversions: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AnalyticsData {
  period: string;
  revenue: number;
  sales: number;
  products: number;
  conversionRate: number;
  topProducts: Product[];
  platformBreakdown: Record<string, number>;
}

export interface TeamMember {
  id: string;
  userId: string;
  email: string;
  name: string;
  role: 'viewer' | 'editor' | 'admin';
  permissions: string[];
  invitedAt: Date;
  joinedAt?: Date;
}

export interface AutomationRule {
  id?: string;
  userId: string;
  name: string;
  trigger: string;
  conditions: Record<string, any>;
  actions: string[];
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class KingdomLaunchpadApiService {
  private static instance: KingdomLaunchpadApiService;
  private api = apiClients.launchpad;

  private constructor() {}

  static getInstance(): KingdomLaunchpadApiService {
    if (!KingdomLaunchpadApiService.instance) {
      KingdomLaunchpadApiService.instance = new KingdomLaunchpadApiService();
    }
    return KingdomLaunchpadApiService.instance;
  }

  // ================================
  // PRODUCT MANAGEMENT
  // ================================

  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ id: string }> {
    const response = await this.api.createProduct(product);
    if (!response.success) throw new Error(response.error || 'Failed to create product');
    return response.data;
  }

  async getProducts(
    page: number = 1,
    limit: number = 20,
    filters?: {
      platform?: string;
      status?: string;
      category?: string;
      search?: string;
    }
  ): Promise<{
    products: Product[];
    total: number;
    pages: number;
  }> {
    const response = await this.api.getProducts(page, limit, filters);
    if (!response.success) throw new Error(response.error || 'Failed to fetch products');
    return response.data;
  }

  async getProduct(productId: string): Promise<Product> {
    const response = await this.api.getProduct(productId);
    if (!response.success) throw new Error(response.error || 'Failed to fetch product');
    return response.data;
  }

  async updateProduct(productId: string, updates: Partial<Product>): Promise<void> {
    const response = await this.api.updateProduct(productId, updates);
    if (!response.success) throw new Error(response.error || 'Failed to update product');
  }

  async deleteProduct(productId: string): Promise<void> {
    const response = await this.api.deleteProduct(productId);
    if (!response.success) throw new Error(response.error || 'Failed to delete product');
  }

  async syncWithPlatform(productId: string, platform: string): Promise<{ success: boolean }> {
    const response = await this.api.syncWithPlatform(productId, platform);
    if (!response.success) throw new Error(response.error || 'Failed to sync with platform');
    return response.data;
  }

  // ================================
  // CONTENT GENERATION & MANAGEMENT
  // ================================

  async generateProductContent(
    productId: string,
    type: 'description' | 'marketing' | 'social',
    options?: {
      tone?: string;
      targetAudience?: string;
      platform?: string;
    }
  ): Promise<{ content: string; suggestions: string[] }> {
    const response = await this.api.generateProductContent(productId, type, options);
    if (!response.success) throw new Error(response.error || 'Failed to generate content');
    return response.data;
  }

  async generateMarketingContent(
    prompt: string,
    type: 'email' | 'social' | 'ad' | 'landing',
    options?: {
      tone?: string;
      platform?: string;
      targetAudience?: string;
    }
  ): Promise<{ content: string; variations: string[] }> {
    const response = await this.api.generateMarketingContent(prompt, type, options);
    if (!response.success) throw new Error(response.error || 'Failed to generate marketing content');
    return response.data;
  }

  async saveContent(content: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ id: string }> {
    const response = await this.api.saveContent(content);
    if (!response.success) throw new Error(response.error || 'Failed to save content');
    return response.data;
  }

  async getContentItems(
    page: number = 1,
    limit: number = 20,
    filters?: {
      type?: string;
      status?: string;
      productId?: string;
    }
  ): Promise<{
    content: ContentItem[];
    total: number;
    pages: number;
  }> {
    const response = await this.api.getContentItems(page, limit, filters);
    if (!response.success) throw new Error(response.error || 'Failed to fetch content items');
    return response.data;
  }

  async scheduleContent(contentId: string, scheduledAt: Date): Promise<void> {
    const response = await this.api.scheduleContent(contentId, scheduledAt);
    if (!response.success) throw new Error(response.error || 'Failed to schedule content');
  }

  // ================================
  // ANALYTICS & BUSINESS INTELLIGENCE
  // ================================

  async getBusinessAnalytics(period: string = '30d'): Promise<AnalyticsData> {
    const response = await this.api.getBusinessAnalytics(period);
    if (!response.success) throw new Error(response.error || 'Failed to fetch business analytics');
    return response.data;
  }

  async getProductAnalytics(productId: string, period: string = '30d'): Promise<{
    views: number;
    sales: number;
    revenue: number;
    conversionRate: number;
    platformBreakdown: Record<string, number>;
  }> {
    const response = await this.api.getProductAnalytics(productId, period);
    if (!response.success) throw new Error(response.error || 'Failed to fetch product analytics');
    return response.data;
  }

  async getContentAnalytics(contentId: string): Promise<{
    views: number;
    engagement: number;
    conversions: number;
    platformPerformance: Record<string, number>;
  }> {
    const response = await this.api.getContentAnalytics(contentId);
    if (!response.success) throw new Error(response.error || 'Failed to fetch content analytics');
    return response.data;
  }

  // ================================
  // TEAM COLLABORATION
  // ================================

  async getTeamMembers(): Promise<TeamMember[]> {
    const response = await this.api.getTeamMembers();
    if (!response.success) throw new Error(response.error || 'Failed to fetch team members');
    return response.data;
  }

  async inviteTeamMember(email: string, role: string, permissions: string[]): Promise<{ invitationId: string }> {
    const response = await this.api.inviteTeamMember(email, role, permissions);
    if (!response.success) throw new Error(response.error || 'Failed to invite team member');
    return response.data;
  }

  async updateTeamMember(memberId: string, updates: Partial<TeamMember>): Promise<void> {
    const response = await this.api.updateTeamMember(memberId, updates);
    if (!response.success) throw new Error(response.error || 'Failed to update team member');
  }

  async removeTeamMember(memberId: string): Promise<void> {
    const response = await this.api.removeTeamMember(memberId);
    if (!response.success) throw new Error(response.error || 'Failed to remove team member');
  }

  // ================================
  // AUTOMATION & WORKFLOWS
  // ================================

  async createAutomationRule(rule: Omit<AutomationRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ id: string }> {
    const response = await this.api.createAutomationRule(rule);
    if (!response.success) throw new Error(response.error || 'Failed to create automation rule');
    return response.data;
  }

  async getAutomationRules(): Promise<AutomationRule[]> {
    const response = await this.api.getAutomationRules();
    if (!response.success) throw new Error(response.error || 'Failed to fetch automation rules');
    return response.data;
  }

  async updateAutomationRule(ruleId: string, updates: Partial<AutomationRule>): Promise<void> {
    const response = await this.api.updateAutomationRule(ruleId, updates);
    if (!response.success) throw new Error(response.error || 'Failed to update automation rule');
  }

  async deleteAutomationRule(ruleId: string): Promise<void> {
    const response = await this.api.deleteAutomationRule(ruleId);
    if (!response.success) throw new Error(response.error || 'Failed to delete automation rule');
  }

  // ================================
  // PAYMENT PROCESSING
  // ================================

  async createPaymentIntent(amount: number, currency: string, metadata?: Record<string, any>): Promise<{
    clientSecret: string;
    paymentIntentId: string;
  }> {
    const response = await this.api.createPaymentIntent(amount, currency, metadata);
    if (!response.success) throw new Error(response.error || 'Failed to create payment intent');
    return response.data;
  }

  async getPaymentMethods(): Promise<{
    id: string;
    type: string;
    last4: string;
    brand: string;
    expMonth: number;
    expYear: number;
  }[]> {
    const response = await this.api.getPaymentMethods();
    if (!response.success) throw new Error(response.error || 'Failed to fetch payment methods');
    return response.data;
  }

  async createSetupIntent(): Promise<{ clientSecret: string }> {
    const response = await this.api.createSetupIntent();
    if (!response.success) throw new Error(response.error || 'Failed to create setup intent');
    return response.data;
  }

  // ================================
  // SOCIAL MEDIA & EMAIL MARKETING
  // ================================

  async connectSocialAccount(platform: string, credentials: Record<string, any>): Promise<{ accountId: string }> {
    const response = await this.api.connectSocialAccount(platform, credentials);
    if (!response.success) throw new Error(response.error || 'Failed to connect social account');
    return response.data;
  }

  async getSocialAccounts(): Promise<{
    id: string;
    platform: string;
    username: string;
    connected: boolean;
    lastSync?: Date;
  }[]> {
    const response = await this.api.getSocialAccounts();
    if (!response.success) throw new Error(response.error || 'Failed to fetch social accounts');
    return response.data;
  }

  async postToSocialMedia(
    platform: string,
    content: string,
    media?: string[],
    scheduledAt?: Date
  ): Promise<{ postId: string }> {
    const response = await this.api.postToSocialMedia(platform, content, media, scheduledAt);
    if (!response.success) throw new Error(response.error || 'Failed to post to social media');
    return response.data;
  }

  async createEmailCampaign(
    name: string,
    subject: string,
    content: string,
    recipients: string[]
  ): Promise<{ campaignId: string }> {
    const response = await this.api.createEmailCampaign(name, subject, content, recipients);
    if (!response.success) throw new Error(response.error || 'Failed to create email campaign');
    return response.data;
  }

  async sendEmailCampaign(campaignId: string): Promise<{ sentCount: number }> {
    const response = await this.api.sendEmailCampaign(campaignId);
    if (!response.success) throw new Error(response.error || 'Failed to send email campaign');
    return response.data;
  }

  async getEmailAnalytics(campaignId: string): Promise<{
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    unsubscribed: number;
  }> {
    const response = await this.api.getEmailAnalytics(campaignId);
    if (!response.success) throw new Error(response.error || 'Failed to fetch email analytics');
    return response.data;
  }

  // ================================
  // UTILITY METHODS
  // ================================

  async clearCache(): Promise<void> {
    const response = await this.api.clearCache();
    if (!response.success) throw new Error(response.error || 'Failed to clear cache');
  }

  async getApiStats(): Promise<{
    requests: number;
    cacheHits: number;
    averageResponseTime: number;
  }> {
    const response = await this.api.getApiStats();
    if (!response.success) throw new Error(response.error || 'Failed to fetch API stats');
    return response.data;
  }

  /**
   * Delete user account
   */
  async deleteUser(): Promise<{ success: boolean; message: string }> {
    const response = await this.api.deleteUser();
    if (!response.success) throw new Error(response.error || 'Failed to delete user account');
    return response.data;
  }
}

export const kingdomLaunchpadApi = KingdomLaunchpadApiService.getInstance(); 
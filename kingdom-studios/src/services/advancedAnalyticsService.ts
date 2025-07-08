import { Environment } from '../config/environment';
import { AnalyticsTracking } from './analyticsTracking';
import { BackendAPI } from './backendAPI';

export interface AnalyticsEvent {
  name: string;
  parameters?: Record<string, any>;
}

export interface UserProperties {
  faithMode?: boolean;
  userType?: 'creator' | 'business' | 'ministry';
  subscriptionTier?: 'free' | 'pro' | 'enterprise';
  primaryPlatform?: string;
}

export interface ContentAnalytics {
  contentId: string;
  contentType: 'social_post' | 'product' | 'email' | 'course';
  views: number;
  engagement: number;
  conversions: number;
  revenue: number;
  platform: string;
  createdAt: Date;
  tags: string[];
}

class AdvancedAnalyticsService {
  private static instance: AdvancedAnalyticsService;
  private isInitialized = false;
  private analyticsTracking: typeof AnalyticsTracking;

  private constructor() {
    this.analyticsTracking = AnalyticsTracking;
    this.initializeAnalytics();
  }

  static getInstance(): AdvancedAnalyticsService {
    if (!AdvancedAnalyticsService.instance) {
      AdvancedAnalyticsService.instance = new AdvancedAnalyticsService();
    }
    return AdvancedAnalyticsService.instance;
  }

  private async initializeAnalytics(): Promise<void> {
    try {
      // The AnalyticsTracking service handles all provider initialization
      this.isInitialized = true;
      
      if (Environment.isDebugEnabled()) {
        console.log('[Advanced Analytics] Service initialized using AnalyticsTracking');
      }
      
      this.isInitialized = true;
      console.log('Advanced Analytics initialized successfully');
    } catch (error) {
      console.error('Analytics initialization error:', error);
    }
  }

  // User Analytics
  async setUserId(userId: string, properties?: UserProperties): Promise<void> {
    try {
      await this.analyticsTracking.identify(userId, properties);
      
      if (Environment.isDebugEnabled()) {
        console.log('[Advanced Analytics] User identity set:', userId);
      }
    } catch (error) {
      console.error('[Advanced Analytics] Set user ID error:', error);
    }
  }

  async setUserProperties(properties: UserProperties): Promise<void> {
    try {
      await this.analyticsTracking.setUserProperties(properties);
      
      if (Environment.isDebugEnabled()) {
        console.log('[Advanced Analytics] User properties updated:', properties);
      }
    } catch (error) {
      console.error('[Advanced Analytics] Set user properties error:', error);
    }
  }

  // Event Tracking
  async trackEvent(event: AnalyticsEvent): Promise<void> {
    try {
      await this.analyticsTracking.track({
        name: event.name,
        properties: event.parameters,
        category: 'advanced_analytics'
      });
      
      if (Environment.isDebugEnabled()) {
        console.log('[Advanced Analytics] Event tracked:', event);
      }
    } catch (error) {
      console.error('[Advanced Analytics] Track event error:', error);
    }
  }

  // Screen Tracking
  async trackScreenView(screenName: string, screenClass?: string): Promise<void> {
    try {
      await this.analyticsTracking.trackScreenView(screenName, {
        screen_class: screenClass,
        timestamp: Date.now()
      });
      
      if (Environment.isDebugEnabled()) {
        console.log('[Advanced Analytics] Screen view tracked:', screenName);
      }
    } catch (error) {
      console.error('Track screen view error:', error);
    }
  }

  // E-commerce Tracking
  async trackPurchase(transactionId: string, value: number, currency: string = 'USD', items?: any[]): Promise<void> {
    try {
      await this.analyticsTracking.trackEcommerce({
        eventType: 'purchase',
        transactionId,
        value,
        currency,
        items: (items || []).map(item => ({
          item_id: item.item_id || item.id || 'unknown',
          item_name: item.item_name || item.name || 'Unknown Item',
          item_category: item.item_category || item.category || 'unknown',
          price: item.price || item.value || 0,
          quantity: item.quantity || 1
        }))
      });
      
      if (Environment.isDebugEnabled()) {
        console.log('[Advanced Analytics] Purchase tracked:', { transactionId, value, currency });
      }
    } catch (error) {
      console.error('[Advanced Analytics] Track purchase error:', error);
    }
  }

  async trackAddToCart(itemId: string, itemName: string, value: number, currency: string = 'USD'): Promise<void> {
    try {
      await this.analyticsTracking.trackEcommerce({
        eventType: 'add_to_cart',
        value,
        currency,
        items: [{
          item_id: itemId,
          item_name: itemName,
          item_category: 'unknown',
          price: value,
          quantity: 1
        }]
      });
      
      if (Environment.isDebugEnabled()) {
        console.log('[Advanced Analytics] Add to cart tracked:', { itemId, itemName, value });
      }
    } catch (error) {
      console.error('[Advanced Analytics] Track add to cart error:', error);
    }
  }

  // Content Analytics
  async trackContentGeneration(contentType: string, faithMode: boolean, success: boolean): Promise<void> {
    await this.trackEvent({
      name: 'content_generated',
      parameters: {
        content_type: contentType,
        faith_mode: faithMode,
        success,
        timestamp: Date.now(),
      }
    });
  }

  async trackContentShare(contentId: string, platform: string): Promise<void> {
    await this.trackEvent({
      name: 'content_shared',
      parameters: {
        content_id: contentId,
        platform,
        timestamp: Date.now(),
      }
    });
  }

  async trackProductSync(platform: string, productCount: number, success: boolean): Promise<void> {
    await this.trackEvent({
      name: 'product_sync',
      parameters: {
        platform,
        product_count: productCount,
        success,
        timestamp: Date.now(),
      }
    });
  }

  // Engagement Tracking
  async trackEngagement(action: string, category: string, label?: string, value?: number): Promise<void> {
    await this.trackEvent({
      name: 'engagement',
      parameters: {
        action,
        category,
        label,
        value,
        timestamp: Date.now(),
      }
    });
  }

  // Faith-based Analytics
  async trackFaithModeToggle(enabled: boolean): Promise<void> {
    await this.trackEvent({
      name: 'faith_mode_toggle',
      parameters: {
        enabled,
        timestamp: Date.now(),
      }
    });
  }

  async trackMinistryAction(action: string, category: string): Promise<void> {
    await this.trackEvent({
      name: 'ministry_action',
      parameters: {
        action,
        category,
        timestamp: Date.now(),
      }
    });
  }

  // Business Intelligence
  async getContentPerformance(userId: string, timeframe: 'week' | 'month' | 'quarter'): Promise<ContentAnalytics[]> {
    // This would typically connect to your analytics API
    try {
      // Mock data for now - replace with real API call
      return [
        {
          contentId: '1',
          contentType: 'social_post',
          views: 1250,
          engagement: 89,
          conversions: 12,
          revenue: 340,
          platform: 'Instagram',
          createdAt: new Date(),
          tags: ['faith', 'inspiration', 'business']
        },
        {
          contentId: '2',
          contentType: 'product',
          views: 890,
          engagement: 45,
          conversions: 8,
          revenue: 240,
          platform: 'Etsy',
          createdAt: new Date(),
          tags: ['christian', 't-shirt', 'ministry']
        }
      ];
    } catch (error) {
      console.error('Get content performance error:', error);
      return [];
    }
  }

  async getRevenueAnalytics(userId: string, timeframe: 'week' | 'month' | 'quarter'): Promise<any> {
    try {
      // Mock data for now - replace with real API call
      return {
        totalRevenue: 2340,
        growth: 23,
        topPerformingContent: 'Faith-Based T-Shirt Collection',
        conversionRate: 3.2,
        averageOrderValue: 32.50,
        platformBreakdown: {
          Etsy: 1200,
          Shopify: 840,
          Printify: 300,
        }
      };
    } catch (error) {
      console.error('Get revenue analytics error:', error);
      return null;
    }
  }

  // AI-Powered Insights
  async generateInsights(userId: string, faithMode: boolean): Promise<string[]> {
    try {
      // This would use AI to analyze user data and provide insights
      const baseInsights = [
        'Your engagement rate is 23% higher than average',
        'Posts with faith-based content perform 45% better',
        'Tuesday mornings are your best posting time',
        'Consider creating more video content for better reach'
      ];

      const faithInsights = [
        'Your Kingdom-focused content resonates strongly with your audience',
        'Prayer request posts generate the highest engagement',
        'Scripture-based designs are your top sellers',
        'Consider expanding your ministry merchandise line'
      ];

      return faithMode ? [...baseInsights, ...faithInsights] : baseInsights;
    } catch (error) {
      console.error('Generate insights error:', error);
      return [];
    }
  }

  // Custom Event Tracking for Kingdom Studios specific features
  async trackKingdomFeature(feature: string, action: string, success: boolean): Promise<void> {
    await this.trackEvent({
      name: 'kingdom_feature_usage',
      parameters: {
        feature,
        action,
        success,
        timestamp: Date.now(),
      }
    });
  }

  // Attribution Tracking
  async trackAttribution(source: string, medium: string, campaign?: string): Promise<void> {
    await this.trackEvent({
      name: 'user_acquisition',
      parameters: {
        source,
        medium,
        campaign,
        timestamp: Date.now(),
      }
    });
  }

  // Performance Monitoring
  async trackPerformance(action: string, duration: number): Promise<void> {
    await this.trackEvent({
      name: 'performance_metric',
      parameters: {
        action,
        duration,
        timestamp: Date.now(),
      }
    });
  }

  // Error Tracking
  async trackError(error: Error, context: string): Promise<void> {
    await this.trackEvent({
      name: 'app_error',
      parameters: {
        error_message: error.message,
        error_stack: error.stack,
        context,
        timestamp: Date.now(),
      }
    });
  }
}

export default AdvancedAnalyticsService.getInstance();

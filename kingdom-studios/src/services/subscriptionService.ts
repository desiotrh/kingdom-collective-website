// ==============================
// 🔐 Kingdom Studios Subscription Service
// Complete backend integration for tier system
// ==============================

import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from './apiService';
import BillingService from './BillingService';
import { TierType, BillingCycle, TIER_CONFIG } from '../contexts/TierSystemContext';

export interface SubscriptionStatus {
  id: string;
  userId: string;
  tier: TierType;
  billingCycle: BillingCycle;
  status: 'active' | 'trial' | 'past_due' | 'canceled' | 'incomplete';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEnd?: string;
  stripeSubscriptionId?: string;
  amount: number;
  currency: string;
  isActive: boolean;
  features: {
    contentGeneration: { used: number; limit: number };
    productSync: { used: number; limit: number };
    teamMembers: { used: number; limit: number };
    analytics: boolean;
    prioritySupport: boolean;
  };
  nextBillingDate?: string;
  cancelAtPeriodEnd?: boolean;
}

export interface UsageStats {
  contentGeneration: {
    used: number;
    limit: number;
    remaining: number;
    resetDate: string;
  };
  productSync: {
    used: number;
    limit: number;
    remaining: number;
    resetDate: string;
  };
  teamMembers: {
    used: number;
    limit: number;
    remaining: number;
  };
}

export class SubscriptionService {
  private static instance: SubscriptionService;
  private cachedSubscription: SubscriptionStatus | null = null;
  private cacheExpiry: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  static getInstance(): SubscriptionService {
    if (!SubscriptionService.instance) {
      SubscriptionService.instance = new SubscriptionService();
    }
    return SubscriptionService.instance;
  }

  // ==============================
  // Subscription Management
  // ==============================

  async getCurrentSubscription(forceRefresh = false): Promise<SubscriptionStatus | null> {
    try {
      // Return cached data if still valid
      if (!forceRefresh && this.cachedSubscription && Date.now() < this.cacheExpiry) {
        return this.cachedSubscription;
      }

      const response = await apiService.getSubscription();
      
      if (response.success && response.data) {
        this.cachedSubscription = this.transformApiSubscription(response.data);
        this.cacheExpiry = Date.now() + this.CACHE_DURATION;
        
        // Cache locally for offline access
        await AsyncStorage.setItem('subscription_cache', JSON.stringify(this.cachedSubscription));
        
        return this.cachedSubscription;
      }

      // Fallback to cached data if API fails
      const cachedData = await AsyncStorage.getItem('subscription_cache');
      if (cachedData) {
        this.cachedSubscription = JSON.parse(cachedData);
        return this.cachedSubscription;
      }

      return null;
    } catch (error) {
      console.error('Failed to get subscription:', error);
      
      // Try to return cached data on error
      const cachedData = await AsyncStorage.getItem('subscription_cache');
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      
      return null;
    }
  }

  async createSubscription(
    tier: TierType,
    billingCycle: BillingCycle,
    paymentMethodId?: string
  ): Promise<{ success: boolean; subscription?: SubscriptionStatus; error?: string }> {
    try {
      const response = await apiService.createSubscription(tier, billingCycle, paymentMethodId);
      
      if (response.success && response.data) {
        this.cachedSubscription = this.transformApiSubscription(response.data);
        this.cacheExpiry = Date.now() + this.CACHE_DURATION;
        
        return {
          success: true,
          subscription: this.cachedSubscription,
        };
      }

      return {
        success: false,
        error: response.error || 'Failed to create subscription',
      };
    } catch (error: any) {
      console.error('Subscription creation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create subscription',
      };
    }
  }

  async upgradeSubscription(
    newTier: TierType,
    billingCycle?: BillingCycle
  ): Promise<{ success: boolean; subscription?: SubscriptionStatus; error?: string }> {
    try {
      const currentSub = await this.getCurrentSubscription();
      if (!currentSub) {
        return { success: false, error: 'No active subscription found' };
      }

      const response = await apiService.updateSubscription(currentSub.id, {
        tier: newTier,
        billingCycle: billingCycle || currentSub.billingCycle,
      });

      if (response.success && response.data) {
        this.cachedSubscription = this.transformApiSubscription(response.data);
        this.cacheExpiry = Date.now() + this.CACHE_DURATION;
        
        return {
          success: true,
          subscription: this.cachedSubscription,
        };
      }

      return {
        success: false,
        error: response.error || 'Failed to upgrade subscription',
      };
    } catch (error: any) {
      console.error('Subscription upgrade error:', error);
      return {
        success: false,
        error: error.message || 'Failed to upgrade subscription',
      };
    }
  }

  async cancelSubscription(immediately = false): Promise<{ success: boolean; error?: string }> {
    try {
      const currentSub = await this.getCurrentSubscription();
      if (!currentSub) {
        return { success: false, error: 'No active subscription found' };
      }

      const response = await apiService.cancelSubscription(currentSub.id, immediately);
      
      if (response.success) {
        // Clear cache to force refresh
        this.cachedSubscription = null;
        this.cacheExpiry = 0;
        
        return { success: true };
      }

      return {
        success: false,
        error: response.error || 'Failed to cancel subscription',
      };
    } catch (error: any) {
      console.error('Subscription cancellation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to cancel subscription',
      };
    }
  }

  async startTrial(tier: TierType = 'commissioned'): Promise<{ success: boolean; subscription?: SubscriptionStatus; error?: string }> {
    try {
      const response = await apiService.startTrial(tier);
      
      if (response.success && response.data) {
        this.cachedSubscription = this.transformApiSubscription(response.data);
        this.cacheExpiry = Date.now() + this.CACHE_DURATION;
        
        return {
          success: true,
          subscription: this.cachedSubscription,
        };
      }

      return {
        success: false,
        error: response.error || 'Failed to start trial',
      };
    } catch (error: any) {
      console.error('Trial start error:', error);
      return {
        success: false,
        error: error.message || 'Failed to start trial',
      };
    }
  }

  // ==============================
  // Usage Tracking
  // ==============================

  async getUsageStats(): Promise<UsageStats | null> {
    try {
      const response = await apiService.getUsageStats();
      
      if (response.success && response.data) {
        return response.data;
      }

      // Fallback to local calculation if API fails
      const subscription = await this.getCurrentSubscription();
      if (subscription) {
        return {
          contentGeneration: {
            used: subscription.features.contentGeneration.used,
            limit: subscription.features.contentGeneration.limit,
            remaining: subscription.features.contentGeneration.limit - subscription.features.contentGeneration.used,
            resetDate: subscription.currentPeriodEnd,
          },
          productSync: {
            used: subscription.features.productSync.used,
            limit: subscription.features.productSync.limit,
            remaining: subscription.features.productSync.limit - subscription.features.productSync.used,
            resetDate: subscription.currentPeriodEnd,
          },
          teamMembers: {
            used: subscription.features.teamMembers.used,
            limit: subscription.features.teamMembers.limit,
            remaining: subscription.features.teamMembers.limit - subscription.features.teamMembers.used,
          },
        };
      }

      return null;
    } catch (error) {
      console.error('Failed to get usage stats:', error);
      return null;
    }
  }

  async canUseFeature(feature: 'contentGeneration' | 'productSync' | 'teamMembers'): Promise<boolean> {
    try {
      const usage = await this.getUsageStats();
      if (!usage) return false;

      const featureUsage = usage[feature];
      return featureUsage.remaining > 0;
    } catch (error) {
      console.error('Feature check error:', error);
      return false;
    }
  }

  async trackUsage(feature: 'audioDownloads' | 'projectCreation' | 'premiumAccess', amount: number = 1): Promise<boolean> {
    try {
      const response = await apiService.trackEvent('feature_usage', {
        feature,
        amount,
        tier: await this.getCurrentSubscription()?.then(s => s?.tier),
        timestamp: new Date().toISOString(),
      });

      return response.success;
    } catch (error) {
      console.error('Failed to track usage:', error);
      return false;
    }
  }

  // ==============================
  // Billing Integration
  // ==============================

  async createPaymentSession(tier: TierType, billingCycle: BillingCycle): Promise<{ success: boolean; sessionUrl?: string; error?: string }> {
    try {
      const tierConfig = TIER_CONFIG[tier];
      const amount = billingCycle === 'monthly' ? tierConfig.monthlyPrice : tierConfig.yearlyPrice;
      
      const session = await BillingService.createCheckoutSession({
        tier,
        billingCycle,
        amount,
        currency: 'usd',
      });

      if (session.success && session.url) {
        return {
          success: true,
          sessionUrl: session.url,
        };
      }

      return {
        success: false,
        error: session.error || 'Failed to create payment session',
      };
    } catch (error: any) {
      console.error('Payment session error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create payment session',
      };
    }
  }

  async openCustomerPortal(): Promise<{ success: boolean; portalUrl?: string; error?: string }> {
    try {
      const portal = await BillingService.createCustomerPortalSession();
      
      if (portal.success && portal.url) {
        return {
          success: true,
          portalUrl: portal.url,
        };
      }

      return {
        success: false,
        error: portal.error || 'Failed to open customer portal',
      };
    } catch (error: any) {
      console.error('Customer portal error:', error);
      return {
        success: false,
        error: error.message || 'Failed to open customer portal',
      };
    }
  }

  // ==============================
  // Helper Methods
  // ==============================

  private transformApiSubscription(apiData: any): SubscriptionStatus {
    const tierConfig = TIER_CONFIG[apiData.tier as TierType];
    
    return {
      id: apiData.id,
      userId: apiData.userId,
      tier: apiData.tier,
      billingCycle: apiData.billingCycle,
      status: apiData.status,
      currentPeriodStart: apiData.currentPeriodStart,
      currentPeriodEnd: apiData.currentPeriodEnd,
      trialEnd: apiData.trialEnd,
      stripeSubscriptionId: apiData.stripeSubscriptionId,
      amount: apiData.amount,
      currency: apiData.currency,
      isActive: ['active', 'trial'].includes(apiData.status),
      features: {
        contentGeneration: {
          used: apiData.usage?.contentGeneration || 0,
          limit: tierConfig.features.aiGenerationsPerDay,
        },
        productSync: {
          used: apiData.usage?.productSync || 0,
          limit: tierConfig.features.savedProductsLimit,
        },
        teamMembers: {
          used: apiData.usage?.teamMembers || 0,
          limit: tierConfig.features.teamSeats,
        },
        analytics: tierConfig.features.analytics !== 'none',
        prioritySupport: tierConfig.features.prioritySupport,
      },
      nextBillingDate: apiData.nextBillingDate,
      cancelAtPeriodEnd: apiData.cancelAtPeriodEnd,
    };
  }

  clearCache(): void {
    this.cachedSubscription = null;
    this.cacheExpiry = 0;
    AsyncStorage.removeItem('subscription_cache');
  }

  // ==============================
  // Sync with Context
  // ==============================

  async syncWithTierContext(): Promise<SubscriptionStatus | null> {
    const subscription = await this.getCurrentSubscription(true);
    
    if (subscription) {
      // Emit event for TierSystemContext to update
      // This could be done through EventEmitter or direct context update
      console.log('Subscription synced:', subscription.tier, subscription.status);
    }
    
    return subscription;
  }
}

export default SubscriptionService.getInstance();

// ==============================
// 🔄 Kingdom Studios Backend Sync Service
// Synchronizes frontend tier system with backend APIs
// ==============================

import { EventEmitter } from 'events';
import subscriptionService, { SubscriptionStatus } from './subscriptionService';
import apiService from './apiService';
import { TierType, BillingCycle } from '../contexts/TierSystemContext';

export interface SyncResult {
  success: boolean;
  data?: any;
  error?: string;
  needsRefresh?: boolean;
}

export interface BackendUser {
  id: string;
  email: string;
  name: string;
  tier: TierType;
  subscriptionStatus: 'active' | 'trial' | 'past_due' | 'canceled' | 'incomplete';
  trialEnd?: string;
  subscriptionEnd?: string;
  stripeCustomerId?: string;
  createdAt: string;
  lastLoginAt?: string;
  preferences: {
    mode: 'faith' | 'encouragement';
    notifications: {
      email: boolean;
      push: boolean;
      billing: boolean;
      features: boolean;
    };
  };
}

class BackendSyncService extends EventEmitter {
  private static instance: BackendSyncService;
  private syncInProgress = false;
  private lastSyncTime = 0;
  private readonly SYNC_COOLDOWN = 30 * 1000; // 30 seconds

  private constructor() {
    super();
  }

  static getInstance(): BackendSyncService {
    if (!BackendSyncService.instance) {
      BackendSyncService.instance = new BackendSyncService();
    }
    return BackendSyncService.instance;
  }

  // ==============================
  // Full System Sync
  // ==============================

  async performFullSync(forceRefresh = false): Promise<SyncResult> {
    try {
      // Prevent too frequent syncs
      const now = Date.now();
      if (!forceRefresh && this.syncInProgress) {
        return { success: false, error: 'Sync already in progress' };
      }

      if (!forceRefresh && (now - this.lastSyncTime) < this.SYNC_COOLDOWN) {
        return { success: false, error: 'Sync on cooldown' };
      }

      this.syncInProgress = true;
      this.emit('syncStarted');

      // 1. Sync user profile
      const userSync = await this.syncUserProfile();
      if (!userSync.success) {
        this.syncInProgress = false;
        this.emit('syncError', userSync.error);
        return userSync;
      }

      // 2. Sync subscription status
      const subscriptionSync = await this.syncSubscription(forceRefresh);
      if (!subscriptionSync.success) {
        this.syncInProgress = false;
        this.emit('syncError', subscriptionSync.error);
        return subscriptionSync;
      }

      // 3. Sync usage stats
      const usageSync = await this.syncUsageStats();

      // 4. Sync feature flags
      const featureSync = await this.syncFeatureFlags();

      this.lastSyncTime = now;
      this.syncInProgress = false;

      const syncData = {
        user: userSync.data,
        subscription: subscriptionSync.data,
        usage: usageSync.data,
        features: featureSync.data,
        timestamp: now,
      };

      this.emit('syncCompleted', syncData);

      return {
        success: true,
        data: syncData,
      };
    } catch (error: any) {
      this.syncInProgress = false;
      this.emit('syncError', error.message);
      console.error('Full sync failed:', error);
      return {
        success: false,
        error: error.message || 'Full sync failed',
      };
    }
  }

  // ==============================
  // Individual Sync Operations
  // ==============================

  async syncUserProfile(): Promise<SyncResult> {
    try {
      const response = await apiService.getCurrentUser();
      
      if (response.success && response.data) {
        this.emit('userSynced', response.data);
        return {
          success: true,
          data: response.data,
        };
      }

      return {
        success: false,
        error: response.error || 'Failed to sync user profile',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'User profile sync failed',
      };
    }
  }

  async syncSubscription(forceRefresh = false): Promise<SyncResult> {
    try {
      const subscription = await subscriptionService.getCurrentSubscription(forceRefresh);
      
      if (subscription) {
        this.emit('subscriptionSynced', subscription);
        return {
          success: true,
          data: subscription,
        };
      }

      // If no subscription found, user might be on free tier
      this.emit('subscriptionSynced', null);
      return {
        success: true,
        data: null,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Subscription sync failed',
      };
    }
  }

  async syncUsageStats(): Promise<SyncResult> {
    try {
      const usage = await subscriptionService.getUsageStats();
      
      this.emit('usageSynced', usage);
      return {
        success: true,
        data: usage,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Usage stats sync failed',
      };
    }
  }

  async syncFeatureFlags(): Promise<SyncResult> {
    try {
      const response = await apiService.getFeatureFlags();
      
      if (response.success && response.data) {
        this.emit('featuresSynced', response.data);
        return {
          success: true,
          data: response.data,
        };
      }

      return {
        success: false,
        error: response.error || 'Feature flags sync failed',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Feature flags sync failed',
      };
    }
  }

  // ==============================
  // Subscription Management
  // ==============================

  async upgradeSubscription(
    tier: TierType,
    billingCycle: BillingCycle
  ): Promise<SyncResult> {
    try {
      this.emit('upgradeStarted', { tier, billingCycle });

      const result = await subscriptionService.upgradeSubscription(tier, billingCycle);
      
      if (result.success) {
        // Perform a full sync to update all related data
        await this.performFullSync(true);
        
        this.emit('upgradeCompleted', result.subscription);
        return {
          success: true,
          data: result.subscription,
        };
      }

      this.emit('upgradeError', result.error);
      return {
        success: false,
        error: result.error,
      };
    } catch (error: any) {
      this.emit('upgradeError', error.message);
      return {
        success: false,
        error: error.message || 'Upgrade failed',
      };
    }
  }

  async cancelSubscription(immediately = false): Promise<SyncResult> {
    try {
      this.emit('cancellationStarted', { immediately });

      const result = await subscriptionService.cancelSubscription(immediately);
      
      if (result.success) {
        // Perform a full sync to update status
        await this.performFullSync(true);
        
        this.emit('cancellationCompleted');
        return {
          success: true,
        };
      }

      this.emit('cancellationError', result.error);
      return {
        success: false,
        error: result.error,
      };
    } catch (error: any) {
      this.emit('cancellationError', error.message);
      return {
        success: false,
        error: error.message || 'Cancellation failed',
      };
    }
  }

  async startTrial(tier: TierType = 'commissioned'): Promise<SyncResult> {
    try {
      this.emit('trialStarted', { tier });

      const result = await subscriptionService.startTrial(tier);
      
      if (result.success) {
        // Perform a full sync to update trial status
        await this.performFullSync(true);
        
        this.emit('trialCompleted', result.subscription);
        return {
          success: true,
          data: result.subscription,
        };
      }

      this.emit('trialError', result.error);
      return {
        success: false,
        error: result.error,
      };
    } catch (error: any) {
      this.emit('trialError', error.message);
      return {
        success: false,
        error: error.message || 'Trial start failed',
      };
    }
  }

  // ==============================
  // Analytics & Tracking
  // ==============================

  async trackUserAction(
    action: string,
    properties?: Record<string, any>
  ): Promise<void> {
    try {
      await apiService.trackEvent(action, {
        ...properties,
        timestamp: new Date().toISOString(),
        source: 'mobile_app',
      });
    } catch (error) {
      console.error('Failed to track user action:', error);
    }
  }

  async syncAnalytics(timeframe: '7d' | '30d' | '90d' = '30d'): Promise<SyncResult> {
    try {
      const response = await apiService.getAnalytics(timeframe);
      
      if (response.success && response.data) {
        this.emit('analyticsSynced', response.data);
        return {
          success: true,
          data: response.data,
        };
      }

      return {
        success: false,
        error: response.error || 'Analytics sync failed',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Analytics sync failed',
      };
    }
  }

  // ==============================
  // Webhook Event Handling
  // ==============================

  async handleWebhookEvent(eventType: string, data: any): Promise<void> {
    try {
      switch (eventType) {
        case 'subscription.updated':
        case 'subscription.canceled':
        case 'subscription.trial_will_end':
        case 'invoice.payment_succeeded':
        case 'invoice.payment_failed':
          // Sync subscription data when billing events occur
          await this.syncSubscription(true);
          break;

        case 'customer.subscription.deleted':
          // Force full sync when subscription is deleted
          await this.performFullSync(true);
          break;

        default:
          console.log('Unhandled webhook event:', eventType);
      }

      this.emit('webhookProcessed', { eventType, data });
    } catch (error) {
      console.error('Webhook event handling failed:', error);
      this.emit('webhookError', { eventType, error });
    }
  }

  // ==============================
  // Utility Methods
  // ==============================

  isSyncInProgress(): boolean {
    return this.syncInProgress;
  }

  getLastSyncTime(): number {
    return this.lastSyncTime;
  }

  // Force clear cache and perform fresh sync
  async resetAndSync(): Promise<SyncResult> {
    subscriptionService.clearCache();
    return this.performFullSync(true);
  }
}

export default BackendSyncService.getInstance();

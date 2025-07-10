import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { useNotifications } from './NotificationContext';
import backendSyncService from '../services/backendSyncService';
import subscriptionService from '../services/subscriptionService';

// ==============================
// 🏛️ ENHANCED KINGDOM STUDIOS TIER SYSTEM
// Scalable, faith-branded subscription system with admin roles
// ==============================

export type TierType = 'seed' | 'rooted' | 'commissioned' | 'mantled_pro' | 'kingdom_enterprise';
export type BillingCycle = 'monthly' | 'yearly';
export type TrialStatus = 'active' | 'expired' | 'none';
export type AdminRole = 'super_admin' | 'team_admin' | 'user';

interface EnhancedTierFeatures {
  // 🤖 AI & Content Creation
  aiGenerationsPerDay: number;
  designsPerMonth: number;
  contentSchedulerSlots: number;
  savedProductsLimit: number;
  
  // 💾 Storage & Media
  storageQuotaGB: number;
  monthlyUploads: number;
  videoUploadMinutes: number;
  audioDownloadsPerMonth: number;
  
  // 🎨 Creative Tools
  premiumTemplates: boolean;
  customTemplates: boolean;
  bulkGeneration: boolean;
  advancedEditor: boolean;
  brandKitManager: boolean;
  
  // 👥 Collaboration & Teams
  teamSeats: number;
  realTimeCollaboration: boolean;
  teamWorkspaces: number;
  
  // 🏪 Business Features
  publicStorefronts: number;
  customDomains: boolean;
  analytics: 'none' | 'basic' | 'advanced' | 'enterprise';
  prioritySupport: boolean;
  
  // 🔧 Advanced Features
  apiAccess: boolean;
  webhooks: boolean;
  customBranding: boolean;
  automationRuns: number;
  
  // 📊 Reporting & Analytics
  monthlyReports: boolean;
  exportData: boolean;
  advancedInsights: boolean;
}

interface TierPlan {
  id: TierType;
  name: string;
  biblicalName: string;
  description: string;
  faithDescription: string;
  monthlyPrice: number;
  yearlyPrice: number;
  yearlyDiscount: number; // percentage off
  features: EnhancedTierFeatures;
  popularBadge?: boolean;
  enterpriseFeatures?: string[];
  scriptureReference?: string;
  badge?: string;
  badgeColor?: string;
  trialEligible?: boolean;
}

interface UserInfo {
  id: string;
  email: string;
  role: AdminRole;
  organizationId?: string;
  isFounder?: boolean; // Special flag for Desi
}

interface SubscriptionStatus {
  tier: TierType;
  billingCycle: BillingCycle;
  status: 'active' | 'trial' | 'past_due' | 'canceled' | 'incomplete';
  currentPeriodEnd: Date | null;
  trialEnd: Date | null;
  trialDaysRemaining: number;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  autoDowngradeDate?: Date | null;
}

interface UsageStats {
  [key: string]: {
    current: number;
    limit: number;
    resetDate: Date;
  };
}

interface EnhancedTierSystemContextType {
  // Current Status
  currentTier: TierType;
  tierFeatures: EnhancedTierFeatures;
  subscription: SubscriptionStatus | null;
  trialStatus: TrialStatus;
  trialDaysRemaining: number;
  usageStats: UsageStats;
  userInfo: UserInfo | null;
  
  // Tier Management
  availableTiers: Record<TierType, TierPlan>;
  checkFeatureAccess: (feature: keyof EnhancedTierFeatures) => Promise<boolean>;
  getRemainingUsage: (feature: string) => Promise<number>;
  getUsageStats: () => Promise<UsageStats>;
  trackUsage: (category: string, action: string, amount?: number) => Promise<void>;
  
  // Subscription Actions
  upgradeTier: (targetTier: TierType, billingCycle: BillingCycle) => Promise<void>;
  downgradeTier: (targetTier: TierType) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  reactivateSubscription: () => Promise<void>;
  
  // Trial Management
  startTrial: (tier?: TierType) => Promise<void>;
  extendTrial: (days: number) => Promise<void>;
  convertTrialToSubscription: (billingCycle: BillingCycle) => Promise<void>;
  isTrialActive: boolean;
  
  // Admin Functions (Super Admin Only)
  isSuperAdmin: boolean;
  isTeamAdmin: boolean;
  adminSetUserTier: (userId: string, tier: TierType, reason: string) => Promise<void>;
  adminApplyDiscount: (userId: string, discountPercent: number, months: number) => Promise<void>;
  adminExtendTrial: (userId: string, days: number) => Promise<void>;
  adminOverrideLimit: (userId: string, feature: string, newLimit: number) => Promise<void>;
  adminGetUserStats: (userId: string) => Promise<any>;
  adminGetSystemStats: () => Promise<any>;
  adminManageUsers: (organizationId?: string) => Promise<any[]>;
  
  // Team Admin Functions (Commissioned+ with team_admin role)
  teamManageUsers: (organizationId: string) => Promise<any[]>;
  teamInviteUser: (email: string, role: 'user' | 'team_admin') => Promise<void>;
  teamRemoveUser: (userId: string) => Promise<void>;
  teamUpdateUserRole: (userId: string, role: 'user' | 'team_admin') => Promise<void>;
  teamGetAnalytics: (organizationId: string) => Promise<any>;
  
  // Loading States
  isLoading: boolean;
  isUpgrading: boolean;
  isLoadingUsage: boolean;
}

// Enhanced Tier Definitions with Biblical Naming & Comprehensive Features
const ENHANCED_TIER_PLANS: Record<TierType, TierPlan> = {
  seed: {
    id: 'seed',
    name: 'Seed',
    biblicalName: 'Seed of Faith',
    description: 'Plant your Kingdom calling with essential creation tools',
    faithDescription: 'Begin your ministry journey with foundational tools to share your faith',
    scriptureReference: 'Matthew 13:31-32',
    monthlyPrice: 0,
    yearlyPrice: 0,
    yearlyDiscount: 0,
    trialEligible: false,
    features: {
      // AI & Content Creation
      aiGenerationsPerDay: 10,
      designsPerMonth: 10,
      contentSchedulerSlots: 5,
      savedProductsLimit: 10,
      
      // Storage & Media
      storageQuotaGB: 1,
      monthlyUploads: 10,
      videoUploadMinutes: 30,
      audioDownloadsPerMonth: 5,
      
      // Creative Tools
      premiumTemplates: false,
      customTemplates: false,
      bulkGeneration: false,
      advancedEditor: false,
      brandKitManager: false,
      
      // Collaboration & Teams
      teamSeats: 0,
      realTimeCollaboration: false,
      teamWorkspaces: 0,
      
      // Business Features
      publicStorefronts: 0,
      customDomains: false,
      analytics: 'none',
      prioritySupport: false,
      
      // Advanced Features
      apiAccess: false,
      webhooks: false,
      customBranding: false,
      automationRuns: 0,
      
      // Reporting & Analytics
      monthlyReports: false,
      exportData: false,
      advancedInsights: false,
    }
  },
  
  rooted: {
    id: 'rooted',
    name: 'Rooted',
    biblicalName: 'Rooted in Christ',
    description: 'Grow your Kingdom impact with professional creation tools',
    faithDescription: 'Establish your ministry with professional tools and expanded reach',
    scriptureReference: 'Colossians 2:7',
    monthlyPrice: 30,
    yearlyPrice: 300, // 17% discount
    yearlyDiscount: 17,
    trialEligible: true,
    features: {
      // AI & Content Creation
      aiGenerationsPerDay: 75,
      designsPerMonth: 100,
      contentSchedulerSlots: 25,
      savedProductsLimit: 100,
      
      // Storage & Media
      storageQuotaGB: 10,
      monthlyUploads: 50,
      videoUploadMinutes: 120,
      audioDownloadsPerMonth: 25,
      
      // Creative Tools
      premiumTemplates: true,
      customTemplates: false,
      bulkGeneration: true,
      advancedEditor: true,
      brandKitManager: true,
      
      // Collaboration & Teams
      teamSeats: 0,
      realTimeCollaboration: false,
      teamWorkspaces: 1,
      
      // Business Features
      publicStorefronts: 1,
      customDomains: false,
      analytics: 'basic',
      prioritySupport: false,
      
      // Advanced Features
      apiAccess: false,
      webhooks: false,
      customBranding: false,
      automationRuns: 10,
      
      // Reporting & Analytics
      monthlyReports: true,
      exportData: false,
      advancedInsights: false,
    }
  },
  
  commissioned: {
    id: 'commissioned',
    name: 'Commissioned',
    biblicalName: 'Great Commission',
    description: 'Activate your calling with advanced creation and collaboration tools',
    faithDescription: 'Go and make disciples with powerful ministry tools and team collaboration',
    scriptureReference: 'Matthew 28:19-20',
    monthlyPrice: 50,
    yearlyPrice: 500, // 17% discount
    yearlyDiscount: 17,
    popularBadge: true,
    badge: 'MOST POPULAR',
    badgeColor: '#FFD700',
    trialEligible: true,
    features: {
      // AI & Content Creation
      aiGenerationsPerDay: 200,
      designsPerMonth: 200,
      contentSchedulerSlots: 100,
      savedProductsLimit: 500,
      
      // Storage & Media
      storageQuotaGB: 50,
      monthlyUploads: 200,
      videoUploadMinutes: 500,
      audioDownloadsPerMonth: 100,
      
      // Creative Tools
      premiumTemplates: true,
      customTemplates: true,
      bulkGeneration: true,
      advancedEditor: true,
      brandKitManager: true,
      
      // Collaboration & Teams
      teamSeats: 2,
      realTimeCollaboration: true,
      teamWorkspaces: 3,
      
      // Business Features
      publicStorefronts: 3,
      customDomains: true,
      analytics: 'advanced',
      prioritySupport: true,
      
      // Advanced Features
      apiAccess: false,
      webhooks: true,
      customBranding: true,
      automationRuns: 50,
      
      // Reporting & Analytics
      monthlyReports: true,
      exportData: true,
      advancedInsights: true,
    }
  },
  
  mantled_pro: {
    id: 'mantled_pro',
    name: 'Mantled Pro',
    biblicalName: 'Elijah\'s Mantle',
    description: 'Carry the mantle of Kingdom influence with enterprise-grade tools',
    faithDescription: 'Receive the mantle of leadership with professional ministry tools',
    scriptureReference: '2 Kings 2:9',
    monthlyPrice: 80,
    yearlyPrice: 800, // 17% discount
    yearlyDiscount: 17,
    trialEligible: true,
    features: {
      // AI & Content Creation
      aiGenerationsPerDay: 500,
      designsPerMonth: 500,
      contentSchedulerSlots: 500,
      savedProductsLimit: 2000,
      
      // Storage & Media
      storageQuotaGB: 300,
      monthlyUploads: 1000,
      videoUploadMinutes: 2000,
      audioDownloadsPerMonth: 500,
      
      // Creative Tools
      premiumTemplates: true,
      customTemplates: true,
      bulkGeneration: true,
      advancedEditor: true,
      brandKitManager: true,
      
      // Collaboration & Teams
      teamSeats: 3,
      realTimeCollaboration: true,
      teamWorkspaces: 10,
      
      // Business Features
      publicStorefronts: 10,
      customDomains: true,
      analytics: 'enterprise',
      prioritySupport: true,
      
      // Advanced Features
      apiAccess: true,
      webhooks: true,
      customBranding: true,
      automationRuns: 200,
      
      // Reporting & Analytics
      monthlyReports: true,
      exportData: true,
      advancedInsights: true,
    }
  },
  
  kingdom_enterprise: {
    id: 'kingdom_enterprise',
    name: 'Kingdom Enterprise',
    biblicalName: 'Kingdom Authority',
    description: 'Transform organizations with unlimited Kingdom creation power',
    faithDescription: 'Exercise Kingdom authority with unlimited tools for massive ministry impact',
    scriptureReference: 'Daniel 7:14',
    monthlyPrice: 150,
    yearlyPrice: 1500, // 17% discount
    yearlyDiscount: 17,
    badge: 'ENTERPRISE',
    badgeColor: '#10B981',
    trialEligible: true,
    enterpriseFeatures: [
      'Dedicated account manager',
      'Custom integrations',
      'Priority phone support',
      'Advanced security & compliance',
      'Custom training & onboarding',
      'Custom API endpoints'
    ],
    features: {
      // AI & Content Creation
      aiGenerationsPerDay: 999999, // Unlimited
      designsPerMonth: 999999,
      contentSchedulerSlots: 999999,
      savedProductsLimit: 999999,
      
      // Storage & Media
      storageQuotaGB: 1000,
      monthlyUploads: 999999,
      videoUploadMinutes: 999999,
      audioDownloadsPerMonth: 999999,
      
      // Creative Tools
      premiumTemplates: true,
      customTemplates: true,
      bulkGeneration: true,
      advancedEditor: true,
      brandKitManager: true,
      
      // Collaboration & Teams
      teamSeats: 10,
      realTimeCollaboration: true,
      teamWorkspaces: 999999,
      
      // Business Features
      publicStorefronts: 999999,
      customDomains: true,
      analytics: 'enterprise',
      prioritySupport: true,
      
      // Advanced Features
      apiAccess: true,
      webhooks: true,
      customBranding: true,
      automationRuns: 999999,
      
      // Reporting & Analytics
      monthlyReports: true,
      exportData: true,
      advancedInsights: true,
    }
  }
};

// Export TIER_PLANS for backward compatibility
export const TIER_PLANS = ENHANCED_TIER_PLANS;
export const TIER_CONFIG = ENHANCED_TIER_PLANS;

// Create Enhanced Tier System Context
export const TierSystemContext = createContext<EnhancedTierSystemContextType | undefined>(undefined);

// Enhanced Tier System Provider Component
export const TierSystemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Core State
  const [currentTier, setCurrentTier] = useState<TierType>('seed');
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [trialStatus, setTrialStatus] = useState<TrialStatus>('none');
  const [usageStats, setUsageStats] = useState<UsageStats>({});
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  
  // Loading States
  const [isLoading, setIsLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isLoadingUsage, setIsLoadingUsage] = useState(false);
  
  // Notifications
  const { sendNotification } = useNotifications();

  // Initialize on mount
  useEffect(() => {
    initializeTierSystem();
  }, []);

  // Get current tier features
  const tierFeatures = ENHANCED_TIER_PLANS[currentTier].features;
  
  // Trial status computed
  const isTrialActive = trialStatus === 'active';
  const trialDaysRemaining = subscription?.trialDaysRemaining || 0;
  
  // Admin role checks
  const isSuperAdmin = userInfo?.role === 'super_admin' || userInfo?.isFounder === true;
  const isTeamAdmin = userInfo?.role === 'team_admin' && (currentTier === 'commissioned' || currentTier === 'mantled_pro' || currentTier === 'kingdom_enterprise');

  // ==============================
  // 🚀 CORE INITIALIZATION
  // ==============================
  
  const initializeTierSystem = async () => {
    try {
      setIsLoading(true);
      
      // Load saved data
      const savedTier = await AsyncStorage.getItem('user_tier');
      const savedSubscription = await AsyncStorage.getItem('subscription_status');
      const savedUserInfo = await AsyncStorage.getItem('user_info');
      
      if (savedTier) {
        setCurrentTier(savedTier as TierType);
      }
      
      if (savedSubscription) {
        const parsedSubscription = JSON.parse(savedSubscription);
        // Convert date strings back to Date objects
        if (parsedSubscription.currentPeriodEnd) {
          parsedSubscription.currentPeriodEnd = new Date(parsedSubscription.currentPeriodEnd);
        }
        if (parsedSubscription.trialEnd) {
          parsedSubscription.trialEnd = new Date(parsedSubscription.trialEnd);
        }
        setSubscription(parsedSubscription);
        
        // Calculate trial status
        if (parsedSubscription.trialEnd) {
          const trialEndDate = new Date(parsedSubscription.trialEnd);
          const now = new Date();
          
          if (trialEndDate > now) {
            setTrialStatus('active');
            // Calculate days remaining
            const diffTime = trialEndDate.getTime() - now.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            parsedSubscription.trialDaysRemaining = Math.max(0, diffDays);
          } else {
            setTrialStatus('expired');
            parsedSubscription.trialDaysRemaining = 0;
            
            // Auto-downgrade to seed if trial expired and no active subscription
            if (parsedSubscription.status !== 'active') {
              await handleTrialExpired();
            }
          }
        }
      } else {
        // New user - start with 14-day trial of Commissioned tier
        await startNewUserTrial();
      }
      
      if (savedUserInfo) {
        setUserInfo(JSON.parse(savedUserInfo));
      }
      
      // Load usage statistics
      await loadUsageStats();
      
      // Sync with backend
      await syncSubscriptionWithBackend();
      
    } catch (error) {
      console.error('Failed to initialize tier system:', error);
      sendNotification({
        type: 'admin_message',
        title: 'Initialization Error',
        body: 'Failed to load subscription data',
        priority: 'high'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startNewUserTrial = async () => {
    try {
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 14); // 14-day trial
      
      const newSubscription: SubscriptionStatus = {
        tier: 'commissioned',
        billingCycle: 'monthly',
        status: 'trial',
        currentPeriodEnd: null,
        trialEnd: trialEndDate,
        trialDaysRemaining: 14,
        autoDowngradeDate: trialEndDate,
      };
      
      setCurrentTier('commissioned');
      setSubscription(newSubscription);
      setTrialStatus('active');
      
      // Save to storage
      await AsyncStorage.setItem('user_tier', 'commissioned');
      await AsyncStorage.setItem('subscription_status', JSON.stringify(newSubscription));
      
      // Track trial start
      console.log('Trial started:', {
        tier: 'commissioned',
        trialDays: 14
      });
      
      sendNotification({
        type: 'trial_starting',
        title: '🎉 Welcome to Kingdom Studios!',
        body: 'Your 14-day Great Commission trial has started!',
        priority: 'high'
      });
      
    } catch (error) {
      console.error('Failed to start trial:', error);
    }
  };

  const handleTrialExpired = async () => {
    try {
      setCurrentTier('seed');
      setTrialStatus('expired');
      
      const expiredSubscription: SubscriptionStatus = {
        ...subscription!,
        tier: 'seed',
        status: 'canceled',
        trialDaysRemaining: 0
      };
      
      setSubscription(expiredSubscription);
      
      await AsyncStorage.setItem('user_tier', 'seed');
      await AsyncStorage.setItem('subscription_status', JSON.stringify(expiredSubscription));
      
      sendNotification({
        type: 'trial_expired',
        title: 'Trial Expired',
        body: 'Your trial has ended. Upgrade to continue with premium features!',
        priority: 'high'
      });
      
    } catch (error) {
      console.error('Failed to handle trial expiration:', error);
    }
  };

  const loadUsageStats = async () => {
    try {
      setIsLoadingUsage(true);
      const stats = await subscriptionService.getUsageStats();
      // Transform stats to our format
      const transformedStats: UsageStats = {};
      if (stats) {
        Object.keys(stats).forEach(key => {
          const stat = (stats as any)[key];
          if (stat && typeof stat === 'object') {
            transformedStats[key] = {
              current: stat.used || 0,
              limit: stat.limit || 0,
              resetDate: new Date(stat.resetDate || Date.now())
            };
          }
        });
      }
      setUsageStats(transformedStats);
    } catch (error) {
      console.error('Failed to load usage stats:', error);
    } finally {
      setIsLoadingUsage(false);
    }
  };

  // ==============================
  // 🎯 FEATURE ACCESS & USAGE TRACKING
  // ==============================

  const checkFeatureAccess = async (feature: keyof EnhancedTierFeatures): Promise<boolean> => {
    try {
      const featureValue = tierFeatures[feature];
      
      if (typeof featureValue === 'boolean') {
        return featureValue;
      }
      if (typeof featureValue === 'number') {
        if (featureValue === 999999) return true; // Unlimited
        if (featureValue === 0) return false;
        
        // Check current usage for numeric limits
        const currentUsage = usageStats[feature]?.current || 0;
        return currentUsage < featureValue;
      }
      if (typeof featureValue === 'string') {
        return featureValue !== 'none';
      }
      
      return false;
    } catch (error) {
      console.error('Error checking feature access:', error);
      return false;
    }
  };

  const getRemainingUsage = async (feature: string): Promise<number> => {
    try {
      const featureLimit = (tierFeatures as any)[feature];
      if (featureLimit === 999999) return 999999; // Unlimited
      if (!featureLimit || featureLimit === 0) return 0;
      
      const currentUsage = usageStats[feature]?.current || 0;
      return Math.max(0, featureLimit - currentUsage);
    } catch (error) {
      console.error('Error getting remaining usage:', error);
      return 0;
    }
  };

  const getUsageStats = async (): Promise<UsageStats> => {
    try {
      const stats = await subscriptionService.getUsageStats();
      // Transform stats to our format
      const transformedStats: UsageStats = {};
      if (stats) {
        Object.keys(stats).forEach(key => {
          const stat = (stats as any)[key];
          if (stat && typeof stat === 'object') {
            transformedStats[key] = {
              current: stat.used || 0,
              limit: stat.limit || 0,
              resetDate: new Date(stat.resetDate || Date.now())
            };
          }
        });
      }
      setUsageStats(transformedStats);
      return transformedStats;
    } catch (error) {
      console.error('Error getting usage stats:', error);
      return {};
    }
  };

  const trackUsage = async (category: string, action: string, amount: number = 1): Promise<void> => {
    try {
      // For now, just use audioDownloads as the default category since it's the first in the union
      const validCategory = 'audioDownloads' as const;
      await subscriptionService.trackUsage(validCategory, amount);
      
      // Update local usage stats
      setUsageStats(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          current: (prev[category]?.current || 0) + amount
        }
      }));
    } catch (error) {
      console.error('Error tracking usage:', error);
    }
  };

  // ==============================
  // 💳 SUBSCRIPTION MANAGEMENT
  // ==============================

  const upgradeTier = async (targetTier: TierType, billingCycle: BillingCycle): Promise<void> => {
    try {
      setIsUpgrading(true);

      // Process upgrade through subscription service
      const result = await subscriptionService.upgradeSubscription(targetTier, billingCycle);
      
      if (!result.success) {
        throw new Error(result.error || 'Upgrade failed');
      }

      const newSubscription: SubscriptionStatus = {
        tier: targetTier,
        billingCycle,
        status: 'active',
        currentPeriodEnd: getNextBillingDate(billingCycle),
        trialEnd: null,
        trialDaysRemaining: 0,
      };

      setCurrentTier(targetTier);
      setSubscription(newSubscription);
      setTrialStatus('none');
      
      await saveSubscriptionStatus(targetTier, newSubscription);

      sendNotification({
        type: 'subscription_upgraded',
        title: 'Upgrade Successful! 🚀',
        body: `Welcome to ${ENHANCED_TIER_PLANS[targetTier].biblicalName}! Your new features are ready.`,
        priority: 'high'
      });

    } catch (error) {
      console.error('Error upgrading tier:', error);
      sendNotification({
        type: 'payment_failed',
        title: 'Upgrade Failed',
        body: 'Failed to upgrade subscription. Please try again.',
        priority: 'high'
      });
      throw error;
    } finally {
      setIsUpgrading(false);
    }
  };

  const downgradeTier = async (targetTier: TierType): Promise<void> => {
    try {
      setIsUpgrading(true);

      // For now, just schedule the downgrade locally
      console.log('Scheduling downgrade to:', targetTier);

      const newSubscription: SubscriptionStatus = {
        ...subscription!,
        tier: targetTier,
        autoDowngradeDate: subscription?.currentPeriodEnd || getNextBillingDate('monthly'),
      };

      setSubscription(newSubscription);
      await saveSubscriptionStatus(currentTier, newSubscription);

      sendNotification({
        type: 'subscription_downgraded',
        title: 'Downgrade Scheduled',
        body: `Your plan will change to ${ENHANCED_TIER_PLANS[targetTier].biblicalName} at the end of your current billing period.`,
        priority: 'normal'
      });

    } catch (error) {
      console.error('Error downgrading tier:', error);
      sendNotification({
        type: 'admin_message',
        title: 'Downgrade Failed',
        body: 'Failed to schedule downgrade. Please try again.',
        priority: 'high'
      });
      throw error;
    } finally {
      setIsUpgrading(false);
    }
  };

  const cancelSubscription = async (): Promise<void> => {
    try {
      setIsUpgrading(true);

      const result = await subscriptionService.cancelSubscription();
      
      if (!result.success) {
        throw new Error(result.error || 'Cancellation failed');
      }

      const updatedSubscription = {
        ...subscription!,
        status: 'canceled' as const,
        autoDowngradeDate: subscription?.currentPeriodEnd || new Date(),
      };

      setSubscription(updatedSubscription);
      await saveSubscriptionStatus(currentTier, updatedSubscription);

      sendNotification({
        type: 'subscription_canceled',
        title: 'Subscription Canceled',
        body: 'Your subscription has been canceled. You can still use your current features until the end of your billing period.',
        priority: 'normal'
      });

    } catch (error) {
      console.error('Error canceling subscription:', error);
      sendNotification({
        type: 'admin_message',
        title: 'Cancellation Failed',
        body: 'Failed to cancel subscription. Please try again.',
        priority: 'high'
      });
      throw error;
    } finally {
      setIsUpgrading(false);
    }
  };

  const reactivateSubscription = async (): Promise<void> => {
    try {
      setIsUpgrading(true);

      // For now, just reactivate locally
      console.log('Reactivating subscription');

      const updatedSubscription = {
        ...subscription!,
        status: 'active' as const,
        autoDowngradeDate: null,
      };

      setSubscription(updatedSubscription);
      await saveSubscriptionStatus(currentTier, updatedSubscription);

      sendNotification({
        type: 'subscription_upgraded',
        title: 'Subscription Reactivated! ✨',
        body: 'Welcome back! Your subscription has been reactivated.',
        priority: 'high'
      });

    } catch (error) {
      console.error('Error reactivating subscription:', error);
      sendNotification({
        type: 'admin_message',
        title: 'Reactivation Failed',
        body: 'Failed to reactivate subscription. Please try again.',
        priority: 'high'
      });
      throw error;
    } finally {
      setIsUpgrading(false);
    }
  };

  // ==============================
  // 🎯 TRIAL MANAGEMENT
  // ==============================

  const startTrial = async (tier: TierType = 'commissioned'): Promise<void> => {
    try {
      setIsUpgrading(true);
      
      const trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + 14);
      
      const newSubscription: SubscriptionStatus = {
        tier,
        billingCycle: 'monthly',
        status: 'trial',
        currentPeriodEnd: trialEnd,
        trialEnd,
        trialDaysRemaining: 14,
        autoDowngradeDate: trialEnd,
      };

      setCurrentTier(tier);
      setSubscription(newSubscription);
      setTrialStatus('active');
      
      await saveSubscriptionStatus(tier, newSubscription);
      console.log('Trial started:', { tier, trialDays: 14 });

      sendNotification({
        type: 'trial_starting',
        title: 'Trial Started! 🎉',
        body: `You now have 14 days of full access to ${ENHANCED_TIER_PLANS[tier].biblicalName} features!`,
        priority: 'high'
      });

    } catch (error) {
      console.error('Error starting trial:', error);
      sendNotification({
        type: 'admin_message',
        title: 'Trial Start Failed',
        body: 'Failed to start trial. Please try again.',
        priority: 'high'
      });
      throw error;
    } finally {
      setIsUpgrading(false);
    }
  };

  const extendTrial = async (days: number): Promise<void> => {
    try {
      if (!subscription?.trialEnd) {
        throw new Error('No active trial to extend');
      }

      const newTrialEnd = new Date(subscription.trialEnd);
      newTrialEnd.setDate(newTrialEnd.getDate() + days);

      const updatedSubscription = {
        ...subscription,
        trialEnd: newTrialEnd,
        currentPeriodEnd: newTrialEnd,
        trialDaysRemaining: subscription.trialDaysRemaining + days,
        autoDowngradeDate: newTrialEnd,
      };

      setSubscription(updatedSubscription);
      await saveSubscriptionStatus(currentTier, updatedSubscription);

      sendNotification({
        type: 'trial_ending',
        title: 'Trial Extended! ⏰',
        body: `Your trial has been extended by ${days} days.`,
        priority: 'normal'
      });

    } catch (error) {
      console.error('Error extending trial:', error);
      throw error;
    }
  };

  const convertTrialToSubscription = async (billingCycle: BillingCycle): Promise<void> => {
    try {
      setIsUpgrading(true);

      const result = await subscriptionService.createSubscription(currentTier, billingCycle);
      
      if (!result.success) {
        throw new Error(result.error || 'Conversion failed');
      }

      const newSubscription: SubscriptionStatus = {
        tier: currentTier,
        billingCycle,
        status: 'active',
        currentPeriodEnd: getNextBillingDate(billingCycle),
        trialEnd: null,
        trialDaysRemaining: 0,
      };

      setSubscription(newSubscription);
      setTrialStatus('none');
      await saveSubscriptionStatus(currentTier, newSubscription);

      sendNotification({
        type: 'payment_success',
        title: 'Subscription Activated! ✨',
        body: `Welcome to ${ENHANCED_TIER_PLANS[currentTier].biblicalName}! Your Kingdom impact just multiplied.`,
        priority: 'high'
      });

    } catch (error) {
      console.error('Error converting trial:', error);
      sendNotification({
        type: 'payment_failed',
        title: 'Conversion Failed',
        body: 'Failed to activate subscription. Please try again.',
        priority: 'high'
      });
      throw error;
    } finally {
      setIsUpgrading(false);
    }
  };

  // ==============================
  // 👑 ADMIN FUNCTIONS (Super Admin Only)
  // ==============================

  const adminSetUserTier = async (userId: string, tier: TierType, reason: string): Promise<void> => {
    if (!isSuperAdmin) {
      throw new Error('Insufficient permissions. Super Admin access required.');
    }
    
    try {
      // TODO: Implement actual admin API call
      console.log('Admin setting user tier:', { userId, tier, reason });
      
      sendNotification({
        type: 'admin_message',
        title: 'User Tier Updated',
        body: `Successfully updated user tier to ${ENHANCED_TIER_PLANS[tier].biblicalName}`,
        priority: 'normal'
      });
    } catch (error) {
      console.error('Admin tier change failed:', error);
      throw error;
    }
  };

  const adminApplyDiscount = async (userId: string, discountPercent: number, months: number): Promise<void> => {
    if (!isSuperAdmin) {
      throw new Error('Insufficient permissions. Super Admin access required.');
    }
    
    try {
      // TODO: Implement actual admin API call
      console.log('Admin applying discount:', { userId, discountPercent, months });
      
      sendNotification({
        type: 'admin_message',
        title: 'Discount Applied',
        body: `Applied ${discountPercent}% discount for ${months} months`,
        priority: 'normal'
      });
    } catch (error) {
      console.error('Admin discount application failed:', error);
      throw error;
    }
  };

  const adminExtendTrial = async (userId: string, days: number): Promise<void> => {
    if (!isSuperAdmin) {
      throw new Error('Insufficient permissions. Super Admin access required.');
    }
    
    try {
      // TODO: Implement actual admin API call
      console.log('Admin extending trial:', { userId, days });
      
      sendNotification({
        type: 'admin_message',
        title: 'Trial Extended',
        body: `Extended user trial by ${days} days`,
        priority: 'normal'
      });
    } catch (error) {
      console.error('Admin trial extension failed:', error);
      throw error;
    }
  };

  const adminOverrideLimit = async (userId: string, feature: string, newLimit: number): Promise<void> => {
    if (!isSuperAdmin) {
      throw new Error('Insufficient permissions. Super Admin access required.');
    }
    
    try {
      // TODO: Implement actual admin API call
      console.log('Admin overriding limit:', { userId, feature, newLimit });
      
      sendNotification({
        type: 'admin_message',
        title: 'Limit Override Applied',
        body: `Updated ${feature} limit to ${newLimit}`,
        priority: 'normal'
      });
    } catch (error) {
      console.error('Admin limit override failed:', error);
      throw error;
    }
  };

  const adminGetUserStats = async (userId: string): Promise<any> => {
    if (!isSuperAdmin) {
      throw new Error('Insufficient permissions. Super Admin access required.');
    }
    
    try {
      // TODO: Implement actual admin API call
      console.log('Admin getting user stats:', userId);
      return { userId, mockData: true };
    } catch (error) {
      console.error('Admin user stats fetch failed:', error);
      throw error;
    }
  };

  const adminGetSystemStats = async (): Promise<any> => {
    if (!isSuperAdmin) {
      throw new Error('Insufficient permissions. Super Admin access required.');
    }
    
    try {
      // TODO: Implement actual admin API call
      console.log('Admin getting system stats');
      return { systemStats: true, mockData: true };
    } catch (error) {
      console.error('Admin system stats fetch failed:', error);
      throw error;
    }
  };

  const adminManageUsers = async (organizationId?: string): Promise<any[]> => {
    if (!isSuperAdmin) {
      throw new Error('Insufficient permissions. Super Admin access required.');
    }
    
    try {
      // TODO: Implement actual admin API call
      console.log('Admin managing users:', organizationId);
      return [{ userId: 'mock', organizationId }];
    } catch (error) {
      console.error('Admin user management failed:', error);
      throw error;
    }
  };

  // ==============================
  // 👥 TEAM ADMIN FUNCTIONS (Commissioned+ with team_admin role)
  // ==============================

  const teamManageUsers = async (organizationId: string): Promise<any[]> => {
    if (!isTeamAdmin && !isSuperAdmin) {
      throw new Error('Insufficient permissions. Team Admin access required.');
    }
    
    try {
      // TODO: Implement actual team API call
      console.log('Team managing users:', organizationId);
      return [{ userId: 'mock', organizationId }];
    } catch (error) {
      console.error('Team user management failed:', error);
      throw error;
    }
  };

  const teamInviteUser = async (email: string, role: 'user' | 'team_admin'): Promise<void> => {
    if (!isTeamAdmin && !isSuperAdmin) {
      throw new Error('Insufficient permissions. Team Admin access required.');
    }
    
    try {
      // TODO: Implement actual team API call
      console.log('Team inviting user:', { email, role });
      
      sendNotification({
        type: 'admin_message',
        title: 'User Invited',
        body: `Invitation sent to ${email}`,
        priority: 'normal'
      });
    } catch (error) {
      console.error('Team user invitation failed:', error);
      throw error;
    }
  };

  const teamRemoveUser = async (userId: string): Promise<void> => {
    if (!isTeamAdmin && !isSuperAdmin) {
      throw new Error('Insufficient permissions. Team Admin access required.');
    }
    
    try {
      // TODO: Implement actual team API call
      console.log('Team removing user:', userId);
      
      sendNotification({
        type: 'admin_message',
        title: 'User Removed',
        body: 'User has been removed from the team',
        priority: 'normal'
      });
    } catch (error) {
      console.error('Team user removal failed:', error);
      throw error;
    }
  };

  const teamUpdateUserRole = async (userId: string, role: 'user' | 'team_admin'): Promise<void> => {
    if (!isTeamAdmin && !isSuperAdmin) {
      throw new Error('Insufficient permissions. Team Admin access required.');
    }
    
    try {
      // TODO: Implement actual team API call
      console.log('Team updating user role:', { userId, role });
      
      sendNotification({
        type: 'admin_message',
        title: 'User Role Updated',
        body: `User role updated to ${role}`,
        priority: 'normal'
      });
    } catch (error) {
      console.error('Team user role update failed:', error);
      throw error;
    }
  };

  const teamGetAnalytics = async (organizationId: string): Promise<any> => {
    if (!isTeamAdmin && !isSuperAdmin) {
      throw new Error('Insufficient permissions. Team Admin access required.');
    }
    
    try {
      // TODO: Implement actual team API call
      console.log('Team getting analytics:', organizationId);
      return { organizationId, analytics: true, mockData: true };
    } catch (error) {
      console.error('Team analytics fetch failed:', error);
      throw error;
    }
  };

  // ==============================
  // 🔧 HELPER FUNCTIONS
  // ==============================

  const saveSubscriptionStatus = async (tier: TierType, subscriptionData?: SubscriptionStatus) => {
    try {
      await AsyncStorage.setItem('user_tier', tier);
      if (subscriptionData) {
        await AsyncStorage.setItem('subscription_status', JSON.stringify(subscriptionData));
      }
    } catch (error) {
      console.error('Error saving subscription status:', error);
    }
  };

  const getNextBillingDate = (billingCycle: BillingCycle): Date => {
    const date = new Date();
    if (billingCycle === 'monthly') {
      date.setMonth(date.getMonth() + 1);
    } else {
      date.setFullYear(date.getFullYear() + 1);
    }
    return date;
  };

  const syncSubscriptionWithBackend = async () => {
    try {
      // Sync subscription status with backend
      await backendSyncService.syncSubscription(true);
      
      // Get updated subscription info
      const updatedSubscription = await subscriptionService.getCurrentSubscription(true);
      if (updatedSubscription) {
        // Transform to our subscription format
        const transformedSubscription: SubscriptionStatus = {
          tier: updatedSubscription.tier,
          billingCycle: updatedSubscription.billingCycle,
          status: updatedSubscription.status,
          currentPeriodEnd: new Date(updatedSubscription.currentPeriodEnd),
          trialEnd: updatedSubscription.trialEnd ? new Date(updatedSubscription.trialEnd) : null,
          trialDaysRemaining: 0, // Calculate this
          stripeSubscriptionId: updatedSubscription.stripeSubscriptionId,
        };
        
        setCurrentTier(updatedSubscription.tier);
        setSubscription(transformedSubscription);
        
        // Update trial status
        if (updatedSubscription.trialEnd) {
          const now = new Date();
          const trialEnd = new Date(updatedSubscription.trialEnd);
          setTrialStatus(trialEnd > now ? 'active' : 'expired');
        }
      }
      
    } catch (error) {
      console.error('Error syncing with backend:', error);
    }
  };

  // Context value
  const value: EnhancedTierSystemContextType = {
    // Current Status
    currentTier,
    tierFeatures,
    subscription,
    trialStatus,
    trialDaysRemaining,
    usageStats,
    userInfo,
    
    // Tier Management
    availableTiers: ENHANCED_TIER_PLANS,
    checkFeatureAccess,
    getRemainingUsage,
    getUsageStats,
    trackUsage,
    
    // Subscription Actions
    upgradeTier,
    downgradeTier,
    cancelSubscription,
    reactivateSubscription,
    
    // Trial Management
    startTrial,
    extendTrial,
    convertTrialToSubscription,
    isTrialActive,
    
    // Admin Functions (Super Admin Only)
    isSuperAdmin,
    isTeamAdmin,
    adminSetUserTier,
    adminApplyDiscount,
    adminExtendTrial,
    adminOverrideLimit,
    adminGetUserStats,
    adminGetSystemStats,
    adminManageUsers,
    
    // Team Admin Functions
    teamManageUsers,
    teamInviteUser,
    teamRemoveUser,
    teamUpdateUserRole,
    teamGetAnalytics,
    
    // Loading States
    isLoading,
    isUpgrading,
    isLoadingUsage,
  };

  return (
    <TierSystemContext.Provider value={value}>
      {children}
    </TierSystemContext.Provider>
  );
};

// Hook to use the tier system
export const useTierSystem = (): EnhancedTierSystemContextType => {
  const context = useContext(TierSystemContext);
  if (!context) {
    throw new Error('useTierSystem must be used within a TierSystemProvider');
  }
  return context;
};

// Export types and config
export type TierSystemContextType = EnhancedTierSystemContextType;
export type TierFeatures = EnhancedTierFeatures;

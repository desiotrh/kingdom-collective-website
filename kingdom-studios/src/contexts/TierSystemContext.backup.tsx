import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { useNotifications } from './NotificationContext';
import backendSyncService from '../services/backendSyncService';
import subscriptionService from '../services/subscriptionService';

// ==============================
// � ENHANCED KINGDOM STUDIOS TIER SYSTEM
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
  whiteLabel: boolean;
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
}
  badge?: string;
  badgeColor?: string;
  popular?: boolean;
  trialEligible?: boolean;
  scriptureReference?: string;
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
  
  // Team Admin Functions (Commissioned+ with team_admin role)
  teamManageUsers: (organizationId: string) => Promise<any[]>;
  teamInviteUser: (email: string, role: 'user' | 'team_admin') => Promise<void>;
  teamRemoveUser: (userId: string) => Promise<void>;
  teamUpdateUserRole: (userId: string, role: 'user' | 'team_admin') => Promise<void>;
  
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
    monthlyPrice: 0,
    yearlyPrice: 0,
    yearlyDiscount: 0,
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
      teamSeats: 1,
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
      whiteLabel: false,
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
    monthlyPrice: 30,
    yearlyPrice: 300, // 17% discount
    yearlyDiscount: 17,
    popularBadge: true,
    features: {
      // AI & Content Creation
      aiGenerationsPerDay: 50,
      designsPerMonth: 50,
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
      teamSeats: 3,
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
      whiteLabel: false,
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
    monthlyPrice: 50,
    yearlyPrice: 500, // 17% discount
    yearlyDiscount: 17,
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
      teamSeats: 10,
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
      whiteLabel: false,
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
    monthlyPrice: 80,
    yearlyPrice: 800, // 17% discount
    yearlyDiscount: 17,
    features: {
      // AI & Content Creation
      aiGenerationsPerDay: 500,
      designsPerMonth: 500,
      contentSchedulerSlots: 500,
      savedProductsLimit: 2000,
      
      // Storage & Media
      storageQuotaGB: 200,
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
      teamSeats: 50,
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
      whiteLabel: true,
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
    monthlyPrice: 150,
    yearlyPrice: 1500, // 17% discount
    yearlyDiscount: 17,
    enterpriseFeatures: [
      'Dedicated account manager',
      'Custom integrations',
      'Priority phone support',
      'Advanced security & compliance',
      'Custom training & onboarding'
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
      teamSeats: 999999,
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
      whiteLabel: true,
      customBranding: true,
      automationRuns: 999999,
      
      // Reporting & Analytics
      monthlyReports: true,
      exportData: true,
      advancedInsights: true,
    }
  }
};
    },
  },
  rooted: {
    id: 'rooted',
    name: 'Rooted',
    biblicalName: 'Rooted in Truth',
    description: 'Grow deeper with enhanced creation and basic business tools',
    monthlyPrice: 30,
    yearlyPrice: 300, // 2 months free
    scriptureReference: 'Colossians 2:7',
    features: {
      aiGenerationsPerDay: 25,
      premiumTemplates: true,
      customTemplates: false,
      bulkGeneration: false,
      analytics: 'basic',
      productSyncLimit: 10,
      storefrontBuilder: true,
      schedulingAdvanced: true,
      apiAccess: false,
      whiteLabel: false,
      teamSeats: 1,
      prioritySupport: false,
      monthlyReports: false,
      storageGB: 5,
      monthlyUploads: 50,
      automationRuns: 10,
    },
  },
  commissioned: {
    id: 'commissioned',
    name: 'Commissioned',
    biblicalName: 'Commissioned for Impact',
    description: 'Your full calling activated with complete creation suite',
    monthlyPrice: 50,
    yearlyPrice: 500, // 2 months free
    badge: 'MOST POPULAR',
    badgeColor: '#FFD700',
    popular: true,
    trialEligible: true,
    scriptureReference: 'Matthew 28:19-20',
    features: {
      aiGenerationsPerDay: 100,
      premiumTemplates: true,
      customTemplates: true,
      bulkGeneration: true,
      analytics: 'advanced',
      productSyncLimit: 100,
      storefrontBuilder: true,
      schedulingAdvanced: true,
      apiAccess: false,
      whiteLabel: false,
      teamSeats: 3,
      prioritySupport: false,
      monthlyReports: false,
      storageGB: 25,
      monthlyUploads: 200,
      automationRuns: 50,
    },
  },
  mantled_pro: {
    id: 'mantled_pro',
    name: 'Mantled Pro',
    biblicalName: 'Mantled with Authority',
    description: 'Supernatural authority for agencies and large teams',
    monthlyPrice: 80,
    yearlyPrice: 800, // 2 months free
    scriptureReference: '2 Kings 2:9',
    features: {
      aiGenerationsPerDay: 500,
      premiumTemplates: true,
      customTemplates: true,
      bulkGeneration: true,
      analytics: 'advanced',
      productSyncLimit: 500,
      storefrontBuilder: true,
      schedulingAdvanced: true,
      apiAccess: true,
      whiteLabel: false,
      teamSeats: 10,
      prioritySupport: true,
      monthlyReports: true,
      storageGB: 100,
      monthlyUploads: 1000,
      automationRuns: 200,
    },
  },
  kingdom_enterprise: {
    id: 'kingdom_enterprise',
    name: 'Kingdom Enterprise',
    biblicalName: 'Kingdom Dominion',
    description: 'Advance His Kingdom with enterprise transformation tools',
    monthlyPrice: 150,
    yearlyPrice: 1500, // 2 months free
    badge: 'ENTERPRISE',
    badgeColor: '#10B981',
    scriptureReference: 'Daniel 7:14',
    features: {
      aiGenerationsPerDay: -1, // Unlimited
      premiumTemplates: true,
      customTemplates: true,
      bulkGeneration: true,
      analytics: 'enterprise',
      productSyncLimit: -1, // Unlimited
      storefrontBuilder: true,
      schedulingAdvanced: true,
      apiAccess: true,
      whiteLabel: true,
      teamSeats: -1, // Unlimited
      prioritySupport: true,
      monthlyReports: true,
      storageGB: -1, // Unlimited
      monthlyUploads: -1, // Unlimited
      automationRuns: -1, // Unlimited
    },
  },
};

// Export TIER_PLANS as TIER_CONFIG for use in other services
export const TIER_CONFIG = TIER_PLANS;

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
  const { addNotification } = useNotifications();

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
        setSubscription(parsedSubscription);
        
        // Calculate trial status
        if (parsedSubscription.trialEnd) {
          const trialEndDate = new Date(parsedSubscription.trialEnd);
          const now = new Date();
          
          if (trialEndDate > now) {
            setTrialStatus('active');
          } else {
            setTrialStatus('expired');
            
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
      
    } catch (error) {
      console.error('Failed to initialize tier system:', error);
      addNotification({
        type: 'error',
        title: 'Initialization Error',
        message: 'Failed to load subscription data'
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
      await subscriptionService.trackEvent('trial_started', {
        tier: 'commissioned',
        trialDays: 14
      });
      
      addNotification({
        type: 'success',
        title: '🎉 Welcome to Kingdom Studios!',
        message: 'Your 14-day Great Commission trial has started!'
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
        status: 'canceled'
      };
      
      setSubscription(expiredSubscription);
      
      await AsyncStorage.setItem('user_tier', 'seed');
      await AsyncStorage.setItem('subscription_status', JSON.stringify(expiredSubscription));
      
      addNotification({
        type: 'warning',
        title: 'Trial Expired',
        message: 'Your trial has ended. Upgrade to continue with premium features!'
      });
      
    } catch (error) {
      console.error('Failed to handle trial expiration:', error);
    }
  };

interface TierSystemProviderProps {
  children: ReactNode;
}

export const TierSystemProvider: React.FC<TierSystemProviderProps> = ({ children }) => {
  const [currentTier, setCurrentTier] = useState<TierType>('seed');
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false);

  // Load subscription status on mount
  useEffect(() => {
    loadSubscriptionStatus();
  }, []);

  const loadSubscriptionStatus = async () => {
    try {
      setIsLoading(true);
      
      // Load from AsyncStorage
      const [savedTier, savedSubscription] = await Promise.all([
        AsyncStorage.getItem('currentTier'),
        AsyncStorage.getItem('subscriptionStatus'),
      ]);

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
      }

      // TODO: Sync with backend/Stripe
      // await syncSubscriptionWithStripe();
      
    } catch (error) {
      console.error('Error loading subscription status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSubscriptionStatus = async (newTier: TierType, newSubscription?: SubscriptionStatus) => {
    try {
      await AsyncStorage.setItem('currentTier', newTier);
      if (newSubscription) {
        await AsyncStorage.setItem('subscriptionStatus', JSON.stringify(newSubscription));
      }
    } catch (error) {
      console.error('Error saving subscription status:', error);
    }
  };

  // Trial Management
  const getTrialStatus = (): TrialStatus => {
    if (!subscription?.trialEnd) return 'none';
    const now = new Date();
    return now > subscription.trialEnd ? 'expired' : 'active';
  };

  const getTrialDaysRemaining = (): number => {
    if (!subscription?.trialEnd) return 0;
    const now = new Date();
    const diffTime = subscription.trialEnd.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const startTrial = async (): Promise<void> => {
    try {
      setIsUpgrading(true);
      
      // Set 14-day trial for Commissioned tier
      const trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + 14);
      
      const newSubscription: SubscriptionStatus = {
        tier: 'commissioned',
        billingCycle: 'monthly',
        status: 'trial',
        currentPeriodEnd: trialEnd,
        trialEnd: trialEnd,
      };

      setCurrentTier('commissioned');
      setSubscription(newSubscription);
      await saveSubscriptionStatus('commissioned', newSubscription);

      // TODO: Create Stripe trial subscription
      // await createStripeTrialSubscription();

      Alert.alert(
        'Trial Started! 🎉',
        'You now have 14 days of full access to Commissioned tier features. Experience the full power of Kingdom Studios!',
        [{ text: 'Start Creating!', style: 'default' }]
      );

    } catch (error) {
      console.error('Error starting trial:', error);
      Alert.alert('Error', 'Failed to start trial. Please try again.');
    } finally {
      setIsUpgrading(false);
    }
  };

  const convertTrialToSubscription = async (billingCycle: BillingCycle): Promise<void> => {
    try {
      setIsUpgrading(true);

      // TODO: Process payment with Stripe
      // const paymentResult = await processStripePayment(currentTier, billingCycle);

      const newSubscription: SubscriptionStatus = {
        tier: currentTier,
        billingCycle,
        status: 'active',
        currentPeriodEnd: getNextBillingDate(billingCycle),
        trialEnd: null,
        // stripeSubscriptionId: paymentResult.subscriptionId,
      };

      setSubscription(newSubscription);
      await saveSubscriptionStatus(currentTier, newSubscription);

      Alert.alert(
        'Subscription Activated! ✨',
        `Welcome to the ${TIER_PLANS[currentTier].biblicalName}! Your Kingdom impact just multiplied.`,
        [{ text: 'Continue Building', style: 'default' }]
      );

    } catch (error) {
      console.error('Error converting trial:', error);
      Alert.alert('Error', 'Failed to activate subscription. Please try again.');
    } finally {
      setIsUpgrading(false);
    }
  };

  const upgradeTier = async (targetTier: TierType, billingCycle: BillingCycle): Promise<void> => {
    try {
      setIsUpgrading(true);

      // TODO: Process upgrade with Stripe
      // const upgradeResult = await processStripeUpgrade(targetTier, billingCycle);

      const newSubscription: SubscriptionStatus = {
        tier: targetTier,
        billingCycle,
        status: 'active',
        currentPeriodEnd: getNextBillingDate(billingCycle),
        trialEnd: null,
        // stripeSubscriptionId: upgradeResult.subscriptionId,
      };

      setCurrentTier(targetTier);
      setSubscription(newSubscription);
      await saveSubscriptionStatus(targetTier, newSubscription);

      Alert.alert(
        'Upgrade Successful! 🚀',
        `You've been upgraded to ${TIER_PLANS[targetTier].biblicalName}! New features are now available.`,
        [{ text: 'Explore Features', style: 'default' }]
      );

    } catch (error) {
      console.error('Error upgrading tier:', error);
      Alert.alert('Error', 'Failed to upgrade. Please try again.');
    } finally {
      setIsUpgrading(false);
    }
  };

  const downgradeTier = async (targetTier: TierType): Promise<void> => {
    try {
      setIsUpgrading(true);

      // TODO: Process downgrade with Stripe
      // await processStripeDowngrade(targetTier);

      const newSubscription: SubscriptionStatus = {
        tier: targetTier,
        billingCycle: subscription?.billingCycle || 'monthly',
        status: 'active',
        currentPeriodEnd: subscription?.currentPeriodEnd || getNextBillingDate('monthly'),
        trialEnd: null,
      };

      setCurrentTier(targetTier);
      setSubscription(newSubscription);
      await saveSubscriptionStatus(targetTier, newSubscription);

      Alert.alert(
        'Plan Changed',
        `You've been moved to ${TIER_PLANS[targetTier].biblicalName}. Changes take effect at the end of your current billing period.`,
        [{ text: 'OK', style: 'default' }]
      );

    } catch (error) {
      console.error('Error downgrading tier:', error);
      Alert.alert('Error', 'Failed to change plan. Please try again.');
    } finally {
      setIsUpgrading(false);
    }
  };

  const cancelSubscription = async (): Promise<void> => {
    try {
      setIsUpgrading(true);

      // TODO: Cancel with Stripe
      // await cancelStripeSubscription();

      const updatedSubscription = {
        ...subscription!,
        status: 'canceled' as const,
      };

      setSubscription(updatedSubscription);
      await saveSubscriptionStatus(currentTier, updatedSubscription);

      Alert.alert(
        'Subscription Canceled',
        'Your subscription has been canceled. You can still use your current features until the end of your billing period.',
        [{ text: 'OK', style: 'default' }]
      );

    } catch (error) {
      console.error('Error canceling subscription:', error);
      Alert.alert('Error', 'Failed to cancel subscription. Please try again.');
    } finally {
      setIsUpgrading(false);
    }
  };

  const reactivateSubscription = async (): Promise<void> => {
    try {
      setIsUpgrading(true);

      // TODO: Reactivate with Stripe
      // await reactivateStripeSubscription();

      const updatedSubscription = {
        ...subscription!,
        status: 'active' as const,
      };

      setSubscription(updatedSubscription);
      await saveSubscriptionStatus(currentTier, updatedSubscription);

      Alert.alert(
        'Subscription Reactivated! ✨',
        'Welcome back! Your subscription has been reactivated.',
        [{ text: 'Continue Building', style: 'default' }]
      );

    } catch (error) {
      console.error('Error reactivating subscription:', error);
      Alert.alert('Error', 'Failed to reactivate subscription. Please try again.');
    } finally {
      setIsUpgrading(false);
    }
  };

  // Feature Access Control
  const canAccessFeature = (feature: keyof TierFeatures): boolean => {
    const tierFeatures = TIER_PLANS[currentTier].features;
    const featureValue = tierFeatures[feature];
    
    if (typeof featureValue === 'boolean') {
      return featureValue;
    }
    if (typeof featureValue === 'number') {
      return featureValue > 0 || featureValue === -1; // -1 means unlimited
    }
    if (typeof featureValue === 'string') {
      return featureValue !== 'none';
    }
    
    return false;
  };

  const getRemainingUsage = (feature: keyof TierFeatures): number => {
    const tierFeatures = TIER_PLANS[currentTier].features;
    const limit = tierFeatures[feature] as number;
    
    if (limit === -1) return -1; // Unlimited
    
    // TODO: Track actual usage from backend
    // const currentUsage = await getCurrentUsage(feature);
    // return Math.max(0, limit - currentUsage);
    
    return limit; // Return full limit for now
  };

  // Admin Functions
  const adminSetTier = async (userId: string, tier: TierType, reason: string): Promise<void> => {
    try {
      // TODO: Admin API call
      // await adminAPI.setUserTier(userId, tier, reason);
      
      console.log(`Admin set user ${userId} to tier ${tier}. Reason: ${reason}`);
    } catch (error) {
      console.error('Admin tier change failed:', error);
      throw error;
    }
  };

  const adminApplyDiscount = async (userId: string, discountPercent: number, months: number): Promise<void> => {
    try {
      // TODO: Admin API call
      // await adminAPI.applyDiscount(userId, discountPercent, months);
      
      console.log(`Admin applied ${discountPercent}% discount to user ${userId} for ${months} months`);
    } catch (error) {
      console.error('Admin discount application failed:', error);
      throw error;
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
      };

      setSubscription(updatedSubscription);
      await saveSubscriptionStatus(currentTier, updatedSubscription);

    } catch (error) {
      console.error('Error extending trial:', error);
      throw error;
    }
  };

  // Helper Functions
  const getNextBillingDate = (billingCycle: BillingCycle): Date => {
    const date = new Date();
    if (billingCycle === 'monthly') {
      date.setMonth(date.getMonth() + 1);
    } else {
      date.setFullYear(date.getFullYear() + 1);
    }
    return date;
  };

  // Backend Sync
  const syncSubscriptionWithBackend = async () => {
    if (!subscription) return;
    
    try {
      // Sync local subscription status with backend
      await backendSyncService.syncSubscription(true);
      
      // Optionally, fetch updated tier information from backend
      const updatedSubscription = await subscriptionService.getCurrentSubscription(true);
      if (updatedTier) {
        setCurrentTier(updatedTier.id);
        setSubscription(prev => ({ ...prev, ...updatedTier }));
      }
      
    } catch (error) {
      console.error('Error syncing with backend:', error);
    }
  };

  const value: TierSystemContextType = {
    // Current Status
    currentTier,
    subscription,
    trialStatus: getTrialStatus(),
    trialDaysRemaining: getTrialDaysRemaining(),
    
    // Tier Management
    availableTiers: TIER_PLANS,
    canAccessFeature,
    getRemainingUsage,
    
    // Subscription Actions
    upgradeTier,
    downgradeTier,
    cancelSubscription,
    reactivateSubscription,
    
    // Trial Management
    startTrial,
    extendTrial,
    convertTrialToSubscription,
    
    // Admin Functions
    adminSetTier,
    adminApplyDiscount,
    
    // Loading States
    isLoading,
    isUpgrading,
  };

  return (
    <TierSystemContext.Provider value={value}>
      {children}
    </TierSystemContext.Provider>
  );
};

export const useTierSystem = (): TierSystemContextType => {
  const context = useContext(TierSystemContext);
  if (!context) {
    throw new Error('useTierSystem must be used within a TierSystemProvider');
  }
  return context;
};

export { TIER_PLANS };

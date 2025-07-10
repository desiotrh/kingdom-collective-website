/**
 * 🏛️ KINGDOM STUDIOS - FIRESTORE COLLECTIONS
 * Production database structure and schema definitions
 */

export const COLLECTIONS = {
  // User Management
  USERS: 'users',
  USER_PROFILES: 'userProfiles',
  USER_SETTINGS: 'userSettings',
  
  // Subscription & Tiers
  SUBSCRIPTIONS: 'subscriptions',
  TIER_USAGE: 'tierUsage',
  PAYMENT_METHODS: 'paymentMethods',
  INVOICES: 'invoices',
  
  // Content & Products
  PRODUCTS: 'products',
  CONTENT_POSTS: 'contentPosts',
  CONTENT_DRAFTS: 'contentDrafts',
  CONTENT_TEMPLATES: 'contentTemplates',
  
  // AI & Generation
  AI_GENERATIONS: 'aiGenerations',
  AI_USAGE_LOGS: 'aiUsageLogs',
  
  // Community & Social
  COMMUNITY_POSTS: 'communityPosts',
  PRAYER_REQUESTS: 'prayerRequests',
  TESTIMONIALS: 'testimonials',
  
  // Analytics & Tracking
  ANALYTICS_EVENTS: 'analyticsEvents',
  USER_SESSIONS: 'userSessions',
  FEATURE_USAGE: 'featureUsage',
  
  // Admin & Support
  ADMIN_LOGS: 'adminLogs',
  SUPPORT_TICKETS: 'supportTickets',
  FEEDBACK: 'feedback',
  
  // Notifications
  NOTIFICATIONS: 'notifications',
  PUSH_TOKENS: 'pushTokens',
  
  // External Platform Sync
  PLATFORM_CONNECTIONS: 'platformConnections',
  SYNC_JOBS: 'syncJobs',
  
  // Sponsorships & Partnerships
  SPONSORSHIP_REQUESTS: 'sponsorshipRequests',
  PARTNERSHIP_APPLICATIONS: 'partnershipApplications',
} as const;

export type CollectionName = keyof typeof COLLECTIONS;

// Document Schemas
export interface UserDocument {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  tier: 'seed' | 'rooted' | 'commissioned' | 'mantled_pro' | 'kingdom_enterprise';
  role: 'user' | 'team_admin' | 'super_admin';
  isFounder?: boolean;
  organizationId?: string;
  faithMode: boolean;
  onboardingCompleted: boolean;
  createdAt: Date | any; // Firebase Timestamp
  updatedAt: Date | any; // Firebase Timestamp
  lastLoginAt: Date | any; // Firebase Timestamp
}

export interface SubscriptionDocument {
  id?: string;
  userId: string;
  tier: string;
  status: 'active' | 'trial' | 'past_due' | 'canceled' | 'incomplete';
  billingCycle: 'monthly' | 'yearly';
  currentPeriodStart: Date | any; // Firebase Timestamp
  currentPeriodEnd: Date | any; // Firebase Timestamp
  trialEnd?: Date | any; // Firebase Timestamp
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  autoDowngradeDate?: Date | any; // Firebase Timestamp
  createdAt: Date | any; // Firebase Timestamp
  updatedAt: Date | any; // Firebase Timestamp
}

export interface TierUsageDocument {
  id?: string;
  userId: string;
  tier: string;
  month: string; // YYYY-MM format
  usage: {
    aiGenerations: number;
    designsCreated: number;
    storageUsedGB: number;
    apiCalls: number;
    teamSeatsUsed: number;
  };
  limits: {
    aiGenerationsPerDay: number;
    designsPerMonth: number;
    storageQuotaGB: number;
    teamSeats: number;
  };
  lastResetAt: Date | any; // Firebase Timestamp
  updatedAt: Date | any; // Firebase Timestamp
}

export interface ProductDocument {
  id?: string;
  userId: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  images: string[];
  platforms: Array<{
    platform: 'etsy' | 'printify' | 'shopify' | 'amazon';
    platformId: string;
    url: string;
    status: 'active' | 'inactive' | 'pending';
    lastSyncAt?: Date | any; // Firebase Timestamp
  }>;
  tags: string[];
  category: string;
  status: 'draft' | 'published' | 'archived';
  analytics: {
    views: number;
    clicks: number;
    conversions: number;
  };
  createdAt: Date | any; // Firebase Timestamp
  updatedAt: Date | any; // Firebase Timestamp
}

export interface ContentPostDocument {
  id?: string;
  userId: string;
  productId?: string;
  title: string;
  content: string;
  platforms: string[];
  status: 'draft' | 'scheduled' | 'published';
  scheduledFor?: Date | any; // Firebase Timestamp
  publishedAt?: Date | any; // Firebase Timestamp
  hashtags: string[];
  mentions: string[];
  media: Array<{
    type: 'image' | 'video';
    url: string;
    alt?: string;
  }>;
  analytics: {
    reach: number;
    engagement: number;
    clicks: number;
  };
  faithMode: boolean;
  createdAt: Date | any; // Firebase Timestamp
  updatedAt: Date | any; // Firebase Timestamp
}

export interface AIGenerationDocument {
  id?: string;
  userId: string;
  type: 'content' | 'design' | 'caption' | 'hashtags' | 'product_description';
  prompt: string;
  result: string;
  model: string;
  tokensUsed: number;
  processingTime: number;
  tier: string;
  faithMode: boolean;
  createdAt: Date | any; // Firebase Timestamp
}

export interface CommunityPostDocument {
  id?: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  type: 'discussion' | 'prayer_request' | 'testimonial' | 'question';
  title: string;
  content: string;
  tags: string[];
  faithMode: boolean;
  isPublic: boolean;
  replies: number;
  likes: number;
  createdAt: Date | any; // Firebase Timestamp
  updatedAt: Date | any; // Firebase Timestamp
}

export interface NotificationDocument {
  id?: string;
  userId: string;
  type: 'tier_change' | 'trial_ending' | 'usage_limit' | 'payment_success' | 'payment_failed' | 'feature_update';
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  actionUrl?: string;
  createdAt: Date | any; // Firebase Timestamp
  expiresAt?: Date | any; // Firebase Timestamp
}

// Collection helpers
export const getCollectionPath = (collection: CollectionName): string => {
  return COLLECTIONS[collection];
};

export const getUserCollectionPath = (userId: string, subcollection: string): string => {
  return `${COLLECTIONS.USERS}/${userId}/${subcollection}`;
};
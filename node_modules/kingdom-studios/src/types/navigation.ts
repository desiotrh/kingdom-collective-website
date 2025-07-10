export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  Dashboard: undefined;
  CreatorDashboard: undefined;
  ContentGenerator: undefined;
  ProductSync: undefined;
  ForgeCommunity: undefined;
  Scheduling: undefined;
  Sponsorships: undefined;
  AnalyticsOverview: undefined;
  Monetization: undefined;
  MultiPlatformPost: { productId?: string };
  ContentLibrary: undefined;
  ScheduledPosts: undefined;
  ProductDashboard: undefined;
  ProductDetails: { productId: string };
  EditProduct: { productId: string };
  AddProduct: undefined;
  Settings: undefined;
  Loading: undefined;
  Onboarding: undefined;
  SponsorshipRequest: undefined;
  Pricing: undefined;
  // Tier System
  TierSystem: undefined;
  FAQ: undefined;
  ContactSales: undefined;
  // Admin Screens
  AdminMonitoring: undefined;
  AdminDashboard: undefined;
  AdminUserManagement: undefined;
  AdminAnalytics: undefined;
  AdminBilling: undefined;
  AdminSettings: undefined;
  // AI Studio Screens
  AIStudio: undefined;
  AIGenerationTest: undefined; // For testing AI features
  SocialMediaGenerator: undefined;
  SocialMediaManagement: undefined; // Social media integration hub
  EmailMarketingManagement: undefined; // Email marketing hub
  TShirtDesigner: undefined;
  EmailSequencer: undefined;
  SEOPlanner: undefined;
  HashtagHelper: undefined;
  // Design Studio Screens
  DesignStudio: undefined;
  PostEditor: undefined;
  TemplateLibrary: undefined;
  // Products Screens
  Products: undefined;
  ProductManager: undefined;
  ProductAnalytics: undefined;
  // Storefront Builder
  Storefront: undefined;
  StorefrontBuilder: undefined;
  StorefrontPreview: undefined;
  // Lead Magnets & Funnels
  Funnels: undefined;
  LeadMagnetBuilder: undefined;
  LandingPageBuilder: undefined;
  FunnelAnalytics: undefined;
  // Course Builder
  Courses: undefined;
  CourseBuilder: undefined;
  CourseEditor: undefined;
  CourseSettings: undefined;
  // Content Planner
  Planner: undefined;
  KanbanBoard: undefined;
  ContentCalendar: undefined;
  TaskManager: undefined;
  // Photo & Video Editor
  Editor: undefined;
  PhotoEditor: undefined;
  VideoEditor: undefined;
  // Analytics Module
  Analytics: undefined;
  PostAnalytics: undefined;
  ProductMetrics: undefined;
  // Mentorship System
  MentorshipHub: undefined;
  MentorProfile: { mentorId: string };
  MentorshipRequest: { mentorId: string; mentorName: string; categories: any[] };
  MentorOnboarding: undefined;
  FindMentor: undefined;
  BecomeMentor: undefined;
  DiscipleshipPathways: undefined;
  MentorshipSessions: undefined;
  AllMentors: undefined;
  // Teaching System
  Teaching: undefined;
  // Spiritual & Community Modules
  TestimonyWall: undefined;
  PrayerRoom: undefined;
  ResourceLibrary: undefined;
  RefinersFireChallenge: undefined;
  SpiritualIdentityQuiz: undefined; // Now: Mentor Matching Quiz
  MentorMatchingQuiz: undefined;
  // AI Assistant
  AIAssistant: undefined;
  // Hashtag Manager
  HashtagManager: undefined;
  // Link in Bio Builder
  LinkInBioBuilder: undefined;
  // Digital Product Manager
  DigitalProductManager: undefined;
  // Affiliate Hub
  AffiliateHub: undefined;
  // Product Content Templates
  ProductContentTemplates: undefined;
  // Faith Content Calendar
  FaithContentCalendar: undefined;
  // Advanced Analytics Dashboard
  AdvancedAnalyticsDashboard: undefined;
  // Podcast/Shorts Hub
  PodcastShortsHub: undefined;
  // User Tools & Features
  UserSuggestion: undefined;
  VideoRecording: undefined;
  PhotoVideoFilters: undefined;
  VisualDiscovery: undefined;
  CanvaDesignTool: undefined;
  EcommerceStoreBuilder: undefined;
  AdLaunchTool: undefined;
  SalesFunnelBuilder: undefined;
  EmailMarketing: undefined;
  WebinarHosting: undefined;
  SocialListening: undefined;
  CRM: undefined;
  WorkflowAutomation: undefined;
  InfluencerOutreach: undefined;
  AdminCouponManager: undefined;
  NotificationCenter: undefined;
  TeamCollaboration: undefined;
  AdvancedAnalyticsHub: undefined;
  LiveChatSupport: undefined;
  CommunityHub: undefined;
  AdvancedEcommerce: undefined;
  MobileOptimization: undefined;
  // Admin/Safety Tools
  ContentModeration: undefined;
  UserManagement: undefined;
  FlagReview: undefined;
  ModerationAlerts: undefined;
  // Advanced Features
  AdvancedProjectManagement: undefined;
  MultiLanguageSupport: undefined;
  AdvancedSecurityCenter: undefined;
  APIIntegrationManager: undefined;
  FaithEnhancementHub: undefined;
  // Checkout & Payments
  Checkout: { 
    product: {
      id: string;
      name: string;
      description: string;
      price: number;
      currency: string;
      type: 'one_time' | 'subscription' | 'donation';
      features?: string[];
    };
    plan?: 'monthly' | 'yearly';
  };
  PaymentSuccess: { transactionId: string };
  PaymentFailed: { error: string };
  // Settings & Configuration
  APIConfiguration: undefined;
  NotificationSettings: undefined;
  SubscriptionUpgrade: undefined;
};

// Main Tab Navigator Type
export type MainTabParamList = {
  Dashboard: undefined;
  AIStudio: undefined;
  Products: undefined;
  Design: undefined;
  Storefront: undefined;
  Community: undefined;
  More: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

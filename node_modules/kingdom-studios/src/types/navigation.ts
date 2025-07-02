export type RootStackParamList = {
  Login: undefined;
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
  LeadMagnetBuilder: undefined;
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
  AdminDashboard: undefined;
  ContentModeration: undefined;
  UserManagement: undefined;
  FlagReview: undefined;
  ModerationAlerts: undefined;
  AdminSettings: undefined;
  // Advanced Features
  AdvancedProjectManagement: undefined;
  MultiLanguageSupport: undefined;
  AdvancedSecurityCenter: undefined;
  APIIntegrationManager: undefined;
  FaithEnhancementHub: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

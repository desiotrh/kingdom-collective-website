/**
 * Kingdom Studios AI Assistant Types
 * Intelligent marketing assistant with biblical wisdom and dual-mode support
 */

import { AppMode } from './spiritual';

export interface AIAssistant {
  id: string;
  name: string;
  personality: 'encouraging' | 'wise' | 'strategic' | 'creative';
  specialties: AISpecialty[];
  mode: AppMode;
  isActive: boolean;
  learningLevel: 'basic' | 'intermediate' | 'advanced' | 'expert';
  createdAt: string;
  updatedAt: string;
}

export type AISpecialty = 
  | 'content_creation'
  | 'hashtag_optimization'
  | 'product_development'
  | 'social_media_strategy'
  | 'trend_analysis'
  | 'biblical_wisdom'
  | 'seasonal_marketing'
  | 'platform_optimization'
  | 'audience_engagement'
  | 'conversion_optimization';

export interface AIConversation {
  id: string;
  userId: string;
  assistantId: string;
  title: string;
  messages: AIMessage[];
  context: ConversationContext;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  category: ConversationCategory;
}

export type ConversationCategory = 
  | 'faq'
  | 'content_help'
  | 'product_brainstorm'
  | 'hashtag_suggestions'
  | 'biblical_guidance'
  | 'strategy_planning'
  | 'trend_analysis'
  | 'troubleshooting';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: MessageMetadata;
  suggestions?: AISuggestion[];
  attachments?: MessageAttachment[];
}

export interface MessageMetadata {
  platform?: SocialPlatform;
  contentType?: ContentType;
  mood?: 'encouraging' | 'informative' | 'strategic' | 'inspirational';
  confidence?: number; // 0-1 score for AI confidence
  sourceBibleVerse?: string;
  relevantHashtags?: string[];
  trendingScore?: number;
}

export interface AISuggestion {
  id: string;
  type: SuggestionType;
  content: string;
  confidence: number;
  reasoning: string;
  metadata?: any;
  isImplemented?: boolean;
}

export type SuggestionType = 
  | 'hashtag'
  | 'content_idea'
  | 'product_concept'
  | 'posting_time'
  | 'platform_strategy'
  | 'bible_verse'
  | 'engagement_tip'
  | 'trend_opportunity'
  | 'repurpose_strategy'
  | 'batch_creation'
  | 'scheduling_tip'
  | 'consistency_tip'
  | 'validation_tip'
  | 'mvp_strategy'
  | 'pricing_strategy';

export interface MessageAttachment {
  id: string;
  type: 'image' | 'document' | 'link' | 'product' | 'post_draft';
  url?: string;
  metadata?: any;
}

export interface ConversationContext {
  currentProducts: string[]; // Product IDs
  recentPosts: string[]; // Post IDs
  preferredPlatforms: SocialPlatform[];
  userHashtagPreferences: HashtagPreference[];
  currentGoals: MarketingGoal[];
  seasonalContext: SeasonalContext;
  trendingTopics: TrendingTopic[];
}

export interface HashtagPreference {
  hashtag: string;
  platform: SocialPlatform;
  frequency: number; // How often user uses it
  engagement: number; // Average engagement when used
  lastUsed: string;
  category: HashtagCategory;
}

export type HashtagCategory = 
  | 'brand'
  | 'niche'
  | 'trending'
  | 'faith'
  | 'motivational'
  | 'product'
  | 'seasonal'
  | 'location'
  | 'community';

export interface MarketingGoal {
  id: string;
  title: string;
  description: string;
  targetMetric: string;
  currentValue: number;
  targetValue: number;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  status: 'planning' | 'active' | 'completed' | 'paused';
}

export interface SeasonalContext {
  currentSeason: 'spring' | 'summer' | 'fall' | 'winter';
  holidays: Holiday[];
  religiousObservances: ReligiousObservance[];
  marketingSeasons: MarketingSeason[];
}

export interface Holiday {
  name: string;
  date: string;
  type: 'national' | 'religious' | 'cultural' | 'commercial';
  marketingOpportunity: boolean;
  suggestedContent?: string[];
}

export interface ReligiousObservance {
  name: string;
  date: string;
  description: string;
  bibleReferences?: string[];
  contentSuggestions?: string[];
}

export interface MarketingSeason {
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  keyTrends: string[];
  opportunityScore: number; // 0-1
}

export interface TrendingTopic {
  keyword: string;
  platform: SocialPlatform;
  trendScore: number; // 0-100
  category: string;
  relevanceToUser: number; // 0-1
  expirationDate?: string;
  relatedHashtags: string[];
}

export type SocialPlatform = 
  | 'instagram'
  | 'tiktok'
  | 'facebook'
  | 'youtube'
  | 'pinterest'
  | 'twitter'
  | 'linkedin'
  | 'threads'
  | 'lemon8';

export type ContentType = 
  | 'post'
  | 'story'
  | 'reel'
  | 'video'
  | 'carousel'
  | 'live'
  | 'podcast'
  | 'blog';

export interface AILearningData {
  userId: string;
  personalityProfile: UserPersonality;
  contentPreferences: ContentPreferences;
  engagementPatterns: EngagementPattern[];
  hashtagAnalytics: HashtagAnalytics;
  productPerformance: ProductPerformance[];
  audienceInsights: AudienceInsights;
  seasonalTrends: UserSeasonalTrend[];
  lastUpdated: string;
}

export interface UserPersonality {
  communicationStyle: 'formal' | 'casual' | 'enthusiastic' | 'inspiring';
  contentTone: 'educational' | 'motivational' | 'conversational' | 'storytelling';
  visualPreferences: 'minimalist' | 'colorful' | 'professional' | 'creative';
  postingFrequency: 'daily' | 'few_times_week' | 'weekly' | 'occasional';
  engagementStyle: 'responsive' | 'proactive' | 'community_focused' | 'strategic';
}

export interface ContentPreferences {
  topPerformingCategories: string[];
  preferredContentTypes: ContentType[];
  optimalPostingTimes: TimeSlot[];
  averageEngagementRate: number;
  topHashtagCategories: HashtagCategory[];
  contentThemes: ContentTheme[];
}

export interface ContentTheme {
  name: string;
  frequency: number;
  avgEngagement: number;
  bestPlatforms: SocialPlatform[];
  seasonality?: string;
}

export interface TimeSlot {
  platform: SocialPlatform;
  day: string;
  hour: number;
  engagementScore: number;
}

export interface EngagementPattern {
  platform: SocialPlatform;
  contentType: ContentType;
  avgLikes: number;
  avgComments: number;
  avgShares: number;
  bestHashtags: string[];
  peakEngagementTime: string;
}

export interface HashtagAnalytics {
  totalHashtagsUsed: number;
  topPerformingHashtags: HashtagPerformance[];
  hashtagGrowthRate: number;
  platformSpecificPerformance: Record<SocialPlatform, HashtagPerformance[]>;
  seasonalHashtagTrends: Record<string, string[]>;
}

export interface HashtagPerformance {
  hashtag: string;
  timesUsed: number;
  avgEngagement: number;
  reachIncrease: number;
  conversionRate?: number;
  trendingScore: number;
}

export interface ProductPerformance {
  productId: string;
  productName: string;
  totalPosts: number;
  avgEngagement: number;
  conversionRate: number;
  bestPerformingContent: string[];
  seasonalPerformance: Record<string, number>;
  platformPerformance: Record<SocialPlatform, number>;
}

export interface AudienceInsights {
  demographics: Demographics;
  interests: string[];
  engagementPreferences: EngagementPreference[];
  growthMetrics: GrowthMetrics;
  behaviorPatterns: BehaviorPattern[];
}

export interface Demographics {
  ageGroups: Record<string, number>;
  genderDistribution: Record<string, number>;
  locationData: Record<string, number>;
  deviceUsage: Record<string, number>;
}

export interface EngagementPreference {
  contentType: ContentType;
  preferredTimes: string[];
  interactionTypes: string[];
  responseRate: number;
}

export interface GrowthMetrics {
  followerGrowthRate: number;
  engagementGrowthRate: number;
  reachGrowthRate: number;
  conversionGrowthRate: number;
}

export interface BehaviorPattern {
  pattern: string;
  frequency: number;
  impact: 'positive' | 'neutral' | 'negative';
  recommendation: string;
}

export interface UserSeasonalTrend {
  season: string;
  topPerformingContent: string[];
  engagementIncrease: number;
  bestHashtags: string[];
  recommendedProducts: string[];
}

// AI Response Types
export interface AIResponse {
  message: string;
  suggestions: AISuggestion[];
  hashtags?: HashtagSuggestion[];
  contentIdeas?: ContentIdea[];
  bibleVerse?: BibleVerse;
  confidence: number;
  reasoning: string;
  repurposeIdeas?: RepurposeIdea[];
  schedulingInsights?: SchedulingInsights;
  personalizedTips?: string[];
  productConcepts?: ProductConcept[];
}

export interface BibleVerse {
  verse: string;
  reference: string;
  application: string;
  mood: 'encouraging' | 'wisdom' | 'strength' | 'guidance' | 'peace';
}

export interface HashtagSuggestion {
  hashtag: string;
  platform: SocialPlatform;
  category: HashtagCategory;
  trendingScore: number;
  userAffinityScore: number;
  expectedEngagement: number;
  reasoning: string;
}

export interface ContentIdea {
  title: string;
  description: string;
  contentType: ContentType;
  platform: SocialPlatform[];
  difficulty: 'easy' | 'medium' | 'hard';
  expectedEngagement: number;
  hashtags: string[];
  bibleConnection?: string;
  seasonalRelevance?: string;
}

export interface ProductSuggestion {
  concept: string;
  description: string;
  targetAudience: string;
  priceRange: string;
  marketingStrategy: string[];
  contentPlan: string[];
  expectedDemand: number;
  bibleFoundation?: string;
}

export interface ActionItem {
  task: string;
  priority: 'low' | 'medium' | 'high';
  estimatedTime: string;
  category: 'content' | 'strategy' | 'optimization' | 'learning';
  deadline?: string;
}

export interface RepurposeIdea {
  title: string;
  description: string;
  platforms: string[];
  format: string;
  estimatedReach: string;
}

export interface SchedulingInsights {
  [platform: string]: {
    bestTimes: string[];
    bestDays: string[];
    reasoning: string;
  };
}

export interface ProductConcept {
  type: string;
  title: string;
  description: string;
  priceRange: string;
  targetAudience: string;
  uniqueValue: string;
  marketDemand: string;
  developmentTime: string;
  marketingAngle: string;
}

// AI Assistant Configuration
export interface AIConfiguration {
  faithModePersonality: {
    greeting: string;
    signoff: string;
    tone: string;
    bibleVerseFrequency: 'high' | 'medium' | 'low';
    wisdomLevel: 'gentle' | 'direct' | 'deep';
  };
  encouragementModePersonality: {
    greeting: string;
    signoff: string;
    tone: string;
    motivationLevel: 'subtle' | 'moderate' | 'high';
    practicalFocus: boolean;
  };
  learningSettings: {
    dataRetentionDays: number;
    analysisFrequency: 'daily' | 'weekly' | 'monthly';
    privacyLevel: 'basic' | 'enhanced' | 'maximum';
    shareInsights: boolean;
  };
  responseSettings: {
    maxSuggestions: number;
    detailLevel: 'brief' | 'moderate' | 'detailed';
    includeExplanations: boolean;
    proactiveMode: boolean;
  };
}

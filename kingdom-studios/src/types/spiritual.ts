/**
 * Kingdom Studios Spiritual & Community Types
 * Data models for testimony sharing, spiritual growth, and community features
 * Supporting dual-mode: Faith Mode & Encouragement Mode
 */

// Core app mode types
export type AppMode = 'faith' | 'encouragement';

export interface ModeConfig {
  mode: AppMode;
  branding: {
    primaryColor: string;
    secondaryColor: string;
    gradientColors: string[];
    logo: string;
    appName: string;
  };
  messaging: {
    greeting: string;
    tagline: string;
    communityName: string;
    testimoniesTitle: string;
    prayerTitle: string;
  };
}

export interface Testimony {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  title: string;
  content: string;
  category: TestimonyCategory;
  type: 'written' | 'video' | 'audio';
  mediaUrl?: string;
  isPublic: boolean;
  isApproved: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  likes: number;
  comments: TestimonyComment[];
  shares: number;
  prayerCount: number;
  isScheduledPost: boolean;
  scheduledDate?: string;
  aiEnhancedCaption?: string;
  // Dual-mode support
  mode: AppMode;
  encouragementLevel?: 'gentle' | 'moderate' | 'strong';
  spiritualIntensity?: 'foundational' | 'growing' | 'mature';
}

export interface TestimonyComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  scripture?: string;
  isEncouragement: boolean;
  createdAt: string;
  likes: number;
  // Dual-mode support
  mode: AppMode;
  tone: 'supportive' | 'celebratory' | 'prayerful' | 'encouraging';
}

export interface TestimonyCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  // Dual-mode support
  faithModeLabel: string;
  encouragementModeLabel: string;
  faithModeDescription: string;
  encouragementModeDescription: string;
  applicableToMode: AppMode | 'both';
}

export interface PrayerRequest {
  id: string;
  userId: string;
  userName?: string;
  userAvatar?: string;
  title: string;
  description: string;
  category: PrayerCategory;
  isAnonymous: boolean;
  isUrgent: boolean;
  isPraisereport: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  prayerCount: number;
  prayedByUsers: string[];
  encouragements: PrayerEncouragement[];
  status: 'active' | 'answered' | 'archived';
  answeredDate?: string;
  answeredTestimony?: string;
  // Dual-mode support
  mode: AppMode;
  sensitivityLevel?: 'low' | 'medium' | 'high';
  privacyLevel?: 'community' | 'mentors_only' | 'private';
}

export interface PrayerCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  // Dual-mode support
  faithModeLabel: string;
  encouragementModeLabel: string;
  faithModeDescription: string;
  encouragementModeDescription: string;
  applicableToMode: AppMode | 'both';
}

export interface PrayerEncouragement {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  scripture?: string;
  createdAt: string;
  likes: number;
  // Dual-mode support
  mode: AppMode;
  tone: 'supportive' | 'uplifting' | 'faith-building' | 'comforting';
}

export interface SpiritualResource {
  id: string;
  title: string;
  description: string;
  content?: string; // Full content for articles/guides
  category: ResourceCategory;
  type: 'pdf' | 'template' | 'video' | 'audio' | 'checklist' | 'qr_code' | 'article' | 'guide' | 'study';
  format: 'text' | 'video' | 'audio' | 'document' | 'interactive';
  fileUrl?: string;
  thumbnailUrl?: string;
  tags: string[];
  downloadCount: number;
  views: number; // View count
  likes: number; // Like count
  rating: number;
  reviews: ResourceReview[];
  createdAt: string;
  updatedAt: string;
  isPreview: boolean;
  isPublic: boolean;
  isPremium: boolean;
  previewUrl?: string;
  estimatedReadTime?: number; // For articles/guides
  // Dual-mode support
  mode: AppMode;
  appropriatenessLevel: 'general' | 'mature' | 'advanced';
  spiritualLevel?: 'beginner' | 'intermediate' | 'advanced' | 'mature';
  supportingScriptures?: string[];
}

export interface ResourceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  // Dual-mode support
  faithModeLabel: string;
  encouragementModeLabel: string;
  faithModeDescription: string;
  encouragementModeDescription: string;
  applicableToMode: AppMode | 'both';
}

export interface ResourceReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface SpiritualGift {
  id: string;
  name: string;
  description: string;
  bibleReference: string;
  characteristics: string[];
  strengths: string[];
  growthAreas: string[];
  recommendedResources: string[];
  mentorshipMatch: string[];
}

export interface SpiritualIdentityQuiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  results: SpiritualGiftResult[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  answers: QuizAnswer[];
  category: 'prophetic' | 'teaching' | 'pastoral' | 'evangelistic' | 'apostolic' | 'serving' | 'mercy' | 'leadership';
}

export interface QuizAnswer {
  id: string;
  text: string;
  score: number;
  giftType: string;
}

export interface SpiritualGiftResult {
  primaryGift: SpiritualGift;
  secondaryGifts: SpiritualGift[];
  score: number;
  description: string;
  recommendedMentors: string[];
  suggestedContent: string[];
  nextSteps: string[];
}

export interface RefinerFireChallenge {
  id: string;
  title: string;
  description: string;
  duration: number; // days
  dailyContent: RefinerFireDaily[];
  participants: number;
  completionRate: number;
  testimonies: string[];
  // Dual-mode support
  mode: AppMode;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  encouragementLevel: 'gentle' | 'moderate' | 'intense';
}

export interface RefinerFireDaily {
  day: number;
  scripture: string;
  worshipPrompt: string;
  journalQuestion: string;
  declaration: string;
  encouragement: string;
  isCompleted?: boolean;
  completedAt?: string;
  userReflection?: string;
  // Dual-mode support
  mode: AppMode;
  alternativeContent?: {
    faithMode?: {
      scripture?: string;
      worshipPrompt?: string;
      journalQuestion?: string;
      declaration?: string;
      encouragement?: string;
    };
    encouragementMode?: {
      scripture?: string;
      worshipPrompt?: string;
      journalQuestion?: string;
      declaration?: string;
      encouragement?: string;
    };
  };
}

export interface AffilateProduct {
  id: string;
  name: string;
  description: string;
  affiliateLink: string;
  imageUrl: string;
  price: string;
  category: string;
  platform: 'etsy' | 'printify' | 'shopify' | 'swc' | 'other';
  tags: string[];
  seasonalRelevance: string[];
  aiGeneratedContent?: {
    captions: string[];
    hashtags: string[];
    carouselIdeas: string[];
    reelScripts: string[];
  };
  // Dual-mode support
  mode: AppMode;
  targetAudience: 'faith_community' | 'general_encouragement' | 'both';
}

// Additional types for community features
export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'testimony' | 'prayer_request';
  mediaUrl?: string;
  category?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  likes: number;
  comments: CommunityComment[];
  shares: number;
  isPublic: boolean;
  isApproved: boolean;
  // Dual-mode support
  mode: AppMode;
  sensitivityLevel: 'low' | 'medium' | 'high';
  encouragementTone?: 'uplifting' | 'supportive' | 'celebratory' | 'comforting';
}

export interface CommunityComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  likes: number;
  // Dual-mode support
  mode: AppMode;
  tone: 'supportive' | 'encouraging' | 'prayerful' | 'celebratory';
}

export interface ModePreferences {
  userId: string;
  defaultMode: AppMode;
  allowModeSwitch: boolean;
  contentFiltering: {
    showBothModes: boolean;
    faithModeIntensity: 'gentle' | 'moderate' | 'mature';
    encouragementModeStyle: 'casual' | 'inspirational' | 'professional';
  };
  notifications: {
    faithModeEnabled: boolean;
    encouragementModeEnabled: boolean;
  };
  updatedAt: string;
}

// Constants for categories with dual-mode support
export const TESTIMONY_CATEGORIES: TestimonyCategory[] = [
  {
    id: 'deliverance',
    name: 'Deliverance',
    icon: '⛓️‍💥',
    description: 'Freedom from strongholds and bondage',
    color: '#EF4444',
    faithModeLabel: 'Deliverance Breakthrough',
    encouragementModeLabel: 'Freedom Journey',
    faithModeDescription: 'Testimonies of God\'s power breaking chains and setting captives free',
    encouragementModeDescription: 'Stories of breaking free from limiting patterns and finding personal freedom',
    applicableToMode: 'both'
  },
  {
    id: 'healing',
    name: 'Healing',
    icon: '🙌',
    description: 'Physical, emotional, and spiritual healing',
    color: '#10B981',
    faithModeLabel: 'Divine Healing',
    encouragementModeLabel: 'Healing Journey',
    faithModeDescription: 'Miraculous healing testimonies through faith and prayer',
    encouragementModeDescription: 'Stories of recovery, wellness, and overcoming health challenges',
    applicableToMode: 'both'
  },
  {
    id: 'business',
    name: 'Business Breakthrough',
    icon: '💼',
    description: 'God\'s favor in business and finances',
    color: '#F59E0B',
    faithModeLabel: 'Kingdom Business Victory',
    encouragementModeLabel: 'Professional Success',
    faithModeDescription: 'Testimonies of God\'s blessing and favor in business ventures',
    encouragementModeDescription: 'Stories of career growth, business success, and professional breakthroughs',
    applicableToMode: 'both'
  },
  {
    id: 'restoration',
    name: 'Restoration',
    icon: '🔄',
    description: 'Restored relationships and circumstances',
    color: '#8B5CF6',
    faithModeLabel: 'Divine Restoration',
    encouragementModeLabel: 'Life Transformation',
    faithModeDescription: 'Testimonies of God restoring what was lost or broken',
    encouragementModeDescription: 'Stories of rebuilding, renewing, and positive life changes',
    applicableToMode: 'both'
  },
  {
    id: 'identity',
    name: 'Identity in Christ',
    icon: '👑',
    description: 'Discovering who you are in God',
    color: '#FFD700',
    faithModeLabel: 'Identity in Christ',
    encouragementModeLabel: 'Self-Discovery',
    faithModeDescription: 'Testimonies of discovering true identity and worth in God',
    encouragementModeDescription: 'Stories of personal growth, self-acceptance, and finding your purpose',
    applicableToMode: 'both'
  },
  {
    id: 'salvation',
    name: 'Salvation',
    icon: '✝️',
    description: 'Coming to know Jesus as Lord and Savior',
    color: '#DC2626',
    faithModeLabel: 'Salvation Testimony',
    encouragementModeLabel: 'Life-Changing Decision',
    faithModeDescription: 'Testimonies of accepting Jesus Christ as Lord and Savior',
    encouragementModeDescription: 'Stories of life-changing spiritual decisions and new beginnings',
    applicableToMode: 'faith'
  },
  {
    id: 'provision',
    name: 'God\'s Provision',
    icon: '🍞',
    description: 'Miraculous provision and breakthrough',
    color: '#059669',
    faithModeLabel: 'Divine Provision',
    encouragementModeLabel: 'Unexpected Blessings',
    faithModeDescription: 'Testimonies of God\'s miraculous provision and breakthrough',
    encouragementModeDescription: 'Stories of unexpected help, opportunities, and positive surprises',
    applicableToMode: 'both'
  },
  {
    id: 'calling',
    name: 'Walking in Calling',
    icon: '🔥',
    description: 'Stepping into God\'s purpose and calling',
    color: '#DC2626',
    faithModeLabel: 'Kingdom Calling',
    encouragementModeLabel: 'Purpose Discovery',
    faithModeDescription: 'Testimonies of discovering and walking in God\'s calling',
    encouragementModeDescription: 'Stories of finding your life purpose and making meaningful impact',
    applicableToMode: 'both'
  }
];

export const PRAYER_CATEGORIES: PrayerCategory[] = [
  {
    id: 'healing',
    name: 'Healing',
    icon: '🙏',
    description: 'Physical, emotional, spiritual healing',
    color: '#10B981',
    faithModeLabel: 'Healing Prayer',
    encouragementModeLabel: 'Wellness Support',
    faithModeDescription: 'Requests for divine healing and supernatural intervention',
    encouragementModeDescription: 'Support for health challenges and recovery journey',
    applicableToMode: 'both'
  },
  {
    id: 'family',
    name: 'Family',
    icon: '👨‍👩‍👧‍👦',
    description: 'Marriage, children, relationships',
    color: '#F59E0B',
    faithModeLabel: 'Family Blessing',
    encouragementModeLabel: 'Relationship Support',
    faithModeDescription: 'Prayers for family unity, marriages, and children',
    encouragementModeDescription: 'Support for family challenges and relationship growth',
    applicableToMode: 'both'
  },
  {
    id: 'finances',
    name: 'Finances',
    icon: '💰',
    description: 'Provision, debt, business breakthrough',
    color: '#059669',
    faithModeLabel: 'Financial Breakthrough',
    encouragementModeLabel: 'Financial Stability',
    faithModeDescription: 'Prayers for God\'s provision and financial breakthrough',
    encouragementModeDescription: 'Support for financial challenges and stability',
    applicableToMode: 'both'
  },
  {
    id: 'spiritual',
    name: 'Spiritual Growth',
    icon: '📖',
    description: 'Closer walk with God, breakthrough',
    color: '#8B5CF6',
    faithModeLabel: 'Spiritual Breakthrough',
    encouragementModeLabel: 'Personal Growth',
    faithModeDescription: 'Prayers for deeper relationship with God and spiritual growth',
    encouragementModeDescription: 'Support for personal development and life purpose',
    applicableToMode: 'both'
  },
  {
    id: 'direction',
    name: 'Direction',
    icon: '🧭',
    description: 'Guidance, decisions, calling',
    color: '#06B6D4',
    faithModeLabel: 'Divine Guidance',
    encouragementModeLabel: 'Life Direction',
    faithModeDescription: 'Prayers for God\'s guidance in decisions and life direction',
    encouragementModeDescription: 'Support for major decisions and finding clarity',
    applicableToMode: 'both'
  },
  {
    id: 'deliverance',
    name: 'Deliverance',
    icon: '⛓️‍💥',
    description: 'Freedom from strongholds',
    color: '#EF4444',
    faithModeLabel: 'Deliverance Prayer',
    encouragementModeLabel: 'Breaking Free',
    faithModeDescription: 'Prayers for freedom from spiritual bondage and strongholds',
    encouragementModeDescription: 'Support for overcoming limiting patterns and behaviors',
    applicableToMode: 'both'
  },
  {
    id: 'emergency',
    name: 'Emergency',
    icon: '🚨',
    description: 'Urgent prayer needs',
    color: '#DC2626',
    faithModeLabel: 'Urgent Prayer',
    encouragementModeLabel: 'Emergency Support',
    faithModeDescription: 'Immediate prayer needs requiring urgent intercession',
    encouragementModeDescription: 'Urgent situations needing immediate community support',
    applicableToMode: 'both'
  }
];

export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  {
    id: 'deliverance',
    name: 'Deliverance',
    icon: '⛓️‍💥',
    description: 'Freedom prayers, declarations, warfare tools',
    color: '#EF4444',
    faithModeLabel: 'Deliverance Resources',
    encouragementModeLabel: 'Freedom Tools',
    faithModeDescription: 'Spiritual warfare tools, freedom prayers, and deliverance declarations',
    encouragementModeDescription: 'Resources for breaking free from limiting patterns and finding personal freedom',
    applicableToMode: 'both'
  },
  {
    id: 'warfare',
    name: 'Spiritual Warfare',
    icon: '⚔️',
    description: 'Battle plans, armor prayers, protection',
    color: '#7C2D12',
    faithModeLabel: 'Spiritual Warfare',
    encouragementModeLabel: 'Strength & Protection',
    faithModeDescription: 'Spiritual warfare strategies, armor of God prayers, and protection resources',
    encouragementModeDescription: 'Tools for building inner strength and protecting your peace',
    applicableToMode: 'faith'
  },
  {
    id: 'healing',
    name: 'Healing',
    icon: '🙌',
    description: 'Healing prayers, scriptures, testimonies',
    color: '#10B981',
    faithModeLabel: 'Divine Healing',
    encouragementModeLabel: 'Wellness Journey',
    faithModeDescription: 'Healing scriptures, prayers, and supernatural healing resources',
    encouragementModeDescription: 'Wellness resources, recovery tools, and health encouragement',
    applicableToMode: 'both'
  },
  {
    id: 'identity',
    name: 'Identity',
    icon: '👑',
    description: 'Who you are in Christ resources',
    color: '#FFD700',
    faithModeLabel: 'Identity in Christ',
    encouragementModeLabel: 'Self-Worth & Purpose',
    faithModeDescription: 'Resources about your identity and worth in Christ',
    encouragementModeDescription: 'Tools for building self-confidence and discovering your purpose',
    applicableToMode: 'both'
  },
  {
    id: 'business',
    name: 'Kingdom Business',
    icon: '💼',
    description: 'Faith-based business tools and templates',
    color: '#F59E0B',
    faithModeLabel: 'Kingdom Business',
    encouragementModeLabel: 'Professional Growth',
    faithModeDescription: 'Faith-based business resources, kingdom principles, and marketplace ministry',
    encouragementModeDescription: 'Professional development tools, business templates, and career growth resources',
    applicableToMode: 'both'
  },
  {
    id: 'creative',
    name: 'Creative Tools',
    icon: '🎨',
    description: 'Canva templates, CapCut resources',
    color: '#EC4899',
    faithModeLabel: 'Creative Ministry Tools',
    encouragementModeLabel: 'Creative Resources',
    faithModeDescription: 'Design templates for ministry, faith-based graphics, and worship resources',
    encouragementModeDescription: 'Creative templates, design tools, and inspirational graphics',
    applicableToMode: 'both'
  },
  {
    id: 'prophetic',
    name: 'Prophetic',
    icon: '🔮',
    description: 'Prophecy tools, dream interpretation',
    color: '#8B5CF6',
    faithModeLabel: 'Prophetic Ministry',
    encouragementModeLabel: 'Spiritual Insights',
    faithModeDescription: 'Prophetic ministry tools, dream interpretation, and hearing God\'s voice',
    encouragementModeDescription: 'Intuition development, spiritual discernment, and inner wisdom tools',
    applicableToMode: 'faith'
  },
  {
    id: 'worship',
    name: 'Worship',
    icon: '🎵',
    description: 'Worship resources, song lists',
    color: '#06B6D4',
    faithModeLabel: 'Worship Resources',
    encouragementModeLabel: 'Inspirational Music',
    faithModeDescription: 'Worship songs, praise resources, and music ministry tools',
    encouragementModeDescription: 'Uplifting music, inspirational playlists, and mood-boosting content',
    applicableToMode: 'both'
  }
];

// Mode configuration constants
export const MODE_CONFIGS: Record<AppMode, ModeConfig> = {
  faith: {
    mode: 'faith',
    branding: {
      primaryColor: '#DC2626',
      secondaryColor: '#FFD700',
      gradientColors: ['#DC2626', '#EF4444', '#FFD700'],
      logo: 'KingdomStudiosLogo',
      appName: 'Kingdom Studios'
    },
    messaging: {
      greeting: 'Blessing and peace in Christ!',
      tagline: 'Building His Kingdom Through Digital Ministry',
      communityName: 'Kingdom Community',
      testimoniesTitle: 'Testimony Wall',
      prayerTitle: 'Prayer Room'
    }
  },
  encouragement: {
    mode: 'encouragement',
    branding: {
      primaryColor: '#8B5CF6',
      secondaryColor: '#06B6D4',
      gradientColors: ['#8B5CF6', '#EC4899', '#06B6D4'],
      logo: 'KingdomStudiosLogo',
      appName: 'Kingdom Studios'
    },
    messaging: {
      greeting: 'Welcome to your journey of growth!',
      tagline: 'Empowering Creators for Positive Impact',
      communityName: 'Creator Community',
      testimoniesTitle: 'Success Stories',
      prayerTitle: 'Support Circle'
    }
  }
};

// Helper functions for dual-mode support
export const getModeConfig = (mode: AppMode): ModeConfig => MODE_CONFIGS[mode];

export const getCategoryForMode = (
  categories: (TestimonyCategory | PrayerCategory | ResourceCategory)[],
  mode: AppMode
) => {
  return categories.filter(cat => 
    cat.applicableToMode === 'both' || cat.applicableToMode === mode
  );
};

export const getModeLabelForCategory = (
  category: TestimonyCategory | PrayerCategory | ResourceCategory,
  mode: AppMode
): string => {
  return mode === 'faith' ? category.faithModeLabel : category.encouragementModeLabel;
};

export const getModeDescriptionForCategory = (
  category: TestimonyCategory | PrayerCategory | ResourceCategory,
  mode: AppMode
): string => {
  return mode === 'faith' ? category.faithModeDescription : category.encouragementModeDescription;
};

export default {
  TESTIMONY_CATEGORIES,
  PRAYER_CATEGORIES,
  RESOURCE_CATEGORIES,
  MODE_CONFIGS,
  getModeConfig,
  getCategoryForMode,
  getModeLabelForCategory,
  getModeDescriptionForCategory
};

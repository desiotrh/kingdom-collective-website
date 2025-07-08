import { Alert } from 'react-native';

// Kingdom Studios Utilities for All Modules
// Comprehensive utility functions to support the full app ecosystem

export interface ContentPlatform {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  features: string[];
}

export interface KingdomContent {
  type: 'scripture' | 'declaration' | 'inspiration' | 'wisdom';
  text: string;
  reference?: string;
  category: string;
}

export interface AnalyticsData {
  reach: number;
  engagement: number;
  clicks: number;
  conversions: number;
  period: 'day' | 'week' | 'month' | 'year';
}

// Platform Configuration
export const SUPPORTED_PLATFORMS: ContentPlatform[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '📸',
    connected: false,
    features: ['posts', 'stories', 'reels', 'igtv'],
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: '🎵',
    connected: false,
    features: ['videos', 'live'],
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: '📺',
    connected: false,
    features: ['videos', 'shorts', 'community'],
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: '👥',
    connected: false,
    features: ['posts', 'stories', 'reels', 'live'],
  },
  {
    id: 'twitter',
    name: 'Twitter/X',
    icon: '🐦',
    connected: false,
    features: ['tweets', 'threads', 'spaces'],
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    icon: '📌',
    connected: false,
    features: ['pins', 'boards', 'stories'],
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: '💼',
    connected: false,
    features: ['posts', 'articles', 'stories'],
  },
];

// Kingdom Content Library
export const KINGDOM_CONTENT: KingdomContent[] = [
  {
    type: 'scripture',
    text: "For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope.",
    reference: 'Jeremiah 29:11',
    category: 'hope',
  },
  {
    type: 'scripture',
    text: "And we know that for those who love God all things work together for good, for those who are called according to his purpose.",
    reference: 'Romans 8:28',
    category: 'purpose',
  },
  {
    type: 'declaration',
    text: "I am a Kingdom entrepreneur, building businesses that honor God and impact eternity.",
    category: 'business',
  },
  {
    type: 'declaration',
    text: "My content carries the power to transform lives and draw hearts closer to the King.",
    category: 'content creation',
  },
  {
    type: 'inspiration',
    text: "Every post, every product, every interaction is an opportunity to share His love.",
    category: 'purpose',
  },
  {
    type: 'wisdom',
    text: "Success in the Kingdom is measured not by profit alone, but by the souls touched and lives transformed.",
    category: 'success',
  },
];

// Content Generation Utilities
export const generateKingdomCaption = (
  topic: string,
  platform: string,
  faithMode: boolean = true
): string => {
  const kingdomPhrases = [
    "Kingdom impact starts with one bold step ✨",
    "Walking in divine purpose 👑",
    "Building for eternity, not just today 🏗️",
    "Faith over fear, always 🛡️",
    "Kingdom entrepreneurs changing the world 🌍",
  ];

  const encouragementPhrases = [
    "Believe in your dreams and take action ✨",
    "Your purpose is waiting for you 🌟",
    "Creating positive impact, one step at a time 🚀",
    "Courage over comfort 💪",
    "Entrepreneurs making a difference 🌍",
  ];

  const phrases = faithMode ? kingdomPhrases : encouragementPhrases;
  const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
  
  return `${topic}\n\n${randomPhrase}\n\n#${faithMode ? 'KingdomEntrepreneur' : 'PurposeDriven'} #ContentCreator #Inspiration`;
};

// Platform-specific hashtag suggestions
export const getPlatformHashtags = (platform: string, category: string): string[] => {
  const baseHashtags: { [key: string]: string[] } = {
    general: ['#ContentCreator', '#Entrepreneur', '#Inspiration', '#Growth'],
    faith: ['#FaithJourney', '#KingdomMindset', '#PurposeDriven', '#FaithOverFear'],
    business: ['#SmallBusiness', '#OnlineBusiness', '#Hustle', '#Success'],
    lifestyle: ['#Lifestyle', '#Motivation', '#Mindset', '#Wellness'],
  };

  const platformSpecific: { [key: string]: string[] } = {
    instagram: ['#IGReels', '#InstaGood', '#IGDaily'],
    tiktok: ['#TikTokMade', '#FYP', '#Viral'],
    youtube: ['#YouTubeShorts', '#Subscribe', '#NewVideo'],
    facebook: ['#FacebookPost', '#Community', '#Share'],
    twitter: ['#Twitter', '#ThreadThat', '#Engage'],
    pinterest: ['#PinterestFind', '#SavePost', '#Pinspiration'],
    linkedin: ['#LinkedIn', '#Professional', '#NetworkGrowth'],
  };

  return [
    ...(baseHashtags[category] || baseHashtags.general),
    ...(platformSpecific[platform] || []),
  ];
};

// Time optimization utilities
export const getOptimalPostingTimes = (platform: string): { day: string; times: string[] }[] => {
  const schedules: { [key: string]: { day: string; times: string[] }[] } = {
    instagram: [
      { day: 'Monday', times: ['6:00 AM', '7:00 PM'] },
      { day: 'Tuesday', times: ['5:00 AM', '6:00 PM'] },
      { day: 'Wednesday', times: ['6:00 AM', '7:00 PM'] },
      { day: 'Thursday', times: ['5:00 AM', '8:00 PM'] },
      { day: 'Friday', times: ['5:00 AM', '7:00 PM'] },
      { day: 'Saturday', times: ['11:00 AM', '7:00 PM'] },
      { day: 'Sunday', times: ['7:00 AM', '4:00 PM'] },
    ],
    tiktok: [
      { day: 'Monday', times: ['6:00 AM', '10:00 AM', '7:00 PM'] },
      { day: 'Tuesday', times: ['2:00 AM', '4:00 AM', '9:00 AM'] },
      { day: 'Wednesday', times: ['7:00 AM', '8:00 AM', '11:00 AM'] },
      { day: 'Thursday', times: ['9:00 AM', '12:00 PM', '7:00 PM'] },
      { day: 'Friday', times: ['5:00 AM', '1:00 PM', '3:00 PM'] },
      { day: 'Saturday', times: ['11:00 AM', '7:00 PM', '8:00 PM'] },
      { day: 'Sunday', times: ['7:00 AM', '8:00 AM', '4:00 PM'] },
    ],
    default: [
      { day: 'Monday', times: ['9:00 AM', '6:00 PM'] },
      { day: 'Tuesday', times: ['9:00 AM', '6:00 PM'] },
      { day: 'Wednesday', times: ['9:00 AM', '6:00 PM'] },
      { day: 'Thursday', times: ['9:00 AM', '6:00 PM'] },
      { day: 'Friday', times: ['9:00 AM', '5:00 PM'] },
      { day: 'Saturday', times: ['10:00 AM', '2:00 PM'] },
      { day: 'Sunday', times: ['10:00 AM', '7:00 PM'] },
    ],
  };

  return schedules[platform] || schedules.default;
};

// Product sync utilities
export const ECOMMERCE_PLATFORMS = [
  { id: 'shopify', name: 'Shopify', icon: '🛍️', apiEndpoint: 'shopify.com/api' },
  { id: 'etsy', name: 'Etsy', icon: '🎨', apiEndpoint: 'openapi.etsy.com' },
  { id: 'amazon', name: 'Amazon', icon: '📦', apiEndpoint: 'sellingpartnerapi.amazon.com' },
  { id: 'printify', name: 'Printify', icon: '👕', apiEndpoint: 'api.printify.com' },
  { id: 'gumroad', name: 'Gumroad', icon: '💾', apiEndpoint: 'api.gumroad.com' },
  { id: 'square', name: 'Square', icon: '💳', apiEndpoint: 'connect.squareup.com' },
];

// Analytics utilities
export const calculateEngagementRate = (engagement: number, reach: number): number => {
  if (reach === 0) return 0;
  return Math.round((engagement / reach) * 100 * 100) / 100; // Round to 2 decimal places
};

export const formatAnalyticsNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const getAnalyticsTrend = (current: number, previous: number): 'up' | 'down' | 'neutral' => {
  if (current > previous) return 'up';
  if (current < previous) return 'down';
  return 'neutral';
};

// Course utilities
export const validateCourseModule = (module: any): boolean => {
  return !!(module.title && module.title.trim().length > 0);
};

export const calculateCourseProgress = (completedModules: number, totalModules: number): number => {
  if (totalModules === 0) return 0;
  return Math.round((completedModules / totalModules) * 100);
};

// Funnel builder utilities
export const FUNNEL_TEMPLATES = [
  {
    id: 'lead-magnet',
    name: 'Lead Magnet Funnel',
    description: 'Capture emails with valuable free content',
    steps: ['Landing Page', 'Thank You Page', 'Email Sequence'],
  },
  {
    id: 'product-launch',
    name: 'Product Launch Funnel',
    description: 'Build anticipation and drive sales',
    steps: ['Pre-launch', 'Launch', 'Post-launch'],
  },
  {
    id: 'webinar',
    name: 'Webinar Funnel',
    description: 'Generate leads through educational content',
    steps: ['Registration', 'Webinar', 'Offer', 'Follow-up'],
  },
];

// Photo/Video editor utilities
export const PHOTO_FILTERS = [
  { id: 'kingdom', name: 'Kingdom', description: 'Royal purple and gold tones' },
  { id: 'faith', name: 'Faith', description: 'Warm, inspiring colors' },
  { id: 'vintage', name: 'Vintage', description: 'Classic, timeless look' },
  { id: 'bright', name: 'Bright', description: 'High contrast and vibrancy' },
  { id: 'soft', name: 'Soft', description: 'Gentle, muted tones' },
];

export const VIDEO_TRANSITIONS = [
  { id: 'fade', name: 'Fade', description: 'Smooth fade transition' },
  { id: 'slide', name: 'Slide', description: 'Sliding movement' },
  { id: 'zoom', name: 'Zoom', description: 'Zoom in/out effect' },
  { id: 'kingdom', name: 'Kingdom Impact', description: 'Royal-themed transition' },
];

// Notification utilities
export const schedulePostReminder = (scheduledTime: Date): void => {
  // This would integrate with a notification service
  console.log(`Scheduled reminder for ${scheduledTime}`);
};

export const showSuccessToast = (message: string): void => {
  Alert.alert('Success', message);
};

export const showErrorToast = (message: string): void => {
  Alert.alert('Error', message);
};

// Export formats
export const EXPORT_FORMATS = {
  image: ['PNG', 'JPG', 'WebP'],
  video: ['MP4', 'MOV', 'WebM'],
  document: ['PDF', 'DOCX'],
};

// Faith mode content modifier
export const applyFaithMode = (content: string, faithMode: boolean): string => {
  if (!faithMode) {
    return content
      .replace(/Kingdom/g, 'Purpose-driven')
      .replace(/divine/g, 'inspired')
      .replace(/blessed/g, 'grateful')
      .replace(/pray/g, 'reflect')
      .replace(/Scripture/g, 'wisdom');
  }
  return content;
};

// General utility functions
export const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Color utilities for custom themes
export const generateColorVariations = (baseColor: string) => {
  // This would generate lighter/darker variations of a color
  return {
    light: baseColor + '40',
    base: baseColor,
    dark: baseColor + 'CC',
  };
};

// Performance tracking
export const trackUserAction = (action: string, metadata?: any): void => {
  // This would send analytics data to tracking service
  console.log(`Action: ${action}`, metadata);
};

export default {
  generateKingdomCaption,
  getPlatformHashtags,
  getOptimalPostingTimes,
  calculateEngagementRate,
  formatAnalyticsNumber,
  getAnalyticsTrend,
  validateCourseModule,
  calculateCourseProgress,
  schedulePostReminder,
  showSuccessToast,
  showErrorToast,
  applyFaithMode,
  generateUniqueId,
  formatDate,
  truncateText,
  validateEmail,
  validateUrl,
  trackUserAction,
};

export interface PodcastEpisode {
  id: string;
  title: string;
  faithModeTitle?: string;
  encouragementModeTitle?: string;
  description: string;
  audioUrl?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration: number; // in seconds
  publishedDate: string;
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  category: string;
  tags: string[];
  showNotes?: string;
  transcript?: string;
  guestName?: string;
  guestBio?: string;
  seasonNumber?: number;
  episodeNumber: number;
  downloads: number;
  rating: number;
  reviews: PodcastReview[];
  mood: 'faith' | 'encouragement';
  monetization?: {
    sponsorships: PodcastSponsorship[];
    donations: boolean;
    premiumContent: boolean;
  };
}

export interface PodcastReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface PodcastSponsorship {
  id: string;
  sponsorName: string;
  sponsorLogo?: string;
  adScript: string;
  placement: 'pre-roll' | 'mid-roll' | 'post-roll';
  duration: number;
  amount: number;
  startDate: string;
  endDate: string;
}

export interface VideoShort {
  id: string;
  title: string;
  faithModeTitle?: string;
  encouragementModeTitle?: string;
  description: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration: number; // in seconds (max 60 for most platforms)
  createdDate: string;
  publishedDate?: string;
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  platforms: ShortPlatform[];
  hashtags: string[];
  captions?: string;
  sourceType: 'original' | 'podcast-clip' | 'testimony' | 'teaching';
  sourceId?: string; // ID of source content if clipped from another piece
  mood: 'faith' | 'encouragement';
  analytics: {
    views: number;
    likes: number;
    shares: number;
    comments: number;
    engagement: number;
  };
}

export interface ShortPlatform {
  platform: 'tiktok' | 'instagram-reels' | 'youtube-shorts' | 'facebook-reels' | 'twitter';
  published: boolean;
  publishedDate?: string;
  postId?: string;
  url?: string;
  analytics: {
    views: number;
    likes: number;
    shares: number;
    comments: number;
  };
}

export interface PodcastShow {
  id: string;
  name: string;
  faithModeName?: string;
  encouragementModeName?: string;
  description: string;
  coverArt: string;
  category: string;
  language: string;
  author: string;
  email: string;
  website?: string;
  rssUrl?: string;
  episodes: PodcastEpisode[];
  subscribers: number;
  totalDownloads: number;
  rating: number;
  mood: 'faith' | 'encouragement' | 'both';
  distribution: {
    apple: boolean;
    spotify: boolean;
    google: boolean;
    amazon: boolean;
    custom: CustomDistribution[];
  };
}

export interface CustomDistribution {
  platform: string;
  url: string;
  enabled: boolean;
}

export interface ContentClip {
  id: string;
  sourceId: string;
  sourceType: 'podcast' | 'video' | 'live-stream';
  title: string;
  startTime: number; // in seconds
  endTime: number; // in seconds
  duration: number; // in seconds
  description?: string;
  thumbnailUrl?: string;
  status: 'pending' | 'processing' | 'ready' | 'published';
  platforms: ShortPlatform[];
  mood: 'faith' | 'encouragement';
}

export interface AudioProcessing {
  id: string;
  sourceUrl: string;
  targetFormats: AudioFormat[];
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  outputUrls: Record<string, string>;
  enhancementOptions: {
    noiseReduction: boolean;
    levelingNormalization: boolean;
    eqBoost: boolean;
    compression: boolean;
  };
}

export interface VideoProcessing {
  id: string;
  sourceUrl: string;
  targetFormats: VideoFormat[];
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  outputUrls: Record<string, string>;
  enhancementOptions: {
    qualityUpscaling: boolean;
    stabilization: boolean;
    colorCorrection: boolean;
    audioEnhancement: boolean;
  };
}

export interface AudioFormat {
  format: 'mp3' | 'wav' | 'aac' | 'm4a';
  bitrate: number;
  sampleRate: number;
}

export interface VideoFormat {
  format: 'mp4' | 'mov' | 'webm';
  resolution: '720p' | '1080p' | '4K';
  framerate: number;
  bitrate: number;
}

export interface LiveStream {
  id: string;
  title: string;
  faithModeTitle?: string;
  encouragementModeTitle?: string;
  description: string;
  scheduledDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';
  platforms: LivePlatform[];
  streamKey?: string;
  rtmpUrl?: string;
  thumbnailUrl?: string;
  maxViewers: number;
  totalViews: number;
  chatEnabled: boolean;
  recordingEnabled: boolean;
  recordingUrl?: string;
  mood: 'faith' | 'encouragement';
  clips: ContentClip[];
}

export interface LivePlatform {
  platform: 'youtube' | 'facebook' | 'instagram' | 'tiktok' | 'twitch';
  enabled: boolean;
  streamUrl?: string;
  viewers: number;
  chatMessages: LiveChatMessage[];
}

export interface LiveChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
  highlighted: boolean;
  moderatorAction?: 'none' | 'timeout' | 'ban';
}

export interface ContentCalendar {
  id: string;
  date: string;
  contentType: 'podcast' | 'short' | 'live-stream' | 'post';
  contentId: string;
  title: string;
  platforms: string[];
  status: 'planned' | 'scheduled' | 'published' | 'cancelled';
  notes?: string;
  mood: 'faith' | 'encouragement';
}

export interface ContentTemplate {
  id: string;
  name: string;
  type: 'podcast-episode' | 'video-short' | 'live-stream';
  category: string;
  template: {
    titleFormat: string;
    descriptionFormat: string;
    hashtagSuggestions: string[];
    thumbnailTemplate?: string;
    durationRecommendation?: number;
  };
  mood: 'faith' | 'encouragement' | 'both';
}

export interface PodcastAnalytics {
  episodeId: string;
  period: string;
  metrics: {
    downloads: number;
    uniqueListeners: number;
    averageListenTime: number;
    completionRate: number;
    subscribersGained: number;
    reviews: number;
    shares: number;
  };
  demographics: {
    ageGroups: Record<string, number>;
    locations: Record<string, number>;
    devices: Record<string, number>;
    platforms: Record<string, number>;
  };
  engagement: {
    dropOffPoints: Array<{ time: number; percentage: number }>;
    replaySegments: Array<{ start: number; end: number; replays: number }>;
    skipSegments: Array<{ start: number; end: number; skips: number }>;
  };
}

export interface ShortsAnalytics {
  shortId: string;
  period: string;
  platformAnalytics: Record<string, {
    views: number;
    likes: number;
    shares: number;
    comments: number;
    saves: number;
    engagement: number;
    reach: number;
    impressions: number;
  }>;
  demographics: {
    ageGroups: Record<string, number>;
    gender: Record<string, number>;
    locations: Record<string, number>;
  };
  performance: {
    peakViewingTime: string;
    averageWatchTime: number;
    watchTimePercentage: number;
    viralityScore: number;
  };
}

export interface ContentDistribution {
  id: string;
  contentId: string;
  contentType: 'podcast' | 'short' | 'live-stream';
  platforms: DistributionPlatform[];
  scheduledDate?: string;
  status: 'pending' | 'distributing' | 'completed' | 'failed';
  progress: number;
  errors: DistributionError[];
}

export interface DistributionPlatform {
  platform: string;
  enabled: boolean;
  credentials: {
    apiKey?: string;
    accessToken?: string;
    refreshToken?: string;
    channelId?: string;
  };
  customization: {
    title?: string;
    description?: string;
    hashtags?: string[];
    thumbnail?: string;
    category?: string;
  };
  status: 'pending' | 'uploading' | 'processing' | 'published' | 'failed';
  publishedUrl?: string;
  error?: string;
}

export interface DistributionError {
  platform: string;
  error: string;
  timestamp: string;
  retryable: boolean;
}

export interface AIContentSuggestion {
  id: string;
  type: 'podcast-topic' | 'short-idea' | 'clip-suggestion' | 'title-improvement';
  title: string;
  description: string;
  reasoning: string;
  confidence: number;
  category: string;
  mood: 'faith' | 'encouragement';
  metadata?: Record<string, any>;
  implemented: boolean;
  feedback?: 'helpful' | 'not-helpful' | 'irrelevant';
}

/**
 * 🎤 KINGDOM VOICE - UNIFIED API SERVICE
 * Replaces individual API services with the unified API client
 * 
 * This service provides all Kingdom Voice functionality through the unified API:
 * - Audio recording and transcription
 * - Journal entries and devotionals
 * - Book planning and content generation
 * - Dream tracking and spiritual insights
 * - Podcast and video recording
 * - Social media management
 * - AI enhancements and faith-based features
 */

import { apiClients } from '@kingdom-collective/api';

// ================================
// 🎤 KINGDOM VOICE API SERVICE
// ================================

export interface VoiceEntry {
  id: string;
  title: string;
  content: string;
  audioUrl?: string;
  transcription?: string;
  duration: number;
  faithMode: boolean;
  tags: string[];
  category: 'journal' | 'prayer' | 'testimony' | 'devotional' | 'dream' | 'declaration';
  dateCreated: string;
  lastModified: string;
  isPublic: boolean;
  metadata?: Record<string, any>;
}

export interface JournalEntry extends VoiceEntry {
  mood?: string;
  gratitude?: string[];
  prayerRequests?: string[];
  scriptureReferences?: string[];
}

export interface DevotionalEntry extends VoiceEntry {
  scripture?: string;
  reflection?: string;
  application?: string;
  prayer?: string;
}

export interface DreamEntry extends VoiceEntry {
  dreamType: 'prophetic' | 'revelation' | 'warning' | 'encouragement' | 'guidance';
  interpretation?: string;
  symbols?: string[];
  emotions?: string[];
  actionItems?: string[];
}

export interface DeclarationEntry extends VoiceEntry {
  declarationType: 'faith' | 'purpose' | 'identity' | 'blessing' | 'victory';
  scripture?: string;
  affirmations?: string[];
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
}

export interface BookPlannerEntry extends VoiceEntry {
  bookTitle: string;
  chapter: number;
  verse?: number;
  outline?: string;
  notes?: string;
  targetAudience?: string;
  genre?: string;
}

export interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  duration: number;
  transcript?: string;
  showNotes?: string;
  tags: string[];
  isPublished: boolean;
  publishDate?: string;
  episodeNumber?: number;
  seasonNumber?: number;
}

export interface VideoPodcast {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number;
  transcript?: string;
  showNotes?: string;
  tags: string[];
  isPublished: boolean;
  publishDate?: string;
  episodeNumber?: number;
  seasonNumber?: number;
}

export interface RecordingSession {
  id: string;
  title: string;
  type: 'audio' | 'video' | 'podcast';
  status: 'recording' | 'paused' | 'stopped' | 'processing' | 'completed';
  duration: number;
  fileUrl?: string;
  thumbnailUrl?: string;
  transcript?: string;
  metadata?: Record<string, any>;
  dateCreated: string;
}

export class KingdomVoiceApiService {
  private static instance: KingdomVoiceApiService;
  private api = apiClients.voice;

  private constructor() {}

  static getInstance(): KingdomVoiceApiService {
    if (!KingdomVoiceApiService.instance) {
      KingdomVoiceApiService.instance = new KingdomVoiceApiService();
    }
    return KingdomVoiceApiService.instance;
  }

  // ================================
  // 🎙️ AUDIO RECORDING & TRANSCRIPTION
  // ================================

  /**
   * Start audio recording
   */
  async startRecording(): Promise<{ recordingId: string; status: string }> {
    const response = await this.api.startRecording();

    if (!response.success) {
      throw new Error(response.error || 'Failed to start recording');
    }

    return response.data;
  }

  /**
   * Stop audio recording
   */
  async stopRecording(recordingId: string): Promise<{ recordingId: string; audioUrl: string }> {
    const response = await this.api.stopRecording(recordingId);

    if (!response.success) {
      throw new Error(response.error || 'Failed to stop recording');
    }

    return response.data;
  }

  /**
   * Transcribe audio file
   */
  async transcribeAudio(
    audioFile: any,
    language: string = 'en',
    options?: {
      faithMode?: boolean;
      includeTimestamps?: boolean;
      speakerIdentification?: boolean;
    }
  ): Promise<{
    transcriptionId: string;
    text: string;
    confidence: number;
    timestamps?: Array<{ start: number; end: number; text: string }>;
    speakers?: Array<{ id: number; name: string; segments: Array<{ start: number; end: number; text: string }> }>;
  }> {
    const response = await this.api.transcribeAudio(audioFile, language, options);

    if (!response.success) {
      throw new Error(response.error || 'Failed to transcribe audio');
    }

    return response.data;
  }

  /**
   * Analyze audio content for spiritual insights
   */
  async analyzeAudio(
    audioFile: any,
    analysisType: 'emotion' | 'sentiment' | 'spiritual' | 'prayer' = 'spiritual'
  ): Promise<{
    analysisId: string;
    insights: string[];
    emotions: string[];
    prayerPoints: string[];
    scriptureSuggestions: string[];
    confidence: number;
  }> {
    const response = await this.api.analyzeAudio(audioFile, analysisType);

    if (!response.success) {
      throw new Error(response.error || 'Failed to analyze audio');
    }

    return response.data;
  }

  // ================================
  // 📝 JOURNAL ENTRIES
  // ================================

  /**
   * Save journal entry
   */
  async saveJournalEntry(entry: JournalEntry): Promise<{ id: string }> {
    const response = await this.api.saveJournalEntry(entry);

    if (!response.success) {
      throw new Error(response.error || 'Failed to save journal entry');
    }

    return response.data;
  }

  /**
   * Get journal entries
   */
  async getJournalEntries(
    page: number = 1,
    limit: number = 20,
    filters?: {
      category?: string;
      dateRange?: { start: string; end: string };
      tags?: string[];
      mood?: string;
    }
  ): Promise<{
    entries: JournalEntry[];
    total: number;
    pages: number;
  }> {
    const response = await this.api.getJournalEntries(page, limit, filters);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get journal entries');
    }

    return response.data;
  }

  /**
   * Update journal entry
   */
  async updateJournalEntry(entryId: string, updates: Partial<JournalEntry>): Promise<JournalEntry> {
    const response = await this.api.updateJournalEntry(entryId, updates);

    if (!response.success) {
      throw new Error(response.error || 'Failed to update journal entry');
    }

    return response.data;
  }

  /**
   * Delete journal entry
   */
  async deleteJournalEntry(entryId: string): Promise<void> {
    const response = await this.api.deleteJournalEntry(entryId);

    if (!response.success) {
      throw new Error(response.error || 'Failed to delete journal entry');
    }
  }

  // ================================
  // 🙏 PRAYER & DEVOTIONAL FEATURES
  // ================================

  /**
   * Save prayer entry
   */
  async savePrayerEntry(entry: VoiceEntry): Promise<{ id: string }> {
    const response = await this.api.savePrayerEntry(entry);

    if (!response.success) {
      throw new Error(response.error || 'Failed to save prayer entry');
    }

    return response.data;
  }

  /**
   * Generate devotional content
   */
  async generateDevotional(
    topic: string,
    scripture?: string,
    style: 'reflection' | 'application' | 'prayer' = 'reflection'
  ): Promise<{
    devotional: DevotionalEntry;
    relatedScriptures: string[];
    prayerPoints: string[];
  }> {
    const response = await this.api.generateDevotional(topic, scripture, style);

    if (!response.success) {
      throw new Error(response.error || 'Failed to generate devotional');
    }

    return response.data;
  }

  /**
   * Export devotional content
   */
  async exportDevotional(
    devotionalId: string,
    format: 'pdf' | 'docx' | 'txt' | 'html' = 'pdf'
  ): Promise<{ downloadUrl: string; format: string }> {
    const response = await this.api.exportDevotional(devotionalId, format);

    if (!response.success) {
      throw new Error(response.error || 'Failed to export devotional');
    }

    return response.data;
  }

  // ================================
  // 📚 BOOK PLANNING
  // ================================

  /**
   * Save book planner entry
   */
  async saveBookPlannerEntry(entry: BookPlannerEntry): Promise<{ id: string }> {
    const response = await this.api.saveBookPlannerEntry(entry);

    if (!response.success) {
      throw new Error(response.error || 'Failed to save book planner entry');
    }

    return response.data;
  }

  /**
   * Get book planner entries
   */
  async getBookPlannerEntries(
    bookTitle?: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    entries: BookPlannerEntry[];
    total: number;
    pages: number;
  }> {
    const response = await this.api.getBookPlannerEntries(bookTitle, page, limit);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get book planner entries');
    }

    return response.data;
  }

  /**
   * Generate book outline
   */
  async generateBookOutline(
    bookTitle: string,
    genre: string,
    targetAudience: string,
    keyThemes: string[]
  ): Promise<{
    outline: string;
    chapters: Array<{
      title: string;
      summary: string;
      keyPoints: string[];
    }>;
    estimatedWordCount: number;
  }> {
    const response = await this.api.generateBookOutline(bookTitle, genre, targetAudience, keyThemes);

    if (!response.success) {
      throw new Error(response.error || 'Failed to generate book outline');
    }

    return response.data;
  }

  // ================================
  // 💭 DREAM TRACKING
  // ================================

  /**
   * Save dream entry
   */
  async saveDreamEntry(entry: DreamEntry): Promise<{ id: string }> {
    const response = await this.api.saveDreamEntry(entry);

    if (!response.success) {
      throw new Error(response.error || 'Failed to save dream entry');
    }

    return response.data;
  }

  /**
   * Get dream entries
   */
  async getDreamEntries(
    page: number = 1,
    limit: number = 20,
    filters?: {
      dreamType?: string;
      dateRange?: { start: string; end: string };
      symbols?: string[];
    }
  ): Promise<{
    entries: DreamEntry[];
    total: number;
    pages: number;
  }> {
    const response = await this.api.getDreamEntries(page, limit, filters);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get dream entries');
    }

    return response.data;
  }

  /**
   * Interpret dream
   */
  async interpretDream(
    dreamDescription: string,
    dreamType: DreamEntry['dreamType'],
    emotions: string[]
  ): Promise<{
    interpretation: string;
    symbols: string[];
    spiritualInsights: string[];
    actionItems: string[];
    relatedScriptures: string[];
  }> {
    const response = await this.api.interpretDream(dreamDescription, dreamType, emotions);

    if (!response.success) {
      throw new Error(response.error || 'Failed to interpret dream');
    }

    return response.data;
  }

  // ================================
  // 🗣️ DECLARATIONS
  // ================================

  /**
   * Save declaration entry
   */
  async saveDeclarationEntry(entry: DeclarationEntry): Promise<{ id: string }> {
    const response = await this.api.saveDeclarationEntry(entry);

    if (!response.success) {
      throw new Error(response.error || 'Failed to save declaration entry');
    }

    return response.data;
  }

  /**
   * Get declaration entries
   */
  async getDeclarationEntries(
    page: number = 1,
    limit: number = 20,
    filters?: {
      declarationType?: string;
      frequency?: string;
    }
  ): Promise<{
    entries: DeclarationEntry[];
    total: number;
    pages: number;
  }> {
    const response = await this.api.getDeclarationEntries(page, limit, filters);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get declaration entries');
    }

    return response.data;
  }

  /**
   * Generate declaration
   */
  async generateDeclaration(
    topic: string,
    declarationType: DeclarationEntry['declarationType'],
    scripture?: string
  ): Promise<{
    declaration: string;
    affirmations: string[];
    relatedScriptures: string[];
  }> {
    const response = await this.api.generateDeclaration(topic, declarationType, scripture);

    if (!response.success) {
      throw new Error(response.error || 'Failed to generate declaration');
    }

    return response.data;
  }

  // ================================
  // 🎙️ PODCAST & VIDEO FEATURES
  // ================================

  /**
   * Save podcast episode
   */
  async savePodcastEpisode(episode: PodcastEpisode): Promise<{ id: string }> {
    const response = await this.api.savePodcastEpisode(episode);

    if (!response.success) {
      throw new Error(response.error || 'Failed to save podcast episode');
    }

    return response.data;
  }

  /**
   * Get podcast episodes
   */
  async getPodcastEpisodes(
    page: number = 1,
    limit: number = 20,
    filters?: {
      isPublished?: boolean;
      seasonNumber?: number;
    }
  ): Promise<{
    episodes: PodcastEpisode[];
    total: number;
    pages: number;
  }> {
    const response = await this.api.getPodcastEpisodes(page, limit, filters);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get podcast episodes');
    }

    return response.data;
  }

  /**
   * Save video podcast
   */
  async saveVideoPodcast(video: VideoPodcast): Promise<{ id: string }> {
    const response = await this.api.saveVideoPodcast(video);

    if (!response.success) {
      throw new Error(response.error || 'Failed to save video podcast');
    }

    return response.data;
  }

  /**
   * Get video podcasts
   */
  async getVideoPodcasts(
    page: number = 1,
    limit: number = 20,
    filters?: {
      isPublished?: boolean;
      seasonNumber?: number;
    }
  ): Promise<{
    videos: VideoPodcast[];
    total: number;
    pages: number;
  }> {
    const response = await this.api.getVideoPodcasts(page, limit, filters);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get video podcasts');
    }

    return response.data;
  }

  // ================================
  // 📱 SOCIAL MEDIA MANAGEMENT
  // ================================

  /**
   * Share content to social media
   */
  async shareToSocialMedia(
    contentId: string,
    platforms: string[],
    message?: string,
    scheduledTime?: string
  ): Promise<{
    success: boolean;
    platformResults: Record<string, any>;
  }> {
    const response = await this.api.shareToSocialMedia(contentId, platforms, message, scheduledTime);

    if (!response.success) {
      throw new Error(response.error || 'Failed to share to social media');
    }

    return response.data;
  }

  /**
   * Get social media analytics
   */
  async getSocialMediaAnalytics(
    timeframe: '7d' | '30d' | '90d' = '30d'
  ): Promise<{
    totalPosts: number;
    totalEngagement: number;
    platformBreakdown: Record<string, {
      posts: number;
      engagement: number;
      followers: number;
    }>;
  }> {
    const response = await this.api.getSocialMediaAnalytics(timeframe);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get social media analytics');
    }

    return response.data;
  }

  // ================================
  // 🤖 AI ENHANCEMENTS
  // ================================

  /**
   * Enhance content with AI
   */
  async enhanceContent(
    content: string,
    enhancementType: 'grammar' | 'tone' | 'clarity' | 'faith' | 'engagement'
  ): Promise<{
    enhancedContent: string;
    suggestions: string[];
    improvements: string[];
  }> {
    const response = await this.api.enhanceContent(content, enhancementType);

    if (!response.success) {
      throw new Error(response.error || 'Failed to enhance content');
    }

    return response.data;
  }

  /**
   * Generate hashtags
   */
  async generateHashtags(
    content: string,
    platform: 'instagram' | 'twitter' | 'tiktok' = 'instagram'
  ): Promise<{
    hashtags: string[];
    trending: string[];
    faithBased: string[];
  }> {
    const response = await this.api.generateHashtags(content, platform);

    if (!response.success) {
      throw new Error(response.error || 'Failed to generate hashtags');
    }

    return response.data;
  }

  // ================================
  // 📊 ANALYTICS & TRACKING
  // ================================

  /**
   * Track content engagement
   */
  async trackEngagement(
    contentId: string,
    action: 'view' | 'like' | 'share' | 'comment' | 'save'
  ): Promise<void> {
    const response = await this.api.trackEngagement(contentId, action);

    if (!response.success) {
      console.warn('Failed to track engagement:', response.error);
    }
  }

  /**
   * Get content analytics
   */
  async getContentAnalytics(
    contentId: string,
    timeframe: '7d' | '30d' | '90d' = '30d'
  ): Promise<{
    views: number;
    likes: number;
    shares: number;
    comments: number;
    engagementRate: number;
    reach: number;
  }> {
    const response = await this.api.getContentAnalytics(contentId, timeframe);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get content analytics');
    }

    return response.data;
  }

  // ================================
  // 🛠️ UTILITY METHODS
  // ================================

  /**
   * Clear cache
   */
  clearCache(): void {
    this.api.clearCache();
  }

  /**
   * Get API statistics
   */
  async getApiStats(): Promise<any> {
    const response = await this.api.getApiStats();

    if (!response.success) {
      throw new Error(response.error || 'Failed to get API stats');
    }

    return response.data;
  }

  /**
   * Delete user account
   */
  async deleteUser(): Promise<{ success: boolean; message: string }> {
    const response = await this.api.deleteUser();

    if (!response.success) {
      throw new Error(response.error || 'Failed to delete user account');
    }

    return response.data;
  }
}

// Export singleton instance
export const kingdomVoiceApi = KingdomVoiceApiService.getInstance(); 
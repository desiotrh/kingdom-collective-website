/**
 * 🏛️ KINGDOM COLLECTIVE - APP-SPECIFIC API CLIENTS
 * Each app extends the shared client with its own functionality
 */

import { SharedApiClient, API_ENDPOINTS, ApiResponse } from './sharedApiClient';

// ================================
// 🎬 KINGDOM CLIPS API CLIENT
// ================================

export class KingdomClipsApiClient extends SharedApiClient {
  constructor() {
    super();
  }

  protected getAppName(): string {
    return 'kingdom-clips';
  }

  protected getAppVersion(): string {
    return '1.0.0';
  }

  // Video Processing
  async uploadVideo(file: any, onProgress?: (progress: number) => void): Promise<ApiResponse> {
    return this.uploadFile(API_ENDPOINTS.CLIPS.UPLOAD, file, onProgress);
  }

  async processVideo(videoId: string, options: {
    trim?: { start: number; end: number };
    filters?: string[];
    effects?: string[];
    captions?: boolean;
  }): Promise<ApiResponse> {
    return this.post(API_ENDPOINTS.CLIPS.PROCESS, {
      videoId,
      options,
    });
  }

  async enhanceVideo(videoId: string, enhancementType: 'ai' | 'manual'): Promise<ApiResponse> {
    return this.post(API_ENDPOINTS.CLIPS.ENHANCE, {
      videoId,
      enhancementType,
    });
  }

  async exportVideo(videoId: string, format: 'mp4' | 'mov' | 'gif', quality: 'low' | 'medium' | 'high'): Promise<ApiResponse> {
    return this.post(API_ENDPOINTS.CLIPS.EXPORT, {
      videoId,
      format,
      quality,
    });
  }

  async getVideoHistory(page: number = 1, limit: number = 20): Promise<ApiResponse> {
    return this.get(API_ENDPOINTS.CLIPS.HISTORY, { page, limit });
  }

  async getVideoAnalytics(videoId: string): Promise<ApiResponse> {
    return this.get(`${API_ENDPOINTS.CLIPS.ANALYTICS}/${videoId}`);
  }
}

// ================================
// 🎤 KINGDOM VOICE API CLIENT
// ================================

export class KingdomVoiceApiClient extends SharedApiClient {
  constructor() {
    super();
  }

  protected getAppName(): string {
    return 'kingdom-voice';
  }

  protected getAppVersion(): string {
    return '1.0.0';
  }

  // Voice Recording
  async startRecording(): Promise<ApiResponse> {
    return this.post(API_ENDPOINTS.VOICE.RECORD, { action: 'start' });
  }

  async stopRecording(recordingId: string): Promise<ApiResponse> {
    return this.post(API_ENDPOINTS.VOICE.RECORD, { 
      action: 'stop',
      recordingId,
    });
  }

  // Transcription
  async transcribeAudio(audioFile: any, language: string = 'en'): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('audio', audioFile);
    formData.append('language', language);
    
    return this.post(API_ENDPOINTS.VOICE.TRANSCRIBE, formData);
  }

  // AI Analysis
  async analyzeVoice(audioId: string, analysisType: 'emotion' | 'sentiment' | 'prayer'): Promise<ApiResponse> {
    return this.post(API_ENDPOINTS.VOICE.ANALYZE, {
      audioId,
      analysisType,
    });
  }

  // Journaling
  async saveJournalEntry(entry: {
    title: string;
    content: string;
    mood?: string;
    tags?: string[];
    isPrivate?: boolean;
  }): Promise<ApiResponse> {
    return this.post(API_ENDPOINTS.VOICE.JOURNAL, entry);
  }

  async getJournalEntries(page: number = 1, limit: number = 20): Promise<ApiResponse> {
    return this.get(API_ENDPOINTS.VOICE.JOURNAL, { page, limit });
  }

  // Prayer Requests
  async createPrayerRequest(request: {
    title: string;
    description: string;
    isAnonymous?: boolean;
    category?: string;
  }): Promise<ApiResponse> {
    return this.post(API_ENDPOINTS.VOICE.PRAYER, request);
  }

  async getPrayerRequests(page: number = 1, limit: number = 20): Promise<ApiResponse> {
    return this.get(API_ENDPOINTS.VOICE.PRAYER, { page, limit });
  }

  // Export
  async exportJournal(format: 'pdf' | 'docx' | 'txt', dateRange?: { start: string; end: string }): Promise<ApiResponse> {
    return this.post(API_ENDPOINTS.VOICE.EXPORT, {
      format,
      dateRange,
    });
  }
}

// ================================
// 🚀 KINGDOM LAUNCHPAD API CLIENT
// ================================

export class KingdomLaunchpadApiClient extends SharedApiClient {
  constructor() {
    super();
  }

  protected getAppName(): string {
    return 'kingdom-launchpad';
  }

  protected getAppVersion(): string {
    return '1.0.0';
  }

  // Product Management
  async createProduct(product: {
    name: string;
    description: string;
    price: number;
    category: string;
    platform: 'etsy' | 'shopify' | 'printify' | 'custom';
    images?: string[];
  }): Promise<ApiResponse> {
    return this.post(API_ENDPOINTS.PRODUCTS.CREATE, product);
  }

  async getProducts(page: number = 1, limit: number = 20, filters?: any): Promise<ApiResponse> {
    return this.get(API_ENDPOINTS.PRODUCTS.LIST, { page, limit, ...filters });
  }

  async updateProduct(productId: string, updates: any): Promise<ApiResponse> {
    return this.put(API_ENDPOINTS.PRODUCTS.UPDATE.replace(':id', productId), updates);
  }

  async deleteProduct(productId: string): Promise<ApiResponse> {
    return this.delete(API_ENDPOINTS.PRODUCTS.DELETE.replace(':id', productId));
  }

  // Platform Sync
  async syncWithPlatform(platform: 'etsy' | 'shopify' | 'printify'): Promise<ApiResponse> {
    return this.post(API_ENDPOINTS.PRODUCTS.SYNC, { platform });
  }

  async getProductAnalytics(productId?: string): Promise<ApiResponse> {
    const endpoint = productId 
      ? `${API_ENDPOINTS.PRODUCTS.ANALYTICS}/${productId}`
      : API_ENDPOINTS.PRODUCTS.ANALYTICS;
    return this.get(endpoint);
  }

  // Content Generation for Products
  async generateProductContent(productId: string, contentType: 'description' | 'title' | 'tags'): Promise<ApiResponse> {
    return this.post(API_ENDPOINTS.CONTENT.GENERATE, {
      type: 'product',
      productId,
      contentType,
    });
  }
}

// ================================
// 👥 KINGDOM CIRCLE API CLIENT
// ================================

export class KingdomCircleApiClient extends SharedApiClient {
  constructor() {
    super();
  }

  protected getAppName(): string {
    return 'kingdom-circle';
  }

  protected getAppVersion(): string {
    return '1.0.0';
  }

  // Community Posts
  async createPost(post: {
    title: string;
    content: string;
    category: string;
    isAnonymous?: boolean;
    tags?: string[];
  }): Promise<ApiResponse> {
    return this.post(API_ENDPOINTS.COMMUNITY.POSTS, post);
  }

  async getPosts(page: number = 1, limit: number = 20, category?: string): Promise<ApiResponse> {
    return this.get(API_ENDPOINTS.COMMUNITY.POSTS, { page, limit, category });
  }

  // Mentorship
  async getMentors(specialty?: string): Promise<ApiResponse> {
    return this.get(API_ENDPOINTS.COMMUNITY.MENTORS, { specialty });
  }

  async requestMentorship(mentorId: string, message: string): Promise<ApiResponse> {
    return this.post(`${API_ENDPOINTS.COMMUNITY.MENTORS}/${mentorId}/request`, { message });
  }

  // Groups
  async getGroups(category?: string): Promise<ApiResponse> {
    return this.get(API_ENDPOINTS.COMMUNITY.GROUPS, { category });
  }

  async joinGroup(groupId: string): Promise<ApiResponse> {
    return this.post(`${API_ENDPOINTS.COMMUNITY.GROUPS}/${groupId}/join`);
  }

  // Messages
  async sendMessage(recipientId: string, message: string): Promise<ApiResponse> {
    return this.post(API_ENDPOINTS.COMMUNITY.MESSAGES, {
      recipientId,
      message,
    });
  }

  async getMessages(conversationId: string): Promise<ApiResponse> {
    return this.get(`${API_ENDPOINTS.COMMUNITY.MESSAGES}/${conversationId}`);
  }

  // Events
  async getEvents(dateRange?: { start: string; end: string }): Promise<ApiResponse> {
    return this.get(API_ENDPOINTS.COMMUNITY.EVENTS, { dateRange });
  }

  async createEvent(event: {
    title: string;
    description: string;
    date: string;
    location: string;
    isVirtual?: boolean;
  }): Promise<ApiResponse> {
    return this.post(API_ENDPOINTS.COMMUNITY.EVENTS, event);
  }
}

// ================================
// 📸 KINGDOM LENS API CLIENT
// ================================

export class KingdomLensApiClient extends SharedApiClient {
  constructor() {
    super();
  }

  protected getAppName(): string {
    return 'kingdom-lens';
  }

  protected getAppVersion(): string {
    return '1.0.0';
  }

  // Photo Upload
  async uploadPhoto(file: any, onProgress?: (progress: number) => void): Promise<ApiResponse> {
    return this.uploadFile(API_ENDPOINTS.LENS.UPLOAD, file, onProgress);
  }

  // Photo Editing
  async editPhoto(photoId: string, edits: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
    filters?: string[];
    crop?: { x: number; y: number; width: number; height: number };
  }): Promise<ApiResponse> {
    return this.post(API_ENDPOINTS.LENS.EDIT, {
      photoId,
      edits,
    });
  }

  // Filters
  async getAvailableFilters(): Promise<ApiResponse> {
    return this.get(API_ENDPOINTS.LENS.FILTERS);
  }

  async applyFilter(photoId: string, filterName: string): Promise<ApiResponse> {
    return this.post(API_ENDPOINTS.LENS.FILTERS, {
      photoId,
      filterName,
    });
  }

  // Sharing
  async sharePhoto(photoId: string, platforms: string[]): Promise<ApiResponse> {
    return this.post(API_ENDPOINTS.LENS.SHARE, {
      photoId,
      platforms,
    });
  }

  // Portfolio
  async createPortfolio(portfolio: {
    name: string;
    description: string;
    isPublic?: boolean;
    category?: string;
  }): Promise<ApiResponse> {
    return this.post(API_ENDPOINTS.LENS.PORTFOLIO, portfolio);
  }

  async addPhotoToPortfolio(portfolioId: string, photoId: string): Promise<ApiResponse> {
    return this.post(`${API_ENDPOINTS.LENS.PORTFOLIO}/${portfolioId}/photos`, {
      photoId,
    });
  }

  async getPortfolios(userId?: string): Promise<ApiResponse> {
    return this.get(API_ENDPOINTS.LENS.PORTFOLIO, { userId });
  }

  // Analytics
  async getPhotoAnalytics(photoId?: string): Promise<ApiResponse> {
    const endpoint = photoId 
      ? `${API_ENDPOINTS.LENS.ANALYTICS}/${photoId}`
      : API_ENDPOINTS.LENS.ANALYTICS;
    return this.get(endpoint);
  }
}

// ================================
// 🎬 KINGDOM STUDIOS API CLIENT
// ================================

export class KingdomStudiosApiClient extends SharedApiClient {
  constructor() {
    super();
  }

  protected getAppName(): string {
    return 'kingdom-studios';
  }

  protected getAppVersion(): string {
    return '1.0.0';
  }

  // Content Generation
  async generateContent(prompt: string, type: string, customizations?: any): Promise<ApiResponse> {
    return this.post(API_ENDPOINTS.CONTENT.GENERATE, {
      prompt,
      type,
      customizations,
    });
  }

  async getContentHistory(page: number = 1, limit: number = 20): Promise<ApiResponse> {
    return this.get(API_ENDPOINTS.CONTENT.HISTORY, { page, limit });
  }

  async saveContent(content: {
    title: string;
    content: string;
    type: string;
    tags?: string[];
  }): Promise<ApiResponse> {
    return this.post(API_ENDPOINTS.CONTENT.SAVE, content);
  }

  async getContentTemplates(category?: string): Promise<ApiResponse> {
    return this.get(API_ENDPOINTS.CONTENT.TEMPLATES, { category });
  }

  async scheduleContent(schedule: {
    contentId: string;
    platforms: string[];
    scheduledTime: string;
  }): Promise<ApiResponse> {
    return this.post(API_ENDPOINTS.CONTENT.SCHEDULE, schedule);
  }

  async refineContent(contentId: string, feedback: string): Promise<ApiResponse> {
    return this.post(API_ENDPOINTS.CONTENT.REFINE, {
      contentId,
      feedback,
    });
  }
}

// ================================
// 📦 EXPORT ALL CLIENTS
// ================================

export const apiClients = {
  clips: new KingdomClipsApiClient(),
  voice: new KingdomVoiceApiClient(),
  launchpad: new KingdomLaunchpadApiClient(),
  circle: new KingdomCircleApiClient(),
  lens: new KingdomLensApiClient(),
  studios: new KingdomStudiosApiClient(),
}; 
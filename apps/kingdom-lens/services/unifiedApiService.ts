/**
 * 📸 KINGDOM LENS - UNIFIED API SERVICE
 * Replaces individual API services with the unified API client
 * 
 * This service provides all Kingdom Lens functionality through the unified API:
 * - Photo capture and editing
 * - Portfolio management
 * - AI-powered enhancements
 * - Gallery creation and delivery
 * - Business tools and analytics
 * - Client management
 * - Social media integration
 */

import { apiClients } from '@kingdom-collective/api';

// ================================
// 📸 KINGDOM LENS API SERVICE
// ================================

export interface Photo {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl: string;
  originalUrl: string;
  metadata: {
    width: number;
    height: number;
    size: number;
    format: string;
    location?: string;
    dateTaken: string;
    camera?: string;
    settings?: {
      aperture?: string;
      shutterSpeed?: string;
      iso?: number;
      focalLength?: string;
    };
  };
  tags: string[];
  category: 'portrait' | 'landscape' | 'event' | 'wedding' | 'commercial' | 'artistic' | 'faith';
  isPublic: boolean;
  isFeatured: boolean;
  likes: number;
  views: number;
  dateCreated: string;
  lastModified: string;
}

export interface Gallery {
  id: string;
  title: string;
  description?: string;
  coverImageUrl?: string;
  photos: string[];
  category: 'wedding' | 'portrait' | 'event' | 'commercial' | 'personal' | 'faith';
  privacy: 'public' | 'private' | 'password-protected';
  password?: string;
  isActive: boolean;
  viewCount: number;
  downloadCount: number;
  dateCreated: string;
  lastModified: string;
  expiresAt?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  notes?: string;
  preferences: {
    style: string[];
    colors: string[];
    locations: string[];
  };
  projects: string[];
  totalSpent: number;
  lastContact: string;
  dateCreated: string;
}

export interface Session {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  type: 'portrait' | 'wedding' | 'event' | 'commercial' | 'engagement';
  date: string;
  location: string;
  duration: number; // in minutes
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  photos: string[];
  notes: string[];
  equipment: string[];
  weather?: {
    temperature: number;
    conditions: string;
    humidity: number;
  };
  dateCreated: string;
  lastModified: string;
}

export interface Invoice {
  id: string;
  clientId: string;
  clientName: string;
  sessionId?: string;
  sessionTitle?: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  dueDate: string;
  paidDate?: string;
  notes?: string;
  dateCreated: string;
  lastModified: string;
}

export interface AIEnhancement {
  id: string;
  photoId: string;
  type: 'color-correction' | 'noise-reduction' | 'sharpening' | 'background-removal' | 'object-removal' | 'style-transfer' | 'faith-enhancement';
  settings: Record<string, any>;
  beforeUrl: string;
  afterUrl: string;
  processingTime: number;
  quality: number; // 0-100
  isApproved: boolean;
  dateCreated: string;
}

export interface Analytics {
  totalPhotos: number;
  totalGalleries: number;
  totalClients: number;
  totalRevenue: number;
  averageSessionValue: number;
  topPerformingPhotos: Array<{
    photoId: string;
    title: string;
    views: number;
    likes: number;
    revenue: number;
  }>;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    sessions: number;
  }>;
  clientRetentionRate: number;
  averageGalleryViews: number;
}

export class KingdomLensApiService {
  private static instance: KingdomLensApiService;
  private api = apiClients.lens;

  private constructor() {}

  static getInstance(): KingdomLensApiService {
    if (!KingdomLensApiService.instance) {
      KingdomLensApiService.instance = new KingdomLensApiService();
    }
    return KingdomLensApiService.instance;
  }

  // ================================
  // 📸 PHOTO MANAGEMENT
  // ================================

  /**
   * Upload photo
   */
  async uploadPhoto(
    file: any,
    metadata: {
      title: string;
      description?: string;
      tags: string[];
      category: Photo['category'];
      isPublic: boolean;
    },
    onProgress?: (progress: number) => void
  ): Promise<{
    photoId: string;
    imageUrl: string;
    thumbnailUrl: string;
    originalUrl: string;
  }> {
    const response = await this.api.uploadPhoto(file, metadata, (progress) => {
      if (onProgress) onProgress(progress);
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to upload photo');
    }

    return response.data;
  }

  /**
   * Get photos
   */
  async getPhotos(
    page: number = 1,
    limit: number = 20,
    filters?: {
      category?: string;
      tags?: string[];
      isPublic?: boolean;
      isFeatured?: boolean;
      search?: string;
    }
  ): Promise<{
    photos: Photo[];
    total: number;
    pages: number;
  }> {
    const response = await this.api.getPhotos(page, limit, filters);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get photos');
    }

    return response.data;
  }

  /**
   * Get photo by ID
   */
  async getPhoto(photoId: string): Promise<Photo> {
    const response = await this.api.getPhoto(photoId);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get photo');
    }

    return response.data;
  }

  /**
   * Update photo
   */
  async updatePhoto(photoId: string, updates: Partial<Photo>): Promise<Photo> {
    const response = await this.api.updatePhoto(photoId, updates);

    if (!response.success) {
      throw new Error(response.error || 'Failed to update photo');
    }

    return response.data;
  }

  /**
   * Delete photo
   */
  async deletePhoto(photoId: string): Promise<void> {
    const response = await this.api.deletePhoto(photoId);

    if (!response.success) {
      throw new Error(response.error || 'Failed to delete photo');
    }
  }

  /**
   * Like photo
   */
  async likePhoto(photoId: string): Promise<void> {
    const response = await this.api.likePhoto(photoId);

    if (!response.success) {
      throw new Error(response.error || 'Failed to like photo');
    }
  }

  // ================================
  // 🖼️ GALLERY MANAGEMENT
  // ================================

  /**
   * Create gallery
   */
  async createGallery(gallery: Omit<Gallery, 'id' | 'photos' | 'viewCount' | 'downloadCount' | 'dateCreated' | 'lastModified'>): Promise<{ id: string }> {
    const response = await this.api.createGallery(gallery);

    if (!response.success) {
      throw new Error(response.error || 'Failed to create gallery');
    }

    return response.data;
  }

  /**
   * Get galleries
   */
  async getGalleries(
    page: number = 1,
    limit: number = 20,
    filters?: {
      category?: string;
      privacy?: string;
      isActive?: boolean;
      search?: string;
    }
  ): Promise<{
    galleries: Gallery[];
    total: number;
    pages: number;
  }> {
    const response = await this.api.getGalleries(page, limit, filters);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get galleries');
    }

    return response.data;
  }

  /**
   * Get gallery by ID
   */
  async getGallery(galleryId: string): Promise<Gallery> {
    const response = await this.api.getGallery(galleryId);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get gallery');
    }

    return response.data;
  }

  /**
   * Update gallery
   */
  async updateGallery(galleryId: string, updates: Partial<Gallery>): Promise<Gallery> {
    const response = await this.api.updateGallery(galleryId, updates);

    if (!response.success) {
      throw new Error(response.error || 'Failed to update gallery');
    }

    return response.data;
  }

  /**
   * Add photos to gallery
   */
  async addPhotosToGallery(galleryId: string, photoIds: string[]): Promise<void> {
    const response = await this.api.addPhotosToGallery(galleryId, photoIds);

    if (!response.success) {
      throw new Error(response.error || 'Failed to add photos to gallery');
    }
  }

  /**
   * Remove photos from gallery
   */
  async removePhotosFromGallery(galleryId: string, photoIds: string[]): Promise<void> {
    const response = await this.api.removePhotosFromGallery(galleryId, photoIds);

    if (!response.success) {
      throw new Error(response.error || 'Failed to remove photos from gallery');
    }
  }

  /**
   * Share gallery
   */
  async shareGallery(
    galleryId: string,
    platforms: string[],
    message?: string
  ): Promise<{
    success: boolean;
    platformResults: Record<string, any>;
  }> {
    const response = await this.api.shareGallery(galleryId, platforms, message);

    if (!response.success) {
      throw new Error(response.error || 'Failed to share gallery');
    }

    return response.data;
  }

  // ================================
  // 👥 CLIENT MANAGEMENT
  // ================================

  /**
   * Create client
   */
  async createClient(client: Omit<Client, 'id' | 'projects' | 'totalSpent' | 'dateCreated'>): Promise<{ id: string }> {
    const response = await this.api.createClient(client);

    if (!response.success) {
      throw new Error(response.error || 'Failed to create client');
    }

    return response.data;
  }

  /**
   * Get clients
   */
  async getClients(
    page: number = 1,
    limit: number = 20,
    filters?: {
      search?: string;
      hasProjects?: boolean;
    }
  ): Promise<{
    clients: Client[];
    total: number;
    pages: number;
  }> {
    const response = await this.api.getClients(page, limit, filters);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get clients');
    }

    return response.data;
  }

  /**
   * Get client by ID
   */
  async getClient(clientId: string): Promise<Client> {
    const response = await this.api.getClient(clientId);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get client');
    }

    return response.data;
  }

  /**
   * Update client
   */
  async updateClient(clientId: string, updates: Partial<Client>): Promise<Client> {
    const response = await this.api.updateClient(clientId, updates);

    if (!response.success) {
      throw new Error(response.error || 'Failed to update client');
    }

    return response.data;
  }

  // ================================
  // 📅 SESSION MANAGEMENT
  // ================================

  /**
   * Create session
   */
  async createSession(session: Omit<Session, 'id' | 'photos' | 'dateCreated' | 'lastModified'>): Promise<{ id: string }> {
    const response = await this.api.createSession(session);

    if (!response.success) {
      throw new Error(response.error || 'Failed to create session');
    }

    return response.data;
  }

  /**
   * Get sessions
   */
  async getSessions(
    page: number = 1,
    limit: number = 20,
    filters?: {
      type?: string;
      status?: string;
      clientId?: string;
      dateRange?: { start: string; end: string };
    }
  ): Promise<{
    sessions: Session[];
    total: number;
    pages: number;
  }> {
    const response = await this.api.getSessions(page, limit, filters);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get sessions');
    }

    return response.data;
  }

  /**
   * Get session by ID
   */
  async getSession(sessionId: string): Promise<Session> {
    const response = await this.api.getSession(sessionId);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get session');
    }

    return response.data;
  }

  /**
   * Update session
   */
  async updateSession(sessionId: string, updates: Partial<Session>): Promise<Session> {
    const response = await this.api.updateSession(sessionId, updates);

    if (!response.success) {
      throw new Error(response.error || 'Failed to update session');
    }

    return response.data;
  }

  /**
   * Add photos to session
   */
  async addPhotosToSession(sessionId: string, photoIds: string[]): Promise<void> {
    const response = await this.api.addPhotosToSession(sessionId, photoIds);

    if (!response.success) {
      throw new Error(response.error || 'Failed to add photos to session');
    }
  }

  // ================================
  // 💰 INVOICE MANAGEMENT
  // ================================

  /**
   * Create invoice
   */
  async createInvoice(invoice: Omit<Invoice, 'id' | 'dateCreated' | 'lastModified'>): Promise<{ id: string }> {
    const response = await this.api.createInvoice(invoice);

    if (!response.success) {
      throw new Error(response.error || 'Failed to create invoice');
    }

    return response.data;
  }

  /**
   * Get invoices
   */
  async getInvoices(
    page: number = 1,
    limit: number = 20,
    filters?: {
      status?: string;
      clientId?: string;
      dateRange?: { start: string; end: string };
    }
  ): Promise<{
    invoices: Invoice[];
    total: number;
    pages: number;
  }> {
    const response = await this.api.getInvoices(page, limit, filters);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get invoices');
    }

    return response.data;
  }

  /**
   * Get invoice by ID
   */
  async getInvoice(invoiceId: string): Promise<Invoice> {
    const response = await this.api.getInvoice(invoiceId);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get invoice');
    }

    return response.data;
  }

  /**
   * Update invoice
   */
  async updateInvoice(invoiceId: string, updates: Partial<Invoice>): Promise<Invoice> {
    const response = await this.api.updateInvoice(invoiceId, updates);

    if (!response.success) {
      throw new Error(response.error || 'Failed to update invoice');
    }

    return response.data;
  }

  /**
   * Send invoice
   */
  async sendInvoice(invoiceId: string): Promise<void> {
    const response = await this.api.sendInvoice(invoiceId);

    if (!response.success) {
      throw new Error(response.error || 'Failed to send invoice');
    }
  }

  /**
   * Mark invoice as paid
   */
  async markInvoiceAsPaid(invoiceId: string): Promise<void> {
    const response = await this.api.markInvoiceAsPaid(invoiceId);

    if (!response.success) {
      throw new Error(response.error || 'Failed to mark invoice as paid');
    }
  }

  // ================================
  // 🤖 AI ENHANCEMENTS
  // ================================

  /**
   * Enhance photo with AI
   */
  async enhancePhoto(
    photoId: string,
    enhancementType: AIEnhancement['type'],
    settings?: Record<string, any>
  ): Promise<{
    enhancementId: string;
    beforeUrl: string;
    afterUrl: string;
    processingTime: number;
    quality: number;
  }> {
    const response = await this.api.enhancePhoto(photoId, enhancementType, settings);

    if (!response.success) {
      throw new Error(response.error || 'Failed to enhance photo');
    }

    return response.data;
  }

  /**
   * Get AI enhancements
   */
  async getAIEnhancements(
    photoId?: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    enhancements: AIEnhancement[];
    total: number;
    pages: number;
  }> {
    const response = await this.api.getAIEnhancements(photoId, page, limit);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get AI enhancements');
    }

    return response.data;
  }

  /**
   * Approve AI enhancement
   */
  async approveAIEnhancement(enhancementId: string): Promise<void> {
    const response = await this.api.approveAIEnhancement(enhancementId);

    if (!response.success) {
      throw new Error(response.error || 'Failed to approve AI enhancement');
    }
  }

  /**
   * Reject AI enhancement
   */
  async rejectAIEnhancement(enhancementId: string): Promise<void> {
    const response = await this.api.rejectAIEnhancement(enhancementId);

    if (!response.success) {
      throw new Error(response.error || 'Failed to reject AI enhancement');
    }
  }

  // ================================
  // 📊 ANALYTICS
  // ================================

  /**
   * Get business analytics
   */
  async getBusinessAnalytics(
    timeframe: '7d' | '30d' | '90d' = '30d'
  ): Promise<Analytics> {
    const response = await this.api.getBusinessAnalytics(timeframe);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get business analytics');
    }

    return response.data;
  }

  /**
   * Get photo analytics
   */
  async getPhotoAnalytics(
    photoId: string,
    timeframe: '7d' | '30d' | '90d' = '30d'
  ): Promise<{
    views: number;
    likes: number;
    shares: number;
    downloads: number;
    revenue: number;
    engagementRate: number;
  }> {
    const response = await this.api.getPhotoAnalytics(photoId, timeframe);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get photo analytics');
    }

    return response.data;
  }

  /**
   * Get gallery analytics
   */
  async getGalleryAnalytics(
    galleryId: string,
    timeframe: '7d' | '30d' | '90d' = '30d'
  ): Promise<{
    views: number;
    downloads: number;
    shares: number;
    averageTimeSpent: number;
    topPhotos: Array<{
      photoId: string;
      title: string;
      views: number;
    }>;
  }> {
    const response = await this.api.getGalleryAnalytics(galleryId, timeframe);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get gallery analytics');
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
export const kingdomLensApi = KingdomLensApiService.getInstance(); 
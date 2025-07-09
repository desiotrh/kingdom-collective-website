/**
 * Enterprise Content Service
 * Manages all content generation and management operations
 */

import { apiClient, ApiResponse } from './apiClient';

// Content Types
export interface ContentGenerationRequest {
  contentType: string;
  platform: string;
  prompt: string;
  tone?: string;
  length?: string;
  subtype?: string;
  customPrompt?: string;
  faithMode?: boolean;
}

export interface ContentGenerationResponse {
  id: string;
  content: string;
  contentType: string;
  platform: string;
  metadata?: {
    wordCount?: number;
    charactersCount?: number;
    tags?: string[];
    processingTime?: number;
    cached?: boolean;
  };
  createdAt: string;
}

export interface ContentTemplate {
  id: string;
  name: string;
  category: string;
  platforms: string[];
  prompt: string;
  description?: string;
  isPopular?: boolean;
  usageCount?: number;
}

export interface ContentFavorite {
  id: string;
  content: string;
  contentType: string;
  platform: string;
  createdAt: string;
  title?: string;
  metadata?: Record<string, any>;
}

export interface ContentRefinementRequest {
  contentId?: string;
  content: string;
  refinementType: 'shorten' | 'expand' | 'improve' | 'tone_change' | 'custom';
  instructions?: string;
  targetTone?: string;
  targetLength?: number;
}

export interface ContentBatchRequest {
  requests: ContentGenerationRequest[];
  batchOptions?: {
    parallel?: boolean;
    priority?: 'low' | 'normal' | 'high';
    callback?: string;
  };
}

export interface ContentStats {
  totalGenerations: number;
  todayGenerations: number;
  recentActivity: Array<{
    date: string;
    count: number;
    contentTypes: string[];
  }>;
  topContentTypes: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  platformUsage: Array<{
    platform: string;
    count: number;
    percentage: number;
  }>;
  performance: {
    avgResponseTime: number;
    successRate: number;
    cacheHitRate: number;
  };
}

export class ContentService {
  private static instance: ContentService;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 300000; // 5 minutes

  private constructor() {}

  static getInstance(): ContentService {
    if (!ContentService.instance) {
      ContentService.instance = new ContentService();
    }
    return ContentService.instance;
  }

  // Generate content
  async generateContent(request: ContentGenerationRequest): Promise<ApiResponse<ContentGenerationResponse>> {
    try {
      const cacheKey = this.getCacheKey('generate', request);
      const cached = this.getFromCache(cacheKey);
      
      if (cached) {
        return {
          data: { ...cached, metadata: { ...cached.metadata, cached: true } },
          success: true,
          timestamp: new Date().toISOString(),
        };
      }

      const response = await apiClient.post<ContentGenerationResponse>(
        '/api/v1/enterprise-content/generate',
        request
      );

      if (response.success) {
        this.setCache(cacheKey, response.data);
      }

      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Content generation failed');
    }
  }

  // Generate multiple content pieces in batch
  async generateBatch(batchRequest: ContentBatchRequest): Promise<ApiResponse<ContentGenerationResponse[]>> {
    try {
      const response = await apiClient.post<ContentGenerationResponse[]>(
        '/api/v1/enterprise-content/batch',
        batchRequest
      );

      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Batch content generation failed');
    }
  }

  // Refine existing content
  async refineContent(request: ContentRefinementRequest): Promise<ApiResponse<ContentGenerationResponse>> {
    try {
      const response = await apiClient.post<ContentGenerationResponse>(
        '/api/v1/enterprise-content/refine',
        request
      );

      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Content refinement failed');
    }
  }

  // Get content templates
  async getTemplates(category?: string): Promise<ApiResponse<ContentTemplate[]>> {
    try {
      const params = category ? { category } : undefined;
      const response = await apiClient.get<ContentTemplate[]>(
        '/api/v1/enterprise-content/templates',
        params
      );

      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch templates');
    }
  }

  // Get popular templates
  async getPopularTemplates(limit: number = 10): Promise<ApiResponse<ContentTemplate[]>> {
    try {
      const response = await apiClient.get<ContentTemplate[]>(
        '/api/v1/enterprise-content/templates/popular',
        { limit }
      );

      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch popular templates');
    }
  }

  // Save content as favorite
  async saveFavorite(contentData: Omit<ContentFavorite, 'id' | 'createdAt'>): Promise<ApiResponse<ContentFavorite>> {
    try {
      const response = await apiClient.post<ContentFavorite>(
        '/api/v1/content/favorites',
        contentData
      );

      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to save favorite');
    }
  }

  // Get user favorites
  async getFavorites(page: number = 1, limit: number = 20): Promise<ApiResponse<{ 
    favorites: ContentFavorite[];
    total: number;
    page: number;
    totalPages: number;
  }>> {
    try {
      const response = await apiClient.get(
        '/api/v1/content/favorites',
        { page, limit }
      );

      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch favorites');
    }
  }

  // Delete favorite
  async deleteFavorite(favoriteId: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.delete(
        `/api/v1/content/favorites/${favoriteId}`
      );

      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete favorite');
    }
  }

  // Get content history
  async getContentHistory(page: number = 1, limit: number = 20): Promise<ApiResponse<{
    content: ContentGenerationResponse[];
    total: number;
    page: number;
    totalPages: number;
  }>> {
    try {
      const response = await apiClient.get(
        '/api/v1/content/history',
        { page, limit }
      );

      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch content history');
    }
  }

  // Get content statistics
  async getStats(): Promise<ApiResponse<ContentStats>> {
    try {
      const cacheKey = 'stats';
      const cached = this.getFromCache(cacheKey);
      
      if (cached) {
        return {
          data: cached,
          success: true,
          cached: true,
          timestamp: new Date().toISOString(),
        };
      }

      const response = await apiClient.get<ContentStats>(
        '/api/v1/enterprise-content/stats'
      );

      if (response.success) {
        this.setCache(cacheKey, response.data, 60000); // Cache for 1 minute
      }

      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch statistics');
    }
  }

  // Search content
  async searchContent(query: string, filters?: {
    contentType?: string;
    platform?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<ApiResponse<ContentGenerationResponse[]>> {
    try {
      const params = { q: query, ...filters };
      const response = await apiClient.get<ContentGenerationResponse[]>(
        '/api/v1/content/search',
        params
      );

      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Search failed');
    }
  }

  // Export content
  async exportContent(format: 'json' | 'csv' | 'pdf', filters?: {
    dateFrom?: string;
    dateTo?: string;
    contentTypes?: string[];
  }): Promise<ApiResponse<{ downloadUrl: string; expiresAt: string }>> {
    try {
      const response = await apiClient.post(
        '/api/v1/content/export',
        { format, filters }
      );

      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Export failed');
    }
  }

  // Analyze content performance
  async analyzePerformance(contentId: string): Promise<ApiResponse<{
    engagement: {
      views?: number;
      likes?: number;
      shares?: number;
      comments?: number;
    };
    metrics: {
      readability: number;
      sentiment: string;
      keywordDensity: Record<string, number>;
    };
    suggestions: string[];
  }>> {
    try {
      const response = await apiClient.get(
        `/api/v1/content/${contentId}/analytics`
      );

      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Performance analysis failed');
    }
  }

  // Get content trends
  async getTrends(timeframe: '7d' | '30d' | '90d' = '30d'): Promise<ApiResponse<{
    trending: {
      contentTypes: Array<{ type: string; growth: number }>;
      platforms: Array<{ platform: string; growth: number }>;
      topics: Array<{ topic: string; mentions: number }>;
    };
    insights: string[];
  }>> {
    try {
      const response = await apiClient.get(
        '/api/v1/content/trends',
        { timeframe }
      );

      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch trends');
    }
  }

  // Cache management
  private getCacheKey(operation: string, data: any): string {
    return `${operation}_${JSON.stringify(data)}`;
  }

  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > this.CACHE_TTL;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private setCache(key: string, data: any, ttl: number = this.CACHE_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });

    // Auto-cleanup after TTL
    setTimeout(() => {
      this.cache.delete(key);
    }, ttl);
  }

  // Clear all cached data
  clearCache(): void {
    this.cache.clear();
  }

  // Get cache statistics
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Export singleton instance
export const contentService = ContentService.getInstance();
export default contentService;

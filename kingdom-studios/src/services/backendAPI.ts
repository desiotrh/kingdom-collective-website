import { Environment } from '../config/environment';

// API Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  faithMode?: boolean;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    faithMode?: boolean;
  };
}

export interface ContentGenerationRequest {
  contentType: string;
  platform: string;
  prompt: string;
  tone?: string;
  length?: string;
  subtype?: string;
  customPrompt?: string;
}

export interface ContentGenerationResponse {
  content: string;
  contentType: string;
  platform: string;
  metadata?: {
    wordCount?: number;
    charactersCount?: number;
    tags?: string[];
  };
}

export interface ContentTemplate {
  id: string;
  name: string;
  category: string;
  platforms: string[];
  prompt: string;
  description?: string;
}

export interface ContentFavorite {
  id: string;
  content: string;
  contentType: string;
  platform: string;
  createdAt: string;
  title?: string;
}

export interface ContentRefinementRequest {
  content: string;
  refinementType: 'shorten' | 'expand' | 'improve' | 'tone_change';
  instructions?: string;
  targetTone?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  faithMode?: boolean;
  profile?: {
    bio?: string;
    preferences?: Record<string, any>;
  };
}

export interface AnalyticsData {
  totalGenerations: number;
  recentActivity: Array<{
    date: string;
    count: number;
    contentTypes: string[];
  }>;
  topContentTypes: Array<{
    type: string;
    count: number;
  }>;
  platformUsage: Array<{
    platform: string;
    count: number;
  }>;
}

class BackendAPI {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = Environment.get().API_BASE_URL;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; message: string }> {
    return this.makeRequest('/health');
  }

  // Authentication
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    return this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout(): Promise<{ message: string }> {
    return this.makeRequest('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.makeRequest('/auth/me');
  }

  // Content Generation
  async generateContent(request: ContentGenerationRequest): Promise<ContentGenerationResponse> {
    return this.makeRequest('/content/generate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getContentHistory(): Promise<ContentGenerationResponse[]> {
    return this.makeRequest('/content/history');
  }

  async deleteContentHistory(contentId: string): Promise<{ message: string }> {
    return this.makeRequest(`/content/history/${contentId}`, {
      method: 'DELETE',
    });
  }

  // Content Templates
  async getContentTemplates(category?: string, platform?: string): Promise<ContentTemplate[]> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (platform) params.append('platform', platform);
    
    const queryString = params.toString();
    const endpoint = `/content/templates${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest(endpoint);
  }

  async getTemplateCategories(): Promise<string[]> {
    return this.makeRequest('/content/templates/categories');
  }

  // Content Favorites
  async getFavorites(): Promise<ContentFavorite[]> {
    return this.makeRequest('/content/favorites');
  }

  async addToFavorites(content: Omit<ContentFavorite, 'id' | 'createdAt'>): Promise<ContentFavorite> {
    return this.makeRequest('/content/favorites', {
      method: 'POST',
      body: JSON.stringify(content),
    });
  }

  async removeFromFavorites(favoriteId: string): Promise<{ message: string }> {
    return this.makeRequest(`/content/favorites/${favoriteId}`, {
      method: 'DELETE',
    });
  }

  // Content Refinement
  async refineContent(request: ContentRefinementRequest): Promise<{ refinedContent: string }> {
    return this.makeRequest('/content/refine', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Analytics
  async getAnalytics(): Promise<AnalyticsData> {
    return this.makeRequest('/analytics/data');
  }

  async trackContentGeneration(data: {
    contentType: string;
    platform: string;
    success: boolean;
  }): Promise<{ message: string }> {
    return this.makeRequest('/analytics/track', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Profile Management
  async updateProfile(profileData: Partial<User['profile']>): Promise<User> {
    return this.makeRequest('/profile/update', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async deleteAccount(): Promise<{ message: string }> {
    return this.makeRequest('/profile/delete', {
      method: 'DELETE',
    });
  }

  // System/Health
  async getSystemStatus(): Promise<{
    status: string;
    version: string;
    database: string;
    ai: string;
  }> {
    return this.makeRequest('/system/status');
  }
}

// Export singleton instance
export const backendAPI = new BackendAPI();
export default backendAPI;

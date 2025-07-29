/**
 * 🏛️ KINGDOM COLLECTIVE - SHARED API CLIENT
 * Unified API client for all Kingdom apps
 * 
 * Note: All API requests automatically include the current app's token and x-app-id header 
 * for unified rate limiting and auth validation.
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration
const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.kingdomcollective.pro',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    ME: '/auth/me',
  },
  
  // User Management
  USERS: {
    PROFILE: '/users/profile',
    PREFERENCES: '/users/preferences',
    SETTINGS: '/users/settings',
    DELETE_ACCOUNT: '/users/account',
  },
  
  // Content Generation (Kingdom Studios)
  CONTENT: {
    GENERATE: '/content/generate',
    HISTORY: '/content/history',
    SAVE: '/content/save',
    TEMPLATES: '/content/templates',
    SCHEDULE: '/content/schedule',
    REFINE: '/content/refine',
  },
  
  // Video Editing (Kingdom Clips)
  CLIPS: {
    UPLOAD: '/clips/upload',
    PROCESS: '/clips/process',
    ENHANCE: '/clips/enhance',
    EXPORT: '/clips/export',
    HISTORY: '/clips/history',
    ANALYTICS: '/clips/analytics',
  },
  
  // Voice & Journaling (Kingdom Voice)
  VOICE: {
    RECORD: '/voice/record',
    TRANSCRIBE: '/voice/transcribe',
    ANALYZE: '/voice/analyze',
    JOURNAL: '/voice/journal',
    PRAYER: '/voice/prayer',
    EXPORT: '/voice/export',
  },
  
  // Product Management (Kingdom Launchpad)
  PRODUCTS: {
    LIST: '/products',
    CREATE: '/products',
    UPDATE: '/products/:id',
    DELETE: '/products/:id',
    SYNC: '/products/sync',
    ANALYTICS: '/products/analytics',
  },
  
  // Community (Kingdom Circle)
  COMMUNITY: {
    POSTS: '/community/posts',
    MENTORS: '/community/mentors',
    GROUPS: '/community/groups',
    MESSAGES: '/community/messages',
    EVENTS: '/community/events',
  },
  
  // Photography (Kingdom Lens)
  LENS: {
    UPLOAD: '/lens/upload',
    EDIT: '/lens/edit',
    FILTERS: '/lens/filters',
    SHARE: '/lens/share',
    PORTFOLIO: '/lens/portfolio',
    ANALYTICS: '/lens/analytics',
  },
  
  // Analytics
  ANALYTICS: {
    OVERVIEW: '/analytics/overview',
    CONTENT: '/analytics/content',
    PRODUCTS: '/analytics/products',
    REVENUE: '/analytics/revenue',
    TRACK: '/analytics/track',
  },
  
  // Payments
  PAYMENTS: {
    CREATE_INTENT: '/payments/create-intent',
    CREATE_SUBSCRIPTION: '/payments/create-subscription',
    METHODS: '/payments/methods',
    SETUP_INTENT: '/payments/setup-intent',
    SUBSCRIPTIONS: '/payments/subscriptions',
  },
  
  // File Management
  FILES: {
    UPLOAD: '/files/upload',
    DOWNLOAD: '/files/download',
    DELETE: '/files/delete',
    LIST: '/files/list',
  },
};

// Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Cache Interface
interface CacheItem {
  data: any;
  timestamp: number;
  expiry: number;
}

/**
 * 🏛️ KINGDOM COLLECTIVE - SHARED API CLIENT
 * Production-ready API client with caching, retry logic, and error handling
 * 
 * Default Header Injection Example:
 * const client = axios.create({
 *   baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
 *   headers: {
 *     "x-app-id": process.env.EXPO_PUBLIC_APP_NAME,
 *     "x-api-version": "v1",
 *     Authorization: `Bearer ${userToken}`,
 *   },
 * });
 */
export class SharedApiClient {
  private api: AxiosInstance;
  private cache = new Map<string, CacheItem>();
  private requestQueue = new Map<string, Promise<any>>();
  private rateLimitMap = new Map<string, number[]>();

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Kingdom-Collective-API-Client/1.0',
        'x-api-version': 'v1', // Future-proofing for API versioning
      },
    });

    this.setupInterceptors();
  }

  // ================================
  // 🔧 SETUP & CONFIGURATION
  // ================================

  private setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      async (config) => {
        // Add authentication token
        const token = await this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add app identifier and version
        config.headers['x-app-id'] = this.getAppName();
        config.headers['x-app-version'] = this.getAppVersion();
        config.headers['x-api-version'] = 'v1'; // Future-proofing

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired, try to refresh
          const refreshed = await this.refreshToken();
          if (refreshed && error.config) {
            // Retry the original request
            return this.api.request(error.config);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // ================================
  // 🔐 AUTHENTICATION
  // ================================

  private async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  private async setAuthToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('auth_token', token);
    } catch (error) {
      console.error('Error setting auth token:', error);
    }
  }

  private async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = await AsyncStorage.getItem('refresh_token');
      if (!refreshToken) return false;

      const response = await this.api.post(API_ENDPOINTS.AUTH.REFRESH, {
        refreshToken,
      });

      if (response.data.success) {
        await this.setAuthToken(response.data.data.accessToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  }

  // ================================
  // 📱 APP IDENTIFICATION
  // ================================

  private getAppName(): string {
    // This should be overridden by each app
    return process.env.EXPO_PUBLIC_APP_NAME || 'kingdom-collective';
  }

  private getAppVersion(): string {
    // This should be overridden by each app
    return process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0';
  }

  // ================================
  // 💾 CACHING SYSTEM
  // ================================

  private getCacheKey(endpoint: string, params?: any): string {
    const paramString = params ? JSON.stringify(params) : '';
    return `${endpoint}:${paramString}`;
  }

  private getCachedData(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + API_CONFIG.CACHE_DURATION,
    });
  }

  // ================================
  // 🔄 REQUEST QUEUING
  // ================================

  private async queueRequest<T>(
    key: string,
    requestFn: () => Promise<T>
  ): Promise<T> {
    if (this.requestQueue.has(key)) {
      return this.requestQueue.get(key)!;
    }

    const promise = requestFn();
    this.requestQueue.set(key, promise);

    try {
      const result = await promise;
      return result;
    } finally {
      this.requestQueue.delete(key);
    }
  }

  // ================================
  // 🌐 CORE API METHODS
  // ================================

  async get<T = any>(
    endpoint: string,
    params?: any,
    useCache: boolean = true
  ): Promise<ApiResponse<T>> {
    const cacheKey = this.getCacheKey(endpoint, params);
    
    if (useCache) {
      const cached = this.getCachedData(cacheKey);
      if (cached) {
        return { success: true, data: cached, statusCode: 200 };
      }
    }

    return this.queueRequest(cacheKey, async () => {
      try {
        const response = await this.api.get(endpoint, { params });
        
        if (useCache) {
          this.setCachedData(cacheKey, response.data.data);
        }

        return {
          success: true,
          data: response.data.data,
          statusCode: response.status,
          message: response.data.message,
        };
      } catch (error: any) {
        return this.handleError(error);
      }
    });
  }

  async post<T = any>(
    endpoint: string,
    data?: any
  ): Promise<ApiResponse<T>> {
    return this.queueRequest(`${endpoint}:${JSON.stringify(data)}`, async () => {
      try {
        const response = await this.api.post(endpoint, data);
        return {
          success: true,
          data: response.data.data,
          statusCode: response.status,
          message: response.data.message,
        };
      } catch (error: any) {
        return this.handleError(error);
      }
    });
  }

  async put<T = any>(
    endpoint: string,
    data?: any
  ): Promise<ApiResponse<T>> {
    return this.queueRequest(`${endpoint}:${JSON.stringify(data)}`, async () => {
      try {
        const response = await this.api.put(endpoint, data);
        return {
          success: true,
          data: response.data.data,
          statusCode: response.status,
          message: response.data.message,
        };
      } catch (error: any) {
        return this.handleError(error);
      }
    });
  }

  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.queueRequest(endpoint, async () => {
      try {
        const response = await this.api.delete(endpoint);
        return {
          success: true,
          data: response.data.data,
          statusCode: response.status,
          message: response.data.message,
        };
      } catch (error: any) {
        return this.handleError(error);
      }
    });
  }

  // ================================
  // 📁 FILE UPLOAD
  // ================================

  async uploadFile(
    endpoint: string,
    file: any,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await this.api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            onProgress(progress);
          }
        },
      });

      return {
        success: true,
        data: response.data.data,
        statusCode: response.status,
        message: response.data.message,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // ================================
  // ❌ ERROR HANDLING
  // ================================

  private handleError(error: any): ApiResponse {
    console.error('API Error:', error);

    if (error.response) {
      // Server responded with error status
      return {
        success: false,
        error: error.response.data?.error || error.response.data?.message || 'Server error',
        statusCode: error.response.status,
      };
    } else if (error.request) {
      // Network error
      return {
        success: false,
        error: 'Network error - please check your connection',
        statusCode: 0,
      };
    } else {
      // Other error
      return {
        success: false,
        error: error.message || 'Unknown error',
        statusCode: 0,
      };
    }
  }

  // ================================
  // 🧹 UTILITY METHODS
  // ================================

  clearCache(): void {
    this.cache.clear();
  }

  clearQueue(): void {
    this.requestQueue.clear();
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  // ================================
  // 🔍 DEBUGGING & MONITORING
  // ================================

  getRequestHeaders(): Record<string, string> {
    return {
      'x-app-id': this.getAppName(),
      'x-app-version': this.getAppVersion(),
      'x-api-version': 'v1',
    };
  }

  getApiConfig(): typeof API_CONFIG {
    return API_CONFIG;
  }
}

// Export singleton instance
export const sharedApiClient = new SharedApiClient(); 
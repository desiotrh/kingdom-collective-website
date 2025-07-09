import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Optimized Backend API Service with performance enhancements
 * Implements caching, request queuing, and rate limiting
 */
class OptimizedBackendAPI {
  private api: AxiosInstance;
  private cache = new Map<string, { data: any; expiry: number }>();
  private requestQueue = new Map<string, Promise<any>>();
  private rateLimitMap = new Map<string, number[]>();

  constructor() {
    this.api = axios.create({
      baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor with rate limiting
    this.api.interceptors.request.use(
      async (config) => {
        // Add auth token
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Rate limiting check
        const endpoint = config.url || '';
        if (!this.checkRateLimit(endpoint)) {
          throw new Error('Rate limit exceeded. Please wait before making more requests.');
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor with error handling
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Handle token refresh
          await this.handleTokenRefresh();
        }
        return Promise.reject(error);
      }
    );
  }

  private checkRateLimit(endpoint: string): boolean {
    const now = Date.now();
    const requests = this.rateLimitMap.get(endpoint) || [];
    
    // Remove requests older than 1 minute
    const recentRequests = requests.filter(time => now - time < 60000);
    
    // Allow max 60 requests per minute per endpoint
    if (recentRequests.length >= 60) {
      return false;
    }
    
    recentRequests.push(now);
    this.rateLimitMap.set(endpoint, recentRequests);
    return true;
  }

  private async handleTokenRefresh() {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (refreshToken) {
        const response = await axios.post(`${this.api.defaults.baseURL}/auth/refresh`, {
          refreshToken,
        });
        
        const { token } = response.data;
        await AsyncStorage.setItem('userToken', token);
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Redirect to login
      await AsyncStorage.multiRemove(['userToken', 'refreshToken']);
    }
  }

  private getCacheKey(endpoint: string, params?: any): string {
    return `${endpoint}${params ? JSON.stringify(params) : ''}`;
  }

  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && cached.expiry > Date.now()) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: any, ttl: number = 300000): void {
    // Default TTL: 5 minutes
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl,
    });
  }

  /**
   * Optimized GET request with caching and deduplication
   */
  async get<T = any>(
    endpoint: string,
    params?: any,
    options: { cache?: boolean; cacheTTL?: number } = {}
  ): Promise<T> {
    const cacheKey = this.getCacheKey(endpoint, params);
    
    // Check cache first
    if (options.cache !== false) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }
    }

    // Check if request is already in progress
    if (this.requestQueue.has(cacheKey)) {
      return this.requestQueue.get(cacheKey);
    }

    // Make the request
    const request = this.api.get(endpoint, { params })
      .then((response: AxiosResponse<T>) => {
        const data = response.data;
        
        // Cache successful responses
        if (options.cache !== false) {
          this.setCache(cacheKey, data, options.cacheTTL);
        }
        
        return data;
      })
      .finally(() => {
        this.requestQueue.delete(cacheKey);
      });

    this.requestQueue.set(cacheKey, request);
    return request;
  }

  /**
   * Optimized POST request with request deduplication
   */
  async post<T = any>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const requestKey = `POST:${endpoint}:${JSON.stringify(data)}`;
    
    // Prevent duplicate POST requests
    if (this.requestQueue.has(requestKey)) {
      return this.requestQueue.get(requestKey);
    }

    const request = this.api.post(endpoint, data, config)
      .then((response: AxiosResponse<T>) => response.data)
      .finally(() => {
        // Remove from queue after a short delay to prevent immediate duplicates
        setTimeout(() => {
          this.requestQueue.delete(requestKey);
        }, 1000);
      });

    this.requestQueue.set(requestKey, request);
    return request;
  }

  /**
   * Content generation with optimized caching and queue management
   */
  async generateContent(request: any): Promise<any> {
    // Create cache key based on prompt and settings
    const cacheKey = this.getCacheKey('/api/generate-content', {
      prompt: request.prompt,
      platform: request.platform,
      tone: request.tone,
      contentType: request.contentType,
    });

    // Check for cached response first
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    // Generate new content
    const response = await this.post('/api/generate-content', request);
    
    // Cache the response for 1 hour
    this.setCache(cacheKey, response, 3600000);
    
    return response;
  }

  /**
   * Clear cache for specific patterns or all
   */
  clearCache(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    for (const [key] of this.cache) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics for monitoring
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.get('/health', undefined, { cache: false });
      return true;
    } catch {
      return false;
    }
  }
}

export default new OptimizedBackendAPI();

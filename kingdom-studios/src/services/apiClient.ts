/**
 * Enterprise API Client for Kingdom Studios
 * Production-ready API integration with advanced features
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';

// Types
export interface ApiConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  enableCaching: boolean;
  enableOfflineSupport: boolean;
}

export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
  cached?: boolean;
}

export interface RequestOptions extends AxiosRequestConfig {
  skipAuth?: boolean;
  skipCache?: boolean;
  skipRetry?: boolean;
  silent?: boolean;
}

// API Client Class
export class EnterpriseApiClient {
  private client: AxiosInstance;
  private config: ApiConfig;
  private authToken: string | null = null;
  private refreshToken: string | null = null;
  private retryAttempts: Map<string, number> = new Map();
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();

  constructor(config: Partial<ApiConfig> = {}) {
    this.config = {
      baseURL: __DEV__ 
        ? 'http://localhost:3000' 
        : 'https://api.kingdomstudios.app',
      timeout: 30000,
      retryAttempts: 3,
      retryDelay: 1000,
      enableCaching: true,
      enableOfflineSupport: true,
      ...config,
    };

    this.client = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': `KingdomStudios/${Platform.OS}`,
        'X-Client-Version': '1.0.0',
        'X-Platform': Platform.OS,
      },
    });

    this.setupInterceptors();
    this.loadStoredTokens();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      async (config) => {
        // Add authentication token
        if (this.authToken && !config.headers?.skipAuth) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }

        // Add request timestamp
        config.headers['X-Request-Timestamp'] = new Date().toISOString();

        // Add request ID for tracking
        config.headers['X-Request-ID'] = this.generateRequestId();

        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, {
          params: config.params,
          data: config.data,
        });

        return config;
      },
      (error) => {
        console.error('[API] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log(`[API] Response ${response.status}:`, response.data);
        return response;
      },
      async (error) => {
        console.error('[API] Response error:', error);

        // Handle 401 - Unauthorized (token expired)
        if (error.response?.status === 401 && this.refreshToken) {
          try {
            await this.refreshAuthToken();
            // Retry the original request
            return this.client.request(error.config);
          } catch (refreshError) {
            await this.logout();
            throw refreshError;
          }
        }

        // Handle network errors with retry logic
        if (this.shouldRetry(error)) {
          return this.retryRequest(error.config);
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Load stored authentication tokens
   */
  private async loadStoredTokens(): Promise<void> {
    try {
      const storedAuth = await AsyncStorage.getItem('kingdom_auth');
      if (storedAuth) {
        const { authToken, refreshToken } = JSON.parse(storedAuth);
        this.authToken = authToken;
        this.refreshToken = refreshToken;
      }
    } catch (error) {
      console.error('[API] Failed to load stored tokens:', error);
    }
  }

  /**
   * Store authentication tokens
   */
  private async storeTokens(authToken: string, refreshToken: string): Promise<void> {
    try {
      this.authToken = authToken;
      this.refreshToken = refreshToken;
      await AsyncStorage.setItem('kingdom_auth', JSON.stringify({
        authToken,
        refreshToken,
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.error('[API] Failed to store tokens:', error);
    }
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Check if request should be retried
   */
  private shouldRetry(error: any): boolean {
    const config = error.config;
    if (!config || config.skipRetry) return false;

    const retryableStatus = [408, 429, 500, 502, 503, 504];
    const isRetryableError = error.code === 'NETWORK_ERROR' || 
                           retryableStatus.includes(error.response?.status);

    const currentAttempts = this.retryAttempts.get(config.url) || 0;
    return isRetryableError && currentAttempts < this.config.retryAttempts;
  }

  /**
   * Retry failed request
   */
  private async retryRequest(config: any): Promise<any> {
    const currentAttempts = this.retryAttempts.get(config.url) || 0;
    this.retryAttempts.set(config.url, currentAttempts + 1);

    const delay = this.config.retryDelay * Math.pow(2, currentAttempts); // Exponential backoff
    await new Promise(resolve => setTimeout(resolve, delay));

    console.log(`[API] Retrying request (attempt ${currentAttempts + 1}):`, config.url);
    return this.client.request(config);
  }

  /**
   * Cache management
   */
  private getCacheKey(url: string, params?: any): string {
    return `${url}_${JSON.stringify(params || {})}`;
  }

  private getFromCache(key: string): any | null {
    if (!this.config.enableCaching) return null;

    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > cached.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private setCache(key: string, data: any, ttl: number = 300000): void { // 5 minutes default
    if (!this.config.enableCaching) return;

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Authentication methods
   */
  async login(email: string, password: string): Promise<ApiResponse> {
    try {
      const response = await this.client.post('/auth/login', {
        email,
        password,
      });

      const { authToken, refreshToken, user } = response.data;
      await this.storeTokens(authToken, refreshToken);

      return {
        data: { user, token: authToken },
        success: true,
        message: 'Login successful',
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async register(userData: {
    email: string;
    password: string;
    name: string;
  }): Promise<ApiResponse> {
    try {
      const response = await this.client.post('/auth/register', userData);

      const { authToken, refreshToken, user } = response.data;
      await this.storeTokens(authToken, refreshToken);

      return {
        data: { user, token: authToken },
        success: true,
        message: 'Registration successful',
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  async refreshAuthToken(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await this.client.post('/auth/refresh', {
        refreshToken: this.refreshToken,
      });

      const { authToken, refreshToken } = response.data;
      await this.storeTokens(authToken, refreshToken);
    } catch (error) {
      await this.logout();
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      if (this.authToken) {
        await this.client.post('/auth/logout', {}, {
          headers: { Authorization: `Bearer ${this.authToken}` },
        });
      }
    } catch (error) {
      console.error('[API] Logout error:', error);
    } finally {
      this.authToken = null;
      this.refreshToken = null;
      await AsyncStorage.removeItem('kingdom_auth');
      this.cache.clear();
    }
  }

  /**
   * Generic API methods
   */
  async get<T = any>(
    endpoint: string, 
    params?: any, 
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const cacheKey = this.getCacheKey(endpoint, params);
    
    // Check cache first
    if (!options.skipCache) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return {
          data: cached,
          success: true,
          cached: true,
          timestamp: new Date().toISOString(),
        };
      }
    }

    try {
      const response = await this.client.get(endpoint, { 
        params, 
        ...options 
      });

      // Cache successful responses
      if (response.status === 200) {
        this.setCache(cacheKey, response.data);
      }

      return {
        data: response.data,
        success: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Request failed');
    }
  }

  async post<T = any>(
    endpoint: string, 
    data?: any, 
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post(endpoint, data, options);
      return {
        data: response.data,
        success: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Request failed');
    }
  }

  async put<T = any>(
    endpoint: string, 
    data?: any, 
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put(endpoint, data, options);
      return {
        data: response.data,
        success: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Request failed');
    }
  }

  async delete<T = any>(
    endpoint: string, 
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete(endpoint, options);
      return {
        data: response.data,
        success: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Request failed');
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/health', { 
        timeout: 10000,
        skipAuth: true 
      } as any);
      return response.status === 200;
    } catch (error) {
      console.error('[API] Health check failed:', error);
      return false;
    }
  }

  /**
   * Get current auth status
   */
  isAuthenticated(): boolean {
    return !!this.authToken;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache stats
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Create singleton instance
export const apiClient = new EnterpriseApiClient();

// Export default instance
export default apiClient;

import { Environment } from '../config/environment';

/**
 * Backend API Service
 * Handles all communication with the Kingdom Studios backend server
 */

// Get the backend URL from environment or use localhost for development
const BACKEND_URL = Environment.get().API_BASE_URL || 'http://localhost:3000/api/v1';

// Storage for JWT token
let authToken: string | null = null;

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: any[];
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  faithMode: boolean;
  preferences?: {
    contentFiltering: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
    theme: string;
    language: string;
  };
  subscription?: {
    plan: string;
    status: string;
    currentPeriodStart?: string;
    currentPeriodEnd?: string;
  };
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface ContentRequest {
  type: 'text' | 'image' | 'video';
  prompt: string;
  faithMode: boolean;
  platform?: string;
  settings?: Record<string, any>;
}

export interface GeneratedContent {
  id: string;
  type: string;
  content: string;
  metadata: Record<string, any>;
  createdAt: string;
  userId: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  platform: 'etsy' | 'shopify' | 'printify' | 'amazon';
  images: string[];
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  createdAt: string;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  clientSecret: string;
  status: string;
}

export interface AnalyticsEvent {
  name: string;
  properties: Record<string, any>;
  userId?: string;
  timestamp?: number;
}

/**
 * Helper function to make HTTP requests
 */
async function makeRequest(endpoint: string, options: RequestInit = {}): Promise<APIResponse> {
  try {
    const url = `${BACKEND_URL}${endpoint}`;
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Add auth token if available
    if (authToken) {
      defaultHeaders.Authorization = `Bearer ${authToken}`;
    }
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Authentication Service
 */
const AuthAPI = {
  /**
   * Set the authentication token
   */
  setToken(token: string) {
    authToken = token;
  },
  
  /**
   * Get the current authentication token
   */
  getToken(): string | null {
    return authToken;
  },
  
  /**
   * Clear the authentication token
   */
  clearToken() {
    authToken = null;
  },
  
  /**
   * Register a new user
   */
  async register(
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    faithMode: boolean = false
  ): Promise<APIResponse<AuthResponse>> {
    try {
      const response = await makeRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ 
          email, 
          password, 
          firstName, 
          lastName, 
          faithMode 
        }),
      });
      
      if (response.success && response.token) {
        authToken = response.token;
      }
      
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      };
    }
  },
  
  /**
   * Login user
   */
  async login(email: string, password: string): Promise<APIResponse<AuthResponse>> {
    try {
      const response = await makeRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      if (response.success && response.token) {
        authToken = response.token;
      }
      
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
      };
    }
  },
  
  /**
   * Logout user
   */
  async logout(): Promise<APIResponse> {
    try {
      const response = await makeRequest('/auth/logout', {
        method: 'POST',
      });
      
      authToken = null;
      return response;
    } catch (error) {
      authToken = null; // Clear token even if request fails
      return {
        success: true, // Logout should always succeed locally
        message: 'Logged out successfully',
      };
    }
  },
  
  /**
   * Get current user profile
   */
  async getProfile(): Promise<APIResponse<{ user: User }>> {
    try {
      return await makeRequest('/auth/me');
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get profile',
      };
    }
  },
  
  /**
   * Update user profile
   */
  async updateProfile(updates: Partial<User>): Promise<APIResponse<{ user: User }>> {
    try {
      return await makeRequest('/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update profile',
      };
    }
  },
  
  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<APIResponse<AuthResponse>> {
    try {
      const response = await makeRequest('/auth/refresh', {
        method: 'POST',
      });
      
      if (response.success && response.token) {
        authToken = response.token;
      }
      
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to refresh token',
      };
    }
  },
};
  
  async logout(): Promise<APIResponse> {
    try {
      const response = await this.makeRequest('/auth/logout', {
        method: 'POST',
      });
      
      this.clearAuthToken();
      return response;
    } catch (error) {
      this.clearAuthToken();
      return this.handleError(error);
    }
  }
  
  // User Profile Methods
  async getUserProfile(): Promise<APIResponse<User>> {
    try {
      return await this.makeRequest('/user/profile');
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  async updateUserProfile(updates: Partial<User>): Promise<APIResponse<User>> {
    try {
      return await this.makeRequest('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  // AI Content Generation Methods
  async generateContent(request: ContentRequest): Promise<APIResponse<GeneratedContent>> {
    try {
      return await this.makeRequest('/ai/generate', {
        method: 'POST',
        body: JSON.stringify(request),
      });
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  async getContentHistory(limit = 20, offset = 0): Promise<APIResponse<GeneratedContent[]>> {
    try {
      return await this.makeRequest(`/ai/history?limit=${limit}&offset=${offset}`);
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  async deleteGeneratedContent(contentId: string): Promise<APIResponse> {
    try {
      return await this.makeRequest(`/ai/content/${contentId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  // Product Management Methods
  async getProducts(platform?: string): Promise<APIResponse<Product[]>> {
    try {
      const query = platform ? `?platform=${platform}` : '';
      return await this.makeRequest(`/products${query}`);
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  async createProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<APIResponse<Product>> {
    try {
      return await this.makeRequest('/products', {
        method: 'POST',
        body: JSON.stringify(product),
      });
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  async updateProduct(productId: string, updates: Partial<Product>): Promise<APIResponse<Product>> {
    try {
      return await this.makeRequest(`/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  async deleteProduct(productId: string): Promise<APIResponse> {
    try {
      return await this.makeRequest(`/products/${productId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  async syncProductToPlatform(productId: string, platform: string): Promise<APIResponse> {
    try {
      return await this.makeRequest(`/products/${productId}/sync`, {
        method: 'POST',
        body: JSON.stringify({ platform }),
      });
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  // Payment Methods
  async createPaymentIntent(amount: number, currency = 'usd'): Promise<APIResponse<PaymentIntent>> {
    try {
      return await this.makeRequest('/payments/create-intent', {
        method: 'POST',
        body: JSON.stringify({ amount, currency }),
      });
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  async confirmPayment(paymentIntentId: string): Promise<APIResponse> {
    try {
      return await this.makeRequest('/payments/confirm', {
        method: 'POST',
        body: JSON.stringify({ paymentIntentId }),
      });
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  async getPaymentHistory(): Promise<APIResponse<any[]>> {
    try {
      return await this.makeRequest('/payments/history');
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  // Analytics Methods
  async trackEvent(event: AnalyticsEvent): Promise<APIResponse> {
    try {
      return await this.makeRequest('/analytics/track', {
        method: 'POST',
        body: JSON.stringify(event),
      });
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  async getAnalytics(timeRange: string): Promise<APIResponse<any>> {
    try {
      return await this.makeRequest(`/analytics/dashboard?timeRange=${timeRange}`);
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  // Platform Integration Methods
  async connectPlatform(platform: string, credentials: Record<string, any>): Promise<APIResponse> {
    try {
      return await this.makeRequest('/integrations/connect', {
        method: 'POST',
        body: JSON.stringify({ platform, credentials }),
      });
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  async disconnectPlatform(platform: string): Promise<APIResponse> {
    try {
      return await this.makeRequest(`/integrations/disconnect`, {
        method: 'POST',
        body: JSON.stringify({ platform }),
      });
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  async getPlatformStatus(): Promise<APIResponse<Record<string, boolean>>> {
    try {
      return await this.makeRequest('/integrations/status');
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  // Notification Methods
  async registerForPushNotifications(token: string): Promise<APIResponse> {
    try {
      return await this.makeRequest('/notifications/register', {
        method: 'POST',
        body: JSON.stringify({ token }),
      });
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  async getNotificationSettings(): Promise<APIResponse<any>> {
    try {
      return await this.makeRequest('/notifications/settings');
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  async updateNotificationSettings(settings: Record<string, any>): Promise<APIResponse> {
    try {
      return await this.makeRequest('/notifications/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  // File Upload Methods
  async uploadFile(file: File | Blob, path: string): Promise<APIResponse<{ url: string }>> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', path);
      
      return await this.makeRequest('/upload', {
        method: 'POST',
        body: formData,
        isFormData: true,
      });
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  // Health Check
  async healthCheck(): Promise<APIResponse> {
    try {
      return await this.makeRequest('/health');
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  // Private Helper Methods
  private async makeRequest(
    endpoint: string, 
    options: RequestInit & { isFormData?: boolean } = {}
  ): Promise<APIResponse> {
    const url = `${this.baseURL}${endpoint}`;
    const { isFormData, ...fetchOptions } = options;
    
    const defaultHeaders: Record<string, string> = {
      'X-API-Key': this.apiKey,
    };
    
    if (this.authToken) {
      defaultHeaders['Authorization'] = `Bearer ${this.authToken}`;
    }
    
    if (!isFormData) {
      defaultHeaders['Content-Type'] = 'application/json';
    }
    
    const requestOptions: RequestInit = {
      ...fetchOptions,
      headers: {
        ...defaultHeaders,
        ...fetchOptions.headers,
      },
    };
    
    if (Environment.isDebugEnabled()) {
      console.log(`[API] ${requestOptions.method || 'GET'} ${url}`, {
        headers: requestOptions.headers,
        body: requestOptions.body && !isFormData ? JSON.parse(requestOptions.body as string) : '[FormData]',
      });
    }
    
    const response = await fetch(url, requestOptions);
    const data = await response.json();
    
    if (Environment.isDebugEnabled()) {
      console.log(`[API] Response:`, data);
    }
    
    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return data;
  }
  
  private handleError(error: any): APIResponse {
    const errorMessage = error.message || 'An unexpected error occurred';
    
    if (Environment.isDebugEnabled()) {
      console.error('[API] Error:', error);
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
  
  private setAuthToken(token: string): void {
    this.authToken = token;
    // Store in secure storage if needed
  }
  
  private clearAuthToken(): void {
    this.authToken = null;
    // Clear from secure storage if needed
  }
  
  // Mock responses for development
  private getMockResponse<T>(data: T): APIResponse<T> {
    if (Environment.areMocksEnabled()) {
      return {
        success: true,
        data,
        message: 'Mock response - API not configured',
      };
    }
    
    return {
      success: false,
      error: 'API not configured and mocks are disabled',
    };
  }
}

/**
 * Content Generation Service
 */
const ContentAPI = {
  /**
   * Generate content using AI
   */
  async generateContent(request: ContentRequest): Promise<APIResponse<{ data: GeneratedContent }>> {
    try {
      return await makeRequest('/content/generate', {
        method: 'POST',
        body: JSON.stringify(request),
      });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Content generation failed',
      };
    }
  },
  
  /**
   * Get content generation history
   */
  async getContentHistory(
    limit: number = 20, 
    offset: number = 0, 
    type?: string
  ): Promise<APIResponse<{ data: GeneratedContent[] }>> {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      });
      
      if (type) {
        params.append('type', type);
      }
      
      return await makeRequest(`/content/history?${params.toString()}`);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get content history',
      };
    }
  },
  
  /**
   * Delete generated content
   */
  async deleteContent(contentId: string): Promise<APIResponse> {
    try {
      return await makeRequest(`/content/${contentId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete content',
      };
    }
  },
  
  /**
   * Save content to favorites or collection
   */
  async saveContent(contentId: string, collection?: string): Promise<APIResponse> {
    try {
      return await makeRequest(`/content/${contentId}/save`, {
        method: 'POST',
        body: JSON.stringify({ collection }),
      });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to save content',
      };
    }
  },
};

/**
 * Analytics Service
 */
const AnalyticsAPI = {
  /**
   * Track custom analytics event
   */
  async trackEvent(event: AnalyticsEvent): Promise<APIResponse> {
    try {
      return await makeRequest('/analytics/track', {
        method: 'POST',
        body: JSON.stringify({
          name: event.name,
          properties: event.properties,
          timestamp: event.timestamp || Date.now(),
        }),
      });
    } catch (error) {
      // Analytics failures shouldn't break the app
      console.warn('Analytics tracking failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Analytics tracking failed',
      };
    }
  },
  
  /**
   * Get analytics overview
   */
  async getOverview(dateRange?: { start: string; end: string }): Promise<APIResponse> {
    try {
      const params = dateRange 
        ? new URLSearchParams({
            start: dateRange.start,
            end: dateRange.end,
          })
        : '';
      
      const endpoint = params ? `/analytics/overview?${params.toString()}` : '/analytics/overview';
      return await makeRequest(endpoint);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get analytics overview',
      };
    }
  },
};

/**
 * API Health Check
 */
const SystemAPI = {
  /**
   * Check API health and status
   */
  async healthCheck(): Promise<APIResponse> {
    try {
      // Use the health endpoint without the /api/v1 prefix
      const url = BACKEND_URL.replace('/api/v1', '/health');
      const response = await fetch(url);
      const data = await response.json();
      
      return {
        success: response.ok,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Health check failed',
      };
    }
  },
  
  /**
   * Get API documentation
   */
  async getApiDocs(): Promise<APIResponse> {
    try {
      return await makeRequest('/docs');
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get API documentation',
      };
    }
  },
};

// Legacy support - maintain backward compatibility
export class BackendAPIService {
  // Delegate to the new functional APIs
  async login(email: string, password: string) {
    return AuthAPI.login(email, password);
  }
  
  async register(email: string, password: string, firstName: string, lastName: string, faithMode?: boolean) {
    return AuthAPI.register(email, password, firstName, lastName, faithMode);
  }
  
  async generateContent(request: ContentRequest) {
    return ContentAPI.generateContent(request);
  }
  
  async trackEvent(event: AnalyticsEvent) {
    return AnalyticsAPI.trackEvent(event);
  }
  
  setAuthToken(token: string) {
    AuthAPI.setToken(token);
  }
  
  clearAuthToken() {
    AuthAPI.clearToken();
  }
}

// Create singleton instance for backward compatibility
const backendAPI = new BackendAPIService();

// Export both functional APIs and legacy class instance
export default backendAPI;
export { 
  AuthAPI, 
  ContentAPI, 
  AnalyticsAPI, 
  SystemAPI,
  type APIResponse,
  type User,
  type AuthResponse,
  type ContentRequest,
  type GeneratedContent,
  type AnalyticsEvent,
};

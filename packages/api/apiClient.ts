import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

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

class ApiClient {
    private client: AxiosInstance;
    private config: ApiConfig;
    private authToken: string | null = null;
    private refreshToken: string | null = null;
    private retryAttempts: Map<string, number> = new Map();
    private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();

    constructor(config: Partial<ApiConfig> = {}) {
        this.config = {
            baseURL: __DEV__ ? 'http://localhost:3000' : 'https://api.kingdomstudios.app',
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
    private setupInterceptors(): void {
        this.client.interceptors.request.use(
            async (config) => {
                if (this.authToken && !config.headers?.skipAuth) {
                    config.headers.Authorization = `Bearer ${this.authToken}`;
                }
                config.headers['X-Request-Timestamp'] = new Date().toISOString();
                config.headers['X-Request-ID'] = this.generateRequestId();
                return config;
            },
            (error) => Promise.reject(error)
        );
        this.client.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response?.status === 401 && this.refreshToken) {
                    try {
                        await this.refreshAuthToken();
                        return this.client.request(error.config);
                    } catch (refreshError) {
                        await this.logout();
                        throw refreshError;
                    }
                }
                if (this.shouldRetry(error)) {
                    return this.retryRequest(error.config);
                }
                return Promise.reject(error);
            }
        );
    }
    private async loadStoredTokens(): Promise<void> {
        try {
            const storedAuth = await AsyncStorage.getItem('kingdom_auth');
            if (storedAuth) {
                const { authToken, refreshToken } = JSON.parse(storedAuth);
                this.authToken = authToken;
                this.refreshToken = refreshToken;
            }
        } catch { }
    }
    private async storeTokens(authToken: string, refreshToken: string): Promise<void> {
        try {
            this.authToken = authToken;
            this.refreshToken = refreshToken;
            await AsyncStorage.setItem('kingdom_auth', JSON.stringify({ authToken, refreshToken, timestamp: Date.now() }));
        } catch { }
    }
    private generateRequestId(): string {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    private shouldRetry(error: any): boolean {
        const config = error.config;
        if (!config || config.skipRetry) return false;
        const retryableStatus = [408, 429, 500, 502, 503, 504];
        const isRetryableError = error.code === 'NETWORK_ERROR' || retryableStatus.includes(error.response?.status);
        const currentAttempts = this.retryAttempts.get(config.url) || 0;
        return isRetryableError && currentAttempts < this.config.retryAttempts;
    }
    private async retryRequest(config: any): Promise<any> {
        const currentAttempts = this.retryAttempts.get(config.url) || 0;
        this.retryAttempts.set(config.url, currentAttempts + 1);
        const delay = this.config.retryDelay * Math.pow(2, currentAttempts);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.client.request(config);
    }
    async post<T = any>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<ApiResponse<T>> {
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
    async get<T = any>(endpoint: string, params?: any, options: RequestOptions = {}): Promise<ApiResponse<T>> {
        try {
            const response = await this.client.get(endpoint, { params, ...options });
            return {
                data: response.data,
                success: true,
                timestamp: new Date().toISOString(),
            };
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Request failed');
        }
    }
}

export const apiClient = new ApiClient(); 
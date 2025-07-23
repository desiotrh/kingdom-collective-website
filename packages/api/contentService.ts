import { apiClient, ApiResponse } from './apiClient';

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

export class ContentService {
    private static instance: ContentService;
    private cache: Map<string, { data: any; timestamp: number }> = new Map();
    private readonly CACHE_TTL = 300000; // 5 minutes

    private constructor() { }

    static getInstance(): ContentService {
        if (!ContentService.instance) {
            ContentService.instance = new ContentService();
        }
        return ContentService.instance;
    }

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
    }
} 
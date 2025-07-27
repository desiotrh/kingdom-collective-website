import { Environment } from '../config/environment';
import { AnalyticsTracking } from './analyticsService';
import { BackendAPI } from './apiService';

export interface ImageGenerationRequest {
    prompt: string;
    style: 'realistic' | 'artistic' | 'prophetic' | 'faith-inspired';
    dimensions: '16:9' | '9:16' | '1:1' | '4:5' | 'custom';
    useCase: 'reels' | 'thumbnails' | 'mockups' | 'prophetic' | 'social-media';
    faithMode: boolean;
    refinementLevel: number;
}

export interface ImageGenerationResult {
    url: string;
    generationTime: number;
    model: string;
    cost: number;
    metadata: {
        prompt: string;
        style: string;
        dimensions: string;
        useCase: string;
        faithMode: boolean;
        refinementLevel: number;
    };
}

export class AIImageService {
    private falApiKey: string | null = null;
    private openaiApiKey: string | null = null;
    private isInitialized: boolean = false;

    constructor() {
        this.initialize();
    }

    private async initialize() {
        // Initialize API keys from environment
        this.falApiKey = Environment.get().FAL_API_KEY || null;
        this.openaiApiKey = Environment.get().OPENAI_API_KEY || null;
        this.isInitialized = true;

        console.log('[AI Image Service] Initialized with:', {
            falConfigured: !!this.falApiKey,
            openaiConfigured: !!this.openaiApiKey,
        });
    }

    /**
     * Generate image using AI services with fallback options
     */
    async generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResult> {
        const startTime = Date.now();

        try {
            // Track generation start
            await AnalyticsTracking.trackUserAction('image_generation_started', {
                style: request.style,
                dimensions: request.dimensions,
                useCase: request.useCase,
                faithMode: request.faithMode,
                refinementLevel: request.refinementLevel,
            });

            // Try backend API first for advanced features and caching
            if (Environment.get().API_BASE_URL) {
                try {
                    const backendResponse = await BackendAPI.generateImage(request);

                    if (backendResponse.success && backendResponse.data) {
                        const generationTime = Date.now() - startTime;

                        await AnalyticsTracking.trackImageGeneration(true, {
                            generation_time_ms: generationTime,
                            method: 'backend_api',
                            style: request.style,
                            faithMode: request.faithMode,
                        });

                        return {
                            url: backendResponse.data.url,
                            generationTime,
                            model: backendResponse.data.model || 'backend-api',
                            cost: backendResponse.data.cost || 0,
                            metadata: {
                                prompt: request.prompt,
                                style: request.style,
                                dimensions: request.dimensions,
                                useCase: request.useCase,
                                faithMode: request.faithMode,
                                refinementLevel: request.refinementLevel,
                            },
                        };
                    }
                } catch (backendError) {
                    if (Environment.isDebugEnabled()) {
                        console.warn('[AI Image Service] Backend generation failed, falling back to direct API:', backendError);
                    }
                }
            }

            // Fallback to direct API calls
            let result: ImageGenerationResult;
            let method: string;

            if (this.falApiKey) {
                result = await this.generateWithFal(request);
                method = 'fal_direct';
            } else if (this.openaiApiKey) {
                result = await this.generateWithOpenAI(request);
                method = 'openai_direct';
            } else {
                // Use mock generation if no APIs are configured
                if (Environment.areMocksEnabled()) {
                    result = await this.generateMockImage(request);
                    method = 'mock';
                } else {
                    throw new Error('No AI image service configured and mocks are disabled');
                }
            }

            const generationTime = Date.now() - startTime;

            // Track successful generation
            await AnalyticsTracking.trackImageGeneration(true, {
                generation_time_ms: generationTime,
                method,
                style: request.style,
                faithMode: request.faithMode,
            });

            return {
                ...result,
                generationTime,
            };

        } catch (error) {
            const generationTime = Date.now() - startTime;

            // Track failed generation
            await AnalyticsTracking.trackImageGeneration(false, {
                generation_time_ms: generationTime,
                error: error instanceof Error ? error.message : 'Unknown error',
                style: request.style,
                faithMode: request.faithMode,
            });

            await AnalyticsTracking.trackError(
                error instanceof Error ? error.message : 'Image generation failed',
                {
                    style: request.style,
                    faithMode: request.faithMode,
                }
            );

            throw error;
        }
    }

    /**
     * Generate image using Fal.ai API
     */
    private async generateWithFal(request: ImageGenerationRequest): Promise<ImageGenerationResult> {
        if (!this.falApiKey) {
            throw new Error('Fal.ai API key not configured');
        }

        const enhancedPrompt = this.enhancePromptForFal(request);
        const imageSize = this.getImageSize(request.dimensions);

        try {
            const response = await fetch('https://fal.run/fal-ai/fast-sdxl', {
                method: 'POST',
                headers: {
                    'Authorization': `Key ${this.falApiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: enhancedPrompt,
                    image_size: imageSize,
                    num_inference_steps: Math.max(20, Math.floor(request.refinementLevel / 5)),
                    guidance_scale: 7.5,
                    sync_mode: true,
                }),
            });

            if (!response.ok) {
                throw new Error(`Fal.ai API error: ${response.status}`);
            }

            const data = await response.json();

            return {
                url: data.images[0]?.url || '',
                generationTime: 0, // Will be set by caller
                model: 'fal-fast-sdxl',
                cost: 0.01, // Approximate cost per generation
                metadata: {
                    prompt: request.prompt,
                    style: request.style,
                    dimensions: request.dimensions,
                    useCase: request.useCase,
                    faithMode: request.faithMode,
                    refinementLevel: request.refinementLevel,
                },
            };
        } catch (error) {
            console.error('[AI Image Service] Fal.ai API error:', error);
            throw new Error('Failed to generate image with Fal.ai');
        }
    }

    /**
     * Generate image using OpenAI DALL-E API
     */
    private async generateWithOpenAI(request: ImageGenerationRequest): Promise<ImageGenerationResult> {
        if (!this.openaiApiKey) {
            throw new Error('OpenAI API key not configured');
        }

        const enhancedPrompt = this.enhancePromptForOpenAI(request);
        const imageSize = this.getImageSize(request.dimensions);

        try {
            const response = await fetch('https://api.openai.com/v1/images/generations', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.openaiApiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: enhancedPrompt,
                    n: 1,
                    size: imageSize,
                    quality: request.refinementLevel > 70 ? 'hd' : 'standard',
                    style: request.style === 'realistic' ? 'natural' : 'vivid',
                }),
            });

            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.status}`);
            }

            const data = await response.json();

            return {
                url: data.data[0]?.url || '',
                generationTime: 0, // Will be set by caller
                model: 'dall-e-3',
                cost: 0.04, // Approximate cost per generation
                metadata: {
                    prompt: request.prompt,
                    style: request.style,
                    dimensions: request.dimensions,
                    useCase: request.useCase,
                    faithMode: request.faithMode,
                    refinementLevel: request.refinementLevel,
                },
            };
        } catch (error) {
            console.error('[AI Image Service] OpenAI API error:', error);
            throw new Error('Failed to generate image with OpenAI');
        }
    }

    /**
     * Generate mock image for testing
     */
    private async generateMockImage(request: ImageGenerationRequest): Promise<ImageGenerationResult> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

        // Generate mock image URL based on style
        const mockImages = {
            'realistic': 'https://picsum.photos/512/512?random=1',
            'artistic': 'https://picsum.photos/512/512?random=2',
            'prophetic': 'https://picsum.photos/512/512?random=3',
            'faith-inspired': 'https://picsum.photos/512/512?random=4',
        };

        return {
            url: mockImages[request.style] || mockImages['faith-inspired'],
            generationTime: 0, // Will be set by caller
            model: 'mock-dall-e-3',
            cost: 0.01,
            metadata: {
                prompt: request.prompt,
                style: request.style,
                dimensions: request.dimensions,
                useCase: request.useCase,
                faithMode: request.faithMode,
                refinementLevel: request.refinementLevel,
            },
        };
    }

    /**
     * Enhance prompt for Fal.ai
     */
    private enhancePromptForFal(request: ImageGenerationRequest): string {
        let enhancedPrompt = request.prompt;

        // Add style-specific enhancements
        switch (request.style) {
            case 'realistic':
                enhancedPrompt += ', highly detailed, photorealistic, professional photography';
                break;
            case 'artistic':
                enhancedPrompt += ', artistic style, creative composition, beautiful colors';
                break;
            case 'prophetic':
                enhancedPrompt += ', spiritual atmosphere, divine light, heavenly glow, prophetic vision';
                break;
            case 'faith-inspired':
                enhancedPrompt += ', inspiring, uplifting, faith-based, Kingdom values, spiritual beauty';
                break;
        }

        // Add faith mode enhancements
        if (request.faithMode) {
            enhancedPrompt += ', Christian values, biblical inspiration, Kingdom perspective';
        }

        // Add use case specific enhancements
        switch (request.useCase) {
            case 'reels':
                enhancedPrompt += ', vertical composition, social media optimized';
                break;
            case 'thumbnails':
                enhancedPrompt += ', eye-catching, click-worthy, high contrast';
                break;
            case 'mockups':
                enhancedPrompt += ', clean design, professional layout';
                break;
            case 'prophetic':
                enhancedPrompt += ', spiritual symbolism, divine revelation';
                break;
            case 'social-media':
                enhancedPrompt += ', social media friendly, engaging composition';
                break;
        }

        return enhancedPrompt;
    }

    /**
     * Enhance prompt for OpenAI DALL-E
     */
    private enhancePromptForOpenAI(request: ImageGenerationRequest): string {
        let enhancedPrompt = request.prompt;

        // Add style-specific enhancements
        switch (request.style) {
            case 'realistic':
                enhancedPrompt += ', highly detailed, photorealistic, professional photography';
                break;
            case 'artistic':
                enhancedPrompt += ', artistic style, creative composition, beautiful colors';
                break;
            case 'prophetic':
                enhancedPrompt += ', spiritual atmosphere, divine light, heavenly glow, prophetic vision';
                break;
            case 'faith-inspired':
                enhancedPrompt += ', inspiring, uplifting, faith-based, Kingdom values, spiritual beauty';
                break;
        }

        // Add faith mode enhancements
        if (request.faithMode) {
            enhancedPrompt += ', Christian values, biblical inspiration, Kingdom perspective';
        }

        return enhancedPrompt;
    }

    /**
     * Get image size based on dimensions
     */
    private getImageSize(dimensions: string): string {
        switch (dimensions) {
            case '16:9':
                return '1792x1024';
            case '9:16':
                return '1024x1792';
            case '1:1':
                return '1024x1024';
            case '4:5':
                return '1024x1280';
            default:
                return '1024x1024';
        }
    }

    /**
     * Check if service is available
     */
    isAvailable(): boolean {
        return this.isInitialized && (!!this.falApiKey || !!this.openaiApiKey || Environment.areMocksEnabled());
    }

    /**
     * Get service status
     */
    getStatus(): {
        falConfigured: boolean;
        openaiConfigured: boolean;
        mocksEnabled: boolean;
    } {
        return {
            falConfigured: !!this.falApiKey,
            openaiConfigured: !!this.openaiApiKey,
            mocksEnabled: Environment.areMocksEnabled(),
        };
    }
} 
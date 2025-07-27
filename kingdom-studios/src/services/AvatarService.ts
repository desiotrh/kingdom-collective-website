import { Environment } from '../config/environment';
import { AnalyticsTracking } from './analyticsService';
import { BackendAPI } from './apiService';

export interface AvatarGenerationRequest {
    images: string[];
    style: 'professional' | 'casual' | 'faith-inspired' | 'branding';
    purpose: 'profile' | 'talking' | 'branding';
    consentGiven: boolean;
    faithMode: boolean;
}

export interface AvatarGenerationResult {
    url: string;
    generationTime: number;
    model: string;
    cost: number;
    metadata: {
        style: string;
        purpose: string;
        consentGiven: boolean;
        faithMode: boolean;
        imageCount: number;
    };
}

export class AvatarService {
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

        console.log('[Avatar Service] Initialized with:', {
            falConfigured: !!this.falApiKey,
            openaiConfigured: !!this.openaiApiKey,
        });
    }

    /**
     * Generate avatar using AI services with consent validation
     */
    async generateAvatar(request: AvatarGenerationRequest): Promise<AvatarGenerationResult> {
        const startTime = Date.now();

        // Validate consent
        if (!request.consentGiven) {
            throw new Error('User consent is required for avatar generation');
        }

        // Validate image count
        if (request.images.length < 3) {
            throw new Error('At least 3 photos are required for avatar generation');
        }

        if (request.images.length > 5) {
            throw new Error('Maximum 5 photos allowed for avatar generation');
        }

        try {
            // Track generation start
            await AnalyticsTracking.trackUserAction('avatar_generation_started', {
                style: request.style,
                purpose: request.purpose,
                faithMode: request.faithMode,
                imageCount: request.images.length,
                consentGiven: request.consentGiven,
            });

            // Try backend API first for advanced features and caching
            if (Environment.get().API_BASE_URL) {
                try {
                    const backendResponse = await BackendAPI.generateAvatar(request);

                    if (backendResponse.success && backendResponse.data) {
                        const generationTime = Date.now() - startTime;

                        await AnalyticsTracking.trackAvatarGeneration(true, {
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
                                style: request.style,
                                purpose: request.purpose,
                                consentGiven: request.consentGiven,
                                faithMode: request.faithMode,
                                imageCount: request.images.length,
                            },
                        };
                    }
                } catch (backendError) {
                    if (Environment.isDebugEnabled()) {
                        console.warn('[Avatar Service] Backend generation failed, falling back to direct API:', backendError);
                    }
                }
            }

            // Fallback to direct API calls
            let result: AvatarGenerationResult;
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
                    result = await this.generateMockAvatar(request);
                    method = 'mock';
                } else {
                    throw new Error('No AI avatar service configured and mocks are disabled');
                }
            }

            const generationTime = Date.now() - startTime;

            // Track successful generation
            await AnalyticsTracking.trackAvatarGeneration(true, {
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
            await AnalyticsTracking.trackAvatarGeneration(false, {
                generation_time_ms: generationTime,
                error: error instanceof Error ? error.message : 'Unknown error',
                style: request.style,
                faithMode: request.faithMode,
            });

            await AnalyticsTracking.trackError(
                error instanceof Error ? error.message : 'Avatar generation failed',
                {
                    style: request.style,
                    faithMode: request.faithMode,
                }
            );

            throw error;
        }
    }

    /**
     * Generate avatar using Fal.ai API
     */
    private async generateWithFal(request: AvatarGenerationRequest): Promise<AvatarGenerationResult> {
        if (!this.falApiKey) {
            throw new Error('Fal.ai API key not configured');
        }

        try {
            // Convert images to base64 for API
            const imageData = await this.prepareImagesForAPI(request.images);

            const response = await fetch('https://fal.run/fal-ai/instant-id', {
                method: 'POST',
                headers: {
                    'Authorization': `Key ${this.falApiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    input: {
                        image: imageData[0], // Use first image as reference
                        prompt: this.enhancePromptForFal(request),
                        num_steps: 50,
                        guidance_scale: 7.5,
                        style_strength_ratio: 0.8,
                    },
                }),
            });

            if (!response.ok) {
                throw new Error(`Fal.ai API error: ${response.status}`);
            }

            const data = await response.json();

            return {
                url: data.images[0]?.url || '',
                generationTime: 0, // Will be set by caller
                model: 'fal-instant-id',
                cost: 0.05, // Approximate cost per generation
                metadata: {
                    style: request.style,
                    purpose: request.purpose,
                    consentGiven: request.consentGiven,
                    faithMode: request.faithMode,
                    imageCount: request.images.length,
                },
            };
        } catch (error) {
            console.error('[Avatar Service] Fal.ai API error:', error);
            throw new Error('Failed to generate avatar with Fal.ai');
        }
    }

    /**
     * Generate avatar using OpenAI API
     */
    private async generateWithOpenAI(request: AvatarGenerationRequest): Promise<AvatarGenerationResult> {
        if (!this.openaiApiKey) {
            throw new Error('OpenAI API key not configured');
        }

        try {
            const response = await fetch('https://api.openai.com/v1/images/generations', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.openaiApiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: this.enhancePromptForOpenAI(request),
                    n: 1,
                    size: '1024x1024',
                    quality: 'hd',
                    style: 'natural',
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
                cost: 0.08, // Approximate cost per generation
                metadata: {
                    style: request.style,
                    purpose: request.purpose,
                    consentGiven: request.consentGiven,
                    faithMode: request.faithMode,
                    imageCount: request.images.length,
                },
            };
        } catch (error) {
            console.error('[Avatar Service] OpenAI API error:', error);
            throw new Error('Failed to generate avatar with OpenAI');
        }
    }

    /**
     * Generate mock avatar for testing
     */
    private async generateMockAvatar(request: AvatarGenerationRequest): Promise<AvatarGenerationResult> {
        // Simulate API delay (avatar generation takes longer)
        await new Promise(resolve => setTimeout(resolve, 5000 + Math.random() * 5000));

        // Generate mock avatar URL based on style
        const mockAvatars = {
            'professional': 'https://picsum.photos/512/512?random=10',
            'casual': 'https://picsum.photos/512/512?random=11',
            'faith-inspired': 'https://picsum.photos/512/512?random=12',
            'branding': 'https://picsum.photos/512/512?random=13',
        };

        return {
            url: mockAvatars[request.style] || mockAvatars['faith-inspired'],
            generationTime: 0, // Will be set by caller
            model: 'mock-instant-id',
            cost: 0.05,
            metadata: {
                style: request.style,
                purpose: request.purpose,
                consentGiven: request.consentGiven,
                faithMode: request.faithMode,
                imageCount: request.images.length,
            },
        };
    }

    /**
     * Prepare images for API (convert to base64)
     */
    private async prepareImagesForAPI(images: string[]): Promise<string[]> {
        // This would convert images to base64 format for API
        // For now, return mock data
        return images.map(() => 'mock_base64_data');
    }

    /**
     * Enhance prompt for Fal.ai
     */
    private enhancePromptForFal(request: AvatarGenerationRequest): string {
        let prompt = 'Create a realistic avatar portrait';

        // Add style-specific enhancements
        switch (request.style) {
            case 'professional':
                prompt += ', professional appearance, business attire, confident pose';
                break;
            case 'casual':
                prompt += ', casual appearance, friendly expression, approachable';
                break;
            case 'faith-inspired':
                prompt += ', spiritual presence, inspiring expression, Kingdom values';
                break;
            case 'branding':
                prompt += ', brand-consistent appearance, professional yet approachable';
                break;
        }

        // Add purpose-specific enhancements
        switch (request.purpose) {
            case 'profile':
                prompt += ', perfect for social media profiles, clear and recognizable';
                break;
            case 'talking':
                prompt += ', expressive face, perfect for video content, engaging';
                break;
            case 'branding':
                prompt += ', consistent with brand identity, professional and trustworthy';
                break;
        }

        // Add faith mode enhancements
        if (request.faithMode) {
            prompt += ', Christian values, Kingdom perspective, inspiring presence';
        }

        return prompt;
    }

    /**
     * Enhance prompt for OpenAI
     */
    private enhancePromptForOpenAI(request: AvatarGenerationRequest): string {
        let prompt = 'Create a realistic avatar portrait';

        // Add style-specific enhancements
        switch (request.style) {
            case 'professional':
                prompt += ', professional appearance, business attire, confident pose';
                break;
            case 'casual':
                prompt += ', casual appearance, friendly expression, approachable';
                break;
            case 'faith-inspired':
                prompt += ', spiritual presence, inspiring expression, Kingdom values';
                break;
            case 'branding':
                prompt += ', brand-consistent appearance, professional yet approachable';
                break;
        }

        // Add faith mode enhancements
        if (request.faithMode) {
            prompt += ', Christian values, Kingdom perspective, inspiring presence';
        }

        return prompt;
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

    /**
     * Validate consent and data usage
     */
    validateConsent(consentGiven: boolean, images: string[]): {
        isValid: boolean;
        errors: string[];
    } {
        const errors: string[] = [];

        if (!consentGiven) {
            errors.push('User consent is required for avatar generation');
        }

        if (images.length < 3) {
            errors.push('At least 3 photos are required for avatar generation');
        }

        if (images.length > 5) {
            errors.push('Maximum 5 photos allowed for avatar generation');
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    }
} 
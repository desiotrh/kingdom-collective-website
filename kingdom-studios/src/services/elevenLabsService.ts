import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ElevenLabsVoice {
    id: string;
    name: string;
    category: string;
    description: string;
    preview_url?: string;
}

export interface ElevenLabsGenerationRequest {
    text: string;
    voice_id: string;
    model_id?: string;
    voice_settings?: {
        stability: number;
        similarity_boost: number;
        style: number;
        use_speaker_boost: boolean;
    };
}

export interface ElevenLabsGenerationResponse {
    audio_url: string;
    generation_id: string;
    request_id: string;
}

class ElevenLabsService {
    private apiKey: string | null = null;
    private baseUrl = 'https://api.elevenlabs.io/v1';
    private consentGiven = false;

    constructor() {
        this.loadApiKey();
    }

    private async loadApiKey(): Promise<void> {
        try {
            const key = await AsyncStorage.getItem('elevenlabs_api_key');
            this.apiKey = key;
        } catch (error) {
            console.error('Failed to load ElevenLabs API key:', error);
        }
    }

    async setApiKey(apiKey: string): Promise<void> {
        try {
            await AsyncStorage.setItem('elevenlabs_api_key', apiKey);
            this.apiKey = apiKey;
        } catch (error) {
            console.error('Failed to save ElevenLabs API key:', error);
            throw new Error('Failed to save API key');
        }
    }

    async setConsent(consent: boolean): Promise<void> {
        this.consentGiven = consent;
        try {
            await AsyncStorage.setItem('elevenlabs_consent', consent.toString());
        } catch (error) {
            console.error('Failed to save consent status:', error);
        }
    }

    async getConsent(): Promise<boolean> {
        if (this.consentGiven) return true;
        try {
            const consent = await AsyncStorage.getItem('elevenlabs_consent');
            this.consentGiven = consent === 'true';
            return this.consentGiven;
        } catch (error) {
            console.error('Failed to load consent status:', error);
            return false;
        }
    }

    private validateRequest(): void {
        if (!this.apiKey) {
            throw new Error('ElevenLabs API key not configured');
        }
        if (!this.consentGiven) {
            throw new Error('Consent not given for ElevenLabs integration');
        }
    }

    async getVoices(): Promise<ElevenLabsVoice[]> {
        this.validateRequest();

        try {
            const response = await axios.get(`${this.baseUrl}/voices`, {
                headers: {
                    'xi-api-key': this.apiKey,
                },
            });
            return response.data.voices || [];
        } catch (error: any) {
            console.error('Failed to fetch ElevenLabs voices:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch voices');
        }
    }

    async generateSpeech(request: ElevenLabsGenerationRequest): Promise<ElevenLabsGenerationResponse> {
        this.validateRequest();

        try {
            const response = await axios.post(
                `${this.baseUrl}/text-to-speech/${request.voice_id}`,
                {
                    text: request.text,
                    model_id: request.model_id || 'eleven_monolingual_v1',
                    voice_settings: request.voice_settings || {
                        stability: 0.5,
                        similarity_boost: 0.5,
                        style: 0.0,
                        use_speaker_boost: true,
                    },
                },
                {
                    headers: {
                        'xi-api-key': this.apiKey,
                        'Content-Type': 'application/json',
                    },
                    responseType: 'arraybuffer',
                }
            );

            // Convert arraybuffer to base64 for storage/transmission
            const audioBase64 = Buffer.from(response.data).toString('base64');

            return {
                audio_url: `data:audio/mpeg;base64,${audioBase64}`,
                generation_id: response.headers['x-generation-id'] || '',
                request_id: response.headers['x-request-id'] || '',
            };
        } catch (error: any) {
            console.error('Failed to generate speech:', error);
            throw new Error(error.response?.data?.message || 'Failed to generate speech');
        }
    }

    async testConnection(): Promise<boolean> {
        try {
            this.validateRequest();
            await this.getVoices();
            return true;
        } catch (error) {
            console.error('ElevenLabs connection test failed:', error);
            return false;
        }
    }

    // Mock method for testing when API is not available
    async generateMockSpeech(text: string): Promise<ElevenLabsGenerationResponse> {
        return {
            audio_url: 'mock_audio_url',
            generation_id: `mock_${Date.now()}`,
            request_id: `mock_${Date.now()}`,
        };
    }
}

export default new ElevenLabsService(); 
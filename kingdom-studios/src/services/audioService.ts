import { analyticsService } from './analyticsService';
import { authService } from './authService';

export interface AudioTrack {
    id: string;
    source: string;
    type: 'music' | 'voice' | 'sfx' | 'ambient';
    startTime: number;
    duration: number;
    volume: number;
    effects: AudioEffect[];
    waveform: number[];
    bpm?: number;
    key?: string;
    genre?: string;
}

export interface AudioEffect {
    type: 'noise_reduction' | 'enhancement' | 'reverb' | 'echo' | 'pitch_shift' | 'auto_tune' | 'robotic';
    parameters: any;
    enabled: boolean;
}

export interface MusicLicense {
    id: string;
    title: string;
    artist: string;
    genre: string;
    mood: string;
    bpm: number;
    key: string;
    duration: number;
    licenseType: 'royalty_free' | 'licensed' | 'creative_commons';
    licenseUrl: string;
    downloadUrl: string;
    tags: string[];
}

export interface WaveformData {
    samples: number[];
    sampleRate: number;
    duration: number;
    peaks: number[];
    valleys: number[];
}

export interface AudioSyncResult {
    originalTrack: string;
    syncedTrack: string;
    offset: number;
    confidence: number;
    alignmentPoints: number[];
}

class AudioService {
    private apiBaseUrl: string;

    constructor() {
        this.apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
    }

    /**
     * Apply noise reduction to audio track
     */
    async applyNoiseReduction(
        audioUrl: string,
        intensity: number = 0.5,
        frequencyRange: { low: number; high: number } = { low: 100, high: 8000 }
    ): Promise<string> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/audio/noise-reduction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    audioUrl,
                    intensity,
                    frequencyRange,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to apply noise reduction');
            }

            const result = await response.json();

            analyticsService.trackEvent('audio_noise_reduction_applied', {
                userId: user.uid,
                intensity,
                frequencyRange,
            });

            return result.processedAudioUrl;
        } catch (error) {
            console.error('Noise reduction failed:', error);
            throw error;
        }
    }

    /**
     * Auto-enhance audio quality
     */
    async autoEnhanceAudio(audioUrl: string): Promise<string> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/audio/auto-enhance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    audioUrl,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to auto-enhance audio');
            }

            const result = await response.json();

            analyticsService.trackEvent('audio_auto_enhanced', {
                userId: user.uid,
            });

            return result.enhancedAudioUrl;
        } catch (error) {
            console.error('Audio enhancement failed:', error);
            throw error;
        }
    }

    /**
     * Sync multiple audio tracks
     */
    async syncAudioTracks(tracks: AudioTrack[]): Promise<AudioSyncResult[]> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/audio/sync-tracks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    tracks,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to sync audio tracks');
            }

            const results = await response.json();

            analyticsService.trackEvent('audio_tracks_synced', {
                userId: user.uid,
                trackCount: tracks.length,
            });

            return results;
        } catch (error) {
            console.error('Audio sync failed:', error);
            throw error;
        }
    }

    /**
     * Get waveform data for audio track
     */
    async getWaveformData(audioUrl: string): Promise<WaveformData> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/audio/waveform`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    audioUrl,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get waveform data');
            }

            const waveformData = await response.json();
            return waveformData;
        } catch (error) {
            console.error('Waveform generation failed:', error);
            return this.generateMockWaveformData();
        }
    }

    /**
     * Generate mock waveform data
     */
    private generateMockWaveformData(): WaveformData {
        const samples = [];
        const peaks = [];
        const valleys = [];

        for (let i = 0; i < 1000; i++) {
            const sample = Math.sin(i * 0.1) * Math.random() * 0.5 + 0.5;
            samples.push(sample);

            if (i % 50 === 0) {
                peaks.push(Math.random() * 0.8 + 0.2);
                valleys.push(Math.random() * 0.2);
            }
        }

        return {
            samples,
            sampleRate: 44100,
            duration: 10,
            peaks,
            valleys,
        };
    }

    /**
     * Apply voice effects
     */
    async applyVoiceEffect(
        audioUrl: string,
        effect: AudioEffect['type'],
        parameters: any
    ): Promise<string> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/audio/voice-effects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    audioUrl,
                    effect,
                    parameters,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to apply voice effect');
            }

            const result = await response.json();

            analyticsService.trackEvent('voice_effect_applied', {
                userId: user.uid,
                effect,
                parameters,
            });

            return result.processedAudioUrl;
        } catch (error) {
            console.error('Voice effect application failed:', error);
            throw error;
        }
    }

    /**
     * Search licensed music
     */
    async searchLicensedMusic(
        query: string,
        filters: {
            genre?: string;
            mood?: string;
            bpm?: { min: number; max: number };
            duration?: { min: number; max: number };
            licenseType?: string;
        } = {}
    ): Promise<MusicLicense[]> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/audio/licensed-music`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    query,
                    filters,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to search licensed music');
            }

            const music = await response.json();

            analyticsService.trackEvent('licensed_music_searched', {
                userId: user.uid,
                query,
                filters,
                resultCount: music.length,
            });

            return music;
        } catch (error) {
            console.error('Music search failed:', error);
            return this.generateMockLicensedMusic();
        }
    }

    /**
     * Generate mock licensed music
     */
    private generateMockLicensedMusic(): MusicLicense[] {
        return [
            {
                id: 'music_1',
                title: 'Inspiring Faith',
                artist: 'Kingdom Music',
                genre: 'worship',
                mood: 'inspirational',
                bpm: 120,
                key: 'C',
                duration: 180,
                licenseType: 'royalty_free',
                licenseUrl: 'https://example.com/license1',
                downloadUrl: 'https://example.com/download1.mp3',
                tags: ['faith', 'inspirational', 'worship'],
            },
            {
                id: 'music_2',
                title: 'Encouraging Vibes',
                artist: 'Christian Beats',
                genre: 'gospel',
                mood: 'encouraging',
                bpm: 110,
                key: 'G',
                duration: 240,
                licenseType: 'royalty_free',
                licenseUrl: 'https://example.com/license2',
                downloadUrl: 'https://example.com/download2.mp3',
                tags: ['encouragement', 'gospel', 'positive'],
            },
            {
                id: 'music_3',
                title: 'Praise & Worship',
                artist: 'Spirit Sounds',
                genre: 'praise',
                mood: 'worshipful',
                bpm: 90,
                key: 'D',
                duration: 300,
                licenseType: 'royalty_free',
                licenseUrl: 'https://example.com/license3',
                downloadUrl: 'https://example.com/download3.mp3',
                tags: ['worship', 'praise', 'spiritual'],
            },
        ];
    }

    /**
     * Download licensed music
     */
    async downloadLicensedMusic(musicId: string): Promise<string> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/audio/licensed-music/${musicId}/download`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to download licensed music');
            }

            const result = await response.json();

            analyticsService.trackEvent('licensed_music_downloaded', {
                userId: user.uid,
                musicId,
            });

            return result.downloadUrl;
        } catch (error) {
            console.error('Music download failed:', error);
            throw error;
        }
    }

    /**
     * Analyze audio for BPM and key
     */
    async analyzeAudio(audioUrl: string): Promise<{
        bpm: number;
        key: string;
        confidence: number;
        segments: any[];
    }> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/audio/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    audioUrl,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to analyze audio');
            }

            const analysis = await response.json();

            analyticsService.trackEvent('audio_analyzed', {
                userId: user.uid,
                bpm: analysis.bpm,
                key: analysis.key,
            });

            return analysis;
        } catch (error) {
            console.error('Audio analysis failed:', error);
            return this.generateMockAudioAnalysis();
        }
    }

    /**
     * Generate mock audio analysis
     */
    private generateMockAudioAnalysis() {
        return {
            bpm: Math.floor(Math.random() * 60) + 80, // 80-140 BPM
            key: ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'F', 'Bb', 'Eb', 'Ab'][Math.floor(Math.random() * 12)],
            confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
            segments: [
                { start: 0, end: 30, bpm: 120, key: 'C' },
                { start: 30, end: 60, bpm: 118, key: 'C' },
                { start: 60, end: 90, bpm: 122, key: 'C' },
            ],
        };
    }

    /**
     * Mix multiple audio tracks
     */
    async mixAudioTracks(tracks: AudioTrack[]): Promise<string> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/audio/mix`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    tracks,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to mix audio tracks');
            }

            const result = await response.json();

            analyticsService.trackEvent('audio_tracks_mixed', {
                userId: user.uid,
                trackCount: tracks.length,
            });

            return result.mixedAudioUrl;
        } catch (error) {
            console.error('Audio mixing failed:', error);
            throw error;
        }
    }

    /**
     * Apply audio normalization
     */
    async normalizeAudio(audioUrl: string, targetLevel: number = -14): Promise<string> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/audio/normalize`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    audioUrl,
                    targetLevel,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to normalize audio');
            }

            const result = await response.json();

            analyticsService.trackEvent('audio_normalized', {
                userId: user.uid,
                targetLevel,
            });

            return result.normalizedAudioUrl;
        } catch (error) {
            console.error('Audio normalization failed:', error);
            throw error;
        }
    }

    /**
     * Detect silence in audio
     */
    async detectSilence(audioUrl: string, threshold: number = 0.01): Promise<{
        silenceSegments: { start: number; end: number }[];
        totalSilence: number;
    }> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/audio/detect-silence`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    audioUrl,
                    threshold,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to detect silence');
            }

            const result = await response.json();

            analyticsService.trackEvent('silence_detected', {
                userId: user.uid,
                threshold,
                silenceSegments: result.silenceSegments.length,
            });

            return result;
        } catch (error) {
            console.error('Silence detection failed:', error);
            throw error;
        }
    }

    /**
     * Remove silence from audio
     */
    async removeSilence(audioUrl: string, minSilenceDuration: number = 0.5): Promise<string> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/audio/remove-silence`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    audioUrl,
                    minSilenceDuration,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to remove silence');
            }

            const result = await response.json();

            analyticsService.trackEvent('silence_removed', {
                userId: user.uid,
                minSilenceDuration,
            });

            return result.processedAudioUrl;
        } catch (error) {
            console.error('Silence removal failed:', error);
            throw error;
        }
    }
}

export const audioService = new AudioService(); 
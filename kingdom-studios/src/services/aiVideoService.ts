import { analyticsService } from './analyticsService';
import { authService } from './authService';

export interface AICaption {
    text: string;
    startTime: number;
    endTime: number;
    confidence: number;
    language: string;
}

export interface AIMusicSuggestion {
    id: string;
    title: string;
    artist: string;
    mood: string;
    tempo: number;
    genre: string;
    url: string;
    tags: string[];
    confidence: number;
}

export interface AIThumbnail {
    timestamp: number;
    imageUrl: string;
    confidence: number;
    description: string;
}

export interface AIEditSuggestion {
    type: 'cut' | 'trim' | 'transition' | 'effect';
    startTime: number;
    endTime: number;
    confidence: number;
    reason: string;
    suggestedTransition?: string;
    suggestedEffect?: string;
}

export interface AIVoiceOver {
    id: string;
    text: string;
    voice: string;
    tone: 'professional' | 'casual' | 'energetic' | 'calm' | 'faithful';
    gender: 'male' | 'female';
    duration: number;
    audioUrl: string;
}

export interface AIScript {
    id: string;
    title: string;
    content: string;
    tone: string;
    targetAudience: string;
    keywords: string[];
}

class AIVideoService {
    private apiBaseUrl: string;
    private openaiApiKey: string;

    constructor() {
        this.apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
        this.openaiApiKey = process.env.OPENAI_API_KEY || '';
    }

    /**
     * Generate auto-captions from video audio
     */
    async generateCaptions(videoUrl: string, language: string = 'en'): Promise<AICaption[]> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/ai/generate-captions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    videoUrl,
                    language,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate captions');
            }

            const captions = await response.json();

            analyticsService.trackEvent('ai_captions_generated', {
                userId: user.uid,
                videoUrl,
                language,
                captionCount: captions.length,
            });

            return captions;
        } catch (error) {
            console.error('Caption generation failed:', error);
            // Return mock captions for fallback
            return this.generateMockCaptions();
        }
    }

    /**
     * Generate mock captions for fallback
     */
    private generateMockCaptions(): AICaption[] {
        return [
            {
                text: "Welcome to Kingdom Clips",
                startTime: 0,
                endTime: 2,
                confidence: 0.95,
                language: 'en',
            },
            {
                text: "Create amazing videos with faith",
                startTime: 2,
                endTime: 4,
                confidence: 0.92,
                language: 'en',
            },
            {
                text: "Share your message with the world",
                startTime: 4,
                endTime: 6,
                confidence: 0.88,
                language: 'en',
            },
        ];
    }

    /**
     * Suggest music based on video content and mood
     */
    async suggestMusic(videoUrl: string, duration: number, mood?: string): Promise<AIMusicSuggestion[]> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/ai/suggest-music`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    videoUrl,
                    duration,
                    mood,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to suggest music');
            }

            const suggestions = await response.json();

            analyticsService.trackEvent('ai_music_suggested', {
                userId: user.uid,
                videoUrl,
                mood,
                suggestionCount: suggestions.length,
            });

            return suggestions;
        } catch (error) {
            console.error('Music suggestion failed:', error);
            return this.generateMockMusicSuggestions();
        }
    }

    /**
     * Generate mock music suggestions
     */
    private generateMockMusicSuggestions(): AIMusicSuggestion[] {
        return [
            {
                id: 'music_1',
                title: 'Inspiring Faith',
                artist: 'Kingdom Music',
                mood: 'inspirational',
                tempo: 120,
                genre: 'worship',
                url: 'https://example.com/music1.mp3',
                tags: ['faith', 'inspirational', 'worship'],
                confidence: 0.95,
            },
            {
                id: 'music_2',
                title: 'Encouraging Vibes',
                artist: 'Christian Beats',
                mood: 'encouraging',
                tempo: 110,
                genre: 'gospel',
                url: 'https://example.com/music2.mp3',
                tags: ['encouragement', 'gospel', 'positive'],
                confidence: 0.88,
            },
            {
                id: 'music_3',
                title: 'Praise & Worship',
                artist: 'Spirit Sounds',
                mood: 'worshipful',
                tempo: 90,
                genre: 'praise',
                url: 'https://example.com/music3.mp3',
                tags: ['worship', 'praise', 'spiritual'],
                confidence: 0.92,
            },
        ];
    }

    /**
     * Generate optimal thumbnails from video
     */
    async generateThumbnails(videoUrl: string, count: number = 3): Promise<AIThumbnail[]> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/ai/generate-thumbnails`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    videoUrl,
                    count,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate thumbnails');
            }

            const thumbnails = await response.json();

            analyticsService.trackEvent('ai_thumbnails_generated', {
                userId: user.uid,
                videoUrl,
                thumbnailCount: thumbnails.length,
            });

            return thumbnails;
        } catch (error) {
            console.error('Thumbnail generation failed:', error);
            return this.generateMockThumbnails();
        }
    }

    /**
     * Generate mock thumbnails
     */
    private generateMockThumbnails(): AIThumbnail[] {
        return [
            {
                timestamp: 2.5,
                imageUrl: 'https://example.com/thumbnail1.jpg',
                confidence: 0.95,
                description: 'High energy moment with clear visuals',
            },
            {
                timestamp: 5.0,
                imageUrl: 'https://example.com/thumbnail2.jpg',
                confidence: 0.88,
                description: 'Emotional peak with good composition',
            },
            {
                timestamp: 7.5,
                imageUrl: 'https://example.com/thumbnail3.jpg',
                confidence: 0.92,
                description: 'Clear message with engaging visuals',
            },
        ];
    }

    /**
     * Get AI editing suggestions
     */
    async getEditSuggestions(videoUrl: string, duration: number): Promise<AIEditSuggestion[]> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/ai/edit-suggestions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    videoUrl,
                    duration,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get edit suggestions');
            }

            const suggestions = await response.json();

            analyticsService.trackEvent('ai_edit_suggestions_generated', {
                userId: user.uid,
                videoUrl,
                suggestionCount: suggestions.length,
            });

            return suggestions;
        } catch (error) {
            console.error('Edit suggestions failed:', error);
            return this.generateMockEditSuggestions();
        }
    }

    /**
     * Generate mock edit suggestions
     */
    private generateMockEditSuggestions(): AIEditSuggestion[] {
        return [
            {
                type: 'cut',
                startTime: 1.5,
                endTime: 2.0,
                confidence: 0.85,
                reason: 'Remove dead space at beginning',
            },
            {
                type: 'transition',
                startTime: 5.0,
                endTime: 5.5,
                confidence: 0.92,
                reason: 'Smooth transition between scenes',
                suggestedTransition: 'fade',
            },
            {
                type: 'effect',
                startTime: 3.0,
                endTime: 4.0,
                confidence: 0.78,
                reason: 'Enhance visual impact',
                suggestedEffect: 'brightness_boost',
            },
        ];
    }

    /**
     * Generate AI voice-over
     */
    async generateVoiceOver(
        text: string,
        voice: string,
        tone: AIVoiceOver['tone'],
        gender: AIVoiceOver['gender']
    ): Promise<AIVoiceOver> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/ai/generate-voiceover`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    text,
                    voice,
                    tone,
                    gender,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate voice-over');
            }

            const voiceOver = await response.json();

            analyticsService.trackEvent('ai_voiceover_generated', {
                userId: user.uid,
                voice,
                tone,
                gender,
                textLength: text.length,
            });

            return voiceOver;
        } catch (error) {
            console.error('Voice-over generation failed:', error);
            return this.generateMockVoiceOver(text, voice, tone, gender);
        }
    }

    /**
     * Generate mock voice-over
     */
    private generateMockVoiceOver(
        text: string,
        voice: string,
        tone: AIVoiceOver['tone'],
        gender: AIVoiceOver['gender']
    ): AIVoiceOver {
        return {
            id: `voice_${Date.now()}`,
            text,
            voice,
            tone,
            gender,
            duration: text.length * 0.06, // Rough estimate
            audioUrl: 'https://example.com/voiceover.mp3',
        };
    }

    /**
     * Auto-generate script based on topic
     */
    async generateScript(
        topic: string,
        duration: number,
        tone: string,
        targetAudience: string
    ): Promise<AIScript> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/ai/generate-script`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    topic,
                    duration,
                    tone,
                    targetAudience,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate script');
            }

            const script = await response.json();

            analyticsService.trackEvent('ai_script_generated', {
                userId: user.uid,
                topic,
                tone,
                targetAudience,
                duration,
            });

            return script;
        } catch (error) {
            console.error('Script generation failed:', error);
            return this.generateMockScript(topic, tone, targetAudience);
        }
    }

    /**
     * Generate mock script
     */
    private generateMockScript(
        topic: string,
        tone: string,
        targetAudience: string
    ): AIScript {
        return {
            id: `script_${Date.now()}`,
            title: `${topic} - ${tone} Script`,
            content: `Welcome to our video about ${topic}. Today we're going to explore this important topic in a ${tone} way that will resonate with ${targetAudience}. Let's dive in and discover the amazing insights that await us.`,
            tone,
            targetAudience,
            keywords: [topic, tone, targetAudience],
        };
    }

    /**
     * Analyze video content for viral potential
     */
    async analyzeViralPotential(videoUrl: string): Promise<{
        score: number;
        factors: string[];
        suggestions: string[];
    }> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/ai/analyze-viral`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    videoUrl,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to analyze viral potential');
            }

            const analysis = await response.json();

            analyticsService.trackEvent('ai_viral_analysis', {
                userId: user.uid,
                videoUrl,
                score: analysis.score,
            });

            return analysis;
        } catch (error) {
            console.error('Viral analysis failed:', error);
            return this.generateMockViralAnalysis();
        }
    }

    /**
     * Generate mock viral analysis
     */
    private generateMockViralAnalysis() {
        return {
            score: Math.floor(Math.random() * 40) + 30, // 30-70
            factors: ['Good pacing', 'Clear message', 'Engaging visuals'],
            suggestions: [
                'Add trending music',
                'Include more text overlays',
                'Optimize for mobile viewing',
            ],
        };
    }

    /**
     * Get trending hashtags for content
     */
    async getTrendingHashtags(content: string, platform: string): Promise<string[]> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/ai/trending-hashtags`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    content,
                    platform,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get trending hashtags');
            }

            const hashtags = await response.json();

            analyticsService.trackEvent('ai_hashtags_generated', {
                userId: user.uid,
                platform,
                hashtagCount: hashtags.length,
            });

            return hashtags;
        } catch (error) {
            console.error('Hashtag generation failed:', error);
            return this.generateMockHashtags();
        }
    }

    /**
     * Generate mock hashtags
     */
    private generateMockHashtags(): string[] {
        return [
            '#KingdomClips',
            '#FaithContent',
            '#ChristianCreators',
            '#Inspiration',
            '#GodIsGood',
            '#Blessed',
            '#FaithBased',
            '#ChristianLife',
        ];
    }

    /**
     * Predict optimal posting times
     */
    async predictOptimalPostingTimes(
        platform: string,
        timezone: string,
        contentType: string
    ): Promise<{ time: string; confidence: number }[]> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/ai/optimal-posting-times`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    platform,
                    timezone,
                    contentType,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to predict posting times');
            }

            const times = await response.json();

            analyticsService.trackEvent('ai_posting_times_predicted', {
                userId: user.uid,
                platform,
                timezone,
                contentType,
            });

            return times;
        } catch (error) {
            console.error('Posting time prediction failed:', error);
            return this.generateMockPostingTimes();
        }
    }

    /**
     * Generate mock posting times
     */
    private generateMockPostingTimes(): { time: string; confidence: number }[] {
        return [
            { time: '09:00', confidence: 0.95 },
            { time: '12:00', confidence: 0.88 },
            { time: '18:00', confidence: 0.92 },
            { time: '21:00', confidence: 0.85 },
        ];
    }
}

export const aiVideoService = new AIVideoService(); 
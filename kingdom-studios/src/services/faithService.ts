import { analyticsService } from './analyticsService';
import { authService } from './authService';

export interface Scripture {
    id: string;
    book: string;
    chapter: number;
    verse: number;
    text: string;
    translation: string;
    theme: string[];
    keywords: string[];
    relatedVerses: string[];
}

export interface PrayerRequest {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    title: string;
    description: string;
    category: 'personal' | 'family' | 'community' | 'global' | 'church';
    isAnonymous: boolean;
    prayerCount: number;
    createdAt: Date;
    status: 'active' | 'answered' | 'expired';
}

export interface WorshipMusic {
    id: string;
    title: string;
    artist: string;
    album: string;
    genre: string;
    mood: string;
    bpm: number;
    key: string;
    duration: number;
    lyrics: string;
    audioUrl: string;
    tags: string[];
    licenseType: 'royalty_free' | 'licensed' | 'creative_commons';
}

export interface TestimonyTemplate {
    id: string;
    title: string;
    description: string;
    structure: string[];
    prompts: string[];
    duration: number;
    category: 'conversion' | 'healing' | 'provision' | 'guidance' | 'deliverance';
    exampleScript: string;
    backgroundMusic?: string;
}

export interface ChurchEvent {
    id: string;
    title: string;
    description: string;
    date: Date;
    location: string;
    churchName: string;
    eventType: 'service' | 'conference' | 'outreach' | 'youth' | 'worship';
    flyerTemplate: string;
    socialMediaAssets: string[];
    registrationUrl?: string;
    liveStreamUrl?: string;
}

class FaithService {
    private apiBaseUrl: string;

    constructor() {
        this.apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
    }

    /**
     * Search scriptures by keyword or theme
     */
    async searchScriptures(
        query: string,
        translation: string = 'NIV',
        theme?: string
    ): Promise<Scripture[]> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/faith/scriptures/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    query,
                    translation,
                    theme,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to search scriptures');
            }

            const scriptures = await response.json();

            analyticsService.trackEvent('scriptures_searched', {
                userId: user.uid,
                query,
                translation,
                theme,
                resultCount: scriptures.length,
            });

            return scriptures;
        } catch (error) {
            console.error('Scripture search failed:', error);
            return this.generateMockScriptures(query, theme);
        }
    }

    /**
     * Generate mock scriptures
     */
    private generateMockScriptures(query: string, theme?: string): Scripture[] {
        const mockScriptures = [
            {
                id: 'john_3_16',
                book: 'John',
                chapter: 3,
                verse: 16,
                text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
                translation: 'NIV',
                theme: ['love', 'salvation', 'faith'],
                keywords: ['God', 'love', 'world', 'Son', 'believe', 'eternal life'],
                relatedVerses: ['Romans 5:8', 'Ephesians 2:8-9', 'John 14:6'],
            },
            {
                id: 'philippians_4_13',
                book: 'Philippians',
                chapter: 4,
                verse: 13,
                text: 'I can do all this through him who gives me strength.',
                translation: 'NIV',
                theme: ['strength', 'empowerment', 'faith'],
                keywords: ['can do', 'strength', 'through Christ'],
                relatedVerses: ['2 Corinthians 12:9', 'Isaiah 40:31', 'Psalm 27:1'],
            },
            {
                id: 'jeremiah_29_11',
                book: 'Jeremiah',
                chapter: 29,
                verse: 11,
                text: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.',
                translation: 'NIV',
                theme: ['hope', 'future', 'God\'s plan'],
                keywords: ['plans', 'prosper', 'hope', 'future'],
                relatedVerses: ['Romans 8:28', 'Proverbs 3:5-6', 'Isaiah 55:8-9'],
            },
        ];

        return mockScriptures.filter(scripture =>
            scripture.text.toLowerCase().includes(query.toLowerCase()) ||
            scripture.theme.some(t => t.toLowerCase().includes(query.toLowerCase())) ||
            (theme && scripture.theme.includes(theme))
        );
    }

    /**
     * Get scripture by reference
     */
    async getScriptureByReference(
        book: string,
        chapter: number,
        verse: number,
        translation: string = 'NIV'
    ): Promise<Scripture> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/faith/scriptures/${book}/${chapter}/${verse}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to get scripture');
            }

            const scripture = await response.json();

            analyticsService.trackEvent('scripture_viewed', {
                userId: user.uid,
                book,
                chapter,
                verse,
                translation,
            });

            return scripture;
        } catch (error) {
            console.error('Scripture retrieval failed:', error);
            throw error;
        }
    }

    /**
     * Create prayer request
     */
    async createPrayerRequest(
        title: string,
        description: string,
        category: PrayerRequest['category'],
        isAnonymous: boolean = false
    ): Promise<PrayerRequest> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/faith/prayer-requests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    title,
                    description,
                    category,
                    isAnonymous,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create prayer request');
            }

            const prayerRequest = await response.json();

            analyticsService.trackEvent('prayer_request_created', {
                userId: user.uid,
                category,
                isAnonymous,
            });

            return prayerRequest;
        } catch (error) {
            console.error('Prayer request creation failed:', error);
            throw error;
        }
    }

    /**
     * Get prayer requests
     */
    async getPrayerRequests(
        category?: PrayerRequest['category'],
        status?: PrayerRequest['status']
    ): Promise<PrayerRequest[]> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const params = new URLSearchParams();
            if (category) params.append('category', category);
            if (status) params.append('status', status);

            const response = await fetch(`${this.apiBaseUrl}/faith/prayer-requests?${params}`, {
                headers: {
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to get prayer requests');
            }

            const prayerRequests = await response.json();

            analyticsService.trackEvent('prayer_requests_viewed', {
                userId: user.uid,
                category,
                status,
                requestCount: prayerRequests.length,
            });

            return prayerRequests;
        } catch (error) {
            console.error('Prayer requests retrieval failed:', error);
            return this.generateMockPrayerRequests();
        }
    }

    /**
     * Generate mock prayer requests
     */
    private generateMockPrayerRequests(): PrayerRequest[] {
        return [
            {
                id: 'prayer_1',
                userId: 'user_1',
                userName: 'Faithful Believer',
                userAvatar: 'https://example.com/avatar1.jpg',
                title: 'Prayer for Healing',
                description: 'Please pray for my recovery from illness and strength during this time.',
                category: 'personal',
                isAnonymous: false,
                prayerCount: 45,
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                status: 'active',
            },
            {
                id: 'prayer_2',
                userId: 'user_2',
                userName: 'Anonymous',
                userAvatar: 'https://example.com/default.jpg',
                title: 'Family Unity',
                description: 'Praying for unity and love in our family relationships.',
                category: 'family',
                isAnonymous: true,
                prayerCount: 23,
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                status: 'active',
            },
            {
                id: 'prayer_3',
                userId: 'user_3',
                userName: 'Community Leader',
                userAvatar: 'https://example.com/avatar3.jpg',
                title: 'Church Growth',
                description: 'Praying for our church to reach more people with God\'s love.',
                category: 'church',
                isAnonymous: false,
                prayerCount: 67,
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                status: 'active',
            },
        ];
    }

    /**
     * Pray for a request
     */
    async prayForRequest(prayerRequestId: string): Promise<void> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/faith/prayer-requests/${prayerRequestId}/pray`, {
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
                throw new Error('Failed to pray for request');
            }

            analyticsService.trackEvent('prayer_request_prayed', {
                userId: user.uid,
                prayerRequestId,
            });
        } catch (error) {
            console.error('Prayer action failed:', error);
            throw error;
        }
    }

    /**
     * Search worship music
     */
    async searchWorshipMusic(
        query: string,
        genre?: string,
        mood?: string
    ): Promise<WorshipMusic[]> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/faith/worship-music`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    query,
                    genre,
                    mood,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to search worship music');
            }

            const music = await response.json();

            analyticsService.trackEvent('worship_music_searched', {
                userId: user.uid,
                query,
                genre,
                mood,
                resultCount: music.length,
            });

            return music;
        } catch (error) {
            console.error('Worship music search failed:', error);
            return this.generateMockWorshipMusic();
        }
    }

    /**
     * Generate mock worship music
     */
    private generateMockWorshipMusic(): WorshipMusic[] {
        return [
            {
                id: 'worship_1',
                title: 'Amazing Grace',
                artist: 'Traditional',
                album: 'Hymns of Faith',
                genre: 'hymn',
                mood: 'reverent',
                bpm: 80,
                key: 'C',
                duration: 240,
                lyrics: 'Amazing grace, how sweet the sound...',
                audioUrl: 'https://example.com/amazing-grace.mp3',
                tags: ['grace', 'salvation', 'traditional'],
                licenseType: 'royalty_free',
            },
            {
                id: 'worship_2',
                title: 'How Great Thou Art',
                artist: 'Carl Boberg',
                album: 'Classic Hymns',
                genre: 'hymn',
                mood: 'worshipful',
                bpm: 75,
                key: 'G',
                duration: 300,
                lyrics: 'O Lord my God, when I in awesome wonder...',
                audioUrl: 'https://example.com/how-great-thou-art.mp3',
                tags: ['praise', 'worship', 'classic'],
                licenseType: 'royalty_free',
            },
            {
                id: 'worship_3',
                title: '10,000 Reasons',
                artist: 'Matt Redman',
                album: '10,000 Reasons',
                genre: 'contemporary',
                mood: 'uplifting',
                bpm: 120,
                key: 'D',
                duration: 360,
                lyrics: 'Bless the Lord, O my soul...',
                audioUrl: 'https://example.com/10000-reasons.mp3',
                tags: ['praise', 'contemporary', 'blessing'],
                licenseType: 'licensed',
            },
        ];
    }

    /**
     * Get testimony templates
     */
    async getTestimonyTemplates(category?: TestimonyTemplate['category']): Promise<TestimonyTemplate[]> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const params = category ? `?category=${category}` : '';
            const response = await fetch(`${this.apiBaseUrl}/faith/testimony-templates${params}`, {
                headers: {
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to get testimony templates');
            }

            const templates = await response.json();

            analyticsService.trackEvent('testimony_templates_viewed', {
                userId: user.uid,
                category,
                templateCount: templates.length,
            });

            return templates;
        } catch (error) {
            console.error('Testimony templates failed:', error);
            return this.generateMockTestimonyTemplates();
        }
    }

    /**
     * Generate mock testimony templates
     */
    private generateMockTestimonyTemplates(): TestimonyTemplate[] {
        return [
            {
                id: 'testimony_1',
                title: 'My Conversion Story',
                description: 'Share how you came to know Jesus Christ',
                structure: ['Introduction', 'Life before Christ', 'The moment of conversion', 'Life after Christ', 'Conclusion'],
                prompts: [
                    'What was your life like before knowing Jesus?',
                    'What led you to seek God?',
                    'How did you come to accept Christ?',
                    'How has your life changed since then?',
                    'What would you say to someone considering faith?'
                ],
                duration: 120,
                category: 'conversion',
                exampleScript: 'I was lost and searching for meaning...',
                backgroundMusic: 'worship_1',
            },
            {
                id: 'testimony_2',
                title: 'God\'s Healing Power',
                description: 'Share a story of physical or emotional healing',
                structure: ['The situation', 'Prayer and faith', 'The healing', 'Gratitude', 'Encouragement'],
                prompts: [
                    'What was the health challenge you faced?',
                    'How did you pray about it?',
                    'How did God answer your prayers?',
                    'How has this strengthened your faith?',
                    'What encouragement can you offer others?'
                ],
                duration: 90,
                category: 'healing',
                exampleScript: 'When I was diagnosed with...',
                backgroundMusic: 'worship_2',
            },
            {
                id: 'testimony_3',
                title: 'God\'s Provision',
                description: 'Share how God provided in a time of need',
                structure: ['The need', 'Trusting God', 'The provision', 'Thankfulness', 'Faith building'],
                prompts: [
                    'What was the need or challenge?',
                    'How did you trust God during this time?',
                    'How did God provide?',
                    'What did you learn about God\'s faithfulness?',
                    'How can this encourage others?'
                ],
                duration: 150,
                category: 'provision',
                exampleScript: 'When I lost my job...',
                backgroundMusic: 'worship_3',
            },
        ];
    }

    /**
     * Get church events
     */
    async getChurchEvents(
        eventType?: ChurchEvent['eventType'],
        dateRange?: { start: Date; end: Date }
    ): Promise<ChurchEvent[]> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const params = new URLSearchParams();
            if (eventType) params.append('eventType', eventType);
            if (dateRange) {
                params.append('startDate', dateRange.start.toISOString());
                params.append('endDate', dateRange.end.toISOString());
            }

            const response = await fetch(`${this.apiBaseUrl}/faith/church-events?${params}`, {
                headers: {
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to get church events');
            }

            const events = await response.json();

            analyticsService.trackEvent('church_events_viewed', {
                userId: user.uid,
                eventType,
                eventCount: events.length,
            });

            return events;
        } catch (error) {
            console.error('Church events failed:', error);
            return this.generateMockChurchEvents();
        }
    }

    /**
     * Generate mock church events
     */
    private generateMockChurchEvents(): ChurchEvent[] {
        return [
            {
                id: 'event_1',
                title: 'Sunday Worship Service',
                description: 'Join us for an inspiring worship service with contemporary music and relevant teaching.',
                date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
                location: 'Kingdom Church',
                churchName: 'Kingdom Church',
                eventType: 'service',
                flyerTemplate: 'worship_service_template.jpg',
                socialMediaAssets: [
                    'service_promo_1.jpg',
                    'service_promo_2.jpg',
                    'service_video.mp4'
                ],
                liveStreamUrl: 'https://example.com/live-stream',
            },
            {
                id: 'event_2',
                title: 'Youth Conference 2024',
                description: 'A weekend of fun, fellowship, and faith-building for young people.',
                date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
                location: 'Kingdom Conference Center',
                churchName: 'Kingdom Church',
                eventType: 'conference',
                flyerTemplate: 'youth_conference_template.jpg',
                socialMediaAssets: [
                    'youth_promo_1.jpg',
                    'youth_promo_2.jpg',
                    'youth_video.mp4'
                ],
                registrationUrl: 'https://example.com/youth-conference',
            },
            {
                id: 'event_3',
                title: 'Community Outreach',
                description: 'Serving our community with love and practical help.',
                date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
                location: 'Downtown Community Center',
                churchName: 'Kingdom Church',
                eventType: 'outreach',
                flyerTemplate: 'outreach_template.jpg',
                socialMediaAssets: [
                    'outreach_promo_1.jpg',
                    'outreach_promo_2.jpg'
                ],
            },
        ];
    }

    /**
     * Create church event
     */
    async createChurchEvent(event: Omit<ChurchEvent, 'id'>): Promise<ChurchEvent> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/faith/church-events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    ...event,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create church event');
            }

            const createdEvent = await response.json();

            analyticsService.trackEvent('church_event_created', {
                userId: user.uid,
                eventType: event.eventType,
                title: event.title,
            });

            return createdEvent;
        } catch (error) {
            console.error('Church event creation failed:', error);
            throw error;
        }
    }
}

export const faithService = new FaithService(); 
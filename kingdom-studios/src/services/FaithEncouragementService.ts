import { Platform } from 'react-native';
import { useTierSystem } from '../contexts/TierSystemContext';
import { useDualMode } from '../contexts/DualModeContext';

export interface ScriptureTemplate {
    id: string;
    verse: string;
    reference: string;
    category: 'business' | 'motivation' | 'leadership' | 'community' | 'purpose';
    industry: string[];
    content: string;
    hashtags: string[];
    platforms: string[];
    faithMode: boolean;
}

export interface PrayerRequest {
    id: string;
    title: string;
    description: string;
    authorId: string;
    authorName: string;
    isAnonymous: boolean;
    createdAt: Date;
    status: 'active' | 'answered' | 'expired';
    category: 'business' | 'personal' | 'family' | 'community' | 'ministry';
    upvotes: number;
    comments: PrayerComment[];
    isUrgent: boolean;
}

export interface PrayerComment {
    id: string;
    authorId: string;
    authorName: string;
    content: string;
    createdAt: Date;
    isPrayer: boolean;
}

export interface KingdomAnalytics {
    spiritualImpact: {
        scriptureShares: number;
        faithBasedContent: number;
        communityEngagement: number;
        prayerRequests: number;
    };
    businessMetrics: {
        revenue: number;
        growth: number;
        customerSatisfaction: number;
        teamGrowth: number;
    };
    communityMetrics: {
        membersReached: number;
        testimoniesShared: number;
        mentorshipConnections: number;
        eventsHosted: number;
    };
}

export interface FaithBasedContent {
    id: string;
    title: string;
    content: string;
    scripture?: string;
    category: 'devotional' | 'testimony' | 'teaching' | 'encouragement' | 'prayer';
    industry: string[];
    platforms: string[];
    engagement: {
        likes: number;
        comments: number;
        shares: number;
        saves: number;
    };
    spiritualImpact: {
        livesTouched: number;
        conversions: number;
        communityGrowth: number;
    };
}

export interface MinistryTemplate {
    id: string;
    title: string;
    description: string;
    category: 'church' | 'ministry' | 'outreach' | 'discipleship' | 'worship';
    content: string;
    scripture: string;
    hashtags: string[];
    platforms: string[];
    targetAudience: string[];
}

export class FaithEncouragementService {
    private static instance: FaithEncouragementService;
    private scriptureTemplates: ScriptureTemplate[] = [];
    private prayerRequests: PrayerRequest[] = [];
    private faithBasedContent: FaithBasedContent[] = [];
    private ministryTemplates: MinistryTemplate[] = [];

    static getInstance(): FaithEncouragementService {
        if (!FaithEncouragementService.instance) {
            FaithEncouragementService.instance = new FaithEncouragementService();
            FaithEncouragementService.instance.initializeFaithContent();
        }
        return FaithEncouragementService.instance;
    }

    private initializeFaithContent(): void {
        // Initialize Scripture Templates
        this.scriptureTemplates = [
            {
                id: 'proverbs_16_3',
                verse: 'Commit your work to the Lord, and your plans will be established.',
                reference: 'Proverbs 16:3',
                category: 'business',
                industry: ['entrepreneurship', 'leadership', 'planning'],
                content: "When we align our business decisions with Kingdom principles, success becomes more than profit—it becomes purpose. Every strategy, every client interaction, every product becomes an opportunity to reflect God's excellence. How are you committing your work to the Lord today? #KingdomBusiness #BiblicalWisdom #FaithBasedSuccess #DivineExcellence",
                hashtags: ['#KingdomBusiness', '#BiblicalWisdom', '#FaithBasedSuccess', '#DivineExcellence'],
                platforms: ['instagram', 'facebook', 'linkedin'],
                faithMode: true,
            },
            {
                id: 'matthew_6_33',
                verse: 'But seek first the kingdom of God and his righteousness, and all these things will be added to you.',
                reference: 'Matthew 6:33',
                category: 'motivation',
                industry: ['all'],
                content: "In a world that tells us to chase success first, Jesus reminds us to seek His Kingdom first. When we prioritize God's purpose over our plans, He provides everything we need. Your business success is guaranteed when it's built on Kingdom foundations. #SeekFirst #KingdomPriority #FaithBasedSuccess #DivineProvision",
                hashtags: ['#SeekFirst', '#KingdomPriority', '#FaithBasedSuccess', '#DivineProvision'],
                platforms: ['instagram', 'facebook', 'tiktok'],
                faithMode: true,
            },
            {
                id: 'jeremiah_29_11',
                verse: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.',
                reference: 'Jeremiah 29:11',
                category: 'encouragement',
                industry: ['all'],
                content: "God has a plan for your business that's bigger than you can imagine. Even in uncertainty, trust that He's working behind the scenes to prosper you and give you hope. Your future is secure in His hands. #GodsPlan #DivinePurpose #FaithBasedBusiness #HopeAndFuture",
                hashtags: ['#GodsPlan', '#DivinePurpose', '#FaithBasedBusiness', '#HopeAndFuture'],
                platforms: ['instagram', 'facebook', 'linkedin'],
                faithMode: true,
            },
            {
                id: 'colossians_3_23',
                verse: 'Whatever you do, work heartily, as for the Lord and not for men.',
                reference: 'Colossians 3:23',
                category: 'leadership',
                industry: ['all'],
                content: "Your work is worship when done for the Lord. Every task, every project, every client interaction is an opportunity to glorify God through excellence. Work with passion and purpose, knowing you're serving the King of Kings. #WorkAsWorship #DivineExcellence #KingdomBusiness #ServeTheLord",
                hashtags: ['#WorkAsWorship', '#DivineExcellence', '#KingdomBusiness', '#ServeTheLord'],
                platforms: ['instagram', 'facebook', 'linkedin'],
                faithMode: true,
            },
        ];

        // Initialize Ministry Templates
        this.ministryTemplates = [
            {
                id: 'church_announcement',
                title: 'Church Announcement',
                description: 'Professional church announcements with Kingdom messaging',
                category: 'church',
                content: "Join us this Sunday as we gather to worship and grow together in faith. Whether you're a longtime member or visiting for the first time, you're welcome here. Let's build community and strengthen our faith together. #ChurchFamily #WorshipTogether #FaithCommunity #SundayService",
                scripture: 'Hebrews 10:25 - "Not neglecting to meet together, as is the habit of some, but encouraging one another."',
                hashtags: ['#ChurchFamily', '#WorshipTogether', '#FaithCommunity', '#SundayService'],
                platforms: ['instagram', 'facebook'],
                targetAudience: ['church_members', 'community', 'visitors'],
            },
            {
                id: 'ministry_update',
                title: 'Ministry Update',
                description: 'Share ministry progress and Kingdom impact',
                category: 'ministry',
                content: "God is moving in powerful ways through our ministry! This month, we've seen lives transformed, families restored, and hope renewed. Your prayers and support are making a difference. Together, we're building God's Kingdom one life at a time. #MinistryUpdate #KingdomImpact #LivesTransformed #GodIsMoving",
                scripture: 'Matthew 28:19-20 - "Go therefore and make disciples of all nations."',
                hashtags: ['#MinistryUpdate', '#KingdomImpact', '#LivesTransformed', '#GodIsMoving'],
                platforms: ['instagram', 'facebook', 'linkedin'],
                targetAudience: ['ministry_partners', 'supporters', 'community'],
            },
        ];
    }

    // Scripture Templates
    async getScriptureTemplates(category?: string, industry?: string): Promise<ScriptureTemplate[]> {
        let templates = this.scriptureTemplates;

        if (category) {
            templates = templates.filter(template => template.category === category);
        }

        if (industry) {
            templates = templates.filter(template =>
                template.industry.includes(industry) || template.industry.includes('all')
            );
        }

        return templates;
    }

    async getScriptureTemplateById(id: string): Promise<ScriptureTemplate | null> {
        return this.scriptureTemplates.find(template => template.id === id) || null;
    }

    async getScriptureTemplatesByVerse(verse: string): Promise<ScriptureTemplate[]> {
        return this.scriptureTemplates.filter(template =>
            template.verse.toLowerCase().includes(verse.toLowerCase()) ||
            template.reference.toLowerCase().includes(verse.toLowerCase())
        );
    }

    // Prayer Requests
    async createPrayerRequest(request: Omit<PrayerRequest, 'id' | 'createdAt' | 'upvotes' | 'comments'>): Promise<string> {
        const prayerRequest: PrayerRequest = {
            ...request,
            id: `prayer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date(),
            upvotes: 0,
            comments: [],
        };

        this.prayerRequests.push(prayerRequest);
        return prayerRequest.id;
    }

    async getPrayerRequests(category?: string, status?: string): Promise<PrayerRequest[]> {
        let requests = this.prayerRequests;

        if (category) {
            requests = requests.filter(request => request.category === category);
        }

        if (status) {
            requests = requests.filter(request => request.status === status);
        }

        return requests.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    async getPrayerRequestById(id: string): Promise<PrayerRequest | null> {
        return this.prayerRequests.find(request => request.id === id) || null;
    }

    async addPrayerComment(requestId: string, comment: Omit<PrayerComment, 'id' | 'createdAt'>): Promise<string> {
        const request = this.prayerRequests.find(r => r.id === requestId);
        if (!request) {
            throw new Error('Prayer request not found');
        }

        const newComment: PrayerComment = {
            ...comment,
            id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date(),
        };

        request.comments.push(newComment);
        return newComment.id;
    }

    async upvotePrayerRequest(requestId: string): Promise<boolean> {
        const request = this.prayerRequests.find(r => r.id === requestId);
        if (request) {
            request.upvotes++;
            return true;
        }
        return false;
    }

    async updatePrayerRequestStatus(requestId: string, status: PrayerRequest['status']): Promise<boolean> {
        const request = this.prayerRequests.find(r => r.id === requestId);
        if (request) {
            request.status = status;
            return true;
        }
        return false;
    }

    // Kingdom Analytics
    async getKingdomAnalytics(): Promise<KingdomAnalytics> {
        const { isFaithMode } = useDualMode();

        if (!isFaithMode) {
            return {
                spiritualImpact: {
                    scriptureShares: 0,
                    faithBasedContent: 0,
                    communityEngagement: 0,
                    prayerRequests: 0,
                },
                businessMetrics: {
                    revenue: 0,
                    growth: 0,
                    customerSatisfaction: 0,
                    teamGrowth: 0,
                },
                communityMetrics: {
                    membersReached: 0,
                    testimoniesShared: 0,
                    mentorshipConnections: 0,
                    eventsHosted: 0,
                },
            };
        }

        return {
            spiritualImpact: {
                scriptureShares: this.faithBasedContent.length * 15,
                faithBasedContent: this.faithBasedContent.length,
                communityEngagement: this.prayerRequests.length * 8,
                prayerRequests: this.prayerRequests.length,
            },
            businessMetrics: {
                revenue: 15000,
                growth: 25.5,
                customerSatisfaction: 4.8,
                teamGrowth: 12.3,
            },
            communityMetrics: {
                membersReached: 2500,
                testimoniesShared: 45,
                mentorshipConnections: 23,
                eventsHosted: 8,
            },
        };
    }

    // Faith-Based Content
    async createFaithBasedContent(content: Omit<FaithBasedContent, 'id' | 'engagement' | 'spiritualImpact'>): Promise<string> {
        const faithContent: FaithBasedContent = {
            ...content,
            id: `faith_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            engagement: {
                likes: 0,
                comments: 0,
                shares: 0,
                saves: 0,
            },
            spiritualImpact: {
                livesTouched: 0,
                conversions: 0,
                communityGrowth: 0,
            },
        };

        this.faithBasedContent.push(faithContent);
        return faithContent.id;
    }

    async getFaithBasedContent(category?: string): Promise<FaithBasedContent[]> {
        let content = this.faithBasedContent;

        if (category) {
            content = content.filter(item => item.category === category);
        }

        return content.sort((a, b) => b.engagement.likes - a.engagement.likes);
    }

    async updateFaithContentEngagement(contentId: string, engagement: Partial<FaithBasedContent['engagement']>): Promise<boolean> {
        const content = this.faithBasedContent.find(c => c.id === contentId);
        if (content) {
            content.engagement = { ...content.engagement, ...engagement };
            return true;
        }
        return false;
    }

    // Ministry Templates
    async getMinistryTemplates(category?: string): Promise<MinistryTemplate[]> {
        let templates = this.ministryTemplates;

        if (category) {
            templates = templates.filter(template => template.category === category);
        }

        return templates;
    }

    async getMinistryTemplateById(id: string): Promise<MinistryTemplate | null> {
        return this.ministryTemplates.find(template => template.id === id) || null;
    }

    // Faith-Based Hashtags
    async getFaithBasedHashtags(category: string): Promise<string[]> {
        const hashtagCategories = {
            business: [
                '#KingdomBusiness', '#FaithBasedSuccess', '#DivineExcellence', '#BiblicalWisdom',
                '#ChristianEntrepreneur', '#KingdomEntrepreneur', '#FaithDriven', '#GodsPlan',
            ],
            motivation: [
                '#FaithBasedMotivation', '#KingdomMindset', '#DivinePurpose', '#GodsStrength',
                '#FaithOverFear', '#TrustGod', '#SeekFirst', '#KingdomPriority',
            ],
            community: [
                '#FaithCommunity', '#KingdomFellowship', '#ChristianCommunity', '#ChurchFamily',
                '#FaithBasedNetwork', '#KingdomConnections', '#ChristianFellowship', '#FaithFriends',
            ],
            testimony: [
                '#Testimony', '#GodIsGood', '#FaithfulGod', '#AnsweredPrayer',
                '#GodsGrace', '#Transformation', '#KingdomImpact', '#LivesChanged',
            ],
            prayer: [
                '#Prayer', '#PrayerWarrior', '#FaithfulPrayer', '#GodAnswers',
                '#PrayerWorks', '#KingdomPrayer', '#DivineIntervention', '#FaithfulGod',
            ],
        };

        return hashtagCategories[category as keyof typeof hashtagCategories] || hashtagCategories.business;
    }

    // Daily Devotional
    async getDailyDevotional(): Promise<{
        verse: string;
        reference: string;
        reflection: string;
        prayer: string;
        application: string;
    }> {
        const devotionals = [
            {
                verse: 'I can do all things through Christ who strengthens me.',
                reference: 'Philippians 4:13',
                reflection: 'Your strength comes from Christ, not from your circumstances. Today, remember that you have access to unlimited power through Him.',
                prayer: 'Lord, help me to rely on Your strength today. Remind me that I can do all things through You.',
                application: 'When you face challenges today, remind yourself that Christ gives you strength. Trust in His power, not your own.',
            },
            {
                verse: 'Trust in the Lord with all your heart, and lean not on your own understanding.',
                reference: 'Proverbs 3:5',
                reflection: 'God's wisdom far exceeds our own.When we trust Him completely, He guides our paths in ways we could never imagine.',
        prayer: 'Father, help me to trust You completely today. Guide my decisions and lead me in Your ways.',
                application: 'Before making any decision today, pause and ask God for guidance. Trust His wisdom over your own understanding.',
            },
        ];

        const today = new Date();
        const index = today.getDate() % devotionals.length;
        return devotionals[index];
    }

    // Faith-Based Content Suggestions
    async getFaithBasedSuggestions(industry: string): Promise<{
        scripture: string;
        content: string;
        hashtags: string[];
        platforms: string[];
    }[]> {
        const suggestions = {
            entrepreneurship: [
                {
                    scripture: 'Proverbs 16:3',
                    content: 'Building a Kingdom business means aligning every decision with God\'s principles. Success becomes more than profit—it becomes purpose.',
                    hashtags: ['#KingdomBusiness', '#FaithBasedSuccess', '#DivineExcellence'],
                    platforms: ['instagram', 'linkedin'],
                },
            ],
            leadership: [
                {
                    scripture: 'Matthew 20:26-28',
                    content: 'True leadership is about serving others. Lead with humility and love, following Jesus\' example.',
                    hashtags: ['#ServantLeadership', '#KingdomLeadership', '#LeadWithLove'],
                    platforms: ['linkedin', 'instagram'],
                },
            ],
            community: [
                {
                    scripture: 'Hebrews 10:24-25',
                    content: 'We were created for community. Encourage one another and build each other up in faith.',
                    hashtags: ['#FaithCommunity', '#EncourageOneAnother', '#KingdomFellowship'],
                    platforms: ['facebook', 'instagram'],
                },
            ],
        };

        return suggestions[industry as keyof typeof suggestions] || suggestions.entrepreneurship;
    }

    // Spiritual Impact Tracking
    async trackSpiritualImpact(action: string, data?: any): Promise<void> {
        console.log('Spiritual impact tracked:', { action, data, timestamp: new Date() });
    }

    async getSpiritualImpactReport(): Promise<{
        totalLivesTouched: number;
        testimoniesShared: number;
        prayerRequestsAnswered: number;
        communityGrowth: number;
        scriptureShares: number;
    }> {
        return {
            totalLivesTouched: this.faithBasedContent.reduce((sum, content) => sum + content.spiritualImpact.livesTouched, 0),
            testimoniesShared: this.faithBasedContent.filter(content => content.category === 'testimony').length,
            prayerRequestsAnswered: this.prayerRequests.filter(request => request.status === 'answered').length,
            communityGrowth: this.getKingdomAnalytics().then(analytics => analytics.communityMetrics.membersReached),
            scriptureShares: this.scriptureTemplates.length * 10, // Mock data
        };
    }
}

export default FaithEncouragementService.getInstance(); 
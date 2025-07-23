import { Platform } from 'react-native';

export interface PropheticEncouragement {
    id: string;
    userId: string;
    userName: string;
    type: 'manual' | 'ai-generated' | 'scripture-based' | 'testimony-based';
    message: string;
    scripture?: string;
    category: 'encouragement' | 'guidance' | 'comfort' | 'direction' | 'warning';
    intensity: 'gentle' | 'moderate' | 'strong' | 'urgent';
    isPublic: boolean;
    isAnonymous: boolean;
    faithMode: true;
    createdAt: Date;
    expiresAt?: Date;
    isDelivered: boolean;
    deliveredAt?: Date;
    responseReceived: boolean;
    responseMessage?: string;
}

export interface DevotionalChallenge {
    id: string;
    title: string;
    description: string;
    type: 'daily-prayer' | 'fasting' | 'declarations' | 'scripture-study' | 'worship' | 'service';
    duration: number; // days
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    category: 'spiritual-growth' | 'discipline' | 'worship' | 'service' | 'breakthrough';
    dailyTasks: DevotionalTask[];
    rewards: ChallengeReward[];
    participants: ChallengeParticipant[];
    faithMode: true;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    isPublic: boolean;
    maxParticipants: number;
    currentParticipants: number;
}

export interface DevotionalTask {
    id: string;
    day: number;
    title: string;
    description: string;
    type: 'prayer' | 'study' | 'declaration' | 'action' | 'reflection';
    duration: number; // minutes
    scripture?: string;
    prayer?: string;
    declaration?: string;
    action?: string;
    isCompleted: boolean;
    completedAt?: Date;
    notes?: string;
}

export interface ChallengeReward {
    id: string;
    title: string;
    description: string;
    type: 'spiritual' | 'community' | 'recognition' | 'gift';
    value: string;
    isUnlocked: boolean;
    unlockedAt?: Date;
}

export interface ChallengeParticipant {
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    joinDate: Date;
    progress: number; // 0-100
    completedTasks: number;
    totalTasks: number;
    isActive: boolean;
    lastActivity: Date;
    notes: string[];
}

export interface SpiritualFamily {
    id: string;
    userId: string;
    familyType: 'mentor' | 'mentee' | 'prayer-partner' | 'accountability-partner' | 'friend';
    connectionId: string;
    connectionName: string;
    connectionAvatar?: string;
    relationshipStrength: number; // 0-100
    lastInteraction: Date;
    interactionFrequency: 'daily' | 'weekly' | 'monthly' | 'occasional';
    faithMode: true;
    isActive: boolean;
    notes: string[];
}

export interface KingdomAlignment {
    id: string;
    userId: string;
    spiritualGifts: string[];
    ministryAreas: string[];
    passionAreas: string[];
    growthAreas: string[];
    prayerLife: 'beginner' | 'intermediate' | 'advanced';
    bibleStudy: 'beginner' | 'intermediate' | 'advanced';
    worshipStyle: 'contemporary' | 'traditional' | 'charismatic' | 'contemplative';
    serviceHeart: 'evangelism' | 'discipleship' | 'mercy' | 'administration' | 'leadership';
    faithMode: true;
    lastUpdated: Date;
}

export interface PropheticToggle {
    id: string;
    userId: string;
    isEnabled: boolean;
    preferences: {
        frequency: 'daily' | 'weekly' | 'monthly' | 'on-demand';
        categories: string[];
        intensity: string[];
        deliveryTime?: string;
        isPublic: boolean;
    };
    faithMode: true;
    lastUpdated: Date;
}

export interface DevotionalTracker {
    id: string;
    userId: string;
    currentChallenge?: string;
    completedChallenges: string[];
    dailyStreak: number;
    longestStreak: number;
    totalPrayerTime: number; // minutes
    totalStudyTime: number; // minutes
    declarations: Declaration[];
    fastingRecords: FastingRecord[];
    faithMode: true;
    lastUpdated: Date;
}

export interface Declaration {
    id: string;
    userId: string;
    declaration: string;
    scripture?: string;
    category: 'identity' | 'promise' | 'victory' | 'blessing';
    frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
    isActive: boolean;
    startDate: Date;
    endDate?: Date;
    faithMode: true;
}

export interface FastingRecord {
    id: string;
    userId: string;
    type: 'food' | 'social-media' | 'entertainment' | 'other';
    duration: number; // hours
    purpose: string;
    startDate: Date;
    endDate: Date;
    isCompleted: boolean;
    notes?: string;
    faithMode: true;
}

export interface SpiritualFamilySuggestor {
    id: string;
    userId: string;
    suggestedConnections: SuggestedConnection[];
    compatibilityScores: Map<string, number>;
    lastRecommendation: Date;
    faithMode: true;
}

export interface SuggestedConnection {
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    compatibilityScore: number;
    reason: string[];
    connectionType: 'mentor' | 'mentee' | 'prayer-partner' | 'accountability-partner' | 'friend';
    faithMode: true;
}

class FaithModeService {
    private propheticEncouragements: PropheticEncouragement[] = [];
    private devotionalChallenges: DevotionalChallenge[] = [];
    private spiritualFamilies: SpiritualFamily[] = [];
    private kingdomAlignments: KingdomAlignment[] = [];
    private propheticToggles: PropheticToggle[] = [];
    private devotionalTrackers: DevotionalTracker[] = [];
    private spiritualFamilySuggestors: SpiritualFamilySuggestor[] = [];

    // Toggle prophetic encouragement
    async togglePropheticEncouragement(userId: string, enabled: boolean, preferences?: any): Promise<PropheticToggle> {
        let toggle = this.propheticToggles.find(t => t.userId === userId);

        if (!toggle) {
            toggle = {
                id: `toggle_${Date.now()}`,
                userId,
                isEnabled: enabled,
                preferences: preferences || {
                    frequency: 'weekly',
                    categories: ['encouragement', 'guidance'],
                    intensity: ['gentle', 'moderate'],
                    isPublic: false,
                },
                faithMode: true,
                lastUpdated: new Date(),
            };
            this.propheticToggles.push(toggle);
        } else {
            toggle.isEnabled = enabled;
            if (preferences) {
                toggle.preferences = { ...toggle.preferences, ...preferences };
            }
            toggle.lastUpdated = new Date();
        }

        return toggle;
    }

    // Generate prophetic encouragement
    async generatePropheticEncouragement(userId: string, type: 'manual' | 'ai-generated'): Promise<PropheticEncouragement> {
        const toggle = this.propheticToggles.find(t => t.userId === userId);
        if (!toggle || !toggle.isEnabled) {
            throw new Error('Prophetic encouragement is not enabled');
        }

        const encouragement: PropheticEncouragement = {
            id: `encouragement_${Date.now()}`,
            userId,
            userName: 'Anonymous', // Would be fetched from user profile
            type,
            message: type === 'ai-generated'
                ? 'The Lord is saying to you: "I have seen your faithfulness and I am preparing something beautiful for you. Trust in My timing and continue to walk in My ways."'
                : 'Your prophetic message here...',
            category: 'encouragement',
            intensity: 'moderate',
            isPublic: toggle.preferences.isPublic,
            isAnonymous: true,
            faithMode: true,
            createdAt: new Date(),
            isDelivered: false,
            responseReceived: false,
        };

        this.propheticEncouragements.push(encouragement);
        return encouragement;
    }

    // Create devotional challenge
    async createDevotionalChallenge(challenge: Omit<DevotionalChallenge, 'id' | 'currentParticipants' | 'isActive'>): Promise<DevotionalChallenge> {
        const newChallenge: DevotionalChallenge = {
            id: `challenge_${Date.now()}`,
            ...challenge,
            currentParticipants: 0,
            isActive: true,
        };

        this.devotionalChallenges.push(newChallenge);
        return newChallenge;
    }

    // Join devotional challenge
    async joinDevotionalChallenge(challengeId: string, userId: string, userName: string): Promise<ChallengeParticipant> {
        const challenge = this.devotionalChallenges.find(c => c.id === challengeId);
        if (!challenge) throw new Error('Challenge not found');

        if (challenge.currentParticipants >= challenge.maxParticipants) {
            throw new Error('Challenge is full');
        }

        const participant: ChallengeParticipant = {
            id: `participant_${Date.now()}`,
            userId,
            userName,
            joinDate: new Date(),
            progress: 0,
            completedTasks: 0,
            totalTasks: challenge.dailyTasks.length,
            isActive: true,
            lastActivity: new Date(),
            notes: [],
        };

        challenge.participants.push(participant);
        challenge.currentParticipants++;

        return participant;
    }

    // Complete devotional task
    async completeDevotionalTask(challengeId: string, taskId: string, userId: string, notes?: string): Promise<DevotionalTask> {
        const challenge = this.devotionalChallenges.find(c => c.id === challengeId);
        if (!challenge) throw new Error('Challenge not found');

        const task = challenge.dailyTasks.find(t => t.id === taskId);
        if (!task) throw new Error('Task not found');

        task.isCompleted = true;
        task.completedAt = new Date();
        if (notes) task.notes = notes;

        // Update participant progress
        const participant = challenge.participants.find(p => p.userId === userId);
        if (participant) {
            participant.completedTasks++;
            participant.progress = (participant.completedTasks / participant.totalTasks) * 100;
            participant.lastActivity = new Date();
        }

        return task;
    }

    // Get user's devotional tracker
    async getDevotionalTracker(userId: string): Promise<DevotionalTracker> {
        let tracker = this.devotionalTrackers.find(t => t.userId === userId);

        if (!tracker) {
            tracker = {
                id: `tracker_${Date.now()}`,
                userId,
                completedChallenges: [],
                dailyStreak: 0,
                longestStreak: 0,
                totalPrayerTime: 0,
                totalStudyTime: 0,
                declarations: [],
                fastingRecords: [],
                faithMode: true,
                lastUpdated: new Date(),
            };
            this.devotionalTrackers.push(tracker);
        }

        return tracker;
    }

    // Add declaration
    async addDeclaration(declaration: Omit<Declaration, 'id' | 'startDate'>): Promise<Declaration> {
        const newDeclaration: Declaration = {
            id: `declaration_${Date.now()}`,
            ...declaration,
            startDate: new Date(),
        };

        const tracker = await this.getDevotionalTracker(declaration.userId);
        tracker.declarations.push(newDeclaration);
        tracker.lastUpdated = new Date();

        return newDeclaration;
    }

    // Add fasting record
    async addFastingRecord(record: Omit<FastingRecord, 'id' | 'startDate'>): Promise<FastingRecord> {
        const newRecord: FastingRecord = {
            id: `fasting_${Date.now()}`,
            ...record,
            startDate: new Date(),
        };

        const tracker = await this.getDevotionalTracker(record.userId);
        tracker.fastingRecords.push(newRecord);
        tracker.lastUpdated = new Date();

        return newRecord;
    }

    // Update kingdom alignment
    async updateKingdomAlignment(alignment: Omit<KingdomAlignment, 'id' | 'lastUpdated'>): Promise<KingdomAlignment> {
        let existingAlignment = this.kingdomAlignments.find(a => a.userId === alignment.userId);

        if (existingAlignment) {
            Object.assign(existingAlignment, alignment);
            existingAlignment.lastUpdated = new Date();
            return existingAlignment;
        } else {
            const newAlignment: KingdomAlignment = {
                id: `alignment_${Date.now()}`,
                ...alignment,
                lastUpdated: new Date(),
            };
            this.kingdomAlignments.push(newAlignment);
            return newAlignment;
        }
    }

    // Suggest spiritual family connections
    async suggestSpiritualFamily(userId: string): Promise<SuggestedConnection[]> {
        const userAlignment = this.kingdomAlignments.find(a => a.userId === userId);
        if (!userAlignment) throw new Error('User alignment not found');

        const suggestions: SuggestedConnection[] = [];

        // Find potential mentors
        const potentialMentors = this.kingdomAlignments.filter(a =>
            a.userId !== userId &&
            a.prayerLife === 'advanced' &&
            a.bibleStudy === 'advanced'
        );

        for (const mentor of potentialMentors.slice(0, 3)) {
            const compatibilityScore = this.calculateCompatibilityScore(userAlignment, mentor);

            suggestions.push({
                id: `suggestion_${Date.now()}_${mentor.userId}`,
                userId: mentor.userId,
                userName: 'Anonymous', // Would be fetched from user profile
                compatibilityScore,
                reason: ['Spiritual maturity', 'Similar ministry areas'],
                connectionType: 'mentor',
                faithMode: true,
            });
        }

        // Find prayer partners
        const prayerPartners = this.kingdomAlignments.filter(a =>
            a.userId !== userId &&
            a.prayerLife === userAlignment.prayerLife
        );

        for (const partner of prayerPartners.slice(0, 2)) {
            const compatibilityScore = this.calculateCompatibilityScore(userAlignment, partner);

            suggestions.push({
                id: `suggestion_${Date.now()}_${partner.userId}`,
                userId: partner.userId,
                userName: 'Anonymous',
                compatibilityScore,
                reason: ['Similar prayer life', 'Compatible worship style'],
                connectionType: 'prayer-partner',
                faithMode: true,
            });
        }

        return suggestions.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    }

    // Create spiritual family connection
    async createSpiritualFamily(connection: Omit<SpiritualFamily, 'id' | 'lastInteraction'>): Promise<SpiritualFamily> {
        const newConnection: SpiritualFamily = {
            id: `family_${Date.now()}`,
            ...connection,
            lastInteraction: new Date(),
        };

        this.spiritualFamilies.push(newConnection);
        return newConnection;
    }

    // Get user's spiritual family
    async getUserSpiritualFamily(userId: string): Promise<SpiritualFamily[]> {
        return this.spiritualFamilies.filter(f => f.userId === userId && f.isActive);
    }

    // Get active devotional challenges
    async getActiveChallenges(faithMode?: boolean): Promise<DevotionalChallenge[]> {
        let filtered = this.devotionalChallenges.filter(c => c.isActive);

        if (faithMode !== undefined) {
            filtered = filtered.filter(c => c.faithMode === faithMode);
        }

        return filtered.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    }

    // Get user's prophetic encouragements
    async getUserPropheticEncouragements(userId: string): Promise<PropheticEncouragement[]> {
        return this.propheticEncouragements
            .filter(e => e.userId === userId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    // Get public prophetic encouragements
    async getPublicPropheticEncouragements(): Promise<PropheticEncouragement[]> {
        return this.propheticEncouragements
            .filter(e => e.isPublic && e.isDelivered)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    // Deliver prophetic encouragement
    async deliverPropheticEncouragement(encouragementId: string): Promise<PropheticEncouragement> {
        const encouragement = this.propheticEncouragements.find(e => e.id === encouragementId);
        if (!encouragement) throw new Error('Encouragement not found');

        encouragement.isDelivered = true;
        encouragement.deliveredAt = new Date();

        return encouragement;
    }

    // Helper method to calculate compatibility score
    private calculateCompatibilityScore(user1: KingdomAlignment, user2: KingdomAlignment): number {
        let score = 0;

        // Spiritual gifts compatibility
        const commonGifts = user1.spiritualGifts.filter(gift =>
            user2.spiritualGifts.includes(gift)
        );
        score += commonGifts.length * 10;

        // Ministry areas compatibility
        const commonMinistries = user1.ministryAreas.filter(area =>
            user2.ministryAreas.includes(area)
        );
        score += commonMinistries.length * 15;

        // Prayer life compatibility
        if (user1.prayerLife === user2.prayerLife) {
            score += 20;
        } else if (Math.abs(this.getLevelValue(user1.prayerLife) - this.getLevelValue(user2.prayerLife)) === 1) {
            score += 10;
        }

        // Worship style compatibility
        if (user1.worshipStyle === user2.worshipStyle) {
            score += 15;
        }

        return Math.min(100, score);
    }

    private getLevelValue(level: string): number {
        const levels = { beginner: 1, intermediate: 2, advanced: 3 };
        return levels[level as keyof typeof levels] || 1;
    }

    // Mock data for testing
    getMockDevotionalChallenges(): DevotionalChallenge[] {
        return [
            {
                id: 'challenge_1',
                title: '21-Day Prayer Challenge',
                description: 'Commit to 21 days of consistent prayer and see God move in your life',
                type: 'daily-prayer',
                duration: 21,
                difficulty: 'intermediate',
                category: 'spiritual-growth',
                dailyTasks: [
                    {
                        id: 'task_1',
                        day: 1,
                        title: 'Morning Prayer',
                        description: 'Start your day with 15 minutes of prayer',
                        type: 'prayer',
                        duration: 15,
                        prayer: 'Lord, thank You for this new day. Guide my steps and help me to walk in Your ways.',
                        isCompleted: false,
                    },
                ],
                rewards: [
                    {
                        id: 'reward_1',
                        title: 'Prayer Warrior Badge',
                        description: 'Earned for completing 21 days of prayer',
                        type: 'recognition',
                        value: 'Prayer Warrior',
                        isUnlocked: false,
                    },
                ],
                participants: [],
                faithMode: true,
                startDate: new Date(),
                endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
                isActive: true,
                isPublic: true,
                maxParticipants: 100,
                currentParticipants: 0,
            },
        ];
    }

    getMockPropheticEncouragements(): PropheticEncouragement[] {
        return [
            {
                id: 'encouragement_1',
                userId: 'user_1',
                userName: 'Anonymous',
                type: 'ai-generated',
                message: 'The Lord is saying to you: "I have seen your faithfulness and I am preparing something beautiful for you. Trust in My timing and continue to walk in My ways."',
                category: 'encouragement',
                intensity: 'moderate',
                isPublic: true,
                isAnonymous: true,
                faithMode: true,
                createdAt: new Date(),
                isDelivered: true,
                deliveredAt: new Date(),
                responseReceived: false,
            },
        ];
    }
}

export const faithModeService = new FaithModeService(); 
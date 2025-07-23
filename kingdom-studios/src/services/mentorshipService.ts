import { Platform } from 'react-native';

export interface Mentor {
    id: string;
    userId: string;
    name: string;
    bio: string;
    expertise: string[];
    experience: number; // years
    availability: {
        days: string[];
        timeSlots: string[];
        timezone: string;
    };
    rating: number;
    totalMentees: number;
    isActive: boolean;
    faithMode: boolean;
    spiritualGifts: string[];
    ministryFocus: string[];
    hourlyRate?: number;
    isPremium: boolean;
}

export interface Mentee {
    id: string;
    userId: string;
    name: string;
    bio: string;
    goals: string[];
    interests: string[];
    experience: number; // years
    availability: {
        days: string[];
        timeSlots: string[];
        timezone: string;
    };
    faithMode: boolean;
    spiritualGifts: string[];
    desiredMentorship: string[];
    budget?: number;
}

export interface MentorshipMatch {
    id: string;
    mentorId: string;
    menteeId: string;
    status: 'pending' | 'accepted' | 'rejected' | 'active' | 'completed';
    matchScore: number;
    compatibilityFactors: string[];
    startDate?: Date;
    endDate?: Date;
    sessions: MentorshipSession[];
    faithAlignment: {
        spiritualGifts: string[];
        ministryFocus: string[];
        prayerPreferences: string[];
    };
}

export interface MentorshipSession {
    id: string;
    matchId: string;
    scheduledTime: Date;
    duration: number; // minutes
    status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
    notes?: string;
    resources?: string[];
    faithMode: boolean;
    sessionType: 'initial' | 'regular' | 'prayer' | 'accountability' | 'teaching';
}

export interface MentorshipRoom {
    id: string;
    matchId: string;
    participants: string[];
    messages: MentorshipMessage[];
    resources: MentorshipResource[];
    isActive: boolean;
    faithMode: boolean;
}

export interface MentorshipMessage {
    id: string;
    senderId: string;
    content: string;
    timestamp: Date;
    messageType: 'text' | 'prayer' | 'scripture' | 'encouragement' | 'resource';
    isFaithMode: boolean;
}

export interface MentorshipResource {
    id: string;
    title: string;
    description: string;
    type: 'document' | 'video' | 'audio' | 'link' | 'scripture';
    url: string;
    uploadedBy: string;
    uploadedAt: Date;
    tags: string[];
    faithMode: boolean;
}

export class MentorshipService {
    private static instance: MentorshipService;
    private mentors: Map<string, Mentor> = new Map();
    private mentees: Map<string, Mentee> = new Map();
    private matches: Map<string, MentorshipMatch> = new Map();
    private sessions: Map<string, MentorshipSession> = new Map();
    private rooms: Map<string, MentorshipRoom> = new Map();

    static getInstance(): MentorshipService {
        if (!MentorshipService.instance) {
            MentorshipService.instance = new MentorshipService();
        }
        return MentorshipService.instance;
    }

    // Register as a mentor
    async registerMentor(mentorData: Partial<Mentor>): Promise<Mentor> {
        const mentor: Mentor = {
            id: `mentor_${Date.now()}`,
            userId: mentorData.userId || '',
            name: mentorData.name || '',
            bio: mentorData.bio || '',
            expertise: mentorData.expertise || [],
            experience: mentorData.experience || 0,
            availability: mentorData.availability || {
                days: [],
                timeSlots: [],
                timezone: 'UTC',
            },
            rating: 0,
            totalMentees: 0,
            isActive: true,
            faithMode: mentorData.faithMode || false,
            spiritualGifts: mentorData.spiritualGifts || [],
            ministryFocus: mentorData.ministryFocus || [],
            hourlyRate: mentorData.hourlyRate,
            isPremium: mentorData.isPremium || false,
        };

        this.mentors.set(mentor.id, mentor);
        return mentor;
    }

    // Register as a mentee
    async registerMentee(menteeData: Partial<Mentee>): Promise<Mentee> {
        const mentee: Mentee = {
            id: `mentee_${Date.now()}`,
            userId: menteeData.userId || '',
            name: menteeData.name || '',
            bio: menteeData.bio || '',
            goals: menteeData.goals || [],
            interests: menteeData.interests || [],
            experience: menteeData.experience || 0,
            availability: menteeData.availability || {
                days: [],
                timeSlots: [],
                timezone: 'UTC',
            },
            faithMode: menteeData.faithMode || false,
            spiritualGifts: menteeData.spiritualGifts || [],
            desiredMentorship: menteeData.desiredMentorship || [],
            budget: menteeData.budget,
        };

        this.mentees.set(mentee.id, mentee);
        return mentee;
    }

    // Find mentor matches for a mentee
    async findMentorMatches(menteeId: string): Promise<Mentor[]> {
        const mentee = this.mentees.get(menteeId);
        if (!mentee) {
            throw new Error('Mentee not found');
        }

        const availableMentors = Array.from(this.mentors.values()).filter(mentor => mentor.isActive);

        // Calculate match scores
        const matches = availableMentors.map(mentor => {
            const matchScore = this.calculateMatchScore(mentee, mentor);
            return { mentor, matchScore };
        });

        // Sort by match score and return top matches
        return matches
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 10)
            .map(match => match.mentor);
    }

    // Find mentee matches for a mentor
    async findMenteeMatches(mentorId: string): Promise<Mentee[]> {
        const mentor = this.mentors.get(mentorId);
        if (!mentor) {
            throw new Error('Mentor not found');
        }

        const availableMentees = Array.from(this.mentees.values());

        // Calculate match scores
        const matches = availableMentees.map(mentee => {
            const matchScore = this.calculateMatchScore(mentee, mentor);
            return { mentee, matchScore };
        });

        // Sort by match score and return top matches
        return matches
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 10)
            .map(match => match.mentee);
    }

    // Request mentorship
    async requestMentorship(mentorId: string, menteeId: string): Promise<MentorshipMatch> {
        const mentor = this.mentors.get(mentorId);
        const mentee = this.mentees.get(menteeId);

        if (!mentor || !mentee) {
            throw new Error('Mentor or mentee not found');
        }

        const matchScore = this.calculateMatchScore(mentee, mentor);
        const compatibilityFactors = this.getCompatibilityFactors(mentee, mentor);

        const match: MentorshipMatch = {
            id: `match_${Date.now()}`,
            mentorId,
            menteeId,
            status: 'pending',
            matchScore,
            compatibilityFactors,
            sessions: [],
            faithAlignment: {
                spiritualGifts: this.getCommonSpiritualGifts(mentee, mentor),
                ministryFocus: this.getCommonMinistryFocus(mentee, mentor),
                prayerPreferences: this.getPrayerPreferences(mentee, mentor),
            },
        };

        this.matches.set(match.id, match);

        // Send notification to mentor
        await this.notifyMentor(mentor, mentee, match);

        return match;
    }

    // Accept mentorship request
    async acceptMentorship(matchId: string): Promise<MentorshipMatch> {
        const match = this.matches.get(matchId);
        if (!match) {
            throw new Error('Match not found');
        }

        match.status = 'accepted';
        match.startDate = new Date();

        // Create mentorship room
        await this.createMentorshipRoom(match);

        return match;
    }

    // Reject mentorship request
    async rejectMentorship(matchId: string): Promise<MentorshipMatch> {
        const match = this.matches.get(matchId);
        if (!match) {
            throw new Error('Match not found');
        }

        match.status = 'rejected';
        return match;
    }

    // Schedule a mentorship session
    async scheduleSession(matchId: string, sessionData: Partial<MentorshipSession>): Promise<MentorshipSession> {
        const match = this.matches.get(matchId);
        if (!match) {
            throw new Error('Match not found');
        }

        const session: MentorshipSession = {
            id: `session_${Date.now()}`,
            matchId,
            scheduledTime: sessionData.scheduledTime || new Date(),
            duration: sessionData.duration || 60,
            status: 'scheduled',
            notes: sessionData.notes,
            resources: sessionData.resources || [],
            faithMode: sessionData.faithMode || false,
            sessionType: sessionData.sessionType || 'regular',
        };

        this.sessions.set(session.id, session);
        match.sessions.push(session);

        // Send notifications
        await this.notifySessionScheduled(session);

        return session;
    }

    // Get mentorship room
    async getMentorshipRoom(matchId: string): Promise<MentorshipRoom | null> {
        return this.rooms.get(matchId) || null;
    }

    // Send message in mentorship room
    async sendMessage(roomId: string, messageData: Partial<MentorshipMessage>): Promise<MentorshipMessage> {
        const room = this.rooms.get(roomId);
        if (!room) {
            throw new Error('Room not found');
        }

        const message: MentorshipMessage = {
            id: `msg_${Date.now()}`,
            senderId: messageData.senderId || '',
            content: messageData.content || '',
            timestamp: new Date(),
            messageType: messageData.messageType || 'text',
            isFaithMode: messageData.isFaithMode || false,
        };

        room.messages.push(message);

        // Send notification to other participants
        await this.notifyMessageReceived(room, message);

        return message;
    }

    // Share resource in mentorship room
    async shareResource(roomId: string, resourceData: Partial<MentorshipResource>): Promise<MentorshipResource> {
        const room = this.rooms.get(roomId);
        if (!room) {
            throw new Error('Room not found');
        }

        const resource: MentorshipResource = {
            id: `resource_${Date.now()}`,
            title: resourceData.title || '',
            description: resourceData.description || '',
            type: resourceData.type || 'document',
            url: resourceData.url || '',
            uploadedBy: resourceData.uploadedBy || '',
            uploadedAt: new Date(),
            tags: resourceData.tags || [],
            faithMode: resourceData.faithMode || false,
        };

        room.resources.push(resource);

        return resource;
    }

    // Get active mentorships for a user
    async getActiveMentorships(userId: string): Promise<MentorshipMatch[]> {
        return Array.from(this.matches.values()).filter(match => {
            const mentor = this.mentors.get(match.mentorId);
            const mentee = this.mentees.get(match.menteeId);
            return (mentor?.userId === userId || mentee?.userId === userId) && match.status === 'active';
        });
    }

    // Get mentorship statistics
    async getMentorshipStats(userId: string): Promise<any> {
        const userMatches = Array.from(this.matches.values()).filter(match => {
            const mentor = this.mentors.get(match.mentorId);
            const mentee = this.mentees.get(match.menteeId);
            return mentor?.userId === userId || mentee?.userId === userId;
        });

        return {
            totalMatches: userMatches.length,
            activeMatches: userMatches.filter(m => m.status === 'active').length,
            completedSessions: userMatches.reduce((total, match) =>
                total + match.sessions.filter(s => s.status === 'completed').length, 0
            ),
            averageRating: 4.5, // Mock data
        };
    }

    // Private methods
    private calculateMatchScore(mentee: Mentee, mentor: Mentor): number {
        let score = 0;

        // Expertise match
        const expertiseMatch = mentee.interests.filter(interest =>
            mentor.expertise.includes(interest)
        ).length;
        score += expertiseMatch * 20;

        // Availability match
        const availabilityMatch = this.calculateAvailabilityMatch(mentee.availability, mentor.availability);
        score += availabilityMatch * 30;

        // Faith mode match
        if (mentee.faithMode === mentor.faithMode) {
            score += 25;
        }

        // Spiritual gifts match
        const spiritualGiftsMatch = mentee.spiritualGifts.filter(gift =>
            mentor.spiritualGifts.includes(gift)
        ).length;
        score += spiritualGiftsMatch * 15;

        // Budget match
        if (mentor.hourlyRate && mentee.budget) {
            if (mentor.hourlyRate <= mentee.budget) {
                score += 10;
            }
        }

        return Math.min(score, 100);
    }

    private calculateAvailabilityMatch(menteeAvail: any, mentorAvail: any): number {
        const commonDays = menteeAvail.days.filter((day: string) =>
            mentorAvail.days.includes(day)
        ).length;

        const commonSlots = menteeAvail.timeSlots.filter((slot: string) =>
            mentorAvail.timeSlots.includes(slot)
        ).length;

        return (commonDays * 10) + (commonSlots * 5);
    }

    private getCompatibilityFactors(mentee: Mentee, mentor: Mentor): string[] {
        const factors = [];

        if (mentee.faithMode && mentor.faithMode) {
            factors.push('Faith Mode Alignment');
        }

        const expertiseMatch = mentee.interests.filter(interest =>
            mentor.expertise.includes(interest)
        );
        if (expertiseMatch.length > 0) {
            factors.push('Expertise Match');
        }

        const spiritualGiftsMatch = mentee.spiritualGifts.filter(gift =>
            mentor.spiritualGifts.includes(gift)
        );
        if (spiritualGiftsMatch.length > 0) {
            factors.push('Spiritual Gifts Alignment');
        }

        return factors;
    }

    private getCommonSpiritualGifts(mentee: Mentee, mentor: Mentor): string[] {
        return mentee.spiritualGifts.filter(gift => mentor.spiritualGifts.includes(gift));
    }

    private getCommonMinistryFocus(mentee: Mentee, mentor: Mentor): string[] {
        return mentee.desiredMentorship.filter(focus => mentor.ministryFocus.includes(focus));
    }

    private getPrayerPreferences(mentee: Mentee, mentor: Mentor): string[] {
        // Mock prayer preferences based on faith mode
        if (mentee.faithMode && mentor.faithMode) {
            return ['Daily Prayer', 'Scripture Study', 'Worship', 'Testimony Sharing'];
        }
        return [];
    }

    private async createMentorshipRoom(match: MentorshipMatch): Promise<void> {
        const room: MentorshipRoom = {
            id: match.id,
            matchId: match.id,
            participants: [match.mentorId, match.menteeId],
            messages: [],
            resources: [],
            isActive: true,
            faithMode: match.faithAlignment.spiritualGifts.length > 0,
        };

        this.rooms.set(room.id, room);
    }

    private async notifyMentor(mentor: Mentor, mentee: Mentee, match: MentorshipMatch): Promise<void> {
        console.log(`Notifying mentor ${mentor.name} about mentee request from ${mentee.name}`);
    }

    private async notifySessionScheduled(session: MentorshipSession): Promise<void> {
        console.log(`Notifying participants about scheduled session: ${session.id}`);
    }

    private async notifyMessageReceived(room: MentorshipRoom, message: MentorshipMessage): Promise<void> {
        console.log(`Notifying participants about new message in room: ${room.id}`);
    }

    // Mock data for development
    getMockMentors(): Mentor[] {
        return [
            {
                id: 'mentor_1',
                userId: 'user_1',
                name: 'Pastor Sarah Johnson',
                bio: 'Experienced pastor with 15 years in ministry leadership',
                expertise: ['Leadership', 'Prayer', 'Bible Study', 'Counseling'],
                experience: 15,
                availability: {
                    days: ['Monday', 'Wednesday', 'Friday'],
                    timeSlots: ['09:00', '14:00', '19:00'],
                    timezone: 'America/New_York',
                },
                rating: 4.8,
                totalMentees: 12,
                isActive: true,
                faithMode: true,
                spiritualGifts: ['Teaching', 'Leadership', 'Pastoring'],
                ministryFocus: ['Youth Ministry', 'Prayer Ministry', 'Counseling'],
                hourlyRate: 50,
                isPremium: true,
            },
            {
                id: 'mentor_2',
                userId: 'user_2',
                name: 'Dr. Michael Chen',
                bio: 'Christian counselor specializing in family and marriage',
                expertise: ['Counseling', 'Marriage', 'Family', 'Psychology'],
                experience: 20,
                availability: {
                    days: ['Tuesday', 'Thursday', 'Saturday'],
                    timeSlots: ['10:00', '15:00', '18:00'],
                    timezone: 'America/Chicago',
                },
                rating: 4.9,
                totalMentees: 8,
                isActive: true,
                faithMode: true,
                spiritualGifts: ['Counseling', 'Wisdom', 'Discernment'],
                ministryFocus: ['Family Ministry', 'Marriage Counseling', 'Mental Health'],
                hourlyRate: 75,
                isPremium: true,
            },
        ];
    }

    getMockMentees(): Mentee[] {
        return [
            {
                id: 'mentee_1',
                userId: 'user_3',
                name: 'Emily Rodriguez',
                bio: 'Young leader looking to grow in ministry',
                goals: ['Develop leadership skills', 'Learn prayer ministry', 'Grow spiritually'],
                interests: ['Leadership', 'Prayer', 'Youth Ministry'],
                experience: 3,
                availability: {
                    days: ['Monday', 'Wednesday', 'Friday'],
                    timeSlots: ['19:00', '20:00'],
                    timezone: 'America/New_York',
                },
                faithMode: true,
                spiritualGifts: ['Teaching', 'Encouragement'],
                desiredMentorship: ['Leadership Development', 'Prayer Ministry'],
                budget: 60,
            },
            {
                id: 'mentee_2',
                userId: 'user_4',
                name: 'David Thompson',
                bio: 'Married father seeking guidance in family ministry',
                goals: ['Strengthen marriage', 'Lead family devotions', 'Serve in church'],
                interests: ['Marriage', 'Family', 'Counseling'],
                experience: 5,
                availability: {
                    days: ['Tuesday', 'Thursday'],
                    timeSlots: ['18:00', '19:00'],
                    timezone: 'America/Chicago',
                },
                faithMode: true,
                spiritualGifts: ['Service', 'Hospitality'],
                desiredMentorship: ['Family Ministry', 'Marriage Counseling'],
                budget: 80,
            },
        ];
    }
}

export const mentorshipService = MentorshipService.getInstance(); 
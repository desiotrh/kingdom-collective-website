import { Platform } from 'react-native';

export interface Mentor {
    id: string;
    userId: string;
    name: string;
    avatarUrl?: string;
    bio: string;
    expertise: string[];
    experience: number; // years
    availability: Availability[];
    faithMode: boolean;
    spiritualAlignment: SpiritualAlignment;
    rating: number;
    totalMentees: number;
    isActive: boolean;
    languages: string[];
    certifications: string[];
    specialties: string[];
}

export interface Mentee {
    id: string;
    userId: string;
    name: string;
    avatarUrl?: string;
    bio: string;
    goals: string[];
    interests: string[];
    experience: number; // years
    availability: Availability[];
    faithMode: boolean;
    spiritualAlignment: SpiritualAlignment;
    preferredMentorType: 'faith-based' | 'general' | 'both';
    isActive: boolean;
}

export interface Availability {
    day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
    timeSlots: TimeSlot[];
}

export interface TimeSlot {
    startTime: string; // HH:MM format
    endTime: string; // HH:MM format
    timezone: string;
}

export interface SpiritualAlignment {
    denomination?: string;
    spiritualGifts?: string[];
    prayerLife: 'beginner' | 'intermediate' | 'advanced';
    bibleStudy: 'beginner' | 'intermediate' | 'advanced';
    ministryInvolvement: string[];
    spiritualGoals: string[];
}

export interface MentorshipMatch {
    id: string;
    mentorId: string;
    menteeId: string;
    status: 'pending' | 'accepted' | 'rejected' | 'active' | 'completed' | 'paused';
    matchDate: Date;
    startDate?: Date;
    endDate?: Date;
    compatibilityScore: number;
    matchReason: string[];
    faithMode: boolean;
}

export interface MentorshipRoom {
    matchId: string;
    mentorId: string;
    menteeId: string;
    messages: MentorshipMessage[];
    resources: SharedResource[];
    sessions: MentorshipSession[];
    goals: MentorshipGoal[];
    notes: MentorshipNote[];
    faithMode: boolean;
}

export interface MentorshipMessage {
    id: string;
    senderId: string;
    message: string;
    timestamp: Date;
    type: 'text' | 'prayer' | 'encouragement' | 'resource' | 'goal';
    isRead: boolean;
}

export interface SharedResource {
    id: string;
    title: string;
    description: string;
    type: 'document' | 'video' | 'audio' | 'link' | 'scripture';
    url?: string;
    content?: string;
    uploadedBy: string;
    uploadDate: Date;
    tags: string[];
    faithMode: boolean;
}

export interface MentorshipSession {
    id: string;
    title: string;
    description: string;
    scheduledTime: Date;
    duration: number; // minutes
    status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
    notes?: string;
    recordingUrl?: string;
    faithMode: boolean;
}

export interface MentorshipGoal {
    id: string;
    title: string;
    description: string;
    category: 'spiritual' | 'personal' | 'professional' | 'ministry';
    targetDate: Date;
    status: 'active' | 'completed' | 'paused';
    progress: number; // 0-100
    milestones: GoalMilestone[];
    faithMode: boolean;
}

export interface GoalMilestone {
    id: string;
    title: string;
    description: string;
    targetDate: Date;
    status: 'pending' | 'completed' | 'overdue';
}

export interface MentorshipNote {
    id: string;
    title: string;
    content: string;
    authorId: string;
    timestamp: Date;
    tags: string[];
    isPrivate: boolean;
    faithMode: boolean;
}

export interface MatchFinderCriteria {
    expertise?: string[];
    availability?: Availability[];
    faithMode?: boolean;
    spiritualAlignment?: Partial<SpiritualAlignment>;
    location?: string;
    languages?: string[];
    experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
    preferredMeetingType?: 'video' | 'audio' | 'text' | 'mixed';
}

class MentorshipService {
    private mentors: Mentor[] = [];
    private mentees: Mentee[] = [];
    private matches: MentorshipMatch[] = [];
    private rooms: Map<string, MentorshipRoom> = new Map();

    // Register as mentor
    async registerMentor(mentorData: Omit<Mentor, 'id' | 'rating' | 'totalMentees' | 'isActive'>): Promise<Mentor> {
        const newMentor: Mentor = {
            id: `mentor_${Date.now()}`,
            ...mentorData,
            rating: 0,
            totalMentees: 0,
            isActive: true,
        };

        this.mentors.push(newMentor);
        return newMentor;
    }

    // Register as mentee
    async registerMentee(menteeData: Omit<Mentee, 'id' | 'isActive'>): Promise<Mentee> {
        const newMentee: Mentee = {
            id: `mentee_${Date.now()}`,
            ...menteeData,
            isActive: true,
        };

        this.mentees.push(newMentee);
        return newMentee;
    }

    // Find mentor matches
    async findMentorMatches(menteeId: string, criteria: MatchFinderCriteria): Promise<Mentor[]> {
        const mentee = this.mentees.find(m => m.id === menteeId);
        if (!mentee) throw new Error('Mentee not found');

        let matches = this.mentors.filter(mentor =>
            mentor.isActive &&
            !this.hasExistingMatch(mentor.id, menteeId)
        );

        // Filter by faith mode
        if (criteria.faithMode !== undefined) {
            matches = matches.filter(mentor => mentor.faithMode === criteria.faithMode);
        }

        // Filter by expertise
        if (criteria.expertise && criteria.expertise.length > 0) {
            matches = matches.filter(mentor =>
                criteria.expertise!.some(exp => mentor.expertise.includes(exp))
            );
        }

        // Filter by availability
        if (criteria.availability) {
            matches = matches.filter(mentor =>
                this.hasMatchingAvailability(mentor.availability, criteria.availability!)
            );
        }

        // Filter by spiritual alignment
        if (criteria.spiritualAlignment) {
            matches = matches.filter(mentor =>
                this.hasCompatibleSpiritualAlignment(mentor.spiritualAlignment, criteria.spiritualAlignment!)
            );
        }

        // Filter by languages
        if (criteria.languages && criteria.languages.length > 0) {
            matches = matches.filter(mentor =>
                criteria.languages!.some(lang => mentor.languages.includes(lang))
            );
        }

        // Calculate compatibility scores and sort
        const scoredMatches = matches.map(mentor => ({
            mentor,
            score: this.calculateCompatibilityScore(mentor, mentee, criteria),
        }));

        return scoredMatches
            .sort((a, b) => b.score - a.score)
            .map(match => match.mentor);
    }

    // Create mentorship match
    async createMatch(mentorId: string, menteeId: string, faithMode: boolean): Promise<MentorshipMatch> {
        const mentor = this.mentors.find(m => m.id === mentorId);
        const mentee = this.mentees.find(m => m.id === menteeId);

        if (!mentor || !mentee) throw new Error('Mentor or mentee not found');

        const compatibilityScore = this.calculateCompatibilityScore(mentor, mentee, {});
        const matchReason = this.generateMatchReasons(mentor, mentee);

        const match: MentorshipMatch = {
            id: `match_${Date.now()}`,
            mentorId,
            menteeId,
            status: 'pending',
            matchDate: new Date(),
            compatibilityScore,
            matchReason,
            faithMode,
        };

        this.matches.push(match);
        return match;
    }

    // Accept/Reject match
    async respondToMatch(matchId: string, accepted: boolean): Promise<MentorshipMatch> {
        const match = this.matches.find(m => m.id === matchId);
        if (!match) throw new Error('Match not found');

        match.status = accepted ? 'accepted' : 'rejected';

        if (accepted) {
            match.startDate = new Date();
            // Create mentorship room
            const room: MentorshipRoom = {
                matchId,
                mentorId: match.mentorId,
                menteeId: match.menteeId,
                messages: [],
                resources: [],
                sessions: [],
                goals: [],
                notes: [],
                faithMode: match.faithMode,
            };
            this.rooms.set(matchId, room);
        }

        return match;
    }

    // Get mentorship room
    async getMentorshipRoom(matchId: string): Promise<MentorshipRoom | null> {
        return this.rooms.get(matchId) || null;
    }

    // Send message in mentorship room
    async sendMessage(matchId: string, message: Omit<MentorshipMessage, 'id' | 'timestamp'>): Promise<MentorshipMessage> {
        const room = this.rooms.get(matchId);
        if (!room) throw new Error('Mentorship room not found');

        const newMessage: MentorshipMessage = {
            id: `msg_${Date.now()}`,
            ...message,
            timestamp: new Date(),
        };

        room.messages.push(newMessage);
        return newMessage;
    }

    // Schedule session
    async scheduleSession(matchId: string, sessionData: Omit<MentorshipSession, 'id' | 'status'>): Promise<MentorshipSession> {
        const room = this.rooms.get(matchId);
        if (!room) throw new Error('Mentorship room not found');

        const newSession: MentorshipSession = {
            id: `session_${Date.now()}`,
            ...sessionData,
            status: 'scheduled',
        };

        room.sessions.push(newSession);
        return newSession;
    }

    // Add shared resource
    async addSharedResource(matchId: string, resource: Omit<SharedResource, 'id' | 'uploadDate'>): Promise<SharedResource> {
        const room = this.rooms.get(matchId);
        if (!room) throw new Error('Mentorship room not found');

        const newResource: SharedResource = {
            id: `resource_${Date.now()}`,
            ...resource,
            uploadDate: new Date(),
        };

        room.resources.push(newResource);
        return newResource;
    }

    // Create mentorship goal
    async createGoal(matchId: string, goalData: Omit<MentorshipGoal, 'id' | 'progress'>): Promise<MentorshipGoal> {
        const room = this.rooms.get(matchId);
        if (!room) throw new Error('Mentorship room not found');

        const newGoal: MentorshipGoal = {
            id: `goal_${Date.now()}`,
            ...goalData,
            progress: 0,
        };

        room.goals.push(newGoal);
        return newGoal;
    }

    // Update goal progress
    async updateGoalProgress(goalId: string, progress: number): Promise<MentorshipGoal> {
        for (const room of this.rooms.values()) {
            const goal = room.goals.find(g => g.id === goalId);
            if (goal) {
                goal.progress = Math.min(100, Math.max(0, progress));
                return goal;
            }
        }
        throw new Error('Goal not found');
    }

    // Add note
    async addNote(matchId: string, note: Omit<MentorshipNote, 'id' | 'timestamp'>): Promise<MentorshipNote> {
        const room = this.rooms.get(matchId);
        if (!room) throw new Error('Mentorship room not found');

        const newNote: MentorshipNote = {
            id: `note_${Date.now()}`,
            ...note,
            timestamp: new Date(),
        };

        room.notes.push(newNote);
        return newNote;
    }

    // Get mentor dashboard
    async getMentorDashboard(mentorId: string): Promise<{
        activeMatches: MentorshipMatch[];
        upcomingSessions: MentorshipSession[];
        recentMessages: MentorshipMessage[];
        pendingRequests: MentorshipMatch[];
    }> {
        const activeMatches = this.matches.filter(m =>
            m.mentorId === mentorId && m.status === 'active'
        );

        const upcomingSessions: MentorshipSession[] = [];
        const recentMessages: MentorshipMessage[] = [];

        for (const match of activeMatches) {
            const room = this.rooms.get(match.id);
            if (room) {
                // Get upcoming sessions
                const sessions = room.sessions.filter(s =>
                    s.status === 'scheduled' && s.scheduledTime > new Date()
                );
                upcomingSessions.push(...sessions);

                // Get recent messages
                const messages = room.messages
                    .filter(m => m.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) // Last 7 days
                    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                    .slice(0, 10);
                recentMessages.push(...messages);
            }
        }

        const pendingRequests = this.matches.filter(m =>
            m.mentorId === mentorId && m.status === 'pending'
        );

        return {
            activeMatches,
            upcomingSessions: upcomingSessions.sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime()),
            recentMessages: recentMessages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
            pendingRequests,
        };
    }

    // Get mentee dashboard
    async getMenteeDashboard(menteeId: string): Promise<{
        activeMatches: MentorshipMatch[];
        availableMentors: Mentor[];
        upcomingSessions: MentorshipSession[];
        recentMessages: MentorshipMessage[];
    }> {
        const activeMatches = this.matches.filter(m =>
            m.menteeId === menteeId && m.status === 'active'
        );

        const availableMentors = this.mentors.filter(mentor =>
            mentor.isActive && !this.hasExistingMatch(mentor.id, menteeId)
        );

        const upcomingSessions: MentorshipSession[] = [];
        const recentMessages: MentorshipMessage[] = [];

        for (const match of activeMatches) {
            const room = this.rooms.get(match.id);
            if (room) {
                const sessions = room.sessions.filter(s =>
                    s.status === 'scheduled' && s.scheduledTime > new Date()
                );
                upcomingSessions.push(...sessions);

                const messages = room.messages
                    .filter(m => m.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
                    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                    .slice(0, 10);
                recentMessages.push(...messages);
            }
        }

        return {
            activeMatches,
            availableMentors,
            upcomingSessions: upcomingSessions.sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime()),
            recentMessages: recentMessages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
        };
    }

    // Helper methods
    private hasExistingMatch(mentorId: string, menteeId: string): boolean {
        return this.matches.some(m =>
            (m.mentorId === mentorId && m.menteeId === menteeId) ||
            (m.mentorId === menteeId && m.menteeId === mentorId)
        );
    }

    private hasMatchingAvailability(mentorAvail: Availability[], menteeAvail: Availability[]): boolean {
        // Simplified availability matching
        return mentorAvail.some(mentorSlot =>
            menteeAvail.some(menteeSlot =>
                mentorSlot.day === menteeSlot.day &&
                mentorSlot.timeSlots.some(mt =>
                    menteeSlot.timeSlots.some(et =>
                        mt.startTime <= et.endTime && mt.endTime >= et.startTime
                    )
                )
            )
        );
    }

    private hasCompatibleSpiritualAlignment(mentor: SpiritualAlignment, mentee: Partial<SpiritualAlignment>): boolean {
        // Simplified spiritual alignment matching
        if (mentee.denomination && mentor.denomination) {
            return mentor.denomination === mentee.denomination;
        }
        return true; // Default to compatible if no specific denomination
    }

    private calculateCompatibilityScore(mentor: Mentor, mentee: Mentee, criteria: MatchFinderCriteria): number {
        let score = 0;

        // Faith mode compatibility
        if (mentor.faithMode === mentee.faithMode) {
            score += 30;
        }

        // Experience level compatibility
        const experienceDiff = Math.abs(mentor.experience - mentee.experience);
        if (experienceDiff <= 2) score += 20;
        else if (experienceDiff <= 5) score += 10;

        // Availability compatibility
        if (this.hasMatchingAvailability(mentor.availability, mentee.availability)) {
            score += 25;
        }

        // Spiritual alignment compatibility
        if (this.hasCompatibleSpiritualAlignment(mentor.spiritualAlignment, mentee.spiritualAlignment)) {
            score += 25;
        }

        return Math.min(100, score);
    }

    private generateMatchReasons(mentor: Mentor, mentee: Mentee): string[] {
        const reasons: string[] = [];

        if (mentor.faithMode && mentee.faithMode) {
            reasons.push('Faith-based mentorship');
        }

        if (mentor.expertise.some(exp => mentee.interests.includes(exp))) {
            reasons.push('Shared interests and expertise');
        }

        if (mentor.experience > mentee.experience + 2) {
            reasons.push('Experience level compatibility');
        }

        return reasons;
    }

    // Mock data for testing
    getMockMentors(): Mentor[] {
        return [
            {
                id: 'mentor_1',
                userId: 'user_1',
                name: 'Pastor Sarah Johnson',
                bio: 'Experienced pastor with 15+ years in ministry leadership',
                expertise: ['leadership', 'prayer', 'bible study', 'counseling'],
                experience: 15,
                availability: [
                    {
                        day: 'monday',
                        timeSlots: [{ startTime: '09:00', endTime: '17:00', timezone: 'America/New_York' }]
                    },
                    {
                        day: 'wednesday',
                        timeSlots: [{ startTime: '14:00', endTime: '18:00', timezone: 'America/New_York' }]
                    }
                ],
                faithMode: true,
                spiritualAlignment: {
                    denomination: 'Baptist',
                    spiritualGifts: ['teaching', 'leadership', 'counseling'],
                    prayerLife: 'advanced',
                    bibleStudy: 'advanced',
                    ministryInvolvement: ['pastoral care', 'youth ministry'],
                    spiritualGoals: ['spiritual growth', 'mentoring others']
                },
                rating: 4.8,
                totalMentees: 12,
                isActive: true,
                languages: ['English'],
                certifications: ['M.Div', 'Pastoral Counseling'],
                specialties: ['spiritual formation', 'ministry leadership']
            }
        ];
    }

    getMockMentees(): Mentee[] {
        return [
            {
                id: 'mentee_1',
                userId: 'user_2',
                name: 'Michael Chen',
                bio: 'Young professional seeking spiritual growth and leadership development',
                goals: ['spiritual growth', 'leadership skills', 'prayer life'],
                interests: ['bible study', 'prayer', 'ministry'],
                experience: 3,
                availability: [
                    {
                        day: 'monday',
                        timeSlots: [{ startTime: '18:00', endTime: '20:00', timezone: 'America/New_York' }]
                    },
                    {
                        day: 'saturday',
                        timeSlots: [{ startTime: '10:00', endTime: '12:00', timezone: 'America/New_York' }]
                    }
                ],
                faithMode: true,
                spiritualAlignment: {
                    denomination: 'Baptist',
                    spiritualGifts: ['service', 'encouragement'],
                    prayerLife: 'intermediate',
                    bibleStudy: 'intermediate',
                    ministryInvolvement: ['youth group', 'worship team'],
                    spiritualGoals: ['deeper prayer life', 'spiritual leadership']
                },
                preferredMentorType: 'faith-based',
                isActive: true
            }
        ];
    }
}

export const mentorshipService = new MentorshipService(); 
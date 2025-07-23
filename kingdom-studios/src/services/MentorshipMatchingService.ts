import { Platform } from 'react-native';
import { useTierSystem } from '../contexts/TierSystemContext';
import { useDualMode } from '../contexts/DualModeContext';

export interface Mentor {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    bio: string;
    expertise: string[];
    experience: number; // Years of experience
    industry: string[];
    skills: string[];
    availability: {
        days: string[];
        timeSlots: string[];
        timezone: string;
    };
    rating: number;
    totalMentees: number;
    isActive: boolean;
    faithMode: boolean;
    verified: boolean;
    hourlyRate?: number;
    languages: string[];
    certifications: string[];
    achievements: string[];
}

export interface Mentee {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    bio: string;
    goals: string[];
    currentSkills: string[];
    desiredSkills: string[];
    experience: number; // Years of experience
    industry: string[];
    availability: {
        days: string[];
        timeSlots: string[];
        timezone: string;
    };
    isActive: boolean;
    faithMode: boolean;
    budget?: number;
    preferredLanguages: string[];
}

export interface MentorshipRequest {
    id: string;
    menteeId: string;
    mentorId: string;
    status: 'pending' | 'accepted' | 'declined' | 'active' | 'completed' | 'cancelled';
    message: string;
    requestedAt: Date;
    respondedAt?: Date;
    startDate?: Date;
    endDate?: Date;
    goals: string[];
    expectedOutcomes: string[];
    meetingFrequency: 'weekly' | 'biweekly' | 'monthly' | 'as-needed';
    communicationMethod: 'video' | 'audio' | 'text' | 'in-person';
}

export interface MentorshipSession {
    id: string;
    requestId: string;
    mentorId: string;
    menteeId: string;
    date: Date;
    duration: number; // minutes
    status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
    notes: string;
    feedback: {
        rating: number;
        comments: string;
        improvements: string[];
    };
    topics: string[];
    actionItems: string[];
}

export interface MentorshipMatch {
    mentor: Mentor;
    mentee: Mentee;
    compatibilityScore: number;
    matchingSkills: string[];
    matchingGoals: string[];
    availabilityOverlap: number;
    faithModeCompatibility: boolean;
}

export interface MentorshipAnalytics {
    totalMentorships: number;
    activeMentorships: number;
    completedMentorships: number;
    averageRating: number;
    totalHours: number;
    skillsLearned: string[];
    goalsAchieved: string[];
    communityGrowth: number;
}

export class MentorshipMatchingService {
    private static instance: MentorshipMatchingService;
    private mentors: Mentor[] = [];
    private mentees: Mentee[] = [];
    private mentorshipRequests: MentorshipRequest[] = [];
    private mentorshipSessions: MentorshipSession[] = [];

    static getInstance(): MentorshipMatchingService {
        if (!MentorshipMatchingService.instance) {
            MentorshipMatchingService.instance = new MentorshipMatchingService();
            MentorshipMatchingService.instance.initializeMentorshipData();
        }
        return MentorshipMatchingService.instance;
    }

    private initializeMentorshipData(): void {
        // Initialize mentors
        this.mentors = [
            {
                id: 'mentor_1',
                name: 'Sarah Johnson',
                email: 'sarah.johnson@example.com',
                avatar: 'https://example.com/sarah.jpg',
                bio: 'Christian business coach with 15+ years of experience helping entrepreneurs build Kingdom-focused businesses. Passionate about faith-based leadership and community building.',
                expertise: ['business_strategy', 'faith_based_leadership', 'community_building', 'digital_marketing'],
                experience: 15,
                industry: ['entrepreneurship', 'ministry', 'consulting'],
                skills: ['strategic_planning', 'team_leadership', 'brand_development', 'prayer_warrior'],
                availability: {
                    days: ['Monday', 'Wednesday', 'Friday'],
                    timeSlots: ['9:00 AM', '2:00 PM', '6:00 PM'],
                    timezone: 'EST',
                },
                rating: 4.9,
                totalMentees: 23,
                isActive: true,
                faithMode: true,
                verified: true,
                hourlyRate: 150,
                languages: ['English', 'Spanish'],
                certifications: ['Certified Business Coach', 'Christian Leadership Certificate'],
                achievements: ['Helped 50+ businesses launch', 'Featured speaker at Kingdom Business Conference'],
            },
            {
                id: 'mentor_2',
                name: 'Michael Chen',
                email: 'michael.chen@example.com',
                avatar: 'https://example.com/michael.jpg',
                bio: 'Tech entrepreneur and ministry leader with expertise in scaling faith-based organizations. Specializes in digital transformation and Kingdom impact.',
                expertise: ['technology', 'ministry_leadership', 'digital_transformation', 'scaling_businesses'],
                experience: 12,
                industry: ['technology', 'ministry', 'nonprofit'],
                skills: ['technology_strategy', 'ministry_development', 'team_building', 'digital_ministry'],
                availability: {
                    days: ['Tuesday', 'Thursday', 'Saturday'],
                    timeSlots: ['10:00 AM', '3:00 PM', '7:00 PM'],
                    timezone: 'PST',
                },
                rating: 4.8,
                totalMentees: 18,
                isActive: true,
                faithMode: true,
                verified: true,
                hourlyRate: 120,
                languages: ['English', 'Mandarin'],
                certifications: ['Technology Leadership', 'Ministry Management'],
                achievements: ['Founded 3 successful tech startups', 'Led digital transformation for 20+ churches'],
            },
            {
                id: 'mentor_3',
                name: 'David Rodriguez',
                email: 'david.rodriguez@example.com',
                avatar: 'https://example.com/david.jpg',
                bio: 'Content creator and social media expert helping Christian influencers build authentic, faith-based brands. Passionate about Kingdom messaging.',
                expertise: ['content_creation', 'social_media', 'personal_branding', 'faith_based_marketing'],
                experience: 8,
                industry: ['content_creation', 'social_media', 'influencer_marketing'],
                skills: ['content_strategy', 'social_media_management', 'brand_development', 'authentic_messaging'],
                availability: {
                    days: ['Monday', 'Wednesday', 'Friday'],
                    timeSlots: ['11:00 AM', '4:00 PM', '8:00 PM'],
                    timezone: 'CST',
                },
                rating: 4.7,
                totalMentees: 31,
                isActive: true,
                faithMode: true,
                verified: true,
                hourlyRate: 100,
                languages: ['English', 'Spanish'],
                certifications: ['Content Marketing', 'Social Media Strategy'],
                achievements: ['Built 3 successful faith-based brands', 'Reached 1M+ followers across platforms'],
            },
        ];

        // Initialize mentees
        this.mentees = [
            {
                id: 'mentee_1',
                name: 'Emily Thompson',
                email: 'emily.thompson@example.com',
                avatar: 'https://example.com/emily.jpg',
                bio: 'New entrepreneur looking to build a Kingdom-focused business. Seeking guidance on faith-based leadership and business strategy.',
                goals: ['launch_business', 'develop_leadership_skills', 'build_community'],
                currentSkills: ['basic_marketing', 'social_media'],
                desiredSkills: ['business_strategy', 'faith_based_leadership', 'team_management'],
                experience: 2,
                industry: ['entrepreneurship', 'retail'],
                availability: {
                    days: ['Monday', 'Wednesday', 'Friday'],
                    timeSlots: ['9:00 AM', '2:00 PM', '6:00 PM'],
                    timezone: 'EST',
                },
                isActive: true,
                faithMode: true,
                budget: 100,
                preferredLanguages: ['English'],
            },
            {
                id: 'mentee_2',
                name: 'James Wilson',
                email: 'james.wilson@example.com',
                avatar: 'https://example.com/james.jpg',
                bio: 'Ministry leader wanting to expand digital presence and reach more people with Kingdom message.',
                goals: ['digital_ministry', 'content_creation', 'community_building'],
                currentSkills: ['ministry_leadership', 'public_speaking'],
                desiredSkills: ['digital_marketing', 'content_strategy', 'technology_integration'],
                experience: 5,
                industry: ['ministry', 'nonprofit'],
                availability: {
                    days: ['Tuesday', 'Thursday', 'Saturday'],
                    timeSlots: ['10:00 AM', '3:00 PM', '7:00 PM'],
                    timezone: 'PST',
                },
                isActive: true,
                faithMode: true,
                budget: 80,
                preferredLanguages: ['English'],
            },
        ];
    }

    // Mentor Management
    async getMentors(filters?: {
        expertise?: string[];
        industry?: string[];
        faithMode?: boolean;
        availability?: string[];
    }): Promise<Mentor[]> {
        let mentors = this.mentors.filter(mentor => mentor.isActive);

        if (filters?.expertise) {
            mentors = mentors.filter(mentor =>
                filters.expertise!.some(exp => mentor.expertise.includes(exp))
            );
        }

        if (filters?.industry) {
            mentors = mentors.filter(mentor =>
                filters.industry!.some(ind => mentor.industry.includes(ind))
            );
        }

        if (filters?.faithMode !== undefined) {
            mentors = mentors.filter(mentor => mentor.faithMode === filters.faithMode);
        }

        if (filters?.availability) {
            mentors = mentors.filter(mentor =>
                mentor.availability.days.some(day => filters.availability!.includes(day))
            );
        }

        return mentors.sort((a, b) => b.rating - a.rating);
    }

    async getMentorById(id: string): Promise<Mentor | null> {
        return this.mentors.find(mentor => mentor.id === id) || null;
    }

    async registerMentor(mentor: Omit<Mentor, 'id' | 'rating' | 'totalMentees' | 'verified'>): Promise<string> {
        const newMentor: Mentor = {
            ...mentor,
            id: `mentor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            rating: 0,
            totalMentees: 0,
            verified: false,
        };

        this.mentors.push(newMentor);
        return newMentor.id;
    }

    // Mentee Management
    async getMentees(filters?: {
        goals?: string[];
        industry?: string[];
        faithMode?: boolean;
    }): Promise<Mentee[]> {
        let mentees = this.mentees.filter(mentee => mentee.isActive);

        if (filters?.goals) {
            mentees = mentees.filter(mentee =>
                filters.goals!.some(goal => mentee.goals.includes(goal))
            );
        }

        if (filters?.industry) {
            mentees = mentees.filter(mentee =>
                filters.industry!.some(ind => mentee.industry.includes(ind))
            );
        }

        if (filters?.faithMode !== undefined) {
            mentees = mentees.filter(mentee => mentee.faithMode === filters.faithMode);
        }

        return mentees;
    }

    async getMenteeById(id: string): Promise<Mentee | null> {
        return this.mentees.find(mentee => mentee.id === id) || null;
    }

    async registerMentee(mentee: Omit<Mentee, 'id'>): Promise<string> {
        const newMentee: Mentee = {
            ...mentee,
            id: `mentee_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        };

        this.mentees.push(newMentee);
        return newMentee.id;
    }

    // Mentorship Matching
    async findMentorshipMatches(menteeId: string): Promise<MentorshipMatch[]> {
        const mentee = this.mentees.find(m => m.id === menteeId);
        if (!mentee) {
            throw new Error('Mentee not found');
        }

        const matches: MentorshipMatch[] = [];

        for (const mentor of this.mentors.filter(m => m.isActive)) {
            const compatibilityScore = this.calculateCompatibilityScore(mentee, mentor);
            const matchingSkills = this.findMatchingSkills(mentee, mentor);
            const matchingGoals = this.findMatchingGoals(mentee, mentor);
            const availabilityOverlap = this.calculateAvailabilityOverlap(mentee, mentor);
            const faithModeCompatibility = mentee.faithMode === mentor.faithMode;

            if (compatibilityScore > 0.3) { // Minimum compatibility threshold
                matches.push({
                    mentor,
                    mentee,
                    compatibilityScore,
                    matchingSkills,
                    matchingGoals,
                    availabilityOverlap,
                    faithModeCompatibility,
                });
            }
        }

        return matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    }

    private calculateCompatibilityScore(mentee: Mentee, mentor: Mentor): number {
        let score = 0;

        // Skills matching (40% weight)
        const skillMatch = this.findMatchingSkills(mentee, mentor).length / mentee.desiredSkills.length;
        score += skillMatch * 0.4;

        // Goals matching (30% weight)
        const goalMatch = this.findMatchingGoals(mentee, mentor).length / mentee.goals.length;
        score += goalMatch * 0.3;

        // Availability overlap (20% weight)
        const availabilityScore = this.calculateAvailabilityOverlap(mentee, mentor);
        score += availabilityScore * 0.2;

        // Faith mode compatibility (10% weight)
        if (mentee.faithMode === mentor.faithMode) {
            score += 0.1;
        }

        return Math.min(score, 1);
    }

    private findMatchingSkills(mentee: Mentee, mentor: Mentor): string[] {
        return mentee.desiredSkills.filter(skill => mentor.skills.includes(skill));
    }

    private findMatchingGoals(mentee: Mentee, mentor: Mentor): string[] {
        return mentee.goals.filter(goal => mentor.expertise.some(exp => exp.includes(goal)));
    }

    private calculateAvailabilityOverlap(mentee: Mentee, mentor: Mentor): number {
        const menteeDays = new Set(mentee.availability.days);
        const mentorDays = new Set(mentor.availability.days);
        const menteeTimes = new Set(mentee.availability.timeSlots);
        const mentorTimes = new Set(mentor.availability.timeSlots);

        const dayOverlap = [...menteeDays].filter(day => mentorDays.has(day)).length;
        const timeOverlap = [...menteeTimes].filter(time => mentorTimes.has(time)).length;

        const dayScore = dayOverlap / Math.max(menteeDays.size, mentorDays.size);
        const timeScore = timeOverlap / Math.max(menteeTimes.size, mentorTimes.size);

        return (dayScore + timeScore) / 2;
    }

    // Mentorship Requests
    async createMentorshipRequest(request: Omit<MentorshipRequest, 'id' | 'requestedAt' | 'status'>): Promise<string> {
        const mentorshipRequest: MentorshipRequest = {
            ...request,
            id: `request_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            requestedAt: new Date(),
            status: 'pending',
        };

        this.mentorshipRequests.push(mentorshipRequest);
        return mentorshipRequest.id;
    }

    async getMentorshipRequests(userId: string, role: 'mentor' | 'mentee'): Promise<MentorshipRequest[]> {
        const field = role === 'mentor' ? 'mentorId' : 'menteeId';
        return this.mentorshipRequests.filter(request => request[field] === userId);
    }

    async respondToMentorshipRequest(requestId: string, status: 'accepted' | 'declined', message?: string): Promise<boolean> {
        const request = this.mentorshipRequests.find(r => r.id === requestId);
        if (request) {
            request.status = status;
            request.respondedAt = new Date();
            if (message) {
                request.message = message;
            }
            return true;
        }
        return false;
    }

    // Mentorship Sessions
    async scheduleMentorshipSession(session: Omit<MentorshipSession, 'id'>): Promise<string> {
        const mentorshipSession: MentorshipSession = {
            ...session,
            id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        };

        this.mentorshipSessions.push(mentorshipSession);
        return mentorshipSession.id;
    }

    async getMentorshipSessions(userId: string, role: 'mentor' | 'mentee'): Promise<MentorshipSession[]> {
        const field = role === 'mentor' ? 'mentorId' : 'menteeId';
        return this.mentorshipSessions.filter(session => session[field] === userId);
    }

    async updateSessionStatus(sessionId: string, status: MentorshipSession['status']): Promise<boolean> {
        const session = this.mentorshipSessions.find(s => s.id === sessionId);
        if (session) {
            session.status = status;
            return true;
        }
        return false;
    }

    async addSessionFeedback(sessionId: string, feedback: MentorshipSession['feedback']): Promise<boolean> {
        const session = this.mentorshipSessions.find(s => s.id === sessionId);
        if (session) {
            session.feedback = feedback;
            return true;
        }
        return false;
    }

    // Analytics
    async getMentorshipAnalytics(userId: string, role: 'mentor' | 'mentee'): Promise<MentorshipAnalytics> {
        const field = role === 'mentor' ? 'mentorId' : 'menteeId';
        const userSessions = this.mentorshipSessions.filter(session => session[field] === userId);
        const userRequests = this.mentorshipRequests.filter(request => request[field] === userId);

        const totalMentorships = userRequests.length;
        const activeMentorships = userRequests.filter(r => r.status === 'active').length;
        const completedMentorships = userRequests.filter(r => r.status === 'completed').length;
        const totalHours = userSessions.reduce((sum, session) => sum + session.duration, 0) / 60;
        const averageRating = userSessions.length > 0
            ? userSessions.reduce((sum, session) => sum + session.feedback.rating, 0) / userSessions.length
            : 0;

        return {
            totalMentorships,
            activeMentorships,
            completedMentorships,
            averageRating,
            totalHours,
            skillsLearned: [], // Would be populated from session data
            goalsAchieved: [], // Would be populated from session data
            communityGrowth: Math.floor(Math.random() * 50) + 10, // Mock data
        };
    }

    // Search and Filter
    async searchMentors(query: string): Promise<Mentor[]> {
        const searchTerm = query.toLowerCase();
        return this.mentors.filter(mentor =>
            mentor.name.toLowerCase().includes(searchTerm) ||
            mentor.bio.toLowerCase().includes(searchTerm) ||
            mentor.expertise.some(exp => exp.toLowerCase().includes(searchTerm)) ||
            mentor.skills.some(skill => skill.toLowerCase().includes(searchTerm))
        );
    }

    async getMentorsByExpertise(expertise: string): Promise<Mentor[]> {
        return this.mentors.filter(mentor => mentor.expertise.includes(expertise));
    }

    async getMentorsByIndustry(industry: string): Promise<Mentor[]> {
        return this.mentors.filter(mentor => mentor.industry.includes(industry));
    }

    // Verification and Quality Control
    async verifyMentor(mentorId: string): Promise<boolean> {
        const mentor = this.mentors.find(m => m.id === mentorId);
        if (mentor) {
            mentor.verified = true;
            return true;
        }
        return false;
    }

    async updateMentorRating(mentorId: string, newRating: number): Promise<boolean> {
        const mentor = this.mentors.find(m => m.id === mentorId);
        if (mentor) {
            mentor.rating = (mentor.rating + newRating) / 2;
            return true;
        }
        return false;
    }
}

export default MentorshipMatchingService.getInstance(); 
import { Platform } from 'react-native';

export interface PrayerRequest {
    id: string;
    title: string;
    description: string;
    category: 'personal' | 'family' | 'health' | 'financial' | 'spiritual' | 'deliverance' | 'warfare';
    urgency: 'low' | 'medium' | 'high' | 'urgent';
    isAnonymous: boolean;
    userId?: string; // Only if not anonymous
    anonymousId: string; // Generated for anonymous users
    createdAt: Date;
    status: 'pending' | 'approved' | 'rejected' | 'answered';
    isPublic: boolean;
    faithMode: boolean;
    spiritualTags: string[];
    responses: PrayerResponse[];
    upvotes: number;
    downvotes: number;
}

export interface PrayerResponse {
    id: string;
    prayerRequestId: string;
    responderId: string;
    responderName: string;
    responderRole: 'leader' | 'member' | 'ai' | 'pastor';
    content: string;
    responseType: 'prayer' | 'encouragement' | 'scripture' | 'advice' | 'testimony';
    createdAt: Date;
    isPrivate: boolean;
    faithMode: boolean;
    isAI: boolean;
}

export interface SupportRoom {
    id: string;
    name: string;
    description: string;
    category: 'prayer' | 'counseling' | 'deliverance' | 'encouragement' | 'warfare';
    isAnonymous: boolean;
    participants: SupportParticipant[];
    messages: SupportMessage[];
    isActive: boolean;
    faithMode: boolean;
    moderationLevel: 'low' | 'medium' | 'high';
}

export interface SupportParticipant {
    id: string;
    userId?: string;
    anonymousId: string;
    displayName: string;
    role: 'user' | 'leader' | 'moderator' | 'ai';
    joinTime: Date;
    isActive: boolean;
    faithMode: boolean;
}

export interface SupportMessage {
    id: string;
    roomId: string;
    senderId: string;
    senderName: string;
    content: string;
    messageType: 'text' | 'prayer' | 'scripture' | 'encouragement' | 'testimony';
    timestamp: Date;
    isPrivate: boolean;
    isAI: boolean;
    faithMode: boolean;
}

export interface ModerationRule {
    id: string;
    name: string;
    description: string;
    keywords: string[];
    action: 'flag' | 'auto-reject' | 'require-approval' | 'ai-review';
    severity: 'low' | 'medium' | 'high';
    faithMode: boolean;
}

export class AnonymousSupportService {
    private static instance: AnonymousSupportService;
    private prayerRequests: Map<string, PrayerRequest> = new Map();
    private responses: Map<string, PrayerResponse[]> = new Map();
    private supportRooms: Map<string, SupportRoom> = new Map();
    private moderationRules: Map<string, ModerationRule> = new Map();

    static getInstance(): AnonymousSupportService {
        if (!AnonymousSupportService.instance) {
            AnonymousSupportService.instance = new AnonymousSupportService();
        }
        return AnonymousSupportService.instance;
    }

    // Submit anonymous prayer request
    async submitPrayerRequest(requestData: Partial<PrayerRequest>): Promise<PrayerRequest> {
        const anonymousId = this.generateAnonymousId();

        const request: PrayerRequest = {
            id: `prayer_${Date.now()}`,
            title: requestData.title || 'Prayer Request',
            description: requestData.description || '',
            category: requestData.category || 'personal',
            urgency: requestData.urgency || 'medium',
            isAnonymous: requestData.isAnonymous !== false,
            userId: requestData.isAnonymous ? undefined : requestData.userId,
            anonymousId,
            createdAt: new Date(),
            status: 'pending',
            isPublic: requestData.isPublic || false,
            faithMode: requestData.faithMode || false,
            spiritualTags: requestData.spiritualTags || [],
            responses: [],
            upvotes: 0,
            downvotes: 0,
        };

        // Apply moderation
        const moderationResult = await this.applyModeration(request);
        if (moderationResult.action === 'auto-reject') {
            request.status = 'rejected';
        } else if (moderationResult.action === 'require-approval') {
            request.status = 'pending';
        } else {
            request.status = 'approved';
        }

        this.prayerRequests.set(request.id, request);
        this.responses.set(request.id, []);

        // Send to AI for review if needed
        if (moderationResult.action === 'ai-review') {
            await this.sendToAIReview(request);
        }

        return request;
    }

    // Respond to prayer request
    async respondToPrayerRequest(requestId: string, responseData: Partial<PrayerResponse>): Promise<PrayerResponse> {
        const request = this.prayerRequests.get(requestId);
        if (!request) {
            throw new Error('Prayer request not found');
        }

        if (request.status === 'rejected') {
            throw new Error('Cannot respond to rejected prayer request');
        }

        const response: PrayerResponse = {
            id: `response_${Date.now()}`,
            prayerRequestId: requestId,
            responderId: responseData.responderId || '',
            responderName: responseData.responderName || 'Anonymous',
            responderRole: responseData.responderRole || 'member',
            content: responseData.content || '',
            responseType: responseData.responseType || 'prayer',
            createdAt: new Date(),
            isPrivate: responseData.isPrivate || false,
            faithMode: responseData.faithMode || false,
            isAI: responseData.isAI || false,
        };

        const requestResponses = this.responses.get(requestId) || [];
        requestResponses.push(response);
        this.responses.set(requestId, requestResponses);

        // Add to request responses
        request.responses.push(response);

        // Send notification if private
        if (response.isPrivate && !request.isAnonymous) {
            await this.notifyUser(request.userId!, response);
        }

        return response;
    }

    // Get prayer requests
    async getPrayerRequests(filters?: {
        category?: string;
        status?: string;
        faithMode?: boolean;
        isPublic?: boolean;
    }): Promise<PrayerRequest[]> {
        let requests = Array.from(this.prayerRequests.values());

        if (filters) {
            if (filters.category) {
                requests = requests.filter(r => r.category === filters.category);
            }
            if (filters.status) {
                requests = requests.filter(r => r.status === filters.status);
            }
            if (filters.faithMode !== undefined) {
                requests = requests.filter(r => r.faithMode === filters.faithMode);
            }
            if (filters.isPublic !== undefined) {
                requests = requests.filter(r => r.isPublic === filters.isPublic);
            }
        }

        return requests.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    // Get prayer request responses
    async getPrayerResponses(requestId: string): Promise<PrayerResponse[]> {
        return this.responses.get(requestId) || [];
    }

    // Vote on prayer request
    async voteOnPrayerRequest(requestId: string, userId: string, vote: 'upvote' | 'downvote'): Promise<void> {
        const request = this.prayerRequests.get(requestId);
        if (!request) {
            throw new Error('Prayer request not found');
        }

        if (vote === 'upvote') {
            request.upvotes += 1;
        } else {
            request.downvotes += 1;
        }
    }

    // Create support room
    async createSupportRoom(roomData: Partial<SupportRoom>): Promise<SupportRoom> {
        const room: SupportRoom = {
            id: `room_${Date.now()}`,
            name: roomData.name || 'Support Room',
            description: roomData.description || '',
            category: roomData.category || 'prayer',
            isAnonymous: roomData.isAnonymous !== false,
            participants: [],
            messages: [],
            isActive: true,
            faithMode: roomData.faithMode || false,
            moderationLevel: roomData.moderationLevel || 'medium',
        };

        this.supportRooms.set(room.id, room);
        return room;
    }

    // Join support room
    async joinSupportRoom(roomId: string, participantData: Partial<SupportParticipant>): Promise<SupportParticipant> {
        const room = this.supportRooms.get(roomId);
        if (!room) {
            throw new Error('Support room not found');
        }

        const participant: SupportParticipant = {
            id: `participant_${Date.now()}`,
            userId: participantData.userId,
            anonymousId: participantData.anonymousId || this.generateAnonymousId(),
            displayName: participantData.displayName || 'Anonymous',
            role: participantData.role || 'user',
            joinTime: new Date(),
            isActive: true,
            faithMode: participantData.faithMode || false,
        };

        room.participants.push(participant);
        return participant;
    }

    // Send message in support room
    async sendSupportMessage(roomId: string, messageData: Partial<SupportMessage>): Promise<SupportMessage> {
        const room = this.supportRooms.get(roomId);
        if (!room) {
            throw new Error('Support room not found');
        }

        const message: SupportMessage = {
            id: `msg_${Date.now()}`,
            roomId,
            senderId: messageData.senderId || '',
            senderName: messageData.senderName || 'Anonymous',
            content: messageData.content || '',
            messageType: messageData.messageType || 'text',
            timestamp: new Date(),
            isPrivate: messageData.isPrivate || false,
            isAI: messageData.isAI || false,
            faithMode: messageData.faithMode || false,
        };

        // Apply moderation to message
        const moderationResult = await this.applyMessageModeration(message, room);
        if (moderationResult.action === 'auto-reject') {
            throw new Error('Message was rejected by moderation');
        }

        room.messages.push(message);

        // Send to AI for response if needed
        if (room.faithMode && message.messageType === 'prayer') {
            await this.generateAIPrayerResponse(room, message);
        }

        return message;
    }

    // Get support rooms
    async getSupportRooms(filters?: {
        category?: string;
        faithMode?: boolean;
        isActive?: boolean;
    }): Promise<SupportRoom[]> {
        let rooms = Array.from(this.supportRooms.values());

        if (filters) {
            if (filters.category) {
                rooms = rooms.filter(r => r.category === filters.category);
            }
            if (filters.faithMode !== undefined) {
                rooms = rooms.filter(r => r.faithMode === filters.faithMode);
            }
            if (filters.isActive !== undefined) {
                rooms = rooms.filter(r => r.isActive === filters.isActive);
            }
        }

        return rooms;
    }

    // Get room messages
    async getRoomMessages(roomId: string): Promise<SupportMessage[]> {
        const room = this.supportRooms.get(roomId);
        if (!room) {
            throw new Error('Support room not found');
        }

        return room.messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    }

    // Generate AI prayer response
    async generateAIPrayerResponse(room: SupportRoom, message: SupportMessage): Promise<void> {
        // AI response generation logic
        const aiResponse: SupportMessage = {
            id: `ai_${Date.now()}`,
            roomId: room.id,
            senderId: 'ai_assistant',
            senderName: 'AI Prayer Assistant',
            content: this.generatePrayerResponse(message.content),
            messageType: 'prayer',
            timestamp: new Date(),
            isPrivate: false,
            isAI: true,
            faithMode: true,
        };

        room.messages.push(aiResponse);
    }

    // Get faith mode statistics
    async getFaithModeStats(): Promise<any> {
        const requests = Array.from(this.prayerRequests.values());
        const faithRequests = requests.filter(r => r.faithMode);
        const faithResponses = Array.from(this.responses.values()).flat().filter(r => r.faithMode);

        return {
            totalPrayerRequests: requests.length,
            faithModeRequests: faithRequests.length,
            totalResponses: Array.from(this.responses.values()).flat().length,
            faithModeResponses: faithResponses.length,
            averageResponseTime: 2.5, // hours
            prayerCategories: this.getPrayerCategories(requests),
        };
    }

    // Private methods
    private generateAnonymousId(): string {
        return `anon_${Math.random().toString(36).substr(2, 9)}`;
    }

    private async applyModeration(request: PrayerRequest): Promise<any> {
        // Apply moderation rules
        const rules = Array.from(this.moderationRules.values());
        const flaggedRules = rules.filter(rule =>
            rule.keywords.some(keyword =>
                request.title.toLowerCase().includes(keyword.toLowerCase()) ||
                request.description.toLowerCase().includes(keyword.toLowerCase())
            )
        );

        if (flaggedRules.length > 0) {
            const highestSeverity = flaggedRules.reduce((highest, rule) =>
                this.getSeverityLevel(rule.severity) > this.getSeverityLevel(highest.severity) ? rule.severity : highest.severity
                , 'low' as any);

            return {
                action: this.getActionForSeverity(highestSeverity),
                rules: flaggedRules,
            };
        }

        return { action: 'approve' };
    }

    private async applyMessageModeration(message: SupportMessage, room: SupportRoom): Promise<any> {
        // Apply message moderation
        const rules = Array.from(this.moderationRules.values());
        const flaggedRules = rules.filter(rule =>
            rule.keywords.some(keyword =>
                message.content.toLowerCase().includes(keyword.toLowerCase())
            )
        );

        if (flaggedRules.length > 0) {
            return { action: 'auto-reject' };
        }

        return { action: 'approve' };
    }

    private getSeverityLevel(severity: string): number {
        switch (severity) {
            case 'low': return 1;
            case 'medium': return 2;
            case 'high': return 3;
            default: return 1;
        }
    }

    private getActionForSeverity(severity: string): string {
        switch (severity) {
            case 'low': return 'flag';
            case 'medium': return 'require-approval';
            case 'high': return 'auto-reject';
            default: return 'flag';
        }
    }

    private generatePrayerResponse(content: string): string {
        // AI prayer response generation
        const responses = [
            "I'm lifting you up in prayer. May God's peace surround you and His strength sustain you.",
            "Praying for God's guidance and wisdom in your situation. Trust in His perfect timing.",
            "May the Lord comfort you and give you the courage to face this challenge.",
            "I'm praying for breakthrough and victory in your life. God is faithful!",
            "Lifting your request to the throne of grace. May God's love and mercy be evident.",
        ];

        return responses[Math.floor(Math.random() * responses.length)];
    }

    private async sendToAIReview(request: PrayerRequest): Promise<void> {
        console.log('Sending prayer request to AI review:', request.id);
    }

    private async notifyUser(userId: string, response: PrayerResponse): Promise<void> {
        console.log('Notifying user about prayer response:', userId);
    }

    private getPrayerCategories(requests: PrayerRequest[]): any {
        const categories = requests.reduce((acc, request) => {
            acc[request.category] = (acc[request.category] || 0) + 1;
            return acc;
        }, {} as any);

        return categories;
    }

    // Initialize moderation rules
    initializeModerationRules(): void {
        const rules: ModerationRule[] = [
            {
                id: 'rule_1',
                name: 'Inappropriate Content',
                description: 'Detect and flag inappropriate content',
                keywords: ['spam', 'inappropriate', 'offensive'],
                action: 'auto-reject',
                severity: 'high',
                faithMode: false,
            },
            {
                id: 'rule_2',
                name: 'Spiritual Warfare',
                description: 'Flag content related to spiritual warfare for review',
                keywords: ['warfare', 'deliverance', 'demonic'],
                action: 'require-approval',
                severity: 'medium',
                faithMode: true,
            },
            {
                id: 'rule_3',
                name: 'Personal Information',
                description: 'Detect personal information in prayer requests',
                keywords: ['phone', 'address', 'email', 'social security'],
                action: 'flag',
                severity: 'medium',
                faithMode: false,
            },
        ];

        rules.forEach(rule => {
            this.moderationRules.set(rule.id, rule);
        });
    }

    // Mock data for development
    getMockPrayerRequests(): PrayerRequest[] {
        return [
            {
                id: 'prayer_1',
                title: 'Prayer for Healing',
                description: 'Please pray for my recovery from illness',
                category: 'health',
                urgency: 'high',
                isAnonymous: true,
                anonymousId: 'anon_123456',
                createdAt: new Date(Date.now() - 86400000), // 1 day ago
                status: 'approved',
                isPublic: true,
                faithMode: true,
                spiritualTags: ['healing', 'health', 'recovery'],
                responses: [],
                upvotes: 5,
                downvotes: 0,
            },
            {
                id: 'prayer_2',
                title: 'Financial Breakthrough',
                description: 'Need prayer for financial provision and wisdom',
                category: 'financial',
                urgency: 'medium',
                isAnonymous: false,
                userId: 'user_1',
                anonymousId: 'anon_789012',
                createdAt: new Date(Date.now() - 172800000), // 2 days ago
                status: 'approved',
                isPublic: true,
                faithMode: true,
                spiritualTags: ['provision', 'wisdom', 'breakthrough'],
                responses: [],
                upvotes: 3,
                downvotes: 0,
            },
            {
                id: 'prayer_3',
                title: 'Spiritual Warfare',
                description: 'Facing spiritual attacks, need prayer support',
                category: 'spiritual',
                urgency: 'urgent',
                isAnonymous: true,
                anonymousId: 'anon_345678',
                createdAt: new Date(Date.now() - 3600000), // 1 hour ago
                status: 'pending',
                isPublic: false,
                faithMode: true,
                spiritualTags: ['warfare', 'deliverance', 'protection'],
                responses: [],
                upvotes: 2,
                downvotes: 0,
            },
        ];
    }

    getMockSupportRooms(): SupportRoom[] {
        return [
            {
                id: 'room_1',
                name: 'Prayer Support',
                description: 'Safe space for prayer requests and support',
                category: 'prayer',
                isAnonymous: true,
                participants: [],
                messages: [],
                isActive: true,
                faithMode: true,
                moderationLevel: 'medium',
            },
            {
                id: 'room_2',
                name: 'Deliverance Support',
                description: 'Spiritual warfare and deliverance prayer',
                category: 'deliverance',
                isAnonymous: true,
                participants: [],
                messages: [],
                isActive: true,
                faithMode: true,
                moderationLevel: 'high',
            },
            {
                id: 'room_3',
                name: 'Encouragement Corner',
                description: 'Share testimonies and encouragement',
                category: 'encouragement',
                isAnonymous: false,
                participants: [],
                messages: [],
                isActive: true,
                faithMode: true,
                moderationLevel: 'low',
            },
        ];
    }
}

export const anonymousSupportService = AnonymousSupportService.getInstance(); 
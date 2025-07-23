import { Platform } from 'react-native';

export interface PrayerRequest {
    id: string;
    title: string;
    description: string;
    category: PrayerCategory;
    urgency: 'low' | 'medium' | 'high' | 'urgent';
    isAnonymous: boolean;
    userId?: string; // Only if not anonymous
    userName?: string; // Only if not anonymous
    userAvatar?: string;
    status: 'pending' | 'praying' | 'answered' | 'closed';
    createdAt: Date;
    updatedAt: Date;
    faithMode: boolean;
    tags: string[];
    isPublic: boolean;
    allowEncouragement: boolean;
    prayerCount: number;
    answeredDate?: Date;
    answerDescription?: string;
}

export interface PrayerCategory {
    type: 'health' | 'family' | 'financial' | 'spiritual' | 'deliverance' | 'ministry' | 'general';
    subcategory?: string;
    faithMode: boolean;
}

export interface PrayerResponse {
    id: string;
    prayerRequestId: string;
    responderId: string;
    responderName: string;
    responderRole: 'leader' | 'pastor' | 'member' | 'ai-assistant';
    response: string;
    responseType: 'prayer' | 'encouragement' | 'scripture' | 'advice' | 'moderation';
    isPrivate: boolean;
    isAnonymous: boolean;
    createdAt: Date;
    faithMode: boolean;
    isAI: boolean;
}

export interface EncouragementThread {
    id: string;
    prayerRequestId: string;
    messages: EncouragementMessage[];
    isPublic: boolean;
    faithMode: boolean;
    createdAt: Date;
}

export interface EncouragementMessage {
    id: string;
    threadId: string;
    userId?: string;
    userName?: string;
    userAvatar?: string;
    message: string;
    messageType: 'encouragement' | 'prayer' | 'scripture' | 'testimony';
    isAnonymous: boolean;
    createdAt: Date;
    faithMode: boolean;
    isModerated: boolean;
    isApproved: boolean;
}

export interface SupportInbox {
    id: string;
    userId: string;
    prayerRequests: PrayerRequest[];
    responses: PrayerResponse[];
    unreadCount: number;
    faithMode: boolean;
}

export interface FaithModeResponder {
    id: string;
    type: 'ai-assistant' | 'pastor' | 'leader';
    name: string;
    avatarUrl?: string;
    expertise: string[];
    availability: boolean;
    faithMode: true;
    responseStyle: 'encouraging' | 'scriptural' | 'prayerful' | 'counseling';
}

export interface ModerationQueue {
    id: string;
    prayerRequestId?: string;
    messageId?: string;
    type: 'prayer-request' | 'encouragement-message' | 'response';
    reason: string;
    status: 'pending' | 'approved' | 'rejected' | 'flagged';
    moderatorId?: string;
    moderatedAt?: Date;
    faithMode: boolean;
}

export interface DeliveranceSupport {
    id: string;
    prayerRequestId: string;
    warfareType: 'spiritual-warfare' | 'deliverance' | 'breakthrough' | 'protection';
    intensity: 'mild' | 'moderate' | 'intense' | 'severe';
    assignedResponders: FaithModeResponder[];
    status: 'active' | 'in-progress' | 'resolved' | 'escalated';
    notes: string[];
    faithMode: true;
}

class AnonymousSupportService {
    private prayerRequests: PrayerRequest[] = [];
    private responses: PrayerResponse[] = [];
    private encouragementThreads: EncouragementThread[] = [];
    private supportInboxes: Map<string, SupportInbox> = new Map();
    private faithModeResponders: FaithModeResponder[] = [];
    private moderationQueue: ModerationQueue[] = [];
    private deliveranceSupport: DeliveranceSupport[] = [];

    // Submit prayer request
    async submitPrayerRequest(request: Omit<PrayerRequest, 'id' | 'createdAt' | 'updatedAt' | 'prayerCount'>): Promise<PrayerRequest> {
        const newRequest: PrayerRequest = {
            id: `prayer_${Date.now()}`,
            ...request,
            createdAt: new Date(),
            updatedAt: new Date(),
            prayerCount: 0,
        };

        this.prayerRequests.push(newRequest);

        // Add to moderation queue if needed
        if (request.isPublic || request.allowEncouragement) {
            const moderationItem: ModerationQueue = {
                id: `mod_${Date.now()}`,
                prayerRequestId: newRequest.id,
                type: 'prayer-request',
                reason: 'New prayer request for review',
                status: 'pending',
                faithMode: request.faithMode,
            };
            this.moderationQueue.push(moderationItem);
        }

        return newRequest;
    }

    // Get prayer requests
    async getPrayerRequests(filters?: {
        status?: string;
        category?: string;
        faithMode?: boolean;
        isPublic?: boolean;
        userId?: string;
    }): Promise<PrayerRequest[]> {
        let filtered = this.prayerRequests;

        if (filters?.status) {
            filtered = filtered.filter(r => r.status === filters.status);
        }

        if (filters?.category) {
            filtered = filtered.filter(r => r.category.type === filters.category);
        }

        if (filters?.faithMode !== undefined) {
            filtered = filtered.filter(r => r.faithMode === filters.faithMode);
        }

        if (filters?.isPublic !== undefined) {
            filtered = filtered.filter(r => r.isPublic === filters.isPublic);
        }

        if (filters?.userId) {
            filtered = filtered.filter(r => r.userId === filters.userId);
        }

        return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    // Respond to prayer request
    async respondToPrayerRequest(response: Omit<PrayerResponse, 'id' | 'createdAt'>): Promise<PrayerResponse> {
        const prayerRequest = this.prayerRequests.find(r => r.id === response.prayerRequestId);
        if (!prayerRequest) throw new Error('Prayer request not found');

        const newResponse: PrayerResponse = {
            id: `response_${Date.now()}`,
            ...response,
            createdAt: new Date(),
        };

        this.responses.push(newResponse);

        // Update prayer request status
        if (response.responseType === 'prayer') {
            prayerRequest.prayerCount++;
            if (prayerRequest.status === 'pending') {
                prayerRequest.status = 'praying';
            }
        }

        // Add to moderation queue if public
        if (!response.isPrivate) {
            const moderationItem: ModerationQueue = {
                id: `mod_${Date.now()}`,
                responseId: newResponse.id,
                type: 'response',
                reason: 'Public response for review',
                status: 'pending',
                faithMode: response.faithMode,
            };
            this.moderationQueue.push(moderationItem);
        }

        return newResponse;
    }

    // Get responses for prayer request
    async getPrayerResponses(prayerRequestId: string, userId?: string): Promise<PrayerResponse[]> {
        const prayerRequest = this.prayerRequests.find(r => r.id === prayerRequestId);
        if (!prayerRequest) throw new Error('Prayer request not found');

        let responses = this.responses.filter(r => r.prayerRequestId === prayerRequestId);

        // Filter based on privacy settings
        if (prayerRequest.isAnonymous && !userId) {
            // Anonymous requests - only show public responses
            responses = responses.filter(r => !r.isPrivate);
        } else if (userId) {
            // User can see their own responses and public responses
            responses = responses.filter(r =>
                !r.isPrivate || r.responderId === userId || prayerRequest.userId === userId
            );
        }

        return responses.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }

    // Create encouragement thread
    async createEncouragementThread(prayerRequestId: string, isPublic: boolean, faithMode: boolean): Promise<EncouragementThread> {
        const prayerRequest = this.prayerRequests.find(r => r.id === prayerRequestId);
        if (!prayerRequest) throw new Error('Prayer request not found');

        const thread: EncouragementThread = {
            id: `thread_${Date.now()}`,
            prayerRequestId,
            messages: [],
            isPublic,
            faithMode,
            createdAt: new Date(),
        };

        this.encouragementThreads.push(thread);
        return thread;
    }

    // Add encouragement message
    async addEncouragementMessage(message: Omit<EncouragementMessage, 'id' | 'createdAt'>): Promise<EncouragementMessage> {
        const thread = this.encouragementThreads.find(t => t.id === message.threadId);
        if (!thread) throw new Error('Encouragement thread not found');

        const newMessage: EncouragementMessage = {
            id: `msg_${Date.now()}`,
            ...message,
            createdAt: new Date(),
        };

        thread.messages.push(newMessage);

        // Add to moderation queue if thread is public
        if (thread.isPublic) {
            const moderationItem: ModerationQueue = {
                id: `mod_${Date.now()}`,
                messageId: newMessage.id,
                type: 'encouragement-message',
                reason: 'Public encouragement message for review',
                status: 'pending',
                faithMode: message.faithMode,
            };
            this.moderationQueue.push(moderationItem);
        }

        return newMessage;
    }

    // Get support inbox for user
    async getSupportInbox(userId: string): Promise<SupportInbox> {
        let inbox = this.supportInboxes.get(userId);

        if (!inbox) {
            inbox = {
                id: `inbox_${userId}`,
                userId,
                prayerRequests: [],
                responses: [],
                unreadCount: 0,
                faithMode: true,
            };
            this.supportInboxes.set(userId, inbox);
        }

        // Update with current data
        inbox.prayerRequests = this.prayerRequests.filter(r => r.userId === userId);
        inbox.responses = this.responses.filter(r =>
            inbox!.prayerRequests.some(pr => pr.id === r.prayerRequestId)
        );

        return inbox;
    }

    // Get faith mode responders
    async getFaithModeResponders(): Promise<FaithModeResponder[]> {
        return this.faithModeResponders.filter(r => r.availability);
    }

    // Assign faith mode responder
    async assignFaithModeResponder(prayerRequestId: string, responderType: string): Promise<FaithModeResponder | null> {
        const availableResponders = this.faithModeResponders.filter(r =>
            r.availability && r.type === responderType
        );

        if (availableResponders.length === 0) return null;

        // Simple round-robin assignment
        const assignedResponder = availableResponders[0];
        return assignedResponder;
    }

    // Create deliverance support
    async createDeliveranceSupport(prayerRequestId: string, supportData: Omit<DeliveranceSupport, 'id' | 'status' | 'notes'>): Promise<DeliveranceSupport> {
        const prayerRequest = this.prayerRequests.find(r => r.id === prayerRequestId);
        if (!prayerRequest) throw new Error('Prayer request not found');

        const support: DeliveranceSupport = {
            id: `deliverance_${Date.now()}`,
            prayerRequestId,
            ...supportData,
            status: 'active',
            notes: [],
        };

        this.deliveranceSupport.push(support);
        return support;
    }

    // Update deliverance support
    async updateDeliveranceSupport(supportId: string, updates: Partial<DeliveranceSupport>): Promise<DeliveranceSupport> {
        const support = this.deliveranceSupport.find(s => s.id === supportId);
        if (!support) throw new Error('Deliverance support not found');

        Object.assign(support, updates);
        return support;
    }

    // Mark prayer as answered
    async markPrayerAnswered(prayerRequestId: string, answerDescription: string): Promise<PrayerRequest> {
        const prayerRequest = this.prayerRequests.find(r => r.id === prayerRequestId);
        if (!prayerRequest) throw new Error('Prayer request not found');

        prayerRequest.status = 'answered';
        prayerRequest.answeredDate = new Date();
        prayerRequest.answerDescription = answerDescription;
        prayerRequest.updatedAt = new Date();

        return prayerRequest;
    }

    // Get moderation queue
    async getModerationQueue(status?: string): Promise<ModerationQueue[]> {
        let filtered = this.moderationQueue;

        if (status) {
            filtered = filtered.filter(item => item.status === status);
        }

        return filtered.sort((a, b) => {
            // Sort by type priority: prayer-request > response > encouragement-message
            const typePriority = { 'prayer-request': 3, 'response': 2, 'encouragement-message': 1 };
            const aPriority = typePriority[a.type as keyof typeof typePriority] || 0;
            const bPriority = typePriority[b.type as keyof typeof typePriority] || 0;

            if (aPriority !== bPriority) {
                return bPriority - aPriority;
            }

            return 0; // Add timestamp sorting if needed
        });
    }

    // Moderate item
    async moderateItem(itemId: string, moderatorId: string, action: 'approve' | 'reject' | 'flag'): Promise<ModerationQueue> {
        const item = this.moderationQueue.find(i => i.id === itemId);
        if (!item) throw new Error('Moderation item not found');

        item.status = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'flagged';
        item.moderatorId = moderatorId;
        item.moderatedAt = new Date();

        return item;
    }

    // Get prayer analytics
    async getPrayerAnalytics(): Promise<{
        totalRequests: number;
        pendingRequests: number;
        answeredRequests: number;
        averageResponseTime: number;
        faithModeRequests: number;
        deliveranceRequests: number;
        topCategories: { category: string; count: number }[];
    }> {
        const totalRequests = this.prayerRequests.length;
        const pendingRequests = this.prayerRequests.filter(r => r.status === 'pending').length;
        const answeredRequests = this.prayerRequests.filter(r => r.status === 'answered').length;
        const faithModeRequests = this.prayerRequests.filter(r => r.faithMode).length;
        const deliveranceRequests = this.prayerRequests.filter(r => r.category.type === 'deliverance').length;

        // Calculate average response time
        const answeredPrayers = this.prayerRequests.filter(r => r.status === 'answered' && r.answeredDate);
        const averageResponseTime = answeredPrayers.length > 0
            ? answeredPrayers.reduce((sum, prayer) => {
                const responseTime = prayer.answeredDate!.getTime() - prayer.createdAt.getTime();
                return sum + responseTime;
            }, 0) / answeredPrayers.length / (1000 * 60 * 60 * 24) // Convert to days
            : 0;

        // Get top categories
        const categoryCounts = this.prayerRequests.reduce((acc, prayer) => {
            const category = prayer.category.type;
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const topCategories = Object.entries(categoryCounts)
            .map(([category, count]) => ({ category, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        return {
            totalRequests,
            pendingRequests,
            answeredRequests,
            averageResponseTime,
            faithModeRequests,
            deliveranceRequests,
            topCategories,
        };
    }

    // Mock data for testing
    getMockPrayerRequests(): PrayerRequest[] {
        return [
            {
                id: 'prayer_1',
                title: 'Prayer for healing',
                description: 'Please pray for my recovery from illness',
                category: {
                    type: 'health',
                    subcategory: 'physical-healing',
                    faithMode: true,
                },
                urgency: 'medium',
                isAnonymous: true,
                status: 'praying',
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                faithMode: true,
                tags: ['healing', 'health', 'recovery'],
                isPublic: true,
                allowEncouragement: true,
                prayerCount: 5,
            },
            {
                id: 'prayer_2',
                title: 'Deliverance needed',
                description: 'Seeking deliverance from spiritual oppression',
                category: {
                    type: 'deliverance',
                    subcategory: 'spiritual-warfare',
                    faithMode: true,
                },
                urgency: 'high',
                isAnonymous: false,
                userId: 'user_1',
                userName: 'John Doe',
                status: 'pending',
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                faithMode: true,
                tags: ['deliverance', 'spiritual-warfare', 'breakthrough'],
                isPublic: false,
                allowEncouragement: false,
                prayerCount: 0,
            },
        ];
    }

    getMockFaithModeResponders(): FaithModeResponder[] {
        return [
            {
                id: 'responder_1',
                type: 'ai-assistant',
                name: 'Kingdom AI Assistant',
                expertise: ['prayer', 'scripture', 'encouragement', 'deliverance'],
                availability: true,
                faithMode: true,
                responseStyle: 'encouraging',
            },
            {
                id: 'responder_2',
                type: 'pastor',
                name: 'Pastor Sarah',
                expertise: ['counseling', 'deliverance', 'spiritual-warfare'],
                availability: true,
                faithMode: true,
                responseStyle: 'counseling',
            },
        ];
    }
}

export const anonymousSupportService = new AnonymousSupportService(); 
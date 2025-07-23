import { Platform } from 'react-native';

export interface LiveStream {
    id: string;
    title: string;
    description: string;
    hostId: string;
    hostName: string;
    groupId?: string;
    isPlatformWide: boolean;
    scheduledTime: Date;
    duration: number;
    status: 'scheduled' | 'live' | 'ended' | 'cancelled';
    viewerCount: number;
    maxViewers: number;
    faithMode: boolean;
    streamType: 'prayer' | 'testimony' | 'worship' | 'teaching' | 'general';
    replayUrl?: string;
    thumbnailUrl?: string;
    tags: string[];
    isPrivate: boolean;
    password?: string;
}

export interface LiveStreamRoom {
    streamId: string;
    participants: LiveStreamParticipant[];
    chat: LiveStreamMessage[];
    reactions: LiveStreamReaction[];
    prayerRequests: PrayerRequest[];
    faithModeFeatures: FaithModeFeatures;
}

export interface LiveStreamParticipant {
    userId: string;
    username: string;
    avatarUrl?: string;
    role: 'host' | 'co-host' | 'viewer' | 'moderator';
    isMuted: boolean;
    isVideoOn: boolean;
    joinTime: Date;
    faithMode: boolean;
}

export interface LiveStreamMessage {
    id: string;
    userId: string;
    username: string;
    message: string;
    timestamp: Date;
    type: 'chat' | 'prayer' | 'encouragement' | 'moderation';
    faithMode: boolean;
}

export interface LiveStreamReaction {
    id: string;
    userId: string;
    reaction: 'pray' | 'amen' | 'love' | 'clap' | 'fire' | 'heart';
    timestamp: Date;
}

export interface PrayerRequest {
    id: string;
    userId: string;
    username: string;
    request: string;
    timestamp: Date;
    isAnonymous: boolean;
    status: 'pending' | 'praying' | 'answered';
}

export interface FaithModeFeatures {
    prayerOverlay: boolean;
    scriptureDisplay: boolean;
    worshipMode: boolean;
    testimonySharing: boolean;
    deliveranceSupport: boolean;
}

export interface StreamScheduler {
    id: string;
    streamId: string;
    title: string;
    description: string;
    scheduledTime: Date;
    duration: number;
    notificationSettings: NotificationSettings;
    faithMode: boolean;
}

export interface NotificationSettings {
    pushNotifications: boolean;
    emailNotifications: boolean;
    reminderTime: number; // minutes before
    groupNotifications: boolean;
}

export interface ReplayLibrary {
    id: string;
    originalStreamId: string;
    title: string;
    description: string;
    duration: number;
    viewCount: number;
    uploadDate: Date;
    thumbnailUrl?: string;
    faithMode: boolean;
    tags: string[];
    isPublic: boolean;
    groupId?: string;
}

class LiveStreamingService {
    private streams: LiveStream[] = [];
    private rooms: Map<string, LiveStreamRoom> = new Map();
    private scheduler: StreamScheduler[] = [];
    private replays: ReplayLibrary[] = [];

    // Create new live stream
    async createLiveStream(streamData: Partial<LiveStream>): Promise<LiveStream> {
        const newStream: LiveStream = {
            id: `stream_${Date.now()}`,
            title: streamData.title || 'Untitled Stream',
            description: streamData.description || '',
            hostId: streamData.hostId || '',
            hostName: streamData.hostName || 'Anonymous',
            groupId: streamData.groupId,
            isPlatformWide: streamData.isPlatformWide || false,
            scheduledTime: streamData.scheduledTime || new Date(),
            duration: streamData.duration || 60,
            status: 'scheduled',
            viewerCount: 0,
            maxViewers: streamData.maxViewers || 1000,
            faithMode: streamData.faithMode || false,
            streamType: streamData.streamType || 'general',
            tags: streamData.tags || [],
            isPrivate: streamData.isPrivate || false,
            password: streamData.password,
        };

        this.streams.push(newStream);
        return newStream;
    }

    // Start live stream
    async startLiveStream(streamId: string): Promise<LiveStream> {
        const stream = this.streams.find(s => s.id === streamId);
        if (!stream) throw new Error('Stream not found');

        stream.status = 'live';
        stream.scheduledTime = new Date();

        // Create room for the stream
        const room: LiveStreamRoom = {
            streamId,
            participants: [],
            chat: [],
            reactions: [],
            prayerRequests: [],
            faithModeFeatures: {
                prayerOverlay: stream.faithMode,
                scriptureDisplay: stream.faithMode,
                worshipMode: stream.faithMode && stream.streamType === 'worship',
                testimonySharing: stream.faithMode,
                deliveranceSupport: stream.faithMode,
            },
        };

        this.rooms.set(streamId, room);
        return stream;
    }

    // Join live stream
    async joinLiveStream(streamId: string, userId: string, userData: any): Promise<LiveStreamRoom> {
        const room = this.rooms.get(streamId);
        if (!room) throw new Error('Stream room not found');

        const participant: LiveStreamParticipant = {
            userId,
            username: userData.username || 'Anonymous',
            avatarUrl: userData.avatarUrl,
            role: userData.role || 'viewer',
            isMuted: false,
            isVideoOn: false,
            joinTime: new Date(),
            faithMode: userData.faithMode || false,
        };

        room.participants.push(participant);
        return room;
    }

    // Send chat message
    async sendChatMessage(streamId: string, message: Omit<LiveStreamMessage, 'id' | 'timestamp'>): Promise<LiveStreamMessage> {
        const room = this.rooms.get(streamId);
        if (!room) throw new Error('Stream room not found');

        const newMessage: LiveStreamMessage = {
            id: `msg_${Date.now()}`,
            ...message,
            timestamp: new Date(),
        };

        room.chat.push(newMessage);
        return newMessage;
    }

    // Add prayer request
    async addPrayerRequest(streamId: string, request: Omit<PrayerRequest, 'id' | 'timestamp'>): Promise<PrayerRequest> {
        const room = this.rooms.get(streamId);
        if (!room) throw new Error('Stream room not found');

        const newRequest: PrayerRequest = {
            id: `prayer_${Date.now()}`,
            ...request,
            timestamp: new Date(),
        };

        room.prayerRequests.push(newRequest);
        return newRequest;
    }

    // Schedule stream
    async scheduleStream(schedulerData: Omit<StreamScheduler, 'id'>): Promise<StreamScheduler> {
        const newScheduler: StreamScheduler = {
            id: `scheduler_${Date.now()}`,
            ...schedulerData,
        };

        this.scheduler.push(newScheduler);
        return newScheduler;
    }

    // Get scheduled streams
    async getScheduledStreams(groupId?: string, faithMode?: boolean): Promise<StreamScheduler[]> {
        let filtered = this.scheduler.filter(s => s.scheduledTime > new Date());

        if (groupId) {
            // Filter by group if specified
            filtered = filtered.filter(s => {
                const stream = this.streams.find(stream => stream.id === s.streamId);
                return stream?.groupId === groupId;
            });
        }

        if (faithMode !== undefined) {
            filtered = filtered.filter(s => s.faithMode === faithMode);
        }

        return filtered.sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime());
    }

    // End stream and create replay
    async endStream(streamId: string): Promise<ReplayLibrary> {
        const stream = this.streams.find(s => s.id === streamId);
        if (!stream) throw new Error('Stream not found');

        stream.status = 'ended';

        const replay: ReplayLibrary = {
            id: `replay_${Date.now()}`,
            originalStreamId: streamId,
            title: stream.title,
            description: stream.description,
            duration: stream.duration,
            viewCount: stream.viewerCount,
            uploadDate: new Date(),
            thumbnailUrl: stream.thumbnailUrl,
            faithMode: stream.faithMode,
            tags: stream.tags,
            isPublic: !stream.isPrivate,
            groupId: stream.groupId,
        };

        this.replays.push(replay);
        return replay;
    }

    // Get replays
    async getReplays(filters?: {
        groupId?: string;
        faithMode?: boolean;
        isPublic?: boolean;
        tags?: string[];
    }): Promise<ReplayLibrary[]> {
        let filtered = this.replays;

        if (filters?.groupId) {
            filtered = filtered.filter(r => r.groupId === filters.groupId);
        }

        if (filters?.faithMode !== undefined) {
            filtered = filtered.filter(r => r.faithMode === filters.faithMode);
        }

        if (filters?.isPublic !== undefined) {
            filtered = filtered.filter(r => r.isPublic === filters.isPublic);
        }

        if (filters?.tags && filters.tags.length > 0) {
            filtered = filtered.filter(r =>
                filters.tags!.some(tag => r.tags.includes(tag))
            );
        }

        return filtered.sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime());
    }

    // Get active streams
    async getActiveStreams(groupId?: string, faithMode?: boolean): Promise<LiveStream[]> {
        let filtered = this.streams.filter(s => s.status === 'live');

        if (groupId) {
            filtered = filtered.filter(s => s.groupId === groupId);
        }

        if (faithMode !== undefined) {
            filtered = filtered.filter(s => s.faithMode === faithMode);
        }

        return filtered;
    }

    // Get stream room
    async getStreamRoom(streamId: string): Promise<LiveStreamRoom | null> {
        return this.rooms.get(streamId) || null;
    }

    // Update viewer count
    async updateViewerCount(streamId: string, count: number): Promise<void> {
        const stream = this.streams.find(s => s.id === streamId);
        if (stream) {
            stream.viewerCount = count;
        }
    }

    // Faith Mode specific methods
    async toggleFaithMode(streamId: string, enabled: boolean): Promise<void> {
        const stream = this.streams.find(s => s.id === streamId);
        if (stream) {
            stream.faithMode = enabled;
        }

        const room = this.rooms.get(streamId);
        if (room) {
            room.faithModeFeatures = {
                prayerOverlay: enabled,
                scriptureDisplay: enabled,
                worshipMode: enabled && stream?.streamType === 'worship',
                testimonySharing: enabled,
                deliveranceSupport: enabled,
            };
        }
    }

    // Get faith mode streams
    async getFaithModeStreams(): Promise<LiveStream[]> {
        return this.streams.filter(s => s.faithMode && s.status === 'live');
    }

    // Mock data for testing
    getMockStreams(): LiveStream[] {
        return [
            {
                id: 'stream_1',
                title: 'Morning Prayer Circle',
                description: 'Join us for morning prayer and devotion',
                hostId: 'user_1',
                hostName: 'Pastor Sarah',
                groupId: 'group_1',
                isPlatformWide: false,
                scheduledTime: new Date(Date.now() + 3600000), // 1 hour from now
                duration: 60,
                status: 'scheduled',
                viewerCount: 0,
                maxViewers: 100,
                faithMode: true,
                streamType: 'prayer',
                tags: ['prayer', 'morning', 'devotion'],
                isPrivate: false,
            },
            {
                id: 'stream_2',
                title: 'Worship Night Live',
                description: 'Live worship session with the community',
                hostId: 'user_2',
                hostName: 'Worship Team',
                groupId: 'group_2',
                isPlatformWide: true,
                scheduledTime: new Date(),
                duration: 120,
                status: 'live',
                viewerCount: 45,
                maxViewers: 500,
                faithMode: true,
                streamType: 'worship',
                tags: ['worship', 'music', 'live'],
                isPrivate: false,
            },
        ];
    }
}

export const liveStreamingService = new LiveStreamingService(); 
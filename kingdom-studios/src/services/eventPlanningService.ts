import { Platform } from 'react-native';

export interface Event {
    id: string;
    title: string;
    description: string;
    hostId: string;
    hostName: string;
    groupId?: string;
    isPublic: boolean;
    eventType: 'zoom' | 'in-person' | 'hybrid' | 'livestream';
    startTime: Date;
    endTime: Date;
    timezone: string;
    location?: {
        address: string;
        city: string;
        state: string;
        zipCode: string;
        coordinates?: {
            latitude: number;
            longitude: number;
        };
    };
    zoomUrl?: string;
    maxAttendees: number;
    currentAttendees: number;
    status: 'draft' | 'published' | 'cancelled' | 'completed';
    faithMode: boolean;
    eventCategory: 'revival' | 'deliverance' | 'bible-study' | 'prayer' | 'worship' | 'testimony' | 'general';
    resources: EventResource[];
    reminders: EventReminder[];
    tags: string[];
}

export interface EventResource {
    id: string;
    title: string;
    description: string;
    type: 'document' | 'video' | 'audio' | 'link' | 'image';
    url: string;
    uploadedBy: string;
    uploadedAt: Date;
    faithMode: boolean;
}

export interface EventReminder {
    id: string;
    eventId: string;
    type: 'push' | 'email' | 'sms';
    timeBeforeEvent: number; // minutes
    message: string;
    isSent: boolean;
}

export interface EventRSVP {
    id: string;
    eventId: string;
    userId: string;
    userName: string;
    status: 'going' | 'maybe' | 'not-going';
    responseTime: Date;
    plusOnes: number;
    dietaryRestrictions?: string;
    specialRequests?: string;
    faithMode: boolean;
}

export interface EventTemplate {
    id: string;
    name: string;
    description: string;
    category: string;
    faithMode: boolean;
    defaultSettings: {
        duration: number;
        maxAttendees: number;
        reminders: EventReminder[];
        resources: EventResource[];
        tags: string[];
    };
}

export class EventPlanningService {
    private static instance: EventPlanningService;
    private events: Map<string, Event> = new Map();
    private rsvps: Map<string, EventRSVP[]> = new Map();
    private templates: Map<string, EventTemplate> = new Map();

    static getInstance(): EventPlanningService {
        if (!EventPlanningService.instance) {
            EventPlanningService.instance = new EventPlanningService();
        }
        return EventPlanningService.instance;
    }

    // Create a new event
    async createEvent(eventData: Partial<Event>): Promise<Event> {
        const event: Event = {
            id: `event_${Date.now()}`,
            title: eventData.title || 'Untitled Event',
            description: eventData.description || '',
            hostId: eventData.hostId || '',
            hostName: eventData.hostName || 'Unknown Host',
            groupId: eventData.groupId,
            isPublic: eventData.isPublic || false,
            eventType: eventData.eventType || 'zoom',
            startTime: eventData.startTime || new Date(),
            endTime: eventData.endTime || new Date(Date.now() + 3600000), // 1 hour from now
            timezone: eventData.timezone || 'UTC',
            location: eventData.location,
            zoomUrl: eventData.zoomUrl,
            maxAttendees: eventData.maxAttendees || 100,
            currentAttendees: 0,
            status: 'draft',
            faithMode: eventData.faithMode || false,
            eventCategory: eventData.eventCategory || 'general',
            resources: eventData.resources || [],
            reminders: eventData.reminders || [],
            tags: eventData.tags || [],
        };

        this.events.set(event.id, event);
        this.rsvps.set(event.id, []);

        return event;
    }

    // Publish an event
    async publishEvent(eventId: string): Promise<Event> {
        const event = this.events.get(eventId);
        if (!event) {
            throw new Error('Event not found');
        }

        event.status = 'published';

        // Send notifications to group members if it's a group event
        if (event.groupId) {
            await this.notifyGroupMembers(event);
        }

        // Schedule reminders
        await this.scheduleReminders(event);

        return event;
    }

    // RSVP to an event
    async rsvpToEvent(eventId: string, rsvpData: Partial<EventRSVP>): Promise<EventRSVP> {
        const event = this.events.get(eventId);
        if (!event) {
            throw new Error('Event not found');
        }

        if (event.status !== 'published') {
            throw new Error('Event is not published');
        }

        const rsvp: EventRSVP = {
            id: `rsvp_${Date.now()}`,
            eventId,
            userId: rsvpData.userId || '',
            userName: rsvpData.userName || '',
            status: rsvpData.status || 'going',
            responseTime: new Date(),
            plusOnes: rsvpData.plusOnes || 0,
            dietaryRestrictions: rsvpData.dietaryRestrictions,
            specialRequests: rsvpData.specialRequests,
            faithMode: rsvpData.faithMode || false,
        };

        const eventRsvps = this.rsvps.get(eventId) || [];
        eventRsvps.push(rsvp);
        this.rsvps.set(eventId, eventRsvps);

        // Update attendee count
        if (rsvp.status === 'going') {
            event.currentAttendees += 1 + rsvp.plusOnes;
        }

        return rsvp;
    }

    // Update RSVP
    async updateRSVP(rsvpId: string, updates: Partial<EventRSVP>): Promise<EventRSVP> {
        const allRsvps = Array.from(this.rsvps.values()).flat();
        const rsvp = allRsvps.find(r => r.id === rsvpId);

        if (!rsvp) {
            throw new Error('RSVP not found');
        }

        Object.assign(rsvp, updates);
        rsvp.responseTime = new Date();

        return rsvp;
    }

    // Get events by group
    async getGroupEvents(groupId: string): Promise<Event[]> {
        return Array.from(this.events.values()).filter(event => event.groupId === groupId);
    }

    // Get public events
    async getPublicEvents(): Promise<Event[]> {
        return Array.from(this.events.values()).filter(event => event.isPublic && event.status === 'published');
    }

    // Get user's events (hosted or attending)
    async getUserEvents(userId: string): Promise<Event[]> {
        const hostedEvents = Array.from(this.events.values()).filter(event => event.hostId === userId);
        const attendingEvents = Array.from(this.events.values()).filter(event => {
            const eventRsvps = this.rsvps.get(event.id) || [];
            return eventRsvps.some(rsvp => rsvp.userId === userId && rsvp.status === 'going');
        });

        return [...hostedEvents, ...attendingEvents];
    }

    // Get event RSVPs
    async getEventRSVPs(eventId: string): Promise<EventRSVP[]> {
        return this.rsvps.get(eventId) || [];
    }

    // Add resource to event
    async addEventResource(eventId: string, resourceData: Partial<EventResource>): Promise<EventResource> {
        const event = this.events.get(eventId);
        if (!event) {
            throw new Error('Event not found');
        }

        const resource: EventResource = {
            id: `resource_${Date.now()}`,
            title: resourceData.title || '',
            description: resourceData.description || '',
            type: resourceData.type || 'document',
            url: resourceData.url || '',
            uploadedBy: resourceData.uploadedBy || '',
            uploadedAt: new Date(),
            faithMode: resourceData.faithMode || false,
        };

        event.resources.push(resource);
        return resource;
    }

    // Add reminder to event
    async addEventReminder(eventId: string, reminderData: Partial<EventReminder>): Promise<EventReminder> {
        const event = this.events.get(eventId);
        if (!event) {
            throw new Error('Event not found');
        }

        const reminder: EventReminder = {
            id: `reminder_${Date.now()}`,
            eventId,
            type: reminderData.type || 'push',
            timeBeforeEvent: reminderData.timeBeforeEvent || 1440, // 24 hours default
            message: reminderData.message || `Reminder: ${event.title} starts soon!`,
            isSent: false,
        };

        event.reminders.push(reminder);
        return reminder;
    }

    // Get event templates
    async getEventTemplates(): Promise<EventTemplate[]> {
        return Array.from(this.templates.values());
    }

    // Create event from template
    async createEventFromTemplate(templateId: string, eventData: Partial<Event>): Promise<Event> {
        const template = this.templates.get(templateId);
        if (!template) {
            throw new Error('Template not found');
        }

        const event = await this.createEvent({
            ...eventData,
            faithMode: template.faithMode,
            resources: template.defaultSettings.resources,
            reminders: template.defaultSettings.reminders,
            tags: template.defaultSettings.tags,
        });

        return event;
    }

    // Sync with calendar
    async syncWithCalendar(eventId: string, calendarType: 'google' | 'apple' | 'outlook'): Promise<void> {
        const event = this.events.get(eventId);
        if (!event) {
            throw new Error('Event not found');
        }

        // Calendar sync logic here
        console.log(`Syncing event ${event.title} with ${calendarType} calendar`);
    }

    // Get event analytics
    async getEventAnalytics(eventId: string): Promise<any> {
        const event = this.events.get(eventId);
        const eventRsvps = this.rsvps.get(eventId) || [];

        if (!event) {
            throw new Error('Event not found');
        }

        const goingCount = eventRsvps.filter(r => r.status === 'going').length;
        const maybeCount = eventRsvps.filter(r => r.status === 'maybe').length;
        const notGoingCount = eventRsvps.filter(r => r.status === 'not-going').length;

        return {
            totalRSVPs: eventRsvps.length,
            going: goingCount,
            maybe: maybeCount,
            notGoing: notGoingCount,
            attendanceRate: event.maxAttendees > 0 ? (goingCount / event.maxAttendees) * 100 : 0,
            faithModeAttendees: eventRsvps.filter(r => r.faithMode).length,
        };
    }

    // Cancel event
    async cancelEvent(eventId: string, reason?: string): Promise<Event> {
        const event = this.events.get(eventId);
        if (!event) {
            throw new Error('Event not found');
        }

        event.status = 'cancelled';

        // Notify attendees
        const eventRsvps = this.rsvps.get(eventId) || [];
        await this.notifyEventCancellation(event, eventRsvps, reason);

        return event;
    }

    // Private methods
    private async notifyGroupMembers(event: Event): Promise<void> {
        console.log(`Notifying group members about event: ${event.title}`);
    }

    private async scheduleReminders(event: Event): Promise<void> {
        console.log(`Scheduling reminders for event: ${event.title}`);
    }

    private async notifyEventCancellation(event: Event, rsvps: EventRSVP[], reason?: string): Promise<void> {
        console.log(`Notifying ${rsvps.length} attendees about event cancellation: ${event.title}`);
    }

    // Initialize faith mode templates
    initializeFaithTemplates(): void {
        const faithTemplates: EventTemplate[] = [
            {
                id: 'revival_night',
                name: 'Revival Night',
                description: 'Powerful evening of worship, prayer, and spiritual breakthrough',
                category: 'revival',
                faithMode: true,
                defaultSettings: {
                    duration: 180, // 3 hours
                    maxAttendees: 200,
                    reminders: [
                        {
                            id: 'reminder_1',
                            eventId: '',
                            type: 'push',
                            timeBeforeEvent: 1440, // 24 hours
                            message: 'Revival Night starts tomorrow! Prepare your heart.',
                            isSent: false,
                        },
                    ],
                    resources: [],
                    tags: ['revival', 'worship', 'prayer', 'breakthrough'],
                },
            },
            {
                id: 'deliverance_room',
                name: 'Deliverance Room',
                description: 'Safe space for spiritual warfare and deliverance prayer',
                category: 'deliverance',
                faithMode: true,
                defaultSettings: {
                    duration: 120, // 2 hours
                    maxAttendees: 50,
                    reminders: [
                        {
                            id: 'reminder_2',
                            eventId: '',
                            type: 'push',
                            timeBeforeEvent: 60, // 1 hour
                            message: 'Deliverance Room starts in 1 hour. Come prepared.',
                            isSent: false,
                        },
                    ],
                    resources: [],
                    tags: ['deliverance', 'spiritual-warfare', 'prayer', 'healing'],
                },
            },
            {
                id: 'bible_study_series',
                name: 'Bible Study Series',
                description: 'In-depth study of God\'s Word with group discussion',
                category: 'bible-study',
                faithMode: true,
                defaultSettings: {
                    duration: 90, // 1.5 hours
                    maxAttendees: 30,
                    reminders: [
                        {
                            id: 'reminder_3',
                            eventId: '',
                            type: 'push',
                            timeBeforeEvent: 1440, // 24 hours
                            message: 'Bible Study starts tomorrow! Bring your Bible.',
                            isSent: false,
                        },
                    ],
                    resources: [],
                    tags: ['bible-study', 'scripture', 'discussion', 'learning'],
                },
            },
            {
                id: 'prayer_meeting',
                name: 'Prayer Meeting',
                description: 'Corporate prayer and intercession',
                category: 'prayer',
                faithMode: true,
                defaultSettings: {
                    duration: 60, // 1 hour
                    maxAttendees: 100,
                    reminders: [
                        {
                            id: 'reminder_4',
                            eventId: '',
                            type: 'push',
                            timeBeforeEvent: 30, // 30 minutes
                            message: 'Prayer Meeting starts in 30 minutes.',
                            isSent: false,
                        },
                    ],
                    resources: [],
                    tags: ['prayer', 'intercession', 'corporate', 'faith'],
                },
            },
            {
                id: 'worship_night',
                name: 'Worship Night',
                description: 'Evening of praise, worship, and spiritual renewal',
                category: 'worship',
                faithMode: true,
                defaultSettings: {
                    duration: 150, // 2.5 hours
                    maxAttendees: 150,
                    reminders: [
                        {
                            id: 'reminder_5',
                            eventId: '',
                            type: 'push',
                            timeBeforeEvent: 1440, // 24 hours
                            message: 'Worship Night starts tomorrow! Come ready to worship.',
                            isSent: false,
                        },
                    ],
                    resources: [],
                    tags: ['worship', 'praise', 'music', 'spiritual-renewal'],
                },
            },
            {
                id: 'testimony_night',
                name: 'Testimony Night',
                description: 'Share and hear powerful testimonies of God\'s faithfulness',
                category: 'testimony',
                faithMode: true,
                defaultSettings: {
                    duration: 120, // 2 hours
                    maxAttendees: 80,
                    reminders: [
                        {
                            id: 'reminder_6',
                            eventId: '',
                            type: 'push',
                            timeBeforeEvent: 1440, // 24 hours
                            message: 'Testimony Night starts tomorrow! Come share your story.',
                            isSent: false,
                        },
                    ],
                    resources: [],
                    tags: ['testimony', 'stories', 'faithfulness', 'encouragement'],
                },
            },
        ];

        faithTemplates.forEach(template => {
            this.templates.set(template.id, template);
        });
    }

    // Mock data for development
    getMockEvents(): Event[] {
        return [
            {
                id: 'event_1',
                title: 'Revival Night',
                description: 'Join us for a powerful evening of worship, prayer, and spiritual breakthrough',
                hostId: 'user_1',
                hostName: 'Pastor Sarah Johnson',
                groupId: 'group_1',
                isPublic: true,
                eventType: 'hybrid',
                startTime: new Date(Date.now() + 86400000), // Tomorrow
                endTime: new Date(Date.now() + 86400000 + 10800000), // 3 hours later
                timezone: 'America/New_York',
                location: {
                    address: '123 Church Street',
                    city: 'New York',
                    state: 'NY',
                    zipCode: '10001',
                },
                zoomUrl: 'https://zoom.us/j/123456789',
                maxAttendees: 200,
                currentAttendees: 45,
                status: 'published',
                faithMode: true,
                eventCategory: 'revival',
                resources: [],
                reminders: [],
                tags: ['revival', 'worship', 'prayer', 'breakthrough'],
            },
            {
                id: 'event_2',
                title: 'Bible Study: Book of Romans',
                description: 'In-depth study of Paul\'s letter to the Romans',
                hostId: 'user_2',
                hostName: 'Dr. Michael Chen',
                groupId: 'group_2',
                isPublic: false,
                eventType: 'zoom',
                startTime: new Date(Date.now() + 172800000), // Day after tomorrow
                endTime: new Date(Date.now() + 172800000 + 5400000), // 1.5 hours later
                timezone: 'America/Chicago',
                zoomUrl: 'https://zoom.us/j/987654321',
                maxAttendees: 30,
                currentAttendees: 18,
                status: 'published',
                faithMode: true,
                eventCategory: 'bible-study',
                resources: [],
                reminders: [],
                tags: ['bible-study', 'romans', 'scripture', 'learning'],
            },
            {
                id: 'event_3',
                title: 'Prayer Meeting',
                description: 'Corporate prayer and intercession for our community',
                hostId: 'user_3',
                hostName: 'Prayer Team',
                groupId: 'group_3',
                isPublic: true,
                eventType: 'in-person',
                startTime: new Date(Date.now() + 3600000), // 1 hour from now
                endTime: new Date(Date.now() + 7200000), // 2 hours from now
                timezone: 'America/Los_Angeles',
                location: {
                    address: '456 Faith Avenue',
                    city: 'Los Angeles',
                    state: 'CA',
                    zipCode: '90210',
                },
                maxAttendees: 100,
                currentAttendees: 25,
                status: 'published',
                faithMode: true,
                eventCategory: 'prayer',
                resources: [],
                reminders: [],
                tags: ['prayer', 'intercession', 'corporate', 'faith'],
            },
        ];
    }
}

export const eventPlanningService = EventPlanningService.getInstance(); 
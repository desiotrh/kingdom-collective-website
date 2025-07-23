import { Platform } from 'react-native';

export interface Event {
    id: string;
    title: string;
    description: string;
    organizerId: string;
    organizerName: string;
    groupId?: string;
    eventType: 'zoom' | 'in-person' | 'hybrid' | 'livestream';
    startTime: Date;
    endTime: Date;
    timezone: string;
    location?: EventLocation;
    maxAttendees: number;
    currentAttendees: number;
    isPublic: boolean;
    isPrivate: boolean;
    password?: string;
    status: 'draft' | 'published' | 'cancelled' | 'completed';
    faithMode: boolean;
    eventCategory: EventCategory;
    tags: string[];
    coverImage?: string;
    resources: EventResource[];
    reminders: EventReminder[];
    livestreamUrl?: string;
    replayUrl?: string;
}

export interface EventLocation {
    type: 'physical' | 'virtual' | 'hybrid';
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    virtualUrl?: string;
    virtualPassword?: string;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
}

export interface EventCategory {
    type: 'revival' | 'bible-study' | 'prayer-meeting' | 'worship-night' | 'deliverance' | 'testimony' | 'general';
    subcategory?: string;
    faithMode: boolean;
}

export interface EventResource {
    id: string;
    title: string;
    description: string;
    type: 'document' | 'video' | 'audio' | 'link' | 'presentation';
    url?: string;
    content?: string;
    uploadedBy: string;
    uploadDate: Date;
    isPublic: boolean;
}

export interface EventReminder {
    id: string;
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
    userAvatar?: string;
    status: 'going' | 'maybe' | 'not-going' | 'waitlist';
    responseDate: Date;
    plusOnes: number;
    dietaryRestrictions?: string;
    accessibilityNeeds?: string;
    faithMode: boolean;
}

export interface EventComment {
    id: string;
    eventId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    comment: string;
    timestamp: Date;
    isPublic: boolean;
    faithMode: boolean;
}

export interface EventTemplate {
    id: string;
    name: string;
    description: string;
    category: EventCategory;
    defaultDuration: number; // minutes
    defaultSettings: Partial<Event>;
    faithMode: boolean;
    isPublic: boolean;
    createdBy: string;
    usageCount: number;
}

export interface EventCalendar {
    id: string;
    userId: string;
    events: Event[];
    syncSettings: CalendarSyncSettings;
    faithMode: boolean;
}

export interface CalendarSyncSettings {
    syncWithGoogle: boolean;
    syncWithApple: boolean;
    syncWithOutlook: boolean;
    autoAddEvents: boolean;
    reminderSettings: EventReminder[];
}

class EventPlanningService {
    private events: Event[] = [];
    private rsvps: EventRSVP[] = [];
    private comments: EventComment[] = [];
    private templates: EventTemplate[] = [];
    private calendars: Map<string, EventCalendar> = new Map();

    // Create new event
    async createEvent(eventData: Omit<Event, 'id' | 'currentAttendees' | 'status'>): Promise<Event> {
        const newEvent: Event = {
            id: `event_${Date.now()}`,
            ...eventData,
            currentAttendees: 0,
            status: 'draft',
        };

        this.events.push(newEvent);
        return newEvent;
    }

    // Publish event
    async publishEvent(eventId: string): Promise<Event> {
        const event = this.events.find(e => e.id === eventId);
        if (!event) throw new Error('Event not found');

        event.status = 'published';
        return event;
    }

    // RSVP to event
    async rsvpToEvent(rsvpData: Omit<EventRSVP, 'id' | 'responseDate'>): Promise<EventRSVP> {
        const event = this.events.find(e => e.id === rsvpData.eventId);
        if (!event) throw new Error('Event not found');

        // Check if user already RSVP'd
        const existingRSVP = this.rsvps.find(r =>
            r.eventId === rsvpData.eventId && r.userId === rsvpData.userId
        );

        if (existingRSVP) {
            // Update existing RSVP
            existingRSVP.status = rsvpData.status;
            existingRSVP.plusOnes = rsvpData.plusOnes || 0;
            existingRSVP.dietaryRestrictions = rsvpData.dietaryRestrictions;
            existingRSVP.accessibilityNeeds = rsvpData.accessibilityNeeds;
            existingRSVP.faithMode = rsvpData.faithMode;
            return existingRSVP;
        }

        const newRSVP: EventRSVP = {
            id: `rsvp_${Date.now()}`,
            ...rsvpData,
            responseDate: new Date(),
        };

        this.rsvps.push(newRSVP);

        // Update attendee count
        if (rsvpData.status === 'going') {
            event.currentAttendees += 1 + (rsvpData.plusOnes || 0);
        }

        return newRSVP;
    }

    // Get event details with RSVPs
    async getEventDetails(eventId: string): Promise<{
        event: Event;
        rsvps: EventRSVP[];
        comments: EventComment[];
        resources: EventResource[];
    }> {
        const event = this.events.find(e => e.id === eventId);
        if (!event) throw new Error('Event not found');

        const eventRSVPs = this.rsvps.filter(r => r.eventId === eventId);
        const eventComments = this.comments.filter(c => c.eventId === eventId);

        return {
            event,
            rsvps: eventRSVPs,
            comments: eventComments,
            resources: event.resources,
        };
    }

    // Add event comment
    async addEventComment(comment: Omit<EventComment, 'id' | 'timestamp'>): Promise<EventComment> {
        const newComment: EventComment = {
            id: `comment_${Date.now()}`,
            ...comment,
            timestamp: new Date(),
        };

        this.comments.push(newComment);
        return newComment;
    }

    // Add event resource
    async addEventResource(eventId: string, resource: Omit<EventResource, 'id' | 'uploadDate'>): Promise<EventResource> {
        const event = this.events.find(e => e.id === eventId);
        if (!event) throw new Error('Event not found');

        const newResource: EventResource = {
            id: `resource_${Date.now()}`,
            ...resource,
            uploadDate: new Date(),
        };

        event.resources.push(newResource);
        return newResource;
    }

    // Create event template
    async createEventTemplate(templateData: Omit<EventTemplate, 'id' | 'usageCount'>): Promise<EventTemplate> {
        const newTemplate: EventTemplate = {
            id: `template_${Date.now()}`,
            ...templateData,
            usageCount: 0,
        };

        this.templates.push(newTemplate);
        return newTemplate;
    }

    // Use event template
    async useEventTemplate(templateId: string, customizations: Partial<Event>): Promise<Event> {
        const template = this.templates.find(t => t.id === templateId);
        if (!template) throw new Error('Template not found');

        const eventData: Event = {
            ...template.defaultSettings,
            ...customizations,
            id: `event_${Date.now()}`,
            title: customizations.title || template.name,
            description: customizations.description || template.description,
            eventCategory: template.category,
            faithMode: template.faithMode,
            currentAttendees: 0,
            status: 'draft',
            resources: [],
            reminders: [],
            tags: [],
        };

        this.events.push(eventData);
        template.usageCount++;

        return eventData;
    }

    // Get faith mode templates
    async getFaithModeTemplates(): Promise<EventTemplate[]> {
        return this.templates.filter(t => t.faithMode && t.isPublic);
    }

    // Search events
    async searchEvents(filters: {
        groupId?: string;
        faithMode?: boolean;
        eventType?: string;
        category?: string;
        dateRange?: { start: Date; end: Date };
        isPublic?: boolean;
        tags?: string[];
    }): Promise<Event[]> {
        let filtered = this.events.filter(e => e.status === 'published');

        if (filters.groupId) {
            filtered = filtered.filter(e => e.groupId === filters.groupId);
        }

        if (filters.faithMode !== undefined) {
            filtered = filtered.filter(e => e.faithMode === filters.faithMode);
        }

        if (filters.eventType) {
            filtered = filtered.filter(e => e.eventType === filters.eventType);
        }

        if (filters.category) {
            filtered = filtered.filter(e => e.eventCategory.type === filters.category);
        }

        if (filters.dateRange) {
            filtered = filtered.filter(e =>
                e.startTime >= filters.dateRange!.start && e.startTime <= filters.dateRange!.end
            );
        }

        if (filters.isPublic !== undefined) {
            filtered = filtered.filter(e => e.isPublic === filters.isPublic);
        }

        if (filters.tags && filters.tags.length > 0) {
            filtered = filtered.filter(e =>
                filters.tags!.some(tag => e.tags.includes(tag))
            );
        }

        return filtered.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    }

    // Get user's events
    async getUserEvents(userId: string, type: 'organizing' | 'attending' | 'all' = 'all'): Promise<Event[]> {
        let userEvents: Event[] = [];

        if (type === 'organizing' || type === 'all') {
            const organizing = this.events.filter(e => e.organizerId === userId);
            userEvents.push(...organizing);
        }

        if (type === 'attending' || type === 'all') {
            const attendingRSVPs = this.rsvps.filter(r => r.userId === userId && r.status === 'going');
            const attendingEvents = this.events.filter(e =>
                attendingRSVPs.some(rsvp => rsvp.eventId === e.id)
            );
            userEvents.push(...attendingEvents);
        }

        return userEvents.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    }

    // Sync with external calendar
    async syncWithCalendar(userId: string, calendarType: 'google' | 'apple' | 'outlook'): Promise<boolean> {
        // Mock implementation - in real app, this would integrate with calendar APIs
        const calendar: EventCalendar = {
            id: `calendar_${userId}`,
            userId,
            events: this.events.filter(e => e.organizerId === userId),
            syncSettings: {
                syncWithGoogle: calendarType === 'google',
                syncWithApple: calendarType === 'apple',
                syncWithOutlook: calendarType === 'outlook',
                autoAddEvents: true,
                reminderSettings: [
                    {
                        id: `reminder_${Date.now()}`,
                        type: 'push',
                        timeBeforeEvent: 60,
                        message: 'Event reminder',
                        isSent: false,
                    }
                ],
            },
            faithMode: true,
        };

        this.calendars.set(userId, calendar);
        return true;
    }

    // Get event reminders
    async getEventReminders(eventId: string): Promise<EventReminder[]> {
        const event = this.events.find(e => e.id === eventId);
        return event?.reminders || [];
    }

    // Add event reminder
    async addEventReminder(eventId: string, reminder: Omit<EventReminder, 'id' | 'isSent'>): Promise<EventReminder> {
        const event = this.events.find(e => e.id === eventId);
        if (!event) throw new Error('Event not found');

        const newReminder: EventReminder = {
            id: `reminder_${Date.now()}`,
            ...reminder,
            isSent: false,
        };

        event.reminders.push(newReminder);
        return newReminder;
    }

    // Cancel event
    async cancelEvent(eventId: string, reason?: string): Promise<Event> {
        const event = this.events.find(e => e.id === eventId);
        if (!event) throw new Error('Event not found');

        event.status = 'cancelled';
        return event;
    }

    // Get event analytics
    async getEventAnalytics(eventId: string): Promise<{
        totalRSVPs: number;
        goingCount: number;
        maybeCount: number;
        notGoingCount: number;
        waitlistCount: number;
        engagementRate: number;
        faithModeParticipants: number;
    }> {
        const eventRSVPs = this.rsvps.filter(r => r.eventId === eventId);
        const totalRSVPs = eventRSVPs.length;
        const goingCount = eventRSVPs.filter(r => r.status === 'going').length;
        const maybeCount = eventRSVPs.filter(r => r.status === 'maybe').length;
        const notGoingCount = eventRSVPs.filter(r => r.status === 'not-going').length;
        const waitlistCount = eventRSVPs.filter(r => r.status === 'waitlist').length;
        const faithModeParticipants = eventRSVPs.filter(r => r.faithMode).length;

        const engagementRate = totalRSVPs > 0 ? (goingCount / totalRSVPs) * 100 : 0;

        return {
            totalRSVPs,
            goingCount,
            maybeCount,
            notGoingCount,
            waitlistCount,
            engagementRate,
            faithModeParticipants,
        };
    }

    // Mock data for testing
    getMockEvents(): Event[] {
        return [
            {
                id: 'event_1',
                title: 'Revival Night - Kingdom Circle',
                description: 'Join us for a powerful night of worship, prayer, and revival',
                organizerId: 'user_1',
                organizerName: 'Pastor Sarah',
                groupId: 'group_1',
                eventType: 'hybrid',
                startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
                endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 3 hours later
                timezone: 'America/New_York',
                location: {
                    type: 'hybrid',
                    address: '123 Church Street',
                    city: 'New York',
                    state: 'NY',
                    zipCode: '10001',
                    country: 'USA',
                    virtualUrl: 'https://zoom.us/j/123456789',
                },
                maxAttendees: 200,
                currentAttendees: 45,
                isPublic: true,
                isPrivate: false,
                status: 'published',
                faithMode: true,
                eventCategory: {
                    type: 'revival',
                    subcategory: 'worship-night',
                    faithMode: true,
                },
                tags: ['revival', 'worship', 'prayer', 'faith'],
                resources: [],
                reminders: [],
            },
            {
                id: 'event_2',
                title: 'Bible Study Series - Deliverance',
                description: 'Weekly Bible study focusing on spiritual warfare and deliverance',
                organizerId: 'user_2',
                organizerName: 'Minister John',
                groupId: 'group_2',
                eventType: 'zoom',
                startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
                endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000), // 90 minutes later
                timezone: 'America/New_York',
                location: {
                    type: 'virtual',
                    virtualUrl: 'https://zoom.us/j/987654321',
                    virtualPassword: 'bible123',
                },
                maxAttendees: 50,
                currentAttendees: 12,
                isPublic: true,
                isPrivate: false,
                status: 'published',
                faithMode: true,
                eventCategory: {
                    type: 'bible-study',
                    subcategory: 'deliverance',
                    faithMode: true,
                },
                tags: ['bible-study', 'deliverance', 'spiritual-warfare'],
                resources: [],
                reminders: [],
            },
        ];
    }

    getMockTemplates(): EventTemplate[] {
        return [
            {
                id: 'template_1',
                name: 'Revival Night Template',
                description: 'Complete template for hosting revival nights',
                category: {
                    type: 'revival',
                    subcategory: 'worship-night',
                    faithMode: true,
                },
                defaultDuration: 180, // 3 hours
                defaultSettings: {
                    eventType: 'hybrid',
                    faithMode: true,
                    eventCategory: {
                        type: 'revival',
                        subcategory: 'worship-night',
                        faithMode: true,
                    },
                    tags: ['revival', 'worship', 'prayer'],
                },
                faithMode: true,
                isPublic: true,
                createdBy: 'user_1',
                usageCount: 15,
            },
            {
                id: 'template_2',
                name: 'Deliverance Room Template',
                description: 'Template for deliverance and spiritual warfare sessions',
                category: {
                    type: 'deliverance',
                    subcategory: 'prayer-meeting',
                    faithMode: true,
                },
                defaultDuration: 120, // 2 hours
                defaultSettings: {
                    eventType: 'zoom',
                    faithMode: true,
                    eventCategory: {
                        type: 'deliverance',
                        subcategory: 'prayer-meeting',
                        faithMode: true,
                    },
                    tags: ['deliverance', 'spiritual-warfare', 'prayer'],
                },
                faithMode: true,
                isPublic: true,
                createdBy: 'user_2',
                usageCount: 8,
            },
        ];
    }
}

export const eventPlanningService = new EventPlanningService(); 
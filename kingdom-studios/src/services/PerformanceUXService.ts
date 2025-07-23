import { Platform } from 'react-native';
import { useTierSystem } from '../contexts/TierSystemContext';
import { useDualMode } from '../contexts/DualModeContext';

export interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
    date: Date;
    platform: string;
    status: 'draft' | 'scheduled' | 'published' | 'failed';
    content?: string;
    imageUrl?: string;
    tags?: string[];
}

export interface OnboardingStep {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    required: boolean;
    order: number;
}

export interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    notifications: {
        email: boolean;
        push: boolean;
        inApp: boolean;
    };
    accessibility: {
        fontSize: 'small' | 'medium' | 'large';
        reduceMotion: boolean;
        highContrast: boolean;
    };
    performance: {
        autoSave: boolean;
        syncInterval: number; // minutes
        cacheSize: number; // MB
    };
}

export interface VoiceToTextResult {
    text: string;
    confidence: number;
    duration: number;
    language: string;
}

export interface DragDropItem {
    id: string;
    type: 'content' | 'template' | 'draft';
    title: string;
    data: any;
    position: { x: number; y: number };
}

export class PerformanceUXService {
    private static instance: PerformanceUXService;
    private calendarEvents: CalendarEvent[] = [];
    private onboardingSteps: OnboardingStep[] = [];
    private userPreferences: UserPreferences = {
        theme: 'auto',
        notifications: {
            email: true,
            push: true,
            inApp: true,
        },
        accessibility: {
            fontSize: 'medium',
            reduceMotion: false,
            highContrast: false,
        },
        performance: {
            autoSave: true,
            syncInterval: 5,
            cacheSize: 50,
        },
    };

    static getInstance(): PerformanceUXService {
        if (!PerformanceUXService.instance) {
            PerformanceUXService.instance = new PerformanceUXService();
            PerformanceUXService.instance.initializeOnboarding();
        }
        return PerformanceUXService.instance;
    }

    // Calendar Management
    async addCalendarEvent(event: Omit<CalendarEvent, 'id'>): Promise<string> {
        const newEvent: CalendarEvent = {
            ...event,
            id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        };

        this.calendarEvents.push(newEvent);
        return newEvent.id;
    }

    async getCalendarEvents(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
        return this.calendarEvents.filter(event =>
            event.date >= startDate && event.date <= endDate
        );
    }

    async updateCalendarEvent(eventId: string, updates: Partial<CalendarEvent>): Promise<boolean> {
        const eventIndex = this.calendarEvents.findIndex(event => event.id === eventId);
        if (eventIndex !== -1) {
            this.calendarEvents[eventIndex] = { ...this.calendarEvents[eventIndex], ...updates };
            return true;
        }
        return false;
    }

    async deleteCalendarEvent(eventId: string): Promise<boolean> {
        const eventIndex = this.calendarEvents.findIndex(event => event.id === eventId);
        if (eventIndex !== -1) {
            this.calendarEvents.splice(eventIndex, 1);
            return true;
        }
        return false;
    }

    // Drag and Drop Calendar
    async moveCalendarEvent(eventId: string, newDate: Date): Promise<boolean> {
        return await this.updateCalendarEvent(eventId, { date: newDate });
    }

    async duplicateCalendarEvent(eventId: string, newDate: Date): Promise<string | null> {
        const event = this.calendarEvents.find(e => e.id === eventId);
        if (event) {
            const duplicatedEvent = {
                ...event,
                id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                date: newDate,
                title: `${event.title} (Copy)`,
            };
            this.calendarEvents.push(duplicatedEvent);
            return duplicatedEvent.id;
        }
        return null;
    }

    // Onboarding Management
    private initializeOnboarding(): void {
        this.onboardingSteps = [
            {
                id: 'welcome',
                title: 'Welcome to Kingdom Studios',
                description: 'Let\'s get you started with your content creation journey',
                completed: false,
                required: true,
                order: 1,
            },
            {
                id: 'faith_mode',
                title: 'Choose Your Mode',
                description: 'Select between Faith Mode for Christian creators or Encouragement Mode for general motivation',
                completed: false,
                required: true,
                order: 2,
            },
            {
                id: 'profile_setup',
                title: 'Complete Your Profile',
                description: 'Add your business information and social media accounts',
                completed: false,
                required: true,
                order: 3,
            },
            {
                id: 'first_content',
                title: 'Create Your First Content',
                description: 'Generate your first AI-powered post to see how it works',
                completed: false,
                required: true,
                order: 4,
            },
            {
                id: 'templates',
                title: 'Explore Templates',
                description: 'Browse our library of content templates for different platforms',
                completed: false,
                required: false,
                order: 5,
            },
            {
                id: 'analytics',
                title: 'View Your Analytics',
                description: 'Learn how to track your content performance and growth',
                completed: false,
                required: false,
                order: 6,
            },
            {
                id: 'team_collaboration',
                title: 'Team Collaboration',
                description: 'Invite team members and collaborate on content creation',
                completed: false,
                required: false,
                order: 7,
            },
        ];
    }

    async getOnboardingSteps(): Promise<OnboardingStep[]> {
        return [...this.onboardingSteps].sort((a, b) => a.order - b.order);
    }

    async completeOnboardingStep(stepId: string): Promise<boolean> {
        const step = this.onboardingSteps.find(s => s.id === stepId);
        if (step) {
            step.completed = true;
            return true;
        }
        return false;
    }

    async getOnboardingProgress(): Promise<{
        completed: number;
        total: number;
        percentage: number;
        nextStep?: OnboardingStep;
    }> {
        const completed = this.onboardingSteps.filter(s => s.completed).length;
        const total = this.onboardingSteps.length;
        const percentage = Math.round((completed / total) * 100);

        const nextStep = this.onboardingSteps
            .filter(s => !s.completed)
            .sort((a, b) => a.order - b.order)[0];

        return {
            completed,
            total,
            percentage,
            nextStep,
        };
    }

    async resetOnboarding(): Promise<void> {
        this.onboardingSteps.forEach(step => {
            step.completed = false;
        });
    }

    // User Preferences Management
    async getUserPreferences(): Promise<UserPreferences> {
        return { ...this.userPreferences };
    }

    async updateUserPreferences(updates: Partial<UserPreferences>): Promise<void> {
        this.userPreferences = { ...this.userPreferences, ...updates };
    }

    async updateTheme(theme: 'light' | 'dark' | 'auto'): Promise<void> {
        this.userPreferences.theme = theme;
    }

    async updateNotificationSettings(settings: Partial<UserPreferences['notifications']>): Promise<void> {
        this.userPreferences.notifications = { ...this.userPreferences.notifications, ...settings };
    }

    async updateAccessibilitySettings(settings: Partial<UserPreferences['accessibility']>): Promise<void> {
        this.userPreferences.accessibility = { ...this.userPreferences.accessibility, ...settings };
    }

    async updatePerformanceSettings(settings: Partial<UserPreferences['performance']>): Promise<void> {
        this.userPreferences.performance = { ...this.userPreferences.performance, ...settings };
    }

    // Voice to Text
    async startVoiceToText(): Promise<VoiceToTextResult> {
        // Mock voice-to-text implementation
        // In a real app, this would use expo-speech or a similar library

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    text: 'This is a sample voice-to-text conversion. In a real implementation, this would capture actual speech.',
                    confidence: 0.95,
                    duration: 3000,
                    language: 'en-US',
                });
            }, 3000);
        });
    }

    async stopVoiceToText(): Promise<void> {
        // Stop voice recording
        console.log('Voice recording stopped');
    }

    // Performance Optimization
    async optimizePerformance(): Promise<{
        memoryUsage: number;
        cacheSize: number;
        optimizationScore: number;
        recommendations: string[];
    }> {
        // Mock performance optimization
        const memoryUsage = Math.random() * 100 + 50; // MB
        const cacheSize = Math.random() * 20 + 10; // MB
        const optimizationScore = Math.max(0, 100 - (memoryUsage / 2) - (cacheSize * 2));

        const recommendations = [];
        if (memoryUsage > 100) {
            recommendations.push('Clear app cache to free up memory');
        }
        if (cacheSize > 15) {
            recommendations.push('Reduce cache size for better performance');
        }
        if (optimizationScore < 70) {
            recommendations.push('Restart app to optimize performance');
        }

        return {
            memoryUsage: Math.round(memoryUsage),
            cacheSize: Math.round(cacheSize),
            optimizationScore: Math.round(optimizationScore),
            recommendations,
        };
    }

    // Auto-save functionality
    async autoSaveContent(content: any, type: 'draft' | 'template' | 'post'): Promise<void> {
        const { performance } = this.userPreferences;

        if (performance.autoSave) {
            const key = `autosave_${type}_${Date.now()}`;
            // Save to local storage
            console.log(`Auto-saving ${type}:`, content);
        }
    }

    // Accessibility Features
    getAccessibilityConfig(): {
        fontSize: number;
        lineHeight: number;
        letterSpacing: number;
        reduceMotion: boolean;
        highContrast: boolean;
    } {
        const { accessibility } = this.userPreferences;

        const fontSizeMap = {
            small: 14,
            medium: 16,
            large: 18,
        };

        return {
            fontSize: fontSizeMap[accessibility.fontSize],
            lineHeight: fontSizeMap[accessibility.fontSize] * 1.5,
            letterSpacing: accessibility.fontSize === 'large' ? 0.5 : 0,
            reduceMotion: accessibility.reduceMotion,
            highContrast: accessibility.highContrast,
        };
    }

    // Drag and Drop Utilities
    async createDragDropItem(item: Omit<DragDropItem, 'id'>): Promise<string> {
        const dragItem: DragDropItem = {
            ...item,
            id: `drag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        };
        return dragItem.id;
    }

    async updateDragDropPosition(itemId: string, position: { x: number; y: number }): Promise<boolean> {
        // Update position of drag item
        console.log(`Updating position for item ${itemId}:`, position);
        return true;
    }

    // Calendar Utilities
    async getCalendarStats(): Promise<{
        totalEvents: number;
        scheduledEvents: number;
        publishedEvents: number;
        failedEvents: number;
        upcomingEvents: number;
    }> {
        const now = new Date();
        const upcoming = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // Next 7 days

        return {
            totalEvents: this.calendarEvents.length,
            scheduledEvents: this.calendarEvents.filter(e => e.status === 'scheduled').length,
            publishedEvents: this.calendarEvents.filter(e => e.status === 'published').length,
            failedEvents: this.calendarEvents.filter(e => e.status === 'failed').length,
            upcomingEvents: this.calendarEvents.filter(e => e.date >= now && e.date <= upcoming).length,
        };
    }

    async getCalendarEventsByPlatform(platform: string): Promise<CalendarEvent[]> {
        return this.calendarEvents.filter(event => event.platform === platform);
    }

    async getCalendarEventsByStatus(status: CalendarEvent['status']): Promise<CalendarEvent[]> {
        return this.calendarEvents.filter(event => event.status === status);
    }

    // User Experience Analytics
    async trackUserInteraction(action: string, data?: any): Promise<void> {
        // Track user interactions for UX improvements
        console.log('User interaction tracked:', { action, data, timestamp: new Date() });
    }

    async getUserExperienceMetrics(): Promise<{
        sessionDuration: number;
        featureUsage: Record<string, number>;
        errorRate: number;
        satisfactionScore: number;
    }> {
        // Mock UX metrics
        return {
            sessionDuration: Math.random() * 3600 + 1800, // 30-90 minutes
            featureUsage: {
                'content_generator': Math.random() * 100 + 50,
                'calendar': Math.random() * 100 + 30,
                'analytics': Math.random() * 100 + 20,
                'templates': Math.random() * 100 + 40,
            },
            errorRate: Math.random() * 5, // 0-5%
            satisfactionScore: Math.random() * 20 + 80, // 80-100%
        };
    }

    // Performance Monitoring
    async getPerformanceMetrics(): Promise<{
        appLoadTime: number;
        contentGenerationTime: number;
        imageLoadTime: number;
        memoryUsage: number;
        batteryUsage: number;
    }> {
        return {
            appLoadTime: Math.random() * 2000 + 1000, // 1-3 seconds
            contentGenerationTime: Math.random() * 5000 + 2000, // 2-7 seconds
            imageLoadTime: Math.random() * 1000 + 500, // 0.5-1.5 seconds
            memoryUsage: Math.random() * 100 + 50, // MB
            batteryUsage: Math.random() * 20 + 5, // Percentage
        };
    }

    // Quick Actions
    async getQuickActions(): Promise<{
        id: string;
        title: string;
        icon: string;
        action: string;
        shortcut?: string;
    }[]> {
        return [
            {
                id: 'quick_generate',
                title: 'Quick Generate',
                icon: 'sparkles',
                action: 'generate_content',
                shortcut: 'Cmd+G',
            },
            {
                id: 'quick_schedule',
                title: 'Schedule Post',
                icon: 'calendar',
                action: 'schedule_post',
                shortcut: 'Cmd+S',
            },
            {
                id: 'quick_analytics',
                title: 'View Analytics',
                icon: 'analytics',
                action: 'view_analytics',
                shortcut: 'Cmd+A',
            },
            {
                id: 'quick_templates',
                title: 'Browse Templates',
                icon: 'document',
                action: 'browse_templates',
                shortcut: 'Cmd+T',
            },
        ];
    }
}

export default PerformanceUXService.getInstance(); 
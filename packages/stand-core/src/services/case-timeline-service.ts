import { 
  Case, 
  CaseEvent, 
  TimelineFilter, 
  TimelineStats, 
  TimelineExportOptions 
} from '../case-timeline';
import { encryptedStorage, storeEncrypted, retrieveEncrypted, removeEncrypted } from '../utils/encrypted-storage';
import { generateICSContent, downloadICSFile } from '../utils/ics-export';

export class CaseTimelineService {
  private static instance: CaseTimelineService;
  private readonly STORAGE_KEYS = {
    CASES: 'cases',
    EVENTS: 'events',
    SETTINGS: 'timeline_settings'
  };

  private constructor() {}

  static getInstance(): CaseTimelineService {
    if (!CaseTimelineService.instance) {
      CaseTimelineService.instance = new CaseTimelineService();
    }
    return CaseTimelineService.instance;
  }

  async initialize(): Promise<void> {
    await encryptedStorage.initialize();
  }

  // Case Management
  async createCase(caseData: Omit<Case, 'id' | 'createdAt' | 'updatedAt'>): Promise<Case> {
    const newCase: Case = {
      ...caseData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const cases = await this.getAllCases();
    cases.push(newCase);
    await storeEncrypted(this.STORAGE_KEYS.CASES, cases);

    return newCase;
  }

  async updateCase(caseId: string, updates: Partial<Case>): Promise<Case | null> {
    const cases = await this.getAllCases();
    const caseIndex = cases.findIndex(c => c.id === caseId);
    
    if (caseIndex === -1) return null;

    cases[caseIndex] = {
      ...cases[caseIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await storeEncrypted(this.STORAGE_KEYS.CASES, cases);
    return cases[caseIndex];
  }

  async deleteCase(caseId: string): Promise<boolean> {
    const cases = await this.getAllCases();
    const filteredCases = cases.filter(c => c.id !== caseId);
    
    if (filteredCases.length === cases.length) return false;
    
    await storeEncrypted(this.STORAGE_KEYS.CASES, filteredCases);
    return true;
  }

  async getCase(caseId: string): Promise<Case | null> {
    const cases = await this.getAllCases();
    return cases.find(c => c.id === caseId) || null;
  }

  async getAllCases(): Promise<Case[]> {
    const cases = await retrieveEncrypted(this.STORAGE_KEYS.CASES);
    return cases || [];
  }

  // Event Management
  async addEvent(caseId: string, eventData: Omit<CaseEvent, 'id' | 'createdAt' | 'updatedAt'>): Promise<CaseEvent | null> {
    const case_ = await this.getCase(caseId);
    if (!case_) return null;

    const newEvent: CaseEvent = {
      ...eventData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    case_.events.push(newEvent);
    case_.updatedAt = new Date().toISOString();

    await this.updateCase(caseId, case_);
    return newEvent;
  }

  async updateEvent(caseId: string, eventId: string, updates: Partial<CaseEvent>): Promise<CaseEvent | null> {
    const case_ = await this.getCase(caseId);
    if (!case_) return null;

    const eventIndex = case_.events.findIndex(e => e.id === eventId);
    if (eventIndex === -1) return null;

    case_.events[eventIndex] = {
      ...case_.events[eventIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    case_.updatedAt = new Date().toISOString();
    await this.updateCase(caseId, case_);

    return case_.events[eventIndex];
  }

  async deleteEvent(caseId: string, eventId: string): Promise<boolean> {
    const case_ = await this.getCase(caseId);
    if (!case_) return false;

    const eventIndex = case_.events.findIndex(e => e.id === eventId);
    if (eventIndex === -1) return false;

    case_.events.splice(eventIndex, 1);
    case_.updatedAt = new Date().toISOString();
    
    await this.updateCase(caseId, case_);
    return true;
  }

  async getEvent(caseId: string, eventId: string): Promise<CaseEvent | null> {
    const case_ = await this.getCase(caseId);
    if (!case_) return null;

    return case_.events.find(e => e.id === eventId) || null;
  }

  // Timeline Operations
  async getTimeline(caseId: string, filter?: TimelineFilter): Promise<CaseEvent[]> {
    const case_ = await this.getCase(caseId);
    if (!case_) return [];

    let events = [...case_.events];

    if (filter) {
      if (filter.eventTypes && filter.eventTypes.length > 0) {
        events = events.filter(e => filter.eventTypes!.includes(e.eventType));
      }

      if (filter.priorities && filter.priorities.length > 0) {
        events = events.filter(e => filter.priorities!.includes(e.priority));
      }

      if (filter.dateRange) {
        events = events.filter(e => {
          const eventDate = new Date(e.date);
          const startDate = new Date(filter.dateRange!.start);
          const endDate = new Date(filter.dateRange!.end);
          return eventDate >= startDate && eventDate <= endDate;
        });
      }

      if (filter.tags && filter.tags.length > 0) {
        events = events.filter(e => 
          filter.tags!.some(tag => e.tags.includes(tag))
        );
      }

      if (filter.completed !== undefined) {
        events = events.filter(e => e.completed === filter.completed);
      }
    }

    // Sort by date (earliest first)
    return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async getTimelineStats(caseId: string): Promise<TimelineStats> {
    const case_ = await this.getCase(caseId);
    if (!case_) {
      return {
        totalEvents: 0,
        upcomingEvents: 0,
        overdueEvents: 0,
        completedEvents: 0,
        criticalDeadlines: []
      };
    }

    const now = new Date();
    const events = case_.events;

    const upcomingEvents = events.filter(e => 
      !e.completed && new Date(e.date) > now
    );

    const overdueEvents = events.filter(e => 
      !e.completed && new Date(e.date) < now
    );

    const completedEvents = events.filter(e => e.completed);

    const criticalDeadlines = events.filter(e => 
      !e.completed && e.priority === 'critical'
    );

    const nextDeadline = upcomingEvents.length > 0 
      ? upcomingEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]
      : undefined;

    return {
      totalEvents: events.length,
      upcomingEvents: upcomingEvents.length,
      overdueEvents: overdueEvents.length,
      completedEvents: completedEvents.length,
      nextDeadline,
      criticalDeadlines
    };
  }

  // Export functionality
  async exportTimeline(caseId: string, options: TimelineExportOptions): Promise<string> {
    const events = await this.getTimeline(caseId);
    
    if (options.format === 'ics') {
      return generateICSContent(events, options);
    } else if (options.format === 'json') {
      return JSON.stringify(events, null, 2);
    } else if (options.format === 'csv') {
      return this.generateCSV(events);
    }
    
    throw new Error(`Unsupported export format: ${options.format}`);
  }

  async downloadTimeline(caseId: string, options: TimelineExportOptions, filename?: string): Promise<void> {
    const content = await this.exportTimeline(caseId, options);
    
    if (options.format === 'ics') {
      const defaultFilename = filename || `case-timeline-${caseId}.ics`;
      downloadICSFile(content, defaultFilename);
    } else {
      // Handle other formats
      const blob = new Blob([content], { 
        type: options.format === 'json' ? 'application/json' : 'text/csv' 
      });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `case-timeline-${caseId}.${options.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    }
  }

  private generateCSV(events: CaseEvent[]): string {
    const headers = ['Title', 'Type', 'Date', 'Time', 'Priority', 'Location', 'Description', 'Tags', 'Completed'];
    const rows = events.map(event => [
      event.title,
      event.eventType,
      event.date,
      event.time || '',
      event.priority,
      event.location || '',
      event.description || '',
      event.tags.join(';'),
      event.completed ? 'Yes' : 'No'
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    return csvContent;
  }

  // Utility methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Cleanup
  async cleanup(): Promise<void> {
    // Remove expired events (older than 5 years)
    const cases = await this.getAllCases();
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);

    let hasChanges = false;
    cases.forEach(case_ => {
      const originalLength = case_.events.length;
      case_.events = case_.events.filter(e => new Date(e.date) > fiveYearsAgo);
      
      if (case_.events.length !== originalLength) {
        hasChanges = true;
        case_.updatedAt = new Date().toISOString();
      }
    });

    if (hasChanges) {
      await storeEncrypted(this.STORAGE_KEYS.CASES, cases);
    }
  }

  // Health check
  async isHealthy(): Promise<boolean> {
    try {
      return await encryptedStorage.isHealthy();
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
export const caseTimelineService = CaseTimelineService.getInstance();

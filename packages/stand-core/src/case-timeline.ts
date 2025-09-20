export interface CaseEvent {
  id: string;
  caseName: string;
  eventType: 'deadline' | 'hearing' | 'filing' | 'mediation' | 'trial' | 'custom';
  title: string;
  description?: string;
  date: string; // ISO date string
  time?: string; // Optional time
  location?: string;
  notes?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  completed: boolean;
  completedAt?: string;
  reminders: Reminder[];
  attachments?: string[]; // File paths or IDs
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Reminder {
  id: string;
  type: 'push' | 'email' | 'sms';
  timeBeforeEvent: number; // Minutes before event
  sent: boolean;
  sentAt?: string;
}

export interface Case {
  id: string;
  name: string;
  caseNumber?: string;
  court?: string;
  caseType: 'family' | 'civil' | 'small-claims' | 'housing' | 'criminal' | 'immigration' | 'bankruptcy';
  status: 'active' | 'closed' | 'pending';
  events: CaseEvent[];
  parties: CaseParty[];
  documents: CaseDocument[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CaseParty {
  id: string;
  name: string;
  type: 'plaintiff' | 'defendant' | 'petitioner' | 'respondent' | 'other';
  contact?: {
    phone?: string;
    email?: string;
    address?: string;
  };
  attorney?: {
    name: string;
    contact: string;
  };
}

export interface CaseDocument {
  id: string;
  name: string;
  type: 'pleading' | 'motion' | 'order' | 'evidence' | 'correspondence' | 'other';
  filePath: string;
  uploadedAt: string;
  tags: string[];
}

export interface TimelineExportOptions {
  format: 'ics' | 'csv' | 'json';
  dateRange?: {
    start: string;
    end: string;
  };
  includeCompleted: boolean;
  includeReminders: boolean;
}

export interface TimelineFilter {
  eventTypes?: CaseEvent['eventType'][];
  priorities?: CaseEvent['priority'][];
  dateRange?: {
    start: string;
    end: string;
  };
  tags?: string[];
  completed?: boolean;
}

export interface TimelineStats {
  totalEvents: number;
  upcomingEvents: number;
  overdueEvents: number;
  completedEvents: number;
  nextDeadline?: CaseEvent;
  criticalDeadlines: CaseEvent[];
}

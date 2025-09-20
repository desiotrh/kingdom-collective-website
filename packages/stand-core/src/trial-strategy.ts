export interface TrialStrategyFile {
  id: string;
  caseNumber: string;
  partyName: string;
  courtDate: string;
  openingStatement: OpeningStatement;
  witnesses: WitnessOutline[];
  userTestimony: TestimonyOutline;
  closingStatement: ClosingStatement;
  exhibits: ExhibitList;
  notes: CourtNote[];
  createdAt: string;
}

export interface OpeningStatement {
  caseOverview: string;
  keyIssues: string[];
  desiredOutcome: string;
  timeEstimate: number; // minutes
}

export interface WitnessOutline {
  id: string;
  name: string;
  relationship: string;
  keyPoints: string[];
  questions: WitnessQuestion[];
  exhibitReferences: string[];
  timeEstimate: number;
}

export interface WitnessQuestion {
  id: string;
  question: string;
  expectedAnswer: string;
  exhibitToShow?: string;
  followUpNotes?: string;
}

export interface TestimonyOutline {
  bulletPoints: string[];
  exhibitCues: Array<{
    afterPoint: number;
    exhibit: string;
    action: 'show' | 'explain' | 'read';
  }>;
  timeEstimate: number;
}

export interface ClosingStatement {
  keyPointsSummary: string[];
  evidenceSummary: string;
  finalRequest: string;
  timeEstimate: number;
}

export interface ExhibitList {
  exhibits: Array<{
    label: string;
    description: string;
    filename?: string;
    useInOpening: boolean;
    useInTestimony: boolean;
    useInClosing: boolean;
  }>;
}

export interface CourtNote {
  id: string;
  timestamp: string;
  content: string;
  category: 'procedure' | 'objection' | 'ruling' | 'general';
}

export interface CourtroomModeTab {
  id: string;
  title: string;
  icon: string;
  content: 'opening' | 'witnesses' | 'testimony' | 'closing' | 'exhibits' | 'notes';
}

export const COURTROOM_TABS: CourtroomModeTab[] = [
  { id: 'opening', title: 'Opening', icon: '🎯', content: 'opening' },
  { id: 'witnesses', title: 'Witnesses', icon: '👥', content: 'witnesses' },
  { id: 'testimony', title: 'My Testimony', icon: '🎤', content: 'testimony' },
  { id: 'closing', title: 'Closing', icon: '⚖️', content: 'closing' },
  { id: 'exhibits', title: 'Exhibits', icon: '📄', content: 'exhibits' },
  { id: 'notes', title: 'Notes', icon: '📝', content: 'notes' },
];

export interface PreCourtChecklist {
  items: Array<{
    id: string;
    task: string;
    completed: boolean;
    category: 'preparation' | 'documents' | 'logistics';
  }>;
}

export const DEFAULT_PRECOURT_CHECKLIST: PreCourtChecklist = {
  items: [
    { id: 'documents-printed', task: 'Print 3 copies of all documents', completed: false, category: 'documents' },
    { id: 'exhibits-organized', task: 'Organize exhibits in order', completed: false, category: 'documents' },
    { id: 'arrive-early', task: 'Plan to arrive 30 minutes early', completed: false, category: 'logistics' },
    { id: 'check-security', task: 'Review courthouse security rules', completed: false, category: 'logistics' },
    { id: 'review-opening', task: 'Practice opening statement', completed: false, category: 'preparation' },
    { id: 'witness-questions', task: 'Review witness questions', completed: false, category: 'preparation' },
  ],
};

export function generateTrialBinder(strategy: TrialStrategyFile): {
  sections: Array<{
    title: string;
    pages: string[];
  }>;
  totalPages: number;
} {
  return {
    sections: [
      {
        title: 'Case Overview',
        pages: [`Case: ${strategy.caseNumber}`, `Party: ${strategy.partyName}`, `Date: ${strategy.courtDate}`],
      },
      {
        title: 'Opening Statement',
        pages: [strategy.openingStatement.caseOverview],
      },
      {
        title: 'Witness Outlines',
        pages: strategy.witnesses.map(w => `${w.name}: ${w.keyPoints.join(', ')}`),
      },
      {
        title: 'My Testimony',
        pages: strategy.userTestimony.bulletPoints,
      },
      {
        title: 'Closing Statement',
        pages: [strategy.closingStatement.finalRequest],
      },
      {
        title: 'Exhibit List',
        pages: strategy.exhibits.exhibits.map(e => `${e.label}: ${e.description}`),
      },
    ],
    totalPages: 0, // Calculate based on content
  };
}

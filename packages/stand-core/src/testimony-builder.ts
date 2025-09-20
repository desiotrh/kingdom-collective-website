export interface TestimonyDraft {
  id: string;
  title: string;
  narrative: string;
  exhibitReferences: ExhibitReference[];
  createdAt: string;
  lastModified: string;
  isFactual: boolean; // AI validation flag
}

export interface ExhibitReference {
  id: string;
  label: string; // "Exhibit A", "Exhibit 1", etc.
  description: string;
  filename?: string;
  insertionPoints: number[]; // Character positions in narrative
}

export interface WitnessAffidavit {
  id: string;
  witnessName: string;
  witnessAddress: string;
  relationship: string;
  facts: string[];
  exhibitReferences: ExhibitReference[];
  requiresNotarization: boolean;
  stateTemplate: string; // State-specific format
  notaryBlock: string;
}

export interface TestimonyQuestion {
  id: string;
  category: 'timeline' | 'facts' | 'evidence' | 'outcome';
  question: string;
  required: boolean;
  followUp?: string;
}

export const TESTIMONY_QUESTIONS: TestimonyQuestion[] = [
  {
    id: 'timeline-start',
    category: 'timeline',
    question: 'When did the events you want to tell the court about begin?',
    required: true,
  },
  {
    id: 'facts-what-happened',
    category: 'facts',
    question: 'What exactly happened? Stick to facts you personally witnessed.',
    required: true,
    followUp: 'Avoid opinions or speculation. What did you see, hear, or experience directly?',
  },
  {
    id: 'evidence-documents',
    category: 'evidence',
    question: 'Do you have any documents, photos, or recordings that support your testimony?',
    required: false,
  },
  {
    id: 'outcome-request',
    category: 'outcome',
    question: 'What specific outcome are you asking the court for?',
    required: true,
  },
];

export const TESTIMONY_GUARDRAILS = {
  flaggedPhrases: [
    'I think', 'I believe', 'probably', 'maybe', 'I assume',
    'he/she is a liar', 'they always', 'they never',
  ],
  requiredDisclaimers: [
    'Educational draft only - not legal advice',
    'Review carefully and modify as needed',
    'Testimony must be truthful - perjury is a crime',
  ],
};

export function validateTestimonyDraft(narrative: string): {
  isFactual: boolean;
  warnings: string[];
  suggestions: string[];
} {
  const warnings: string[] = [];
  const suggestions: string[] = [];
  
  // Check for opinion words
  TESTIMONY_GUARDRAILS.flaggedPhrases.forEach(phrase => {
    if (narrative.toLowerCase().includes(phrase.toLowerCase())) {
      warnings.push(`Consider removing opinion language: "${phrase}"`);
    }
  });
  
  // Check for exhibit references
  if (!/exhibit|document|photo|recording/i.test(narrative)) {
    suggestions.push('Consider referencing any supporting documents as exhibits');
  }
  
  return {
    isFactual: warnings.length === 0,
    warnings,
    suggestions,
  };
}

export function generateNotaryBlock(state: string): string {
  // Basic template - would be customized per state
  return `
State of ${state}
County of __________

Subscribed and sworn to before me this _____ day of _________, 20__.

_________________________
Notary Public
My commission expires: ___________
  `.trim();
}

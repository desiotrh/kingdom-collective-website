export type FAQCategory = 'custody' | 'support' | 'evictions' | 'small-claims' | 'general';

export interface FAQQuestion {
  id: string;
  category: FAQCategory;
  question: string;
  answer: string;
  sourceLinks: Array<{
    title: string;
    url: string;
    verified: string; // ISO date
  }>;
  lastVerified: string; // ISO date
  upvotes: number;
  phase: 0 | 1 | 2; // Rollout phase
}

export interface SubmittedQuestion {
  id: string;
  category: FAQCategory;
  question: string;
  submittedAt: string; // ISO date
  reviewed: boolean;
}

export const FAQ_CATEGORIES: Record<FAQCategory, string> = {
  'custody': 'Child Custody & Visitation',
  'support': 'Child & Spousal Support',
  'evictions': 'Evictions & Housing',
  'small-claims': 'Small Claims Court',
  'general': 'General Court Procedures',
};

// Phase 1: Curated Q&A examples
export const CURATED_FAQS: FAQQuestion[] = [
  {
    id: 'custody-1',
    category: 'custody',
    question: 'What documents do I need to file for custody?',
    answer: 'Typically you need: 1) Petition for custody, 2) Summons, 3) Financial affidavit, 4) Child support worksheets. Requirements vary by state.',
    sourceLinks: [
      {
        title: 'State Court Self-Help',
        url: 'https://example-state-court.gov/custody-forms',
        verified: new Date().toISOString(),
      }
    ],
    lastVerified: new Date().toISOString(),
    upvotes: 0,
    phase: 1,
  },
  {
    id: 'small-claims-1',
    category: 'small-claims',
    question: 'What is the filing fee for small claims court?',
    answer: 'Filing fees vary by state and claim amount, typically $30-$100. Most courts offer fee waivers for low-income filers.',
    sourceLinks: [
      {
        title: 'Small Claims Fee Schedule',
        url: 'https://example-court.gov/fees',
        verified: new Date().toISOString(),
      }
    ],
    lastVerified: new Date().toISOString(),
    upvotes: 0,
    phase: 1,
  },
];

export function submitQuestion(category: FAQCategory, question: string): SubmittedQuestion {
  return {
    id: `submitted-${Date.now()}`,
    category,
    question,
    submittedAt: new Date().toISOString(),
    reviewed: false,
  };
}

export function upvoteFAQ(faqId: string, faqs: FAQQuestion[]): FAQQuestion[] {
  return faqs.map(faq => 
    faq.id === faqId ? { ...faq, upvotes: faq.upvotes + 1 } : faq
  );
}

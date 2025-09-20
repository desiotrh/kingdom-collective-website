export type RedFlagCategory = 'criminal' | 'immigration' | 'bankruptcy';

export const DISCLAIMER = 'Legal information, not legal advice. We are not your attorney.';

export function getRedFlagNotice(category: RedFlagCategory): string {
  const base = 'This topic often requires specialized legal counsel.';
  switch (category) {
    case 'criminal':
      return `${base} Consider contacting a criminal defense attorney.`;
    case 'immigration':
      return `${base} Consider contacting an immigration attorney.`;
    case 'bankruptcy':
      return `${base} Consider contacting a bankruptcy attorney.`;
  }
}

export interface VerifiedSource {
  title: string;
  url: string;
  verifiedAt: string; // ISO date string
}

// Re-export all feature modules
export * from './document-converter';
export * from './grounding-exercises';
export * from './community-faq';
export * from './testimony-builder';
export * from './trial-strategy';
export * from './family-requirements';
export * from './lawyer-directory';
export * from './case-timeline';
export * from './utils/ics-export';
export * from './utils/encrypted-storage';
export * from './services/case-timeline-service';
export * from './consent-settings';
export * from './guardrails';
export * from './legal-aid';
export * from './i18n';
export * from './security/app-lock';
export * from './observability';
export * from './efiling';
export * from './education';



export type StateCode = string; // e.g., 'IA'
export type PracticeArea = 'family' | 'small-claims' | 'housing' | 'general-civil';

export interface LawyerRecord {
  id: string;
  fullName: string;
  barNumber: string;
  licensedStates: StateCode[];
  licenseStatus: 'active' | 'inactive' | 'suspended' | 'retired' | 'unknown';
  lastVerified: string; // ISO
  contact: {
    phone?: string;
    email?: string;
    website?: string;
    address?: string;
  };
  practiceAreas: PracticeArea[];
  feeModel: Array<'hourly' | 'flat-fee' | 'sliding-scale' | 'limited-scope' | 'pro-bono'>;
  programs: Array<'pro-bono' | 'modest-means' | 'legal-aid-panel'>;
  languages: string[];
  availability: {
    onlineConsult?: boolean;
    eveningWeekend?: boolean;
  };
  ratings?: {
    google?: string;
    avvo?: string;
    yelp?: string;
  };
  sources: Array<{ title: string; url: string }>;
}

export interface LawyerFilters {
  pricing?: Array<'affordable' | 'sliding-scale' | 'flat-fee' | 'limited-scope' | 'pro-bono'>;
  specialization?: PracticeArea[];
  language?: string;
  availability?: Array<'evening-weekend' | 'online-consult'>;
}

export function filterLawyers(lawyers: LawyerRecord[], filters: LawyerFilters): LawyerRecord[] {
  return lawyers.filter(l => {
    if (filters.pricing) {
      const has = (k: string) => l.feeModel.includes(k as any) || l.programs.includes(k as any);
      const allOk = filters.pricing.every(p => {
        if (p === 'affordable') return l.feeModel.includes('sliding-scale') || l.feeModel.includes('flat-fee') || l.programs.includes('modest-means');
        if (p === 'sliding-scale') return l.feeModel.includes('sliding-scale');
        if (p === 'flat-fee') return l.feeModel.includes('flat-fee');
        if (p === 'limited-scope') return l.feeModel.includes('limited-scope');
        if (p === 'pro-bono') return l.feeModel.includes('pro-bono') || l.programs.includes('pro-bono');
        return false;
      });
      if (!allOk) return false;
    }
    if (filters.specialization && filters.specialization.length > 0) {
      if (!filters.specialization.some(a => l.practiceAreas.includes(a))) return false;
    }
    if (filters.language) {
      if (!l.languages.map(x => x.toLowerCase()).includes(filters.language.toLowerCase())) return false;
    }
    if (filters.availability) {
      const ok = filters.availability.every(a => {
        if (a === 'online-consult') return !!l.availability.onlineConsult;
        if (a === 'evening-weekend') return !!l.availability.eveningWeekend;
        return true;
      });
      if (!ok) return false;
    }
    return true;
  });
}

export interface LawyerBadge {
  type: 'verified-active' | 'community-affordable' | 'pro-bono-slots';
  label: string;
}

export function computeBadges(l: LawyerRecord, thresholdFlatFeeUsd = 500): LawyerBadge[] {
  const badges: LawyerBadge[] = [];
  if (l.licenseStatus === 'active') badges.push({ type: 'verified-active', label: `Verified Active on ${l.lastVerified.split('T')[0]}` });
  if (l.feeModel.includes('flat-fee') || l.feeModel.includes('sliding-scale') || l.programs.includes('modest-means')) {
    badges.push({ type: 'community-affordable', label: 'Community Affordable' });
  }
  if (l.feeModel.includes('pro-bono') || l.programs.includes('pro-bono')) badges.push({ type: 'pro-bono-slots', label: 'Pro Bono Slots Available' });
  return badges;
}



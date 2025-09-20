export type UsStateCode = string; // e.g., 'CA'
export type CountyName = string; // e.g., 'Los Angeles'

export interface VerificationMeta {
  verifiedAt: string; // ISO
  sourceUrl: string;
}

export interface MediatorRecord {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  website?: string;
  mediationType: 'family' | 'civil' | 'both';
  onlineAvailable: boolean;
  slidingScale: boolean;
  courtApproved: boolean;
  verification: VerificationMeta;
}

export interface ParentingClassRecord {
  id: string;
  name: string;
  registrationUrl?: string;
  formats: Array<'in-person' | 'online-live' | 'online-self-paced'>;
  courtApproved: boolean;
  verification: VerificationMeta;
}

export interface GalRecord {
  id: string;
  name: string;
  contact?: string;
  type: 'attorney-gal' | 'casa-volunteer';
  approvalStatus: 'court-approved' | 'program-approved' | 'unknown';
  privatePayAvailable: boolean;
  website?: string;
  verification: VerificationMeta;
}

export interface CountyFamilyResources {
  state: UsStateCode;
  county: CountyName;
  mediators: MediatorRecord[];
  parentingClasses: ParentingClassRecord[];
  galDirectory: GalRecord[];
  verification: VerificationMeta;
}

export interface FamilyFilters {
  courtApprovedOnly?: boolean;
  onlineAvailable?: boolean; // mediators/classes
  slidingScale?: boolean; // mediators
  classFormat?: 'in-person' | 'online-live' | 'online-self-paced';
  galType?: 'attorney-gal' | 'casa-volunteer';
}

export function filterMediators(mediators: MediatorRecord[], filters: FamilyFilters): MediatorRecord[] {
  return mediators.filter(m => {
    if (filters.courtApprovedOnly && !m.courtApproved) return false;
    if (typeof filters.onlineAvailable === 'boolean' && m.onlineAvailable !== filters.onlineAvailable) return false;
    if (typeof filters.slidingScale === 'boolean' && m.slidingScale !== filters.slidingScale) return false;
    return true;
  });
}

export function filterParentingClasses(classes: ParentingClassRecord[], filters: FamilyFilters): ParentingClassRecord[] {
  return classes.filter(c => {
    if (filters.courtApprovedOnly && !c.courtApproved) return false;
    if (filters.onlineAvailable !== undefined) {
      const online = c.formats.includes('online-live') || c.formats.includes('online-self-paced');
      if (online !== filters.onlineAvailable) return false;
    }
    if (filters.classFormat && !c.formats.includes(filters.classFormat)) return false;
    return true;
  });
}

export function filterGals(gals: GalRecord[], filters: FamilyFilters): GalRecord[] {
  return gals.filter(g => {
    if (filters.galType && g.type !== filters.galType) return false;
    if (filters.courtApprovedOnly && g.approvalStatus !== 'court-approved') return false;
    return true;
  });
}

export interface TimelineEvent {
  id: string;
  title: string;
  dueDate: string; // ISO
  category: 'class' | 'mediation' | 'gal-report' | 'hearing';
  notes?: string;
}

export function buildClassDeadlineEvent(course: ParentingClassRecord, dueDateISO: string): TimelineEvent {
  return {
    id: `class-${course.id}-${dueDateISO}`,
    title: `Parenting class certificate due`,
    dueDate: dueDateISO,
    category: 'class',
    notes: `File certificate with the court. Course: ${course.name}`,
  };
}

export function buildMediationEvent(name: string, dateISO: string): TimelineEvent {
  return {
    id: `mediation-${dateISO}`,
    title: `Mediation: ${name}`,
    dueDate: dateISO,
    category: 'mediation',
  };
}

export function buildGalReportEvent(dateISO: string): TimelineEvent {
  return {
    id: `gal-report-${dateISO}`,
    title: `GAL report due`,
    dueDate: dateISO,
    category: 'gal-report',
  };
}



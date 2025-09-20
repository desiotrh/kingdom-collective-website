export interface LegalAidOrganization {
  id: string;
  name: string;
  type: 'legal_aid' | 'pro_bono' | 'law_clinic' | 'bar_association' | 'nonprofit' | 'government';
  
  // Contact information
  contact: {
    phone?: string;
    email?: string;
    website?: string;
    address?: string;
    hours?: string;
  };
  
  // Service details
  services: LegalService[];
  practiceAreas: string[];
  
  // Eligibility and requirements
  eligibility: {
    incomeLimit?: number; // Annual income limit
    geographicArea: string[];
    citizenship?: 'citizens' | 'residents' | 'all' | 'undocumented';
    caseTypes: string[];
    documentationRequired: string[];
  };
  
  // Availability and capacity
  availability: {
    acceptingNewCases: boolean;
    waitlistLength?: number;
    responseTime?: string; // e.g., "24-48 hours"
    appointmentRequired: boolean;
    walkInsAccepted: boolean;
    onlineIntake: boolean;
  };
  
  // Languages and accessibility
  languages: string[];
  accessibility: {
    wheelchairAccessible: boolean;
    interpreterServices: boolean;
    ttyAvailable: boolean;
    largePrintAvailable: boolean;
    audioFormatAvailable: boolean;
  };
  
  // Verification and ratings
  verified: boolean;
  verifiedAt?: string;
  sourceUrl?: string;
  userRating?: number;
  reviewCount?: number;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface LegalService {
  id: string;
  name: string;
  description: string;
  free: boolean;
  slidingScale: boolean;
  cost?: string;
  duration?: string; // e.g., "30 minutes", "1 hour"
  type: 'consultation' | 'representation' | 'document_review' | 'referral' | 'education' | 'other';
}

export interface LegalAidDirectory {
  state: string;
  county: string;
  organizations: LegalAidOrganization[];
  lastUpdated: string;
  sourceUrl?: string;
}

export interface LegalAidFilter {
  practiceAreas?: string[];
  freeServices?: boolean;
  slidingScale?: boolean;
  languages?: string[];
  accessibility?: string[];
  geographicArea?: string[];
  caseTypes?: string[];
  incomeLimit?: number;
}

export interface LegalAidSearchResult {
  organization: LegalAidOrganization;
  relevanceScore: number;
  matchReasons: string[];
}

export interface LegalAidService {
  // Search and filter legal aid organizations
  searchOrganizations(query: string, filters?: LegalAidFilter): Promise<LegalAidSearchResult[]>;
  
  // Get organizations by location
  getOrganizationsByLocation(state: string, county?: string): Promise<LegalAidOrganization[]>;
  
  // Get organizations by practice area
  getOrganizationsByPracticeArea(practiceArea: string): Promise<LegalAidOrganization[]>;
  
  // Get organization details
  getOrganization(id: string): Promise<LegalAidOrganization | null>;
  
  // Check eligibility for a specific organization
  checkEligibility(organizationId: string, userInfo: any): Promise<{
    eligible: boolean;
    reasons: string[];
    requirements: string[];
  }>;
  
  // Get recommendations based on case type and user situation
  getRecommendations(caseType: string, userInfo: any): Promise<LegalAidOrganization[]>;
}

// Sample legal aid organizations data structure
export const SAMPLE_LEGAL_AID_ORGANIZATIONS: LegalAidOrganization[] = [
  {
    id: 'la_001',
    name: 'Legal Aid Society of California',
    type: 'legal_aid',
    contact: {
      phone: '1-800-433-6255',
      email: 'info@legalaidca.org',
      website: 'https://www.legalaidca.org',
      address: '123 Legal Street, Los Angeles, CA 90012',
      hours: 'Monday-Friday 9:00 AM - 5:00 PM'
    },
    services: [
      {
        id: 'srv_001',
        name: 'Free Legal Consultation',
        description: 'Initial consultation to assess your legal needs',
        free: true,
        slidingScale: false,
        type: 'consultation',
        duration: '30 minutes'
      },
      {
        id: 'srv_002',
        name: 'Family Law Representation',
        description: 'Legal representation in family law matters',
        free: true,
        slidingScale: false,
        type: 'representation'
      }
    ],
    practiceAreas: ['family', 'housing', 'employment', 'public_benefits', 'immigration'],
    eligibility: {
      incomeLimit: 30000,
      geographicArea: ['Los Angeles County', 'Orange County'],
      citizenship: 'all',
      caseTypes: ['family', 'housing', 'employment'],
      documentationRequired: ['proof_of_income', 'photo_id', 'case_documents']
    },
    availability: {
      acceptingNewCases: true,
      waitlistLength: 15,
      responseTime: '24-48 hours',
      appointmentRequired: true,
      walkInsAccepted: false,
      onlineIntake: true
    },
    languages: ['English', 'Spanish', 'Mandarin', 'Korean'],
    accessibility: {
      wheelchairAccessible: true,
      interpreterServices: true,
      ttyAvailable: true,
      largePrintAvailable: true,
      audioFormatAvailable: false
    },
    verified: true,
    verifiedAt: '2024-01-01T00:00:00Z',
    sourceUrl: 'https://www.legalaidca.org',
    userRating: 4.5,
    reviewCount: 127,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'la_002',
    name: 'Pro Bono Law Clinic',
    type: 'pro_bono',
    contact: {
      phone: '1-800-555-0123',
      email: 'clinic@probonolaw.org',
      website: 'https://www.probonolaw.org',
      address: '456 Justice Avenue, San Francisco, CA 94102',
      hours: 'Tuesday-Saturday 10:00 AM - 6:00 PM'
    },
    services: [
      {
        id: 'srv_003',
        name: 'Pro Bono Representation',
        description: 'Free legal representation for qualifying cases',
        free: true,
        slidingScale: false,
        type: 'representation'
      }
    ],
    practiceAreas: ['civil_rights', 'family', 'immigration', 'housing'],
    eligibility: {
      geographicArea: ['San Francisco County', 'Alameda County'],
      citizenship: 'all',
      caseTypes: ['civil_rights', 'family', 'immigration'],
      documentationRequired: ['case_summary', 'photo_id']
    },
    availability: {
      acceptingNewCases: false,
      waitlistLength: 45,
      responseTime: '1-2 weeks',
      appointmentRequired: true,
      walkInsAccepted: false,
      onlineIntake: false
    },
    languages: ['English', 'Spanish'],
    accessibility: {
      wheelchairAccessible: true,
      interpreterServices: true,
      ttyAvailable: false,
      largePrintAvailable: false,
      audioFormatAvailable: false
    },
    verified: true,
    verifiedAt: '2024-01-01T00:00:00Z',
    sourceUrl: 'https://www.probonolaw.org',
    userRating: 4.8,
    reviewCount: 89,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Legal aid service implementation
export class LegalAidService implements LegalAidService {
  private static instance: LegalAidService;
  private organizations: Map<string, LegalAidOrganization> = new Map();
  private directories: Map<string, LegalAidDirectory> = new Map();

  private constructor() {
    // Initialize with sample data
    SAMPLE_LEGAL_AID_ORGANIZATIONS.forEach(org => {
      this.organizations.set(org.id, org);
    });
  }

  static getInstance(): LegalAidService {
    if (!LegalAidService.instance) {
      LegalAidService.instance = new LegalAidService();
    }
    return LegalAidService.instance;
  }

  async searchOrganizations(query: string, filters?: LegalAidFilter): Promise<LegalAidSearchResult[]> {
    const results: LegalAidSearchResult[] = [];
    const queryLower = query.toLowerCase();

    for (const org of this.organizations.values()) {
      let relevanceScore = 0;
      const matchReasons: string[] = [];

      // Name match
      if (org.name.toLowerCase().includes(queryLower)) {
        relevanceScore += 10;
        matchReasons.push('Name matches search query');
      }

      // Practice area match
      if (org.practiceAreas.some(area => area.toLowerCase().includes(queryLower))) {
        relevanceScore += 8;
        matchReasons.push('Practice area matches search query');
      }

      // Service description match
      if (org.services.some(service => 
        service.description.toLowerCase().includes(queryLower)
      )) {
        relevanceScore += 6;
        matchReasons.push('Service description matches search query');
      }

      // Apply filters
      if (filters) {
        if (filters.practiceAreas && filters.practiceAreas.length > 0) {
          if (!filters.practiceAreas.some(area => org.practiceAreas.includes(area))) {
            continue; // Skip if no practice area match
          }
        }

        if (filters.freeServices !== undefined) {
          if (filters.freeServices && !org.services.some(s => s.free)) {
            continue; // Skip if free services required but none available
          }
        }

        if (filters.languages && filters.languages.length > 0) {
          if (!filters.languages.some(lang => org.languages.includes(lang))) {
            continue; // Skip if language requirement not met
          }
        }
      }

      if (relevanceScore > 0) {
        results.push({
          organization: org,
          relevanceScore,
          matchReasons
        });
      }
    }

    // Sort by relevance score (highest first)
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  async getOrganizationsByLocation(state: string, county?: string): Promise<LegalAidOrganization[]> {
    const results: LegalAidOrganization[] = [];

    for (const org of this.organizations.values()) {
      if (org.eligibility.geographicArea.some(area => 
        area.toLowerCase().includes(state.toLowerCase()) ||
        (county && area.toLowerCase().includes(county.toLowerCase()))
      )) {
        results.push(org);
      }
    }

    return results;
  }

  async getOrganizationsByPracticeArea(practiceArea: string): Promise<LegalAidOrganization[]> {
    const results: LegalAidOrganization[] = [];

    for (const org of this.organizations.values()) {
      if (org.practiceAreas.some(area => 
        area.toLowerCase().includes(practiceArea.toLowerCase())
      )) {
        results.push(org);
      }
    }

    return results;
  }

  async getOrganization(id: string): Promise<LegalAidOrganization | null> {
    return this.organizations.get(id) || null;
  }

  async checkEligibility(organizationId: string, userInfo: any): Promise<{
    eligible: boolean;
    reasons: string[];
    requirements: string[];
  }> {
    const org = await this.getOrganization(organizationId);
    if (!org) {
      return {
        eligible: false,
        reasons: ['Organization not found'],
        requirements: []
      };
    }

    const reasons: string[] = [];
    const requirements: string[] = [];
    let eligible = true;

    // Check income limit
    if (org.eligibility.incomeLimit && userInfo.income) {
      if (userInfo.income > org.eligibility.incomeLimit) {
        eligible = false;
        reasons.push(`Income exceeds limit of $${org.eligibility.incomeLimit}`);
      } else {
        reasons.push('Income within acceptable range');
      }
    }

    // Check geographic area
    if (userInfo.location) {
      const locationMatch = org.eligibility.geographicArea.some(area => 
        area.toLowerCase().includes(userInfo.location.toLowerCase())
      );
      if (!locationMatch) {
        eligible = false;
        reasons.push('Location not in service area');
      } else {
        reasons.push('Location in service area');
      }
    }

    // Check case type
    if (userInfo.caseType) {
      const caseTypeMatch = org.eligibility.caseTypes.includes(userInfo.caseType);
      if (!caseTypeMatch) {
        eligible = false;
        reasons.push('Case type not handled by this organization');
      } else {
        reasons.push('Case type is handled by this organization');
      }
    }

    // Add requirements
    requirements.push(...org.eligibility.documentationRequired);

    return { eligible, reasons, requirements };
  }

  async getRecommendations(caseType: string, userInfo: any): Promise<LegalAidOrganization[]> {
    const recommendations: LegalAidOrganization[] = [];

    for (const org of this.organizations.values()) {
      // Check if organization handles this case type
      if (!org.eligibility.caseTypes.includes(caseType)) {
        continue;
      }

      // Check basic eligibility
      const eligibility = await this.checkEligibility(org.id, userInfo);
      if (eligibility.eligible) {
        recommendations.push(org);
      }
    }

    // Sort by rating (highest first), then by availability
    return recommendations.sort((a, b) => {
      if (a.userRating !== b.userRating) {
        return (b.userRating || 0) - (a.userRating || 0);
      }
      return (a.availability.waitlistLength || 0) - (b.availability.waitlistLength || 0);
    });
  }
}

// Export singleton instance
export const legalAidService = LegalAidService.getInstance();

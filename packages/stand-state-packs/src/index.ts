export interface StateFormLink {
  id: string;
  title: string;
  url: string;
}

export interface StatePack {
  code: string; // e.g., CA
  rulesSummaryUrl: string;
  judiciaryUrl: string;
  clerkDirectoryUrl?: string;
  forms: StateFormLink[];
  verifiedAt: string; // ISO
}

export const exampleCaliforniaPack: StatePack = {
  code: 'CA',
  rulesSummaryUrl: 'https://www.courts.ca.gov/rules',
  judiciaryUrl: 'https://www.courts.ca.gov',
  forms: [
    { id: 'FW-001', title: 'Request to Waive Court Fees', url: 'https://www.courts.ca.gov/documents/fw001.pdf' }
  ],
  verifiedAt: new Date().toISOString()
};

// Family resource loader (typed wrapper around JSON files)
export interface CountyFamilyResourcesJson {
  state: string;
  county: string;
  verification: { verifiedAt: string | null; sourceUrl: string };
  mediators: any[];
  parentingClasses: any[];
  galDirectory: any[];
}

export async function loadCaliforniaLosAngelesFamilyResources(): Promise<CountyFamilyResourcesJson> {
  return (await import('../states/ca/los-angeles/family.json')).default as CountyFamilyResourcesJson;
}

export interface CountyLawyersJson {
  state: string;
  county: string;
  verifiedAt: string | null;
  sources: Array<{ title: string; url: string }>;
  lawyers: any[];
}

export async function loadIowaPolkLawyers(): Promise<CountyLawyersJson> {
  return (await import('../states/ia/polk/lawyers.json')).default as CountyLawyersJson;
}

export async function loadOklahomaOklahomaLawyers(): Promise<CountyLawyersJson> {
  return (await import('../states/ok/oklahoma/lawyers.json')).default as CountyLawyersJson;
}



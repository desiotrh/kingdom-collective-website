export interface UserConsent {
  id: string;
  userId?: string; // Optional for anonymous users
  timestamp: string;
  version: string;
  consentItems: ConsentItem[];
  dataDeletionRequested: boolean;
  dataDeletionRequestedAt?: string;
  lastUpdated: string;
}

export interface ConsentItem {
  id: string;
  title: string;
  description: string;
  required: boolean;
  consented: boolean;
  category: 'essential' | 'functional' | 'analytics' | 'marketing';
  legalBasis: 'consent' | 'legitimate_interest' | 'contract' | 'legal_obligation';
}

export interface UserSettings {
  id: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
  
  // Privacy settings
  privacy: {
    shareAnalytics: boolean;
    shareUsageData: boolean;
    allowNotifications: boolean;
    allowLocationAccess: boolean;
    dataRetentionPeriod: '30_days' | '90_days' | '1_year' | 'indefinite';
  };
  
  // App preferences
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    fontSize: 'small' | 'medium' | 'large' | 'extra_large';
    highContrast: boolean;
    dyslexiaFriendly: boolean;
    language: string;
    timezone: string;
  };
  
  // Legal disclaimers
  disclaimers: {
    legalAdviceAcknowledged: boolean;
    attorneyRelationshipAcknowledged: boolean;
    courtProceduresAcknowledged: boolean;
    lastAcknowledged: string;
  };
  
  // Data management
  dataManagement: {
    autoBackup: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly' | 'never';
    cloudSync: boolean;
    localEncryption: boolean;
    dataRetentionEnabled: boolean;
  };
}

export interface ConsentTemplate {
  version: string;
  effectiveDate: string;
  items: Omit<ConsentItem, 'consented'>[];
  legalText: string;
  privacyPolicyUrl: string;
  termsOfServiceUrl: string;
}

export interface DataDeletionRequest {
  id: string;
  userId?: string;
  requestedAt: string;
  reason?: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  completedAt?: string;
  dataTypes: string[];
  confirmationSent: boolean;
}

export interface ConsentManager {
  // Consent management
  requestConsent(template: ConsentTemplate): Promise<UserConsent>;
  updateConsent(consentId: string, updates: Partial<UserConsent>): Promise<UserConsent>;
  revokeConsent(consentId: string, itemIds?: string[]): Promise<UserConsent>;
  
  // Settings management
  getUserSettings(userId?: string): Promise<UserSettings | null>;
  updateUserSettings(userId: string, updates: Partial<UserSettings>): Promise<UserSettings>;
  resetUserSettings(userId: string): Promise<UserSettings>;
  
  // Data deletion
  requestDataDeletion(userId: string, reason?: string): Promise<DataDeletionRequest>;
  processDataDeletion(requestId: string): Promise<boolean>;
  cancelDataDeletion(requestId: string): Promise<boolean>;
  
  // Compliance
  generateConsentReport(userId: string): Promise<any>;
  checkCompliance(userId: string): Promise<ComplianceStatus>;
}

export interface ComplianceStatus {
  isCompliant: boolean;
  issues: ComplianceIssue[];
  lastChecked: string;
  nextReviewDate: string;
}

export interface ComplianceIssue {
  type: 'missing_consent' | 'expired_consent' | 'incomplete_consent' | 'data_retention' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendation: string;
  deadline?: string;
}

// Default consent template
export const DEFAULT_CONSENT_TEMPLATE: ConsentTemplate = {
  version: '1.0',
  effectiveDate: '2024-01-01',
  items: [
    {
      id: 'essential_functionality',
      title: 'Essential App Functionality',
      description: 'Required for basic app operation including case management and document storage',
      required: true,
      category: 'essential',
      legalBasis: 'contract'
    },
    {
      id: 'local_storage',
      title: 'Local Data Storage',
      description: 'Store your case information and documents locally on your device',
      required: true,
      category: 'essential',
      legalBasis: 'contract'
    },
    {
      id: 'notifications',
      title: 'Push Notifications',
      description: 'Receive reminders about case deadlines and important events',
      required: false,
      category: 'functional',
      legalBasis: 'consent'
    },
    {
      id: 'usage_analytics',
      title: 'Usage Analytics',
      description: 'Help improve the app by sharing anonymous usage data',
      required: false,
      category: 'analytics',
      legalBasis: 'consent'
    },
    {
      id: 'legal_disclaimers',
      title: 'Legal Disclaimers',
      description: 'Acknowledge that this app provides information, not legal advice',
      required: true,
      category: 'essential',
      legalBasis: 'legal_obligation'
    }
  ],
  legalText: 'By using Kingdom Stand, you acknowledge that this application provides legal information and tools, not legal advice. You understand that you should consult with a licensed attorney for legal advice specific to your situation.',
  privacyPolicyUrl: '/privacy-policy',
  termsOfServiceUrl: '/terms-of-service'
};

// Default user settings
export const DEFAULT_USER_SETTINGS: Omit<UserSettings, 'id' | 'createdAt' | 'updatedAt'> = {
  privacy: {
    shareAnalytics: false,
    shareUsageData: false,
    allowNotifications: true,
    allowLocationAccess: false,
    dataRetentionPeriod: '1_year'
  },
  preferences: {
    theme: 'auto',
    fontSize: 'medium',
    highContrast: false,
    dyslexiaFriendly: false,
    language: 'en',
    timezone: 'UTC'
  },
  disclaimers: {
    legalAdviceAcknowledged: false,
    attorneyRelationshipAcknowledged: false,
    courtProceduresAcknowledged: false,
    lastAcknowledged: ''
  },
  dataManagement: {
    autoBackup: true,
    backupFrequency: 'weekly',
    cloudSync: false,
    localEncryption: true,
    dataRetentionEnabled: true
  }
};

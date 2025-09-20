// E-Filing System Type Definitions

export interface EFilePortal {
  id: string;
  state: string;
  stateName: string;
  portalName: string;
  url: string;
  registrationUrl: string;
  supportPhone: string;
  supportEmail: string;
  supportHours: string;
  status: 'active' | 'maintenance' | 'beta' | 'paper-only';
  lastUpdated: string;
  features: EFileFeature[];
  requirements: RegistrationRequirement[];
  documentTypes: CourtDocumentType[];
  fees: EFileFeeStructure;
  restrictions: string[];
  notes: string;
}

export interface EFileFeature {
  name: string;
  available: boolean;
  description: string;
  limitations?: string[];
}

export interface RegistrationRequirement {
  type: 'document' | 'verification' | 'payment' | 'training';
  name: string;
  description: string;
  required: boolean;
  cost?: number;
  processingTime?: string;
  notes?: string;
}

export interface CourtDocumentType {
  id: string;
  name: string;
  code: string;
  category: string;
  subcategory?: string;
  requiredFields: DocumentField[];
  optionalFields: DocumentField[];
  attachments: AttachmentRequirement[];
  fees: number;
  processingTime: string;
  restrictions?: string[];
  examples: DocumentExample[];
}

export interface DocumentField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'file';
  required: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  options?: string[];
  helpText: string;
  validation: ValidationRule[];
}

export interface AttachmentRequirement {
  type: string;
  required: boolean;
  maxSize: string;
  formats: string[];
  description: string;
}

export interface DocumentExample {
  name: string;
  description: string;
  url: string;
  preview?: string;
}

export interface EFileFeeStructure {
  baseFilingFee: number;
  additionalFees: AdditionalFee[];
  paymentMethods: string[];
  feeWaiverAvailable: boolean;
  feeWaiverRequirements?: string[];
}

export interface AdditionalFee {
  name: string;
  amount: number;
  description: string;
  whenRequired: string;
}

export interface ValidationRule {
  type: 'required' | 'format' | 'length' | 'pattern' | 'custom';
  message: string;
  condition?: string;
}

export interface DocumentMapping {
  ourCategory: string;
  ourSubcategory?: string;
  courtCategory: string;
  courtCode: string;
  courtName: string;
  description: string;
  requiredFields: FieldMapping[];
  validationRules: ValidationRule[];
  examples: DocumentExample[];
  tips: string[];
  commonErrors: string[];
}

export interface FieldMapping {
  ourField: string;
  courtField: string;
  transformation?: string;
  validation: ValidationRule[];
  helpText: string;
}

export interface RegistrationGuide {
  state: string;
  portal: EFilePortal;
  steps: RegistrationStep[];
  requirements: RegistrationRequirement[];
  commonIssues: CommonIssue[];
  supportContacts: Contact[];
  estimatedTime: string;
  cost: number;
}

export interface RegistrationStep {
  order: number;
  title: string;
  description: string;
  instructions: string[];
  screenshot?: string;
  tips: string[];
  warnings?: string[];
}

export interface CommonIssue {
  problem: string;
  solution: string;
  prevention: string;
  supportContact?: Contact;
}

export interface Contact {
  name: string;
  role: string;
  phone: string;
  email: string;
  hours: string;
  notes?: string;
}

export interface FilingAssistant {
  documentType: CourtDocumentType;
  userData: Record<string, any>;
  validation: ValidationResult[];
  suggestions: FilingSuggestion[];
  warnings: FilingWarning[];
  nextSteps: string[];
}

export interface ValidationResult {
  field: string;
  valid: boolean;
  message: string;
  severity: 'error' | 'warning' | 'info';
  suggestion?: string;
}

export interface FilingSuggestion {
  type: 'field' | 'attachment' | 'fee' | 'timing';
  message: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
}

export interface FilingWarning {
  message: string;
  impact: string;
  recommendation: string;
}

export interface EFileStatus {
  documentId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'processing';
  submittedAt: string;
  processedAt?: string;
  courtCaseNumber?: string;
  fees: number;
  nextSteps: string[];
  errors?: string[];
  warnings?: string[];
}


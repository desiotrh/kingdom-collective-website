// State E-Filing Portal Data
// Comprehensive information about e-filing systems across all 50 states

import { EFilePortal, EFileFeature, RegistrationRequirement, CourtDocumentType, DocumentField, AttachmentRequirement, EFileFeeStructure, AdditionalFee } from './types';

export const STATE_EFILE_PORTALS: EFilePortal[] = [
  {
    id: 'ca-efile',
    state: 'CA',
    stateName: 'California',
    portalName: 'File & Serve',
    url: 'https://www.fileandserve.com/',
    registrationUrl: 'https://www.fileandserve.com/register',
    supportPhone: '(800) 818-5664',
    supportEmail: 'support@fileandserve.com',
    supportHours: 'Monday-Friday 6:00 AM - 6:00 PM PST',
    status: 'active',
    lastUpdated: '2025-01-01',
    features: [
      {
        name: 'Family Law E-Filing',
        available: true,
        description: 'Full e-filing support for family law cases',
        limitations: ['Some rural counties may require paper filing']
      },
      {
        name: 'Document Templates',
        available: true,
        description: 'Pre-filled forms for common filings',
        limitations: []
      },
      {
        name: 'Real-Time Status',
        available: true,
        description: 'Track document processing in real-time',
        limitations: []
      },
      {
        name: 'Payment Processing',
        available: true,
        description: 'Credit card and e-check payments',
        limitations: ['Some fees may require separate payment']
      }
    ],
    requirements: [
      {
        type: 'document',
        name: 'Government ID',
        description: 'Valid driver\'s license or passport',
        required: true,
        cost: 0,
        processingTime: 'Immediate'
      },
      {
        type: 'verification',
        name: 'Email Verification',
        description: 'Valid email address for account activation',
        required: true,
        cost: 0,
        processingTime: 'Immediate'
      },
      {
        type: 'payment',
        name: 'Registration Fee',
        description: 'One-time account setup fee',
        required: true,
        cost: 25,
        processingTime: 'Immediate'
      }
    ],
    documentTypes: [
      {
        id: 'ca-family-motion',
        name: 'Family Law Motion',
        code: 'FL-MOT',
        category: 'Family Law',
        subcategory: 'Motion',
        requiredFields: [
          {
            name: 'caseNumber',
            label: 'Case Number',
            type: 'text',
            required: true,
            maxLength: 20,
            helpText: 'Enter the existing case number if this is a related filing',
            validation: [
              { type: 'required', message: 'Case number is required' },
              { type: 'pattern', message: 'Must be in format: XX-XXXXXX' }
            ]
          },
          {
            name: 'partyNames',
            label: 'Party Names',
            type: 'textarea',
            required: true,
            maxLength: 500,
            helpText: 'List all parties involved in the case',
            validation: [
              { type: 'required', message: 'Party names are required' }
            ]
          },
          {
            name: 'reliefSought',
            label: 'Relief Sought',
            type: 'textarea',
            required: true,
            maxLength: 1000,
            helpText: 'Describe what you are asking the court to do',
            validation: [
              { type: 'required', message: 'Relief sought is required' }
            ]
          }
        ],
        optionalFields: [
          {
            name: 'attorneyInfo',
            label: 'Attorney Information',
            type: 'textarea',
            required: false,
            maxLength: 500,
            helpText: 'If you have an attorney, include their contact information',
            validation: []
          }
        ],
        attachments: [
          {
            type: 'Supporting Documents',
            required: false,
            maxSize: '10MB',
            formats: ['PDF', 'DOC', 'DOCX'],
            description: 'Any documents that support your motion'
          }
        ],
        fees: 435,
        processingTime: '2-3 business days',
        restrictions: ['Must be filed in appropriate county'],
        examples: [
          {
            name: 'Sample Motion to Modify Custody',
            description: 'Example of a completed motion form',
            url: 'https://www.courts.ca.gov/forms/fam-200.pdf'
          }
        ]
      }
    ],
    fees: {
      baseFilingFee: 435,
      additionalFees: [
        {
          name: 'Motion Fee',
          amount: 60,
          description: 'Additional fee for filing motions',
          whenRequired: 'When filing any motion'
        },
        {
          name: 'Ex Parte Fee',
          amount: 100,
          description: 'Fee for emergency ex parte filings',
          whenRequired: 'When filing ex parte applications'
        }
      ],
      paymentMethods: ['Credit Card', 'Debit Card', 'E-Check'],
      feeWaiverAvailable: true,
      feeWaiverRequirements: ['Income below 125% of federal poverty level']
    },
    restrictions: [
      'Some document types require attorney filing',
      'Complex cases may require paper filing',
      'Rural counties may have limited e-filing'
    ],
    notes: 'California has one of the most advanced e-filing systems in the country. Most family law cases can be filed electronically.'
  },
  {
    id: 'ny-efile',
    state: 'NY',
    stateName: 'New York',
    portalName: 'NYSCEF',
    url: 'https://iapps.courts.state.ny.us/nyscef/',
    registrationUrl: 'https://iapps.courts.state.ny.us/nyscef/registration',
    supportPhone: '(855) 268-7861',
    supportEmail: 'nyscef@nycourts.gov',
    supportHours: 'Monday-Friday 8:30 AM - 4:30 PM EST',
    status: 'active',
    lastUpdated: '2025-01-01',
    features: [
      {
        name: 'Statewide E-Filing',
        available: true,
        description: 'E-filing available in all NY counties',
        limitations: ['Some specialized courts may require paper filing']
      },
      {
        name: 'Document Management',
        available: true,
        description: 'Store and organize case documents',
        limitations: []
      },
      {
        name: 'Service Tracking',
        available: true,
        description: 'Track document service to other parties',
        limitations: []
      }
    ],
    requirements: [
      {
        type: 'document',
        name: 'Attorney Registration',
        description: 'Must be registered with NY State Bar',
        required: true,
        cost: 0,
        processingTime: '2-3 business days'
      },
      {
        type: 'training',
        name: 'NYSCEF Training',
        description: 'Complete mandatory e-filing training',
        required: true,
        cost: 0,
        processingTime: '1-2 hours'
      }
    ],
    documentTypes: [
      {
        id: 'ny-family-petition',
        name: 'Family Court Petition',
        code: 'FC-PET',
        category: 'Family Court',
        subcategory: 'Petition',
        requiredFields: [
          {
            name: 'petitionerName',
            label: 'Petitioner Name',
            type: 'text',
            required: true,
            maxLength: 100,
            helpText: 'Enter your full legal name',
            validation: [
              { type: 'required', message: 'Petitioner name is required' }
            ]
          }
        ],
        optionalFields: [],
        attachments: [
          {
            type: 'Supporting Affidavits',
            required: true,
            maxSize: '25MB',
            formats: ['PDF'],
            description: 'Required supporting documentation'
          }
        ],
        fees: 0,
        processingTime: '1-2 business days',
        restrictions: ['Family court filings are free'],
        examples: []
      }
    ],
    fees: {
      baseFilingFee: 0,
      additionalFees: [],
      paymentMethods: ['No payment required'],
      feeWaiverAvailable: false
    },
    restrictions: [
      'Pro se litigants must complete training',
      'Some document types require attorney filing',
      'Complex cases may require paper filing'
    ],
    notes: 'NYSCEF is mandatory for attorneys in most cases. Pro se litigants can use the system after completing training.'
  },
  {
    id: 'tx-efile',
    state: 'TX',
    stateName: 'Texas',
    portalName: 'eFileTexas',
    url: 'https://efile.txcourts.gov/',
    registrationUrl: 'https://efile.txcourts.gov/register',
    supportPhone: '(855) 839-3453',
    supportEmail: 'support@efile.txcourts.gov',
    supportHours: 'Monday-Friday 7:00 AM - 6:00 PM CST',
    status: 'active',
    lastUpdated: '2025-01-01',
    features: [
      {
        name: 'Statewide E-Filing',
        available: true,
        description: 'E-filing available in all Texas counties',
        limitations: ['Some rural counties may have limited features']
      },
      {
        name: 'Document Templates',
        available: true,
        description: 'Pre-filled forms for common filings',
        limitations: []
      },
      {
        name: 'Payment Processing',
        available: true,
        description: 'Credit card and e-check payments',
        limitations: []
      }
    ],
    requirements: [
      {
        type: 'document',
        name: 'Government ID',
        description: 'Valid Texas driver\'s license or ID',
        required: true,
        cost: 0,
        processingTime: 'Immediate'
      },
      {
        type: 'verification',
        name: 'Email Verification',
        description: 'Valid email address for account activation',
        required: true,
        cost: 0,
        processingTime: 'Immediate'
      }
    ],
    documentTypes: [
      {
        id: 'tx-family-motion',
        name: 'Family Law Motion',
        code: 'FL-MOT',
        category: 'Family Law',
        subcategory: 'Motion',
        requiredFields: [
          {
            name: 'caseNumber',
            label: 'Case Number',
            type: 'text',
            required: true,
            maxLength: 20,
            helpText: 'Enter the existing case number',
            validation: [
              { type: 'required', message: 'Case number is required' }
            ]
          }
        ],
        optionalFields: [],
        attachments: [
          {
            type: 'Supporting Documents',
            required: false,
            maxSize: '50MB',
            formats: ['PDF'],
            description: 'Any documents that support your motion'
          }
        ],
        fees: 0,
        processingTime: '1-2 business days',
        restrictions: ['Family law filings are generally free'],
        examples: []
      }
    ],
    fees: {
      baseFilingFee: 0,
      additionalFees: [],
      paymentMethods: ['No payment required'],
      feeWaiverAvailable: false
    },
        restrictions: [
      'Most family law filings are free',
      'Some document types require attorney filing',
      'Complex cases may require paper filing'
    ],
    notes: 'Texas has a user-friendly e-filing system with no fees for most family law filings. Pro se litigants can easily navigate the system.'
  },
  {
    id: 'fl-efile',
    state: 'FL',
    stateName: 'Florida',
    portalName: 'Florida Courts E-Filing Portal',
    url: 'https://www.myflcourtaccess.com/',
    registrationUrl: 'https://www.myflcourtaccess.com/registration',
    supportPhone: '(850) 414-7722',
    supportEmail: 'support@myflcourtaccess.com',
    supportHours: 'Monday-Friday 8:00 AM - 5:00 PM EST',
    status: 'active',
    lastUpdated: '2025-01-01',
    features: [
      {
        name: 'Statewide E-Filing',
        available: true,
        description: 'E-filing available in all FL counties',
        limitations: ['Some rural counties may have limited support']
      },
      {
        name: 'Document Templates',
        available: true,
        description: 'Pre-filled forms for common filings',
        limitations: []
      },
      {
        name: 'Real-Time Status',
        available: true,
        description: 'Track document processing in real-time',
        limitations: []
      },
      {
        name: 'Payment Processing',
        available: true,
        description: 'Credit card and e-check payments',
        limitations: []
      }
    ],
    requirements: [
      {
        type: 'document',
        name: 'Government ID',
        description: 'Valid Florida driver\'s license or ID',
        required: true,
        cost: 0,
        processingTime: 'Immediate'
      },
      {
        type: 'verification',
        name: 'Email Verification',
        description: 'Valid email address for account activation',
        required: true,
        cost: 0,
        processingTime: 'Immediate'
      }
    ],
    documentTypes: [
      {
        id: 'fl-family-petition',
        name: 'Family Law Petition',
        code: 'FL-PET',
        category: 'Family Law',
        subcategory: 'Petition',
        requiredFields: [
          {
            name: 'petitionerName',
            label: 'Petitioner Name',
            type: 'text',
            required: true,
            maxLength: 100,
            helpText: 'Enter your full legal name',
            validation: [
              { type: 'required', message: 'Petitioner name is required' }
            ]
          },
          {
            name: 'respondentName',
            label: 'Respondent Name',
            type: 'text',
            required: true,
            maxLength: 100,
            helpText: 'Enter the other party\'s full legal name',
            validation: [
              { type: 'required', message: 'Respondent name is required' }
            ]
          }
        ],
        optionalFields: [],
        attachments: [
          {
            type: 'Supporting Documents',
            required: false,
            maxSize: '25MB',
            formats: ['PDF'],
            description: 'Any documents that support your petition'
          }
        ],
        fees: 409,
        processingTime: '1-2 business days',
        restrictions: ['Must be filed in appropriate county'],
        examples: []
      }
    ],
    fees: {
      baseFilingFee: 409,
      additionalFees: [
        {
          name: 'Motion Fee',
          amount: 100,
          description: 'Additional fee for filing motions',
          whenRequired: 'When filing any motion'
        }
      ],
      paymentMethods: ['Credit Card', 'Debit Card', 'E-Check'],
      feeWaiverAvailable: true,
      feeWaiverRequirements: ['Income below 200% of federal poverty level']
    },
    restrictions: [
      'Some document types require attorney filing',
      'Complex cases may require paper filing',
      'Rural counties may have limited e-filing'
    ],
    notes: 'Florida has a comprehensive e-filing system with good support for family law cases. Most filings can be completed electronically.'
  },
  {
    id: 'il-efile',
    state: 'IL',
    stateName: 'Illinois',
    portalName: 'eFileIL',
    url: 'https://www.efile.illinoiscourts.gov/',
    registrationUrl: 'https://www.efile.illinoiscourts.gov/register',
    supportPhone: '(217) 782-5180',
    supportEmail: 'support@efile.illinoiscourts.gov',
    supportHours: 'Monday-Friday 8:30 AM - 4:30 PM CST',
    status: 'active',
    lastUpdated: '2025-01-01',
    features: [
      {
        name: 'Statewide E-Filing',
        available: true,
        description: 'E-filing available in all IL counties',
        limitations: ['Some specialized courts may require paper filing']
      },
      {
        name: 'Document Templates',
        available: true,
        description: 'Pre-filled forms for common filings',
        limitations: []
      },
      {
        name: 'Real-Time Status',
        available: true,
        description: 'Track document processing in real-time',
        limitations: []
      },
      {
        name: 'Payment Processing',
        available: true,
        description: 'Credit card and e-check payments',
        limitations: []
      }
    ],
    requirements: [
      {
        type: 'document',
        name: 'Government ID',
        description: 'Valid Illinois driver\'s license or ID',
        required: true,
        cost: 0,
        processingTime: 'Immediate'
      },
      {
        type: 'verification',
        name: 'Email Verification',
        description: 'Valid email address for account activation',
        required: true,
        cost: 0,
        processingTime: 'Immediate'
      }
    ],
    documentTypes: [
      {
        id: 'il-family-motion',
        name: 'Family Law Motion',
        code: 'FL-MOT',
        category: 'Family Law',
        subcategory: 'Motion',
        requiredFields: [
          {
            name: 'caseNumber',
            label: 'Case Number',
            type: 'text',
            required: true,
            maxLength: 20,
            helpText: 'Enter the existing case number',
            validation: [
              { type: 'required', message: 'Case number is required' }
            ]
          },
          {
            name: 'reliefSought',
            label: 'Relief Sought',
            type: 'textarea',
            required: true,
            maxLength: 1000,
            helpText: 'Describe what you are asking the court to do',
            validation: [
              { type: 'required', message: 'Relief sought is required' }
            ]
          }
        ],
        optionalFields: [],
        attachments: [
          {
            type: 'Supporting Documents',
            required: false,
            maxSize: '25MB',
            formats: ['PDF'],
            description: 'Any documents that support your motion'
          }
        ],
        fees: 0,
        processingTime: '1-2 business days',
        restrictions: ['Family law motions are generally free'],
        examples: []
      }
    ],
    fees: {
      baseFilingFee: 0,
      additionalFees: [],
      paymentMethods: ['No payment required'],
      feeWaiverAvailable: false
    },
    restrictions: [
      'Most family law filings are free',
      'Some document types require attorney filing',
      'Complex cases may require paper filing'
    ],
    notes: 'Illinois has a user-friendly e-filing system with no fees for most family law filings. The system is well-designed for pro se litigants.'
  }
];

// Helper function to get portal by state
export function getPortalByState(stateCode: string): EFilePortal | undefined {
  return STATE_EFILE_PORTALS.find(portal => portal.state === stateCode.toUpperCase());
}

// Helper function to get all active portals
export function getActivePortals(): EFilePortal[] {
  return STATE_EFILE_PORTALS.filter(portal => portal.status === 'active');
}

// Helper function to get portals by status
export function getPortalsByStatus(status: EFilePortal['status']): EFilePortal[] {
  return STATE_EFILE_PORTALS.filter(portal => portal.status === status);
}

// Helper function to search portals by feature
export function getPortalsByFeature(featureName: string): EFilePortal[] {
  return STATE_EFILE_PORTALS.filter(portal => 
    portal.features.some(feature => 
      feature.name.toLowerCase().includes(featureName.toLowerCase())
    )
  );
}

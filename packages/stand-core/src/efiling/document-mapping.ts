// Document Mapping System
// Maps Kingdom Stand document categories to court filing categories

import { DocumentMapping, FieldMapping, ValidationRule, DocumentExample } from './types';

export const DOCUMENT_MAPPINGS: DocumentMapping[] = [
  // Family Law - Custody & Visitation
  {
    ourCategory: 'Family Law',
    ourSubcategory: 'Custody & Visitation',
    courtCategory: 'Family Law',
    courtCode: 'FL-CUST',
    courtName: 'Family Law - Custody & Visitation',
    description: 'Documents related to child custody, visitation schedules, and parenting plans',
    requiredFields: [
      {
        ourField: 'childName',
        courtField: 'Minor Child Full Legal Name',
        transformation: 'Ensure full legal name is used',
        validation: [
          { type: 'required', message: 'Child\'s full legal name is required' },
          { type: 'format', message: 'Use format: First Middle Last' }
        ],
        helpText: 'Enter the child\'s full legal name as it appears on birth certificate'
      },
      {
        ourField: 'custodyType',
        courtField: 'Type of Custody Requested',
        transformation: 'Map to court terminology',
        validation: [
          { type: 'required', message: 'Custody type must be specified' }
        ],
        helpText: 'Select: Sole Custody, Joint Custody, or Shared Custody'
      },
      {
        ourField: 'currentArrangement',
        courtField: 'Current Custody Arrangement',
        transformation: 'Describe current situation',
        validation: [
          { type: 'required', message: 'Current arrangement must be described' }
        ],
        helpText: 'Describe how custody is currently arranged between parents'
      }
    ],
    validationRules: [
      { type: 'required', message: 'All required fields must be completed' },
      { type: 'format', message: 'Dates must be in MM/DD/YYYY format' },
      { type: 'custom', message: 'Custody arrangements must be in child\'s best interest' }
    ],
    examples: [
      {
        name: 'Motion to Modify Custody',
        description: 'Request to change existing custody arrangement',
        url: 'https://www.courts.ca.gov/forms/fam-200.pdf'
      },
      {
        name: 'Parenting Plan Template',
        description: 'Detailed schedule for custody and visitation',
        url: 'https://www.courts.ca.gov/forms/fam-200.pdf'
      }
    ],
    tips: [
      'Focus on the child\'s best interests, not parental preferences',
      'Include specific details about current and proposed arrangements',
      'Attach any relevant court orders or agreements',
      'Consider mediation before filing if possible'
    ],
    commonErrors: [
      'Not specifying the type of custody requested',
      'Failing to describe current arrangement',
      'Missing required attachments',
      'Incomplete party information'
    ]
  },

  // Family Law - Child Support
  {
    ourCategory: 'Family Law',
    ourSubcategory: 'Child Support',
    courtCategory: 'Family Law',
    courtCode: 'FL-SUPP',
    courtName: 'Family Law - Child Support',
    description: 'Documents related to child support calculations, modifications, and enforcement',
    requiredFields: [
      {
        ourField: 'incomeInformation',
        courtField: 'Income and Financial Information',
        transformation: 'Include all sources of income',
        validation: [
          { type: 'required', message: 'Complete income information is required' },
          { type: 'format', message: 'Use monthly amounts' }
        ],
        helpText: 'Include wages, bonuses, self-employment, investments, and other income'
      },
      {
        ourField: 'expenses',
        courtField: 'Child-Related Expenses',
        transformation: 'List all child-related costs',
        validation: [
          { type: 'required', message: 'Child expenses must be documented' }
        ],
        helpText: 'Include childcare, education, medical, and other child-related costs'
      },
      {
        ourField: 'supportAmount',
        courtField: 'Requested Support Amount',
        transformation: 'Calculate based on state guidelines',
        validation: [
          { type: 'required', message: 'Support amount must be specified' },
          { type: 'format', message: 'Use dollar amount format' }
        ],
        helpText: 'Calculate using state child support guidelines or explain deviation'
      }
    ],
    validationRules: [
      { type: 'required', message: 'Financial information must be complete and accurate' },
      { type: 'format', message: 'All amounts must be in dollars and cents' },
      { type: 'custom', message: 'Support amount must be reasonable and justified' }
    ],
    examples: [
      {
        name: 'Motion to Modify Child Support',
        description: 'Request to change existing child support order',
        url: 'https://www.courts.ca.gov/forms/fam-200.pdf'
      },
      {
        name: 'Income and Expense Declaration',
        description: 'Detailed financial information for support calculation',
        url: 'https://www.courts.ca.gov/forms/fam-200.pdf'
      }
    ],
    tips: [
      'Use state child support calculators when available',
      'Include all sources of income, not just wages',
      'Document child-related expenses thoroughly',
      'Consider tax implications of support payments'
    ],
    commonErrors: [
      'Incomplete income information',
      'Missing child-related expenses',
      'Incorrect support calculations',
      'Failure to attach financial documents'
    ]
  },

  // Family Law - Divorce
  {
    ourCategory: 'Family Law',
    ourSubcategory: 'Divorce',
    courtCategory: 'Family Law',
    courtCode: 'FL-DIV',
    courtName: 'Family Law - Divorce',
    description: 'Documents related to divorce proceedings, property division, and spousal support',
    requiredFields: [
      {
        ourField: 'marriageDate',
        courtField: 'Date of Marriage',
        transformation: 'Use MM/DD/YYYY format',
        validation: [
          { type: 'required', message: 'Marriage date is required' },
          { type: 'format', message: 'Use MM/DD/YYYY format' }
        ],
        helpText: 'Enter the exact date of marriage from marriage certificate'
      },
      {
        ourField: 'separationDate',
        courtField: 'Date of Separation',
        transformation: 'Use MM/DD/YYYY format',
        validation: [
          { type: 'required', message: 'Separation date is required' },
          { type: 'format', message: 'Use MM/DD/YYYY format' }
        ],
        helpText: 'Enter the date when you and spouse began living separately'
      },
      {
        ourField: 'grounds',
        courtField: 'Grounds for Divorce',
        transformation: 'Select from court-approved grounds',
        validation: [
          { type: 'required', message: 'Grounds for divorce must be specified' }
        ],
        helpText: 'Select: Irreconcilable differences, Adultery, Abandonment, etc.'
      }
    ],
    validationRules: [
      { type: 'required', message: 'All required information must be provided' },
      { type: 'format', message: 'Dates must be accurate and verifiable' },
      { type: 'custom', message: 'Grounds must be legally recognized in your state' }
    ],
    examples: [
      {
        name: 'Petition for Divorce',
        description: 'Initial filing to start divorce proceedings',
        url: 'https://www.courts.ca.gov/forms/fam-200.pdf'
      },
      {
        name: 'Marital Settlement Agreement',
        description: 'Agreement on property division and support',
        url: 'https://www.courts.ca.gov/forms/fam-200.pdf'
      }
    ],
    tips: [
      'Ensure all dates are accurate and verifiable',
      'Include complete information about children if any',
      'List all marital property and debts',
      'Consider mediation for uncontested divorces'
    ],
    commonErrors: [
      'Incorrect marriage or separation dates',
      'Missing information about children',
      'Incomplete property and debt information',
      'Failure to serve spouse properly'
    ]
  },

  // Family Law - Domestic Violence
  {
    ourCategory: 'Family Law',
    ourSubcategory: 'Domestic Violence',
    courtCategory: 'Family Law',
    courtCode: 'FL-DV',
    courtName: 'Family Law - Domestic Violence',
    description: 'Documents related to domestic violence protection orders and restraining orders',
    requiredFields: [
      {
        ourField: 'incidentDetails',
        courtField: 'Description of Incidents',
        transformation: 'Provide specific, factual details',
        validation: [
          { type: 'required', message: 'Incident details are required' },
          { type: 'length', message: 'Include dates, times, and specific actions' }
        ],
        helpText: 'Describe each incident with specific dates, times, locations, and actions'
      },
      {
        ourField: 'fearDescription',
        courtField: 'Fear and Safety Concerns',
        transformation: 'Explain current safety concerns',
        validation: [
          { type: 'required', message: 'Safety concerns must be described' }
        ],
        helpText: 'Explain why you fear for your safety or the safety of others'
      },
      {
        ourField: 'requestedProtection',
        courtField: 'Protection Requested',
        transformation: 'Specify type of protection order',
        validation: [
          { type: 'required', message: 'Type of protection must be specified' }
        ],
        helpText: 'Select: Stay away order, No contact order, Move out order, etc.'
      }
    ],
    validationRules: [
      { type: 'required', message: 'All incidents must be described in detail' },
      { type: 'format', message: 'Use specific dates and times' },
      { type: 'custom', message: 'Safety concerns must be clearly explained' }
    ],
    examples: [
      {
        name: 'Request for Domestic Violence Restraining Order',
        description: 'Application for protection from domestic violence',
        url: 'https://www.courts.ca.gov/forms/fam-200.pdf'
      },
      {
        name: 'Declaration in Support of Request',
        description: 'Detailed statement supporting protection order request',
        url: 'https://www.courts.ca.gov/forms/fam-200.pdf'
      }
    ],
    tips: [
      'Include all incidents, even minor ones',
      'Be specific about dates, times, and locations',
      'Describe the impact on you and any children',
      'Attach any police reports or medical records'
    ],
    commonErrors: [
      'Vague incident descriptions',
      'Missing dates or times',
      'Failure to explain safety concerns',
      'Incomplete protection requests'
    ]
  }
];

// Helper function to get mapping by our category
export function getMappingByCategory(category: string, subcategory?: string): DocumentMapping[] {
  return DOCUMENT_MAPPINGS.filter(mapping => {
    if (subcategory) {
      return mapping.ourCategory === category && mapping.ourSubcategory === subcategory;
    }
    return mapping.ourCategory === category;
  });
}

// Helper function to get mapping by court category
export function getMappingByCourtCategory(courtCategory: string): DocumentMapping[] {
  return DOCUMENT_MAPPINGS.filter(mapping => 
    mapping.courtCategory.toLowerCase().includes(courtCategory.toLowerCase())
  );
}

// Helper function to get mapping by court code
export function getMappingByCourtCode(courtCode: string): DocumentMapping | undefined {
  return DOCUMENT_MAPPINGS.find(mapping => mapping.courtCode === courtCode);
}

// Helper function to search mappings by keyword
export function searchMappings(keyword: string): DocumentMapping[] {
  const searchTerm = keyword.toLowerCase();
  return DOCUMENT_MAPPINGS.filter(mapping => 
    mapping.ourCategory.toLowerCase().includes(searchTerm) ||
    mapping.ourSubcategory?.toLowerCase().includes(searchTerm) ||
    mapping.courtCategory.toLowerCase().includes(searchTerm) ||
    mapping.description.toLowerCase().includes(searchTerm)
  );
}

// Helper function to get all categories
export function getAllCategories(): string[] {
  return [...new Set(DOCUMENT_MAPPINGS.map(mapping => mapping.ourCategory))];
}

// Helper function to get subcategories for a category
export function getSubcategories(category: string): string[] {
  return [...new Set(
    DOCUMENT_MAPPINGS
      .filter(mapping => mapping.ourCategory === category)
      .map(mapping => mapping.ourSubcategory)
      .filter((subcategory): subcategory is string => subcategory !== undefined)
  )];
}

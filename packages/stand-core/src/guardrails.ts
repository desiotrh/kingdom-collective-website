export type RedFlagCategory = 'criminal' | 'immigration' | 'bankruptcy' | 'complex_family' | 'high_value' | 'federal_court' | 'appeal' | 'other';

export interface RedFlag {
  id: string;
  category: RedFlagCategory;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  detectedAt: string;
  context: any; // Additional context about when/why this was triggered
  
  // Guidance information
  guidance: {
    message: string;
    requiresAttorney: boolean;
    urgency: 'immediate' | 'within_24h' | 'within_week' | 'consult_soon';
    recommendations: string[];
    resources: ResourceLink[];
    disclaimer: string;
  };
  
  // User acknowledgment
  acknowledged: boolean;
  acknowledgedAt?: string;
  actionTaken?: 'consulted_attorney' | 'self_resolved' | 'deferred' | 'other';
  notes?: string;
}

export interface ResourceLink {
  title: string;
  url: string;
  description: string;
  type: 'legal_aid' | 'bar_association' | 'court_website' | 'government' | 'nonprofit' | 'other';
  verified: boolean;
}

export interface RedFlagRule {
  id: string;
  name: string;
  description: string;
  category: RedFlagCategory;
  severity: 'low' | 'medium' | 'high' | 'critical';
  
  // Trigger conditions
  conditions: RedFlagCondition[];
  
  // Guidance configuration
  guidance: Omit<RedFlag['guidance'], 'message'>;
  
  // Rule metadata
  enabled: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export interface RedFlagCondition {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in' | 'regex';
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

export interface RedFlagInterceptor {
  // Check if a red flag should be triggered
  checkRedFlags(context: any): Promise<RedFlag[]>;
  
  // Get guidance for a specific red flag
  getGuidance(redFlagId: string): Promise<RedFlag['guidance']>;
  
  // Acknowledge a red flag
  acknowledgeRedFlag(redFlagId: string, action?: string, notes?: string): Promise<void>;
  
  // Get all active red flags for a user/case
  getActiveRedFlags(caseId?: string): Promise<RedFlag[]>;
  
  // Get red flag statistics
  getRedFlagStats(): Promise<RedFlagStats>;
}

export interface RedFlagStats {
  totalDetected: number;
  totalAcknowledged: number;
  byCategory: Record<RedFlagCategory, number>;
  bySeverity: Record<RedFlag['severity'], number>;
  averageResolutionTime?: number; // in hours
}

// Predefined red flag rules
export const DEFAULT_RED_FLAG_RULES: RedFlagRule[] = [
  {
    id: 'criminal_matters',
    name: 'Criminal Law Matters',
    description: 'Detects when user is dealing with criminal law issues',
    category: 'criminal',
    severity: 'critical',
    conditions: [
      {
        field: 'caseType',
        operator: 'equals',
        value: 'criminal'
      }
    ],
    guidance: {
      requiresAttorney: true,
      urgency: 'immediate',
      recommendations: [
        'Consult with a criminal defense attorney immediately',
        'Do not discuss your case with law enforcement without an attorney present',
        'Document all interactions and preserve evidence',
        'Consider your right to remain silent'
      ],
      resources: [
        {
          title: 'National Association of Criminal Defense Lawyers',
          url: 'https://www.nacdl.org/',
          description: 'Professional association for criminal defense attorneys',
          type: 'bar_association',
          verified: true
        },
        {
          title: 'Find a Criminal Defense Attorney',
          url: 'https://www.avvo.com/find-a-lawyer/practice-area/criminal-defense',
          description: 'Directory of criminal defense attorneys',
          type: 'other',
          verified: true
        }
      ],
      disclaimer: 'Criminal matters require immediate legal representation. This app cannot provide legal advice for criminal cases.'
    },
    enabled: true,
    priority: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'immigration_matters',
    name: 'Immigration Law Matters',
    description: 'Detects when user is dealing with immigration issues',
    category: 'immigration',
    severity: 'high',
    conditions: [
      {
        field: 'caseType',
        operator: 'equals',
        value: 'immigration'
      }
    ],
    guidance: {
      requiresAttorney: true,
      urgency: 'within_24h',
      recommendations: [
        'Consult with an immigration attorney',
        'Immigration law is complex and constantly changing',
        'Document all deadlines and requirements carefully',
        'Consider consulting with multiple attorneys for complex cases'
      ],
      resources: [
        {
          title: 'American Immigration Lawyers Association',
          url: 'https://www.aila.org/',
          description: 'Professional association for immigration attorneys',
          type: 'bar_association',
          verified: true
        },
        {
          title: 'Immigration Legal Aid Directory',
          url: 'https://www.immigrationadvocates.org/',
          description: 'Directory of immigration legal aid organizations',
          type: 'legal_aid',
          verified: true
        }
      ],
      disclaimer: 'Immigration matters are complex and require specialized legal expertise. Consult with a qualified immigration attorney.'
    },
    enabled: true,
    priority: 2,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'bankruptcy_matters',
    name: 'Bankruptcy Law Matters',
    description: 'Detects when user is dealing with bankruptcy issues',
    category: 'bankruptcy',
    severity: 'high',
    conditions: [
      {
        field: 'caseType',
        operator: 'equals',
        value: 'bankruptcy'
      }
    ],
    guidance: {
      requiresAttorney: true,
      urgency: 'within_week',
      recommendations: [
        'Consult with a bankruptcy attorney',
        'Bankruptcy has long-term financial implications',
        'Consider alternatives to bankruptcy',
        'Document all debts and assets thoroughly'
      ],
      resources: [
        {
          title: 'American Bankruptcy Institute',
          url: 'https://www.abi.org/',
          description: 'Professional association for bankruptcy attorneys',
          type: 'bar_association',
          verified: true
        },
        {
          title: 'Bankruptcy Legal Aid',
          url: 'https://www.legal-aid.org/bankruptcy/',
          description: 'Legal aid resources for bankruptcy cases',
          type: 'legal_aid',
          verified: true
        }
      ],
      disclaimer: 'Bankruptcy has significant legal and financial consequences. Consult with a qualified bankruptcy attorney.'
    },
    enabled: true,
    priority: 3,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'high_value_cases',
    name: 'High Value Cases',
    description: 'Detects cases involving significant monetary amounts',
    category: 'high_value',
    severity: 'medium',
    conditions: [
      {
        field: 'caseValue',
        operator: 'greater_than',
        value: 10000
      }
    ],
    guidance: {
      requiresAttorney: true,
      urgency: 'consult_soon',
      recommendations: [
        'Consider consulting with an attorney for high-value cases',
        'Document all evidence and communications carefully',
        'Consider mediation or alternative dispute resolution',
        'Evaluate the cost-benefit of legal representation'
      ],
      resources: [
        {
          title: 'State Bar Association',
          url: 'https://www.americanbar.org/',
          description: 'Find qualified attorneys in your area',
          type: 'bar_association',
          verified: true
        }
      ],
      disclaimer: 'High-value cases may benefit from professional legal representation to protect your interests.'
    },
    enabled: true,
    priority: 4,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Red flag interceptor implementation
export class RedFlagInterceptorService implements RedFlagInterceptor {
  private static instance: RedFlagInterceptorService;
  private rules: RedFlagRule[] = DEFAULT_RED_FLAG_RULES;
  private detectedFlags: Map<string, RedFlag> = new Map();

  private constructor() {}

  static getInstance(): RedFlagInterceptorService {
    if (!RedFlagInterceptorService.instance) {
      RedFlagInterceptorService.instance = new RedFlagInterceptorService();
    }
    return RedFlagInterceptorService.instance;
  }

  async checkRedFlags(context: any): Promise<RedFlag[]> {
    const detectedFlags: RedFlag[] = [];

    for (const rule of this.rules) {
      if (!rule.enabled) continue;

      if (this.evaluateRule(rule, context)) {
        const redFlag: RedFlag = {
          id: this.generateId(),
          category: rule.category,
          severity: rule.severity,
          title: rule.name,
          description: rule.description,
          detectedAt: new Date().toISOString(),
          context,
          guidance: {
            message: this.generateGuidanceMessage(rule),
            ...rule.guidance
          },
          acknowledged: false
        };

        detectedFlags.push(redFlag);
        this.detectedFlags.set(redFlag.id, redFlag);
      }
    }

    return detectedFlags;
  }

  private evaluateRule(rule: RedFlagRule, context: any): boolean {
    if (!rule.conditions || rule.conditions.length === 0) return false;

    let result = this.evaluateCondition(rule.conditions[0], context);

    for (let i = 1; i < rule.conditions.length; i++) {
      const condition = rule.conditions[i];
      const conditionResult = this.evaluateCondition(condition, context);

      if (condition.logicalOperator === 'OR') {
        result = result || conditionResult;
      } else {
        result = result && conditionResult;
      }
    }

    return result;
  }

  private evaluateCondition(condition: RedFlagCondition, context: any): boolean {
    const fieldValue = this.getNestedValue(context, condition.field);
    
    switch (condition.operator) {
      case 'equals':
        return fieldValue === condition.value;
      case 'contains':
        return String(fieldValue).includes(String(condition.value));
      case 'greater_than':
        return Number(fieldValue) > Number(condition.value);
      case 'less_than':
        return Number(fieldValue) < Number(condition.value);
      case 'in':
        return Array.isArray(condition.value) && condition.value.includes(fieldValue);
      case 'not_in':
        return Array.isArray(condition.value) && !condition.value.includes(fieldValue);
      case 'regex':
        try {
          const regex = new RegExp(condition.value);
          return regex.test(String(fieldValue));
        } catch {
          return false;
        }
      default:
        return false;
    }
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private generateGuidanceMessage(rule: RedFlagRule): string {
    const urgencyMessages = {
      'immediate': 'This requires immediate attention.',
      'within_24h': 'This should be addressed within 24 hours.',
      'within_week': 'This should be addressed within a week.',
      'consult_soon': 'Consider consulting with an attorney soon.'
    };

    return `${rule.description} ${urgencyMessages[rule.guidance.urgency] || ''}`;
  }

  async getGuidance(redFlagId: string): Promise<RedFlag['guidance']> {
    const redFlag = this.detectedFlags.get(redFlagId);
    if (!redFlag) {
      throw new Error('Red flag not found');
    }
    return redFlag.guidance;
  }

  async acknowledgeRedFlag(redFlagId: string, action?: string, notes?: string): Promise<void> {
    const redFlag = this.detectedFlags.get(redFlagId);
    if (!redFlag) {
      throw new Error('Red flag not found');
    }

    redFlag.acknowledged = true;
    redFlag.acknowledgedAt = new Date().toISOString();
    if (action) redFlag.actionTaken = action as any;
    if (notes) redFlag.notes = notes;

    this.detectedFlags.set(redFlagId, redFlag);
  }

  async getActiveRedFlags(caseId?: string): Promise<RedFlag[]> {
    return Array.from(this.detectedFlags.values()).filter(flag => 
      !flag.acknowledged && (!caseId || flag.context.caseId === caseId)
    );
  }

  async getRedFlagStats(): Promise<RedFlagStats> {
    const flags = Array.from(this.detectedFlags.values());
    
    const byCategory: Record<RedFlagCategory, number> = {} as any;
    const bySeverity: Record<RedFlag['severity'], number> = {} as any;

    // Initialize counters
    ['criminal', 'immigration', 'bankruptcy', 'complex_family', 'high_value', 'federal_court', 'appeal', 'other'].forEach(cat => {
      byCategory[cat as RedFlagCategory] = 0;
    });
    ['low', 'medium', 'high', 'critical'].forEach(sev => {
      bySeverity[sev as RedFlag['severity']] = 0;
    });

    // Count flags
    flags.forEach(flag => {
      byCategory[flag.category]++;
      bySeverity[flag.severity]++;
    });

    return {
      totalDetected: flags.length,
      totalAcknowledged: flags.filter(f => f.acknowledged).length,
      byCategory,
      bySeverity
    };
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

// Export singleton instance
export const redFlagInterceptor = RedFlagInterceptorService.getInstance();

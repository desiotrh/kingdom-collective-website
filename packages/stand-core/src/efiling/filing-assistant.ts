// E-Filing Assistant
// Provides real-time guidance during the e-filing process

import { 
  FilingAssistant, 
  ValidationResult, 
  FilingSuggestion, 
  FilingWarning,
  CourtDocumentType,
  DocumentField,
  ValidationRule
} from './types';
import { getPortalByState } from './portals';
import { getMappingByCategory, getMappingByCourtCode } from './document-mapping';

export class EFilingAssistant {
  private userData: Record<string, any> = {};
  private currentState: string = '';
  private currentDocumentType: string = '';

  constructor(state: string, documentType: string) {
    this.currentState = state;
    this.currentDocumentType = documentType;
  }

  // Set user data for validation
  setUserData(data: Record<string, any>): void {
    this.userData = data;
  }

  // Get filing assistance for current document
  getFilingAssistance(): FilingAssistant {
    const portal = getPortalByState(this.currentState);
    const documentType = this.getDocumentType();
    
    if (!portal || !documentType) {
      throw new Error('Portal or document type not found');
    }

    const validation = this.validateDocument();
    const suggestions = this.generateSuggestions();
    const warnings = this.generateWarnings();
    const nextSteps = this.getNextSteps();

    return {
      documentType,
      userData: this.userData,
      validation,
      suggestions,
      warnings,
      nextSteps
    };
  }

  // Validate document against court requirements
  private validateDocument(): ValidationResult[] {
    const documentType = this.getDocumentType();
    if (!documentType) return [];

    const results: ValidationResult[] = [];

    // Validate required fields
    for (const field of documentType.requiredFields) {
      const value = this.userData[field.name];
      const isValid = this.validateField(field, value);
      
      results.push({
        field: field.name,
        valid: isValid,
        message: isValid ? 'Field is valid' : this.getValidationMessage(field, value),
        severity: isValid ? 'info' : 'error',
        suggestion: isValid ? undefined : this.getFieldSuggestion(field)
      });
    }

    // Validate optional fields if they have values
    for (const field of documentType.optionalFields) {
      const value = this.userData[field.name];
      if (value !== undefined && value !== '') {
        const isValid = this.validateField(field, value);
        
        results.push({
          field: field.name,
          valid: isValid,
          message: isValid ? 'Field is valid' : this.getValidationMessage(field, value),
          severity: isValid ? 'info' : 'warning',
          suggestion: isValid ? undefined : this.getFieldSuggestion(field)
        });
      }
    }

    return results;
  }

  // Validate individual field
  private validateField(field: DocumentField, value: any): boolean {
    if (field.required && (value === undefined || value === '' || value === null)) {
      return false;
    }

    if (value === undefined || value === '') {
      return true; // Optional field with no value
    }

    // Apply validation rules
    for (const rule of field.validation) {
      if (!this.validateRule(rule, value, field)) {
        return false;
      }
    }

    return true;
  }

  // Validate against specific rule
  private validateRule(rule: ValidationRule, value: any, field: DocumentField): boolean {
    switch (rule.type) {
      case 'required':
        return value !== undefined && value !== '' && value !== null;
      
      case 'format':
        if (field.type === 'date') {
          return this.isValidDate(value);
        }
        if (field.type === 'number') {
          return !isNaN(Number(value));
        }
        return true;
      
      case 'length':
        if (field.maxLength && typeof value === 'string') {
          return value.length <= field.maxLength;
        }
        if (field.minLength && typeof value === 'string') {
          return value.length >= field.minLength;
        }
        return true;
      
      case 'pattern':
        if (rule.condition && typeof value === 'string') {
          const regex = new RegExp(rule.condition);
          return regex.test(value);
        }
        return true;
      
      default:
        return true;
    }
  }

  // Check if value is valid date
  private isValidDate(value: any): boolean {
    if (typeof value === 'string') {
      const date = new Date(value);
      return !isNaN(date.getTime());
    }
    return value instanceof Date && !isNaN(value.getTime());
  }

  // Get validation message for field
  private getValidationMessage(field: DocumentField, value: any): string {
    if (field.required && (value === undefined || value === '' || value === null)) {
      return `${field.label} is required`;
    }

    for (const rule of field.validation) {
      if (!this.validateRule(rule, value, field)) {
        return rule.message;
      }
    }

    return 'Field is valid';
  }

  // Get suggestion for field
  private getFieldSuggestion(field: DocumentField): string {
    return field.helpText;
  }

  // Generate filing suggestions
  private generateSuggestions(): FilingSuggestion[] {
    const suggestions: FilingSuggestion[] = [];
    const documentType = this.getDocumentType();
    
    if (!documentType) return suggestions;

    // Check for missing attachments
    const requiredAttachments = documentType.attachments.filter(att => att.required);
    for (const attachment of requiredAttachments) {
      if (!this.userData[`attachment_${attachment.type}`]) {
        suggestions.push({
          type: 'attachment',
          message: `Required attachment missing: ${attachment.type}`,
          action: `Upload ${attachment.type} (${attachment.maxSize}, formats: ${attachment.formats.join(', ')})`,
          priority: 'high'
        });
      }
    }

    // Check for common improvements
    if (this.userData.incidentDetails && this.userData.incidentDetails.length < 100) {
      suggestions.push({
        type: 'field',
        message: 'Incident details could be more specific',
        action: 'Add dates, times, locations, and specific actions for each incident',
        priority: 'medium'
      });
    }

    // Check for fee-related suggestions
    if (documentType.fees > 0) {
      suggestions.push({
        type: 'fee',
        message: `Filing fee: $${documentType.fees}`,
        action: 'Ensure you have sufficient funds or apply for fee waiver if eligible',
        priority: 'medium'
      });
    }

    return suggestions;
  }

  // Generate filing warnings
  private generateWarnings(): FilingWarning[] {
    const warnings: FilingWarning[] = [];
    const portal = getPortalByState(this.currentState);
    
    if (!portal) return warnings;

    // Check for common filing issues
    if (portal.restrictions.length > 0) {
      warnings.push({
        message: 'This filing may have restrictions',
        impact: 'Your filing may be rejected or require additional steps',
        recommendation: 'Review all restrictions and requirements before submitting'
      });
    }

    // Check for timing issues
    if (this.userData.urgency === 'emergency' && !this.userData.exParteJustification) {
      warnings.push({
        message: 'Emergency filing without proper justification',
        impact: 'Emergency filing may be denied',
        recommendation: 'Provide detailed explanation for emergency filing'
      });
    }

    // Check for incomplete information
    const validation = this.validateDocument();
    const errorCount = validation.filter(v => v.severity === 'error').length;
    if (errorCount > 0) {
      warnings.push({
        message: `${errorCount} validation errors found`,
        impact: 'Filing may be rejected or delayed',
        recommendation: 'Fix all validation errors before submitting'
      });
    }

    return warnings;
  }

  // Get next steps for filing
  private getNextSteps(): string[] {
    const steps: string[] = [];
    const validation = this.validateDocument();
    const errorCount = validation.filter(v => v.severity === 'error').length;

    if (errorCount > 0) {
      steps.push('Fix all validation errors above');
    }

    steps.push('Review all information for accuracy');
    steps.push('Ensure all required attachments are uploaded');
    steps.push('Verify filing fees and payment method');
    steps.push('Submit filing through court portal');
    steps.push('Save confirmation number and receipt');
    steps.push('Monitor filing status for updates');

    return steps;
  }

  // Get document type information
  getDocumentType(): CourtDocumentType | undefined {
    const portal = getPortalByState(this.currentState);
    if (!portal) return undefined;

    return portal.documentTypes.find(dt => 
      dt.id === this.currentDocumentType || 
      dt.name.toLowerCase().includes(this.currentDocumentType.toLowerCase())
    );
  }

  // Get smart document type suggestions
  getDocumentTypeSuggestions(userDescription: string): CourtDocumentType[] {
    const portal = getPortalByState(this.currentState);
    if (!portal) return [];

    const suggestions: CourtDocumentType[] = [];
    const keywords = userDescription.toLowerCase().split(' ');

    for (const docType of portal.documentTypes) {
      const relevance = this.calculateRelevance(docType, keywords);
      if (relevance > 0.3) { // Threshold for relevance
        suggestions.push(docType);
      }
    }

    return suggestions.sort((a, b) => 
      this.calculateRelevance(b, keywords) - this.calculateRelevance(a, keywords)
    );
  }

  // Calculate relevance score for document type
  private calculateRelevance(docType: CourtDocumentType, keywords: string[]): number {
    let score = 0;
    const text = `${docType.name} ${docType.category} ${docType.subcategory || ''}`.toLowerCase();

    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        score += 0.2;
      }
    }

    return Math.min(score, 1.0);
  }

  // Get field mapping suggestions
  getFieldMappingSuggestions(): Record<string, string> {
    const mapping = getMappingByCategory('Family Law', this.currentDocumentType);
    if (!mapping.length) return {};

    const fieldMappings: Record<string, string> = {};
    for (const map of mapping) {
      for (const fieldMap of map.requiredFields) {
        fieldMappings[fieldMap.ourField] = fieldMap.courtField;
      }
    }

    return fieldMappings;
  }

  // Get filing checklist
  getFilingChecklist(): string[] {
    const checklist: string[] = [];
    const documentType = this.getDocumentType();
    
    if (!documentType) return checklist;

    // Required fields
    for (const field of documentType.requiredFields) {
      checklist.push(`Complete: ${field.label}`);
    }

    // Required attachments
    for (const attachment of documentType.attachments) {
      if (attachment.required) {
        checklist.push(`Upload: ${attachment.type}`);
      }
    }

    // General checklist items
    checklist.push('Review all information for accuracy');
    checklist.push('Ensure proper formatting and file types');
    checklist.push('Verify filing fees and payment');
    checklist.push('Check court rules and deadlines');
    checklist.push('Prepare for service if required');

    return checklist;
  }
}

// E-Filing Validation System
// Comprehensive validation for court documents and filings

import { 
  ValidationRule, 
  DocumentField, 
  ValidationResult,
  CourtDocumentType 
} from './types';

export class EFilingValidator {
  private rules: ValidationRule[] = [];
  private customValidators: Map<string, (value: any) => boolean> = new Map();

  constructor() {
    this.setupDefaultValidators();
  }

  // Setup default validation functions
  private setupDefaultValidators(): void {
    // Date validators
    this.customValidators.set('futureDate', (value) => {
      const date = new Date(value);
      return date > new Date();
    });

    this.customValidators.set('pastDate', (value) => {
      const date = new Date(value);
      return date < new Date();
    });

    this.customValidators.set('withinLastYear', (value) => {
      const date = new Date(value);
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      return date >= oneYearAgo && date <= new Date();
    });

    // Text validators
    this.customValidators.set('noSpecialChars', (value) => {
      return /^[a-zA-Z0-9\s\-_.,()]+$/.test(value);
    });

    this.customValidators.set('properCase', (value) => {
      return /^[A-Z][a-z]+(\s+[A-Z][a-z]+)*$/.test(value);
    });

    this.customValidators.set('phoneFormat', (value) => {
      return /^\(\d{3}\)\s\d{3}-\d{4}$/.test(value);
    });

    this.customValidators.set('ssnFormat', (value) => {
      return /^\d{3}-\d{2}-\d{4}$/.test(value);
    });

    // Number validators
    this.customValidators.set('positiveNumber', (value) => {
      return Number(value) > 0;
    });

    this.customValidators.set('currencyFormat', (value) => {
      return /^\d+(\.\d{2})?$/.test(value);
    });

    this.customValidators.set('percentage', (value) => {
      const num = Number(value);
      return num >= 0 && num <= 100;
    });

    // Address validators
    this.customValidators.set('validAddress', (value) => {
      return value.length >= 10 && value.includes(' ') && /\d/.test(value);
    });

    this.customValidators.set('validZipCode', (value) => {
      return /^\d{5}(-\d{4})?$/.test(value);
    });

    // Legal validators
    this.customValidators.set('validCaseNumber', (value) => {
      return /^[A-Z]{2}-\d{6}$/.test(value);
    });

    this.customValidators.set('validBarNumber', (value) => {
      return /^\d{6,8}$/.test(value);
    });
  }

  // Validate a single field
  validateField(field: DocumentField, value: any): ValidationResult {
    const results: ValidationResult[] = [];

    // Check if field is required
    if (field.required && this.isEmpty(value)) {
      results.push({
        field: field.name,
        valid: false,
        message: `${field.label} is required`,
        severity: 'error'
      });
      return results[0];
    }

    // If field is empty and not required, it's valid
    if (this.isEmpty(value)) {
      return {
        field: field.name,
        valid: true,
        message: 'Field is valid',
        severity: 'info'
      };
    }

    // Apply all validation rules
    for (const rule of field.validation) {
      const isValid = this.validateRule(rule, value, field);
      if (!isValid) {
        results.push({
          field: field.name,
          valid: false,
          message: rule.message,
          severity: 'error',
          suggestion: this.getSuggestionForRule(rule, field)
        });
      }
    }

    // If no validation errors, field is valid
    if (results.length === 0) {
      return {
        field: field.name,
        valid: true,
        message: 'Field is valid',
        severity: 'info'
      };
    }

    return results[0]; // Return first error
  }

  // Validate multiple fields
  validateFields(fields: DocumentField[], data: Record<string, any>): ValidationResult[] {
    const results: ValidationResult[] = [];

    for (const field of fields) {
      const value = data[field.name];
      const result = this.validateField(field, value);
      results.push(result);
    }

    return results;
  }

  // Validate an entire document
  validateDocument(documentType: CourtDocumentType, data: Record<string, any>): ValidationResult[] {
    const results: ValidationResult[] = [];

    // Validate required fields
    const requiredResults = this.validateFields(documentType.requiredFields, data);
    results.push(...requiredResults);

    // Validate optional fields that have values
    for (const field of documentType.optionalFields) {
      const value = data[field.name];
      if (!this.isEmpty(value)) {
        const result = this.validateField(field, value);
        results.push(result);
      }
    }

    // Validate attachments
    const attachmentResults = this.validateAttachments(documentType.attachments, data);
    results.push(...attachmentResults);

    return results;
  }

  // Validate attachments
  private validateAttachments(attachments: any[], data: Record<string, any>): ValidationResult[] {
    const results: ValidationResult[] = [];

    for (const attachment of attachments) {
      if (attachment.required) {
        const attachmentKey = `attachment_${attachment.type}`;
        const value = data[attachmentKey];

        if (this.isEmpty(value)) {
          results.push({
            field: attachmentKey,
            valid: false,
            message: `Required attachment: ${attachment.type}`,
            severity: 'error',
            suggestion: `Upload ${attachment.type} (${attachment.maxSize}, formats: ${attachment.formats.join(', ')})`
          });
        } else {
          // Validate file format and size
          const formatValid = this.validateFileFormat(value, attachment.formats);
          const sizeValid = this.validateFileSize(value, attachment.maxSize);

          if (!formatValid) {
            results.push({
              field: attachmentKey,
              valid: false,
              message: `Invalid file format for ${attachment.type}`,
              severity: 'error',
              suggestion: `Use formats: ${attachment.formats.join(', ')}`
            });
          }

          if (!sizeValid) {
            results.push({
              field: attachmentKey,
              valid: false,
              message: `File too large for ${attachment.type}`,
              severity: 'error',
              suggestion: `Maximum size: ${attachment.maxSize}`
            });
          }
        }
      }
    }

    return results;
  }

  // Validate file format
  private validateFileFormat(file: any, allowedFormats: string[]): boolean {
    if (typeof file === 'string') {
      const extension = file.split('.').pop()?.toLowerCase();
      return allowedFormats.some(format => 
        format.toLowerCase() === extension || 
        format.toLowerCase() === `*.${extension}`
      );
    }
    return true; // Assume valid if we can't determine format
  }

  // Validate file size
  private validateFileSize(file: any, maxSize: string): boolean {
    // This is a simplified validation - in practice, you'd check actual file size
    // For now, we'll assume it's valid
    return true;
  }

  // Validate a single rule
  private validateRule(rule: ValidationRule, value: any, field: DocumentField): boolean {
    switch (rule.type) {
      case 'required':
        return !this.isEmpty(value);

      case 'format':
        return this.validateFormat(rule, value, field);

      case 'length':
        return this.validateLength(rule, value, field);

      case 'pattern':
        return this.validatePattern(rule, value);

      case 'custom':
        return this.validateCustom(rule, value);

      default:
        return true;
    }
  }

  // Validate format
  private validateFormat(rule: ValidationRule, value: any, field: DocumentField): boolean {
    switch (field.type) {
      case 'date':
        return this.isValidDate(value);
      
      case 'number':
        return !isNaN(Number(value));
      
      case 'text':
        return this.isValidEmail(value);
      
      default:
        return true;
    }
  }

  // Validate length
  private validateLength(rule: ValidationRule, value: any, field: DocumentField): boolean {
    if (typeof value !== 'string') return true;

    if (rule.condition) {
      const conditions = rule.condition.split(',');
      for (const condition of conditions) {
        const [operator, length] = condition.trim().split(' ');
        const numLength = parseInt(length);
        
        switch (operator) {
          case 'min':
            if (value.length < numLength) return false;
            break;
          case 'max':
            if (value.length > numLength) return false;
            break;
          case 'exact':
            if (value.length !== numLength) return false;
            break;
        }
      }
    }

    // Check field-specific limits
    if (field.minLength && value.length < field.minLength) return false;
    if (field.maxLength && value.length > field.maxLength) return false;

    return true;
  }

  // Validate pattern
  private validatePattern(rule: ValidationRule, value: any): boolean {
    if (!rule.condition || typeof value !== 'string') return true;
    
    try {
      const regex = new RegExp(rule.condition);
      return regex.test(value);
    } catch (error) {
      console.warn('Invalid regex pattern:', rule.condition);
      return true;
    }
  }

  // Validate custom rule
  private validateCustom(rule: ValidationRule, value: any): boolean {
    if (!rule.condition) return true;
    
    const validator = this.customValidators.get(rule.condition);
    if (validator) {
      return validator(value);
    }
    
    return true;
  }

  // Check if value is empty
  private isEmpty(value: any): boolean {
    if (value === undefined || value === null) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) return value.length === 0;
    return false;
  }

  // Check if value is valid date
  private isValidDate(value: any): boolean {
    if (value instanceof Date) return !isNaN(value.getTime());
    if (typeof value === 'string') {
      const date = new Date(value);
      return !isNaN(date.getTime());
    }
    return false;
  }

  // Check if value is valid email
  private isValidEmail(value: any): boolean {
    if (typeof value !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }

  // Get suggestion for validation rule
  private getSuggestionForRule(rule: ValidationRule, field: DocumentField): string {
    switch (rule.type) {
      case 'required':
        return `Please provide ${field.label.toLowerCase()}`;
      
      case 'format':
        if (field.type === 'date') return 'Use MM/DD/YYYY format';
        if (field.type === 'text') return 'Enter a valid email address';
        if (field.type === 'number') return 'Enter a valid number';
        return field.helpText || 'Check the format of this field';
      
      case 'length':
        if (field.maxLength) return `Maximum length: ${field.maxLength} characters`;
        if (field.minLength) return `Minimum length: ${field.minLength} characters`;
        return 'Check the length of this field';
      
      case 'pattern':
        return field.helpText || 'Check the format of this field';
      
      case 'custom':
        return field.helpText || 'Check the requirements for this field';
      
      default:
        return field.helpText || 'Please review this field';
    }
  }

  // Add custom validator
  addCustomValidator(name: string, validator: (value: any) => boolean): void {
    this.customValidators.set(name, validator);
  }

  // Get validation summary
  getValidationSummary(results: ValidationResult[]): {
    total: number;
    valid: number;
    errors: number;
    warnings: number;
    isValid: boolean;
  } {
    const total = results.length;
    const valid = results.filter(r => r.valid).length;
    const errors = results.filter(r => r.severity === 'error').length;
    const warnings = results.filter(r => r.severity === 'warning').length;
    const isValid = errors === 0;

    return {
      total,
      valid,
      errors,
      warnings,
      isValid
    };
  }

  // Get critical errors
  getCriticalErrors(results: ValidationResult[]): ValidationResult[] {
    return results.filter(r => r.severity === 'error');
  }

  // Get warnings
  getWarnings(results: ValidationResult[]): ValidationResult[] {
    return results.filter(r => r.severity === 'warning');
  }

  // Check if document is ready for filing
  isReadyForFiling(results: ValidationResult[]): boolean {
    const summary = this.getValidationSummary(results);
    return summary.isValid;
  }
}

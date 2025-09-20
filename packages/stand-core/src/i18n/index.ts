export interface LocaleConfig {
  code: string;
  name: string;
  nativeName: string;
  fallback?: string;
  direction: 'ltr' | 'rtl';
  dateFormat: string;
  timeFormat: string;
  numberFormat: {
    decimal: string;
    thousands: string;
    currency: string;
  };
}

export interface TranslationNamespace {
  [key: string]: string | TranslationNamespace;
}

export interface I18nConfig {
  defaultLocale: string;
  supportedLocales: string[];
  fallbackLocale: string;
  namespaces: string[];
  interpolation: {
    prefix: string;
    suffix: string;
  };
}

export interface I18nService {
  // Locale management
  setLocale(locale: string): void;
  getLocale(): string;
  getSupportedLocales(): string[];
  
  // Translation
  t(key: string, namespace?: string, params?: Record<string, any>): string;
  tExists(key: string, namespace?: string): boolean;
  
  // Formatting
  formatDate(date: Date | string, format?: string): string;
  formatTime(time: Date | string, format?: string): string;
  formatNumber(number: number, options?: Intl.NumberFormatOptions): string;
  formatCurrency(amount: number, currency?: string): string;
  
  // Utilities
  getDirection(): 'ltr' | 'rtl';
  isRTL(): boolean;
  getLocaleConfig(): LocaleConfig;
}

// Supported locales configuration
export const SUPPORTED_LOCALES: Record<string, LocaleConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      currency: '$'
    }
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    fallback: 'en',
    direction: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimal: ',',
      thousands: '.',
      currency: '$'
    }
  }
};

// Default i18n configuration
export const DEFAULT_I18N_CONFIG: I18nConfig = {
  defaultLocale: 'en',
  supportedLocales: ['en', 'es'],
  fallbackLocale: 'en',
  namespaces: ['common', 'legal', 'ui', 'errors'],
  interpolation: {
    prefix: '{{',
    suffix: '}}'
  }
};

// Translation data
export const TRANSLATIONS: Record<string, Record<string, TranslationNamespace>> = {
  en: {
    common: {
      // Common UI elements
      'app.name': 'Kingdom Stand',
      'app.tagline': 'Prepared to stand — rooted in truth and honesty',
      'app.disclaimer': 'Legal information, not legal advice. We are not your attorney.',
      'app.disclaimer.detailed': 'Kingdom Stand provides legal information, not legal advice. We are not your attorney. For legal advice tailored to your situation, consult a licensed attorney. Criminal, immigration, and bankruptcy matters often require specialized counsel.',
      
      // Actions
      'action.save': 'Save',
      'action.cancel': 'Cancel',
      'action.delete': 'Delete',
      'action.edit': 'Edit',
      'action.add': 'Add',
      'action.search': 'Search',
      'action.filter': 'Filter',
      'action.clear': 'Clear',
      'action.export': 'Export',
      'action.import': 'Import',
      'action.download': 'Download',
      'action.upload': 'Upload',
      'action.print': 'Print',
      'action.share': 'Share',
      
      // Status
      'status.active': 'Active',
      'status.inactive': 'Inactive',
      'status.pending': 'Pending',
      'status.completed': 'Completed',
      'status.overdue': 'Overdue',
      'status.critical': 'Critical',
      
      // Navigation
      'nav.home': 'Home',
      'nav.documents': 'Documents',
      'nav.prepare': 'Prepare',
      'nav.family': 'Family',
      'nav.lawyers': 'Lawyers',
      'nav.community': 'Community',
      'nav.calm': 'Calm',
      'nav.settings': 'Settings',
      'nav.help': 'Help',
      
      // Time
      'time.today': 'Today',
      'time.yesterday': 'Yesterday',
      'time.tomorrow': 'Tomorrow',
      'time.this_week': 'This Week',
      'time.next_week': 'Next Week',
      'time.this_month': 'This Month',
      'time.next_month': 'Next Month',
      
      // Priority levels
      'priority.low': 'Low',
      'priority.medium': 'Medium',
      'priority.high': 'High',
      'priority.critical': 'Critical'
    },
    legal: {
      // Legal terms
      'legal.case': 'Case',
      'legal.court': 'Court',
      'legal.judge': 'Judge',
      'legal.attorney': 'Attorney',
      'legal.lawyer': 'Lawyer',
      'legal.client': 'Client',
      'legal.plaintiff': 'Plaintiff',
      'legal.defendant': 'Defendant',
      'legal.petitioner': 'Petitioner',
      'legal.respondent': 'Respondent',
      
      // Case types
      'case_type.family': 'Family Law',
      'case_type.civil': 'Civil Law',
      'case_type.criminal': 'Criminal Law',
      'case_type.immigration': 'Immigration Law',
      'case_type.bankruptcy': 'Bankruptcy Law',
      'case_type.housing': 'Housing Law',
      'case_type.employment': 'Employment Law',
      'case_type.small_claims': 'Small Claims',
      
      // Document types
      'document.pleading': 'Pleading',
      'document.motion': 'Motion',
      'document.order': 'Order',
      'document.evidence': 'Evidence',
      'document.correspondence': 'Correspondence',
      'document.affidavit': 'Affidavit',
      'document.declaration': 'Declaration',
      
      // Event types
      'event.deadline': 'Deadline',
      'event.hearing': 'Hearing',
      'event.trial': 'Trial',
      'event.mediation': 'Mediation',
      'event.filing': 'Filing',
      'event.custom': 'Custom Event'
    },
    ui: {
      // Form labels
      'form.case_name': 'Case Name',
      'form.case_number': 'Case Number',
      'form.court': 'Court',
      'form.case_type': 'Case Type',
      'form.priority': 'Priority',
      'form.date': 'Date',
      'form.time': 'Time',
      'form.location': 'Location',
      'form.description': 'Description',
      'form.notes': 'Notes',
      'form.tags': 'Tags',
      
      // Messages
      'message.loading': 'Loading...',
      'message.no_data': 'No data available',
      'message.error': 'An error occurred',
      'message.success': 'Success!',
      'message.confirm_delete': 'Are you sure you want to delete this item?',
      'message.unsaved_changes': 'You have unsaved changes. Are you sure you want to leave?',
      
      // Validation
      'validation.required': 'This field is required',
      'validation.invalid_email': 'Please enter a valid email address',
      'validation.invalid_phone': 'Please enter a valid phone number',
      'validation.invalid_date': 'Please enter a valid date',
      'validation.min_length': 'Must be at least {{min}} characters',
      'validation.max_length': 'Must be no more than {{max}} characters'
    },
    errors: {
      // Error messages
      'error.network': 'Network error. Please check your connection.',
      'error.server': 'Server error. Please try again later.',
      'error.unauthorized': 'You are not authorized to perform this action.',
      'error.forbidden': 'Access denied.',
      'error.not_found': 'The requested resource was not found.',
      'error.validation': 'Please check your input and try again.',
      'error.unknown': 'An unknown error occurred.',
      
      // Specific errors
      'error.file_too_large': 'File is too large. Maximum size is {{maxSize}}.',
      'error.invalid_file_type': 'Invalid file type. Allowed types: {{allowedTypes}}.',
      'error.storage_full': 'Storage is full. Please free up some space.',
      'error.encryption_failed': 'Failed to encrypt data. Please try again.'
    }
  },
  es: {
    common: {
      // Common UI elements
      'app.name': 'Kingdom Stand',
      'app.tagline': 'Preparado para defender — arraigado en la verdad y la honestidad',
      'app.disclaimer': 'Información legal, no asesoramiento legal. No somos su abogado.',
      'app.disclaimer.detailed': 'Kingdom Stand proporciona información legal, no asesoramiento legal. No somos su abogado. Para asesoramiento legal adaptado a su situación, consulte con un abogado licenciado. Los asuntos penales, de inmigración y bancarrota a menudo requieren asesoramiento especializado.',
      
      // Actions
      'action.save': 'Guardar',
      'action.cancel': 'Cancelar',
      'action.delete': 'Eliminar',
      'action.edit': 'Editar',
      'action.add': 'Agregar',
      'action.search': 'Buscar',
      'action.filter': 'Filtrar',
      'action.clear': 'Limpiar',
      'action.export': 'Exportar',
      'action.import': 'Importar',
      'action.download': 'Descargar',
      'action.upload': 'Subir',
      'action.print': 'Imprimir',
      'action.share': 'Compartir',
      
      // Status
      'status.active': 'Activo',
      'status.inactive': 'Inactivo',
      'status.pending': 'Pendiente',
      'status.completed': 'Completado',
      'status.overdue': 'Vencido',
      'status.critical': 'Crítico',
      
      // Navigation
      'nav.home': 'Inicio',
      'nav.documents': 'Documentos',
      'nav.prepare': 'Preparar',
      'nav.family': 'Familia',
      'nav.lawyers': 'Abogados',
      'nav.community': 'Comunidad',
      'nav.calm': 'Calma',
      'nav.settings': 'Configuración',
      'nav.help': 'Ayuda',
      
      // Time
      'time.today': 'Hoy',
      'time.yesterday': 'Ayer',
      'time.tomorrow': 'Mañana',
      'time.this_week': 'Esta Semana',
      'time.next_week': 'Próxima Semana',
      'time.this_month': 'Este Mes',
      'time.next_month': 'Próximo Mes',
      
      // Priority levels
      'priority.low': 'Baja',
      'priority.medium': 'Media',
      'priority.high': 'Alta',
      'priority.critical': 'Crítica'
    },
    legal: {
      // Legal terms
      'legal.case': 'Caso',
      'legal.court': 'Tribunal',
      'legal.judge': 'Juez',
      'legal.attorney': 'Abogado',
      'legal.lawyer': 'Abogado',
      'legal.client': 'Cliente',
      'legal.plaintiff': 'Demandante',
      'legal.defendant': 'Demandado',
      'legal.petitioner': 'Peticionario',
      'legal.respondent': 'Respondiente',
      
      // Case types
      'case_type.family': 'Derecho de Familia',
      'case_type.civil': 'Derecho Civil',
      'case_type.criminal': 'Derecho Penal',
      'case_type.immigration': 'Derecho de Inmigración',
      'case_type.bankruptcy': 'Derecho de Bancarrota',
      'case_type.housing': 'Derecho de Vivienda',
      'case_type.employment': 'Derecho Laboral',
      'case_type.small_claims': 'Demandas Menores',
      
      // Document types
      'document.pleading': 'Escrito',
      'document.motion': 'Moción',
      'document.order': 'Orden',
      'document.evidence': 'Evidencia',
      'document.correspondence': 'Correspondencia',
      'document.affidavit': 'Declaración Jurada',
      'document.declaration': 'Declaración',
      
      // Event types
      'event.deadline': 'Fecha Límite',
      'event.hearing': 'Audiencia',
      'event.trial': 'Juicio',
      'event.mediation': 'Mediación',
      'event.filing': 'Presentación',
      'event.custom': 'Evento Personalizado'
    },
    ui: {
      // Form labels
      'form.case_name': 'Nombre del Caso',
      'form.case_number': 'Número del Caso',
      'form.court': 'Tribunal',
      'form.case_type': 'Tipo de Caso',
      'form.priority': 'Prioridad',
      'form.date': 'Fecha',
      'form.time': 'Hora',
      'form.location': 'Ubicación',
      'form.description': 'Descripción',
      'form.notes': 'Notas',
      'form.tags': 'Etiquetas',
      
      // Messages
      'message.loading': 'Cargando...',
      'message.no_data': 'No hay datos disponibles',
      'message.error': 'Ocurrió un error',
      'message.success': '¡Éxito!',
      'message.confirm_delete': '¿Está seguro de que desea eliminar este elemento?',
      'message.unsaved_changes': 'Tiene cambios sin guardar. ¿Está seguro de que desea salir?',
      
      // Validation
      'validation.required': 'Este campo es obligatorio',
      'validation.invalid_email': 'Por favor ingrese una dirección de correo válida',
      'validation.invalid_phone': 'Por favor ingrese un número de teléfono válido',
      'validation.invalid_date': 'Por favor ingrese una fecha válida',
      'validation.min_length': 'Debe tener al menos {{min}} caracteres',
      'validation.max_length': 'No debe tener más de {{max}} caracteres'
    },
    errors: {
      // Error messages
      'error.network': 'Error de red. Por favor verifique su conexión.',
      'error.server': 'Error del servidor. Por favor intente más tarde.',
      'error.unauthorized': 'No está autorizado para realizar esta acción.',
      'error.forbidden': 'Acceso denegado.',
      'error.not_found': 'El recurso solicitado no fue encontrado.',
      'error.validation': 'Por favor verifique su entrada e intente nuevamente.',
      'error.unknown': 'Ocurrió un error desconocido.',
      
      // Specific errors
      'error.file_too_large': 'El archivo es demasiado grande. Tamaño máximo: {{maxSize}}.',
      'error.invalid_file_type': 'Tipo de archivo inválido. Tipos permitidos: {{allowedTypes}}.',
      'error.storage_full': 'El almacenamiento está lleno. Por favor libere algo de espacio.',
      'error.encryption_failed': 'Falló el cifrado de datos. Por favor intente nuevamente.'
    }
  }
};

// I18n service implementation
export class I18nService implements I18nService {
  private static instance: I18nService;
  private currentLocale: string;
  private config: I18nConfig;
  private translations: Record<string, Record<string, TranslationNamespace>>;

  private constructor() {
    this.config = DEFAULT_I18N_CONFIG;
    this.currentLocale = this.config.defaultLocale;
    this.translations = TRANSLATIONS;
  }

  static getInstance(): I18nService {
    if (!I18nService.instance) {
      I18nService.instance = new I18nService();
    }
    return I18nService.instance;
  }

  setLocale(locale: string): void {
    if (this.config.supportedLocales.includes(locale)) {
      this.currentLocale = locale;
    } else {
      console.warn(`Locale '${locale}' is not supported, falling back to '${this.config.fallbackLocale}'`);
      this.currentLocale = this.config.fallbackLocale;
    }
  }

  getLocale(): string {
    return this.currentLocale;
  }

  getSupportedLocales(): string[] {
    return [...this.config.supportedLocales];
  }

  t(key: string, namespace: string = 'common', params?: Record<string, any>): string {
    const locale = this.currentLocale;
    const fallbackLocale = this.config.fallbackLocale;
    
    // Try current locale first
    let translation = this.getTranslation(locale, namespace, key);
    
    // Fall back to fallback locale if not found
    if (!translation && locale !== fallbackLocale) {
      translation = this.getTranslation(fallbackLocale, namespace, key);
    }
    
    // If still no translation, return the key
    if (!translation) {
      console.warn(`Translation missing for key: ${namespace}.${key} in locale: ${locale}`);
      return key;
    }
    
    // Interpolate parameters
    if (params) {
      return this.interpolate(translation, params);
    }
    
    return translation;
  }

  tExists(key: string, namespace: string = 'common'): boolean {
    const locale = this.currentLocale;
    const fallbackLocale = this.config.fallbackLocale;
    
    return !!(
      this.getTranslation(locale, namespace, key) ||
      this.getTranslation(fallbackLocale, namespace, key)
    );
  }

  private getTranslation(locale: string, namespace: string, key: string): string | undefined {
    const localeTranslations = this.translations[locale];
    if (!localeTranslations) return undefined;
    
    const namespaceTranslations = localeTranslations[namespace];
    if (!namespaceTranslations) return undefined;
    
    const keys = key.split('.');
    let current: any = namespaceTranslations;
    
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        return undefined;
      }
    }
    
    return typeof current === 'string' ? current : undefined;
  }

  private interpolate(text: string, params: Record<string, any>): string {
    let result = text;
    
    for (const [key, value] of Object.entries(params)) {
      const placeholder = `${this.config.interpolation.prefix}${key}${this.config.interpolation.suffix}`;
      result = result.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), String(value));
    }
    
    return result;
  }

  formatDate(date: Date | string, format?: string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const locale = this.currentLocale;
    
    try {
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(dateObj);
    } catch (error) {
      // Fallback to basic formatting
      return dateObj.toLocaleDateString();
    }
  }

  formatTime(time: Date | string, format?: string): string {
    const timeObj = typeof time === 'string' ? new Date(time) : time;
    const locale = this.currentLocale;
    
    try {
      return new Intl.DateTimeFormat(locale, {
        hour: '2-digit',
        minute: '2-digit'
      }).format(timeObj);
    } catch (error) {
      // Fallback to basic formatting
      return timeObj.toLocaleTimeString();
    }
  }

  formatNumber(number: number, options?: Intl.NumberFormatOptions): string {
    const locale = this.currentLocale;
    
    try {
      return new Intl.NumberFormat(locale, options).format(number);
    } catch (error) {
      // Fallback to basic formatting
      return number.toLocaleString();
    }
  }

  formatCurrency(amount: number, currency: string = 'USD'): string {
    const locale = this.currentLocale;
    
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
      }).format(amount);
    } catch (error) {
      // Fallback to basic formatting
      return `${currency} ${amount.toFixed(2)}`;
    }
  }

  getDirection(): 'ltr' | 'rtl' {
    const localeConfig = this.getLocaleConfig();
    return localeConfig.direction;
  }

  isRTL(): boolean {
    return this.getDirection() === 'rtl';
  }

  getLocaleConfig(): LocaleConfig {
    const locale = this.currentLocale;
    const fallbackLocale = this.config.fallbackLocale;
    
    return SUPPORTED_LOCALES[locale] || SUPPORTED_LOCALES[fallbackLocale] || SUPPORTED_LOCALES.en;
  }
}

// Export singleton instance
export const i18n = I18nService.getInstance();

// Convenience functions
export function t(key: string, namespace?: string, params?: Record<string, any>): string {
  return i18n.t(key, namespace, params);
}

export function setLocale(locale: string): void {
  i18n.setLocale(locale);
}

export function getLocale(): string {
  return i18n.getLocale();
}

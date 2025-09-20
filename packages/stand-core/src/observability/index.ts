export interface ObservabilityConfig {
  enabled: boolean;
  environment: 'development' | 'staging' | 'production';
  
  // Error tracking
  errorTracking: {
    enabled: boolean;
    service: 'sentry' | 'custom' | 'none';
    dsn?: string; // Sentry DSN
    sampleRate?: number; // 0.0 to 1.0
    tracesSampleRate?: number; // 0.0 to 1.0
  };
  
  // Performance monitoring
  performanceMonitoring: {
    enabled: boolean;
    trackPageLoads: boolean;
    trackUserInteractions: boolean;
    trackApiCalls: boolean;
    trackCustomMetrics: boolean;
  };
  
  // User analytics
  userAnalytics: {
    enabled: boolean;
    trackPageViews: boolean;
    trackUserActions: boolean;
    trackUserProperties: boolean;
    anonymizeData: boolean;
  };
  
  // Logging
  logging: {
    enabled: boolean;
    level: 'debug' | 'info' | 'warn' | 'error';
    service: 'console' | 'remote' | 'both';
    remoteEndpoint?: string;
  };
}

export interface ErrorEvent {
  error: Error | string;
  context?: Record<string, any>;
  tags?: Record<string, string>;
  level?: 'info' | 'warning' | 'error' | 'fatal';
  user?: {
    id?: string;
    email?: string;
    username?: string;
  };
  extra?: Record<string, any>;
}

export interface PerformanceEvent {
  name: string;
  duration: number;
  category: 'navigation' | 'interaction' | 'api' | 'custom';
  context?: Record<string, any>;
  tags?: Record<string, string>;
}

export interface UserAction {
  action: string;
  category: string;
  label?: string;
  value?: number;
  context?: Record<string, any>;
}

export interface ObservabilityService {
  // Configuration
  configure(config: ObservabilityConfig): Promise<void>;
  getConfig(): ObservabilityConfig;
  
  // Error tracking
  captureError(error: Error | string, context?: Record<string, any>): void;
  captureMessage(message: string, level?: ErrorEvent['level'], context?: Record<string, any>): void;
  setUser(user: ErrorEvent['user']): void;
  setTag(key: string, value: string): void;
  setContext(key: string, context: Record<string, any>): void;
  
  // Performance monitoring
  startTransaction(name: string, category: PerformanceEvent['category']): PerformanceTransaction;
  trackPerformance(event: PerformanceEvent): void;
  
  // User analytics
  trackPageView(page: string, properties?: Record<string, any>): void;
  trackUserAction(action: UserAction): void;
  setUserProperty(key: string, value: any): void;
  
  // Logging
  log(level: string, message: string, context?: Record<string, any>): void;
  debug(message: string, context?: Record<string, any>): void;
  info(message: string, context?: Record<string, any>): void;
  warn(message: string, context?: Record<string, any>): void;
  error(message: string, context?: Record<string, any>): void;
  
  // Utilities
  isEnabled(): boolean;
  getEnvironment(): string;
}

export interface PerformanceTransaction {
  name: string;
  category: PerformanceEvent['category'];
  startTime: number;
  end(): void;
  setTag(key: string, value: string): void;
  setContext(key: string, context: Record<string, any>): void;
}

// Default observability configuration
export const DEFAULT_OBSERVABILITY_CONFIG: ObservabilityConfig = {
  enabled: false,
  environment: 'development',
  
  errorTracking: {
    enabled: false,
    service: 'none',
    sampleRate: 1.0,
    tracesSampleRate: 0.1
  },
  
  performanceMonitoring: {
    enabled: false,
    trackPageLoads: true,
    trackUserInteractions: true,
    trackApiCalls: true,
    trackCustomMetrics: true
  },
  
  userAnalytics: {
    enabled: false,
    trackPageViews: true,
    trackUserActions: true,
    trackUserProperties: true,
    anonymizeData: true
  },
  
  logging: {
    enabled: true,
    level: 'info',
    service: 'console'
  }
};

// Observability service implementation
export class ObservabilityService implements ObservabilityService {
  private static instance: ObservabilityService;
  private config: ObservabilityConfig;
  private user: ErrorEvent['user'] | null = null;
  private tags: Map<string, string> = new Map();
  private context: Map<string, any> = new Map();
  private activeTransactions: Map<string, PerformanceTransaction> = new Map();

  private constructor() {
    this.config = { ...DEFAULT_OBSERVABILITY_CONFIG };
  }

  static getInstance(): ObservabilityService {
    if (!ObservabilityService.instance) {
      ObservabilityService.instance = new ObservabilityService();
    }
    return ObservabilityService.instance;
  }

  async configure(config: ObservabilityConfig): Promise<void> {
    this.config = { ...this.config, ...config };
    
    // Initialize Sentry if enabled
    if (this.config.errorTracking.enabled && this.config.errorTracking.service === 'sentry') {
      await this.initializeSentry();
    }
    
    // Initialize other services as needed
    await this.initializeServices();
  }

  getConfig(): ObservabilityConfig {
    return { ...this.config };
  }

  captureError(error: Error | string, context?: Record<string, any>): void {
    if (!this.config.errorTracking.enabled) {
      return;
    }

    const errorEvent: ErrorEvent = {
      error,
      context: { ...context, ...this.getGlobalContext() },
      tags: Object.fromEntries(this.tags),
      level: 'error',
      user: this.user || undefined,
      extra: this.getExtraData()
    };

    if (this.config.errorTracking.service === 'sentry') {
      this.captureErrorSentry(errorEvent);
    } else if (this.config.errorTracking.service === 'custom') {
      this.captureErrorCustom(errorEvent);
    }

    // Always log errors
    this.error(error instanceof Error ? error.message : error, context);
  }

  captureMessage(message: string, level: ErrorEvent['level'] = 'info', context?: Record<string, any>): void {
    if (!this.config.errorTracking.enabled) {
      return;
    }

    const errorEvent: ErrorEvent = {
      error: message,
      context: { ...context, ...this.getGlobalContext() },
      tags: Object.fromEntries(this.tags),
      level,
      user: this.user || undefined,
      extra: this.getExtraData()
    };

    if (this.config.errorTracking.service === 'sentry') {
      this.captureMessageSentry(errorEvent);
    } else if (this.config.errorTracking.service === 'custom') {
      this.captureMessageCustom(errorEvent);
    }

    // Log the message
    this.log(level, message, context);
  }

  setUser(user: ErrorEvent['user']): void {
    this.user = user;
    
    if (this.config.errorTracking.service === 'sentry') {
      this.setUserSentry(user);
    }
  }

  setTag(key: string, value: string): void {
    this.tags.set(key, value);
    
    if (this.config.errorTracking.service === 'sentry') {
      this.setTagSentry(key, value);
    }
  }

  setContext(key: string, context: Record<string, any>): void {
    this.context.set(key, context);
    
    if (this.config.errorTracking.service === 'sentry') {
      this.setContextSentry(key, context);
    }
  }

  startTransaction(name: string, category: PerformanceEvent['category']): PerformanceTransaction {
    if (!this.config.performanceMonitoring.enabled) {
      return this.createDummyTransaction(name, category);
    }

    const transaction: PerformanceTransaction = {
      name,
      category,
      startTime: performance.now(),
      end: () => this.endTransaction(transaction),
      setTag: (key: string, value: string) => this.setTransactionTag(transaction, key, value),
      setContext: (key: string, context: Record<string, any>) => this.setTransactionContext(transaction, key, context)
    };

    this.activeTransactions.set(name, transaction);
    return transaction;
  }

  trackPerformance(event: PerformanceEvent): void {
    if (!this.config.performanceMonitoring.enabled) {
      return;
    }

    if (this.config.errorTracking.service === 'sentry') {
      this.trackPerformanceSentry(event);
    } else if (this.config.errorTracking.service === 'custom') {
      this.trackPerformanceCustom(event);
    }
  }

  trackPageView(page: string, properties?: Record<string, any>): void {
    if (!this.config.userAnalytics.enabled || !this.config.userAnalytics.trackPageViews) {
      return;
    }

    const action: UserAction = {
      action: 'page_view',
      category: 'navigation',
      label: page,
      context: { ...properties, ...this.getGlobalContext() }
    };

    this.trackUserAction(action);
  }

  trackUserAction(action: UserAction): void {
    if (!this.config.userAnalytics.enabled || !this.config.userAnalytics.trackUserActions) {
      return;
    }

    if (this.config.errorTracking.service === 'sentry') {
      this.trackUserActionSentry(action);
    } else if (this.config.errorTracking.service === 'custom') {
      this.trackUserActionCustom(action);
    }
  }

  setUserProperty(key: string, value: any): void {
    if (!this.config.userAnalytics.enabled || !this.config.userAnalytics.trackUserProperties) {
      return;
    }

    if (this.config.errorTracking.service === 'sentry') {
      this.setUserPropertySentry(key, value);
    }
  }

  log(level: string, message: string, context?: Record<string, any>): void {
    if (!this.config.logging.enabled) {
      return;
    }

    const logData = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: { ...context, ...this.getGlobalContext() },
      tags: Object.fromEntries(this.tags)
    };

    if (this.config.logging.service === 'console' || this.config.logging.service === 'both') {
      this.logToConsole(logData);
    }

    if (this.config.logging.service === 'remote' || this.config.logging.service === 'both') {
      this.logToRemote(logData);
    }
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, any>): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log('warn', message, context);
  }

  error(message: string, context?: Record<string, any>): void {
    this.log('error', message, context);
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }

  getEnvironment(): string {
    return this.config.environment;
  }

  // Private methods
  private async initializeSentry(): Promise<void> {
    // This is a placeholder for Sentry initialization
    // In a real app, you would import and initialize Sentry
    console.log('Initializing Sentry...');
  }

  private async initializeServices(): Promise<void> {
    // Initialize other observability services
    console.log('Initializing observability services...');
  }

  private getGlobalContext(): Record<string, any> {
    return Object.fromEntries(this.context);
  }

  private getExtraData(): Record<string, any> {
    return {
      environment: this.config.environment,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
  }

  private createDummyTransaction(name: string, category: PerformanceEvent['category']): PerformanceTransaction {
    return {
      name,
      category,
      startTime: 0,
      end: () => {},
      setTag: () => {},
      setContext: () => {}
    };
  }

  private endTransaction(transaction: PerformanceTransaction): void {
    const duration = performance.now() - transaction.startTime;
    
    this.trackPerformance({
      name: transaction.name,
      duration,
      category: transaction.category
    });
    
    this.activeTransactions.delete(transaction.name);
  }

  private setTransactionTag(transaction: PerformanceTransaction, key: string, value: string): void {
    // Implementation for setting transaction tags
  }

  private setTransactionContext(transaction: PerformanceTransaction, key: string, context: Record<string, any>): void {
    // Implementation for setting transaction context
  }

  // Sentry-specific methods (placeholders)
  private captureErrorSentry(errorEvent: ErrorEvent): void {
    // Sentry error capture implementation
    console.log('Sentry: Capturing error', errorEvent);
  }

  private captureMessageSentry(errorEvent: ErrorEvent): void {
    // Sentry message capture implementation
    console.log('Sentry: Capturing message', errorEvent);
  }

  private captureErrorCustom(errorEvent: ErrorEvent): void {
    // Custom error capture implementation
    console.log('Custom: Capturing error', errorEvent);
  }

  private captureMessageCustom(errorEvent: ErrorEvent): void {
    // Custom message capture implementation
    console.log('Custom: Capturing message', errorEvent);
  }

  private setUserSentry(user: ErrorEvent['user']): void {
    // Sentry user set implementation
    console.log('Sentry: Setting user', user);
  }

  private setTagSentry(key: string, value: string): void {
    // Sentry tag set implementation
    console.log('Sentry: Setting tag', key, value);
  }

  private setContextSentry(key: string, context: Record<string, any>): void {
    // Sentry context set implementation
    console.log('Sentry: Setting context', key, context);
  }

  private trackPerformanceSentry(event: PerformanceEvent): void {
    // Sentry performance tracking implementation
    console.log('Sentry: Tracking performance', event);
  }

  private trackPerformanceCustom(event: PerformanceEvent): void {
    // Custom performance tracking implementation
    console.log('Custom: Tracking performance', event);
  }

  private trackUserActionSentry(action: UserAction): void {
    // Sentry user action tracking implementation
    console.log('Sentry: Tracking user action', action);
  }

  private trackUserActionCustom(action: UserAction): void {
    // Custom user action tracking implementation
    console.log('Custom: Tracking user action', action);
  }

  private setUserPropertySentry(key: string, value: any): void {
    // Sentry user property set implementation
    console.log('Sentry: Setting user property', key, value);
  }

  private logToConsole(logData: any): void {
    const { level, message, context, tags } = logData;
    
    switch (level) {
      case 'debug':
        console.debug(message, { context, tags });
        break;
      case 'info':
        console.info(message, { context, tags });
        break;
      case 'warn':
        console.warn(message, { context, tags });
        break;
      case 'error':
        console.error(message, { context, tags });
        break;
      default:
        console.log(message, { context, tags });
    }
  }

  private async logToRemote(logData: any): Promise<void> {
    if (!this.config.logging.remoteEndpoint) {
      return;
    }

    try {
      await fetch(this.config.logging.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(logData)
      });
    } catch (error) {
      console.warn('Failed to send log to remote endpoint:', error);
    }
  }
}

// Export singleton instance
export const observabilityService = ObservabilityService.getInstance();

// Convenience functions
export function captureError(error: Error | string, context?: Record<string, any>): void {
  observabilityService.captureError(error, context);
}

export function captureMessage(message: string, level?: ErrorEvent['level'], context?: Record<string, any>): void {
  observabilityService.captureMessage(message, level, context);
}

export function trackPageView(page: string, properties?: Record<string, any>): void {
  observabilityService.trackPageView(page, properties);
}

export function trackUserAction(action: UserAction): void {
  observabilityService.trackUserAction(action);
}

export function log(level: string, message: string, context?: Record<string, any>): void {
  observabilityService.log(level, message, context);
}

export function debug(message: string, context?: Record<string, any>): void {
  observabilityService.debug(message, context);
}

export function info(message: string, context?: Record<string, any>): void {
  observabilityService.info(message, context);
}

export function warn(message: string, context?: Record<string, any>): void {
  observabilityService.warn(message, context);
}

export function error(message: string, context?: Record<string, any>): void {
  observabilityService.error(message, context);
}

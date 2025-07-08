import { Environment } from '../config/environment';
import { BackendAPI } from './backendAPI';

/**
 * Advanced Analytics Tracking Service
 * Manages all analytics providers and custom event tracking
 */

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp?: number;
  category?: string;
  value?: number;
}

export interface EcommerceEvent {
  eventType: 'purchase' | 'add_to_cart' | 'view_item' | 'begin_checkout' | 'add_payment_info';
  transactionId?: string;
  value: number;
  currency: string;
  items: {
    item_id: string;
    item_name: string;
    item_category: string;
    price: number;
    quantity: number;
  }[];
}

export interface UserProperties {
  userId: string;
  email?: string;
  name?: string;
  faithMode?: boolean;
  subscriptionPlan?: string;
  createdAt?: string;
  lastActiveAt?: string;
}

// Platform-specific interfaces
interface GoogleAnalytics4Config {
  measurementId: string;
  apiSecret: string;
}

interface MixpanelConfig {
  token: string;
}

interface FacebookConfig {
  appId: string;
  pixelId?: string;
}

class AnalyticsTrackingService {
  private config: any;
  private userId: string | null = null;
  private userProperties: UserProperties | null = null;
  private isInitialized = false;
  
  // Provider instances
  private ga4: any = null;
  private mixpanel: any = null;
  private amplitude: any = null;
  private facebook: any = null;
  
  constructor() {
    this.config = Environment.get();
    this.initializeProviders();
  }
  
  // Initialization
  private async initializeProviders(): Promise<void> {
    try {
      // Initialize Google Analytics 4
      if (this.config.GA4_MEASUREMENT_ID) {
        await this.initializeGA4();
      }
      
      // Initialize Mixpanel
      if (this.config.MIXPANEL_TOKEN) {
        await this.initializeMixpanel();
      }
      
      // Initialize Amplitude
      if (this.config.AMPLITUDE_API_KEY) {
        await this.initializeAmplitude();
      }
      
      // Initialize Facebook Analytics
      if (this.config.FACEBOOK_APP_ID) {
        await this.initializeFacebook();
      }
      
      this.isInitialized = true;
      
      if (Environment.isDebugEnabled()) {
        console.log('[Analytics] Initialized providers:', {
          ga4: !!this.ga4,
          mixpanel: !!this.mixpanel,
          amplitude: !!this.amplitude,
          facebook: !!this.facebook,
        });
      }
    } catch (error) {
      console.error('[Analytics] Initialization error:', error);
    }
  }
  
  private async initializeGA4(): Promise<void> {
    try {
      // For React Native, you would use @react-native-google-analytics/google-analytics
      // This is a placeholder for the actual implementation
      this.ga4 = {
        config: {
          measurementId: this.config.GA4_MEASUREMENT_ID,
          apiSecret: this.config.GA4_API_SECRET,
        },
        track: (eventName: string, properties: any) => {
          if (Environment.isDebugEnabled()) {
            console.log('[GA4] Track:', eventName, properties);
          }
          // Actual GA4 tracking implementation would go here
        }
      };
    } catch (error) {
      console.error('[Analytics] GA4 initialization failed:', error);
    }
  }
  
  private async initializeMixpanel(): Promise<void> {
    try {
      // For React Native, you would use mixpanel-react-native
      // This is a placeholder for the actual implementation
      this.mixpanel = {
        init: (token: string) => {
          if (Environment.isDebugEnabled()) {
            console.log('[Mixpanel] Initialized with token:', token);
          }
        },
        track: (eventName: string, properties: any) => {
          if (Environment.isDebugEnabled()) {
            console.log('[Mixpanel] Track:', eventName, properties);
          }
          // Actual Mixpanel tracking implementation would go here
        },
        identify: (userId: string) => {
          if (Environment.isDebugEnabled()) {
            console.log('[Mixpanel] Identify:', userId);
          }
        },
        setPeople: (properties: any) => {
          if (Environment.isDebugEnabled()) {
            console.log('[Mixpanel] Set People:', properties);
          }
        }
      };
      
      this.mixpanel.init(this.config.MIXPANEL_TOKEN);
    } catch (error) {
      console.error('[Analytics] Mixpanel initialization failed:', error);
    }
  }
  
  private async initializeAmplitude(): Promise<void> {
    try {
      // For React Native, you would use @amplitude/react-native
      // This is a placeholder for the actual implementation
      this.amplitude = {
        init: (apiKey: string) => {
          if (Environment.isDebugEnabled()) {
            console.log('[Amplitude] Initialized with API key:', apiKey);
          }
        },
        track: (eventName: string, properties: any) => {
          if (Environment.isDebugEnabled()) {
            console.log('[Amplitude] Track:', eventName, properties);
          }
          // Actual Amplitude tracking implementation would go here
        },
        identify: (userId: string, properties: any) => {
          if (Environment.isDebugEnabled()) {
            console.log('[Amplitude] Identify:', userId, properties);
          }
        }
      };
      
      this.amplitude.init(this.config.AMPLITUDE_API_KEY);
    } catch (error) {
      console.error('[Analytics] Amplitude initialization failed:', error);
    }
  }
  
  private async initializeFacebook(): Promise<void> {
    try {
      // For React Native, you would use react-native-fbsdk-next
      // This is a placeholder for the actual implementation
      this.facebook = {
        logEvent: (eventName: string, properties: any) => {
          if (Environment.isDebugEnabled()) {
            console.log('[Facebook] Log Event:', eventName, properties);
          }
          // Actual Facebook event logging would go here
        },
        logPurchase: (amount: number, currency: string, properties: any) => {
          if (Environment.isDebugEnabled()) {
            console.log('[Facebook] Log Purchase:', amount, currency, properties);
          }
        }
      };
    } catch (error) {
      console.error('[Analytics] Facebook initialization failed:', error);
    }
  }
  
  // User Management
  async identify(userId: string, properties?: UserProperties): Promise<void> {
    this.userId = userId;
    this.userProperties = properties || null;
    
    try {
      // Identify with all providers
      if (this.mixpanel) {
        this.mixpanel.identify(userId);
        if (properties) {
          this.mixpanel.setPeople(properties);
        }
      }
      
      if (this.amplitude) {
        this.amplitude.identify(userId, properties);
      }
      
      // Send to backend for centralized tracking
      await this.sendToBackend('user_identify', {
        userId,
        properties,
      });
      
      if (Environment.isDebugEnabled()) {
        console.log('[Analytics] User identified:', userId, properties);
      }
    } catch (error) {
      console.error('[Analytics] Identify error:', error);
    }
  }
  
  async setUserProperties(properties: Partial<UserProperties>): Promise<void> {
    if (this.userProperties) {
      this.userProperties = { ...this.userProperties, ...properties };
    }
    
    try {
      if (this.mixpanel) {
        this.mixpanel.setPeople(properties);
      }
      
      if (this.amplitude && this.userId) {
        this.amplitude.identify(this.userId, properties);
      }
      
      if (Environment.isDebugEnabled()) {
        console.log('[Analytics] User properties updated:', properties);
      }
    } catch (error) {
      console.error('[Analytics] Set user properties error:', error);
    }
  }
  
  // Event Tracking
  async track(event: AnalyticsEvent): Promise<void> {
    if (!this.isInitialized) {
      console.warn('[Analytics] Service not initialized yet');
      return;
    }
    
    const enrichedEvent = {
      ...event,
      userId: event.userId || this.userId,
      timestamp: event.timestamp || Date.now(),
      properties: {
        ...event.properties,
        platform: 'mobile',
        environment: Environment.get().NODE_ENV,
        faithMode: this.userProperties?.faithMode || false,
      },
    };
    
    try {
      // Track with all providers
      if (this.ga4) {
        this.ga4.track(enrichedEvent.name, enrichedEvent.properties);
      }
      
      if (this.mixpanel) {
        this.mixpanel.track(enrichedEvent.name, enrichedEvent.properties);
      }
      
      if (this.amplitude) {
        this.amplitude.track(enrichedEvent.name, enrichedEvent.properties);
      }
      
      if (this.facebook) {
        this.facebook.logEvent(enrichedEvent.name, enrichedEvent.properties);
      }
      
      // Send to backend for processing and storage
      await this.sendToBackend('track_event', enrichedEvent);
      
      if (Environment.isDebugEnabled()) {
        console.log('[Analytics] Event tracked:', enrichedEvent);
      }
    } catch (error) {
      console.error('[Analytics] Track event error:', error);
    }
  }
  
  // Ecommerce Tracking
  async trackEcommerce(event: EcommerceEvent): Promise<void> {
    const ecommerceData = {
      ...event,
      timestamp: Date.now(),
      userId: this.userId,
    };
    
    try {
      // GA4 Enhanced Ecommerce
      if (this.ga4) {
        this.ga4.track(event.eventType, {
          transaction_id: event.transactionId,
          value: event.value,
          currency: event.currency,
          items: event.items,
        });
      }
      
      // Mixpanel Ecommerce
      if (this.mixpanel) {
        this.mixpanel.track(event.eventType, ecommerceData);
      }
      
      // Facebook Purchase Events
      if (this.facebook && event.eventType === 'purchase') {
        this.facebook.logPurchase(event.value, event.currency, {
          transaction_id: event.transactionId,
          num_items: event.items.length,
        });
      }
      
      // Send to backend
      await this.sendToBackend('track_ecommerce', ecommerceData);
      
      if (Environment.isDebugEnabled()) {
        console.log('[Analytics] Ecommerce event tracked:', ecommerceData);
      }
    } catch (error) {
      console.error('[Analytics] Track ecommerce error:', error);
    }
  }
  
  // Predefined Event Tracking Methods
  async trackScreenView(screenName: string, properties?: Record<string, any>): Promise<void> {
    await this.track({
      name: 'screen_view',
      properties: {
        screen_name: screenName,
        ...properties,
      },
      category: 'navigation',
    });
  }
  
  async trackUserAction(action: string, properties?: Record<string, any>): Promise<void> {
    await this.track({
      name: 'user_action',
      properties: {
        action,
        ...properties,
      },
      category: 'engagement',
    });
  }
  
  async trackContentGeneration(type: string, success: boolean, properties?: Record<string, any>): Promise<void> {
    await this.track({
      name: 'content_generated',
      properties: {
        content_type: type,
        success,
        faith_mode: this.userProperties?.faithMode || false,
        ...properties,
      },
      category: 'content',
    });
  }
  
  async trackProductSync(platform: string, success: boolean, properties?: Record<string, any>): Promise<void> {
    await this.track({
      name: 'product_synced',
      properties: {
        platform,
        success,
        ...properties,
      },
      category: 'ecommerce',
    });
  }
  
  async trackPayment(amount: number, currency: string, success: boolean, properties?: Record<string, any>): Promise<void> {
    await this.track({
      name: 'payment_processed',
      properties: {
        amount,
        currency,
        success,
        ...properties,
      },
      category: 'revenue',
      value: amount,
    });
  }
  
  async trackError(error: string, context?: Record<string, any>): Promise<void> {
    await this.track({
      name: 'error_occurred',
      properties: {
        error_message: error,
        ...context,
      },
      category: 'error',
    });
  }
  
  // Revenue Tracking
  async trackRevenue(amount: number, currency = 'USD', properties?: Record<string, any>): Promise<void> {
    await this.trackEcommerce({
      eventType: 'purchase',
      value: amount,
      currency,
      items: [{
        item_id: 'subscription',
        item_name: 'Kingdom Studios Subscription',
        item_category: 'subscription',
        price: amount,
        quantity: 1,
      }],
      ...properties,
    });
  }
  
  // Performance Tracking
  async trackPerformance(metric: string, value: number, properties?: Record<string, any>): Promise<void> {
    await this.track({
      name: 'performance_metric',
      properties: {
        metric_name: metric,
        metric_value: value,
        ...properties,
      },
      category: 'performance',
      value,
    });
  }
  
  // A/B Testing Support
  async trackExperiment(experimentName: string, variant: string, properties?: Record<string, any>): Promise<void> {
    await this.track({
      name: 'experiment_viewed',
      properties: {
        experiment_name: experimentName,
        variant,
        ...properties,
      },
      category: 'experiment',
    });
  }
  
  // Batch Event Processing
  async flush(): Promise<void> {
    try {
      // Force flush all pending events
      if (this.mixpanel && typeof this.mixpanel.flush === 'function') {
        this.mixpanel.flush();
      }
      
      if (this.amplitude && typeof this.amplitude.flush === 'function') {
        this.amplitude.flush();
      }
      
      if (Environment.isDebugEnabled()) {
        console.log('[Analytics] Flushed all pending events');
      }
    } catch (error) {
      console.error('[Analytics] Flush error:', error);
    }
  }
  
  // Backend Communication
  private async sendToBackend(eventType: string, data: any): Promise<void> {
    try {
      await BackendAPI.trackEvent({
        name: eventType,
        properties: data,
        userId: this.userId,
        timestamp: Date.now(),
      });
    } catch (error) {
      if (Environment.isDebugEnabled()) {
        console.error('[Analytics] Backend send error:', error);
      }
      // Don't throw - analytics should never break the app
    }
  }
  
  // Utility Methods
  isEnabled(): boolean {
    return this.isInitialized && (
      !!this.ga4 || 
      !!this.mixpanel || 
      !!this.amplitude || 
      !!this.facebook
    );
  }
  
  getProviders(): string[] {
    const providers: string[] = [];
    if (this.ga4) providers.push('Google Analytics 4');
    if (this.mixpanel) providers.push('Mixpanel');
    if (this.amplitude) providers.push('Amplitude');
    if (this.facebook) providers.push('Facebook Analytics');
    return providers;
  }
  
  // Reset for logout
  async reset(): Promise<void> {
    this.userId = null;
    this.userProperties = null;
    
    try {
      if (this.mixpanel && typeof this.mixpanel.reset === 'function') {
        this.mixpanel.reset();
      }
      
      if (this.amplitude && typeof this.amplitude.reset === 'function') {
        this.amplitude.reset();
      }
      
      if (Environment.isDebugEnabled()) {
        console.log('[Analytics] Analytics state reset');
      }
    } catch (error) {
      console.error('[Analytics] Reset error:', error);
    }
  }
}

// Singleton instance
export const AnalyticsTracking = new AnalyticsTrackingService();

// Convenience functions
export const trackEvent = (event: AnalyticsEvent) => AnalyticsTracking.track(event);
export const trackScreenView = (screenName: string, properties?: Record<string, any>) => 
  AnalyticsTracking.trackScreenView(screenName, properties);
export const trackUserAction = (action: string, properties?: Record<string, any>) => 
  AnalyticsTracking.trackUserAction(action, properties);
export const identifyUser = (userId: string, properties?: UserProperties) => 
  AnalyticsTracking.identify(userId, properties);

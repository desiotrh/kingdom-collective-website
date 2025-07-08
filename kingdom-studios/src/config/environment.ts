import Constants from 'expo-constants';

/**
 * Environment Configuration Manager
 * Handles all environment variables and provides type safety
 */

export interface EnvironmentConfig {
  // App Configuration
  NODE_ENV: 'development' | 'production' | 'staging';
  DEBUG_MODE: boolean;
  ENABLE_MOCKS: boolean;
  
  // API Configuration
  API_BASE_URL: string;
  API_KEY: string;
  
  // Firebase
  FIREBASE_API_KEY: string;
  FIREBASE_AUTH_DOMAIN: string;
  FIREBASE_PROJECT_ID: string;
  FIREBASE_STORAGE_BUCKET: string;
  FIREBASE_MESSAGING_SENDER_ID: string;
  FIREBASE_APP_ID: string;
  
  // Google OAuth
  GOOGLE_CLIENT_ID: string;
  GOOGLE_ANDROID_CLIENT_ID: string;
  GOOGLE_IOS_CLIENT_ID: string;
  
  // Facebook
  FACEBOOK_APP_ID: string;
  
  // AI Services
  OPENAI_API_KEY: string;
  OPENROUTER_API_KEY: string;
  
  // E-commerce Platforms
  ETSY_API_KEY: string;
  PRINTIFY_API_KEY: string;
  SHOPIFY_API_KEY: string;
  SHOPIFY_STORE_URL: string;
  AMAZON_ACCESS_KEY: string;
  AMAZON_SECRET_KEY: string;
  AMAZON_MARKETPLACE_ID: string;
  
  // Payment Processing
  STRIPE_PUBLISHABLE_KEY: string;
  STRIPE_SECRET_KEY: string;
  
  // Email Marketing
  CONVERTKIT_API_KEY: string;
  CONVERTKIT_API_SECRET: string;
  MAILCHIMP_API_KEY: string;
  MAILCHIMP_SERVER_PREFIX: string;
  
  // Social Media
  INSTAGRAM_APP_ID: string;
  INSTAGRAM_APP_SECRET: string;
  TWITTER_API_KEY: string;
  TWITTER_API_SECRET: string;
  TWITTER_BEARER_TOKEN: string;
  TIKTOK_APP_ID: string;
  TIKTOK_APP_SECRET: string;
  
  // Analytics
  GA4_MEASUREMENT_ID: string;
  GA4_API_SECRET: string;
  GTM_CONTAINER_ID: string;
  MIXPANEL_TOKEN: string;
  
  // Additional Services
  SENTRY_DSN: string;
  AMPLITUDE_API_KEY: string;
  REVENUECAT_API_KEY: string;
  PUSHER_APP_ID: string;
  PUSHER_KEY: string;
  PUSHER_SECRET: string;
  PUSHER_CLUSTER: string;
}

class EnvironmentManager {
  private config: EnvironmentConfig;
  private missingKeys: string[] = [];
  
  constructor() {
    this.config = this.loadConfiguration();
    this.validateConfiguration();
  }
  
  private loadConfiguration(): EnvironmentConfig {
    const env = Constants.expoConfig?.extra || {};
    
    return {
      // App Configuration
      NODE_ENV: this.getEnvVar('NODE_ENV', 'development') as 'development' | 'production' | 'staging',
      DEBUG_MODE: this.getBooleanEnvVar('EXPO_PUBLIC_DEBUG_MODE', true),
      ENABLE_MOCKS: this.getBooleanEnvVar('EXPO_PUBLIC_ENABLE_MOCKS', true),
      
      // API Configuration
      API_BASE_URL: this.getEnvVar('EXPO_PUBLIC_API_BASE_URL', 'http://localhost:3000/api'),
      API_KEY: this.getEnvVar('EXPO_PUBLIC_API_KEY', ''),
      
      // Firebase
      FIREBASE_API_KEY: this.getEnvVar('EXPO_PUBLIC_FIREBASE_API_KEY'),
      FIREBASE_AUTH_DOMAIN: this.getEnvVar('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN'),
      FIREBASE_PROJECT_ID: this.getEnvVar('EXPO_PUBLIC_FIREBASE_PROJECT_ID'),
      FIREBASE_STORAGE_BUCKET: this.getEnvVar('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET'),
      FIREBASE_MESSAGING_SENDER_ID: this.getEnvVar('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
      FIREBASE_APP_ID: this.getEnvVar('EXPO_PUBLIC_FIREBASE_APP_ID'),
      
      // Google OAuth
      GOOGLE_CLIENT_ID: this.getEnvVar('EXPO_PUBLIC_GOOGLE_CLIENT_ID'),
      GOOGLE_ANDROID_CLIENT_ID: this.getEnvVar('EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID'),
      GOOGLE_IOS_CLIENT_ID: this.getEnvVar('EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID'),
      
      // Facebook
      FACEBOOK_APP_ID: this.getEnvVar('EXPO_PUBLIC_FACEBOOK_APP_ID'),
      
      // AI Services
      OPENAI_API_KEY: this.getEnvVar('EXPO_PUBLIC_OPENAI_API_KEY'),
      OPENROUTER_API_KEY: this.getEnvVar('EXPO_PUBLIC_OPENROUTER_API_KEY'),
      
      // E-commerce Platforms
      ETSY_API_KEY: this.getEnvVar('EXPO_PUBLIC_ETSY_API_KEY'),
      PRINTIFY_API_KEY: this.getEnvVar('EXPO_PUBLIC_PRINTIFY_API_KEY'),
      SHOPIFY_API_KEY: this.getEnvVar('EXPO_PUBLIC_SHOPIFY_API_KEY'),
      SHOPIFY_STORE_URL: this.getEnvVar('EXPO_PUBLIC_SHOPIFY_STORE_URL'),
      AMAZON_ACCESS_KEY: this.getEnvVar('EXPO_PUBLIC_AMAZON_ACCESS_KEY'),
      AMAZON_SECRET_KEY: this.getEnvVar('EXPO_PUBLIC_AMAZON_SECRET_KEY'),
      AMAZON_MARKETPLACE_ID: this.getEnvVar('EXPO_PUBLIC_AMAZON_MARKETPLACE_ID'),
      
      // Payment Processing
      STRIPE_PUBLISHABLE_KEY: this.getEnvVar('EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY'),
      STRIPE_SECRET_KEY: this.getEnvVar('EXPO_PUBLIC_STRIPE_SECRET_KEY'),
      
      // Email Marketing
      CONVERTKIT_API_KEY: this.getEnvVar('EXPO_PUBLIC_CONVERTKIT_API_KEY'),
      CONVERTKIT_API_SECRET: this.getEnvVar('EXPO_PUBLIC_CONVERTKIT_API_SECRET'),
      MAILCHIMP_API_KEY: this.getEnvVar('EXPO_PUBLIC_MAILCHIMP_API_KEY'),
      MAILCHIMP_SERVER_PREFIX: this.getEnvVar('EXPO_PUBLIC_MAILCHIMP_SERVER_PREFIX', 'us1'),
      
      // Social Media
      INSTAGRAM_APP_ID: this.getEnvVar('EXPO_PUBLIC_INSTAGRAM_APP_ID'),
      INSTAGRAM_APP_SECRET: this.getEnvVar('EXPO_PUBLIC_INSTAGRAM_APP_SECRET'),
      TWITTER_API_KEY: this.getEnvVar('EXPO_PUBLIC_TWITTER_API_KEY'),
      TWITTER_API_SECRET: this.getEnvVar('EXPO_PUBLIC_TWITTER_API_SECRET'),
      TWITTER_BEARER_TOKEN: this.getEnvVar('EXPO_PUBLIC_TWITTER_BEARER_TOKEN'),
      TIKTOK_APP_ID: this.getEnvVar('EXPO_PUBLIC_TIKTOK_APP_ID'),
      TIKTOK_APP_SECRET: this.getEnvVar('EXPO_PUBLIC_TIKTOK_APP_SECRET'),
      
      // Analytics
      GA4_MEASUREMENT_ID: this.getEnvVar('EXPO_PUBLIC_GA4_MEASUREMENT_ID'),
      GA4_API_SECRET: this.getEnvVar('EXPO_PUBLIC_GA4_API_SECRET'),
      GTM_CONTAINER_ID: this.getEnvVar('EXPO_PUBLIC_GTM_CONTAINER_ID'),
      MIXPANEL_TOKEN: this.getEnvVar('EXPO_PUBLIC_MIXPANEL_TOKEN'),
      
      // Additional Services
      SENTRY_DSN: this.getEnvVar('EXPO_PUBLIC_SENTRY_DSN'),
      AMPLITUDE_API_KEY: this.getEnvVar('EXPO_PUBLIC_AMPLITUDE_API_KEY'),
      REVENUECAT_API_KEY: this.getEnvVar('EXPO_PUBLIC_REVENUECAT_API_KEY'),
      PUSHER_APP_ID: this.getEnvVar('EXPO_PUBLIC_PUSHER_APP_ID'),
      PUSHER_KEY: this.getEnvVar('EXPO_PUBLIC_PUSHER_KEY'),
      PUSHER_SECRET: this.getEnvVar('EXPO_PUBLIC_PUSHER_SECRET'),
      PUSHER_CLUSTER: this.getEnvVar('EXPO_PUBLIC_PUSHER_CLUSTER', 'us2'),
    };
  }
  
  private getEnvVar(key: string, defaultValue: string = ''): string {
    const value = process.env[key] || defaultValue;
    if (!value && !defaultValue) {
      this.missingKeys.push(key);
    }
    return value;
  }
  
  private getBooleanEnvVar(key: string, defaultValue: boolean = false): boolean {
    const value = process.env[key];
    if (!value) return defaultValue;
    return value.toLowerCase() === 'true';
  }
  
  private validateConfiguration(): void {
    const criticalKeys = [
      'EXPO_PUBLIC_FIREBASE_API_KEY',
      'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
    ];
    
    const missingCritical = criticalKeys.filter(key => !process.env[key]);
    
    if (missingCritical.length > 0 && !this.config.ENABLE_MOCKS) {
      console.warn(
        `[Environment] Missing critical environment variables: ${missingCritical.join(', ')}\n` +
        'The app may not function properly. Please check your .env file.'
      );
    }
    
    if (this.missingKeys.length > 0 && this.config.DEBUG_MODE) {
      console.log(
        `[Environment] Missing optional environment variables: ${this.missingKeys.join(', ')}\n` +
        'Some features may be disabled.'
      );
    }
  }
  
  // Public getters
  get(): EnvironmentConfig {
    return { ...this.config };
  }
  
  isDevelopment(): boolean {
    return this.config.NODE_ENV === 'development';
  }
  
  isProduction(): boolean {
    return this.config.NODE_ENV === 'production';
  }
  
  isDebugEnabled(): boolean {
    return this.config.DEBUG_MODE;
  }
  
  areMocksEnabled(): boolean {
    return this.config.ENABLE_MOCKS;
  }
  
  // Service availability checks
  isFirebaseConfigured(): boolean {
    return !!(this.config.FIREBASE_API_KEY && this.config.FIREBASE_PROJECT_ID);
  }
  
  isOpenAIConfigured(): boolean {
    return !!(this.config.OPENAI_API_KEY || this.config.OPENROUTER_API_KEY);
  }
  
  isStripeConfigured(): boolean {
    return !!this.config.STRIPE_PUBLISHABLE_KEY;
  }
  
  isAnalyticsConfigured(): boolean {
    return !!(this.config.GA4_MEASUREMENT_ID || this.config.MIXPANEL_TOKEN);
  }
  
  // Platform availability checks
  isEtsyConfigured(): boolean {
    return !!this.config.ETSY_API_KEY;
  }
  
  isPrintifyConfigured(): boolean {
    return !!this.config.PRINTIFY_API_KEY;
  }
  
  isShopifyConfigured(): boolean {
    return !!(this.config.SHOPIFY_API_KEY && this.config.SHOPIFY_STORE_URL);
  }
  
  isAmazonConfigured(): boolean {
    return !!(this.config.AMAZON_ACCESS_KEY && this.config.AMAZON_SECRET_KEY);
  }
  
  // Get service-specific configurations
  getFirebaseConfig() {
    return {
      apiKey: this.config.FIREBASE_API_KEY,
      authDomain: this.config.FIREBASE_AUTH_DOMAIN,
      projectId: this.config.FIREBASE_PROJECT_ID,
      storageBucket: this.config.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: this.config.FIREBASE_MESSAGING_SENDER_ID,
      appId: this.config.FIREBASE_APP_ID,
    };
  }
  
  getStripeConfig() {
    return {
      publishableKey: this.config.STRIPE_PUBLISHABLE_KEY,
      // Note: Secret key should never be exposed in client
    };
  }
  
  getAnalyticsConfig() {
    return {
      ga4MeasurementId: this.config.GA4_MEASUREMENT_ID,
      mixpanelToken: this.config.MIXPANEL_TOKEN,
      amplitudeApiKey: this.config.AMPLITUDE_API_KEY,
    };
  }
  
  // Validation helpers
  validateService(serviceName: string): { isValid: boolean; message: string } {
    switch (serviceName.toLowerCase()) {
      case 'firebase':
        return {
          isValid: this.isFirebaseConfigured(),
          message: this.isFirebaseConfigured() 
            ? 'Firebase is properly configured' 
            : 'Firebase API key and Project ID are required'
        };
      
      case 'openai':
        return {
          isValid: this.isOpenAIConfigured(),
          message: this.isOpenAIConfigured() 
            ? 'AI services are properly configured' 
            : 'OpenAI or OpenRouter API key is required'
        };
      
      case 'stripe':
        return {
          isValid: this.isStripeConfigured(),
          message: this.isStripeConfigured() 
            ? 'Stripe is properly configured' 
            : 'Stripe publishable key is required'
        };
      
      default:
        return {
          isValid: false,
          message: `Unknown service: ${serviceName}`
        };
    }
  }
}

// Singleton instance
export const Environment = new EnvironmentManager();

// Helper function for backward compatibility
export const getEnvironmentConfig = () => Environment.get();

// Export common checks
export const isProduction = () => Environment.isProduction();
export const isDevelopment = () => Environment.isDevelopment();
export const isDebugEnabled = () => Environment.isDebugEnabled();

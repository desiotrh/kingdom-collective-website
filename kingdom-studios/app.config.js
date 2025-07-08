import 'dotenv/config';

export default {
  expo: {
    name: 'Kingdom Studios',
    slug: 'kingdom-studios',
    version: '1.0.0',
    orientation: 'portrait',
    platforms: ['ios', 'android', 'web'],
    scheme: 'kingdom-studios',
    icon: './assets/icon.png',
    userInterfaceStyle: 'dark',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#000000',
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      bundleIdentifier: 'com.dtritz9.kingdomstudios',
      supportsTablet: true,
    },
    android: {
      package: 'com.dtritz9.kingdomstudios',
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#000000',
      },
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      'expo-facebook'
    ],
    extra: {
      // Firebase Configuration
      firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
      
      // Google OAuth
      googleClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
      googleAndroidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
      googleIosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      
      // Facebook Integration
      facebookAppId: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID,
      
      // AI Content Generation
      openaiApiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
      openrouterApiKey: process.env.EXPO_PUBLIC_OPENROUTER_API_KEY,
      
      // E-commerce Platform APIs
      etsyApiKey: process.env.EXPO_PUBLIC_ETSY_API_KEY,
      printifyApiKey: process.env.EXPO_PUBLIC_PRINTIFY_API_KEY,
      shopifyApiKey: process.env.EXPO_PUBLIC_SHOPIFY_API_KEY,
      shopifyStoreUrl: process.env.EXPO_PUBLIC_SHOPIFY_STORE_URL,
      amazonAccessKey: process.env.EXPO_PUBLIC_AMAZON_ACCESS_KEY,
      amazonSecretKey: process.env.EXPO_PUBLIC_AMAZON_SECRET_KEY,
      amazonMarketplaceId: process.env.EXPO_PUBLIC_AMAZON_MARKETPLACE_ID,
      
      // Payment Processing
      stripePublishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      stripeSecretKey: process.env.EXPO_PUBLIC_STRIPE_SECRET_KEY,
      
      // Email Marketing
      convertKitApiKey: process.env.EXPO_PUBLIC_CONVERTKIT_API_KEY,
      convertKitApiSecret: process.env.EXPO_PUBLIC_CONVERTKIT_API_SECRET,
      mailchimpApiKey: process.env.EXPO_PUBLIC_MAILCHIMP_API_KEY,
      mailchimpServerPrefix: process.env.EXPO_PUBLIC_MAILCHIMP_SERVER_PREFIX,
      
      // Social Media APIs
      instagramAppId: process.env.EXPO_PUBLIC_INSTAGRAM_APP_ID,
      instagramAppSecret: process.env.EXPO_PUBLIC_INSTAGRAM_APP_SECRET,
      twitterApiKey: process.env.EXPO_PUBLIC_TWITTER_API_KEY,
      twitterApiSecret: process.env.EXPO_PUBLIC_TWITTER_API_SECRET,
      twitterBearerToken: process.env.EXPO_PUBLIC_TWITTER_BEARER_TOKEN,
      tiktokAppId: process.env.EXPO_PUBLIC_TIKTOK_APP_ID,
      tiktokAppSecret: process.env.EXPO_PUBLIC_TIKTOK_APP_SECRET,
      
      // Analytics and Tracking
      ga4MeasurementId: process.env.EXPO_PUBLIC_GA4_MEASUREMENT_ID,
      ga4ApiSecret: process.env.EXPO_PUBLIC_GA4_API_SECRET,
      gtmContainerId: process.env.EXPO_PUBLIC_GTM_CONTAINER_ID,
      mixpanelToken: process.env.EXPO_PUBLIC_MIXPANEL_TOKEN,
      
      // Backend API
      apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
      apiKey: process.env.EXPO_PUBLIC_API_KEY,
      
      // Additional Services
      sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
      amplitudeApiKey: process.env.EXPO_PUBLIC_AMPLITUDE_API_KEY,
      revenueCatApiKey: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY,
      pusherAppId: process.env.EXPO_PUBLIC_PUSHER_APP_ID,
      pusherKey: process.env.EXPO_PUBLIC_PUSHER_KEY,
      pusherSecret: process.env.EXPO_PUBLIC_PUSHER_SECRET,
      pusherCluster: process.env.EXPO_PUBLIC_PUSHER_CLUSTER,
      
      // Development Settings
      debugMode: process.env.EXPO_PUBLIC_DEBUG_MODE === 'true',
      enableMocks: process.env.EXPO_PUBLIC_ENABLE_MOCKS === 'true',
    },
  },
};

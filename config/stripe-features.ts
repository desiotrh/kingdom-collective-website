// Stripe Features Configuration for Kingdom AI Bot Add-ons
// Updated with actual feature IDs from Stripe Dashboard

export interface StripeFeature {
  featureId: string;
  priceId: string;
  descriptiveId: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

export interface StripeFeaturesConfig {
  features: Record<string, StripeFeature>;
}

// UPDATED CONFIGURATION - Using actual feature IDs from Stripe Dashboard
// Based on lookup keys: custom-branding, voicebot-integration, etc.
export const STRIPE_FEATURES: StripeFeaturesConfig = {
  features: {
    "custom_branding": {
      "featureId": "feat_custom_branding",
      "priceId": "price_1Rr4lzGMSZjMrbvl3MYajAyG",
      "descriptiveId": "custom_branding",
      "name": "Custom Branding",
      "description": "Custom colors, logo, and brand integration for your AI bot",
      "price": 50,
      "category": "customization"
    },
    "voicebot_integration": {
      "featureId": "feat_voicebot_integration",
      "priceId": "price_1Rr4lzGMSZjMrbvlBv2GITWu",
      "descriptiveId": "voicebot_integration",
      "name": "VoiceBot Integration",
      "description": "Kingdom Voice integration for voice-enabled interactions",
      "price": 75,
      "category": "integration"
    },
    "dual_tone_toggle": {
      "featureId": "feat_dual_tone_toggle",
      "priceId": "price_1Rr4m0GMSZjMrbvlrXtfg1sO",
      "descriptiveId": "dual_tone_toggle",
      "name": "Dual Tone Toggle",
      "description": "Faith + Marketplace tone switching capability",
      "price": 40,
      "category": "customization"
    },
    "memory_engine": {
      "featureId": "feat_memory_engine",
      "priceId": "price_1Rr4m0GMSZjMrbvltFaHJ8GA",
      "descriptiveId": "memory_engine",
      "name": "Memory Engine",
      "description": "Custom trained FAQ and conversation memory system",
      "price": 125,
      "category": "ai"
    },
    "embed_service": {
      "featureId": "feat_embed_service",
      "priceId": "price_1Rr4m1GMSZjMrbvlPhQkRx5G",
      "descriptiveId": "embed_service",
      "name": "Embed Service",
      "description": "Professional installation and embedding service",
      "price": 60,
      "category": "service"
    },
    "basic_analytics": {
      "featureId": "feat_basic_analytics",
      "priceId": "price_1Rr4m2GMSZjMrbvlbyLjTQbc",
      "descriptiveId": "basic_analytics",
      "name": "Basic Analytics",
      "description": "Google Tag, Zapier, and analytics integration",
      "price": 100,
      "category": "analytics"
    },
    "legal_compliance": {
      "featureId": "feat_legal_compliance",
      "priceId": "price_1Rr4m2GMSZjMrbvlEihXMSmJ",
      "descriptiveId": "legal_compliance",
      "name": "Legal & Compliance",
      "description": "Legal disclaimers and compliance documentation",
      "price": 30,
      "category": "legal"
    },
    "stripe_zapier_setup": {
      "featureId": "feat_payment_email_automation_setup",
      "priceId": "price_1Rr4m3GMSZjMrbvlyoFSuUcC",
      "descriptiveId": "stripe_zapier_setup",
      "name": "Stripe/Zapier Setup",
      "description": "Payment processor and automation setup service",
      "price": 125,
      "category": "integration"
    }
  }
};

// Helper functions for working with Stripe features
export function getFeatureByDescriptiveId(descriptiveId: string): StripeFeature | null {
  return STRIPE_FEATURES.features[descriptiveId] || null;
}

export function getFeatureByName(featureName: string): StripeFeature | null {
  const allFeatures = Object.values(STRIPE_FEATURES.features);
  return allFeatures.find(feature => feature.name === featureName) || null;
}

export function getFeaturesByCategory(category: string): StripeFeature[] {
  const allFeatures = Object.values(STRIPE_FEATURES.features);
  return allFeatures.filter(feature => feature.category === category);
}

export function getAllFeatureIds(): string[] {
  return Object.values(STRIPE_FEATURES.features).map(feature => feature.featureId);
}

export function getAllPriceIds(): string[] {
  return Object.values(STRIPE_FEATURES.features).map(feature => feature.priceId);
}

// Feature categories for easy filtering
export const FEATURE_CATEGORIES = {
  CUSTOMIZATION: 'customization',
  INTEGRATION: 'integration',
  AI: 'ai',
  SERVICE: 'service',
  ANALYTICS: 'analytics',
  LEGAL: 'legal'
} as const;

// Recommended feature mappings for each bot
export const BOT_FEATURE_MAPPINGS = {
  'sales-assistant-bot': [
    'custom_branding',
    'voicebot_integration',
    'memory_engine',
    'basic_analytics'
  ],
  'lead-generation-bot': [
    'custom_branding',
    'dual_tone_toggle',
    'memory_engine',
    'basic_analytics'
  ],
  'customer-support-bot': [
    'custom_branding',
    'voicebot_integration',
    'memory_engine',
    'embed_service',
    'basic_analytics'
  ],
  'faith-bot': [
    'custom_branding',
    'dual_tone_toggle',
    'memory_engine',
    'legal_compliance'
  ],
  'enhanced-sales-bot': [
    'custom_branding',
    'voicebot_integration',
    'memory_engine',
    'basic_analytics',
    'stripe_zapier_setup'
  ]
} as const;

// Helper function to get recommended features for a bot
export function getRecommendedFeaturesForBot(botId: string): StripeFeature[] {
  const featureIds = BOT_FEATURE_MAPPINGS[botId as keyof typeof BOT_FEATURE_MAPPINGS] || [];
  return featureIds.map(id => getFeatureByDescriptiveId(id)).filter(Boolean) as StripeFeature[];
}

// ✅ CONFIGURATION UPDATED WITH ACTUAL FEATURE IDs
// Based on Stripe Dashboard lookup keys:
// - custom-branding → feat_custom_branding
// - voicebot-integration → feat_voicebot_integration
// - dual-tone-toggle → feat_dual_tone_toggle
// - memory-engine → feat_memory_engine
// - embed-service → feat_embed_service
// - basic-analytics → feat_basic_analytics
// - legal-&-compliance → feat_legal_compliance
// - payment/email-automation-setup → feat_payment_email_automation_setup 
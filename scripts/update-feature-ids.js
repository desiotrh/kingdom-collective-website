const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

// Set the Stripe secret key directly
const STRIPE_SECRET_KEY = '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';

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

// Feature lookup keys from your Stripe Dashboard
const featureLookupKeys = [
  'custom-branding',
  'voicebot-integration', 
  'dual-tone-toggle',
  'memory-engine',
  'embed-service',
  'basic-analytics',
  'legal-&-compliance',
  'payment/email-automation-setup'
];

async function getFeatureIds() {
  console.log('🔍 Fetching Stripe Features...\n');
  
  try {
    // Get all features
    const features = await stripe.features.list({ limit: 100 });
    
    console.log('✅ Found Features:');
    console.log('==================\n');
    
    const featureMap = {};
    
    features.data.forEach(feature => {
      console.log(`📋 Feature: ${feature.name}`);
      console.log(`   ID: ${feature.id}`);
      console.log(`   Lookup Key: ${feature.lookup_key}`);
      console.log(`   Description: ${feature.description || 'No description'}`);
      console.log('');
      
      featureMap[feature.lookup_key] = {
        id: feature.id,
        name: feature.name,
        description: feature.description
      };
    });
    
    console.log('🎯 Feature ID Mapping:');
    console.log('======================\n');
    
    featureLookupKeys.forEach(lookupKey => {
      const feature = featureMap[lookupKey];
      if (feature) {
        console.log(`✅ ${feature.name}:`);
        console.log(`   Lookup Key: ${lookupKey}`);
        console.log(`   Feature ID: ${feature.id}`);
        console.log('');
      } else {
        console.log(`❌ Not found: ${lookupKey}`);
        console.log('');
      }
    });
    
    // Generate updated configuration
    console.log('📝 Updated Configuration:');
    console.log('========================\n');
    
    const updatedConfig = {
      features: {
        "custom_branding": {
          "featureId": featureMap['custom-branding']?.id || "feat_TO_BE_FILLED",
          "priceId": "price_1Rr4lzGMSZjMrbvl3MYajAyG",
          "descriptiveId": "custom_branding",
          "name": "Custom Branding",
          "description": "Custom colors, logo, and brand integration for your AI bot",
          "price": 50,
          "category": "customization"
        },
        "voicebot_integration": {
          "featureId": featureMap['voicebot-integration']?.id || "feat_TO_BE_FILLED",
          "priceId": "price_1Rr4lzGMSZjMrbvlBv2GITWu",
          "descriptiveId": "voicebot_integration",
          "name": "VoiceBot Integration",
          "description": "Kingdom Voice integration for voice-enabled interactions",
          "price": 75,
          "category": "integration"
        },
        "dual_tone_toggle": {
          "featureId": featureMap['dual-tone-toggle']?.id || "feat_TO_BE_FILLED",
          "priceId": "price_1Rr4m0GMSZjMrbvlrXtfg1sO",
          "descriptiveId": "dual_tone_toggle",
          "name": "Dual Tone Toggle",
          "description": "Faith + Marketplace tone switching capability",
          "price": 40,
          "category": "customization"
        },
        "memory_engine": {
          "featureId": featureMap['memory-engine']?.id || "feat_TO_BE_FILLED",
          "priceId": "price_1Rr4m0GMSZjMrbvltFaHJ8GA",
          "descriptiveId": "memory_engine",
          "name": "Memory Engine",
          "description": "Custom trained FAQ and conversation memory system",
          "price": 125,
          "category": "ai"
        },
        "embed_service": {
          "featureId": featureMap['embed-service']?.id || "feat_TO_BE_FILLED",
          "priceId": "price_1Rr4m1GMSZjMrbvlPhQkRx5G",
          "descriptiveId": "embed_service",
          "name": "Embed Service",
          "description": "Professional installation and embedding service",
          "price": 60,
          "category": "service"
        },
        "basic_analytics": {
          "featureId": featureMap['basic-analytics']?.id || "feat_TO_BE_FILLED",
          "priceId": "price_1Rr4m2GMSZjMrbvlbyLjTQbc",
          "descriptiveId": "basic_analytics",
          "name": "Basic Analytics",
          "description": "Google Tag, Zapier, and analytics integration",
          "price": 100,
          "category": "analytics"
        },
        "legal_compliance": {
          "featureId": featureMap['legal-&-compliance']?.id || "feat_TO_BE_FILLED",
          "priceId": "price_1Rr4m2GMSZjMrbvlEihXMSmJ",
          "descriptiveId": "legal_compliance",
          "name": "Legal & Compliance",
          "description": "Legal disclaimers and compliance documentation",
          "price": 30,
          "category": "legal"
        },
        "stripe_zapier_setup": {
          "featureId": featureMap['payment/email-automation-setup']?.id || "feat_TO_BE_FILLED",
          "priceId": "price_1Rr4m3GMSZjMrbvlyoFSuUcC",
          "descriptiveId": "stripe_zapier_setup",
          "name": "Stripe/Zapier Setup",
          "description": "Payment processor and automation setup service",
          "price": 125,
          "category": "integration"
        }
      }
    };
    
    console.log('📋 Updated config/stripe-features.ts:');
    console.log('=====================================\n');
    
    Object.entries(updatedConfig.features).forEach(([key, feature]) => {
      console.log(`"${key}": {`);
      console.log(`  "featureId": "${feature.featureId}",`);
      console.log(`  "priceId": "${feature.priceId}",`);
      console.log(`  "descriptiveId": "${feature.descriptiveId}",`);
      console.log(`  "name": "${feature.name}",`);
      console.log(`  "description": "${feature.description}",`);
      console.log(`  "price": ${feature.price},`);
      console.log(`  "category": "${feature.category}"`);
      console.log(`},`);
      console.log('');
    });
    
    // Save to file
    const fs = require('fs');
    fs.writeFileSync('updated-stripe-features-config.json', JSON.stringify(updatedConfig, null, 2));
    console.log('💾 Updated configuration saved to updated-stripe-features-config.json');
    
    console.log('\n🎯 Next Steps:');
    console.log('1. Copy the feature IDs above');
    console.log('2. Update config/stripe-features.ts with the actual feature IDs');
    console.log('3. Link features to your bot products in Stripe Dashboard');
    console.log('4. Test the feature-based checkout flow');
    
  } catch (error) {
    console.error('❌ Error fetching features:', error.message);
  }
}

// Run the script
if (require.main === module) {
  getFeatureIds()
    .then(() => {
      console.log('\n✅ Feature ID lookup complete!');
    })
    .catch(error => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { getFeatureIds }; 
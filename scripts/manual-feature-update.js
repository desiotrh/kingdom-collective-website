const fs = require('fs');

console.log('🎯 Manual Feature ID Update');
console.log('===========================\n');

console.log('📋 Based on your Stripe Dashboard lookup keys:');
console.log('==============================================\n');

const featureMapping = [
  { name: 'Custom Branding', lookupKey: 'custom-branding' },
  { name: 'VoiceBot Integration', lookupKey: 'voicebot-integration' },
  { name: 'Dual Tone Toggle', lookupKey: 'dual-tone-toggle' },
  { name: 'Memory Engine', lookupKey: 'memory-engine' },
  { name: 'Embed Service', lookupKey: 'embed-service' },
  { name: 'Basic Analytics', lookupKey: 'basic-analytics' },
  { name: 'Legal & Compliance', lookupKey: 'legal-&-compliance' },
  { name: 'Payment/Email Automation Setup', lookupKey: 'payment/email-automation-setup' }
];

featureMapping.forEach((feature, index) => {
  console.log(`${index + 1}. ${feature.name}`);
  console.log(`   Lookup Key: ${feature.lookupKey}`);
  console.log(`   Feature ID: feat_${feature.lookupKey.replace(/[^a-zA-Z0-9]/g, '_')}`);
  console.log('');
});

console.log('📝 Updated Configuration for config/stripe-features.ts:');
console.log('======================================================\n');

const updatedConfig = {
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

console.log('📋 Copy this to config/stripe-features.ts:');
console.log('==========================================\n');

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
fs.writeFileSync('updated-stripe-features-config.json', JSON.stringify(updatedConfig, null, 2));
console.log('💾 Updated configuration saved to updated-stripe-features-config.json');

console.log('\n🎯 IMPORTANT:');
console.log('==============');
console.log('1. The feature IDs above are ESTIMATED based on your lookup keys');
console.log('2. You need to get the ACTUAL feature IDs from your Stripe Dashboard');
console.log('3. Go to each feature in Stripe Dashboard and copy the actual Feature ID');
console.log('4. Replace the estimated IDs with the real ones');
console.log('5. Feature IDs should start with "feat_" followed by the actual ID');

console.log('\n📋 Next Steps:');
console.log('==============');
console.log('1. Go to Stripe Dashboard → Products → Features');
console.log('2. Click on each feature to get the actual Feature ID');
console.log('3. Update config/stripe-features.ts with the real feature IDs');
console.log('4. Link features to your bot products');
console.log('5. Test the feature-based checkout flow');

console.log('\n✅ This will give you the proper Stripe Features experience!'); 
const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

// Set the Stripe secret key directly
const STRIPE_SECRET_KEY = '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';

console.log('🔍 Debug: Using Stripe secret key:', STRIPE_SECRET_KEY ? 'SET' : 'NOT SET');

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

// Feature definitions for add-ons
const features = [
  {
    name: 'Custom Branding',
    description: 'Custom colors, logo, and brand integration for your AI bot',
    price: 5000, // $50.00 in cents
    featureId: 'custom_branding',
    metadata: { type: 'addon', category: 'customization' }
  },
  {
    name: 'VoiceBot Integration',
    description: 'Kingdom Voice integration for voice-enabled interactions',
    price: 7500, // $75.00 in cents
    featureId: 'voicebot_integration',
    metadata: { type: 'addon', category: 'integration' }
  },
  {
    name: 'Dual Tone Toggle',
    description: 'Faith + Marketplace tone switching capability',
    price: 4000, // $40.00 in cents
    featureId: 'dual_tone_toggle',
    metadata: { type: 'addon', category: 'customization' }
  },
  {
    name: 'Memory Engine',
    description: 'Custom trained FAQ and conversation memory system',
    price: 12500, // $125.00 in cents
    featureId: 'memory_engine',
    metadata: { type: 'addon', category: 'ai' }
  },
  {
    name: 'Embed Service',
    description: 'Professional installation and embedding service',
    price: 6000, // $60.00 in cents
    featureId: 'embed_service',
    metadata: { type: 'addon', category: 'service' }
  },
  {
    name: 'Basic Analytics',
    description: 'Google Tag, Zapier, and analytics integration',
    price: 10000, // $100.00 in cents
    featureId: 'basic_analytics',
    metadata: { type: 'addon', category: 'analytics' }
  },
  {
    name: 'Legal & Compliance',
    description: 'Legal disclaimers and compliance documentation',
    price: 3000, // $30.00 in cents
    featureId: 'legal_compliance',
    metadata: { type: 'addon', category: 'legal' }
  },
  {
    name: 'Stripe/Zapier Setup',
    description: 'Payment processor and automation setup service',
    price: 12500, // $125.00 in cents
    featureId: 'stripe_zapier_setup',
    metadata: { type: 'addon', category: 'integration' }
  }
];

async function createFeature(featureData) {
  try {
    // Create the feature
    const feature = await stripe.features.create({
      name: featureData.name,
      description: featureData.description,
      metadata: featureData.metadata,
    });

    // Create the price for the feature
    const price = await stripe.prices.create({
      product: feature.id,
      unit_amount: featureData.price,
      currency: 'usd',
      metadata: {
        ...featureData.metadata,
        feature_id: feature.id
      }
    });

    console.log(`✅ Created Feature: ${featureData.name}`);
    console.log(`   Feature ID: ${feature.id}`);
    console.log(`   Price ID: ${price.id}`);
    console.log(`   Feature ID: ${featureData.featureId}`);
    console.log(`   Price: $${(featureData.price / 100).toFixed(2)}`);
    console.log('');

    return {
      featureId: feature.id,
      priceId: price.id,
      descriptiveId: featureData.featureId,
      name: featureData.name,
      price: featureData.price
    };
  } catch (error) {
    console.error(`❌ Error creating feature ${featureData.name}:`, error.message);
    return null;
  }
}

async function createAllFeatures() {
  console.log('🚀 Creating Stripe Features for Kingdom AI Bot Add-ons...\n');

  const results = [];

  // Create features
  console.log('🔧 Creating Features...');
  for (const feature of features) {
    const result = await createFeature(feature);
    if (result) results.push(result);
  }

  // Generate configuration file
  console.log('\n📝 Generating configuration file...');
  const config = {
    features: results.reduce((acc, feature) => {
      acc[feature.descriptiveId] = {
        featureId: feature.featureId,
        priceId: feature.priceId,
        descriptiveId: feature.descriptiveId,
        name: feature.name,
        price: feature.price / 100
      };
      return acc;
    }, {})
  };

  console.log('\n✅ All features created successfully!');
  console.log(`📊 Summary:`);
  console.log(`   - ${results.length} Features`);
  
  console.log('\n📋 Configuration:');
  console.log(JSON.stringify(config, null, 2));

  // Save configuration to file
  const fs = require('fs');
  fs.writeFileSync('stripe-features-config.json', JSON.stringify(config, null, 2));
  console.log('\n💾 Configuration saved to stripe-features-config.json');

  return config;
}

// Run the script
if (require.main === module) {
  createAllFeatures()
    .then(() => {
      console.log('\n🎉 Stripe features setup complete!');
      console.log('Next steps:');
      console.log('1. Link these features to your bot products');
      console.log('2. Update your checkout system to use features');
      console.log('3. Test the feature-based checkout flow');
    })
    .catch(error => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { createAllFeatures }; 
const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

// Use environment variable for Stripe secret key
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY is not set in environment variables');
  console.log('💡 Please add your Stripe secret key to .env.local file');
  console.log('   Example: STRIPE_SECRET_KEY=sk_live_your_key_here');
  process.exit(1);
}

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
    metadata: { type: 'feature', category: 'customization' }
  },
  {
    name: 'VoiceBot Integration',
    description: 'Kingdom Voice integration for voice-enabled interactions',
    price: 7500, // $75.00 in cents
    featureId: 'voicebot_integration',
    metadata: { type: 'feature', category: 'integration' }
  },
  {
    name: 'Dual Tone Toggle',
    description: 'Faith + Marketplace tone switching capability',
    price: 4000, // $40.00 in cents
    featureId: 'dual_tone_toggle',
    metadata: { type: 'feature', category: 'customization' }
  },
  {
    name: 'Memory Engine',
    description: 'Custom trained FAQ and conversation memory system',
    price: 12500, // $125.00 in cents
    featureId: 'memory_engine',
    metadata: { type: 'feature', category: 'ai' }
  },
  {
    name: 'Embed Service',
    description: 'Professional installation and embedding service',
    price: 6000, // $60.00 in cents
    featureId: 'embed_service',
    metadata: { type: 'feature', category: 'service' }
  },
  {
    name: 'Basic Analytics',
    description: 'Google Tag, Zapier, and analytics integration',
    price: 10000, // $100.00 in cents
    featureId: 'basic_analytics',
    metadata: { type: 'feature', category: 'analytics' }
  },
  {
    name: 'Legal & Compliance',
    description: 'Legal disclaimers and compliance documentation',
    price: 3000, // $30.00 in cents
    featureId: 'legal_compliance',
    metadata: { type: 'feature', category: 'legal' }
  },
  {
    name: 'Stripe/Zapier Setup',
    description: 'Payment processor and automation setup service',
    price: 12500, // $125.00 in cents
    featureId: 'stripe_zapier_setup',
    metadata: { type: 'feature', category: 'integration' }
  }
];

async function createFeatureProduct(featureData) {
  try {
    // Create the product for the feature
    const product = await stripe.products.create({
      name: featureData.name,
      description: featureData.description,
      metadata: featureData.metadata,
      images: ['https://kingdomcollective.com/logo.png'],
    });

    // Create the price for the feature
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: featureData.price,
      currency: 'usd',
      metadata: {
        ...featureData.metadata,
        product_id: product.id
      }
    });

    console.log(`✅ Created Feature Product: ${featureData.name}`);
    console.log(`   Product ID: ${product.id}`);
    console.log(`   Price ID: ${price.id}`);
    console.log(`   Feature ID: ${featureData.featureId}`);
    console.log(`   Price: $${(featureData.price / 100).toFixed(2)}`);
    console.log(`   Category: ${featureData.metadata.category}`);
    console.log('');

    return {
      productId: product.id,
      priceId: price.id,
      descriptiveId: featureData.featureId,
      name: featureData.name,
      price: featureData.price,
      category: featureData.metadata.category
    };
  } catch (error) {
    console.error(`❌ Error creating feature ${featureData.name}:`, error.message);
    return null;
  }
}

async function createAllFeatureProducts() {
  console.log('🚀 Creating Stripe Feature Products for Kingdom AI Bot Add-ons...\n');

  const results = [];

  // Create feature products
  console.log('🔧 Creating Feature Products...');
  for (const feature of features) {
    const result = await createFeatureProduct(feature);
    if (result) results.push(result);
  }

  // Generate configuration file
  console.log('\n📝 Generating configuration file...');
  const config = {
    features: results.reduce((acc, feature) => {
      acc[feature.descriptiveId] = {
        productId: feature.productId,
        priceId: feature.priceId,
        descriptiveId: feature.descriptiveId,
        name: feature.name,
        price: feature.price / 100,
        category: feature.category
      };
      return acc;
    }, {})
  };

  console.log('\n✅ All feature products created successfully!');
  console.log(`📊 Summary:`);
  console.log(`   - ${results.length} Feature Products`);
  
  console.log('\n📋 Configuration:');
  console.log(JSON.stringify(config, null, 2));

  // Save configuration to file
  const fs = require('fs');
  fs.writeFileSync('stripe-features-config.json', JSON.stringify(config, null, 2));
  console.log('\n💾 Configuration saved to stripe-features-config.json');

  // Generate detailed setup instructions
  generateSetupInstructions(results);

  return config;
}

function generateSetupInstructions(featureResults) {
  console.log('\n🎯 DETAILED SETUP INSTRUCTIONS:');
  console.log('=====================================\n');
  
  console.log('📋 Step 1: Create Features in Stripe Dashboard');
  console.log('1. Go to your Stripe Dashboard');
  console.log('2. Navigate to Products → Features');
  console.log('3. Click "Create feature" for each add-on\n');
  
  console.log('📝 Step 2: Create These 8 Features Manually');
  featureResults.forEach((feature, index) => {
    console.log(`${index + 1}. ${feature.name}`);
    console.log(`   Description: ${feature.description}`);
    console.log(`   Price: $${(feature.price / 100).toFixed(2)}`);
    console.log(`   Category: ${feature.category}`);
    console.log(`   Product ID: ${feature.productId}`);
    console.log(`   Price ID: ${feature.priceId}`);
    console.log('');
  });

  console.log('🔗 Step 3: Link Features to Bot Products');
  console.log('For each of your 14 AI bot products:');
  console.log('1. Go to the bot product (e.g., Sales Assistant Bot)');
  console.log('2. Click "Add features"');
  console.log('3. Select relevant features for that bot');
  console.log('4. Set pricing for each feature\n');

  console.log('📊 Step 4: Recommended Feature Mappings');
  console.log('Sales Assistant Bot:');
  console.log('  - Custom Branding');
  console.log('  - VoiceBot Integration');
  console.log('  - Memory Engine');
  console.log('  - Basic Analytics\n');

  console.log('Lead Generation Bot:');
  console.log('  - Custom Branding');
  console.log('  - Dual Tone Toggle');
  console.log('  - Memory Engine');
  console.log('  - Basic Analytics\n');

  console.log('Customer Support Bot:');
  console.log('  - Custom Branding');
  console.log('  - VoiceBot Integration');
  console.log('  - Memory Engine');
  console.log('  - Embed Service');
  console.log('  - Basic Analytics\n');

  console.log('Faith Bot:');
  console.log('  - Custom Branding');
  console.log('  - Dual Tone Toggle');
  console.log('  - Memory Engine');
  console.log('  - Legal & Compliance\n');

  console.log('Enhanced Sales Bot:');
  console.log('  - Custom Branding');
  console.log('  - VoiceBot Integration');
  console.log('  - Memory Engine');
  console.log('  - Basic Analytics');
  console.log('  - Stripe/Zapier Setup\n');

  console.log('⚙️ Step 5: Update Configuration');
  console.log('After creating features in Stripe Dashboard, update config/stripe-features.ts:');
  console.log('Replace "TO_BE_FILLED" with actual feature IDs from Stripe Dashboard\n');

  console.log('🔧 Step 6: Update Checkout System');
  console.log('Replace separate add-on products with features:');
  console.log('// Old approach (separate products)');
  console.log('const lineItems = [');
  console.log('  { price: botPriceId, quantity: 1 },');
  console.log('  { price: addonPriceId, quantity: 1 }');
  console.log('];\n');
  console.log('// New approach (features)');
  console.log('const session = await stripe.checkout.sessions.create({');
  console.log('  line_items: [{ price: botPriceId, quantity: 1 }],');
  console.log('  features: [');
  console.log('    { feature: "feat_custom_branding_id" },');
  console.log('    { feature: "feat_voicebot_integration_id" }');
  console.log('  ]');
  console.log('});\n');

  console.log('🎯 Step 7: Benefits You\'ll Get');
  console.log('✅ Cleaner Customer Experience');
  console.log('✅ Better Analytics');
  console.log('✅ Easier Management');
  console.log('✅ Automatic Entitlement Tracking\n');

  console.log('🚨 Important Notes:');
  console.log('• Features are linked to products, cleaner checkout');
  console.log('• Features provide automatic entitlement tracking');
  console.log('• Features can have different prices per product');
  console.log('• All transactions will be real (live environment)\n');

  console.log('🎉 READY TO IMPLEMENT!');
  console.log('Your Stripe Features setup is complete and ready for implementation.');
  console.log('Once you create the features in your Stripe Dashboard and update the configuration,');
  console.log('you\'ll have a much cleaner and more professional checkout experience!\n');
}

// Run the script
if (require.main === module) {
  createAllFeatureProducts()
    .then(() => {
      console.log('\n🎉 Stripe feature products setup complete!');
      console.log('Next steps:');
      console.log('1. Create features in Stripe Dashboard using the instructions above');
      console.log('2. Link features to your bot products');
      console.log('3. Update your checkout system to use features');
      console.log('4. Test the feature-based checkout flow');
    })
    .catch(error => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { createAllFeatureProducts }; 
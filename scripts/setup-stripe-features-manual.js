const fs = require('fs');

// Feature definitions for add-ons
const features = [
  {
    name: 'Custom Branding',
    description: 'Custom colors, logo, and brand integration for your AI bot',
    price: 50,
    featureId: 'custom_branding',
    category: 'customization'
  },
  {
    name: 'VoiceBot Integration',
    description: 'Kingdom Voice integration for voice-enabled interactions',
    price: 75,
    featureId: 'voicebot_integration',
    category: 'integration'
  },
  {
    name: 'Dual Tone Toggle',
    description: 'Faith + Marketplace tone switching capability',
    price: 40,
    featureId: 'dual_tone_toggle',
    category: 'customization'
  },
  {
    name: 'Memory Engine',
    description: 'Custom trained FAQ and conversation memory system',
    price: 125,
    featureId: 'memory_engine',
    category: 'ai'
  },
  {
    name: 'Embed Service',
    description: 'Professional installation and embedding service',
    price: 60,
    featureId: 'embed_service',
    category: 'service'
  },
  {
    name: 'Basic Analytics',
    description: 'Google Tag, Zapier, and analytics integration',
    price: 100,
    featureId: 'basic_analytics',
    category: 'analytics'
  },
  {
    name: 'Legal & Compliance',
    description: 'Legal disclaimers and compliance documentation',
    price: 30,
    featureId: 'legal_compliance',
    category: 'legal'
  },
  {
    name: 'Stripe/Zapier Setup',
    description: 'Payment processor and automation setup service',
    price: 125,
    featureId: 'stripe_zapier_setup',
    category: 'integration'
  }
];

function generateSetupInstructions() {
  console.log('🚀 Stripe Features Setup Instructions for Kingdom AI Bots\n');
  
  console.log('📋 Manual Setup Steps:');
  console.log('1. Go to your Stripe Dashboard');
  console.log('2. Navigate to Products → Features');
  console.log('3. Create the following features:\n');
  
  features.forEach((feature, index) => {
    console.log(`${index + 1}. ${feature.name}`);
    console.log(`   Description: ${feature.description}`);
    console.log(`   Price: $${feature.price}`);
    console.log(`   Category: ${feature.category}`);
    console.log(`   Feature ID: ${feature.featureId}`);
    console.log('');
  });
  
  console.log('🔗 Linking Features to Products:');
  console.log('1. Go to each bot product (Sales Assistant Bot, etc.)');
  console.log('2. Click "Add features"');
  console.log('3. Select the relevant features for each bot');
  console.log('4. Set pricing for each feature');
  console.log('');
  
  console.log('📝 Feature Configuration Template:');
  console.log('Use this template to track your feature IDs:');
  
  const template = {
    features: features.reduce((acc, feature) => {
      acc[feature.featureId] = {
        name: feature.name,
        description: feature.description,
        price: feature.price,
        category: feature.category,
        featureId: 'TO_BE_FILLED', // Fill this in after creating in Stripe
        priceId: 'TO_BE_FILLED'    // Fill this in after creating in Stripe
      };
      return acc;
    }, {})
  };
  
  console.log(JSON.stringify(template, null, 2));
  
  // Save template to file
  fs.writeFileSync('stripe-features-template.json', JSON.stringify(template, null, 2));
  console.log('\n💾 Template saved to stripe-features-template.json');
  
  console.log('\n🎯 Next Steps:');
  console.log('1. Create features in Stripe Dashboard');
  console.log('2. Update the template with actual feature IDs');
  console.log('3. Link features to your bot products');
  console.log('4. Update your checkout system to use features');
}

// Run the script
if (require.main === module) {
  generateSetupInstructions();
}

module.exports = { features, generateSetupInstructions }; 
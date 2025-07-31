const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

// Use environment variable for Stripe secret key
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY is not set in environment variables');
  process.exit(1);
}

console.log('🔍 Debug: Using Stripe secret key:', STRIPE_SECRET_KEY ? 'SET' : 'NOT SET');

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

// Bot products to create
const botProducts = [
  {
    name: 'Sales Assistant Bot',
    description: 'AI-powered sales assistant for lead qualification and customer engagement',
    price: 29900, // $299.00 in cents
    productId: 'sales_assistant_bot',
    priceId: 'price_sales_assistant_bot'
  },
  {
    name: 'Lead Generation Bot',
    description: 'Automated lead generation and qualification system',
    price: 39900, // $399.00 in cents
    productId: 'lead_generation_bot',
    priceId: 'price_lead_generation_bot'
  },
  {
    name: 'Customer Support Bot',
    description: '24/7 customer support and FAQ automation',
    price: 24900, // $249.00 in cents
    productId: 'customer_support_bot',
    priceId: 'price_customer_support_bot'
  },
  {
    name: 'Faith Bot',
    description: 'Spiritual guidance and faith-based conversation AI',
    price: 19900, // $199.00 in cents
    productId: 'faith_bot',
    priceId: 'price_faith_bot'
  },
  {
    name: 'Enhanced Sales Bot',
    description: 'Advanced sales automation with CRM integration',
    price: 49900, // $499.00 in cents
    productId: 'enhanced_sales_bot',
    priceId: 'price_enhanced_sales_bot'
  },
  {
    name: 'Appointment Booking Bot',
    description: 'Automated appointment scheduling and calendar management',
    price: 34900, // $349.00 in cents
    productId: 'appointment_booking_bot',
    priceId: 'price_appointment_booking_bot'
  },
  {
    name: 'FAQ & Knowledge Base Bot',
    description: 'Intelligent FAQ system with knowledge base management',
    price: 19900, // $199.00 in cents
    productId: 'faq_knowledge_bot',
    priceId: 'price_faq_knowledge_bot'
  },
  {
    name: 'Event Management Bot',
    description: 'Event planning and management automation',
    price: 39900, // $399.00 in cents
    productId: 'event_management_bot',
    priceId: 'price_event_management_bot'
  },
  {
    name: 'Inventory Management Bot',
    description: 'Real-time inventory tracking and management',
    price: 29900, // $299.00 in cents
    productId: 'inventory_management_bot',
    priceId: 'price_inventory_management_bot'
  },
  {
    name: 'Social Media Management Bot',
    description: 'Automated social media posting and engagement',
    price: 24900, // $249.00 in cents
    productId: 'social_media_bot',
    priceId: 'price_social_media_bot'
  },
  {
    name: 'Course Explainer Bot',
    description: 'Educational content delivery and course management',
    price: 19900, // $199.00 in cents
    productId: 'course_explainer_bot',
    priceId: 'price_course_explainer_bot'
  },
  {
    name: 'Testimonial Bot',
    description: 'Automated testimonial collection and management',
    price: 14900, // $149.00 in cents
    productId: 'testimonial_bot',
    priceId: 'price_testimonial_bot'
  },
  {
    name: 'Job Application Bot',
    description: 'Automated job application processing and screening',
    price: 29900, // $299.00 in cents
    productId: 'job_application_bot',
    priceId: 'price_job_application_bot'
  },
  {
    name: 'Onboarding Bot',
    description: 'Automated customer and employee onboarding',
    price: 19900, // $199.00 in cents
    productId: 'onboarding_bot',
    priceId: 'price_onboarding_bot'
  }
];

// Add-on products to create
const addOnProducts = [
  {
    name: 'Custom Branding',
    description: 'Custom colors, logo, and brand integration for your AI bot',
    price: 5000, // $50.00 in cents
    productId: 'custom_branding_addon',
    priceId: 'price_custom_branding_addon'
  },
  {
    name: 'VoiceBot Integration',
    description: 'Kingdom Voice integration for voice-enabled interactions',
    price: 7500, // $75.00 in cents
    productId: 'voicebot_integration_addon',
    priceId: 'price_voicebot_integration_addon'
  },
  {
    name: 'Dual Tone Toggle',
    description: 'Faith + Marketplace tone switching capability',
    price: 4000, // $40.00 in cents
    productId: 'dual_tone_toggle_addon',
    priceId: 'price_dual_tone_toggle_addon'
  },
  {
    name: 'Memory Engine',
    description: 'Custom trained FAQ and conversation memory system',
    price: 12500, // $125.00 in cents
    productId: 'memory_engine_addon',
    priceId: 'price_memory_engine_addon'
  },
  {
    name: 'Embed Service',
    description: 'Professional installation and embedding service',
    price: 6000, // $60.00 in cents
    productId: 'embed_service_addon',
    priceId: 'price_embed_service_addon'
  },
  {
    name: 'Basic Analytics',
    description: 'Google Tag, Zapier, and analytics integration',
    price: 10000, // $100.00 in cents
    productId: 'basic_analytics_addon',
    priceId: 'price_basic_analytics_addon'
  },
  {
    name: 'Legal & Compliance',
    description: 'Legal disclaimers and compliance documentation',
    price: 3000, // $30.00 in cents
    productId: 'legal_compliance_addon',
    priceId: 'price_legal_compliance_addon'
  },
  {
    name: 'Stripe/Zapier Setup',
    description: 'Payment processor and automation setup service',
    price: 12500, // $125.00 in cents
    productId: 'stripe_zapier_setup_addon',
    priceId: 'price_stripe_zapier_setup_addon'
  }
];

// Bundle products to create
const bundleProducts = [
  {
    name: 'Starter Bot Bundle',
    description: 'Perfect starter package with 3 essential bots',
    price: 79900, // $799.00 in cents
    productId: 'starter_bot_bundle',
    priceId: 'price_starter_bot_bundle'
  },
  {
    name: 'Professional Bot Bundle',
    description: 'Complete business automation with 5 premium bots',
    price: 149900, // $1,499.00 in cents
    productId: 'professional_bot_bundle',
    priceId: 'price_professional_bot_bundle'
  },
  {
    name: 'Enterprise Bot Suite',
    description: 'Full enterprise solution with all bots and premium add-ons',
    price: 299900, // $2,999.00 in cents
    productId: 'enterprise_bot_suite',
    priceId: 'price_enterprise_bot_suite'
  }
];

async function createProduct(productData) {
  try {
    // Create the product
    const product = await stripe.products.create({
      name: productData.name,
      description: productData.description,
      images: ['https://kingdomcollective.com/logo.png'],
    });

    // Create the price
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: productData.price,
      currency: 'usd',
    });

    console.log(`✅ Created: ${productData.name}`);
    console.log(`   Product ID: ${product.id}`);
    console.log(`   Price ID: ${price.id}`);
    console.log(`   Price: $${(productData.price / 100).toFixed(2)}`);
    console.log('');

    return {
      productId: product.id,
      priceId: price.id,
      descriptiveId: productData.productId,
      descriptivePriceId: productData.priceId,
      name: productData.name,
      price: productData.price
    };
  } catch (error) {
    console.error(`❌ Error creating ${productData.name}:`, error.message);
    return null;
  }
}

async function createAllProducts() {
  console.log('🚀 Creating Stripe Products for Kingdom AI Bots...\n');

  const results = {
    bots: [],
    addons: [],
    bundles: []
  };

  // Create bot products
  console.log('🤖 Creating Bot Products...');
  for (const bot of botProducts) {
    const result = await createProduct(bot);
    if (result) results.bots.push(result);
  }

  // Create add-on products
  console.log('\n🔧 Creating Add-on Products...');
  for (const addon of addOnProducts) {
    const result = await createProduct(addon);
    if (result) results.addons.push(result);
  }

  // Create bundle products
  console.log('\n📦 Creating Bundle Products...');
  for (const bundle of bundleProducts) {
    const result = await createProduct(bundle);
    if (result) results.bundles.push(result);
  }

  // Generate configuration file
  console.log('\n📝 Generating configuration file...');
  const config = {
    bots: results.bots.reduce((acc, bot) => {
      acc[bot.descriptiveId] = {
        productId: bot.productId,
        priceId: bot.priceId,
        descriptiveId: bot.descriptiveId,
        descriptivePriceId: bot.descriptivePriceId,
        name: bot.name,
        price: bot.price / 100
      };
      return acc;
    }, {}),
    addons: results.addons.reduce((acc, addon) => {
      acc[addon.descriptiveId] = {
        productId: addon.productId,
        priceId: addon.priceId,
        descriptiveId: addon.descriptiveId,
        descriptivePriceId: addon.descriptivePriceId,
        name: addon.name,
        price: addon.price / 100
      };
      return acc;
    }, {}),
    bundles: results.bundles.reduce((acc, bundle) => {
      acc[bundle.descriptiveId] = {
        productId: bundle.productId,
        priceId: bundle.priceId,
        descriptiveId: bundle.descriptiveId,
        descriptivePriceId: bundle.descriptivePriceId,
        name: bundle.name,
        price: bundle.price / 100
      };
      return acc;
    }, {})
  };

  console.log('\n✅ All products created successfully!');
  console.log(`📊 Summary:`);
  console.log(`   - ${results.bots.length} Bot Products`);
  console.log(`   - ${results.addons.length} Add-on Products`);
  console.log(`   - ${results.bundles.length} Bundle Products`);
  
  console.log('\n📋 Configuration:');
  console.log(JSON.stringify(config, null, 2));

  // Save configuration to file
  const fs = require('fs');
  fs.writeFileSync('stripe-products-config.json', JSON.stringify(config, null, 2));
  console.log('\n💾 Configuration saved to stripe-products-config.json');

  return config;
}

// Run the script
if (require.main === module) {
  createAllProducts()
    .then(() => {
      console.log('\n🎉 Stripe products setup complete!');
      console.log('Next steps:');
      console.log('1. Update config/stripe-products.ts with the generated IDs');
      console.log('2. Test the checkout integration');
      console.log('3. Deploy to production');
    })
    .catch(error => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { createAllProducts }; 
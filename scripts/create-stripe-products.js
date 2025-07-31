const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

// Set the Stripe secret key directly
const STRIPE_SECRET_KEY = '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';

console.log('🔍 Debug: Using Stripe secret key:', STRIPE_SECRET_KEY ? 'SET' : 'NOT SET');

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

// AI Bot Products
const botProducts = [
  {
    name: 'Sales Assistant Bot',
    description: 'Advanced AI sales assistant for lead qualification and conversion',
    price: 29900, // $299.00 in cents
    descriptiveId: 'prod_sales_assistant_bot',
    descriptivePriceId: 'price_sales_assistant_bot',
    metadata: { type: 'bot', category: 'sales' }
  },
  {
    name: 'Lead Generation Bot',
    description: 'AI-powered lead generation and qualification system',
    price: 24900, // $249.00 in cents
    descriptiveId: 'prod_lead_generation_bot',
    descriptivePriceId: 'price_lead_generation_bot',
    metadata: { type: 'bot', category: 'marketing' }
  },
  {
    name: 'Onboarding Bot',
    description: 'Automated customer onboarding and training system',
    price: 19900, // $199.00 in cents
    descriptiveId: 'prod_onboarding_bot',
    descriptivePriceId: 'price_onboarding_bot',
    metadata: { type: 'bot', category: 'customer-success' }
  },
  {
    name: 'Customer Support Bot',
    description: '24/7 AI customer support and ticket management',
    price: 34900, // $349.00 in cents
    descriptiveId: 'prod_customer_support_bot',
    descriptivePriceId: 'price_customer_support_bot',
    metadata: { type: 'bot', category: 'support' }
  },
  {
    name: 'Faith Bot',
    description: 'Spiritual guidance and faith-based community AI assistant',
    price: 17900, // $179.00 in cents
    descriptiveId: 'prod_faith_bot',
    descriptivePriceId: 'price_faith_bot',
    metadata: { type: 'bot', category: 'faith' }
  },
  {
    name: 'Course Explainer Bot',
    description: 'AI-powered course content explanation and learning assistant',
    price: 27900, // $279.00 in cents
    descriptiveId: 'prod_course_explainer_bot',
    descriptivePriceId: 'price_course_explainer_bot',
    metadata: { type: 'bot', category: 'education' }
  },
  {
    name: 'Testimonial Bot',
    description: 'Automated testimonial collection and management system',
    price: 15900, // $159.00 in cents
    descriptiveId: 'prod_testimonial_bot',
    descriptivePriceId: 'price_testimonial_bot',
    metadata: { type: 'bot', category: 'marketing' }
  },
  {
    name: 'Job Application Bot',
    description: 'AI-powered job application screening and candidate management',
    price: 22900, // $229.00 in cents
    descriptiveId: 'prod_job_application_bot',
    descriptivePriceId: 'price_job_application_bot',
    metadata: { type: 'bot', category: 'hr' }
  },
  {
    name: 'Enhanced Sales Bot',
    description: 'Premium AI sales assistant with advanced analytics and CRM integration',
    price: 39900, // $399.00 in cents
    descriptiveId: 'prod_enhanced_sales_bot',
    descriptivePriceId: 'price_enhanced_sales_bot',
    metadata: { type: 'bot', category: 'sales' }
  },
  {
    name: 'Appointment Booking Bot',
    description: 'Automated appointment scheduling and calendar management',
    price: 19900, // $199.00 in cents
    descriptiveId: 'prod_appointment_booking_bot',
    descriptivePriceId: 'price_appointment_booking_bot',
    metadata: { type: 'bot', category: 'scheduling' }
  },
  {
    name: 'FAQ & Knowledge Base Bot',
    description: 'AI-powered FAQ system with knowledge base management',
    price: 17900, // $179.00 in cents
    descriptiveId: 'prod_faq_knowledge_base_bot',
    descriptivePriceId: 'price_faq_knowledge_base_bot',
    metadata: { type: 'bot', category: 'support' }
  },
  {
    name: 'Event Management Bot',
    description: 'Complete event planning and management AI assistant',
    price: 29900, // $299.00 in cents
    descriptiveId: 'prod_event_management_bot',
    descriptivePriceId: 'price_event_management_bot',
    metadata: { type: 'bot', category: 'events' }
  },
  {
    name: 'Inventory Management Bot',
    description: 'AI-powered inventory tracking and management system',
    price: 24900, // $249.00 in cents
    descriptiveId: 'prod_inventory_management_bot',
    descriptivePriceId: 'price_inventory_management_bot',
    metadata: { type: 'bot', category: 'retail' }
  },
  {
    name: 'Social Media Management Bot',
    description: 'Automated social media content creation and scheduling',
    price: 27900, // $279.00 in cents
    descriptiveId: 'prod_social_media_management_bot',
    descriptivePriceId: 'price_social_media_management_bot',
    metadata: { type: 'bot', category: 'marketing' }
  }
];

// Add-on Products
const addOnProducts = [
  {
    name: 'Custom Branding',
    description: 'Custom colors, logo, and brand integration',
    price: 5000, // $50.00 in cents
    descriptiveId: 'prod_custom_branding',
    descriptivePriceId: 'price_custom_branding',
    metadata: { type: 'addon', category: 'customization' }
  },
  {
    name: 'VoiceBot Integration',
    description: 'Kingdom Voice integration for voice-enabled interactions',
    price: 7500, // $75.00 in cents
    descriptiveId: 'prod_voicebot_integration',
    descriptivePriceId: 'price_voicebot_integration',
    metadata: { type: 'addon', category: 'integration' }
  },
  {
    name: 'Dual Tone Toggle',
    description: 'Faith + Marketplace tone switching capability',
    price: 4000, // $40.00 in cents
    descriptiveId: 'prod_dual_tone_toggle',
    descriptivePriceId: 'price_dual_tone_toggle',
    metadata: { type: 'addon', category: 'customization' }
  },
  {
    name: 'Memory Engine',
    description: 'Custom trained FAQ and conversation memory system',
    price: 12500, // $125.00 in cents
    descriptiveId: 'prod_memory_engine',
    descriptivePriceId: 'price_memory_engine',
    metadata: { type: 'addon', category: 'ai' }
  },
  {
    name: 'Embed Service',
    description: 'Professional installation and embedding service',
    price: 6000, // $60.00 in cents
    descriptiveId: 'prod_embed_service',
    descriptivePriceId: 'price_embed_service',
    metadata: { type: 'addon', category: 'service' }
  },
  {
    name: 'Basic Analytics',
    description: 'Google Tag, Zapier, and analytics integration',
    price: 10000, // $100.00 in cents
    descriptiveId: 'prod_basic_analytics',
    descriptivePriceId: 'price_basic_analytics',
    metadata: { type: 'addon', category: 'analytics' }
  },
  {
    name: 'Legal & Compliance',
    description: 'Legal disclaimers and compliance documentation',
    price: 3000, // $30.00 in cents
    descriptiveId: 'prod_legal_compliance',
    descriptivePriceId: 'price_legal_compliance',
    metadata: { type: 'addon', category: 'legal' }
  },
  {
    name: 'Stripe/Zapier Setup',
    description: 'Payment processor and automation setup service',
    price: 12500, // $125.00 in cents
    descriptiveId: 'prod_stripe_zapier_setup',
    descriptivePriceId: 'price_stripe_zapier_setup',
    metadata: { type: 'addon', category: 'integration' }
  }
];

// Bundle Products
const bundleProducts = [
  {
    name: 'Sales Suite',
    description: 'Complete sales automation suite: Sales Assistant + Lead Generation + Enhanced Sales',
    price: 79900, // $799.00 in cents
    descriptiveId: 'prod_sales_suite',
    descriptivePriceId: 'price_sales_suite',
    metadata: { type: 'bundle', category: 'sales', bots: 'sales-assistant,lead-generation,enhanced-sales' }
  },
  {
    name: 'Support Suite',
    description: 'Complete customer support suite: Customer Support + Onboarding',
    price: 54900, // $549.00 in cents
    descriptiveId: 'prod_support_suite',
    descriptivePriceId: 'price_support_suite',
    metadata: { type: 'bundle', category: 'support', bots: 'customer-support,onboarding' }
  },
  {
    name: 'Complete Business Suite',
    description: 'Full business automation: Sales + Support + Marketing + HR',
    price: 149900, // $1499.00 in cents
    descriptiveId: 'prod_complete_business_suite',
    descriptivePriceId: 'price_complete_business_suite',
    metadata: { type: 'bundle', category: 'business', bots: 'sales-assistant,lead-generation,customer-support,onboarding,testimonial' }
  }
];

async function createProduct(productData) {
  try {
    // Create the product
    const product = await stripe.products.create({
      name: productData.name,
      description: productData.description,
      metadata: productData.metadata,
      images: ['https://kingdomcollective.com/logo.png'], // Replace with your logo URL
    });

    // Create the price for the product
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: productData.price,
      currency: 'usd',
      metadata: {
        ...productData.metadata,
        product_id: product.id
      }
    });

    console.log(`✅ Created: ${productData.name}`);
    console.log(`   Product ID: ${product.id}`);
    console.log(`   Price ID: ${price.id}`);
    console.log(`   Descriptive ID: ${productData.descriptiveId}`);
    console.log(`   Price: $${(productData.price / 100).toFixed(2)}`);
    console.log('');

    return {
      productId: product.id,
      priceId: price.id,
      descriptiveId: productData.descriptiveId,
      descriptivePriceId: productData.descriptivePriceId,
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
  console.log('📦 Creating AI Bot Products...');
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
      acc[bot.name.toLowerCase().replace(/\s+/g, '-')] = {
        productId: bot.productId,
        priceId: bot.priceId,
        descriptiveId: bot.descriptiveId,
        descriptivePriceId: bot.descriptivePriceId,
        price: bot.price / 100
      };
      return acc;
    }, {}),
    addons: results.addons.reduce((acc, addon) => {
      acc[addon.name.toLowerCase().replace(/\s+/g, '-')] = {
        productId: addon.productId,
        priceId: addon.priceId,
        descriptiveId: addon.descriptiveId,
        descriptivePriceId: addon.descriptivePriceId,
        price: addon.price / 100
      };
      return acc;
    }, {}),
    bundles: results.bundles.reduce((acc, bundle) => {
      acc[bundle.name.toLowerCase().replace(/\s+/g, '-')] = {
        productId: bundle.productId,
        priceId: bundle.priceId,
        descriptiveId: bundle.descriptiveId,
        descriptivePriceId: bundle.descriptivePriceId,
        price: bundle.price / 100
      };
      return acc;
    }, {})
  };

  console.log('\n✅ All products created successfully!');
  console.log(`📊 Summary:`);
  console.log(`   - ${results.bots.length} AI Bots`);
  console.log(`   - ${results.addons.length} Add-ons`);
  console.log(`   - ${results.bundles.length} Bundles`);
  
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
      console.log('1. Update your checkout system to use these product IDs');
      console.log('2. Set up webhook handling for purchase events');
      console.log('3. Configure Beacons email templates with these product IDs');
    })
    .catch(error => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { createAllProducts }; 
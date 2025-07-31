const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

// Use environment variable for Stripe secret key
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY is not set in environment variables');
  process.exit(1);
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

// List of incorrect products to delete
const incorrectProducts = [
  { name: 'Custom Branding', productId: 'prod_Sme4V99qntiCSe', priceId: 'price_1Rr4lzGMSZjMrbvl3MYajAyG' },
  { name: 'VoiceBot Integration', productId: 'prod_Sme46zsHJyJmaO', priceId: 'price_1Rr4lzGMSZjMrbvlBv2GITWu' },
  { name: 'Dual Tone Toggle', productId: 'prod_Sme4ZwAIbR3XIm', priceId: 'price_1Rr4m0GMSZjMrbvlrXtfg1sO' },
  { name: 'Memory Engine', productId: 'prod_Sme4Vum5IYvHSb', priceId: 'price_1Rr4m0GMSZjMrbvltFaHJ8GA' },
  { name: 'Embed Service', productId: 'prod_Sme44Lfo9h8veR', priceId: 'price_1Rr4m1GMSZjMrbvlPhQkRx5G' },
  { name: 'Basic Analytics', productId: 'prod_Sme4g0IXfO1Rqn', priceId: 'price_1Rr4m2GMSZjMrbvlbyLjTQbc' },
  { name: 'Legal & Compliance', productId: 'prod_Sme4jaaQqa1A5y', priceId: 'price_1Rr4m2GMSZjMrbvlEihXMSmJ' },
  { name: 'Stripe/Zapier Setup', productId: 'prod_Sme4YBHGD2KbJa', priceId: 'price_1Rr4m3GMSZjMrbvlyoFSuUcC' }
];

async function deleteProduct(productId, productName) {
  try {
    // Archive the product (Stripe doesn't allow direct deletion)
    await stripe.products.update(productId, { active: false });
    console.log(`✅ Archived product: ${productName} (${productId})`);
    return true;
  } catch (error) {
    console.error(`❌ Error archiving ${productName}:`, error.message);
    return false;
  }
}

async function cleanupIncorrectProducts() {
  console.log('🧹 Cleaning up incorrect products...\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const product of incorrectProducts) {
    const success = await deleteProduct(product.productId, product.name);
    if (success) {
      successCount++;
    } else {
      errorCount++;
    }
  }
  
  console.log(`\n📊 Cleanup Summary:`);
  console.log(`   ✅ Successfully archived: ${successCount} products`);
  console.log(`   ❌ Failed to archive: ${errorCount} products`);
  
  if (successCount > 0) {
    console.log('\n🎉 Cleanup complete!');
    console.log('These products are now archived and won\'t appear in your catalog.');
  }
  
  console.log('\n📋 NEXT STEPS:');
  console.log('1. Go to Stripe Dashboard → Products → Features');
  console.log('2. Create the 8 features manually:');
  console.log('   - Custom Branding');
  console.log('   - VoiceBot Integration');
  console.log('   - Dual Tone Toggle');
  console.log('   - Memory Engine');
  console.log('   - Embed Service');
  console.log('   - Basic Analytics');
  console.log('   - Legal & Compliance');
  console.log('   - Stripe/Zapier Setup');
  console.log('3. Note down the feature IDs (start with "feat_")');
  console.log('4. Update config/stripe-features.ts with correct feature IDs');
  console.log('5. Link features to your bot products');
  console.log('6. Test the feature-based checkout');
  
  console.log('\n🎯 This will give you the proper Stripe Features experience!');
}

// Run the cleanup
if (require.main === module) {
  cleanupIncorrectProducts()
    .then(() => {
      console.log('\n✅ Cleanup script completed!');
    })
    .catch(error => {
      console.error('❌ Cleanup failed:', error);
      process.exit(1);
    });
}

module.exports = { cleanupIncorrectProducts }; 
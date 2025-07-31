# Stripe Products Setup for Kingdom AI Bots

This guide will help you create all the necessary Stripe products for your AI bots and integrate them with your checkout system.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd kingdom-website
npm install stripe dotenv
```

### 2. Set Up Environment Variables
Create a `.env.local` file in the `kingdom-website` directory:
```env
STRIPE_SECRET_KEY=sk_test_51Rj75p4gHIbTfpihPZS8AS3GpVjfZNY9wEJYi1JoeUUbBB5HECW0dFdQNHbGq71wyqBwkOG6vReHybrCi9kNVIdE00hWCJovP3
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51Rj75p4gHIbTfpihzG3FoIWjKaTFTmtPE4SdBEITr8KNcddPTiBdhIgn5ltmcrBxOCTZWUwKDI60PCdRm0d6UK7E00RExOe5Ps
```

### 3. Run the Product Creation Script
```bash
node scripts/create-stripe-products.js
```

This will:
- ✅ Create 14 AI Bot products in your Stripe account
- ✅ Create 8 Add-on products
- ✅ Create 3 Bundle products
- ✅ Generate a configuration file with all product IDs
- ✅ Save the configuration to `stripe-products-config.json`

## 📦 Products Being Created

### AI Bots (14 products)
- Sales Assistant Bot - $299
- Lead Generation Bot - $249
- Onboarding Bot - $199
- Customer Support Bot - $349
- Faith Bot - $179
- Course Explainer Bot - $279
- Testimonial Bot - $159
- Job Application Bot - $229
- Enhanced Sales Bot - $399
- Appointment Booking Bot - $199
- FAQ & Knowledge Base Bot - $179
- Event Management Bot - $299
- Inventory Management Bot - $249
- Social Media Management Bot - $279

### Add-ons (8 products)
- Custom Branding - $50
- VoiceBot Integration - $75
- Dual Tone Toggle - $40
- Memory Engine - $125
- Embed Service - $60
- Basic Analytics - $100
- Legal & Compliance - $30
- Stripe/Zapier Setup - $125

### Bundles (3 products)
- Sales Suite - $799
- Support Suite - $549
- Complete Business Suite - $1499

## 🔧 After Running the Script

### 1. Update Configuration
The script will generate a `stripe-products-config.json` file. Copy this data to `config/stripe-products.ts`:

```typescript
export const STRIPE_PRODUCTS: StripeProductsConfig = {
  bots: {
    // Copy from stripe-products-config.json
  },
  addons: {
    // Copy from stripe-products-config.json
  },
  bundles: {
    // Copy from stripe-products-config.json
  }
};
```

### 2. Update Checkout System
Update your checkout API to use product IDs instead of dynamic pricing:

```typescript
// In pages/api/create-checkout-session.ts
import { getBotProduct, getAddonProduct } from '../../config/stripe-products';

// Instead of dynamic pricing, use:
const botProduct = getBotProduct('Sales Assistant Bot');
const lineItems = [{
  price: botProduct.priceId,
  quantity: 1
}];
```

### 3. Set Up Webhooks
Create a webhook endpoint to handle purchase events:

```typescript
// pages/api/webhooks/stripe.ts
export default async function handler(req, res) {
  const event = req.body;
  
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // Handle successful purchase
      // Send confirmation email
      // Update user dashboard
      break;
  }
  
  res.json({ received: true });
}
```

## 📧 Email Integration with Beacons

### 1. Map Products to Email Templates
Create email templates in Beacons for each product type:
- Purchase confirmation emails
- Welcome emails for each bot
- Add-on setup instructions
- Bundle activation emails

### 2. Webhook to Beacons Integration
When a purchase is completed, send data to Beacons:

```typescript
// In your webhook handler
const beaconsData = {
  email: session.customer_details.email,
  product_name: session.line_items.data[0].description,
  product_id: session.line_items.data[0].price.product,
  amount: session.amount_total / 100,
  purchase_date: new Date().toISOString()
};

// Send to Beacons form endpoint
await fetch('YOUR_BEACONS_FORM_URL', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(beaconsData)
});
```

## 🔍 Verification

### 1. Check Stripe Dashboard
- Go to your Stripe Dashboard
- Navigate to Products
- Verify all 25 products were created
- Check that prices are correct

### 2. Test Checkout
- Test the checkout flow with a test card
- Verify webhook events are received
- Check that emails are sent correctly

### 3. Monitor Logs
- Check console output for any errors
- Verify product IDs are being used correctly
- Monitor webhook delivery

## 🛠️ Troubleshooting

### Common Issues

1. **"Invalid API key"**
   - Verify your `STRIPE_SECRET_KEY` is correct
   - Make sure you're using the test key for testing

2. **"Product already exists"**
   - The script will skip existing products
   - Check your Stripe dashboard for duplicates

3. **"Webhook not receiving events"**
   - Verify webhook endpoint URL is correct
   - Check webhook signing secret
   - Test with Stripe CLI

### Stripe CLI Testing
```bash
# Install Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Test a payment
stripe trigger checkout.session.completed
```

## 📊 Next Steps

After running the script:

1. **Update your checkout system** to use the new product IDs
2. **Set up webhook handling** for purchase events
3. **Configure Beacons email templates** with product IDs
4. **Test the complete flow** from purchase to email delivery
5. **Monitor analytics** in both Stripe and Beacons

## 🎯 Benefits of This Setup

- ✅ **Better tracking** of individual product sales
- ✅ **Automated emails** for each product type
- ✅ **Detailed analytics** in Stripe dashboard
- ✅ **Webhook integration** for real-time updates
- ✅ **Professional product management** in Stripe

---

**Ready to run the script?** Just execute:
```bash
cd kingdom-website
node scripts/create-stripe-products.js
``` 
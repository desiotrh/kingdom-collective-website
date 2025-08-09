# Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Stripe Configuration (Optional)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here

# Zapier Configuration (Optional)
ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/your_zapier_webhook_url_here

# API Configuration
NEXT_PUBLIC_API_URL=https://api.kingdomstudios.com
```

## Getting Started

1. Copy the above variables to your `.env.local` file
2. Replace the placeholder values with your actual API keys
3. The app will work without these keys, but they enable additional features

## Features Enabled by Environment Variables

- **Stripe Keys**: Enable payment processing and subscription management
- **Zapier Webhook**: Enable automated lead capture and CRM integration
- **API URL**: Configure backend API endpoint for production deployment

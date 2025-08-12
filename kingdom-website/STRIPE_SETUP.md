# Stripe Integration Setup Guide

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here

# Optional: Webhook endpoint secret (for production)
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## Getting Stripe Keys

1. **Create a Stripe Account**: Sign up at [stripe.com](https://stripe.com)
2. **Get Test Keys**: 
   - Go to Dashboard → Developers → API keys
   - Copy your publishable key (starts with `pk_test_`)
   - Copy your secret key (starts with `sk_test_`)
3. **For Production**: Use live keys (start with `pk_live_` and `sk_live_`)

## Installation

Install the required dependencies:

```bash
npm install
```

## Features Added

### ✅ **5 New High-Priority AI Bots**

1. **Appointment Booking Bot** - $189
   - Calendar integration, time zone handling, payment processing
   - Perfect for service businesses, healthcare, consulting

2. **FAQ & Knowledge Base Bot** - $159
   - Intelligent search, context-aware responses, multi-language support
   - Ideal for SaaS companies, e-commerce, educational institutions

3. **Event Management Bot** - $229
   - Registration handling, ticket sales, attendee management
   - Great for event planners, conference organizers, churches

4. **Inventory Management Bot** - $269
   - Stock tracking, reorder notifications, demand forecasting
   - Perfect for retail, e-commerce, manufacturing

5. **Social Media Management Bot** - $199
   - Content scheduling, hashtag optimization, engagement monitoring
   - Ideal for marketing agencies, influencers, businesses

### ✅ **Stripe Checkout Integration**

- **Secure Payment Processing**: Full Stripe integration with checkout sessions
- **Order Management**: Complete order tracking and confirmation
- **Success Page**: Professional post-payment experience
- **Error Handling**: Comprehensive error management and user feedback

### ✅ **Enhanced User Experience**

- **One-Click Purchase**: Direct payment from pricing page
- **Order Summary**: Clear breakdown of selected bots and add-ons
- **Payment Security**: PCI-compliant payment processing
- **Email Confirmation**: Automatic order confirmation emails

## Testing

1. **Test Mode**: Use Stripe test keys for development
2. **Test Cards**: Use Stripe's test card numbers (e.g., 4242 4242 4242 4242)
3. **Webhook Testing**: Use Stripe CLI for local webhook testing

## Production Deployment

1. **Switch to Live Keys**: Replace test keys with live keys
2. **Webhook Setup**: Configure webhook endpoints for order processing
3. **SSL Certificate**: Ensure HTTPS is enabled
4. **Domain Verification**: Add your domain to Stripe dashboard

## Security Notes

- Never commit `.env.local` to version control
- Use environment variables for all sensitive data
- Implement proper error handling
- Add rate limiting for API endpoints
- Monitor for suspicious activity

## Support

For issues with Stripe integration:
1. Check Stripe dashboard for payment status
2. Review server logs for API errors
3. Verify environment variables are set correctly
4. Test with Stripe's test mode first 
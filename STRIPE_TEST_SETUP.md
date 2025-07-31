# Stripe Test Setup Guide

## Environment Variables Setup

Create a `.env.local` file in the `kingdom-website` directory with the following content:

```
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51Rj75p4gHIbTfpihzG3FoIWjKaTFTmtPE4SdBEITr8KNcddPTiBdhIgn5ltmcrBxOCTZWUwKDI60PCdRm0d6UK7E00RExOe5Ps
STRIPE_SECRET_KEY=sk_test_51Rj75p4gHIbTfpihPZS8AS3GpVjfZNY9wEJYi1JoeUUbBB5HECW0dFdQNHbGq71wyqBwkOG6vReHybrCi9kNVIdE00hWCJovP3
```

## Testing Steps

1. **Install Dependencies** (if not already done):
   ```bash
   cd kingdom-website
   npm install
   ```

2. **Start the Development Server**:
   ```bash
   npm run dev
   ```

3. **Test the Checkout Flow**:
   - Navigate to `/ai-bots/pricing`
   - Select some bots and add-ons
   - Click "Proceed to Order"
   - Complete the Stripe checkout with test card: `4242 4242 4242 4242`
   - Verify you're redirected to the success page

## Test Card Numbers

Use these test card numbers for testing:
- **Success**: `4242 4242 4242 4242`
- **Declined**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

## Expected Behavior

1. Checkout modal should appear when "Proceed to Order" is clicked
2. Stripe checkout page should load with correct items and total
3. After successful payment, redirect to `/ai-bots/success`
4. Success page should display order details
5. Dashboard should show new AI bot purchases

## Troubleshooting

- If checkout fails, check browser console for errors
- Verify environment variables are loaded correctly
- Ensure all API routes are working (`/api/create-checkout-session`, `/api/get-order-details`) 
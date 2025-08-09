import express from 'express';
import Stripe from 'stripe';

const router = express.Router();

export const stripeWebhookHandler = async (req, res) => {
  const signature = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!endpointSecret) {
    return res.status(500).send('Webhook secret not configured');
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2023-10-16',
    });

    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      endpointSecret
    );

    // Handle event types as needed
    switch (event.type) {
      case 'checkout.session.completed':
      case 'payment_intent.succeeded':
      case 'payment_intent.payment_failed':
      default:
        break;
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

export default router;

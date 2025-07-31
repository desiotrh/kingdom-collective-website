import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { selectedBots, selectedAddOns, totalAmount } = req.body;

    // Validate input
    if (!selectedBots || !Array.isArray(selectedBots) || selectedBots.length === 0) {
      return res.status(400).json({ error: 'No bots selected' });
    }

    if (totalAmount <= 0) {
      return res.status(400).json({ error: 'Invalid total amount' });
    }

    // Create line items for Stripe
    const lineItems = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Kingdom AI Bots Package',
            description: `AI Bots: ${selectedBots.join(', ')}${selectedAddOns.length > 0 ? ` | Add-ons: ${selectedAddOns.join(', ')}` : ''}`,
            images: ['https://kingdomcollective.com/logo.png'], // Replace with your logo URL
          },
          unit_amount: totalAmount * 100, // Convert to cents
        },
        quantity: 1,
      },
    ];

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.origin}/ai-bots/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/ai-bots/pricing`,
      metadata: {
        selectedBots: JSON.stringify(selectedBots),
        selectedAddOns: JSON.stringify(selectedAddOns),
        totalAmount: totalAmount.toString(),
      },
      customer_email: req.body.customerEmail, // Optional: if you collect email
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
} 
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { session_id } = req.query;

    if (!session_id || typeof session_id !== 'string') {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Extract metadata
    const metadata = session.metadata;
    const selectedBots = metadata?.selectedBots ? JSON.parse(metadata.selectedBots) : [];
    const selectedAddOns = metadata?.selectedAddOns ? JSON.parse(metadata.selectedAddOns) : [];
    const totalAmount = metadata?.totalAmount ? parseFloat(metadata.totalAmount) : 0;

    res.status(200).json({
      selectedBots,
      selectedAddOns,
      totalAmount,
      paymentStatus: session.payment_status,
      customerEmail: session.customer_details?.email,
    });
  } catch (error) {
    console.error('Error retrieving order details:', error);
    res.status(500).json({ error: 'Failed to retrieve order details' });
  }
} 
import React, { useState } from 'react';

interface StripeCheckoutProps {
  selectedBots: string[];
  selectedAddOns: string[];
  totalAmount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function StripeCheckout({ 
  selectedBots, 
  selectedAddOns, 
  totalAmount, 
  onSuccess, 
  onCancel 
}: StripeCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedBots,
          selectedAddOns,
          totalAmount,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <h3 className="text-xl font-bold text-white mb-4">Complete Your Purchase</h3>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white">Total Amount:</span>
          <span className="text-2xl font-bold text-kingdom-gold">${totalAmount}</span>
        </div>
        
        <div className="text-white/70 text-sm">
          {selectedBots.length > 0 && (
            <div className="mb-2">
              <span className="font-semibold">Bots:</span> {selectedBots.length}
            </div>
          )}
          {selectedAddOns.length > 0 && (
            <div>
              <span className="font-semibold">Add-ons:</span> {selectedAddOns.length}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleCheckout}
          disabled={isLoading}
                          className="flex-1 bg-gradient-to-r from-kingdom-gold to-kingdom-orange text-kingdom-dark px-6 py-3 rounded-lg font-bold hover-scale animate-standard disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Processing...' : 'Proceed to Payment'}
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-3 bg-white/10 text-white rounded-lg font-bold hover:bg-white/20 transition-all duration-200"
        >
          Cancel
        </button>
      </div>

      <div className="mt-4 text-white/50 text-xs">
        <p>🔒 Secure payment powered by Stripe</p>
        <p>✅ 30-day money-back guarantee</p>
        <p>📧 Order confirmation will be sent to your email</p>
      </div>
    </div>
  );
}

// Helper function to load Stripe
async function loadStripe(publishableKey: string) {
  if (typeof window === 'undefined') return null;
  
  try {
    const { loadStripe } = await import('@stripe/stripe-js');
    return await loadStripe(publishableKey);
  } catch (error) {
    console.error('Failed to load Stripe:', error);
    return null;
  }
} 
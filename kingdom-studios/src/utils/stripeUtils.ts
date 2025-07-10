// Platform-specific Stripe implementation
import { Platform } from 'react-native';
import { ReactNode } from 'react';

interface StripeProviderProps {
  children: ReactNode;
  publishableKey: string;
}

let StripeProvider: React.ComponentType<StripeProviderProps>;
let useStripe: () => any;
let usePaymentSheet: () => any;

if (Platform.OS === 'web') {
  // Web implementation - use a mock or alternative
  StripeProvider = ({ children, publishableKey }: StripeProviderProps) => {
    console.log('Stripe Web Provider initialized with key:', publishableKey?.substring(0, 10) + '...');
    return children as any;
  };
  
  useStripe = () => ({
    createPaymentMethod: async () => {
      console.log('Web payment method creation - implement with Stripe.js');
      return null;
    },
  });
  
  usePaymentSheet = () => ({
    initPaymentSheet: async () => {
      console.log('Web payment sheet - implement with Stripe.js');
      return { error: null };
    },
    presentPaymentSheet: async () => {
      console.log('Web payment sheet presentation');
      return { error: null };
    },
  });
} else {
  // Native implementation
  const stripe = require('@stripe/stripe-react-native');
  StripeProvider = stripe.StripeProvider;
  useStripe = stripe.useStripe;
  usePaymentSheet = stripe.usePaymentSheet;
}

export { StripeProvider, useStripe, usePaymentSheet };

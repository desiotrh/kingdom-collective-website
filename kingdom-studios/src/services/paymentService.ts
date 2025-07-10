import { initPaymentSheet, presentPaymentSheet, PaymentSheetError } from '@stripe/stripe-react-native';
import Constants from 'expo-constants';
import axios from 'axios';

// Type override for extra config
type AppConfig = typeof Constants.expoConfig & {
  extra?: {
    stripePublishableKey: string;
    stripeSecretKey: string;
  };
};

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: string;
}

export interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
}

export interface Subscription {
  id: string;
  status: string;
  currentPeriodEnd: number;
  plan: {
    id: string;
    name: string;
    amount: number;
    interval: string;
  };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  type: 'one_time' | 'subscription' | 'donation';
  features?: string[];
}

export interface PaymentResult {
  success: boolean;
  error?: string;
  transactionId?: string;
  subscription?: Subscription;
}

class PaymentService {
  private static instance: PaymentService;
  private config: AppConfig['extra'];
  private backendUrl = 'https://api.kingdomstudios.app'; // Your backend URL

  private constructor() {
    this.config = (Constants.expoConfig as AppConfig).extra;
  }

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  // Initialize Stripe
  async initializeStripe(): Promise<boolean> {
    if (!this.config?.stripePublishableKey) {
      console.error('Stripe publishable key not configured');
      return false;
    }

    try {
      // Stripe initialization is handled by the provider in App.tsx
      return true;
    } catch (error) {
      console.error('Stripe initialization error:', error);
      return false;
    }
  }

  // Create payment intent for one-time payments
  async createPaymentIntent(
    amount: number,
    currency: string = 'usd',
    metadata?: Record<string, string>
  ): Promise<PaymentIntent> {
    try {
      const response = await axios.post(
        `${this.backendUrl}/create-payment-intent`,
        {
          amount: Math.round(amount * 100), // Convert to cents
          currency,
          metadata,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config?.stripeSecretKey}`,
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Payment intent creation error:', error);
      // Mock response for development
      return {
        id: `pi_mock_${Date.now()}`,
        clientSecret: `pi_mock_${Date.now()}_secret`,
        amount: Math.round(amount * 100),
        currency,
        status: 'requires_payment_method',
      };
    }
  }

  // Process payment using Stripe Payment Sheet
  async processPayment(
    amount: number,
    productName: string,
    currency: string = 'usd',
    customerInfo?: {
      email?: string;
      name?: string;
    }
  ): Promise<PaymentResult> {
    try {
      // Create payment intent
      const paymentIntent = await this.createPaymentIntent(amount, currency, {
        product_name: productName,
        customer_email: customerInfo?.email || '',
      });

      // Initialize payment sheet
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: 'Kingdom Studios',
        paymentIntentClientSecret: paymentIntent.clientSecret,
        defaultBillingDetails: {
          name: customerInfo?.name,
          email: customerInfo?.email,
        },
        allowsDelayedPaymentMethods: true,
        returnURL: 'kingdom-studios://payment-success',
      });

      if (initError) {
        console.error('Payment sheet initialization error:', initError);
        return { success: false, error: initError.message };
      }

      // Present payment sheet
      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        if (presentError.code === PaymentSheetError.Canceled) {
          return { success: false, error: 'Payment was canceled' };
        }
        console.error('Payment sheet presentation error:', presentError);
        return { success: false, error: presentError.message };
      }

      // Payment successful
      return { 
        success: true,
        transactionId: paymentIntent.id,
      };
    } catch (error) {
      console.error('Payment processing error:', error);
      return { success: false, error: 'Payment processing failed' };
    }
  }

  // Create subscription
  async createSubscription(
    priceId: string,
    customerEmail: string,
    paymentMethodId?: string
  ): Promise<{ success: boolean; subscription?: Subscription; error?: string }> {
    try {
      const response = await axios.post(
        `${this.backendUrl}/create-subscription`,
        {
          price_id: priceId,
          customer_email: customerEmail,
          payment_method_id: paymentMethodId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config?.stripeSecretKey}`,
          }
        }
      );

      return { success: true, subscription: response.data };
    } catch (error) {
      console.error('Subscription creation error:', error);
      return { success: false, error: 'Failed to create subscription' };
    }
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId: string): Promise<{ success: boolean; error?: string }> {
    try {
      await axios.post(
        `${this.backendUrl}/cancel-subscription`,
        { subscription_id: subscriptionId },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config?.stripeSecretKey}`,
          }
        }
      );

      return { success: true };
    } catch (error) {
      console.error('Subscription cancellation error:', error);
      return { success: false, error: 'Failed to cancel subscription' };
    }
  }

  // Get customer subscriptions
  async getCustomerSubscriptions(customerEmail: string): Promise<Subscription[]> {
    try {
      const response = await axios.get(
        `${this.backendUrl}/customer-subscriptions?email=${customerEmail}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config?.stripeSecretKey}`,
          }
        }
      );

      return response.data.subscriptions || [];
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      return [];
    }
  }

  // Get available products/plans
  getAvailableProducts(): Product[] {
    return [
      {
        id: 'kingdom_pro_monthly',
        name: 'Kingdom Pro Monthly',
        description: 'Full access to all Kingdom Studios features',
        price: 29.99,
        currency: 'usd',
        type: 'subscription',
        features: [
          'Unlimited AI content generation',
          'Advanced analytics dashboard',
          'Priority customer support',
          'All platform integrations',
          'Advanced automation tools',
          'Custom branding'
        ]
      },
      {
        id: 'kingdom_pro_yearly',
        name: 'Kingdom Pro Yearly',
        description: 'Full access to all Kingdom Studios features (2 months free)',
        price: 299.99,
        currency: 'usd',
        type: 'subscription',
        features: [
          'Unlimited AI content generation',
          'Advanced analytics dashboard',
          'Priority customer support',
          'All platform integrations',
          'Advanced automation tools',
          'Custom branding',
          '2 months free!'
        ]
      },
      {
        id: 'course_access',
        name: 'Kingdom Business Course',
        description: 'Complete course on building Kingdom-minded businesses',
        price: 197.00,
        currency: 'usd',
        type: 'one_time',
        features: [
          '12 comprehensive modules',
          'Video lessons and workbooks',
          'Private community access',
          'Live Q&A sessions',
          'Lifetime access'
        ]
      },
      {
        id: 'custom_donation',
        name: 'Support Kingdom Studios',
        description: 'Help us continue building tools for Kingdom entrepreneurs',
        price: 0, // Variable amount
        currency: 'usd',
        type: 'donation',
        features: [
          'Support our mission',
          'Help expand features',
          'Enable sponsorships for others'
        ]
      }
    ];
  }

  // Process donation with custom amount
  async processDonation(
    amount: number,
    donorInfo?: {
      name?: string;
      email?: string;
      message?: string;
    }
  ): Promise<{ success: boolean; error?: string }> {
    if (amount < 1) {
      return { success: false, error: 'Minimum donation amount is $1' };
    }

    return await this.processPayment(
      amount,
      `Donation to Kingdom Studios - $${amount}`,
      'usd',
      donorInfo
    );
  }

  // Setup sponsorship payment
  async setupSponsorship(
    sponsorEmail: string,
    sponsoredUserEmail: string,
    planId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await axios.post(
        `${this.backendUrl}/setup-sponsorship`,
        {
          sponsor_email: sponsorEmail,
          sponsored_user_email: sponsoredUserEmail,
          plan_id: planId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config?.stripeSecretKey}`,
          }
        }
      );

      return { success: true };
    } catch (error) {
      console.error('Sponsorship setup error:', error);
      return { success: false, error: 'Failed to setup sponsorship' };
    }
  }

  // Validate payment status
  async validatePayment(paymentIntentId: string): Promise<{ valid: boolean; status: string }> {
    try {
      const response = await axios.get(
        `${this.backendUrl}/validate-payment/${paymentIntentId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config?.stripeSecretKey}`,
          }
        }
      );

      return {
        valid: response.data.status === 'succeeded',
        status: response.data.status
      };
    } catch (error) {
      console.error('Payment validation error:', error);
      return { valid: false, status: 'unknown' };
    }
  }

  // Get payment history
  async getPaymentHistory(customerEmail: string): Promise<any[]> {
    try {
      const response = await axios.get(
        `${this.backendUrl}/payment-history?email=${customerEmail}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config?.stripeSecretKey}`,
          }
        }
      );

      return response.data.payments || [];
    } catch (error) {
      console.error('Error fetching payment history:', error);
      return [];
    }
  }

  // Get saved payment methods
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    // In a real app, this would fetch from your backend
    try {
      // Mock data for development
      return [
        {
          id: 'pm_mock_visa',
          type: 'card',
          card: {
            brand: 'visa',
            last4: '4242',
            expMonth: 12,
            expYear: 2026,
          }
        }
      ];
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      return [];
    }
  }

  // Setup new payment method
  async setupPaymentMethod(): Promise<{ success: boolean; paymentMethod?: PaymentMethod; error?: string }> {
    try {
      // Initialize payment sheet for setup
      const { error } = await initPaymentSheet({
        paymentIntentClientSecret: undefined, // For setup mode
        merchantDisplayName: 'Kingdom Studios',
        style: 'alwaysDark',
        setupIntentClientSecret: 'si_mock_setup_intent', // You would get this from your backend
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Present payment sheet
      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) {
        if (paymentError.code !== PaymentSheetError.Canceled) {
          return { success: false, error: paymentError.message };
        }
        return { success: false, error: 'Setup cancelled' };
      }

      // Return mock payment method for now
      return {
        success: true,
        paymentMethod: {
          id: `pm_${Date.now()}`,
          type: 'card',
          card: {
            brand: 'visa',
            last4: '4242',
            expMonth: 12,
            expYear: 2026,
          }
        }
      };
    } catch (error) {
      console.error('Setup payment method error:', error);
      return { success: false, error: 'Failed to setup payment method' };
    }
  }

  // Check if Stripe is configured
  isConfigured(): boolean {
    return !!(this.config?.stripePublishableKey && this.config?.stripeSecretKey);
  }
}

export default PaymentService.getInstance();

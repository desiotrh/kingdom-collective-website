import { Alert } from 'react-native';
import { TierType, BillingCycle } from '../contexts/TierSystemContext';

// ==============================
// 💳 Kingdom Studios Stripe Integration
// Handles all billing and subscription management
// ==============================

interface StripeConfig {
  publishableKey: string;
  secretKey: string; // Only for backend use
  webhookSecret: string;
}

interface StripeCustomer {
  id: string;
  email: string;
  name?: string;
  metadata?: Record<string, string>;
}

interface StripeSubscription {
  id: string;
  customerId: string;
  priceId: string;
  status: 'active' | 'past_due' | 'canceled' | 'incomplete' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  trialEnd?: Date;
  cancelAtPeriodEnd: boolean;
  metadata?: Record<string, string>;
}

interface StripePaymentIntent {
  id: string;
  clientSecret: string;
  status: string;
  amount: number;
  currency: string;
}

interface CreateSubscriptionParams {
  customerId: string;
  priceId: string;
  trialPeriodDays?: number;
  metadata?: Record<string, string>;
}

interface CreatePaymentIntentParams {
  amount: number;
  currency: string;
  customerId: string;
  metadata?: Record<string, string>;
}

class StripeService {
  private config: StripeConfig;
  private baseUrl: string;

  constructor(config: StripeConfig) {
    this.config = config;
    this.baseUrl = 'https://api.stripe.com/v1';
  }

  // ==============================
  // Customer Management
  // ==============================

  async createCustomer(email: string, name?: string, metadata?: Record<string, string>): Promise<StripeCustomer> {
    try {
      const response = await this.makeStripeRequest('/customers', 'POST', {
        email,
        name,
        metadata,
      });

      return {
        id: response.id,
        email: response.email,
        name: response.name,
        metadata: response.metadata,
      };
    } catch (error) {
      console.error('Error creating Stripe customer:', error);
      throw new Error('Failed to create customer');
    }
  }

  async updateCustomer(customerId: string, updates: Partial<StripeCustomer>): Promise<StripeCustomer> {
    try {
      const response = await this.makeStripeRequest(`/customers/${customerId}`, 'POST', updates);

      return {
        id: response.id,
        email: response.email,
        name: response.name,
        metadata: response.metadata,
      };
    } catch (error) {
      console.error('Error updating Stripe customer:', error);
      throw new Error('Failed to update customer');
    }
  }

  async getCustomer(customerId: string): Promise<StripeCustomer> {
    try {
      const response = await this.makeStripeRequest(`/customers/${customerId}`, 'GET');

      return {
        id: response.id,
        email: response.email,
        name: response.name,
        metadata: response.metadata,
      };
    } catch (error) {
      console.error('Error fetching Stripe customer:', error);
      throw new Error('Failed to fetch customer');
    }
  }

  // ==============================
  // Subscription Management
  // ==============================

  async createSubscription(params: CreateSubscriptionParams): Promise<StripeSubscription> {
    try {
      const requestData: any = {
        customer: params.customerId,
        items: [{ price: params.priceId }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
        metadata: params.metadata,
      };

      if (params.trialPeriodDays) {
        requestData.trial_period_days = params.trialPeriodDays;
      }

      const response = await this.makeStripeRequest('/subscriptions', 'POST', requestData);

      return this.formatSubscription(response);
    } catch (error) {
      console.error('Error creating Stripe subscription:', error);
      throw new Error('Failed to create subscription');
    }
  }

  async getSubscription(subscriptionId: string): Promise<StripeSubscription> {
    try {
      const response = await this.makeStripeRequest(`/subscriptions/${subscriptionId}`, 'GET');
      return this.formatSubscription(response);
    } catch (error) {
      console.error('Error fetching Stripe subscription:', error);
      throw new Error('Failed to fetch subscription');
    }
  }

  async updateSubscription(
    subscriptionId: string, 
    updates: { priceId?: string; trialEnd?: Date; metadata?: Record<string, string> }
  ): Promise<StripeSubscription> {
    try {
      const requestData: any = {};

      if (updates.priceId) {
        requestData.items = [{ price: updates.priceId }];
        requestData.proration_behavior = 'create_prorations';
      }

      if (updates.trialEnd) {
        requestData.trial_end = Math.floor(updates.trialEnd.getTime() / 1000);
      }

      if (updates.metadata) {
        requestData.metadata = updates.metadata;
      }

      const response = await this.makeStripeRequest(
        `/subscriptions/${subscriptionId}`, 
        'POST', 
        requestData
      );

      return this.formatSubscription(response);
    } catch (error) {
      console.error('Error updating Stripe subscription:', error);
      throw new Error('Failed to update subscription');
    }
  }

  async cancelSubscription(subscriptionId: string, immediately: boolean = false): Promise<StripeSubscription> {
    try {
      const endpoint = immediately 
        ? `/subscriptions/${subscriptionId}`
        : `/subscriptions/${subscriptionId}`;
      
      const requestData = immediately 
        ? {} 
        : { cancel_at_period_end: true };

      const method = immediately ? 'DELETE' : 'POST';

      const response = await this.makeStripeRequest(endpoint, method, requestData);
      return this.formatSubscription(response);
    } catch (error) {
      console.error('Error canceling Stripe subscription:', error);
      throw new Error('Failed to cancel subscription');
    }
  }

  async reactivateSubscription(subscriptionId: string): Promise<StripeSubscription> {
    try {
      const response = await this.makeStripeRequest(
        `/subscriptions/${subscriptionId}`, 
        'POST', 
        { cancel_at_period_end: false }
      );

      return this.formatSubscription(response);
    } catch (error) {
      console.error('Error reactivating Stripe subscription:', error);
      throw new Error('Failed to reactivate subscription');
    }
  }

  // ==============================
  // Payment Intent Management
  // ==============================

  async createPaymentIntent(params: CreatePaymentIntentParams): Promise<StripePaymentIntent> {
    try {
      const response = await this.makeStripeRequest('/payment_intents', 'POST', {
        amount: params.amount,
        currency: params.currency,
        customer: params.customerId,
        metadata: params.metadata,
      });

      return {
        id: response.id,
        clientSecret: response.client_secret,
        status: response.status,
        amount: response.amount,
        currency: response.currency,
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  async confirmPaymentIntent(paymentIntentId: string, paymentMethodId: string): Promise<StripePaymentIntent> {
    try {
      const response = await this.makeStripeRequest(
        `/payment_intents/${paymentIntentId}/confirm`, 
        'POST', 
        { payment_method: paymentMethodId }
      );

      return {
        id: response.id,
        clientSecret: response.client_secret,
        status: response.status,
        amount: response.amount,
        currency: response.currency,
      };
    } catch (error) {
      console.error('Error confirming payment intent:', error);
      throw new Error('Failed to confirm payment');
    }
  }

  // ==============================
  // Billing Portal
  // ==============================

  async createBillingPortalSession(customerId: string, returnUrl: string): Promise<{ url: string }> {
    try {
      const response = await this.makeStripeRequest('/billing_portal/sessions', 'POST', {
        customer: customerId,
        return_url: returnUrl,
      });

      return { url: response.url };
    } catch (error) {
      console.error('Error creating billing portal session:', error);
      throw new Error('Failed to create billing portal session');
    }
  }

  // ==============================
  // Coupons and Discounts
  // ==============================

  async createCoupon(
    discountPercent: number,
    durationInMonths?: number,
    metadata?: Record<string, string>
  ): Promise<any> {
    try {
      const requestData: any = {
        percent_off: discountPercent,
        duration: durationInMonths ? 'repeating' : 'once',
        metadata,
      };

      if (durationInMonths) {
        requestData.duration_in_months = durationInMonths;
      }

      const response = await this.makeStripeRequest('/coupons', 'POST', requestData);
      return response;
    } catch (error) {
      console.error('Error creating coupon:', error);
      throw new Error('Failed to create coupon');
    }
  }

  async applyCouponToSubscription(subscriptionId: string, couponId: string): Promise<StripeSubscription> {
    try {
      const response = await this.makeStripeRequest(
        `/subscriptions/${subscriptionId}`, 
        'POST', 
        { coupon: couponId }
      );

      return this.formatSubscription(response);
    } catch (error) {
      console.error('Error applying coupon:', error);
      throw new Error('Failed to apply discount');
    }
  }

  // ==============================
  // Webhook Handling
  // ==============================

  async handleWebhook(payload: string, signature: string): Promise<any> {
    try {
      // TODO: Implement webhook signature verification
      // const event = stripe.webhooks.constructEvent(payload, signature, this.config.webhookSecret);
      
      const event = JSON.parse(payload);
      
      switch (event.type) {
        case 'customer.subscription.created':
          await this.handleSubscriptionCreated(event.data.object);
          break;
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object);
          break;
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object);
          break;
        case 'invoice.payment_succeeded':
          await this.handlePaymentSucceeded(event.data.object);
          break;
        case 'invoice.payment_failed':
          await this.handlePaymentFailed(event.data.object);
          break;
        default:
          console.log(`Unhandled webhook event type: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      console.error('Error handling webhook:', error);
      throw new Error('Webhook handling failed');
    }
  }

  // ==============================
  // Private Helper Methods
  // ==============================

  private async makeStripeRequest(endpoint: string, method: string, data?: any): Promise<any> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const headers = {
        'Authorization': `Bearer ${this.config.secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      };

      let body: string | undefined;
      if (data && (method === 'POST' || method === 'PUT')) {
        body = new URLSearchParams(this.flattenObject(data)).toString();
      }

      const response = await fetch(url, {
        method,
        headers,
        body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Stripe API error');
      }

      return await response.json();
    } catch (error) {
      console.error('Stripe API request failed:', error);
      throw error;
    }
  }

  private flattenObject(obj: any, prefix = ''): Record<string, string> {
    const flattened: Record<string, string> = {};
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = prefix ? `${prefix}[${key}]` : key;
        
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          Object.assign(flattened, this.flattenObject(obj[key], newKey));
        } else if (Array.isArray(obj[key])) {
          obj[key].forEach((item: any, index: number) => {
            if (typeof item === 'object') {
              Object.assign(flattened, this.flattenObject(item, `${newKey}[${index}]`));
            } else {
              flattened[`${newKey}[${index}]`] = String(item);
            }
          });
        } else {
          flattened[newKey] = String(obj[key]);
        }
      }
    }
    
    return flattened;
  }

  private formatSubscription(stripeSubscription: any): StripeSubscription {
    return {
      id: stripeSubscription.id,
      customerId: stripeSubscription.customer,
      priceId: stripeSubscription.items.data[0]?.price?.id || '',
      status: stripeSubscription.status,
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      trialEnd: stripeSubscription.trial_end ? new Date(stripeSubscription.trial_end * 1000) : undefined,
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
      metadata: stripeSubscription.metadata,
    };
  }

  // ==============================
  // Webhook Event Handlers
  // ==============================

  private async handleSubscriptionCreated(subscription: any) {
    console.log('Subscription created:', subscription.id);
    // TODO: Update user's subscription status in database
    // TODO: Send welcome notification
  }

  private async handleSubscriptionUpdated(subscription: any) {
    console.log('Subscription updated:', subscription.id);
    // TODO: Update user's subscription status in database
    // TODO: Handle tier changes, trial conversions, etc.
  }

  private async handleSubscriptionDeleted(subscription: any) {
    console.log('Subscription deleted:', subscription.id);
    // TODO: Update user's subscription status in database
    // TODO: Send cancellation notification
  }

  private async handlePaymentSucceeded(invoice: any) {
    console.log('Payment succeeded:', invoice.id);
    // TODO: Update user's payment status
    // TODO: Send payment confirmation notification
  }

  private async handlePaymentFailed(invoice: any) {
    console.log('Payment failed:', invoice.id);
    // TODO: Update user's payment status
    // TODO: Send payment failure notification
    // TODO: Retry payment logic
  }
}

// ==============================
// Price ID Mapping for Tiers
// ==============================

export const STRIPE_PRICE_IDS: Record<TierType, Record<BillingCycle, string>> = {
  seed: {
    monthly: '', // Free tier
    yearly: '',
  },
  rooted: {
    monthly: 'price_rooted_monthly', // Replace with actual Stripe price IDs
    yearly: 'price_rooted_yearly',
  },
  commissioned: {
    monthly: 'price_commissioned_monthly',
    yearly: 'price_commissioned_yearly',
  },
  mantled_pro: {
    monthly: 'price_mantled_pro_monthly',
    yearly: 'price_mantled_pro_yearly',
  },
  kingdom_enterprise: {
    monthly: 'price_kingdom_enterprise_monthly',
    yearly: 'price_kingdom_enterprise_yearly',
  },
};

// ==============================
// Main Billing Service
// ==============================

class BillingService {
  private stripe: StripeService;

  constructor(stripeConfig: StripeConfig) {
    this.stripe = new StripeService(stripeConfig);
  }

  async initializeCustomer(userId: string, email: string, name?: string): Promise<string> {
    try {
      const customer = await this.stripe.createCustomer(email, name, { userId });
      return customer.id;
    } catch (error) {
      console.error('Error initializing customer:', error);
      throw error;
    }
  }

  async subscribeTo(
    customerId: string, 
    tier: TierType, 
    billingCycle: BillingCycle,
    trialDays?: number
  ): Promise<StripeSubscription> {
    try {
      const priceId = STRIPE_PRICE_IDS[tier][billingCycle];
      if (!priceId) {
        throw new Error(`No price ID found for ${tier} ${billingCycle}`);
      }

      const subscription = await this.stripe.createSubscription({
        customerId,
        priceId,
        trialPeriodDays: trialDays,
        metadata: { tier, billingCycle },
      });

      return subscription;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  async changeTier(
    subscriptionId: string, 
    newTier: TierType, 
    billingCycle: BillingCycle
  ): Promise<StripeSubscription> {
    try {
      const priceId = STRIPE_PRICE_IDS[newTier][billingCycle];
      if (!priceId) {
        throw new Error(`No price ID found for ${newTier} ${billingCycle}`);
      }

      const subscription = await this.stripe.updateSubscription(subscriptionId, {
        priceId,
        metadata: { tier: newTier, billingCycle },
      });

      return subscription;
    } catch (error) {
      console.error('Error changing tier:', error);
      throw error;
    }
  }

  async cancelSubscription(subscriptionId: string, immediately: boolean = false): Promise<void> {
    try {
      await this.stripe.cancelSubscription(subscriptionId, immediately);
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }

  async createBillingPortalUrl(customerId: string, returnUrl: string): Promise<string> {
    try {
      const session = await this.stripe.createBillingPortalSession(customerId, returnUrl);
      return session.url;
    } catch (error) {
      console.error('Error creating billing portal URL:', error);
      throw error;
    }
  }

  async applyDiscount(
    subscriptionId: string, 
    discountPercent: number, 
    durationMonths?: number
  ): Promise<void> {
    try {
      const coupon = await this.stripe.createCoupon(discountPercent, durationMonths);
      await this.stripe.applyCouponToSubscription(subscriptionId, coupon.id);
    } catch (error) {
      console.error('Error applying discount:', error);
      throw error;
    }
  }
}

// Export the main service
export default BillingService;
export { StripeService, type StripeConfig, type StripeSubscription };

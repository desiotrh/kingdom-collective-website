import { useState, useCallback } from 'react';
import PaymentService, { PaymentResult, PaymentMethod, Subscription } from '../services/paymentService';
import { useAuth } from '../contexts/FirebaseAuthContext';
import { useTierSystem } from '../contexts/TierSystemContext';

/**
 * 💳 PAYMENT HOOK
 * React hook for managing payments, subscriptions, and billing
 */

export interface UsePaymentReturn {
  // State
  isLoading: boolean;
  error: string | null;
  paymentMethods: PaymentMethod[];
  subscription: Subscription | null;
  
  // Actions
  purchaseProduct: (productId: string, amount: number, type?: 'one_time' | 'subscription') => Promise<PaymentResult>;
  upgradeSubscription: (tier: string, billing: 'monthly' | 'yearly') => Promise<PaymentResult>;
  cancelSubscription: () => Promise<{ success: boolean; error?: string }>;
  setupPaymentMethod: () => Promise<{ success: boolean; paymentMethod?: PaymentMethod; error?: string }>;
  loadPaymentMethods: () => Promise<void>;
  loadSubscription: () => Promise<void>;
  clearError: () => void;
  
  // Utilities
  calculateYearlySavings: (tier: string) => number;
  getRecommendedTier: () => string;
}

export const usePayment = (): UsePaymentReturn => {
  const { user } = useAuth();
  const { currentTier, usageStats, getRemainingUsage } = useTierSystem();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const purchaseProduct = useCallback(async (
    productId: string,
    amount: number,
    type: 'one_time' | 'subscription' = 'one_time'
  ): Promise<PaymentResult> => {
    if (!user) {
      const error = 'User not authenticated';
      setError(error);
      return { success: false, error };
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = type === 'subscription' 
        ? await PaymentService.createSubscription(productId, user.email || '')
        : await PaymentService.processPayment(amount, productId);

      if (!result.success) {
        setError(result.error || 'Payment failed');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const upgradeSubscription = useCallback(async (
    tier: string,
    billing: 'monthly' | 'yearly'
  ): Promise<PaymentResult> => {
    if (!user) {
      const error = 'User not authenticated';
      setError(error);
      return { success: false, error };
    }

    try {
      setIsLoading(true);
      setError(null);

      // Calculate amount based on tier and billing
      const tierPricing = {
        rooted: { monthly: 29, yearly: 290 },
        commissioned: { monthly: 89, yearly: 890 },
        mantled_pro: { monthly: 199, yearly: 1990 },
        kingdom_enterprise: { monthly: 599, yearly: 5990 },
      };

      const pricing = tierPricing[tier as keyof typeof tierPricing];
      if (!pricing) {
        throw new Error('Invalid tier selected');
      }

      const amount = billing === 'monthly' ? pricing.monthly : pricing.yearly;
      
      const result = await PaymentService.createSubscription(
        `subscription_${tier}_${billing}`,
        amount * 100 // Convert to cents
      );

      if (result.success) {
        // Refresh subscription data
        await loadSubscription();
      } else {
        setError(result.error || 'Subscription upgrade failed');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Subscription upgrade failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const cancelSubscription = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    if (!subscription) {
      return { success: false, error: 'No active subscription found' };
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await PaymentService.cancelSubscription(subscription.id);
      
      if (result.success) {
        // Refresh subscription data
        await loadSubscription();
      } else {
        setError(result.error || 'Failed to cancel subscription');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel subscription';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [subscription]);

  const setupPaymentMethod = useCallback(async (): Promise<{ 
    success: boolean; 
    paymentMethod?: PaymentMethod; 
    error?: string 
  }> => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await PaymentService.setupPaymentMethod();
      
      if (result.success) {
        // Refresh payment methods
        await loadPaymentMethods();
      } else {
        setError(result.error || 'Failed to setup payment method');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to setup payment method';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadPaymentMethods = useCallback(async () => {
    try {
      const methods = await PaymentService.getPaymentMethods();
      setPaymentMethods(methods);
    } catch (err) {
      console.error('Error loading payment methods:', err);
    }
  }, []);

  const loadSubscription = useCallback(async () => {
    try {
      const subs = await PaymentService.getSubscriptions();
      setSubscription(subs[0] || null);
    } catch (err) {
      console.error('Error loading subscription:', err);
    }
  }, []);

  const calculateYearlySavings = useCallback((tier: string): number => {
    const tierPricing = {
      rooted: { monthly: 29, yearly: 290 },
      commissioned: { monthly: 89, yearly: 890 },
      mantled_pro: { monthly: 199, yearly: 1990 },
      kingdom_enterprise: { monthly: 599, yearly: 5990 },
    };

    const pricing = tierPricing[tier as keyof typeof tierPricing];
    if (!pricing) return 0;

    const monthlyTotal = pricing.monthly * 12;
    const savings = monthlyTotal - pricing.yearly;
    return Math.max(0, savings);
  }, []);

  const getRecommendedTier = useCallback((): string => {
    if (!user) return 'rooted';

    // Analyze current usage to recommend appropriate tier
    const aiUsage = usageStats.aiGenerationsPerDay?.current || 0;
    
    if (aiUsage <= 10) return 'seed';
    if (aiUsage <= 75) return 'rooted';
    if (aiUsage <= 200) return 'commissioned';
    if (aiUsage <= 500) return 'mantled_pro';
    return 'kingdom_enterprise';
  }, [user, usageStats]);

  return {
    // State
    isLoading,
    error,
    paymentMethods,
    subscription,
    
    // Actions
    purchaseProduct,
    upgradeSubscription,
    cancelSubscription,
    setupPaymentMethod,
    loadPaymentMethods,
    loadSubscription,
    clearError,
    
    // Utilities
    calculateYearlySavings,
    getRecommendedTier,
  };
};

/**
 * 💰 PRODUCT PURCHASE HOOK
 * Simplified hook for one-time product purchases
 */
export const useProductPurchase = () => {
  const { purchaseProduct, isLoading, error, clearError } = usePayment();

  const buyProduct = useCallback(async (
    productId: string,
    name: string,
    price: number,
    onSuccess?: () => void,
    onError?: (error: string) => void
  ) => {
    try {
      const result = await purchaseProduct(productId, price * 100); // Convert to cents
      
      if (result.success) {
        onSuccess?.();
      } else {
        onError?.(result.error || 'Purchase failed');
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Purchase failed';
      onError?.(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [purchaseProduct]);

  return {
    buyProduct,
    isLoading,
    error,
    clearError,
  };
};

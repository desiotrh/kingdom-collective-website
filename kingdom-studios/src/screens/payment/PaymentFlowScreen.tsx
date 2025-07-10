import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useDualMode } from '../../contexts/DualModeContext';
import { useTierSystem, TierType, BillingCycle } from '../../contexts/TierSystemContext';
import { useNotifications } from '../../contexts/NotificationContext';
import BillingService from '../../services/BillingService';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'paypal';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

interface PaymentFlowScreenProps {
  route: {
    params: {
      targetTier: TierType;
      billingCycle: BillingCycle;
      isUpgrade?: boolean;
      isDowngrade?: boolean;
      isNewSubscription?: boolean;
    };
  };
  navigation: any;
}

const PaymentFlowScreen: React.FC<PaymentFlowScreenProps> = ({ route, navigation }) => {
  const { targetTier, billingCycle, isUpgrade, isDowngrade, isNewSubscription } = route.params;
  const { currentMode, colors } = useDualMode();
  const { 
    availableTiers, 
    currentTier, 
    subscription,
    upgradeTier,
    downgradeTier,
    convertTrialToSubscription 
  } = useTierSystem();
  const { sendNotification } = useNotifications();

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [prorationAmount, setProrationAmount] = useState<number | null>(null);
  const [billingService] = useState(() => new BillingService({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  }));

  const targetTierInfo = availableTiers[targetTier];
  const currentTierInfo = availableTiers[currentTier];

  useEffect(() => {
    loadPaymentMethods();
    calculateProration();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      setIsLoading(true);
      
      // TODO: Load actual payment methods from Stripe
      // Mock data for demonstration
      const mockPaymentMethods: PaymentMethod[] = [
        {
          id: 'pm_1',
          type: 'card',
          last4: '4242',
          brand: 'visa',
          expiryMonth: 12,
          expiryYear: 2025,
          isDefault: true,
        },
        {
          id: 'pm_2',
          type: 'card',
          last4: '0005',
          brand: 'mastercard',
          expiryMonth: 8,
          expiryYear: 2026,
          isDefault: false,
        },
      ];

      setPaymentMethods(mockPaymentMethods);
      
      // Set default payment method
      const defaultMethod = mockPaymentMethods.find(pm => pm.isDefault);
      if (defaultMethod) {
        setSelectedPaymentMethod(defaultMethod.id);
      }
      
    } catch (error) {
      console.error('Error loading payment methods:', error);
      Alert.alert('Error', 'Failed to load payment methods');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateProration = async () => {
    try {
      if (isUpgrade && subscription) {
        // Calculate proration for upgrade
        const currentPrice = currentTierInfo.monthlyPrice;
        const targetPrice = targetTierInfo.monthlyPrice;
        const daysRemaining = Math.ceil(
          (subscription.currentPeriodEnd!.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );
        const totalDaysInPeriod = billingCycle === 'monthly' ? 30 : 365;
        const prorationFactor = daysRemaining / totalDaysInPeriod;
        
        const proration = (targetPrice - currentPrice) * prorationFactor;
        setProrationAmount(Math.max(0, proration));
      }
    } catch (error) {
      console.error('Error calculating proration:', error);
    }
  };

  const handlePaymentMethodSelection = (paymentMethodId: string) => {
    setSelectedPaymentMethod(paymentMethodId);
  };

  const getPaymentMethodIcon = (brand?: string) => {
    switch (brand?.toLowerCase()) {
      case 'visa': return 'credit-card';
      case 'mastercard': return 'credit-card';
      case 'american express': return 'credit-card';
      case 'discover': return 'credit-card';
      default: return 'payment';
    }
  };

  const getTransactionAmount = () => {
    if (isDowngrade) return 0; // Downgrades happen at next billing cycle
    if (prorationAmount !== null) return prorationAmount;
    
    const basePrice = billingCycle === 'monthly' 
      ? targetTierInfo.monthlyPrice 
      : targetTierInfo.yearlyPrice;
    
    return basePrice;
  };

  const getTransactionDescription = () => {
    if (isUpgrade) {
      return prorationAmount !== null && prorationAmount > 0
        ? `Upgrade to ${targetTierInfo.biblicalName} (prorated)`
        : `Upgrade to ${targetTierInfo.biblicalName}`;
    }
    
    if (isDowngrade) {
      return `Downgrade to ${targetTierInfo.biblicalName} (effective next billing cycle)`;
    }
    
    if (isNewSubscription) {
      return `Subscribe to ${targetTierInfo.biblicalName}`;
    }
    
    return `Change to ${targetTierInfo.biblicalName}`;
  };

  const processPayment = async () => {
    if (!selectedPaymentMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    try {
      setIsProcessing(true);

      const amount = getTransactionAmount();

      if (isUpgrade) {
        await upgradeTier(targetTier, billingCycle);
        
        await sendNotification({
          type: 'subscription_upgraded',
          title: '🎉 Upgrade Successful!',
          body: `Welcome to ${targetTierInfo.biblicalName}! Your new features are now active.`,
          priority: 'normal',
          actionUrl: '/dashboard',
          actionText: 'Explore Features',
        });
        
      } else if (isDowngrade) {
        await downgradeTier(targetTier);
        
        await sendNotification({
          type: 'subscription_downgraded',
          title: 'Subscription Updated',
          body: `Your subscription will change to ${targetTierInfo.biblicalName} at the next billing cycle.`,
          priority: 'normal',
        });
        
      } else if (isNewSubscription) {
        // Handle new subscription creation
        await convertTrialToSubscription(billingCycle);
        
        await sendNotification({
          type: 'subscription_upgraded',
          title: '✨ Welcome to Premium!',
          body: `Your ${targetTierInfo.biblicalName} subscription is now active. Your Kingdom journey begins!`,
          priority: 'normal',
          actionUrl: '/dashboard',
          actionText: 'Get Started',
        });
      }

      // Show success message
      Alert.alert(
        'Success!',
        isDowngrade 
          ? 'Your subscription will be updated at the next billing cycle.'
          : 'Your subscription has been updated successfully!',
        [
          {
            text: 'Continue',
            onPress: () => navigation.goBack(),
          },
        ]
      );

    } catch (error) {
      console.error('Error processing payment:', error);
      
      await sendNotification({
        type: 'payment_failed',
        title: '❌ Payment Failed',
        body: 'There was an issue processing your payment. Please try again or contact support.',
        priority: 'urgent',
        actionUrl: '/payment',
        actionText: 'Try Again',
      });
      
      Alert.alert(
        'Payment Failed',
        'There was an issue processing your payment. Please try again or contact support.',
        [
          { text: 'Try Again', onPress: () => setIsProcessing(false) },
          { text: 'Contact Support', onPress: () => navigation.navigate('Support') },
        ]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading payment information...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={currentMode === 'faith' ? ['#1E3A8A', '#3B82F6'] : ['#065F46', '#10B981']}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Complete Payment</Text>
          <Text style={styles.headerSubtitle}>
            {getTransactionDescription()}
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Transaction Summary */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Transaction Summary
          </Text>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
              Current Plan
            </Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {currentTierInfo.biblicalName}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
              New Plan
            </Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {targetTierInfo.biblicalName}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
              Billing Cycle
            </Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {billingCycle === 'monthly' ? 'Monthly' : 'Yearly'}
            </Text>
          </View>
          
          {prorationAmount !== null && prorationAmount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                Prorated Amount
              </Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {formatCurrency(prorationAmount)}
              </Text>
            </View>
          )}
          
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>
              {isDowngrade ? 'Amount Due at Next Cycle' : 'Amount Due Today'}
            </Text>
            <Text style={[styles.totalValue, { color: colors.primary }]}>
              {formatCurrency(getTransactionAmount())}
            </Text>
          </View>
        </View>

        {/* Features Comparison */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            What You'll Get
          </Text>
          
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <MaterialIcons name="check-circle" size={20} color="#10B981" />
              <Text style={[styles.featureText, { color: colors.text }]}>
                {targetTierInfo.features.aiGenerationsPerDay === -1 
                  ? 'Unlimited AI generations'
                  : `${targetTierInfo.features.aiGenerationsPerDay} AI generations per day`
                }
              </Text>
            </View>
            
            <View style={styles.featureItem}>
              <MaterialIcons name="check-circle" size={20} color="#10B981" />
              <Text style={[styles.featureText, { color: colors.text }]}>
                {targetTierInfo.features.premiumTemplates ? 'Premium templates' : 'Basic templates'}
              </Text>
            </View>
            
            <View style={styles.featureItem}>
              <MaterialIcons name="check-circle" size={20} color="#10B981" />
              <Text style={[styles.featureText, { color: colors.text }]}>
                {targetTierInfo.features.analytics} analytics
              </Text>
            </View>
            
            {targetTierInfo.features.teamSeats > 1 && (
              <View style={styles.featureItem}>
                <MaterialIcons name="check-circle" size={20} color="#10B981" />
                <Text style={[styles.featureText, { color: colors.text }]}>
                  {targetTierInfo.features.teamSeats === -1 
                    ? 'Unlimited team seats'
                    : `${targetTierInfo.features.teamSeats} team seats`
                  }
                </Text>
              </View>
            )}
            
            {targetTierInfo.features.prioritySupport && (
              <View style={styles.featureItem}>
                <MaterialIcons name="check-circle" size={20} color="#10B981" />
                <Text style={[styles.featureText, { color: colors.text }]}>
                  Priority support
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Payment Method Selection */}
        {!isDowngrade && (
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Payment Method
            </Text>
            
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentMethodCard,
                  {
                    backgroundColor: selectedPaymentMethod === method.id 
                      ? colors.primary + '20' 
                      : colors.background,
                    borderColor: selectedPaymentMethod === method.id 
                      ? colors.primary 
                      : colors.border,
                  },
                ]}
                onPress={() => handlePaymentMethodSelection(method.id)}
              >
                <View style={styles.paymentMethodInfo}>
                  <MaterialIcons 
                    name={getPaymentMethodIcon(method.brand)} 
                    size={24} 
                    color={colors.text} 
                  />
                  <View style={styles.paymentMethodDetails}>
                    <Text style={[styles.paymentMethodText, { color: colors.text }]}>
                      {method.brand?.toUpperCase()} •••• {method.last4}
                    </Text>
                    {method.expiryMonth && method.expiryYear && (
                      <Text style={[styles.paymentMethodExpiry, { color: colors.textSecondary }]}>
                        Expires {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={styles.paymentMethodActions}>
                  {method.isDefault && (
                    <View style={[styles.defaultBadge, { backgroundColor: colors.primary }]}>
                      <Text style={styles.defaultBadgeText}>Default</Text>
                    </View>
                  )}
                  <MaterialIcons 
                    name={selectedPaymentMethod === method.id ? 'radio-button-checked' : 'radio-button-unchecked'} 
                    size={24} 
                    color={selectedPaymentMethod === method.id ? colors.primary : colors.textSecondary} 
                  />
                </View>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity
              style={[styles.addPaymentMethodButton, { borderColor: colors.border }]}
              onPress={() => setShowPaymentMethodModal(true)}
            >
              <MaterialIcons name="add" size={24} color={colors.primary} />
              <Text style={[styles.addPaymentMethodText, { color: colors.primary }]}>
                Add New Payment Method
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Security Notice */}
        <View style={[styles.securityNotice, { backgroundColor: colors.surface }]}>
          <MaterialIcons name="security" size={24} color="#10B981" />
          <View style={styles.securityText}>
            <Text style={[styles.securityTitle, { color: colors.text }]}>
              Secure Payment
            </Text>
            <Text style={[styles.securityDescription, { color: colors.textSecondary }]}>
              Your payment information is encrypted and secure. We partner with Stripe for industry-leading security.
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {!isDowngrade && (
            <TouchableOpacity
              style={[
                styles.confirmButton,
                { 
                  backgroundColor: colors.primary,
                  opacity: isProcessing ? 0.7 : 1,
                },
              ]}
              onPress={processPayment}
              disabled={isProcessing || !selectedPaymentMethod}
            >
              {isProcessing ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <MaterialIcons name="payment" size={20} color="white" />
                  <Text style={styles.confirmButtonText}>
                    {isUpgrade ? 'Upgrade Now' : isNewSubscription ? 'Start Subscription' : 'Confirm Payment'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}
          
          {isDowngrade && (
            <TouchableOpacity
              style={[
                styles.confirmButton,
                { backgroundColor: '#F59E0B' },
              ]}
              onPress={processPayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.confirmButtonText}>
                  Confirm Downgrade
                </Text>
              )}
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[styles.cancelButton, { borderColor: colors.border }]}
            onPress={() => navigation.goBack()}
            disabled={isProcessing}
          >
            <Text style={[styles.cancelButtonText, { color: colors.text }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Add Payment Method Modal */}
      <Modal
        visible={showPaymentMethodModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Add Payment Method
            </Text>
            <TouchableOpacity onPress={() => setShowPaymentMethodModal(false)}>
              <MaterialIcons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalContent}>
            <Text style={[styles.modalText, { color: colors.text }]}>
              Payment method integration with Stripe Elements will be implemented here.
            </Text>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowPaymentMethodModal(false)}
            >
              <Text style={styles.modalButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
  header: {
    padding: 24,
    paddingTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    flex: 1,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodDetails: {
    marginLeft: 12,
    flex: 1,
  },
  paymentMethodText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  paymentMethodExpiry: {
    fontSize: 14,
  },
  paymentMethodActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  defaultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  addPaymentMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  addPaymentMethodText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  securityText: {
    marginLeft: 12,
    flex: 1,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  securityDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionButtons: {
    gap: 12,
    marginBottom: 24,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PaymentFlowScreen;

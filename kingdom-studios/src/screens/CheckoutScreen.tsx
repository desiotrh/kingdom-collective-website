import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useAppNavigation } from '../utils/navigationUtils';
import { useFaithMode } from '../contexts/FaithModeContext';
import { useAuth } from '../contexts/UnifiedAuthContext';
import { KingdomColors } from '../constants/KingdomColors';
import { KingdomShadows } from '../constants/KingdomShadows';
import KingdomLogo from '../components/KingdomLogo';
import paymentService, { Product } from '../services/paymentService';
import advancedAnalyticsService from '../services/advancedAnalyticsService';
import notificationService from '../services/notificationService';

type CheckoutRouteProp = RouteProp<{
  Checkout: {
    product: Product;
    plan?: 'monthly' | 'yearly';
  };
}, 'Checkout'>;

const CheckoutScreen: React.FC = () => {
  const navigation = useAppNavigation();
  const route = useRoute<CheckoutRouteProp>();
  const { faithMode } = useFaithMode();
  const { user } = useAuth();
  const { product, plan } = route.params;

  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

  useEffect(() => {
    loadPaymentMethods();
    trackCheckoutStart();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      const methods = await paymentService.getPaymentMethods();
      setPaymentMethods(methods);
      if (methods.length > 0) {
        setSelectedPaymentMethod(methods[0].id);
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
    }
  };

  const trackCheckoutStart = async () => {
    await advancedAnalyticsService.trackEvent({
      name: 'checkout_started',
      parameters: {
        product_id: product.id,
        product_name: product.name,
        amount: product.price,
        currency: product.currency,
        type: product.type,
        faith_mode: faithMode,
      }
    });
  };

  const handlePayment = async () => {
    if (!user || !selectedPaymentMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    setLoading(true);
    try {
      let result;

      if (product.type === 'subscription') {
        // Handle subscription
        result = await paymentService.createSubscription(
          selectedPaymentMethod,
          product.id,
          plan || 'monthly'
        );

        if (result.success) {
          // Schedule renewal reminder if faith mode
          if (faithMode && result.subscription) {
            await notificationService.scheduleNotification({
              id: `subscription_${result.subscription.id}`,
              title: 'Kingdom Subscription Renewed! 👑',
              body: 'Your Kingdom Studios subscription has been renewed. Keep building God\'s Kingdom through your business!',
              trigger: {
                type: 'time',
                value: new Date(result.subscription.currentPeriodEnd * 1000 - 86400000), // 1 day before
                repeats: false,
              }
            });
          }
        }
      } else {
        // Handle one-time payment
        result = await paymentService.processPayment(
          product.price,
          product.name,
          product.currency
        );
      }

      if (result.success) {
        // Track successful purchase
        await advancedAnalyticsService.trackPurchase(
          result.transactionId || `purchase_${Date.now()}`,
          product.price,
          product.currency
        );

        // Send success notification
        await notificationService.sendLocalNotification({
          id: `purchase_${Date.now()}`,
          title: faithMode ? 'Kingdom Purchase Complete! 🙏' : 'Payment Successful! ✅',
          body: faithMode
            ? `Thank you for your purchase! May God bless your business endeavors.`
            : `Your payment for ${product.name} was successful.`,
          data: {
            type: 'purchase_success',
            productId: product.id,
            amount: product.price
          },
        });

        // Show success message
        Alert.alert(
          faithMode ? 'Praise God! 🙏' : 'Success! ✅',
          faithMode
            ? `Your purchase was successful! Thank you for partnering with Kingdom Studios. May this investment bear fruit for God's Kingdom.`
            : `Your payment was successful! You now have access to ${product.name}.`,
          [
            {
              text: 'Continue',
              onPress: () => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Main' }]
                });
              }
            }
          ]
        );
      } else {
        throw new Error(result.error || 'Payment failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';

      // Track failed payment
      await advancedAnalyticsService.trackEvent({
        name: 'payment_failed',
        parameters: {
          product_id: product.id,
          error_message: errorMessage,
          amount: product.price,
        }
      });

      Alert.alert(
        'Payment Failed',
        `${errorMessage}\n\nPlease try again or contact support if the issue persists.`,
        [
          { text: 'Try Again' },
          {
            text: 'Contact Support',
            onPress: () => {
              // Open support contact
            }
          }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const addPaymentMethod = async () => {
    try {
      const result = await paymentService.setupPaymentMethod();
      if (result.success && result.paymentMethod) {
        setPaymentMethods(prev => [...prev, result.paymentMethod]);
        setSelectedPaymentMethod(result.paymentMethod.id);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add payment method');
    }
  };

  const calculateTotal = () => {
    let total = product.price;

    // Apply discount for yearly subscriptions
    if (product.type === 'subscription' && plan === 'yearly') {
      total = total * 10; // 2 months free on yearly
    }

    return total;
  };

  const renderPaymentMethod = (method: any) => (
    <TouchableOpacity
      key={method.id}
      style={[
        styles.paymentMethod,
        selectedPaymentMethod === method.id && styles.selectedPaymentMethod
      ]}
      onPress={() => setSelectedPaymentMethod(method.id)}
    >
      <View style={styles.paymentMethodContent}>
        <Text style={styles.paymentMethodBrand}>{method.card?.brand?.toUpperCase()}</Text>
        <Text style={styles.paymentMethodDetails}>•••• •••• •••• {method.card?.last4}</Text>
        <Text style={styles.paymentMethodExpiry}>
          {method.card?.expMonth}/{method.card?.expYear}
        </Text>
      </View>
      {selectedPaymentMethod === method.id && (
        <View style={styles.selectedIndicator}>
          <Text style={styles.selectedIndicatorText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[KingdomColors.primary.midnight, KingdomColors.primary.deepNavy]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <KingdomLogo size="medium" />
            <Text style={styles.headerTitle}>
              {faithMode ? 'Kingdom Checkout' : 'Checkout'}
            </Text>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Product Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <View style={styles.productCard}>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productDescription}>{product.description}</Text>
                {product.type === 'subscription' && (
                  <Text style={styles.subscriptionInfo}>
                    {plan === 'yearly' ? 'Annual Billing' : 'Monthly Billing'}
                  </Text>
                )}
                {product.features && (
                  <View style={styles.features}>
                    {product.features.map((feature, index) => (
                      <Text key={index} style={styles.feature}>✓ {feature}</Text>
                    ))}
                  </View>
                )}
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>
                  ${calculateTotal().toFixed(2)}
                  {product.type === 'subscription' && (
                    <Text style={styles.billingCycle}>
                      /{plan === 'yearly' ? 'year' : 'month'}
                    </Text>
                  )}
                </Text>
              </View>
            </View>
          </View>

          {/* Payment Methods */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Payment Method</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={addPaymentMethod}
              >
                <Text style={styles.addButtonText}>+ Add New</Text>
              </TouchableOpacity>
            </View>

            {paymentMethods.length > 0 ? (
              <View style={styles.paymentMethods}>
                {paymentMethods.map(renderPaymentMethod)}
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addPaymentMethodButton}
                onPress={addPaymentMethod}
              >
                <Text style={styles.addPaymentMethodText}>+ Add Payment Method</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Kingdom Message */}
          {faithMode && (
            <View style={styles.kingdomMessage}>
              <Text style={styles.kingdomMessageText}>
                "For where your treasure is, there your heart will be also." - Matthew 6:21
              </Text>
              <Text style={styles.kingdomMessageSubtext}>
                Thank you for investing in tools that advance God's Kingdom through business.
              </Text>
            </View>
          )}

          {/* Total and Pay Button */}
          <View style={styles.totalSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>
                ${calculateTotal().toFixed(2)} {product.currency.toUpperCase()}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.payButton,
                (!selectedPaymentMethod || loading) && styles.payButtonDisabled
              ]}
              onPress={handlePayment}
              disabled={!selectedPaymentMethod || loading}
            >
              {loading ? (
                <ActivityIndicator color={KingdomColors.primary.midnight} />
              ) : (
                <Text style={styles.payButtonText}>
                  {faithMode ? '🙏 Complete Kingdom Purchase' : 'Complete Payment'}
                </Text>
              )}
            </TouchableOpacity>

            <Text style={styles.securityNote}>
              🔒 Your payment information is secure and encrypted
            </Text>
          </View>

          <View style={{ height: 50 }} />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: KingdomColors.primary.midnight,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: KingdomColors.primary.deepNavy,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: KingdomColors.primary.deepNavy,
  },
  backButtonText: {
    color: KingdomColors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -40,
  },
  headerTitle: {
    color: KingdomColors.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    color: KingdomColors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: KingdomColors.gold.warm,
    borderRadius: 5,
  },
  addButtonText: {
    color: KingdomColors.primary.midnight,
    fontSize: 12,
    fontWeight: '600',
  },
  productCard: {
    backgroundColor: KingdomColors.primary.deepNavy,
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...KingdomShadows.medium,
  },
  productInfo: {
    flex: 1,
    marginRight: 15,
  },
  productName: {
    color: KingdomColors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productDescription: {
    color: KingdomColors.silver.bright,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  subscriptionInfo: {
    color: KingdomColors.gold.bright,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10,
  },
  features: {
    marginTop: 5,
  },
  feature: {
    color: KingdomColors.accent.success,
    fontSize: 12,
    marginBottom: 2,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    color: KingdomColors.gold.bright,
    fontSize: 24,
    fontWeight: 'bold',
  },
  billingCycle: {
    color: KingdomColors.silver.bright,
    fontSize: 14,
    fontWeight: 'normal',
  },
  paymentMethods: {
    gap: 10,
  },
  paymentMethod: {
    backgroundColor: KingdomColors.primary.deepNavy,
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPaymentMethod: {
    borderColor: KingdomColors.gold.warm,
  },
  paymentMethodContent: {
    flex: 1,
  },
  paymentMethodBrand: {
    color: KingdomColors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  paymentMethodDetails: {
    color: KingdomColors.silver.bright,
    fontSize: 14,
    marginBottom: 2,
  },
  paymentMethodExpiry: {
    color: KingdomColors.gray,
    fontSize: 12,
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: KingdomColors.gold.warm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIndicatorText: {
    color: KingdomColors.primary.midnight,
    fontSize: 12,
    fontWeight: 'bold',
  },
  addPaymentMethodButton: {
    backgroundColor: KingdomColors.primary.deepNavy,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: KingdomColors.gray,
    borderStyle: 'dashed',
  },
  addPaymentMethodText: {
    color: KingdomColors.gold.bright,
    fontSize: 16,
    fontWeight: '600',
  },
  kingdomMessage: {
    backgroundColor: KingdomColors.gold.warm,
    borderRadius: 15,
    padding: 20,
    marginTop: 30,
    ...KingdomShadows.medium,
  },
  kingdomMessageText: {
    color: KingdomColors.primary.midnight,
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 10,
  },
  kingdomMessageSubtext: {
    color: KingdomColors.primary.deepNavy,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  totalSection: {
    marginTop: 30,
    padding: 20,
    backgroundColor: KingdomColors.primary.deepNavy,
    borderRadius: 15,
    ...KingdomShadows.large,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  totalLabel: {
    color: KingdomColors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    color: KingdomColors.gold.bright,
    fontSize: 24,
    fontWeight: 'bold',
  },
  payButton: {
    backgroundColor: KingdomColors.gold.warm,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 15,
    ...KingdomShadows.medium,
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    color: KingdomColors.primary.midnight,
    fontSize: 18,
    fontWeight: 'bold',
  },
  securityNote: {
    color: KingdomColors.silver.bright,
    fontSize: 12,
    textAlign: 'center',
  },
});

export default React.memo(CheckoutScreen);

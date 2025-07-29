import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { usePayment } from '../hooks/usePayment';
import { useTierSystem } from '../contexts/TierSystemContext';
import { useAuth } from '../contexts/UnifiedAuthContext';

/**
 * 💰 SUBSCRIPTION UPGRADE SCREEN
 * Beautiful pricing interface for Kingdom Studios tier upgrades
 */

const { width } = Dimensions.get('window');

interface TierOption {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  popular?: boolean;
  color: string;
  gradient: readonly [string, string, ...string[]];
}

const TIER_OPTIONS: TierOption[] = [
  {
    id: 'rooted',
    name: 'Rooted',
    description: 'Perfect for growing faith-based creators',
    monthlyPrice: 29,
    yearlyPrice: 290,
    features: [
      '75 AI generations per day',
      '25 design templates',
      '10GB storage',
      'Priority support',
      'Advanced analytics',
      'Social media scheduling'
    ],
    color: '#10B981',
    gradient: ['#10B981', '#059669'],
  },
  {
    id: 'commissioned',
    name: 'Commissioned',
    description: 'For serious content creators and small teams',
    monthlyPrice: 89,
    yearlyPrice: 890,
    popular: true,
    features: [
      '200 AI generations per day',
      '100 design templates',
      '50GB storage',
      '3 team seats',
      'White-label options',
      'API access',
      'Custom integrations'
    ],
    color: '#F59E0B',
    gradient: ['#F59E0B', '#D97706'],
  },
  {
    id: 'mantled_pro',
    name: 'Mantled Pro',
    description: 'Advanced features for professional ministries',
    monthlyPrice: 199,
    yearlyPrice: 1990,
    features: [
      '500 AI generations per day',
      'Unlimited design templates',
      '200GB storage',
      '10 team seats',
      'Advanced automation',
      'Custom branding',
      'Priority phone support'
    ],
    color: '#8B5CF6',
    gradient: ['#8B5CF6', '#7C3AED'],
  },
  {
    id: 'kingdom_enterprise',
    name: 'Kingdom Enterprise',
    description: 'Complete solution for large organizations',
    monthlyPrice: 599,
    yearlyPrice: 5990,
    features: [
      'Unlimited AI generations',
      'Unlimited everything',
      'Unlimited storage',
      'Unlimited team seats',
      'Dedicated account manager',
      'Custom development',
      'On-premise deployment'
    ],
    color: '#EF4444',
    gradient: ['#EF4444', '#DC2626'],
  },
];

export const SubscriptionUpgradeScreen: React.FC = () => {
  const { user } = useAuth();
  const { currentTier } = useTierSystem();
  const {
    upgradeSubscription,
    isLoading,
    error,
    calculateYearlySavings,
    getRecommendedTier,
    clearError,
  } = usePayment();

  const [selectedTier, setSelectedTier] = useState<string>('rooted');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [upgradingTier, setUpgradingTier] = useState<string | null>(null);

  useEffect(() => {
    const recommended = getRecommendedTier();
    setSelectedTier(recommended);
  }, [getRecommendedTier]);

  const handleUpgrade = async (tier: string) => {
    if (!user) {
      Alert.alert('Error', 'Please sign in to upgrade your subscription.');
      return;
    }

    try {
      setUpgradingTier(tier);
      
      const result = await upgradeSubscription(tier, billingCycle);
      
      if (result.success) {
        Alert.alert(
          '🎉 Upgrade Successful!',
          `Welcome to the ${TIER_OPTIONS.find(t => t.id === tier)?.name} tier! Your new features are now active.`,
          [{ text: 'Amazing!', style: 'default' }]
        );
      } else {
        Alert.alert('Upgrade Failed', result.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      Alert.alert('Upgrade Failed', 'Something went wrong. Please try again.');
    } finally {
      setUpgradingTier(null);
    }
  };

  const renderBillingToggle = () => (
    <View style={styles.billingToggle}>
      <TouchableOpacity
        style={[
          styles.billingOption,
          billingCycle === 'monthly' && styles.billingOptionActive,
        ]}
        onPress={() => setBillingCycle('monthly')}
      >
        <Text style={[
          styles.billingText,
          billingCycle === 'monthly' && styles.billingTextActive,
        ]}>
          Monthly
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.billingOption,
          billingCycle === 'yearly' && styles.billingOptionActive,
        ]}
        onPress={() => setBillingCycle('yearly')}
      >
        <Text style={[
          styles.billingText,
          billingCycle === 'yearly' && styles.billingTextActive,
        ]}>
          Yearly
        </Text>
        <View style={styles.savingsBadge}>
          <Text style={styles.savingsText}>Save 17%</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderTierCard = (tier: TierOption) => {
    const isCurrentTier = currentTier === tier.id;
    const isUpgrading = upgradingTier === tier.id;
    const price = billingCycle === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice;
    const savings = calculateYearlySavings(tier.id);

    return (
      <View key={tier.id} style={[styles.tierCard, tier.popular && styles.popularCard]}>
        {tier.popular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>Most Popular</Text>
          </View>
        )}
        
        <LinearGradient
          colors={tier.gradient}
          style={styles.tierHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.tierName}>{tier.name}</Text>
          <Text style={styles.tierDescription}>{tier.description}</Text>
        </LinearGradient>

        <View style={styles.tierBody}>
          <View style={styles.pricingSection}>
            <Text style={styles.price}>
              ${price}
              <Text style={styles.pricePeriod}>
                /{billingCycle === 'monthly' ? 'month' : 'year'}
              </Text>
            </Text>
            
            {billingCycle === 'yearly' && savings > 0 && (
              <Text style={styles.savings}>Save ${savings}/year</Text>
            )}
          </View>

          <View style={styles.featuresSection}>
            {tier.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Text style={styles.featureCheck}>✅</Text>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.upgradeButton,
              isCurrentTier && styles.currentTierButton,
              { backgroundColor: tier.color },
            ]}
            onPress={() => handleUpgrade(tier.id)}
            disabled={isCurrentTier || isUpgrading || isLoading}
          >
            {isUpgrading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.upgradeButtonText}>
                {isCurrentTier ? 'Current Plan' : `Upgrade to ${tier.name}`}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.title}>🚀 Upgrade Your Ministry</Text>
        <Text style={styles.subtitle}>
          Unlock powerful AI tools and features to amplify your faith-based content creation
        </Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={clearError}>
            <Text style={styles.dismissText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.currentTierSection}>
        <Text style={styles.currentTierLabel}>Current Plan</Text>
        <Text style={styles.currentTierName}>
          {currentTier === 'seed' ? 'Seed (Free)' : 
           TIER_OPTIONS.find(t => t.id === currentTier)?.name || 'Seed (Free)'}
        </Text>
      </View>

      {renderBillingToggle()}

      <View style={styles.tiersContainer}>
        {TIER_OPTIONS.map(renderTierCard)}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          All plans include our core AI content generation tools, community access, and basic analytics.
        </Text>
        <Text style={styles.footerText}>
          30-day money-back guarantee. Cancel anytime.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center' as const,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    color: '#FFFFFF',
    textAlign: 'center' as const,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center' as const,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  currentTierSection: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center' as const,
  },
  currentTierLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  currentTierName: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#FFFFFF',
  },
  billingToggle: {
    flexDirection: 'row' as const,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 4,
    marginBottom: 30,
  },
  billingOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center' as const,
    borderRadius: 8,
    position: 'relative' as const,
  },
  billingOptionActive: {
    backgroundColor: '#F97316',
  },
  billingText: {
    fontSize: 16,
    color: '#9CA3AF',
    fontWeight: '500' as const,
  },
  billingTextActive: {
    color: '#FFFFFF',
    fontWeight: '600' as const,
  },
  savingsBadge: {
    position: 'absolute' as const,
    top: -8,
    right: -8,
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  savingsText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold' as const,
  },
  tiersContainer: {
    gap: 20,
  },
  tierCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    overflow: 'hidden' as const,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  popularCard: {
    borderColor: '#F59E0B',
    transform: [{ scale: 1.02 }],
  },
  popularBadge: {
    position: 'absolute' as const,
    top: 0,
    right: 0,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomLeftRadius: 12,
    zIndex: 1,
  },
  popularText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold' as const,
  },
  tierHeader: {
    padding: 20,
    paddingTop: 30,
  },
  tierName: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  tierDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  tierBody: {
    padding: 20,
  },
  pricingSection: {
    alignItems: 'center' as const,
    marginBottom: 24,
  },
  price: {
    fontSize: 36,
    fontWeight: 'bold' as const,
    color: '#FFFFFF',
  },
  pricePeriod: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  savings: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600' as const,
    marginTop: 4,
  },
  featuresSection: {
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
  },
  featureCheck: {
    fontSize: 16,
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#FFFFFF',
    flex: 1,
  },
  upgradeButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center' as const,
  },
  currentTierButton: {
    backgroundColor: '#6B7280',
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
  footer: {
    marginTop: 40,
    alignItems: 'center' as const,
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center' as const,
    marginBottom: 8,
    lineHeight: 16,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    flex: 1,
  },
  dismissText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '600' as const,
  },
});

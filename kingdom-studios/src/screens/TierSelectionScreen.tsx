import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useAppNavigation } from '../utils/navigationUtils';
import { useDualMode } from '../contexts/DualModeContext';
import { useTierSystem, TierType, BillingCycle, TIER_PLANS } from '../contexts/TierSystemContext';
import { useAuth } from '../contexts/AuthContext';
import { KingdomColors, KingdomShadows } from '../constants/KingdomColors';
import KingdomLogo from '../components/KingdomLogo';
import ModeToggle from '../components/ModeToggle';

const { width, height } = Dimensions.get('window');

const TierSelectionScreen: React.FC = () => {
  const navigation = useAppNavigation();
  const { currentMode, getModeSpecificContent } = useDualMode();
  const { 
    currentTier, 
    trialStatus, 
    trialDaysRemaining,
    subscription,
    availableTiers,
    startTrial,
    upgradeTier,
    isUpgrading,
    canAccessFeature 
  } = useTierSystem();
  const { user } = useAuth();
  
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [selectedTier, setSelectedTier] = useState<TierType | null>(null);

  // Show trial banner if applicable
  const showTrialBanner = trialStatus === 'active' && trialDaysRemaining > 0;
  const showTrialExpiredBanner = trialStatus === 'expired';

  const handleTierSelect = async (tierType: TierType) => {
    if (tierType === currentTier) return;

    setSelectedTier(tierType);

    if (tierType === 'seed') {
      Alert.alert(
        'Downgrade to Seed?',
        'You will lose access to premium features. Are you sure?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Downgrade', style: 'destructive', onPress: () => downgradeTo(tierType) }
        ]
      );
      return;
    }

    if (tierType === 'commissioned' && !subscription && trialStatus === 'none') {
      // Offer trial for new users
      Alert.alert(
        '🎉 Start Your 14-Day Free Trial?',
        `Experience the full power of ${TIER_PLANS[tierType].biblicalName} with a free 14-day trial. No credit card required!`,
        [
          { text: 'Maybe Later', style: 'cancel' },
          { text: 'Start Free Trial', style: 'default', onPress: () => handleStartTrial() }
        ]
      );
      return;
    }

    if (tierType === 'kingdom_enterprise') {
      // Enterprise requires sales contact
      Alert.alert(
        'Kingdom Enterprise',
        'Let our team help you transform your ministry or business. We\'ll contact you within 24 hours.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Contact Sales', style: 'default', onPress: () => navigation.navigate('ContactSales') }
        ]
      );
      return;
    }

    // Navigate to checkout for paid tiers
    navigateToCheckout(tierType);
  };

  const handleStartTrial = async () => {
    try {
      await startTrial();
      navigation.goBack();
    } catch (error) {
      console.error('Trial start failed:', error);
    }
  };

  const downgradeTo = async (tierType: TierType) => {
    try {
      // Handle downgrade logic
      Alert.alert('Downgrade scheduled', 'Your plan will change at the end of your current billing period.');
    } catch (error) {
      console.error('Downgrade failed:', error);
    }
  };

  const navigateToCheckout = (tierType: TierType) => {
    const tier = TIER_PLANS[tierType];
    const price = billingCycle === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice;
    
    navigation.navigate('Checkout', {
      product: {
        id: tierType,
        name: tier.biblicalName,
        description: tier.description,
        price: price,
        currency: 'USD',
        type: 'subscription' as const,
        features: Object.entries(tier.features)
          .filter(([key, value]) => value !== false && value !== 'none' && value !== 0)
          .map(([key, value]) => {
            if (typeof value === 'boolean') return key.replace(/([A-Z])/g, ' $1').toLowerCase();
            if (typeof value === 'number') return `${key.replace(/([A-Z])/g, ' $1').toLowerCase()}: ${value === -1 ? 'unlimited' : value}`;
            return `${key.replace(/([A-Z])/g, ' $1').toLowerCase()}: ${value}`;
          }),
      },
      plan: billingCycle,
    });
  };

  const renderTrialBanner = () => {
    if (!showTrialBanner && !showTrialExpiredBanner) return null;

    return (
      <View style={styles.trialBanner}>
        <LinearGradient
          colors={showTrialExpiredBanner ? ['#DC2626', '#EF4444'] : [KingdomColors.gold.bright, KingdomColors.gold.deep]}
          style={styles.trialBannerGradient}
        >
          <Text style={styles.trialBannerText}>
            {showTrialExpiredBanner 
              ? '⏰ Your trial has expired - upgrade to continue'
              : `🎉 ${trialDaysRemaining} days left in your trial`
            }
          </Text>
          {showTrialBanner && (
            <TouchableOpacity 
              style={styles.convertTrialButton}
              onPress={() => handleTierSelect('commissioned')}
            >
              <Text style={styles.convertTrialButtonText}>Upgrade Now</Text>
            </TouchableOpacity>
          )}
        </LinearGradient>
      </View>
    );
  };

  const renderTierCard = (tierType: TierType) => {
    const tier = TIER_PLANS[tierType];
    const isCurrentTier = currentTier === tierType;
    const price = billingCycle === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice;
    const savings = billingCycle === 'yearly' && tier.monthlyPrice > 0 
      ? Math.round(((tier.monthlyPrice * 12) - tier.yearlyPrice) / (tier.monthlyPrice * 12) * 100) 
      : 0;

    const tierGradients = {
      seed: ['#374151', '#4B5563'],
      rooted: ['#059669', '#10B981'],
      commissioned: [KingdomColors.primary.royalPurple, KingdomColors.gold.bright],
      mantled_pro: [KingdomColors.gold.bright, KingdomColors.gold.deep],
      kingdom_enterprise: ['#7C3AED', '#A855F7'],
    };

    return (
      <TouchableOpacity
        key={tierType}
        style={[
          styles.tierCard,
          tier.popular && styles.popularCard,
          isCurrentTier && styles.currentTierCard
        ]}
        onPress={() => handleTierSelect(tierType)}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={tierGradients[tierType]}
          style={styles.tierCardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <BlurView intensity={15} style={styles.tierCardBlur}>
            
            {/* Badges */}
            {tier.badge && (
              <View style={[styles.badge, { backgroundColor: tier.badgeColor }]}>
                <Text style={styles.badgeText}>{tier.badge}</Text>
              </View>
            )}

            {isCurrentTier && (
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>CURRENT PLAN</Text>
              </View>
            )}

            {tierType === 'commissioned' && trialStatus === 'none' && !subscription && (
              <View style={styles.trialBadge}>
                <Text style={styles.trialBadgeText}>14-DAY FREE TRIAL</Text>
              </View>
            )}

            {/* Header */}
            <View style={styles.tierHeader}>
              <Text style={styles.tierName}>{tier.name}</Text>
              <Text style={styles.tierBiblicalName}>{tier.biblicalName}</Text>
              <Text style={styles.tierDescription}>{tier.description}</Text>
              {tier.scriptureReference && (
                <Text style={styles.scriptureReference}>{tier.scriptureReference}</Text>
              )}
            </View>

            {/* Pricing */}
            <View style={styles.pricingSection}>
              {tier.monthlyPrice === 0 ? (
                <Text style={styles.freePrice}>Free Forever</Text>
              ) : (
                <>
                  <View style={styles.priceContainer}>
                    <Text style={styles.currency}>$</Text>
                    <Text style={styles.price}>{price}</Text>
                    <Text style={styles.period}>/{billingCycle === 'monthly' ? 'mo' : 'yr'}</Text>
                  </View>
                  {billingCycle === 'yearly' && savings > 0 && (
                    <Text style={styles.savings}>Save {savings}%</Text>
                  )}
                </>
              )}
            </View>

            {/* Key Features */}
            <View style={styles.featuresContainer}>
              <Text style={styles.featuresTitle}>Key Features:</Text>
              
              {/* AI Generations */}
              <View style={styles.featureItem}>
                <Ionicons name="sparkles" size={16} color={KingdomColors.gold.bright} />
                <Text style={styles.featureText}>
                  {tier.features.aiGenerationsPerDay === -1 
                    ? 'Unlimited AI generations' 
                    : `${tier.features.aiGenerationsPerDay} AI generations/day`
                  }
                </Text>
              </View>

              {/* Analytics */}
              {tier.features.analytics !== 'none' && (
                <View style={styles.featureItem}>
                  <Ionicons name="analytics" size={16} color={KingdomColors.gold.bright} />
                  <Text style={styles.featureText}>
                    {tier.features.analytics.charAt(0).toUpperCase() + tier.features.analytics.slice(1)} analytics
                  </Text>
                </View>
              )}

              {/* Storage */}
              <View style={styles.featureItem}>
                <Ionicons name="cloud" size={16} color={KingdomColors.gold.bright} />
                <Text style={styles.featureText}>
                  {tier.features.storageGB === -1 
                    ? 'Unlimited storage' 
                    : `${tier.features.storageGB}GB storage`
                  }
                </Text>
              </View>

              {/* Team Seats */}
              {tier.features.teamSeats > 1 && (
                <View style={styles.featureItem}>
                  <Ionicons name="people" size={16} color={KingdomColors.gold.bright} />
                  <Text style={styles.featureText}>
                    {tier.features.teamSeats === -1 
                      ? 'Unlimited team seats' 
                      : `${tier.features.teamSeats} team seats`
                    }
                  </Text>
                </View>
              )}

              {/* Premium Features */}
              {tier.features.premiumTemplates && (
                <View style={styles.featureItem}>
                  <Ionicons name="library" size={16} color={KingdomColors.gold.bright} />
                  <Text style={styles.featureText}>Premium templates</Text>
                </View>
              )}

              {tier.features.apiAccess && (
                <View style={styles.featureItem}>
                  <Ionicons name="code" size={16} color={KingdomColors.gold.bright} />
                  <Text style={styles.featureText}>API access</Text>
                </View>
              )}

              {tier.features.prioritySupport && (
                <View style={styles.featureItem}>
                  <Ionicons name="headset" size={16} color={KingdomColors.gold.bright} />
                  <Text style={styles.featureText}>Priority support</Text>
                </View>
              )}
            </View>

            {/* CTA Button */}
            <TouchableOpacity
              style={[
                styles.ctaButton,
                isCurrentTier && styles.currentTierButton,
                tier.popular && styles.popularButton
              ]}
              onPress={() => handleTierSelect(tierType)}
              disabled={isCurrentTier || isUpgrading}
            >
              <Text style={[
                styles.ctaText,
                isCurrentTier && styles.currentTierButtonText
              ]}>
                {isCurrentTier 
                  ? 'Current Plan' 
                  : tierType === 'seed' 
                    ? 'Get Started Free'
                    : tierType === 'commissioned' && trialStatus === 'none' && !subscription
                      ? 'Start Free Trial'
                      : tierType === 'kingdom_enterprise'
                        ? 'Contact Sales'
                        : `Upgrade to ${tier.name}`
                }
              </Text>
            </TouchableOpacity>
          </BlurView>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[KingdomColors.background.primary, KingdomColors.background.secondary]}
        style={styles.background}
      >
        <SafeAreaView style={styles.safeArea}>
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <View style={styles.headerContent}>
              <KingdomLogo size="small" />
              <Text style={styles.headerTitle}>
                {getModeSpecificContent('Choose Your Kingdom Calling', 'Select Your Creator Tier')}
              </Text>
              <Text style={styles.headerSubtitle}>
                {getModeSpecificContent(
                  'Step into your divine assignment with the right tools',
                  'Scale your creative business with professional tools'
                )}
              </Text>
            </View>

            <ModeToggle compact style={styles.modeToggle} />
          </View>

          {/* Trial Banner */}
          {renderTrialBanner()}

          {/* Billing Toggle */}
          <View style={styles.billingToggle}>
            <TouchableOpacity
              style={[
                styles.billingOption,
                billingCycle === 'monthly' && styles.activeBillingOption
              ]}
              onPress={() => setBillingCycle('monthly')}
            >
              <Text style={[
                styles.billingText,
                billingCycle === 'monthly' && styles.activeBillingText
              ]}>
                Monthly
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.billingOption,
                billingCycle === 'yearly' && styles.activeBillingOption
              ]}
              onPress={() => setBillingCycle('yearly')}
            >
              <Text style={[
                styles.billingText,
                billingCycle === 'yearly' && styles.activeBillingText
              ]}>
                Yearly
              </Text>
              <View style={styles.savingsBadge}>
                <Text style={styles.savingsBadgeText}>2 Months Free</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Tier Cards */}
          <ScrollView 
            style={styles.tierCardsContainer}
            contentContainerStyle={styles.tierCardsContent}
            showsVerticalScrollIndicator={false}
          >
            {Object.keys(TIER_PLANS).map((tierType) => 
              renderTierCard(tierType as TierType)
            )}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {getModeSpecificContent(
                '✝️ All plans include Kingdom support and community access',
                '🚀 All plans include creator support and community access'
              )}
            </Text>
            <TouchableOpacity 
              style={styles.helpButton}
              onPress={() => navigation.navigate('TierFAQ')}
            >
              <Text style={styles.helpButtonText}>Need Help Choosing?</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16,
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: KingdomColors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  modeToggle: {
    alignSelf: 'center',
  },
  trialBanner: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  trialBannerGradient: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trialBannerText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  convertTrialButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 12,
  },
  convertTrialButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  billingToggle: {
    flexDirection: 'row',
    margin: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    padding: 4,
  },
  billingOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  activeBillingOption: {
    backgroundColor: KingdomColors.primary.royalPurple,
  },
  billingText: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.text.secondary,
  },
  activeBillingText: {
    color: '#FFFFFF',
  },
  savingsBadge: {
    backgroundColor: KingdomColors.gold.bright,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  savingsBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: KingdomColors.background.primary,
  },
  tierCardsContainer: {
    flex: 1,
  },
  tierCardsContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  tierCard: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    ...KingdomShadows.large,
  },
  popularCard: {
    borderWidth: 2,
    borderColor: KingdomColors.gold.bright,
  },
  currentTierCard: {
    borderWidth: 2,
    borderColor: KingdomColors.success,
  },
  tierCardGradient: {
    flex: 1,
  },
  tierCardBlur: {
    flex: 1,
    padding: 24,
  },
  badge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    zIndex: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: KingdomColors.background.primary,
  },
  currentBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: KingdomColors.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    zIndex: 1,
  },
  currentBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  trialBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: KingdomColors.gold.bright,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    zIndex: 1,
  },
  trialBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: KingdomColors.background.primary,
  },
  tierHeader: {
    marginBottom: 20,
    paddingTop: 20,
  },
  tierName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  tierBiblicalName: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.gold.bright,
    marginBottom: 8,
  },
  tierDescription: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  scriptureReference: {
    fontSize: 12,
    color: KingdomColors.gold.warm,
    fontStyle: 'italic',
  },
  pricingSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  freePrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.success,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currency: {
    fontSize: 20,
    fontWeight: '600',
    color: KingdomColors.gold.bright,
  },
  price: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  period: {
    fontSize: 16,
    color: KingdomColors.text.secondary,
    marginLeft: 4,
  },
  savings: {
    fontSize: 14,
    color: KingdomColors.success,
    fontWeight: '600',
    marginTop: 4,
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: KingdomColors.text.primary,
    marginLeft: 8,
    flex: 1,
  },
  ctaButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  popularButton: {
    backgroundColor: KingdomColors.gold.bright,
    borderColor: KingdomColors.gold.bright,
  },
  currentTierButton: {
    backgroundColor: KingdomColors.success,
    borderColor: KingdomColors.success,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  currentTierButtonText: {
    color: '#FFFFFF',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  helpButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: KingdomColors.primary.royalPurple,
  },
  helpButtonText: {
    fontSize: 14,
    color: KingdomColors.primary.royalPurple,
    fontWeight: '600',
  },
});

export default React.memo(TierSelectionScreen);

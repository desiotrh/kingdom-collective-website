import React, { useState } from 'react';
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
import { useAuth } from '../contexts/AuthContext';
import { KingdomColors, KingdomShadows } from '../constants/KingdomColors';
import KingdomLogo from '../components/KingdomLogo';
import ModeToggle from '../components/ModeToggle';

const { width, height } = Dimensions.get('window');

interface TierPlan {
  id: string;
  name: string;
  price: {
    monthly: number;
    yearly: number;
  };
  description: string;
  badge?: string;
  badgeColor?: string;
  features: {
    category: string;
    items: string[];
  }[];
  limitations?: string[];
  cta: string;
  gradient: string[];
  popular?: boolean;
  faithMode?: {
    name: string;
    description: string;
    features: {
      category: string;
      items: string[];
    }[];
  };
}

const TierSystemScreen: React.FC = () => {
  const navigation = useAppNavigation();
  const { currentMode, modeConfig, getModeSpecificContent, userTier, setUserTier } = useDualMode();
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const tierPlans: TierPlan[] = [
    {
      id: 'free',
      name: getModeSpecificContent('Kingdom Starter', 'Creator Starter'),
      price: { monthly: 0, yearly: 0 },
      description: getModeSpecificContent(
        'Perfect for those starting their Kingdom journey',
        'Perfect for those starting their creative journey'
      ),
      features: [
        {
          category: 'Content Creation',
          items: [
            '5 AI-generated posts per month',
            '2 design templates',
            'Basic hashtag suggestions',
            'Standard support'
          ]
        },
        {
          category: currentMode === 'faith' ? 'Kingdom Features' : 'Community Features',
          items: currentMode === 'faith' 
            ? ['Access to scripture database', 'Faith-based templates', 'Prayer request feature']
            : ['Community access', 'Inspirational quotes', 'Motivation tracker']
        }
      ],
      limitations: [
        'Limited AI generations',
        'Basic templates only',
        'Standard support response'
      ],
      cta: 'Get Started Free',
      gradient: ['#1F2937', '#374151'],
    },
    {
      id: 'creator',
      name: getModeSpecificContent('Kingdom Creator', 'Creator Pro'),
      price: { monthly: 29, yearly: 290 },
      description: getModeSpecificContent(
        'For serious Kingdom builders ready to multiply their impact',
        'For serious creators ready to scale their business'
      ),
      badge: 'MOST POPULAR',
      badgeColor: KingdomColors.gold.bright,
      popular: true,
      features: [
        {
          category: 'Content Creation',
          items: [
            '100 AI-generated posts per month',
            '20+ premium design templates',
            'Advanced hashtag research',
            'Multi-platform posting',
            'Content calendar',
            'Brand voice training'
          ]
        },
        {
          category: 'Business Tools',
          items: [
            'Product sync & management',
            'Lead magnet builder',
            'Basic analytics',
            'Email sequences',
            'Community features'
          ]
        },
        {
          category: currentMode === 'faith' ? 'Kingdom Features' : 'Premium Features',
          items: currentMode === 'faith' 
            ? ['Full scripture integration', 'Prophetic word generator', 'Kingdom declaration templates', 'Faith-based business tools']
            : ['Advanced motivational content', 'Success mindset tools', 'Goal tracking', 'Inspiration library']
        }
      ],
      cta: 'Start Creating',
      gradient: [KingdomColors.primary.royalPurple, KingdomColors.primary.deepNavy],
    },
    {
      id: 'pro',
      name: getModeSpecificContent('Kingdom Leader', 'Creator Elite'),
      price: { monthly: 79, yearly: 790 },
      description: getModeSpecificContent(
        'For Kingdom leaders building movements and impacting nations',
        'For elite creators building empires and changing industries'
      ),
      badge: 'PREMIUM',
      badgeColor: KingdomColors.gold.bright,
      features: [
        {
          category: 'Advanced Creation',
          items: [
            'Unlimited AI generations',
            'Custom template creation',
            'Advanced design studio',
            'Video editing tools',
            'Auto-posting scheduler',
            'AI voice & tone matching'
          ]
        },
        {
          category: 'Business Suite',
          items: [
            'Advanced analytics & insights',
            'Funnel builder & automation',
            'E-commerce integration',
            'Team collaboration tools',
            'Custom branding options',
            'API access'
          ]
        },
        {
          category: currentMode === 'faith' ? 'Kingdom Leadership' : 'Elite Features',
          items: currentMode === 'faith' 
            ? ['Ministry management tools', 'Discipleship pathways', 'Kingdom business automation', 'Prophetic content AI', 'Church growth tools']
            : ['Mentorship platform', 'Advanced coaching tools', 'Success automation', 'Elite community access', 'Personal branding suite']
        }
      ],
      cta: 'Become Elite',
      gradient: [KingdomColors.gold.bright, KingdomColors.gold.deep],
    },
    {
      id: 'business',
      name: getModeSpecificContent('Kingdom Enterprise', 'Creator Enterprise'),
      price: { monthly: 199, yearly: 1990 },
      description: getModeSpecificContent(
        'For Kingdom enterprises and organizations transforming industries',
        'For enterprises and agencies managing multiple creators'
      ),
      badge: 'ENTERPRISE',
      badgeColor: '#10B981',
      features: [
        {
          category: 'Enterprise Features',
          items: [
            'Everything in Elite',
            'Multi-user management',
            'Advanced team tools',
            'Custom integrations',
            'Dedicated account manager',
            'Priority support (24/7)'
          ]
        },
        {
          category: 'Organization Tools',
          items: [
            'Advanced user permissions',
            'Custom workflows',
            'Enterprise analytics',
            'Bulk content generation',
            'Advanced automation',
            'Custom training'
          ]
        },
        {
          category: currentMode === 'faith' ? 'Kingdom Organization' : 'Enterprise Management',
          items: currentMode === 'faith' 
            ? ['Multi-ministry management', 'Kingdom impact tracking', 'Organizational discipleship', 'Corporate prayer tools', 'Kingdom business suite']
            : ['Multi-brand management', 'Enterprise coaching', 'Organization-wide analytics', 'Advanced mentorship', 'Corporate success tools']
        }
      ],
      cta: 'Contact Sales',
      gradient: ['#10B981', '#059669'],
    }
  ];

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    
    if (planId === 'free') {
      // Handle free plan
      handleSubscribe(planId);
    } else if (planId === 'business') {
      // Contact sales
      Alert.alert(
        'Enterprise Sales',
        'Our sales team will contact you within 24 hours to discuss your enterprise needs.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Continue', onPress: () => navigation.navigate('ContactSales') }
        ]
      );
    } else {
      // Navigate to checkout
      const plan = tierPlans.find(p => p.id === planId);
      if (plan) {
        navigation.navigate('Checkout', {
          product: {
            id: planId,
            name: plan.name,
            description: plan.description,
            price: billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly,
            currency: 'USD',
            type: 'subscription' as const,
            features: plan.features.flatMap(f => f.items),
          },
          plan: billingCycle,
        });
      }
    }
  };

  const handleSubscribe = async (planId: string) => {
    try {
      // Update user tier
      await setUserTier(planId as 'free' | 'creator' | 'pro' | 'business');
      
      Alert.alert(
        'Success!',
        `You've successfully upgraded to ${tierPlans.find(p => p.id === planId)?.name}!`,
        [{ text: 'Continue', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update your plan. Please try again.');
    }
  };

  const renderTierCard = (plan: TierPlan) => {
    const isCurrentPlan = userTier === plan.id;
    const price = billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly;
    const savings = billingCycle === 'yearly' ? Math.round(((plan.price.monthly * 12) - plan.price.yearly) / (plan.price.monthly * 12) * 100) : 0;

    return (
      <TouchableOpacity
        key={plan.id}
        style={[
          styles.tierCard,
          plan.popular && styles.popularCard,
          isCurrentPlan && styles.currentPlanCard
        ]}
        onPress={() => handlePlanSelect(plan.id)}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={plan.gradient}
          style={styles.tierCardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <BlurView intensity={20} style={styles.tierCardBlur}>
            {/* Badge */}
            {plan.badge && (
              <View style={[styles.badge, { backgroundColor: plan.badgeColor }]}>
                <Text style={styles.badgeText}>{plan.badge}</Text>
              </View>
            )}

            {isCurrentPlan && (
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>CURRENT PLAN</Text>
              </View>
            )}

            {/* Header */}
            <View style={styles.tierHeader}>
              <Text style={styles.tierName}>{plan.name}</Text>
              <Text style={styles.tierDescription}>{plan.description}</Text>
            </View>

            {/* Pricing */}
            <View style={styles.pricingSection}>
              <View style={styles.priceContainer}>
                <Text style={styles.currency}>$</Text>
                <Text style={styles.price}>{price}</Text>
                <Text style={styles.period}>/{billingCycle === 'monthly' ? 'mo' : 'yr'}</Text>
              </View>
              {billingCycle === 'yearly' && savings > 0 && (
                <Text style={styles.savings}>Save {savings}%</Text>
              )}
            </View>

            {/* Features */}
            <ScrollView style={styles.featuresContainer} showsVerticalScrollIndicator={false}>
              {plan.features.map((category, index) => (
                <View key={index} style={styles.featureCategory}>
                  <Text style={styles.featureCategoryTitle}>{category.category}</Text>
                  {category.items.map((item, itemIndex) => (
                    <View key={itemIndex} style={styles.featureItem}>
                      <Ionicons name="checkmark-circle" size={16} color={KingdomColors.success} />
                      <Text style={styles.featureText}>{item}</Text>
                    </View>
                  ))}
                </View>
              ))}

              {/* Limitations */}
              {plan.limitations && (
                <View style={styles.limitationsSection}>
                  <Text style={styles.limitationsTitle}>Limitations</Text>
                  {plan.limitations.map((limitation, index) => (
                    <View key={index} style={styles.limitationItem}>
                      <Ionicons name="remove-circle" size={16} color={KingdomColors.text.muted} />
                      <Text style={styles.limitationText}>{limitation}</Text>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>

            {/* CTA Button */}
            <TouchableOpacity
              style={[
                styles.ctaButton,
                isCurrentPlan && styles.currentPlanButton,
                plan.popular && styles.popularButton
              ]}
              onPress={() => handlePlanSelect(plan.id)}
              disabled={isCurrentPlan}
            >
              <Text style={[
                styles.ctaText,
                isCurrentPlan && styles.currentPlanButtonText
              ]}>
                {isCurrentPlan ? 'Current Plan' : plan.cta}
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
                {getModeSpecificContent('Kingdom Tiers', 'Creator Tiers')}
              </Text>
              <Text style={styles.headerSubtitle}>
                {getModeSpecificContent(
                  'Choose your Kingdom calling and start building for eternity',
                  'Choose your creator level and start building your empire'
                )}
              </Text>
            </View>

            <ModeToggle compact style={styles.modeToggle} />
          </View>

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
                <Text style={styles.savingsBadgeText}>Save 20%</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Tier Cards */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.tierCardsContainer}
            contentContainerStyle={styles.tierCardsContent}
            pagingEnabled
          >
            {tierPlans.map(renderTierCard)}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {getModeSpecificContent(
                '🙏 All plans include Kingdom support and resources',
                '🚀 All plans include creator support and community access'
              )}
            </Text>
            <TouchableOpacity 
              style={styles.faqButton}
              onPress={() => navigation.navigate('FAQ')}
            >
              <Text style={styles.faqButtonText}>View FAQ</Text>
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
    paddingVertical: 10,
  },
  tierCard: {
    width: width - 40,
    marginRight: 20,
    borderRadius: 20,
    overflow: 'hidden',
    ...KingdomShadows.large,
  },
  popularCard: {
    borderWidth: 2,
    borderColor: KingdomColors.gold.bright,
  },
  currentPlanCard: {
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
  tierHeader: {
    marginBottom: 20,
    paddingTop: 20,
  },
  tierName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  tierDescription: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    lineHeight: 20,
  },
  pricingSection: {
    alignItems: 'center',
    marginBottom: 24,
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
    flex: 1,
    marginBottom: 20,
  },
  featureCategory: {
    marginBottom: 16,
  },
  featureCategoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: KingdomColors.gold.bright,
    marginBottom: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  featureText: {
    fontSize: 14,
    color: KingdomColors.text.primary,
    marginLeft: 8,
    flex: 1,
  },
  limitationsSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  limitationsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.text.muted,
    marginBottom: 8,
  },
  limitationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  limitationText: {
    fontSize: 12,
    color: KingdomColors.text.muted,
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
  currentPlanButton: {
    backgroundColor: KingdomColors.success,
    borderColor: KingdomColors.success,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  currentPlanButtonText: {
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
  faqButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: KingdomColors.primary.royalPurple,
  },
  faqButtonText: {
    fontSize: 14,
    color: KingdomColors.primary.royalPurple,
    fontWeight: '600',
  },
});

export default React.memo(TierSystemScreen);

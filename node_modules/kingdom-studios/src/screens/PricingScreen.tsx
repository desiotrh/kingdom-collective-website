import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useAppNavigation } from '../utils/navigationUtils';
import { useFaithMode } from '../contexts/FaithModeContext';
import { useApp, getSubscriptionLimits } from '../contexts/AppContext';
import { KingdomColors, KingdomShadows } from '../constants/KingdomColors';
import KingdomLogo from '../components/KingdomLogo';

const { width } = Dimensions.get('window');

interface PricingTier {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
  sponsored?: boolean;
  icon?: string;
  description?: string;
}

interface PricingBenefit {
  icon: string;
  title: string;
  description: string;
}

const PricingScreen = () => {
  const navigation = useAppNavigation();
  const { faithMode } = useFaithMode();
  const { appState, requestSponsorship } = useApp();
  const [selectedTier, setSelectedTier] = useState<string>('');

  const pricingTiers: PricingTier[] = [
    {
      id: 'free',
      name: 'Creator Start',
      price: 'Free',
      period: 'Always',
      icon: '🌱',
      description: 'Perfect for getting started on your creative journey',
      features: [
        '5 products maximum',
        '3 scheduled posts',
        '10 AI generations/month',
        'Basic templates',
        'Community access',
        'Mobile app access',
        'Basic analytics',
      ],
    },
    {
      id: 'sponsored',
      name: faithMode ? 'Forge Sponsored' : 'Community Sponsored',
      price: 'Sponsored',
      period: 'By supporter',
      sponsored: true,
      icon: faithMode ? '🙏' : '✨',
      description: faithMode 
        ? 'Blessed by your church, mentor, or ministry supporter'
        : 'Backed by your mentor, business, or community supporter',
      features: [
        'Unlimited products',
        'Unlimited scheduling',
        'Unlimited AI generations',
        'Premium templates',
        'Priority support',
        'Advanced analytics',
        'Community leadership tools',
        'White-label options',
        'Team collaboration',
        'API access',
      ],
    },
    {
      id: 'pro',
      name: 'Creator Pro',
      price: '$19',
      period: '/month',
      popular: true,
      icon: '👑',
      description: 'Unlock your full creative potential with premium features',
      features: [
        'Unlimited products',
        'Unlimited scheduling',
        'Unlimited AI generations',
        'Premium templates',
        'Advanced analytics',
        'Priority support',
        'Team collaboration',
        'White-label options',
        'API access',
        'Custom integrations',
      ],
    },
  ];

  const benefits: PricingBenefit[] = [
    {
      icon: '🚀',
      title: 'Scale Your Business',
      description: 'Grow from solo creator to brand empire with our comprehensive tools',
    },
    {
      icon: '🤖',
      title: 'AI-Powered Content',
      description: 'Generate stunning content with our advanced AI technology',
    },
    {
      icon: '📊',
      title: 'Analytics Dashboard',
      description: 'Track performance and optimize your content strategy',
    },
    {
      icon: '🌐',
      title: 'Multi-Platform',
      description: 'Manage all your social platforms from one central hub',
    },
  ];

  const handleRequestSponsorship = () => {
    navigation.navigate('SponsorshipRequest');
  };

  const handleSelectTier = (tierId: string) => {
    if (tierId === 'free') {
      Alert.alert(
        'Current Plan',
        'You are already on the free plan. Upgrade to Pro or request sponsorship for more features.',
      );
      return;
    }

    if (tierId === 'sponsored') {
      handleRequestSponsorship();
      return;
    }

    if (tierId === 'pro') {
      Alert.alert(
        'Coming Soon!',
        'Pro subscriptions will be available soon. For early access, request sponsorship or contact us.',
        [
          {
            text: 'Request Sponsorship',
            onPress: handleRequestSponsorship,
          },
          {
            text: 'OK',
            style: 'cancel',
          },
        ]
      );
    }
  };

  const renderFeature = (feature: string) => (
    <View key={feature} style={styles.featureRow}>
      <Text style={styles.featureIcon}>✓</Text>
      <Text style={styles.featureText}>{feature}</Text>
    </View>
  );

  const BenefitCard = ({ benefit }: { benefit: PricingBenefit }) => (
    <BlurView intensity={15} style={styles.benefitCard}>
      <LinearGradient
        colors={['rgba(255, 215, 0, 0.1)', 'rgba(255, 215, 0, 0.05)'] as const}
        style={styles.benefitGradient}
      >
        <Text style={styles.benefitIcon}>{benefit.icon}</Text>
        <Text style={styles.benefitTitle}>{benefit.title}</Text>
        <Text style={styles.benefitDescription}>{benefit.description}</Text>
      </LinearGradient>
    </BlurView>
  );

  const PricingCard = ({ tier }: { tier: PricingTier }) => (
    <BlurView intensity={tier.popular ? 25 : 15} style={[
      styles.pricingCard,
      tier.popular && styles.pricingCardPopular,
      tier.sponsored && styles.pricingCardSponsored,
    ]}>
      <LinearGradient
        colors={
          tier.popular 
            ? ['rgba(255, 215, 0, 0.2)', 'rgba(255, 215, 0, 0.1)'] as const
            : tier.sponsored
            ? ['rgba(16, 185, 129, 0.2)', 'rgba(16, 185, 129, 0.1)'] as const
            : ['rgba(26, 26, 58, 0.8)', 'rgba(45, 27, 105, 0.6)'] as const
        }
        style={styles.cardGradient}
      >
        {tier.popular && (
          <View style={styles.popularBadge}>
            <LinearGradient
              colors={['#FFD700', '#FFC107'] as const}
              style={styles.badgeGradient}
            >
              <Text style={styles.popularBadgeText}>👑 MOST POPULAR</Text>
            </LinearGradient>
          </View>
        )}
        
        {tier.sponsored && (
          <View style={styles.sponsoredBadge}>
            <LinearGradient
              colors={['#10B981', '#059669'] as const}
              style={styles.badgeGradient}
            >
              <Text style={styles.sponsoredBadgeText}>
                {faithMode ? '🙏 FAITH COMMUNITY' : '✨ COMMUNITY SUPPORTED'}
              </Text>
            </LinearGradient>
          </View>
        )}

        <View style={styles.cardHeader}>
          <View style={styles.tierNameContainer}>
            <Text style={styles.tierIcon}>{tier.icon}</Text>
            <Text style={styles.tierName}>{tier.name}</Text>
          </View>
          <Text style={styles.tierDescription}>{tier.description}</Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{tier.price}</Text>
            <Text style={styles.period}>{tier.period}</Text>
          </View>
        </View>

        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>What's included:</Text>
          {tier.features.map(renderFeature)}
        </View>

        <TouchableOpacity
          style={[
            styles.selectButton,
            tier.popular && styles.selectButtonPopular,
            tier.sponsored && styles.selectButtonSponsored,
          ]}
          onPress={() => handleSelectTier(tier.id)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={
              tier.popular 
                ? ['#FFD700', '#FFC107', '#FF8F00'] as const
                : tier.sponsored
                ? ['#10B981', '#059669'] as const
                : ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'] as const
            }
            style={styles.buttonGradient}
          >
            <Text
              style={[
                styles.selectButtonText,
                (tier.popular || tier.sponsored) && styles.selectButtonTextActive,
              ]}
            >
              {tier.sponsored 
                ? (faithMode ? 'Request Blessing 🙏' : 'Request Sponsor ✨')
                : tier.id === 'free' 
                ? 'Current Plan'
                : 'Choose Plan'
              }
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </BlurView>
  );

  const currentLimits = getSubscriptionLimits(appState.subscriptionTier);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0F0F23', '#1A1A3A', '#2D1B69'] as const}
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
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <KingdomLogo size="small" />
              <Text style={styles.title}>Pricing Plans</Text>
            </View>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Hero Section */}
            <BlurView intensity={10} style={styles.heroSection}>
              <LinearGradient
                colors={['rgba(255, 215, 0, 0.15)', 'rgba(255, 215, 0, 0.05)'] as const}
                style={styles.heroGradient}
              >
                <Text style={styles.heroTitle}>
                  {faithMode ? '✨ Kingdom Pricing Plans' : '👑 Creator Pricing Plans'}
                </Text>
                <Text style={styles.heroSubtitle}>
                  {faithMode 
                    ? "Choose your path to digital ministry success. Every plan is designed to help you share God's love through your creative work."
                    : "Choose the perfect plan to scale your creative business. From startup to empire, we've got you covered."
                  }
                </Text>
              </LinearGradient>
            </BlurView>

            {/* Current Status */}
            <BlurView intensity={15} style={styles.currentStatus}>
              <LinearGradient
                colors={['rgba(26, 26, 58, 0.8)', 'rgba(45, 27, 105, 0.6)'] as const}
                style={styles.statusGradient}
              >
                <Text style={styles.currentStatusTitle}>📊 Your Current Plan</Text>
                <Text style={styles.currentStatusText}>
                  {appState.subscriptionTier === 'free' && '🌱 Creator Start (Free)'}
                  {appState.subscriptionTier === 'pro' && '👑 Creator Pro'}
                  {appState.subscriptionTier === 'sponsored' && (faithMode ? '🙏 Forge Sponsored' : '✨ Community Sponsored')}
                </Text>
                
                <View style={styles.limitsContainer}>
                  <Text style={styles.limitsTitle}>Current Limits:</Text>
                  <View style={styles.limitRow}>
                    <Text style={styles.limitLabel}>📦 Products:</Text>
                    <Text style={styles.limitValue}>
                      {currentLimits.maxProducts === Infinity ? 'Unlimited' : `${currentLimits.maxProducts} max`}
                    </Text>
                  </View>
                  <View style={styles.limitRow}>
                    <Text style={styles.limitLabel}>🤖 AI Generations:</Text>
                    <Text style={styles.limitValue}>
                      {currentLimits.aiGenerations === Infinity ? 'Unlimited' : `${currentLimits.aiGenerations}/month`}
                    </Text>
                  </View>
                  <View style={styles.limitRow}>
                    <Text style={styles.limitLabel}>📊 Analytics:</Text>
                    <Text style={styles.limitValue}>
                      {currentLimits.analytics ? 'Included' : 'Not available'}
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </BlurView>

            {/* Benefits Grid */}
            <Text style={styles.sectionTitle}>Why Choose Kingdom Studios?</Text>
            <View style={styles.benefitsGrid}>
              {benefits.map((benefit, index) => (
                <BenefitCard key={index} benefit={benefit} />
              ))}
            </View>

            {/* Pricing Cards */}
            <Text style={styles.sectionTitle}>Choose Your Plan</Text>
            <View style={styles.pricingContainer}>
              {pricingTiers.map(tier => (
                <PricingCard key={tier.id} tier={tier} />
              ))}
            </View>

            {/* Sponsorship Info */}
            <BlurView intensity={15} style={styles.sponsorshipInfo}>
              <LinearGradient
                colors={['rgba(16, 185, 129, 0.2)', 'rgba(16, 185, 129, 0.1)'] as const}
                style={styles.sponsorshipGradient}
              >
                <Text style={styles.sponsorshipTitle}>
                  {faithMode ? '🙏 About Forge Sponsorship' : '✨ About Community Sponsorship'}
                </Text>
                <Text style={styles.sponsorshipText}>
                  {faithMode 
                    ? "Churches, mentors, and ministry leaders can sponsor your Kingdom Studios access. It's about community investing in kingdom builders and creative entrepreneurs who are sharing the Gospel through their work."
                    : "Mentors, businesses, and community leaders can sponsor your Kingdom Studios access. It's about investing in creators and entrepreneurs who are making a positive impact."
                  }
                </Text>
                
                <TouchableOpacity
                  style={styles.sponsorshipButton}
                  onPress={handleRequestSponsorship}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#10B981', '#059669'] as const}
                    style={styles.sponsorshipButtonGradient}
                  >
                    <Text style={styles.sponsorshipButtonText}>
                      {faithMode ? 'Request Sponsorship 🙏' : 'Request Sponsorship ✨'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>
            </BlurView>

            {/* Contact */}
            <BlurView intensity={10} style={styles.contactSection}>
              <LinearGradient
                colors={['rgba(192, 192, 192, 0.1)', 'rgba(192, 192, 192, 0.05)'] as const}
                style={styles.contactGradient}
              >
                <Text style={styles.contactTitle}>💬 Questions?</Text>
                <Text style={styles.contactText}>
                  Contact Desirea at{' '}
                  <Text style={styles.contactEmail}>Desirea@ontheroadhomeministries.com</Text>
                </Text>
              </LinearGradient>
            </BlurView>
          </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: KingdomColors.gold.bright,
    fontWeight: 'bold',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  heroSection: {
    borderRadius: 20,
    marginVertical: 20,
    overflow: 'hidden',
    ...KingdomShadows.gold,
  },
  heroGradient: {
    padding: 24,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: KingdomColors.text.secondary,
    lineHeight: 24,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 20,
    marginTop: 8,
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  benefitCard: {
    width: (width - 56) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    ...KingdomShadows.silver,
  },
  benefitGradient: {
    padding: 16,
    alignItems: 'center',
  },
  benefitIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  benefitTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  benefitDescription: {
    fontSize: 12,
    color: KingdomColors.text.secondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  currentStatus: {
    borderRadius: 20,
    marginBottom: 32,
    overflow: 'hidden',
    ...KingdomShadows.elegant,
  },
  statusGradient: {
    padding: 20,
  },
  currentStatusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 8,
  },
  currentStatusText: {
    fontSize: 16,
    color: KingdomColors.gold.bright,
    fontWeight: '600',
    marginBottom: 16,
  },
  limitsContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 16,
    gap: 8,
  },
  limitsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.text.secondary,
    marginBottom: 8,
  },
  limitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  limitLabel: {
    fontSize: 14,
    color: KingdomColors.text.muted,
  },
  limitValue: {
    fontSize: 14,
    color: KingdomColors.text.primary,
    fontWeight: '500',
  },
  pricingContainer: {
    gap: 20,
    marginBottom: 32,
  },
  pricingCard: {
    borderRadius: 24,
    overflow: 'hidden',
    ...KingdomShadows.elegant,
  },
  pricingCardPopular: {
    ...KingdomShadows.gold,
  },
  pricingCardSponsored: {
    borderWidth: 2,
    borderColor: 'rgba(16, 185, 129, 0.5)',
  },
  cardGradient: {
    padding: 24,
    position: 'relative',
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 1,
  },
  sponsoredBadge: {
    position: 'absolute',
    top: -12,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 1,
  },
  badgeGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  popularBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: KingdomColors.text.inverse,
  },
  sponsoredBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
  },
  cardHeader: {
    marginBottom: 20,
    marginTop: 12,
  },
  tierNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tierIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  tierName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
  },
  tierDescription: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 36,
    fontWeight: 'bold',
    color: KingdomColors.gold.bright,
  },
  period: {
    fontSize: 16,
    color: KingdomColors.text.muted,
    marginLeft: 4,
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.text.primary,
    marginBottom: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureIcon: {
    fontSize: 16,
    color: KingdomColors.accent.success,
    marginRight: 12,
    fontWeight: 'bold',
  },
  featureText: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    flex: 1,
  },
  selectButton: {
    borderRadius: 16,
    overflow: 'hidden',
    ...KingdomShadows.silver,
  },
  selectButtonPopular: {
    ...KingdomShadows.gold,
  },
  selectButtonSponsored: {
    ...KingdomShadows.silver,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.text.secondary,
  },
  selectButtonTextActive: {
    color: KingdomColors.text.inverse,
    fontWeight: 'bold',
  },
  sponsorshipInfo: {
    borderRadius: 20,
    marginBottom: 32,
    overflow: 'hidden',
    ...KingdomShadows.elegant,
  },
  sponsorshipGradient: {
    padding: 20,
  },
  sponsorshipTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 12,
  },
  sponsorshipText: {
    fontSize: 16,
    color: KingdomColors.text.secondary,
    lineHeight: 24,
    marginBottom: 20,
  },
  sponsorshipButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  sponsorshipButtonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  sponsorshipButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.text.primary,
  },
  contactSection: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  contactGradient: {
    padding: 20,
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.text.primary,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    textAlign: 'center',
  },
  contactEmail: {
    color: KingdomColors.gold.bright,
    fontWeight: '600',
  },
});

export default PricingScreen;

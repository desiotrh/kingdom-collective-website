import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFaithMode } from '../contexts/FaithModeContext';
import { useAppNavigation } from '../utils/navigationUtils';

interface MonetizationTool {
  id: string;
  title: string;
  description: string;
  ctaText: string;
  emoji: string;
  action: () => void;
}

interface EarningsBreakdown {
  productSales: number;
  referrals: number;
  sponsorships: number;
}

const MonetizationScreen = () => {
  const { faithMode } = useFaithMode();
  const navigation = useAppNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleProductSales = () => {
    Alert.alert(
      'Product Sales Dashboard',
      'Coming Soon!\n\nTrack your earnings from Printify, Etsy, Shopify, and other connected platforms all in one place.',
      [{ text: 'Got it!' }]
    );
  };

  const handleReferrals = () => {
    Alert.alert(
      'Referral System',
      'Coming Soon!\n\nEarn by referring others to Kingdom Studios and our partnered platforms. Share your unique link and start earning!',
      [{ text: 'Excited!' }]
    );
  };

  const handleSponsorships = () => {
    navigation.navigate('Sponsorships');
  };

  const handleCreatorPro = () => {
    Alert.alert(
      'Creator Pro Coming Soon!',
      'Unlock premium monetization insights including:\n\n• Advanced revenue analytics\n• Custom commission tracking\n• Priority product placement\n• Exclusive monetization strategies\n\nGet ready to maximize your earnings!',
      [{ text: 'Count me in!' }]
    );
  };

  // Mock earnings data
  const earnings: EarningsBreakdown = {
    productSales: 392.00,
    referrals: 36.72,
    sponsorships: 10.00,
  };

  const totalEarnings = earnings.productSales + earnings.referrals + earnings.sponsorships;
  const growthRate = 14.7;

  // Monetization tools configuration
  const monetizationTools: MonetizationTool[] = [
    {
      id: 'product-sales',
      title: 'Product Sales',
      description: 'Earn from your synced products via Printify, Etsy, and Shopify.',
      ctaText: 'View Products',
      emoji: '🛍️',
      action: handleProductSales,
    },
    {
      id: 'referrals',
      title: 'Referrals',
      description: 'Earn by referring others to Kingdom Studios and our partnered platforms.',
      ctaText: 'View Referral Options',
      emoji: '🤝',
      action: handleReferrals,
    },
    {
      id: 'sponsored-access',
      title: 'Sponsored Access',
      description: 'Bless others by sponsoring app access, or request your own.',
      ctaText: 'Manage Sponsorships',
      emoji: '🙌',
      action: handleSponsorships,
    },
  ];

  // Dynamic content based on Faith Mode
  const welcomeMessage = faithMode
    ? "God gives the increase. Let's steward your gifts well."
    : "Let's turn your creativity into consistent income.";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Monetization</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Top Section */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeMessage}>{welcomeMessage}</Text>
          <Text style={styles.subheading}>
            Explore your earnings potential through products, referrals, and more.
          </Text>
        </View>

        {/* Monetization Tools */}
        <View style={styles.toolsSection}>
          <Text style={styles.sectionTitle}>💼 Monetization Tools</Text>
          {monetizationTools.map((tool) => (
            <MonetizationCard key={tool.id} tool={tool} />
          ))}
        </View>

        {/* Earnings Summary */}
        <View style={styles.earningsCard}>
          <Text style={styles.earningsTitle}>📊 This Month's Earnings</Text>
          
          <View style={styles.totalEarningsContainer}>
            <Text style={styles.totalEarnings}>${totalEarnings.toFixed(2)}</Text>
            <View style={styles.growthContainer}>
              <Text style={styles.growthText}>📈 +{growthRate}% vs last month</Text>
            </View>
          </View>

          <View style={styles.breakdownContainer}>
            <Text style={styles.breakdownTitle}>🧾 Breakdown:</Text>
            
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Product Sales:</Text>
              <Text style={styles.breakdownValue}>${earnings.productSales.toFixed(2)}</Text>
            </View>
            
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Referrals:</Text>
              <Text style={styles.breakdownValue}>${earnings.referrals.toFixed(2)}</Text>
            </View>
            
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Sponsorships Received:</Text>
              <Text style={styles.breakdownValue}>${earnings.sponsorships.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Creator Pro CTA */}
        <View style={styles.ctaCard}>
          <Text style={styles.ctaTitle}>🧠 Want More?</Text>
          <Text style={styles.ctaDescription}>
            Unlock premium monetization insights and revenue features with Creator Pro.
          </Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={handleCreatorPro}
            activeOpacity={0.8}
          >
            <Text style={styles.ctaButtonText}>Learn More</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

// Reusable Monetization Card Component
const MonetizationCard: React.FC<{ tool: MonetizationTool }> = ({ tool }) => {
  return (
    <View style={styles.toolCard}>
      <View style={styles.toolHeader}>
        <Text style={styles.toolEmoji}>{tool.emoji}</Text>
        <Text style={styles.toolTitle}>{tool.title}</Text>
      </View>
      
      <Text style={styles.toolDescription}>{tool.description}</Text>
      
      <TouchableOpacity
        style={styles.toolButton}
        onPress={tool.action}
        activeOpacity={0.8}
      >
        <Text style={styles.toolButtonText}>{tool.ctaText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSpacer: {
    width: 40,
  },
  welcomeCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333333',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  welcomeMessage: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
    lineHeight: 26,
    marginBottom: 12,
  },
  subheading: {
    fontSize: 14,
    color: '#cccccc',
    lineHeight: 20,
  },
  toolsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  toolCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333333',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  toolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  toolEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  toolTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  toolDescription: {
    fontSize: 14,
    color: '#cccccc',
    lineHeight: 20,
    marginBottom: 15,
  },
  toolButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  toolButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  earningsCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333333',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  earningsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  totalEarningsContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 15,
    backgroundColor: '#0f1f0f',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#22c55e',
  },
  totalEarnings: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#22c55e',
    marginBottom: 5,
  },
  growthContainer: {
    backgroundColor: '#22c55e20',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  growthText: {
    fontSize: 12,
    color: '#22c55e',
    fontWeight: '600',
  },
  breakdownContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 15,
  },
  breakdownTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#cccccc',
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  ctaCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333333',
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
  },
  ctaDescription: {
    fontSize: 14,
    color: '#cccccc',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: '#f59e0b',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 28,
    shadowColor: '#f59e0b',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  ctaButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSpacer: {
    height: 40,
  },
});

export default React.memo(MonetizationScreen);

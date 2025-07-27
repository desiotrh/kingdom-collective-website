import React from 'react';
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
import { useAppNavigation } from '../utils/navigationUtils';
import { KingdomColors } from '../constants/KingdomColors';
import { KingdomShadows } from '../constants/KingdomShadows';

const { width } = Dimensions.get('window');

interface Platform {
  id: string;
  name: string;
  emoji: string;
  description: string;
  status: 'connected' | 'disconnected' | 'syncing';
  products: number;
  sales: string;
}

interface SyncMetric {
  title: string;
  value: string;
  change: string;
  changeType: 'up' | 'down' | 'neutral';
  icon: string;
}

const platforms: Platform[] = [
  {
    id: 'printify',
    name: 'Printify',
    emoji: '🖨️',
    description: 'Print-on-demand products',
    status: 'connected',
    products: 45,
    sales: '$2,340',
  },
  {
    id: 'etsy',
    name: 'Etsy',
    emoji: '🛍️',
    description: 'Handmade marketplace',
    status: 'connected',
    products: 23,
    sales: '$1,850',
  },
  {
    id: 'shopify',
    name: 'Shopify',
    emoji: '🏪',
    description: 'E-commerce platform',
    status: 'syncing',
    products: 67,
    sales: '$3,120',
  },
  {
    id: 'amazon',
    name: 'Amazon',
    emoji: '📦',
    description: 'Global marketplace',
    status: 'disconnected',
    products: 0,
    sales: '$0',
  },
  {
    id: 'facebook',
    name: 'Facebook Shop',
    emoji: '📱',
    description: 'Social commerce',
    status: 'disconnected',
    products: 0,
    sales: '$0',
  },
];

const syncMetrics: SyncMetric[] = [
  {
    title: 'Total Products',
    value: '135',
    change: '+12',
    changeType: 'up',
    icon: '📦',
  },
  {
    title: 'Active Syncs',
    value: '3',
    change: '+1',
    changeType: 'up',
    icon: '🔄',
  },
  {
    title: 'Monthly Sales',
    value: '$7,310',
    change: '+23%',
    changeType: 'up',
    icon: '�',
  },
  {
    title: 'Sync Errors',
    value: '2',
    change: '-1',
    changeType: 'down',
    icon: '⚠️',
  },
];

const ProductSyncScreen = () => {
  const navigation = useAppNavigation();

  const handleConnectPress = (platformName: string) => {
    console.log(`${platformName} connect pressed`);
    Alert.alert('Coming Soon', `${platformName} connection coming soon!`);
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const renderMetricCard = (metric: SyncMetric, index: number) => (
    <View key={index} style={styles.metricCard}>
      <LinearGradient
        colors={[KingdomColors.background.secondary, KingdomColors.primary.deepNavy]}
        style={styles.metricGradient}
      >
        <View style={styles.metricHeader}>
          <Text style={styles.metricIcon}>{metric.icon}</Text>
          <View style={[
            styles.changeIndicator,
            metric.changeType === 'up' ? styles.changeUp :
              metric.changeType === 'down' ? styles.changeDown :
                styles.changeNeutral
          ]}>
            <Text style={styles.changeText}>{metric.change}</Text>
          </View>
        </View>

        <Text style={styles.metricValue}>{metric.value}</Text>
        <Text style={styles.metricTitle}>{metric.title}</Text>
      </LinearGradient>
    </View>
  );

  const renderPlatformCard = (platform: Platform) => (
    <View key={platform.id} style={styles.platformCard}>
      <LinearGradient
        colors={[KingdomColors.background.secondary, KingdomColors.primary.deepNavy]}
        style={styles.platformGradient}
      >
        <View style={styles.platformHeader}>
          <View style={styles.platformInfo}>
            <Text style={styles.platformEmoji}>{platform.emoji}</Text>
            <View style={styles.platformDetails}>
              <View style={styles.platformTitleRow}>
                <Text style={styles.platformName}>{platform.name}</Text>
                <View style={[
                  styles.statusBadge,
                  platform.status === 'connected' ? styles.statusConnected :
                    platform.status === 'syncing' ? styles.statusSyncing :
                      styles.statusDisconnected
                ]}>
                  <Text style={styles.statusText}>
                    {platform.status === 'connected' ? '🟢' :
                      platform.status === 'syncing' ? '🟡' : '🔴'} {platform.status}
                  </Text>
                </View>
              </View>
              <Text style={styles.platformDescription}>{platform.description}</Text>
            </View>
          </View>
        </View>

        {/* Platform Metrics */}
        <View style={styles.platformMetrics}>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{platform.products}</Text>
            <Text style={styles.metricLabel}>Products</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{platform.sales}</Text>
            <Text style={styles.metricLabel}>Sales</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.connectButton,
            platform.status === 'connected' ? styles.connectedButton :
              platform.status === 'syncing' ? styles.syncingButton :
                styles.disconnectedButton
          ]}
          onPress={() => handleConnectPress(platform.name)}
          activeOpacity={0.8}
        >
          <Text style={styles.connectButtonText}>
            {platform.status === 'connected' ? 'Manage' :
              platform.status === 'syncing' ? 'Syncing...' : 'Connect'}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[KingdomColors.primary.midnight, KingdomColors.primary.deepNavy]}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Sync</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Metrics Cards */}
        <View style={styles.metricsSection}>
          <Text style={styles.sectionTitle}>Sync Overview</Text>
          <View style={styles.metricsGrid}>
            {syncMetrics.map((metric, index) => renderMetricCard(metric, index))}
          </View>
        </View>

        {/* Platforms Section */}
        <View style={styles.platformsSection}>
          <Text style={styles.sectionTitle}>Connected Platforms</Text>
          <Text style={styles.sectionSubtitle}>
            Manage your product sync across all channels
          </Text>

          <View style={styles.platformsContainer}>
            {platforms.map(renderPlatformCard)}
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <LinearGradient
            colors={[KingdomColors.background.secondary, KingdomColors.primary.deepNavy]}
            style={styles.infoCard}
          >
            <Text style={styles.infoTitle}>Why Sync Your Products?</Text>
            <View style={styles.benefitsList}>
              <Text style={styles.benefitItem}>• Manage inventory across all platforms</Text>
              <Text style={styles.benefitItem}>• Automatic price updates</Text>
              <Text style={styles.benefitItem}>• Centralized order management</Text>
              <Text style={styles.benefitItem}>• Real-time sales analytics</Text>
              <Text style={styles.benefitItem}>• Reduce manual work by 80%</Text>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: KingdomColors.background.primary,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 10,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: KingdomColors.opacity.white10,
  },
  backButtonText: {
    color: KingdomColors.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
  },
  headerSpacer: {
    width: 60,
  },

  // Content
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // Metrics Section
  metricsSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: KingdomColors.text.muted,
    marginBottom: 20,
    lineHeight: 24,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    width: (width - 52) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    ...KingdomShadows.elegant,
  },
  metricGradient: {
    padding: 16,
    minHeight: 120,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricIcon: {
    fontSize: 24,
  },
  changeIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  changeUp: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  changeDown: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  changeNeutral: {
    backgroundColor: KingdomColors.opacity.white10,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
    color: KingdomColors.text.primary,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 4,
  },
  metricTitle: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
  },

  // Platforms Section
  platformsSection: {
    marginTop: 32,
  },
  platformsContainer: {
    gap: 16,
  },
  platformCard: {
    borderRadius: 16,
    overflow: 'hidden',
    ...KingdomShadows.elegant,
  },
  platformGradient: {
    padding: 20,
  },
  platformHeader: {
    marginBottom: 16,
  },
  platformInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  platformEmoji: {
    fontSize: 32,
  },
  platformDetails: {
    flex: 1,
  },
  platformTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  platformName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
  },
  platformDescription: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    lineHeight: 20,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusConnected: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  statusSyncing: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  statusDisconnected: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: KingdomColors.text.primary,
    textTransform: 'uppercase',
  },
  platformMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: KingdomColors.opacity.white10,
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 16,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: KingdomColors.text.muted,
    marginTop: 4,
  },
  connectButton: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  connectedButton: {
    backgroundColor: KingdomColors.gold.bright,
  },
  syncingButton: {
    backgroundColor: KingdomColors.accent.warning,
  },
  disconnectedButton: {
    backgroundColor: KingdomColors.opacity.white20,
    borderWidth: 1,
    borderColor: KingdomColors.gold.bright,
  },
  connectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.text.inverse,
  },

  // Info Section
  infoSection: {
    marginTop: 32,
  },
  infoCard: {
    borderRadius: 16,
    padding: 20,
    ...KingdomShadows.elegant,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 16,
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    lineHeight: 20,
  },
});

export default ProductSyncScreen;

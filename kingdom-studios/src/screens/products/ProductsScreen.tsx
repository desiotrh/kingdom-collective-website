import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppNavigation } from '../../utils/navigationUtils';
import { useFaithMode } from '../../contexts/FaithModeContext';
import { useAuth } from '../../contexts/AuthContext';
import { KingdomColors, KingdomShadows } from '../../constants/KingdomColors';
import KingdomLogo from '../../components/KingdomLogo';
import { Product } from '../../contexts/ProductContext';
import apiService from '../../services/apiService';
import firebaseService from '../../services/firebaseService';
import platformIntegrationService, { PlatformProduct } from '../../services/platformIntegrationService';

const { width } = Dimensions.get('window');

interface Platform {
  id: string;
  name: string;
  icon: string;
  color: string;
  connected: boolean;
  products: number;
  revenue: string;
}

const ProductsScreen: React.FC = () => {
  const navigation = useAppNavigation();
  const { faithMode } = useFaithMode();
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'products' | 'platforms'>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [platformProducts, setPlatformProducts] = useState<PlatformProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [syncingPlatform, setSyncingPlatform] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const userProducts = await firebaseService.getUserProducts(user.uid);
      setProducts(userProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  const handleSyncPlatform = async (platform: 'Etsy' | 'Printify' | 'Shopify') => {
    setSyncingPlatform(platform);
    try {
      let newProducts: PlatformProduct[] = [];
      
      switch (platform) {
        case 'Etsy':
          newProducts = await platformIntegrationService.syncEtsyProducts();
          break;
        case 'Printify':
          newProducts = await platformIntegrationService.syncPrintifyProducts();
          break;
        case 'Shopify':
          newProducts = await platformIntegrationService.syncShopifyProducts();
          break;
      }
      
      // Convert PlatformProduct to Product and save to Firebase
      for (const platformProduct of newProducts) {
        const product: Product = {
          id: platformProduct.id,
          title: platformProduct.title,
          description: platformProduct.description,
          price: platformProduct.price,
          imageUrl: platformProduct.imageUrl,
          platform: platformProduct.platform,
          status: platformProduct.status,
          userId: user?.uid || '',
          createdAt: new Date(),
          updatedAt: new Date(),
          tags: platformProduct.tags,
          category: platformProduct.category,
        };
        
        await firebaseService.saveProduct(product);
      }
      
      // Update local state
      setPlatformProducts(prev => [...prev, ...newProducts]);
      await loadProducts();
      
      Alert.alert(
        'Sync Complete', 
        `Successfully synced ${newProducts.length} products from ${platform}!`,
        [
          { text: 'View Products', onPress: () => setSelectedTab('products') },
          { text: 'OK' }
        ]
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert(
        'Sync Failed', 
        `Failed to sync products from ${platform}.\n\nError: ${errorMessage}\n\nTip: Check your API keys in settings.`,
        [
          { text: 'OK' },
          { 
            text: 'Check Settings', 
            onPress: () => navigation.navigate('Settings') 
          }
        ]
      );
      console.error(`${platform} sync error:`, error);
    } finally {
      setSyncingPlatform(null);
    }
  };

  const platforms: Platform[] = [
    {
      id: 'etsy',
      name: 'Etsy',
      icon: '🛍️',
      color: '#F16521',
      connected: true,
      products: 23,
      revenue: '$2,340'
    },
    {
      id: 'printify',
      name: 'Printify',
      icon: '🖨️',
      color: '#39B54A',
      connected: true,
      products: 45,
      revenue: '$4,567'
    },
    {
      id: 'shopify',
      name: 'Shopify',
      icon: '🏪',
      color: '#96BF48',
      connected: false,
      products: 0,
      revenue: '$0'
    },
    {
      id: 'amazon',
      name: 'Amazon',
      icon: '📦',
      color: '#FF9900',
      connected: false,
      products: 0,
      revenue: '$0'
    },
  ];

  const renderOverview = () => (
    <View style={styles.overviewContainer}>
      {/* Revenue Stats */}
      <View style={styles.statsGrid}>
        <LinearGradient
          colors={[KingdomColors.primary.royalPurple, KingdomColors.gold.bright]}
          style={styles.statCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.statIcon}>💰</Text>
          <Text style={styles.statValue}>$7,234</Text>
          <Text style={styles.statLabel}>
            {faithMode ? 'Kingdom Revenue' : 'Total Revenue'}
          </Text>
          <Text style={styles.statChange}>+23.5%</Text>
        </LinearGradient>

        <LinearGradient
          colors={[KingdomColors.accent.success, KingdomColors.primary.deepNavy]}
          style={styles.statCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.statIcon}>📦</Text>
          <Text style={styles.statValue}>68</Text>
          <Text style={styles.statLabel}>
            {faithMode ? 'Kingdom Products' : 'Active Products'}
          </Text>
          <Text style={styles.statChange}>+12</Text>
        </LinearGradient>
      </View>

      {/* Platform Connections */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>
          {faithMode ? '🔗 Kingdom Platforms' : '🔗 Connected Platforms'}
        </Text>
        {platforms.map(platform => (
          <View
            key={platform.id}
            style={[
              styles.platformCard,
              { backgroundColor: platform.connected ? KingdomColors.background.secondary : KingdomColors.gray + '20' }
            ]}
          >
            <TouchableOpacity style={styles.platformInfo}>
              <Text style={styles.platformIcon}>{platform.icon}</Text>
              <View style={styles.platformDetails}>
                <Text style={styles.platformName}>{platform.name}</Text>
                <Text style={styles.platformStats}>
                  {platform.products} products • {platform.revenue}
                </Text>
              </View>
            </TouchableOpacity>
            
            <View style={styles.platformActions}>
              {platform.connected && (
                <TouchableOpacity
                  style={[
                    styles.syncButton,
                    { opacity: syncingPlatform === platform.name ? 0.6 : 1 }
                  ]}
                  onPress={() => handleSyncPlatform(platform.name as any)}
                  disabled={syncingPlatform !== null}
                >
                  {syncingPlatform === platform.name ? (
                    <ActivityIndicator size="small" color={KingdomColors.white} />
                  ) : (
                    <Text style={styles.syncButtonText}>
                      🔄 Sync
                    </Text>
                  )}
                </TouchableOpacity>
              )}
              
              <View style={[
                styles.connectionStatus,
                { backgroundColor: platform.connected ? KingdomColors.accent.success : KingdomColors.gray }
              ]}>
                <Text style={styles.connectionText}>
                  {platform.connected ? 'Connected' : 'Connect'}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>➕</Text>
            <Text style={styles.actionText}>Add Product</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>🤖</Text>
            <Text style={styles.actionText}>AI Generate</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionText}>Analytics</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>🔄</Text>
            <Text style={styles.actionText}>Sync All</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderProducts = () => (
    <ScrollView 
      style={styles.productsContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={KingdomColors.gold.bright}
        />
      }
    >
      {products.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>📦</Text>
          <Text style={styles.emptyStateTitle}>No Products Yet</Text>
          <Text style={styles.emptyStateText}>
            Connect your platforms to start syncing products
          </Text>
        </View>
      ) : (
        products.map(product => (
          <TouchableOpacity
            key={product.id}
            style={styles.productCard}
            onPress={() => Alert.alert('Product Details', `Opening ${product.title}`)}
          >
            <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productTitle}>{product.title}</Text>
              <Text style={styles.productPlatform}>{product.platform}</Text>
              <View style={styles.productStats}>
                <Text style={styles.productPrice}>${product.price}</Text>
                <Text style={styles.productSales}>{product.stats.sales} sales</Text>
              </View>
              <View style={styles.productMetrics}>
                <Text style={styles.productViews}>{product.stats.views} views</Text>
                <Text style={styles.productRevenue}>${product.stats.revenue}</Text>
              </View>
            </View>
            <View style={[
              styles.productStatus,
              { backgroundColor: product.syncStatus === 'Synced' ? KingdomColors.accent.success : KingdomColors.gray }
            ]}>
              <Text style={styles.statusText}>{product.syncStatus}</Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'overview':
        return renderOverview();
      case 'products':
        return renderProducts();
      case 'platforms':
        return renderOverview(); // For now, same as overview
      default:
        return renderOverview();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[KingdomColors.background.primary, KingdomColors.background.secondary]}
        style={styles.backgroundGradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <KingdomLogo size="medium" />
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>
              {faithMode ? '📦 Kingdom Products' : '📦 Product Manager'}
            </Text>
            <Text style={styles.headerSubtitle}>
              {faithMode ? 'Manage your Kingdom marketplace' : 'Sync & manage all your products'}
            </Text>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'overview' && styles.activeTab]}
            onPress={() => setSelectedTab('overview')}
          >
            <Text style={[styles.tabText, selectedTab === 'overview' && styles.activeTabText]}>
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'products' && styles.activeTab]}
            onPress={() => setSelectedTab('products')}
          >
            <Text style={[styles.tabText, selectedTab === 'products' && styles.activeTabText]}>
              Products
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'platforms' && styles.activeTab]}
            onPress={() => setSelectedTab('platforms')}
          >
            <Text style={[styles.tabText, selectedTab === 'platforms' && styles.activeTabText]}>
              Platforms
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {renderTabContent()}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: KingdomColors.background.primary,
  },
  backgroundGradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerContent: {
    marginLeft: 12,
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    marginTop: 2,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 16,
    backgroundColor: KingdomColors.background.secondary,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: KingdomColors.primary.royalPurple,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.text.secondary,
  },
  activeTabText: {
    color: KingdomColors.white,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  overviewContainer: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: (width - 60) / 2,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    ...KingdomShadows.medium,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.white,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: KingdomColors.white,
    textAlign: 'center',
    marginBottom: 4,
  },
  statChange: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.white,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 16,
  },
  platformCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    ...KingdomShadows.small,
  },
  platformInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  platformIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  platformDetails: {
    flex: 1,
  },
  platformName: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.text.primary,
  },
  platformStats: {
    fontSize: 12,
    color: KingdomColors.text.secondary,
    marginTop: 2,
  },
  connectionStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  connectionText: {
    fontSize: 12,
    fontWeight: '600',
    color: KingdomColors.white,
  },
  quickActionsContainer: {
    marginBottom: 24,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 60) / 2,
    backgroundColor: KingdomColors.background.secondary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    ...KingdomShadows.small,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.text.primary,
  },
  productsContainer: {
    flex: 1,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: KingdomColors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...KingdomShadows.medium,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.text.primary,
    marginBottom: 4,
  },
  productPlatform: {
    fontSize: 12,
    color: KingdomColors.text.secondary,
    marginBottom: 8,
  },
  productStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: KingdomColors.gold.bright,
  },
  productSales: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
  },
  productMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productViews: {
    fontSize: 12,
    color: KingdomColors.text.secondary,
  },
  productRevenue: {
    fontSize: 12,
    fontWeight: '600',
    color: KingdomColors.accent.success,
  },
  productStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: KingdomColors.white,
    textTransform: 'uppercase',
  },
  // Empty state styles
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  // Platform actions styles
  platformActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  syncButton: {
    backgroundColor: KingdomColors.primary.royalPurple,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  syncButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: KingdomColors.white,
  },
});

export default ProductsScreen;

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
  TextInput,
} from 'react-native';
import { useAppNavigation } from '../../utils/navigationUtils';
import { useProducts, Product } from '../../contexts/ProductContext';

// Mock faith mode hook
const useFaithMode = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  return { isEnabled, setIsEnabled };
};

const ProductDashboardScreen = () => {
  const navigation = useAppNavigation();
  const { products } = useProducts();
  const { isEnabled: faithMode } = useFaithMode();

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activePlatformFilter, setActivePlatformFilter] = useState<'All' | 'Printify' | 'Etsy' | 'Shopify'>('All');
  const [sortMode, setSortMode] = useState<'recent' | 'price-low' | 'price-high' | 'title'>('recent');

  // Platform filter options
  const platformFilters = [
    { id: 'All', name: 'All', icon: '🛍️', color: '#f97316' },
    { id: 'Printify', name: 'Printify', icon: '🖨️', color: '#39D353' },
    { id: 'Etsy', name: 'Etsy', icon: '🎨', color: '#F1641E' },
    { id: 'Shopify', name: 'Shopify', icon: '🛒', color: '#96BF47' },
  ] as const;

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Apply platform filter
    if (activePlatformFilter !== 'All') {
      filtered = filtered.filter((product: Product) => product.platform === activePlatformFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((product: Product) => 
        product.title.toLowerCase().includes(query) ||
        product.tags.some(tag => tag.toLowerCase().includes(query)) ||
        product.description.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a: Product, b: Product) => {
      switch (sortMode) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'recent':
        default:
          return new Date(b.lastSync).getTime() - new Date(a.lastSync).getTime();
      }
    });

    return sorted;
  }, [products, searchQuery, activePlatformFilter, sortMode]);

  // Get platform icon and color
  const getPlatformIcon = (platform: string) => {
    const icons: { [key: string]: string } = {
      'Printify': '🖨️',
      'Etsy': '🎨',
      'Shopify': '🛒',
    };
    return icons[platform] || '🛍️';
  };

  const getPlatformColor = (platform: string) => {
    const colors: { [key: string]: string } = {
      'Printify': '#39D353',
      'Etsy': '#F1641E',
      'Shopify': '#96BF47',
    };
    return colors[platform] || '#f97316';
  };

  // Get sync status color
  const getSyncStatusColor = (status: string) => {
    switch (status) {
      case 'Synced':
        return '#22c55e'; // Green
      case 'Pending':
        return '#f59e0b'; // Orange
      case 'Not Synced':
        return '#dc2626'; // Red
      default:
        return '#6b7280'; // Gray
    }
  };

  const getSyncStatusIcon = (status: string) => {
    switch (status) {
      case 'Synced':
        return '✅';
      case 'Pending':
        return '⏳';
      case 'Not Synced':
        return '⚠️';
      default:
        return '❓';
    }
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const handleCreateContent = (product: Product) => {
    Alert.alert(
      'Create Content',
      `Create social media content for "${product.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Create Content', 
          onPress: () => {
            console.log('Navigate to MultiPlatformPost with product data:', product);
            navigation.navigate('MultiPlatformPost', { productId: product.id });
          }
        },
      ]
    );
  };

  const handleProductPress = (product: Product) => {
    console.log('Navigating to ProductDetails with productId:', product.id);
    navigation.navigate('ProductDetails', { productId: product.id });
  };

  const renderProductCard = (product: Product) => (
    <TouchableOpacity
      key={product.id}
      style={[
        styles.productCard,
        { borderLeftColor: getPlatformColor(product.platform) }
      ]}
      onPress={() => handleProductPress(product)}
      activeOpacity={0.8}
    >
      {/* Product Image */}
      <View style={styles.productImageContainer}>
        <Image
          source={{ uri: product.imageUri || product.imageUrl }}
          style={styles.productImage}
          resizeMode="cover"
        />
        <View style={[
          styles.platformBadge,
          { backgroundColor: getPlatformColor(product.platform) }
        ]}>
          <Text style={styles.platformIcon}>{getPlatformIcon(product.platform)}</Text>
          <Text style={styles.platformText}>{product.platform}</Text>
        </View>
      </View>

      {/* Product Info */}
      <View style={styles.productInfo}>
        <View style={styles.productHeader}>
          <Text style={styles.productTitle} numberOfLines={2}>
            {product.title}
          </Text>
          <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>
        </View>

        <Text style={styles.productCategory}>{product.category}</Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {product.description}
        </Text>

        {/* Status and Actions */}
        <View style={styles.productFooter}>
          <View style={styles.syncStatus}>
            <Text style={styles.syncIcon}>{getSyncStatusIcon(product.syncStatus)}</Text>
            <Text style={[
              styles.syncText,
              { color: getSyncStatusColor(product.syncStatus) }
            ]}>
              {product.syncStatus}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.createContentButton}
            onPress={() => handleCreateContent(product)}
            activeOpacity={0.8}
          >
            <Text style={styles.createContentText}>Create Content</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Statistics
  const totalProducts = filteredProducts.length;
  const allProductsCount = products.length;
  const syncedProducts = filteredProducts.filter((p: Product) => p.syncStatus === 'Synced').length;
  const totalValue = filteredProducts.reduce((sum: number, product: Product) => sum + product.price, 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>🛍️ Product Dashboard</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Faith Mode Message */}
        <View style={styles.faithMessage}>
          <Text style={styles.faithText}>
            {faithMode 
              ? "Your creativity can fund the Kingdom. Let God multiply what you've built."
              : "Let's review your synced products and grow your income."
            }
          </Text>
        </View>

        {/* Search and Filter Section */}
        <View style={styles.searchFilterSection}>
          {/* Search Input */}
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search your products..."
              placeholderTextColor="#6b7280"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity
                style={styles.clearSearchButton}
                onPress={() => setSearchQuery('')}
                activeOpacity={0.8}
              >
                <Text style={styles.clearSearchText}>✕</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Platform Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterChipsScroll}
            contentContainerStyle={styles.filterChipsContainer}
          >
            {platformFilters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterChip,
                  activePlatformFilter === filter.id && {
                    backgroundColor: filter.color,
                    borderColor: filter.color,
                  }
                ]}
                onPress={() => setActivePlatformFilter(filter.id as any)}
                activeOpacity={0.8}
              >
                <Text style={styles.filterChipIcon}>{filter.icon}</Text>
                <Text style={[
                  styles.filterChipText,
                  activePlatformFilter === filter.id && styles.filterChipTextActive
                ]}>
                  {filter.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Results Summary */}
          <View style={styles.resultsSummary}>
            <Text style={styles.resultsText}>
              {searchQuery || activePlatformFilter !== 'All' 
                ? `Showing ${totalProducts} of ${allProductsCount} products`
                : `${totalProducts} products`
              }
            </Text>
            <View style={styles.summaryActions}>
              {/* Sort Dropdown */}
              <TouchableOpacity
                style={styles.sortButton}
                onPress={() => {
                  const sortOptions = [
                    { key: 'recent', label: 'Most Recent' },
                    { key: 'price-low', label: 'Price: Low to High' },
                    { key: 'price-high', label: 'Price: High to Low' },
                    { key: 'title', label: 'Title: A → Z' },
                  ];
                  const currentIndex = sortOptions.findIndex(opt => opt.key === sortMode);
                  const nextIndex = (currentIndex + 1) % sortOptions.length;
                  setSortMode(sortOptions[nextIndex].key as any);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.sortIcon}>⚡</Text>
                <Text style={styles.sortText}>
                  {sortMode === 'recent' && 'Recent'}
                  {sortMode === 'price-low' && 'Price ↑'}
                  {sortMode === 'price-high' && 'Price ↓'}
                  {sortMode === 'title' && 'A→Z'}
                </Text>
              </TouchableOpacity>
              {(searchQuery || activePlatformFilter !== 'All') && (
                <TouchableOpacity
                  style={styles.clearFiltersButton}
                  onPress={() => {
                    setSearchQuery('');
                    setActivePlatformFilter('All');
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.clearFiltersText}>Clear filters</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalProducts}</Text>
            <Text style={styles.statLabel}>Total Products</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{syncedProducts}</Text>
            <Text style={styles.statLabel}>Synced</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{formatPrice(totalValue)}</Text>
            <Text style={styles.statLabel}>Total Value</Text>
          </View>
        </View>

        {/* Platform Summary */}
        <View style={styles.platformSummary}>
          <Text style={styles.sectionTitle}>Connected Platforms</Text>
          <View style={styles.platformList}>
            {['Printify', 'Etsy', 'Shopify'].map((platform) => {
              const platformProducts = products.filter((p: Product) => p.platform === platform);
              return (
                <View key={platform} style={styles.platformItem}>
                  <View style={styles.platformInfo}>
                    <Text style={styles.platformItemIcon}>{getPlatformIcon(platform)}</Text>
                    <Text style={styles.platformName}>{platform}</Text>
                  </View>
                  <Text style={styles.platformCount}>
                    {platformProducts.length} product{platformProducts.length !== 1 ? 's' : ''}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Products List */}
        <View style={styles.productsSection}>
          <Text style={styles.sectionTitle}>
            {searchQuery || activePlatformFilter !== 'All' 
              ? `Filtered Products (${totalProducts})`
              : 'Your Products'
            }
          </Text>
          <View style={styles.productsContainer}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map(renderProductCard)
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateIcon}>📦</Text>
                <Text style={styles.emptyStateTitle}>
                  {searchQuery || activePlatformFilter !== 'All' 
                    ? 'No products found'
                    : 'No products yet'
                  }
                </Text>
                <Text style={styles.emptyStateText}>
                  {searchQuery || activePlatformFilter !== 'All' 
                    ? 'Try adjusting your search or filters'
                    : 'Add your first product to get started'
                  }
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Add Product Button */}
        <View style={styles.addProductSection}>
          <TouchableOpacity
            style={styles.addProductButton}
            onPress={() => navigation.navigate('AddProduct')}
            activeOpacity={0.8}
          >
            <Text style={styles.addProductText}>+ Add New Product</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#f97316',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  placeholder: {
    width: 40,
  },
  faithMessage: {
    padding: 16,
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: '#1f2937',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f97316',
  },
  faithText: {
    fontSize: 14,
    color: '#f97316',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f97316',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
  platformSummary: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  platformList: {
    gap: 8,
  },
  platformItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  platformInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  platformItemIcon: {
    fontSize: 16,
  },
  platformName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  platformCount: {
    fontSize: 12,
    color: '#9ca3af',
  },
  productsSection: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  productsContainer: {
    gap: 16,
  },
  productCard: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
    borderLeftWidth: 4,
  },
  productImageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#374151',
  },
  platformBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  platformIcon: {
    fontSize: 12,
  },
  platformText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  productInfo: {
    flex: 1,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  productTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginRight: 12,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#22c55e',
  },
  productCategory: {
    fontSize: 12,
    color: '#f97316',
    fontWeight: '500',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 18,
    marginBottom: 12,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  syncStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  syncIcon: {
    fontSize: 14,
  },
  syncText: {
    fontSize: 12,
    fontWeight: '500',
  },
  createContentButton: {
    backgroundColor: '#f97316',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  createContentText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  addProductSection: {
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 32,
  },
  addProductButton: {
    backgroundColor: '#374151',
    borderWidth: 2,
    borderColor: '#f97316',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  addProductText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f97316',
  },
  // Search and filter styles
  searchFilterSection: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 12,
    color: '#6b7280',
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#ffffff',
  },
  clearSearchButton: {
    padding: 4,
  },
  clearSearchText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: 'bold',
  },
  filterChipsScroll: {
    marginBottom: 16,
  },
  filterChipsContainer: {
    paddingHorizontal: 4,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderWidth: 1,
    borderColor: '#4b5563',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
  },
  filterChipIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#d1d5db',
  },
  filterChipTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  resultsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultsText: {
    fontSize: 14,
    color: '#9ca3af',
    flex: 1,
  },
  summaryActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#4b5563',
  },
  sortIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  sortText: {
    fontSize: 12,
    color: '#d1d5db',
    fontWeight: '500',
  },
  clearFiltersButton: {
    padding: 4,
  },
  clearFiltersText: {
    fontSize: 12,
    color: '#f97316',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 20,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ProductDashboardScreen;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useAppNavigation } from '../../utils/navigationUtils';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';
import { useAuth } from '../../contexts/UnifiedAuthContext';
import { productService, Product as ProductType } from '../../services/productService';

type ProductDetailsRouteProp = RouteProp<RootStackParamList, 'ProductDetails'>;

// Mock faith mode hook
const useFaithMode = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  return { isEnabled, setIsEnabled };
};

const ProductDetailsScreen = () => {
  const navigation = useAppNavigation();
  const route = useRoute<ProductDetailsRouteProp>();
  const { productId } = route.params;
  const { user } = useAuth();
  const { isEnabled: faithMode } = useFaithMode();
  
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedPrice, setEditedPrice] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Load product data
  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    if (!productId) return;

    setLoading(true);
    try {
      const productData = await productService.getProduct(productId);
      if (productData) {
        setProduct(productData);
        setEditedTitle(productData.name);
        setEditedPrice(productData.price.toString());
      }
    } catch (error) {
      console.error('Error loading product:', error);
      Alert.alert('Error', 'Failed to load product data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading product...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Product not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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

  // Get sync status color and icon
  const getSyncStatusColor = (status: string) => {
    switch (status) {
      case 'Synced':
        return '#22c55e';
      case 'Pending':
        return '#f59e0b';
      case 'Not Synced':
        return '#dc2626';
      default:
        return '#6b7280';
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

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!productId) return;

    setIsSaving(true);
    try {
      const result = await productService.updateProduct(productId, {
        name: editedTitle,
        price: parseFloat(editedPrice)
      });

      if (result.success) {
        setProduct(prev => prev ? { ...prev, name: editedTitle, price: parseFloat(editedPrice) } : null);
        setShowEditModal(false);
        Alert.alert('Success', 'Product updated successfully!');
      } else {
        Alert.alert('Error', result.error || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      Alert.alert('Error', 'Failed to update product');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRefreshSync = async () => {
    if (!productId) return;

    try {
      const result = await productService.syncProductWithPlatforms(productId, ['etsy', 'printify', 'shopify']);
      if (result.success) {
        Alert.alert('Success', 'Product sync refreshed successfully!');
        await loadProduct(); // Reload product data
      } else {
        Alert.alert('Error', result.error || 'Failed to refresh sync');
      }
    } catch (error) {
      console.error('Error refreshing sync:', error);
      Alert.alert('Error', 'Failed to refresh sync');
    }
  };

  const handleDeleteProduct = async () => {
    if (!productId) return;

    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await productService.deleteProduct(productId);
              if (result.success) {
                Alert.alert('Success', 'Product deleted successfully!');
                navigation.goBack();
              } else {
                Alert.alert('Error', result.error || 'Failed to delete product');
              }
            } catch (error) {
              console.error('Error deleting product:', error);
              Alert.alert('Error', 'Failed to delete product');
            }
          }
        }
      ]
    );
  };

  const handleCreateContent = () => {
    navigation.navigate('ContentCreation', { productId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerBackButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={styles.headerBackButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product Details</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Faith Mode Banner */}
        {faithMode && (
          <View style={styles.faithBanner}>
            <Text style={styles.faithText}>
              "Commit your work to the Lord, and your plans will succeed." – Proverbs 16:3
            </Text>
          </View>
        )}

        {/* Product Image */}
        <View style={styles.imageContainer}>
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
          {/* Title and Price */}
          <View style={styles.titlePriceContainer}>
            <Text style={styles.productTitle}>{product.name}</Text>
            <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>
          </View>

          {/* Category and Sync Status */}
          <View style={styles.metaContainer}>
            <Text style={styles.category}>{product.category}</Text>
            <View style={styles.syncStatus}>
              <Text style={styles.syncIcon}>{getSyncStatusIcon(product.syncStatus)}</Text>
              <Text style={[
                styles.syncText,
                { color: getSyncStatusColor(product.syncStatus) }
              ]}>
                {product.syncStatus}
              </Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Tags */}
          <View style={styles.tagsContainer}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagsWrapper}>
              {product.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>Performance</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{formatNumber(product.stats.views)}</Text>
                <Text style={styles.statLabel}>Views</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{formatPrice(product.stats.revenue)}</Text>
                <Text style={styles.statLabel}>Revenue</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{formatNumber(product.stats.sales)}</Text>
                <Text style={styles.statLabel}>Sales</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={handleEdit}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonText}>✏️ Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.syncButton]}
              onPress={handleRefreshSync}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonText}>🔄 Refresh Sync</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.contentButton]}
              onPress={handleCreateContent}
              activeOpacity={0.8}
            >
              <Text style={styles.contentButtonText}>🎬 Create Content</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Product</Text>
            
            <Text style={styles.inputLabel}>Title</Text>
            <TextInput
              style={styles.input}
              value={editedTitle}
              onChangeText={setEditedTitle}
              placeholder="Product title"
              placeholderTextColor="#9ca3af"
            />
            
            <Text style={styles.inputLabel}>Price</Text>
            <TextInput
              style={styles.input}
              value={editedPrice}
              onChangeText={setEditedPrice}
              placeholder="0.00"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEditModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveEdit}
                activeOpacity={0.8}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  headerBackButton: {
    padding: 8,
  },
  headerBackButtonText: {
    fontSize: 24,
    color: '#f97316',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  placeholder: {
    width: 40,
  },
  faithBanner: {
    margin: 16,
    padding: 16,
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
    fontStyle: 'italic',
  },
  imageContainer: {
    position: 'relative',
    marginHorizontal: 20,
    marginTop: 16,
  },
  productImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    backgroundColor: '#374151',
  },
  platformBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  platformIcon: {
    fontSize: 14,
  },
  platformText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  productInfo: {
    padding: 20,
  },
  titlePriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  productTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 16,
    lineHeight: 30,
  },
  productPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#22c55e',
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  category: {
    fontSize: 16,
    color: '#f97316',
    fontWeight: '500',
  },
  syncStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  syncIcon: {
    fontSize: 16,
  },
  syncText: {
    fontSize: 14,
    fontWeight: '500',
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#d1d5db',
    lineHeight: 24,
  },
  tagsContainer: {
    marginBottom: 24,
  },
  tagsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#1f2937',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#374151',
  },
  tagText: {
    fontSize: 12,
    color: '#f97316',
    fontWeight: '500',
  },
  statsContainer: {
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
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
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  editButton: {
    backgroundColor: '#374151',
    borderColor: '#4b5563',
  },
  syncButton: {
    backgroundColor: '#1f2937',
    borderColor: '#f59e0b',
  },
  contentButton: {
    backgroundColor: '#f97316',
    borderColor: '#f97316',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  contentButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#dc2626',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#f97316',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  loadingText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1f2937',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#4b5563',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#374151',
  },
  saveButton: {
    backgroundColor: '#f97316',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9ca3af',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default ProductDetailsScreen;

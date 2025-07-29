import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAppNavigation } from '../../utils/navigationUtils';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';
import { useAuth } from '../../contexts/UnifiedAuthContext';
import { productService, Product as ProductType, ProductUpdateData } from '../../services/productService';
import { useFaithMode } from '../../contexts/FaithModeContext';

type EditProductRouteProp = RouteProp<RootStackParamList, 'EditProduct'>;

// Predefined categories for selection
const availableCategories = [
  'Apparel',
  'Drinkware', 
  'Stationery',
  'Spiritual',
  'Books',
  'Wall Art',
  'Accessories',
  'Electronics',
  'Home & Garden',
  'Jewelry',
];

const EditProductScreen = () => {
  const navigation = useAppNavigation();
  const route = useRoute<EditProductRouteProp>();
  const { productId } = route.params;
  const { user } = useAuth();
  const { faithMode } = useFaithMode();

  // Product state
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
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
        setTitle(productData.name);
        setDescription(productData.description || '');
        setPrice(productData.price.toString());
        setCategory(productData.category);
        setTags(productData.tags.join(', '));
        setImageUri(productData.images.length > 0 ? productData.images[0] : null);
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
            style={styles.errorButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.errorButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const pickImage = async () => {
    // Request permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access photos is required to upload an image.');
      return;
    }

    // Pick image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square aspect ratio
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    Alert.alert(
      'Remove Image',
      'Are you sure you want to remove the selected image?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => setImageUri(null)
        }
      ]
    );
  };

  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!title.trim()) {
      errors.push('Product title is required');
    }

    if (!description.trim()) {
      errors.push('Product description is required');
    }

    if (!price.trim()) {
      errors.push('Product price is required');
    } else {
      const priceValue = parseFloat(price);
      if (isNaN(priceValue) || priceValue <= 0) {
        errors.push('Please enter a valid price');
      }
    }

    if (!category) {
      errors.push('Please select a category');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const handleSave = async () => {
    const validation = validateForm();
    if (!validation.isValid) {
      Alert.alert('Validation Error', validation.errors.join('\n'));
      return;
    }

    if (!user || !productId) {
      Alert.alert('Error', 'Unable to update product');
      return;
    }

    setIsSaving(true);

    try {
      const updateData: ProductUpdateData = {
        name: title.trim(),
        description: description.trim(),
        price: parseFloat(price),
        currency: 'USD',
        images: imageUri ? [imageUri] : [],
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        category: category.toLowerCase().replace(/\s+/g, '-'),
        metadata: {
          seoTitle: title,
          seoDescription: description.substring(0, 160),
          keywords: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        }
      };

      const result = await productService.updateProduct(productId, updateData);

      if (result.success) {
        Alert.alert(
          'Success',
          'Product updated successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      Alert.alert('Error', 'Failed to update product. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel',
      'Are you sure you want to cancel? All changes will be lost.',
      [
        { text: 'Keep Editing', style: 'cancel' },
        {
          text: 'Cancel',
          style: 'destructive',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Edit Product</Text>
          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSave}
            activeOpacity={0.8}
            disabled={isSaving}
          >
            <Text style={styles.saveButtonText}>
              {isSaving ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Faith Mode Message */}
        {faithMode && (
          <View style={styles.faithMessage}>
            <Text style={styles.faithText}>
              "Let all that you do be done in love." – 1 Corinthians 16:14
            </Text>
          </View>
        )}

        {/* Platform Info */}
        <View style={styles.platformInfo}>
          <View style={[
            styles.platformBadge,
            { backgroundColor: getPlatformColor(product.platform) }
          ]}>
            <Text style={styles.platformIcon}>{getPlatformIcon(product.platform)}</Text>
            <Text style={styles.platformText}>{product.platform}</Text>
          </View>
          <Text style={styles.productId}>ID: {product.id}</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Title Field */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Product Title *</Text>
            <TextInput
              style={styles.formInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter product title"
              placeholderTextColor="#6b7280"
              multiline
            />
          </View>

          {/* Description Field */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Description *</Text>
            <TextInput
              style={[styles.formInput, styles.formTextArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter product description"
              placeholderTextColor="#6b7280"
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Price Field */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Price *</Text>
            <View style={styles.priceInputContainer}>
              <Text style={styles.priceSymbol}>$</Text>
              <TextInput
                style={styles.priceInput}
                value={price}
                onChangeText={setPrice}
                placeholder="0.00"
                placeholderTextColor="#6b7280"
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Category Field */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Category *</Text>
            <View style={styles.categoryContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScroll}
              >
                {availableCategories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryChip,
                      category === cat && styles.categoryChipSelected
                    ]}
                    onPress={() => setCategory(cat)}
                    activeOpacity={0.8}
                  >
                    <Text style={[
                      styles.categoryChipText,
                      category === cat && styles.categoryChipTextSelected
                    ]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Tags Field */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Tags</Text>
            <Text style={styles.formHint}>Separate tags with commas (e.g., faith, inspiration, gift)</Text>
            <TextInput
              style={styles.formInput}
              value={tags}
              onChangeText={setTags}
              placeholder="Enter tags separated by commas"
              placeholderTextColor="#6b7280"
              multiline
            />
          </View>

          {/* Image Upload Section */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Product Image</Text>
            <Text style={styles.formHint}>Upload a custom image for your product (optional)</Text>
            
            {imageUri ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                <View style={styles.imageActions}>
                  <TouchableOpacity
                    style={styles.changeImageButton}
                    onPress={pickImage}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.changeImageButtonText}>Change Image</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={removeImage}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.removeImageButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.imageUploadButton}
                onPress={pickImage}
                activeOpacity={0.8}
              >
                <View style={styles.imageUploadContent}>
                  <Text style={styles.imageUploadIcon}>📷</Text>
                  <Text style={styles.imageUploadText}>Tap to upload image</Text>
                  <Text style={styles.imageUploadHint}>Supports JPG, PNG (Square format recommended)</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>

          {/* Current Product Info */}
          <View style={styles.currentInfo}>
            <Text style={styles.currentInfoTitle}>Current Product Info</Text>
            <View style={styles.currentInfoRow}>
              <Text style={styles.currentInfoLabel}>Current Price:</Text>
              <Text style={styles.currentInfoValue}>{formatPrice(product.price)}</Text>
            </View>
            <View style={styles.currentInfoRow}>
              <Text style={styles.currentInfoLabel}>Platform:</Text>
              <Text style={styles.currentInfoValue}>{product.platform}</Text>
            </View>
            <View style={styles.currentInfoRow}>
              <Text style={styles.currentInfoLabel}>Last Sync:</Text>
              <Text style={styles.currentInfoValue}>{product.lastSync}</Text>
            </View>
          </View>
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
  cancelButton: {
    padding: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#9ca3af',
    fontWeight: '500',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  saveButton: {
    backgroundColor: '#f97316',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#6b7280',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
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
    fontStyle: 'italic',
  },
  platformInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 16,
  },
  platformBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  platformIcon: {
    fontSize: 16,
  },
  platformText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  productId: {
    fontSize: 12,
    color: '#9ca3af',
    fontFamily: 'monospace',
  },
  formContainer: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 24,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  formHint: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#1f2937',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#374151',
    minHeight: 50,
  },
  formTextArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
    paddingLeft: 16,
  },
  priceSymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#22c55e',
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: '#ffffff',
    minHeight: 50,
  },
  categoryContainer: {
    marginTop: 8,
  },
  categoryScroll: {
    flexGrow: 0,
  },
  categoryChip: {
    backgroundColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#4b5563',
  },
  categoryChipSelected: {
    backgroundColor: '#f97316',
    borderColor: '#f97316',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#d1d5db',
    fontWeight: '500',
  },
  categoryChipTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
  currentInfo: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
    marginTop: 8,
  },
  currentInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  currentInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  currentInfoLabel: {
    fontSize: 14,
    color: '#9ca3af',
  },
  currentInfoValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
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
    textAlign: 'center',
  },
  errorButton: {
    backgroundColor: '#f97316',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  errorButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
  },
  // Image upload styles
  imagePreviewContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 12,
    backgroundColor: '#1f2937',
  },
  imageActions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 12,
  },
  changeImageButton: {
    backgroundColor: '#f97316',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  changeImageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  removeImageButton: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  removeImageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  imageUploadButton: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#374151',
    borderStyle: 'dashed',
    padding: 32,
    alignItems: 'center',
    marginTop: 8,
  },
  imageUploadContent: {
    alignItems: 'center',
  },
  imageUploadIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  imageUploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  imageUploadHint: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
});

export default EditProductScreen;

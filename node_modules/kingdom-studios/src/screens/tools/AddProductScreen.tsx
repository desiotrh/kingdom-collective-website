import React, { useState } from 'react';
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
import { useProducts } from '../../contexts/ProductContext';

// Mock faith mode hook
const useFaithMode = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  return { isEnabled, setIsEnabled };
};

// Platform options
const platforms = [
  { id: 'Printify', name: 'Printify', icon: '🖨️', color: '#39D353' },
  { id: 'Etsy', name: 'Etsy', icon: '🎨', color: '#F1641E' },
  { id: 'Shopify', name: 'Shopify', icon: '🛒', color: '#96BF47' },
] as const;

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

const AddProductScreen = () => {
  const navigation = useAppNavigation();
  const { addProduct } = useProducts();
  const { isEnabled: faithMode } = useFaithMode();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [platform, setPlatform] = useState<'Printify' | 'Etsy' | 'Shopify' | ''>('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const generateImageUrl = (title: string, platform: string) => {
    const colors: { [key: string]: string } = {
      'Printify': 'f97316',
      'Etsy': 'F1641E',
      'Shopify': '96BF47',
    };
    const color = colors[platform] || 'f97316';
    const text = encodeURIComponent(title.substring(0, 20));
    return `https://via.placeholder.com/400x400/${color}/ffffff?text=${text}`;
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
        { text: 'Remove', onPress: () => setImageUri(null) },
      ]
    );
  };

  const handleSave = () => {
    // Validation
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a product title');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a product description');
      return;
    }

    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    if (!category.trim()) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    if (!platform) {
      Alert.alert('Error', 'Please select a platform');
      return;
    }

    setIsLoading(true);

    // Prepare new product data
    const newProduct = {
      title: title.trim(),
      description: description.trim(),
      price: priceValue,
      category: category.trim(),
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      platform: platform as 'Printify' | 'Etsy' | 'Shopify',
      imageUrl: generateImageUrl(title, platform),
    };

    // Mock save operation with actual context addition
    setTimeout(() => {
      setIsLoading(false);
      
      // Add the product to context
      addProduct(newProduct);
      
      Alert.alert(
        'Success',
        'Product added successfully! It will be synced to your platform soon.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }, 1000);
  };

  const handleCancel = () => {
    // Check if there's any form data
    const hasData = title.trim() || description.trim() || price.trim() || 
                   category.trim() || tags.trim() || platform;

    if (hasData) {
      Alert.alert(
        'Discard Changes',
        'Are you sure you want to discard your changes?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { text: 'Discard', onPress: () => navigation.goBack() },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const getPlatformById = (id: string) => {
    return platforms.find(p => p.id === id);
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
          <Text style={styles.title}>Add Product</Text>
          <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
            onPress={handleSave}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Adding...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Faith Mode Message */}
        {faithMode && (
          <View style={styles.faithMessage}>
            <Text style={styles.faithText}>
              "Whatever you do, work at it with all your heart, as working for the Lord." – Colossians 3:23
            </Text>
          </View>
        )}

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

          {/* Platform Field */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Platform *</Text>
            <Text style={styles.formHint}>Select the platform where you want to sell this product</Text>
            <View style={styles.platformContainer}>
              {platforms.map((platformOption) => (
                <TouchableOpacity
                  key={platformOption.id}
                  style={[
                    styles.platformChip,
                    platform === platformOption.id && [
                      styles.platformChipSelected,
                      { borderColor: platformOption.color }
                    ]
                  ]}
                  onPress={() => setPlatform(platformOption.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.platformIcon}>{platformOption.icon}</Text>
                  <Text style={[
                    styles.platformChipText,
                    platform === platformOption.id && { color: platformOption.color }
                  ]}>
                    {platformOption.name}
                  </Text>
                </TouchableOpacity>
              ))}
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

          {/* Preview Section */}
          {(title || platform) && (
            <View style={styles.previewSection}>
              <Text style={styles.previewTitle}>Preview</Text>
              <View style={styles.previewCard}>
                <Text style={styles.previewProductTitle}>{title || 'Product Title'}</Text>
                <Text style={styles.previewPrice}>
                  {price ? formatPrice(parseFloat(price) || 0) : '$0.00'}
                </Text>
                {platform && (
                  <View style={[
                    styles.previewPlatformBadge,
                    { backgroundColor: getPlatformById(platform)?.color || '#f97316' }
                  ]}>
                    <Text style={styles.previewPlatformIcon}>
                      {getPlatformById(platform)?.icon || '🛍️'}
                    </Text>
                    <Text style={styles.previewPlatformText}>{platform}</Text>
                  </View>
                )}
                {category && (
                  <Text style={styles.previewCategory}>{category}</Text>
                )}
              </View>
            </View>
          )}
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
  platformContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  platformChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4b5563',
    gap: 8,
  },
  platformChipSelected: {
    backgroundColor: '#1f2937',
    borderWidth: 2,
  },
  platformIcon: {
    fontSize: 16,
  },
  platformChipText: {
    fontSize: 14,
    color: '#d1d5db',
    fontWeight: '500',
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
  previewSection: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
    marginTop: 8,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  previewCard: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 12,
    position: 'relative',
  },
  previewProductTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  previewPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#22c55e',
    marginBottom: 8,
  },
  previewPlatformBadge: {
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
  previewPlatformIcon: {
    fontSize: 12,
  },
  previewPlatformText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  previewCategory: {
    fontSize: 12,
    color: '#f97316',
    fontWeight: '500',
  },
});

export default AddProductScreen;

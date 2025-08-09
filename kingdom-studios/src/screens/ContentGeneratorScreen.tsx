import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  FlatList,
  Modal,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppNavigation } from '../utils/navigationUtils';
import { useFaithMode } from '../contexts/FaithModeContext';
import { useDualMode } from '../contexts/DualModeContext';
import { useAuth } from '../contexts/UnifiedAuthContext';
import { useTierSystem } from '../contexts/TierSystemContext';
import { KingdomColors } from '../constants/KingdomColors';
import { KingdomShadows } from '../constants/KingdomShadows';
import KingdomLogo from '../components/KingdomLogo';
import ModeToggle from '../components/ModeToggle';
import backendAPI, {
  type ContentGenerationRequest,
  type ContentGenerationResponse
} from '../services/backendAPI';
import { contentService } from '../services/contentService';
import { AnalyticsService } from '../services/AnalyticsService';
import AIReflectModal from '../../../packages/ui/AIReflectModal';
import { getReflectPrompts } from '../../../packages/utils/valuesStyle';

const { width } = Dimensions.get('window');

// Type definitions
interface Product {
  id: string;
  title: string;
  price: string;
  image: string;
}

interface GeneratedContentType {
  post: string;
  caption: string;
  reelIdea: string;
}

interface ContentGenerationState {
  isLoading: boolean;
  error: string | null;
  content: ContentGenerationResponse | null;
}

interface ContentTemplate {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: string;
  platforms: string[];
  tags: string[];
}

interface RecentContent {
  id: string;
  title: string;
  type: 'post' | 'story' | 'reel' | 'product';
  thumbnail: string;
  created: string;
  status: 'draft' | 'published' | 'scheduled';
}

interface CreationTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Faith Over Fear T-Shirt',
    price: '$29.99',
    image: 'https://via.placeholder.com/200x200/333333/ffffff?text=Faith+Tee',
  },
  {
    id: '2',
    title: 'Kingdom Crown Cap',
    price: '$24.99',
    image: 'https://via.placeholder.com/200x200/333333/ffffff?text=Crown+Cap',
  },
  {
    id: '3',
    title: 'Blessed Hoodie',
    price: '$49.99',
    image: 'https://via.placeholder.com/200x200/333333/ffffff?text=Blessed+Hoodie',
  },
  {
    id: '4',
    title: 'Scripture Phone Case',
    price: '$19.99',
    image: 'https://via.placeholder.com/200x200/333333/ffffff?text=Phone+Case',
  },
  {
    id: '5',
    title: 'Cross Necklace',
    price: '$39.99',
    image: 'https://via.placeholder.com/200x200/333333/ffffff?text=Cross+Necklace',
  },
  {
    id: '6',
    title: 'Prayer Journal',
    price: '$15.99',
    image: 'https://via.placeholder.com/200x200/333333/ffffff?text=Prayer+Journal',
  },
];

const ContentGeneratorScreen = () => {
  const navigation = useAppNavigation();
  const { faithMode } = useFaithMode();
  const { user } = useAuth();
  const {
    currentTier,
    tierFeatures,
    checkFeatureAccess,
    trackUsage,
    getUsageStats,
    isTrialActive
  } = useTierSystem();

  // Content generation state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [contentType, setContentType] = useState('');
  const [reflectVisible, setReflectVisible] = useState(false);
  const [reflectPendingType, setReflectPendingType] = useState<null | 'post' | 'caption' | 'reelIdea'>(null);
  const [contentGeneration, setContentGeneration] = useState<ContentGenerationState>({
    isLoading: false,
    error: null,
    content: null,
  });

  // Product state
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Platform and template state
  const [selectedPlatform, setSelectedPlatform] = useState<string>('instagram');
  const [templates, setTemplates] = useState<ContentTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');

  // Enhanced generation options
  const [selectedTone, setSelectedTone] = useState<string>('inspirational');
  const [selectedLength, setSelectedLength] = useState<string>('medium');
  const [contentSubtype, setContentSubtype] = useState<string>('post');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  // Tier system state
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [usageStats, setUsageStats] = useState<any>(null);

  // Load products on component mount
  useEffect(() => {
    loadProducts();
    loadTemplates();
    loadUsageStats();
  }, []);

  const loadUsageStats = async () => {
    try {
      const stats = await getUsageStats();
      setUsageStats(stats);
    } catch (error) {
      console.error('Failed to load usage stats:', error);
    }
  };

  const handleFeatureAccess = async (featureKey: string, action: string) => {
    const hasAccess = await checkFeatureAccess(featureKey);
    if (!hasAccess) {
      setShowUpgradeModal(true);
      return false;
    }

    await trackUsage('content_generator', action);
    await loadUsageStats();
    return true;
  };

  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      // For now, using mock data. In the future, this will call the Products API
      // const response = await ProductAPI.getProducts();
      setProducts(mockProducts);
    } catch (error) {
      console.error('Failed to load products:', error);
      setProducts(mockProducts);
    } finally {
      setLoadingProducts(false);
    }
  };

  const loadTemplates = async () => {
    try {
      // Use the backend API to get templates
      const allTemplates = await backendAPI.getContentTemplates();

      // Filter by faith mode and platform
      let filteredTemplates = allTemplates;
      if (faithMode) {
        filteredTemplates = allTemplates.filter(t =>
          t.category === 'faith' || t.category === 'business' || t.category === 'inspiration'
        );
      }
      if (selectedPlatform) {
        filteredTemplates = filteredTemplates.filter(t => t.platforms.includes(selectedPlatform));
      }

      setTemplates(filteredTemplates.map(t => ({
        id: t.id,
        title: t.name,
        description: t.description || '',
        prompt: t.prompt,
        category: t.category,
        platforms: t.platforms,
        tags: [], // Backend templates don't have tags yet
      })));
    } catch (error) {
      console.error('Failed to load templates from API, using fallback:', error);

      // Fallback to mock templates
      const mockTemplates: ContentTemplate[] = [
        {
          id: 'business_growth_1',
          title: 'Business Growth Strategy',
          description: 'Template for sharing business growth insights',
          prompt: 'Share a key business growth strategy that has worked for you, including specific tactics and measurable results.',
          category: 'business',
          platforms: ['linkedin', 'instagram', 'facebook'],
          tags: ['growth', 'strategy', 'business']
        },
        {
          id: 'kingdom_principles_1',
          title: 'Kingdom Business Principles',
          description: 'Template for sharing biblical business wisdom',
          prompt: 'Share a biblical principle that has transformed your approach to business, including the scripture reference and practical application.',
          category: 'faith',
          platforms: ['instagram', 'facebook', 'linkedin'],
          tags: ['kingdom', 'principles', 'biblical', 'business']
        },
        {
          id: 'product_launch_1',
          title: 'Product Launch Announcement',
          description: 'Template for announcing new products',
          prompt: 'Create an exciting announcement for a new product launch, highlighting key benefits and creating urgency.',
          category: 'marketing',
          platforms: ['instagram', 'facebook', 'twitter', 'linkedin'],
          tags: ['product', 'launch', 'announcement']
        }
      ];

      // Filter by faith mode and platform
      let filteredTemplates = mockTemplates;
      if (faithMode) {
        filteredTemplates = mockTemplates.filter(t => t.category === 'faith' || t.category === 'business');
      }
      if (selectedPlatform) {
        filteredTemplates = filteredTemplates.filter(t => t.platforms.includes(selectedPlatform));
      }

      setTemplates(filteredTemplates);
    }
  };

  // Reload templates when platform or faith mode changes
  useEffect(() => {
    loadTemplates();
  }, [selectedPlatform, faithMode]);

  const handleProductPress = (product: Product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const handleGenerateContent = async (type: 'post' | 'caption' | 'reelIdea') => {
    if (!selectedProduct || !user) return;

    // Check feature access based on tier
    const hasAccess = await handleFeatureAccess('aiGenerationsPerDay', `generate_${type}`);
    if (!hasAccess) return;

    // Check if bulk generation is available (for advanced content types)
    if (type === 'reelIdea' && !tierFeatures.bulkGeneration) {
      const hasAdvancedAccess = await handleFeatureAccess('bulkGeneration', 'advanced_content_generation');
      if (!hasAdvancedAccess) return;
    }

    setContentGeneration({
      isLoading: true,
      error: null,
      content: null,
    });
    setContentType(type);

    try {
      // Track analytics event with AnalyticsService
      AnalyticsService.getInstance().trackEvent('content_generation_started', 1, {
        contentType: type,
        platform: selectedPlatform,
        userId: user.id,
        faithMode: faithMode,
        tier: currentTier,
      });

      // Track with backend API as well for backwards compatibility
      await backendAPI.trackContentGeneration({
        contentType: type,
        platform: selectedPlatform,
        success: false, // Will update to true on success
      });

      // Create enhanced content generation request
      const basePrompt = customPrompt || selectedTemplate?.prompt ||
        `Generate a ${type} for the product "${selectedProduct.title}" priced at ${selectedProduct.price}. ${faithMode
          ? 'Include faith-based and inspirational messaging that aligns with Christian values and biblical principles.'
          : 'Create inspiring, engaging, and conversion-focused content.'
        }`;

      const contentRequest: ContentGenerationRequest = {
        contentType: type,
        platform: selectedPlatform,
        prompt: basePrompt,
        tone: selectedTone,
        length: selectedLength,
        subtype: contentSubtype,
        customPrompt: customPrompt || undefined,
      };

      // Try enterprise content service first for better performance (if available)
      let response: ContentGenerationResponse;
      try {
        // Use enterprise content service for enhanced performance (premium tiers)
        if (tierFeatures.prioritySupport) {
          const enterpriseResponse = await contentService.generateContent({
            contentType: type,
            platform: selectedPlatform,
            prompt: basePrompt,
            tone: selectedTone,
            length: selectedLength,
            subtype: contentSubtype,
            customPrompt: customPrompt || undefined,
            faithMode: faithMode,
          });

          // Convert to expected format from API response
          response = enterpriseResponse.data;
        } else {
          // Use standard API for basic tiers
          response = await backendAPI.generateContent(contentRequest);
        }
      } catch (enterpriseError) {
        // Fall back to direct backend API if enterprise service fails
        console.log('Enterprise service unavailable, falling back to direct API');
        response = await backendAPI.generateContent(contentRequest);
      }

      setContentGeneration({
        isLoading: false,
        error: null,
        content: response,
      });

      // Track successful generation with tier information
      AnalyticsService.getInstance().trackEvent('content_generation_success', 1, {
        contentType: type,
        platform: selectedPlatform,
        userId: user.id,
        faithMode: faithMode,
        tier: currentTier,
        wordCount: response.metadata?.wordCount,
      });

      await backendAPI.trackContentGeneration({
        contentType: type,
        platform: selectedPlatform,
        success: true,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate content';

      setContentGeneration({
        isLoading: false,
        error: errorMessage,
        content: null,
      });

      // Track error with enhanced analytics
      AnalyticsService.getInstance().trackEvent('content_generation_error', 1, {
        contentType: type,
        platform: selectedPlatform,
        userId: user.id,
        error: errorMessage,
        faithMode: faithMode,
        tier: currentTier,
      });

      // Track error (simplified for backend API)
      await backendAPI.trackContentGeneration({
        contentType: type,
        platform: selectedPlatform,
        success: false,
      });

      Alert.alert(
        'Generation Failed',
        errorMessage,
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  // Begin reflect checkpoint then generate
  const beginReflectAndGenerate = (type: 'post' | 'caption' | 'reelIdea') => {
    setReflectPendingType(type);
    setReflectVisible(true);
  };

  const handleCustomGeneration = async () => {
    if (!selectedProduct || !user) return;

    // Use the current content subtype or default to 'post'
    const type = contentSubtype as 'post' | 'caption' | 'reelIdea';
    await handleGenerateContent(type);
  };

  const handleAddToFavorites = async () => {
    if (!contentGeneration.content || !user) return;

    try {
      await backendAPI.addToFavorites({
        content: contentGeneration.content.content,
        contentType: contentGeneration.content.contentType,
        platform: contentGeneration.content.platform,
        title: `${contentGeneration.content.contentType} for ${selectedProduct?.title}`,
      });

      Alert.alert(
        'Added to Favorites! ⭐',
        'This content has been saved to your favorites.',
        [{ text: 'OK', style: 'default' }]
      );
    } catch (error) {
      console.error('Failed to add to favorites:', error);
      Alert.alert(
        'Error',
        'Failed to add to favorites. Please try again.',
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedProduct(null);
    setContentGeneration({
      isLoading: false,
      error: null,
      content: null,
    });
    setContentType('');
  };

  const handleTryAgain = () => {
    if (contentType) {
      handleGenerateContent(contentType as 'post' | 'caption' | 'reelIdea');
    }
  };

  const handleBackToOptions = () => {
    setContentGeneration({
      isLoading: false,
      error: null,
      content: null,
    });
    setContentType('');
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const renderProductCard = (product: Product) => (
    <TouchableOpacity
      key={product.id}
      style={styles.productCard}
      onPress={() => handleProductPress(product)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: product.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productTitle}>{product.title}</Text>
        <Text style={styles.productPrice}>{product.price}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderGenerationModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleCloseModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {selectedProduct && (
            <>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedProduct.title}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleCloseModal}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              {contentGeneration.isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#ffffff" />
                  <Text style={styles.loadingText}>
                    Generating {contentType === 'reelIdea' ? 'reel idea' : contentType}...
                  </Text>
                  <Text style={styles.loadingSubtext}>
                    {faithMode
                      ? "Creating faith-inspired content for you..."
                      : "Creating inspiring content for you..."
                    }
                  </Text>
                </View>
              ) : contentGeneration.error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorTitle}>❌ Generation Failed</Text>
                  <Text style={styles.errorText}>{contentGeneration.error}</Text>
                  <View style={styles.errorActions}>
                    <TouchableOpacity
                      style={styles.retryButton}
                      onPress={handleTryAgain}
                    >
                      <Text style={styles.retryButtonText}>� Try Again</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.backToOptionsButton}
                      onPress={handleBackToOptions}
                    >
                      <Text style={styles.backToOptionsText}>← Back to Options</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : contentGeneration.content ? (
                <View style={styles.contentContainer}>
                  <Text style={styles.contentTypeTitle}>
                    {contentType === 'post' && '📝 Generated Post'}
                    {contentType === 'caption' && '💬 Generated Caption'}
                    {contentType === 'reelIdea' && '🎬 Generated Reel Idea'}
                  </Text>
                  <ScrollView style={styles.contentScrollView}>
                    <Text style={styles.generatedText}>{contentGeneration.content.content}</Text>

                    {/* Show metadata if available */}
                    {contentGeneration.content.metadata && Object.keys(contentGeneration.content.metadata).length > 0 && (
                      <View style={styles.metadataContainer}>
                        <Text style={styles.metadataTitle}>Additional Info:</Text>
                        {Object.entries(contentGeneration.content.metadata).map(([key, value]) => (
                          <Text key={key} style={styles.metadataItem}>
                            {key}: {String(value)}
                          </Text>
                        ))}
                      </View>
                    )}
                  </ScrollView>
                  <View style={styles.contentActions}>
                    <TouchableOpacity
                      style={styles.favoriteButton}
                      onPress={handleAddToFavorites}
                    >
                      <Text style={styles.favoriteButtonText}>⭐ Add to Favorites</Text>
                    </TouchableOpacity>

                    {/* Content Refinement Options */}
                    <View style={styles.refinementSection}>
                      <Text style={styles.refinementLabel}>Refine Content:</Text>
                      <View style={styles.refinementButtons}>
                        <TouchableOpacity
                          style={styles.refinementButton}
                          onPress={() => handleRefineContent('shorten')}
                        >
                          <Text style={styles.refinementButtonText}>✂️ Shorten</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.refinementButton}
                          onPress={() => handleRefineContent('expand')}
                        >
                          <Text style={styles.refinementButtonText}>📖 Expand</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.refinementButton}
                          onPress={() => handleRefineContent('improve')}
                        >
                          <Text style={styles.refinementButtonText}>✨ Improve</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.refinementButton}
                          onPress={() => handleRefineContent('tone_change', `Change tone to be more ${selectedTone}`)}
                        >
                          <Text style={styles.refinementButtonText}>🎭 Change Tone</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={styles.generateAgainButton}
                      onPress={() => handleGenerateContent(contentType as 'post' | 'caption' | 'reelIdea')}
                    >
                      <Text style={styles.generateAgainText}>🔄 Generate Again</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.backToOptionsButton}
                      onPress={handleBackToOptions}
                    >
                      <Text style={styles.backToOptionsText}>← Back to Options</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.optionsContainer}>
                  <Text style={styles.optionsTitle}>Generate Content:</Text>

                  {/* Platform Selection */}
                  <View style={styles.platformSection}>
                    <Text style={styles.sectionLabel}>Platform:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.platformScroll}>
                      {['instagram', 'facebook', 'linkedin', 'tiktok', 'twitter'].map((platform) => (
                        <TouchableOpacity
                          key={platform}
                          style={[
                            styles.platformButton,
                            selectedPlatform === platform && styles.platformButtonActive
                          ]}
                          onPress={() => setSelectedPlatform(platform)}
                        >
                          <Text style={[
                            styles.platformButtonText,
                            selectedPlatform === platform && styles.platformButtonTextActive
                          ]}>
                            {platform === 'instagram' && '📸'}
                            {platform === 'facebook' && '📘'}
                            {platform === 'linkedin' && '💼'}
                            {platform === 'tiktok' && '🎵'}
                            {platform === 'twitter' && '🐦'}
                            {platform.charAt(0).toUpperCase() + platform.slice(1)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  {/* Content Type Options */}
                  <View style={styles.contentTypeSection}>
                    <Text style={styles.sectionLabel}>Content Type:</Text>

                    <TouchableOpacity
                      style={styles.optionButton}
                      onPress={() => beginReflectAndGenerate('post')}
                    >
                      <View style={styles.optionContent}>
                        <Text style={styles.optionIcon}>📝</Text>
                        <View style={styles.optionTextContainer}>
                          <Text style={styles.optionText}>Generate Post</Text>
                          <Text style={styles.optionDescription}>
                            Detailed social media post with engaging content
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.optionButton}
                      onPress={() => beginReflectAndGenerate('caption')}
                    >
                      <View style={styles.optionContent}>
                        <Text style={styles.optionIcon}>💬</Text>
                        <View style={styles.optionTextContainer}>
                          <Text style={styles.optionText}>Generate Caption</Text>
                          <Text style={styles.optionDescription}>
                            Short, punchy caption perfect for images
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.optionButton}
                      onPress={() => beginReflectAndGenerate('reelIdea')}
                    >
                      <View style={styles.optionContent}>
                        <Text style={styles.optionIcon}>🎬</Text>
                        <View style={styles.optionTextContainer}>
                          <Text style={styles.optionText}>Generate Reel Idea</Text>
                          <Text style={styles.optionDescription}>
                            Creative video concept with scene breakdown
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>

                  {/* Content Templates */}
                  {templates.length > 0 && (
                    <View style={styles.templatesSection}>
                      <View style={styles.sectionHeaderContainer}>
                        <Text style={styles.sectionLabel}>Templates:</Text>
                        <TouchableOpacity
                          style={styles.toggleButton}
                          onPress={() => setShowTemplates(!showTemplates)}
                        >
                          <Text style={styles.toggleButtonText}>
                            {showTemplates ? 'Hide' : 'Show'} Templates
                          </Text>
                        </TouchableOpacity>
                      </View>

                      {showTemplates && (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.templatesScroll}>
                          {templates.map((template) => (
                            <TouchableOpacity
                              key={template.id}
                              style={[
                                styles.templateCard,
                                selectedTemplate?.id === template.id && styles.templateCardActive
                              ]}
                              onPress={() => {
                                setSelectedTemplate(template);
                                setCustomPrompt(template.prompt);
                              }}
                            >
                              <View style={styles.templateContent}>
                                <Text style={styles.templateIcon}>
                                  {template.category === 'faith' && '🙏'}
                                  {template.category === 'business' && '💼'}
                                  {template.category === 'marketing' && '📢'}
                                </Text>
                                <Text style={styles.templateTitle}>{template.title}</Text>
                                <Text style={styles.templateDescription}>{template.description}</Text>
                                <View style={styles.templateTags}>
                                  {template.tags.slice(0, 2).map((tag) => (
                                    <Text key={tag} style={styles.templateTag}>#{tag}</Text>
                                  ))}
                                </View>
                              </View>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      )}
                    </View>
                  )}

                  {/* Advanced Options */}
                  <View style={styles.advancedSection}>
                    <TouchableOpacity
                      style={styles.toggleButton}
                      onPress={() => setShowAdvancedOptions(!showAdvancedOptions)}
                    >
                      <Text style={styles.toggleButtonText}>
                        {showAdvancedOptions ? 'Hide' : 'Show'} Advanced Options
                      </Text>
                    </TouchableOpacity>

                    {showAdvancedOptions && (
                      <View style={styles.advancedOptions}>
                        {/* Tone Selection */}
                        <View style={styles.optionGroup}>
                          <Text style={styles.optionLabel}>Tone:</Text>
                          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {['inspirational', 'educational', 'conversational', 'professional', 'playful'].map((tone) => (
                              <TouchableOpacity
                                key={tone}
                                style={[
                                  styles.optionChip,
                                  selectedTone === tone && styles.optionChipActive
                                ]}
                                onPress={() => setSelectedTone(tone)}
                              >
                                <Text style={[
                                  styles.optionChipText,
                                  selectedTone === tone && styles.optionChipTextActive
                                ]}>
                                  {tone.charAt(0).toUpperCase() + tone.slice(1)}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        </View>

                        {/* Length Selection */}
                        <View style={styles.optionGroup}>
                          <Text style={styles.optionLabel}>Length:</Text>
                          <View style={styles.optionChipsContainer}>
                            {['short', 'medium', 'long'].map((length) => (
                              <TouchableOpacity
                                key={length}
                                style={[
                                  styles.optionChip,
                                  selectedLength === length && styles.optionChipActive
                                ]}
                                onPress={() => setSelectedLength(length)}
                              >
                                <Text style={[
                                  styles.optionChipText,
                                  selectedLength === length && styles.optionChipTextActive
                                ]}>
                                  {length.charAt(0).toUpperCase() + length.slice(1)}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </View>

                        {/* Content Subtype */}
                        <View style={styles.optionGroup}>
                          <Text style={styles.optionLabel}>Content Type:</Text>
                          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {['post', 'caption', 'story', 'reel', 'thread'].map((subtype) => (
                              <TouchableOpacity
                                key={subtype}
                                style={[
                                  styles.optionChip,
                                  contentSubtype === subtype && styles.optionChipActive
                                ]}
                                onPress={() => setContentSubtype(subtype)}
                              >
                                <Text style={[
                                  styles.optionChipText,
                                  contentSubtype === subtype && styles.optionChipTextActive
                                ]}>
                                  {subtype.charAt(0).toUpperCase() + subtype.slice(1)}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        </View>

                        {/* Custom Prompt */}
                        <View style={styles.optionGroup}>
                          <Text style={styles.optionLabel}>
                            {selectedTemplate ? 'Template Prompt (Editable):' : 'Custom Prompt:'}
                          </Text>
                          <TextInput
                            style={styles.customPromptInput}
                            multiline
                            numberOfLines={3}
                            placeholder={selectedTemplate?.prompt || "Enter your custom content prompt..."}
                            value={customPrompt}
                            onChangeText={setCustomPrompt}
                            placeholderTextColor="#999"
                          />
                        </View>
                      </View>
                    )}

                    {/* Generate with Advanced Options Button */}
                    {(showAdvancedOptions || selectedTemplate || customPrompt) && (
                      <TouchableOpacity
                        style={styles.advancedGenerateButton}
                        onPress={handleCustomGeneration}
                      >
                        <Text style={styles.advancedGenerateText}>
                          ✨ Generate with {selectedTemplate ? 'Template' : 'Advanced Options'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  // Helper function to get key points for products
  const getKeyPointsForProduct = (product: Product, contentType: string, faithMode: boolean) => {
    const basePoints = [
      `Product: ${product.title}`,
      `Price: ${product.price}`,
      'Quality and value',
      'Customer satisfaction'
    ];

    const faithPoints = [
      'Kingdom business principles',
      'Biblical values in business',
      'Serving others through products',
      'Excellence as worship',
      'Building for eternal impact'
    ];

    const contentTypePoints = {
      post: ['Detailed benefits', 'Story or testimonial', 'Social proof'],
      caption: ['Quick benefits', 'Emotional connection', 'Clear call-to-action'],
      reelIdea: ['Visual concepts', 'Engaging transitions', 'Trending elements']
    };

    return [
      ...basePoints,
      ...(faithMode ? faithPoints : []),
      ...(contentTypePoints[contentType as keyof typeof contentTypePoints] || [])
    ];
  };

  const handleRefineContent = async (refinementType: 'shorten' | 'expand' | 'improve' | 'tone_change', instructions?: string) => {
    if (!contentGeneration.content) return;

    setContentGeneration(prev => ({
      ...prev,
      isLoading: true,
    }));

    try {
      const response = await backendAPI.refineContent({
        content: contentGeneration.content!.content,
        refinementType,
        instructions,
        targetTone: selectedTone,
      });

      setContentGeneration(prev => ({
        ...prev,
        isLoading: false,
        content: prev.content ? {
          ...prev.content,
          content: response.refinedContent,
        } : null,
      }));
    } catch (error) {
      console.error('Failed to refine content:', error);
      setContentGeneration(prev => ({
        ...prev,
        isLoading: false,
      }));

      Alert.alert(
        'Refinement Failed',
        'Failed to refine content. Please try again.',
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Content Generator</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Select a Product</Text>
        <Text style={styles.sectionSubtitle}>
          {faithMode
            ? "Tap any product to generate faith-inspired content ideas"
            : "Tap any product to generate inspiring content ideas"
          }
        </Text>

        <View style={styles.productsGrid}>
          {mockProducts.map(renderProductCard)}
        </View>
      </ScrollView>

      {renderGenerationModal()}

      {/* Pause & Reflect (pre-generate) */}
      <AIReflectModal
        visible={reflectVisible}
        beforePrompts={getReflectPrompts(faithMode).before}
        onSkip={() => {
          setReflectVisible(false);
          if (reflectPendingType) handleGenerateContent(reflectPendingType);
        }}
        onConfirm={() => {
          setReflectVisible(false);
          if (reflectPendingType) handleGenerateContent(reflectPendingType);
        }}
      />

      {/* Upgrade Modal */}
      <Modal
        visible={showUpgradeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowUpgradeModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <LinearGradient
              colors={[KingdomColors.primary.royalPurple, KingdomColors.gold.bright]}
              style={styles.modalGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.modalTitle}>
                {faithMode ? '✨ Unlock Kingdom Content Pro' : '✨ Upgrade for More Content'}
              </Text>
              <Text style={styles.modalSubtitle}>
                {faithMode
                  ? 'Generate unlimited Kingdom-focused content for your ministry'
                  : 'Create unlimited content and access premium features'
                }
              </Text>

              <View style={styles.modalFeatures}>
                <Text style={styles.modalFeature}>• {tierFeatures.aiGenerationsPerDay} daily AI generations → Unlimited</Text>
                <Text style={styles.modalFeature}>• Premium content templates</Text>
                <Text style={styles.modalFeature}>• Bulk content generation</Text>
                <Text style={styles.modalFeature}>• Advanced customization options</Text>
                <Text style={styles.modalFeature}>• Priority content processing</Text>
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.upgradeButton}
                  onPress={() => {
                    setShowUpgradeModal(false);
                    navigation.navigate('TierSelection');
                  }}
                >
                  <Text style={styles.upgradeButtonText}>
                    {faithMode ? 'Upgrade Kingdom Plan' : 'Upgrade Now'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowUpgradeModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Maybe Later</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSpacer: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#cccccc',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  productsGrid: {
    paddingHorizontal: 20,
    gap: 16,
  },
  productCard: {
    backgroundColor: '#111111',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  productImage: {
    width: 80,
    height: 80,
    backgroundColor: '#333333',
  },
  productInfo: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#cccccc',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#111111',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333333',
    width: '100%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#cccccc',
    fontWeight: 'bold',
  },
  optionsContainer: {
    padding: 20,
  },
  optionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: '#222222',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#444444',
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  contentContainer: {
    padding: 20,
    flex: 1,
  },
  contentTypeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  contentScrollView: {
    flex: 1,
    marginBottom: 20,
  },
  generatedText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#ffffff',
    textAlign: 'left',
  },
  backToOptionsButton: {
    backgroundColor: '#333333',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  backToOptionsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  // Loading states
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 20,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#cccccc',
    marginTop: 8,
    textAlign: 'center',
  },
  // Error states
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#ffcccc',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  errorActions: {
    width: '100%',
    gap: 12,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  // Enhanced content display
  metadataContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333333',
  },
  metadataTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#cccccc',
    marginBottom: 8,
  },
  metadataItem: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 4,
  },
  contentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#333333',
    flexWrap: 'wrap',
    gap: 8,
  },
  favoriteButton: {
    backgroundColor: '#FF9800',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    alignItems: 'center',
    flex: 1,
    minWidth: '30%',
  },
  favoriteButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  generateAgainButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    alignItems: 'center',
    flex: 1,
    minWidth: '30%',
  },
  generateAgainText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  // Platform selection styles
  platformSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  platformScroll: {
    flexDirection: 'row',
  },
  platformButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#444444',
    backgroundColor: '#222222',
  },
  platformButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  platformButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#cccccc',
  },
  platformButtonTextActive: {
    color: '#ffffff',
  },
  contentTypeSection: {
    gap: 12,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionDescription: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
    lineHeight: 16,
  },
  // Templates section
  templatesSection: {
    marginTop: 20,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#333333',
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  templatesScroll: {
    flexDirection: 'row',
  },
  templateCard: {
    backgroundColor: '#222222',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#444444',
    padding: 16,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  templateCardActive: {
    borderColor: '#4CAF50',
  },
  templateContent: {
    flex: 1,
  },
  templateIcon: {
    fontSize: 28,
    marginBottom: 8,
    color: '#4CAF50',
  },
  templateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  templateDescription: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 8,
  },
  templateTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  templateTag: {
    fontSize: 12,
    color: '#4CAF50',
    backgroundColor: '#333333',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
  },
  // Advanced options section
  advancedSection: {
    marginTop: 20,
  },
  advancedOptions: {
    backgroundColor: '#222222',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#444444',
  },
  optionGroup: {
    marginBottom: 16,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  optionChip: {
    backgroundColor: '#333333',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#444444',
  },
  optionChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChipActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  optionChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  optionChipTextActive: {
    color: '#ffffff',
  },
  customPromptInput: {
    backgroundColor: '#333333',
    borderRadius: 8,
    padding: 12,
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 20,
    borderWidth: 1,
    borderColor: '#444444',
  },
  advancedGenerateButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginTop: 16,
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  advancedGenerateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  refinementSection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  refinementLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  refinementButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  refinementButton: {
    flex: 1,
    backgroundColor: '#333333',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444444',
    minWidth: '22%',
  },
  refinementButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  // Upgrade Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalGradient: {
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: KingdomColors.white,
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.9,
  },
  modalFeatures: {
    alignSelf: 'stretch',
    marginBottom: 24,
  },
  modalFeature: {
    fontSize: 14,
    color: KingdomColors.white,
    marginBottom: 8,
    textAlign: 'left',
  },
  modalButtons: {
    width: '100%',
    gap: 12,
  },
  upgradeButton: {
    backgroundColor: KingdomColors.white,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: KingdomColors.primary.royalPurple,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: KingdomColors.white,
  },
  cancelButtonText: {
    fontSize: 14,
    color: KingdomColors.white,
  },
});

export default ContentGeneratorScreen;

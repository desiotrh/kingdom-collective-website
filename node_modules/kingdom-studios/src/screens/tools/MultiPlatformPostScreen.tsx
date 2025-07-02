import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
  Image,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useFaithMode } from '../../contexts/FaithModeContext';
import { useAppNavigation } from '../../utils/navigationUtils';
import { useProducts, Product } from '../../contexts/ProductContext';
import { RootStackParamList } from '../../types/navigation';
import ContentGeneratorModal from '../../components/ContentGeneratorModal';

type MultiPlatformPostRouteProp = RouteProp<RootStackParamList, 'MultiPlatformPost'>;

interface Platform {
  id: string;
  name: string;
  icon: string;
  characterLimit?: number;
  color: string;
}

interface PostData {
  caption: string;
  selectedPlatforms: string[];
  isScheduled: boolean;
  scheduledDateTime?: Date;
  imageUri?: string;
  videoUri?: string;
}

const MultiPlatformPostScreen = () => {
  const { faithMode } = useFaithMode();
  const navigation = useAppNavigation();
  const route = useRoute<MultiPlatformPostRouteProp>();
  const { getProductById } = useProducts();
  
  // Get product data if productId is provided
  const { productId } = route.params || {};
  const product = productId ? getProductById(productId) : null;

  // Post composition state
  const [caption, setCaption] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDateTime, setScheduledDateTime] = useState<Date>(new Date());
  const [imageUri, setImageUri] = useState<string>('');
  const [videoUri, setVideoUri] = useState<string>('');
  
  // AI Content Generator Modal state
  const [showContentGenerator, setShowContentGenerator] = useState(false);

  // Generate content from product data
  const generateProductCaption = (product: Product): string => {
    // Faith-based messages
    const faithMessages = [
      '🙌 Just dropped:',
      '✨ New arrival:',
      '🔥 Featured:',
      '💎 Spotlight:',
      '⭐ Fresh drop:',
      '🎯 Launching:',
      '🚀 Introducing:',
    ];
    
    const faithCallToActions = [
      '— perfect for bold believers',
      '— made for kingdom builders', 
      '— designed with faith in mind',
      '— crafted for the faithful',
      '— built for believers',
      '— created for His glory',
      '— faith-inspired design',
    ];

    const faithClosingMessages = [
      'Shop with purpose ✝️',
      'Faith in every stitch 🧵',
      'Building His kingdom 👑',
      'Wear your faith boldly 💪',
      'Faith over everything 🙏',
    ];

    // Encouragement-based messages (less churchy)
    const encouragementMessages = [
      '🌟 Just dropped:',
      '✨ New arrival:',
      '🔥 Featured:',
      '💎 Spotlight:',
      '⭐ Fresh drop:',
      '🎯 Launching:',
      '🚀 Introducing:',
    ];

    const encouragementCallToActions = [
      '— perfect for the inspired',
      '— made for changemakers',
      '— designed with purpose in mind',
      '— crafted for dreamers',
      '— built for the motivated',
      '— created with love',
      '— purpose-driven design',
    ];

    const encouragementClosingMessages = [
      'Shop with intention ✨',
      'Quality in every detail 🌟',
      'Building dreams together 💫',
      'Wear your purpose proudly 💪',
      'Purpose over everything 🙌',
    ];

    // Choose content based on faith mode
    const messages = faithMode ? faithMessages : encouragementMessages;
    const callToActions = faithMode ? faithCallToActions : encouragementCallToActions;
    const closingMessages = faithMode ? faithClosingMessages : encouragementClosingMessages;

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    const randomCTA = callToActions[Math.floor(Math.random() * callToActions.length)];
    const randomClosing = closingMessages[Math.floor(Math.random() * closingMessages.length)];
    
    return `${randomMessage} ${product.title} ${randomCTA}.\n\nOnly $${product.price.toFixed(2)} • Available on ${product.platform} ${getPlatformIcon(product.platform)}\n\n${randomClosing}`;
  };

  const generateHashtagsFromProduct = (product: Product): string[] => {
    const faithHashtags = ['faith', 'blessed', 'kingdombusiness', 'faithbased', 'christian'];
    const encouragementHashtags = ['inspiration', 'purpose', 'motivation', 'entrepreneur', 'positive'];
    
    const baseHashtags = faithMode ? faithHashtags : encouragementHashtags;
    const productHashtags = product.tags.map(tag => tag.toLowerCase().replace(/[\s-]/g, ''));
    const platformHashtag = product.platform.toLowerCase();
    const categoryHashtag = product.category.toLowerCase().replace(/[\s&]/g, '');
    
    // Create a comprehensive hashtag list
    const allHashtags = [
      ...baseHashtags.slice(0, 3), // Take first 3 base hashtags
      ...productHashtags.slice(0, 4), // Take first 4 product tags
      platformHashtag,
      categoryHashtag,
      'handmade',
      'smallbusiness',
      faithMode ? 'faithful' : 'purposeful',
    ];

    // Remove duplicates and limit to 8-10 hashtags
    return [...new Set(allHashtags)].slice(0, 9);
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

  // Auto-fill content when product is loaded
  useEffect(() => {
    if (product) {
      const generatedCaption = generateProductCaption(product);
      const hashtags = generateHashtagsFromProduct(product);
      
      setCaption(generatedCaption + '\n\n' + hashtags.map(tag => `#${tag}`).join(' '));
      setImageUri(product.imageUri || product.imageUrl || '');
      
      // Auto-select relevant platforms based on product platform
      const recommendedPlatforms = ['instagram', 'facebook'];
      if (product.platform === 'Etsy') {
        recommendedPlatforms.push('pinterest');
      }
      setSelectedPlatforms(recommendedPlatforms);
    }
  }, [product]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  // Handle AI-generated content selection
  const handleSelectGeneratedContent = (caption: string, hashtags: string[]) => {
    setCaption(caption);
    setShowContentGenerator(false);
  };

  // ProductPreviewCard component
  const ProductPreviewCard = ({ product }: { product: Product }) => (
    <View style={styles.productPreviewCard}>
      <View style={styles.productPreviewHeader}>
        <Text style={styles.productPreviewTitle}>Creating content for:</Text>
        <TouchableOpacity
          style={styles.editProductButton}
          onPress={() => navigation.navigate('EditProduct', { productId: product.id })}
          activeOpacity={0.8}
        >
          <Text style={styles.editProductButtonText}>Edit Product</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.productPreviewContent}>
        <Image
          source={{ uri: product.imageUri || product.imageUrl }}
          style={styles.productPreviewImage}
          resizeMode="cover"
        />
        
        <View style={styles.productPreviewInfo}>
          <View style={styles.productPreviewTop}>
            <Text style={styles.productPreviewName} numberOfLines={2}>
              {product.title}
            </Text>
            <View style={[
              styles.productPlatformBadge,
              { backgroundColor: getPlatformColor(product.platform) }
            ]}>
              <Text style={styles.productPlatformIcon}>{getPlatformIcon(product.platform)}</Text>
              <Text style={styles.productPlatformText}>{product.platform}</Text>
            </View>
          </View>
          
          <Text style={styles.productPreviewPrice}>${product.price.toFixed(2)}</Text>
          
          <View style={styles.productPreviewTags}>
            {product.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.productTag}>
                <Text style={styles.productTagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );

  // Platform definitions with styling
  const platforms: Platform[] = [
    {
      id: 'instagram',
      name: 'Instagram',
      icon: '📷', // In real app, would use official Instagram icon
      characterLimit: 2200,
      color: '#E4405F',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: '👥', // In real app, would use official Facebook icon
      characterLimit: 63206,
      color: '#1877F2',
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: '🎵', // In real app, would use official TikTok icon
      characterLimit: 300,
      color: '#000000',
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: '📺', // In real app, would use official YouTube icon
      characterLimit: 5000,
      color: '#FF0000',
    },
    {
      id: 'pinterest',
      name: 'Pinterest',
      icon: '📌', // In real app, would use official Pinterest icon
      characterLimit: 500,
      color: '#BD081C',
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      icon: '🐦', // In real app, would use official X icon
      characterLimit: 280,
      color: '#000000',
    },
    {
      id: 'threads',
      name: 'Threads',
      icon: '🧵', // In real app, would use official Threads icon
      characterLimit: 500,
      color: '#000000',
    },
    {
      id: 'lemon8',
      name: 'Lemon8',
      icon: '🍋', // In real app, would use official Lemon8 icon
      characterLimit: 1000,
      color: '#FFF200',
    },
    {
      id: 'truthsocial',
      name: 'Truth Social',
      icon: '🇺🇸', // In real app, would use official Truth Social icon
      characterLimit: 500,
      color: '#4A90E2',
    },
  ];

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const getCharacterLimit = () => {
    if (selectedPlatforms.length === 0) return null;
    
    const selectedPlatformObjects = platforms.filter(p => selectedPlatforms.includes(p.id));
    const limits = selectedPlatformObjects
      .map(p => p.characterLimit)
      .filter(limit => limit !== undefined) as number[];
    
    return limits.length > 0 ? Math.min(...limits) : null;
  };

  const handleImageUpload = () => {
    Alert.alert(
      'Image Upload',
      'Image upload feature coming soon!\n\nYou\'ll be able to upload photos and have them automatically formatted for each platform.',
      [{ text: 'Got it!' }]
    );
  };

  const handleVideoUpload = () => {
    Alert.alert(
      'Video Upload',
      'Video upload feature coming soon!\n\nYou\'ll be able to upload videos and have them automatically optimized for each platform\'s requirements.',
      [{ text: 'Excited!' }]
    );
  };

  const handleScheduleToggle = () => {
    setIsScheduled(!isScheduled);
    if (!isScheduled) {
      // Set default to 1 hour from now
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 1);
      setScheduledDateTime(futureDate);
    }
  };

  const handleDateTimeChange = () => {
    Alert.alert(
      'Date & Time Picker',
      'Advanced scheduling features coming soon!\n\nYou\'ll be able to schedule posts up to 30 days in advance with timezone support.',
      [{ text: 'Looking forward to it!' }]
    );
  };

  const handlePost = () => {
    if (!caption.trim()) {
      Alert.alert('Missing Caption', 'Please enter a caption for your post.');
      return;
    }

    if (selectedPlatforms.length === 0) {
      Alert.alert('No Platforms Selected', 'Please select at least one platform to post to.');
      return;
    }

    const postData: PostData = {
      caption: caption.trim(),
      selectedPlatforms,
      isScheduled,
      scheduledDateTime: isScheduled ? scheduledDateTime : undefined,
      imageUri,
      videoUri,
    };

    console.log('Post Data:', postData);

    const platformNames = selectedPlatforms
      .map(id => platforms.find(p => p.id === id)?.name)
      .filter(Boolean)
      .join(', ');

    Alert.alert(
      'Post Created!',
      `Your post is ready to publish to:\n${platformNames}\n\n${isScheduled ? `Scheduled for: ${scheduledDateTime.toLocaleDateString()} at ${scheduledDateTime.toLocaleTimeString()}` : 'Publishing now!'}\n\nFull multi-platform publishing coming soon!`,
      [
        {
          text: 'Create Another',
          onPress: () => {
            setCaption('');
            setSelectedPlatforms([]);
            setIsScheduled(false);
          }
        },
        { text: 'Done', onPress: () => navigation.goBack() }
      ]
    );
  };

  // Dynamic content based on Faith Mode
  const encouragementMessage = faithMode
    ? "Let your light shine across all platforms! 🔥"
    : "Let your content shine everywhere! 💡";

  const characterLimit = getCharacterLimit();
  const isOverLimit = characterLimit ? caption.length > characterLimit : false;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Multi-Platform Post</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Encouragement Message */}
        <View style={styles.encouragementCard}>
          <Text style={styles.encouragementText}>{encouragementMessage}</Text>
        </View>

        {/* Product Preview Card - only show if product exists */}
        {product && <ProductPreviewCard product={product} />}

        {/* AI Content Generator Button */}
        <View style={styles.aiGeneratorSection}>
          <TouchableOpacity
            style={styles.aiGeneratorButton}
            onPress={() => setShowContentGenerator(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.aiGeneratorIcon}>✨</Text>
            <Text style={styles.aiGeneratorText}>Generate with AI</Text>
            <Text style={styles.aiGeneratorSubtext}>
              {faithMode ? 'Faith-inspired content' : 'Inspiring content'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Post Composer */}
        <View style={styles.composerCard}>
          <Text style={styles.sectionTitle}>🖊️ Compose Your Post</Text>
          
          <TextInput
            style={[
              styles.captionInput,
              isOverLimit && styles.captionInputError
            ]}
            placeholder="What's on your mind? Share your message with the world..."
            placeholderTextColor="#666666"
            multiline
            numberOfLines={6}
            value={caption}
            onChangeText={setCaption}
            maxLength={5000}
          />

          {/* Character Counter */}
          <View style={styles.characterCountContainer}>
            <Text style={[
              styles.characterCount,
              isOverLimit && styles.characterCountError
            ]}>
              {caption.length}{characterLimit ? ` / ${characterLimit}` : ''}
            </Text>
            {characterLimit && isOverLimit && (
              <Text style={styles.limitWarning}>
                Exceeds limit for selected platforms
              </Text>
            )}
          </View>

          {/* Media Upload Buttons */}
          <View style={styles.mediaButtonsContainer}>
            <TouchableOpacity 
              style={styles.mediaButton}
              onPress={handleImageUpload}
              activeOpacity={0.8}
            >
              <Text style={styles.mediaButtonText}>📷 Add Image</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.mediaButton}
              onPress={handleVideoUpload}
              activeOpacity={0.8}
            >
              <Text style={styles.mediaButtonText}>🎬 Add Video</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Platform Selector */}
        <View style={styles.platformCard}>
          <Text style={styles.sectionTitle}>🌐 Select Platforms</Text>
          <Text style={styles.sectionSubtitle}>
            Choose where to publish your content
          </Text>
          
          <View style={styles.platformGrid}>
            {platforms.map((platform) => (
              <TouchableOpacity
                key={platform.id}
                style={[
                  styles.platformItem,
                  selectedPlatforms.includes(platform.id) && styles.platformItemSelected,
                  { borderColor: selectedPlatforms.includes(platform.id) ? platform.color : '#333333' }
                ]}
                onPress={() => togglePlatform(platform.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.platformIcon}>{platform.icon}</Text>
                <Text style={[
                  styles.platformName,
                  selectedPlatforms.includes(platform.id) && styles.platformNameSelected
                ]}>
                  {platform.name}
                </Text>
                {platform.characterLimit && (
                  <Text style={styles.platformLimit}>
                    {platform.characterLimit} chars
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {selectedPlatforms.length > 0 && (
            <View style={styles.selectedPlatformsContainer}>
              <Text style={styles.selectedPlatformsText}>
                Selected: {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''}
              </Text>
            </View>
          )}
        </View>

        {/* Schedule Option */}
        <View style={styles.scheduleCard}>
          <Text style={styles.sectionTitle}>⏰ Posting Schedule</Text>
          
          <View style={styles.scheduleToggleContainer}>
            <View style={styles.scheduleToggleContent}>
              <Text style={styles.scheduleToggleLabel}>
                {isScheduled ? 'Schedule for Later' : 'Post Now'}
              </Text>
              <Text style={styles.scheduleToggleDescription}>
                {isScheduled ? 'Choose when to publish' : 'Publish immediately'}
              </Text>
            </View>
            <Switch
              value={isScheduled}
              onValueChange={handleScheduleToggle}
              trackColor={{ false: '#333333', true: '#3b82f6' }}
              thumbColor={isScheduled ? '#ffffff' : '#cccccc'}
            />
          </View>

          {isScheduled && (
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={handleDateTimeChange}
              activeOpacity={0.8}
            >
              <Text style={styles.dateTimeButtonText}>
                📅 {scheduledDateTime.toLocaleDateString()} at {scheduledDateTime.toLocaleTimeString()}
              </Text>
              <Text style={styles.dateTimeButtonSubtext}>Tap to change</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Submit Button */}
        <View style={styles.submitContainer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              (caption.trim() === '' || selectedPlatforms.length === 0 || isOverLimit) && styles.submitButtonDisabled
            ]}
            onPress={handlePost}
            activeOpacity={0.8}
            disabled={caption.trim() === '' || selectedPlatforms.length === 0 || isOverLimit}
          >
            <Text style={styles.submitButtonText}>
              {isScheduled ? '📅 Schedule Post' : '🚀 Post Now'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* AI Content Generator Modal */}
      <ContentGeneratorModal
        visible={showContentGenerator}
        onClose={() => setShowContentGenerator(false)}
        product={product || null}
        onSelectContent={handleSelectGeneratedContent}
      />
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  encouragementCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333333',
    alignItems: 'center',
  },
  encouragementText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
  },
  composerCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 15,
  },
  captionInput: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 15,
    color: '#ffffff',
    fontSize: 16,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#333333',
    minHeight: 120,
  },
  captionInputError: {
    borderColor: '#dc2626',
  },
  characterCountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  characterCount: {
    fontSize: 12,
    color: '#cccccc',
  },
  characterCountError: {
    color: '#dc2626',
  },
  limitWarning: {
    fontSize: 12,
    color: '#dc2626',
    fontWeight: '500',
  },
  mediaButtonsContainer: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 10,
  },
  mediaButton: {
    flex: 1,
    backgroundColor: '#333333',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444444',
  },
  mediaButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  platformCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  platformGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  platformItem: {
    width: '48%',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    borderWidth: 2,
    marginBottom: 10,
  },
  platformItemSelected: {
    backgroundColor: '#1a2a3a',
  },
  platformIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  platformName: {
    fontSize: 12,
    color: '#cccccc',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  platformNameSelected: {
    color: '#ffffff',
  },
  platformLimit: {
    fontSize: 10,
    color: '#888888',
    textAlign: 'center',
  },
  selectedPlatformsContainer: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#0f2a0f',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#22c55e',
  },
  selectedPlatformsText: {
    color: '#22c55e',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  scheduleCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  scheduleToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scheduleToggleContent: {
    flex: 1,
  },
  scheduleToggleLabel: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 4,
  },
  scheduleToggleDescription: {
    fontSize: 14,
    color: '#cccccc',
  },
  dateTimeButton: {
    marginTop: 15,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#444444',
  },
  dateTimeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  dateTimeButtonSubtext: {
    color: '#cccccc',
    fontSize: 12,
  },
  submitContainer: {
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#333333',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomSpacer: {
    height: 40,
  },
  // Product Preview Card Styles
  productPreviewCard: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#374151',
  },
  productPreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  productPreviewTitle: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '500',
  },
  editProductButton: {
    backgroundColor: '#f97316',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editProductButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  productPreviewContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  productPreviewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#374151',
    marginRight: 12,
  },
  productPreviewInfo: {
    flex: 1,
  },
  productPreviewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  productPreviewName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
    marginRight: 8,
  },
  productPlatformBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  productPlatformIcon: {
    fontSize: 12,
  },
  productPlatformText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },
  productPreviewPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#22c55e',
    marginBottom: 8,
  },
  productPreviewTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  productTag: {
    backgroundColor: '#374151',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  productTagText: {
    fontSize: 10,
    color: '#f97316',
    fontWeight: '500',
  },
  // AI Generator Styles
  aiGeneratorSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  aiGeneratorButton: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f97316',
    borderStyle: 'dashed',
  },
  aiGeneratorIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  aiGeneratorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  aiGeneratorSubtext: {
    fontSize: 14,
    color: '#f97316',
    fontWeight: '500',
  },
});

export default MultiPlatformPostScreen;

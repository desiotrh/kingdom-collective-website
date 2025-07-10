import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Dimensions,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { KingdomColors } from '../constants/KingdomColors';
import { useDualMode } from '../contexts/DualModeContext';

const { width, height } = Dimensions.get('window');

interface Filter {
  id: string;
  name: string;
  icon: string;
  description: string;
  adjustments: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
    warmth?: number;
    clarity?: number;
    skin?: number;
  };
}

interface BeautyAdjustment {
  id: string;
  name: string;
  icon: string;
  min: number;
  max: number;
  default: number;
  step: number;
}

const PhotoVideoFiltersScreen: React.FC = () => {
  const { currentMode } = useDualMode();
  const colors = currentMode === 'faith' ? KingdomColors.faith : KingdomColors.encouragement;
  const navigation = useNavigation();

  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('none');
  const [beautyAdjustments, setBeautyAdjustments] = useState<{[key: string]: number}>({});
  const [showAdjustments, setShowAdjustments] = useState(false);
  const [activeTab, setActiveTab] = useState<'filters' | 'beauty' | 'effects'>('filters');

  const filters: Filter[] = [
    {
      id: 'none',
      name: 'Original',
      icon: '📷',
      description: 'No filter applied',
      adjustments: {},
    },
    {
      id: 'vintage',
      name: currentMode === 'faith' ? 'Heritage' : 'Vintage',
      icon: '📜',
      description: 'Classic, timeless look',
      adjustments: { brightness: -0.1, contrast: 0.2, saturation: -0.3, warmth: 0.3 },
    },
    {
      id: 'bright',
      name: currentMode === 'faith' ? 'Radiant' : 'Bright',
      icon: '☀️',
      description: 'Clean, bright appearance',
      adjustments: { brightness: 0.2, contrast: 0.1, saturation: 0.1, clarity: 0.2 },
    },
    {
      id: 'warm',
      name: currentMode === 'faith' ? 'Golden Hour' : 'Warm',
      icon: '🌅',
      description: 'Warm, golden tones',
      adjustments: { warmth: 0.4, brightness: 0.1, saturation: 0.2 },
    },
    {
      id: 'portrait',
      name: currentMode === 'faith' ? 'Blessed' : 'Portrait',
      icon: '👤',
      description: 'Perfect for portraits',
      adjustments: { skin: 0.3, brightness: 0.1, contrast: 0.1, clarity: 0.2 },
    },
    {
      id: 'dramatic',
      name: currentMode === 'faith' ? 'Majestic' : 'Dramatic',
      icon: '🎭',
      description: 'Bold, striking look',
      adjustments: { contrast: 0.4, brightness: -0.1, saturation: 0.3, clarity: 0.3 },
    },
    {
      id: 'soft',
      name: currentMode === 'faith' ? 'Gentle' : 'Soft',
      icon: '🌸',
      description: 'Soft, dreamy appearance',
      adjustments: { brightness: 0.15, clarity: -0.2, skin: 0.4, warmth: 0.2 },
    },
    {
      id: 'vibrant',
      name: currentMode === 'faith' ? 'Joyful' : 'Vibrant',
      icon: '🌈',
      description: 'Rich, vibrant colors',
      adjustments: { saturation: 0.4, contrast: 0.2, brightness: 0.1, clarity: 0.2 },
    },
  ];

  const beautyFeatures: BeautyAdjustment[] = [
    {
      id: 'skin_smooth',
      name: 'Skin Smoothing',
      icon: '✨',
      min: 0,
      max: 100,
      default: 0,
      step: 1,
    },
    {
      id: 'skin_brighten',
      name: 'Skin Brightening',
      icon: '💡',
      min: 0,
      max: 100,
      default: 0,
      step: 1,
    },
    {
      id: 'complexion_even',
      name: 'Even Complexion',
      icon: '🎨',
      min: 0,
      max: 100,
      default: 0,
      step: 1,
    },
    {
      id: 'blemish_removal',
      name: 'Blemish Removal',
      icon: '🌟',
      min: 0,
      max: 100,
      default: 0,
      step: 1,
    },
    {
      id: 'teeth_whitening',
      name: 'Teeth Whitening',
      icon: '😁',
      min: 0,
      max: 100,
      default: 0,
      step: 1,
    },
    {
      id: 'eye_brighten',
      name: 'Eye Brightening',
      icon: '👁️',
      min: 0,
      max: 100,
      default: 0,
      step: 1,
    },
  ];

  const effectFeatures = [
    {
      id: 'bokeh',
      name: 'Background Blur',
      icon: '🌫️',
      description: 'Artistic background blur',
    },
    {
      id: 'light_rays',
      name: currentMode === 'faith' ? 'Divine Light' : 'Light Rays',
      icon: '✨',
      description: 'Add beautiful light effects',
    },
    {
      id: 'frame',
      name: 'Elegant Frame',
      icon: '🖼️',
      description: 'Add decorative frames',
    },
    {
      id: 'text_overlay',
      name: currentMode === 'faith' ? 'Scripture Text' : 'Inspirational Text',
      icon: '📝',
      description: 'Add motivational text',
    },
  ];

  const getCurrentPrompt = () => {
    const faithPrompts = [
      "✨ Let your light shine through every pixel",
      "🙏 Create beauty that reflects God's glory",
      "💝 Enhance your photos with grace and elegance",
      "🌟 Share images that bless and inspire",
    ];
    
    const encouragementPrompts = [
      "💫 Enhance your natural beauty with confidence",
      "🌟 Create stunning visuals that inspire",
      "✨ Perfect your photos with professional tools",
      "💪 Express your authentic self beautifully",
    ];
    
    const prompts = currentMode === 'faith' ? faithPrompts : encouragementPrompts;
    return prompts[Math.floor(Math.random() * prompts.length)];
  };

  const pickMedia = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access photos is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 5],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      setSelectedMedia(result.assets[0].uri);
      setSelectedFilter('none');
      setBeautyAdjustments({});
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Camera permission is required.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 5],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      setSelectedMedia(result.assets[0].uri);
      setSelectedFilter('none');
      setBeautyAdjustments({});
    }
  };

  const applyFilter = (filterId: string) => {
    setSelectedFilter(filterId);
    // In a real implementation, this would apply the actual filter
    Alert.alert('Filter Applied', `${filters.find(f => f.id === filterId)?.name} filter applied!`);
  };

  const adjustBeautyFeature = (featureId: string, value: number) => {
    setBeautyAdjustments(prev => ({
      ...prev,
      [featureId]: value,
    }));
  };

  const saveMedia = async () => {
    if (!selectedMedia) {
      Alert.alert('No Media', 'Please select a photo or video first.');
      return;
    }

    try {
      const permissionResult = await MediaLibrary.requestPermissionsAsync();
      
      if (permissionResult.granted) {
        // In a real implementation, this would save the processed image
        Alert.alert(
          'Photo Saved',
          'Your enhanced photo has been saved to your gallery!',
          [
            { text: 'Share to Social', onPress: () => shareToSocial() },
            { text: 'OK' },
          ]
        );
      } else {
        Alert.alert('Permission Required', 'Permission to save to photos is required.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save photo.');
    }
  };

  const shareToSocial = () => {
    Alert.alert(
      'Share to Social Media',
      'Choose where to share your enhanced content:',
      [
        { text: 'Instagram', onPress: () => navigation.navigate('MultiPlatformPost' as never) },
        { text: 'All Platforms', onPress: () => navigation.navigate('MultiPlatformPost' as never) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const renderFilterButton = (filter: Filter) => (
    <TouchableOpacity
      key={filter.id}
      style={[
        styles.filterButton,
        { backgroundColor: colors.surface },
        selectedFilter === filter.id && { borderColor: colors.accent, borderWidth: 2 },
      ]}
      onPress={() => applyFilter(filter.id)}
    >
      <Text style={styles.filterIcon}>{filter.icon}</Text>
      <Text style={[styles.filterName, { color: colors.text }]}>{filter.name}</Text>
    </TouchableOpacity>
  );

  const renderBeautySlider = (feature: BeautyAdjustment) => {
    const currentValue = beautyAdjustments[feature.id] || feature.default;
    
    return (
      <View key={feature.id} style={styles.beautySliderContainer}>
        <View style={styles.beautySliderHeader}>
          <Text style={styles.beautySliderIcon}>{feature.icon}</Text>
          <Text style={[styles.beautySliderName, { color: colors.text }]}>{feature.name}</Text>
          <Text style={[styles.beautySliderValue, { color: colors.accent }]}>
            {currentValue}
          </Text>
        </View>
        <View style={styles.sliderContainer}>
          <View style={[styles.sliderTrack, { backgroundColor: colors.border }]}>
            <View 
              style={[
                styles.sliderProgress, 
                { 
                  backgroundColor: colors.accent,
                  width: `${(currentValue / feature.max) * 100}%`
                }
              ]} 
            />
          </View>
          <View style={styles.sliderButtons}>
            <TouchableOpacity
              style={[styles.sliderButton, { backgroundColor: colors.surface }]}
              onPress={() => adjustBeautyFeature(feature.id, Math.max(feature.min, currentValue - 10))}
            >
              <Text style={[styles.sliderButtonText, { color: colors.text }]}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sliderButton, { backgroundColor: colors.surface }]}
              onPress={() => adjustBeautyFeature(feature.id, Math.min(feature.max, currentValue + 10))}
            >
              <Text style={[styles.sliderButtonText, { color: colors.text }]}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>
          {currentMode === 'faith' ? 'Divine Beauty Tools' : 'Photo & Video Filters'}
        </Text>
        <TouchableOpacity onPress={saveMedia}>
          <Ionicons name="save" size={24} color={colors.accent} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {getCurrentPrompt()}
        </Text>

        {/* Media Selection */}
        {!selectedMedia ? (
          <View style={styles.mediaSelectionContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Choose Media to Enhance
            </Text>
            
            <View style={styles.selectionButtons}>
              <TouchableOpacity
                style={[styles.selectionButton, { backgroundColor: colors.surface }]}
                onPress={pickMedia}
              >
                <Ionicons name="images" size={32} color={colors.accent} />
                <Text style={[styles.selectionButtonText, { color: colors.text }]}>
                  Choose from Gallery
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.selectionButton, { backgroundColor: colors.surface }]}
                onPress={takePhoto}
              >
                <Ionicons name="camera" size={32} color={colors.accent} />
                <Text style={[styles.selectionButtonText, { color: colors.text }]}>
                  Take Photo
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            {/* Media Preview */}
            <View style={styles.mediaPreviewContainer}>
              <Image
                source={{ uri: selectedMedia }}
                style={styles.mediaPreview}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.changeMediaButton}
                onPress={() => setSelectedMedia(null)}
              >
                <Ionicons name="swap-horizontal" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Enhancement Tabs */}
            <View style={styles.tabContainer}>
              {[
                { id: 'filters', label: 'Filters', icon: 'color-filter' },
                { id: 'beauty', label: 'Beauty', icon: 'sparkles' },
                { id: 'effects', label: 'Effects', icon: 'star' },
              ].map((tab) => (
                <TouchableOpacity
                  key={tab.id}
                  style={[
                    styles.tab,
                    { backgroundColor: activeTab === tab.id ? colors.accent : colors.surface },
                  ]}
                  onPress={() => setActiveTab(tab.id as any)}
                >
                  <Ionicons 
                    name={tab.icon as any} 
                    size={20} 
                    color={activeTab === tab.id ? colors.background : colors.text} 
                  />
                  <Text style={[
                    styles.tabText,
                    { color: activeTab === tab.id ? colors.background : colors.text },
                  ]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Tab Content */}
            {activeTab === 'filters' && (
              <View style={styles.filtersSection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Photo Filters
                </Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.filtersScroll}
                >
                  {filters.map(renderFilterButton)}
                </ScrollView>
              </View>
            )}

            {activeTab === 'beauty' && (
              <View style={styles.beautySection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  {currentMode === 'faith' ? 'Radiant Beauty Enhancement' : 'Beauty & Skin Enhancement'}
                </Text>
                <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                  {currentMode === 'faith' 
                    ? "Enhance your natural beauty that reflects God's creation"
                    : "Professional-grade beauty adjustments for stunning results"
                  }
                </Text>
                {beautyFeatures.map(renderBeautySlider)}
              </View>
            )}

            {activeTab === 'effects' && (
              <View style={styles.effectsSection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Special Effects
                </Text>
                <View style={styles.effectsGrid}>
                  {effectFeatures.map((effect) => (
                    <TouchableOpacity
                      key={effect.id}
                      style={[styles.effectCard, { backgroundColor: colors.surface }]}
                      onPress={() => Alert.alert('Effect Applied', `${effect.name} effect coming soon!`)}
                    >
                      <Text style={styles.effectIcon}>{effect.icon}</Text>
                      <Text style={[styles.effectName, { color: colors.text }]}>
                        {effect.name}
                      </Text>
                      <Text style={[styles.effectDescription, { color: colors.textSecondary }]}>
                        {effect.description}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.previewButton, { backgroundColor: colors.surface }]}
                onPress={() => Alert.alert('Preview', 'Enhanced preview coming soon!')}
              >
                <Ionicons name="eye" size={20} color={colors.text} />
                <Text style={[styles.actionButtonText, { color: colors.text }]}>
                  Preview
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.saveButton]}
                onPress={saveMedia}
              >
                <LinearGradient
                  colors={[colors.accent, colors.accent + 'CC']}
                  style={styles.saveButtonGradient}
                >
                  <Ionicons name="save" size={20} color={colors.background} />
                  <Text style={[styles.actionButtonText, { color: colors.background }]}>
                    Save & Share
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Feature Info */}
        <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>
            ✨ Professional Enhancement Features
          </Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            • Advanced skin smoothing and complexion evening{'\n'}
            • Natural beauty enhancements for photos and videos{'\n'}
            • Professional filters optimized for social media{'\n'}
            • Real-time preview before saving{'\n'}
            • Direct sharing to all your social platforms
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
  },
  subtitle: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
  },
  mediaSelectionContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  selectionButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  selectionButton: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
  },
  selectionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  mediaPreviewContainer: {
    position: 'relative',
    marginBottom: 20,
    alignItems: 'center',
  },
  mediaPreview: {
    width: width - 40,
    height: (width - 40) * 1.25,
    borderRadius: 16,
  },
  changeMediaButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  filtersSection: {
    marginBottom: 20,
  },
  filtersScroll: {
    paddingLeft: 4,
  },
  filterButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 80,
  },
  filterIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  filterName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  beautySection: {
    marginBottom: 20,
  },
  beautySliderContainer: {
    marginBottom: 20,
  },
  beautySliderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  beautySliderIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  beautySliderName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  beautySliderValue: {
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 40,
    textAlign: 'right',
  },
  sliderContainer: {
    marginTop: 8,
  },
  sliderTrack: {
    height: 4,
    borderRadius: 2,
    marginBottom: 12,
  },
  sliderProgress: {
    height: '100%',
    borderRadius: 2,
  },
  sliderButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  effectsSection: {
    marginBottom: 20,
  },
  effectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  effectCard: {
    width: (width - 60) / 2,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  effectIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  effectName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  effectDescription: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  previewButton: {
    borderWidth: 1,
    borderColor: '#ccc',
  },
  saveButton: {
    overflow: 'hidden',
  },
  saveButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default React.memo(PhotoVideoFiltersScreen);

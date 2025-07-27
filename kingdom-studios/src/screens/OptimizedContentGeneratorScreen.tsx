import React, { useState, useCallback, useMemo, memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  TextInput,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFaithMode } from '../contexts/FaithModeContext';
import { useAuth } from '../contexts/AuthContext';
import { KingdomColors } from '../constants/KingdomColors';
import { KingdomShadows } from '../constants/KingdomShadows';
import { useDebounce, usePerformanceMonitor } from '../hooks/usePerformance';
import OptimizedBackendAPI from '../services/OptimizedBackendAPI';

// Memoized components for performance
const ContentCard = memo<{ item: any; onPress: () => void }>(({ item, onPress }) => (
  <TouchableOpacity style={styles.contentCard} onPress={onPress}>
    <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardType}>{item.type}</Text>
    </View>
  </TouchableOpacity>
));

const TemplateCard = memo<{ template: any; onSelect: (template: any) => void }>(
  ({ template, onSelect }) => (
    <TouchableOpacity
      style={styles.templateCard}
      onPress={() => onSelect(template)}
    >
      <Text style={styles.templateTitle}>{template.title}</Text>
      <Text style={styles.templateDescription}>{template.description}</Text>
    </TouchableOpacity>
  )
);

interface OptimizedContentGeneratorScreenProps {
  navigation: any;
}

const OptimizedContentGeneratorScreen: React.FC<OptimizedContentGeneratorScreenProps> = ({
  navigation,
}) => {
  const { faithMode } = useFaithMode();
  const { user } = useAuth();
  const { markStart, markEnd } = usePerformanceMonitor('ContentGenerator');

  // Responsive design
  const { width, height } = Dimensions.get('window');
  const isTablet = width > 768;
  const isLandscape = width > height;

  // State management
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [selectedTone, setSelectedTone] = useState('professional');

  // Debounced content generation to prevent API spam
  const debouncedGenerateContent = useDebounce(
    useCallback(async (contentPrompt: string) => {
      if (!contentPrompt.trim()) {
        Alert.alert('Error', 'Please enter a prompt for content generation');
        return;
      }

      const startMark = markStart('generateContent');
      setIsGenerating(true);

      try {
        const request = {
          prompt: contentPrompt,
          platform: selectedPlatform,
          tone: selectedTone,
          contentType: 'post',
          faithMode,
          userId: user?.id,
        };

        const response = await OptimizedBackendAPI.generateContent(request);
        setGeneratedContent(response);

        markEnd('generateContent', startMark);
      } catch (error) {
        console.error('Content generation error:', error);
        Alert.alert(
          'Generation Failed',
          error instanceof Error ? error.message : 'Failed to generate content'
        );
      } finally {
        setIsGenerating(false);
      }
    }, [selectedPlatform, selectedTone, faithMode, user?.id, markStart, markEnd]),
    500 // 500ms debounce
  );

  // Memoized platform options
  const platformOptions = useMemo(() => [
    { id: 'instagram', name: 'Instagram', icon: '📸' },
    { id: 'facebook', name: 'Facebook', icon: '👥' },
    { id: 'twitter', name: 'Twitter', icon: '🐦' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵' },
  ], []);

  // Memoized tone options
  const toneOptions = useMemo(() => [
    { id: 'professional', name: 'Professional' },
    { id: 'casual', name: 'Casual' },
    { id: 'inspirational', name: 'Inspirational' },
    { id: 'educational', name: 'Educational' },
    { id: 'promotional', name: 'Promotional' },
  ], []);

  // Handle platform selection
  const handlePlatformSelect = useCallback((platform: string) => {
    setSelectedPlatform(platform);
  }, []);

  // Handle tone selection
  const handleToneSelect = useCallback((tone: string) => {
    setSelectedTone(tone);
  }, []);

  // Handle generate button press
  const handleGenerate = useCallback(() => {
    debouncedGenerateContent(prompt);
  }, [prompt, debouncedGenerateContent]);

  // Render platform option
  const renderPlatformOption = useCallback(({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.platformOption,
        selectedPlatform === item.id && styles.selectedPlatformOption,
      ]}
      onPress={() => handlePlatformSelect(item.id)}
    >
      <Text style={styles.platformIcon}>{item.icon}</Text>
      <Text style={[
        styles.platformName,
        selectedPlatform === item.id && styles.selectedPlatformName,
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  ), [selectedPlatform, handlePlatformSelect]);

  // Render tone option
  const renderToneOption = useCallback(({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.toneOption,
        selectedTone === item.id && styles.selectedToneOption,
      ]}
      onPress={() => handleToneSelect(item.id)}
    >
      <Text style={[
        styles.toneName,
        selectedTone === item.id && styles.selectedToneName,
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  ), [selectedTone, handleToneSelect]);

  return (
    <LinearGradient
      colors={[KingdomColors.dark.background, KingdomColors.dark.surface]}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>
          {faithMode ? '✨ Faith-Inspired Content' : '🚀 Content Generator'}
        </Text>
        <Text style={styles.subtitle}>
          Create engaging content with AI assistance
        </Text>
      </View>

      <View style={styles.content}>
        {/* Platform Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Platform</Text>
          <FlatList
            data={platformOptions}
            renderItem={renderPlatformOption}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.platformList}
            getItemLayout={(data, index) => ({
              length: 100,
              offset: 100 * index,
              index,
            })}
          />
        </View>

        {/* Tone Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content Tone</Text>
          <FlatList
            data={toneOptions}
            renderItem={renderToneOption}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.toneList}
            getItemLayout={(data, index) => ({
              length: 120,
              offset: 120 * index,
              index,
            })}
          />
        </View>

        {/* Prompt Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content Prompt</Text>
          <TextInput
            style={styles.promptInput}
            value={prompt}
            onChangeText={setPrompt}
            placeholder={
              faithMode
                ? "Describe your faith-inspired content idea..."
                : "Describe your content idea..."
            }
            placeholderTextColor={KingdomColors.dark.textSecondary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Generate Button */}
        <TouchableOpacity
          style={[styles.generateButton, isGenerating && styles.generatingButton]}
          onPress={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
        >
          {isGenerating ? (
            <ActivityIndicator color={KingdomColors.dark.background} />
          ) : (
            <Text style={styles.generateButtonText}>Generate Content</Text>
          )}
        </TouchableOpacity>

        {/* Generated Content Display */}
        {generatedContent && (
          <View style={styles.generatedContentContainer}>
            <Text style={styles.generatedContentTitle}>Generated Content</Text>
            <View style={styles.generatedContent}>
              <Text style={styles.generatedText}>{generatedContent.content}</Text>
            </View>
          </View>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.gold,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: KingdomColors.dark.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: KingdomColors.dark.text,
    marginBottom: 12,
  },
  platformList: {
    height: 80,
  },
  platformOption: {
    backgroundColor: KingdomColors.dark.surface,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    width: 100,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPlatformOption: {
    borderColor: KingdomColors.gold,
    backgroundColor: KingdomColors.goldTransparent,
  },
  platformIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  platformName: {
    fontSize: 12,
    color: KingdomColors.dark.text,
    textAlign: 'center',
  },
  selectedPlatformName: {
    color: KingdomColors.gold,
    fontWeight: '600',
  },
  toneList: {
    height: 50,
  },
  toneOption: {
    backgroundColor: KingdomColors.dark.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedToneOption: {
    borderColor: KingdomColors.gold,
    backgroundColor: KingdomColors.goldTransparent,
  },
  toneName: {
    fontSize: 14,
    color: KingdomColors.dark.text,
  },
  selectedToneName: {
    color: KingdomColors.gold,
    fontWeight: '600',
  },
  promptInput: {
    backgroundColor: KingdomColors.dark.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: KingdomColors.dark.text,
    borderWidth: 1,
    borderColor: KingdomColors.dark.border,
    minHeight: 100,
  },
  generateButton: {
    backgroundColor: KingdomColors.gold,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    ...KingdomShadows.medium,
  },
  generatingButton: {
    backgroundColor: KingdomColors.goldTransparent,
  },
  generateButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: KingdomColors.dark.background,
  },
  generatedContentContainer: {
    marginTop: 24,
    backgroundColor: KingdomColors.dark.surface,
    borderRadius: 12,
    padding: 16,
  },
  generatedContentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: KingdomColors.gold,
    marginBottom: 12,
  },
  generatedContent: {
    backgroundColor: KingdomColors.dark.background,
    borderRadius: 8,
    padding: 16,
  },
  generatedText: {
    fontSize: 16,
    color: KingdomColors.dark.text,
    lineHeight: 24,
  },
  contentCard: {
    flexDirection: 'row',
    backgroundColor: KingdomColors.dark.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.dark.text,
  },
  cardType: {
    fontSize: 14,
    color: KingdomColors.dark.textSecondary,
    marginTop: 4,
  },
  templateCard: {
    backgroundColor: KingdomColors.dark.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  templateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.dark.text,
    marginBottom: 8,
  },
  templateDescription: {
    fontSize: 14,
    color: KingdomColors.dark.textSecondary,
  },
});

export default memo(OptimizedContentGeneratorScreen);

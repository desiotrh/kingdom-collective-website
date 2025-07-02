/**
 * Kingdom Studios Testimony Submission Screen
 * Submit and share personal testimonies with the community
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { useFaithMode } from '../contexts/FaithModeContext';
import { KingdomColors, KingdomShadows } from '../constants/KingdomColors';
import KingdomLogo from '../components/KingdomLogo';
import { TESTIMONY_CATEGORIES, TestimonyCategory } from '../types/spiritual';

const { width, height } = Dimensions.get('window');

const TestimonySubmissionScreen = () => {
  const navigation = useNavigation();
  const { faithMode } = useFaithMode();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    selectedCategory: '',
    type: 'written' as 'written' | 'video' | 'audio',
    isPublic: true,
    tags: [] as string[],
    scheduleAsPost: false,
    scheduledDate: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const suggestedTags = [
    'breakthrough', 'miracle', 'answered-prayer', 'god-is-good', 'testimony', 
    'faith', 'deliverance', 'healing', 'provision', 'restoration',
    'identity', 'calling', 'business', 'family', 'victory'
  ];

  const handleCategorySelect = (categoryId: string) => {
    setFormData(prev => ({ ...prev, selectedCategory: categoryId }));
  };

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return formData.title.trim() && formData.selectedCategory;
      case 2:
        return formData.content.trim().length >= 50;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim() || !formData.selectedCategory) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        '🙏 Testimony Submitted!',
        'Thank you for sharing your testimony! It will be reviewed and posted to the community soon. Your story will encourage others!',
        [
          {
            text: 'Share Another',
            onPress: () => {
              setFormData({
                title: '',
                content: '',
                selectedCategory: '',
                type: 'written',
                isPublic: true,
                tags: [],
                scheduleAsPost: false,
                scheduledDate: '',
              });
              setCurrentStep(1);
            }
          },
          {
            text: 'View Community',
            onPress: () => navigation.navigate('TestimonyWall'),
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit testimony. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = TESTIMONY_CATEGORIES.find(cat => cat.id === formData.selectedCategory);

  const renderStep1 = () => (
    <>
      <BlurView intensity={20} style={styles.sectionCard}>
        <LinearGradient colors={KingdomColors.gradients.cardBackground as any} style={styles.sectionContent}>
          <Text style={styles.sectionTitle}>Your Testimony Title</Text>
          <Text style={styles.sectionDescription}>
            Give your testimony a powerful title that captures God's goodness
          </Text>
          
          <TextInput
            style={styles.titleInput}
            placeholder="God delivered me from..."
            placeholderTextColor={KingdomColors.gray}
            value={formData.title}
            onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
            maxLength={100}
          />
          <Text style={styles.characterCount}>{formData.title.length}/100</Text>
        </LinearGradient>
      </BlurView>

      <BlurView intensity={20} style={styles.sectionCard}>
        <LinearGradient colors={KingdomColors.gradients.cardBackground as any} style={styles.sectionContent}>
          <Text style={styles.sectionTitle}>Category</Text>
          <Text style={styles.sectionDescription}>
            Choose the category that best describes your testimony
          </Text>
          
          <View style={styles.categoriesGrid}>
            {TESTIMONY_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryOption,
                  formData.selectedCategory === category.id && styles.categorySelected
                ]}
                onPress={() => handleCategorySelect(category.id)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={[
                  styles.categoryName,
                  formData.selectedCategory === category.id && styles.categoryNameSelected
                ]}>
                  {category.name}
                </Text>
                <Text style={styles.categoryDescription}>{category.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </LinearGradient>
      </BlurView>
    </>
  );

  const renderStep2 = () => (
    <BlurView intensity={20} style={styles.sectionCard}>
      <LinearGradient colors={KingdomColors.gradients.cardBackground as any} style={styles.sectionContent}>
        <Text style={styles.sectionTitle}>Share Your Story</Text>
        <Text style={styles.sectionDescription}>
          Tell your story in detail. How did God move? What changed? How can others be encouraged?
        </Text>
        
        <TextInput
          style={styles.contentInput}
          placeholder="I want to share how God..."
          placeholderTextColor={KingdomColors.gray}
          value={formData.content}
          onChangeText={(text) => setFormData(prev => ({ ...prev, content: text }))}
          multiline
          textAlignVertical="top"
          maxLength={2000}
        />
        <Text style={styles.characterCount}>{formData.content.length}/2000</Text>

        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>💡</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Testimony Tips</Text>
            <Text style={styles.tipText}>
              • Include specific details about God's goodness{'\n'}
              • Share the before and after{'\n'}
              • Give glory to God throughout{'\n'}
              • Be authentic and vulnerable
            </Text>
          </View>
        </View>
      </LinearGradient>
    </BlurView>
  );

  const renderStep3 = () => (
    <>
      <BlurView intensity={20} style={styles.sectionCard}>
        <LinearGradient colors={KingdomColors.gradients.cardBackground as any} style={styles.sectionContent}>
          <Text style={styles.sectionTitle}>Tags & Sharing</Text>
          <Text style={styles.sectionDescription}>
            Add tags to help others find your testimony
          </Text>
          
          <View style={styles.tagsContainer}>
            {suggestedTags.map((tag, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.tag,
                  formData.tags.includes(tag) && styles.tagSelected
                ]}
                onPress={() => toggleTag(tag)}
              >
                <Text style={[
                  styles.tagText,
                  formData.tags.includes(tag) && styles.tagTextSelected
                ]}>
                  #{tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </LinearGradient>
      </BlurView>

      <BlurView intensity={20} style={styles.sectionCard}>
        <LinearGradient colors={KingdomColors.gradients.cardBackground as any} style={styles.sectionContent}>
          <Text style={styles.sectionTitle}>Privacy & Sharing</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Make Public</Text>
              <Text style={styles.settingDescription}>
                Allow others in the community to see and be encouraged by your testimony
              </Text>
            </View>
            <Switch
              value={formData.isPublic}
              onValueChange={(value) => setFormData(prev => ({ ...prev, isPublic: value }))}
              trackColor={{ false: KingdomColors.darkGray, true: KingdomColors.gold.bright }}
              thumbColor={formData.isPublic ? KingdomColors.white : KingdomColors.gray}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Schedule as Social Post</Text>
              <Text style={styles.settingDescription}>
                Turn this testimony into a social media post with AI-enhanced captions
              </Text>
            </View>
            <Switch
              value={formData.scheduleAsPost}
              onValueChange={(value) => setFormData(prev => ({ ...prev, scheduleAsPost: value }))}
              trackColor={{ false: KingdomColors.darkGray, true: KingdomColors.gold.bright }}
              thumbColor={formData.scheduleAsPost ? KingdomColors.white : KingdomColors.gray}
            />
          </View>
        </LinearGradient>
      </BlurView>

      {selectedCategory && (
        <BlurView intensity={20} style={styles.summaryCard}>
          <LinearGradient colors={[selectedCategory.color + '20', selectedCategory.color + '10']} style={styles.summaryContent}>
            <Text style={styles.summaryIcon}>{selectedCategory.icon}</Text>
            <Text style={styles.summaryTitle}>{formData.title}</Text>
            <Text style={styles.summaryCategory}>{selectedCategory.name}</Text>
            <Text style={styles.summaryPreview}>
              {formData.content.substring(0, 150)}
              {formData.content.length > 150 ? '...' : ''}
            </Text>
          </LinearGradient>
        </BlurView>
      )}
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={KingdomColors.gradients.royalGold as any}
        style={styles.background}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <KingdomLogo size="small" />
          <View style={styles.headerSpacer} />
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(currentStep / totalSteps) * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>Step {currentStep} of {totalSteps}</Text>
        </View>

        <KeyboardAvoidingView 
          style={styles.flex} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Title */}
            <BlurView intensity={20} style={styles.titleCard}>
              <LinearGradient colors={KingdomColors.gradients.cardBackground as any} style={styles.titleContent}>
                <Text style={styles.title}>Share Your Testimony</Text>
                <Text style={styles.subtitle}>
                  Your story of God's goodness can encourage and inspire others in their faith journey
                </Text>
              </LinearGradient>
            </BlurView>

            {/* Step Content */}
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            {/* Navigation Buttons */}
            <View style={styles.navigationContainer}>
              {currentStep > 1 && (
                <TouchableOpacity 
                  style={styles.backNavButton}
                  onPress={() => setCurrentStep(currentStep - 1)}
                >
                  <Text style={styles.backNavText}>← Previous</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                style={[
                  styles.nextButton,
                  !canProceedToNext() && styles.nextButtonDisabled
                ]}
                onPress={handleNext}
                disabled={!canProceedToNext() || loading}
              >
                <LinearGradient
                  colors={canProceedToNext() 
                    ? KingdomColors.gradients.primary as any
                    : [KingdomColors.gray, KingdomColors.darkGray]
                  }
                  style={styles.nextButtonGradient}
                >
                  <Text style={styles.nextButtonText}>
                    {loading 
                      ? 'Submitting...'
                      : currentStep === totalSteps 
                        ? '🙏 Share Testimony'
                        : 'Next →'
                    }
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={styles.bottomSpacer} />
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: KingdomColors.black,
  },
  background: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: {
    padding: 10,
  },
  backIcon: {
    fontSize: 24,
    color: KingdomColors.white,
    fontWeight: 'bold',
  },
  headerSpacer: {
    width: 44,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: KingdomColors.darkGray,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: KingdomColors.gold.bright,
  },
  progressText: {
    color: KingdomColors.lightGray,
    fontSize: 14,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleCard: {
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    ...KingdomShadows.large,
  },
  titleContent: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.white,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: KingdomColors.lightGray,
    textAlign: 'center',
    lineHeight: 22,
  },
  sectionCard: {
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    ...KingdomShadows.medium,
  },
  sectionContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.white,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: KingdomColors.lightGray,
    marginBottom: 16,
    lineHeight: 20,
  },
  titleInput: {
    backgroundColor: KingdomColors.darkGray,
    borderRadius: 12,
    padding: 16,
    color: KingdomColors.white,
    fontSize: 16,
    borderWidth: 2,
    borderColor: KingdomColors.purple,
    marginBottom: 8,
  },
  contentInput: {
    backgroundColor: KingdomColors.darkGray,
    borderRadius: 12,
    padding: 16,
    color: KingdomColors.white,
    fontSize: 16,
    minHeight: 200,
    borderWidth: 2,
    borderColor: KingdomColors.purple,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  characterCount: {
    color: KingdomColors.gray,
    fontSize: 12,
    textAlign: 'right',
    marginBottom: 16,
  },
  categoriesGrid: {
    gap: 12,
  },
  categoryOption: {
    backgroundColor: KingdomColors.darkGray,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  categorySelected: {
    borderColor: KingdomColors.gold.bright,
    backgroundColor: KingdomColors.primary.deepNavy,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    color: KingdomColors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  categoryNameSelected: {
    color: KingdomColors.gold.bright,
  },
  categoryDescription: {
    color: KingdomColors.lightGray,
    fontSize: 12,
    textAlign: 'center',
  },
  tipCard: {
    backgroundColor: KingdomColors.primary.deepNavy,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
  },
  tipIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    color: KingdomColors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tipText: {
    color: KingdomColors.lightGray,
    fontSize: 14,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: KingdomColors.darkGray,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  tagSelected: {
    borderColor: KingdomColors.gold.bright,
    backgroundColor: KingdomColors.primary.deepNavy,
  },
  tagText: {
    color: KingdomColors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  tagTextSelected: {
    color: KingdomColors.gold.bright,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    color: KingdomColors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  settingDescription: {
    color: KingdomColors.lightGray,
    fontSize: 14,
    lineHeight: 18,
  },
  summaryCard: {
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    ...KingdomShadows.medium,
  },
  summaryContent: {
    padding: 20,
    alignItems: 'center',
  },
  summaryIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  summaryTitle: {
    color: KingdomColors.white,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  summaryCategory: {
    color: KingdomColors.gold.bright,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  summaryPreview: {
    color: KingdomColors.lightGray,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    gap: 12,
  },
  backNavButton: {
    padding: 16,
  },
  backNavText: {
    color: KingdomColors.lightGray,
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    ...KingdomShadows.medium,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonGradient: {
    padding: 18,
    alignItems: 'center',
  },
  nextButtonText: {
    color: KingdomColors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSpacer: {
    height: 40,
  },
});

export default TestimonySubmissionScreen;

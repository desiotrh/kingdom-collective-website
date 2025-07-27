/**
 * Kingdom Studios User Suggestion Screen
 * Allow users to submit suggestions and feedback for app improvements
 */

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
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { useFaithMode } from '../contexts/FaithModeContext';
import { KingdomColors } from '../constants/KingdomColors';
import { KingdomShadows } from '../constants/KingdomShadows';
import KingdomLogo from '../components/KingdomLogo';
import { Ionicons } from '@expo/vector-icons';

interface SuggestionFormData {
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  isAnonymous: boolean;
  includeContactInfo: boolean;
  email: string;
  suggestionType: 'feature' | 'improvement' | 'bug' | 'content' | 'other';
}

const SUGGESTION_CATEGORIES = [
  {
    id: 'ui_ux',
    name: 'Interface & Design',
    icon: '🎨',
    description: 'Improvements to app design and user experience',
  },
  {
    id: 'features',
    name: 'New Features',
    icon: '✨',
    description: 'Ideas for new tools and functionality',
  },
  {
    id: 'content',
    name: 'Content & Templates',
    icon: '📝',
    description: 'Suggestions for content templates and ideas',
  },
  {
    id: 'integrations',
    name: 'Integrations',
    icon: '🔗',
    description: 'Third-party service integrations',
  },
  {
    id: 'faith_mode',
    name: 'Faith Mode',
    icon: '✝️',
    description: 'Faith-specific features and improvements',
  },
  {
    id: 'performance',
    name: 'Performance',
    icon: '⚡',
    description: 'App speed and performance improvements',
  },
];

const UserSuggestionScreen = () => {
  const navigation = useNavigation();
  const { faithMode } = useFaithMode();

  const [formData, setFormData] = useState<SuggestionFormData>({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    isAnonymous: false,
    includeContactInfo: true,
    email: '',
    suggestionType: 'feature',
  });

  const [loading, setLoading] = useState(false);

  const currentColors = faithMode ? KingdomColors.faith : KingdomColors.encouragement;

  const handleCategorySelect = (categoryId: string) => {
    setFormData(prev => ({ ...prev, category: categoryId }));
  };

  const handleSubmitSuggestion = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Title Required', 'Please enter a title for your suggestion.');
      return;
    }

    if (!formData.description.trim()) {
      Alert.alert('Description Required', 'Please describe your suggestion in detail.');
      return;
    }

    if (!formData.category) {
      Alert.alert('Category Required', 'Please select a category for your suggestion.');
      return;
    }

    if (formData.includeContactInfo && !formData.email.trim()) {
      Alert.alert('Email Required', 'Please enter your email address for follow-up.');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call to submit suggestion
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert(
        faithMode ? 'Suggestion Submitted! 🙏' : 'Suggestion Submitted! 💡',
        faithMode
          ? 'Thank you for your heart to help improve Kingdom Studios! Your suggestion has been sent to our team and we will prayerfully consider it.'
          : 'Thank you for helping us improve Kingdom Studios! Your suggestion has been submitted and our team will review it.',
        [
          {
            text: 'Submit Another',
            onPress: () => {
              setFormData({
                title: '',
                description: '',
                category: '',
                priority: 'medium',
                isAnonymous: false,
                includeContactInfo: true,
                email: '',
                suggestionType: 'feature',
              });
            }
          },
          {
            text: 'Done',
            onPress: () => navigation.goBack(),
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit suggestion. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = SUGGESTION_CATEGORIES.find(cat => cat.id === formData.category);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentColors.background }]}>
      <LinearGradient
        colors={faithMode ? [currentColors.primary, currentColors.secondary] : [currentColors.primary, currentColors.accent]}
        style={styles.background}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={KingdomColors.white} />
          </TouchableOpacity>
          <KingdomLogo size="small" />
          <View style={styles.headerSpacer} />
        </View>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Title */}
            <BlurView intensity={20} style={styles.titleCard}>
              <LinearGradient colors={[currentColors.surface + 'CC', currentColors.surface + '99']} style={styles.titleContent}>
                <Text style={[styles.title, { color: currentColors.text }]}>
                  {faithMode ? 'Share Your Vision' : 'Suggest Improvements'}
                </Text>
                <Text style={[styles.subtitle, { color: currentColors.textSecondary }]}>
                  {faithMode
                    ? 'Help us build a platform that serves God\'s kingdom better'
                    : 'Help us make Kingdom Studios even better for creators like you'
                  }
                </Text>
              </LinearGradient>
            </BlurView>

            {/* Suggestion Type */}
            <BlurView intensity={20} style={styles.sectionCard}>
              <LinearGradient colors={[currentColors.surface + 'CC', currentColors.surface + '99']} style={styles.sectionContent}>
                <Text style={[styles.sectionTitle, { color: currentColors.text }]}>
                  What type of suggestion is this?
                </Text>
                <View style={styles.typeOptionsContainer}>
                  {[
                    { value: 'feature', label: 'New Feature', icon: '✨' },
                    { value: 'improvement', label: 'Improvement', icon: '⬆️' },
                    { value: 'bug', label: 'Bug Report', icon: '🐛' },
                    { value: 'content', label: 'Content Request', icon: '📝' },
                    { value: 'other', label: 'Other', icon: '💭' },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.typeOption,
                        { borderColor: currentColors.border },
                        formData.suggestionType === option.value && { borderColor: currentColors.primary, backgroundColor: currentColors.primary + '20' }
                      ]}
                      onPress={() => setFormData(prev => ({ ...prev, suggestionType: option.value as any }))}
                    >
                      <Text style={styles.typeIcon}>{option.icon}</Text>
                      <Text style={[
                        styles.typeLabel,
                        { color: currentColors.text },
                        formData.suggestionType === option.value && { color: currentColors.primary }
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </LinearGradient>
            </BlurView>

            {/* Title Input */}
            <BlurView intensity={20} style={styles.sectionCard}>
              <LinearGradient colors={[currentColors.surface + 'CC', currentColors.surface + '99']} style={styles.sectionContent}>
                <Text style={[styles.sectionTitle, { color: currentColors.text }]}>
                  Suggestion Title
                </Text>
                <TextInput
                  style={[styles.titleInput, {
                    borderColor: currentColors.border,
                    color: currentColors.text,
                    backgroundColor: currentColors.background,
                  }]}
                  placeholder="Brief, descriptive title for your suggestion"
                  placeholderTextColor={currentColors.textSecondary}
                  value={formData.title}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
                  maxLength={100}
                />
                <Text style={[styles.characterCount, { color: currentColors.textSecondary }]}>
                  {formData.title.length}/100
                </Text>
              </LinearGradient>
            </BlurView>

            {/* Category Selection */}
            <BlurView intensity={20} style={styles.sectionCard}>
              <LinearGradient colors={[currentColors.surface + 'CC', currentColors.surface + '99']} style={styles.sectionContent}>
                <Text style={[styles.sectionTitle, { color: currentColors.text }]}>
                  Category
                </Text>
                <View style={styles.categoriesGrid}>
                  {SUGGESTION_CATEGORIES.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryOption,
                        { borderColor: currentColors.border },
                        formData.category === category.id && { borderColor: currentColors.primary, backgroundColor: currentColors.primary + '20' }
                      ]}
                      onPress={() => handleCategorySelect(category.id)}
                    >
                      <Text style={styles.categoryIcon}>{category.icon}</Text>
                      <Text style={[
                        styles.categoryName,
                        { color: currentColors.text },
                        formData.category === category.id && { color: currentColors.primary }
                      ]}>
                        {category.name}
                      </Text>
                      <Text style={[styles.categoryDescription, { color: currentColors.textSecondary }]}>
                        {category.description}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </LinearGradient>
            </BlurView>

            {/* Description */}
            <BlurView intensity={20} style={styles.sectionCard}>
              <LinearGradient colors={[currentColors.surface + 'CC', currentColors.surface + '99']} style={styles.sectionContent}>
                <Text style={[styles.sectionTitle, { color: currentColors.text }]}>
                  Detailed Description
                </Text>
                <Text style={[styles.descriptionHint, { color: currentColors.textSecondary }]}>
                  {faithMode
                    ? 'Share your vision in detail. How would this help creators serve God\'s kingdom better?'
                    : 'Explain your suggestion in detail. How would this improve the user experience?'
                  }
                </Text>
                <TextInput
                  style={[styles.descriptionInput, {
                    borderColor: currentColors.border,
                    color: currentColors.text,
                    backgroundColor: currentColors.background,
                  }]}
                  placeholder={faithMode
                    ? 'I believe this feature would help creators...'
                    : 'This improvement would help by...'
                  }
                  placeholderTextColor={currentColors.textSecondary}
                  value={formData.description}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                  multiline
                  textAlignVertical="top"
                  maxLength={1000}
                />
                <Text style={[styles.characterCount, { color: currentColors.textSecondary }]}>
                  {formData.description.length}/1000
                </Text>
              </LinearGradient>
            </BlurView>

            {/* Priority & Settings */}
            <BlurView intensity={20} style={styles.sectionCard}>
              <LinearGradient colors={[currentColors.surface + 'CC', currentColors.surface + '99']} style={styles.sectionContent}>
                <Text style={[styles.sectionTitle, { color: currentColors.text }]}>
                  Priority & Settings
                </Text>

                {/* Priority Selection */}
                <Text style={[styles.subSectionTitle, { color: currentColors.text }]}>
                  How important is this to you?
                </Text>
                <View style={styles.priorityContainer}>
                  {[
                    { value: 'low', label: 'Nice to have', color: currentColors.info },
                    { value: 'medium', label: 'Would be helpful', color: currentColors.warning },
                    { value: 'high', label: 'Really needed', color: currentColors.error },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.priorityOption,
                        { borderColor: option.color },
                        formData.priority === option.value && { backgroundColor: option.color + '20' }
                      ]}
                      onPress={() => setFormData(prev => ({ ...prev, priority: option.value as any }))}
                    >
                      <View style={[styles.priorityIndicator, { backgroundColor: option.color }]} />
                      <Text style={[
                        styles.priorityLabel,
                        { color: currentColors.text },
                        formData.priority === option.value && { color: option.color }
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Anonymous Option */}
                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={[styles.settingTitle, { color: currentColors.text }]}>Submit Anonymously</Text>
                    <Text style={[styles.settingDescription, { color: currentColors.textSecondary }]}>
                      Hide your identity from the development team
                    </Text>
                  </View>
                  <Switch
                    value={formData.isAnonymous}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, isAnonymous: value }))}
                    trackColor={{ false: currentColors.border, true: currentColors.primary }}
                    thumbColor={formData.isAnonymous ? KingdomColors.white : currentColors.textSecondary}
                  />
                </View>

                {/* Contact Info Option */}
                {!formData.isAnonymous && (
                  <>
                    <View style={styles.settingRow}>
                      <View style={styles.settingInfo}>
                        <Text style={[styles.settingTitle, { color: currentColors.text }]}>Include Contact Info</Text>
                        <Text style={[styles.settingDescription, { color: currentColors.textSecondary }]}>
                          Allow us to follow up with questions or updates
                        </Text>
                      </View>
                      <Switch
                        value={formData.includeContactInfo}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, includeContactInfo: value }))}
                        trackColor={{ false: currentColors.border, true: currentColors.primary }}
                        thumbColor={formData.includeContactInfo ? KingdomColors.white : currentColors.textSecondary}
                      />
                    </View>

                    {formData.includeContactInfo && (
                      <TextInput
                        style={[styles.emailInput, {
                          borderColor: currentColors.border,
                          color: currentColors.text,
                          backgroundColor: currentColors.background,
                        }]}
                        placeholder="Your email address"
                        placeholderTextColor={currentColors.textSecondary}
                        value={formData.email}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                    )}
                  </>
                )}
              </LinearGradient>
            </BlurView>

            {/* Summary Card */}
            {selectedCategory && formData.title && (
              <BlurView intensity={20} style={styles.summaryCard}>
                <LinearGradient colors={[currentColors.primary + '20', currentColors.primary + '10']} style={styles.summaryContent}>
                  <Text style={styles.summaryIcon}>{selectedCategory.icon}</Text>
                  <Text style={[styles.summaryTitle, { color: currentColors.text }]}>{formData.title}</Text>
                  <Text style={[styles.summaryCategory, { color: currentColors.primary }]}>{selectedCategory.name}</Text>
                  <Text style={[styles.summaryPreview, { color: currentColors.textSecondary }]}>
                    {formData.description.substring(0, 150)}
                    {formData.description.length > 150 ? '...' : ''}
                  </Text>
                </LinearGradient>
              </BlurView>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!formData.title.trim() || !formData.description.trim() || !formData.category) && styles.submitButtonDisabled
              ]}
              onPress={handleSubmitSuggestion}
              disabled={!formData.title.trim() || !formData.description.trim() || !formData.category || loading}
            >
              <LinearGradient
                colors={(!formData.title.trim() || !formData.description.trim() || !formData.category)
                  ? [currentColors.border, currentColors.textSecondary]
                  : [currentColors.primary, currentColors.accent]
                }
                style={styles.submitButtonGradient}
              >
                <Text style={styles.submitButtonText}>
                  {loading
                    ? 'Submitting...'
                    : faithMode
                      ? '🙏 Submit Suggestion'
                      : '💡 Submit Suggestion'
                  }
                </Text>
              </LinearGradient>
            </TouchableOpacity>

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
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleCard: {
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
  },
  titleContent: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  sectionCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  sectionContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 8,
  },
  typeOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    gap: 8,
  },
  typeIcon: {
    fontSize: 16,
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  titleInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 8,
  },
  characterCount: {
    fontSize: 12,
    textAlign: 'right',
  },
  categoriesGrid: {
    gap: 12,
  },
  categoryOption: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  descriptionHint: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  descriptionInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  priorityContainer: {
    gap: 8,
    marginBottom: 20,
  },
  priorityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  priorityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  priorityLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  emailInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginTop: 12,
  },
  summaryCard: {
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
  },
  summaryContent: {
    padding: 20,
    alignItems: 'center',
  },
  summaryIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  summaryCategory: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  summaryPreview: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  submitButton: {
    borderRadius: 16,
    overflow: 'hidden',
    ...KingdomShadows.large,
    marginTop: 20,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonGradient: {
    padding: 18,
    alignItems: 'center',
  },
  submitButtonText: {
    color: KingdomColors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomSpacer: {
    height: 40,
  },
});

export default React.memo(UserSuggestionScreen);

/**
 * Kingdom Studios Mentor Onboarding Screen
 * Form for users to apply to become volunteer mentors
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { useFaithMode } from '../contexts/FaithModeContext';
import { KingdomColors, KingdomShadows } from '../constants/KingdomColors';
import KingdomLogo from '../components/KingdomLogo';
import { MENTORSHIP_CATEGORIES } from '../types/mentorship';

const { width, height } = Dimensions.get('window');

const MentorOnboardingScreen = () => {
  const navigation = useNavigation();
  const { faithMode } = useFaithMode();
  
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    experience: '',
    selectedCategories: [] as string[],
    giftings: [] as string[],
    availability: {
      days: [] as string[],
      timeZone: '',
      preferredTimes: [] as string[],
    },
    contactPreference: 'chat' as 'chat' | 'email' | 'video' | 'phone',
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const totalSteps = 4;

  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  const timeSlots = [
    '6:00 AM - 9:00 AM',
    '9:00 AM - 12:00 PM',
    '12:00 PM - 3:00 PM',
    '3:00 PM - 6:00 PM',
    '6:00 PM - 9:00 PM',
    '9:00 PM - 12:00 AM',
  ];

  const spiritualGiftings = [
    'Teaching', 'Encouragement', 'Prophecy', 'Pastoral Care', 'Wisdom',
    'Discernment', 'Evangelism', 'Mercy', 'Faith', 'Leadership',
    'Intercession', 'Deliverance', 'Healing', 'Administration'
  ];

  const contactPreferences = [
    { value: 'chat', label: 'Text/Chat', icon: '💬' },
    { value: 'email', label: 'Email', icon: '📧' },
    { value: 'video', label: 'Video Call', icon: '📹' },
    { value: 'phone', label: 'Phone Call', icon: '📞' },
  ];

  const toggleCategory = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(categoryId)
        ? prev.selectedCategories.filter(id => id !== categoryId)
        : [...prev.selectedCategories, categoryId]
    }));
  };

  const toggleGifting = (gifting: string) => {
    setFormData(prev => ({
      ...prev,
      giftings: prev.giftings.includes(gifting)
        ? prev.giftings.filter(g => g !== gifting)
        : [...prev.giftings, gifting]
    }));
  };

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        days: prev.availability.days.includes(day)
          ? prev.availability.days.filter(d => d !== day)
          : [...prev.availability.days, day]
      }
    }));
  };

  const toggleTimeSlot = (slot: string) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        preferredTimes: prev.availability.preferredTimes.includes(slot)
          ? prev.availability.preferredTimes.filter(t => t !== slot)
          : [...prev.availability.preferredTimes, slot]
      }
    }));
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return formData.displayName.trim() && formData.bio.trim() && formData.experience.trim();
      case 2:
        return formData.selectedCategories.length > 0;
      case 3:
        return formData.giftings.length > 0 || !faithMode;
      case 4:
        return formData.availability.days.length > 0 && formData.availability.preferredTimes.length > 0;
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
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        faithMode ? 'Application Submitted! 🙏' : 'Application Submitted! 🤝',
        faithMode 
          ? 'Thank you for your heart to serve! Your application has been submitted and will be reviewed within 24-48 hours. May God bless your ministry!'
          : 'Your mentor application has been submitted successfully! You\'ll receive a response within 24-48 hours.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <BlurView intensity={20} style={styles.sectionCard}>
      <LinearGradient colors={KingdomColors.gradients.cardBackground as any} style={styles.sectionContent}>
        <Text style={styles.sectionTitle}>
          {faithMode ? 'Share Your Heart' : 'Basic Information'}
        </Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Display Name</Text>
          <TextInput
            style={styles.textInput}
            placeholder="How you'd like to be known"
            placeholderTextColor={KingdomColors.gray}
            value={formData.displayName}
            onChangeText={(text) => setFormData(prev => ({ ...prev, displayName: text }))}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            {faithMode ? 'Your Story & Calling' : 'Bio'}
          </Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder={faithMode 
              ? 'Share your testimony, calling, and heart for mentoring others...'
              : 'Tell us about yourself and why you want to mentor...'
            }
            placeholderTextColor={KingdomColors.gray}
            value={formData.bio}
            onChangeText={(text) => setFormData(prev => ({ ...prev, bio: text }))}
            multiline
            textAlignVertical="top"
            maxLength={300}
          />
          <Text style={styles.characterCount}>{formData.bio.length}/300</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            {faithMode ? 'Ministry & Life Experience' : 'Experience'}
          </Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder={faithMode 
              ? 'Share your ministry experience, life lessons, what God has taught you...'
              : 'Describe your relevant experience, qualifications, achievements...'
            }
            placeholderTextColor={KingdomColors.gray}
            value={formData.experience}
            onChangeText={(text) => setFormData(prev => ({ ...prev, experience: text }))}
            multiline
            textAlignVertical="top"
            maxLength={300}
          />
          <Text style={styles.characterCount}>{formData.experience.length}/300</Text>
        </View>
      </LinearGradient>
    </BlurView>
  );

  const renderStep2 = () => (
    <BlurView intensity={20} style={styles.sectionCard}>
      <LinearGradient colors={KingdomColors.gradients.cardBackground as any} style={styles.sectionContent}>
        <Text style={styles.sectionTitle}>
          {faithMode ? 'Areas of Ministry' : 'Mentorship Categories'}
        </Text>
        <Text style={styles.stepDescription}>
          {faithMode 
            ? 'Select the areas where you feel called to guide and disciple others:'
            : 'Choose the areas where you can provide valuable mentorship:'
          }
        </Text>
        
        <View style={styles.categoriesGrid}>
          {MENTORSHIP_CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryOption,
                formData.selectedCategories.includes(category.id) && styles.categorySelected
              ]}
              onPress={() => toggleCategory(category.id)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={[
                styles.categoryName,
                formData.selectedCategories.includes(category.id) && styles.categoryNameSelected
              ]}>
                {category.name}
              </Text>
              <Text style={styles.categoryDescription}>{category.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>
    </BlurView>
  );

  const renderStep3 = () => (
    <BlurView intensity={20} style={styles.sectionCard}>
      <LinearGradient colors={KingdomColors.gradients.cardBackground as any} style={styles.sectionContent}>
        <Text style={styles.sectionTitle}>
          {faithMode ? 'Spiritual Giftings' : 'Skills & Strengths'}
        </Text>
        <Text style={styles.stepDescription}>
          {faithMode 
            ? 'What spiritual gifts has God given you for ministry?'
            : 'What are your key skills and strengths for mentoring?'
          }
        </Text>
        
        <View style={styles.tagsContainer}>
          {(faithMode ? spiritualGiftings : [
            'Teaching', 'Leadership', 'Strategy', 'Communication', 'Creativity',
            'Problem Solving', 'Technical Skills', 'Marketing', 'Business Development',
            'Content Creation', 'Social Media', 'Analytics', 'Project Management', 'Design'
          ]).map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.tag,
                formData.giftings.includes(item) && styles.tagSelected
              ]}
              onPress={() => toggleGifting(item)}
            >
              <Text style={[
                styles.tagText,
                formData.giftings.includes(item) && styles.tagTextSelected
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>
    </BlurView>
  );

  const renderStep4 = () => (
    <>
      <BlurView intensity={20} style={styles.sectionCard}>
        <LinearGradient colors={KingdomColors.gradients.cardBackground as any} style={styles.sectionContent}>
          <Text style={styles.sectionTitle}>Availability</Text>
          <Text style={styles.stepDescription}>
            When are you typically available for mentorship sessions?
          </Text>
          
          <Text style={styles.subSectionTitle}>Days of the Week</Text>
          <View style={styles.daysContainer}>
            {daysOfWeek.map((day) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayOption,
                  formData.availability.days.includes(day) && styles.daySelected
                ]}
                onPress={() => toggleDay(day)}
              >
                <Text style={[
                  styles.dayText,
                  formData.availability.days.includes(day) && styles.dayTextSelected
                ]}>
                  {day.slice(0, 3)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.subSectionTitle}>Preferred Times</Text>
          <View style={styles.timeSlotsContainer}>
            {timeSlots.map((slot) => (
              <TouchableOpacity
                key={slot}
                style={[
                  styles.timeSlot,
                  formData.availability.preferredTimes.includes(slot) && styles.timeSlotSelected
                ]}
                onPress={() => toggleTimeSlot(slot)}
              >
                <Text style={[
                  styles.timeSlotText,
                  formData.availability.preferredTimes.includes(slot) && styles.timeSlotTextSelected
                ]}>
                  {slot}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.subSectionTitle}>Time Zone</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., EST, PST, GMT"
            placeholderTextColor={KingdomColors.gray}
            value={formData.availability.timeZone}
            onChangeText={(text) => setFormData(prev => ({ 
              ...prev, 
              availability: { ...prev.availability, timeZone: text }
            }))}
          />
        </LinearGradient>
      </BlurView>

      <BlurView intensity={20} style={styles.sectionCard}>
        <LinearGradient colors={KingdomColors.gradients.cardBackground as any} style={styles.sectionContent}>
          <Text style={styles.sectionTitle}>Communication Preference</Text>
          <View style={styles.contactPreferencesContainer}>
            {contactPreferences.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.contactOption,
                  formData.contactPreference === option.value && styles.contactSelected
                ]}
                onPress={() => setFormData(prev => ({ ...prev, contactPreference: option.value as any }))}
              >
                <Text style={styles.contactIcon}>{option.icon}</Text>
                <Text style={[
                  styles.contactLabel,
                  formData.contactPreference === option.value && styles.contactLabelSelected
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </LinearGradient>
      </BlurView>
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
                <Text style={styles.title}>
                  {faithMode ? 'Become a Forge Guide' : 'Become a Mentor'}
                </Text>
                <Text style={styles.subtitle}>
                  {faithMode 
                    ? 'Join our community of spirit-filled mentors helping others grow in faith and purpose.'
                    : 'Share your knowledge and experience with the next generation of creators.'
                  }
                </Text>
              </LinearGradient>
            </BlurView>

            {/* Step Content */}
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}

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
                        ? faithMode ? '🙏 Submit Application' : '🤝 Submit Application'
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
    marginBottom: 16,
  },
  stepDescription: {
    color: KingdomColors.lightGray,
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: KingdomColors.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: KingdomColors.darkGray,
    borderRadius: 12,
    padding: 16,
    color: KingdomColors.white,
    fontSize: 16,
    borderWidth: 2,
    borderColor: KingdomColors.purple,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    color: KingdomColors.gray,
    fontSize: 12,
    textAlign: 'right',
    marginTop: 8,
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
    fontSize: 14,
    textAlign: 'center',
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
  subSectionTitle: {
    color: KingdomColors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 8,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  dayOption: {
    backgroundColor: KingdomColors.darkGray,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  daySelected: {
    borderColor: KingdomColors.gold.bright,
    backgroundColor: KingdomColors.primary.deepNavy,
  },
  dayText: {
    color: KingdomColors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  dayTextSelected: {
    color: KingdomColors.gold.bright,
  },
  timeSlotsContainer: {
    gap: 8,
    marginBottom: 20,
  },
  timeSlot: {
    backgroundColor: KingdomColors.darkGray,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  timeSlotSelected: {
    borderColor: KingdomColors.gold.bright,
    backgroundColor: KingdomColors.primary.deepNavy,
  },
  timeSlotText: {
    color: KingdomColors.white,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  timeSlotTextSelected: {
    color: KingdomColors.gold.bright,
  },
  contactPreferencesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  contactOption: {
    backgroundColor: KingdomColors.darkGray,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
  },
  contactSelected: {
    borderColor: KingdomColors.gold.bright,
    backgroundColor: KingdomColors.primary.deepNavy,
  },
  contactIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  contactLabel: {
    color: KingdomColors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  contactLabelSelected: {
    color: KingdomColors.gold.bright,
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

export default MentorOnboardingScreen;

/**
 * Kingdom Studios Mentorship Request Screen
 * Form for requesting mentorship from a specific mentor
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
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFaithMode } from '../contexts/FaithModeContext';
import { KingdomColors } from '../constants/KingdomColors';
import { KingdomShadows } from '../constants/KingdomShadows';
import KingdomLogo from '../components/KingdomLogo';
import { MentorshipCategory } from '../types/mentorship';

const { width, height } = Dimensions.get('window');

interface RouteParams {
  mentorId: string;
  mentorName: string;
  categories: MentorshipCategory[];
}

const MentorshipRequestScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { mentorId, mentorName, categories } = route.params as RouteParams;
  const { faithMode } = useFaithMode();

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [message, setMessage] = useState('');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high'>('medium');
  const [sessionType, setSessionType] = useState<'one-time' | 'ongoing' | 'course'>('one-time');
  const [loading, setLoading] = useState(false);

  const urgencyOptions = [
    { value: 'low', label: faithMode ? 'Whenever possible' : 'Low Priority', color: KingdomColors.accent.info },
    { value: 'medium', label: faithMode ? 'Within a week' : 'Medium Priority', color: KingdomColors.gold.warm },
    { value: 'high', label: faithMode ? 'Urgent - prayer needed' : 'High Priority', color: KingdomColors.accent.error },
  ];

  const sessionTypeOptions = [
    {
      value: 'one-time',
      label: faithMode ? 'One conversation' : 'One-time session',
      description: faithMode ? 'A single prayer/guidance session' : 'Single mentorship session'
    },
    {
      value: 'ongoing',
      label: faithMode ? 'Discipleship journey' : 'Ongoing mentorship',
      description: faithMode ? 'Regular discipleship meetings' : 'Regular mentorship meetings'
    },
    {
      value: 'course',
      label: faithMode ? 'Structured teaching' : 'Structured course',
      description: faithMode ? 'A specific biblical teaching series' : 'A structured learning program'
    },
  ];

  const handleSubmitRequest = async () => {
    if (!selectedCategory) {
      Alert.alert('Category Required', 'Please select a mentorship category.');
      return;
    }

    if (!message.trim()) {
      Alert.alert(
        faithMode ? 'Share Your Heart' : 'Message Required',
        faithMode
          ? 'Please share what\'s on your heart or what you need guidance with.'
          : 'Please provide a message describing what you need help with.'
      );
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert(
        faithMode ? 'Request Sent! 🙏' : 'Request Sent! 🤝',
        faithMode
          ? `Your request for spiritual guidance has been sent to ${mentorName}. They will respond within 24 hours. God bless you!`
          : `Your mentorship request has been sent to ${mentorName}. You'll receive a response within 24 hours.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Title */}
            <BlurView intensity={20} style={styles.titleCard}>
              <LinearGradient colors={KingdomColors.gradients.cardBackground as any} style={styles.titleContent}>
                <Text style={styles.title}>
                  {faithMode ? `Request Guidance from ${mentorName}` : `Request Mentorship from ${mentorName}`}
                </Text>
                <Text style={styles.subtitle}>
                  {faithMode
                    ? 'Share your heart and let God connect you with the right guidance.'
                    : 'Fill out this form to connect with your mentor.'
                  }
                </Text>
              </LinearGradient>
            </BlurView>

            {/* Category Selection */}
            <BlurView intensity={20} style={styles.sectionCard}>
              <LinearGradient colors={KingdomColors.gradients.cardBackground as any} style={styles.sectionContent}>
                <Text style={styles.sectionTitle}>
                  {faithMode ? 'Area of Guidance' : 'Mentorship Category'}
                </Text>
                <View style={styles.categoriesGrid}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryOption,
                        selectedCategory === category.id && styles.categorySelected
                      ]}
                      onPress={() => setSelectedCategory(category.id)}
                    >
                      <Text style={styles.categoryIcon}>{category.icon}</Text>
                      <Text style={[
                        styles.categoryName,
                        selectedCategory === category.id && styles.categoryNameSelected
                      ]}>
                        {category.name}
                      </Text>
                      <Text style={styles.categoryDescription}>{category.description}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </LinearGradient>
            </BlurView>

            {/* Session Type */}
            <BlurView intensity={20} style={styles.sectionCard}>
              <LinearGradient colors={KingdomColors.gradients.cardBackground as any} style={styles.sectionContent}>
                <Text style={styles.sectionTitle}>
                  {faithMode ? 'Type of Guidance' : 'Session Type'}
                </Text>
                <View style={styles.optionsContainer}>
                  {sessionTypeOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.optionCard,
                        sessionType === option.value && styles.optionSelected
                      ]}
                      onPress={() => setSessionType(option.value as any)}
                    >
                      <Text style={[
                        styles.optionLabel,
                        sessionType === option.value && styles.optionLabelSelected
                      ]}>
                        {option.label}
                      </Text>
                      <Text style={styles.optionDescription}>{option.description}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </LinearGradient>
            </BlurView>

            {/* Urgency */}
            <BlurView intensity={20} style={styles.sectionCard}>
              <LinearGradient colors={KingdomColors.gradients.cardBackground as any} style={styles.sectionContent}>
                <Text style={styles.sectionTitle}>
                  {faithMode ? 'How urgent is this?' : 'Priority Level'}
                </Text>
                <View style={styles.urgencyContainer}>
                  {urgencyOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.urgencyOption,
                        urgency === option.value && styles.urgencySelected,
                        { borderColor: option.color }
                      ]}
                      onPress={() => setUrgency(option.value as any)}
                    >
                      <View style={[
                        styles.urgencyIndicator,
                        { backgroundColor: option.color },
                        urgency === option.value && styles.urgencyIndicatorSelected
                      ]} />
                      <Text style={[
                        styles.urgencyLabel,
                        urgency === option.value && styles.urgencyLabelSelected
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </LinearGradient>
            </BlurView>

            {/* Message */}
            <BlurView intensity={20} style={styles.sectionCard}>
              <LinearGradient colors={KingdomColors.gradients.cardBackground as any} style={styles.sectionContent}>
                <Text style={styles.sectionTitle}>
                  {faithMode ? 'Share Your Heart' : 'Your Message'}
                </Text>
                <Text style={styles.messageHint}>
                  {faithMode
                    ? 'Share what\'s on your heart, what you\'re struggling with, or what you\'d like guidance on. Your mentor will pray and respond with wisdom.'
                    : 'Describe what you need help with, your goals, and what you hope to achieve through this mentorship.'
                  }
                </Text>
                <TextInput
                  style={styles.messageInput}
                  placeholder={faithMode
                    ? 'I\'ve been struggling with... I feel called to... I need prayer for...'
                    : 'I need help with... My goals are... I hope to learn...'
                  }
                  placeholderTextColor={KingdomColors.gray}
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  textAlignVertical="top"
                  maxLength={500}
                />
                <Text style={styles.characterCount}>{message.length}/500</Text>
              </LinearGradient>
            </BlurView>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmitRequest}
              disabled={loading}
            >
              <LinearGradient
                colors={KingdomColors.gradients.primary as any}
                style={styles.submitButtonGradient}
              >
                <Text style={styles.submitButtonText}>
                  {loading
                    ? 'Sending...'
                    : faithMode
                      ? '🙏 Send Request for Guidance'
                      : '🤝 Send Mentorship Request'
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
    paddingBottom: 20,
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
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    backgroundColor: KingdomColors.darkGray,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: {
    borderColor: KingdomColors.gold.bright,
    backgroundColor: KingdomColors.primary.deepNavy,
  },
  optionLabel: {
    color: KingdomColors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  optionLabelSelected: {
    color: KingdomColors.gold.bright,
  },
  optionDescription: {
    color: KingdomColors.lightGray,
    fontSize: 14,
  },
  urgencyContainer: {
    gap: 12,
  },
  urgencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: KingdomColors.darkGray,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  urgencySelected: {
    backgroundColor: KingdomColors.primary.deepNavy,
  },
  urgencyIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
    opacity: 0.5,
  },
  urgencyIndicatorSelected: {
    opacity: 1,
  },
  urgencyLabel: {
    color: KingdomColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  urgencyLabelSelected: {
    color: KingdomColors.gold.bright,
  },
  messageHint: {
    color: KingdomColors.lightGray,
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  messageInput: {
    backgroundColor: KingdomColors.darkGray,
    borderRadius: 12,
    padding: 16,
    color: KingdomColors.white,
    fontSize: 16,
    minHeight: 120,
    borderWidth: 2,
    borderColor: KingdomColors.purple,
    textAlignVertical: 'top',
  },
  characterCount: {
    color: KingdomColors.gray,
    fontSize: 12,
    textAlign: 'right',
    marginTop: 8,
  },
  submitButton: {
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    ...KingdomShadows.large,
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

export default React.memo(MentorshipRequestScreen);

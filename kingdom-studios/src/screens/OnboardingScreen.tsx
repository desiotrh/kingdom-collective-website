import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import { useAppNavigation } from '../utils/navigationUtils';
import { useFaithMode } from '../contexts/FaithModeContext';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/UnifiedAuthContext';
import WelcomeGuide from '../components/WelcomeGuide';

const OnboardingScreen = () => {
  const navigation = useAppNavigation();
  const { faithMode, setFaithMode } = useFaithMode();
  const { updateAppState } = useApp();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [showWelcomeGuide, setShowWelcomeGuide] = useState(false);

  const steps = [
    {
      title: faithMode ? "Welcome to Kingdom Studios" : "Welcome to Kingdom Studios",
      subtitle: faithMode 
        ? "God has equipped you with creative gifts. Let's use them for His glory!" 
        : "You're equipped with amazing creative potential. Let's unlock it together!",
      image: require('../../assets/KingdomStudiosLogo.png'),
      content: faithMode
        ? "Kingdom Studios is your faith-filled toolkit for digital creation, product management, and kingdom building."
        : "Kingdom Studios is your complete toolkit for digital creation, product management, and business growth.",
    },
    {
      title: "Choose Your Journey",
      subtitle: "How would you like your experience?",
      content: "You can change this anytime in Settings.",
      faithModeSelection: true,
    },
    {
      title: faithMode ? "Build His Kingdom" : "Build Your Empire",
      subtitle: faithMode 
        ? "Manage products, create content, and share your testimony with the world."
        : "Manage products, create content, and share your message with the world.",
      content: faithMode
        ? "• Product management across platforms\n• AI-powered content creation\n• Faith-inspired community\n• Biblical encouragement\n• Sponsored access available"
        : "• Product management across platforms\n• AI-powered content creation\n• Creator community\n• Motivational guidance\n• Premium features available",
    },
    {
      title: faithMode ? "Would you like a guide?" : "Want a mentor?",
      subtitle: faithMode 
        ? "Connect with a spirit-filled mentor to help you grow in faith and creativity."
        : "Connect with an experienced mentor to accelerate your creative journey.",
      content: faithMode
        ? "Our Forge Guides are mature believers who volunteer their time to disciple and guide new creators in both faith and business."
        : "Our mentors are experienced creators who share their knowledge to help you succeed faster.",
      mentorshipSelection: true,
    },
    {
      title: "Ready to Start?",
      subtitle: faithMode 
        ? "Let's build something beautiful for His glory!" 
        : "Let's build something amazing together!",
      content: faithMode
        ? "\"For we are God's handiwork, created in Christ Jesus to do good works.\" - Ephesians 2:10"
        : "\"The future belongs to those who believe in the beauty of their dreams.\"",
      final: true,
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const completeOnboarding = async () => {
    try {
      await updateAppState({
        hasCompletedOnboarding: true,
        isFirstTime: false,
      });
      // Show welcome guide before going to dashboard
      setShowWelcomeGuide(true);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const handleWelcomeGuideClose = () => {
    setShowWelcomeGuide(false);
    navigation.navigate('CreatorDashboard');
  };

  const handleFaithModeToggle = async (enabled: boolean) => {
    try {
      await setFaithMode(enabled);
      // Force re-render by moving to next step
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    } catch (error) {
      console.error('Error setting faith mode:', error);
    }
  };

  const renderFaithModeSelection = () => (
    <View style={styles.faithModeContainer}>
      <TouchableOpacity
        style={[
          styles.faithModeCard,
          faithMode && styles.faithModeCardSelected,
        ]}
        onPress={() => handleFaithModeToggle(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.faithModeIcon}>✝️</Text>
        <Text style={styles.faithModeTitle}>Faith Mode</Text>
        <Text style={styles.faithModeDescription}>
          Biblical encouragement, scripture references, and faith-based community features
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.faithModeCard,
          !faithMode && styles.faithModeCardSelected,
        ]}
        onPress={() => handleFaithModeToggle(false)}
        activeOpacity={0.8}
      >
        <Text style={styles.faithModeIcon}>✨</Text>
        <Text style={styles.faithModeTitle}>Inspiration Mode</Text>
        <Text style={styles.faithModeDescription}>
          Motivational guidance, positive affirmations, and purpose-driven features
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderMentorshipSelection = () => (
    <View style={styles.mentorshipContainer}>
      <View style={styles.mentorshipOptions}>
        <TouchableOpacity
          style={styles.mentorshipCard}
          onPress={() => navigation.navigate('MentorshipHub')}
          activeOpacity={0.8}
        >
          <Text style={styles.mentorshipIcon}>
            {faithMode ? '🙏' : '🤝'}
          </Text>
          <Text style={styles.mentorshipTitle}>
            {faithMode ? 'Yes, I need guidance' : 'Yes, I want a mentor'}
          </Text>
          <Text style={styles.mentorshipDescription}>
            {faithMode 
              ? 'Connect me with a spirit-filled guide who can help me grow in faith and creativity.'
              : 'Connect me with an experienced creator who can help me succeed faster.'
            }
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.mentorshipCard}
          onPress={() => handleNext()}
          activeOpacity={0.8}
        >
          <Text style={styles.mentorshipIcon}>🚀</Text>
          <Text style={styles.mentorshipTitle}>
            {faithMode ? 'I\'ll trust God\'s timing' : 'I\'ll go solo for now'}
          </Text>
          <Text style={styles.mentorshipDescription}>
            {faithMode 
              ? 'I\'ll explore on my own and seek guidance when I\'m ready.'
              : 'I want to explore on my own and maybe find a mentor later.'
            }
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.becomeMentorLink}
        onPress={() => navigation.navigate('MentorOnboarding')}
      >
        <Text style={styles.becomeMentorText}>
          {faithMode 
            ? '✝️ I feel called to mentor others'
            : '💡 I want to become a mentor'
          }
        </Text>
      </TouchableOpacity>
    </View>
  );

  const currentStepData = steps[currentStep];

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        {steps.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              index <= currentStep && styles.progressDotActive,
            ]}
          />
        ))}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          {currentStepData.image && (
            <Image source={currentStepData.image} style={styles.logo} />
          )}
          <Text style={styles.title}>{currentStepData.title}</Text>
          <Text style={styles.subtitle}>{currentStepData.subtitle}</Text>
        </View>

        {/* Content */}
        <View style={styles.contentSection}>
          {currentStepData.faithModeSelection ? (
            renderFaithModeSelection()
          ) : currentStepData.mentorshipSelection ? (
            renderMentorshipSelection()
          ) : (
            <Text style={styles.contentText}>{currentStepData.content}</Text>
          )}
        </View>

        {/* User Info */}
        {user && (
          <View style={styles.userInfo}>
            <Text style={styles.userWelcome}>
              {faithMode ? 'God bless you,' : 'Welcome,'} {user.displayName || 'Creator'}!
            </Text>
          </View>
        )}
      </ScrollView>
      
      <WelcomeGuide 
        visible={showWelcomeGuide}
        onClose={handleWelcomeGuideClose}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333333',
  },
  progressDotActive: {
    backgroundColor: '#f97316',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 24,
    borderRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#cccccc',
    textAlign: 'center',
    lineHeight: 24,
  },
  contentSection: {
    marginBottom: 40,
  },
  contentText: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 24,
    textAlign: 'center',
  },
  faithModeContainer: {
    gap: 16,
  },
  faithModeCard: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#333333',
    alignItems: 'center',
  },
  faithModeCardSelected: {
    borderColor: '#f97316',
    backgroundColor: '#1a1a1a',
  },
  faithModeIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  faithModeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  faithModeDescription: {
    fontSize: 14,
    color: '#cccccc',
    textAlign: 'center',
    lineHeight: 20,
  },
  mentorshipContainer: {
    gap: 16,
  },
  mentorshipOptions: {
    gap: 16,
    marginBottom: 20,
  },
  mentorshipCard: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#333333',
    alignItems: 'center',
  },
  mentorshipIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  mentorshipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  mentorshipDescription: {
    fontSize: 14,
    color: '#cccccc',
    textAlign: 'center',
    lineHeight: 20,
  },
  becomeMentorLink: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  becomeMentorText: {
    fontSize: 16,
    color: '#f97316',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  userWelcome: {
    fontSize: 16,
    color: '#f97316',
    fontWeight: '600',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#cccccc',
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#666666',
  },
  nextButton: {
    backgroundColor: '#f97316',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default React.memo(OnboardingScreen);

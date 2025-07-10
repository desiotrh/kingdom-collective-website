import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { useTierSystem } from '../contexts/TierSystemContext';

const { width: screenWidth } = Dimensions.get('window');

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  action?: () => void;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Kingdom Studios',
    description: 'Create with Purpose. Share with Power. Build What Matters.',
    icon: '👑',
  },
  {
    id: 'ai-power',
    title: 'AI-Powered Content Creation',
    description: 'Generate engaging posts, captions, and video scripts with advanced AI technology.',
    icon: '🤖',
  },
  {
    id: 'social-media',
    title: 'Multi-Platform Publishing',
    description: 'Connect and manage YouTube, Twitter, Facebook, Instagram, LinkedIn, and TikTok.',
    icon: '📱',
  },
  {
    id: 'analytics',
    title: 'Advanced Analytics',
    description: 'Track performance, engagement, and ROI across all your content and platforms.',
    icon: '📊',
  },
  {
    id: 'collaboration',
    title: 'Team Collaboration',
    description: 'Work with your team, manage clients, and scale your content creation.',
    icon: '👥',
  },
  {
    id: 'tier-selection',
    title: 'Choose Your Plan',
    description: 'Select the perfect tier for your content creation journey.',
    icon: '⭐',
  },
];

export const EnhancedOnboardingScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [slideAnimation] = useState(new Animated.Value(0));
  const [fadeAnimation] = useState(new Animated.Value(1));
  const { user } = useAuth();
  const { availableTiers } = useTierSystem();

  useEffect(() => {
    // Animate in the current step
    Animated.parallel([
      Animated.timing(slideAnimation, {
        toValue: currentStep * -screenWidth,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentStep]);

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        setCurrentStep(currentStep + 1);
      });
    }
  };

  const skipOnboarding = () => {
    // Mark onboarding as completed and navigate to main app
    // This would typically save to AsyncStorage and navigate
  };

  const renderStep = (step: OnboardingStep, index: number) => (
    <Animated.View
      key={step.id}
      style={[
        styles.stepContainer,
        {
          transform: [{ translateX: slideAnimation }],
          opacity: fadeAnimation,
        },
      ]}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.icon}>{step.icon}</Text>
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.description}>{step.description}</Text>
        
        {step.id === 'tier-selection' && (
          <View style={styles.tierContainer}>
            {Object.entries(availableTiers).map(([tierKey, tier]) => (
              <View key={tierKey} style={styles.tierCard}>
                <Text style={styles.tierName}>{tier.name}</Text>
                <Text style={styles.tierPrice}>${tier.monthlyPrice}/month</Text>
                <Text style={styles.tierDescription}>{tier.description}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
      
      <View style={styles.navigationContainer}>
        <View style={styles.progressContainer}>
          {onboardingSteps.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.progressDot,
                idx === currentStep && styles.progressDotActive,
              ]}
            />
          ))}
        </View>
        
        <View style={styles.buttonContainer}>
          {currentStep > 0 && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setCurrentStep(currentStep - 1)}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={styles.skipButton}
            onPress={skipOnboarding}
          >
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.nextButton}
            onPress={nextStep}
          >
            <Text style={styles.nextButtonText}>
              {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Kingdom Studios</Text>
        <Text style={styles.headerSubtitle}>Welcome, {user?.displayName || 'Creator'}!</Text>
      </View>
      
      <View style={styles.stepsContainer}>
        {onboardingSteps.map((step, index) => renderStep(step, index))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#CCCCCC',
  },
  stepsContainer: {
    flex: 1,
    flexDirection: 'row',
    width: screenWidth * onboardingSteps.length,
  },
  stepContainer: {
    width: screenWidth,
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  icon: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 18,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  tierContainer: {
    marginTop: 30,
    width: '100%',
  },
  tierCard: {
    backgroundColor: '#1A1A1A',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  tierName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  tierPrice: {
    fontSize: 16,
    color: '#4A90E2',
    marginBottom: 8,
  },
  tierDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
  },
  navigationContainer: {
    paddingBottom: 40,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333333',
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: '#4A90E2',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#CCCCCC',
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
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

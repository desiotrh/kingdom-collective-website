import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useFaithMode } from '../contexts/FaithModeContext';

interface GuideStep {
  title: string;
  description: string;
  faithDescription?: string;
  emoji: string;
  tip: string;
}

interface WelcomeGuideProps {
  visible: boolean;
  onClose: () => void;
}

const WelcomeGuide: React.FC<WelcomeGuideProps> = ({ visible, onClose }) => {
  const { faithMode } = useFaithMode();
  const [currentStep, setCurrentStep] = useState(0);

  const steps: GuideStep[] = [
    {
      title: 'Welcome to Kingdom Studios',
      description: 'Your complete toolkit for content creation and product management.',
      faithDescription: 'God has given you unique gifts - let\'s build your Kingdom business together!',
      emoji: '👑',
      tip: 'Start by adding your first product or creating content'
    },
    {
      title: 'Product Management',
      description: 'Add products from Etsy, Printify, or Shopify. Track performance and create content.',
      faithDescription: 'Each product is a blessing - let\'s share them with excellence and integrity.',
      emoji: '📦',
      tip: 'Use high-quality images and detailed descriptions'
    },
    {
      title: 'Content Creation',
      description: 'Generate AI-powered captions and hashtags for multiple platforms at once.',
      faithDescription: 'Let your light shine through every post - authentically and purposefully.',
      emoji: '✨',
      tip: 'Enable Faith Mode for scripture-inspired content'
    },
    {
      title: 'Community & Growth',
      description: 'Connect with fellow creators in the Forge Community.',
      faithDescription: 'Iron sharpens iron - grow together with other faith-based entrepreneurs.',
      emoji: '🤝',
      tip: 'Share your wins and challenges with the community'
    },
    {
      title: 'Analytics & Insights',
      description: 'Track your content performance and optimize your strategy.',
      faithDescription: 'Steward your platform well - use data to serve your audience better.',
      emoji: '📊',
      tip: 'Check analytics weekly to refine your approach'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const currentStepData = steps[currentStep];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.stepCounter}>
              {currentStep + 1} of {steps.length}
            </Text>
            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${((currentStep + 1) / steps.length) * 100}%` }
                ]} 
              />
            </View>
          </View>

          {/* Content */}
          <View style={styles.stepContainer}>
            <Text style={styles.emoji}>{currentStepData.emoji}</Text>
            <Text style={styles.title}>{currentStepData.title}</Text>
            <Text style={styles.description}>
              {faithMode && currentStepData.faithDescription 
                ? currentStepData.faithDescription 
                : currentStepData.description}
            </Text>
            
            {/* Faith Mode Banner */}
            {faithMode && (
              <View style={styles.faithBanner}>
                <Text style={styles.faithText}>
                  "Whatever you do, work at it with all your heart, as working for the Lord" 
                  - Colossians 3:23
                </Text>
              </View>
            )}

            <View style={styles.tipContainer}>
              <Text style={styles.tipLabel}>💡 Pro Tip:</Text>
              <Text style={styles.tipText}>{currentStepData.tip}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Navigation */}
        <View style={styles.navigation}>
          <TouchableOpacity 
            onPress={handlePrevious}
            style={[styles.navButton, currentStep === 0 && styles.navButtonDisabled]}
            disabled={currentStep === 0}
          >
            <Text style={[styles.navButtonText, currentStep === 0 && styles.navButtonTextDisabled]}>
              Previous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
            <Text style={styles.nextButtonText}>
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  stepCounter: {
    fontSize: 16,
    color: '#9ca3af',
    fontWeight: '600',
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    fontSize: 16,
    color: '#f97316',
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: 40,
  },
  progressBackground: {
    height: 4,
    backgroundColor: '#374151',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#f97316',
    borderRadius: 2,
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 18,
    color: '#d1d5db',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 24,
  },
  faithBanner: {
    backgroundColor: '#1f2937',
    borderLeftColor: '#f97316',
    borderLeftWidth: 4,
    padding: 16,
    marginBottom: 24,
    borderRadius: 8,
  },
  faithText: {
    fontSize: 14,
    color: '#f3f4f6',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 20,
  },
  tipContainer: {
    backgroundColor: '#0f172a',
    padding: 16,
    borderRadius: 12,
    borderColor: '#334155',
    borderWidth: 1,
    width: '100%',
  },
  tipLabel: {
    fontSize: 14,
    color: '#f97316',
    fontWeight: '600',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 0,
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderColor: '#374151',
    borderWidth: 1,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  navButtonTextDisabled: {
    color: '#6b7280',
  },
  nextButton: {
    backgroundColor: '#f97316',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  nextButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default WelcomeGuide;

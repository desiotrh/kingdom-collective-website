/**
 * Kingdom Studios Lead Magnet Builder Screen
 * Create compelling lead magnets with AI assistance and opt-in integration
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
  Dimensions,
  Modal,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { useFaithMode } from '../contexts/FaithModeContext';
import { KingdomColors, KingdomShadows } from '../constants/KingdomColors';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface LeadMagnetTemplate {
  id: string;
  name: string;
  type: 'ebook' | 'checklist' | 'guide' | 'workbook' | 'video' | 'audio' | 'template';
  icon: string;
  description: string;
  faithModeTitle?: string;
  faithModeDescription?: string;
  estimatedConversion: number;
  difficulty: 'easy' | 'medium' | 'advanced';
  timeToCreate: string;
}

interface LeadMagnetData {
  title: string;
  description: string;
  template: string;
  targetAudience: string;
  painPoint: string;
  solution: string;
  valueProposition: string;
  callToAction: string;
  emailIntegration: {
    provider: string;
    listId: string;
    welcomeEmail: boolean;
    autoResponderSequence: boolean;
  };
  landingPage: {
    headline: string;
    subheadline: string;
    benefits: string[];
    socialProof: string;
    design: string;
  };
  deliveryMethod: 'email' | 'download' | 'membership';
  isPublic: boolean;
}

const LEAD_MAGNET_TEMPLATES: LeadMagnetTemplate[] = [
  {
    id: 'prayer_guide',
    name: 'Prayer Guide',
    type: 'guide',
    icon: '🙏',
    description: 'Step-by-step prayer and meditation guides',
    faithModeTitle: 'Prayer & Devotion Guide',
    faithModeDescription: 'Create powerful prayer guides that draw hearts closer to God',
    estimatedConversion: 25,
    difficulty: 'easy',
    timeToCreate: '30 min',
  },
  {
    id: 'business_checklist',
    name: 'Business Checklist',
    type: 'checklist',
    icon: '✅',
    description: 'Actionable checklists for business growth',
    faithModeTitle: 'Kingdom Business Checklist',
    faithModeDescription: 'Help entrepreneurs build businesses that honor God',
    estimatedConversion: 30,
    difficulty: 'easy',
    timeToCreate: '20 min',
  },
  {
    id: 'content_calendar',
    name: 'Content Calendar',
    type: 'template',
    icon: '📅',
    description: 'Pre-made content calendars and planning templates',
    faithModeTitle: 'Faith-Driven Content Calendar',
    faithModeDescription: 'Plan content that spreads God\'s love and truth',
    estimatedConversion: 35,
    difficulty: 'medium',
    timeToCreate: '45 min',
  },
  {
    id: 'ebook',
    name: 'Mini eBook',
    type: 'ebook',
    icon: '📖',
    description: 'Comprehensive guides and educational content',
    faithModeTitle: 'Faith-Based eBook',
    faithModeDescription: 'Share wisdom and biblical insights through written content',
    estimatedConversion: 40,
    difficulty: 'advanced',
    timeToCreate: '2-3 hours',
  },
  {
    id: 'video_series',
    name: 'Video Series',
    type: 'video',
    icon: '🎬',
    description: 'Educational video content and mini-courses',
    faithModeTitle: 'Teaching Video Series',
    faithModeDescription: 'Create video teachings that inspire and educate',
    estimatedConversion: 45,
    difficulty: 'advanced',
    timeToCreate: '3-4 hours',
  },
  {
    id: 'workbook',
    name: 'Interactive Workbook',
    type: 'workbook',
    icon: '📝',
    description: 'Engaging workbooks with exercises and activities',
    faithModeTitle: 'Spiritual Growth Workbook',
    faithModeDescription: 'Guide others through transformative spiritual exercises',
    estimatedConversion: 35,
    difficulty: 'advanced',
    timeToCreate: '2-3 hours',
  },
];

const EMAIL_PROVIDERS = [
  { id: 'mailchimp', name: 'Mailchimp', icon: '🐵' },
  { id: 'convertkit', name: 'ConvertKit', icon: '📧' },
  { id: 'constant_contact', name: 'Constant Contact', icon: '📮' },
  { id: 'aweber', name: 'AWeber', icon: '📫' },
  { id: 'activecampaign', name: 'ActiveCampaign', icon: '⚡' },
  { id: 'custom', name: 'Custom Integration', icon: '🔧' },
];

const LeadMagnetBuilderScreen = () => {
  const navigation = useNavigation();
  const { faithMode } = useFaithMode();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<LeadMagnetTemplate | null>(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<LeadMagnetData>({
    title: '',
    description: '',
    template: '',
    targetAudience: '',
    painPoint: '',
    solution: '',
    valueProposition: '',
    callToAction: '',
    emailIntegration: {
      provider: '',
      listId: '',
      welcomeEmail: true,
      autoResponderSequence: false,
    },
    landingPage: {
      headline: '',
      subheadline: '',
      benefits: [],
      socialProof: '',
      design: 'modern',
    },
    deliveryMethod: 'email',
    isPublic: true,
  });

  const currentColors = faithMode ? KingdomColors.faith : KingdomColors.encouragement;
  const totalSteps = 4;

  const handleTemplateSelect = (template: LeadMagnetTemplate) => {
    setSelectedTemplate(template);
    setFormData(prev => ({ 
      ...prev, 
      template: template.id,
      title: faithMode ? (template.faithModeTitle || template.name) : template.name,
    }));
    setCurrentStep(2);
  };

  const generateAIContent = async (contentType: string) => {
    setLoading(true);
    try {
      // Simulate AI content generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const suggestions = {
        headline: faithMode 
          ? `Transform Your ${formData.targetAudience} Life with God's Wisdom`
          : `The Ultimate ${formData.targetAudience} Success Blueprint`,
        subheadline: faithMode
          ? `Discover biblical principles that lead to breakthrough and blessing`
          : `Join thousands who've already transformed their results`,
        benefits: faithMode
          ? [
              'Biblical wisdom for real-world challenges',
              'Prayer strategies that bring breakthrough',
              'Faith-based action steps',
              'Community support and accountability',
            ]
          : [
              'Proven strategies that work',
              'Step-by-step action plan',
              'Expert insights and tips',
              'Bonus resources included',
            ],
        valueProposition: faithMode
          ? `Join our community of faith-driven ${formData.targetAudience.toLowerCase()} who are walking in God's purpose and seeing His favor in their lives.`
          : `Get the same strategies that have helped thousands of ${formData.targetAudience.toLowerCase()} achieve their goals faster.`,
      };

      if (contentType === 'all') {
        setFormData(prev => ({
          ...prev,
          landingPage: {
            ...prev.landingPage,
            ...suggestions,
          },
          valueProposition: suggestions.valueProposition,
        }));
      }

      Alert.alert(
        'AI Content Generated! ✨',
        'Your lead magnet content has been optimized with AI suggestions. Review and customize as needed.',
        [{ text: 'Continue' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to generate AI content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLeadMagnet = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      Alert.alert('Missing Information', 'Please fill in the title and description.');
      return;
    }

    setLoading(true);
    try {
      // Simulate lead magnet creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        faithMode ? 'Lead Magnet Created! 🙏' : 'Lead Magnet Created! 🎉',
        faithMode 
          ? 'Your lead magnet has been created and is ready to help you serve others and grow God\'s kingdom!'
          : 'Your lead magnet has been created and is ready to start capturing leads!',
        [
          {
            text: 'Create Another',
            onPress: () => {
              setCurrentStep(1);
              setSelectedTemplate(null);
              setFormData({
                title: '',
                description: '',
                template: '',
                targetAudience: '',
                painPoint: '',
                solution: '',
                valueProposition: '',
                callToAction: '',
                emailIntegration: {
                  provider: '',
                  listId: '',
                  welcomeEmail: true,
                  autoResponderSequence: false,
                },
                landingPage: {
                  headline: '',
                  subheadline: '',
                  benefits: [],
                  socialProof: '',
                  design: 'modern',
                },
                deliveryMethod: 'email',
                isPublic: true,
              });
            }
          },
          {
            text: 'View Lead Magnets',
            onPress: () => navigation.goBack(),
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create lead magnet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderTemplateCard = (template: LeadMagnetTemplate) => (
    <TouchableOpacity
      key={template.id}
      style={[styles.templateCard, { borderColor: currentColors.border }]}
      onPress={() => handleTemplateSelect(template)}
    >
      <View style={styles.templateHeader}>
        <Text style={styles.templateIcon}>{template.icon}</Text>
        <View style={styles.templateBadges}>
          <View style={[styles.conversionBadge, { backgroundColor: currentColors.success + '20' }]}>
            <Text style={[styles.conversionText, { color: currentColors.success }]}>
              {template.estimatedConversion}%
            </Text>
          </View>
          <View style={[styles.difficultyBadge, { backgroundColor: 
            template.difficulty === 'easy' ? currentColors.success + '20' :
            template.difficulty === 'medium' ? currentColors.warning + '20' :
            currentColors.error + '20'
          }]}>
            <Text style={[styles.difficultyText, { color: 
              template.difficulty === 'easy' ? currentColors.success :
              template.difficulty === 'medium' ? currentColors.warning :
              currentColors.error
            }]}>
              {template.difficulty}
            </Text>
          </View>
        </View>
      </View>
      <Text style={[styles.templateName, { color: currentColors.text }]}>
        {faithMode ? (template.faithModeTitle || template.name) : template.name}
      </Text>
      <Text style={[styles.templateDescription, { color: currentColors.textSecondary }]}>
        {faithMode ? (template.faithModeDescription || template.description) : template.description}
      </Text>
      <View style={styles.templateFooter}>
        <Text style={[styles.timeEstimate, { color: currentColors.textSecondary }]}>
          ⏱️ {template.timeToCreate}
        </Text>
        <Ionicons name="arrow-forward" size={16} color={currentColors.primary} />
      </View>
    </TouchableOpacity>
  );

  const renderStep1 = () => (
    <ScrollView style={styles.stepContent}>
      <BlurView intensity={20} style={styles.introCard}>
        <LinearGradient colors={[currentColors.primary + '20', currentColors.accent + '10']} style={styles.introContent}>
          <Text style={[styles.introTitle, { color: currentColors.text }]}>
            {faithMode ? 'Build Kingdom-Focused Lead Magnets' : 'Create High-Converting Lead Magnets'}
          </Text>
          <Text style={[styles.introDescription, { color: currentColors.textSecondary }]}>
            {faithMode 
              ? 'Create valuable resources that serve others while growing your ministry reach. Choose a template that aligns with your calling.'
              : 'Build lead magnets that capture qualified leads and grow your audience. Choose from proven templates optimized for conversion.'
            }
          </Text>
        </LinearGradient>
      </BlurView>

      <Text style={[styles.sectionTitle, { color: currentColors.text }]}>
        Choose a Template
      </Text>
      
      <View style={styles.templatesGrid}>
        {LEAD_MAGNET_TEMPLATES.map(renderTemplateCard)}
      </View>
    </ScrollView>
  );

  const renderStep2 = () => (
    <ScrollView style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: currentColors.text }]}>
        Content & Audience
      </Text>

      <View style={styles.formSection}>
        <Text style={[styles.inputLabel, { color: currentColors.text }]}>Lead Magnet Title</Text>
        <TextInput
          style={[styles.input, { 
            borderColor: currentColors.border,
            color: currentColors.text,
            backgroundColor: currentColors.surface,
          }]}
          placeholder={faithMode ? "Enter your ministry resource title..." : "Enter your lead magnet title..."}
          placeholderTextColor={currentColors.textSecondary}
          value={formData.title}
          onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
        />
      </View>

      <View style={styles.formSection}>
        <Text style={[styles.inputLabel, { color: currentColors.text }]}>Description</Text>
        <TextInput
          style={[styles.textArea, { 
            borderColor: currentColors.border,
            color: currentColors.text,
            backgroundColor: currentColors.surface,
          }]}
          placeholder={faithMode 
            ? "Describe how this resource will help people grow in faith..."
            : "Describe the value and benefits of your lead magnet..."
          }
          placeholderTextColor={currentColors.textSecondary}
          value={formData.description}
          onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.formSection}>
        <Text style={[styles.inputLabel, { color: currentColors.text }]}>Target Audience</Text>
        <TextInput
          style={[styles.input, { 
            borderColor: currentColors.border,
            color: currentColors.text,
            backgroundColor: currentColors.surface,
          }]}
          placeholder={faithMode ? "e.g., Christian entrepreneurs, ministry leaders..." : "e.g., business owners, content creators..."}
          placeholderTextColor={currentColors.textSecondary}
          value={formData.targetAudience}
          onChangeText={(text) => setFormData(prev => ({ ...prev, targetAudience: text }))}
        />
      </View>

      <View style={styles.formSection}>
        <Text style={[styles.inputLabel, { color: currentColors.text }]}>Main Pain Point</Text>
        <TextInput
          style={[styles.input, { 
            borderColor: currentColors.border,
            color: currentColors.text,
            backgroundColor: currentColors.surface,
          }]}
          placeholder={faithMode ? "What spiritual or practical challenge does this address?" : "What problem does your lead magnet solve?"}
          placeholderTextColor={currentColors.textSecondary}
          value={formData.painPoint}
          onChangeText={(text) => setFormData(prev => ({ ...prev, painPoint: text }))}
        />
      </View>

      <TouchableOpacity
        style={[styles.aiButton, { backgroundColor: currentColors.primary }]}
        onPress={() => generateAIContent('suggestions')}
        disabled={loading}
      >
        <Ionicons name="sparkles" size={20} color={KingdomColors.white} />
        <Text style={styles.aiButtonText}>
          {loading ? 'Generating...' : 'Get AI Suggestions'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderStep3 = () => (
    <ScrollView style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: currentColors.text }]}>
        Landing Page Design
      </Text>

      <View style={styles.formSection}>
        <Text style={[styles.inputLabel, { color: currentColors.text }]}>Headline</Text>
        <TextInput
          style={[styles.input, { 
            borderColor: currentColors.border,
            color: currentColors.text,
            backgroundColor: currentColors.surface,
          }]}
          placeholder="Your compelling headline..."
          placeholderTextColor={currentColors.textSecondary}
          value={formData.landingPage.headline}
          onChangeText={(text) => setFormData(prev => ({ 
            ...prev, 
            landingPage: { ...prev.landingPage, headline: text }
          }))}
        />
      </View>

      <View style={styles.formSection}>
        <Text style={[styles.inputLabel, { color: currentColors.text }]}>Subheadline</Text>
        <TextInput
          style={[styles.input, { 
            borderColor: currentColors.border,
            color: currentColors.text,
            backgroundColor: currentColors.surface,
          }]}
          placeholder="Supporting description..."
          placeholderTextColor={currentColors.textSecondary}
          value={formData.landingPage.subheadline}
          onChangeText={(text) => setFormData(prev => ({ 
            ...prev, 
            landingPage: { ...prev.landingPage, subheadline: text }
          }))}
        />
      </View>

      <View style={styles.formSection}>
        <Text style={[styles.inputLabel, { color: currentColors.text }]}>Call to Action</Text>
        <TextInput
          style={[styles.input, { 
            borderColor: currentColors.border,
            color: currentColors.text,
            backgroundColor: currentColors.surface,
          }]}
          placeholder={faithMode ? "e.g., Get Your Free Prayer Guide" : "e.g., Download Your Free Guide"}
          placeholderTextColor={currentColors.textSecondary}
          value={formData.callToAction}
          onChangeText={(text) => setFormData(prev => ({ ...prev, callToAction: text }))}
        />
      </View>

      <View style={styles.formSection}>
        <Text style={[styles.inputLabel, { color: currentColors.text }]}>Value Proposition</Text>
        <TextInput
          style={[styles.textArea, { 
            borderColor: currentColors.border,
            color: currentColors.text,
            backgroundColor: currentColors.surface,
          }]}
          placeholder="Why should people download this?"
          placeholderTextColor={currentColors.textSecondary}
          value={formData.valueProposition}
          onChangeText={(text) => setFormData(prev => ({ ...prev, valueProposition: text }))}
          multiline
          numberOfLines={3}
        />
      </View>

      <TouchableOpacity
        style={[styles.aiButton, { backgroundColor: currentColors.accent }]}
        onPress={() => generateAIContent('all')}
        disabled={loading}
      >
        <Ionicons name="sparkles" size={20} color={KingdomColors.white} />
        <Text style={styles.aiButtonText}>
          {loading ? 'Optimizing...' : 'AI Optimize Content'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderStep4 = () => (
    <ScrollView style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: currentColors.text }]}>
        Email Integration & Delivery
      </Text>

      <View style={styles.formSection}>
        <Text style={[styles.inputLabel, { color: currentColors.text }]}>Email Provider</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.providersScroll}>
          {EMAIL_PROVIDERS.map((provider) => (
            <TouchableOpacity
              key={provider.id}
              style={[
                styles.providerCard,
                { borderColor: currentColors.border },
                formData.emailIntegration.provider === provider.id && {
                  borderColor: currentColors.primary,
                  backgroundColor: currentColors.primary + '20',
                }
              ]}
              onPress={() => setFormData(prev => ({
                ...prev,
                emailIntegration: { ...prev.emailIntegration, provider: provider.id }
              }))}
            >
              <Text style={styles.providerIcon}>{provider.icon}</Text>
              <Text style={[
                styles.providerName,
                { color: currentColors.text },
                formData.emailIntegration.provider === provider.id && { color: currentColors.primary }
              ]}>
                {provider.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.formSection}>
        <Text style={[styles.inputLabel, { color: currentColors.text }]}>Delivery Method</Text>
        <View style={styles.deliveryOptions}>
          {[
            { value: 'email', label: 'Email Delivery', icon: 'mail' },
            { value: 'download', label: 'Direct Download', icon: 'download' },
            { value: 'membership', label: 'Member Portal', icon: 'person' },
          ].map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.deliveryOption,
                { borderColor: currentColors.border },
                formData.deliveryMethod === option.value && {
                  borderColor: currentColors.primary,
                  backgroundColor: currentColors.primary + '20',
                }
              ]}
              onPress={() => setFormData(prev => ({ ...prev, deliveryMethod: option.value as any }))}
            >
              <Ionicons 
                name={option.icon as any} 
                size={20} 
                color={formData.deliveryMethod === option.value ? currentColors.primary : currentColors.text} 
              />
              <Text style={[
                styles.deliveryOptionText,
                { color: currentColors.text },
                formData.deliveryMethod === option.value && { color: currentColors.primary }
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.settingsSection}>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { color: currentColors.text }]}>Welcome Email</Text>
            <Text style={[styles.settingDescription, { color: currentColors.textSecondary }]}>
              Send an automated welcome email with the lead magnet
            </Text>
          </View>
          <Switch
            value={formData.emailIntegration.welcomeEmail}
            onValueChange={(value) => setFormData(prev => ({
              ...prev,
              emailIntegration: { ...prev.emailIntegration, welcomeEmail: value }
            }))}
            trackColor={{ false: currentColors.border, true: currentColors.primary }}
            thumbColor={formData.emailIntegration.welcomeEmail ? KingdomColors.white : currentColors.textSecondary}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { color: currentColors.text }]}>Auto-Responder Sequence</Text>
            <Text style={[styles.settingDescription, { color: currentColors.textSecondary }]}>
              Automatically enroll subscribers in a follow-up email sequence
            </Text>
          </View>
          <Switch
            value={formData.emailIntegration.autoResponderSequence}
            onValueChange={(value) => setFormData(prev => ({
              ...prev,
              emailIntegration: { ...prev.emailIntegration, autoResponderSequence: value }
            }))}
            trackColor={{ false: currentColors.border, true: currentColors.primary }}
            thumbColor={formData.emailIntegration.autoResponderSequence ? KingdomColors.white : currentColors.textSecondary}
          />
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentColors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={currentColors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: currentColors.text }]}>
          {faithMode ? 'Lead Magnet Ministry' : 'Lead Magnet Builder'}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { backgroundColor: currentColors.border }]}>
          <View style={[
            styles.progressFill,
            { 
              backgroundColor: currentColors.primary,
              width: `${(currentStep / totalSteps) * 100}%`,
            }
          ]} />
        </View>
        <Text style={[styles.progressText, { color: currentColors.textSecondary }]}>
          Step {currentStep} of {totalSteps}
        </Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </View>

      {/* Navigation */}
      {currentStep > 1 && (
        <View style={styles.navigation}>
          <TouchableOpacity
            style={[styles.navButton, styles.backNavButton, { borderColor: currentColors.border }]}
            onPress={() => setCurrentStep(currentStep - 1)}
          >
            <Text style={[styles.backNavText, { color: currentColors.text }]}>Previous</Text>
          </TouchableOpacity>

          {currentStep < totalSteps ? (
            <TouchableOpacity
              style={[styles.navButton, styles.nextButton, { backgroundColor: currentColors.primary }]}
              onPress={() => setCurrentStep(currentStep + 1)}
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.navButton, styles.createButton, { backgroundColor: currentColors.accent }]}
              onPress={handleCreateLeadMagnet}
              disabled={loading}
            >
              <Text style={styles.createButtonText}>
                {loading ? 'Creating...' : faithMode ? '🙏 Create Lead Magnet' : '🎉 Create Lead Magnet'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSpacer: {
    width: 40,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  stepContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  introCard: {
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
  },
  introContent: {
    padding: 24,
  },
  introTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  introDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  templatesGrid: {
    gap: 16,
    marginBottom: 20,
  },
  templateCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  templateIcon: {
    fontSize: 32,
  },
  templateBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  conversionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  conversionText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  templateName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  templateDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  templateFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeEstimate: {
    fontSize: 12,
  },
  formSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },
  aiButtonText: {
    color: KingdomColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  providersScroll: {
    flexDirection: 'row',
  },
  providerCard: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 12,
    minWidth: 100,
  },
  providerIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  providerName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  deliveryOptions: {
    gap: 12,
  },
  deliveryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
  },
  deliveryOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingsSection: {
    marginTop: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
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
  navigation: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  navButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  backNavButton: {
    borderWidth: 1,
  },
  backNavText: {
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    // Color set dynamically
  },
  nextButtonText: {
    color: KingdomColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  createButton: {
    // Color set dynamically
  },
  createButtonText: {
    color: KingdomColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LeadMagnetBuilderScreen;

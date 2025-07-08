import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppNavigation } from '../../utils/navigationUtils';
import { useFaithMode } from '../../contexts/FaithModeContext';
import { useAuth } from '../../contexts/AuthContext';
import { KingdomColors, KingdomShadows } from '../../constants/KingdomColors';
import KingdomLogo from '../../components/KingdomLogo';
import contentGenerationService, { GeneratedContent } from '../../services/contentGenerationService';
import advancedAnalyticsService from '../../services/advancedAnalyticsService';

const { width } = Dimensions.get('window');

interface AIStudioModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  gradient: string[];
  route: string;
  faithMode?: {
    title: string;
    description: string;
  };
}

const AIStudioScreen: React.FC = () => {
  const navigation = useAppNavigation();
  const { faithMode } = useFaithMode();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showQuickGenerate, setShowQuickGenerate] = useState(false);
  const [quickPrompt, setQuickPrompt] = useState('');
  const [quickType, setQuickType] = useState<'social' | 'email' | 'hashtags' | 'seo'>('social');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);

  const aiModules: AIStudioModule[] = [
    {
      id: 'social-media',
      title: faithMode ? 'Kingdom Content Creator' : 'Social Media Generator',
      description: faithMode 
        ? 'Generate powerful Kingdom-focused content for Instagram, TikTok, and more' 
        : 'Create engaging social media content, captions, and hooks',
      icon: '📱',
      gradient: [KingdomColors.primary.royalPurple, KingdomColors.gold.bright],
      route: 'SocialMediaGenerator',
      faithMode: {
        title: 'Kingdom Content Creator',
        description: 'Generate powerful Kingdom-focused content for Instagram, TikTok, and more'
      }
    },
    {
      id: 'tshirt-designs',
      title: faithMode ? 'Faith-Based Design Generator' : 'T-Shirt Design AI',
      description: faithMode 
        ? 'Create inspiring Christian t-shirt designs with AI' 
        : 'Generate custom t-shirt designs with AI-powered prompts',
      icon: '👕',
      gradient: [KingdomColors.gold.warm, KingdomColors.primary.deepNavy],
      route: 'TShirtDesigner',
      faithMode: {
        title: 'Faith-Based Design Generator',
        description: 'Create inspiring Christian t-shirt designs with AI'
      }
    },
    {
      id: 'email-sequences',
      title: faithMode ? 'Ministry Email Builder' : 'Email Sequence Builder',
      description: faithMode 
        ? 'Craft compelling email sequences for your ministry audience' 
        : 'Build automated email sequences that convert',
      icon: '📧',
      gradient: [KingdomColors.accent.info, KingdomColors.silver.bright],
      route: 'EmailSequencer',
      faithMode: {
        title: 'Ministry Email Builder',
        description: 'Craft compelling email sequences for your ministry audience'
      }
    },
    {
      id: 'seo-planner',
      title: faithMode ? 'Kingdom SEO Strategist' : 'SEO Content Planner',
      description: faithMode 
        ? 'Optimize your Kingdom content for search engines' 
        : 'Plan and optimize content for better search rankings',
      icon: '🔍',
      gradient: [KingdomColors.accent.success, KingdomColors.primary.midnight],
      route: 'SEOPlanner',
      faithMode: {
        title: 'Kingdom SEO Strategist',
        description: 'Optimize your Kingdom content for search engines'
      }
    },
    {
      id: 'hashtag-helper',
      title: faithMode ? 'Faith Hashtag Generator' : 'Hashtag Research Tool',
      description: faithMode 
        ? 'Discover trending faith-based hashtags for maximum reach' 
        : 'Find the best hashtags for your content strategy',
      icon: '#️⃣',
      gradient: [KingdomColors.gold.amber, KingdomColors.primary.royalPurple],
      route: 'HashtagHelper',
      faithMode: {
        title: 'Faith Hashtag Generator',
        description: 'Discover trending faith-based hashtags for maximum reach'
      }
    },
    {
      id: 'script-writer',
      title: faithMode ? 'Sermon & Teaching Scripts' : 'Video Script Writer',
      description: faithMode 
        ? 'Generate powerful sermon outlines and teaching scripts' 
        : 'Create engaging video scripts for any platform',
      icon: '🎬',
      gradient: [KingdomColors.primary.deepNavy, KingdomColors.gold.bright],
      route: 'ScriptWriter',
      faithMode: {
        title: 'Sermon & Teaching Scripts',
        description: 'Generate powerful sermon outlines and teaching scripts'
      }
    },
    {
      id: 'quick-generate',
      title: faithMode ? 'Quick Kingdom Content' : 'Quick Content Generator',
      description: faithMode 
        ? 'Generate inspiring Kingdom content in seconds' 
        : 'Generate any type of content quickly with AI',
      icon: '⚡',
      gradient: [KingdomColors.gold.bright, KingdomColors.primary.royalPurple],
      route: 'QuickGenerate',
      faithMode: {
        title: 'Quick Kingdom Content',
        description: 'Generate inspiring Kingdom content in seconds'
      }
    },
  ];

  const handleModulePress = (module: AIStudioModule) => {
    if (module.id === 'quick-generate') {
      setShowQuickGenerate(true);
    } else {
      Alert.alert(
        'Coming Soon!',
        `${module.title} will be available in the next update.`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleQuickGenerate = async () => {
    if (!quickPrompt.trim()) {
      Alert.alert('Error', 'Please enter a prompt for content generation.');
      return;
    }

    setLoading(true);
    try {
      // Enhanced prompt with faith-mode context
      const enhancedPrompt = faithMode 
        ? `As a Kingdom-minded creator, ${quickPrompt}. Please create content that honors God and serves my audience with excellence.`
        : quickPrompt;

      const content = await contentGenerationService.generateContent(
        enhancedPrompt,
        quickType,
        {
          faithMode,
          tone: faithMode ? 'inspirational' : 'professional',
        }
      );
      setGeneratedContent(content);
      
      // Track usage for analytics
      if (user) {
        await advancedAnalyticsService.trackContentGeneration(quickType, faithMode, true);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate content';
      Alert.alert(
        'Generation Error', 
        `${errorMessage}\n\nTip: Check your API configuration in settings or try a simpler prompt.`,
        [
          { text: 'OK' },
          { 
            text: 'Check Settings', 
            onPress: () => navigation.navigate('Settings') 
          }
        ]
      );
      console.error('Content generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    // Implementation would use Clipboard API
    Alert.alert('Copied!', 'Content copied to clipboard.');
  };

  const renderAIModule = (module: AIStudioModule) => (
    <TouchableOpacity
      key={module.id}
      style={styles.moduleCard}
      onPress={() => handleModulePress(module)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={module.gradient as [string, string]}
        style={styles.moduleGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.moduleContent}>
          <View style={styles.moduleIcon}>
            <Text style={styles.moduleIconText}>{module.icon}</Text>
          </View>
          <View style={styles.moduleInfo}>
            <Text style={styles.moduleTitle}>
              {faithMode && module.faithMode ? module.faithMode.title : module.title}
            </Text>
            <Text style={styles.moduleDescription}>
              {faithMode && module.faithMode ? module.faithMode.description : module.description}
            </Text>
          </View>
          <View style={styles.moduleArrow}>
            <Text style={styles.arrowText}>→</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[KingdomColors.background.primary, KingdomColors.background.secondary]}
        style={styles.backgroundGradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <KingdomLogo size="medium" />
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>
              {faithMode ? '⚡ Kingdom AI Studio' : '🤖 AI Content Studio'}
            </Text>
            <Text style={styles.headerSubtitle}>
              {faithMode 
                ? 'Powered by AI, Inspired by the Kingdom' 
                : 'Replace GPT, Jasper & More'}
            </Text>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <LinearGradient
            colors={[KingdomColors.primary.royalPurple, KingdomColors.gold.bright]}
            style={styles.statsGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.statsContent}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>47</Text>
                <Text style={styles.statLabel}>
                  {faithMode ? 'Kingdom Posts' : 'AI Generations'}
                </Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>2.3M</Text>
                <Text style={styles.statLabel}>
                  {faithMode ? 'Souls Reached' : 'Total Reach'}
                </Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>94%</Text>
                <Text style={styles.statLabel}>
                  {faithMode ? 'Kingdom Impact' : 'Engagement Rate'}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* AI Modules */}
        <ScrollView 
          style={styles.modulesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.modulesContent}
        >
          <Text style={styles.sectionTitle}>
            {faithMode ? '👑 Kingdom AI Tools' : '🚀 AI-Powered Tools'}
          </Text>
          <Text style={styles.sectionSubtitle}>
            {faithMode 
              ? 'Create Kingdom content that moves hearts and builds the Church' 
              : 'Professional content creation tools powered by advanced AI'}
          </Text>

          {aiModules.map(renderAIModule)}

          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity style={styles.quickActionCard}>
                <Text style={styles.quickActionIcon}>✨</Text>
                <Text style={styles.quickActionText}>
                  {faithMode ? 'Daily Scripture Post' : 'Quick Caption'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionCard}>
                <Text style={styles.quickActionIcon}>🎯</Text>
                <Text style={styles.quickActionText}>
                  {faithMode ? 'Prayer Request' : 'Trending Topic'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionCard}>
                <Text style={styles.quickActionIcon}>🔥</Text>
                <Text style={styles.quickActionText}>
                  {faithMode ? 'Testimony Share' : 'Viral Hook'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionCard}>
                <Text style={styles.quickActionIcon}>📈</Text>
                <Text style={styles.quickActionText}>
                  {faithMode ? 'Kingdom Strategy' : 'Growth Hack'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Quick Generate Modal */}
        <Modal
          visible={showQuickGenerate}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowQuickGenerate(false)}
        >
          <SafeAreaView style={styles.modalContainer}>
            <LinearGradient
              colors={[KingdomColors.background.primary, KingdomColors.background.secondary]}
              style={styles.modalGradient}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {faithMode ? '⚡ Quick Kingdom Content' : '⚡ Quick AI Generator'}
                </Text>
                <TouchableOpacity
                  onPress={() => setShowQuickGenerate(false)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalContent}>
                <View style={styles.generatorSection}>
                  <Text style={styles.inputLabel}>Content Type</Text>
                  <View style={styles.typeSelector}>
                    {['social', 'email', 'hashtags', 'seo'].map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.typeButton,
                          quickType === type && styles.typeButtonActive
                        ]}
                        onPress={() => setQuickType(type as typeof quickType)}
                      >
                        <Text style={[
                          styles.typeButtonText,
                          quickType === type && styles.typeButtonTextActive
                        ]}>
                          {type.toUpperCase()}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={styles.inputLabel}>Your Prompt</Text>
                  <TextInput
                    style={styles.promptInput}
                    placeholder={faithMode 
                      ? "e.g., 'Create an inspiring post about God's faithfulness'"
                      : "e.g., 'Create a motivational post about achieving goals'"
                    }
                    placeholderTextColor={KingdomColors.text.secondary}
                    value={quickPrompt}
                    onChangeText={setQuickPrompt}
                    multiline
                    numberOfLines={4}
                  />

                  <TouchableOpacity
                    style={[styles.generateButton, loading && styles.generateButtonDisabled]}
                    onPress={handleQuickGenerate}
                    disabled={loading}
                  >
                    <LinearGradient
                      colors={[KingdomColors.gold.bright, KingdomColors.primary.royalPurple]}
                      style={styles.generateButtonGradient}
                    >
                      <Text style={styles.generateButtonText}>
                        {loading ? 'Generating...' : 'Generate Content'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                {generatedContent && (
                  <View style={styles.resultSection}>
                    <Text style={styles.resultTitle}>Generated Content</Text>
                    <View style={styles.resultCard}>
                      <Text style={styles.resultContent}>{generatedContent.content}</Text>
                      
                      {generatedContent.hashtags && (
                        <View style={styles.hashtagSection}>
                          <Text style={styles.hashtagTitle}>Suggested Hashtags:</Text>
                          <Text style={styles.hashtagText}>
                            {generatedContent.hashtags.join(' ')}
                          </Text>
                        </View>
                      )}
                      
                      {generatedContent.callToAction && (
                        <View style={styles.ctaSection}>
                          <Text style={styles.ctaTitle}>Call to Action:</Text>
                          <Text style={styles.ctaText}>{generatedContent.callToAction}</Text>
                        </View>
                      )}

                      <TouchableOpacity
                        style={styles.copyButton}
                        onPress={() => copyToClipboard(generatedContent.content)}
                      >
                        <Text style={styles.copyButtonText}>📋 Copy to Clipboard</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </ScrollView>
            </LinearGradient>
          </SafeAreaView>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: KingdomColors.background.primary,
  },
  backgroundGradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerContent: {
    marginLeft: 12,
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    marginTop: 2,
  },
  statsContainer: {
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 16,
    overflow: 'hidden',
    ...KingdomShadows.medium,
  },
  statsGradient: {
    padding: 20,
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.white,
  },
  statLabel: {
    fontSize: 12,
    color: KingdomColors.white,
    marginTop: 4,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: KingdomColors.opacity.white20,
    marginHorizontal: 10,
  },
  modulesContainer: {
    flex: 1,
  },
  modulesContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  moduleCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    ...KingdomShadows.medium,
  },
  moduleGradient: {
    padding: 20,
  },
  moduleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moduleIcon: {
    width: 50,
    height: 50,
    backgroundColor: KingdomColors.opacity.white20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleIconText: {
    fontSize: 20,
  },
  moduleInfo: {
    flex: 1,
    marginLeft: 16,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: KingdomColors.white,
    marginBottom: 4,
  },
  moduleDescription: {
    fontSize: 14,
    color: KingdomColors.white,
    opacity: 0.9,
    lineHeight: 18,
  },
  moduleArrow: {
    width: 30,
    height: 30,
    backgroundColor: KingdomColors.opacity.white20,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontSize: 16,
    color: KingdomColors.white,
    fontWeight: 'bold',
  },
  quickActionsContainer: {
    marginTop: 32,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: (width - 60) / 2,
    backgroundColor: KingdomColors.background.secondary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: KingdomColors.gray,
    ...KingdomShadows.small,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: KingdomColors.text.primary,
    textAlign: 'center',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: KingdomColors.background.primary,
  },
  modalGradient: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: KingdomColors.gray,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: KingdomColors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: KingdomColors.text.primary,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  generatorSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.text.primary,
    marginBottom: 12,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: KingdomColors.background.secondary,
    borderRadius: 12,
    padding: 4,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: KingdomColors.gold.bright,
  },
  typeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: KingdomColors.text.secondary,
  },
  typeButtonTextActive: {
    color: KingdomColors.background.primary,
  },
  promptInput: {
    backgroundColor: KingdomColors.background.secondary,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: KingdomColors.text.primary,
    textAlignVertical: 'top',
    marginBottom: 20,
    minHeight: 100,
    borderWidth: 1,
    borderColor: KingdomColors.gray,
  },
  generateButton: {
    borderRadius: 12,
    overflow: 'hidden',
    ...KingdomShadows.medium,
  },
  generateButtonDisabled: {
    opacity: 0.6,
  },
  generateButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: KingdomColors.white,
  },
  resultSection: {
    marginTop: 24,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 16,
  },
  resultCard: {
    backgroundColor: KingdomColors.background.secondary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: KingdomColors.gray,
  },
  resultContent: {
    fontSize: 14,
    color: KingdomColors.text.primary,
    lineHeight: 20,
    marginBottom: 16,
  },
  hashtagSection: {
    marginBottom: 16,
  },
  hashtagTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.gold.bright,
    marginBottom: 8,
  },
  hashtagText: {
    fontSize: 12,
    color: KingdomColors.text.secondary,
    lineHeight: 18,
  },
  ctaSection: {
    marginBottom: 16,
  },
  ctaTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.gold.bright,
    marginBottom: 8,
  },
  ctaText: {
    fontSize: 12,
    color: KingdomColors.text.secondary,
    lineHeight: 18,
  },
  copyButton: {
    backgroundColor: KingdomColors.primary.royalPurple,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  copyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.white,
  },
});

export default AIStudioScreen;

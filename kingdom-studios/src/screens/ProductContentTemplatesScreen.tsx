import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Modal,
  FlatList,
  Image,
  Share,
  Clipboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { KingdomColors } from '../constants/KingdomColors';
import { useAuth } from '../contexts/UnifiedAuthContext';
import { AppMode } from '../types/spiritual';

interface ContentTemplate {
  id: string;
  name: string;
  category: 'email' | 'social' | 'ad' | 'blog' | 'landing' | 'product';
  description: string;
  variables: string[];
  template: string;
  aiGenerated: boolean;
  usageCount: number;
  tags: string[];
  thumbnail?: string;
  faithMode?: {
    verseIntegration: boolean;
    ministryFocus: boolean;
    evangelistic: boolean;
    discipleship: boolean;
  };
  encouragementMode?: {
    motivational: boolean;
    empowerment: boolean;
    successFocus: boolean;
    growthMindset: boolean;
  };
}

interface GeneratedContent {
  id: string;
  templateId: string;
  content: string;
  variables: Record<string, string>;
  platform: string;
  createdAt: string;
  performance?: {
    views: number;
    engagement: number;
    conversions: number;
  };
}

interface ProductInfo {
  name: string;
  description: string;
  price: string;
  benefits: string[];
  targetAudience: string;
  callToAction: string;
}

const ProductContentTemplatesScreen: React.FC = () => {
  const { user } = useAuth();
  const [mode, setMode] = useState<AppMode>('faith');
  const [activeTab, setActiveTab] = useState<'templates' | 'generator' | 'library' | 'analytics'>('templates');
  const [templates, setTemplates] = useState<ContentTemplate[]>([]);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isGeneratorModalVisible, setIsGeneratorModalVisible] = useState(false);
  const [productInfo, setProductInfo] = useState<ProductInfo>({
    name: '',
    description: '',
    price: '',
    benefits: [],
    targetAudience: '',
    callToAction: '',
  });
  const [templateVariables, setTemplateVariables] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const categories = [
    'all',
    'email',
    'social',
    'ad',
    'blog',
    'landing',
    'product',
  ];

  useEffect(() => {
    loadTemplates();
    loadGeneratedContent();
  }, [mode]);

  const loadTemplates = () => {
    // Mock data - in real app, this would come from Firebase/API
    const mockTemplates: ContentTemplate[] = mode === 'faith' ? [
      {
        id: '1',
        name: 'Faith-Based Product Launch Email',
        category: 'email',
        description: 'Launch your Christian product with purpose and biblical principles',
        variables: ['productName', 'verseReference', 'personalTestimony', 'callToAction'],
        template: `🙏 **{productName}** - A Gift from Above\n\nDear faithful friend,\n\n"For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, to give you hope and a future." - {verseReference}\n\n{personalTestimony}\n\nI'm excited to share {productName} with you - a resource I've prayerfully created to help you grow in your faith journey.\n\n✨ Key Benefits:\n• Deepen your relationship with God\n• Find practical wisdom for daily life\n• Connect with like-minded believers\n\n{callToAction}\n\nBlessings and love,\n[Your Name]`,
        aiGenerated: true,
        usageCount: 234,
        tags: ['product-launch', 'email', 'biblical', 'testimony'],
        faithMode: {
          verseIntegration: true,
          ministryFocus: true,
          evangelistic: false,
          discipleship: true,
        },
      },
      {
        id: '2',
        name: 'Ministry Social Media Post',
        category: 'social',
        description: 'Share your faith-based product on social media with impact',
        variables: ['productName', 'keyBenefit', 'hashtags', 'linkInBio'],
        template: `🕊️ Excited to share {productName} with you all!\n\n{keyBenefit}\n\nThis has been such a blessing in my own walk with the Lord, and I believe it will be for you too! 🙌\n\nLink in bio ➡️ {linkInBio}\n\n{hashtags} #FaithBased #ChristianLife #Blessed`,
        aiGenerated: true,
        usageCount: 189,
        tags: ['social-media', 'instagram', 'facebook', 'ministry'],
        faithMode: {
          verseIntegration: false,
          ministryFocus: true,
          evangelistic: true,
          discipleship: false,
        },
      },
      {
        id: '3',
        name: 'Christian Course Sales Page',
        category: 'landing',
        description: 'Complete landing page copy for faith-based courses',
        variables: ['courseName', 'transformation', 'modules', 'price', 'bonuses'],
        template: `# Transform Your Faith Journey with {courseName}\n\n## Are you ready to {transformation}?\n\nThis isn't just another course - it's a God-ordained journey to help you:\n\n✅ {modules}\n✅ Develop unshakeable faith\n✅ Find your kingdom purpose\n✅ Live abundantly in Christ\n\n### What You'll Receive:\n{bonuses}\n\n**Investment:** Only {price}\n\n*"Trust in the Lord with all your heart and lean not on your own understanding." - Proverbs 3:5*\n\n[ENROLL NOW - Limited Time]`,
        aiGenerated: true,
        usageCount: 156,
        tags: ['sales-page', 'course', 'landing-page', 'conversion'],
        faithMode: {
          verseIntegration: true,
          ministryFocus: true,
          evangelistic: false,
          discipleship: true,
        },
      },
    ] : [
      {
        id: '4',
        name: 'Empowerment Product Launch Email',
        category: 'email',
        description: 'Launch your empowerment product with confidence and impact',
        variables: ['productName', 'transformation', 'personalStory', 'callToAction'],
        template: `💪 **{productName}** - Your Journey to Transformation Starts Now\n\nHey Powerful Soul,\n\n{personalStory}\n\nI created {productName} because I believe in your potential to {transformation}.\n\n🚀 Inside You'll Discover:\n• Proven strategies for success\n• Mindset shifts that change everything\n• Tools to unlock your potential\n• Community of like-minded achievers\n\n{callToAction}\n\nTo your success,\n[Your Name]\n\nP.S. You've got this! 💫`,
        aiGenerated: true,
        usageCount: 298,
        tags: ['product-launch', 'email', 'empowerment', 'transformation'],
        encouragementMode: {
          motivational: true,
          empowerment: true,
          successFocus: true,
          growthMindset: true,
        },
      },
      {
        id: '5',
        name: 'Success Mindset Social Post',
        category: 'social',
        description: 'Motivational social media content that converts',
        variables: ['productName', 'successTip', 'callToAction', 'hashtags'],
        template: `✨ SUCCESS TIP: {successTip}\n\nThis is exactly what I teach in {productName} - the mindset shifts that separate dreamers from achievers! 🔥\n\nReady to level up? {callToAction}\n\n👆 Double tap if this resonates!\n\n{hashtags} #SuccessMindset #Empowerment #LevelUp #BossLife`,
        aiGenerated: true,
        usageCount: 445,
        tags: ['social-media', 'success', 'mindset', 'motivation'],
        encouragementMode: {
          motivational: true,
          empowerment: true,
          successFocus: true,
          growthMindset: true,
        },
      },
      {
        id: '6',
        name: 'Business Growth Course Sales Page',
        category: 'landing',
        description: 'High-converting sales page for business and personal growth',
        variables: ['courseName', 'painPoint', 'solution', 'modules', 'price'],
        template: `# Stop Struggling with {painPoint} - Start Thriving with {courseName}\n\n## The Solution You've Been Searching For\n\n{solution}\n\n### Here's What You'll Master:\n{modules}\n\n### The Complete System Includes:\n✅ Step-by-step video training\n✅ Workbooks and templates\n✅ Private community access\n✅ Live monthly coaching calls\n✅ 30-day money-back guarantee\n\n**Investment:** {price}\n\n*"Your potential is endless. Your time is now."*\n\n[CLAIM YOUR SPOT - Only 100 Available]`,
        aiGenerated: true,
        usageCount: 267,
        tags: ['sales-page', 'business', 'growth', 'conversion'],
        encouragementMode: {
          motivational: true,
          empowerment: true,
          successFocus: true,
          growthMindset: true,
        },
      },
    ];

    setTemplates(mockTemplates);
  };

  const loadGeneratedContent = () => {
    // Mock generated content
    const mockContent: GeneratedContent[] = [
      {
        id: '1',
        templateId: '1',
        content: `🙏 **Prayer Journal Pro** - A Gift from Above\n\nDear faithful friend,\n\n"For I know the plans I have for you," declares the Lord...`,
        variables: {
          productName: 'Prayer Journal Pro',
          verseReference: 'Jeremiah 29:11',
          personalTestimony: 'This journal transformed my prayer life completely...',
          callToAction: 'Get your copy today for just $29',
        },
        platform: 'Email',
        createdAt: '2024-06-28',
        performance: {
          views: 1250,
          engagement: 8.5,
          conversions: 45,
        },
      },
    ];

    setGeneratedContent(mockContent);
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const generateContent = async () => {
    if (!selectedTemplate || !productInfo.name) {
      Alert.alert('Error', 'Please select a template and fill in product information');
      return;
    }

    setIsGenerating(true);

    // Simulate AI content generation
    setTimeout(() => {
      let generatedText = selectedTemplate.template;
      
      // Replace variables with actual values
      Object.entries(templateVariables).forEach(([key, value]) => {
        generatedText = generatedText.replace(new RegExp(`{${key}}`, 'g'), value);
      });

      // Add product info
      generatedText = generatedText.replace('{productName}', productInfo.name);
      if (productInfo.description) {
        generatedText = generatedText.replace('{description}', productInfo.description);
      }
      if (productInfo.price) {
        generatedText = generatedText.replace('{price}', productInfo.price);
      }

      const newContent: GeneratedContent = {
        id: Date.now().toString(),
        templateId: selectedTemplate.id,
        content: generatedText,
        variables: { ...templateVariables, productName: productInfo.name },
        platform: selectedTemplate.category,
        createdAt: new Date().toISOString(),
      };

      setGeneratedContent(prev => [newContent, ...prev]);
      setIsGenerating(false);
      setIsGeneratorModalVisible(false);
      setTemplateVariables({});
      setProductInfo({
        name: '',
        description: '',
        price: '',
        benefits: [],
        targetAudience: '',
        callToAction: '',
      });

      Alert.alert('Success!', 'Your content has been generated and saved to your library.');
    }, 2000);
  };

  const copyToClipboard = async (content: string) => {
    await Clipboard.setString(content);
    Alert.alert('Copied!', 'Content copied to clipboard');
  };

  const shareContent = async (content: string) => {
    try {
      await Share.share({
        message: content,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const renderTemplateCard = ({ item: template }: { item: ContentTemplate }) => (
    <View style={styles.templateCard}>
      <View style={styles.templateHeader}>
        <View style={styles.templateInfo}>
          <Text style={styles.templateName}>{template.name}</Text>
          <Text style={styles.templateDescription}>{template.description}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{template.category.toUpperCase()}</Text>
          </View>
        </View>
        <View style={styles.templateStats}>
          <Text style={styles.usageCount}>{template.usageCount}</Text>
          <Text style={styles.usageLabel}>uses</Text>
        </View>
      </View>

      <View style={styles.templateTags}>
        {template.tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      <View style={styles.templateActions}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            setSelectedTemplate(template);
            setIsGeneratorModalVisible(true);
          }}
        >
          <Text style={styles.primaryButtonText}>Use Template</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton}>
          <Ionicons name="eye-outline" size={16} color={KingdomColors.gold.bright} />
          <Text style={styles.secondaryButtonText}>Preview</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderGeneratedContent = ({ item: content }: { item: GeneratedContent }) => {
    const template = templates.find(t => t.id === content.templateId);
    
    return (
      <View style={styles.contentCard}>
        <View style={styles.contentHeader}>
          <View style={styles.contentInfo}>
            <Text style={styles.contentTemplate}>{template?.name}</Text>
            <Text style={styles.contentPlatform}>{content.platform}</Text>
            <Text style={styles.contentDate}>{new Date(content.createdAt).toLocaleDateString()}</Text>
          </View>
          <View style={styles.contentActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => copyToClipboard(content.content)}
            >
              <Ionicons name="copy-outline" size={20} color={KingdomColors.gold.bright} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => shareContent(content.content)}
            >
              <Ionicons name="share-outline" size={20} color={KingdomColors.gold.bright} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.contentPreview} numberOfLines={4}>
          {content.content}
        </Text>

        {content.performance && (
          <View style={styles.performanceStats}>
            <View style={styles.performanceStat}>
              <Text style={styles.performanceValue}>{content.performance.views}</Text>
              <Text style={styles.performanceLabel}>Views</Text>
            </View>
            <View style={styles.performanceStat}>
              <Text style={styles.performanceValue}>{content.performance.engagement}%</Text>
              <Text style={styles.performanceLabel}>Engagement</Text>
            </View>
            <View style={styles.performanceStat}>
              <Text style={styles.performanceValue}>{content.performance.conversions}</Text>
              <Text style={styles.performanceLabel}>Conversions</Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderAnalytics = () => {
    const totalTemplates = templates.length;
    const totalGenerated = generatedContent.length;
    const totalViews = generatedContent.reduce((sum, content) => sum + (content.performance?.views || 0), 0);
    const avgEngagement = generatedContent.length > 0 
      ? generatedContent.reduce((sum, content) => sum + (content.performance?.engagement || 0), 0) / generatedContent.length
      : 0;

    return (
      <ScrollView style={styles.analyticsContainer}>
        <View style={styles.analyticsHeader}>
          <Text style={styles.analyticsTitle}>
            {mode === 'faith' ? '📊 Ministry Content Analytics' : '📈 Content Performance'}
          </Text>
        </View>

        <View style={styles.analyticsGrid}>
          <View style={styles.analyticsCard}>
            <Text style={styles.analyticsValue}>{totalTemplates}</Text>
            <Text style={styles.analyticsLabel}>Available Templates</Text>
          </View>
          <View style={styles.analyticsCard}>
            <Text style={styles.analyticsValue}>{totalGenerated}</Text>
            <Text style={styles.analyticsLabel}>Generated Content</Text>
          </View>
          <View style={styles.analyticsCard}>
            <Text style={styles.analyticsValue}>{totalViews.toLocaleString()}</Text>
            <Text style={styles.analyticsLabel}>Total Views</Text>
          </View>
          <View style={styles.analyticsCard}>
            <Text style={styles.analyticsValue}>{avgEngagement.toFixed(1)}%</Text>
            <Text style={styles.analyticsLabel}>Avg Engagement</Text>
          </View>
        </View>

        <View style={styles.topPerformingSection}>
          <Text style={styles.sectionTitle}>🏆 Top Performing Content</Text>
          {generatedContent
            .sort((a, b) => (b.performance?.views || 0) - (a.performance?.views || 0))
            .slice(0, 3)
            .map((content, index) => (
              <View key={content.id} style={styles.topPerformingItem}>
                <Text style={styles.rankNumber}>#{index + 1}</Text>
                <View style={styles.topPerformingInfo}>
                  <Text style={styles.topPerformingTitle}>{templates.find(t => t.id === content.templateId)?.name}</Text>
                  <Text style={styles.topPerformingStats}>
                    {content.performance?.views} views • {content.performance?.engagement}% engagement
                  </Text>
                </View>
              </View>
            ))
          }
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={mode === 'faith' 
          ? [KingdomColors.primary.royalPurple, KingdomColors.primary.deepNavy]
          : [KingdomColors.gold.bright, KingdomColors.gold.warm]
        }
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            {mode === 'faith' ? '✍️ Faith Content Templates' : '🚀 Content Creation Hub'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {mode === 'faith' 
              ? 'AI-powered templates for kingdom marketing'
              : 'Create compelling content that converts'
            }
          </Text>
          
          <TouchableOpacity
            style={styles.modeToggle}
            onPress={() => setMode(mode === 'faith' ? 'encouragement' : 'faith')}
          >
            <Text style={styles.modeToggleText}>
              Switch to {mode === 'faith' ? 'Encouragement' : 'Faith'} Mode
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {['templates', 'generator', 'library', 'analytics'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab as any)}
          >
            <Ionicons
              name={
                tab === 'templates' ? 'document-text-outline' :
                tab === 'generator' ? 'create-outline' :
                tab === 'library' ? 'library-outline' :
                'analytics-outline'
              }
              size={20}
              color={activeTab === tab ? KingdomColors.white : KingdomColors.silver.steel}
            />
            <Text style={[
              styles.tabText,
              activeTab === tab && styles.activeTabText
            ]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {activeTab === 'templates' && (
        <View style={styles.content}>
          {/* Search and Filter */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color={KingdomColors.silver.steel} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search templates..."
                placeholderTextColor={KingdomColors.silver.steel}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryFilter}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.activeCategoryButton
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={[
                    styles.categoryButtonText,
                    selectedCategory === category && styles.activeCategoryButtonText
                  ]}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <FlatList
            data={filteredTemplates}
            renderItem={renderTemplateCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      )}

      {activeTab === 'library' && (
        <View style={styles.content}>
          <View style={styles.libraryHeader}>
            <Text style={styles.sectionTitle}>Generated Content Library</Text>
            <Text style={styles.librarySubtitle}>{generatedContent.length} items</Text>
          </View>

          <FlatList
            data={generatedContent}
            renderItem={renderGeneratedContent}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      )}

      {activeTab === 'analytics' && renderAnalytics()}

      {/* Content Generator Modal */}
      <Modal
        visible={isGeneratorModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Generate Content</Text>
            <TouchableOpacity
              onPress={() => setIsGeneratorModalVisible(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color={KingdomColors.text.muted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {selectedTemplate && (
              <>
                <Text style={styles.templateSelectedTitle}>{selectedTemplate.name}</Text>
                <Text style={styles.templateSelectedDescription}>{selectedTemplate.description}</Text>

                <Text style={styles.sectionHeader}>Product Information</Text>
                
                <Text style={styles.inputLabel}>Product Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Your amazing product name"
                  placeholderTextColor={KingdomColors.silver.steel}
                  value={productInfo.name}
                  onChangeText={(text) => setProductInfo(prev => ({ ...prev, name: text }))}
                />

                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Brief description of your product..."
                  placeholderTextColor={KingdomColors.silver.steel}
                  value={productInfo.description}
                  onChangeText={(text) => setProductInfo(prev => ({ ...prev, description: text }))}
                  multiline
                  numberOfLines={3}
                />

                <Text style={styles.inputLabel}>Price</Text>
                <TextInput
                  style={styles.input}
                  placeholder="$99"
                  placeholderTextColor={KingdomColors.silver.steel}
                  value={productInfo.price}
                  onChangeText={(text) => setProductInfo(prev => ({ ...prev, price: text }))}
                />

                <Text style={styles.sectionHeader}>Template Variables</Text>
                
                {selectedTemplate.variables.map((variable, index) => (
                  <View key={index}>
                    <Text style={styles.inputLabel}>{variable.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Text>
                    <TextInput
                      style={styles.input}
                      placeholder={`Enter ${variable}...`}
                      placeholderTextColor={KingdomColors.silver.steel}
                      value={templateVariables[variable] || ''}
                      onChangeText={(text) => setTemplateVariables(prev => ({ ...prev, [variable]: text }))}
                    />
                  </View>
                ))}

                <TouchableOpacity 
                  style={styles.generateButton} 
                  onPress={generateContent}
                  disabled={isGenerating}
                >
                  <LinearGradient
                    colors={[KingdomColors.gold.bright, KingdomColors.gold.warm]}
                    style={styles.generateButtonGradient}
                  >
                    <Text style={styles.generateButtonText}>
                      {isGenerating ? 'Generating...' : 'Generate Content'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: KingdomColors.background.primary,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: KingdomColors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: KingdomColors.white,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 16,
  },
  modeToggle: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  modeToggleText: {
    color: KingdomColors.white,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: KingdomColors.white,
    borderBottomWidth: 1,
    borderBottomColor: KingdomColors.silver.light,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  activeTab: {
    backgroundColor: KingdomColors.gold.bright,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.text.muted,
  },
  activeTabText: {
    color: KingdomColors.white,
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: KingdomColors.white,
    borderBottomWidth: 1,
    borderBottomColor: KingdomColors.silver.light,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: KingdomColors.silver.platinum,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: KingdomColors.text.primary,
  },
  categoryFilter: {
    flexDirection: 'row',
  },
  categoryButton: {
    backgroundColor: KingdomColors.silver.platinum,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  activeCategoryButton: {
    backgroundColor: KingdomColors.gold.bright,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.text.muted,
  },
  activeCategoryButtonText: {
    color: KingdomColors.white,
  },
  listContainer: {
    padding: 16,
  },
  templateCard: {
    backgroundColor: KingdomColors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  templateInfo: {
    flex: 1,
  },
  templateName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 4,
  },
  templateDescription: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: KingdomColors.gold.bright,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: KingdomColors.white,
  },
  templateStats: {
    alignItems: 'center',
  },
  usageCount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
  },
  usageLabel: {
    fontSize: 12,
    color: KingdomColors.silver.steel,
  },
  templateTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: KingdomColors.silver.platinum,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: KingdomColors.text.muted,
    fontWeight: '500',
  },
  templateActions: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: KingdomColors.gold.bright,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.white,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: KingdomColors.silver.platinum,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.gold.bright,
  },
  libraryHeader: {
    padding: 20,
    backgroundColor: KingdomColors.white,
    borderBottomWidth: 1,
    borderBottomColor: KingdomColors.silver.light,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 4,
  },
  librarySubtitle: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
  },
  contentCard: {
    backgroundColor: KingdomColors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  contentInfo: {
    flex: 1,
  },
  contentTemplate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 4,
  },
  contentPlatform: {
    fontSize: 14,
    color: KingdomColors.silver.steel,
    marginBottom: 2,
  },
  contentDate: {
    fontSize: 12,
    color: KingdomColors.silver.steel,
  },
  contentActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: KingdomColors.silver.platinum,
  },
  contentPreview: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  performanceStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: KingdomColors.silver.light,
  },
  performanceStat: {
    alignItems: 'center',
  },
  performanceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
  },
  performanceLabel: {
    fontSize: 12,
    color: KingdomColors.silver.steel,
    marginTop: 2,
  },
  analyticsContainer: {
    flex: 1,
    backgroundColor: KingdomColors.background.primary,
  },
  analyticsHeader: {
    padding: 20,
    backgroundColor: KingdomColors.white,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: KingdomColors.silver.light,
  },
  analyticsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    textAlign: 'center',
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  analyticsCard: {
    backgroundColor: KingdomColors.white,
    borderRadius: 16,
    padding: 20,
    width: '47%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  analyticsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 4,
  },
  analyticsLabel: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    textAlign: 'center',
  },
  topPerformingSection: {
    backgroundColor: KingdomColors.white,
    borderRadius: 16,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  topPerformingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: KingdomColors.silver.light,
  },
  rankNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.gold.bright,
    marginRight: 16,
    width: 24,
  },
  topPerformingInfo: {
    flex: 1,
  },
  topPerformingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.text.primary,
    marginBottom: 4,
  },
  topPerformingStats: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: KingdomColors.background.primary,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: KingdomColors.white,
    borderBottomWidth: 1,
    borderBottomColor: KingdomColors.silver.light,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  templateSelectedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 8,
  },
  templateSelectedDescription: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginTop: 24,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.text.primary,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: KingdomColors.white,
    borderWidth: 1,
    borderColor: KingdomColors.silver.light,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: KingdomColors.text.primary,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  generateButton: {
    marginTop: 32,
    borderRadius: 12,
    overflow: 'hidden',
  },
  generateButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  generateButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.white,
  },
});

export default React.memo(ProductContentTemplatesScreen);

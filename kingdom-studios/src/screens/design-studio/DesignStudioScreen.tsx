import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppNavigation } from '../../utils/navigationUtils';
import { useFaithMode } from '../../contexts/FaithModeContext';
import { useAuth } from '../../contexts/AuthContext';
import { KingdomColors, KingdomShadows } from '../../constants/KingdomColors';
import KingdomLogo from '../../components/KingdomLogo';

const { width } = Dimensions.get('window');

interface DesignTemplate {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  isPro?: boolean;
  faithMode?: {
    title: string;
    category: string;
  };
}

interface DesignTool {
  id: string;
  title: string;
  description: string;
  icon: string;
  gradient: string[];
  comingSoon?: boolean;
  faithMode?: {
    title: string;
    description: string;
  };
}

const DesignStudioScreen: React.FC = () => {
  const navigation = useAppNavigation();
  const { faithMode } = useFaithMode();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'social' | 'print' | 'web'>('all');

  const designTools: DesignTool[] = [
    {
      id: 'canvas-editor',
      title: faithMode ? 'Kingdom Canvas Editor' : 'Drag & Drop Canvas',
      description: faithMode 
        ? 'Create stunning Kingdom-focused designs with our canvas editor' 
        : 'Professional design editor with drag & drop functionality',
      icon: '🎨',
      gradient: [KingdomColors.primary.royalPurple, KingdomColors.gold.bright],
      faithMode: {
        title: 'Kingdom Canvas Editor',
        description: 'Create stunning Kingdom-focused designs with our canvas editor'
      }
    },
    {
      id: 'template-library',
      title: faithMode ? 'Faith-Based Templates' : 'Template Library',
      description: faithMode 
        ? 'Access thousands of Christian and faith-based design templates' 
        : 'Access thousands of professional design templates',
      icon: '📁',
      gradient: [KingdomColors.gold.warm, KingdomColors.primary.deepNavy],
      faithMode: {
        title: 'Faith-Based Templates',
        description: 'Access thousands of Christian and faith-based design templates'
      }
    },
    {
      id: 'brand-kit',
      title: faithMode ? 'Kingdom Brand Kit' : 'Brand Kit Manager',
      description: faithMode 
        ? 'Manage your Kingdom brand colors, fonts, and logos' 
        : 'Organize your brand assets and maintain consistency',
      icon: '🎯',
      gradient: [KingdomColors.accent.info, KingdomColors.silver.bright],
      faithMode: {
        title: 'Kingdom Brand Kit',
        description: 'Manage your Kingdom brand colors, fonts, and logos'
      }
    },
    {
      id: 'ai-designer',
      title: faithMode ? 'AI Kingdom Designer' : 'AI Design Assistant',
      description: faithMode 
        ? 'Generate Kingdom-focused designs with AI assistance' 
        : 'Let AI help you create professional designs instantly',
      icon: '🤖',
      gradient: [KingdomColors.accent.success, KingdomColors.primary.midnight],
      faithMode: {
        title: 'AI Kingdom Designer',
        description: 'Generate Kingdom-focused designs with AI assistance'
      }
    },
    {
      id: 'photo-editor',
      title: faithMode ? 'Sacred Photo Editor' : 'Photo Editor Pro',
      description: faithMode 
        ? 'Edit and enhance photos with Kingdom-style filters' 
        : 'Professional photo editing with filters and effects',
      icon: '📸',
      gradient: [KingdomColors.gold.amber, KingdomColors.primary.royalPurple],
      comingSoon: true,
      faithMode: {
        title: 'Sacred Photo Editor',
        description: 'Edit and enhance photos with Kingdom-style filters'
      }
    },
    {
      id: 'video-creator',
      title: faithMode ? 'Kingdom Video Creator' : 'Video Story Creator',
      description: faithMode 
        ? 'Create powerful Kingdom video content and stories' 
        : 'Design animated videos and social media stories',
      icon: '🎬',
      gradient: [KingdomColors.primary.deepNavy, KingdomColors.gold.bright],
      comingSoon: true,
      faithMode: {
        title: 'Kingdom Video Creator',
        description: 'Create powerful Kingdom video content and stories'
      }
    },
  ];

  const templates: DesignTemplate[] = [
    {
      id: '1',
      title: faithMode ? 'Scripture Verse Post' : 'Motivational Quote',
      category: 'social',
      thumbnail: 'https://picsum.photos/300/400?random=1',
      faithMode: {
        title: 'Scripture Verse Post',
        category: 'social'
      }
    },
    {
      id: '2',
      title: faithMode ? 'Church Event Flyer' : 'Event Announcement',
      category: 'print',
      thumbnail: 'https://picsum.photos/300/400?random=2',
      isPro: true,
      faithMode: {
        title: 'Church Event Flyer',
        category: 'print'
      }
    },
    {
      id: '3',
      title: faithMode ? 'Kingdom Brand Logo' : 'Business Logo',
      category: 'web',
      thumbnail: 'https://picsum.photos/300/400?random=3',
      faithMode: {
        title: 'Kingdom Brand Logo',
        category: 'web'
      }
    },
    {
      id: '4',
      title: faithMode ? 'Prayer Request Story' : 'Instagram Story',
      category: 'social',
      thumbnail: 'https://picsum.photos/300/400?random=4',
      faithMode: {
        title: 'Prayer Request Story',
        category: 'social'
      }
    },
  ];

  const categories = [
    { id: 'all', title: 'All', icon: '📱' },
    { id: 'social', title: faithMode ? 'Ministry' : 'Social', icon: '📱' },
    { id: 'print', title: faithMode ? 'Church' : 'Print', icon: '🖨️' },
    { id: 'web', title: faithMode ? 'Kingdom' : 'Web', icon: '🌐' },
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory);

  const renderDesignTool = (tool: DesignTool) => (
    <TouchableOpacity
      key={tool.id}
      style={styles.toolCard}
      onPress={() => {
        if (tool.comingSoon) {
          Alert.alert('Coming Soon!', `${tool.title} will be available soon!`);
        } else {
          Alert.alert('Open Tool', `Opening ${tool.title}`);
        }
      }}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={tool.gradient as [string, string]}
        style={styles.toolGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.toolContent}>
          <View style={styles.toolHeader}>
            <Text style={styles.toolIcon}>{tool.icon}</Text>
            {tool.comingSoon && (
              <View style={styles.comingSoonBadge}>
                <Text style={styles.comingSoonText}>Soon</Text>
              </View>
            )}
          </View>
          <Text style={styles.toolTitle}>
            {faithMode && tool.faithMode ? tool.faithMode.title : tool.title}
          </Text>
          <Text style={styles.toolDescription}>
            {faithMode && tool.faithMode ? tool.faithMode.description : tool.description}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderTemplate = (template: DesignTemplate) => (
    <TouchableOpacity
      key={template.id}
      style={styles.templateCard}
      onPress={() => Alert.alert('Open Template', `Opening ${template.title}`)}
    >
      <Image source={{ uri: template.thumbnail }} style={styles.templateImage} />
      {template.isPro && (
        <View style={styles.proBadge}>
          <Text style={styles.proText}>PRO</Text>
        </View>
      )}
      <View style={styles.templateInfo}>
        <Text style={styles.templateTitle}>
          {faithMode && template.faithMode ? template.faithMode.title : template.title}
        </Text>
      </View>
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
              {faithMode ? '🎨 Kingdom Design Studio' : '🎨 Design Studio Pro'}
            </Text>
            <Text style={styles.headerSubtitle}>
              {faithMode ? 'Create Kingdom-focused designs' : 'Replace Canva with AI-powered tools'}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <LinearGradient
            colors={[KingdomColors.primary.royalPurple, KingdomColors.gold.bright]}
            style={styles.statsGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.statsContent}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>247</Text>
                <Text style={styles.statLabel}>
                  {faithMode ? 'Kingdom Designs' : 'Designs Created'}
                </Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>12.5K</Text>
                <Text style={styles.statLabel}>Templates</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>98%</Text>
                <Text style={styles.statLabel}>
                  {faithMode ? 'Kingdom Impact' : 'User Satisfaction'}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {/* Design Tools */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {faithMode ? '👑 Kingdom Design Tools' : '🚀 Professional Design Tools'}
            </Text>
            <Text style={styles.sectionSubtitle}>
              {faithMode 
                ? 'Create Kingdom-focused designs that inspire and impact' 
                : 'Everything you need to create professional designs'}
            </Text>
            <View style={styles.toolsGrid}>
              {designTools.map(renderDesignTool)}
            </View>
          </View>

          {/* Templates Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {faithMode ? '📁 Kingdom Templates' : '📁 Popular Templates'}
            </Text>
            
            {/* Category Filter */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.categoryFilter}
              contentContainerStyle={styles.categoryContent}
            >
              {categories.map(category => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category.id && styles.activeCategoryButton
                  ]}
                  onPress={() => setSelectedCategory(category.id as any)}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={[
                    styles.categoryText,
                    selectedCategory === category.id && styles.activeCategoryText
                  ]}>
                    {category.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Templates Grid */}
            <View style={styles.templatesGrid}>
              {filteredTemplates.map(renderTemplate)}
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚡ Quick Create</Text>
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity style={styles.quickActionCard}>
                <Text style={styles.quickActionIcon}>📱</Text>
                <Text style={styles.quickActionText}>
                  {faithMode ? 'Kingdom Post' : 'Social Post'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionCard}>
                <Text style={styles.quickActionIcon}>📖</Text>
                <Text style={styles.quickActionText}>
                  {faithMode ? 'Scripture Card' : 'Story'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionCard}>
                <Text style={styles.quickActionIcon}>🎯</Text>
                <Text style={styles.quickActionText}>Logo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionCard}>
                <Text style={styles.quickActionIcon}>📄</Text>
                <Text style={styles.quickActionText}>
                  {faithMode ? 'Church Flyer' : 'Flyer'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 32,
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
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  toolCard: {
    width: (width - 60) / 2,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    ...KingdomShadows.medium,
  },
  toolGradient: {
    padding: 16,
    minHeight: 120,
  },
  toolContent: {
    flex: 1,
  },
  toolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  toolIcon: {
    fontSize: 24,
  },
  comingSoonBadge: {
    backgroundColor: KingdomColors.opacity.white20,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  comingSoonText: {
    fontSize: 10,
    fontWeight: '600',
    color: KingdomColors.white,
  },
  toolTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: KingdomColors.white,
    marginBottom: 6,
    lineHeight: 18,
  },
  toolDescription: {
    fontSize: 12,
    color: KingdomColors.white,
    opacity: 0.9,
    lineHeight: 16,
  },
  categoryFilter: {
    marginBottom: 16,
  },
  categoryContent: {
    paddingRight: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: KingdomColors.background.secondary,
    borderWidth: 1,
    borderColor: KingdomColors.gray,
  },
  activeCategoryButton: {
    backgroundColor: KingdomColors.primary.royalPurple,
    borderColor: KingdomColors.primary.royalPurple,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.text.secondary,
  },
  activeCategoryText: {
    color: KingdomColors.white,
  },
  templatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  templateCard: {
    width: (width - 60) / 2,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: KingdomColors.background.secondary,
    overflow: 'hidden',
    ...KingdomShadows.small,
  },
  templateImage: {
    width: '100%',
    height: 120,
    backgroundColor: KingdomColors.gray,
  },
  proBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: KingdomColors.gold.bright,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  proText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: KingdomColors.black,
  },
  templateInfo: {
    padding: 12,
  },
  templateTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: KingdomColors.text.primary,
    lineHeight: 16,
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
});

export default DesignStudioScreen;

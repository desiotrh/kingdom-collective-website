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

interface StorefrontBlock {
  id: string;
  type: 'bio' | 'product' | 'link' | 'social' | 'donation' | 'leadMagnet' | 'video';
  title: string;
  content: string;
  icon: string;
  enabled: boolean;
  data?: any;
}

interface StorefrontTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
  };
  preview: string;
  faithMode?: {
    name: string;
  };
}

const StorefrontScreen: React.FC = () => {
  const navigation = useAppNavigation();
  const { faithMode } = useFaithMode();
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'builder' | 'preview' | 'analytics'>('builder');
  const [storefrontUrl] = useState(`kingdomstudios.app/${user?.displayName?.toLowerCase() || 'creator'}`);

  const themes: StorefrontTheme[] = [
    {
      id: 'kingdom',
      name: faithMode ? 'Kingdom Royal' : 'Royal Purple',
      colors: {
        primary: KingdomColors.primary.royalPurple,
        secondary: KingdomColors.gold.bright,
        background: KingdomColors.background.primary,
      },
      preview: 'https://picsum.photos/200/300?random=1',
      faithMode: {
        name: 'Kingdom Royal'
      }
    },
    {
      id: 'faith',
      name: faithMode ? 'Heavenly Gold' : 'Golden Elegance',
      colors: {
        primary: KingdomColors.gold.bright,
        secondary: KingdomColors.primary.deepNavy,
        background: KingdomColors.background.secondary,
      },
      preview: 'https://picsum.photos/200/300?random=2',
      faithMode: {
        name: 'Heavenly Gold'
      }
    },
    {
      id: 'minimal',
      name: 'Clean & Minimal',
      colors: {
        primary: KingdomColors.text.primary,
        secondary: KingdomColors.accent.success,
        background: KingdomColors.white,
      },
      preview: 'https://picsum.photos/200/300?random=3',
    },
  ];

  const [storefrontBlocks, setStorefrontBlocks] = useState<StorefrontBlock[]>([
    {
      id: 'bio',
      type: 'bio',
      title: faithMode ? 'Kingdom Bio' : 'About Me',
      content: faithMode 
        ? 'Walking in purpose, building the Kingdom through creativity and faith.' 
        : 'Creator, entrepreneur, and content strategist helping others build their dreams.',
      icon: '👤',
      enabled: true,
    },
    {
      id: 'featured-product',
      type: 'product',
      title: faithMode ? 'Featured Kingdom Product' : 'Featured Product',
      content: faithMode ? 'Faith Over Fear T-Shirt - $24.99' : 'Best Seller - Motivational Tee',
      icon: '⭐',
      enabled: true,
    },
    {
      id: 'social-links',
      type: 'social',
      title: 'Social Media',
      content: 'Instagram, TikTok, YouTube',
      icon: '📱',
      enabled: true,
    },
    {
      id: 'donation',
      type: 'donation',
      title: faithMode ? 'Support the Kingdom' : 'Support My Work',
      content: faithMode ? 'Help fuel Kingdom building initiatives' : 'Buy me a coffee or support my content',
      icon: '💝',
      enabled: false,
    },
    {
      id: 'lead-magnet',
      type: 'leadMagnet',
      title: faithMode ? 'Free Kingdom Resource' : 'Free Download',
      content: faithMode 
        ? 'Download: "30 Kingdom Affirmations for Entrepreneurs"' 
        : 'Free Guide: "Creator Success Blueprint"',
      icon: '📚',
      enabled: false,
    },
    {
      id: 'latest-video',
      type: 'video',
      title: 'Latest Content',
      content: 'Check out my latest video or reel',
      icon: '🎬',
      enabled: false,
    },
  ]);

  const toggleBlock = (blockId: string) => {
    setStorefrontBlocks(blocks =>
      blocks.map(block =>
        block.id === blockId ? { ...block, enabled: !block.enabled } : block
      )
    );
  };

  const renderBuilder = () => (
    <View style={styles.builderContainer}>
      {/* Theme Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {faithMode ? '🎨 Kingdom Themes' : '🎨 Choose Your Theme'}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.themesContainer}>
            {themes.map(theme => (
              <TouchableOpacity
                key={theme.id}
                style={styles.themeCard}
                onPress={() => Alert.alert('Theme Selected', `${theme.name} theme applied!`)}
              >
                <Image source={{ uri: theme.preview }} style={styles.themePreview} />
                <Text style={styles.themeName}>
                  {faithMode && theme.faithMode ? theme.faithMode.name : theme.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Storefront URL */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {faithMode ? '🔗 Your Kingdom Link' : '🔗 Your Storefront URL'}
        </Text>
        <View style={styles.urlContainer}>
          <Text style={styles.urlText}>{storefrontUrl}</Text>
          <TouchableOpacity 
            style={styles.copyButton}
            onPress={() => Alert.alert('Copied!', 'URL copied to clipboard')}
          >
            <Text style={styles.copyText}>Copy</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Blocks */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {faithMode ? '🧱 Kingdom Building Blocks' : '🧱 Content Blocks'}
        </Text>
        <Text style={styles.sectionSubtitle}>
          {faithMode 
            ? 'Customize your Kingdom storefront with these powerful blocks' 
            : 'Drag and drop to customize your storefront'}
        </Text>

        {storefrontBlocks.map(block => (
          <View key={block.id} style={styles.blockCard}>
            <View style={styles.blockContent}>
              <View style={styles.blockInfo}>
                <Text style={styles.blockIcon}>{block.icon}</Text>
                <View style={styles.blockDetails}>
                  <Text style={styles.blockTitle}>{block.title}</Text>
                  <Text style={styles.blockDescription}>{block.content}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  { backgroundColor: block.enabled ? KingdomColors.accent.success : KingdomColors.gray }
                ]}
                onPress={() => toggleBlock(block.id)}
              >
                <Text style={styles.toggleText}>
                  {block.enabled ? 'ON' : 'OFF'}
                </Text>
              </TouchableOpacity>
            </View>
            {block.enabled && (
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editText}>✏️ Edit</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      {/* Add New Block */}
      <TouchableOpacity style={styles.addBlockButton}>
        <LinearGradient
          colors={[KingdomColors.primary.royalPurple, KingdomColors.gold.bright]}
          style={styles.addBlockGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.addBlockIcon}>➕</Text>
          <Text style={styles.addBlockText}>
            {faithMode ? 'Add Kingdom Block' : 'Add New Block'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderPreview = () => (
    <View style={styles.previewContainer}>
      <Text style={styles.previewTitle}>
        {faithMode ? '👁️ Kingdom Storefront Preview' : '👁️ Storefront Preview'}
      </Text>
      <Text style={styles.previewSubtitle}>
        This is how your storefront will look to visitors
      </Text>

      <View style={styles.phonePreview}>
        <LinearGradient
          colors={[KingdomColors.background.primary, KingdomColors.background.secondary]}
          style={styles.phoneScreen}
        >
          <View style={styles.previewHeader}>
            <Image 
              source={{ uri: 'https://picsum.photos/100/100?random=99' }} 
              style={styles.previewAvatar} 
            />
            <Text style={styles.previewName}>
              {user?.displayName || (faithMode ? 'Kingdom Creator' : 'Creator Name')}
            </Text>
          </View>

          {storefrontBlocks
            .filter(block => block.enabled)
            .map(block => (
              <View key={block.id} style={styles.previewBlock}>
                <Text style={styles.previewBlockIcon}>{block.icon}</Text>
                <View style={styles.previewBlockContent}>
                  <Text style={styles.previewBlockTitle}>{block.title}</Text>
                  <Text style={styles.previewBlockText}>{block.content}</Text>
                </View>
              </View>
            ))}
        </LinearGradient>
      </View>
    </View>
  );

  const renderAnalytics = () => (
    <View style={styles.analyticsContainer}>
      <Text style={styles.sectionTitle}>
        {faithMode ? '📊 Kingdom Impact Analytics' : '📊 Storefront Analytics'}
      </Text>

      <View style={styles.analyticsGrid}>
        <LinearGradient
          colors={[KingdomColors.primary.royalPurple, KingdomColors.gold.bright]}
          style={styles.analyticsCard}
        >
          <Text style={styles.analyticsIcon}>👁️</Text>
          <Text style={styles.analyticsNumber}>2,847</Text>
          <Text style={styles.analyticsLabel}>
            {faithMode ? 'Kingdom Views' : 'Page Views'}
          </Text>
        </LinearGradient>

        <LinearGradient
          colors={[KingdomColors.accent.success, KingdomColors.primary.deepNavy]}
          style={styles.analyticsCard}
        >
          <Text style={styles.analyticsIcon}>🔗</Text>
          <Text style={styles.analyticsNumber}>467</Text>
          <Text style={styles.analyticsLabel}>Link Clicks</Text>
        </LinearGradient>

        <LinearGradient
          colors={[KingdomColors.gold.warm, KingdomColors.primary.midnight]}
          style={styles.analyticsCard}
        >
          <Text style={styles.analyticsIcon}>💰</Text>
          <Text style={styles.analyticsNumber}>$1,234</Text>
          <Text style={styles.analyticsLabel}>
            {faithMode ? 'Kingdom Revenue' : 'Revenue Generated'}
          </Text>
        </LinearGradient>

        <LinearGradient
          colors={[KingdomColors.accent.info, KingdomColors.silver.bright]}
          style={styles.analyticsCard}
        >
          <Text style={styles.analyticsIcon}>📧</Text>
          <Text style={styles.analyticsNumber}>156</Text>
          <Text style={styles.analyticsLabel}>Email Signups</Text>
        </LinearGradient>
      </View>

      {/* Traffic Sources */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🚀 Traffic Sources</Text>
        <View style={styles.trafficList}>
          <View style={styles.trafficItem}>
            <Text style={styles.trafficSource}>Instagram</Text>
            <Text style={styles.trafficPercent}>45%</Text>
          </View>
          <View style={styles.trafficItem}>
            <Text style={styles.trafficSource}>TikTok</Text>
            <Text style={styles.trafficPercent}>32%</Text>
          </View>
          <View style={styles.trafficItem}>
            <Text style={styles.trafficSource}>Direct</Text>
            <Text style={styles.trafficPercent}>23%</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'builder':
        return renderBuilder();
      case 'preview':
        return renderPreview();
      case 'analytics':
        return renderAnalytics();
      default:
        return renderBuilder();
    }
  };

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
              {faithMode ? '🛍️ Kingdom Storefront' : '🛍️ Storefront Builder'}
            </Text>
            <Text style={styles.headerSubtitle}>
              {faithMode ? 'Your Kingdom marketplace' : 'Replace Beacons & Stan Store'}
            </Text>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'builder' && styles.activeTab]}
            onPress={() => setSelectedTab('builder')}
          >
            <Text style={[styles.tabText, selectedTab === 'builder' && styles.activeTabText]}>
              Builder
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'preview' && styles.activeTab]}
            onPress={() => setSelectedTab('preview')}
          >
            <Text style={[styles.tabText, selectedTab === 'preview' && styles.activeTabText]}>
              Preview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'analytics' && styles.activeTab]}
            onPress={() => setSelectedTab('analytics')}
          >
            <Text style={[styles.tabText, selectedTab === 'analytics' && styles.activeTabText]}>
              Analytics
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {renderTabContent()}
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
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 16,
    backgroundColor: KingdomColors.background.secondary,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: KingdomColors.primary.royalPurple,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.text.secondary,
  },
  activeTabText: {
    color: KingdomColors.white,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  builderContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  themesContainer: {
    flexDirection: 'row',
    paddingRight: 20,
  },
  themeCard: {
    marginRight: 16,
    alignItems: 'center',
  },
  themePreview: {
    width: 80,
    height: 120,
    borderRadius: 12,
    marginBottom: 8,
  },
  themeName: {
    fontSize: 12,
    fontWeight: '600',
    color: KingdomColors.text.primary,
    textAlign: 'center',
  },
  urlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: KingdomColors.background.secondary,
    borderRadius: 12,
    padding: 16,
    ...KingdomShadows.small,
  },
  urlText: {
    flex: 1,
    fontSize: 14,
    color: KingdomColors.text.primary,
    fontFamily: 'monospace',
  },
  copyButton: {
    backgroundColor: KingdomColors.primary.royalPurple,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  copyText: {
    fontSize: 12,
    fontWeight: '600',
    color: KingdomColors.white,
  },
  blockCard: {
    backgroundColor: KingdomColors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...KingdomShadows.small,
  },
  blockContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  blockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  blockIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  blockDetails: {
    flex: 1,
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.text.primary,
    marginBottom: 4,
  },
  blockDescription: {
    fontSize: 12,
    color: KingdomColors.text.secondary,
    lineHeight: 16,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: KingdomColors.white,
  },
  editButton: {
    marginTop: 12,
    paddingVertical: 8,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: KingdomColors.gray + '40',
  },
  editText: {
    fontSize: 14,
    color: KingdomColors.primary.royalPurple,
    fontWeight: '600',
  },
  addBlockButton: {
    borderRadius: 12,
    overflow: 'hidden',
    ...KingdomShadows.medium,
  },
  addBlockGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  addBlockIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  addBlockText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: KingdomColors.white,
  },
  previewContainer: {
    alignItems: 'center',
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 8,
  },
  previewSubtitle: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  phonePreview: {
    width: 280,
    height: 500,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: KingdomColors.gray,
    overflow: 'hidden',
    ...KingdomShadows.large,
  },
  phoneScreen: {
    flex: 1,
    padding: 20,
  },
  previewHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  previewAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  previewName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
  },
  previewBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: KingdomColors.background.secondary,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  previewBlockIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  previewBlockContent: {
    flex: 1,
  },
  previewBlockTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: KingdomColors.text.primary,
    marginBottom: 2,
  },
  previewBlockText: {
    fontSize: 10,
    color: KingdomColors.text.secondary,
  },
  analyticsContainer: {
    flex: 1,
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  analyticsCard: {
    width: (width - 60) / 2,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
    ...KingdomShadows.medium,
  },
  analyticsIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  analyticsNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.white,
    marginBottom: 4,
  },
  analyticsLabel: {
    fontSize: 12,
    color: KingdomColors.white,
    textAlign: 'center',
  },
  trafficList: {
    backgroundColor: KingdomColors.background.secondary,
    borderRadius: 12,
    padding: 16,
    ...KingdomShadows.small,
  },
  trafficItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: KingdomColors.gray + '40',
  },
  trafficSource: {
    fontSize: 14,
    color: KingdomColors.text.primary,
    fontWeight: '600',
  },
  trafficPercent: {
    fontSize: 14,
    color: KingdomColors.accent.success,
    fontWeight: 'bold',
  },
});

export default StorefrontScreen;

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useAppNavigation } from '../utils/navigationUtils';
import { useFaithMode } from '../contexts/FaithModeContext';
import QuickActionsWidget from '../components/QuickActionsWidget';
import KingdomLogo from '../components/KingdomLogo';
import { KingdomColors } from '../constants/KingdomColors';
import { AnalyticsService } from '../services/AnalyticsService';
import { apiClient } from '../services/apiClient';

interface ToolCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  adminOnly?: boolean;
}

const toolCards: ToolCard[] = [
  {
    id: 'content-generator',
    title: 'Content Generator',
    description: 'AI-powered content creation tools',
    icon: '✨',
  },
  {
    id: 'multi-post',
    title: 'Multi-Post',
    description: 'Post to multiple platforms at once',
    icon: '📤',
  },
  {
    id: 'content-library',
    title: 'Content Library',
    description: 'View and manage all your content',
    icon: '📚',
  },
  {
    id: 'scheduled-posts',
    title: 'Scheduled Posts',
    description: 'View and manage scheduled content',
    icon: '⏰',
  },
  {
    id: 'hashtag-manager',
    title: 'Hashtag Manager',
    description: 'Organize and manage your hashtags',
    icon: '#️⃣',
  },
  {
    id: 'link-in-bio',
    title: 'Link in Bio',
    description: 'Create a beautiful landing page',
    icon: '🔗',
  },
  {
    id: 'digital-products',
    title: 'Digital Products',
    description: 'Manage your digital downloads & courses',
    icon: '📱',
  },
  {
    id: 'affiliate-hub',
    title: 'Affiliate Hub',
    description: 'Manage affiliate programs & earnings',
    icon: '🤝',
  },
  {
    id: 'content-templates',
    title: 'Content Templates',
    description: 'AI-powered marketing templates',
    icon: '✍️',
  },
  {
    id: 'podcast-shorts',
    title: 'Podcast & Shorts',
    description: 'Create podcasts and short-form videos',
    icon: '🎙️',
  },
  {
    id: 'analytics',
    title: 'Analytics',
    description: 'Track your growth and performance',
    icon: '📊',
  },
  {
    id: 'products',
    title: 'Products',
    description: 'View and manage your synced products',
    icon: '🛍️',
  },
  {
    id: 'monetization',
    title: 'Monetization',
    description: 'Turn your creativity into income',
    icon: '💰',
  },
  {
    id: 'product-sync',
    title: 'Product Sync',
    description: 'Synchronize products across platforms',
    icon: '🔄',
  },
  {
    id: 'forge-community',
    title: 'Forge Community',
    description: 'Build and manage your community',
    icon: '👥',
  },
  {
    id: 'scheduling',
    title: 'Scheduling',
    description: 'Schedule posts and content',
    icon: '📅',
  },
  {
    id: 'sponsorships',
    title: 'Sponsorships',
    description: 'Manage brand partnerships',
    icon: '🤝',
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'App preferences and account',
    icon: '⚙️',
  },
  // Admin Tools (only visible to admin users)
  {
    id: 'admin-dashboard',
    title: 'Admin Dashboard',
    description: 'Manage community safety and operations',
    icon: '🛡️',
    adminOnly: true,
  },
  {
    id: 'content-moderation',
    title: 'Content Moderation',
    description: 'Review and moderate community content',
    icon: '👁️',
    adminOnly: true,
  },
  {
    id: 'user-management',
    title: 'User Management',
    description: 'Manage user accounts and permissions',
    icon: '👥',
    adminOnly: true,
  },
];

const CreatorDashboardScreen = () => {
  const { user, logout } = useAuth();
  const { faithMode } = useFaithMode();
  const navigation = useAppNavigation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Track screen view
  useEffect(() => {
    if (user) {
      AnalyticsService.getInstance().trackEvent('creator_dashboard_viewed', 1, {
        faithMode: faithMode,
        userRole: user.email?.includes('admin') ? 'admin' : 'creator',
        userId: user.id,
      });
    }
  }, [user, faithMode]);

  // Mock admin check - in a real app, this would come from user profile/database
  const isAdmin = user?.email === 'admin@kingdomstudios.com' || user?.email?.includes('admin');

  // Filter tools based on admin status
  const visibleTools = toolCards.filter(tool => !tool.adminOnly || isAdmin);

  const handleToolPress = (toolTitle: string) => {
    console.log(`${toolTitle} pressed`);
    
    if (toolTitle === 'Content Generator') {
      navigation.navigate('ContentGenerator');
    } else if (toolTitle === 'Multi-Post') {
      navigation.navigate('MultiPlatformPost', {});
    } else if (toolTitle === 'Content Library') {
      navigation.navigate('ContentLibrary');
    } else if (toolTitle === 'Scheduled Posts') {
      navigation.navigate('ScheduledPosts');
    } else if (toolTitle === 'Hashtag Manager') {
      navigation.navigate('HashtagManager');
    } else if (toolTitle === 'Link in Bio') {
      navigation.navigate('LinkInBioBuilder');
    } else if (toolTitle === 'Digital Products') {
      navigation.navigate('DigitalProductManager');
    } else if (toolTitle === 'Affiliate Hub') {
      navigation.navigate('AffiliateHub');
    } else if (toolTitle === 'Content Templates') {
      navigation.navigate('ProductContentTemplates');
    } else if (toolTitle === 'Podcast & Shorts') {
      navigation.navigate('PodcastShortsHub');
    } else if (toolTitle === 'Analytics') {
      navigation.navigate('AdvancedAnalyticsDashboard');
    } else if (toolTitle === 'Products') {
      navigation.navigate('ProductDashboard');
    } else if (toolTitle === 'Monetization') {
      navigation.navigate('Monetization');
    } else if (toolTitle === 'Product Sync') {
      navigation.navigate('ProductSync');
    } else if (toolTitle === 'Forge Community') {
      navigation.navigate('ForgeCommunity');
    } else if (toolTitle === 'Scheduling') {
      navigation.navigate('Scheduling');
    } else if (toolTitle === 'Sponsorships') {
      navigation.navigate('Sponsorships');
    } else if (toolTitle === 'Settings') {
      navigation.navigate('Settings');
    } else if (toolTitle === 'Admin Dashboard') {
      navigation.navigate('AdminDashboard');
    } else if (toolTitle === 'Content Moderation') {
      navigation.navigate('ContentModeration');
    } else if (toolTitle === 'User Management') {
      navigation.navigate('UserManagement');
    } else {
      Alert.alert('Coming Soon', `${toolTitle} feature will be available soon!`);
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    try {
      // Track logout event
      if (user) {
        AnalyticsService.getInstance().trackEvent('user_logout', 1, {
          source: 'creator_dashboard',
          faithMode: faithMode,
          userId: user.id,
        });
      }
      
      await logout();
      Alert.alert('Success', 'Logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const renderUserProfile = () => (
    <View style={styles.profileSection}>
      <View style={styles.profileHeader}>
        <View style={styles.profileHeaderLeft}>
          <KingdomLogo size="small" showGlow={true} glowIntensity={0.15} />
          <View style={styles.brandInfo}>
            <Text style={styles.brandName}>KINGDOM STUDIOS</Text>
            <Text style={styles.brandTagline}>Creator's Edge</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.userInfo}>
        <View style={styles.profileImageContainer}>
          {/* For now, we'll use initials since we don't have photoURL in backend User */}
          <View style={styles.profileImagePlaceholder}>
            <Text style={styles.profileImageText}>
              {user?.name ? user.name.split(' ').map(n => n.charAt(0)).join('').toUpperCase() : user?.email?.charAt(0)?.toUpperCase() || '?'}
            </Text>
          </View>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.welcomeText}>
            {faithMode ? 'God bless you,' : 'Welcome back,'}
          </Text>
          <Text style={styles.displayName}>
            {user?.name || 'Creator'}
          </Text>
          <Text style={styles.emailText}>{user?.email}</Text>
          {user?.faithMode && (
            <Text style={styles.faithModeIndicator}>✝️ Faith Mode Active</Text>
          )}
        </View>
      </View>
    </View>
  );

  const renderToolCard = (tool: ToolCard) => (
    <TouchableOpacity
      key={tool.id}
      style={styles.toolCard}
      onPress={() => handleToolPress(tool.title)}
      activeOpacity={0.8}
    >
      <View style={styles.cardContent}>
        <Text style={styles.cardIcon}>{tool.icon}</Text>
        <Text style={styles.cardTitle}>{tool.title}</Text>
        <Text style={styles.cardDescription}>{tool.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderUserProfile()}
        
        <QuickActionsWidget />
        
        <View style={styles.toolsSection}>
          <Text style={styles.sectionTitle}>Creator Tools</Text>
          <View style={styles.toolsGrid}>
            {visibleTools.map(renderToolCard)}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: KingdomColors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  profileSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: KingdomColors.primary.deepNavy,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandInfo: {
    marginLeft: 12,
  },
  brandName: {
    fontSize: 16,
    fontWeight: '700',
    color: KingdomColors.gold.bright,
    letterSpacing: 1,
  },
  brandTagline: {
    fontSize: 12,
    color: KingdomColors.silver.bright,
    marginTop: 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    marginRight: 16,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: KingdomColors.gold.bright,
  },
  profileImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: KingdomColors.primary.deepNavy,
    borderWidth: 2,
    borderColor: KingdomColors.gold.bright,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.gold.bright,
  },
  profileInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: '#cccccc',
    marginBottom: 4,
  },
  displayName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  emailText: {
    fontSize: 14,
    color: '#999999',
  },
  faithModeIndicator: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 4,
    fontWeight: '600',
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: KingdomColors.gold.bright,
    backgroundColor: KingdomColors.primary.royalPurple,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.gold.bright,
  },
  toolsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 20,
  },
  toolsGrid: {
    gap: 16,
  },
  toolCard: {
    backgroundColor: '#111111',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardContent: {
    padding: 20,
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 14,
    color: '#cccccc',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default CreatorDashboardScreen;

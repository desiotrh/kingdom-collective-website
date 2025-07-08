import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFaithMode } from '../contexts/FaithModeContext';
import { KingdomColors } from '../constants/KingdomColors';

interface NavMenuItem {
  id: string;
  title: string;
  icon: string;
  route: string;
  category: 'content' | 'business' | 'community' | 'analytics' | 'tools' | 'settings';
  description: string;
  isPremium?: boolean;
}

interface AppMenuProps {
  visible: boolean;
  onClose: () => void;
}

export const AppMenu: React.FC<AppMenuProps> = ({ visible, onClose }) => {
  const navigation = useNavigation();
  const { faithMode } = useFaithMode();
  const [activeCategory, setActiveCategory] = useState<string>('content');

  const menuItems: NavMenuItem[] = [
    // Content Creation
    {
      id: 'ai-studio',
      title: 'AI Content Studio',
      icon: 'sparkles-outline',
      route: 'AIStudio',
      category: 'content',
      description: 'Generate posts, captions, and designs with AI',
    },
    {
      id: 'design-studio',
      title: 'Design Studio',
      icon: 'brush-outline',
      route: 'DesignStudio',
      category: 'content',
      description: 'Create stunning visuals and graphics',
    },
    {
      id: 'editor',
      title: 'Photo & Video Editor',
      icon: 'image-outline',
      route: 'Editor',
      category: 'content',
      description: 'Professional editing tools',
    },
    {
      id: 'planner',
      title: 'Content Planner',
      icon: 'calendar-outline',
      route: 'Planner',
      category: 'content',
      description: 'Plan and schedule your content',
    },
    
    // Business Tools
    {
      id: 'products',
      title: 'Product Manager',
      icon: 'cube-outline',
      route: 'Products',
      category: 'business',
      description: 'Manage your products and inventory',
    },
    {
      id: 'storefront',
      title: 'Storefront Builder',
      icon: 'storefront-outline',
      route: 'Storefront',
      category: 'business',
      description: 'Build your online presence',
    },
    {
      id: 'funnels',
      title: 'Sales Funnels',
      icon: 'funnel-outline',
      route: 'Funnels',
      category: 'business',
      description: 'Create lead magnets and funnels',
    },
    {
      id: 'courses',
      title: 'Course Builder',
      icon: 'school-outline',
      route: 'Courses',
      category: 'business',
      description: 'Create and sell online courses',
    },
    
    // Community & Growth
    {
      id: 'community',
      title: faithMode ? 'Forge Community' : 'Community Hub',
      icon: 'people-outline',
      route: 'ForgeCommunity',
      category: 'community',
      description: faithMode ? 'Connect with Kingdom entrepreneurs' : 'Connect with like-minded creators',
    },
    {
      id: 'mentorship',
      title: 'Mentorship Hub',
      icon: 'school-outline',
      route: 'MentorshipHub',
      category: 'community',
      description: 'Find mentors or become one',
    },
    {
      id: 'testimonies',
      title: faithMode ? 'Testimony Wall' : 'Success Stories',
      icon: 'megaphone-outline',
      route: 'TestimonyWall',
      category: 'community',
      description: faithMode ? 'Share God stories' : 'Share your wins',
    },
    
    // Analytics & Insights
    {
      id: 'analytics',
      title: 'Analytics Dashboard',
      icon: 'analytics-outline',
      route: 'Analytics',
      category: 'analytics',
      description: 'Track performance and growth',
    },
    {
      id: 'analytics-overview',
      title: 'Performance Overview',
      icon: 'trending-up-outline',
      route: 'AnalyticsOverview',
      category: 'analytics',
      description: 'Quick performance insights',
    },
    
    // Advanced Tools
    {
      id: 'hashtag-manager',
      title: 'Hashtag Manager',
      icon: 'pricetag-outline',
      route: 'HashtagManager',
      category: 'tools',
      description: 'Optimize your hashtag strategy',
    },
    {
      id: 'link-bio',
      title: 'Link in Bio Builder',
      icon: 'link-outline',
      route: 'LinkInBioBuilder',
      category: 'tools',
      description: 'Create powerful landing pages',
    },
    {
      id: 'email-marketing',
      title: 'Email Marketing',
      icon: 'mail-outline',
      route: 'EmailMarketing',
      category: 'tools',
      description: 'Build and nurture your email list',
      isPremium: true,
    },
    {
      id: 'crm',
      title: 'Customer Management',
      icon: 'contacts-outline',
      route: 'CRM',
      category: 'tools',
      description: 'Manage customer relationships',
      isPremium: true,
    },
    
    // Settings & Account
    {
      id: 'settings',
      title: 'Settings',
      icon: 'settings-outline',
      route: 'Settings',
      category: 'settings',
      description: 'App preferences and account',
    },
    {
      id: 'pricing',
      title: 'Upgrade Plan',
      icon: 'diamond-outline',
      route: 'Pricing',
      category: 'settings',
      description: 'Unlock premium features',
    },
  ];

  const categories = [
    { id: 'content', name: 'Content', icon: 'create-outline' },
    { id: 'business', name: 'Business', icon: 'business-outline' },
    { id: 'community', name: 'Community', icon: 'people-outline' },
    { id: 'analytics', name: 'Analytics', icon: 'analytics-outline' },
    { id: 'tools', name: 'Tools', icon: 'construct-outline' },
    { id: 'settings', name: 'Settings', icon: 'settings-outline' },
  ];

  const filteredItems = menuItems.filter(item => item.category === activeCategory);

  const handleNavigate = (route: string) => {
    onClose();
    setTimeout(() => {
      navigation.navigate(route as never);
    }, 100);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>
              {faithMode ? '👑 Kingdom Studios' : '🚀 Creator Studio'}
            </Text>
            <Text style={styles.headerSubtitle}>
              {faithMode ? 'Building for eternity' : 'Create with purpose'}
            </Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={KingdomColors.text.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Category Tabs */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.categoryTabs}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryTab,
                  activeCategory === category.id && styles.activeCategoryTab,
                ]}
                onPress={() => setActiveCategory(category.id)}
              >
                <Ionicons 
                  name={category.icon as any} 
                  size={16} 
                  color={
                    activeCategory === category.id 
                      ? KingdomColors.background.primary 
                      : KingdomColors.text.secondary
                  } 
                />
                <Text 
                  style={[
                    styles.categoryTabText,
                    activeCategory === category.id && styles.activeCategoryTabText,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Menu Items */}
          <ScrollView style={styles.menuItems} showsVerticalScrollIndicator={false}>
            {filteredItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => handleNavigate(item.route)}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.menuItemIcon}>
                    <Ionicons 
                      name={item.icon as any} 
                      size={20} 
                      color={KingdomColors.primary.royalPurple} 
                    />
                  </View>
                  <View style={styles.menuItemText}>
                    <View style={styles.menuItemTitleRow}>
                      <Text style={styles.menuItemTitle}>{item.title}</Text>
                      {item.isPremium && (
                        <View style={styles.premiumBadge}>
                          <Ionicons name="diamond" size={10} color={KingdomColors.gold.bright} />
                          <Text style={styles.premiumText}>PRO</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.menuItemDescription}>{item.description}</Text>
                  </View>
                </View>
                <Ionicons 
                  name="chevron-forward" 
                  size={20} 
                  color={KingdomColors.text.secondary} 
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButton} onPress={onClose}>
            <Text style={styles.footerButtonText}>
              {faithMode ? '🔥 Ready to build the Kingdom!' : '✨ Let\'s create something amazing!'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: KingdomColors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: KingdomColors.default.border,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  categoryTabs: {
    flexGrow: 0,
    paddingVertical: 12,
    paddingLeft: 20,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: KingdomColors.default.border,
    gap: 6,
  },
  activeCategoryTab: {
    backgroundColor: KingdomColors.primary.royalPurple,
    borderColor: KingdomColors.primary.royalPurple,
  },
  categoryTabText: {
    fontSize: 12,
    fontWeight: '500',
    color: KingdomColors.text.secondary,
  },
  activeCategoryTabText: {
    color: KingdomColors.background.primary,
  },
  menuItems: {
    flex: 1,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: KingdomColors.default.border + '30',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: KingdomColors.primary.royalPurple + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.text.primary,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: KingdomColors.gold.bright + '20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  premiumText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: KingdomColors.gold.bright,
  },
  menuItemDescription: {
    fontSize: 13,
    color: KingdomColors.text.secondary,
    marginTop: 2,
    lineHeight: 16,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: KingdomColors.default.border,
  },
  footerButton: {
    backgroundColor: KingdomColors.primary.royalPurple,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.background.primary,
  },
});

export default AppMenu;

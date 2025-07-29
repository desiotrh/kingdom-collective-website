import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFaithMode } from '../contexts/FaithModeContext';
import { useAuth } from '../contexts/UnifiedAuthContext';
import { useAppNavigation } from '../utils/navigationUtils';
import { KingdomColors } from '../constants/KingdomColors';

interface Resource {
  id: string;
  title: string;
  type: 'video' | 'article' | 'podcast' | 'ebook' | 'template';
  category: string;
  duration?: string;
  author: string;
  thumbnail: string;
  description: string;
  isBookmarked: boolean;
  isPremium: boolean;
  tags: string[];
}

interface TeachingModule {
  id: string;
  title: string;
  description: string;
  lessons: number;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  thumbnail: string;
  progress: number;
  instructor: string;
}

const TeachingScreen: React.FC = () => {
  const navigation = useAppNavigation();
  const { faithMode } = useFaithMode();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'modules' | 'library' | 'progress' | 'resources'>('modules');
  
  const [teachingModules] = useState<TeachingModule[]>([
    {
      id: '1',
      title: faithMode ? 'Kingdom Entrepreneurship Foundations' : 'Purpose-Driven Business Foundations',
      description: faithMode 
        ? 'Learn to build businesses that honor God and advance His Kingdom'
        : 'Build businesses that create positive impact and fulfill your purpose',
      lessons: 12,
      duration: '3h 45m',
      level: 'beginner',
      thumbnail: 'https://via.placeholder.com/200x120/2D1B69/FFD700?text=Kingdom+Biz',
      progress: 65,
      instructor: 'Sarah Kingdom',
    },
    {
      id: '2',
      title: faithMode ? 'Faith-Based Content Creation' : 'Authentic Content Creation',
      description: faithMode
        ? 'Create content that reflects your faith and transforms lives'
        : 'Create authentic content that inspires and connects with your audience',
      lessons: 8,
      duration: '2h 30m',
      level: 'intermediate',
      thumbnail: 'https://via.placeholder.com/200x120/2D1B69/FFD700?text=Content',
      progress: 25,
      instructor: 'Marcus Faith',
    },
    {
      id: '3',
      title: 'Advanced Marketing Strategies',
      description: 'Master advanced marketing techniques that align with your values',
      lessons: 15,
      duration: '4h 20m',
      level: 'advanced',
      thumbnail: 'https://via.placeholder.com/200x120/2D1B69/FFD700?text=Marketing',
      progress: 0,
      instructor: 'Rachel Vision',
    },
  ]);

  const [resources] = useState<Resource[]>([
    {
      id: '1',
      title: faithMode ? 'Building Kingdom Wealth' : 'Building Purpose-Driven Wealth',
      type: 'ebook',
      category: faithMode ? 'Kingdom Business' : 'Business Strategy',
      author: 'Dr. Kingdom Builder',
      thumbnail: 'https://via.placeholder.com/150x200/2D1B69/FFD700?text=eBook',
      description: faithMode
        ? 'A comprehensive guide to building wealth that honors God and impacts eternity'
        : 'A comprehensive guide to building wealth while staying true to your values',
      isBookmarked: true,
      isPremium: false,
      tags: ['business', 'wealth', 'strategy'],
    },
    {
      id: '2',
      title: 'Content Creation Masterclass',
      type: 'video',
      category: 'Content Strategy',
      duration: '45 min',
      author: 'Creative Studios',
      thumbnail: 'https://via.placeholder.com/150x200/2D1B69/FFD700?text=Video',
      description: 'Learn to create compelling content that engages and converts your audience',
      isBookmarked: false,
      isPremium: true,
      tags: ['content', 'video', 'social media'],
    },
    {
      id: '3',
      title: faithMode ? 'Prayer & Business Success' : 'Mindfulness & Business Success',
      type: 'podcast',
      category: 'Mindset',
      duration: '32 min',
      author: 'Success Mindset',
      thumbnail: 'https://via.placeholder.com/150x200/2D1B69/FFD700?text=Podcast',
      description: faithMode
        ? 'How prayer and spiritual practices enhance business success'
        : 'How mindfulness and meditation enhance business success',
      isBookmarked: true,
      isPremium: false,
      tags: ['mindset', 'success', faithMode ? 'prayer' : 'mindfulness'],
    },
  ]);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'business', name: faithMode ? 'Kingdom Business' : 'Business Strategy' },
    { id: 'content', name: 'Content Creation' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'mindset', name: 'Mindset' },
    { id: 'finance', name: 'Finance' },
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return KingdomColors.accent.success;
      case 'intermediate':
        return KingdomColors.accent.warning;
      case 'advanced':
        return KingdomColors.accent.error;
      default:
        return KingdomColors.text.secondary;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return 'play-circle-outline';
      case 'article':
        return 'document-text-outline';
      case 'podcast':
        return 'headset-outline';
      case 'ebook':
        return 'book-outline';
      case 'template':
        return 'document-outline';
      default:
        return 'document-outline';
    }
  };

  const handleStartModule = (module: TeachingModule) => {
    Alert.alert(
      `Start ${module.title}`,
      `This would open the ${module.lessons}-lesson course with ${module.duration} of content.`,
      [
        { text: 'Start Learning', onPress: () => console.log('Starting module') },
        { text: 'Preview', onPress: () => console.log('Preview module') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleOpenResource = (resource: Resource) => {
    if (resource.isPremium) {
      Alert.alert(
        'Premium Content',
        'This resource requires a premium subscription. Would you like to upgrade?',
        [
          { text: 'Upgrade Now', onPress: () => console.log('Navigate to pricing') },
          { text: 'Maybe Later', style: 'cancel' },
        ]
      );
    } else {
      Alert.alert(
        resource.title,
        `Opening ${resource.type}: ${resource.description}`,
        [{ text: 'OK' }]
      );
    }
  };

  const renderModuleCard = (module: TeachingModule) => (
    <TouchableOpacity
      key={module.id}
      style={styles.moduleCard}
      onPress={() => handleStartModule(module)}
    >
      <Image source={{ uri: module.thumbnail }} style={styles.moduleThumbnail} />
      <View style={styles.moduleContent}>
        <View style={styles.moduleHeader}>
          <Text style={styles.moduleTitle}>{module.title}</Text>
          <View style={[styles.levelBadge, { backgroundColor: getLevelColor(module.level) + '20' }]}>
            <Text style={[styles.levelText, { color: getLevelColor(module.level) }]}>
              {module.level.toUpperCase()}
            </Text>
          </View>
        </View>
        
        <Text style={styles.moduleDescription}>{module.description}</Text>
        
        <View style={styles.moduleStats}>
          <View style={styles.statItem}>
            <Ionicons name="play-circle-outline" size={16} color={KingdomColors.text.secondary} />
            <Text style={styles.statText}>{module.lessons} lessons</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={16} color={KingdomColors.text.secondary} />
            <Text style={styles.statText}>{module.duration}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="person-outline" size={16} color={KingdomColors.text.secondary} />
            <Text style={styles.statText}>{module.instructor}</Text>
          </View>
        </View>
        
        {module.progress > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[styles.progressFill, { width: `${module.progress}%` }]} 
              />
            </View>
            <Text style={styles.progressText}>{module.progress}% complete</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderResourceCard = (resource: Resource) => (
    <TouchableOpacity
      key={resource.id}
      style={styles.resourceCard}
      onPress={() => handleOpenResource(resource)}
    >
      <Image source={{ uri: resource.thumbnail }} style={styles.resourceThumbnail} />
      <View style={styles.resourceContent}>
        <View style={styles.resourceHeader}>
          <View style={styles.resourceTypeIcon}>
            <Ionicons 
              name={getTypeIcon(resource.type) as any} 
              size={16} 
              color={KingdomColors.primary.royalPurple} 
            />
          </View>
          <Text style={styles.resourceType}>{resource.type.toUpperCase()}</Text>
          {resource.isPremium && (
            <View style={styles.premiumBadge}>
              <Ionicons name="diamond" size={10} color={KingdomColors.gold.bright} />
              <Text style={styles.premiumText}>PRO</Text>
            </View>
          )}
          <TouchableOpacity style={styles.bookmarkButton}>
            <Ionicons 
              name={resource.isBookmarked ? "bookmark" : "bookmark-outline"} 
              size={16} 
              color={resource.isBookmarked ? KingdomColors.gold.bright : KingdomColors.text.secondary} 
            />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.resourceTitle}>{resource.title}</Text>
        <Text style={styles.resourceAuthor}>by {resource.author}</Text>
        {resource.duration && (
          <Text style={styles.resourceDuration}>{resource.duration}</Text>
        )}
        <Text style={styles.resourceDescription}>{resource.description}</Text>
        
        <View style={styles.resourceTags}>
          {resource.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderModulesTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {faithMode ? 'Kingdom Learning Modules' : 'Learning Modules'}
        </Text>
        <Text style={styles.sectionSubtitle}>
          {faithMode 
            ? 'Comprehensive courses to build your Kingdom business'
            : 'Comprehensive courses to build your purpose-driven business'
          }
        </Text>
      </View>
      
      {teachingModules.map(renderModuleCard)}
    </ScrollView>
  );

  const renderResourcesTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Resource Library</Text>
        <Text style={styles.sectionSubtitle}>
          Curated resources to accelerate your growth
        </Text>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categorySelector}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.selectedCategoryButton,
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === category.id && styles.selectedCategoryButtonText,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {resources.map(renderResourceCard)}
    </ScrollView>
  );

  const renderLibraryTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Library</Text>
        <Text style={styles.sectionSubtitle}>
          Your saved resources and bookmarked content
        </Text>
      </View>
      
      <View style={styles.libraryStats}>
        <View style={styles.libraryStat}>
          <Text style={styles.libraryStatNumber}>
            {resources.filter(r => r.isBookmarked).length}
          </Text>
          <Text style={styles.libraryStatLabel}>Bookmarked</Text>
        </View>
        <View style={styles.libraryStat}>
          <Text style={styles.libraryStatNumber}>
            {teachingModules.filter(m => m.progress > 0).length}
          </Text>
          <Text style={styles.libraryStatLabel}>In Progress</Text>
        </View>
        <View style={styles.libraryStat}>
          <Text style={styles.libraryStatNumber}>
            {teachingModules.filter(m => m.progress === 100).length}
          </Text>
          <Text style={styles.libraryStatLabel}>Completed</Text>
        </View>
      </View>
      
      <Text style={styles.subsectionTitle}>Recently Accessed</Text>
      {resources.filter(r => r.isBookmarked).map(renderResourceCard)}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {faithMode ? '📚 Kingdom Academy' : '📚 Learning Center'}
        </Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search-outline" size={24} color={KingdomColors.text.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'modules' && styles.activeTab]}
          onPress={() => setActiveTab('modules')}
        >
          <Ionicons 
            name="school-outline" 
            size={18} 
            color={activeTab === 'modules' ? KingdomColors.primary.royalPurple : KingdomColors.text.secondary} 
          />
          <Text style={[styles.tabText, activeTab === 'modules' && styles.activeTabText]}>
            Modules
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'resources' && styles.activeTab]}
          onPress={() => setActiveTab('resources')}
        >
          <Ionicons 
            name="library-outline" 
            size={18} 
            color={activeTab === 'resources' ? KingdomColors.primary.royalPurple : KingdomColors.text.secondary} 
          />
          <Text style={[styles.tabText, activeTab === 'resources' && styles.activeTabText]}>
            Resources
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'library' && styles.activeTab]}
          onPress={() => setActiveTab('library')}
        >
          <Ionicons 
            name="bookmark-outline" 
            size={18} 
            color={activeTab === 'library' ? KingdomColors.primary.royalPurple : KingdomColors.text.secondary} 
          />
          <Text style={[styles.tabText, activeTab === 'library' && styles.activeTabText]}>
            My Library
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'modules' && renderModulesTab()}
      {activeTab === 'resources' && renderResourcesTab()}
      {activeTab === 'library' && renderLibraryTab()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: KingdomColors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: KingdomColors.default.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
  },
  searchButton: {
    padding: 8,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: KingdomColors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: KingdomColors.default.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 4,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: KingdomColors.primary.royalPurple,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: KingdomColors.text.secondary,
  },
  activeTabText: {
    color: KingdomColors.primary.royalPurple,
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  sectionHeader: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    lineHeight: 20,
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginTop: 20,
    marginBottom: 16,
  },
  moduleCard: {
    backgroundColor: KingdomColors.background.secondary,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: KingdomColors.default.border,
  },
  moduleThumbnail: {
    width: '100%',
    height: 120,
  },
  moduleContent: {
    padding: 16,
  },
  moduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    flex: 1,
    marginRight: 8,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  levelText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  moduleDescription: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    marginBottom: 12,
    lineHeight: 18,
  },
  moduleStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  statText: {
    fontSize: 12,
    color: KingdomColors.text.secondary,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: KingdomColors.default.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: KingdomColors.primary.royalPurple,
  },
  progressText: {
    fontSize: 11,
    color: KingdomColors.text.secondary,
    marginTop: 4,
  },
  categorySelector: {
    marginBottom: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: KingdomColors.default.border,
  },
  selectedCategoryButton: {
    backgroundColor: KingdomColors.primary.royalPurple,
    borderColor: KingdomColors.primary.royalPurple,
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: KingdomColors.text.secondary,
  },
  selectedCategoryButtonText: {
    color: KingdomColors.background.primary,
  },
  resourceCard: {
    backgroundColor: KingdomColors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: KingdomColors.default.border,
  },
  resourceThumbnail: {
    width: 60,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  resourceContent: {
    flex: 1,
  },
  resourceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  resourceTypeIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: KingdomColors.primary.royalPurple + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resourceType: {
    fontSize: 10,
    fontWeight: 'bold',
    color: KingdomColors.text.secondary,
    flex: 1,
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
    fontSize: 8,
    fontWeight: 'bold',
    color: KingdomColors.gold.bright,
  },
  bookmarkButton: {
    padding: 4,
  },
  resourceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 4,
  },
  resourceAuthor: {
    fontSize: 12,
    color: KingdomColors.text.secondary,
    marginBottom: 2,
  },
  resourceDuration: {
    fontSize: 11,
    color: KingdomColors.primary.royalPurple,
    marginBottom: 6,
  },
  resourceDescription: {
    fontSize: 12,
    color: KingdomColors.text.secondary,
    lineHeight: 16,
    marginBottom: 8,
  },
  resourceTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  tag: {
    backgroundColor: KingdomColors.primary.royalPurple + '15',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 10,
    color: KingdomColors.primary.royalPurple,
  },
  libraryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    backgroundColor: KingdomColors.background.secondary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: KingdomColors.default.border,
  },
  libraryStat: {
    alignItems: 'center',
  },
  libraryStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.primary.royalPurple,
    marginBottom: 4,
  },
  libraryStatLabel: {
    fontSize: 12,
    color: KingdomColors.text.secondary,
  },
});

export default React.memo(TeachingScreen);

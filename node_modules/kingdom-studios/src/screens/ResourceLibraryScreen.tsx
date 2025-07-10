/**
 * Kingdom Studios Resource Library Screen
 * Digital library with spiritual resources, articles, and guidance with dual-mode support
 * Features: Faith Mode / Encouragement Mode switching, resource categories, favorites
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Modal,
  Dimensions,
  SafeAreaView,
  RefreshControl,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { KingdomColors } from '../constants/KingdomColors';
import { 
  SpiritualResource, 
  ResourceCategory, 
  AppMode, 
  RESOURCE_CATEGORIES,
  getModeConfig,
  getCategoryForMode,
  getModeLabelForCategory,
} from '../types/spiritual';

const { width } = Dimensions.get('window');

interface ResourceLibraryScreenProps {
  mode?: AppMode;
  onModeSwitch?: (mode: AppMode) => void;
}

const ResourceLibraryScreen: React.FC<ResourceLibraryScreenProps> = ({
  mode = 'faith',
  onModeSwitch
}) => {
  const navigation = useNavigation();
  const [resources, setResources] = useState<SpiritualResource[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedResource, setSelectedResource] = useState<SpiritualResource | null>(null);
  const [showResourceModal, setShowResourceModal] = useState(false);

  const modeConfig = getModeConfig(mode);
  const availableCategories = getCategoryForMode(RESOURCE_CATEGORIES, mode);

  useEffect(() => {
    loadResources();
  }, [mode, selectedCategory]);

  const loadResources = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockResources: SpiritualResource[] = [
        {
          id: '1',
          title: mode === 'faith' ? 'Daily Devotional: Walking in Faith' : 'Daily Motivation: Building Confidence',
          description: mode === 'faith'
            ? 'Start each day with inspiring scripture and reflection to strengthen your faith journey.'
            : 'Begin your day with powerful affirmations and motivational insights to boost your confidence.',
          content: mode === 'faith'
            ? 'Today\'s verse: "Trust in the Lord with all your heart and lean not on your own understanding." - Proverbs 3:5. Reflection: When we face uncertainty, God calls us to trust Him completely...'
            : 'Today\'s affirmation: "I am capable of achieving my goals." Reflection: Confidence comes from taking consistent action toward your dreams. Every small step builds momentum...',
          category: availableCategories.find(c => c.id === 'devotions') || availableCategories[0],
          type: 'article',
          format: 'text',
          isPublic: true,
          isPremium: false,
          tags: mode === 'faith' ? ['devotional', 'scripture', 'faith'] : ['motivation', 'confidence', 'daily'],
          createdAt: '2024-01-15T06:00:00Z',
          updatedAt: '2024-01-15T06:00:00Z',
          views: 1250,
          likes: 89,
          downloadCount: 0,
          rating: 4.8,
          reviews: [],
          isPreview: false,
          estimatedReadTime: 5,
          mode,
          appropriatenessLevel: 'general',
          spiritualLevel: 'beginner'
        },
        {
          id: '2',
          title: mode === 'faith' ? 'Prayer Guide: Overcoming Anxiety' : 'Mindfulness Guide: Managing Stress',
          description: mode === 'faith'
            ? 'Biblical strategies and prayers for finding peace in anxious moments.'
            : 'Practical mindfulness techniques and exercises for reducing stress and anxiety.',
          content: mode === 'faith'
            ? 'When anxiety overwhelms, remember Philippians 4:6-7: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God..."'
            : 'Mindfulness practice begins with awareness. Take three deep breaths and notice: What am I feeling right now? Where do I feel tension in my body? What thoughts are present?',
          category: availableCategories.find(c => c.id === 'mental-health') || availableCategories[0],
          type: 'guide',
          format: 'text',
          isPublic: true,
          isPremium: false,
          tags: mode === 'faith' ? ['prayer', 'anxiety', 'peace'] : ['mindfulness', 'stress', 'wellness'],
          createdAt: '2024-01-14T14:30:00Z',
          updatedAt: '2024-01-14T14:30:00Z',
          views: 892,
          likes: 156,
          downloadCount: 45,
          rating: 4.9,
          reviews: [],
          isPreview: false,
          estimatedReadTime: 8,
          mode,
          appropriatenessLevel: 'general',
          spiritualLevel: 'intermediate'
        },
        {
          id: '3',
          title: mode === 'faith' ? 'Bible Study: Financial Stewardship' : 'Guide: Personal Finance Mastery',
          description: mode === 'faith'
            ? 'Learn biblical principles for managing money and honoring God with your finances.'
            : 'Practical strategies for budgeting, saving, and building wealth responsibly.',
          content: mode === 'faith'
            ? 'God calls us to be faithful stewards of everything He has given us. In Matthew 25:21, Jesus says, "Well done, good and faithful servant! You have been faithful with a few things..."'
            : 'Financial mastery begins with understanding your money mindset. Track your spending for 30 days to identify patterns. Create a budget that aligns with your values and goals...',
          category: availableCategories.find(c => c.id === 'finances') || availableCategories[0],
          type: 'study',
          format: 'text',
          isPublic: true,
          isPremium: true,
          tags: mode === 'faith' ? ['stewardship', 'money', 'biblical'] : ['finance', 'budgeting', 'wealth'],
          createdAt: '2024-01-13T10:15:00Z',
          updatedAt: '2024-01-13T10:15:00Z',
          views: 634,
          likes: 98,
          downloadCount: 73,
          rating: 4.7,
          reviews: [],
          isPreview: false,
          estimatedReadTime: 12,
          mode,
          appropriatenessLevel: 'general',
          spiritualLevel: 'intermediate'
        }
      ];
      setResources(mockResources);
      setLoading(false);
    }, 1000);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadResources();
    setRefreshing(false);
  };

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category.id === selectedCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleToggleFavorite = (resourceId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(resourceId)) {
        newFavorites.delete(resourceId);
      } else {
        newFavorites.add(resourceId);
      }
      return newFavorites;
    });
  };

  const handleLike = (resourceId: string) => {
    setResources(prev => prev.map(r => 
      r.id === resourceId ? { ...r, likes: r.likes + 1 } : r
    ));
  };

  const handleOpenResource = (resource: SpiritualResource) => {
    setSelectedResource(resource);
    setShowResourceModal(true);
    // Increment view count
    setResources(prev => prev.map(r => 
      r.id === resource.id ? { ...r, views: r.views + 1 } : r
    ));
  };

  const handleDownload = (resource: SpiritualResource) => {
    setResources(prev => prev.map(r => 
      r.id === resource.id ? { ...r, downloadCount: r.downloadCount + 1 } : r
    ));
    Alert.alert(
      'Resource Downloaded',
      `"${resource.title}" has been saved to your device.`
    );
  };

  const renderResourceCard = ({ item }: { item: SpiritualResource }) => (
    <TouchableOpacity style={styles.resourceCard} onPress={() => handleOpenResource(item)}>
      <View style={styles.resourceHeader}>
        <View style={styles.resourceInfo}>
          <View style={styles.resourceMeta}>
            <View style={[styles.categoryBadge, { backgroundColor: item.category.color }]}>
              <Text style={styles.categoryText}>
                {getModeLabelForCategory(item.category, mode)}
              </Text>
            </View>
            {item.isPremium && (
              <View style={[styles.premiumBadge, { backgroundColor: KingdomColors.gold.bright }]}>
                <Ionicons name="star" size={12} color="white" />
                <Text style={styles.premiumText}>Premium</Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => handleToggleFavorite(item.id)}
          >
            <Ionicons 
              name={favorites.has(item.id) ? 'heart' : 'heart-outline'} 
              size={24} 
              color={favorites.has(item.id) ? KingdomColors.accent.error : KingdomColors.gray} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.resourceTitle}>{item.title}</Text>
      <Text style={styles.resourceDescription}>{item.description}</Text>

      <View style={styles.tagsContainer}>
        {item.tags.slice(0, 3).map((tag: string, index: number) => (
          <View key={index} style={[styles.tag, { borderColor: modeConfig.branding.primaryColor }]}>
            <Text style={[styles.tagText, { color: modeConfig.branding.primaryColor }]}>
              #{tag}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.resourceFooter}>
        <View style={styles.resourceStats}>
          <View style={styles.statItem}>
            <Ionicons name="eye" size={16} color={KingdomColors.gray} />
            <Text style={styles.statText}>{item.views}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="heart" size={16} color={KingdomColors.gray} />
            <Text style={styles.statText}>{item.likes}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="time" size={16} color={KingdomColors.gray} />
            <Text style={styles.statText}>{item.estimatedReadTime} min</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleLike(item.id)}
        >
          <Ionicons name="heart-outline" size={20} color={modeConfig.branding.primaryColor} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryTab = (category: ResourceCategory | { id: string; name: string }) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryTab,
        selectedCategory === category.id && {
          backgroundColor: modeConfig.branding.primaryColor
        }
      ]}
      onPress={() => setSelectedCategory(category.id)}
    >
      <Text style={[
        styles.categoryTabText,
        selectedCategory === category.id && styles.categoryTabTextActive
      ]}>
        {category.id === 'all' ? 'All' : getModeLabelForCategory(category as ResourceCategory, mode)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[modeConfig.branding.primaryColor, modeConfig.branding.secondaryColor]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Resource Library</Text>
            <Text style={styles.headerSubtitle}>
              {mode === 'faith' 
                ? 'Spiritual resources for your faith journey'
                : 'Personal development resources for your success'
              }
            </Text>
          </View>
          {onModeSwitch && (
            <TouchableOpacity
              style={styles.modeSwitchButton}
              onPress={() => onModeSwitch(mode === 'faith' ? 'encouragement' : 'faith')}
            >
              <Ionicons 
                name={mode === 'faith' ? 'sunny' : 'moon'} 
                size={24} 
                color="white" 
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={KingdomColors.gray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search resources..."
            placeholderTextColor={KingdomColors.gray}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter" size={20} color={KingdomColors.gray} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {renderCategoryTab({ id: 'all', name: 'All' })}
          {availableCategories.map(renderCategoryTab)}
        </ScrollView>
      </View>

      <FlatList
        data={filteredResources}
        renderItem={renderResourceCard}
        keyExtractor={(item) => item.id}
        style={styles.resourcesList}
        contentContainerStyle={styles.resourcesContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[modeConfig.branding.primaryColor]}
          />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons 
              name={mode === 'faith' ? 'book' : 'library'} 
              size={60} 
              color={KingdomColors.gray} 
            />
            <Text style={styles.emptyTitle}>No Resources Found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search or browse different categories
            </Text>
          </View>
        )}
      />

      <Modal
        visible={showResourceModal}
        animationType="slide"
        transparent={false}
      >
        {selectedResource && (
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowResourceModal(false)}
              >
                <Ionicons name="arrow-back" size={24} color={KingdomColors.text.primary} />
              </TouchableOpacity>
              <Text style={styles.modalHeaderTitle}>Resource</Text>
              <TouchableOpacity
                style={styles.modalActionButton}
                onPress={() => handleDownload(selectedResource)}
              >
                <Ionicons name="download" size={24} color={modeConfig.branding.primaryColor} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <Text style={styles.modalResourceTitle}>{selectedResource.title}</Text>
              <Text style={styles.modalResourceDescription}>{selectedResource.description}</Text>
              
              <View style={styles.modalResourceMeta}>
                <View style={[styles.categoryBadge, { backgroundColor: selectedResource.category.color }]}>
                  <Text style={styles.categoryText}>
                    {getModeLabelForCategory(selectedResource.category, mode)}
                  </Text>
                </View>
                <Text style={styles.modalReadTime}>
                  {selectedResource.estimatedReadTime} min read
                </Text>
              </View>

              <Text style={styles.modalResourceContent}>{selectedResource.content}</Text>

              <View style={styles.modalTags}>
                {selectedResource.tags.map((tag: string, index: number) => (
                  <View key={index} style={[styles.tag, { borderColor: modeConfig.branding.primaryColor }]}>
                    <Text style={[styles.tagText, { color: modeConfig.branding.primaryColor }]}>
                      #{tag}
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </SafeAreaView>
        )}
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: KingdomColors.background.primary,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  modeSwitchButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: KingdomColors.text.inverse,
  },
  filterButton: {
    marginLeft: 10,
  },
  categoriesContainer: {
    backgroundColor: 'white',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: KingdomColors.lightGray,
  },
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 15,
    backgroundColor: KingdomColors.lightGray,
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.text.secondary,
  },
  categoryTabTextActive: {
    color: 'white',
  },
  resourcesList: {
    flex: 1,
  },
  resourcesContent: {
    padding: 20,
  },
  resourceCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  resourceHeader: {
    marginBottom: 15,
  },
  resourceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  resourceMeta: {
    flexDirection: 'row',
    gap: 10,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  categoryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  premiumText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  favoriteButton: {
    padding: 5,
  },
  resourceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.inverse,
    marginBottom: 10,
  },
  resourceDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: KingdomColors.gray,
    marginBottom: 15,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  tag: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 5,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  resourceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: KingdomColors.lightGray,
  },
  resourceStats: {
    flexDirection: 'row',
    gap: 15,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: KingdomColors.gray,
  },
  actionButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: KingdomColors.gray,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: KingdomColors.lightGray,
  },
  modalCloseButton: {
    padding: 5,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.inverse,
  },
  modalActionButton: {
    padding: 5,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalResourceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.text.inverse,
    marginBottom: 10,
  },
  modalResourceDescription: {
    fontSize: 16,
    color: KingdomColors.gray,
    marginBottom: 20,
  },
  modalResourceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginBottom: 25,
  },
  modalReadTime: {
    fontSize: 14,
    color: KingdomColors.gray,
  },
  modalResourceContent: {
    fontSize: 16,
    lineHeight: 24,
    color: KingdomColors.text.inverse,
    marginBottom: 30,
  },
  modalTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 30,
  },
});

export default React.memo(ResourceLibraryScreen);

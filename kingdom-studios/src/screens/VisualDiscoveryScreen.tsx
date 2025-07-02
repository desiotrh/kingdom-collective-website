import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { KingdomColors } from '../constants/KingdomColors';
import { useDualMode } from '../contexts/DualModeContext';

const { width } = Dimensions.get('window');
const numColumns = 2;
const itemWidth = (width - 60) / numColumns;

interface DiscoveryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  tags: string[];
  author: string;
  likes: number;
  saves: number;
  type: 'design' | 'template' | 'inspiration' | 'tutorial' | 'resource';
  isPremium: boolean;
  faithMode?: {
    title: string;
    description: string;
    tags: string[];
  };
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  faithModeName?: string;
}

const VisualDiscoveryScreen: React.FC = () => {
  const { currentMode } = useDualMode();
  const colors = currentMode === 'faith' ? KingdomColors.faith : KingdomColors.encouragement;
  const navigation = useNavigation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<DiscoveryItem | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());

  const categories: Category[] = [
    {
      id: 'all',
      name: 'All',
      icon: '🌟',
      color: colors.accent,
      faithModeName: 'All Blessings',
    },
    {
      id: 'templates',
      name: 'Templates',
      icon: '📋',
      color: '#3B82F6',
      faithModeName: 'Ministry Templates',
    },
    {
      id: 'graphics',
      name: 'Graphics',
      icon: '🎨',
      color: '#8B5CF6',
      faithModeName: 'Faith Graphics',
    },
    {
      id: 'quotes',
      name: 'Quotes',
      icon: '💬',
      color: '#10B981',
      faithModeName: 'Scripture Quotes',
    },
    {
      id: 'layouts',
      name: 'Layouts',
      icon: '📱',
      color: '#F59E0B',
      faithModeName: 'Worship Layouts',
    },
    {
      id: 'photos',
      name: 'Photos',
      icon: '📸',
      color: '#EF4444',
      faithModeName: 'Kingdom Photos',
    },
    {
      id: 'videos',
      name: 'Videos',
      icon: '🎬',
      color: '#6366F1',
      faithModeName: 'Testimony Videos',
    },
  ];

  const discoveryItems: DiscoveryItem[] = currentMode === 'faith' ? [
    {
      id: '1',
      title: 'Scripture Memory Card Set',
      description: 'Beautiful printable cards for daily Bible verses',
      imageUrl: 'https://picsum.photos/400/600?random=1',
      category: 'templates',
      tags: ['scripture', 'memory', 'printable', 'daily'],
      author: 'Faith Designs Co',
      likes: 234,
      saves: 89,
      type: 'template',
      isPremium: false,
      faithMode: {
        title: 'Daily Bread Scripture Cards',
        description: 'Feed your soul with God\'s Word through beautiful memory cards',
        tags: ['scripture', 'daily-bread', 'memory-verses', 'bible-study'],
      },
    },
    {
      id: '2',
      title: 'Worship Service Slides',
      description: 'Professional church service presentation templates',
      imageUrl: 'https://picsum.photos/400/500?random=2',
      category: 'templates',
      tags: ['worship', 'church', 'slides', 'service'],
      author: 'Kingdom Media',
      likes: 456,
      saves: 178,
      type: 'template',
      isPremium: true,
      faithMode: {
        title: 'Holy Service Presentation Kit',
        description: 'Elevate your worship services with divine presentation templates',
        tags: ['worship', 'holy-service', 'church-media', 'divine-design'],
      },
    },
    {
      id: '3',
      title: 'Faith Quote Graphics',
      description: 'Inspirational Bible verse social media graphics',
      imageUrl: 'https://picsum.photos/400/700?random=3',
      category: 'graphics',
      tags: ['quotes', 'bible', 'social-media', 'inspiration'],
      author: 'Blessed Designs',
      likes: 678,
      saves: 234,
      type: 'design',
      isPremium: false,
    },
    {
      id: '4',
      title: 'Prayer Journal Template',
      description: 'Digital journal for tracking prayers and blessings',
      imageUrl: 'https://picsum.photos/400/580?random=4',
      category: 'templates',
      tags: ['prayer', 'journal', 'tracking', 'blessings'],
      author: 'Grace Studios',
      likes: 345,
      saves: 145,
      type: 'template',
      isPremium: true,
    },
    {
      id: '5',
      title: 'Christian Business Cards',
      description: 'Professional business cards with faith elements',
      imageUrl: 'https://picsum.photos/400/620?random=5',
      category: 'templates',
      tags: ['business', 'cards', 'professional', 'faith'],
      author: 'Kingdom Business',
      likes: 189,
      saves: 67,
      type: 'design',
      isPremium: false,
    },
  ] : [
    {
      id: '1',
      title: 'Motivational Quote Graphics',
      description: 'Powerful quotes for social media inspiration',
      imageUrl: 'https://picsum.photos/400/600?random=6',
      category: 'graphics',
      tags: ['motivation', 'quotes', 'inspiration', 'success'],
      author: 'Inspire Design Co',
      likes: 567,
      saves: 234,
      type: 'design',
      isPremium: false,
    },
    {
      id: '2',
      title: 'Business Growth Templates',
      description: 'Professional templates for entrepreneurs',
      imageUrl: 'https://picsum.photos/400/500?random=7',
      category: 'templates',
      tags: ['business', 'growth', 'entrepreneur', 'success'],
      author: 'Growth Studio',
      likes: 789,
      saves: 345,
      type: 'template',
      isPremium: true,
    },
    {
      id: '3',
      title: 'Goal Setting Planner',
      description: 'Digital planner for achieving your dreams',
      imageUrl: 'https://picsum.photos/400/700?random=8',
      category: 'templates',
      tags: ['goals', 'planning', 'success', 'achievement'],
      author: 'Dream Builders',
      likes: 432,
      saves: 178,
      type: 'template',
      isPremium: false,
    },
    {
      id: '4',
      title: 'Success Story Layouts',
      description: 'Beautiful layouts for sharing achievements',
      imageUrl: 'https://picsum.photos/400/580?random=9',
      category: 'layouts',
      tags: ['success', 'stories', 'achievements', 'layouts'],
      author: 'Victory Designs',
      likes: 234,
      saves: 89,
      type: 'design',
      isPremium: true,
    },
    {
      id: '5',
      title: 'Empowerment Photo Series',
      description: 'Stunning photos for motivation content',
      imageUrl: 'https://picsum.photos/400/620?random=10',
      category: 'photos',
      tags: ['empowerment', 'motivation', 'photos', 'inspiration'],
      author: 'Power Visuals',
      likes: 345,
      saves: 156,
      type: 'resource',
      isPremium: false,
    },
  ];

  const getCurrentPrompt = () => {
    const faithPrompts = [
      "🙏 Discover designs that glorify God and inspire others",
      "✨ Find resources to build His kingdom through creativity",
      "💝 Explore templates that spread love and encouragement",
      "🌟 Uncover divine inspiration for your ministry",
    ];
    
    const encouragementPrompts = [
      "💫 Discover designs that inspire and empower",
      "🚀 Find resources to fuel your creative journey",
      "✨ Explore templates that motivate and elevate",
      "🌟 Uncover inspiration for your next breakthrough",
    ];
    
    const prompts = currentMode === 'faith' ? faithPrompts : encouragementPrompts;
    return prompts[Math.floor(Math.random() * prompts.length)];
  };

  const filteredItems = discoveryItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const toggleLike = (itemId: string) => {
    setLikedItems(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(itemId)) {
        newLiked.delete(itemId);
      } else {
        newLiked.add(itemId);
      }
      return newLiked;
    });
  };

  const toggleSave = (itemId: string) => {
    setSavedItems(prev => {
      const newSaved = new Set(prev);
      if (newSaved.has(itemId)) {
        newSaved.delete(itemId);
      } else {
        newSaved.add(itemId);
      }
      return newSaved;
    });
  };

  const openItem = (item: DiscoveryItem) => {
    setSelectedItem(item);
    setShowItemModal(true);
  };

  const useTemplate = (item: DiscoveryItem) => {
    if (item.isPremium) {
      Alert.alert(
        'Premium Template',
        'This template requires a premium subscription. Would you like to upgrade?',
        [
          { text: 'Maybe Later', style: 'cancel' },
          { text: 'Upgrade Now', onPress: () => navigation.navigate('Pricing' as never) },
        ]
      );
    } else {
      Alert.alert(
        'Template Downloaded',
        'Template has been added to your library! You can now customize it.',
        [
          { text: 'Open in Editor', onPress: () => navigation.navigate('ContentGenerator' as never) },
          { text: 'OK' },
        ]
      );
    }
  };

  const renderCategoryChip = (category: Category) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryChip,
        {
          backgroundColor: selectedCategory === category.id ? category.color : colors.surface,
          borderColor: category.color,
        },
      ]}
      onPress={() => setSelectedCategory(category.id)}
    >
      <Text style={styles.categoryIcon}>{category.icon}</Text>
      <Text
        style={[
          styles.categoryText,
          {
            color: selectedCategory === category.id ? '#fff' : colors.text,
          },
        ]}
      >
        {currentMode === 'faith' && category.faithModeName ? category.faithModeName : category.name}
      </Text>
    </TouchableOpacity>
  );

  const renderDiscoveryItem = ({ item }: { item: DiscoveryItem }) => {
    const displayData = currentMode === 'faith' && item.faithMode ? item.faithMode : item;
    
    return (
      <TouchableOpacity
        style={styles.discoveryCard}
        onPress={() => openItem(item)}
        activeOpacity={0.9}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
          {item.isPremium && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>👑</Text>
            </View>
          )}
          <View style={styles.imageOverlay}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: 'rgba(0,0,0,0.6)' }]}
              onPress={() => toggleLike(item.id)}
            >
              <Ionicons
                name={likedItems.has(item.id) ? 'heart' : 'heart-outline'}
                size={20}
                color={likedItems.has(item.id) ? '#FF4444' : '#fff'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: 'rgba(0,0,0,0.6)' }]}
              onPress={() => toggleSave(item.id)}
            >
              <Ionicons
                name={savedItems.has(item.id) ? 'bookmark' : 'bookmark-outline'}
                size={20}
                color={savedItems.has(item.id) ? colors.accent : '#fff'}
              />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={[styles.itemContent, { backgroundColor: colors.surface }]}>
          <Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={2}>
            {displayData.title}
          </Text>
          <Text style={[styles.itemDescription, { color: colors.textSecondary }]} numberOfLines={2}>
            {displayData.description}
          </Text>
          
          <View style={styles.itemFooter}>
            <Text style={[styles.authorText, { color: colors.textSecondary }]}>
              by {item.author}
            </Text>
            <View style={styles.stats}>
              <Text style={[styles.statText, { color: colors.textSecondary }]}>
                {item.likes} ❤️
              </Text>
              <Text style={[styles.statText, { color: colors.textSecondary }]}>
                {item.saves} 📌
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>
          {currentMode === 'faith' ? 'Divine Discovery' : 'Visual Discovery'}
        </Text>
        <TouchableOpacity>
          <Ionicons name="filter" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {getCurrentPrompt()}
        </Text>

        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder={currentMode === 'faith' ? "Search God's inspiration..." : "Search creative inspiration..."}
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Category Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map(renderCategoryChip)}
        </ScrollView>

        {/* Discovery Grid */}
        <FlatList
          data={filteredItems}
          renderItem={renderDiscoveryItem}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.discoveryGrid}
          columnWrapperStyle={styles.row}
        />
      </ScrollView>

      {/* Item Detail Modal */}
      <Modal
        visible={showItemModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowItemModal(false)}
      >
        {selectedItem && (
          <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowItemModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Template Details
              </Text>
              <TouchableOpacity onPress={() => toggleSave(selectedItem.id)}>
                <Ionicons
                  name={savedItems.has(selectedItem.id) ? 'bookmark' : 'bookmark-outline'}
                  size={24}
                  color={savedItems.has(selectedItem.id) ? colors.accent : colors.text}
                />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <Image source={{ uri: selectedItem.imageUrl }} style={styles.modalImage} />
              
              <View style={styles.modalDetails}>
                <Text style={[styles.modalItemTitle, { color: colors.text }]}>
                  {currentMode === 'faith' && selectedItem.faithMode 
                    ? selectedItem.faithMode.title 
                    : selectedItem.title}
                </Text>
                
                <Text style={[styles.modalItemDescription, { color: colors.textSecondary }]}>
                  {currentMode === 'faith' && selectedItem.faithMode 
                    ? selectedItem.faithMode.description 
                    : selectedItem.description}
                </Text>

                <View style={styles.modalStats}>
                  <Text style={[styles.modalStatText, { color: colors.textSecondary }]}>
                    by {selectedItem.author}
                  </Text>
                  <View style={styles.modalStatsRow}>
                    <Text style={[styles.modalStatText, { color: colors.textSecondary }]}>
                      {selectedItem.likes} likes
                    </Text>
                    <Text style={[styles.modalStatText, { color: colors.textSecondary }]}>
                      {selectedItem.saves} saves
                    </Text>
                  </View>
                </View>

                <View style={styles.tagsContainer}>
                  {(currentMode === 'faith' && selectedItem.faithMode 
                    ? selectedItem.faithMode.tags 
                    : selectedItem.tags
                  ).map((tag) => (
                    <View key={tag} style={[styles.tag, { backgroundColor: colors.surface }]}>
                      <Text style={[styles.tagText, { color: colors.text }]}>#{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.likeButton, { backgroundColor: colors.surface }]}
                onPress={() => toggleLike(selectedItem.id)}
              >
                <Ionicons
                  name={likedItems.has(selectedItem.id) ? 'heart' : 'heart-outline'}
                  size={20}
                  color={likedItems.has(selectedItem.id) ? '#FF4444' : colors.text}
                />
                <Text style={[styles.modalButtonText, { color: colors.text }]}>
                  {likedItems.has(selectedItem.id) ? 'Liked' : 'Like'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.useButton]}
                onPress={() => useTemplate(selectedItem)}
              >
                <LinearGradient
                  colors={[colors.accent, colors.accent + 'CC']}
                  style={styles.useButtonGradient}
                >
                  <Ionicons name="download" size={20} color="#fff" />
                  <Text style={styles.useButtonText}>
                    {selectedItem.isPremium ? 'Get Premium' : 'Use Template'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        )}
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
  },
  subtitle: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  categoriesScroll: {
    marginBottom: 20,
  },
  categoriesContainer: {
    paddingRight: 20,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  categoryIcon: {
    fontSize: 16,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  discoveryGrid: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  discoveryCard: {
    width: itemWidth,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  itemImage: {
    width: '100%',
    height: itemWidth * 1.4,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  premiumBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  premiumText: {
    fontSize: 12,
  },
  imageOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContent: {
    padding: 12,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorText: {
    fontSize: 10,
    fontStyle: 'italic',
  },
  stats: {
    flexDirection: 'row',
    gap: 8,
  },
  statText: {
    fontSize: 10,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
  },
  modalImage: {
    width: '100%',
    height: 300,
  },
  modalDetails: {
    padding: 20,
  },
  modalItemTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalItemDescription: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 16,
  },
  modalStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalStatsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  modalStatText: {
    fontSize: 14,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  likeButton: {
    borderWidth: 1,
    borderColor: '#ccc',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  useButton: {
    overflow: 'hidden',
  },
  useButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  useButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default VisualDiscoveryScreen;

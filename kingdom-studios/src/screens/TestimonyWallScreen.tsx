/**
 * Kingdom Studios Testimony Wall Screen - Clean Implementation
 * Community display for submitted testimonies with filtering, engagement, and dual-mode support
 * Features: Faith Mode / Encouragement Mode switching, category filtering, engagement actions
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { KingdomColors } from '../constants/KingdomColors';
import { 
  Testimony, 
  TestimonyCategory, 
  AppMode, 
  TESTIMONY_CATEGORIES,
  getModeConfig,
  getCategoryForMode,
  getModeLabelForCategory,
} from '../types/spiritual';

const { width } = Dimensions.get('window');

interface TestimonyWallScreenProps {
  mode?: AppMode;
  onModeSwitch?: (mode: AppMode) => void;
}

const TestimonyWallScreen: React.FC<TestimonyWallScreenProps> = ({
  mode = 'faith',
  onModeSwitch
}) => {
  const navigation = useNavigation();
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const modeConfig = getModeConfig(mode);
  const availableCategories = getCategoryForMode(TESTIMONY_CATEGORIES, mode);

  useEffect(() => {
    loadTestimonies();
  }, [mode, selectedCategory]);

  const loadTestimonies = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockTestimonies: Testimony[] = [
        {
          id: '1',
          userId: 'user1',
          userName: 'Sarah M.',
          userAvatar: undefined,
          title: mode === 'faith' ? 'God\'s Miraculous Provision' : 'Unexpected Financial Breakthrough',
          content: mode === 'faith' 
            ? 'I was struggling financially and facing eviction. After joining the prayer circle and declaring God\'s promises over my life, I received an unexpected job offer with double my previous salary. God is faithful!' 
            : 'After months of financial stress, I focused on positive thinking and networking. Through persistence and the support of this amazing community, I landed my dream job with amazing benefits!',
          category: availableCategories.find(c => c.id === 'provision') || availableCategories[0],
          type: 'written',
          isPublic: true,
          isApproved: true,
          tags: mode === 'faith' ? ['provision', 'breakthrough', 'faithfulness'] : ['success', 'career', 'persistence'],
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
          likes: 24,
          comments: [],
          shares: 8,
          prayerCount: 12,
          isScheduledPost: false,
          mode,
          encouragementLevel: 'strong',
          spiritualIntensity: 'growing'
        },
        {
          id: '2',
          userId: 'user2',
          userName: 'Marcus J.',
          userAvatar: undefined,
          title: mode === 'faith' ? 'Healing from Depression' : 'Overcoming Mental Health Challenges',
          content: mode === 'faith'
            ? 'After years of depression, I surrendered my life to Jesus. Through prayer, worship, and the support of my church family, God has completely healed my mind and given me joy again.'
            : 'Mental health struggles were overwhelming, but with therapy, community support, and daily mindfulness practices, I\'ve found peace and happiness again. You\'re not alone in this journey!',
          category: availableCategories.find(c => c.id === 'healing') || availableCategories[0],
          type: 'written',
          isPublic: true,
          isApproved: true,
          tags: mode === 'faith' ? ['healing', 'depression', 'salvation'] : ['mental-health', 'recovery', 'wellness'],
          createdAt: '2024-01-14T15:45:00Z',
          updatedAt: '2024-01-14T15:45:00Z',
          likes: 45,
          comments: [],
          shares: 15,
          prayerCount: 28,
          isScheduledPost: false,
          mode,
          encouragementLevel: 'strong',
          spiritualIntensity: 'mature'
        }
      ];
      setTestimonies(mockTestimonies);
      setLoading(false);
    }, 1000);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTestimonies();
    setRefreshing(false);
  };

  const filteredTestimonies = testimonies.filter(testimony => {
    const matchesCategory = selectedCategory === 'all' || testimony.category.id === selectedCategory;
    const matchesSearch = testimony.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         testimony.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleLike = (testimonyId: string) => {
    setTestimonies(prev => prev.map(t => 
      t.id === testimonyId ? { ...t, likes: t.likes + 1 } : t
    ));
  };

  const handlePray = (testimonyId: string) => {
    setTestimonies(prev => prev.map(t => 
      t.id === testimonyId ? { ...t, prayerCount: t.prayerCount + 1 } : t
    ));
    Alert.alert(
      mode === 'faith' ? 'Prayer Added' : 'Support Sent',
      mode === 'faith' 
        ? 'Your prayer has been added to this testimony. God sees your heart!'
        : 'Your support has been sent. Thank you for encouraging others!'
    );
  };

  const handleShare = (testimony: Testimony) => {
    Alert.alert(
      mode === 'faith' ? 'Share God\'s Goodness' : 'Share Success Story',
      mode === 'faith' 
        ? 'Share this testimony to encourage others in their faith journey'
        : 'Share this inspiring story with others',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Share', onPress: () => {
          setTestimonies(prev => prev.map(t => 
            t.id === testimony.id ? { ...t, shares: t.shares + 1 } : t
          ));
        }}
      ]
    );
  };

  const renderTestimonyCard = ({ item }: { item: Testimony }) => (
    <View style={styles.testimonyCard}>
      <View style={styles.testimonyHeader}>
        <View style={styles.userInfo}>
          <View style={[styles.avatar, { backgroundColor: modeConfig.branding.primaryColor }]}>
            <Text style={styles.avatarText}>{item.userName.charAt(0)}</Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{item.userName}</Text>
            <Text style={styles.timestamp}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
        <View style={[styles.categoryBadge, { backgroundColor: item.category.color }]}>
          <Text style={styles.categoryText}>
            {getModeLabelForCategory(item.category, mode)}
          </Text>
        </View>
      </View>

      <Text style={styles.testimonyTitle}>{item.title}</Text>
      <Text style={styles.testimonyContent}>{item.content}</Text>

      <View style={styles.tagsContainer}>
        {item.tags.slice(0, 3).map((tag: string, index: number) => (
          <View key={index} style={[styles.tag, { borderColor: modeConfig.branding.primaryColor }]}>
            <Text style={[styles.tagText, { color: modeConfig.branding.primaryColor }]}>
              #{tag}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.testimonyFooter}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleLike(item.id)}
        >
          <Ionicons name="heart" size={20} color={modeConfig.branding.primaryColor} />
          <Text style={[styles.actionText, { color: modeConfig.branding.primaryColor }]}>
            {item.likes}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handlePray(item.id)}
        >
          <Ionicons 
            name={mode === 'faith' ? 'hand-right' : 'heart-circle'} 
            size={20} 
            color={modeConfig.branding.secondaryColor} 
          />
          <Text style={[styles.actionText, { color: modeConfig.branding.secondaryColor }]}>
            {mode === 'faith' ? `${item.prayerCount} prayers` : `${item.prayerCount} support`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble" size={20} color={KingdomColors.gray} />
          <Text style={[styles.actionText, { color: KingdomColors.gray }]}>
            {item.comments.length}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleShare(item)}
        >
          <Ionicons name="share" size={20} color={KingdomColors.gray} />
          <Text style={[styles.actionText, { color: KingdomColors.gray }]}>
            {item.shares}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCategoryTab = (category: TestimonyCategory | { id: string; name: string }) => (
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
        {category.id === 'all' ? 'All' : getModeLabelForCategory(category as TestimonyCategory, mode)}
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
            <Text style={styles.headerTitle}>{modeConfig.messaging.testimoniesTitle}</Text>
            <Text style={styles.headerSubtitle}>
              {mode === 'faith' 
                ? 'Share how God is moving in your life'
                : 'Celebrate your wins and inspire others'
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
            placeholder={mode === 'faith' ? 'Search testimonies...' : 'Search success stories...'}
            placeholderTextColor={KingdomColors.gray}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </LinearGradient>

      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {renderCategoryTab({ id: 'all', name: 'All' })}
          {availableCategories.map(renderCategoryTab)}
        </ScrollView>
      </View>

      <FlatList
        data={filteredTestimonies}
        renderItem={renderTestimonyCard}
        keyExtractor={(item) => item.id}
        style={styles.testimoniesList}
        contentContainerStyle={styles.testimoniesContent}
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
              name={mode === 'faith' ? 'book' : 'star'} 
              size={60} 
              color={KingdomColors.gray} 
            />
            <Text style={styles.emptyTitle}>
              {mode === 'faith' ? 'No Testimonies Yet' : 'No Success Stories Yet'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {mode === 'faith' 
                ? 'Be the first to share how God is moving in your life!'
                : 'Be the first to share your success story and inspire others!'
              }
            </Text>
          </View>
        )}
      />

      <TouchableOpacity
        style={[styles.createButton, { backgroundColor: modeConfig.branding.primaryColor }]}
        onPress={() => setShowCreateModal(true)}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {mode === 'faith' ? 'Share Your Testimony' : 'Share Your Success Story'}
            </Text>
            <Text style={styles.modalSubtitle}>
              {mode === 'faith' 
                ? 'Tell others how God has moved in your life'
                : 'Inspire others with your achievements and breakthroughs'
              }
            </Text>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: modeConfig.branding.primaryColor }]}
              onPress={() => setShowCreateModal(false)}
            >
              <Text style={styles.modalButtonText}>Coming Soon</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowCreateModal(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    color: KingdomColors.text.primary,
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
  testimoniesList: {
    flex: 1,
  },
  testimoniesContent: {
    padding: 20,
  },
  testimonyCard: {
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
  testimonyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: KingdomColors.gray,
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
  testimonyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 10,
  },
  testimonyContent: {
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
  testimonyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: KingdomColors.lightGray,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '600',
  },
  createButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    margin: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: KingdomColors.gray,
    textAlign: 'center',
    marginBottom: 30,
  },
  modalButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    paddingVertical: 10,
  },
  modalCloseText: {
    color: KingdomColors.gray,
    fontSize: 16,
  },
});

export default React.memo(TestimonyWallScreen);

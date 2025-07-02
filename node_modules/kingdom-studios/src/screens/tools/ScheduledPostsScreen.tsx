import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
} from 'react-native';
import { useAppNavigation } from '../../utils/navigationUtils';

// Mock data for scheduled posts
interface ScheduledPost {
  id: string;
  platform: 'Instagram' | 'TikTok' | 'YouTube' | 'Facebook' | 'X' | 'Pinterest' | 'Threads' | 'Lemon8' | 'Truth Social';
  caption: string;
  scheduledDate: string;
  scheduledTime: string;
  mediaType: 'Image' | 'Video' | 'Carousel';
  status: 'Pending' | 'Processing' | 'Ready';
}

const mockScheduledPosts: ScheduledPost[] = [
  {
    id: '1',
    platform: 'Instagram',
    caption: 'Faith can move mountains! 🏔️ Today I want to share how prayer has transformed my perspective on challenges. When we trust in God\'s timing...',
    scheduledDate: '2025-07-02',
    scheduledTime: '09:00',
    mediaType: 'Image',
    status: 'Ready',
  },
  {
    id: '2',
    platform: 'TikTok',
    caption: 'Morning routine that changed my life ✨ Starting each day with gratitude, prayer, and intentional planning. Here\'s what works...',
    scheduledDate: '2025-07-02',
    scheduledTime: '14:30',
    mediaType: 'Video',
    status: 'Processing',
  },
  {
    id: '3',
    platform: 'YouTube',
    caption: 'How to Build a Content Strategy That Honors God | Complete Guide for Christian Creators',
    scheduledDate: '2025-07-03',
    scheduledTime: '18:00',
    mediaType: 'Video',
    status: 'Ready',
  },
  {
    id: '4',
    platform: 'X',
    caption: 'Quick reminder: You are fearfully and wonderfully made! 🌟 Never forget that your dreams matter and God has a plan for your success. #motivation #faith #entrepreneur',
    scheduledDate: '2025-07-03',
    scheduledTime: '12:00',
    mediaType: 'Image',
    status: 'Ready',
  },
  {
    id: '5',
    platform: 'Pinterest',
    caption: 'Daily Affirmations for Christian Entrepreneurs - Printable Scripture Cards for Your Office',
    scheduledDate: '2025-07-04',
    scheduledTime: '16:00',
    mediaType: 'Image',
    status: 'Pending',
  },
  {
    id: '6',
    platform: 'Lemon8',
    caption: 'Aesthetic home office setup that keeps me inspired and productive 💼 Faith-based productivity tips included!',
    scheduledDate: '2025-07-05',
    scheduledTime: '10:30',
    mediaType: 'Carousel',
    status: 'Ready',
  },
  {
    id: '7',
    platform: 'Threads',
    caption: 'The intersection of faith and business is where magic happens. Building something meaningful requires both vision and values. Here\'s how I stay grounded...',
    scheduledDate: '2025-07-06',
    scheduledTime: '15:45',
    mediaType: 'Image',
    status: 'Ready',
  },
  {
    id: '8',
    platform: 'Truth Social',
    caption: 'Standing firm in our values while building successful businesses. Freedom, faith, and entrepreneurship go hand in hand! 🇺🇸 #TruthSocial #Faith #Business',
    scheduledDate: '2025-07-07',
    scheduledTime: '11:00',
    mediaType: 'Image',
    status: 'Ready',
  },
];

// Mock faith mode hook
const useFaithMode = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  return { isEnabled, setIsEnabled };
};

type PlatformFilter = 'All' | 'Instagram' | 'TikTok' | 'YouTube' | 'Facebook' | 'X' | 'Pinterest' | 'Threads' | 'Lemon8' | 'Truth Social';
type SortOption = 'Date' | 'Platform';

const ScheduledPostsScreen = () => {
  const navigation = useAppNavigation();
  const { isEnabled: faithMode } = useFaithMode();
  
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformFilter>('All');
  const [sortBy, setSortBy] = useState<SortOption>('Date');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Get platform icon
  const getPlatformIcon = (platform: string) => {
    const icons: { [key: string]: string } = {
      'Instagram': '📸',
      'TikTok': '🎵',
      'YouTube': '📺',
      'Facebook': '👥',
      'X': '🐦',
      'Pinterest': '📌',
      'Threads': '🧵',
      'Lemon8': '🍋',
      'Truth Social': '🇺🇸',
    };
    return icons[platform] || '📱';
  };

  // Get platform accent color
  const getPlatformAccentColor = (platform: string) => {
    const colors: { [key: string]: string } = {
      'Instagram': '#E4405F',
      'TikTok': '#000000',
      'YouTube': '#FF0000',
      'Facebook': '#1877F2',
      'X': '#1DA1F2',
      'Pinterest': '#BD081C',
      'Threads': '#000000',
      'Lemon8': '#FFD700',
      'Truth Social': '#FF0000',
    };
    return colors[platform] || '#f97316';
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready':
        return '#22c55e'; // Green
      case 'Processing':
        return '#f59e0b'; // Orange
      case 'Pending':
        return '#6b7280'; // Gray
      default:
        return '#6b7280';
    }
  };

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = mockScheduledPosts;

    // Apply platform filter
    if (selectedPlatform !== 'All') {
      filtered = filtered.filter(post => post.platform === selectedPlatform);
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'Date':
          const dateA = new Date(`${a.scheduledDate} ${a.scheduledTime}`);
          const dateB = new Date(`${b.scheduledDate} ${b.scheduledTime}`);
          return dateA.getTime() - dateB.getTime();
        case 'Platform':
          return a.platform.localeCompare(b.platform);
        default:
          return 0;
      }
    });

    return sorted;
  }, [selectedPlatform, sortBy]);

  const handleEditPost = (post: ScheduledPost) => {
    Alert.alert(
      'Edit Scheduled Post',
      `Edit post for ${post.platform}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Edit', 
          onPress: () => {
            console.log('Navigate to MultiPlatformPost with data:', post);
            navigation.navigate('MultiPlatformPost', {});
          }
        },
      ]
    );
  };

  const handleReschedulePost = (post: ScheduledPost) => {
    Alert.alert(
      'Reschedule Post',
      `Reschedule ${post.platform} post to a different time?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reschedule', 
          onPress: () => console.log('Reschedule post:', post.id)
        },
      ]
    );
  };

  const handleDeletePost = (post: ScheduledPost) => {
    Alert.alert(
      'Delete Scheduled Post',
      `Are you sure you want to delete this ${post.platform} post?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => console.log('Delete post:', post.id)
        },
      ]
    );
  };

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(`${date} ${time}`);
    const now = new Date();
    const diffTime = dateObj.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Today at ${time}`;
    } else if (diffDays === 1) {
      return `Tomorrow at ${time}`;
    } else if (diffDays > 1 && diffDays <= 7) {
      return `In ${diffDays} days at ${time}`;
    } else {
      return `${date} at ${time}`;
    }
  };

  const renderPostCard = ({ item }: { item: ScheduledPost }) => (
    <View style={[
      styles.postCard,
      { borderLeftColor: getPlatformAccentColor(item.platform) }
    ]}>
      <View style={styles.cardHeader}>
        <View style={styles.platformInfo}>
          <View style={[
            styles.platformIconContainer,
            { backgroundColor: `${getPlatformAccentColor(item.platform)}20` }
          ]}>
            <Text style={styles.platformIcon}>{getPlatformIcon(item.platform)}</Text>
          </View>
          <View style={styles.platformDetails}>
            <Text style={[
              styles.platformName,
              { color: getPlatformAccentColor(item.platform) }
            ]}>
              {item.platform}
            </Text>
            <Text style={styles.mediaType}>{item.mediaType}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <Text style={styles.caption} numberOfLines={3}>
        {item.caption}
      </Text>
      
      <View style={styles.scheduleInfo}>
        <Text style={styles.scheduleLabel}>Scheduled for:</Text>
        <Text style={styles.scheduleTime}>
          {formatDateTime(item.scheduledDate, item.scheduledTime)}
        </Text>
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditPost(item)}
          activeOpacity={0.8}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.rescheduleButton]}
          onPress={() => handleReschedulePost(item)}
          activeOpacity={0.8}
        >
          <Text style={styles.rescheduleButtonText}>Reschedule</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeletePost(item)}
          activeOpacity={0.8}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Scheduled Posts</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Faith Mode Banner */}
        {faithMode && (
          <View style={styles.faithBanner}>
            <Text style={styles.faithText}>
              🙏 Trust in God's timing - your content will reach the right people at the right moment!
            </Text>
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            {filteredAndSortedPosts.length} posts scheduled
          </Text>
        </View>

        {/* Platform Filter Chips */}
        <View style={styles.platformFilterContainer}>
          <Text style={styles.filterLabel}>Filter by Platform:</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.platformChipsScroll}
            contentContainerStyle={styles.platformChipsContainer}
          >
            {(['All', 'Instagram', 'TikTok', 'YouTube', 'Facebook', 'X', 'Pinterest', 'Threads', 'Lemon8', 'Truth Social'] as PlatformFilter[]).map((platform) => (
              <TouchableOpacity
                key={platform}
                style={[
                  styles.platformChip,
                  selectedPlatform === platform && styles.activePlatformChip,
                  selectedPlatform === platform && platform !== 'All' && {
                    borderColor: getPlatformAccentColor(platform),
                    backgroundColor: `${getPlatformAccentColor(platform)}20`,
                  }
                ]}
                onPress={() => setSelectedPlatform(platform)}
                activeOpacity={0.8}
              >
                {platform !== 'All' && (
                  <Text style={styles.platformChipIcon}>{getPlatformIcon(platform)}</Text>
                )}
                <Text style={[
                  styles.platformChipText,
                  selectedPlatform === platform && styles.activePlatformChipText,
                  selectedPlatform === platform && platform !== 'All' && {
                    color: getPlatformAccentColor(platform),
                  }
                ]}>
                  {platform}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Sort Dropdown */}
        <View style={styles.sortContainer}>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => setShowSortDropdown(!showSortDropdown)}
            activeOpacity={0.8}
          >
            <Text style={styles.sortButtonText}>Sort by: {sortBy}</Text>
            <Text style={styles.dropdownArrow}>{showSortDropdown ? '▲' : '▼'}</Text>
          </TouchableOpacity>
          
          {showSortDropdown && (
            <View style={styles.sortDropdown}>
              {(['Date', 'Platform'] as SortOption[]).map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.sortOption}
                  onPress={() => {
                    setSortBy(option);
                    setShowSortDropdown(false);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.sortOptionText,
                    sortBy === option && styles.activeSortOptionText
                  ]}>
                    Sort by {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Scheduled Posts List */}
        <View style={styles.postsContainer}>
          {filteredAndSortedPosts.length > 0 ? (
            filteredAndSortedPosts.map((item) => (
              <View key={item.id}>
                {renderPostCard({ item })}
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>⏰</Text>
              <Text style={styles.emptyStateTitle}>No scheduled posts</Text>
              <Text style={styles.emptyStateSubtitle}>
                {selectedPlatform !== 'All' 
                  ? `No scheduled posts for ${selectedPlatform}`
                  : 'You haven\'t scheduled any posts yet'
                }
              </Text>
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => navigation.navigate('MultiPlatformPost', {})}
                activeOpacity={0.8}
              >
                <Text style={styles.createButtonText}>Schedule New Post</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#f97316',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  placeholder: {
    width: 40,
  },
  faithBanner: {
    margin: 16,
    padding: 16,
    backgroundColor: '#1f2937',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f97316',
  },
  faithText: {
    fontSize: 14,
    color: '#f97316',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  statsText: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '500',
  },
  platformFilterContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 12,
  },
  platformChipsScroll: {
    flexGrow: 0,
  },
  platformChipsContainer: {
    paddingRight: 20,
    gap: 8,
  },
  platformChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#1f2937',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#374151',
    gap: 6,
  },
  activePlatformChip: {
    borderColor: '#f97316',
    backgroundColor: '#f9731620',
  },
  platformChipIcon: {
    fontSize: 14,
  },
  platformChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9ca3af',
  },
  activePlatformChipText: {
    color: '#f97316',
  },
  sortContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
    position: 'relative',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1f2937',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#9ca3af',
  },
  sortDropdown: {
    position: 'absolute',
    top: 48,
    left: 20,
    right: 20,
    backgroundColor: '#1f2937',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
    zIndex: 1000,
  },
  sortOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  sortOptionText: {
    fontSize: 14,
    color: '#ffffff',
  },
  activeSortOptionText: {
    color: '#f97316',
    fontWeight: '500',
  },
  postsContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
    paddingBottom: 32,
  },
  postCard: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#374151',
    borderLeftWidth: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  platformInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  platformIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  platformIcon: {
    fontSize: 20,
  },
  platformDetails: {
    flex: 1,
  },
  platformName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  mediaType: {
    fontSize: 12,
    color: '#9ca3af',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  caption: {
    fontSize: 14,
    color: '#d1d5db',
    lineHeight: 20,
    marginBottom: 12,
  },
  scheduleInfo: {
    marginBottom: 16,
  },
  scheduleLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  scheduleTime: {
    fontSize: 14,
    color: '#f97316',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#374151',
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  rescheduleButton: {
    backgroundColor: '#f59e0b20',
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  rescheduleButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#f59e0b',
  },
  deleteButton: {
    backgroundColor: '#dc262620',
    borderWidth: 1,
    borderColor: '#dc2626',
  },
  deleteButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#dc2626',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#f97316',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default ScheduledPostsScreen;

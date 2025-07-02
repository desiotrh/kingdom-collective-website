import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import { useAppNavigation } from '../../utils/navigationUtils';
import { useFaithMode } from '../../contexts/FaithModeContext';

// Mock data for content library
interface ContentItem {
  id: string;
  platform: 'Instagram' | 'TikTok' | 'YouTube' | 'Facebook' | 'X' | 'Pinterest' | 'Threads' | 'Lemon8' | 'Truth Social';
  caption: string;
  dateCreated: string;
  dateScheduled?: string;
  status: 'Published' | 'Scheduled' | 'Draft';
  mediaType: 'Image' | 'Video' | 'Carousel';
}

const mockContentData: ContentItem[] = [
  {
    id: '1',
    platform: 'Instagram',
    caption: 'Faith can move mountains! 🏔️ Today I want to share how prayer has transformed my perspective on challenges...',
    dateCreated: '2025-06-30',
    dateScheduled: '2025-07-02',
    status: 'Scheduled',
    mediaType: 'Image',
  },
  {
    id: '2',
    platform: 'TikTok',
    caption: 'Behind the scenes of my morning routine ✨ Starting each day with gratitude and purpose...',
    dateCreated: '2025-06-29',
    status: 'Published',
    mediaType: 'Video',
  },
  {
    id: '3',
    platform: 'YouTube',
    caption: 'Complete tutorial: How to build a successful content strategy that aligns with your values...',
    dateCreated: '2025-06-28',
    status: 'Draft',
    mediaType: 'Video',
  },
  {
    id: '4',
    platform: 'Facebook',
    caption: 'Community highlight! So grateful for everyone who shared their testimonies this week 💫',
    dateCreated: '2025-06-27',
    status: 'Published',
    mediaType: 'Carousel',
  },
  {
    id: '5',
    platform: 'X',
    caption: 'Quick reminder: You are fearfully and wonderfully made! 🌟 #motivation #faith',
    dateCreated: '2025-06-26',
    dateScheduled: '2025-07-03',
    status: 'Scheduled',
    mediaType: 'Image',
  },
  {
    id: '6',
    platform: 'Pinterest',
    caption: 'Daily affirmations for entrepreneurs who want to build with purpose...',
    dateCreated: '2025-06-25',
    status: 'Draft',
    mediaType: 'Image',
  },
  {
    id: '7',
    platform: 'Threads',
    caption: 'The power of consistency in content creation cannot be overstated. Small daily actions...',
    dateCreated: '2025-06-24',
    status: 'Published',
    mediaType: 'Image',
  },
  {
    id: '8',
    platform: 'Lemon8',
    caption: 'Aesthetic workspace setup that keeps me motivated and focused on my goals 💼',
    dateCreated: '2025-06-23',
    dateScheduled: '2025-07-05',
    status: 'Scheduled',
    mediaType: 'Carousel',
  },
  {
    id: '9',
    platform: 'Truth Social',
    caption: 'Standing firm in our values while building successful businesses. Freedom and faith go hand in hand! 🇺🇸',
    dateCreated: '2025-06-22',
    status: 'Published',
    mediaType: 'Image',
  },
];

type FilterTab = 'All' | 'Scheduled' | 'Drafts' | 'Published';
type SortOption = 'Newest' | 'Platform' | 'Status';
type PlatformFilter = 'All' | 'Instagram' | 'TikTok' | 'YouTube' | 'Facebook' | 'X' | 'Pinterest' | 'Threads' | 'Lemon8' | 'Truth Social';

const ContentLibraryScreen = () => {
  const navigation = useAppNavigation();
  const { faithMode } = useFaithMode();
  
  const [activeTab, setActiveTab] = useState<FilterTab>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('Newest');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformFilter>('All');

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
      case 'Published':
        return '#22c55e'; // Green
      case 'Scheduled':
        return '#f59e0b'; // Orange
      case 'Draft':
        return '#6b7280'; // Gray
      default:
        return '#6b7280';
    }
  };

  // Filter and sort content
  const filteredAndSortedContent = useMemo(() => {
    let filtered = mockContentData;

    // Apply tab filter
    if (activeTab !== 'All') {
      if (activeTab === 'Drafts') {
        filtered = filtered.filter(item => item.status === 'Draft');
      } else if (activeTab === 'Scheduled') {
        filtered = filtered.filter(item => item.status === 'Scheduled');
      } else if (activeTab === 'Published') {
        filtered = filtered.filter(item => item.status === 'Published');
      }
    }

    // Apply platform filter
    if (selectedPlatform !== 'All') {
      filtered = filtered.filter(item => item.platform === selectedPlatform);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.platform.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'Newest':
          return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
        case 'Platform':
          return a.platform.localeCompare(b.platform);
        case 'Status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    return sorted;
  }, [activeTab, selectedPlatform, searchQuery, sortBy]);

  const handleContentPress = (item: ContentItem) => {
    Alert.alert(
      'Content Details',
      `Platform: ${item.platform}\nStatus: ${item.status}\nCreated: ${item.dateCreated}${item.dateScheduled ? `\nScheduled: ${item.dateScheduled}` : ''}`,
      [
        { text: 'Edit', onPress: () => console.log('Edit content:', item.id) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const renderContentCard = ({ item }: { item: ContentItem }) => (
    <TouchableOpacity
      style={[
        styles.contentCard,
        { borderLeftColor: getPlatformAccentColor(item.platform), borderLeftWidth: 3 }
      ]}
      onPress={() => handleContentPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <View style={styles.platformInfo}>
          <View style={[
            styles.platformIconContainer,
            { backgroundColor: `${getPlatformAccentColor(item.platform)}20` }
          ]}>
            <Text style={styles.platformIcon}>{getPlatformIcon(item.platform)}</Text>
          </View>
          <View>
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
      
      <View style={styles.cardFooter}>
        <Text style={styles.date}>Created: {item.dateCreated}</Text>
        {item.dateScheduled && (
          <Text style={styles.scheduledDate}>Scheduled: {item.dateScheduled}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderTabButton = (tab: FilterTab) => (
    <TouchableOpacity
      key={tab}
      style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
      onPress={() => setActiveTab(tab)}
      activeOpacity={0.8}
    >
      <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
        {tab}
      </Text>
    </TouchableOpacity>
  );

  const tabs: FilterTab[] = ['All', 'Scheduled', 'Drafts', 'Published'];

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
          <Text style={styles.title}>Content Library</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Faith Mode Message */}
        <View style={styles.faithMessage}>
          <Text style={styles.faithText}>
            {faithMode 
              ? "Remember, your testimony has power 🔥"
              : "Great content starts with consistency 💡"
            }
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by caption or platform..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Tabs */}
        <View style={styles.tabsContainer}>
          {tabs.map(renderTabButton)}
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
              {(['Newest', 'Platform', 'Status'] as SortOption[]).map((option) => (
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
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Content Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            {filteredAndSortedContent.length} items found
          </Text>
          {/* Quick link to Scheduled Posts when viewing scheduled content */}
          {activeTab === 'Scheduled' && (
            <TouchableOpacity
              style={styles.quickLinkButton}
              onPress={() => navigation.navigate('ScheduledPosts')}
              activeOpacity={0.8}
            >
              <Text style={styles.quickLinkText}>⏰ View Detailed Scheduled Posts</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Content List */}
        <View style={styles.contentContainer}>
          {filteredAndSortedContent.length > 0 ? (
            filteredAndSortedContent.map((item) => (
              <View key={item.id}>
                {renderContentCard({ item })}
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>📚</Text>
              <Text style={styles.emptyStateTitle}>No content found</Text>
              <Text style={styles.emptyStateSubtitle}>
                {searchQuery 
                  ? `No results for "${searchQuery}"`
                  : `No ${activeTab.toLowerCase()} content yet`
                }
              </Text>
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => navigation.navigate('MultiPlatformPost', {})}
                activeOpacity={0.8}
              >
                <Text style={styles.createButtonText}>Create New Post</Text>
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
  faithMessage: {
    padding: 16,
    marginHorizontal: 20,
    marginTop: 16,
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
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  searchInput: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#374151',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 16,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#1f2937',
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: '#f97316',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9ca3af',
  },
  activeTabText: {
    color: '#ffffff',
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
  statsContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  statsText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  quickLinkButton: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f9731620',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f97316',
    alignSelf: 'flex-start',
  },
  quickLinkText: {
    fontSize: 12,
    color: '#f97316',
    fontWeight: '500',
  },
  contentContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
    paddingBottom: 32,
  },
  contentCard: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
    borderLeftWidth: 3,
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
    fontSize: 24,
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
  cardFooter: {
    gap: 4,
  },
  date: {
    fontSize: 12,
    color: '#9ca3af',
  },
  scheduledDate: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '500',
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
});

export default ContentLibraryScreen;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput,
  Modal,
  Alert,
  FlatList,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { KingdomColors } from '../constants/KingdomColors';
import { useFaithMode } from '../contexts/FaithModeContext';
import { useAnalytics } from '../hooks/useAnalytics';
import {
  PodcastEpisode,
  VideoShort,
  PodcastShow,
  LiveStream,
  ContentCalendar,
  ContentTemplate,
  AIContentSuggestion,
} from '../types/podcast';

const { width } = Dimensions.get('window');

const PodcastShortsHubScreen: React.FC = () => {
  const { faithMode } = useFaithMode();
  const { trackScreenView, trackFeatureUsed } = useAnalytics();
  const [selectedTab, setSelectedTab] = useState<string>('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedContentType, setSelectedContentType] = useState<'podcast' | 'short' | 'live' | null>(null);

  useEffect(() => {
    trackScreenView('PodcastShortsHub');
  }, [trackScreenView]);

  // Mock data - would come from API/services
  const [podcastShow] = useState<PodcastShow>({
    id: '1',
    name: 'Kingdom Conversations',
    faithModeName: 'Divine Dialogues',
    encouragementModeName: 'Hope & Harmony',
    description: 'Inspiring conversations that strengthen faith and encourage hearts',
    coverArt: 'https://example.com/cover.jpg',
    category: 'Religion & Spirituality',
    language: 'English',
    author: 'Kingdom Studios',
    email: 'podcast@kingdomstudios.com',
    episodes: [],
    subscribers: 1250,
    totalDownloads: 15670,
    rating: 4.8,
    mood: 'faith' as any, // Both moods supported
    distribution: {
      apple: true,
      spotify: true,
      google: true,
      amazon: false,
      custom: [],
    },
  });

  const [recentEpisodes] = useState<PodcastEpisode[]>([
    {
      id: '1',
      title: 'Walking in Faith During Difficult Times',
      faithModeTitle: 'Trusting God in the Storm',
      encouragementModeTitle: 'Finding Strength in Struggle',
      description: 'Exploring how to maintain faith when life gets challenging',
      duration: 2850, // 47:30
      publishedDate: '2024-01-15T10:00:00Z',
      status: 'published',
      category: 'Faith',
      tags: ['faith', 'struggles', 'trust', 'hope'],
      episodeNumber: 15,
      downloads: 892,
      rating: 4.9,
      reviews: [],
      mood: 'faith',
    },
    {
      id: '2',
      title: 'Building Community in a Digital World',
      faithModeTitle: 'Fellowship in the Modern Age',
      encouragementModeTitle: 'Connection & Community',
      description: 'How to create meaningful connections and support networks online',
      duration: 2156, // 35:56
      publishedDate: '2024-01-08T10:00:00Z',
      status: 'published',
      category: 'Community',
      tags: ['community', 'digital', 'relationships', 'support'],
      episodeNumber: 14,
      downloads: 756,
      rating: 4.7,
      reviews: [],
      mood: 'encouragement',
    },
  ]);

  const [recentShorts] = useState<VideoShort[]>([
    {
      id: '1',
      title: 'Daily Affirmation: You Are Loved',
      faithModeTitle: 'God\'s Love Declaration',
      encouragementModeTitle: 'You Are Cherished',
      description: 'A powerful reminder of your worth and value',
      duration: 45,
      createdDate: '2024-01-16T08:00:00Z',
      publishedDate: '2024-01-16T12:00:00Z',
      status: 'published',
      platforms: [
        {
          platform: 'tiktok',
          published: true,
          publishedDate: '2024-01-16T12:00:00Z',
          analytics: { views: 12450, likes: 890, shares: 156, comments: 78 },
        },
        {
          platform: 'instagram-reels',
          published: true,
          publishedDate: '2024-01-16T12:05:00Z',
          analytics: { views: 8760, likes: 654, shares: 123, comments: 45 },
        },
      ],
      hashtags: ['#DailyAffirmation', '#SelfLove', '#Encouragement', '#Motivation'],
      sourceType: 'original',
      mood: 'encouragement',
      analytics: {
        views: 21210,
        likes: 1544,
        shares: 279,
        comments: 123,
        engagement: 9.2,
      },
    },
  ]);

  const [upcomingContent] = useState<ContentCalendar[]>([
    {
      id: '1',
      date: '2024-01-20T10:00:00Z',
      contentType: 'podcast',
      contentId: 'episode-16',
      title: 'The Power of Gratitude',
      platforms: ['apple', 'spotify', 'google'],
      status: 'scheduled',
      mood: 'faith',
    },
    {
      id: '2',
      date: '2024-01-18T15:00:00Z',
      contentType: 'short',
      contentId: 'short-15',
      title: 'Quick Prayer for Peace',
      platforms: ['tiktok', 'instagram', 'youtube'],
      status: 'planned',
      mood: 'faith',
    },
  ]);

  const [aiSuggestions] = useState<AIContentSuggestion[]>([
    {
      id: '1',
      type: 'podcast-topic',
      title: 'Mental Health & Faith Integration',
      description: 'Explore how faith practices can support mental wellness',
      reasoning: 'Based on trending topics and audience engagement patterns',
      confidence: 0.89,
      category: 'Health & Wellness',
      mood: 'faith' as any, // Both moods
      implemented: false,
    },
    {
      id: '2',
      type: 'short-idea',
      title: '30-Second Scripture Meditation',
      description: 'Quick visual meditation with popular verses',
      reasoning: 'Short-form spiritual content performs well in your niche',
      confidence: 0.92,
      category: 'Spiritual Practice',
      mood: 'faith',
      implemented: false,
    },
  ]);

  const getDisplayTitle = (item: any) => {
    const modeTitle = faithMode 
      ? (item.faithModeTitle || item.faithModeName)
      : (item.encouragementModeTitle || item.encouragementModeName);
    return modeTitle || item.title || item.name;
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const handleCreateContent = (type: 'podcast' | 'short' | 'live') => {
    setSelectedContentType(type);
    setShowCreateModal(true);
    trackFeatureUsed(`create_${type}`);
  };

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    trackFeatureUsed(`podcast_tab_${tab}`);
  };

  const renderQuickStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statCard}>
        <MaterialIcons name="podcasts" size={24} color={KingdomColors.primary.royalPurple} />
        <Text style={styles.statValue}>{recentEpisodes.length}</Text>
        <Text style={styles.statLabel}>Episodes</Text>
      </View>
      <View style={styles.statCard}>
        <MaterialCommunityIcons name="video-outline" size={24} color={KingdomColors.gold.warm} />
        <Text style={styles.statValue}>{recentShorts.length}</Text>
        <Text style={styles.statLabel}>Shorts</Text>
      </View>
      <View style={styles.statCard}>
        <MaterialIcons name="people" size={24} color={KingdomColors.accent.info} />
        <Text style={styles.statValue}>{formatNumber(podcastShow.subscribers)}</Text>
        <Text style={styles.statLabel}>Subscribers</Text>
      </View>
      <View style={styles.statCard}>
        <MaterialIcons name="download" size={24} color={KingdomColors.accent.success} />
        <Text style={styles.statValue}>{formatNumber(podcastShow.totalDownloads)}</Text>
        <Text style={styles.statLabel}>Downloads</Text>
      </View>
    </View>
  );

  const renderRecentEpisodes = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Episodes</Text>
        <TouchableOpacity onPress={() => handleCreateContent('podcast')}>
          <MaterialIcons name="add" size={24} color={KingdomColors.primary.royalPurple} />
        </TouchableOpacity>
      </View>
      {recentEpisodes.map((episode) => (
        <View key={episode.id} style={styles.episodeCard}>
          <View style={styles.episodeHeader}>
            <View style={styles.episodeInfo}>
              <Text style={styles.episodeTitle}>{getDisplayTitle(episode)}</Text>
              <Text style={styles.episodeDescription}>{episode.description}</Text>
              <View style={styles.episodeMeta}>
                <Text style={styles.metaText}>Ep. {episode.episodeNumber}</Text>
                <Text style={styles.metaText}>•</Text>
                <Text style={styles.metaText}>{formatDuration(episode.duration)}</Text>
                <Text style={styles.metaText}>•</Text>
                <Text style={styles.metaText}>{formatNumber(episode.downloads)} downloads</Text>
              </View>
            </View>
            <View style={[styles.moodIndicator, { backgroundColor: episode.mood === 'faith' ? KingdomColors.primary.royalPurple : KingdomColors.gold.warm }]} />
          </View>
          <View style={styles.episodeActions}>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="play-arrow" size={20} color={KingdomColors.text.primary} />
              <Text style={styles.actionText}>Play</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="edit" size={20} color={KingdomColors.text.primary} />
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="share" size={20} color={KingdomColors.text.primary} />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  const renderRecentShorts = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Shorts</Text>
        <TouchableOpacity onPress={() => handleCreateContent('short')}>
          <MaterialIcons name="add" size={24} color={KingdomColors.primary.royalPurple} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={recentShorts}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item: short }) => (
          <View style={styles.shortCard}>
            <View style={styles.shortThumbnail}>
              <MaterialCommunityIcons name="video" size={32} color={KingdomColors.white} />
            </View>
            <Text style={styles.shortTitle}>{getDisplayTitle(short)}</Text>
            <Text style={styles.shortDuration}>{formatDuration(short.duration)}</Text>
            <View style={styles.shortStats}>
              <View style={styles.shortStat}>
                <MaterialIcons name="visibility" size={14} color={KingdomColors.text.muted} />
                <Text style={styles.shortStatText}>{formatNumber(short.analytics.views)}</Text>
              </View>
              <View style={styles.shortStat}>
                <MaterialIcons name="favorite" size={14} color={KingdomColors.text.muted} />
                <Text style={styles.shortStatText}>{formatNumber(short.analytics.likes)}</Text>
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.shortsContainer}
      />
    </View>
  );

  const renderUpcomingContent = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Upcoming Content</Text>
      {upcomingContent.map((content) => (
        <View key={content.id} style={styles.upcomingCard}>
          <View style={styles.upcomingDate}>
            <Text style={styles.dateDay}>{new Date(content.date).getDate()}</Text>
            <Text style={styles.dateMonth}>{new Date(content.date).toLocaleDateString('en', { month: 'short' })}</Text>
          </View>
          <View style={styles.upcomingInfo}>
            <Text style={styles.upcomingTitle}>{content.title}</Text>
            <Text style={styles.upcomingType}>{content.contentType.toUpperCase()}</Text>
            <View style={styles.upcomingPlatforms}>
              {content.platforms.slice(0, 3).map((platform, index) => (
                <Text key={index} style={styles.platformTag}>{platform}</Text>
              ))}
              {content.platforms.length > 3 && (
                <Text style={styles.platformTag}>+{content.platforms.length - 3}</Text>
              )}
            </View>
          </View>
          <View style={[styles.statusIndicator, { backgroundColor: 
            content.status === 'scheduled' ? KingdomColors.accent.success :
            content.status === 'planned' ? KingdomColors.gold.warm :
            KingdomColors.text.muted
          }]} />
        </View>
      ))}
    </View>
  );

  const renderAISuggestions = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {faithMode ? 'Divine Inspiration' : 'Creative Suggestions'}
      </Text>
      {aiSuggestions.map((suggestion) => (
        <View key={suggestion.id} style={styles.suggestionCard}>
          <View style={styles.suggestionHeader}>
            <MaterialCommunityIcons name="lightbulb-outline" size={20} color={KingdomColors.gold.warm} />
            <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
            <View style={styles.confidenceScore}>
              <Text style={styles.confidenceText}>{Math.round(suggestion.confidence * 100)}%</Text>
            </View>
          </View>
          <Text style={styles.suggestionDescription}>{suggestion.description}</Text>
          <Text style={styles.suggestionReasoning}>{suggestion.reasoning}</Text>
          <View style={styles.suggestionActions}>
            <TouchableOpacity style={styles.suggestionButton}>
              <Text style={styles.suggestionButtonText}>Use Idea</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.suggestionButton, styles.suggestionButtonSecondary]}>
              <Text style={[styles.suggestionButtonText, styles.suggestionButtonTextSecondary]}>Maybe Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'overview':
        return (
          <>
            {renderQuickStats()}
            {renderRecentEpisodes()}
            {renderRecentShorts()}
            {renderUpcomingContent()}
            {renderAISuggestions()}
          </>
        );
      case 'podcasts':
        return renderRecentEpisodes();
      case 'shorts':
        return renderRecentShorts();
      case 'analytics':
        return (
          <View style={styles.placeholder}>
            <MaterialIcons name="analytics" size={48} color={KingdomColors.text.muted} />
            <Text style={styles.placeholderText}>Detailed analytics coming soon...</Text>
          </View>
        );
      case 'distribution':
        return (
          <View style={styles.placeholder}>
            <MaterialCommunityIcons name="export" size={48} color={KingdomColors.text.muted} />
            <Text style={styles.placeholderText}>Distribution management coming soon...</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {faithMode ? 'Kingdom Media Hub' : 'Content Creator Studio'}
        </Text>
        <TouchableOpacity style={styles.createButton} onPress={() => setShowCreateModal(true)}>
          <MaterialIcons name="add" size={24} color={KingdomColors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        {[
          { id: 'overview', label: 'Overview', icon: 'dashboard' },
          { id: 'podcasts', label: 'Podcasts', icon: 'podcasts' },
          { id: 'shorts', label: 'Shorts', icon: 'video-library' },
          { id: 'analytics', label: 'Analytics', icon: 'analytics' },
          { id: 'distribution', label: 'Distribute', icon: 'share' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, selectedTab === tab.id && styles.selectedTab]}
            onPress={() => handleTabChange(tab.id)}
          >
            <MaterialIcons 
              name={tab.icon as any} 
              size={18} 
              color={selectedTab === tab.id ? KingdomColors.white : KingdomColors.text.muted} 
            />
            <Text style={[styles.tabText, selectedTab === tab.id && styles.selectedTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderTabContent()}
      </ScrollView>

      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create New Content</Text>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <MaterialIcons name="close" size={24} color={KingdomColors.text.inverse} />
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.createOption} onPress={() => handleCreateContent('podcast')}>
              <MaterialIcons name="podcasts" size={32} color={KingdomColors.primary.royalPurple} />
              <View style={styles.createOptionText}>
                <Text style={styles.createOptionTitle}>New Podcast Episode</Text>
                <Text style={styles.createOptionDescription}>Record and publish a new episode</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={KingdomColors.text.muted} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.createOption} onPress={() => handleCreateContent('short')}>
              <MaterialCommunityIcons name="video-outline" size={32} color={KingdomColors.gold.warm} />
              <View style={styles.createOptionText}>
                <Text style={styles.createOptionTitle}>Video Short</Text>
                <Text style={styles.createOptionDescription}>Create short-form video content</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={KingdomColors.text.muted} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.createOption} onPress={() => handleCreateContent('live')}>
              <MaterialIcons name="live-tv" size={32} color={KingdomColors.accent.error} />
              <View style={styles.createOptionText}>
                <Text style={styles.createOptionTitle}>Live Stream</Text>
                <Text style={styles.createOptionDescription}>Start a live broadcast</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={KingdomColors.text.muted} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

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
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: KingdomColors.white,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.text.inverse,
  },
  createButton: {
    backgroundColor: KingdomColors.primary.royalPurple,
    borderRadius: 20,
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: KingdomColors.white,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  tab: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  selectedTab: {
    backgroundColor: KingdomColors.primary.royalPurple,
  },
  tabText: {
    fontSize: 10,
    color: KingdomColors.text.muted,
    marginTop: 2,
  },
  selectedTabText: {
    color: KingdomColors.white,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statCard: {
    flex: 1,
    backgroundColor: KingdomColors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: KingdomColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.text.inverse,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: KingdomColors.text.muted,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
  },
  episodeCard: {
    backgroundColor: KingdomColors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: KingdomColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  episodeHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  episodeInfo: {
    flex: 1,
  },
  episodeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.text.inverse,
    marginBottom: 4,
  },
  episodeDescription: {
    fontSize: 14,
    color: KingdomColors.text.muted,
    marginBottom: 8,
  },
  episodeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: KingdomColors.text.muted,
    marginRight: 8,
  },
  moodIndicator: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginLeft: 12,
  },
  episodeActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: KingdomColors.silver.light,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: KingdomColors.silver.platinum,
  },
  actionText: {
    fontSize: 12,
    color: KingdomColors.text.inverse,
    marginLeft: 4,
    fontWeight: '500',
  },
  shortsContainer: {
    paddingLeft: 20,
  },
  shortCard: {
    width: 120,
    marginRight: 15,
    backgroundColor: KingdomColors.white,
    borderRadius: 12,
    padding: 12,
    shadowColor: KingdomColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  shortThumbnail: {
    width: '100%',
    height: 80,
    backgroundColor: KingdomColors.background.secondary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  shortTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: KingdomColors.text.inverse,
    marginBottom: 4,
  },
  shortDuration: {
    fontSize: 10,
    color: KingdomColors.text.muted,
    marginBottom: 8,
  },
  shortStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shortStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shortStatText: {
    fontSize: 10,
    color: KingdomColors.text.muted,
    marginLeft: 2,
  },
  upcomingCard: {
    flexDirection: 'row',
    backgroundColor: KingdomColors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: KingdomColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  upcomingDate: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 40,
  },
  dateDay: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.primary.royalPurple,
  },
  dateMonth: {
    fontSize: 12,
    color: KingdomColors.text.muted,
    textTransform: 'uppercase',
  },
  upcomingInfo: {
    flex: 1,
  },
  upcomingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.text.inverse,
    marginBottom: 4,
  },
  upcomingType: {
    fontSize: 10,
    color: KingdomColors.text.muted,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  upcomingPlatforms: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  platformTag: {
    fontSize: 10,
    color: KingdomColors.primary.royalPurple,
    backgroundColor: KingdomColors.opacity.gold10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 4,
    marginBottom: 2,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 12,
  },
  suggestionCard: {
    backgroundColor: KingdomColors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: KingdomColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  suggestionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.text.inverse,
    flex: 1,
    marginLeft: 8,
  },
  confidenceScore: {
    backgroundColor: KingdomColors.gold.warm,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  confidenceText: {
    fontSize: 10,
    color: KingdomColors.white,
    fontWeight: '500',
  },
  suggestionDescription: {
    fontSize: 13,
    color: KingdomColors.text.muted,
    marginBottom: 8,
  },
  suggestionReasoning: {
    fontSize: 11,
    color: KingdomColors.text.muted,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  suggestionActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  suggestionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: KingdomColors.primary.royalPurple,
    borderRadius: 6,
    marginLeft: 8,
  },
  suggestionButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: KingdomColors.text.muted,
  },
  suggestionButtonText: {
    fontSize: 12,
    color: KingdomColors.white,
    fontWeight: '500',
  },
  suggestionButtonTextSecondary: {
    color: KingdomColors.text.muted,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  placeholderText: {
    fontSize: 16,
    color: KingdomColors.text.muted,
    marginTop: 16,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: KingdomColors.background.primary,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: KingdomColors.white,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.text.inverse,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  createOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: KingdomColors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: KingdomColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  createOptionText: {
    flex: 1,
    marginLeft: 16,
  },
  createOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.text.inverse,
    marginBottom: 4,
  },
  createOptionDescription: {
    fontSize: 14,
    color: KingdomColors.text.muted,
  },
});

export default React.memo(PodcastShortsHubScreen);

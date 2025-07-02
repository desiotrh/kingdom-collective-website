import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useAppNavigation } from '../utils/navigationUtils';
import { useFaithMode } from '../contexts/FaithModeContext';
import { KingdomColors, KingdomShadows } from '../constants/KingdomColors';
import KingdomLogo from '../components/KingdomLogo';

const { width } = Dimensions.get('window');

interface ScheduledPost {
  id: string;
  title: string;
  platform: string;
  date: string;
  time: string;
  status: 'scheduled' | 'published' | 'failed';
  engagement?: string;
  reach?: string;
}

interface SchedulingMetric {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
}

const mockScheduledPosts: ScheduledPost[] = [
  {
    id: '1',
    title: 'New Product Launch Announcement',
    platform: 'Instagram',
    date: '2025-07-05',
    time: '10:00 AM',
    status: 'scheduled',
    engagement: '0',
    reach: '0',
  },
  {
    id: '2',
    title: 'Behind the Scenes Content',
    platform: 'TikTok',
    date: '2025-07-03',
    time: '2:30 PM',
    status: 'scheduled',
    engagement: '0',
    reach: '0',
  },
  {
    id: '3',
    title: 'Tutorial Video: Getting Started',
    platform: 'YouTube',
    date: '2025-07-02',
    time: '6:00 PM',
    status: 'published',
    engagement: '2.3K',
    reach: '15.6K',
  },
  {
    id: '4',
    title: 'Community Highlight Post',
    platform: 'Twitter',
    date: '2025-07-01',
    time: '11:00 AM',
    status: 'published',
    engagement: '896',
    reach: '4.2K',
  },
  {
    id: '5',
    title: 'Weekly Newsletter',
    platform: 'LinkedIn',
    date: '2025-07-07',
    time: '9:00 AM',
    status: 'scheduled',
    engagement: '0',
    reach: '0',
  },
  {
    id: '6',
    title: 'Product Demo Video',
    platform: 'Instagram',
    date: '2025-06-30',
    time: '4:00 PM',
    status: 'failed',
    engagement: '0',
    reach: '0',
  },
];

const metrics: SchedulingMetric[] = [
  { title: 'Posts This Week', value: '12', change: '+4', isPositive: true },
  { title: 'Success Rate', value: '95%', change: '+2%', isPositive: true },
  { title: 'Avg Engagement', value: '3.2K', change: '+15%', isPositive: true },
  { title: 'Schedule Efficiency', value: '87%', change: '+5%', isPositive: true },
];

const SchedulingScreen = () => {
  const navigation = useAppNavigation();
  const { faithMode } = useFaithMode();
  const [activeTab, setActiveTab] = useState<'scheduled' | 'published' | 'all'>('all');

  const handleScheduleNewPost = () => {
    Alert.alert('Coming Soon', 'Schedule new post feature will be available soon!');
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return KingdomColors.gold.warm;
      case 'published':
        return KingdomColors.accent.success;
      case 'failed':
        return KingdomColors.accent.error;
      default:
        return KingdomColors.text.muted;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Scheduled';
      case 'published':
        return 'Published';
      case 'failed':
        return 'Failed';
      default:
        return 'Unknown';
    }
  };

  const getPlatformEmoji = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return '📷';
      case 'tiktok':
        return '🎵';
      case 'youtube':
        return '📺';
      case 'twitter':
        return '🐦';
      case 'linkedin':
        return '💼';
      default:
        return '📱';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return '#E4405F';
      case 'tiktok':
        return '#000000';
      case 'youtube':
        return '#FF0000';
      case 'twitter':
        return '#1DA1F2';
      case 'linkedin':
        return '#0077B5';
      default:
        return KingdomColors.text.muted;
    }
  };

  const filteredPosts = mockScheduledPosts.filter(post => 
    activeTab === 'all' || post.status === activeTab
  );

  const MetricCard = ({ metric }: { metric: SchedulingMetric }) => (
    <BlurView intensity={20} style={styles.metricCard}>
      <LinearGradient
        colors={['rgba(255, 215, 0, 0.1)', 'rgba(255, 215, 0, 0.05)'] as const}
        style={styles.metricGradient}
      >
        <Text style={styles.metricTitle}>{metric.title}</Text>
        <Text style={styles.metricValue}>{metric.value}</Text>
        <View style={styles.metricChange}>
          <Text style={[styles.changeText, { color: metric.isPositive ? KingdomColors.accent.success : KingdomColors.accent.error }]}>
            {metric.change}
          </Text>
          <Text style={styles.changeLabel}>this week</Text>
        </View>
      </LinearGradient>
    </BlurView>
  );

  const TabButton = ({ title, isActive, onPress }: { title: string; isActive: boolean; onPress: () => void }) => (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.tabButtonActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {isActive && (
        <LinearGradient
          colors={['#FFD700', '#FFC107'] as const}
          style={styles.tabGradient}
        />
      )}
      <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{title}</Text>
    </TouchableOpacity>
  );

  const ScheduledPostCard = ({ post }: { post: ScheduledPost }) => (
    <BlurView intensity={15} style={styles.postCard}>
      <LinearGradient
        colors={['rgba(26, 26, 58, 0.8)', 'rgba(45, 27, 105, 0.6)'] as const}
        style={styles.postGradient}
      >
        <View style={styles.postHeader}>
          <View style={styles.platformContainer}>
            <View style={[styles.platformIcon, { backgroundColor: getPlatformColor(post.platform) }]}>
              <Text style={styles.platformEmoji}>{getPlatformEmoji(post.platform)}</Text>
            </View>
            <Text style={styles.platformText}>{post.platform}</Text>
          </View>
          <View style={[styles.statusBadge, { borderColor: getStatusColor(post.status) }]}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(post.status) }]} />
            <Text style={[styles.statusText, { color: getStatusColor(post.status) }]}>
              {getStatusText(post.status)}
            </Text>
          </View>
        </View>
        
        <Text style={styles.postTitle}>{post.title}</Text>
        
        <View style={styles.postDetails}>
          <View style={styles.dateTimeContainer}>
            <Text style={styles.postDate}>📅 {post.date}</Text>
            <Text style={styles.postTime}>⏰ {post.time}</Text>
          </View>
          
          {post.status === 'published' && (
            <View style={styles.engagementContainer}>
              <View style={styles.engagementItem}>
                <Text style={styles.engagementLabel}>Engagement</Text>
                <Text style={styles.engagementValue}>{post.engagement}</Text>
              </View>
              <View style={styles.engagementItem}>
                <Text style={styles.engagementLabel}>Reach</Text>
                <Text style={styles.engagementValue}>{post.reach}</Text>
              </View>
            </View>
          )}
        </View>
      </LinearGradient>
    </BlurView>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0F0F23', '#1A1A3A', '#2D1B69'] as const}
        style={styles.background}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleGoBack}
              activeOpacity={0.8}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <KingdomLogo size="small" />
              <Text style={styles.headerTitle}>Content Scheduling</Text>
            </View>
            <View style={styles.headerSpacer} />
          </View>
          
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Welcome Section */}
            <BlurView intensity={10} style={styles.welcomeCard}>
              <LinearGradient
                colors={['rgba(255, 215, 0, 0.15)', 'rgba(255, 215, 0, 0.05)'] as const}
                style={styles.welcomeGradient}
              >
                <Text style={styles.welcomeTitle}>
                  {faithMode ? '📅 Faithful Scheduling' : '🗓️ Smart Scheduling'}
                </Text>
                <Text style={styles.welcomeDescription}>
                  {faithMode 
                    ? "Plan your content with divine timing. Schedule posts to reach your audience when God leads."
                    : "Optimize your content strategy with intelligent scheduling and analytics."
                  }
                </Text>
              </LinearGradient>
            </BlurView>

            {/* Metrics Grid */}
            <Text style={styles.sectionTitle}>Performance Overview</Text>
            <View style={styles.metricsGrid}>
              {metrics.map((metric, index) => (
                <MetricCard key={index} metric={metric} />
              ))}
            </View>

            {/* Filter Tabs */}
            <View style={styles.tabsContainer}>
              <TabButton 
                title="All Posts" 
                isActive={activeTab === 'all'} 
                onPress={() => setActiveTab('all')} 
              />
              <TabButton 
                title="Scheduled" 
                isActive={activeTab === 'scheduled'} 
                onPress={() => setActiveTab('scheduled')} 
              />
              <TabButton 
                title="Published" 
                isActive={activeTab === 'published'} 
                onPress={() => setActiveTab('published')} 
              />
            </View>

            {/* Posts List */}
            <View style={styles.postsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Your Content</Text>
                <TouchableOpacity
                  style={styles.scheduleButton}
                  onPress={handleScheduleNewPost}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#FFD700', '#FFC107', '#FF8F00'] as const}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.scheduleButtonText}>+ Schedule</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              
              <View style={styles.postsList}>
                {filteredPosts.map(post => (
                  <ScheduledPostCard key={post.id} post={post} />
                ))}
              </View>
            </View>

            {/* Quick Actions */}
            <BlurView intensity={15} style={styles.quickActionsCard}>
              <LinearGradient
                colors={['rgba(26, 26, 58, 0.8)', 'rgba(45, 27, 105, 0.6)'] as const}
                style={styles.quickActionsGradient}
              >
                <Text style={styles.quickActionsTitle}>⚡ Quick Actions</Text>
                <View style={styles.quickActionsList}>
                  <TouchableOpacity style={styles.quickActionItem} onPress={() => Alert.alert('Coming Soon', 'Bulk scheduling feature coming soon!')}>
                    <Text style={styles.quickActionIcon}>📋</Text>
                    <Text style={styles.quickActionText}>Bulk Schedule</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.quickActionItem} onPress={() => Alert.alert('Coming Soon', 'Analytics export coming soon!')}>
                    <Text style={styles.quickActionIcon}>📊</Text>
                    <Text style={styles.quickActionText}>Analytics</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.quickActionItem} onPress={() => Alert.alert('Coming Soon', 'Calendar view coming soon!')}>
                    <Text style={styles.quickActionIcon}>📅</Text>
                    <Text style={styles.quickActionText}>Calendar View</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </BlurView>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: KingdomColors.gold.bright,
    fontWeight: 'bold',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  welcomeCard: {
    borderRadius: 20,
    marginBottom: 24,
    overflow: 'hidden',
    ...KingdomShadows.gold,
  },
  welcomeGradient: {
    padding: 24,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 8,
  },
  welcomeDescription: {
    fontSize: 16,
    color: KingdomColors.text.secondary,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  metricCard: {
    width: (width - 56) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    ...KingdomShadows.silver,
  },
  metricGradient: {
    padding: 16,
  },
  metricTitle: {
    fontSize: 12,
    color: KingdomColors.text.muted,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 4,
  },
  metricChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  changeLabel: {
    fontSize: 12,
    color: KingdomColors.text.muted,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    position: 'relative',
  },
  tabButtonActive: {
    backgroundColor: 'transparent',
  },
  tabGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: KingdomColors.text.muted,
    zIndex: 1,
  },
  tabTextActive: {
    color: KingdomColors.text.inverse,
    fontWeight: 'bold',
  },
  scheduleButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
  },
  scheduleButtonText: {
    color: KingdomColors.text.inverse,
    fontWeight: 'bold',
    fontSize: 14,
  },
  postsSection: {
    marginBottom: 24,
  },
  postsList: {
    gap: 16,
  },
  postCard: {
    borderRadius: 20,
    overflow: 'hidden',
    ...KingdomShadows.elegant,
  },
  postGradient: {
    padding: 20,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  platformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  platformIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  platformEmoji: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  platformText: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.text.secondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 16,
    lineHeight: 22,
  },
  postDetails: {
    gap: 12,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postDate: {
    fontSize: 14,
    color: KingdomColors.text.muted,
  },
  postTime: {
    fontSize: 14,
    color: KingdomColors.text.muted,
    fontWeight: '500',
  },
  engagementContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  engagementItem: {
    alignItems: 'center',
  },
  engagementLabel: {
    fontSize: 12,
    color: KingdomColors.text.muted,
    marginBottom: 4,
  },
  engagementValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: KingdomColors.gold.bright,
  },
  quickActionsCard: {
    borderRadius: 20,
    overflow: 'hidden',
    ...KingdomShadows.elegant,
  },
  quickActionsGradient: {
    padding: 20,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 16,
  },
  quickActionsList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickActionItem: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: KingdomColors.text.secondary,
    textAlign: 'center',
  },
});

export default SchedulingScreen;

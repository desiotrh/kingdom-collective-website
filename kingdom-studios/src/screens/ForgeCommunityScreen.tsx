import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
  FlatList,
  Animated,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/UnifiedAuthContext';
import { useFaithMode } from '../contexts/FaithModeContext';
import { useAppNavigation } from '../utils/navigationUtils';
import { KingdomColors } from '../constants/KingdomColors';
import { KingdomShadows } from '../constants/KingdomShadows';
import KingdomLogo from '../components/KingdomLogo';

const { width, height } = Dimensions.get('window');

interface Creator {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  story?: string;
  points?: number;
  rank?: number;
  badge?: string;
  level?: string;
}

interface LeaderboardEntry {
  id: string;
  user: Creator;
  points: number;
  rank: number;
  change: 'up' | 'down' | 'same';
  badge: string;
  achievements: string[];
}

interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  total: number;
  reward: string;
  participants: number;
  timeLeft: string;
}

interface FeaturedContent {
  id: string;
  creator: Creator;
  title: string;
  description: string;
  image: string;
  likes: number;
  comments: number;
  category: string;
  isLiked: boolean;
}

interface Story {
  id: string;
  creator: Creator;
  preview: string;
  isViewed: boolean;
}

const ForgeCommunityScreen = () => {
  const { user } = useAuth();
  const { faithMode } = useFaithMode();
  const navigation = useAppNavigation();
  const [activeTab, setActiveTab] = useState<'discover' | 'following' | 'trending'>('discover');
  const [activeContentType, setActiveContentType] = useState<'all' | 'projects' | 'reels' | 'photos' | 'resources'>('all');

  // Mock data for trending creators
  const trendingCreators: Creator[] = [
    { id: '1', name: 'Sarah', avatar: 'https://picsum.photos/100/100?random=1', isOnline: true, points: 1250, rank: 1, badge: '👑', level: 'Kingdom Champion' },
    { id: '2', name: 'Michael', avatar: 'https://picsum.photos/100/100?random=2', isOnline: false, points: 980, rank: 3, badge: '⭐', level: 'Faith Leader' },
    { id: '3', name: 'Rachel', avatar: 'https://picsum.photos/100/100?random=3', isOnline: true, points: 1150, rank: 2, badge: '💎', level: 'Kingdom Builder' },
    { id: '4', name: 'David', avatar: 'https://picsum.photos/100/100?random=4', isOnline: true, points: 875, rank: 4, badge: '🔥', level: 'Creator' },
    { id: '5', name: 'Lisa', avatar: 'https://picsum.photos/100/100?random=5', isOnline: false, points: 756, rank: 6, badge: '✨', level: 'Believer' },
    { id: '6', name: 'James', avatar: 'https://picsum.photos/100/100?random=6', isOnline: true, points: 820, rank: 5, badge: '🌟', level: 'Encourager' },
  ];

  // Mock data for leaderboard
  const leaderboard: LeaderboardEntry[] = [
    {
      id: '1',
      user: trendingCreators[0],
      points: 1250,
      rank: 1,
      change: 'up',
      badge: '👑',
      achievements: ['Kingdom Builder', 'Top Helper', 'Community Leader'],
    },
    {
      id: '2',
      user: trendingCreators[2],
      points: 1150,
      rank: 2,
      change: 'same',
      badge: '💎',
      achievements: ['Faith Warrior', 'Encourager', 'Product Master'],
    },
    {
      id: '3',
      user: trendingCreators[1],
      points: 980,
      rank: 3,
      change: 'down',
      badge: '⭐',
      achievements: ['Community Helper', 'Content Creator'],
    },
    {
      id: '4',
      user: trendingCreators[3],
      points: 875,
      rank: 4,
      change: 'up',
      badge: '🔥',
      achievements: ['Rising Star', 'Team Player'],
    },
    {
      id: '5',
      user: trendingCreators[5],
      points: 820,
      rank: 5,
      change: 'up',
      badge: '🌟',
      achievements: ['Consistent Creator'],
    },
  ];

  // Mock data for community challenges
  const challenges: CommunityChallenge[] = [
    {
      id: '1',
      title: faithMode ? 'Share Kingdom Blessings' : 'Spread Positivity',
      description: faithMode ? 'Share testimonies and encourage 5 fellow believers' : 'Help and encourage 5 community members',
      icon: '🤝',
      progress: 3,
      total: 5,
      reward: '100 Kingdom Points',
      participants: 24,
      timeLeft: '2 days',
    },
    {
      id: '2',
      title: faithMode ? 'Product Launch Prayer' : 'Launch Support Squad',
      description: 'Support 3 product launches with likes and feedback',
      icon: '🚀',
      progress: 1,
      total: 3,
      reward: '75 Kingdom Points',
      participants: 18,
      timeLeft: '5 days',
    },
    {
      id: '3',
      title: 'Knowledge Sharing',
      description: 'Create valuable content that helps others grow',
      icon: '📚',
      progress: 0,
      total: 1,
      reward: '150 Kingdom Points',
      participants: 32,
      timeLeft: '1 week',
    },
  ];

  // Mock data for stories
  const stories: Story[] = [
    { id: '1', creator: trendingCreators[0], preview: 'https://picsum.photos/300/400?random=11', isViewed: false },
    { id: '2', creator: trendingCreators[1], preview: 'https://picsum.photos/300/400?random=12', isViewed: true },
    { id: '3', creator: trendingCreators[2], preview: 'https://picsum.photos/300/400?random=13', isViewed: false },
    { id: '4', creator: trendingCreators[3], preview: 'https://picsum.photos/300/400?random=14', isViewed: false },
  ];

  // Mock data for featured content
  const featuredContent: FeaturedContent[] = [
    {
      id: '1',
      creator: trendingCreators[0],
      title: faithMode ? 'Kingdom Business Launch' : 'Product Launch Success',
      description: faithMode ? 'God blessed our faith-based business launch! 🙏' : 'Amazing launch day results! 🚀',
      image: 'https://picsum.photos/400/300?random=21',
      likes: 234,
      comments: 45,
      category: faithMode ? 'Testimony' : 'Business',
      isLiked: false,
    },
    {
      id: '2',
      creator: trendingCreators[2],
      title: faithMode ? 'Creative Worship Space' : 'Dream Studio Setup',
      description: faithMode ? 'My prayer and creation sanctuary ✨' : 'Finally completed my dream workspace! ✨',
      image: 'https://picsum.photos/400/300?random=22',
      likes: 189,
      comments: 23,
      category: 'Workspace',
      isLiked: true,
    },
    {
      id: '3',
      creator: trendingCreators[4],
      title: 'Collaborative Project',
      description: faithMode ? 'Building together for His glory 🤝' : 'Amazing collaboration with fellow creators 🤝',
      image: 'https://picsum.photos/400/300?random=23',
      likes: 156,
      comments: 31,
      category: 'Collaboration',
      isLiked: false,
    },
  ];
  const scrollY = useRef(new Animated.Value(0)).current;

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[KingdomColors.primary.midnight, KingdomColors.primary.deepNavy]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          {/* Top Navigation */}
          <View style={styles.topNav}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.navButton}
            >
              <Text style={styles.backButton}>←</Text>
            </TouchableOpacity>

            <View style={styles.logoContainer}>
              <KingdomLogo size="small" />
            </View>

            <View style={styles.rightNav}>
              <TouchableOpacity style={styles.notificationButton}>
                <View style={styles.notificationIcon}>
                  <Text style={styles.notificationText}>🔔</Text>
                  <View style={styles.notificationBadge} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.profileButton}>
                <Image
                  source={{ uri: user?.photoURL || 'https://picsum.photos/100/100?random=user' }}
                  style={styles.profileImage}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Enhanced Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.headerTitle}>
              {faithMode ? 'The Forge' : 'Creator Forge'}
            </Text>
            <Text style={styles.headerSubtitle}>
              {faithMode ? 'Where Iron Sharpens Iron' : 'Where Creators Collaborate & Share'}
            </Text>

            {/* Quick Stats */}
            <View style={styles.quickStats}>
              <View style={styles.statPill}>
                <Text style={styles.statIcon}>👥</Text>
                <Text style={styles.statText}>2.4K</Text>
              </View>
              <View style={styles.statPill}>
                <Text style={styles.statIcon}>🔥</Text>
                <Text style={styles.statText}>156</Text>
              </View>
              <View style={styles.statPill}>
                <Text style={styles.statIcon}>⭐</Text>
                <Text style={styles.statText}>98%</Text>
              </View>
            </View>
          </View>

          {/* Enhanced Tab Bar */}
          <View style={styles.tabBarContainer}>
            <View style={styles.tabBar}>
              {[
                { key: 'discover', label: 'Discover', icon: '🔍' },
                { key: 'following', label: 'Following', icon: '👥' },
                { key: 'trending', label: 'Trending', icon: '🔥' }
              ].map((tab) => (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.tab, activeTab === tab.key && styles.activeTab]}
                  onPress={() => setActiveTab(tab.key as any)}
                >
                  <Text style={styles.tabIcon}>{tab.icon}</Text>
                  <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
                    {tab.label}
                  </Text>
                  {activeTab === tab.key && <View style={styles.activeTabIndicator} />}
                </TouchableOpacity>
              ))}
            </View>

            {/* Content Type Filters */}
            <View style={styles.contentTypeBar}>
              {[
                { key: 'all', label: 'All', icon: '📱' },
                { key: 'projects', label: faithMode ? 'Testimonies' : 'Projects', icon: '🛠️' },
                { key: 'reels', label: faithMode ? 'Witness Reels' : 'Reels', icon: '🎬' },
                { key: 'photos', label: faithMode ? 'Blessings' : 'Photos', icon: '📸' },
                { key: 'resources', label: faithMode ? 'Scripture' : 'Resources', icon: '📖' }
              ].map((type) => (
                <TouchableOpacity
                  key={type.key}
                  style={[styles.contentTypeTab, activeContentType === type.key && styles.activeContentType]}
                  onPress={() => setActiveContentType(type.key as any)}
                >
                  <Text style={styles.contentTypeIcon}>{type.icon}</Text>
                  <Text style={[styles.contentTypeText, activeContentType === type.key && styles.activeContentTypeText]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Decorative Elements */}
        <View style={styles.headerDecorations}>
          <View style={[styles.decoration, styles.decoration1]} />
          <View style={[styles.decoration, styles.decoration2]} />
          <View style={[styles.decoration, styles.decoration3]} />
        </View>
      </LinearGradient>
    </View>
  );

  const renderLeaderboardCard = ({ item }: { item: LeaderboardEntry }) => (
    <View style={styles.leaderboardCard}>
      <View style={styles.rankSection}>
        <Text style={[styles.rankNumber, item.rank <= 3 && styles.topRank]}>
          #{item.rank}
        </Text>
        <View style={styles.changeIndicator}>
          <Text style={[
            styles.changeIcon,
            item.change === 'up' && styles.changeUp,
            item.change === 'down' && styles.changeDown,
          ]}>
            {item.change === 'up' ? '↗' : item.change === 'down' ? '↘' : '—'}
          </Text>
        </View>
      </View>

      <View style={styles.userSection}>
        <View style={styles.leaderboardAvatar}>
          <Image source={{ uri: item.user.avatar }} style={styles.leaderboardImage} />
          <Text style={styles.badgeEmoji}>{item.badge}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.leaderboardName}>{item.user.name}</Text>
          <Text style={styles.userLevel}>{item.user.level}</Text>
        </View>
      </View>

      <View style={styles.pointsSection}>
        <Text style={styles.pointsNumber}>{item.points}</Text>
        <Text style={styles.pointsLabel}>points</Text>
      </View>
    </View>
  );

  const renderChallengeCard = ({ item }: { item: CommunityChallenge }) => (
    <View style={styles.challengeCard}>
      <View style={styles.challengeHeader}>
        <View style={styles.challengeIcon}>
          <Text style={styles.challengeEmoji}>{item.icon}</Text>
        </View>
        <View style={styles.challengeInfo}>
          <Text style={styles.challengeTitle}>{item.title}</Text>
          <Text style={styles.challengeDescription}>{item.description}</Text>
        </View>
        <View style={styles.challengeReward}>
          <Text style={styles.rewardText}>{item.reward}</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <LinearGradient
            colors={[KingdomColors.gold.bright, KingdomColors.gold.warm]}
            style={[styles.progressFill, { width: `${(item.progress / item.total) * 100}%` }]}
          />
        </View>
        <Text style={styles.progressText}>
          {item.progress}/{item.total} completed
        </Text>
      </View>

      <View style={styles.challengeFooter}>
        <Text style={styles.participantsText}>
          👥 {item.participants} participating
        </Text>
        <Text style={styles.timeLeftText}>
          ⏰ {item.timeLeft} left
        </Text>
      </View>
    </View>
  );

  const renderUserStats = () => (
    <View style={styles.userStatsCard}>
      <LinearGradient
        colors={[KingdomColors.primary.royalPurple, KingdomColors.primary.deepNavy]}
        style={styles.statsGradient}
      >
        <View style={styles.statsHeader}>
          <Text style={styles.statsTitle}>Your Kingdom Progress</Text>
          <Text style={styles.userRank}>Rank #7</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>645</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>23</Text>
            <Text style={styles.statLabel}>
              {faithMode ? 'Prayers' : 'Helps'}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>89</Text>
            <Text style={styles.statLabel}>Likes Given</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.levelUpButton}>
          <Text style={styles.levelUpText}>
            ✨ 105 points to next level
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  const renderCreatorStory = ({ item }: { item: Creator }) => (
    <TouchableOpacity style={styles.creatorStory}>
      <LinearGradient
        colors={item.isOnline ? [KingdomColors.gold.bright, KingdomColors.gold.warm] : [KingdomColors.silver.bright, KingdomColors.silver.steel]}
        style={styles.storyBorder}
      >
        <Image source={{ uri: item.avatar }} style={styles.storyImage} />
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </LinearGradient>
      <Text style={styles.storyName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderFeaturedCard = ({ item }: { item: FeaturedContent }) => (
    <View style={styles.featuredCard}>
      {/* Creator Header with enhanced design */}
      <View style={styles.cardHeader}>
        <View style={styles.creatorInfo}>
          <View style={styles.creatorAvatarContainer}>
            <Image source={{ uri: item.creator.avatar }} style={styles.creatorAvatar} />
            <View style={styles.creatorOnlineIndicator} />
          </View>
          <View style={styles.creatorDetails}>
            <Text style={styles.creatorName}>{item.creator.name}</Text>
            <Text style={styles.creatorRole}>
              {faithMode ? 'Kingdom Creator' : 'Digital Creator'}
            </Text>
            <Text style={styles.timeStamp}>2 hours ago</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.followButton}>
          <LinearGradient
            colors={[KingdomColors.gold.bright, KingdomColors.gold.warm]}
            style={styles.followButtonGradient}
          >
            <Text style={styles.followButtonText}>✨ Follow</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Content Image with overlay */}
      <View style={styles.contentImageContainer}>
        <Image source={{ uri: item.image }} style={styles.contentImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)']}
          style={styles.imageOverlay}
        />
        <View style={styles.imageActions}>
          <TouchableOpacity style={styles.imageActionButton}>
            <Text style={styles.imageActionIcon}>🔗</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.imageActionButton}>
            <Text style={styles.imageActionIcon}>📱</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Enhanced Content Info */}
      <View style={styles.contentInfo}>
        <View style={styles.contentHeader}>
          <Text style={styles.contentTitle}>{item.title}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        </View>

        <Text style={styles.contentDescription}>{item.description}</Text>

        {/* Enhanced Engagement Metrics */}
        <View style={styles.engagementMetrics}>
          <View style={styles.metricItem}>
            <Text style={styles.metricIcon}>👁️</Text>
            <Text style={styles.metricText}>1.2K views</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricIcon}>⚡</Text>
            <Text style={styles.metricText}>98% quality</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricIcon}>🎯</Text>
            <Text style={styles.metricText}>High impact</Text>
          </View>
        </View>

        {/* Enhanced Interaction Bar */}
        <View style={styles.interactionBar}>
          <TouchableOpacity style={[styles.actionButton, styles.enhancedActionButton]}>
            <View style={styles.actionButtonContent}>
              <Text style={[styles.actionIcon, item.isLiked && styles.likedIcon]}>♥</Text>
              <Text style={styles.actionCount}>{item.likes}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.enhancedActionButton]}>
            <View style={styles.actionButtonContent}>
              <Text style={styles.actionIcon}>💬</Text>
              <Text style={styles.actionCount}>{item.comments}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.enhancedActionButton]}>
            <View style={styles.actionButtonContent}>
              <Text style={styles.actionIcon}>📤</Text>
              <Text style={styles.actionCount}>Share</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.saveButton, styles.enhancedSaveButton]}>
            <LinearGradient
              colors={[KingdomColors.opacity.gold20, KingdomColors.opacity.gold10]}
              style={styles.saveButtonGradient}
            >
              <Text style={styles.actionIcon}>🔖</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Stats */}
        {renderUserStats()}

        {/* Mentorship Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {faithMode ? '🙏 Forge Guides' : '🤝 Find a Mentor'}
          </Text>
          <View style={styles.mentorshipPromo}>
            <LinearGradient
              colors={[KingdomColors.primary.royalPurple, KingdomColors.primary.deepNavy]}
              style={styles.mentorshipCard}
            >
              <View style={styles.mentorshipContent}>
                <Text style={styles.mentorshipIcon}>
                  {faithMode ? '✝️' : '🌟'}
                </Text>
                <View style={styles.mentorshipText}>
                  <Text style={styles.mentorshipTitle}>
                    {faithMode
                      ? 'Connect with Spirit-Filled Mentors'
                      : 'Accelerate Your Creative Journey'
                    }
                  </Text>
                  <Text style={styles.mentorshipDescription}>
                    {faithMode
                      ? 'Get guidance from mature believers who can help you grow in faith and creativity.'
                      : 'Learn from experienced creators who want to help you succeed faster.'
                    }
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.mentorshipButton}
                onPress={() => navigation.navigate('MentorshipHub')}
              >
                <LinearGradient
                  colors={[KingdomColors.gold.bright, KingdomColors.gold.warm]}
                  style={styles.mentorshipButtonGradient}
                >
                  <Text style={styles.mentorshipButtonText}>
                    {faithMode ? 'Find a Guide' : 'Find a Mentor'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>

        {/* Community Challenges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {faithMode ? 'Kingdom Challenges' : 'Community Challenges'}
          </Text>
          <FlatList
            data={challenges}
            renderItem={renderChallengeCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Leaderboard */}
        <View style={styles.section}>
          <View style={styles.leaderboardHeader}>
            <Text style={styles.sectionTitle}>
              {faithMode ? 'Kingdom Leaderboard' : 'Community Leaderboard'}
            </Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={leaderboard}
            renderItem={renderLeaderboardCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Trending Creators */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {faithMode ? 'Kingdom Creators' : 'Trending Creators'}
          </Text>
          <FlatList
            data={trendingCreators}
            renderItem={renderCreatorStory}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storiesContainer}
          />
        </View>

        {/* Featured Content */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Content</Text>
          <FlatList
            data={featuredContent}
            renderItem={renderFeaturedCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>

      {/* Floating Create Button */}
      <TouchableOpacity style={styles.floatingCreateButton}>
        <LinearGradient
          colors={[KingdomColors.gold.bright, KingdomColors.gold.warm]}
          style={styles.floatingButtonGradient}
        >
          <Text style={styles.floatingButtonText}>✨</Text>
        </LinearGradient>
      </TouchableOpacity>
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
  headerContent: {
    gap: 20,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    fontSize: 24,
    color: KingdomColors.text.primary,
    fontWeight: 'bold',
  },
  createButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: KingdomColors.opacity.gold20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 20,
    color: KingdomColors.gold.bright,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: KingdomColors.text.muted,
    textAlign: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: KingdomColors.opacity.white10,
    borderRadius: 25,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
    position: 'relative',
  },
  activeTab: {
    backgroundColor: KingdomColors.gold.bright,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.text.muted,
  },
  activeTabText: {
    color: KingdomColors.text.inverse,
  },

  // Content Type Filter Styles
  contentTypeBar: {
    flexDirection: 'row',
    backgroundColor: KingdomColors.opacity.white10,
    borderRadius: 20,
    padding: 3,
    marginTop: 12,
    gap: 6,
  },
  contentTypeTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  activeContentType: {
    backgroundColor: KingdomColors.silver.bright,
  },
  contentTypeIcon: {
    fontSize: 12,
  },
  contentTypeText: {
    fontSize: 11,
    fontWeight: '500',
    color: KingdomColors.text.muted,
  },
  activeContentTypeText: {
    color: KingdomColors.text.inverse,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginHorizontal: 20,
    marginBottom: 15,
  },
  storiesContainer: {
    paddingHorizontal: 20,
    gap: 15,
  },
  creatorStory: {
    alignItems: 'center',
    gap: 8,
  },
  storyBorder: {
    padding: 3,
    borderRadius: 30,
  },
  storyImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: KingdomColors.background.primary,
  },
  onlineIndicator: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: KingdomColors.background.primary,
    bottom: 2,
    right: 2,
  },
  storyName: {
    fontSize: 12,
    color: KingdomColors.text.secondary,
    fontWeight: '500',
  },
  featuredCard: {
    backgroundColor: KingdomColors.background.secondary,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    ...KingdomShadows.elegant,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  creatorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: KingdomColors.gold.bright,
  },
  creatorName: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.text.primary,
  },
  creatorRole: {
    fontSize: 12,
    color: KingdomColors.text.muted,
  },
  followButton: {
    backgroundColor: KingdomColors.gold.bright,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.text.inverse,
  },
  contentImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  contentInfo: {
    padding: 16,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 8,
  },
  contentDescription: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: KingdomColors.opacity.gold20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: KingdomColors.gold.bright,
  },
  interactionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionIcon: {
    fontSize: 18,
    color: KingdomColors.text.muted,
  },
  likedIcon: {
    color: '#EF4444',
  },
  actionCount: {
    fontSize: 14,
    color: KingdomColors.text.muted,
    fontWeight: '500',
  },
  saveButton: {
    marginLeft: 'auto',
  },
  floatingCreateButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    ...KingdomShadows.gold,
  },
  floatingButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingButtonText: {
    fontSize: 24,
  },
  // Leaderboard Styles
  userStatsCard: {
    marginHorizontal: 20,
    marginVertical: 15,
    borderRadius: 20,
    overflow: 'hidden',
    ...KingdomShadows.elegant,
  },
  statsGradient: {
    padding: 20,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
  },
  userRank: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.gold.bright,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: KingdomColors.text.muted,
  },
  levelUpButton: {
    backgroundColor: KingdomColors.opacity.gold20,
    borderRadius: 15,
    paddingVertical: 12,
    alignItems: 'center',
  },
  levelUpText: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.gold.bright,
  },
  leaderboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  viewAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: KingdomColors.opacity.gold20,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: KingdomColors.gold.bright,
  },
  leaderboardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: KingdomColors.background.secondary,
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    ...KingdomShadows.silver,
  },
  rankSection: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 40,
  },
  rankNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.secondary,
    marginBottom: 4,
  },
  topRank: {
    color: KingdomColors.gold.bright,
  },
  changeIndicator: {
    alignItems: 'center',
  },
  changeIcon: {
    fontSize: 12,
    color: KingdomColors.text.muted,
  },
  changeUp: {
    color: '#10B981',
  },
  changeDown: {
    color: '#EF4444',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  leaderboardAvatar: {
    position: 'relative',
    marginRight: 12,
  },
  leaderboardImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: KingdomColors.gold.bright,
  },
  badgeEmoji: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    fontSize: 16,
    backgroundColor: KingdomColors.background.secondary,
    borderRadius: 10,
    width: 20,
    height: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  userInfo: {
    flex: 1,
  },
  leaderboardName: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.text.primary,
    marginBottom: 2,
  },
  userLevel: {
    fontSize: 12,
    color: KingdomColors.text.muted,
  },
  pointsSection: {
    alignItems: 'center',
  },
  pointsNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.gold.bright,
    marginBottom: 2,
  },
  pointsLabel: {
    fontSize: 10,
    color: KingdomColors.text.muted,
    textTransform: 'uppercase',
  },
  challengeCard: {
    backgroundColor: KingdomColors.background.secondary,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    ...KingdomShadows.silver,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  challengeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: KingdomColors.opacity.gold20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  challengeEmoji: {
    fontSize: 20,
  },
  challengeInfo: {
    flex: 1,
    marginRight: 12,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.text.primary,
    marginBottom: 4,
  },
  challengeDescription: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    lineHeight: 20,
  },
  challengeReward: {
    backgroundColor: KingdomColors.opacity.gold20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rewardText: {
    fontSize: 11,
    fontWeight: '600',
    color: KingdomColors.gold.bright,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: KingdomColors.opacity.white10,
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: KingdomColors.text.muted,
    textAlign: 'center',
  },
  challengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  participantsText: {
    fontSize: 12,
    color: KingdomColors.text.muted,
  },
  timeLeftText: {
    fontSize: 12,
    color: KingdomColors.text.muted,
  },
  // Enhanced Header Styles
  headerContainer: {
    position: 'relative',
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: KingdomColors.opacity.white10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  rightNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationButton: {
    position: 'relative',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: KingdomColors.opacity.white10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationText: {
    fontSize: 18,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4444',
  },
  profileButton: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: KingdomColors.gold.bright,
  },
  profileImage: {
    width: 36,
    height: 36,
  },
  titleSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 16,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: KingdomColors.opacity.white10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statIcon: {
    fontSize: 14,
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
    color: KingdomColors.text.primary,
  },
  tabBarContainer: {
    paddingHorizontal: 4,
  },
  tabIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: -2,
    left: '50%',
    marginLeft: -15,
    width: 30,
    height: 3,
    backgroundColor: KingdomColors.gold.bright,
    borderRadius: 2,
  },
  headerDecorations: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  decoration: {
    position: 'absolute',
    borderRadius: 50,
    opacity: 0.1,
  },
  decoration1: {
    width: 100,
    height: 100,
    backgroundColor: KingdomColors.gold.bright,
    top: -20,
    right: -30,
  },
  decoration2: {
    width: 60,
    height: 60,
    backgroundColor: KingdomColors.silver.bright,
    bottom: 20,
    left: -20,
  },
  decoration3: {
    width: 80,
    height: 80,
    backgroundColor: KingdomColors.gold.warm,
    top: 50,
    right: 100,
  },
  // Enhanced Featured Card Styles
  creatorAvatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  creatorOnlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: KingdomColors.background.secondary,
  },
  creatorDetails: {
    flex: 1,
  },
  timeStamp: {
    fontSize: 11,
    color: KingdomColors.text.muted,
    marginTop: 2,
  },
  followButtonGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  contentImageContainer: {
    position: 'relative',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  imageActions: {
    position: 'absolute',
    top: 16,
    right: 16,
    gap: 8,
  },
  imageActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageActionIcon: {
    fontSize: 16,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  engagementMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: KingdomColors.opacity.white10,
    borderRadius: 12,
    paddingVertical: 12,
    marginVertical: 16,
  },
  metricItem: {
    alignItems: 'center',
    gap: 4,
  },
  metricIcon: {
    fontSize: 16,
  },
  metricText: {
    fontSize: 11,
    color: KingdomColors.text.muted,
    fontWeight: '500',
  },
  enhancedActionButton: {
    backgroundColor: KingdomColors.opacity.white10,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  enhancedSaveButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Mentorship styles
  mentorshipPromo: {
    marginBottom: 16,
  },
  mentorshipCard: {
    padding: 20,
    borderRadius: 16,
    ...KingdomShadows.medium,
  },
  mentorshipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  mentorshipIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  mentorshipText: {
    flex: 1,
  },
  mentorshipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 4,
  },
  mentorshipDescription: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    lineHeight: 20,
  },
  mentorshipButton: {
    borderRadius: 12,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  mentorshipButtonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  mentorshipButtonText: {
    color: KingdomColors.background.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ForgeCommunityScreen;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Modal,
  FlatList,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { KingdomColors } from '../constants/KingdomColors';
import { useAuth } from '../contexts/AuthContext';
import { AppMode } from '../types/spiritual';

interface ContentPost {
  id: string;
  title: string;
  content: string;
  type: 'devotional' | 'testimony' | 'teaching' | 'promotional' | 'inspirational' | 'business';
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'youtube' | 'all';
  scheduledDate: string;
  scheduledTime: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  hashtags: string[];
  mediaUrls?: string[];
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  faithMode?: {
    verseReference?: string;
    prayerRequest?: boolean;
    ministryFocus?: string;
    evangelical?: boolean;
  };
  encouragementMode?: {
    motivationType?: 'success' | 'growth' | 'empowerment' | 'wellness';
    goalOriented?: boolean;
    businessFocus?: boolean;
    personalDevelopment?: boolean;
  };
}

interface ContentSeries {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  posts: string[]; // Post IDs
  color: string;
  isActive: boolean;
}

interface ContentTemplate {
  id: string;
  name: string;
  type: ContentPost['type'];
  template: string;
  suggestedHashtags: string[];
  bestTimes: string[];
}

const FaithContentCalendarScreen: React.FC = () => {
  const { user } = useAuth();
  const [mode, setMode] = useState<AppMode>('faith');
  const [activeTab, setActiveTab] = useState<'calendar' | 'schedule' | 'series' | 'analytics'>('calendar');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [series, setSeries] = useState<ContentSeries[]>([]);
  const [templates, setTemplates] = useState<ContentTemplate[]>([]);
  const [isCreatePostModalVisible, setIsCreatePostModalVisible] = useState(false);
  const [isCreateSeriesModalVisible, setIsCreateSeriesModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ContentPost | null>(null);
  const [newPost, setNewPost] = useState<Partial<ContentPost>>({
    title: '',
    content: '',
    type: 'devotional',
    platform: 'all',
    scheduledDate: selectedDate,
    scheduledTime: '09:00',
    hashtags: [],
    status: 'draft',
  });
  const [newSeries, setNewSeries] = useState({
    name: '',
    description: '',
    startDate: selectedDate,
    endDate: '',
    color: '#FFD700',
  });

  const contentTypes = mode === 'faith' 
    ? ['devotional', 'testimony', 'teaching', 'promotional', 'inspirational']
    : ['inspirational', 'business', 'promotional', 'motivational', 'educational'];

  const platforms = ['all', 'facebook', 'instagram', 'twitter', 'linkedin', 'tiktok', 'youtube'];

  const timeSlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
  ];

  useEffect(() => {
    loadPosts();
    loadSeries();
    loadTemplates();
  }, [mode]);

  const loadPosts = () => {
    // Mock data - in real app, this would come from Firebase/API
    const mockPosts: ContentPost[] = mode === 'faith' ? [
      {
        id: '1',
        title: 'Morning Devotional: Trust in His Timing',
        content: `🌅 Good morning, beloved! 

"For my thoughts are not your thoughts, neither are your ways my ways," declares the Lord. - Isaiah 55:8

Sometimes we question God's timing, but His plans are always perfect. Trust the process, even when you can't see the whole picture. 

What's one area where you're learning to trust God's timing today? 💭

#MorningDevotional #TrustGod #Faith #ChristianLife #GodsTiming`,
        type: 'devotional',
        platform: 'instagram',
        scheduledDate: '2024-07-03',
        scheduledTime: '07:00',
        status: 'scheduled',
        hashtags: ['#MorningDevotional', '#TrustGod', '#Faith', '#ChristianLife', '#GodsTiming'],
        faithMode: {
          verseReference: 'Isaiah 55:8',
          prayerRequest: false,
          ministryFocus: 'Daily Encouragement',
          evangelical: false,
        },
      },
      {
        id: '2',
        title: 'Testimony Tuesday: God\'s Provision',
        content: `✨ TESTIMONY TUESDAY ✨

Last month, I was worried about finances, but God provided in the most unexpected way! A project I thought fell through came back with double the original offer. 

God's timing and provision never cease to amaze me! 🙌

Share your testimony of God's provision below! 👇

#TestimonyTuesday #GodsProvision #Faithful #Blessed #ChristianTestimony`,
        type: 'testimony',
        platform: 'facebook',
        scheduledDate: '2024-07-09',
        scheduledTime: '10:00',
        status: 'draft',
        hashtags: ['#TestimonyTuesday', '#GodsProvision', '#Faithful', '#Blessed', '#ChristianTestimony'],
        faithMode: {
          prayerRequest: false,
          ministryFocus: 'Personal Testimony',
          evangelical: true,
        },
      },
    ] : [
      {
        id: '3',
        title: 'Monday Motivation: Your Potential is Limitless',
        content: `💪 MONDAY MOTIVATION 💪

Your potential is not determined by your past, but by your willingness to grow today.

🔥 3 Ways to Unlock Your Potential:
1️⃣ Challenge limiting beliefs
2️⃣ Invest in continuous learning  
3️⃣ Take consistent action

What's one action you're taking today to level up? Drop it below! 👇

#MondayMotivation #Potential #Growth #Success #Mindset #LevelUp`,
        type: 'inspirational',
        platform: 'linkedin',
        scheduledDate: '2024-07-08',
        scheduledTime: '08:00',
        status: 'scheduled',
        hashtags: ['#MondayMotivation', '#Potential', '#Growth', '#Success', '#Mindset', '#LevelUp'],
        encouragementMode: {
          motivationType: 'growth',
          goalOriented: true,
          businessFocus: false,
          personalDevelopment: true,
        },
      },
      {
        id: '4',
        title: 'Business Tip: Consistency Beats Perfection',
        content: `📈 BUSINESS TIP OF THE DAY 📈

Consistency beats perfection every single time.

I used to wait for the "perfect" content before posting. Result? I barely posted anything!

Now I focus on:
✅ Showing up daily
✅ Providing value consistently  
✅ Improving 1% each time

Your audience wants authenticity, not perfection. 

What's stopping you from being more consistent? 🤔

#BusinessTip #Consistency #Entrepreneurship #ContentCreation #GrowthMindset`,
        type: 'business',
        platform: 'instagram',
        scheduledDate: '2024-07-10',
        scheduledTime: '15:00',
        status: 'draft',
        hashtags: ['#BusinessTip', '#Consistency', '#Entrepreneurship', '#ContentCreation', '#GrowthMindset'],
        encouragementMode: {
          motivationType: 'success',
          goalOriented: true,
          businessFocus: true,
          personalDevelopment: false,
        },
      },
    ];

    setPosts(mockPosts);
  };

  const loadSeries = () => {
    const mockSeries: ContentSeries[] = mode === 'faith' ? [
      {
        id: '1',
        name: '30 Days of Gratitude',
        description: 'Daily posts focusing on gratitude and thanksgiving',
        startDate: '2024-07-01',
        endDate: '2024-07-30',
        posts: ['1'],
        color: '#9B59B6',
        isActive: true,
      },
      {
        id: '2',
        name: 'Women of Faith Series',
        description: 'Weekly posts highlighting biblical women and their faith',
        startDate: '2024-07-07',
        endDate: '2024-08-25',
        posts: [],
        color: '#E74C3C',
        isActive: true,
      },
    ] : [
      {
        id: '3',
        name: 'Success Mindset Series',
        description: '21 days of mindset transformation content',
        startDate: '2024-07-01',
        endDate: '2024-07-21',
        posts: ['3'],
        color: '#F39C12',
        isActive: true,
      },
      {
        id: '4',
        name: 'Business Growth Tips',
        description: 'Weekly business growth and strategy content',
        startDate: '2024-07-08',
        endDate: '2024-09-30',
        posts: ['4'],
        color: '#27AE60',
        isActive: true,
      },
    ];

    setSeries(mockSeries);
  };

  const loadTemplates = () => {
    const mockTemplates: ContentTemplate[] = mode === 'faith' ? [
      {
        id: '1',
        name: 'Morning Devotional',
        type: 'devotional',
        template: `🌅 Good morning, beloved! 

"[BIBLE_VERSE]" - [REFERENCE]

[REFLECTION]

[QUESTION]

#MorningDevotional #Faith #ChristianLife`,
        suggestedHashtags: ['#MorningDevotional', '#Faith', '#ChristianLife', '#BibleVerse', '#DailyEncouragement'],
        bestTimes: ['06:00', '07:00', '08:00'],
      },
      {
        id: '2',
        name: 'Testimony Share',
        type: 'testimony',
        template: `✨ TESTIMONY TIME ✨

[TESTIMONY_CONTENT]

God is so faithful! 🙌

[CALL_TO_ACTION]

#Testimony #Faithful #Blessed #ChristianTestimony`,
        suggestedHashtags: ['#Testimony', '#Faithful', '#Blessed', '#ChristianTestimony', '#GodsGoodness'],
        bestTimes: ['10:00', '14:00', '19:00'],
      },
    ] : [
      {
        id: '3',
        name: 'Motivation Monday',
        type: 'inspirational',
        template: `💪 MONDAY MOTIVATION 💪

[MOTIVATIONAL_MESSAGE]

[ACTION_STEPS]

What's one action you're taking today? 👇

#MondayMotivation #Success #Growth #Mindset`,
        suggestedHashtags: ['#MondayMotivation', '#Success', '#Growth', '#Mindset', '#LevelUp'],
        bestTimes: ['07:00', '08:00', '12:00'],
      },
      {
        id: '4',
        name: 'Business Tip',
        type: 'business',
        template: `📈 BUSINESS TIP 📈

[BUSINESS_TIP]

[ACTIONABLE_ADVICE]

[ENGAGEMENT_QUESTION]

#BusinessTip #Entrepreneurship #Success`,
        suggestedHashtags: ['#BusinessTip', '#Entrepreneurship', '#Success', '#GrowthMindset', '#BusinessGrowth'],
        bestTimes: ['09:00', '15:00', '17:00'],
      },
    ];

    setTemplates(mockTemplates);
  };

  const getPostsForDate = (date: string) => {
    return posts.filter(post => post.scheduledDate === date);
  };

  const createPost = () => {
    if (!newPost.title || !newPost.content) {
      Alert.alert('Error', 'Please fill in title and content');
      return;
    }

    const post: ContentPost = {
      id: Date.now().toString(),
      title: newPost.title || '',
      content: newPost.content || '',
      type: newPost.type || 'devotional',
      platform: newPost.platform || 'all',
      scheduledDate: newPost.scheduledDate || selectedDate,
      scheduledTime: newPost.scheduledTime || '09:00',
      status: 'draft',
      hashtags: newPost.hashtags || [],
      ...(mode === 'faith' && {
        faithMode: {
          verseReference: '',
          prayerRequest: false,
          ministryFocus: '',
          evangelical: false,
        }
      }),
      ...(mode === 'encouragement' && {
        encouragementMode: {
          motivationType: 'growth',
          goalOriented: false,
          businessFocus: false,
          personalDevelopment: false,
        }
      }),
    };

    setPosts(prev => [post, ...prev]);
    setIsCreatePostModalVisible(false);
    setNewPost({
      title: '',
      content: '',
      type: 'devotional',
      platform: 'all',
      scheduledDate: selectedDate,
      scheduledTime: '09:00',
      hashtags: [],
      status: 'draft',
    });

    Alert.alert('Success!', 'Post created successfully');
  };

  const createSeries = () => {
    if (!newSeries.name || !newSeries.startDate || !newSeries.endDate) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const seriesItem: ContentSeries = {
      id: Date.now().toString(),
      name: newSeries.name,
      description: newSeries.description,
      startDate: newSeries.startDate,
      endDate: newSeries.endDate,
      posts: [],
      color: newSeries.color,
      isActive: true,
    };

    setSeries(prev => [seriesItem, ...prev]);
    setIsCreateSeriesModalVisible(false);
    setNewSeries({
      name: '',
      description: '',
      startDate: selectedDate,
      endDate: '',
      color: '#FFD700',
    });

    Alert.alert('Success!', 'Content series created successfully');
  };

  const schedulePost = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, status: 'scheduled' as const }
        : post
    ));
    Alert.alert('Scheduled!', 'Post has been scheduled for publishing');
  };

  const duplicatePost = (post: ContentPost) => {
    const duplicatedPost: ContentPost = {
      ...post,
      id: Date.now().toString(),
      title: `${post.title} (Copy)`,
      status: 'draft',
      scheduledDate: selectedDate,
    };

    setPosts(prev => [duplicatedPost, ...prev]);
    Alert.alert('Duplicated!', 'Post has been duplicated');
  };

  const renderCalendarDay = (date: string) => {
    const dayPosts = getPostsForDate(date);
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const isToday = date === new Date().toISOString().split('T')[0];
    const isSelected = date === selectedDate;

    return (
      <TouchableOpacity
        key={date}
        style={[
          styles.calendarDay,
          isToday && styles.calendarDayToday,
          isSelected && styles.calendarDaySelected,
        ]}
        onPress={() => setSelectedDate(date)}
      >
        <Text style={[
          styles.calendarDayText,
          isToday && styles.calendarDayTextToday,
          isSelected && styles.calendarDayTextSelected,
        ]}>
          {day}
        </Text>
        {dayPosts.length > 0 && (
          <View style={styles.calendarDayPosts}>
            {dayPosts.slice(0, 3).map((post, index) => (
              <View
                key={post.id}
                style={[
                  styles.calendarPostDot,
                  { backgroundColor: post.status === 'scheduled' ? KingdomColors.accent.success : KingdomColors.gold.bright }
                ]}
              />
            ))}
            {dayPosts.length > 3 && (
              <Text style={styles.calendarPostCount}>+{dayPosts.length - 3}</Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderPostCard = ({ item: post }: { item: ContentPost }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.postInfo}>
          <Text style={styles.postTitle}>{post.title}</Text>
          <Text style={styles.postDetails}>
            {post.platform.toUpperCase()} • {post.scheduledTime} • {post.type}
          </Text>
          <View style={[
            styles.statusBadge,
            {
              backgroundColor: 
                post.status === 'scheduled' ? KingdomColors.accent.success :
                post.status === 'published' ? KingdomColors.accent.info :
                post.status === 'failed' ? KingdomColors.accent.error :
                KingdomColors.silver.steel
            }
          ]}>
            <Text style={styles.statusText}>{post.status.toUpperCase()}</Text>
          </View>
        </View>
        <View style={styles.postActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setSelectedPost(post)}
          >
            <Ionicons name="eye-outline" size={20} color={KingdomColors.gold.bright} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => duplicatePost(post)}
          >
            <Ionicons name="copy-outline" size={20} color={KingdomColors.gold.bright} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.postContent} numberOfLines={3}>
        {post.content}
      </Text>

      <View style={styles.postHashtags}>
        {post.hashtags.slice(0, 4).map((hashtag, index) => (
          <View key={index} style={styles.hashtag}>
            <Text style={styles.hashtagText}>{hashtag}</Text>
          </View>
        ))}
        {post.hashtags.length > 4 && (
          <Text style={styles.hashtagCount}>+{post.hashtags.length - 4}</Text>
        )}
      </View>

      {post.status === 'draft' && (
        <TouchableOpacity
          style={styles.scheduleButton}
          onPress={() => schedulePost(post.id)}
        >
          <Text style={styles.scheduleButtonText}>Schedule Post</Text>
        </TouchableOpacity>
      )}

      {post.engagement && (
        <View style={styles.engagementStats}>
          <View style={styles.engagementStat}>
            <Text style={styles.engagementValue}>{post.engagement.likes}</Text>
            <Text style={styles.engagementLabel}>Likes</Text>
          </View>
          <View style={styles.engagementStat}>
            <Text style={styles.engagementValue}>{post.engagement.comments}</Text>
            <Text style={styles.engagementLabel}>Comments</Text>
          </View>
          <View style={styles.engagementStat}>
            <Text style={styles.engagementValue}>{post.engagement.shares}</Text>
            <Text style={styles.engagementLabel}>Shares</Text>
          </View>
          <View style={styles.engagementStat}>
            <Text style={styles.engagementValue}>{post.engagement.views}</Text>
            <Text style={styles.engagementLabel}>Views</Text>
          </View>
        </View>
      )}
    </View>
  );

  const renderSeriesCard = ({ item: series }: { item: ContentSeries }) => (
    <View style={styles.seriesCard}>
      <View style={styles.seriesHeader}>
        <View style={[styles.seriesColorBar, { backgroundColor: series.color }]} />
        <View style={styles.seriesInfo}>
          <Text style={styles.seriesName}>{series.name}</Text>
          <Text style={styles.seriesDescription}>{series.description}</Text>
          <Text style={styles.seriesDates}>
            {new Date(series.startDate).toLocaleDateString()} - {new Date(series.endDate).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.seriesStats}>
          <Text style={styles.seriesPostCount}>{series.posts.length}</Text>
          <Text style={styles.seriesPostLabel}>posts</Text>
        </View>
      </View>
    </View>
  );

  const renderAnalytics = () => {
    const totalPosts = posts.length;
    const scheduledPosts = posts.filter(p => p.status === 'scheduled').length;
    const publishedPosts = posts.filter(p => p.status === 'published').length;
    const totalEngagement = posts.reduce((sum, post) => {
      if (post.engagement) {
        return sum + post.engagement.likes + post.engagement.comments + post.engagement.shares;
      }
      return sum;
    }, 0);

    return (
      <ScrollView style={styles.analyticsContainer}>
        <View style={styles.analyticsHeader}>
          <Text style={styles.analyticsTitle}>
            {mode === 'faith' ? '📊 Ministry Content Analytics' : '📈 Content Performance'}
          </Text>
        </View>

        <View style={styles.analyticsGrid}>
          <View style={styles.analyticsCard}>
            <Text style={styles.analyticsValue}>{totalPosts}</Text>
            <Text style={styles.analyticsLabel}>Total Posts</Text>
          </View>
          <View style={styles.analyticsCard}>
            <Text style={styles.analyticsValue}>{scheduledPosts}</Text>
            <Text style={styles.analyticsLabel}>Scheduled</Text>
          </View>
          <View style={styles.analyticsCard}>
            <Text style={styles.analyticsValue}>{publishedPosts}</Text>
            <Text style={styles.analyticsLabel}>Published</Text>
          </View>
          <View style={styles.analyticsCard}>
            <Text style={styles.analyticsValue}>{totalEngagement}</Text>
            <Text style={styles.analyticsLabel}>Total Engagement</Text>
          </View>
        </View>

        <View style={styles.bestTimesSection}>
          <Text style={styles.sectionTitle}>🕐 Best Posting Times</Text>
          <View style={styles.timeSlots}>
            {['07:00', '12:00', '19:00'].map((time, index) => (
              <View key={time} style={styles.timeSlot}>
                <Text style={styles.timeSlotTime}>{time}</Text>
                <Text style={styles.timeSlotLabel}>
                  {index === 0 ? 'Morning' : index === 1 ? 'Afternoon' : 'Evening'}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={mode === 'faith' 
          ? [KingdomColors.primary.royalPurple, KingdomColors.primary.deepNavy]
          : [KingdomColors.gold.bright, KingdomColors.gold.warm]
        }
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            {mode === 'faith' ? '📅 Faith Content Calendar' : '🗓️ Content Strategy Hub'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {mode === 'faith' 
              ? 'Plan your ministry content with purpose'
              : 'Strategic content planning for growth'
            }
          </Text>
          
          <TouchableOpacity
            style={styles.modeToggle}
            onPress={() => setMode(mode === 'faith' ? 'encouragement' : 'faith')}
          >
            <Text style={styles.modeToggleText}>
              Switch to {mode === 'faith' ? 'Encouragement' : 'Faith'} Mode
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {['calendar', 'schedule', 'series', 'analytics'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab as any)}
          >
            <Ionicons
              name={
                tab === 'calendar' ? 'calendar-outline' :
                tab === 'schedule' ? 'time-outline' :
                tab === 'series' ? 'list-outline' :
                'analytics-outline'
              }
              size={20}
              color={activeTab === tab ? KingdomColors.white : KingdomColors.silver.steel}
            />
            <Text style={[
              styles.tabText,
              activeTab === tab && styles.activeTabText
            ]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {activeTab === 'calendar' && (
        <View style={styles.content}>
          <View style={styles.calendarHeader}>
            <Text style={styles.calendarMonth}>
              {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setIsCreatePostModalVisible(true)}
            >
              <Ionicons name="add" size={20} color={KingdomColors.white} />
              <Text style={styles.addButtonText}>New Post</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.calendarContainer}>
            {/* Calendar Grid would go here - simplified for demo */}
            <View style={styles.selectedDatePosts}>
              <Text style={styles.selectedDateTitle}>
                Posts for {new Date(selectedDate).toLocaleDateString()}
              </Text>
              <FlatList
                data={getPostsForDate(selectedDate)}
                renderItem={renderPostCard}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>No posts scheduled for this date</Text>
                    <TouchableOpacity
                      style={styles.emptyStateButton}
                      onPress={() => setIsCreatePostModalVisible(true)}
                    >
                      <Text style={styles.emptyStateButtonText}>Create First Post</Text>
                    </TouchableOpacity>
                  </View>
                }
              />
            </View>
          </ScrollView>
        </View>
      )}

      {activeTab === 'schedule' && (
        <View style={styles.content}>
          <View style={styles.scheduleHeader}>
            <Text style={styles.sectionTitle}>Scheduled Posts</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setIsCreatePostModalVisible(true)}
            >
              <Ionicons name="add" size={20} color={KingdomColors.white} />
              <Text style={styles.addButtonText}>New Post</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={posts.sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())}
            renderItem={renderPostCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      )}

      {activeTab === 'series' && (
        <View style={styles.content}>
          <View style={styles.seriesHeader}>
            <Text style={styles.sectionTitle}>Content Series</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setIsCreateSeriesModalVisible(true)}
            >
              <Ionicons name="add" size={20} color={KingdomColors.white} />
              <Text style={styles.addButtonText}>New Series</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={series}
            renderItem={renderSeriesCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      )}

      {activeTab === 'analytics' && renderAnalytics()}

      {/* Create Post Modal */}
      <Modal
        visible={isCreatePostModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create New Post</Text>
            <TouchableOpacity
              onPress={() => setIsCreatePostModalVisible(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color={KingdomColors.text.muted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.inputLabel}>Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter post title..."
              placeholderTextColor={KingdomColors.silver.steel}
              value={newPost.title}
              onChangeText={(text) => setNewPost(prev => ({ ...prev, title: text }))}
            />

            <Text style={styles.inputLabel}>Content *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Write your post content..."
              placeholderTextColor={KingdomColors.silver.steel}
              value={newPost.content}
              onChangeText={(text) => setNewPost(prev => ({ ...prev, content: text }))}
              multiline
              numberOfLines={6}
            />

            <Text style={styles.inputLabel}>Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeSelector}>
              {contentTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    newPost.type === type && styles.activeTypeButton
                  ]}
                  onPress={() => setNewPost(prev => ({ ...prev, type: type as any }))}
                >
                  <Text style={[
                    styles.typeButtonText,
                    newPost.type === type && styles.activeTypeButtonText
                  ]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.inputLabel}>Platform</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.platformSelector}>
              {platforms.map((platform) => (
                <TouchableOpacity
                  key={platform}
                  style={[
                    styles.platformButton,
                    newPost.platform === platform && styles.activePlatformButton
                  ]}
                  onPress={() => setNewPost(prev => ({ ...prev, platform: platform as any }))}
                >
                  <Text style={[
                    styles.platformButtonText,
                    newPost.platform === platform && styles.activePlatformButtonText
                  ]}>
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.dateTimeRow}>
              <View style={styles.dateTimeField}>
                <Text style={styles.inputLabel}>Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={KingdomColors.silver.steel}
                  value={newPost.scheduledDate}
                  onChangeText={(text) => setNewPost(prev => ({ ...prev, scheduledDate: text }))}
                />
              </View>
              <View style={styles.dateTimeField}>
                <Text style={styles.inputLabel}>Time</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {timeSlots.map((time) => (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.timeSlotButton,
                        newPost.scheduledTime === time && styles.activeTimeSlotButton
                      ]}
                      onPress={() => setNewPost(prev => ({ ...prev, scheduledTime: time }))}
                    >
                      <Text style={[
                        styles.timeSlotButtonText,
                        newPost.scheduledTime === time && styles.activeTimeSlotButtonText
                      ]}>
                        {time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <TouchableOpacity style={styles.createButton} onPress={createPost}>
              <LinearGradient
                colors={[KingdomColors.gold.bright, KingdomColors.gold.warm]}
                style={styles.createButtonGradient}
              >
                <Text style={styles.createButtonText}>Create Post</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Create Series Modal */}
      <Modal
        visible={isCreateSeriesModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create Content Series</Text>
            <TouchableOpacity
              onPress={() => setIsCreateSeriesModalVisible(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color={KingdomColors.text.muted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.inputLabel}>Series Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter series name..."
              placeholderTextColor={KingdomColors.silver.steel}
              value={newSeries.name}
              onChangeText={(text) => setNewSeries(prev => ({ ...prev, name: text }))}
            />

            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe your content series..."
              placeholderTextColor={KingdomColors.silver.steel}
              value={newSeries.description}
              onChangeText={(text) => setNewSeries(prev => ({ ...prev, description: text }))}
              multiline
              numberOfLines={3}
            />

            <View style={styles.dateTimeRow}>
              <View style={styles.dateTimeField}>
                <Text style={styles.inputLabel}>Start Date *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={KingdomColors.silver.steel}
                  value={newSeries.startDate}
                  onChangeText={(text) => setNewSeries(prev => ({ ...prev, startDate: text }))}
                />
              </View>
              <View style={styles.dateTimeField}>
                <Text style={styles.inputLabel}>End Date *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={KingdomColors.silver.steel}
                  value={newSeries.endDate}
                  onChangeText={(text) => setNewSeries(prev => ({ ...prev, endDate: text }))}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.createButton} onPress={createSeries}>
              <LinearGradient
                colors={[KingdomColors.gold.bright, KingdomColors.gold.warm]}
                style={styles.createButtonGradient}
              >
                <Text style={styles.createButtonText}>Create Series</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
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
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: KingdomColors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: KingdomColors.white,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 16,
  },
  modeToggle: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  modeToggleText: {
    color: KingdomColors.white,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: KingdomColors.white,
    borderBottomWidth: 1,
    borderBottomColor: KingdomColors.silver.light,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
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
    color: KingdomColors.white,
  },
  content: {
    flex: 1,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: KingdomColors.white,
    borderBottomWidth: 1,
    borderBottomColor: KingdomColors.silver.light,
  },
  calendarMonth: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: KingdomColors.gold.bright,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.white,
  },
  calendarContainer: {
    flex: 1,
  },
  calendarDay: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    margin: 2,
  },
  calendarDayToday: {
    backgroundColor: KingdomColors.gold.bright,
  },
  calendarDaySelected: {
    backgroundColor: KingdomColors.primary.royalPurple,
  },
  calendarDayText: {
    fontSize: 16,
    color: KingdomColors.text.primary,
  },
  calendarDayTextToday: {
    color: KingdomColors.white,
    fontWeight: 'bold',
  },
  calendarDayTextSelected: {
    color: KingdomColors.white,
  },
  calendarDayPosts: {
    position: 'absolute',
    bottom: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarPostDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 1,
  },
  calendarPostCount: {
    fontSize: 8,
    color: KingdomColors.white,
    fontWeight: 'bold',
  },
  selectedDatePosts: {
    padding: 16,
  },
  selectedDateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 16,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: KingdomColors.white,
    borderBottomWidth: 1,
    borderBottomColor: KingdomColors.silver.light,
  },
  seriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: KingdomColors.white,
    borderBottomWidth: 1,
    borderBottomColor: KingdomColors.silver.light,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
  },
  listContainer: {
    padding: 16,
  },
  postCard: {
    backgroundColor: KingdomColors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  postInfo: {
    flex: 1,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 4,
  },
  postDetails: {
    fontSize: 12,
    color: KingdomColors.silver.steel,
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: KingdomColors.white,
  },
  postActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: KingdomColors.silver.platinum,
  },
  postContent: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  postHashtags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  hashtag: {
    backgroundColor: KingdomColors.silver.platinum,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  hashtagText: {
    fontSize: 12,
    color: KingdomColors.text.muted,
  },
  hashtagCount: {
    fontSize: 12,
    color: KingdomColors.text.muted,
    fontStyle: 'italic',
  },
  scheduleButton: {
    backgroundColor: KingdomColors.gold.bright,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  scheduleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.white,
  },
  engagementStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: KingdomColors.silver.light,
  },
  engagementStat: {
    alignItems: 'center',
  },
  engagementValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
  },
  engagementLabel: {
    fontSize: 10,
    color: KingdomColors.silver.steel,
  },
  seriesCard: {
    backgroundColor: KingdomColors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  seriesColorBar: {
    width: 4,
    height: 60,
    borderRadius: 2,
    marginRight: 16,
  },
  seriesInfo: {
    flex: 1,
  },
  seriesName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 4,
  },
  seriesDescription: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    marginBottom: 8,
  },
  seriesDates: {
    fontSize: 12,
    color: KingdomColors.silver.steel,
  },
  seriesStats: {
    alignItems: 'center',
  },
  seriesPostCount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
  },
  seriesPostLabel: {
    fontSize: 12,
    color: KingdomColors.silver.steel,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: KingdomColors.text.secondary,
    marginBottom: 16,
  },
  emptyStateButton: {
    backgroundColor: KingdomColors.gold.bright,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyStateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.white,
  },
  analyticsContainer: {
    flex: 1,
    backgroundColor: KingdomColors.background.primary,
  },
  analyticsHeader: {
    padding: 20,
    backgroundColor: KingdomColors.white,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: KingdomColors.silver.light,
  },
  analyticsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    textAlign: 'center',
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  analyticsCard: {
    backgroundColor: KingdomColors.white,
    borderRadius: 16,
    padding: 20,
    width: '47%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  analyticsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 4,
  },
  analyticsLabel: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    textAlign: 'center',
  },
  bestTimesSection: {
    backgroundColor: KingdomColors.white,
    borderRadius: 16,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  timeSlots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  timeSlot: {
    alignItems: 'center',
    backgroundColor: KingdomColors.gold.bright,
    padding: 16,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
  },
  timeSlotTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: KingdomColors.white,
  },
  timeSlotLabel: {
    fontSize: 12,
    color: KingdomColors.white,
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: KingdomColors.background.primary,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: KingdomColors.white,
    borderBottomWidth: 1,
    borderBottomColor: KingdomColors.silver.light,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.text.primary,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: KingdomColors.white,
    borderWidth: 1,
    borderColor: KingdomColors.silver.light,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: KingdomColors.text.primary,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  typeSelector: {
    flexDirection: 'row',
    marginTop: 8,
  },
  typeButton: {
    backgroundColor: KingdomColors.silver.platinum,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  activeTypeButton: {
    backgroundColor: KingdomColors.gold.bright,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.text.muted,
  },
  activeTypeButtonText: {
    color: KingdomColors.white,
  },
  platformSelector: {
    flexDirection: 'row',
    marginTop: 8,
  },
  platformButton: {
    backgroundColor: KingdomColors.silver.platinum,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  activePlatformButton: {
    backgroundColor: KingdomColors.gold.bright,
  },
  platformButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.text.muted,
  },
  activePlatformButtonText: {
    color: KingdomColors.white,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
  },
  dateTimeField: {
    flex: 1,
  },
  timeSlotButton: {
    backgroundColor: KingdomColors.silver.platinum,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
  },
  activeTimeSlotButton: {
    backgroundColor: KingdomColors.gold.bright,
  },
  timeSlotButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: KingdomColors.text.muted,
  },
  activeTimeSlotButtonText: {
    color: KingdomColors.white,
  },
  createButton: {
    marginTop: 32,
    borderRadius: 12,
    overflow: 'hidden',
  },
  createButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.white,
  },
});

export default FaithContentCalendarScreen;

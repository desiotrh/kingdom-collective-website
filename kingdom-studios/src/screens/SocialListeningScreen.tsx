import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
  TextInput,
  Modal,
  SafeAreaView,
} from 'react-native';
import { KingdomColors } from '../constants/KingdomColors';
import { useDualMode } from '../contexts/DualModeContext';

interface SocialMention {
  id: string;
  platform: 'instagram' | 'twitter' | 'facebook' | 'youtube' | 'tiktok' | 'linkedin';
  username: string;
  content: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  timestamp: string;
  engagement: number;
  isInfluencer: boolean;
  keywords: string[];
  url: string;
}

interface BrandAlert {
  id: string;
  type: 'mention' | 'hashtag' | 'competitor' | 'keyword';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  isRead: boolean;
  timestamp: string;
}

interface SentimentAnalysis {
  positive: number;
  negative: number;
  neutral: number;
  overallScore: number;
  trend: 'improving' | 'declining' | 'stable';
}

interface MonitoringKeyword {
  id: string;
  keyword: string;
  isActive: boolean;
  mentions: number;
  sentiment: number;
  addedDate: string;
}

const SocialListeningScreen: React.FC = () => {
  const { currentMode } = useDualMode();
  const colors = currentMode === 'faith' ? KingdomColors.faith : KingdomColors.encouragement;
  const [mentions, setMentions] = useState<SocialMention[]>([]);
  const [alerts, setAlerts] = useState<BrandAlert[]>([]);
  const [keywords, setKeywords] = useState<MonitoringKeyword[]>([]);
  const [sentiment, setSentiment] = useState<SentimentAnalysis | null>(null);
  const [selectedTab, setSelectedTab] = useState<'mentions' | 'alerts' | 'sentiment' | 'keywords'>('mentions');
  const [showAddKeywordModal, setShowAddKeywordModal] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, [currentMode]);

  const loadData = () => {
    // Mock data - in real app, this would come from social media APIs
    const mockMentions: SocialMention[] = currentMode === 'faith' ? [
      {
        id: '1',
        platform: 'instagram',
        username: '@faithfulentrepreneur',
        content: 'Just discovered Kingdom Studios and I\'m amazed by how it integrates faith with business! This is exactly what Christian creators need. 🙏✨ #KingdomBusiness #Faith',
        sentiment: 'positive',
        timestamp: '2024-07-10T14:30:00Z',
        engagement: 45,
        isInfluencer: true,
        keywords: ['Kingdom Studios', 'faith', 'business'],
        url: 'https://instagram.com/p/xyz123',
      },
      {
        id: '2',
        platform: 'twitter',
        username: '@christianbizowner',
        content: 'Kingdom Studios is helping me build my God-centered business. The dual-mode feature is brilliant! Highly recommend to fellow believers. #FaithInBusiness',
        sentiment: 'positive',
        timestamp: '2024-07-10T12:15:00Z',
        engagement: 23,
        isInfluencer: false,
        keywords: ['Kingdom Studios', 'God-centered', 'business'],
        url: 'https://twitter.com/status/xyz456',
      },
      {
        id: '3',
        platform: 'youtube',
        username: '@ministryleader',
        content: 'Review of Kingdom Studios: A game-changer for faith-based creators. The biblical integration is thoughtful and the tools are powerful.',
        sentiment: 'positive',
        timestamp: '2024-07-09T18:45:00Z',
        engagement: 156,
        isInfluencer: true,
        keywords: ['Kingdom Studios', 'faith-based', 'creators'],
        url: 'https://youtube.com/watch?v=abc789',
      },
    ] : [
      {
        id: '1',
        platform: 'twitter',
        username: '@digitalmarketer',
        content: 'Kingdom Studios has some interesting features for content creators. The AI assistance is quite good, though I wish it had more integrations.',
        sentiment: 'neutral',
        timestamp: '2024-07-10T16:20:00Z',
        engagement: 34,
        isInfluencer: true,
        keywords: ['Kingdom Studios', 'content creators', 'AI'],
        url: 'https://twitter.com/status/xyz789',
      },
      {
        id: '2',
        platform: 'linkedin',
        username: '@businesscoach',
        content: 'Kingdom Studios is revolutionizing how entrepreneurs manage their digital presence. The analytics dashboard is particularly impressive!',
        sentiment: 'positive',
        timestamp: '2024-07-10T11:30:00Z',
        engagement: 89,
        isInfluencer: true,
        keywords: ['Kingdom Studios', 'entrepreneurs', 'analytics'],
        url: 'https://linkedin.com/posts/xyz123',
      },
    ];

    const mockAlerts: BrandAlert[] = [
      {
        id: '1',
        type: 'mention',
        title: 'High-engagement mention',
        description: 'Your brand was mentioned by an influencer with 50K+ followers',
        priority: 'high',
        isRead: false,
        timestamp: '2024-07-10T14:30:00Z',
      },
      {
        id: '2',
        type: 'hashtag',
        title: 'Trending hashtag opportunity',
        description: '#KingdomBusiness is trending - consider joining the conversation',
        priority: 'medium',
        isRead: false,
        timestamp: '2024-07-10T12:00:00Z',
      },
      {
        id: '3',
        type: 'competitor',
        title: 'Competitor activity',
        description: 'A competitor launched a similar feature - monitor for user reactions',
        priority: 'medium',
        isRead: true,
        timestamp: '2024-07-09T16:45:00Z',
      },
    ];

    const mockKeywords: MonitoringKeyword[] = currentMode === 'faith' ? [
      {
        id: '1',
        keyword: 'Kingdom Studios',
        isActive: true,
        mentions: 234,
        sentiment: 0.8,
        addedDate: '2024-06-01',
      },
      {
        id: '2',
        keyword: 'faith-based creators',
        isActive: true,
        mentions: 89,
        sentiment: 0.7,
        addedDate: '2024-06-01',
      },
      {
        id: '3',
        keyword: 'Christian entrepreneurs',
        isActive: true,
        mentions: 156,
        sentiment: 0.9,
        addedDate: '2024-06-01',
      },
    ] : [
      {
        id: '1',
        keyword: 'Kingdom Studios',
        isActive: true,
        mentions: 456,
        sentiment: 0.7,
        addedDate: '2024-06-01',
      },
      {
        id: '2',
        keyword: 'content creation tools',
        isActive: true,
        mentions: 203,
        sentiment: 0.6,
        addedDate: '2024-06-01',
      },
      {
        id: '3',
        keyword: 'digital marketing',
        isActive: true,
        mentions: 789,
        sentiment: 0.5,
        addedDate: '2024-06-01',
      },
    ];

    const mockSentiment: SentimentAnalysis = {
      positive: 68,
      negative: 12,
      neutral: 20,
      overallScore: 0.78,
      trend: 'improving',
    };

    setMentions(mockMentions);
    setAlerts(mockAlerts);
    setKeywords(mockKeywords);
    setSentiment(mockSentiment);
  };

  const addKeyword = () => {
    if (!newKeyword.trim()) {
      Alert.alert('Error', 'Please enter a keyword to monitor');
      return;
    }

    const keyword: MonitoringKeyword = {
      id: Date.now().toString(),
      keyword: newKeyword.trim(),
      isActive: true,
      mentions: 0,
      sentiment: 0,
      addedDate: new Date().toISOString().split('T')[0],
    };

    setKeywords(prev => [keyword, ...prev]);
    setNewKeyword('');
    setShowAddKeywordModal(false);

    Alert.alert(
      'Keyword Added!',
      `Now monitoring "${keyword.keyword}" across all platforms.`
    );
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return '📷';
      case 'twitter': return '🐦';
      case 'facebook': return '👥';
      case 'youtube': return '📺';
      case 'tiktok': return '🎵';
      case 'linkedin': return '💼';
      default: return '📱';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '#4CAF50';
      case 'negative': return '#F44336';
      case 'neutral': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#F44336';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return '#9E9E9E';
    }
  };

  const getFilteredMentions = () => {
    if (selectedPlatform === 'all') return mentions;
    return mentions.filter(mention => mention.platform === selectedPlatform);
  };

  const renderMention = ({ item }: { item: SocialMention }) => (
    <View style={[styles.mentionCard, { backgroundColor: colors.surface }]}>
      <View style={styles.mentionHeader}>
        <View style={styles.platformInfo}>
          <Text style={styles.platformIcon}>
            {getPlatformIcon(item.platform)}
          </Text>
          <Text style={[styles.username, { color: colors.text }]}>
            {item.username}
          </Text>
          {item.isInfluencer && (
            <View style={[styles.influencerBadge, { backgroundColor: colors.success }]}>
              <Text style={styles.influencerText}>⭐</Text>
            </View>
          )}
        </View>
        <View style={[styles.sentimentBadge, { backgroundColor: getSentimentColor(item.sentiment) }]}>
          <Text style={styles.sentimentText}>
            {item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1)}
          </Text>
        </View>
      </View>

      <Text style={[styles.mentionContent, { color: colors.text }]}>
        {item.content}
      </Text>

      <View style={styles.mentionFooter}>
        <Text style={[styles.engagement, { color: colors.textSecondary }]}>
          ❤️ {item.engagement} engagements
        </Text>
        <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
          {new Date(item.timestamp).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.keywordTags}>
        {item.keywords.map((keyword, index) => (
          <View key={index} style={[styles.keywordTag, { backgroundColor: colors.primary + '20' }]}>
            <Text style={[styles.keywordTagText, { color: colors.success }]}>
              {keyword}
            </Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.viewButton, { backgroundColor: colors.success }]}
        onPress={() => Alert.alert('View Original', `Opening: ${item.url}`)}
      >
        <Text style={styles.viewButtonText}>View Original Post</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAlert = ({ item }: { item: BrandAlert }) => (
    <View style={[
      styles.alertCard,
      { backgroundColor: colors.surface },
      !item.isRead && { borderLeftWidth: 4, borderLeftColor: colors.success }
    ]}>
      <View style={styles.alertHeader}>
        <View style={styles.alertInfo}>
          <Text style={[styles.alertTitle, { color: colors.text }]}>
            {item.title}
          </Text>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
            <Text style={styles.priorityText}>
              {item.priority.toUpperCase()}
            </Text>
          </View>
        </View>
        {!item.isRead && (
          <View style={[styles.unreadDot, { backgroundColor: colors.success }]} />
        )}
      </View>

      <Text style={[styles.alertDescription, { color: colors.textSecondary }]}>
        {item.description}
      </Text>

      <Text style={[styles.alertTime, { color: colors.textSecondary }]}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>
    </View>
  );

  const renderKeyword = ({ item }: { item: MonitoringKeyword }) => (
    <View style={[styles.keywordCard, { backgroundColor: colors.surface }]}>
      <View style={styles.keywordHeader}>
        <Text style={[styles.keywordName, { color: colors.text }]}>
          {item.keyword}
        </Text>
        <View style={[
          styles.statusDot,
          { backgroundColor: item.isActive ? '#4CAF50' : '#9E9E9E' }
        ]} />
      </View>

      <View style={styles.keywordStats}>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {item.mentions}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Mentions
          </Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: getSentimentColor(item.sentiment > 0.6 ? 'positive' : item.sentiment > 0.4 ? 'neutral' : 'negative') }]}>
            {Math.round(item.sentiment * 100)}%
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Sentiment
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.keywordAction, { borderColor: colors.success }]}
        onPress={() => Alert.alert('Keyword Details', `View all mentions for "${item.keyword}"`)}
      >
        <Text style={[styles.keywordActionText, { color: colors.success }]}>
          View Details
        </Text>
      </TouchableOpacity>
    </View>
  );

  const getCurrentPrompt = () => {
    const faithPrompts = [
      "👂 Listen to how God is using your ministry online",
      "✨ Monitor Kingdom conversations and join them",
      "🙏 Track mentions to respond with love and wisdom",
      "💝 Discover opportunities to bless others",
    ];

    const encouragementPrompts = [
      "🔍 Monitor your brand across all platforms",
      "💪 Track conversations and join strategic discussions",
      "🌟 Discover opportunities to engage your audience",
      "🎯 Stay ahead of trends and competitor activity",
    ];

    const prompts = currentMode === 'faith' ? faithPrompts : encouragementPrompts;
    return prompts[Math.floor(Math.random() * prompts.length)];
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          {currentMode === 'faith' ? 'Kingdom Listening' : 'Social Listening'}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {getCurrentPrompt()}
        </Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {(['mentions', 'alerts', 'sentiment', 'keywords'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              selectedTab === tab && [styles.activeTab, { backgroundColor: colors.success }]
            ]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[
              styles.tabIcon,
              selectedTab === tab ? styles.activeTabText : { color: colors.textSecondary }
            ]}>
              {tab === 'mentions' ? '💬' : tab === 'alerts' ? '🚨' : tab === 'sentiment' ? '😊' : '🔍'}
            </Text>
            <Text style={[
              styles.tabLabel,
              selectedTab === tab ? styles.activeTabText : { color: colors.textSecondary }
            ]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sentiment Overview */}
      {selectedTab === 'sentiment' && sentiment && (
        <View style={[styles.sentimentOverview, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Overall Brand Sentiment
          </Text>
          
          <View style={styles.sentimentScore}>
            <Text style={[styles.overallScore, { color: colors.success }]}>
              {Math.round(sentiment.overallScore * 100)}%
            </Text>
            <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>
              Positive Sentiment
            </Text>
            <Text style={[
              styles.trendLabel,
              { color: sentiment.trend === 'improving' ? '#4CAF50' : sentiment.trend === 'declining' ? '#F44336' : '#FF9800' }
            ]}>
              {sentiment.trend === 'improving' ? '↗️ Improving' : sentiment.trend === 'declining' ? '↘️ Declining' : '➡️ Stable'}
            </Text>
          </View>

          <View style={styles.sentimentBreakdown}>
            <View style={styles.sentimentBar}>
              <View style={[styles.sentimentSegment, { flex: sentiment.positive, backgroundColor: '#4CAF50' }]} />
              <View style={[styles.sentimentSegment, { flex: sentiment.neutral, backgroundColor: '#FF9800' }]} />
              <View style={[styles.sentimentSegment, { flex: sentiment.negative, backgroundColor: '#F44336' }]} />
            </View>
            
            <View style={styles.sentimentLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
                <Text style={[styles.legendText, { color: colors.textSecondary }]}>
                  {sentiment.positive}% Positive
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FF9800' }]} />
                <Text style={[styles.legendText, { color: colors.textSecondary }]}>
                  {sentiment.neutral}% Neutral
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#F44336' }]} />
                <Text style={[styles.legendText, { color: colors.textSecondary }]}>
                  {sentiment.negative}% Negative
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Platform Filter for Mentions */}
      {selectedTab === 'mentions' && (
        <ScrollView 
          horizontal 
          style={styles.platformFilter}
          showsHorizontalScrollIndicator={false}
        >
          {['all', 'instagram', 'twitter', 'facebook', 'youtube', 'tiktok', 'linkedin'].map((platform) => (
            <TouchableOpacity
              key={platform}
              style={[
                styles.platformButton,
                selectedPlatform === platform && [styles.activePlatform, { backgroundColor: colors.accent }],
                { borderColor: colors.border }
              ]}
              onPress={() => setSelectedPlatform(platform)}
            >
              <Text style={[
                styles.platformButtonText,
                selectedPlatform === platform ? styles.activePlatformText : { color: colors.textSecondary }
              ]}>
                {platform === 'all' ? 'All' : getPlatformIcon(platform) + ' ' + platform.charAt(0).toUpperCase() + platform.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Add Keyword Button */}
      {selectedTab === 'keywords' && (
        <View style={styles.actionBar}>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.accent }]}
            onPress={() => setShowAddKeywordModal(true)}
          >
            <Text style={styles.addButtonText}>+ Add Keyword</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Content */}
      {selectedTab === 'mentions' && (
        <FlatList<SocialMention>
          data={getFilteredMentions()}
          keyExtractor={(item) => item.id}
          renderItem={renderMention}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                No mentions found
              </Text>
            </View>
          }
        />
      )}
      
      {selectedTab === 'alerts' && (
        <FlatList<BrandAlert>
          data={alerts}
          keyExtractor={(item) => item.id}
          renderItem={renderAlert}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                No alerts at this time
              </Text>
            </View>
          }
        />
      )}
      
      {selectedTab === 'keywords' && (
        <FlatList<MonitoringKeyword>
          data={keywords}
          keyExtractor={(item) => item.id}
          renderItem={renderKeyword}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                No keywords being monitored
              </Text>
            </View>
          }
        />
      )}

      {/* Add Keyword Modal */}
      <Modal
        visible={showAddKeywordModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddKeywordModal(false)}>
              <Text style={[styles.cancelText, { color: colors.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Add Keyword
            </Text>
            <TouchableOpacity onPress={addKeyword}>
              <Text style={[styles.saveText, { color: colors.accent }]}>
                Add
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={[styles.fieldLabel, { color: colors.text }]}>
              Keyword to Monitor
            </Text>
            <TextInput
              style={[styles.textInput, { 
                backgroundColor: colors.surface,
                color: colors.text,
                borderColor: colors.border,
              }]}
              value={newKeyword}
              onChangeText={setNewKeyword}
              placeholder={currentMode === 'faith' ? 
                "Kingdom business" : 
                "Your brand name"
              }
              placeholderTextColor={colors.textSecondary}
              autoFocus
            />

            <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.infoTitle, { color: colors.text }]}>
                💡 Monitoring Tips
              </Text>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                • Add your brand name and variations{'\n'}
                • Monitor industry keywords and hashtags{'\n'}
                • Track competitor mentions{'\n'}
                • Include common misspellings{'\n'}
                • Monitor campaign-specific terms
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 20,
    marginHorizontal: 2,
  },
  activeTab: {
    // backgroundColor applied dynamically
  },
  tabIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
  sentimentOverview: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sentimentScore: {
    alignItems: 'center',
    marginBottom: 20,
  },
  overallScore: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  trendLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  sentimentBreakdown: {
    // marginTop: 20,
  },
  sentimentBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  sentimentSegment: {
    height: '100%',
  },
  sentimentLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
  },
  platformFilter: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  platformButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  activePlatform: {
    borderColor: 'transparent',
  },
  platformButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activePlatformText: {
    color: '#fff',
  },
  actionBar: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  addButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  mentionCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mentionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  platformInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  platformIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  influencerBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  influencerText: {
    fontSize: 10,
    color: '#fff',
  },
  sentimentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sentimentText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  mentionContent: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  mentionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  engagement: {
    fontSize: 12,
  },
  timestamp: {
    fontSize: 12,
  },
  keywordTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  keywordTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  keywordTagText: {
    fontSize: 10,
    fontWeight: '600',
  },
  viewButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  alertCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  priorityText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  alertDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  alertTime: {
    fontSize: 12,
  },
  keywordCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  keywordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  keywordName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  keywordStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  keywordAction: {
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  keywordActionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
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
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelText: {
    fontSize: 16,
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default React.memo(SocialListeningScreen);

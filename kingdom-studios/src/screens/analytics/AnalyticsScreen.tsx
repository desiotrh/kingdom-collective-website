import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { KingdomColors } from '../../constants/KingdomColors';
import { useAuth } from '../../contexts/AuthContext';
import { useFaithMode } from '../../contexts/FaithModeContext';
import apiService from '../../services/apiService';
import firebaseService from '../../services/firebaseService';

const { width } = Dimensions.get('window');

interface AnalyticsPeriod {
  label: string;
  value: string;
}

interface MetricCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
}

interface PostAnalytics {
  id: string;
  title: string;
  platform: string;
  engagement: number;
  reach: number;
  date: string;
  type: 'reel' | 'post' | 'story';
}

interface Recommendation {
  id: string;
  type: 'timing' | 'content' | 'hashtag' | 'audience';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

export default function AnalyticsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'products' | 'recommendations'>('overview');
  const [overviewMetrics, setOverviewMetrics] = useState<MetricCard[]>([]);
  const [productMetrics, setProductMetrics] = useState<MetricCard[]>([]);
  const [topPosts, setTopPosts] = useState<PostAnalytics[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { faithMode } = useFaithMode();

  const periods: AnalyticsPeriod[] = [
    { label: '7 Days', value: 'week' },
    { label: '30 Days', value: 'month' },
    { label: '90 Days', value: 'quarter' },
    { label: '1 Year', value: 'year' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return;
      
      setLoading(true);
      try {
        // Use existing API service methods
        const analyticsData = await apiService.getAnalytics('30d');
        
        // Set mock data for demonstration - replace with real data
        setOverviewMetrics([
          { title: 'Total Reach', value: analyticsData?.totalReach || '12.5K', change: '+23%', trend: 'up', icon: '👥' },
          { title: 'Engagement Rate', value: analyticsData?.engagementRate || '4.8%', change: '+15%', trend: 'up', icon: '❤️' },
          { title: 'Revenue', value: analyticsData?.revenue || '$2,340', change: '+42%', trend: 'up', icon: '💰' },
          { title: 'Conversion Rate', value: analyticsData?.conversionRate || '3.2%', change: '-5%', trend: 'down', icon: '🎯' },
        ]);
        
        setProductMetrics([
          { title: 'Top Seller', value: analyticsData?.topProduct || 'Faith T-Shirt', change: '234 sold', trend: 'up', icon: '👕' },
          { title: 'Avg Order Value', value: analyticsData?.avgOrderValue || '$32.50', change: '+18%', trend: 'up', icon: '💳' },
        ]);
        
        setTopPosts(analyticsData?.topPosts || []);
        setAiRecommendations(analyticsData?.recommendations || []);
      } catch (error) {
        console.error('Analytics fetch error:', error);
        Alert.alert('Error', 'Could not fetch analytics data. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedPeriod, user?.uid]);

  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return KingdomColors.accent.success;
      case 'down':
        return KingdomColors.accent.error;
      default:
        return KingdomColors.text.secondary;
    }
  };

  const getImpactColor = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high':
        return KingdomColors.accent.success;
      case 'medium':
        return KingdomColors.accent.warning;
      case 'low':
        return KingdomColors.text.secondary;
      default:
        return KingdomColors.text.secondary;
    }
  };

  const renderMetricCard = (metric: MetricCard, index: number) => (
    <View key={index} style={styles.metricCard}>
      <View style={styles.metricHeader}>
        <Ionicons name={metric.icon as any} size={24} color={KingdomColors.primary.royalPurple} />
        <View style={[styles.trendIndicator, { backgroundColor: getTrendColor(metric.trend) + '20' }]}>
          <Ionicons 
            name={metric.trend === 'up' ? 'trending-up' : metric.trend === 'down' ? 'trending-down' : 'remove'} 
            size={12} 
            color={getTrendColor(metric.trend)} 
          />
        </View>
      </View>
      <Text style={styles.metricValue}>{metric.value}</Text>
      <Text style={styles.metricTitle}>{metric.title}</Text>
      <Text style={[styles.metricChange, { color: getTrendColor(metric.trend) }]}>
        {metric.change} vs last period
      </Text>
    </View>
  );

  const renderPostCard = (post: PostAnalytics) => (
    <View key={post.id} style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.postInfo}>
          <Text style={styles.postTitle}>{post.title}</Text>
          <View style={styles.postMeta}>
            <Text style={styles.postPlatform}>{post.platform}</Text>
            <View style={[styles.typeTag, { backgroundColor: getTypeColor(post.type) }]}>
              <Text style={styles.typeText}>{post.type.toUpperCase()}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.postDate}>{post.date}</Text>
      </View>
      
      <View style={styles.postStats}>
        <View style={styles.statItem}>
          <Ionicons name="eye-outline" size={16} color={KingdomColors.text.secondary} />
          <Text style={styles.statText}>{post.reach.toLocaleString()} reach</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="heart-outline" size={16} color={KingdomColors.text.secondary} />
          <Text style={styles.statText}>{post.engagement.toLocaleString()} engagement</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.engagementRate}>
            {((post.engagement / post.reach) * 100).toFixed(1)}% rate
          </Text>
        </View>
      </View>
    </View>
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'reel':
        return KingdomColors.accent.success + '20';
      case 'post':
        return KingdomColors.accent.info + '20';
      case 'story':
        return KingdomColors.accent.warning + '20';
      default:
        return KingdomColors.text.secondary + '20';
    }
  };

  const renderRecommendationCard = (rec: Recommendation) => (
    <View key={rec.id} style={styles.recommendationCard}>
      <View style={styles.recHeader}>
        <View style={styles.recIcon}>
          <Ionicons 
            name={getRecommendationIcon(rec.type)} 
            size={20} 
            color={KingdomColors.primary.royalPurple} 
          />
        </View>
        <View style={styles.recInfo}>
          <Text style={styles.recTitle}>{rec.title}</Text>
          <Text style={styles.recDescription}>{rec.description}</Text>
        </View>
        <View style={[styles.impactBadge, { backgroundColor: getImpactColor(rec.impact) + '20' }]}>
          <Text style={[styles.impactText, { color: getImpactColor(rec.impact) }]}>
            {rec.impact.toUpperCase()}
          </Text>
        </View>
      </View>
    </View>
  );

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'timing':
        return 'time-outline';
      case 'content':
        return 'create-outline';
      case 'hashtag':
        return 'pricetag-outline';
      case 'audience':
        return 'people-outline';
      default:
        return 'bulb-outline';
    }
  };

  const renderOverviewTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Content Performance</Text>
      <View style={styles.metricsGrid}>
        {overviewMetrics.map(renderMetricCard)}
      </View>
      
      <Text style={styles.sectionTitle}>Top Performing Content</Text>
      {topPosts.map(renderPostCard)}
    </ScrollView>
  );

  const renderProductsTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Product Analytics</Text>
      <View style={styles.metricsGrid}>
        {productMetrics.map(renderMetricCard)}
      </View>
      
      <View style={styles.insightCard}>
        <Ionicons name="bulb-outline" size={24} color={KingdomColors.gold.bright} />
        <Text style={styles.insightTitle}>Kingdom Impact Insight</Text>
        <Text style={styles.insightText}>
          Your faith-based products are performing 40% better than average. 
          Consider expanding your Kingdom-themed product line.
        </Text>
      </View>
    </ScrollView>
  );

  const renderRecommendationsTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.recommendationsHeader}>
        <Text style={styles.sectionTitle}>AI Recommendations</Text>
        <View style={styles.aiTag}>
          <Ionicons name="sparkles" size={16} color={KingdomColors.gold.bright} />
          <Text style={styles.aiText}>Powered by Kingdom AI</Text>
        </View>
      </View>
      
      <Text style={styles.recommendationsSubtitle}>
        Insights to grow your Kingdom impact and reach more souls
      </Text>
      
      {aiRecommendations.map(renderRecommendationCard)}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.periodSelector}
        >
          {periods.map((period) => (
            <TouchableOpacity
              key={period.value}
              style={[
                styles.periodButton,
                selectedPeriod === period.value && styles.selectedPeriodButton,
              ]}
              onPress={() => setSelectedPeriod(period.value)}
            >
              <Text
                style={[
                  styles.periodText,
                  selectedPeriod === period.value && styles.selectedPeriodText,
                ]}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Ionicons 
            name="analytics-outline" 
            size={18} 
            color={activeTab === 'overview' ? KingdomColors.primary.royalPurple : KingdomColors.text.secondary} 
          />
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
            Overview
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
          onPress={() => setActiveTab('posts')}
        >
          <Ionicons 
            name="document-text-outline" 
            size={18} 
            color={activeTab === 'posts' ? KingdomColors.primary.royalPurple : KingdomColors.text.secondary} 
          />
          <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>
            Posts
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'products' && styles.activeTab]}
          onPress={() => setActiveTab('products')}
        >
          <Ionicons 
            name="storefront-outline" 
            size={18} 
            color={activeTab === 'products' ? KingdomColors.primary.royalPurple : KingdomColors.text.secondary} 
          />
          <Text style={[styles.tabText, activeTab === 'products' && styles.activeTabText]}>
            Products
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'recommendations' && styles.activeTab]}
          onPress={() => setActiveTab('recommendations')}
        >
          <Ionicons 
            name="sparkles-outline" 
            size={18} 
            color={activeTab === 'recommendations' ? KingdomColors.primary.royalPurple : KingdomColors.text.secondary} 
          />
          <Text style={[styles.tabText, activeTab === 'recommendations' && styles.activeTabText]}>
            AI Tips
          </Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={KingdomColors.primary.royalPurple} />
          <Text style={styles.loadingText}>Loading analytics data...</Text>
        </View>
      ) : (
        <>
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'posts' && renderOverviewTab()}
          {activeTab === 'products' && renderProductsTab()}
          {activeTab === 'recommendations' && renderRecommendationsTab()}
        </>
      )}
    </SafeAreaView>
  );
}

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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: KingdomColors.default.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
  },
  periodSelector: {
    maxWidth: width * 0.6,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: KingdomColors.default.border,
  },
  selectedPeriodButton: {
    backgroundColor: KingdomColors.primary.royalPurple,
    borderColor: KingdomColors.primary.royalPurple,
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500',
    color: KingdomColors.text.secondary,
  },
  selectedPeriodText: {
    color: KingdomColors.background.primary,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: KingdomColors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: KingdomColors.default.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 4,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: KingdomColors.primary.royalPurple,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: KingdomColors.text.secondary,
  },
  activeTabText: {
    color: KingdomColors.primary.royalPurple,
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 32,
  },
  metricCard: {
    backgroundColor: KingdomColors.background.secondary,
    borderRadius: 12,
    padding: 16,
    width: '48%',
    borderWidth: 1,
    borderColor: KingdomColors.default.border,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  trendIndicator: {
    borderRadius: 12,
    padding: 4,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 4,
  },
  metricTitle: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    marginBottom: 4,
  },
  metricChange: {
    fontSize: 12,
    fontWeight: '500',
  },
  postCard: {
    backgroundColor: KingdomColors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: KingdomColors.default.border,
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
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  postPlatform: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
  },
  typeTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
  },
  postDate: {
    fontSize: 12,
    color: KingdomColors.text.muted,
  },
  postStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: KingdomColors.text.secondary,
  },
  engagementRate: {
    fontSize: 12,
    fontWeight: 'bold',
    color: KingdomColors.primary.royalPurple,
  },
  insightCard: {
    backgroundColor: KingdomColors.gold.bright + '10',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: KingdomColors.gold.bright + '30',
    alignItems: 'center',
    textAlign: 'center',
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginVertical: 8,
  },
  insightText: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  recommendationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: KingdomColors.gold.bright + '20',
    borderRadius: 12,
  },
  aiText: {
    fontSize: 12,
    fontWeight: '500',
    color: KingdomColors.gold.bright,
  },
  recommendationsSubtitle: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    marginBottom: 24,
    lineHeight: 20,
  },
  recommendationCard: {
    backgroundColor: KingdomColors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: KingdomColors.default.border,
  },
  recHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  recIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: KingdomColors.primary.royalPurple + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recInfo: {
    flex: 1,
  },
  recTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 4,
  },
  recDescription: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    lineHeight: 20,
  },
  impactBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  impactText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: KingdomColors.text.primary,
  },
});

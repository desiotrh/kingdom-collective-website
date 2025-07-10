import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { AnalyticsTracker } from './AnalyticsTracker';

export interface AnalyticsTimeframe {
  start: Date;
  end: Date;
}

export interface ContentMetrics {
  totalPosts: number;
  aiGeneratedPosts: number;
  manualPosts: number;
  averageEngagement: number;
  topPerformingContent: ContentPerformance[];
}

export interface ContentPerformance {
  id: string;
  content: string;
  platform: string;
  engagement: number;
  reach: number;
  createdAt: Date;
}

export interface SocialMediaMetrics {
  totalPlatforms: number;
  activePlatforms: number;
  totalPosts: number;
  scheduledPosts: number;
  platformBreakdown: PlatformMetrics[];
  engagementTrends: EngagementTrend[];
}

export interface PlatformMetrics {
  platform: string;
  posts: number;
  engagement: number;
  reach: number;
  followers: number;
  growth: number;
}

export interface EngagementTrend {
  date: Date;
  engagement: number;
  reach: number;
  platform: string;
}

export interface EmailMetrics {
  totalSubscribers: number;
  activeSubscribers: number;
  totalCampaigns: number;
  averageOpenRate: number;
  averageClickRate: number;
  subscriptionTrends: SubscriptionTrend[];
  campaignPerformance: CampaignPerformance[];
}

export interface SubscriptionTrend {
  date: Date;
  subscriptions: number;
  unsubscriptions: number;
  netGrowth: number;
}

export interface CampaignPerformance {
  id: string;
  name: string;
  sentAt: Date;
  sent: number;
  opened: number;
  clicked: number;
  openRate: number;
  clickRate: number;
}

export interface UserEngagementMetrics {
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  averageSessionDuration: number;
  topFeatures: FeatureUsage[];
  userRetention: RetentionMetrics;
}

export interface FeatureUsage {
  feature: string;
  usage: number;
  growth: number;
}

export interface RetentionMetrics {
  day1: number;
  day7: number;
  day30: number;
}

export interface RevenueMetrics {
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  averageRevenuePerUser: number;
  conversionRate: number;
  tierDistribution: TierDistribution[];
  revenueGrowth: RevenueGrowth[];
}

export interface TierDistribution {
  tier: string;
  users: number;
  revenue: number;
  percentage: number;
}

export interface RevenueGrowth {
  date: Date;
  revenue: number;
  users: number;
}

export interface AdvancedAnalyticsDashboard {
  timeframe: AnalyticsTimeframe;
  contentMetrics: ContentMetrics;
  socialMediaMetrics: SocialMediaMetrics;
  emailMetrics: EmailMetrics;
  userEngagementMetrics: UserEngagementMetrics;
  revenueMetrics: RevenueMetrics;
  insights: AnalyticsInsight[];
  recommendations: AnalyticsRecommendation[];
}

export interface AnalyticsInsight {
  type: 'positive' | 'negative' | 'neutral';
  title: string;
  description: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
}

export interface AnalyticsRecommendation {
  priority: 'high' | 'medium' | 'low';
  category: 'content' | 'social' | 'email' | 'revenue' | 'engagement';
  title: string;
  description: string;
  actionItems: string[];
  expectedImpact: string;
}

export interface AnalyticsExport {
  format: 'pdf' | 'csv' | 'excel';
  data: AdvancedAnalyticsDashboard;
  generatedAt: Date;
  userId: string;
}

class AdvancedAnalyticsService {
  private userId: string | null = null;
  private analyticsTracker: AnalyticsTracker;

  constructor() {
    this.analyticsTracker = new AnalyticsTracker();
    this.initializeUser();
  }

  private async initializeUser(): Promise<void> {
    const user = auth().currentUser;
    if (user) {
      this.userId = user.uid;
    }
  }

  private ensureUser(): string {
    if (!this.userId) {
      throw new Error('User not authenticated');
    }
    return this.userId;
  }

  // Main Dashboard Data
  async getDashboardData(timeframe: AnalyticsTimeframe): Promise<AdvancedAnalyticsDashboard> {
    try {
      const userId = this.ensureUser();

      const [
        contentMetrics,
        socialMediaMetrics,
        emailMetrics,
        userEngagementMetrics,
        revenueMetrics
      ] = await Promise.all([
        this.getContentMetrics(userId, timeframe),
        this.getSocialMediaMetrics(userId, timeframe),
        this.getEmailMetrics(userId, timeframe),
        this.getUserEngagementMetrics(userId, timeframe),
        this.getRevenueMetrics(userId, timeframe)
      ]);

      const insights = this.generateInsights({
        contentMetrics,
        socialMediaMetrics,
        emailMetrics,
        userEngagementMetrics,
        revenueMetrics
      });

      const recommendations = this.generateRecommendations({
        contentMetrics,
        socialMediaMetrics,
        emailMetrics,
        userEngagementMetrics,
        revenueMetrics
      });

      const dashboard: AdvancedAnalyticsDashboard = {
        timeframe,
        contentMetrics,
        socialMediaMetrics,
        emailMetrics,
        userEngagementMetrics,
        revenueMetrics,
        insights,
        recommendations
      };

      // Track analytics dashboard view
      this.analyticsTracker.trackAnalyticsDashboardView(timeframe);

      return dashboard;
    } catch (error) {
      console.error('Error getting dashboard data:', error);
      throw error;
    }
  }

  // Content Metrics
  private async getContentMetrics(userId: string, timeframe: AnalyticsTimeframe): Promise<ContentMetrics> {
    try {
      const contentQuery = firestore()
        .collection('users')
        .doc(userId)
        .collection('content')
        .where('createdAt', '>=', timeframe.start)
        .where('createdAt', '<=', timeframe.end);

      const contentSnapshot = await contentQuery.get();
      const contents = contentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const totalPosts = contents.length;
      const aiGeneratedPosts = contents.filter(c => c.isAiGenerated).length;
      const manualPosts = totalPosts - aiGeneratedPosts;

      const averageEngagement = contents.reduce((sum, c) => sum + (c.engagement || 0), 0) / totalPosts || 0;

      const topPerformingContent: ContentPerformance[] = contents
        .sort((a, b) => (b.engagement || 0) - (a.engagement || 0))
        .slice(0, 10)
        .map(c => ({
          id: c.id,
          content: c.content || '',
          platform: c.platform || 'unknown',
          engagement: c.engagement || 0,
          reach: c.reach || 0,
          createdAt: c.createdAt?.toDate() || new Date()
        }));

      return {
        totalPosts,
        aiGeneratedPosts,
        manualPosts,
        averageEngagement,
        topPerformingContent
      };
    } catch (error) {
      console.error('Error getting content metrics:', error);
      throw error;
    }
  }

  // Social Media Metrics
  private async getSocialMediaMetrics(userId: string, timeframe: AnalyticsTimeframe): Promise<SocialMediaMetrics> {
    try {
      const platformsQuery = firestore()
        .collection('users')
        .doc(userId)
        .collection('socialPlatforms');

      const postsQuery = firestore()
        .collection('users')
        .doc(userId)
        .collection('socialPosts')
        .where('createdAt', '>=', timeframe.start)
        .where('createdAt', '<=', timeframe.end);

      const [platformsSnapshot, postsSnapshot] = await Promise.all([
        platformsQuery.get(),
        postsQuery.get()
      ]);

      const platforms = platformsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const posts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const totalPlatforms = platforms.length;
      const activePlatforms = platforms.filter(p => p.isConnected).length;
      const totalPosts = posts.length;
      const scheduledPosts = posts.filter(p => p.scheduledFor && new Date(p.scheduledFor.toDate()) > new Date()).length;

      const platformBreakdown: PlatformMetrics[] = platforms.map(platform => {
        const platformPosts = posts.filter(p => p.platform === platform.id);
        const engagement = platformPosts.reduce((sum, p) => sum + (p.engagement || 0), 0);
        const reach = platformPosts.reduce((sum, p) => sum + (p.reach || 0), 0);

        return {
          platform: platform.id,
          posts: platformPosts.length,
          engagement,
          reach,
          followers: platform.followers || 0,
          growth: platform.growth || 0
        };
      });

      const engagementTrends: EngagementTrend[] = this.calculateEngagementTrends(posts, timeframe);

      return {
        totalPlatforms,
        activePlatforms,
        totalPosts,
        scheduledPosts,
        platformBreakdown,
        engagementTrends
      };
    } catch (error) {
      console.error('Error getting social media metrics:', error);
      throw error;
    }
  }

  // Email Metrics
  private async getEmailMetrics(userId: string, timeframe: AnalyticsTimeframe): Promise<EmailMetrics> {
    try {
      const subscribersQuery = firestore()
        .collection('users')
        .doc(userId)
        .collection('emailSubscribers');

      const campaignsQuery = firestore()
        .collection('users')
        .doc(userId)
        .collection('emailCampaigns')
        .where('sentAt', '>=', timeframe.start)
        .where('sentAt', '<=', timeframe.end);

      const [subscribersSnapshot, campaignsSnapshot] = await Promise.all([
        subscribersQuery.get(),
        campaignsQuery.get()
      ]);

      const subscribers = subscribersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const campaigns = campaignsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const totalSubscribers = subscribers.length;
      const activeSubscribers = subscribers.filter(s => s.isActive).length;
      const totalCampaigns = campaigns.length;

      const averageOpenRate = campaigns.reduce((sum, c) => sum + (c.openRate || 0), 0) / totalCampaigns || 0;
      const averageClickRate = campaigns.reduce((sum, c) => sum + (c.clickRate || 0), 0) / totalCampaigns || 0;

      const subscriptionTrends: SubscriptionTrend[] = this.calculateSubscriptionTrends(subscribers, timeframe);
      const campaignPerformance: CampaignPerformance[] = campaigns.map(c => ({
        id: c.id,
        name: c.name || 'Untitled Campaign',
        sentAt: c.sentAt?.toDate() || new Date(),
        sent: c.sent || 0,
        opened: c.opened || 0,
        clicked: c.clicked || 0,
        openRate: c.openRate || 0,
        clickRate: c.clickRate || 0
      }));

      return {
        totalSubscribers,
        activeSubscribers,
        totalCampaigns,
        averageOpenRate,
        averageClickRate,
        subscriptionTrends,
        campaignPerformance
      };
    } catch (error) {
      console.error('Error getting email metrics:', error);
      throw error;
    }
  }

  // User Engagement Metrics
  private async getUserEngagementMetrics(userId: string, timeframe: AnalyticsTimeframe): Promise<UserEngagementMetrics> {
    try {
      const sessionsQuery = firestore()
        .collection('users')
        .doc(userId)
        .collection('sessions')
        .where('timestamp', '>=', timeframe.start)
        .where('timestamp', '<=', timeframe.end);

      const eventsQuery = firestore()
        .collection('users')
        .doc(userId)
        .collection('events')
        .where('timestamp', '>=', timeframe.start)
        .where('timestamp', '<=', timeframe.end);

      const [sessionsSnapshot, eventsSnapshot] = await Promise.all([
        sessionsQuery.get(),
        eventsQuery.get()
      ]);

      const sessions = sessionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const events = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const dailyActiveUsers = this.calculateDailyActiveUsers(sessions);
      const weeklyActiveUsers = this.calculateWeeklyActiveUsers(sessions);
      const monthlyActiveUsers = this.calculateMonthlyActiveUsers(sessions);
      const averageSessionDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / sessions.length || 0;

      const topFeatures: FeatureUsage[] = this.calculateTopFeatures(events);
      const userRetention: RetentionMetrics = this.calculateRetentionMetrics(sessions);

      return {
        dailyActiveUsers,
        weeklyActiveUsers,
        monthlyActiveUsers,
        averageSessionDuration,
        topFeatures,
        userRetention
      };
    } catch (error) {
      console.error('Error getting user engagement metrics:', error);
      throw error;
    }
  }

  // Revenue Metrics
  private async getRevenueMetrics(userId: string, timeframe: AnalyticsTimeframe): Promise<RevenueMetrics> {
    try {
      const subscriptionsQuery = firestore()
        .collection('users')
        .doc(userId)
        .collection('subscriptions')
        .where('createdAt', '>=', timeframe.start)
        .where('createdAt', '<=', timeframe.end);

      const subscriptionsSnapshot = await subscriptionsQuery.get();
      const subscriptions = subscriptionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const totalRevenue = subscriptions.reduce((sum, s) => sum + (s.amount || 0), 0);
      const monthlyRecurringRevenue = subscriptions
        .filter(s => s.isRecurring)
        .reduce((sum, s) => sum + (s.amount || 0), 0);

      const totalUsers = await this.getTotalUsers();
      const averageRevenuePerUser = totalRevenue / totalUsers || 0;

      const conversionRate = this.calculateConversionRate(subscriptions);
      const tierDistribution: TierDistribution[] = this.calculateTierDistribution(subscriptions);
      const revenueGrowth: RevenueGrowth[] = this.calculateRevenueGrowth(subscriptions, timeframe);

      return {
        totalRevenue,
        monthlyRecurringRevenue,
        averageRevenuePerUser,
        conversionRate,
        tierDistribution,
        revenueGrowth
      };
    } catch (error) {
      console.error('Error getting revenue metrics:', error);
      throw error;
    }
  }

  // Helper Methods
  private calculateEngagementTrends(posts: any[], timeframe: AnalyticsTimeframe): EngagementTrend[] {
    // Group posts by date and calculate daily engagement
    const dailyEngagement: { [key: string]: { engagement: number; reach: number; platform: string } } = {};
    
    posts.forEach(post => {
      const date = post.createdAt?.toDate()?.toDateString() || new Date().toDateString();
      if (!dailyEngagement[date]) {
        dailyEngagement[date] = { engagement: 0, reach: 0, platform: post.platform };
      }
      dailyEngagement[date].engagement += post.engagement || 0;
      dailyEngagement[date].reach += post.reach || 0;
    });

    return Object.entries(dailyEngagement).map(([date, data]) => ({
      date: new Date(date),
      engagement: data.engagement,
      reach: data.reach,
      platform: data.platform
    }));
  }

  private calculateSubscriptionTrends(subscribers: any[], timeframe: AnalyticsTimeframe): SubscriptionTrend[] {
    // Group subscribers by date and calculate daily trends
    const dailyTrends: { [key: string]: { subscriptions: number; unsubscriptions: number } } = {};
    
    subscribers.forEach(subscriber => {
      const date = subscriber.createdAt?.toDate()?.toDateString() || new Date().toDateString();
      if (!dailyTrends[date]) {
        dailyTrends[date] = { subscriptions: 0, unsubscriptions: 0 };
      }
      if (subscriber.isActive) {
        dailyTrends[date].subscriptions++;
      } else {
        dailyTrends[date].unsubscriptions++;
      }
    });

    return Object.entries(dailyTrends).map(([date, data]) => ({
      date: new Date(date),
      subscriptions: data.subscriptions,
      unsubscriptions: data.unsubscriptions,
      netGrowth: data.subscriptions - data.unsubscriptions
    }));
  }

  private calculateDailyActiveUsers(sessions: any[]): number {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    return sessions.filter(s => s.timestamp?.toDate() >= yesterday).length;
  }

  private calculateWeeklyActiveUsers(sessions: any[]): number {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return sessions.filter(s => s.timestamp?.toDate() >= weekAgo).length;
  }

  private calculateMonthlyActiveUsers(sessions: any[]): number {
    const today = new Date();
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    return sessions.filter(s => s.timestamp?.toDate() >= monthAgo).length;
  }

  private calculateTopFeatures(events: any[]): FeatureUsage[] {
    const featureUsage: { [key: string]: number } = {};
    
    events.forEach(event => {
      const feature = event.feature || event.action || 'unknown';
      featureUsage[feature] = (featureUsage[feature] || 0) + 1;
    });

    return Object.entries(featureUsage)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([feature, usage]) => ({
        feature,
        usage,
        growth: 0 // Calculate growth compared to previous period
      }));
  }

  private calculateRetentionMetrics(sessions: any[]): RetentionMetrics {
    // Simplified retention calculation
    const totalUsers = new Set(sessions.map(s => s.userId)).size;
    const day1Users = sessions.filter(s => {
      const sessionDate = s.timestamp?.toDate();
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return sessionDate >= oneDayAgo;
    }).length;

    return {
      day1: (day1Users / totalUsers) * 100 || 0,
      day7: 75, // Placeholder
      day30: 50 // Placeholder
    };
  }

  private async getTotalUsers(): Promise<number> {
    try {
      const usersSnapshot = await firestore().collection('users').get();
      return usersSnapshot.size;
    } catch {
      return 1;
    }
  }

  private calculateConversionRate(subscriptions: any[]): number {
    // Simplified conversion rate calculation
    return subscriptions.filter(s => s.isPaid).length / subscriptions.length * 100 || 0;
  }

  private calculateTierDistribution(subscriptions: any[]): TierDistribution[] {
    const tierCounts: { [key: string]: { users: number; revenue: number } } = {};
    
    subscriptions.forEach(sub => {
      const tier = sub.tier || 'free';
      if (!tierCounts[tier]) {
        tierCounts[tier] = { users: 0, revenue: 0 };
      }
      tierCounts[tier].users++;
      tierCounts[tier].revenue += sub.amount || 0;
    });

    const total = subscriptions.length;
    return Object.entries(tierCounts).map(([tier, data]) => ({
      tier,
      users: data.users,
      revenue: data.revenue,
      percentage: (data.users / total) * 100
    }));
  }

  private calculateRevenueGrowth(subscriptions: any[], timeframe: AnalyticsTimeframe): RevenueGrowth[] {
    const dailyRevenue: { [key: string]: { revenue: number; users: number } } = {};
    
    subscriptions.forEach(sub => {
      const date = sub.createdAt?.toDate()?.toDateString() || new Date().toDateString();
      if (!dailyRevenue[date]) {
        dailyRevenue[date] = { revenue: 0, users: 0 };
      }
      dailyRevenue[date].revenue += sub.amount || 0;
      dailyRevenue[date].users++;
    });

    return Object.entries(dailyRevenue).map(([date, data]) => ({
      date: new Date(date),
      revenue: data.revenue,
      users: data.users
    }));
  }

  // Insights Generation
  private generateInsights(metrics: any): AnalyticsInsight[] {
    const insights: AnalyticsInsight[] = [];

    // Content insights
    if (metrics.contentMetrics.aiGeneratedPosts > metrics.contentMetrics.manualPosts) {
      insights.push({
        type: 'positive',
        title: 'AI Content Dominance',
        description: 'AI-generated content makes up the majority of your posts',
        value: `${Math.round((metrics.contentMetrics.aiGeneratedPosts / metrics.contentMetrics.totalPosts) * 100)}%`,
        trend: 'up'
      });
    }

    // Social media insights
    if (metrics.socialMediaMetrics.engagementTrends.length > 0) {
      const avgEngagement = metrics.socialMediaMetrics.engagementTrends.reduce((sum, t) => sum + t.engagement, 0) / metrics.socialMediaMetrics.engagementTrends.length;
      insights.push({
        type: 'neutral',
        title: 'Average Engagement',
        description: 'Your average engagement across all platforms',
        value: avgEngagement.toFixed(1),
        trend: 'stable'
      });
    }

    // Email insights
    if (metrics.emailMetrics.averageOpenRate > 20) {
      insights.push({
        type: 'positive',
        title: 'Strong Email Performance',
        description: 'Your email open rate is above industry average',
        value: `${metrics.emailMetrics.averageOpenRate.toFixed(1)}%`,
        trend: 'up'
      });
    }

    return insights;
  }

  // Recommendations Generation
  private generateRecommendations(metrics: any): AnalyticsRecommendation[] {
    const recommendations: AnalyticsRecommendation[] = [];

    // Content recommendations
    if (metrics.contentMetrics.averageEngagement < 5) {
      recommendations.push({
        priority: 'high',
        category: 'content',
        title: 'Improve Content Engagement',
        description: 'Your content engagement is below optimal levels',
        actionItems: [
          'Use more engaging visual content',
          'Post at optimal times for your audience',
          'Include calls-to-action in your posts',
          'Engage with your audience in comments'
        ],
        expectedImpact: 'Could increase engagement by 40-60%'
      });
    }

    // Social media recommendations
    if (metrics.socialMediaMetrics.activePlatforms < metrics.socialMediaMetrics.totalPlatforms) {
      recommendations.push({
        priority: 'medium',
        category: 'social',
        title: 'Activate More Platforms',
        description: 'You have inactive social media platforms',
        actionItems: [
          'Review and reconnect inactive platforms',
          'Schedule regular content for all platforms',
          'Optimize content for each platform\'s audience'
        ],
        expectedImpact: 'Could increase reach by 20-30%'
      });
    }

    // Email recommendations
    if (metrics.emailMetrics.averageOpenRate < 15) {
      recommendations.push({
        priority: 'high',
        category: 'email',
        title: 'Improve Email Open Rates',
        description: 'Your email open rates need improvement',
        actionItems: [
          'A/B test subject lines',
          'Segment your email list',
          'Send emails at optimal times',
          'Clean your email list regularly'
        ],
        expectedImpact: 'Could increase open rates by 25-40%'
      });
    }

    return recommendations;
  }

  // Export Analytics
  async exportAnalytics(format: 'pdf' | 'csv' | 'excel', timeframe: AnalyticsTimeframe): Promise<AnalyticsExport> {
    try {
      const userId = this.ensureUser();
      const data = await this.getDashboardData(timeframe);

      const exportData: AnalyticsExport = {
        format,
        data,
        generatedAt: new Date(),
        userId
      };

      // Track export
      this.analyticsTracker.trackAnalyticsExport(format, timeframe);

      // Store export record
      await firestore()
        .collection('users')
        .doc(userId)
        .collection('analyticsExports')
        .add({
          format,
          timeframe,
          generatedAt: new Date(),
          status: 'completed'
        });

      return exportData;
    } catch (error) {
      console.error('Error exporting analytics:', error);
      throw error;
    }
  }

  // Real-time Analytics Updates
  async getRealtimeMetrics(): Promise<any> {
    try {
      const userId = this.ensureUser();
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const timeframe: AnalyticsTimeframe = {
        start: today,
        end: now
      };

      return await this.getDashboardData(timeframe);
    } catch (error) {
      console.error('Error getting realtime metrics:', error);
      throw error;
    }
  }
}

export default new AdvancedAnalyticsService();

import { authService } from './authService';

export interface ViralForecast {
  score: number;
  factors: string[];
  predictions: {
    views: number;
    likes: number;
    shares: number;
    comments: number;
    saves: number;
  };
  recommendations: string[];
  confidence: number;
}

export interface ABTest {
  id: string;
  name: string;
  description: string;
  variantA: any;
  variantB: any;
  metrics: string[];
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed' | 'paused';
  results?: ABTestResults;
}

export interface ABTestResults {
  variantA: ABTestVariantResults;
  variantB: ABTestVariantResults;
  winner: 'A' | 'B' | 'tie';
  confidence: number;
  significance: number;
}

export interface ABTestVariantResults {
  views: number;
  engagement: number;
  conversion: number;
  retention: number;
  viralScore: number;
}

export interface AudienceInsights {
  demographics: {
    age: { [key: string]: number };
    gender: { [key: string]: number };
    location: { [key: string]: number };
    language: { [key: string]: number };
  };
  behavior: {
    watchTime: number;
    completionRate: number;
    peakEngagement: number;
    dropOffPoints: number[];
  };
  interests: string[];
  devices: { [key: string]: number };
  platforms: { [key: string]: number };
}

export interface EngagementMetrics {
  views: number;
  likes: number;
  shares: number;
  comments: number;
  saves: number;
  downloads: number;
  clickThroughRate: number;
  averageWatchTime: number;
  completionRate: number;
  peakEngagement: number;
}

export interface ROICalculation {
  contentId: string;
  contentTitle: string;
  revenue: number;
  costs: number;
  roi: number;
  roiPercentage: number;
  revenueSources: {
    donations: number;
    merchandise: number;
    sponsorships: number;
    affiliate: number;
    other: number;
  };
  conversionMetrics: {
    clicks: number;
    conversions: number;
    conversionRate: number;
    averageOrderValue: number;
  };
}

class AnalyticsService {
  private apiBaseUrl: string;

  constructor() {
    this.apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
  }

  /**
   * Track custom event
   */
  trackEvent(eventName: string, properties: any = {}): void {
    try {
      const user = authService.getCurrentUser();
      const eventData = {
        eventName,
        properties,
        userId: user?.uid,
        timestamp: new Date().toISOString(),
        sessionId: this.getSessionId(),
      };

      // Send to analytics endpoint
      fetch(`${this.apiBaseUrl}/analytics/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': user ? `Bearer ${authService.getToken()}` : '',
        },
        body: JSON.stringify(eventData),
      }).catch(error => {
        console.error('Analytics tracking failed:', error);
      });

      // Also log locally for debugging
      console.log('Analytics Event:', eventData);
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  /**
   * Get session ID
   */
  private getSessionId(): string {
    let sessionId = localStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Generate viral forecast for content
   */
  async generateViralForecast(
    contentId: string,
    contentData: {
      title: string;
      description: string;
      duration: number;
      category: string;
      tags: string[];
    }
  ): Promise<ViralForecast> {
    try {
      const user = authService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const response = await fetch(`${this.apiBaseUrl}/analytics/viral-forecast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await authService.getToken()}`,
        },
        body: JSON.stringify({
          contentId,
          contentData,
          userId: user.uid,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate viral forecast');
      }

      const forecast = await response.json();

      this.trackEvent('viral_forecast_generated', {
        contentId,
        score: forecast.score,
        confidence: forecast.confidence,
      });

      return forecast;
    } catch (error) {
      console.error('Viral forecast failed:', error);
      return this.generateMockViralForecast();
    }
  }

  /**
   * Generate mock viral forecast
   */
  private generateMockViralForecast(): ViralForecast {
    const score = Math.floor(Math.random() * 40) + 30; // 30-70
    const confidence = Math.random() * 0.3 + 0.7; // 70-100%

    return {
      score,
      factors: [
        'Engaging hook in first 3 seconds',
        'Clear message and call-to-action',
        'Trending hashtags included',
        'Optimal video length for platform',
        'High-quality visuals and audio',
      ],
      predictions: {
        views: Math.floor(Math.random() * 50000) + 1000,
        likes: Math.floor(Math.random() * 5000) + 100,
        shares: Math.floor(Math.random() * 1000) + 50,
        comments: Math.floor(Math.random() * 500) + 20,
        saves: Math.floor(Math.random() * 200) + 10,
      },
      recommendations: [
        'Add trending background music',
        'Include more text overlays',
        'Optimize for mobile viewing',
        'Use more engaging thumbnail',
        'Post at optimal time (9 AM)',
      ],
      confidence,
    };
  }

  /**
   * Create A/B test
   */
  async createABTest(
    name: string,
    description: string,
    variantA: any,
    variantB: any,
    metrics: string[],
    duration: number = 7
  ): Promise<ABTest> {
    try {
      const user = authService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const response = await fetch(`${this.apiBaseUrl}/analytics/ab-tests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await authService.getToken()}`,
        },
        body: JSON.stringify({
          name,
          description,
          variantA,
          variantB,
          metrics,
          duration,
          userId: user.uid,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create A/B test');
      }

      const abTest = await response.json();

      this.trackEvent('ab_test_created', {
        testId: abTest.id,
        name,
        metrics,
        duration,
      });

      return abTest;
    } catch (error) {
      console.error('A/B test creation failed:', error);
      throw error;
    }
  }

  /**
   * Get A/B test results
   */
  async getABTestResults(testId: string): Promise<ABTestResults> {
    try {
      const user = authService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const response = await fetch(`${this.apiBaseUrl}/analytics/ab-tests/${testId}/results`, {
        headers: {
          'Authorization': `Bearer ${await authService.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get A/B test results');
      }

      const results = await response.json();

      this.trackEvent('ab_test_results_viewed', {
        testId,
        winner: results.winner,
        confidence: results.confidence,
      });

      return results;
    } catch (error) {
      console.error('A/B test results failed:', error);
      return this.generateMockABTestResults();
    }
  }

  /**
   * Generate mock A/B test results
   */
  private generateMockABTestResults(): ABTestResults {
    const variantAResults = {
      views: Math.floor(Math.random() * 10000) + 1000,
      engagement: Math.random() * 0.1 + 0.05, // 5-15%
      conversion: Math.random() * 0.05 + 0.01, // 1-6%
      retention: Math.random() * 0.3 + 0.5, // 50-80%
      viralScore: Math.floor(Math.random() * 40) + 30,
    };

    const variantBResults = {
      views: Math.floor(Math.random() * 10000) + 1000,
      engagement: Math.random() * 0.1 + 0.05,
      conversion: Math.random() * 0.05 + 0.01,
      retention: Math.random() * 0.3 + 0.5,
      viralScore: Math.floor(Math.random() * 40) + 30,
    };

    const winner = variantAResults.viralScore > variantBResults.viralScore ? 'A' : 'B';
    const confidence = Math.random() * 0.3 + 0.7; // 70-100%

    return {
      variantA: variantAResults,
      variantB: variantBResults,
      winner,
      confidence,
      significance: Math.random() * 0.2 + 0.8, // 80-100%
    };
  }

  /**
   * Get audience insights
   */
  async getAudienceInsights(contentId: string): Promise<AudienceInsights> {
    try {
      const user = authService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const response = await fetch(`${this.apiBaseUrl}/analytics/audience-insights/${contentId}`, {
        headers: {
          'Authorization': `Bearer ${await authService.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get audience insights');
      }

      const insights = await response.json();

      this.trackEvent('audience_insights_viewed', {
        contentId,
        demographics: Object.keys(insights.demographics.age).length,
        behavior: insights.behavior.watchTime,
      });

      return insights;
    } catch (error) {
      console.error('Audience insights failed:', error);
      return this.generateMockAudienceInsights();
    }
  }

  /**
   * Generate mock audience insights
   */
  private generateMockAudienceInsights(): AudienceInsights {
    return {
      demographics: {
        age: {
          '18-24': 25,
          '25-34': 35,
          '35-44': 20,
          '45-54': 15,
          '55+': 5,
        },
        gender: {
          'Female': 60,
          'Male': 35,
          'Other': 5,
        },
        location: {
          'United States': 45,
          'Canada': 15,
          'United Kingdom': 12,
          'Australia': 8,
          'Other': 20,
        },
        language: {
          'English': 85,
          'Spanish': 8,
          'French': 4,
          'Other': 3,
        },
      },
      behavior: {
        watchTime: Math.random() * 60 + 30, // 30-90 seconds
        completionRate: Math.random() * 0.4 + 0.4, // 40-80%
        peakEngagement: Math.random() * 0.3 + 0.6, // 60-90%
        dropOffPoints: [10, 25, 45, 60],
      },
      interests: [
        'Faith & Spirituality',
        'Christian Content',
        'Inspiration',
        'Motivation',
        'Community',
      ],
      devices: {
        'Mobile': 75,
        'Desktop': 20,
        'Tablet': 5,
      },
      platforms: {
        'Instagram': 40,
        'TikTok': 30,
        'YouTube': 20,
        'Facebook': 10,
      },
    };
  }

  /**
   * Get engagement metrics
   */
  async getEngagementMetrics(contentId: string): Promise<EngagementMetrics> {
    try {
      const user = authService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const response = await fetch(`${this.apiBaseUrl}/analytics/engagement/${contentId}`, {
        headers: {
          'Authorization': `Bearer ${await authService.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get engagement metrics');
      }

      const metrics = await response.json();

      this.trackEvent('engagement_metrics_viewed', {
        contentId,
        views: metrics.views,
        engagement: metrics.likes + metrics.shares + metrics.comments,
      });

      return metrics;
    } catch (error) {
      console.error('Engagement metrics failed:', error);
      return this.generateMockEngagementMetrics();
    }
  }

  /**
   * Generate mock engagement metrics
   */
  private generateMockEngagementMetrics(): EngagementMetrics {
    const views = Math.floor(Math.random() * 50000) + 1000;
    const likes = Math.floor(views * (Math.random() * 0.1 + 0.05)); // 5-15% of views
    const shares = Math.floor(views * (Math.random() * 0.05 + 0.02)); // 2-7% of views
    const comments = Math.floor(views * (Math.random() * 0.03 + 0.01)); // 1-4% of views
    const saves = Math.floor(views * (Math.random() * 0.02 + 0.005)); // 0.5-2.5% of views

    return {
      views,
      likes,
      shares,
      comments,
      saves,
      downloads: Math.floor(views * 0.01), // 1% of views
      clickThroughRate: Math.random() * 0.05 + 0.02, // 2-7%
      averageWatchTime: Math.random() * 60 + 30, // 30-90 seconds
      completionRate: Math.random() * 0.4 + 0.4, // 40-80%
      peakEngagement: Math.random() * 0.3 + 0.6, // 60-90%
    };
  }

  /**
   * Calculate ROI for content
   */
  async calculateROI(contentId: string): Promise<ROICalculation> {
    try {
      const user = authService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const response = await fetch(`${this.apiBaseUrl}/analytics/roi/${contentId}`, {
        headers: {
          'Authorization': `Bearer ${await authService.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to calculate ROI');
      }

      const roi = await response.json();

      this.trackEvent('roi_calculated', {
        contentId,
        roi: roi.roi,
        roiPercentage: roi.roiPercentage,
      });

      return roi;
    } catch (error) {
      console.error('ROI calculation failed:', error);
      return this.generateMockROICalculation();
    }
  }

  /**
   * Generate mock ROI calculation
   */
  private generateMockROICalculation(): ROICalculation {
    const revenue = Math.random() * 1000 + 100; // $100-$1100
    const costs = Math.random() * 200 + 50; // $50-$250
    const roi = revenue - costs;
    const roiPercentage = (roi / costs) * 100;

    return {
      contentId: 'content_123',
      contentTitle: 'Sample Content',
      revenue,
      costs,
      roi,
      roiPercentage,
      revenueSources: {
        donations: revenue * 0.4,
        merchandise: revenue * 0.3,
        sponsorships: revenue * 0.2,
        affiliate: revenue * 0.08,
        other: revenue * 0.02,
      },
      conversionMetrics: {
        clicks: Math.floor(Math.random() * 1000) + 100,
        conversions: Math.floor(Math.random() * 100) + 10,
        conversionRate: Math.random() * 0.1 + 0.05, // 5-15%
        averageOrderValue: Math.random() * 50 + 25, // $25-$75
      },
    };
  }

  /**
   * Get content performance comparison
   */
  async getContentPerformanceComparison(contentIds: string[]): Promise<any[]> {
    try {
      const user = authService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const response = await fetch(`${this.apiBaseUrl}/analytics/content-comparison`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await authService.getToken()}`,
        },
        body: JSON.stringify({
          contentIds,
          userId: user.uid,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get content performance comparison');
      }

      const comparison = await response.json();

      this.trackEvent('content_performance_comparison', {
        contentIds,
        comparisonCount: comparison.length,
      });

      return comparison;
    } catch (error) {
      console.error('Content performance comparison failed:', error);
      return this.generateMockContentComparison(contentIds);
    }
  }

  /**
   * Generate mock content comparison
   */
  private generateMockContentComparison(contentIds: string[]): any[] {
    return contentIds.map((id, index) => ({
      contentId: id,
      title: `Content ${index + 1}`,
      views: Math.floor(Math.random() * 50000) + 1000,
      engagement: Math.random() * 0.2 + 0.05, // 5-25%
      viralScore: Math.floor(Math.random() * 40) + 30,
      revenue: Math.random() * 1000 + 100,
      roi: Math.random() * 500 + 50,
    }));
  }

  /**
   * Get trending topics
   */
  async getTrendingTopics(category?: string): Promise<{
    topics: string[];
    hashtags: string[];
    keywords: string[];
  }> {
    try {
      const user = authService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const params = category ? `?category=${category}` : '';
      const response = await fetch(`${this.apiBaseUrl}/analytics/trending-topics${params}`, {
        headers: {
          'Authorization': `Bearer ${await authService.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get trending topics');
      }

      const topics = await response.json();

      this.trackEvent('trending_topics_viewed', {
        category,
        topicCount: topics.topics.length,
      });

      return topics;
    } catch (error) {
      console.error('Trending topics failed:', error);
      return this.generateMockTrendingTopics();
    }
  }

  /**
   * Generate mock trending topics
   */
  private generateMockTrendingTopics(): {
    topics: string[];
    hashtags: string[];
    keywords: string[];
  } {
    return {
      topics: [
        'Faith in difficult times',
        'Christian community building',
        'Worship music trends',
        'Biblical wisdom for daily life',
        'Prayer and meditation',
      ],
      hashtags: [
        '#FaithOverFear',
        '#ChristianCommunity',
        '#WorshipWednesday',
        '#BiblicalWisdom',
        '#PrayerLife',
      ],
      keywords: [
        'faith',
        'encouragement',
        'worship',
        'prayer',
        'community',
        'biblical',
        'christian',
        'inspiration',
      ],
    };
  }
}

export const analyticsService = new AnalyticsService();

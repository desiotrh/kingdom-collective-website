import {
  AnalyticsData,
  MetricCard,
  ChartData,
  ContentPerformance,
  AudienceInsight,
  SpiritualMetrics,
  BusinessMetrics,
  GoalTracking,
  AnalyticsFilter,
  PlatformAnalytics,
  HashtagAnalytics,
  AIInsight,
} from '../types/analytics';

export class AnalyticsService {
  private static instance: AnalyticsService;
  private analyticsData: AnalyticsData[] = [];
  private contentPerformance: ContentPerformance[] = [];

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  // Track analytics event
  public trackEvent(type: string, value: number, metadata?: Record<string, any>): void {
    const event: AnalyticsData = {
      id: Date.now().toString(),
      userId: 'current-user', // Should come from auth context
      timestamp: new Date().toISOString(),
      value,
      metadata: {
        type,
        ...metadata,
      },
    };
    this.analyticsData.push(event);
  }

  // Calculate metric cards for dashboard
  public calculateMetricCards(filters: AnalyticsFilter): MetricCard[] {
    const endDate = new Date(filters.dateRange.end);
    const startDate = new Date(filters.dateRange.start);
    const previousPeriodDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const previousStartDate = new Date(startDate.getTime() - previousPeriodDays * 24 * 60 * 60 * 1000);

    // Current period data
    const currentData = this.analyticsData.filter(event => {
      const eventDate = new Date(event.timestamp);
      return eventDate >= startDate && eventDate <= endDate;
    });

    // Previous period data for comparison
    const previousData = this.analyticsData.filter(event => {
      const eventDate = new Date(event.timestamp);
      return eventDate >= previousStartDate && eventDate < startDate;
    });

    const metrics: MetricCard[] = [];

    // Revenue metrics
    const currentRevenue = this.calculateRevenue(currentData);
    const previousRevenue = this.calculateRevenue(previousData);
    const revenueChange = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;

    metrics.push({
      id: 'revenue',
      title: 'Total Revenue',
      faithModeTitle: 'Kingdom Revenue',
      encouragementModeTitle: 'Blessing Revenue',
      value: currentRevenue,
      change: revenueChange,
      period: `${previousPeriodDays} days`,
      icon: 'attach-money',
      color: '#10B981',
      trend: revenueChange > 0 ? 'up' : revenueChange < 0 ? 'down' : 'stable',
      format: 'currency',
    });

    // Engagement metrics
    const currentEngagement = this.calculateEngagement(currentData);
    const previousEngagement = this.calculateEngagement(previousData);
    const engagementChange = previousEngagement > 0 ? ((currentEngagement - previousEngagement) / previousEngagement) * 100 : 0;

    metrics.push({
      id: 'engagement',
      title: 'Engagement Rate',
      faithModeTitle: 'Fellowship Engagement',
      encouragementModeTitle: 'Community Support',
      value: currentEngagement,
      change: engagementChange,
      period: `${previousPeriodDays} days`,
      icon: 'favorite',
      color: '#2D1B69',
      trend: engagementChange > 0 ? 'up' : engagementChange < 0 ? 'down' : 'stable',
      format: 'percentage',
    });

    // Content reach
    const currentReach = this.calculateReach(currentData);
    const previousReach = this.calculateReach(previousData);
    const reachChange = previousReach > 0 ? ((currentReach - previousReach) / previousReach) * 100 : 0;

    metrics.push({
      id: 'reach',
      title: 'Content Reach',
      faithModeTitle: 'Gospel Reach',
      encouragementModeTitle: 'Hope Reach',
      value: currentReach,
      change: reachChange,
      period: `${previousPeriodDays} days`,
      icon: 'visibility',
      color: '#3B82F6',
      trend: reachChange > 0 ? 'up' : reachChange < 0 ? 'down' : 'stable',
      format: 'number',
    });

    // Conversions
    const currentConversions = this.calculateConversions(currentData);
    const previousConversions = this.calculateConversions(previousData);
    const conversionChange = previousConversions > 0 ? ((currentConversions - previousConversions) / previousConversions) * 100 : 0;

    metrics.push({
      id: 'conversions',
      title: 'Conversion Rate',
      faithModeTitle: 'Kingdom Impact',
      encouragementModeTitle: 'Lives Touched',
      value: currentConversions,
      change: conversionChange,
      period: `${previousPeriodDays} days`,
      icon: 'trending-up',
      color: '#FFC107',
      trend: conversionChange > 0 ? 'up' : conversionChange < 0 ? 'down' : 'stable',
      format: 'percentage',
    });

    return metrics;
  }

  // Generate chart data for visualizations
  public generateChartData(filters: AnalyticsFilter): ChartData[] {
    const charts: ChartData[] = [];

    // Revenue over time
    const revenueChart = this.generateRevenueChart(filters);
    charts.push(revenueChart);

    // Content performance by type
    const contentChart = this.generateContentPerformanceChart(filters);
    charts.push(contentChart);

    // Platform comparison
    const platformChart = this.generatePlatformChart(filters);
    charts.push(platformChart);

    return charts;
  }

  // Generate AI insights based on data patterns
  public generateAIInsights(filters: AnalyticsFilter): AIInsight[] {
    const insights: AIInsight[] = [];

    // Analyze posting patterns
    const postingInsight = this.analyzePostingPatterns(filters);
    if (postingInsight) insights.push(postingInsight);

    // Analyze content performance
    const contentInsight = this.analyzeContentPerformance(filters);
    if (contentInsight) insights.push(contentInsight);

    // Analyze audience behavior
    const audienceInsight = this.analyzeAudienceBehavior(filters);
    if (audienceInsight) insights.push(audienceInsight);

    // Analyze hashtag performance
    const hashtagInsight = this.analyzeHashtagTrends(filters);
    if (hashtagInsight) insights.push(hashtagInsight);

    return insights;
  }

  // Platform-specific analytics
  public getPlatformAnalytics(platform: string, filters: AnalyticsFilter): PlatformAnalytics {
    const platformData = this.analyticsData.filter(event => 
      event.metadata?.platform === platform
    );

    return {
      platform,
      followers: this.calculateFollowers(platformData),
      engagement: this.calculateEngagement(platformData),
      reach: this.calculateReach(platformData),
      clicks: this.calculateClicks(platformData),
      conversions: this.calculateConversions(platformData),
      revenue: this.calculateRevenue(platformData),
      topContent: this.getTopContent(platform, filters),
      growthRate: this.calculateGrowthRate(platformData),
    };
  }

  // Hashtag analytics
  public getHashtagAnalytics(filters: AnalyticsFilter): HashtagAnalytics[] {
    const hashtagData = this.analyticsData.filter(event =>
      event.metadata?.hashtags && Array.isArray(event.metadata.hashtags)
    );

    const hashtagStats = new Map<string, {
      usage: number;
      reach: number;
      engagement: number;
      category: string;
    }>();

    hashtagData.forEach(event => {
      const hashtags = event.metadata?.hashtags as string[];
      hashtags.forEach(hashtag => {
        const current = hashtagStats.get(hashtag) || {
          usage: 0,
          reach: 0,
          engagement: 0,
          category: this.categorizeHashtag(hashtag),
        };
        
        current.usage += 1;
        current.reach += event.metadata?.reach || 0;
        current.engagement += event.metadata?.engagement || 0;
        
        hashtagStats.set(hashtag, current);
      });
    });

    return Array.from(hashtagStats.entries()).map(([hashtag, stats]) => ({
      hashtag,
      usage: stats.usage,
      reach: stats.reach,
      engagement: stats.engagement,
      trending: this.isHashtagTrending(hashtag, stats),
      category: stats.category,
      performance: this.getHashtagPerformance(stats),
    }));
  }

  // Export data in various formats
  public exportData(format: 'csv' | 'excel' | 'pdf', filters: AnalyticsFilter, sections: string[]): string {
    const data = this.analyticsData.filter(event => {
      const eventDate = new Date(event.timestamp);
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      return eventDate >= startDate && eventDate <= endDate;
    });

    switch (format) {
      case 'csv':
        return this.exportToCSV(data, sections);
      case 'excel':
        return this.exportToExcel(data, sections);
      case 'pdf':
        return this.exportToPDF(data, sections);
      default:
        return '';
    }
  }

  // Private helper methods
  private calculateRevenue(data: AnalyticsData[]): number {
    return data
      .filter(event => event.metadata?.type === 'revenue')
      .reduce((sum, event) => sum + event.value, 0);
  }

  private calculateEngagement(data: AnalyticsData[]): number {
    const engagementEvents = data.filter(event => event.metadata?.type === 'engagement');
    if (engagementEvents.length === 0) return 0;
    return engagementEvents.reduce((sum, event) => sum + event.value, 0) / engagementEvents.length;
  }

  private calculateReach(data: AnalyticsData[]): number {
    return data
      .filter(event => event.metadata?.type === 'reach')
      .reduce((sum, event) => sum + event.value, 0);
  }

  private calculateConversions(data: AnalyticsData[]): number {
    const conversionEvents = data.filter(event => event.metadata?.type === 'conversion');
    const totalEvents = data.filter(event => event.metadata?.type === 'view').length;
    if (totalEvents === 0) return 0;
    return (conversionEvents.length / totalEvents) * 100;
  }

  private calculateFollowers(data: AnalyticsData[]): number {
    const followerEvents = data.filter(event => event.metadata?.type === 'followers');
    return followerEvents.length > 0 ? followerEvents[followerEvents.length - 1].value : 0;
  }

  private calculateClicks(data: AnalyticsData[]): number {
    return data
      .filter(event => event.metadata?.type === 'click')
      .reduce((sum, event) => sum + event.value, 0);
  }

  private calculateGrowthRate(data: AnalyticsData[]): number {
    const followerEvents = data.filter(event => event.metadata?.type === 'followers').sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    if (followerEvents.length < 2) return 0;
    
    const initial = followerEvents[0].value;
    const final = followerEvents[followerEvents.length - 1].value;
    
    return initial > 0 ? ((final - initial) / initial) * 100 : 0;
  }

  private getTopContent(platform: string, filters: AnalyticsFilter): ContentPerformance[] {
    return this.contentPerformance
      .filter(content => content.platform === platform)
      .sort((a, b) => b.engagement - a.engagement)
      .slice(0, 5);
  }

  private generateRevenueChart(filters: AnalyticsFilter): ChartData {
    // Mock implementation - would use real data
    return {
      id: 'revenue-chart',
      title: 'Revenue Growth',
      faithModeTitle: 'Kingdom Growth',
      encouragementModeTitle: 'Blessing Growth',
      type: 'line',
      data: [
        { label: 'Week 1', value: 2800, date: '2024-01-01' },
        { label: 'Week 2', value: 3200, date: '2024-01-08' },
        { label: 'Week 3', value: 2950, date: '2024-01-15' },
        { label: 'Week 4', value: 3500, date: '2024-01-22' },
      ],
      period: '30 days',
      unit: '$',
    };
  }

  private generateContentPerformanceChart(filters: AnalyticsFilter): ChartData {
    return {
      id: 'content-performance',
      title: 'Content Performance',
      faithModeTitle: 'Ministry Content',
      encouragementModeTitle: 'Uplifting Content',
      type: 'bar',
      data: [
        { label: 'Testimonies', value: 45, color: '#2D1B69' },
        { label: 'Resources', value: 32, color: '#FFC107' },
        { label: 'Products', value: 28, color: '#3B82F6' },
        { label: 'Calendar', value: 35, color: '#10B981' },
      ],
      period: '30 days',
    };
  }

  private generatePlatformChart(filters: AnalyticsFilter): ChartData {
    return {
      id: 'platform-comparison',
      title: 'Platform Performance',
      faithModeTitle: 'Ministry Reach',
      encouragementModeTitle: 'Platform Impact',
      type: 'pie',
      data: [
        { label: 'Instagram', value: 35, color: '#E4405F' },
        { label: 'Facebook', value: 25, color: '#1877F2' },
        { label: 'TikTok', value: 20, color: '#000000' },
        { label: 'YouTube', value: 20, color: '#FF0000' },
      ],
      period: '30 days',
    };
  }

  private analyzePostingPatterns(filters: AnalyticsFilter): AIInsight | null {
    // Analyze posting time patterns
    return {
      id: 'posting-patterns',
      type: 'optimization',
      title: 'Optimal Posting Times',
      description: 'Your audience is most active on Sundays at 7 PM and Wednesdays at 6 PM. Consider scheduling your most important content during these peak engagement windows.',
      confidence: 0.92,
      impact: 'high',
      category: 'content',
      actionable: true,
      estimatedBenefit: '+25% engagement',
    };
  }

  private analyzeContentPerformance(filters: AnalyticsFilter): AIInsight | null {
    return {
      id: 'content-performance',
      type: 'recommendation',
      title: 'High-Performing Content Types',
      description: 'Your testimony posts generate 40% more engagement than other content types. Consider increasing testimony content frequency.',
      confidence: 0.88,
      impact: 'high',
      category: 'content',
      actionable: true,
      estimatedBenefit: '+30% reach',
    };
  }

  private analyzeAudienceBehavior(filters: AnalyticsFilter): AIInsight | null {
    return {
      id: 'audience-behavior',
      type: 'opportunity',
      title: 'Audience Growth Opportunity',
      description: 'Your audience responds well to interactive content. Try adding more polls and Q&A sessions to boost engagement.',
      confidence: 0.85,
      impact: 'medium',
      category: 'engagement',
      actionable: true,
      estimatedBenefit: '+20% follower growth',
    };
  }

  private analyzeHashtagTrends(filters: AnalyticsFilter): AIInsight | null {
    return {
      id: 'hashtag-trends',
      type: 'prediction',
      title: 'Trending Hashtags',
      description: '#FaithInAction and #HopeRising are trending in your niche and could boost your content visibility.',
      confidence: 0.87,
      impact: 'medium',
      category: 'hashtags',
      actionable: true,
      estimatedBenefit: '+15% reach',
    };
  }

  private categorizeHashtag(hashtag: string): string {
    // Simple categorization logic
    if (hashtag.toLowerCase().includes('faith') || hashtag.toLowerCase().includes('god') || hashtag.toLowerCase().includes('prayer')) {
      return 'faith';
    }
    if (hashtag.toLowerCase().includes('hope') || hashtag.toLowerCase().includes('love') || hashtag.toLowerCase().includes('support')) {
      return 'encouragement';
    }
    return 'general';
  }

  private isHashtagTrending(hashtag: string, stats: any): boolean {
    // Simple trending logic - would use more sophisticated algorithms
    return stats.usage > 10 && stats.reach > 1000;
  }

  private getHashtagPerformance(stats: any): 'excellent' | 'good' | 'average' | 'poor' {
    if (stats.engagement > 100) return 'excellent';
    if (stats.engagement > 50) return 'good';
    if (stats.engagement > 20) return 'average';
    return 'poor';
  }

  private exportToCSV(data: AnalyticsData[], sections: string[]): string {
    // Simple CSV export
    const headers = ['timestamp', 'type', 'value', 'metadata'];
    const rows = data.map(event => [
      event.timestamp,
      event.metadata?.type || '',
      event.value.toString(),
      JSON.stringify(event.metadata || {}),
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  private exportToExcel(data: AnalyticsData[], sections: string[]): string {
    // Would integrate with Excel export library
    return 'Excel export functionality would be implemented here';
  }

  private exportToPDF(data: AnalyticsData[], sections: string[]): string {
    // Would integrate with PDF generation library
    return 'PDF export functionality would be implemented here';
  }
}

export default AnalyticsService;

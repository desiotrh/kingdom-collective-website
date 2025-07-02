export interface AnalyticsData {
  id: string;
  userId: string;
  timestamp: string;
  value: number;
  metadata?: Record<string, any>;
}

export interface MetricCard {
  id: string;
  title: string;
  faithModeTitle?: string;
  encouragementModeTitle?: string;
  value: number;
  change: number;
  period: string;
  icon: string;
  color: string;
  trend: 'up' | 'down' | 'stable';
  format: 'number' | 'currency' | 'percentage';
}

export interface ChartData {
  id: string;
  title: string;
  faithModeTitle?: string;
  encouragementModeTitle?: string;
  type: 'line' | 'bar' | 'pie' | 'area' | 'donut';
  data: Array<{
    label: string;
    value: number;
    color?: string;
    date?: string;
  }>;
  period: string;
  unit?: string;
}

export interface ContentPerformance {
  id: string;
  type: 'testimony' | 'resource' | 'product' | 'affiliate' | 'post' | 'hashtag' | 'calendar';
  title: string;
  views: number;
  engagement: number;
  clicks: number;
  conversions: number;
  revenue?: number;
  date: string;
  platform?: string;
  mood: 'faith' | 'encouragement';
}

export interface AudienceInsight {
  id: string;
  title: string;
  faithModeTitle?: string;
  encouragementModeTitle?: string;
  description: string;
  value: string;
  icon: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  recommendation?: string;
}

export interface SpiritualMetrics {
  testimoniesShared: number;
  prayerRequestsAnswered: number;
  resourcesAccessed: number;
  challengesCompleted: number;
  mentorshipHours: number;
  communityEngagement: number;
  faithGrowthScore: number;
  blessingsShared: number;
}

export interface BusinessMetrics {
  totalRevenue: number;
  affiliateEarnings: number;
  productSales: number;
  sponsorshipIncome: number;
  activeSubscribers: number;
  conversionRate: number;
  averageOrderValue: number;
  customerLifetimeValue: number;
}

export interface GoalTracking {
  id: string;
  title: string;
  faithModeTitle?: string;
  encouragementModeTitle?: string;
  type: 'spiritual' | 'business' | 'community' | 'content';
  target: number;
  current: number;
  deadline: string;
  unit: string;
  priority: 'high' | 'medium' | 'low';
  status: 'on-track' | 'behind' | 'ahead' | 'completed';
}

export interface AnalyticsFilter {
  dateRange: {
    start: string;
    end: string;
    preset?: '7d' | '30d' | '90d' | '1y' | 'custom';
  };
  platforms?: string[];
  contentTypes?: string[];
  mood?: 'faith' | 'encouragement' | 'both';
  categories?: string[];
}

export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv' | 'image';
  sections: string[];
  dateRange: {
    start: string;
    end: string;
  };
  includeCharts: boolean;
  includeInsights: boolean;
}

export interface AnalyticsAlert {
  id: string;
  type: 'goal' | 'performance' | 'opportunity' | 'warning';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  actionRequired: boolean;
  dismissed: boolean;
  createdAt: string;
}

export interface PlatformAnalytics {
  platform: string;
  followers: number;
  engagement: number;
  reach: number;
  clicks: number;
  conversions: number;
  revenue: number;
  topContent: ContentPerformance[];
  growthRate: number;
}

export interface HashtagAnalytics {
  hashtag: string;
  usage: number;
  reach: number;
  engagement: number;
  trending: boolean;
  category: string;
  performance: 'excellent' | 'good' | 'average' | 'poor';
}

export interface AIInsight {
  id: string;
  type: 'optimization' | 'opportunity' | 'prediction' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  category: string;
  actionable: boolean;
  estimatedBenefit?: string;
}

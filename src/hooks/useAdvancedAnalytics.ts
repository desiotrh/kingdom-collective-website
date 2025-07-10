import { useState, useEffect, useCallback } from 'react';
import advancedAnalyticsService, {
  AdvancedAnalyticsDashboard,
  AnalyticsTimeframe,
  AnalyticsExport,
  ContentMetrics,
  SocialMediaMetrics,
  EmailMetrics,
  UserEngagementMetrics,
  RevenueMetrics,
  AnalyticsInsight,
  AnalyticsRecommendation
} from '../services/advancedAnalyticsService';

export interface UseAdvancedAnalyticsReturn {
  // Dashboard Data
  dashboard: AdvancedAnalyticsDashboard | null;
  
  // Individual Metrics
  contentMetrics: ContentMetrics | null;
  socialMediaMetrics: SocialMediaMetrics | null;
  emailMetrics: EmailMetrics | null;
  userEngagementMetrics: UserEngagementMetrics | null;
  revenueMetrics: RevenueMetrics | null;
  
  // Insights & Recommendations
  insights: AnalyticsInsight[];
  recommendations: AnalyticsRecommendation[];
  
  // Real-time Data
  realtimeMetrics: any;
  
  // Loading States
  isLoading: boolean;
  isLoadingRealtime: boolean;
  isExporting: boolean;
  
  // Error States
  error: string | null;
  
  // Functions
  loadDashboard: (timeframe: AnalyticsTimeframe) => Promise<void>;
  loadRealtimeMetrics: () => Promise<void>;
  exportAnalytics: (format: 'pdf' | 'csv' | 'excel', timeframe: AnalyticsTimeframe) => Promise<AnalyticsExport | null>;
  refreshData: () => Promise<void>;
  clearError: () => void;
  
  // Timeframe Management
  selectedTimeframe: AnalyticsTimeframe;
  setTimeframe: (timeframe: AnalyticsTimeframe) => void;
  getPresetTimeframes: () => { label: string; timeframe: AnalyticsTimeframe }[];
}

export const useAdvancedAnalytics = (): UseAdvancedAnalyticsReturn => {
  // State
  const [dashboard, setDashboard] = useState<AdvancedAnalyticsDashboard | null>(null);
  const [contentMetrics, setContentMetrics] = useState<ContentMetrics | null>(null);
  const [socialMediaMetrics, setSocialMediaMetrics] = useState<SocialMediaMetrics | null>(null);
  const [emailMetrics, setEmailMetrics] = useState<EmailMetrics | null>(null);
  const [userEngagementMetrics, setUserEngagementMetrics] = useState<UserEngagementMetrics | null>(null);
  const [revenueMetrics, setRevenueMetrics] = useState<RevenueMetrics | null>(null);
  const [insights, setInsights] = useState<AnalyticsInsight[]>([]);
  const [recommendations, setRecommendations] = useState<AnalyticsRecommendation[]>([]);
  const [realtimeMetrics, setRealtimeMetrics] = useState<any>(null);
  
  // Loading States
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRealtime, setIsLoadingRealtime] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  // Error State
  const [error, setError] = useState<string | null>(null);
  
  // Timeframe State
  const [selectedTimeframe, setSelectedTimeframe] = useState<AnalyticsTimeframe>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    end: new Date()
  });

  // Load Dashboard Data
  const loadDashboard = useCallback(async (timeframe: AnalyticsTimeframe) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const dashboardData = await advancedAnalyticsService.getDashboardData(timeframe);
      
      setDashboard(dashboardData);
      setContentMetrics(dashboardData.contentMetrics);
      setSocialMediaMetrics(dashboardData.socialMediaMetrics);
      setEmailMetrics(dashboardData.emailMetrics);
      setUserEngagementMetrics(dashboardData.userEngagementMetrics);
      setRevenueMetrics(dashboardData.revenueMetrics);
      setInsights(dashboardData.insights);
      setRecommendations(dashboardData.recommendations);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load analytics dashboard';
      setError(errorMessage);
      console.error('Error loading dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load Real-time Metrics
  const loadRealtimeMetrics = useCallback(async () => {
    setIsLoadingRealtime(true);
    
    try {
      const realtime = await advancedAnalyticsService.getRealtimeMetrics();
      setRealtimeMetrics(realtime);
    } catch (err) {
      console.error('Error loading realtime metrics:', err);
      // Don't set error for realtime updates to avoid disrupting the main dashboard
    } finally {
      setIsLoadingRealtime(false);
    }
  }, []);

  // Export Analytics
  const exportAnalytics = useCallback(async (
    format: 'pdf' | 'csv' | 'excel',
    timeframe: AnalyticsTimeframe
  ): Promise<AnalyticsExport | null> => {
    setIsExporting(true);
    setError(null);
    
    try {
      const exportData = await advancedAnalyticsService.exportAnalytics(format, timeframe);
      return exportData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export analytics';
      setError(errorMessage);
      console.error('Error exporting analytics:', err);
      return null;
    } finally {
      setIsExporting(false);
    }
  }, []);

  // Refresh Data
  const refreshData = useCallback(async () => {
    await Promise.all([
      loadDashboard(selectedTimeframe),
      loadRealtimeMetrics()
    ]);
  }, [loadDashboard, loadRealtimeMetrics, selectedTimeframe]);

  // Clear Error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Set Timeframe
  const setTimeframe = useCallback((timeframe: AnalyticsTimeframe) => {
    setSelectedTimeframe(timeframe);
  }, []);

  // Get Preset Timeframes
  const getPresetTimeframes = useCallback(() => {
    const now = new Date();
    const presets = [
      {
        label: 'Last 7 days',
        timeframe: {
          start: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
          end: now
        }
      },
      {
        label: 'Last 30 days',
        timeframe: {
          start: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
          end: now
        }
      },
      {
        label: 'Last 90 days',
        timeframe: {
          start: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
          end: now
        }
      },
      {
        label: 'This month',
        timeframe: {
          start: new Date(now.getFullYear(), now.getMonth(), 1),
          end: now
        }
      },
      {
        label: 'Last month',
        timeframe: {
          start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
          end: new Date(now.getFullYear(), now.getMonth(), 0)
        }
      },
      {
        label: 'This year',
        timeframe: {
          start: new Date(now.getFullYear(), 0, 1),
          end: now
        }
      }
    ];
    
    return presets;
  }, []);

  // Load initial data on mount
  useEffect(() => {
    loadDashboard(selectedTimeframe);
    loadRealtimeMetrics();
  }, [loadDashboard, loadRealtimeMetrics, selectedTimeframe]);

  // Set up real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      loadRealtimeMetrics();
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [loadRealtimeMetrics]);

  // Auto-refresh dashboard periodically
  useEffect(() => {
    const interval = setInterval(() => {
      loadDashboard(selectedTimeframe);
    }, 5 * 60 * 1000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, [loadDashboard, selectedTimeframe]);

  return {
    // Dashboard Data
    dashboard,
    
    // Individual Metrics
    contentMetrics,
    socialMediaMetrics,
    emailMetrics,
    userEngagementMetrics,
    revenueMetrics,
    
    // Insights & Recommendations
    insights,
    recommendations,
    
    // Real-time Data
    realtimeMetrics,
    
    // Loading States
    isLoading,
    isLoadingRealtime,
    isExporting,
    
    // Error States
    error,
    
    // Functions
    loadDashboard,
    loadRealtimeMetrics,
    exportAnalytics,
    refreshData,
    clearError,
    
    // Timeframe Management
    selectedTimeframe,
    setTimeframe,
    getPresetTimeframes
  };
};

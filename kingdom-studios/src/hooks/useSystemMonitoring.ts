import { useState, useEffect, useCallback } from 'react';
import { systemMonitoringService, PerformanceMetrics } from '../services/systemMonitoringService';

export interface UseSystemMonitoringReturn {
  // State
  metrics: PerformanceMetrics | null;
  healthScore: number;
  usageInsights: {
    mostUsedFeature: string;
    totalSessions: number;
    averageSessionDuration: number;
    totalActions: number;
    crashRate: number;
  } | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  trackScreenView: (screenName: string) => void;
  trackUserAction: (action: string) => void;
  trackFeatureUsage: (feature: string) => void;
  trackApiCall: (duration: number) => void;
  trackScreenRenderTime: (duration: number) => void;
  reportCrash: (error: Error, additionalInfo?: any) => Promise<void>;
  refreshMetrics: () => Promise<void>;
  clearOldData: (daysToKeep?: number) => Promise<void>;
}

export const useSystemMonitoring = (): UseSystemMonitoringReturn => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [healthScore, setHealthScore] = useState(0);
  const [usageInsights, setUsageInsights] = useState<{
    mostUsedFeature: string;
    totalSessions: number;
    averageSessionDuration: number;
    totalActions: number;
    crashRate: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize monitoring service
  const initialize = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await systemMonitoringService.initialize();
      await refreshMetrics();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize monitoring';
      setError(errorMessage);
      console.error('System monitoring initialization failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh metrics
  const refreshMetrics = useCallback(async () => {
    try {
      const [currentMetrics, currentHealthScore, currentInsights] = await Promise.all([
        systemMonitoringService.getMetrics(),
        systemMonitoringService.getHealthScore(),
        systemMonitoringService.getUsageInsights(),
      ]);

      setMetrics(currentMetrics);
      setHealthScore(currentHealthScore);
      setUsageInsights(currentInsights);
    } catch (err) {
      console.error('Failed to refresh metrics:', err);
    }
  }, []);

  // Track screen view
  const trackScreenView = useCallback((screenName: string) => {
    try {
      systemMonitoringService.trackScreenView(screenName);
    } catch (err) {
      console.error('Failed to track screen view:', err);
    }
  }, []);

  // Track user action
  const trackUserAction = useCallback((action: string) => {
    try {
      systemMonitoringService.trackUserAction(action);
    } catch (err) {
      console.error('Failed to track user action:', err);
    }
  }, []);

  // Track feature usage
  const trackFeatureUsage = useCallback((feature: string) => {
    try {
      const validFeatures = ['aiGeneration', 'socialMediaPosts', 'emailCampaigns', 'fileUploads', 'collaborationActions', 'analyticsViews'];
      if (validFeatures.includes(feature)) {
        systemMonitoringService.trackFeatureUsage(feature as any);
      }
    } catch (err) {
      console.error('Failed to track feature usage:', err);
    }
  }, []);

  // Track API call duration
  const trackApiCall = useCallback((duration: number) => {
    try {
      systemMonitoringService.trackApiCall(duration);
    } catch (err) {
      console.error('Failed to track API call:', err);
    }
  }, []);

  // Track screen render time
  const trackScreenRenderTime = useCallback((duration: number) => {
    try {
      systemMonitoringService.trackScreenRenderTime(duration);
    } catch (err) {
      console.error('Failed to track screen render time:', err);
    }
  }, []);

  // Report crash
  const reportCrash = useCallback(async (error: Error, additionalInfo?: any) => {
    try {
      await systemMonitoringService.reportCrash(error, additionalInfo);
      await refreshMetrics(); // Refresh to show updated crash count
    } catch (err) {
      console.error('Failed to report crash:', err);
    }
  }, [refreshMetrics]);

  // Clear old data
  const clearOldData = useCallback(async (daysToKeep: number = 30) => {
    setError(null);

    try {
      await systemMonitoringService.clearOldData(daysToKeep);
      await refreshMetrics();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear old data';
      setError(errorMessage);
      throw err;
    }
  }, [refreshMetrics]);

  // Auto-initialize on mount
  useEffect(() => {
    initialize();

    // Cleanup on unmount
    return () => {
      systemMonitoringService.cleanup();
    };
  }, [initialize]);

  // Auto-refresh metrics every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshMetrics();
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshMetrics]);

  return {
    // State
    metrics,
    healthScore,
    usageInsights,
    isLoading,
    error,

    // Actions
    initialize,
    trackScreenView,
    trackUserAction,
    trackFeatureUsage,
    trackApiCall,
    trackScreenRenderTime,
    reportCrash,
    refreshMetrics,
    clearOldData,
  };
};

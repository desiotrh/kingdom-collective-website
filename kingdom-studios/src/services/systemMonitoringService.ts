import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Application from 'expo-application';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export interface PerformanceMetrics {
  timestamp: number;
  memoryUsage: number;
  appStartTime: number;
  screenRenderTime: number;
  apiCallDuration: number;
  crashReports: CrashReport[];
  userSessions: SessionMetrics[];
  featureUsage: FeatureUsageMetrics;
}

export interface CrashReport {
  id: string;
  timestamp: number;
  error: string;
  stackTrace: string;
  userAgent: string;
  appVersion: string;
  deviceInfo: DeviceInfo;
}

export interface SessionMetrics {
  sessionId: string;
  startTime: number;
  endTime: number;
  duration: number;
  screensViewed: string[];
  actionsPerformed: number;
  errorsEncountered: number;
}

export interface FeatureUsageMetrics {
  aiGeneration: number;
  socialMediaPosts: number;
  emailCampaigns: number;
  fileUploads: number;
  collaborationActions: number;
  analyticsViews: number;
}

export interface DeviceInfo {
  brand: string;
  manufacturer: string;
  modelName: string;
  osName: string;
  osVersion: string;
  totalMemory: number;
  platform: string;
}

class SystemMonitoringService {
  private metrics: PerformanceMetrics;
  private currentSession: SessionMetrics | null = null;
  private performanceObserver: PerformanceObserver | null = null;
  private memoryCheckInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.metrics = {
      timestamp: Date.now(),
      memoryUsage: 0,
      appStartTime: Date.now(),
      screenRenderTime: 0,
      apiCallDuration: 0,
      crashReports: [],
      userSessions: [],
      featureUsage: {
        aiGeneration: 0,
        socialMediaPosts: 0,
        emailCampaigns: 0,
        fileUploads: 0,
        collaborationActions: 0,
        analyticsViews: 0,
      },
    };
  }

  async initialize(): Promise<void> {
    try {
      // Load existing metrics
      await this.loadStoredMetrics();
      
      // Start new session
      await this.startSession();
      
      // Set up performance monitoring
      this.setupPerformanceMonitoring();
      
      // Set up crash reporting
      this.setupErrorHandling();
      
      // Start memory monitoring
      this.startMemoryMonitoring();
      
      console.log('System monitoring initialized');
    } catch (error) {
      console.error('Failed to initialize system monitoring:', error);
    }
  }

  private async loadStoredMetrics(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('system_metrics');
      if (stored) {
        const storedMetrics = JSON.parse(stored);
        this.metrics = { ...this.metrics, ...storedMetrics };
      }
    } catch (error) {
      console.error('Error loading stored metrics:', error);
    }
  }

  private async saveMetrics(): Promise<void> {
    try {
      await AsyncStorage.setItem('system_metrics', JSON.stringify(this.metrics));
    } catch (error) {
      console.error('Error saving metrics:', error);
    }
  }

  async startSession(): Promise<void> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.currentSession = {
      sessionId,
      startTime: Date.now(),
      endTime: 0,
      duration: 0,
      screensViewed: [],
      actionsPerformed: 0,
      errorsEncountered: 0,
    };

    console.log('New session started:', sessionId);
  }

  async endSession(): Promise<void> {
    if (!this.currentSession) return;

    const endTime = Date.now();
    this.currentSession.endTime = endTime;
    this.currentSession.duration = endTime - this.currentSession.startTime;

    this.metrics.userSessions.push({ ...this.currentSession });
    
    // Keep only last 50 sessions
    if (this.metrics.userSessions.length > 50) {
      this.metrics.userSessions = this.metrics.userSessions.slice(-50);
    }

    await this.saveMetrics();
    console.log('Session ended:', this.currentSession.sessionId);
    this.currentSession = null;
  }

  trackScreenView(screenName: string): void {
    if (this.currentSession && !this.currentSession.screensViewed.includes(screenName)) {
      this.currentSession.screensViewed.push(screenName);
    }
  }

  trackUserAction(action: string): void {
    if (this.currentSession) {
      this.currentSession.actionsPerformed++;
    }
  }

  trackFeatureUsage(feature: keyof FeatureUsageMetrics): void {
    this.metrics.featureUsage[feature]++;
    this.saveMetrics();
  }

  trackApiCall(duration: number): void {
    this.metrics.apiCallDuration = (this.metrics.apiCallDuration + duration) / 2; // Moving average
  }

  trackScreenRenderTime(duration: number): void {
    this.metrics.screenRenderTime = (this.metrics.screenRenderTime + duration) / 2; // Moving average
  }

  async reportCrash(error: Error, additionalInfo?: any): Promise<void> {
    try {
      const deviceInfo = await this.getDeviceInfo();
      
      const crashReport: CrashReport = {
        id: `crash_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        error: error.message,
        stackTrace: error.stack || 'No stack trace available',
        userAgent: Platform.OS,
        appVersion: Application.nativeApplicationVersion || 'Unknown',
        deviceInfo,
      };

      this.metrics.crashReports.push(crashReport);
      
      // Keep only last 20 crash reports
      if (this.metrics.crashReports.length > 20) {
        this.metrics.crashReports = this.metrics.crashReports.slice(-20);
      }

      if (this.currentSession) {
        this.currentSession.errorsEncountered++;
      }

      await this.saveMetrics();
      console.error('Crash reported:', crashReport);
    } catch (reportError) {
      console.error('Failed to report crash:', reportError);
    }
  }

  private async getDeviceInfo(): Promise<DeviceInfo> {
    return {
      brand: Device.brand || 'Unknown',
      manufacturer: Device.manufacturer || 'Unknown',
      modelName: Device.modelName || 'Unknown',
      osName: Device.osName || Platform.OS,
      osVersion: Device.osVersion || 'Unknown',
      totalMemory: Device.totalMemory || 0,
      platform: Platform.OS,
    };
  }

  private setupPerformanceMonitoring(): void {
    if (typeof PerformanceObserver === 'undefined') return;

    try {
      this.performanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            this.trackScreenRenderTime(entry.duration);
          }
        });
      });

      this.performanceObserver.observe({ entryTypes: ['navigation', 'measure'] });
    } catch (error) {
      console.warn('Performance monitoring not available:', error);
    }
  }

  private setupErrorHandling(): void {
    // Global error handler
    const originalErrorHandler = ErrorUtils.getGlobalHandler();
    
    ErrorUtils.setGlobalHandler((error, isFatal) => {
      this.reportCrash(error, { isFatal });
      originalErrorHandler?.(error, isFatal);
    });

    // Unhandled promise rejection handler
    if (typeof process !== 'undefined' && process.on) {
      process.on('unhandledRejection', (reason, promise) => {
        const error = reason instanceof Error ? reason : new Error(String(reason));
        this.reportCrash(error, { type: 'unhandledRejection', promise });
      });
    }
  }

  private startMemoryMonitoring(): void {
    this.memoryCheckInterval = setInterval(() => {
      if (Platform.OS === 'web' && 'memory' in performance) {
        const memInfo = (performance as any).memory;
        this.metrics.memoryUsage = memInfo.usedJSHeapSize;
      }
    }, 30000); // Check every 30 seconds
  }

  async getMetrics(): Promise<PerformanceMetrics> {
    return { ...this.metrics };
  }

  async getHealthScore(): Promise<number> {
    const now = Date.now();
    const last24Hours = now - (24 * 60 * 60 * 1000);
    
    // Calculate health score based on various factors
    let score = 100;
    
    // Crash rate penalty
    const recentCrashes = this.metrics.crashReports.filter(crash => crash.timestamp > last24Hours).length;
    score -= recentCrashes * 10;
    
    // Performance penalties
    if (this.metrics.screenRenderTime > 1000) score -= 20; // Slow rendering
    if (this.metrics.apiCallDuration > 5000) score -= 15; // Slow API calls
    
    // Memory usage penalty
    if (this.metrics.memoryUsage > 100 * 1024 * 1024) score -= 10; // >100MB
    
    // Session quality bonus
    const recentSessions = this.metrics.userSessions.filter(session => session.startTime > last24Hours);
    const avgSessionDuration = recentSessions.reduce((sum, session) => sum + session.duration, 0) / recentSessions.length;
    if (avgSessionDuration > 5 * 60 * 1000) score += 5; // >5 minutes average
    
    return Math.max(0, Math.min(100, score));
  }

  async getUsageInsights(): Promise<{
    mostUsedFeature: string;
    totalSessions: number;
    averageSessionDuration: number;
    totalActions: number;
    crashRate: number;
  }> {
    const features = this.metrics.featureUsage;
    const mostUsedFeature = Object.entries(features).reduce((a, b) => features[a[0]] > features[b[0]] ? a : b)[0];
    
    const totalSessions = this.metrics.userSessions.length;
    const averageSessionDuration = totalSessions > 0 
      ? this.metrics.userSessions.reduce((sum, session) => sum + session.duration, 0) / totalSessions
      : 0;
    
    const totalActions = this.metrics.userSessions.reduce((sum, session) => sum + session.actionsPerformed, 0);
    const totalErrors = this.metrics.userSessions.reduce((sum, session) => sum + session.errorsEncountered, 0);
    const crashRate = totalActions > 0 ? (totalErrors / totalActions) * 100 : 0;

    return {
      mostUsedFeature,
      totalSessions,
      averageSessionDuration,
      totalActions,
      crashRate,
    };
  }

  async clearOldData(daysToKeep: number = 30): Promise<void> {
    const cutoffTime = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
    
    this.metrics.crashReports = this.metrics.crashReports.filter(
      crash => crash.timestamp > cutoffTime
    );
    
    this.metrics.userSessions = this.metrics.userSessions.filter(
      session => session.startTime > cutoffTime
    );
    
    await this.saveMetrics();
    console.log(`Cleared monitoring data older than ${daysToKeep} days`);
  }

  cleanup(): void {
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }
    
    if (this.memoryCheckInterval) {
      clearInterval(this.memoryCheckInterval);
    }
    
    if (this.currentSession) {
      this.endSession();
    }
  }
}

export const systemMonitoringService = new SystemMonitoringService();
export default systemMonitoringService;

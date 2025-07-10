import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Application from 'expo-application';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export interface ProductionMetrics {
  timestamp: number;
  version: string;
  buildNumber: string;
  environment: 'production' | 'staging' | 'development';
  
  // Performance Metrics
  appStartTime: number;
  memoryUsage: number;
  cpuUsage: number;
  batteryLevel?: number;
  networkType?: string;
  
  // User Metrics
  activeUsers: number;
  sessionDuration: number;
  screenViews: Record<string, number>;
  featureUsage: Record<string, number>;
  
  // Business Metrics
  contentGenerated: number;
  postsPublished: number;
  emailsSent: number;
  revenueGenerated: number;
  subscriptionConversions: number;
  
  // Error Metrics
  crashRate: number;
  errorRate: number;
  apiFailureRate: number;
  
  // Health Metrics
  uptime: number;
  healthScore: number;
  alertsTriggered: number;
}

export interface AlertConfig {
  id: string;
  name: string;
  metric: keyof ProductionMetrics;
  threshold: number;
  condition: 'greater_than' | 'less_than' | 'equals';
  severity: 'critical' | 'warning' | 'info';
  enabled: boolean;
  recipients: string[];
}

class ProductionMonitoringService {
  private metrics: ProductionMetrics;
  private alerts: AlertConfig[] = [];
  private isMonitoring = false;
  private monitoringInterval: NodeJS.Timeout | null = null;
  
  constructor() {
    this.metrics = {
      timestamp: Date.now(),
      version: Application.nativeApplicationVersion || '1.0.0',
      buildNumber: Application.nativeBuildVersion || '1',
      environment: this.getEnvironment(),
      
      // Performance
      appStartTime: Date.now(),
      memoryUsage: 0,
      cpuUsage: 0,
      batteryLevel: 0,
      networkType: 'unknown',
      
      // User
      activeUsers: 0,
      sessionDuration: 0,
      screenViews: {},
      featureUsage: {},
      
      // Business
      contentGenerated: 0,
      postsPublished: 0,
      emailsSent: 0,
      revenueGenerated: 0,
      subscriptionConversions: 0,
      
      // Error
      crashRate: 0,
      errorRate: 0,
      apiFailureRate: 0,
      
      // Health
      uptime: 0,
      healthScore: 100,
      alertsTriggered: 0,
    };
    
    this.setupDefaultAlerts();
  }
  
  private getEnvironment(): 'production' | 'staging' | 'development' {
    const env = process.env.EXPO_PUBLIC_ENVIRONMENT;
    if (env === 'production' || env === 'staging') return env;
    return 'development';
  }
  
  private setupDefaultAlerts(): void {
    this.alerts = [
      {
        id: 'high_crash_rate',
        name: 'High Crash Rate',
        metric: 'crashRate',
        threshold: 5, // 5%
        condition: 'greater_than',
        severity: 'critical',
        enabled: true,
        recipients: ['alerts@kingdomstudios.app'],
      },
      {
        id: 'low_health_score',
        name: 'Low Health Score',
        metric: 'healthScore',
        threshold: 70,
        condition: 'less_than',
        severity: 'warning',
        enabled: true,
        recipients: ['alerts@kingdomstudios.app'],
      },
      {
        id: 'high_memory_usage',
        name: 'High Memory Usage',
        metric: 'memoryUsage',
        threshold: 200 * 1024 * 1024, // 200MB
        condition: 'greater_than',
        severity: 'warning',
        enabled: true,
        recipients: ['tech@kingdomstudios.app'],
      },
      {
        id: 'api_failure_rate',
        name: 'High API Failure Rate',
        metric: 'apiFailureRate',
        threshold: 10, // 10%
        condition: 'greater_than',
        severity: 'critical',
        enabled: true,
        recipients: ['alerts@kingdomstudios.app'],
      },
    ];
  }
  
  async startMonitoring(): Promise<void> {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    console.log('🔍 Starting production monitoring...');
    
    // Load stored metrics
    await this.loadStoredMetrics();
    
    // Start monitoring interval (every 5 minutes)
    this.monitoringInterval = setInterval(() => {
      this.collectMetrics();
      this.checkAlerts();
      this.saveMetrics();
      this.sendMetricsToServer();
    }, 5 * 60 * 1000);
    
    // Initial collection
    await this.collectMetrics();
  }
  
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.isMonitoring = false;
    console.log('⏹️ Production monitoring stopped');
  }
  
  private async loadStoredMetrics(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('production_metrics');
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
      await AsyncStorage.setItem('production_metrics', JSON.stringify(this.metrics));
    } catch (error) {
      console.error('Error saving metrics:', error);
    }
  }
  
  private async collectMetrics(): Promise<void> {
    try {
      // Update timestamp
      this.metrics.timestamp = Date.now();
      
      // Calculate uptime
      this.metrics.uptime = Date.now() - this.metrics.appStartTime;
      
      // Collect memory usage (if available)
      if (Platform.OS === 'web' && 'memory' in performance) {
        const memInfo = (performance as any).memory;
        this.metrics.memoryUsage = memInfo.usedJSHeapSize;
      }
      
      // Collect battery level (mobile only)
      if (Platform.OS !== 'web') {
        try {
          // Note: This would require expo-battery in a real implementation
          // this.metrics.batteryLevel = await Battery.getBatteryLevelAsync();
        } catch (error) {
          // Battery API not available
        }
      }
      
      // Calculate health score
      this.metrics.healthScore = this.calculateHealthScore();
      
      console.log('📊 Metrics collected:', {
        uptime: this.formatDuration(this.metrics.uptime),
        memory: this.formatMemory(this.metrics.memoryUsage),
        health: this.metrics.healthScore,
      });
    } catch (error) {
      console.error('Error collecting metrics:', error);
    }
  }
  
  private calculateHealthScore(): number {
    let score = 100;
    
    // Deduct for high crash rate
    if (this.metrics.crashRate > 1) score -= this.metrics.crashRate * 10;
    
    // Deduct for high error rate
    if (this.metrics.errorRate > 1) score -= this.metrics.errorRate * 5;
    
    // Deduct for API failures
    if (this.metrics.apiFailureRate > 5) score -= this.metrics.apiFailureRate * 2;
    
    // Deduct for high memory usage
    const memoryMB = this.metrics.memoryUsage / (1024 * 1024);
    if (memoryMB > 150) score -= (memoryMB - 150) / 10;
    
    return Math.max(0, Math.min(100, score));
  }
  
  private checkAlerts(): void {
    this.alerts.forEach(alert => {
      if (!alert.enabled) return;
      
      const value = this.metrics[alert.metric] as number;
      let shouldTrigger = false;
      
      switch (alert.condition) {
        case 'greater_than':
          shouldTrigger = value > alert.threshold;
          break;
        case 'less_than':
          shouldTrigger = value < alert.threshold;
          break;
        case 'equals':
          shouldTrigger = value === alert.threshold;
          break;
      }
      
      if (shouldTrigger) {
        this.triggerAlert(alert, value);
      }
    });
  }
  
  private async triggerAlert(alert: AlertConfig, value: number): Promise<void> {
    this.metrics.alertsTriggered++;
    
    const alertData = {
      id: alert.id,
      name: alert.name,
      severity: alert.severity,
      metric: alert.metric,
      value,
      threshold: alert.threshold,
      timestamp: new Date().toISOString(),
      environment: this.metrics.environment,
      version: this.metrics.version,
    };
    
    console.warn(`🚨 ALERT: ${alert.name}`, alertData);
    
    // Send alert to monitoring service
    await this.sendAlert(alertData);
    
    // Store alert locally
    await this.storeAlert(alertData);
  }
  
  private async sendAlert(alertData: any): Promise<void> {
    try {
      if (this.metrics.environment === 'production') {
        // Send to external monitoring service
        const response = await fetch('https://api.kingdomstudios.app/monitoring/alerts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.EXPO_PUBLIC_MONITORING_API_KEY}`,
          },
          body: JSON.stringify(alertData),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to send alert: ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error('Error sending alert:', error);
    }
  }
  
  private async storeAlert(alertData: any): Promise<void> {
    try {
      const alerts = await AsyncStorage.getItem('stored_alerts');
      const alertHistory = alerts ? JSON.parse(alerts) : [];
      
      alertHistory.push(alertData);
      
      // Keep only last 100 alerts
      if (alertHistory.length > 100) {
        alertHistory.splice(0, alertHistory.length - 100);
      }
      
      await AsyncStorage.setItem('stored_alerts', JSON.stringify(alertHistory));
    } catch (error) {
      console.error('Error storing alert:', error);
    }
  }
  
  private async sendMetricsToServer(): Promise<void> {
    try {
      if (this.metrics.environment === 'production') {
        const response = await fetch('https://api.kingdomstudios.app/monitoring/metrics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.EXPO_PUBLIC_MONITORING_API_KEY}`,
          },
          body: JSON.stringify(this.metrics),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to send metrics: ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error('Error sending metrics to server:', error);
    }
  }
  
  // Public methods for updating metrics
  recordScreenView(screenName: string): void {
    this.metrics.screenViews[screenName] = (this.metrics.screenViews[screenName] || 0) + 1;
  }
  
  recordFeatureUsage(feature: string): void {
    this.metrics.featureUsage[feature] = (this.metrics.featureUsage[feature] || 0) + 1;
  }
  
  recordContentGeneration(): void {
    this.metrics.contentGenerated++;
  }
  
  recordPostPublished(): void {
    this.metrics.postsPublished++;
  }
  
  recordEmailSent(): void {
    this.metrics.emailsSent++;
  }
  
  recordRevenue(amount: number): void {
    this.metrics.revenueGenerated += amount;
  }
  
  recordSubscriptionConversion(): void {
    this.metrics.subscriptionConversions++;
  }
  
  recordError(): void {
    this.metrics.errorRate = this.calculateErrorRate();
  }
  
  recordCrash(): void {
    this.metrics.crashRate = this.calculateCrashRate();
  }
  
  recordApiFailure(): void {
    this.metrics.apiFailureRate = this.calculateApiFailureRate();
  }
  
  private calculateErrorRate(): number {
    // This would be calculated based on error counts vs. total operations
    // For now, return a placeholder
    return 0;
  }
  
  private calculateCrashRate(): number {
    // This would be calculated based on crash counts vs. total sessions
    // For now, return a placeholder
    return 0;
  }
  
  private calculateApiFailureRate(): number {
    // This would be calculated based on failed API calls vs. total API calls
    // For now, return a placeholder
    return 0;
  }
  
  // Utility methods
  private formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }
  
  private formatMemory(bytes: number): string {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  }
  
  // Getters
  getMetrics(): ProductionMetrics {
    return { ...this.metrics };
  }
  
  getAlerts(): AlertConfig[] {
    return [...this.alerts];
  }
  
  isRunning(): boolean {
    return this.isMonitoring;
  }
}

export const productionMonitoringService = new ProductionMonitoringService();
export default productionMonitoringService;

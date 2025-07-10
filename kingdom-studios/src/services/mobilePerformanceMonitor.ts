// Kingdom Studios - Mobile Performance Monitoring
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

class MobilePerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private startTimes: Map<string, number> = new Map();
  
  // App startup tracking
  public trackAppStartup() {
    const startTime = Date.now();
    
    return {
      complete: async () => {
        const duration = Date.now() - startTime;
        await this.recordMetric('app_startup_time', duration);
        
        if (duration > 3000) {
          console.warn(`Slow app startup: ${duration}ms`);
        }
      }
    };
  }

  // Screen transition performance
  public trackScreenLoad(screenName: string) {
    const key = `screen_${screenName}`;
    this.startTimes.set(key, Date.now());
    
    return {
      complete: async () => {
        const startTime = this.startTimes.get(key);
        if (startTime) {
          const duration = Date.now() - startTime;
          await this.recordMetric('screen_load_time', duration, { screen: screenName });
          this.startTimes.delete(key);
        }
      }
    };
  }

  // AI content generation performance
  public trackContentGeneration(type: string) {
    const startTime = Date.now();
    
    return {
      complete: async (success: boolean, tokens?: number) => {
        const duration = Date.now() - startTime;
        await this.recordMetric('content_generation_time', duration, {
          type,
          success,
          tokens,
          performance_rating: this.getPerformanceRating(duration, 5000)
        });
      }
    };
  }

  // Social media API performance
  public trackSocialAPI(platform: string, action: string) {
    const startTime = Date.now();
    
    return {
      complete: async (success: boolean, dataSize?: number) => {
        const duration = Date.now() - startTime;
        await this.recordMetric('social_api_time', duration, {
          platform,
          action,
          success,
          data_size: dataSize,
          performance_rating: this.getPerformanceRating(duration, 2000)
        });
      }
    };
  }

  private getPerformanceRating(duration: number, threshold: number): string {
    if (duration < threshold * 0.5) return 'excellent';
    if (duration < threshold) return 'good';
    if (duration < threshold * 2) return 'fair';
    return 'poor';
  }

  private async recordMetric(name: string, value: number, metadata?: Record<string, any>) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      metadata
    };
    
    this.metrics.push(metric);
    
    // Keep only last 500 metrics for mobile memory efficiency
    if (this.metrics.length > 500) {
      this.metrics = this.metrics.slice(-500);
    }
    
    // Persist critical metrics
    if (this.isCriticalMetric(name)) {
      await this.persistMetric(metric);
    }
  }

  private isCriticalMetric(name: string): boolean {
    return ['app_startup_time', 'content_generation_time', 'social_api_time'].includes(name);
  }

  private async persistMetric(metric: PerformanceMetric) {
    try {
      const key = `perf_${metric.name}_${Date.now()}`;
      await AsyncStorage.setItem(key, JSON.stringify(metric));
    } catch (error) {
      console.warn('Failed to persist performance metric:', error);
    }
  }

  public async getPerformanceSummary() {
    const summary: Record<string, any> = {};
    
    // Process current metrics
    const groupedMetrics = this.metrics.reduce((acc, metric) => {
      if (!acc[metric.name]) {
        acc[metric.name] = [];
      }
      acc[metric.name].push(metric.value);
      return acc;
    }, {} as Record<string, number[]>);
    
    Object.entries(groupedMetrics).forEach(([name, values]) => {
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      summary[name] = {
        count: values.length,
        average: Math.round(avg),
        min: Math.min(...values),
        max: Math.max(...values)
      };
    });
    
    return summary;
  }

  public clearMetrics() {
    this.metrics = [];
    this.startTimes.clear();
  }
}

export const mobilePerformanceMonitor = new MobilePerformanceMonitor();

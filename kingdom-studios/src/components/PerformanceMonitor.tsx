/**
 * Performance Monitor Component for Enterprise Metrics
 */

import React, { useEffect, useRef, ReactNode } from 'react';
import { AppState, AppStateStatus } from 'react-native';

interface Props {
  children: ReactNode;
}

interface PerformanceMetrics {
  appStartTime: number;
  renderTime: number;
  memoryUsage: number;
  jsHeapSize: number;
  screenTransitions: number;
  apiCalls: number;
  errors: number;
}

class PerformanceTracker {
  private static instance: PerformanceTracker;
  private metrics: PerformanceMetrics;
  private startTime: number;
  private renderStartTime: number;

  private constructor() {
    this.startTime = Date.now();
    this.renderStartTime = Date.now();
    this.metrics = {
      appStartTime: this.startTime,
      renderTime: 0,
      memoryUsage: 0,
      jsHeapSize: 0,
      screenTransitions: 0,
      apiCalls: 0,
      errors: 0,
    };
  }

  static getInstance(): PerformanceTracker {
    if (!PerformanceTracker.instance) {
      PerformanceTracker.instance = new PerformanceTracker();
    }
    return PerformanceTracker.instance;
  }

  startRender() {
    this.renderStartTime = Date.now();
  }

  endRender() {
    this.metrics.renderTime = Date.now() - this.renderStartTime;
  }

  recordScreenTransition() {
    this.metrics.screenTransitions++;
  }

  recordApiCall() {
    this.metrics.apiCalls++;
  }

  recordError() {
    this.metrics.errors++;
  }

  updateMemoryUsage() {
    // Use performance.memory if available (web)
    if (typeof performance !== 'undefined' && performance.memory) {
      this.metrics.jsHeapSize = performance.memory.usedJSHeapSize;
      this.metrics.memoryUsage = performance.memory.totalJSHeapSize;
    }
  }

  getMetrics(): PerformanceMetrics & { uptime: number } {
    this.updateMemoryUsage();
    return {
      ...this.metrics,
      uptime: Date.now() - this.startTime,
    };
  }

  logMetrics() {
    const metrics = this.getMetrics();
    console.log('📊 Performance Metrics:', {
      uptime: `${(metrics.uptime / 1000).toFixed(1)}s`,
      renderTime: `${metrics.renderTime}ms`,
      screenTransitions: metrics.screenTransitions,
      apiCalls: metrics.apiCalls,
      errors: metrics.errors,
      memoryUsage: metrics.memoryUsage ? `${(metrics.memoryUsage / 1024 / 1024).toFixed(1)}MB` : 'N/A',
    });
  }

  // Report metrics to analytics service
  reportMetrics() {
    const metrics = this.getMetrics();
    
    // Send to analytics service
    try {
      // Analytics.track('performance_metrics', metrics);
    } catch (error) {
      console.error('Failed to report performance metrics:', error);
    }
  }
}

export const PerformanceMonitor: React.FC<Props> = ({ children }) => {
  const tracker = useRef(PerformanceTracker.getInstance());
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    tracker.current.startRender();

    // Handle app state changes
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has come to the foreground');
        tracker.current.logMetrics();
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Performance monitoring interval
    const metricsInterval = setInterval(() => {
      tracker.current.logMetrics();
      tracker.current.reportMetrics();
    }, 60000); // Every minute

    // Cleanup
    return () => {
      subscription?.remove();
      clearInterval(metricsInterval);
    };
  }, []);

  useEffect(() => {
    tracker.current.endRender();
  });

  return <>{children}</>;
};

// Export performance utilities for use in other components
export const usePerformanceTracker = () => {
  const tracker = useRef(PerformanceTracker.getInstance());

  return {
    recordScreenTransition: () => tracker.current.recordScreenTransition(),
    recordApiCall: () => tracker.current.recordApiCall(),
    recordError: () => tracker.current.recordError(),
    getMetrics: () => tracker.current.getMetrics(),
    logMetrics: () => tracker.current.logMetrics(),
  };
};

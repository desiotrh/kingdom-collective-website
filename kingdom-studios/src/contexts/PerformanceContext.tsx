import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  apiCalls: number;
  cacheHits: number;
  cacheMisses: number;
  memoryUsage: number;
  networkRequests: number;
  errors: number;
}

interface PerformanceContextType {
  metrics: PerformanceMetrics;
  startTimer: (name: string) => string;
  endTimer: (name: string, timerId: string) => void;
  incrementCounter: (metric: keyof PerformanceMetrics) => void;
  logError: (error: Error, context?: string) => void;
  getPerformanceReport: () => string;
  resetMetrics: () => void;
}

const initialMetrics: PerformanceMetrics = {
  renderTime: 0,
  apiCalls: 0,
  cacheHits: 0,
  cacheMisses: 0,
  memoryUsage: 0,
  networkRequests: 0,
  errors: 0,
};

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

export const usePerformance = (): PerformanceContextType => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
};

interface PerformanceProviderProps {
  children: ReactNode;
}

export const PerformanceProvider: React.FC<PerformanceProviderProps> = ({ children }) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>(initialMetrics);
  const [timers] = useState(new Map<string, number>());

  const startTimer = useCallback((name: string): string => {
    const timerId = `${name}-${Date.now()}-${Math.random()}`;
    timers.set(timerId, performance.now());
    return timerId;
  }, [timers]);

  const endTimer = useCallback((name: string, timerId: string) => {
    const startTime = timers.get(timerId);
    if (startTime) {
      const duration = performance.now() - startTime;
      timers.delete(timerId);
      
      // Log performance data
      console.log(`⚡ Performance: ${name} took ${duration.toFixed(2)}ms`);
      
      // Update metrics
      setMetrics(prev => ({
        ...prev,
        renderTime: prev.renderTime + duration,
      }));
    }
  }, [timers]);

  const incrementCounter = useCallback((metric: keyof PerformanceMetrics) => {
    setMetrics(prev => ({
      ...prev,
      [metric]: prev[metric] + 1,
    }));
  }, []);

  const logError = useCallback((error: Error, context?: string) => {
    console.error(`🚨 Performance Error${context ? ` in ${context}` : ''}:`, error);
    incrementCounter('errors');
  }, [incrementCounter]);

  const getPerformanceReport = useCallback((): string => {
    const report = `
📊 Performance Report:
• Total Render Time: ${metrics.renderTime.toFixed(2)}ms
• API Calls: ${metrics.apiCalls}
• Cache Hits: ${metrics.cacheHits}
• Cache Misses: ${metrics.cacheMisses}
• Network Requests: ${metrics.networkRequests}
• Errors: ${metrics.errors}
• Cache Hit Rate: ${metrics.cacheHits + metrics.cacheMisses > 0 
  ? ((metrics.cacheHits / (metrics.cacheHits + metrics.cacheMisses)) * 100).toFixed(1) 
  : 0}%
    `;
    return report;
  }, [metrics]);

  const resetMetrics = useCallback(() => {
    setMetrics(initialMetrics);
    timers.clear();
  }, [timers]);

  const value: PerformanceContextType = {
    metrics,
    startTimer,
    endTimer,
    incrementCounter,
    logError,
    getPerformanceReport,
    resetMetrics,
  };

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
};

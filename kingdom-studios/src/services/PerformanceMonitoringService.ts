class PerformanceMonitoringService {
  private metrics = new Map();
  private observers = [];

  init() {
    if (typeof window !== 'undefined') {
      this.setupWebVitals();
      this.setupCustomMetrics();
      this.setupErrorTracking();
    }
  }

  private setupWebVitals() {
    // Core Web Vitals monitoring
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(this.recordMetric.bind(this));
      getFID(this.recordMetric.bind(this));
      getFCP(this.recordMetric.bind(this));
      getLCP(this.recordMetric.bind(this));
      getTTFB(this.recordMetric.bind(this));
    });
  }

  private setupCustomMetrics() {
    // Performance Observer for navigation timing
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric({
            name: entry.name,
            value: entry.duration,
            entryType: entry.entryType,
          });
        }
      });

      observer.observe({ entryTypes: ['navigation', 'resource', 'measure'] });
      this.observers.push(observer);
    }
  }

  private setupErrorTracking() {
    window.addEventListener('error', (event) => {
      this.recordError({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.recordError({
        type: 'promise',
        reason: event.reason,
      });
    });
  }

  recordMetric(metric) {
    this.metrics.set(metric.name, {
      ...metric,
      timestamp: Date.now(),
    });

    // Send to analytics service
    this.sendToAnalytics('performance', metric);
  }

  recordError(error) {
    console.error('Performance Monitor - Error:', error);
    this.sendToAnalytics('error', error);
  }

  private sendToAnalytics(type, data) {
    // Send to your analytics service (Firebase, etc.)
    if (typeof window.gtag === 'function') {
      window.gtag('event', type, data);
    }
  }

  getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics.clear();
  }
}

export default new PerformanceMonitoringService();
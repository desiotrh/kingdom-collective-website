import { AppState, Platform, DeviceEventEmitter } from 'react-native';

interface MemoryWarning {
  timestamp: number;
  type: 'warning' | 'critical';
  availableMemory?: number;
  usedMemory?: number;
}

interface MemoryStats {
  totalMemory: number;
  usedMemory: number;
  freeMemory: number;
  memoryPressure: 'low' | 'medium' | 'high' | 'critical';
}

class MemoryOptimizationService {
  private memoryWarnings: MemoryWarning[] = [];
  private memoryCheckInterval: NodeJS.Timeout | null = null;
  private memoryThresholds = {
    warning: 150 * 1024 * 1024, // 150MB
    critical: 200 * 1024 * 1024, // 200MB
  };
  private cleanupCallbacks: Array<() => void> = [];
  private isMonitoring = false;

  constructor() {
    this.setupMemoryWarningListeners();
    this.setupAppStateListener();
  }

  // Start memory monitoring
  startMonitoring(intervalMs: number = 30000): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    
    this.memoryCheckInterval = setInterval(() => {
      this.checkMemoryUsage();
    }, intervalMs);

    console.log('🧠 Memory monitoring started');
  }

  // Stop memory monitoring
  stopMonitoring(): void {
    if (this.memoryCheckInterval) {
      clearInterval(this.memoryCheckInterval);
      this.memoryCheckInterval = null;
    }
    this.isMonitoring = false;
    console.log('🧠 Memory monitoring stopped');
  }

  // Register cleanup callback for memory pressure
  registerCleanupCallback(callback: () => void): () => void {
    this.cleanupCallbacks.push(callback);
    
    // Return unregister function
    return () => {
      const index = this.cleanupCallbacks.indexOf(callback);
      if (index > -1) {
        this.cleanupCallbacks.splice(index, 1);
      }
    };
  }

  // Get current memory statistics
  async getMemoryStats(): Promise<MemoryStats | null> {
    try {
      if (Platform.OS === 'android') {
        // Android-specific memory info
        return this.getAndroidMemoryStats();
      } else if (Platform.OS === 'ios') {
        // iOS-specific memory info
        return this.getIOSMemoryStats();
      }
      return null;
    } catch (error) {
      console.warn('Memory stats error:', error);
      return null;
    }
  }

  // Force garbage collection (if available)
  forceGarbageCollection(): void {
    try {
      if (global.gc) {
        global.gc();
        console.log('🗑️ Forced garbage collection');
      } else {
        console.warn('Garbage collection not available');
      }
    } catch (error) {
      console.warn('GC error:', error);
    }
  }

  // Clean up cached data
  async performMemoryCleanup(): Promise<void> {
    try {
      console.log('🧹 Starting memory cleanup...');

      // Run all registered cleanup callbacks
      for (const callback of this.cleanupCallbacks) {
        try {
          callback();
        } catch (error) {
          console.warn('Cleanup callback error:', error);
        }
      }

      // Clear image caches
      await this.clearImageCaches();

      // Clear API caches
      await this.clearAPICaches();

      // Force garbage collection
      this.forceGarbageCollection();

      console.log('✅ Memory cleanup completed');
    } catch (error) {
      console.error('Memory cleanup error:', error);
    }
  }

  // Monitor for memory leaks
  detectMemoryLeaks(): void {
    const initialTime = Date.now();
    let initialMemory: number | null = null;

    const checkLeak = async () => {
      try {
        const stats = await this.getMemoryStats();
        if (!stats) return;

        if (initialMemory === null) {
          initialMemory = stats.usedMemory;
          return;
        }

        const timeDiff = Date.now() - initialTime;
        const memoryDiff = stats.usedMemory - initialMemory;
        
        // Check for significant memory growth over time
        if (timeDiff > 300000 && memoryDiff > 50 * 1024 * 1024) { // 5 minutes, 50MB
          console.warn('🚨 Potential memory leak detected:', {
            timeElapsed: `${Math.round(timeDiff / 1000)}s`,
            memoryGrowth: `${Math.round(memoryDiff / 1024 / 1024)}MB`,
          });
        }
      } catch (error) {
        console.warn('Memory leak detection error:', error);
      }
    };

    // Check every 60 seconds
    setInterval(checkLeak, 60000);
  }

  // Get memory usage warnings
  getMemoryWarnings(): MemoryWarning[] {
    return [...this.memoryWarnings];
  }

  // Clear memory warnings
  clearMemoryWarnings(): void {
    this.memoryWarnings = [];
  }

  // Setup memory warning listeners
  private setupMemoryWarningListeners(): void {
    if (Platform.OS === 'ios') {
      // iOS memory warnings
      DeviceEventEmitter.addListener('memoryWarning', this.handleMemoryWarning);
    } else if (Platform.OS === 'android') {
      // Android memory warnings (if available)
      DeviceEventEmitter.addListener('lowMemory', this.handleMemoryWarning);
    }
  }

  // Setup app state listener for cleanup
  private setupAppStateListener(): void {
    AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'background') {
        // App went to background - good time to cleanup
        this.performMemoryCleanup();
      } else if (nextAppState === 'inactive') {
        // App becoming inactive - minor cleanup
        this.forceGarbageCollection();
      }
    });
  }

  // Handle memory warnings
  private handleMemoryWarning = async (): Promise<void> => {
    const warning: MemoryWarning = {
      timestamp: Date.now(),
      type: 'warning',
    };

    try {
      const stats = await this.getMemoryStats();
      if (stats) {
        warning.usedMemory = stats.usedMemory;
        warning.availableMemory = stats.freeMemory;
        
        if (stats.usedMemory > this.memoryThresholds.critical) {
          warning.type = 'critical';
        }
      }
    } catch (error) {
      console.warn('Memory warning handling error:', error);
    }

    this.memoryWarnings.push(warning);
    
    // Keep only last 50 warnings
    if (this.memoryWarnings.length > 50) {
      this.memoryWarnings = this.memoryWarnings.slice(-50);
    }

    console.warn(`🚨 Memory ${warning.type}:`, warning);

    // Trigger cleanup on warning
    await this.performMemoryCleanup();
  };

  // Check current memory usage
  private async checkMemoryUsage(): Promise<void> {
    try {
      const stats = await this.getMemoryStats();
      if (!stats) return;

      if (stats.usedMemory > this.memoryThresholds.warning) {
        console.warn('⚠️ Memory usage above threshold:', {
          used: `${Math.round(stats.usedMemory / 1024 / 1024)}MB`,
          threshold: `${Math.round(this.memoryThresholds.warning / 1024 / 1024)}MB`,
        });

        if (stats.usedMemory > this.memoryThresholds.critical) {
          await this.handleMemoryWarning();
        }
      }
    } catch (error) {
      console.warn('Memory check error:', error);
    }
  }

  // Android-specific memory stats
  private async getAndroidMemoryStats(): Promise<MemoryStats> {
    // Placeholder for Android-specific implementation
    // In a real app, you might use native modules or system APIs
    return {
      totalMemory: 4 * 1024 * 1024 * 1024, // 4GB placeholder
      usedMemory: 150 * 1024 * 1024, // 150MB placeholder
      freeMemory: 3.85 * 1024 * 1024 * 1024, // Calculated
      memoryPressure: 'low',
    };
  }

  // iOS-specific memory stats
  private async getIOSMemoryStats(): Promise<MemoryStats> {
    // Placeholder for iOS-specific implementation
    // In a real app, you might use native modules or system APIs
    return {
      totalMemory: 6 * 1024 * 1024 * 1024, // 6GB placeholder
      usedMemory: 180 * 1024 * 1024, // 180MB placeholder
      freeMemory: 5.82 * 1024 * 1024 * 1024, // Calculated
      memoryPressure: 'low',
    };
  }

  // Clear image caches
  private async clearImageCaches(): Promise<void> {
    try {
      // This would integrate with your image caching system
      console.log('🖼️ Clearing image caches...');
      // Implementation depends on your caching strategy
    } catch (error) {
      console.warn('Image cache clear error:', error);
    }
  }

  // Clear API caches
  private async clearAPICaches(): Promise<void> {
    try {
      // This would integrate with your API caching system
      console.log('🌐 Clearing API caches...');
      // Implementation depends on your caching strategy
    } catch (error) {
      console.warn('API cache clear error:', error);
    }
  }
}

// React hook for memory optimization
export const useMemoryOptimization = () => {
  const memoryService = new MemoryOptimizationService();

  const registerCleanup = (callback: () => void) => {
    return memoryService.registerCleanupCallback(callback);
  };

  const getMemoryStats = async () => {
    return await memoryService.getMemoryStats();
  };

  const forceCleanup = async () => {
    await memoryService.performMemoryCleanup();
  };

  return {
    registerCleanup,
    getMemoryStats,
    forceCleanup,
    memoryService,
  };
};

export default new MemoryOptimizationService();

import { useEffect, useRef, useCallback } from 'react';

export const useMemoryOptimization = () => {
  const imageCache = useRef(new Map<string, string>());
  const componentCache = useRef(new Map<string, React.ComponentType>());
  
  // Image memory management
  const optimizeImage = useCallback((uri: string, maxWidth: number = 800) => {
    const cacheKey = `${uri}:${maxWidth}`;
    
    if (imageCache.current.has(cacheKey)) {
      return imageCache.current.get(cacheKey);
    }

    // Create optimized image URL
    const optimizedUri = `${uri}?w=${maxWidth}&q=80&f=webp`;
    imageCache.current.set(cacheKey, optimizedUri);
    
    return optimizedUri;
  }, []);

  // Component memory cleanup
  const cleanupComponent = useCallback((componentId: string) => {
    componentCache.current.delete(componentId);
  }, []);

  // Memory monitoring
  const getMemoryUsage = useCallback(() => {
    if (typeof performance !== 'undefined' && performance.memory) {
      return {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit,
      };
    }
    return null;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      imageCache.current.clear();
      componentCache.current.clear();
    };
  }, []);

  return {
    optimizeImage,
    cleanupComponent,
    getMemoryUsage,
    imageCache: imageCache.current.size,
    componentCache: componentCache.current.size,
  };
};

// Memory leak detector
export const useMemoryLeakDetector = (componentName: string) => {
  const mountTime = useRef(Date.now());
  const initialMemory = useRef<number | null>(null);

  useEffect(() => {
    if (typeof performance !== 'undefined' && performance.memory) {
      initialMemory.current = performance.memory.usedJSHeapSize;
    }

    return () => {
      if (typeof performance !== 'undefined' && performance.memory && initialMemory.current) {
        const finalMemory = performance.memory.usedJSHeapSize;
        const memoryDiff = finalMemory - initialMemory.current;
        const timeAlive = Date.now() - mountTime.current;

        if (memoryDiff > 10 * 1024 * 1024) { // 10MB threshold
          console.warn(
            `🚨 Potential memory leak in ${componentName}: ${(memoryDiff / 1024 / 1024).toFixed(2)}MB after ${timeAlive}ms`
          );
        }
      }
    };
  }, [componentName]);
};
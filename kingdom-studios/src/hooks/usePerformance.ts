import { useCallback, useRef } from 'react';

/**
 * Debounce hook to prevent rapid-fire function calls
 * Critical for preventing API spam on content generation
 */
export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    (...args: Parameters<T>) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => callback(...args), delay);
    },
    [callback, delay]
  ) as T;
};

/**
 * Throttle hook to limit function execution frequency
 */
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastRun = useRef<number>(0);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastRun.current >= delay) {
        lastRun.current = now;
        return callback(...args);
      }
    },
    [callback, delay]
  ) as T;
};

/**
 * Memory management hook for cleaning up subscriptions and timers
 */
export const useCleanup = () => {
  const cleanupFunctions = useRef<(() => void)[]>([]);

  const addCleanup = useCallback((fn: () => void) => {
    cleanupFunctions.current.push(fn);
  }, []);

  const cleanup = useCallback(() => {
    cleanupFunctions.current.forEach(fn => {
      try {
        fn();
      } catch (error) {
        console.error('Cleanup function error:', error);
      }
    });
    cleanupFunctions.current = [];
  }, []);

  return { addCleanup, cleanup };
};

/**
 * Performance monitoring hook
 */
export const usePerformanceMonitor = (componentName: string) => {
  const markStart = useCallback((operation: string) => {
    const mark = `${componentName}-${operation}-start`;
    if (typeof performance !== 'undefined') {
      performance.mark(mark);
    }
    return mark;
  }, [componentName]);

  const markEnd = useCallback((operation: string, startMark: string) => {
    const endMark = `${componentName}-${operation}-end`;
    if (typeof performance !== 'undefined') {
      performance.mark(endMark);
      performance.measure(`${componentName}-${operation}`, startMark, endMark);
    }
  }, [componentName]);

  return { markStart, markEnd };
};

import Redis from 'ioredis';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AdvancedCacheService {
  private redis: Redis | null = null;
  private localCache = new Map<string, { data: any; expiry: number }>();

  constructor() {
    // Initialize Redis for server-side caching
    if (typeof window === 'undefined') {
      this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    }
  }

  async set(key: string, value: any, ttl: number = 300): Promise<void> {
    const expiry = Date.now() + (ttl * 1000);
    
    try {
      // Server-side Redis cache
      if (this.redis) {
        await this.redis.setex(key, ttl, JSON.stringify({ data: value, expiry }));
      }
      
      // Client-side local cache
      this.localCache.set(key, { data: value, expiry });
      
      // React Native AsyncStorage cache
      if (typeof AsyncStorage !== 'undefined') {
        await AsyncStorage.setItem(
          `cache:${key}`,
          JSON.stringify({ data: value, expiry })
        );
      }
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async get(key: string): Promise<any | null> {
    try {
      // Try local cache first (fastest)
      const localCached = this.localCache.get(key);
      if (localCached && localCached.expiry > Date.now()) {
        return localCached.data;
      }

      // Try Redis cache (server-side)
      if (this.redis) {
        const redisCached = await this.redis.get(key);
        if (redisCached) {
          const parsed = JSON.parse(redisCached);
          if (parsed.expiry > Date.now()) {
            // Update local cache
            this.localCache.set(key, parsed);
            return parsed.data;
          }
        }
      }

      // Try AsyncStorage cache (React Native)
      if (typeof AsyncStorage !== 'undefined') {
        const storageCached = await AsyncStorage.getItem(`cache:${key}`);
        if (storageCached) {
          const parsed = JSON.parse(storageCached);
          if (parsed.expiry > Date.now()) {
            // Update local cache
            this.localCache.set(key, parsed);
            return parsed.data;
          }
        }
      }

      return null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async invalidate(pattern: string): Promise<void> {
    try {
      // Clear local cache
      for (const [key] of this.localCache) {
        if (key.includes(pattern)) {
          this.localCache.delete(key);
        }
      }

      // Clear Redis cache
      if (this.redis) {
        const keys = await this.redis.keys(`*${pattern}*`);
        if (keys.length > 0) {
          await this.redis.del(...keys);
        }
      }

      // Clear AsyncStorage cache
      if (typeof AsyncStorage !== 'undefined') {
        const allKeys = await AsyncStorage.getAllKeys();
        const cacheKeys = allKeys.filter(key => 
          key.startsWith('cache:') && key.includes(pattern)
        );
        if (cacheKeys.length > 0) {
          await AsyncStorage.multiRemove(cacheKeys);
        }
      }
    } catch (error) {
      console.error('Cache invalidation error:', error);
    }
  }

  getStats(): { localSize: number; keys: string[] } {
    return {
      localSize: this.localCache.size,
      keys: Array.from(this.localCache.keys()),
    };
  }
}

export default new AdvancedCacheService();
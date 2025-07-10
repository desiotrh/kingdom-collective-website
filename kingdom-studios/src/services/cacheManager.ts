import AsyncStorage from '@react-native-async-storage/async-storage';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiryTime: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  version?: string; // Cache version for invalidation
}

class CacheManager {
  private static instance: CacheManager;
  private defaultTTL = 5 * 60 * 1000; // 5 minutes default
  private cachePrefix = 'kingdom_cache_';
  private versionKey = 'cache_version';

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  // Set cache with optional TTL
  async set<T>(key: string, data: T, options: CacheOptions = {}): Promise<void> {
    try {
      const ttl = options.ttl || this.defaultTTL;
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        expiryTime: Date.now() + ttl,
      };

      const cacheKey = this.getCacheKey(key);
      await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheItem));

      // Set version if provided
      if (options.version) {
        await AsyncStorage.setItem(`${cacheKey}_version`, options.version);
      }
    } catch (error) {
      console.warn('Cache set error:', error);
    }
  }

  // Get cache with automatic expiry check
  async get<T>(key: string, version?: string): Promise<T | null> {
    try {
      const cacheKey = this.getCacheKey(key);
      
      // Check version if provided
      if (version) {
        const storedVersion = await AsyncStorage.getItem(`${cacheKey}_version`);
        if (storedVersion !== version) {
          await this.delete(key);
          return null;
        }
      }

      const cached = await AsyncStorage.getItem(cacheKey);
      if (!cached) return null;

      const cacheItem: CacheItem<T> = JSON.parse(cached);
      
      // Check if expired
      if (Date.now() > cacheItem.expiryTime) {
        await this.delete(key);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.warn('Cache get error:', error);
      return null;
    }
  }

  // Delete specific cache
  async delete(key: string): Promise<void> {
    try {
      const cacheKey = this.getCacheKey(key);
      await AsyncStorage.removeItem(cacheKey);
      await AsyncStorage.removeItem(`${cacheKey}_version`);
    } catch (error) {
      console.warn('Cache delete error:', error);
    }
  }

  // Clear all cache
  async clear(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(this.cachePrefix));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.warn('Cache clear error:', error);
    }
  }

  // Clear expired cache
  async clearExpired(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(this.cachePrefix));
      
      for (const key of cacheKeys) {
        const cached = await AsyncStorage.getItem(key);
        if (cached) {
          try {
            const cacheItem: CacheItem<any> = JSON.parse(cached);
            if (Date.now() > cacheItem.expiryTime) {
              await AsyncStorage.removeItem(key);
            }
          } catch {
            // Invalid cache item, remove it
            await AsyncStorage.removeItem(key);
          }
        }
      }
    } catch (error) {
      console.warn('Cache clear expired error:', error);
    }
  }

  // Get cache statistics
  async getStats(): Promise<{ totalItems: number; totalSize: number; expiredItems: number }> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(this.cachePrefix));
      
      let totalSize = 0;
      let expiredItems = 0;
      
      for (const key of cacheKeys) {
        const cached = await AsyncStorage.getItem(key);
        if (cached) {
          totalSize += cached.length;
          try {
            const cacheItem: CacheItem<any> = JSON.parse(cached);
            if (Date.now() > cacheItem.expiryTime) {
              expiredItems++;
            }
          } catch {
            expiredItems++;
          }
        }
      }

      return {
        totalItems: cacheKeys.length,
        totalSize,
        expiredItems,
      };
    } catch (error) {
      console.warn('Cache stats error:', error);
      return { totalItems: 0, totalSize: 0, expiredItems: 0 };
    }
  }

  private getCacheKey(key: string): string {
    return `${this.cachePrefix}${key}`;
  }
}

// API Response Cache Helper
export class APICache {
  private cache = CacheManager.getInstance();
  private apiVersion = '1.0';

  async cacheResponse<T>(endpoint: string, params: any, data: T, ttl?: number): Promise<void> {
    const key = this.generateKey(endpoint, params);
    await this.cache.set(key, data, { ttl, version: this.apiVersion });
  }

  async getCachedResponse<T>(endpoint: string, params: any): Promise<T | null> {
    const key = this.generateKey(endpoint, params);
    return await this.cache.get<T>(key, this.apiVersion);
  }

  async invalidateEndpoint(endpoint: string): Promise<void> {
    // This would require tracking keys by endpoint - simplified for now
    await this.cache.clear();
  }

  private generateKey(endpoint: string, params: any): string {
    const paramsString = JSON.stringify(params, Object.keys(params).sort());
    return `api_${endpoint}_${Buffer.from(paramsString).toString('base64')}`;
  }
}

// Image Cache Helper
export class ImageCache {
  private cache = CacheManager.getInstance();
  private imageVersion = '1.0';

  async cacheImageData(url: string, data: string): Promise<void> {
    const key = `image_${Buffer.from(url).toString('base64')}`;
    await this.cache.set(key, data, { 
      ttl: 24 * 60 * 60 * 1000, // 24 hours
      version: this.imageVersion 
    });
  }

  async getCachedImageData(url: string): Promise<string | null> {
    const key = `image_${Buffer.from(url).toString('base64')}`;
    return await this.cache.get<string>(key, this.imageVersion);
  }
}

// User Data Cache Helper
export class UserDataCache {
  private cache = CacheManager.getInstance();
  private userVersion = '1.0';

  async cacheUserData<T>(userId: string, dataType: string, data: T): Promise<void> {
    const key = `user_${userId}_${dataType}`;
    await this.cache.set(key, data, { 
      ttl: 10 * 60 * 1000, // 10 minutes
      version: this.userVersion 
    });
  }

  async getCachedUserData<T>(userId: string, dataType: string): Promise<T | null> {
    const key = `user_${userId}_${dataType}`;
    return await this.cache.get<T>(key, this.userVersion);
  }

  async invalidateUserData(userId: string): Promise<void> {
    // Clear all user-specific cache
    const cache = CacheManager.getInstance();
    // This is a simplified implementation
    await cache.clear();
  }
}

export default CacheManager;

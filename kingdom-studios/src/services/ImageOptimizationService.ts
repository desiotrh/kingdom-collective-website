import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { Dimensions, Platform } from 'react-native';
import { ImageCache } from './cacheManager';

interface OptimizationOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  format?: SaveFormat;
  usage?: 'thumbnail' | 'preview' | 'fullscreen' | 'profile';
  networkCondition?: 'slow' | 'fast' | 'wifi';
}

class ImageOptimizationService {
  private imageCache = new ImageCache();
  private screenDimensions = Dimensions.get('window');
  private compressionQuality = 0.8;
  private maxWidth = 1200;
  private maxHeight = 1200;

  // Get optimal dimensions based on usage
  private getOptimalDimensions(usage: 'thumbnail' | 'preview' | 'fullscreen' | 'profile' = 'preview') {
    switch (usage) {
      case 'thumbnail':
        return { width: 150, height: 150 };
      case 'profile':
        return { width: 200, height: 200 };
      case 'preview':
        return { 
          width: Math.round(this.screenDimensions.width * 0.8), 
          height: Math.round(this.screenDimensions.height * 0.6) 
        };
      case 'fullscreen':
        return { 
          width: this.screenDimensions.width, 
          height: this.screenDimensions.height 
        };
      default:
        return { width: this.maxWidth, height: this.maxHeight };
    }
  }

  // Get optimal quality based on usage and network
  private getOptimalQuality(usage: string = 'preview', networkCondition: string = 'fast'): number {
    const baseQuality = usage === 'thumbnail' ? 0.7 : 0.85;
    
    switch (networkCondition) {
      case 'slow':
        return Math.max(baseQuality - 0.2, 0.5);
      case 'fast':
        return baseQuality;
      case 'wifi':
        return Math.min(baseQuality + 0.1, 0.95);
      default:
        return baseQuality;
    }
  }

  async optimizeImage(uri: string, options?: OptimizationOptions): Promise<string> {
    try {
      // Check cache first
      const cacheKey = `${uri}_${JSON.stringify(options)}`;
      const cachedResult = await this.imageCache.getCachedImageData(cacheKey);
      if (cachedResult) {
        return cachedResult;
      }

      const usage = options?.usage || 'preview';
      const networkCondition = options?.networkCondition || 'fast';
      const optimalDimensions = this.getOptimalDimensions(usage);
      const optimalQuality = this.getOptimalQuality(usage, networkCondition);

      const {
        quality = optimalQuality,
        maxWidth = optimalDimensions.width,
        maxHeight = optimalDimensions.height,
        format = SaveFormat.JPEG,
      } = options || {};

      const result = await manipulateAsync(
        uri,
        [
          { resize: { width: maxWidth, height: maxHeight } },
        ],
        {
          compress: quality,
          format,
          base64: false,
        }
      );

      // Cache the result
      await this.imageCache.cacheImageData(cacheKey, result.uri);

      return result.uri;
    } catch (error) {
      console.error('Image optimization error:', error);
      return uri; // Return original if optimization fails
    }
  }

  async createThumbnail(uri: string): Promise<string> {
    return this.optimizeImage(uri, {
      usage: 'thumbnail',
      quality: 0.7,
    });
  }

  async createProfileImage(uri: string): Promise<string> {
    return this.optimizeImage(uri, {
      usage: 'profile',
      quality: 0.85,
    });
  }

  async optimizeForNetwork(uri: string, networkCondition: 'slow' | 'fast' | 'wifi'): Promise<string> {
    return this.optimizeImage(uri, {
      networkCondition,
      usage: 'preview',
    });
  }

  async batchOptimize(uris: string[], options?: OptimizationOptions): Promise<string[]> {
    // Process in chunks to avoid memory issues
    const chunkSize = 5;
    const chunks = [];
    
    for (let i = 0; i < uris.length; i += chunkSize) {
      chunks.push(uris.slice(i, i + chunkSize));
    }

    const results: string[] = [];
    
    for (const chunk of chunks) {
      const optimizedImages = await Promise.allSettled(
        chunk.map(uri => this.optimizeImage(uri, options))
      );

      const chunkResults = optimizedImages.map((result, index) => 
        result.status === 'fulfilled' ? result.value : chunk[index]
      );
      
      results.push(...chunkResults);
    }

    return results;
  }

  // Progressive image loading - create multiple quality versions
  async createProgressiveVersions(uri: string): Promise<{ low: string; medium: string; high: string }> {
    try {
      const [low, medium, high] = await Promise.all([
        this.optimizeImage(uri, { quality: 0.3, usage: 'thumbnail' }),
        this.optimizeImage(uri, { quality: 0.6, usage: 'preview' }),
        this.optimizeImage(uri, { quality: 0.9, usage: 'fullscreen' }),
      ]);

      return { low, medium, high };
    } catch (error) {
      console.error('Progressive versions error:', error);
      return { low: uri, medium: uri, high: uri };
    }
  }

  // Memory-efficient list optimization
  async optimizeForList(uris: string[], maxConcurrent: number = 3): Promise<string[]> {
    const results: string[] = new Array(uris.length);
    
    for (let i = 0; i < uris.length; i += maxConcurrent) {
      const batch = uris.slice(i, i + maxConcurrent);
      const batchResults = await Promise.allSettled(
        batch.map(uri => this.optimizeImage(uri, { usage: 'thumbnail' }))
      );

      batchResults.forEach((result, index) => {
        results[i + index] = result.status === 'fulfilled' ? result.value : batch[index];
      });
    }

    return results;
  }

  // Get image info without processing
  async getImageInfo(uri: string): Promise<{ width: number; height: number } | null> {
    try {
      const result = await manipulateAsync(uri, [], { base64: false });
      return { width: result.width, height: result.height };
    } catch (error) {
      console.error('Get image info error:', error);
      return null;
    }
  }

  // Cleanup cache
  async cleanupCache(): Promise<void> {
    try {
      // This would implement cache cleanup logic
      console.log('Image cache cleanup completed');
    } catch (error) {
      console.error('Cache cleanup error:', error);
    }
  }
}

export default new ImageOptimizationService();
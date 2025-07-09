import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

class ImageOptimizationService {
  private compressionQuality = 0.8;
  private maxWidth = 1200;
  private maxHeight = 1200;

  async optimizeImage(uri: string, options?: {
    quality?: number;
    maxWidth?: number;
    maxHeight?: number;
    format?: SaveFormat;
  }): Promise<string> {
    try {
      const {
        quality = this.compressionQuality,
        maxWidth = this.maxWidth,
        maxHeight = this.maxHeight,
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

      return result.uri;
    } catch (error) {
      console.error('Image optimization error:', error);
      return uri; // Return original if optimization fails
    }
  }

  async createThumbnail(uri: string): Promise<string> {
    return this.optimizeImage(uri, {
      maxWidth: 300,
      maxHeight: 300,
      quality: 0.7,
    });
  }

  async batchOptimize(uris: string[]): Promise<string[]> {
    const optimizedImages = await Promise.allSettled(
      uris.map(uri => this.optimizeImage(uri))
    );

    return optimizedImages.map((result, index) => 
      result.status === 'fulfilled' ? result.value : uris[index]
    );
  }
}

export default new ImageOptimizationService();
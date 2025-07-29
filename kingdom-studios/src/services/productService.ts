/**
 * 🛍️ PRODUCT SERVICE - KINGDOM STUDIOS
 * Handles all product operations through the unified API
 * 
 * This service provides product management functionality:
 * - Product creation and management
 * - Product listing and filtering
 * - Product updates and deletion
 * - Platform integration
 * - Analytics tracking
 */

import { kingdomStudiosApi } from './unifiedApiService';

export interface Product {
  id?: string;
  userId: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  images: string[];
  platforms: Array<{
    platform: 'etsy' | 'printify' | 'shopify' | 'amazon';
    platformId: string;
    url: string;
    status: 'active' | 'inactive' | 'pending';
    lastSyncAt?: Date;
  }>;
  tags: string[];
  category: string;
  status: 'draft' | 'published' | 'archived';
  analytics: {
    views: number;
    clicks: number;
    conversions: number;
  };
  metadata?: {
    seoTitle?: string;
    seoDescription?: string;
    keywords?: string[];
    targetAudience?: string[];
    profitMargin?: number;
    costOfGoods?: number;
    shippingWeight?: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
      unit: 'cm' | 'inch';
    };
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductCreateData {
  name: string;
  description?: string;
  price: number;
  currency: string;
  images?: string[];
  platforms?: Array<{
    platform: 'etsy' | 'printify' | 'shopify' | 'amazon';
    platformId: string;
    url: string;
    status: 'active' | 'inactive' | 'pending';
  }>;
  tags?: string[];
  category: string;
  status?: 'draft' | 'published' | 'archived';
  metadata?: Partial<Product['metadata']>;
}

export interface ProductUpdateData {
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  images?: string[];
  platforms?: Array<{
    platform: 'etsy' | 'printify' | 'shopify' | 'amazon';
    platformId: string;
    url: string;
    status: 'active' | 'inactive' | 'pending';
  }>;
  tags?: string[];
  category?: string;
  status?: 'draft' | 'published' | 'archived';
  analytics?: Partial<Product['analytics']>;
  metadata?: Partial<Product['metadata']>;
}

export interface ProductFilters {
  status?: 'draft' | 'published' | 'archived';
  category?: string;
  platform?: 'etsy' | 'printify' | 'shopify' | 'amazon';
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  search?: string;
}

export class ProductService {
  private static instance: ProductService;

  private constructor() {}

  static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  /**
   * Create a new product
   */
  async createProduct(productData: ProductCreateData): Promise<{ success: boolean; productId?: string; error?: string }> {
    try {
      const result = await kingdomStudiosApi.createProduct(productData);
      
      if (result.success) {
        console.log('[Product] Product created successfully');
        return { success: true, productId: result.data?.id };
      }
      
      console.error('[Product] Failed to create product:', result.error);
      return { success: false, error: result.error };
    } catch (error) {
      console.error('[Product] Error creating product:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create product' 
      };
    }
  }

  /**
   * Get all products for the current user
   */
  async getUserProducts(filters?: ProductFilters): Promise<Product[]> {
    try {
      const result = await kingdomStudiosApi.getUserProducts(filters);
      
      if (result.success && result.data) {
        return result.data as Product[];
      }
      
      return [];
    } catch (error) {
      console.error('[Product] Error getting user products:', error);
      return [];
    }
  }

  /**
   * Get a specific product by ID
   */
  async getProduct(productId: string): Promise<Product | null> {
    try {
      const result = await kingdomStudiosApi.getProduct(productId);
      
      if (result.success && result.data) {
        return result.data as Product;
      }
      
      return null;
    } catch (error) {
      console.error('[Product] Error getting product:', error);
      return null;
    }
  }

  /**
   * Update a product
   */
  async updateProduct(productId: string, updates: ProductUpdateData): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await kingdomStudiosApi.updateProduct(productId, updates);
      
      if (result.success) {
        console.log('[Product] Product updated successfully');
        return { success: true };
      }
      
      console.error('[Product] Failed to update product:', result.error);
      return { success: false, error: result.error };
    } catch (error) {
      console.error('[Product] Error updating product:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update product' 
      };
    }
  }

  /**
   * Delete a product
   */
  async deleteProduct(productId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await kingdomStudiosApi.deleteProduct(productId);
      
      if (result.success) {
        console.log('[Product] Product deleted successfully');
        return { success: true };
      }
      
      console.error('[Product] Failed to delete product:', result.error);
      return { success: false, error: result.error };
    } catch (error) {
      console.error('[Product] Error deleting product:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete product' 
      };
    }
  }

  /**
   * Sync product with platforms
   */
  async syncProductWithPlatforms(productId: string, platforms: string[]): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await kingdomStudiosApi.syncProductWithPlatforms(productId, platforms);
      
      if (result.success) {
        console.log('[Product] Product synced with platforms successfully');
        return { success: true };
      }
      
      console.error('[Product] Failed to sync product with platforms:', result.error);
      return { success: false, error: result.error };
    } catch (error) {
      console.error('[Product] Error syncing product with platforms:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to sync product' 
      };
    }
  }

  /**
   * Get product analytics
   */
  async getProductAnalytics(productId: string): Promise<{ success: boolean; analytics?: any; error?: string }> {
    try {
      const result = await kingdomStudiosApi.getProductAnalytics(productId);
      
      if (result.success && result.data) {
        return { success: true, analytics: result.data };
      }
      
      return { success: false, error: result.error };
    } catch (error) {
      console.error('[Product] Error getting product analytics:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get analytics' 
      };
    }
  }

  /**
   * Upload product images
   */
  async uploadProductImages(productId: string, images: string[]): Promise<{ success: boolean; imageUrls?: string[]; error?: string }> {
    try {
      const result = await kingdomStudiosApi.uploadProductImages(productId, images);
      
      if (result.success && result.data) {
        console.log('[Product] Product images uploaded successfully');
        return { success: true, imageUrls: result.data };
      }
      
      console.error('[Product] Failed to upload product images:', result.error);
      return { success: false, error: result.error };
    } catch (error) {
      console.error('[Product] Error uploading product images:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to upload images' 
      };
    }
  }

  /**
   * Validate product data
   */
  validateProductData(product: Partial<Product>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!product.name || product.name.trim().length === 0) {
      errors.push('Product name is required');
    }

    if (product.name && product.name.length > 100) {
      errors.push('Product name must be less than 100 characters');
    }

    if (product.price !== undefined && product.price < 0) {
      errors.push('Product price must be non-negative');
    }

    if (product.price !== undefined && product.price > 999999) {
      errors.push('Product price must be less than $1,000,000');
    }

    if (product.description && product.description.length > 2000) {
      errors.push('Product description must be less than 2000 characters');
    }

    if (product.tags && product.tags.length > 20) {
      errors.push('Product cannot have more than 20 tags');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get default product data
   */
  getDefaultProductData(userId: string): ProductCreateData {
    return {
      name: '',
      description: '',
      price: 0,
      currency: 'USD',
      images: [],
      platforms: [],
      tags: [],
      category: 'general',
      status: 'draft',
      metadata: {
        seoTitle: '',
        seoDescription: '',
        keywords: [],
        targetAudience: [],
        profitMargin: 0,
        costOfGoods: 0,
        shippingWeight: 0,
        dimensions: {
          length: 0,
          width: 0,
          height: 0,
          unit: 'cm'
        }
      }
    };
  }

  /**
   * Get product categories
   */
  getProductCategories(): string[] {
    return [
      'general',
      'clothing',
      'accessories',
      'home-decor',
      'jewelry',
      'art',
      'books',
      'electronics',
      'toys',
      'beauty',
      'health',
      'sports',
      'automotive',
      'garden',
      'office',
      'kitchen',
      'bathroom',
      'bedroom',
      'living-room',
      'outdoor'
    ];
  }

  /**
   * Get product statuses
   */
  getProductStatuses(): Array<{ value: Product['status']; label: string }> {
    return [
      { value: 'draft', label: 'Draft' },
      { value: 'published', label: 'Published' },
      { value: 'archived', label: 'Archived' }
    ];
  }

  /**
   * Get supported platforms
   */
  getSupportedPlatforms(): Array<{ value: Product['platforms'][0]['platform']; label: string; icon: string }> {
    return [
      { value: 'etsy', label: 'Etsy', icon: '🛍️' },
      { value: 'printify', label: 'Printify', icon: '🖨️' },
      { value: 'shopify', label: 'Shopify', icon: '🛒' },
      { value: 'amazon', label: 'Amazon', icon: '📦' }
    ];
  }
}

export const productService = ProductService.getInstance(); 
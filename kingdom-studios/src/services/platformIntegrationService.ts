import Constants from 'expo-constants';
import axios from 'axios';

// Type override for extra config
type AppConfig = typeof Constants.expoConfig & {
  extra?: {
    etsyApiKey: string;
    printifyApiKey: string;
    shopifyApiKey: string;
    shopifyStoreUrl: string;
  };
};

export interface PlatformProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  platform: 'Etsy' | 'Printify' | 'Shopify' | 'Amazon';
  platformProductId: string;
  status: 'active' | 'draft' | 'archived';
  inventory: number;
  tags: string[];
  category: string;
  lastSync: Date;
  stats: {
    views: number;
    sales: number;
    revenue: number;
    clickThroughRate: number;
  };
}

class PlatformIntegrationService {
  private static instance: PlatformIntegrationService;
  private config: AppConfig['extra'];

  private constructor() {
    this.config = (Constants.expoConfig as AppConfig).extra;
  }

  static getInstance(): PlatformIntegrationService {
    if (!PlatformIntegrationService.instance) {
      PlatformIntegrationService.instance = new PlatformIntegrationService();
    }
    return PlatformIntegrationService.instance;
  }

  // Etsy API Integration
  async syncEtsyProducts(): Promise<PlatformProduct[]> {
    if (!this.config?.etsyApiKey) {
      throw new Error('Etsy API key not configured');
    }

    try {
      // Note: This is a simplified example. Real Etsy API requires OAuth setup
      const response = await axios.get(
        'https://openapi.etsy.com/v3/application/shops/me/listings/active',
        {
          headers: {
            'Authorization': `Bearer ${this.config.etsyApiKey}`,
            'x-api-key': this.config.etsyApiKey,
          }
        }
      );

      return response.data.results.map((item: any): PlatformProduct => ({
        id: `etsy_${item.listing_id}`,
        title: item.title,
        description: item.description || '',
        price: parseFloat(item.price.amount) / 100,
        imageUrl: item.images?.[0]?.url_570xN || '',
        platform: 'Etsy',
        platformProductId: item.listing_id.toString(),
        status: item.state === 'active' ? 'active' : 'draft',
        inventory: item.quantity || 0,
        tags: item.tags || [],
        category: item.taxonomy_path?.[0] || 'General',
        lastSync: new Date(),
        stats: {
          views: item.views || 0,
          sales: item.num_favorers || 0,
          revenue: (parseFloat(item.price.amount) / 100) * (item.num_favorers || 0),
          clickThroughRate: 0,
        }
      }));
    } catch (error) {
      console.error('Etsy sync error:', error);
      // Return mock data for development
      return this.getMockEtsyProducts();
    }
  }

  // Printify API Integration
  async syncPrintifyProducts(): Promise<PlatformProduct[]> {
    if (!this.config?.printifyApiKey) {
      throw new Error('Printify API key not configured');
    }

    try {
      const response = await axios.get(
        'https://api.printify.com/v1/shops.json',
        {
          headers: {
            'Authorization': `Bearer ${this.config.printifyApiKey}`,
          }
        }
      );

      const shops = response.data;
      const allProducts: PlatformProduct[] = [];

      // Get products from each shop
      for (const shop of shops) {
        try {
          const productsResponse = await axios.get(
            `https://api.printify.com/v1/shops/${shop.id}/products.json`,
            {
              headers: {
                'Authorization': `Bearer ${this.config.printifyApiKey}`,
              }
            }
          );

          const products = productsResponse.data.data.map((item: any): PlatformProduct => ({
            id: `printify_${item.id}`,
            title: item.title,
            description: item.description || '',
            price: item.variants?.[0]?.price ? parseFloat(item.variants[0].price) / 100 : 0,
            imageUrl: item.images?.[0]?.src || '',
            platform: 'Printify',
            platformProductId: item.id.toString(),
            status: item.visible ? 'active' : 'draft',
            inventory: 999, // Printify handles inventory
            tags: item.tags || [],
            category: 'Print on Demand',
            lastSync: new Date(),
            stats: {
              views: 0, // Printify doesn't provide view stats
              sales: 0,
              revenue: 0,
              clickThroughRate: 0,
            }
          }));

          allProducts.push(...products);
        } catch (shopError) {
          console.error(`Error fetching products from shop ${shop.id}:`, shopError);
        }
      }

      return allProducts;
    } catch (error) {
      console.error('Printify sync error:', error);
      return this.getMockPrintifyProducts();
    }
  }

  // Shopify API Integration
  async syncShopifyProducts(): Promise<PlatformProduct[]> {
    if (!this.config?.shopifyApiKey || !this.config?.shopifyStoreUrl) {
      throw new Error('Shopify API configuration missing');
    }

    try {
      const response = await axios.get(
        `https://${this.config.shopifyStoreUrl}/admin/api/2023-04/products.json`,
        {
          headers: {
            'X-Shopify-Access-Token': this.config.shopifyApiKey,
          }
        }
      );

      return response.data.products.map((item: any): PlatformProduct => ({
        id: `shopify_${item.id}`,
        title: item.title,
        description: item.body_html?.replace(/<[^>]*>/g, '') || '',
        price: item.variants?.[0]?.price ? parseFloat(item.variants[0].price) : 0,
        imageUrl: item.images?.[0]?.src || '',
        platform: 'Shopify',
        platformProductId: item.id.toString(),
        status: item.status === 'active' ? 'active' : 'draft',
        inventory: item.variants?.[0]?.inventory_quantity || 0,
        tags: item.tags?.split(',').map((tag: string) => tag.trim()) || [],
        category: item.product_type || 'General',
        lastSync: new Date(),
        stats: {
          views: 0, // Would need Google Analytics integration
          sales: 0, // Would need order data
          revenue: 0,
          clickThroughRate: 0,
        }
      }));
    } catch (error) {
      console.error('Shopify sync error:', error);
      return this.getMockShopifyProducts();
    }
  }

  // Amazon API Integration (more complex, requires approval)
  async syncAmazonProducts(): Promise<PlatformProduct[]> {
    // Amazon SP-API requires extensive setup and approval
    // For now, return mock data
    console.log('Amazon integration requires SP-API setup');
    return this.getMockAmazonProducts();
  }

  // Main sync method for all platforms
  async syncAllPlatforms(): Promise<{
    etsy: PlatformProduct[];
    printify: PlatformProduct[];
    shopify: PlatformProduct[];
    amazon: PlatformProduct[];
  }> {
    const [etsy, printify, shopify, amazon] = await Promise.allSettled([
      this.syncEtsyProducts(),
      this.syncPrintifyProducts(),
      this.syncShopifyProducts(),
      this.syncAmazonProducts(),
    ]);

    return {
      etsy: etsy.status === 'fulfilled' ? etsy.value : [],
      printify: printify.status === 'fulfilled' ? printify.value : [],
      shopify: shopify.status === 'fulfilled' ? shopify.value : [],
      amazon: amazon.status === 'fulfilled' ? amazon.value : [],
    };
  }

  // Update product on specific platform
  async updateProduct(
    platform: 'Etsy' | 'Printify' | 'Shopify',
    productId: string,
    updates: Partial<PlatformProduct>
  ): Promise<boolean> {
    try {
      switch (platform) {
        case 'Etsy':
          return await this.updateEtsyProduct(productId, updates);
        case 'Printify':
          return await this.updatePrintifyProduct(productId, updates);
        case 'Shopify':
          return await this.updateShopifyProduct(productId, updates);
        default:
          throw new Error(`Platform ${platform} not supported for updates`);
      }
    } catch (error) {
      console.error(`Error updating ${platform} product:`, error);
      return false;
    }
  }

  private async updateEtsyProduct(productId: string, updates: Partial<PlatformProduct>): Promise<boolean> {
    if (!this.config?.etsyApiKey) return false;

    try {
      await axios.put(
        `https://openapi.etsy.com/v3/application/shops/me/listings/${productId}`,
        {
          title: updates.title,
          description: updates.description,
          price: updates.price,
          tags: updates.tags,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.etsyApiKey}`,
            'x-api-key': this.config.etsyApiKey,
          }
        }
      );
      return true;
    } catch (error) {
      console.error('Etsy update error:', error);
      return false;
    }
  }

  private async updatePrintifyProduct(productId: string, updates: Partial<PlatformProduct>): Promise<boolean> {
    if (!this.config?.printifyApiKey) return false;

    try {
      // Would need shop ID - simplified for example
      await axios.put(
        `https://api.printify.com/v1/shops/SHOP_ID/products/${productId}.json`,
        {
          title: updates.title,
          description: updates.description,
          tags: updates.tags,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.printifyApiKey}`,
          }
        }
      );
      return true;
    } catch (error) {
      console.error('Printify update error:', error);
      return false;
    }
  }

  private async updateShopifyProduct(productId: string, updates: Partial<PlatformProduct>): Promise<boolean> {
    if (!this.config?.shopifyApiKey || !this.config?.shopifyStoreUrl) return false;

    try {
      await axios.put(
        `https://${this.config.shopifyStoreUrl}/admin/api/2023-04/products/${productId}.json`,
        {
          product: {
            id: productId,
            title: updates.title,
            body_html: updates.description,
            tags: updates.tags?.join(','),
          }
        },
        {
          headers: {
            'X-Shopify-Access-Token': this.config.shopifyApiKey,
            'Content-Type': 'application/json',
          }
        }
      );
      return true;
    } catch (error) {
      console.error('Shopify update error:', error);
      return false;
    }
  }

  // Mock data for development/fallback
  private getMockEtsyProducts(): PlatformProduct[] {
    return [
      {
        id: 'etsy_mock_1',
        title: 'Handcrafted Faith Over Fear Wall Art',
        description: 'Beautiful handcrafted wall art with inspirational faith message',
        price: 29.99,
        imageUrl: 'https://via.placeholder.com/400x400/e6a15e/ffffff?text=Faith+Art',
        platform: 'Etsy',
        platformProductId: 'mock_1',
        status: 'active',
        inventory: 5,
        tags: ['faith', 'wall art', 'handcrafted', 'inspirational'],
        category: 'Home & Living',
        lastSync: new Date(),
        stats: { views: 245, sales: 12, revenue: 359.88, clickThroughRate: 4.9 }
      }
    ];
  }

  private getMockPrintifyProducts(): PlatformProduct[] {
    return [
      {
        id: 'printify_mock_1',
        title: 'Kingdom Builder T-Shirt',
        description: 'Premium cotton t-shirt with Kingdom Builder design',
        price: 24.99,
        imageUrl: 'https://via.placeholder.com/400x400/6b46c1/ffffff?text=Kingdom+Tee',
        platform: 'Printify',
        platformProductId: 'mock_1',
        status: 'active',
        inventory: 999,
        tags: ['t-shirt', 'kingdom', 'faith', 'apparel'],
        category: 'Apparel',
        lastSync: new Date(),
        stats: { views: 1205, sales: 43, revenue: 1074.57, clickThroughRate: 3.6 }
      }
    ];
  }

  private getMockShopifyProducts(): PlatformProduct[] {
    return [
      {
        id: 'shopify_mock_1',
        title: 'Digital Kingdom Business Course',
        description: 'Complete digital course on building Kingdom-minded businesses',
        price: 97.00,
        imageUrl: 'https://via.placeholder.com/400x400/059669/ffffff?text=Course',
        platform: 'Shopify',
        platformProductId: 'mock_1',
        status: 'active',
        inventory: 999,
        tags: ['course', 'digital', 'business', 'kingdom'],
        category: 'Digital Products',
        lastSync: new Date(),
        stats: { views: 567, sales: 23, revenue: 2231.00, clickThroughRate: 4.1 }
      }
    ];
  }

  private getMockAmazonProducts(): PlatformProduct[] {
    return [
      {
        id: 'amazon_mock_1',
        title: 'Kingdom Entrepreneur Journal',
        description: 'Daily journal for faith-based entrepreneurs',
        price: 19.99,
        imageUrl: 'https://via.placeholder.com/400x400/dc2626/ffffff?text=Journal',
        platform: 'Amazon',
        platformProductId: 'mock_1',
        status: 'active',
        inventory: 150,
        tags: ['journal', 'entrepreneur', 'faith', 'daily'],
        category: 'Books',
        lastSync: new Date(),
        stats: { views: 2341, sales: 87, revenue: 1739.13, clickThroughRate: 3.7 }
      }
    ];
  }

  // Get platform connection status
  async getConnectionStatus(): Promise<{
    etsy: boolean;
    printify: boolean;
    shopify: boolean;
    amazon: boolean;
  }> {
    return {
      etsy: !!this.config?.etsyApiKey,
      printify: !!this.config?.printifyApiKey,
      shopify: !!(this.config?.shopifyApiKey && this.config?.shopifyStoreUrl),
      amazon: false, // Requires complex setup
    };
  }
}

export default PlatformIntegrationService.getInstance();

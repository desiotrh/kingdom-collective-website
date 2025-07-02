import React, { createContext, useContext, useState, ReactNode } from 'react';

// Product interface
export interface Product {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  imageUri?: string; // User-uploaded image URI
  platform: 'Printify' | 'Etsy' | 'Shopify';
  syncStatus: 'Synced' | 'Not Synced' | 'Pending';
  description: string;
  category: string;
  tags: string[];
  stats: {
    views: number;
    sales: number;
    revenue: number;
  };
  lastSync: string;
}

// Initial mock data
const initialProducts: Product[] = [
  {
    id: '1',
    title: 'Faith Over Fear - Inspirational T-Shirt',
    price: 24.99,
    imageUrl: 'https://via.placeholder.com/400x400/f97316/ffffff?text=Faith+Over+Fear',
    platform: 'Printify',
    syncStatus: 'Synced',
    description: 'Premium cotton t-shirt with faith-based message that inspires confidence and trust in God. Perfect for everyday wear and sharing your faith journey with others.',
    category: 'Apparel',
    tags: ['faith', 'inspirational', 'christian', 'apparel', 't-shirt'],
    stats: {
      views: 1247,
      sales: 23,
      revenue: 574.77,
    },
    lastSync: '2024-01-15 10:30 AM',
  },
  {
    id: '2',
    title: 'Kingdom Builder - Coffee Mug',
    price: 16.99,
    imageUrl: 'https://via.placeholder.com/400x400/1f2937/ffffff?text=Kingdom+Mug',
    platform: 'Printify',
    syncStatus: 'Synced',
    description: 'Ceramic coffee mug for morning inspiration. Start your day with a reminder that you are building God\'s kingdom through your work and creativity.',
    category: 'Drinkware',
    tags: ['coffee', 'mug', 'kingdom', 'morning', 'inspiration'],
    stats: {
      views: 892,
      sales: 17,
      revenue: 288.83,
    },
    lastSync: '2024-01-15 09:15 AM',
  },
  {
    id: '3',
    title: 'Blessed & Grateful - Journal',
    price: 19.99,
    imageUrl: 'https://via.placeholder.com/400x400/22c55e/ffffff?text=Blessed+Journal',
    platform: 'Etsy',
    syncStatus: 'Not Synced',
    description: 'Handcrafted leather journal for daily reflections, gratitude practice, and spiritual growth. Features high-quality paper and a beautiful cover design.',
    category: 'Stationery',
    tags: ['journal', 'gratitude', 'blessed', 'handcrafted', 'leather'],
    stats: {
      views: 543,
      sales: 8,
      revenue: 159.92,
    },
    lastSync: '2024-01-14 03:22 PM',
  },
  {
    id: '4',
    title: 'Entrepreneur Prayer Cards Set',
    price: 12.99,
    imageUrl: 'https://via.placeholder.com/400x400/6366f1/ffffff?text=Prayer+Cards',
    platform: 'Etsy',
    syncStatus: 'Synced',
    description: 'Set of 30 prayer cards specifically designed for business owners and entrepreneurs seeking God\'s guidance in their ventures.',
    category: 'Spiritual',
    tags: ['prayer', 'entrepreneur', 'business', 'cards', 'spiritual'],
    stats: {
      views: 721,
      sales: 12,
      revenue: 155.88,
    },
    lastSync: '2024-01-15 11:45 AM',
  },
  {
    id: '5',
    title: 'Faith in Business - Hardcover Book',
    price: 29.99,
    imageUrl: 'https://via.placeholder.com/400x400/dc2626/ffffff?text=Faith+Book',
    platform: 'Shopify',
    syncStatus: 'Pending',
    description: 'Comprehensive guide to faith-based entrepreneurship. Learn how to integrate your values with business success and build a kingdom-focused enterprise.',
    category: 'Books',
    tags: ['book', 'business', 'faith', 'entrepreneurship', 'hardcover'],
    stats: {
      views: 2134,
      sales: 34,
      revenue: 1019.66,
    },
    lastSync: '2024-01-15 08:30 AM',
  },
  {
    id: '6',
    title: 'Kingdom Studios Logo Hoodie',
    price: 39.99,
    imageUrl: 'https://via.placeholder.com/400x400/f59e0b/ffffff?text=KS+Hoodie',
    platform: 'Shopify',
    syncStatus: 'Synced',
    description: 'Premium branded hoodie with embroidered Kingdom Studios logo. Comfortable, stylish, and perfect for representing the creative community.',
    category: 'Apparel',
    tags: ['hoodie', 'branded', 'logo', 'kingdom studios', 'premium'],
    stats: {
      views: 1567,
      sales: 19,
      revenue: 759.81,
    },
    lastSync: '2024-01-15 12:00 PM',
  },
  {
    id: '7',
    title: 'Blessed Business Planner',
    price: 24.99,
    imageUrl: 'https://via.placeholder.com/400x400/8b5cf6/ffffff?text=Planner',
    platform: 'Etsy',
    syncStatus: 'Synced',
    description: 'Annual planner with scripture verses, business insights, and goal-setting frameworks designed for faith-driven entrepreneurs.',
    category: 'Stationery',
    tags: ['planner', 'business', 'blessed', 'annual', 'scripture'],
    stats: {
      views: 987,
      sales: 15,
      revenue: 374.85,
    },
    lastSync: '2024-01-15 10:15 AM',
  },
  {
    id: '8',
    title: 'Faith Over Profit - Motivational Poster',
    price: 15.99,
    imageUrl: 'https://via.placeholder.com/400x400/ec4899/ffffff?text=Poster',
    platform: 'Printify',
    syncStatus: 'Not Synced',
    description: 'High-quality motivational poster reminding us to prioritize faith and values over pure profit. Perfect for office or home inspiration.',
    category: 'Wall Art',
    tags: ['poster', 'motivational', 'faith', 'office', 'wall art'],
    stats: {
      views: 445,
      sales: 6,
      revenue: 95.94,
    },
    lastSync: '2024-01-14 02:10 PM',
  },
];

// Context type
interface ProductContextType {
  products: Product[];
  getProductById: (id: string) => Product | undefined;
  updateProduct: (id: string, updatedProduct: Partial<Product>) => void;
  refreshProductSync: (id: string) => void;
  addProduct: (newProduct: Omit<Product, 'id' | 'lastSync' | 'syncStatus' | 'stats'>) => void;
}

// Create context
const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Provider component
interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const getProductById = (id: string): Product | undefined => {
    return products.find(product => product.id === id);
  };

  const updateProduct = (id: string, updatedProduct: Partial<Product>): void => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === id 
          ? { ...product, ...updatedProduct, lastSync: new Date().toLocaleString() }
          : product
      )
    );
  };

  const refreshProductSync = (id: string): void => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === id 
          ? { 
              ...product, 
              syncStatus: 'Synced' as const,
              lastSync: new Date().toLocaleString()
            }
          : product
      )
    );
  };

  const addProduct = (newProduct: Omit<Product, 'id' | 'lastSync' | 'syncStatus' | 'stats'>): void => {
    // Generate a unique ID based on timestamp and random number
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const product: Product = {
      ...newProduct,
      id,
      syncStatus: 'Pending',
      lastSync: new Date().toLocaleString(),
      stats: {
        views: 0,
        sales: 0,
        revenue: 0,
      },
    };
    
    setProducts(prevProducts => [...prevProducts, product]);
  };

  const value: ProductContextType = {
    products,
    getProductById,
    updateProduct,
    refreshProductSync,
    addProduct,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook to use the product context
export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export default ProductContext;

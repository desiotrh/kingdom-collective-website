import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Alert,
  Modal,
  Switch,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { KingdomColors } from '../constants/KingdomColors';
import { useAuth } from '../contexts/AuthContext';
import { AppMode } from '../types/spiritual';

interface DigitalProduct {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'journal' | 'printable' | 'ebook' | 'template' | 'course';
  price: number;
  thumbnail: string;
  downloadUrl: string;
  salesCount: number;
  isActive: boolean;
  categories: string[];
  tags: string[];
  createdAt: string;
  platforms: {
    etsy: boolean;
    shopify: boolean;
    gumroad: boolean;
    payhip: boolean;
  };
}

interface ProductAnalytics {
  totalSales: number;
  totalRevenue: number;
  topProduct: string;
  conversionRate: number;
}

const DigitalProductManagerScreen: React.FC = () => {
  const { user } = useAuth();
  const [mode, setMode] = useState<AppMode>('faith');
  const [activeTab, setActiveTab] = useState<'products' | 'analytics' | 'add-product'>('products');
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [analytics, setAnalytics] = useState<ProductAnalytics>({
    totalSales: 0,
    totalRevenue: 0,
    topProduct: '',
    conversionRate: 0,
  });
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<DigitalProduct | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<DigitalProduct>>({
    title: '',
    description: '',
    type: 'pdf',
    price: 0,
    categories: [],
    tags: [],
    platforms: {
      etsy: false,
      shopify: false,
      gumroad: false,
      payhip: false,
    },
  });

  useEffect(() => {
    loadProducts();
    loadAnalytics();
  }, [mode]);

  const loadProducts = () => {
    // Mock data - in real app, this would come from Firebase/API
    const mockProducts: DigitalProduct[] = mode === 'faith' ? [
      {
        id: '1',
        title: 'Faith-Based Business Planner',
        description: 'A comprehensive planner to align your business with God\'s purpose',
        type: 'pdf',
        price: 29.99,
        thumbnail: 'https://example.com/faith-planner.jpg',
        downloadUrl: 'https://example.com/downloads/faith-planner.pdf',
        salesCount: 127,
        isActive: true,
        categories: ['Business', 'Faith', 'Planning'],
        tags: ['planner', 'faith', 'business', 'purpose'],
        createdAt: '2024-01-15',
        platforms: {
          etsy: true,
          shopify: true,
          gumroad: false,
          payhip: false,
        }
      },
      {
        id: '2',
        title: 'Scripture Memory Cards',
        description: 'Beautiful printable cards for memorizing God\'s Word',
        type: 'printable',
        price: 9.99,
        thumbnail: 'https://example.com/scripture-cards.jpg',
        downloadUrl: 'https://example.com/downloads/scripture-cards.pdf',
        salesCount: 89,
        isActive: true,
        categories: ['Scripture', 'Printables', 'Memory'],
        tags: ['scripture', 'memory', 'cards', 'printable'],
        createdAt: '2024-01-10',
        platforms: {
          etsy: true,
          shopify: false,
          gumroad: true,
          payhip: false,
        }
      },
      {
        id: '3',
        title: 'Kingdom Entrepreneur Journal',
        description: 'Daily journal for Christian business owners',
        type: 'journal',
        price: 19.99,
        thumbnail: 'https://example.com/kingdom-journal.jpg',
        downloadUrl: 'https://example.com/downloads/kingdom-journal.pdf',
        salesCount: 156,
        isActive: true,
        categories: ['Journal', 'Entrepreneurship', 'Faith'],
        tags: ['journal', 'entrepreneur', 'kingdom', 'business'],
        createdAt: '2024-01-05',
        platforms: {
          etsy: true,
          shopify: true,
          gumroad: true,
          payhip: false,
        }
      }
    ] : [
      {
        id: '1',
        title: 'Content Creator Planner',
        description: 'The ultimate planner for content creators and influencers',
        type: 'pdf',
        price: 24.99,
        thumbnail: 'https://example.com/creator-planner.jpg',
        downloadUrl: 'https://example.com/downloads/creator-planner.pdf',
        salesCount: 203,
        isActive: true,
        categories: ['Content', 'Planning', 'Social Media'],
        tags: ['content', 'planner', 'creator', 'social-media'],
        createdAt: '2024-01-15',
        platforms: {
          etsy: true,
          shopify: true,
          gumroad: false,
          payhip: false,
        }
      },
      {
        id: '2',
        title: 'Instagram Growth Templates',
        description: 'Ready-to-use templates for Instagram posts and stories',
        type: 'template',
        price: 14.99,
        thumbnail: 'https://example.com/instagram-templates.jpg',
        downloadUrl: 'https://example.com/downloads/instagram-templates.zip',
        salesCount: 341,
        isActive: true,
        categories: ['Templates', 'Instagram', 'Social Media'],
        tags: ['instagram', 'templates', 'stories', 'posts'],
        createdAt: '2024-01-12',
        platforms: {
          etsy: true,
          shopify: false,
          gumroad: true,
          payhip: true,
        }
      },
      {
        id: '3',
        title: 'Business Expense Tracker',
        description: 'Track your business expenses like a pro',
        type: 'printable',
        price: 7.99,
        thumbnail: 'https://example.com/expense-tracker.jpg',
        downloadUrl: 'https://example.com/downloads/expense-tracker.pdf',
        salesCount: 78,
        isActive: true,
        categories: ['Business', 'Finance', 'Tracking'],
        tags: ['expense', 'tracker', 'business', 'finance'],
        createdAt: '2024-01-08',
        platforms: {
          etsy: false,
          shopify: true,
          gumroad: false,
          payhip: true,
        }
      }
    ];
    setProducts(mockProducts);
  };

  const loadAnalytics = () => {
    const totalSales = products.reduce((sum, product) => sum + product.salesCount, 0);
    const totalRevenue = products.reduce((sum, product) => sum + (product.salesCount * product.price), 0);
    const topProduct = products.sort((a, b) => b.salesCount - a.salesCount)[0]?.title || '';
    
    setAnalytics({
      totalSales,
      totalRevenue,
      topProduct,
      conversionRate: 3.2, // Mock conversion rate
    });
  };

  const addProduct = () => {
    if (!newProduct.title || !newProduct.description || !newProduct.price) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const product: DigitalProduct = {
      id: Date.now().toString(),
      title: newProduct.title!,
      description: newProduct.description!,
      type: newProduct.type || 'pdf',
      price: newProduct.price!,
      thumbnail: 'https://example.com/placeholder.jpg',
      downloadUrl: '',
      salesCount: 0,
      isActive: true,
      categories: newProduct.categories || [],
      tags: newProduct.tags || [],
      createdAt: new Date().toISOString(),
      platforms: newProduct.platforms || {
        etsy: false,
        shopify: false,
        gumroad: false,
        payhip: false,
      }
    };

    setProducts([...products, product]);
    setNewProduct({
      title: '',
      description: '',
      type: 'pdf',
      price: 0,
      categories: [],
      tags: [],
      platforms: {
        etsy: false,
        shopify: false,
        gumroad: false,
        payhip: false,
      },
    });
    setIsAddModalVisible(false);
    Alert.alert('Success', 'Product added successfully!');
  };

  const deleteProduct = (productId: string) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setProducts(products.filter(p => p.id !== productId));
          }
        }
      ]
    );
  };

  const toggleProductActive = (productId: string) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, isActive: !p.isActive } : p
    ));
  };

  const generatePromoContent = (product: DigitalProduct) => {
    const faithContent = `✨ NEW: ${product.title}! 

${product.description}

Perfect for faith-driven entrepreneurs who want to align their business with God's purpose. 

Get yours for just $${product.price}! 

#FaithBasedBusiness #KingdomEntrepreneur #DigitalDownload #ChristianBusiness`;

    const businessContent = `🚀 LAUNCH: ${product.title}! 

${product.description}

Designed for ambitious creators ready to level up their game. 

Available now for $${product.price}! 

#ContentCreator #DigitalProducts #Entrepreneur #BusinessTools`;

    const content = mode === 'faith' ? faithContent : businessContent;
    
    Alert.alert('Generated Content', content, [
      { text: 'Copy to Clipboard', onPress: () => {/* Copy to clipboard */} },
      { text: 'Close' }
    ]);
  };

  const getProductTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'journal': return '📔';
      case 'printable': return '🖨️';
      case 'ebook': return '📚';
      case 'template': return '🎨';
      case 'course': return '🎓';
      default: return '📦';
    }
  };

  const renderModeToggle = () => (
    <View style={styles.modeToggle}>
      <TouchableOpacity
        style={[styles.modeButton, mode === 'faith' && styles.activeModeButton]}
        onPress={() => setMode('faith')}
      >
        <Ionicons 
          name="heart" 
          size={16} 
          color={mode === 'faith' ? KingdomColors.white : KingdomColors.gold.bright} 
        />
        <Text style={[styles.modeButtonText, mode === 'faith' && styles.activeModeText]}>
          Faith Mode
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.modeButton, mode === 'encouragement' && styles.activeModeButton]}
        onPress={() => setMode('encouragement')}
      >
        <Ionicons 
          name="flash" 
          size={16} 
          color={mode === 'encouragement' ? KingdomColors.white : KingdomColors.gold.bright} 
        />
        <Text style={[styles.modeButtonText, mode === 'encouragement' && styles.activeModeText]}>
          Encouragement Mode
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'products' && styles.activeTab]}
        onPress={() => setActiveTab('products')}
      >
        <Ionicons 
          name="cube" 
          size={20} 
          color={activeTab === 'products' ? KingdomColors.gold.bright : KingdomColors.text.muted} 
        />
        <Text style={[styles.tabText, activeTab === 'products' && styles.activeTabText]}>
          Products
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'analytics' && styles.activeTab]}
        onPress={() => setActiveTab('analytics')}
      >
        <Ionicons 
          name="bar-chart" 
          size={20} 
          color={activeTab === 'analytics' ? KingdomColors.gold.bright : KingdomColors.text.muted} 
        />
        <Text style={[styles.tabText, activeTab === 'analytics' && styles.activeTabText]}>
          Analytics
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'add-product' && styles.activeTab]}
        onPress={() => setActiveTab('add-product')}
      >
        <Ionicons 
          name="add-circle" 
          size={20} 
          color={activeTab === 'add-product' ? KingdomColors.gold.bright : KingdomColors.text.muted} 
        />
        <Text style={[styles.tabText, activeTab === 'add-product' && styles.activeTabText]}>
          Add
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderProductCard = ({ item }: { item: DigitalProduct }) => (
    <View style={styles.productCard}>
      <View style={styles.productHeader}>
        <View style={styles.productInfo}>
          <View style={styles.productTypeRow}>
            <Text style={styles.productTypeIcon}>{getProductTypeIcon(item.type)}</Text>
            <Text style={styles.productType}>{item.type.toUpperCase()}</Text>
            <View style={[styles.statusBadge, item.isActive ? styles.activeBadge : styles.inactiveBadge]}>
              <Text style={[styles.statusText, item.isActive ? styles.activeText : styles.inactiveText]}>
                {item.isActive ? 'ACTIVE' : 'INACTIVE'}
              </Text>
            </View>
          </View>
          <Text style={styles.productTitle}>{item.title}</Text>
          <Text style={styles.productDescription}>{item.description}</Text>
        </View>
      </View>

      <View style={styles.productStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>${item.price}</Text>
          <Text style={styles.statLabel}>Price</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.salesCount}</Text>
          <Text style={styles.statLabel}>Sales</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>${(item.salesCount * item.price).toFixed(0)}</Text>
          <Text style={styles.statLabel}>Revenue</Text>
        </View>
      </View>

      <View style={styles.platformIndicators}>
        <Text style={styles.platformLabel}>Available on:</Text>
        <View style={styles.platformIcons}>
          {item.platforms.etsy && <Text style={styles.platformIcon}>🛍️</Text>}
          {item.platforms.shopify && <Text style={styles.platformIcon}>🏪</Text>}
          {item.platforms.gumroad && <Text style={styles.platformIcon}>💻</Text>}
          {item.platforms.payhip && <Text style={styles.platformIcon}>💳</Text>}
        </View>
      </View>

      <View style={styles.productActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => generatePromoContent(item)}
        >
          <Ionicons name="megaphone" size={16} color={KingdomColors.gold.bright} />
          <Text style={styles.actionButtonText}>Generate Promo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => toggleProductActive(item.id)}
        >
          <Ionicons 
            name={item.isActive ? "pause" : "play"} 
            size={16} 
            color={item.isActive ? KingdomColors.accent.warning : KingdomColors.accent.success} 
          />
          <Text style={styles.actionButtonText}>
            {item.isActive ? 'Pause' : 'Activate'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => deleteProduct(item.id)}
        >
          <Ionicons name="trash" size={16} color={KingdomColors.accent.error} />
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAnalyticsTab = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.analyticsGrid}>
        <View style={styles.analyticsCard}>
          <LinearGradient
            colors={[KingdomColors.gold.bright, KingdomColors.gold.warm]}
            style={styles.analyticsGradient}
          >
            <Text style={styles.analyticsValue}>{analytics.totalSales}</Text>
            <Text style={styles.analyticsLabel}>Total Sales</Text>
          </LinearGradient>
        </View>

        <View style={styles.analyticsCard}>
          <LinearGradient
            colors={[KingdomColors.accent.success, KingdomColors.accent.success + 'CC']}
            style={styles.analyticsGradient}
          >
            <Text style={styles.analyticsValue}>${analytics.totalRevenue.toFixed(0)}</Text>
            <Text style={styles.analyticsLabel}>Total Revenue</Text>
          </LinearGradient>
        </View>

        <View style={styles.analyticsCard}>
          <LinearGradient
            colors={[KingdomColors.primary.royalPurple, KingdomColors.primary.deepNavy]}
            style={styles.analyticsGradient}
          >
            <Text style={styles.analyticsValue}>{analytics.conversionRate}%</Text>
            <Text style={styles.analyticsLabel}>Conversion Rate</Text>
          </LinearGradient>
        </View>
      </View>

      <View style={styles.topProductCard}>
        <Text style={styles.topProductTitle}>🏆 Best Selling Product</Text>
        <Text style={styles.topProductName}>{analytics.topProduct}</Text>
      </View>

      <View style={styles.encouragementCard}>
        <LinearGradient
          colors={[KingdomColors.gold.bright + '20', KingdomColors.gold.warm + '20']}
          style={styles.encouragementGradient}
        >
          <Text style={styles.encouragementText}>
            {mode === 'faith' 
              ? "🙏 'For God has not given us a spirit of fear, but of power, love, and sound mind.' - 2 Timothy 1:7"
              : "💪 'Success is not final, failure is not fatal: it is the courage to continue that counts.' - Winston Churchill"
            }
          </Text>
        </LinearGradient>
      </View>
    </ScrollView>
  );

  const renderAddProductTab = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.addProductForm}>
        <Text style={styles.formTitle}>Add New Digital Product</Text>

        <Text style={styles.inputLabel}>Product Title *</Text>
        <TextInput
          style={styles.textInput}
          value={newProduct.title}
          onChangeText={(text) => setNewProduct({...newProduct, title: text})}
          placeholder="Enter product title"
          placeholderTextColor={KingdomColors.text.muted}
        />

        <Text style={styles.inputLabel}>Description *</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          value={newProduct.description}
          onChangeText={(text) => setNewProduct({...newProduct, description: text})}
          placeholder="Describe your product..."
          placeholderTextColor={KingdomColors.text.muted}
          multiline
          numberOfLines={4}
        />

        <Text style={styles.inputLabel}>Product Type</Text>
        <View style={styles.typeSelector}>
          {['pdf', 'journal', 'printable', 'ebook', 'template', 'course'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeOption,
                newProduct.type === type && styles.selectedTypeOption
              ]}
              onPress={() => setNewProduct({...newProduct, type: type as any})}
            >
              <Text style={styles.typeIcon}>{getProductTypeIcon(type)}</Text>
              <Text style={[
                styles.typeText,
                newProduct.type === type && styles.selectedTypeText
              ]}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.inputLabel}>Price (USD) *</Text>
        <TextInput
          style={styles.textInput}
          value={newProduct.price?.toString()}
          onChangeText={(text) => setNewProduct({...newProduct, price: parseFloat(text) || 0})}
          placeholder="0.00"
          placeholderTextColor={KingdomColors.text.muted}
          keyboardType="decimal-pad"
        />

        <Text style={styles.inputLabel}>Platforms</Text>
        <View style={styles.platformToggles}>
          {Object.entries(newProduct.platforms || {}).map(([platform, enabled]) => (
            <View key={platform} style={styles.platformToggle}>
              <Text style={styles.platformName}>{platform.charAt(0).toUpperCase() + platform.slice(1)}</Text>
              <Switch
                value={enabled}
                onValueChange={(value) => setNewProduct({
                  ...newProduct,
                  platforms: { 
                    etsy: false,
                    shopify: false,
                    gumroad: false,
                    payhip: false,
                    ...newProduct.platforms, 
                    [platform]: value 
                  }
                })}
                trackColor={{ false: KingdomColors.silver.light, true: KingdomColors.gold.bright }}
                thumbColor={enabled ? KingdomColors.white : KingdomColors.white}
              />
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.addButton} onPress={addProduct}>
          <LinearGradient
            colors={[KingdomColors.gold.bright, KingdomColors.gold.warm]}
            style={styles.addButtonGradient}
          >
            <Ionicons name="add" size={20} color={KingdomColors.white} />
            <Text style={styles.addButtonText}>Add Product</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[KingdomColors.primary.royalPurple, KingdomColors.primary.deepNavy]}
        style={styles.header}
      >
        <Text style={styles.title}>Digital Product Manager</Text>
        <Text style={styles.subtitle}>
          {mode === 'faith' 
            ? 'Manage faith-based digital products' 
            : 'Manage your digital product empire'
          }
        </Text>
        {renderModeToggle()}
      </LinearGradient>

      {renderTabBar()}

      {activeTab === 'products' && (
        <FlatList
          data={products}
          renderItem={renderProductCard}
          keyExtractor={(item) => item.id}
          style={styles.tabContent}
          contentContainerStyle={styles.productsList}
          showsVerticalScrollIndicator={false}
        />
      )}

      {activeTab === 'analytics' && renderAnalyticsTab()}
      {activeTab === 'add-product' && renderAddProductTab()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: KingdomColors.white,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: KingdomColors.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: KingdomColors.text.secondary,
    marginBottom: 20,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 25,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  activeModeButton: {
    backgroundColor: KingdomColors.gold.bright,
  },
  modeButtonText: {
    color: KingdomColors.text.secondary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  activeModeText: {
    color: KingdomColors.white,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: KingdomColors.white,
    borderBottomWidth: 1,
    borderBottomColor: KingdomColors.silver.light,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: KingdomColors.gold.bright,
  },
  tabText: {
    fontSize: 14,
    color: KingdomColors.text.muted,
    marginLeft: 8,
    fontWeight: '500',
  },
  activeTabText: {
    color: KingdomColors.gold.bright,
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  productsList: {
    paddingBottom: 100,
  },
  productCard: {
    backgroundColor: KingdomColors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  productHeader: {
    marginBottom: 16,
  },
  productInfo: {
    flex: 1,
  },
  productTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  productTypeIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  productType: {
    fontSize: 12,
    color: KingdomColors.text.muted,
    fontWeight: '600',
    marginRight: 12,
  },
  statusBadge: {
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  activeBadge: {
    backgroundColor: KingdomColors.accent.success + '20',
  },
  inactiveBadge: {
    backgroundColor: KingdomColors.silver.light,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  activeText: {
    color: KingdomColors.accent.success,
  },
  inactiveText: {
    color: KingdomColors.text.muted,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.inverse,
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: KingdomColors.text.muted,
    lineHeight: 20,
  },
  productStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: KingdomColors.silver.light,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.inverse,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: KingdomColors.text.muted,
  },
  platformIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  platformLabel: {
    fontSize: 14,
    color: KingdomColors.text.muted,
    marginRight: 8,
  },
  platformIcons: {
    flexDirection: 'row',
  },
  platformIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  productActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionButtonText: {
    fontSize: 12,
    color: KingdomColors.text.muted,
    marginLeft: 4,
    fontWeight: '500',
  },
  analyticsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  analyticsCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  analyticsGradient: {
    padding: 16,
    alignItems: 'center',
  },
  analyticsValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.white,
    marginBottom: 4,
  },
  analyticsLabel: {
    fontSize: 12,
    color: KingdomColors.white,
    opacity: 0.9,
  },
  topProductCard: {
    backgroundColor: KingdomColors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  topProductTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: KingdomColors.text.inverse,
    marginBottom: 8,
  },
  topProductName: {
    fontSize: 18,
    color: KingdomColors.gold.bright,
    fontWeight: '600',
  },
  encouragementCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  encouragementGradient: {
    padding: 20,
  },
  encouragementText: {
    fontSize: 14,
    color: KingdomColors.text.inverse,
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  addProductForm: {
    paddingBottom: 100,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.text.inverse,
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.text.inverse,
    marginBottom: 8,
    marginTop: 16,
  },
  textInput: {
    backgroundColor: KingdomColors.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: KingdomColors.text.inverse,
    borderWidth: 2,
    borderColor: KingdomColors.silver.light,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: KingdomColors.silver.light,
    borderRadius: 12,
    padding: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedTypeOption: {
    backgroundColor: KingdomColors.gold.bright,
  },
  typeIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  typeText: {
    fontSize: 14,
    color: KingdomColors.text.muted,
    fontWeight: '500',
  },
  selectedTypeText: {
    color: KingdomColors.white,
    fontWeight: '600',
  },
  platformToggles: {
    marginBottom: 24,
  },
  platformToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  platformName: {
    fontSize: 16,
    color: KingdomColors.text.inverse,
  },
  addButton: {
    borderRadius: 25,
    overflow: 'hidden',
    marginTop: 20,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  addButtonText: {
    color: KingdomColors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default React.memo(DigitalProductManagerScreen);

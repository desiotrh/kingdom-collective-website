import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Image,
  Dimensions,
  Switch,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useDualMode } from '../contexts/DualModeContext';
import { KingdomColors } from '../constants/KingdomColors';

const { width } = Dimensions.get('window');

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: string;
  tags: string[];
  inventory: number;
  status: 'active' | 'draft' | 'archived';
  variants: ProductVariant[];
  seo: {
    title: string;
    description: string;
    url: string;
  };
}

interface ProductVariant {
  id: string;
  title: string;
  price: number;
  inventory: number;
  sku: string;
  options: { [key: string]: string };
}

interface Order {
  id: string;
  customerName: string;
  email: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: Date;
  items: OrderItem[];
  shippingAddress: Address;
}

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  variant?: string;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface StoreSettings {
  name: string;
  domain: string;
  currency: string;
  timezone: string;
  taxRate: number;
  shippingZones: ShippingZone[];
  paymentMethods: string[];
  notifications: {
    orderConfirmation: boolean;
    lowInventory: boolean;
    newCustomer: boolean;
  };
}

interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  rates: ShippingRate[];
}

interface ShippingRate {
  id: string;
  name: string;
  price: number;
  conditions: {
    minOrder?: number;
    maxWeight?: number;
  };
}

const AdvancedEcommerceScreen: React.FC = () => {
  const { currentMode } = useDualMode();
  const colors = currentMode === 'faith' ? KingdomColors.faith : KingdomColors.encouragement;
  
  const [currentTab, setCurrentTab] = useState<'products' | 'orders' | 'customers' | 'analytics' | 'settings'>('products');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'product' | 'order' | 'settings'>('product');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);

  useEffect(() => {
    loadMockData();
  }, [currentMode]);

  const loadMockData = () => {
    // Mock products
    const mockProducts: Product[] = [
      {
        id: '1',
        name: currentMode === 'faith' ? 'Kingdom Bible Study Guide' : 'Digital Marketing Mastery',
        description: currentMode === 'faith' 
          ? 'Comprehensive Bible study guide for spiritual growth and deeper understanding of God\'s word'
          : 'Complete guide to mastering digital marketing strategies and tactics',
        price: 29.99,
        comparePrice: 39.99,
        images: ['https://example.com/image1.jpg'],
        category: currentMode === 'faith' ? 'Study Materials' : 'Courses',
        tags: currentMode === 'faith' ? ['bible', 'study', 'spiritual'] : ['marketing', 'digital', 'course'],
        inventory: 50,
        status: 'active',
        variants: [
          {
            id: 'v1',
            title: 'PDF Version',
            price: 29.99,
            inventory: 999,
            sku: 'KINGDOM-PDF-001',
            options: { format: 'PDF' }
          },
          {
            id: 'v2',
            title: 'Print + PDF Bundle',
            price: 49.99,
            inventory: 25,
            sku: 'KINGDOM-BUNDLE-001',
            options: { format: 'Bundle' }
          }
        ],
        seo: {
          title: currentMode === 'faith' ? 'Kingdom Bible Study Guide | Spiritual Growth' : 'Digital Marketing Mastery Course',
          description: currentMode === 'faith' 
            ? 'Grow in faith with our comprehensive Bible study guide'
            : 'Master digital marketing with our complete course',
          url: currentMode === 'faith' ? 'kingdom-bible-study' : 'digital-marketing-mastery'
        }
      },
      {
        id: '2',
        name: currentMode === 'faith' ? 'Prayer Journal Template' : 'Content Creation Toolkit',
        description: currentMode === 'faith'
          ? 'Beautiful prayer journal template to track your spiritual journey'
          : 'Complete toolkit for content creators with templates and resources',
        price: 19.99,
        images: ['https://example.com/image2.jpg'],
        category: currentMode === 'faith' ? 'Journals' : 'Tools',
        tags: currentMode === 'faith' ? ['prayer', 'journal', 'template'] : ['content', 'creation', 'toolkit'],
        inventory: 75,
        status: 'active',
        variants: [
          {
            id: 'v3',
            title: 'Digital Template',
            price: 19.99,
            inventory: 999,
            sku: 'PRAYER-DIGITAL-001',
            options: { format: 'Digital' }
          }
        ],
        seo: {
          title: currentMode === 'faith' ? 'Prayer Journal Template | Spiritual Tracking' : 'Content Creation Toolkit',
          description: currentMode === 'faith'
            ? 'Track your prayers and spiritual growth with our beautiful template'
            : 'Everything you need to create amazing content',
          url: currentMode === 'faith' ? 'prayer-journal-template' : 'content-creation-toolkit'
        }
      }
    ];

    // Mock orders
    const mockOrders: Order[] = [
      {
        id: 'ORD-001',
        customerName: currentMode === 'faith' ? 'Sarah Mitchell' : 'John Smith',
        email: currentMode === 'faith' ? 'sarah@email.com' : 'john@email.com',
        total: 79.98,
        status: 'processing',
        date: new Date(Date.now() - 86400000),
        items: [
          {
            productId: '1',
            productName: mockProducts[0].name,
            quantity: 2,
            price: 29.99,
            variant: 'PDF Version'
          },
          {
            productId: '2',
            productName: mockProducts[1].name,
            quantity: 1,
            price: 19.99
          }
        ],
        shippingAddress: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zipCode: '90210',
          country: 'US'
        }
      },
      {
        id: 'ORD-002',
        customerName: currentMode === 'faith' ? 'Pastor David' : 'Lisa Johnson',
        email: currentMode === 'faith' ? 'pastor@church.com' : 'lisa@email.com',
        total: 49.99,
        status: 'shipped',
        date: new Date(Date.now() - 172800000),
        items: [
          {
            productId: '1',
            productName: mockProducts[0].name,
            quantity: 1,
            price: 49.99,
            variant: 'Print + PDF Bundle'
          }
        ],
        shippingAddress: {
          street: '456 Church Ave',
          city: 'Faithville',
          state: 'TX',
          zipCode: '75001',
          country: 'US'
        }
      }
    ];

    // Mock store settings
    const mockSettings: StoreSettings = {
      name: currentMode === 'faith' ? 'Kingdom Studios Store' : 'Creator Studio Store',
      domain: currentMode === 'faith' ? 'kingdom-store.com' : 'creator-store.com',
      currency: 'USD',
      timezone: 'America/New_York',
      taxRate: 8.5,
      shippingZones: [
        {
          id: 'zone1',
          name: 'United States',
          countries: ['US'],
          rates: [
            {
              id: 'rate1',
              name: 'Standard Shipping',
              price: 5.99,
              conditions: { minOrder: 25 }
            },
            {
              id: 'rate2',
              name: 'Express Shipping',
              price: 12.99,
              conditions: {}
            }
          ]
        }
      ],
      paymentMethods: ['stripe', 'paypal', 'apple_pay'],
      notifications: {
        orderConfirmation: true,
        lowInventory: true,
        newCustomer: false
      }
    };

    setProducts(mockProducts);
    setOrders(mockOrders);
    setStoreSettings(mockSettings);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'delivered':
        return colors.success;
      case 'processing':
      case 'shipped':
        return colors.info;
      case 'pending':
      case 'draft':
        return colors.warning;
      case 'cancelled':
      case 'archived':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const renderProduct = (product: Product) => (
    <View key={product.id} style={[styles.productCard, { backgroundColor: colors.surface }]}>
      <View style={styles.productHeader}>
        <View style={styles.productInfo}>
          <Text style={[styles.productName, { color: colors.text }]}>
            {product.name}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(product.status) }]}>
            <Text style={styles.statusText}>{product.status}</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.productActions}>
          <MaterialIcons name="more-vert" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.productDescription, { color: colors.textSecondary }]} numberOfLines={2}>
        {product.description}
      </Text>
      
      <View style={styles.productDetails}>
        <View style={styles.productPricing}>
          <Text style={[styles.productPrice, { color: colors.text }]}>
            {formatCurrency(product.price)}
          </Text>
          {product.comparePrice && (
            <Text style={[styles.productComparePrice, { color: colors.textSecondary }]}>
              {formatCurrency(product.comparePrice)}
            </Text>
          )}
        </View>
        
        <Text style={[styles.productInventory, { color: colors.textSecondary }]}>
          {product.inventory} in stock
        </Text>
      </View>
      
      <View style={styles.productFooter}>
        <View style={styles.productTags}>
          {product.tags.slice(0, 2).map((tag, index) => (
            <View key={index} style={[styles.productTag, { backgroundColor: colors.background }]}>
              <Text style={[styles.productTagText, { color: colors.textSecondary }]}>
                {tag}
              </Text>
            </View>
          ))}
        </View>
        
        <TouchableOpacity style={[styles.editButton, { backgroundColor: colors.primary }]}>
          <MaterialIcons name="edit" size={16} color="#FFFFFF" />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderOrder = (order: Order) => (
    <View key={order.id} style={[styles.orderCard, { backgroundColor: colors.surface }]}>
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={[styles.orderId, { color: colors.text }]}>
            {order.id}
          </Text>
          <Text style={[styles.orderCustomer, { color: colors.textSecondary }]}>
            {order.customerName}
          </Text>
        </View>
        
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
          <Text style={styles.statusText}>{order.status}</Text>
        </View>
      </View>
      
      <View style={styles.orderDetails}>
        <Text style={[styles.orderTotal, { color: colors.accent }]}>
          {formatCurrency(order.total)}
        </Text>
        <Text style={[styles.orderDate, { color: colors.textSecondary }]}>
          {formatDate(order.date)}
        </Text>
      </View>
      
      <View style={styles.orderItems}>
        {order.items.map((item, index) => (
          <Text key={index} style={[styles.orderItem, { color: colors.textSecondary }]}>
            {item.quantity}x {item.productName}
            {item.variant && ` (${item.variant})`}
          </Text>
        ))}
      </View>
      
      <TouchableOpacity style={[styles.viewOrderButton, { backgroundColor: colors.primary }]}>
        <MaterialIcons name="visibility" size={16} color="#FFFFFF" />
        <Text style={styles.viewOrderText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAnalytics = () => (
    <View style={styles.analyticsContainer}>
      <View style={styles.analyticsGrid}>
        {[
          {
            title: 'Total Revenue',
            value: '$2,847.50',
            change: '+12.5%',
            icon: 'attach-money',
            color: colors.success
          },
          {
            title: 'Orders',
            value: '156',
            change: '+8.2%',
            icon: 'shopping-cart',
            color: colors.info
          },
          {
            title: 'Products',
            value: '24',
            change: '+3',
            icon: 'inventory',
            color: colors.primary
          },
          {
            title: 'Conversion Rate',
            value: '3.2%',
            change: '+0.8%',
            icon: 'trending-up',
            color: colors.accent
          }
        ].map((metric, index) => (
          <View key={index} style={[styles.analyticsCard, { backgroundColor: colors.surface }]}>
            <View style={styles.analyticsHeader}>
              <MaterialIcons name={metric.icon as any} size={24} color={metric.color} />
              <Text style={[styles.analyticsChange, { color: colors.success }]}>
                {metric.change}
              </Text>
            </View>
            <Text style={[styles.analyticsValue, { color: colors.text }]}>
              {metric.value}
            </Text>
            <Text style={[styles.analyticsTitle, { color: colors.textSecondary }]}>
              {metric.title}
            </Text>
          </View>
        ))}
      </View>
      
      {/* Chart Placeholder */}
      <View style={[styles.chartCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.chartTitle, { color: colors.text }]}>
          Revenue Over Time
        </Text>
        <View style={[styles.chartPlaceholder, { backgroundColor: colors.background }]}>
          <MaterialCommunityIcons 
            name="chart-line" 
            size={48} 
            color={colors.textSecondary} 
          />
          <Text style={[styles.chartPlaceholderText, { color: colors.textSecondary }]}>
            Revenue chart would appear here
          </Text>
        </View>
      </View>
    </View>
  );

  const renderSettings = () => (
    <ScrollView style={styles.settingsContainer}>
      {storeSettings && (
        <>
          <View style={[styles.settingsSection, { backgroundColor: colors.surface }]}>
            <Text style={[styles.settingsSectionTitle, { color: colors.text }]}>
              Store Information
            </Text>
            
            <View style={styles.settingsItem}>
              <Text style={[styles.settingsLabel, { color: colors.textSecondary }]}>
                Store Name
              </Text>
              <TextInput
                style={[styles.settingsInput, { color: colors.text }]}
                value={storeSettings.name}
                placeholder="Enter store name"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            
            <View style={styles.settingsItem}>
              <Text style={[styles.settingsLabel, { color: colors.textSecondary }]}>
                Domain
              </Text>
              <TextInput
                style={[styles.settingsInput, { color: colors.text }]}
                value={storeSettings.domain}
                placeholder="Enter domain"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>
          
          <View style={[styles.settingsSection, { backgroundColor: colors.surface }]}>
            <Text style={[styles.settingsSectionTitle, { color: colors.text }]}>
              Payment & Shipping
            </Text>
            
            <View style={styles.settingsItem}>
              <Text style={[styles.settingsLabel, { color: colors.textSecondary }]}>
                Tax Rate (%)
              </Text>
              <TextInput
                style={[styles.settingsInput, { color: colors.text }]}
                value={storeSettings.taxRate.toString()}
                placeholder="0.00"
                placeholderTextColor={colors.textSecondary}
                keyboardType="decimal-pad"
              />
            </View>
            
            <TouchableOpacity style={[styles.settingsButton, { backgroundColor: colors.primary }]}>
              <MaterialIcons name="payment" size={20} color="#FFFFFF" />
              <Text style={styles.settingsButtonText}>
                Configure Payment Methods
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.settingsButton, { backgroundColor: colors.primary }]}>
              <MaterialIcons name="local-shipping" size={20} color="#FFFFFF" />
              <Text style={styles.settingsButtonText}>
                Manage Shipping Zones
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={[styles.settingsSection, { backgroundColor: colors.surface }]}>
            <Text style={[styles.settingsSectionTitle, { color: colors.text }]}>
              Notifications
            </Text>
            
            {Object.entries(storeSettings.notifications).map(([key, value]) => (
              <View key={key} style={styles.settingsToggle}>
                <Text style={[styles.settingsToggleLabel, { color: colors.text }]}>
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </Text>
                <Switch
                  value={value}
                  onValueChange={() => {
                    setStoreSettings(prev => prev ? {
                      ...prev,
                      notifications: {
                        ...prev.notifications,
                        [key]: !value
                      }
                    } : null);
                  }}
                  trackColor={{ false: colors.background, true: colors.primary }}
                  thumbColor={value ? '#FFFFFF' : colors.textSecondary}
                />
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {currentMode === 'faith' ? '🏪 Kingdom Store' : '🏪 E-commerce Hub'}
        </Text>
        
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => {
            setModalType('product');
            setShowModal(true);
          }}
        >
          <MaterialIcons name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={[styles.tabContainer, { backgroundColor: colors.surface }]}>
        {[
          { key: 'products', label: 'Products', icon: 'inventory' },
          { key: 'orders', label: 'Orders', icon: 'receipt' },
          { key: 'customers', label: 'Customers', icon: 'people' },
          { key: 'analytics', label: 'Analytics', icon: 'analytics' },
          { key: 'settings', label: 'Settings', icon: 'settings' }
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              { backgroundColor: currentTab === tab.key ? colors.primary : 'transparent' }
            ]}
            onPress={() => setCurrentTab(tab.key as any)}
          >
            <MaterialIcons 
              name={tab.icon as any} 
              size={16} 
              color={currentTab === tab.key ? '#FFFFFF' : colors.textSecondary} 
            />
            <Text style={[
              styles.tabText,
              { color: currentTab === tab.key ? '#FFFFFF' : colors.textSecondary }
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {currentTab === 'products' && (
          <View style={styles.productsContainer}>
            {products.map(renderProduct)}
          </View>
        )}

        {currentTab === 'orders' && (
          <View style={styles.ordersContainer}>
            {orders.map(renderOrder)}
          </View>
        )}

        {currentTab === 'customers' && (
          <View style={styles.customersContainer}>
            <Text style={[styles.comingSoon, { color: colors.textSecondary }]}>
              Customer management coming soon! 👥
            </Text>
          </View>
        )}

        {currentTab === 'analytics' && renderAnalytics()}

        {currentTab === 'settings' && renderSettings()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    marginHorizontal: 1,
  },
  tabText: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  // Products Styles
  productsContainer: {
    gap: 12,
  },
  productCard: {
    padding: 16,
    borderRadius: 12,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  productInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  productActions: {
    padding: 4,
  },
  productDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  productPricing: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  productComparePrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
  },
  productInventory: {
    fontSize: 12,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productTags: {
    flexDirection: 'row',
    gap: 6,
    flex: 1,
  },
  productTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  productTagText: {
    fontSize: 10,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  // Orders Styles
  ordersContainer: {
    gap: 12,
  },
  orderCard: {
    padding: 16,
    borderRadius: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  orderCustomer: {
    fontSize: 12,
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: 12,
  },
  orderItems: {
    marginBottom: 12,
  },
  orderItem: {
    fontSize: 12,
    marginBottom: 2,
  },
  viewOrderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewOrderText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  // Analytics Styles
  analyticsContainer: {
    gap: 16,
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  analyticsCard: {
    width: (width - 44) / 2,
    padding: 16,
    borderRadius: 12,
  },
  analyticsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  analyticsChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  analyticsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  analyticsTitle: {
    fontSize: 12,
  },
  chartCard: {
    padding: 16,
    borderRadius: 12,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  chartPlaceholder: {
    height: 200,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartPlaceholderText: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  // Settings Styles
  settingsContainer: {
    flex: 1,
  },
  settingsSection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  settingsSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  settingsItem: {
    marginBottom: 12,
  },
  settingsLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  settingsInput: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  settingsButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  settingsToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  settingsToggleLabel: {
    fontSize: 14,
    flex: 1,
  },
  // Other Styles
  customersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  comingSoon: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default React.memo(AdvancedEcommerceScreen);

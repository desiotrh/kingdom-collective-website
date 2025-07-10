import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  FlatList,
  Switch,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KingdomColors } from '../constants/KingdomColors';
import { useDualMode } from '../contexts/DualModeContext';

interface StoreTheme {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  isPremium: boolean;
}

interface StoreProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock: number;
  isActive: boolean;
}

interface OnlineStore {
  id: string;
  name: string;
  description: string;
  domain: string;
  theme: string;
  isActive: boolean;
  products: StoreProduct[];
  analytics: {
    totalViews: number;
    totalSales: number;
    revenue: number;
    conversionRate: number;
  };
  settings: {
    currency: string;
    shippingEnabled: boolean;
    taxEnabled: boolean;
    paymentMethods: string[];
  };
  createdAt: Date;
}

const EcommerceStoreBuilderScreen: React.FC = () => {
  const { currentMode } = useDualMode();
  const colors = currentMode === 'faith' ? KingdomColors.faith : KingdomColors.encouragement;
  
  const [stores, setStores] = useState<OnlineStore[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState<OnlineStore | null>(null);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [newStore, setNewStore] = useState({
    name: '',
    description: '',
    domain: '',
  });

  const storeThemes: StoreTheme[] = [
    {
      id: 'modern-minimal',
      name: 'Modern Minimal',
      description: 'Clean and professional design',
      thumbnail: 'https://example.com/theme-modern.jpg',
      primaryColor: '#1f2937',
      secondaryColor: '#f9fafb',
      fontFamily: 'Inter',
      isPremium: false,
    },
    {
      id: 'faith-inspired',
      name: 'Faith Inspired',
      description: 'Warm and welcoming Christian theme',
      thumbnail: 'https://example.com/theme-faith.jpg',
      primaryColor: '#7c3aed',
      secondaryColor: '#fef3c7',
      fontFamily: 'Crimson Text',
      isPremium: false,
    },
    {
      id: 'boutique-elegance',
      name: 'Boutique Elegance',
      description: 'Sophisticated luxury feel',
      thumbnail: 'https://example.com/theme-boutique.jpg',
      primaryColor: '#1f2937',
      secondaryColor: '#f59e0b',
      fontFamily: 'Playfair Display',
      isPremium: true,
    },
    {
      id: 'creative-artist',
      name: 'Creative Artist',
      description: 'Vibrant and creative design',
      thumbnail: 'https://example.com/theme-creative.jpg',
      primaryColor: '#ec4899',
      secondaryColor: '#fbbf24',
      fontFamily: 'Montserrat',
      isPremium: true,
    },
  ];

  useEffect(() => {
    loadStores();
  }, [currentMode]);

  const loadStores = () => {
    // Mock data - in real app, this would come from Firebase/API
    const mockStores: OnlineStore[] = currentMode === 'faith' ? [
      {
        id: '1',
        name: 'Kingdom Creations',
        description: 'Faith-based products and ministry resources',
        domain: 'kingdomcreations.store',
        theme: 'faith-inspired',
        isActive: true,
        products: [],
        analytics: {
          totalViews: 1250,
          totalSales: 28,
          revenue: 847.60,
          conversionRate: 2.24,
        },
        settings: {
          currency: 'USD',
          shippingEnabled: true,
          taxEnabled: true,
          paymentMethods: ['stripe', 'paypal'],
        },
        createdAt: new Date('2024-01-15'),
      },
    ] : [
      {
        id: '1',
        name: 'Creator Hub Store',
        description: 'Digital products and creative resources',
        domain: 'creatorhub.store',
        theme: 'modern-minimal',
        isActive: true,
        products: [],
        analytics: {
          totalViews: 890,
          totalSales: 15,
          revenue: 423.75,
          conversionRate: 1.69,
        },
        settings: {
          currency: 'USD',
          shippingEnabled: false,
          taxEnabled: false,
          paymentMethods: ['stripe'],
        },
        createdAt: new Date('2024-01-20'),
      },
    ];

    setStores(mockStores);
  };

  const getCurrentPrompt = () => {
    const faithPrompts = [
      "🏪 Build stores that reflect God's excellence",
      "✨ Create shopping experiences that bless customers",
      "💝 Design stores that share Kingdom values",
      "🌟 Let your storefront be a light in the marketplace",
    ];

    const encouragementPrompts = [
      "🚀 Build your online empire",
      "💪 Create stores that convert visitors to customers",
      "🌈 Design shopping experiences that delight",
      "✨ Turn your creativity into a thriving business",
    ];

    const prompts = currentMode === 'faith' ? faithPrompts : encouragementPrompts;
    return prompts[Math.floor(Math.random() * prompts.length)];
  };

  const createStore = () => {
    if (!newStore.name.trim()) {
      Alert.alert('Error', 'Please enter a store name');
      return;
    }

    if (!newStore.domain.trim()) {
      Alert.alert('Error', 'Please enter a domain name');
      return;
    }

    const store: OnlineStore = {
      id: Date.now().toString(),
      name: newStore.name,
      description: newStore.description,
      domain: newStore.domain.toLowerCase().replace(/\s+/g, ''),
      theme: currentMode === 'faith' ? 'faith-inspired' : 'modern-minimal',
      isActive: false,
      products: [],
      analytics: {
        totalViews: 0,
        totalSales: 0,
        revenue: 0,
        conversionRate: 0,
      },
      settings: {
        currency: 'USD',
        shippingEnabled: true,
        taxEnabled: false,
        paymentMethods: ['stripe'],
      },
      createdAt: new Date(),
    };

    setStores(prev => [...prev, store]);
    setShowCreateModal(false);
    setNewStore({ name: '', description: '', domain: '' });

    Alert.alert(
      'Store Created!',
      `${store.name} has been created successfully. Configure your theme and add products to launch.`
    );
  };

  const toggleStoreStatus = (storeId: string) => {
    setStores(prev => prev.map(store => {
      if (store.id === storeId) {
        const newStatus = !store.isActive;
        if (newStatus && store.products.length === 0) {
          Alert.alert(
            'Cannot Launch Store',
            'Please add at least one product before launching your store.',
            [{ text: 'OK' }]
          );
          return store;
        }
        return { ...store, isActive: newStatus };
      }
      return store;
    }));
  };

  const getThemePreview = (themeId: string) => {
    const theme = storeThemes.find(t => t.id === themeId);
    return theme ? theme.primaryColor : colors.accent;
  };

  const renderStore = ({ item }: { item: OnlineStore }) => (
    <View style={[styles.storeCard, { backgroundColor: colors.surface }]}>
      <View style={styles.storeHeader}>
        <View style={styles.storeInfo}>
          <View style={styles.storeTitleRow}>
            <Text style={[styles.storeName, { color: colors.text }]}>
              {item.name}
            </Text>
            <View style={[
              styles.statusBadge, 
              { backgroundColor: item.isActive ? '#4CAF50' : '#FF9800' }
            ]}>
              <Text style={styles.statusText}>
                {item.isActive ? 'LIVE' : 'DRAFT'}
              </Text>
            </View>
          </View>
          <Text style={[styles.storeDescription, { color: colors.textSecondary }]}>
            {item.description}
          </Text>
          <Text style={[styles.storeDomain, { color: colors.accent }]}>
            🌐 {item.domain}
          </Text>
        </View>
        <Switch
          value={item.isActive}
          onValueChange={() => toggleStoreStatus(item.id)}
          trackColor={{ false: colors.border, true: colors.accent }}
          thumbColor={item.isActive ? '#fff' : '#f4f3f4'}
        />
      </View>

      <View style={styles.themePreview}>
        <View style={[
          styles.themeColorBlock,
          { backgroundColor: getThemePreview(item.theme) }
        ]} />
        <Text style={[styles.themeLabel, { color: colors.textSecondary }]}>
          Theme: {storeThemes.find(t => t.id === item.theme)?.name || 'Default'}
        </Text>
      </View>

      <View style={styles.analyticsSection}>
        <Text style={[styles.analyticsTitle, { color: colors.text }]}>
          Performance
        </Text>
        <View style={styles.analyticsRow}>
          <View style={styles.analytic}>
            <Text style={[styles.analyticValue, { color: colors.text }]}>
              {item.analytics.totalViews.toLocaleString()}
            </Text>
            <Text style={[styles.analyticLabel, { color: colors.textSecondary }]}>
              Views
            </Text>
          </View>
          <View style={styles.analytic}>
            <Text style={[styles.analyticValue, { color: colors.text }]}>
              {item.analytics.totalSales}
            </Text>
            <Text style={[styles.analyticLabel, { color: colors.textSecondary }]}>
              Sales
            </Text>
          </View>
          <View style={styles.analytic}>
            <Text style={[styles.analyticValue, { color: colors.text }]}>
              ${item.analytics.revenue.toLocaleString()}
            </Text>
            <Text style={[styles.analyticLabel, { color: colors.textSecondary }]}>
              Revenue
            </Text>
          </View>
          <View style={styles.analytic}>
            <Text style={[styles.analyticValue, { color: colors.text }]}>
              {item.analytics.conversionRate}%
            </Text>
            <Text style={[styles.analyticLabel, { color: colors.textSecondary }]}>
              CVR
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.storeActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton, { borderColor: colors.accent }]}
          onPress={() => {
            setSelectedStore(item);
            setShowStoreModal(true);
          }}
        >
          <Text style={[styles.actionButtonText, { color: colors.accent }]}>
            Customize
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.viewButton, { backgroundColor: colors.accent }]}
          onPress={() => {
            Alert.alert(
              'Store Preview',
              `Preview ${item.name} store\n\nDomain: ${item.domain}\nProducts: ${item.products.length}\nStatus: ${item.isActive ? 'Live' : 'Draft'}`
            );
          }}
        >
          <Text style={styles.viewButtonText}>Preview</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTheme = ({ item }: { item: StoreTheme }) => (
    <TouchableOpacity
      style={[styles.themeCard, { backgroundColor: colors.surface }]}
      onPress={() => {
        if (item.isPremium) {
          Alert.alert(
            'Premium Theme',
            'This theme requires a premium subscription to use.',
            [
              { text: 'Preview', onPress: () => {} },
              { text: 'Upgrade', onPress: () => {} },
              { text: 'Cancel', style: 'cancel' },
            ]
          );
        } else {
          Alert.alert('Theme Applied', `${item.name} theme has been applied to your store!`);
        }
      }}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.themeImage} />
      <View style={styles.themeInfo}>
        <Text style={[styles.themeName, { color: colors.text }]}>
          {item.name}
          {item.isPremium && <Text style={styles.premiumBadge}> ✨</Text>}
        </Text>
        <Text style={[styles.themeDescription, { color: colors.textSecondary }]}>
          {item.description}
        </Text>
        <View style={styles.themeColors}>
          <View style={[styles.colorSwatch, { backgroundColor: item.primaryColor }]} />
          <View style={[styles.colorSwatch, { backgroundColor: item.secondaryColor }]} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          E-commerce Store Builder
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {getCurrentPrompt()}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Your Stores
            </Text>
            <TouchableOpacity
              style={[styles.createButton, { backgroundColor: colors.accent }]}
              onPress={() => setShowCreateModal(true)}
            >
              <Text style={styles.createButtonText}>+ Create Store</Text>
            </TouchableOpacity>
          </View>

          {stores.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
              <Text style={styles.emptyStateIcon}>🏪</Text>
              <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
                No Stores Yet
              </Text>
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                Create your first online store to start selling your products
              </Text>
            </View>
          ) : (
            <FlatList
              data={stores}
              renderItem={renderStore}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.storesList}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Store Themes
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Choose a professional design for your store
          </Text>
          <FlatList
            data={storeThemes}
            renderItem={renderTheme}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.themesList}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Store Building Tips
          </Text>
          <View style={[styles.tipsCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.tipText, { color: colors.text }]}>
              🎯 Choose a memorable domain name for your store
            </Text>
            <Text style={[styles.tipText, { color: colors.text }]}>
              🛍️ Add high-quality product images and descriptions
            </Text>
            <Text style={[styles.tipText, { color: colors.text }]}>
              💳 Set up secure payment processing options
            </Text>
            <Text style={[styles.tipText, { color: colors.text }]}>
              📱 Ensure your store looks great on mobile devices
            </Text>
            <Text style={[styles.tipText, { color: colors.text }]}>
              🚀 Launch with at least 5-10 quality products
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Create Store Modal */}
      <Modal visible={showCreateModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Text style={[styles.cancelText, { color: colors.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Create Store
            </Text>
            <TouchableOpacity onPress={createStore}>
              <Text style={[styles.saveText, { color: colors.accent }]}>
                Create
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formSection}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>
                Store Name *
              </Text>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.border,
                }]}
                value={newStore.name}
                onChangeText={(text) => setNewStore(prev => ({ ...prev, name: text }))}
                placeholder="Enter store name"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>
                Description
              </Text>
              <TextInput
                style={[styles.textInput, styles.textArea, { 
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.border,
                }]}
                value={newStore.description}
                onChangeText={(text) => setNewStore(prev => ({ ...prev, description: text }))}
                placeholder="Describe your store"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>
                Domain Name *
              </Text>
              <View style={styles.domainInput}>
                <TextInput
                  style={[styles.textInput, styles.domainField, { 
                    backgroundColor: colors.surface,
                    color: colors.text,
                    borderColor: colors.border,
                  }]}
                  value={newStore.domain}
                  onChangeText={(text) => setNewStore(prev => ({ 
                    ...prev, 
                    domain: text.toLowerCase().replace(/\s+/g, '') 
                  }))}
                  placeholder="mystorename"
                  placeholderTextColor={colors.textSecondary}
                />
                <Text style={[styles.domainSuffix, { color: colors.textSecondary }]}>
                  .store
                </Text>
              </View>
            </View>

            <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.infoTitle, { color: colors.text }]}>
                🚀 Getting Started
              </Text>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                After creating your store, you can:{'\n'}
                • Customize your store theme and branding{'\n'}
                • Add products from your existing catalog{'\n'}
                • Set up payment and shipping options{'\n'}
                • Launch and start selling online
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Store Customization Modal */}
      <Modal visible={showStoreModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowStoreModal(false)}>
              <Text style={[styles.cancelText, { color: colors.textSecondary }]}>
                Close
              </Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Customize Store
            </Text>
            <TouchableOpacity>
              <Text style={[styles.saveText, { color: colors.accent }]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={[styles.comingSoonText, { color: colors.textSecondary }]}>
              Store customization features coming soon!{'\n\n'}
              You'll be able to:{'\n'}
              • Customize themes and colors{'\n'}
              • Add/edit products{'\n'}
              • Configure payment settings{'\n'}
              • Set up shipping options
            </Text>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  createButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyState: {
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  storesList: {
    gap: 16,
  },
  storeCard: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  storeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  storeInfo: {
    flex: 1,
  },
  storeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  storeName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  storeDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  storeDomain: {
    fontSize: 12,
    fontWeight: '600',
  },
  themePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  themeColorBlock: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  themeLabel: {
    fontSize: 12,
  },
  analyticsSection: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
    marginBottom: 16,
  },
  analyticsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  analyticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  analytic: {
    alignItems: 'center',
  },
  analyticValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  analyticLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  storeActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButton: {
    borderWidth: 1,
  },
  viewButton: {
    // backgroundColor applied dynamically
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  themesList: {
    gap: 12,
    paddingRight: 20,
  },
  themeCard: {
    width: 200,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  themeImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#f0f0f0',
  },
  themeInfo: {
    padding: 12,
  },
  themeName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  premiumBadge: {
    color: '#f59e0b',
  },
  themeDescription: {
    fontSize: 12,
    marginBottom: 8,
    lineHeight: 16,
  },
  themeColors: {
    flexDirection: 'row',
    gap: 4,
  },
  colorSwatch: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  tipsCard: {
    borderRadius: 12,
    padding: 16,
  },
  tipText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelText: {
    fontSize: 16,
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formSection: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  domainInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  domainField: {
    flex: 1,
    marginRight: 8,
  },
  domainSuffix: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  comingSoonText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
    lineHeight: 24,
  },
});

export default React.memo(EcommerceStoreBuilderScreen);

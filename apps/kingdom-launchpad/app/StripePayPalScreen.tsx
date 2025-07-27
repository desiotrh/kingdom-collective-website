import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Modal,
    TextInput,
    Switch,
    FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StripeProvider, CardField, useStripe } from '@stripe/stripe-react-native';

interface PaymentMethod {
    id: string;
    type: 'stripe' | 'paypal';
    name: string;
    isActive: boolean;
    isTestMode: boolean;
    apiKey?: string;
    secretKey?: string;
    webhookUrl?: string;
}

interface CheckoutPage {
    id: string;
    name: string;
    productId: string;
    productName: string;
    price: number;
    currency: string;
    isActive: boolean;
    createdAt: Date;
    views: number;
    conversions: number;
    revenue: number;
}

interface CartAbandonment {
    id: string;
    customerEmail: string;
    productName: string;
    price: number;
    abandonedAt: Date;
    reminderSent: number;
    recovered: boolean;
}

interface UpsellOffer {
    id: string;
    name: string;
    description: string;
    originalPrice: number;
    discountPrice: number;
    discountPercentage: number;
    isActive: boolean;
    triggerType: 'post_purchase' | 'cart_abandonment' | 'email_sequence';
}

const StripePayPalScreen: React.FC = () => {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [checkoutPages, setCheckoutPages] = useState<CheckoutPage[]>([]);
    const [cartAbandonments, setCartAbandonments] = useState<CartAbandonment[]>([]);
    const [upsellOffers, setUpsellOffers] = useState<UpsellOffer[]>([]);
    const [selectedTab, setSelectedTab] = useState<'payment' | 'checkout' | 'cart' | 'upsell'>('payment');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [showUpsellModal, setShowUpsellModal] = useState(false);
    const [newPaymentMethod, setNewPaymentMethod] = useState<Partial<PaymentMethod>>({});
    const [newCheckoutPage, setNewCheckoutPage] = useState<Partial<CheckoutPage>>({});
    const [newUpsellOffer, setNewUpsellOffer] = useState<Partial<UpsellOffer>>({});

    // Mock data
    useEffect(() => {
        setPaymentMethods([
            {
                id: '1',
                type: 'stripe',
                name: 'Stripe Production',
                isActive: true,
                isTestMode: false,
                apiKey: 'pk_live_...',
                secretKey: 'sk_live_...',
                webhookUrl: 'https://your-domain.com/webhooks/stripe'
            },
            {
                id: '2',
                type: 'paypal',
                name: 'PayPal Business',
                isActive: true,
                isTestMode: false,
                apiKey: 'client_id_...',
                secretKey: 'client_secret_...',
                webhookUrl: 'https://your-domain.com/webhooks/paypal'
            }
        ]);

        setCheckoutPages([
            {
                id: '1',
                name: 'Kingdom Course Checkout',
                productId: 'course_1',
                productName: 'Kingdom Business Course',
                price: 197,
                currency: 'USD',
                isActive: true,
                createdAt: new Date('2024-01-01'),
                views: 1250,
                conversions: 89,
                revenue: 17533
            },
            {
                id: '2',
                name: 'Faith Journal Checkout',
                productId: 'journal_1',
                productName: 'Faith Journal',
                price: 27,
                currency: 'USD',
                isActive: true,
                createdAt: new Date('2024-01-15'),
                views: 890,
                conversions: 156,
                revenue: 4212
            }
        ]);

        setCartAbandonments([
            {
                id: '1',
                customerEmail: 'john@example.com',
                productName: 'Kingdom Business Course',
                price: 197,
                abandonedAt: new Date('2024-01-20'),
                reminderSent: 1,
                recovered: false
            },
            {
                id: '2',
                customerEmail: 'sarah@example.com',
                productName: 'Faith Journal',
                price: 27,
                abandonedAt: new Date('2024-01-19'),
                reminderSent: 2,
                recovered: true
            }
        ]);

        setUpsellOffers([
            {
                id: '1',
                name: '1:1 Coaching Session',
                description: 'Get personalized guidance for your business',
                originalPrice: 150,
                discountPrice: 97,
                discountPercentage: 35,
                isActive: true,
                triggerType: 'post_purchase'
            },
            {
                id: '2',
                name: 'Premium Bundle',
                description: 'Complete course + templates + community access',
                originalPrice: 297,
                discountPrice: 197,
                discountPercentage: 34,
                isActive: true,
                triggerType: 'cart_abandonment'
            }
        ]);
    }, []);

    const addPaymentMethod = () => {
        if (!newPaymentMethod.name || !newPaymentMethod.apiKey) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const paymentMethod: PaymentMethod = {
            id: Date.now().toString(),
            type: newPaymentMethod.type || 'stripe',
            name: newPaymentMethod.name,
            isActive: newPaymentMethod.isActive || false,
            isTestMode: newPaymentMethod.isTestMode || false,
            apiKey: newPaymentMethod.apiKey,
            secretKey: newPaymentMethod.secretKey,
            webhookUrl: newPaymentMethod.webhookUrl
        };

        setPaymentMethods([...paymentMethods, paymentMethod]);
        setNewPaymentMethod({});
        setShowPaymentModal(false);
        Alert.alert('Success', 'Payment method added successfully!');
    };

    const createCheckoutPage = () => {
        if (!newCheckoutPage.name || !newCheckoutPage.productName || !newCheckoutPage.price) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const checkoutPage: CheckoutPage = {
            id: Date.now().toString(),
            name: newCheckoutPage.name,
            productId: newCheckoutPage.productId || 'product_' + Date.now(),
            productName: newCheckoutPage.productName,
            price: parseFloat(newCheckoutPage.price.toString()),
            currency: newCheckoutPage.currency || 'USD',
            isActive: newCheckoutPage.isActive || true,
            createdAt: new Date(),
            views: 0,
            conversions: 0,
            revenue: 0
        };

        setCheckoutPages([...checkoutPages, checkoutPage]);
        setNewCheckoutPage({});
        setShowCheckoutModal(false);
        Alert.alert('Success', 'Checkout page created successfully!');
    };

    const createUpsellOffer = () => {
        if (!newUpsellOffer.name || !newUpsellOffer.description || !newUpsellOffer.originalPrice) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const upsellOffer: UpsellOffer = {
            id: Date.now().toString(),
            name: newUpsellOffer.name,
            description: newUpsellOffer.description,
            originalPrice: parseFloat(newUpsellOffer.originalPrice.toString()),
            discountPrice: parseFloat(newUpsellOffer.discountPrice?.toString() || '0'),
            discountPercentage: parseFloat(newUpsellOffer.discountPercentage?.toString() || '0'),
            isActive: newUpsellOffer.isActive || true,
            triggerType: newUpsellOffer.triggerType || 'post_purchase'
        };

        setUpsellOffers([...upsellOffers, upsellOffer]);
        setNewUpsellOffer({});
        setShowUpsellModal(false);
        Alert.alert('Success', 'Upsell offer created successfully!');
    };

    const sendCartAbandonmentReminder = (abandonment: CartAbandonment) => {
        // Mock sending reminder
        const updatedAbandonments = cartAbandonments.map(ca =>
            ca.id === abandonment.id
                ? { ...ca, reminderSent: ca.reminderSent + 1 }
                : ca
        );
        setCartAbandonments(updatedAbandonments);
        Alert.alert('Reminder Sent', `Reminder sent to ${abandonment.customerEmail}`);
    };

    const getConversionRate = (views: number, conversions: number) => {
        return views > 0 ? ((conversions / views) * 100).toFixed(2) : '0.00';
    };

    const getTotalRevenue = () => {
        return checkoutPages.reduce((sum, page) => sum + page.revenue, 0);
    };

    const getTotalConversions = () => {
        return checkoutPages.reduce((sum, page) => sum + page.conversions, 0);
    };

    const renderPaymentMethods = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>💳 Payment Methods</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowPaymentModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Add Method</Text>
                </TouchableOpacity>
            </View>

            {paymentMethods.map(method => (
                <View key={method.id} style={styles.methodCard}>
                    <View style={styles.methodHeader}>
                        <View style={styles.methodIcon}>
                            <Ionicons
                                name={method.type === 'stripe' ? 'card' : 'logo-paypal'}
                                size={24}
                                color={method.type === 'stripe' ? '#6772E5' : '#003087'}
                            />
                        </View>
                        <View style={styles.methodInfo}>
                            <Text style={styles.methodName}>{method.name}</Text>
                            <Text style={styles.methodType}>{method.type.toUpperCase()}</Text>
                            <View style={styles.methodMeta}>
                                {method.isActive && <Text style={styles.activeBadge}>Active</Text>}
                                {method.isTestMode && <Text style={styles.testBadge}>Test Mode</Text>}
                            </View>
                        </View>
                        <TouchableOpacity style={styles.methodAction}>
                            <Ionicons name="settings" size={20} color="#666" />
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
        </View>
    );

    const renderCheckoutPages = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>🛒 Checkout Pages</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowCheckoutModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Create Page</Text>
                </TouchableOpacity>
            </View>

            {checkoutPages.map(page => (
                <View key={page.id} style={styles.checkoutCard}>
                    <View style={styles.checkoutHeader}>
                        <Text style={styles.checkoutName}>{page.name}</Text>
                        <Text style={styles.checkoutPrice}>${page.price}</Text>
                    </View>
                    <Text style={styles.checkoutProduct}>{page.productName}</Text>
                    <View style={styles.checkoutStats}>
                        <View style={styles.stat}>
                            <Text style={styles.statValue}>{page.views}</Text>
                            <Text style={styles.statLabel}>Views</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statValue}>{page.conversions}</Text>
                            <Text style={styles.statLabel}>Sales</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statValue}>{getConversionRate(page.views, page.conversions)}%</Text>
                            <Text style={styles.statLabel}>Conversion</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statValue}>${page.revenue}</Text>
                            <Text style={styles.statLabel}>Revenue</Text>
                        </View>
                    </View>
                    <View style={styles.checkoutActions}>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="eye" size={16} color="#2196F3" />
                            <Text style={styles.actionText}>View</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="copy" size={16} color="#4CAF50" />
                            <Text style={styles.actionText}>Copy Link</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="analytics" size={16} color="#FF9800" />
                            <Text style={styles.actionText}>Analytics</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
        </View>
    );

    const renderCartAbandonment = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>🛒 Cart Abandonment</Text>
            <Text style={styles.sectionDescription}>
                Track and recover abandoned carts with automated reminders
            </Text>

            {cartAbandonments.map(abandonment => (
                <View key={abandonment.id} style={styles.abandonmentCard}>
                    <View style={styles.abandonmentHeader}>
                        <Text style={styles.abandonmentEmail}>{abandonment.customerEmail}</Text>
                        <Text style={styles.abandonmentDate}>
                            {abandonment.abandonedAt.toLocaleDateString()}
                        </Text>
                    </View>
                    <Text style={styles.abandonmentProduct}>{abandonment.productName}</Text>
                    <Text style={styles.abandonmentPrice}>${abandonment.price}</Text>
                    <View style={styles.abandonmentMeta}>
                        <Text style={styles.abandonmentReminders}>
                            Reminders sent: {abandonment.reminderSent}
                        </Text>
                        {abandonment.recovered && (
                            <Text style={styles.recoveredBadge}>Recovered</Text>
                        )}
                    </View>
                    <TouchableOpacity
                        style={styles.reminderButton}
                        onPress={() => sendCartAbandonmentReminder(abandonment)}
                    >
                        <Ionicons name="mail" size={16} color="#fff" />
                        <Text style={styles.reminderButtonText}>Send Reminder</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );

    const renderUpsellOffers = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>💰 Upsell Offers</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowUpsellModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Create Offer</Text>
                </TouchableOpacity>
            </View>

            {upsellOffers.map(offer => (
                <View key={offer.id} style={styles.upsellCard}>
                    <View style={styles.upsellHeader}>
                        <Text style={styles.upsellName}>{offer.name}</Text>
                        <Text style={styles.upsellDiscount}>{offer.discountPercentage}% OFF</Text>
                    </View>
                    <Text style={styles.upsellDescription}>{offer.description}</Text>
                    <View style={styles.upsellPricing}>
                        <Text style={styles.upsellOriginalPrice}>${offer.originalPrice}</Text>
                        <Text style={styles.upsellDiscountPrice}>${offer.discountPrice}</Text>
                    </View>
                    <View style={styles.upsellMeta}>
                        <Text style={styles.upsellTrigger}>{offer.triggerType.replace('_', ' ')}</Text>
                        {offer.isActive && <Text style={styles.activeBadge}>Active</Text>}
                    </View>
                </View>
            ))}
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>💳 Stripe & PayPal Integration</Text>
                <Text style={styles.headerSubtitle}>Payment processing and checkout management</Text>
            </LinearGradient>

            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'payment' && styles.activeTab]}
                    onPress={() => setSelectedTab('payment')}
                >
                    <Ionicons name="card" size={20} color={selectedTab === 'payment' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'payment' && styles.activeTabText]}>
                        Payment
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'checkout' && styles.activeTab]}
                    onPress={() => setSelectedTab('checkout')}
                >
                    <Ionicons name="cart" size={20} color={selectedTab === 'checkout' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'checkout' && styles.activeTabText]}>
                        Checkout
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'cart' && styles.activeTab]}
                    onPress={() => setSelectedTab('cart')}
                >
                    <Ionicons name="alert-circle" size={20} color={selectedTab === 'cart' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'cart' && styles.activeTabText]}>
                        Cart
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'upsell' && styles.activeTab]}
                    onPress={() => setSelectedTab('upsell')}
                >
                    <Ionicons name="trending-up" size={20} color={selectedTab === 'upsell' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'upsell' && styles.activeTabText]}>
                        Upsell
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {/* Stats Overview */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>${getTotalRevenue().toLocaleString()}</Text>
                        <Text style={styles.statLabel}>Total Revenue</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{getTotalConversions()}</Text>
                        <Text style={styles.statLabel}>Total Sales</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{cartAbandonments.length}</Text>
                        <Text style={styles.statLabel}>Abandoned Carts</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{upsellOffers.length}</Text>
                        <Text style={styles.statLabel}>Upsell Offers</Text>
                    </View>
                </View>

                {/* Tab Content */}
                {selectedTab === 'payment' && renderPaymentMethods()}
                {selectedTab === 'checkout' && renderCheckoutPages()}
                {selectedTab === 'cart' && renderCartAbandonment()}
                {selectedTab === 'upsell' && renderUpsellOffers()}

                {/* Payment Method Modal */}
                <Modal
                    visible={showPaymentModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowPaymentModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <ScrollView style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add Payment Method</Text>

                            <Text style={styles.inputLabel}>Method Name</Text>
                            <TextInput
                                style={styles.input}
                                value={newPaymentMethod.name}
                                onChangeText={(text) => setNewPaymentMethod({ ...newPaymentMethod, name: text })}
                                placeholder="e.g., Stripe Production"
                            />

                            <Text style={styles.inputLabel}>Payment Type</Text>
                            <View style={styles.radioGroup}>
                                <TouchableOpacity
                                    style={[
                                        styles.radioButton,
                                        newPaymentMethod.type === 'stripe' && styles.radioButtonActive
                                    ]}
                                    onPress={() => setNewPaymentMethod({ ...newPaymentMethod, type: 'stripe' })}
                                >
                                    <Ionicons name="card" size={20} color="#6772E5" />
                                    <Text style={styles.radioLabel}>Stripe</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.radioButton,
                                        newPaymentMethod.type === 'paypal' && styles.radioButtonActive
                                    ]}
                                    onPress={() => setNewPaymentMethod({ ...newPaymentMethod, type: 'paypal' })}
                                >
                                    <Ionicons name="logo-paypal" size={20} color="#003087" />
                                    <Text style={styles.radioLabel}>PayPal</Text>
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.inputLabel}>API Key</Text>
                            <TextInput
                                style={styles.input}
                                value={newPaymentMethod.apiKey}
                                onChangeText={(text) => setNewPaymentMethod({ ...newPaymentMethod, apiKey: text })}
                                placeholder="Enter API key"
                                secureTextEntry
                            />

                            <Text style={styles.inputLabel}>Secret Key</Text>
                            <TextInput
                                style={styles.input}
                                value={newPaymentMethod.secretKey}
                                onChangeText={(text) => setNewPaymentMethod({ ...newPaymentMethod, secretKey: text })}
                                placeholder="Enter secret key"
                                secureTextEntry
                            />

                            <View style={styles.settingRow}>
                                <Text style={styles.settingLabel}>Test Mode</Text>
                                <Switch
                                    value={newPaymentMethod.isTestMode}
                                    onValueChange={(value) => setNewPaymentMethod({ ...newPaymentMethod, isTestMode: value })}
                                />
                            </View>

                            <View style={styles.settingRow}>
                                <Text style={styles.settingLabel}>Active</Text>
                                <Switch
                                    value={newPaymentMethod.isActive}
                                    onValueChange={(value) => setNewPaymentMethod({ ...newPaymentMethod, isActive: value })}
                                />
                            </View>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={addPaymentMethod}
                                >
                                    <Text style={styles.modalButtonText}>Add Method</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowPaymentModal(false)}
                                >
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </Modal>

                {/* Checkout Page Modal */}
                <Modal
                    visible={showCheckoutModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowCheckoutModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Create Checkout Page</Text>

                            <Text style={styles.inputLabel}>Page Name</Text>
                            <TextInput
                                style={styles.input}
                                value={newCheckoutPage.name}
                                onChangeText={(text) => setNewCheckoutPage({ ...newCheckoutPage, name: text })}
                                placeholder="e.g., Course Checkout"
                            />

                            <Text style={styles.inputLabel}>Product Name</Text>
                            <TextInput
                                style={styles.input}
                                value={newCheckoutPage.productName}
                                onChangeText={(text) => setNewCheckoutPage({ ...newCheckoutPage, productName: text })}
                                placeholder="e.g., Kingdom Business Course"
                            />

                            <Text style={styles.inputLabel}>Price ($)</Text>
                            <TextInput
                                style={styles.input}
                                value={newCheckoutPage.price?.toString()}
                                onChangeText={(text) => setNewCheckoutPage({ ...newCheckoutPage, price: parseFloat(text) || 0 })}
                                placeholder="0.00"
                                keyboardType="numeric"
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={createCheckoutPage}
                                >
                                    <Text style={styles.modalButtonText}>Create Page</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowCheckoutModal(false)}
                                >
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Upsell Offer Modal */}
                <Modal
                    visible={showUpsellModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowUpsellModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <ScrollView style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Create Upsell Offer</Text>

                            <Text style={styles.inputLabel}>Offer Name</Text>
                            <TextInput
                                style={styles.input}
                                value={newUpsellOffer.name}
                                onChangeText={(text) => setNewUpsellOffer({ ...newUpsellOffer, name: text })}
                                placeholder="e.g., Premium Coaching"
                            />

                            <Text style={styles.inputLabel}>Description</Text>
                            <TextInput
                                style={[styles.input, { height: 80 }]}
                                value={newUpsellOffer.description}
                                onChangeText={(text) => setNewUpsellOffer({ ...newUpsellOffer, description: text })}
                                placeholder="Describe your upsell offer..."
                                multiline
                                textAlignVertical="top"
                            />

                            <Text style={styles.inputLabel}>Original Price ($)</Text>
                            <TextInput
                                style={styles.input}
                                value={newUpsellOffer.originalPrice?.toString()}
                                onChangeText={(text) => setNewUpsellOffer({ ...newUpsellOffer, originalPrice: parseFloat(text) || 0 })}
                                placeholder="0.00"
                                keyboardType="numeric"
                            />

                            <Text style={styles.inputLabel}>Discount Price ($)</Text>
                            <TextInput
                                style={styles.input}
                                value={newUpsellOffer.discountPrice?.toString()}
                                onChangeText={(text) => setNewUpsellOffer({ ...newUpsellOffer, discountPrice: parseFloat(text) || 0 })}
                                placeholder="0.00"
                                keyboardType="numeric"
                            />

                            <Text style={styles.inputLabel}>Trigger Type</Text>
                            <View style={styles.radioGroup}>
                                <TouchableOpacity
                                    style={[
                                        styles.radioButton,
                                        newUpsellOffer.triggerType === 'post_purchase' && styles.radioButtonActive
                                    ]}
                                    onPress={() => setNewUpsellOffer({ ...newUpsellOffer, triggerType: 'post_purchase' })}
                                >
                                    <Text style={styles.radioLabel}>Post Purchase</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.radioButton,
                                        newUpsellOffer.triggerType === 'cart_abandonment' && styles.radioButtonActive
                                    ]}
                                    onPress={() => setNewUpsellOffer({ ...newUpsellOffer, triggerType: 'cart_abandonment' })}
                                >
                                    <Text style={styles.radioLabel}>Cart Abandonment</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={createUpsellOffer}
                                >
                                    <Text style={styles.modalButtonText}>Create Offer</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowUpsellModal(false)}
                                >
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </Modal>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        padding: 20,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.9,
    },
    tabs: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: '#667eea10',
    },
    tabText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
    },
    activeTabText: {
        color: '#667eea',
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        marginHorizontal: 4,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#667eea',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    sectionDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 4,
    },
    methodCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    methodHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    methodIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    methodInfo: {
        flex: 1,
    },
    methodName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    methodType: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    methodMeta: {
        flexDirection: 'row',
        gap: 8,
    },
    activeBadge: {
        fontSize: 10,
        color: '#fff',
        backgroundColor: '#4CAF50',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    testBadge: {
        fontSize: 10,
        color: '#fff',
        backgroundColor: '#FF9800',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    methodAction: {
        padding: 8,
    },
    checkoutCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    checkoutHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    checkoutName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    checkoutPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    checkoutProduct: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    checkoutStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    stat: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
    },
    checkoutActions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
    },
    actionText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
    abandonmentCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    abandonmentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    abandonmentEmail: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    abandonmentDate: {
        fontSize: 12,
        color: '#666',
    },
    abandonmentProduct: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    abandonmentPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 8,
    },
    abandonmentMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    abandonmentReminders: {
        fontSize: 12,
        color: '#666',
    },
    recoveredBadge: {
        fontSize: 10,
        color: '#fff',
        backgroundColor: '#4CAF50',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    reminderButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2196F3',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    reminderButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
        marginLeft: 4,
    },
    upsellCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    upsellHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    upsellName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    upsellDiscount: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#f44336',
    },
    upsellDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    upsellPricing: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    upsellOriginalPrice: {
        fontSize: 14,
        color: '#666',
        textDecorationLine: 'line-through',
    },
    upsellDiscountPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    upsellMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    upsellTrigger: {
        fontSize: 12,
        color: '#666',
        textTransform: 'capitalize',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
    },
    radioGroup: {
        flexDirection: 'row',
        marginBottom: 16,
        gap: 8,
    },
    radioButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
    },
    radioButtonActive: {
        borderColor: '#667eea',
        backgroundColor: '#667eea10',
    },
    radioLabel: {
        fontSize: 14,
        color: '#333',
        marginLeft: 8,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    settingLabel: {
        fontSize: 16,
        color: '#333',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    modalButton: {
        flex: 1,
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    cancelButton: {
        backgroundColor: '#f44336',
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default StripePayPalScreen; 
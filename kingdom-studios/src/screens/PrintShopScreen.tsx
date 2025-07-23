import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Modal,
    Image,
    Switch,
} from 'react-native';
import { useDualMode } from '../contexts/DualModeContext';
import { KingdomColors } from '../constants/KingdomColors';
import { Ionicons } from '@expo/vector-icons';

interface Product {
    id: string;
    name: string;
    type: 'print' | 'canvas' | 'digital' | 'preset';
    price: number;
    description: string;
    spiritualDeclaration?: string;
    imageUrl?: string;
    available: boolean;
    tags: string[];
}

interface CartItem {
    productId: string;
    quantity: number;
    product: Product;
}

interface Order {
    id: string;
    items: CartItem[];
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered';
    createdAt: Date;
}

const PrintShopScreen: React.FC = () => {
    const { isFaithMode } = useDualMode();
    const [products, setProducts] = useState<Product[]>([
        {
            id: '1',
            name: '8x10 Fine Art Print',
            type: 'print',
            price: 25.00,
            description: 'High-quality fine art print on archival paper',
            spiritualDeclaration: isFaithMode ? 'Each print carries the light of God\'s creation' : undefined,
            available: true,
            tags: ['portrait', 'landscape'],
        },
        {
            id: '2',
            name: '16x20 Canvas Wrap',
            type: 'canvas',
            price: 85.00,
            description: 'Gallery-wrapped canvas with museum-quality finish',
            spiritualDeclaration: isFaithMode ? 'Blessed canvas to grace your home with beauty' : undefined,
            available: true,
            tags: ['large', 'gallery'],
        },
        {
            id: '3',
            name: 'Digital Download Pack',
            type: 'digital',
            price: 15.00,
            description: 'High-resolution digital files for personal use',
            spiritualDeclaration: isFaithMode ? 'Digital blessings to share and inspire' : undefined,
            available: true,
            tags: ['digital', 'instant'],
        },
        {
            id: '4',
            name: 'Faithful Light Preset',
            type: 'preset',
            price: 12.00,
            description: 'Lightroom preset for warm, spiritual tones',
            spiritualDeclaration: isFaithMode ? 'Preset inspired by God\'s perfect light' : undefined,
            available: true,
            tags: ['preset', 'lightroom'],
        },
        {
            id: '5',
            name: 'Encouragement Collection',
            type: 'preset',
            price: 18.00,
            description: '5 presets for uplifting and inspiring edits',
            spiritualDeclaration: isFaithMode ? 'Collection to bring light and hope to your work' : undefined,
            available: true,
            tags: ['collection', 'presets'],
        },
    ]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [showAddProductModal, setShowAddProductModal] = useState(false);
    const [showCartModal, setShowCartModal] = useState(false);
    const [newProduct, setNewProduct] = useState<Partial<Product>>({
        name: '',
        type: 'print',
        price: 0,
        description: '',
        spiritualDeclaration: '',
        available: true,
        tags: [],
    });

    const productTypes = [
        { id: 'print', name: 'Print', icon: 'image' },
        { id: 'canvas', name: 'Canvas', icon: 'easel' },
        { id: 'digital', name: 'Digital', icon: 'download' },
        { id: 'preset', name: 'Preset', icon: 'color-palette' },
    ];

    const addToCart = (product: Product) => {
        const existingItem = cart.find(item => item.productId === product.id);

        if (existingItem) {
            setCart(cart.map(item =>
                item.productId === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { productId: product.id, quantity: 1, product }]);
        }

        Alert.alert(
            'Added to Cart',
            isFaithMode
                ? `${product.name} has been blessed and added to your cart.`
                : `${product.name} added to cart!`
        );
    };

    const removeFromCart = (productId: string) => {
        setCart(cart.filter(item => item.productId !== productId));
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            setCart(cart.map(item =>
                item.productId === productId
                    ? { ...item, quantity }
                    : item
            ));
        }
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    };

    const checkout = () => {
        if (cart.length === 0) {
            Alert.alert('Empty Cart', 'Please add items to your cart before checkout.');
            return;
        }

        const order: Order = {
            id: Date.now().toString(),
            items: cart,
            total: calculateTotal(),
            status: 'pending',
            createdAt: new Date(),
        };

        setOrders([order, ...orders]);
        setCart([]);
        setShowCartModal(false);

        Alert.alert(
            'Order Placed',
            isFaithMode
                ? 'Your order has been blessed and is being processed. May these products bring joy and inspiration.'
                : 'Order placed successfully! You will receive a confirmation email shortly.'
        );
    };

    const addProduct = () => {
        if (!newProduct.name || !newProduct.description || newProduct.price === 0) {
            Alert.alert('Missing Information', 'Please fill in all required fields.');
            return;
        }

        const product: Product = {
            id: Date.now().toString(),
            name: newProduct.name || '',
            type: newProduct.type || 'print',
            price: newProduct.price || 0,
            description: newProduct.description || '',
            spiritualDeclaration: newProduct.spiritualDeclaration,
            available: newProduct.available || true,
            tags: newProduct.tags || [],
        };

        setProducts([product, ...products]);
        setNewProduct({
            name: '',
            type: 'print',
            price: 0,
            description: '',
            spiritualDeclaration: '',
            available: true,
            tags: [],
        });
        setShowAddProductModal(false);

        Alert.alert(
            'Product Added',
            isFaithMode
                ? 'Your product has been blessed and added to your store.'
                : 'Product added successfully to your store!'
        );
    };

    const AddProductModal = () => (
        <Modal
            visible={showAddProductModal}
            animationType="slide"
            transparent={true}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>
                        {isFaithMode ? 'Add Blessed Product' : 'Add New Product'}
                    </Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Product Name</Text>
                        <TextInput
                            style={styles.input}
                            value={newProduct.name}
                            onChangeText={(text) => setNewProduct({ ...newProduct, name: text })}
                            placeholder="Enter product name"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Product Type</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {productTypes.map((type) => (
                                <TouchableOpacity
                                    key={type.id}
                                    style={[
                                        styles.typeButton,
                                        newProduct.type === type.id && styles.selectedType
                                    ]}
                                    onPress={() => setNewProduct({ ...newProduct, type: type.id as any })}
                                >
                                    <Ionicons
                                        name={type.icon as any}
                                        size={20}
                                        color={newProduct.type === type.id ? KingdomColors.softWhite : KingdomColors.bronze}
                                    />
                                    <Text style={[
                                        styles.typeText,
                                        newProduct.type === type.id && styles.selectedTypeText
                                    ]}>
                                        {type.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Price ($)</Text>
                        <TextInput
                            style={styles.input}
                            value={newProduct.price?.toString()}
                            onChangeText={(text) => setNewProduct({ ...newProduct, price: parseFloat(text) || 0 })}
                            placeholder="0.00"
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={styles.textInput}
                            value={newProduct.description}
                            onChangeText={(text) => setNewProduct({ ...newProduct, description: text })}
                            placeholder="Describe your product..."
                            multiline
                        />
                    </View>

                    {isFaithMode && (
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Spiritual Declaration (Optional)</Text>
                            <TextInput
                                style={styles.textInput}
                                value={newProduct.spiritualDeclaration}
                                onChangeText={(text) => setNewProduct({ ...newProduct, spiritualDeclaration: text })}
                                placeholder="Add a spiritual blessing or declaration..."
                                multiline
                            />
                        </View>
                    )}

                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setShowAddProductModal(false)}
                        >
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.primaryButton]}
                            onPress={addProduct}
                        >
                            <Text style={[styles.modalButtonText, styles.primaryButtonText]}>
                                {isFaithMode ? 'Add & Bless' : 'Add Product'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    const CartModal = () => (
        <Modal
            visible={showCartModal}
            animationType="slide"
            transparent={true}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Shopping Cart</Text>

                    {cart.length === 0 ? (
                        <Text style={styles.emptyCartText}>Your cart is empty</Text>
                    ) : (
                        <>
                            {cart.map((item) => (
                                <View key={item.productId} style={styles.cartItem}>
                                    <View style={styles.cartItemInfo}>
                                        <Text style={styles.cartItemName}>{item.product.name}</Text>
                                        <Text style={styles.cartItemPrice}>${item.product.price.toFixed(2)}</Text>
                                    </View>

                                    <View style={styles.cartItemActions}>
                                        <TouchableOpacity
                                            style={styles.quantityButton}
                                            onPress={() => updateQuantity(item.productId, item.quantity - 1)}
                                        >
                                            <Ionicons name="remove" size={16} color={KingdomColors.bronze} />
                                        </TouchableOpacity>

                                        <Text style={styles.quantityText}>{item.quantity}</Text>

                                        <TouchableOpacity
                                            style={styles.quantityButton}
                                            onPress={() => updateQuantity(item.productId, item.quantity + 1)}
                                        >
                                            <Ionicons name="add" size={16} color={KingdomColors.bronze} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}

                            <View style={styles.cartTotal}>
                                <Text style={styles.totalLabel}>Total:</Text>
                                <Text style={styles.totalAmount}>${calculateTotal().toFixed(2)}</Text>
                            </View>

                            <TouchableOpacity
                                style={styles.checkoutButton}
                                onPress={checkout}
                            >
                                <Ionicons name="card" size={20} color={KingdomColors.softWhite} />
                                <Text style={styles.checkoutButtonText}>
                                    {isFaithMode ? 'Checkout & Bless' : 'Proceed to Checkout'}
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}

                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setShowCartModal(false)}
                    >
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    {isFaithMode ? 'Print Shop - Faith Mode' : 'Print Shop'}
                </Text>
                <Text style={styles.subtitle}>
                    {isFaithMode
                        ? 'Share your blessed work through prints, presets, and digital products'
                        : 'Sell your photography through prints, presets, and digital downloads'
                    }
                </Text>
            </View>

            <View style={styles.actionsBar}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowAddProductModal(true)}
                >
                    <Ionicons name="add-circle" size={20} color={KingdomColors.softWhite} />
                    <Text style={styles.addButtonText}>Add Product</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.cartButton}
                    onPress={() => setShowCartModal(true)}
                >
                    <Ionicons name="cart" size={20} color={KingdomColors.softWhite} />
                    <Text style={styles.cartButtonText}>
                        Cart ({cart.length})
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.productsSection}>
                <Text style={styles.sectionTitle}>Your Products</Text>
                {products.map((product) => (
                    <View key={product.id} style={styles.productCard}>
                        <View style={styles.productHeader}>
                            <Text style={styles.productName}>{product.name}</Text>
                            <View style={styles.productType}>
                                <Ionicons
                                    name={productTypes.find(pt => pt.id === product.type)?.icon as any}
                                    size={16}
                                    color={KingdomColors.bronze}
                                />
                                <Text style={styles.productTypeText}>{product.type}</Text>
                            </View>
                        </View>

                        <Text style={styles.productDescription}>{product.description}</Text>
                        <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>

                        {product.spiritualDeclaration && (
                            <View style={styles.spiritualDeclaration}>
                                <Ionicons name="heart" size={16} color={KingdomColors.dustGold} />
                                <Text style={styles.spiritualText}>{product.spiritualDeclaration}</Text>
                            </View>
                        )}

                        <View style={styles.productTags}>
                            {product.tags.map((tag, index) => (
                                <Text key={index} style={styles.tag}>{tag}</Text>
                            ))}
                        </View>

                        <TouchableOpacity
                            style={styles.addToCartButton}
                            onPress={() => addToCart(product)}
                        >
                            <Ionicons name="add" size={16} color={KingdomColors.softWhite} />
                            <Text style={styles.addToCartButtonText}>Add to Cart</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            {orders.length > 0 && (
                <View style={styles.ordersSection}>
                    <Text style={styles.sectionTitle}>Recent Orders</Text>
                    {orders.map((order) => (
                        <View key={order.id} style={styles.orderCard}>
                            <Text style={styles.orderId}>Order #{order.id}</Text>
                            <Text style={styles.orderDate}>
                                {order.createdAt.toLocaleDateString()}
                            </Text>
                            <Text style={styles.orderStatus}>Status: {order.status}</Text>
                            <Text style={styles.orderTotal}>Total: ${order.total.toFixed(2)}</Text>
                            <Text style={styles.orderItems}>
                                {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                            </Text>
                        </View>
                    ))}
                </View>
            )}

            <AddProductModal />
            <CartModal />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: KingdomColors.matteBlack,
    },
    header: {
        padding: 20,
        backgroundColor: KingdomColors.bronze,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: KingdomColors.softWhite,
        fontFamily: 'EB Garamond',
    },
    subtitle: {
        fontSize: 16,
        color: KingdomColors.softWhite,
        marginTop: 5,
        fontFamily: 'Sora',
    },
    actionsBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
    },
    addButton: {
        backgroundColor: KingdomColors.bronze,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        flex: 0.48,
        justifyContent: 'center',
    },
    addButtonText: {
        color: KingdomColors.softWhite,
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 5,
        fontFamily: 'Sora',
    },
    cartButton: {
        backgroundColor: KingdomColors.dustGold,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        flex: 0.48,
        justifyContent: 'center',
    },
    cartButtonText: {
        color: KingdomColors.matteBlack,
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 5,
        fontFamily: 'Sora',
    },
    productsSection: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: KingdomColors.softWhite,
        marginBottom: 15,
        fontFamily: 'EB Garamond',
    },
    productCard: {
        backgroundColor: KingdomColors.dustGold,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    productHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: KingdomColors.matteBlack,
        fontFamily: 'EB Garamond',
    },
    productType: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    productTypeText: {
        fontSize: 12,
        color: KingdomColors.matteBlack,
        marginLeft: 4,
        fontFamily: 'Sora',
    },
    productDescription: {
        fontSize: 14,
        color: KingdomColors.matteBlack,
        marginBottom: 8,
        fontFamily: 'Sora',
    },
    productPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: KingdomColors.matteBlack,
        marginBottom: 8,
        fontFamily: 'Sora',
    },
    spiritualDeclaration: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: KingdomColors.bronze,
        padding: 8,
        borderRadius: 6,
        marginBottom: 8,
    },
    spiritualText: {
        fontSize: 12,
        color: KingdomColors.softWhite,
        marginLeft: 5,
        fontStyle: 'italic',
        fontFamily: 'Sora',
    },
    productTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    tag: {
        fontSize: 10,
        color: KingdomColors.matteBlack,
        backgroundColor: KingdomColors.bronze,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
        marginRight: 5,
        marginBottom: 3,
        fontFamily: 'Sora',
    },
    addToCartButton: {
        backgroundColor: KingdomColors.bronze,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        borderRadius: 6,
    },
    addToCartButtonText: {
        color: KingdomColors.softWhite,
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 4,
        fontFamily: 'Sora',
    },
    ordersSection: {
        padding: 20,
    },
    orderCard: {
        backgroundColor: KingdomColors.dustGold,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    orderId: {
        fontSize: 16,
        fontWeight: 'bold',
        color: KingdomColors.matteBlack,
        marginBottom: 5,
        fontFamily: 'Sora',
    },
    orderDate: {
        fontSize: 12,
        color: KingdomColors.matteBlack,
        marginBottom: 3,
        fontFamily: 'Sora',
    },
    orderStatus: {
        fontSize: 12,
        color: KingdomColors.matteBlack,
        marginBottom: 3,
        fontFamily: 'Sora',
    },
    orderTotal: {
        fontSize: 14,
        fontWeight: 'bold',
        color: KingdomColors.matteBlack,
        marginBottom: 3,
        fontFamily: 'Sora',
    },
    orderItems: {
        fontSize: 12,
        color: KingdomColors.matteBlack,
        fontFamily: 'Sora',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: KingdomColors.matteBlack,
        padding: 20,
        borderRadius: 15,
        width: '90%',
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: KingdomColors.softWhite,
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: 'EB Garamond',
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: KingdomColors.softWhite,
        marginBottom: 5,
        fontFamily: 'Sora',
    },
    input: {
        backgroundColor: KingdomColors.dustGold,
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        color: KingdomColors.matteBlack,
        fontFamily: 'Sora',
    },
    textInput: {
        backgroundColor: KingdomColors.dustGold,
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        color: KingdomColors.matteBlack,
        minHeight: 60,
        textAlignVertical: 'top',
        fontFamily: 'Sora',
    },
    typeButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: KingdomColors.bronze,
        padding: 10,
        borderRadius: 8,
        marginRight: 10,
        minWidth: 80,
        alignItems: 'center',
    },
    selectedType: {
        backgroundColor: KingdomColors.bronze,
    },
    typeText: {
        fontSize: 12,
        color: KingdomColors.bronze,
        marginTop: 3,
        textAlign: 'center',
        fontFamily: 'Sora',
    },
    selectedTypeText: {
        color: KingdomColors.softWhite,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        padding: 12,
        borderRadius: 8,
        flex: 0.48,
        alignItems: 'center',
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: KingdomColors.bronze,
        fontFamily: 'Sora',
    },
    primaryButton: {
        backgroundColor: KingdomColors.bronze,
    },
    primaryButtonText: {
        color: KingdomColors.softWhite,
    },
    emptyCartText: {
        fontSize: 16,
        color: KingdomColors.softWhite,
        textAlign: 'center',
        marginVertical: 20,
        fontFamily: 'Sora',
    },
    cartItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: KingdomColors.bronze,
    },
    cartItemInfo: {
        flex: 1,
    },
    cartItemName: {
        fontSize: 14,
        color: KingdomColors.softWhite,
        fontFamily: 'Sora',
    },
    cartItemPrice: {
        fontSize: 12,
        color: KingdomColors.softWhite,
        opacity: 0.8,
        fontFamily: 'Sora',
    },
    cartItemActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        padding: 5,
    },
    quantityText: {
        fontSize: 14,
        color: KingdomColors.softWhite,
        marginHorizontal: 10,
        fontFamily: 'Sora',
    },
    cartTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: KingdomColors.bronze,
        marginTop: 10,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: KingdomColors.softWhite,
        fontFamily: 'Sora',
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: KingdomColors.softWhite,
        fontFamily: 'Sora',
    },
    checkoutButton: {
        backgroundColor: KingdomColors.bronze,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
    },
    checkoutButtonText: {
        color: KingdomColors.softWhite,
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
        fontFamily: 'Sora',
    },
    closeButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: KingdomColors.bronze,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        color: KingdomColors.bronze,
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Sora',
    },
});

export default PrintShopScreen; 
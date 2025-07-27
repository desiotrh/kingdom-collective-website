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

interface TikTokProduct {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice: number;
    imageUrl: string;
    shopName: string;
    rating: number;
    reviewCount: number;
    affiliateLink: string;
    shortLink: string;
    clicks: number;
    conversions: number;
    revenue: number;
    commission: number;
    isActive: boolean;
    createdAt: Date;
}

interface AffiliateLink {
    id: string;
    name: string;
    originalUrl: string;
    shortUrl: string;
    productId: string;
    clicks: number;
    conversions: number;
    revenue: number;
    isActive: boolean;
    createdAt: Date;
}

interface ContentTemplate {
    id: string;
    name: string;
    type: 'caption' | 'hook' | 'script' | 'hashtags';
    content: string;
    productId: string;
    isActive: boolean;
    createdAt: Date;
}

interface TrendAnalysis {
    id: string;
    niche: string;
    trendingProducts: string[];
    hashtagSuggestions: string[];
    contentIdeas: string[];
    estimatedRevenue: number;
    lastUpdated: Date;
}

const TikTokShopAffiliateScreen: React.FC = () => {
    const [products, setProducts] = useState<TikTokProduct[]>([]);
    const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([]);
    const [contentTemplates, setContentTemplates] = useState<ContentTemplate[]>([]);
    const [trendAnalysis, setTrendAnalysis] = useState<TrendAnalysis[]>([]);
    const [selectedTab, setSelectedTab] = useState<'products' | 'links' | 'content' | 'trends'>('products');
    const [showProductModal, setShowProductModal] = useState(false);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [newProduct, setNewProduct] = useState<Partial<TikTokProduct>>({});
    const [newLink, setNewLink] = useState<Partial<AffiliateLink>>({});
    const [newTemplate, setNewTemplate] = useState<Partial<ContentTemplate>>({});

    // Mock data
    useEffect(() => {
        setProducts([
            {
                id: '1',
                name: 'Faith-Based Business Course',
                description: 'Complete course on building a faith-based business from scratch',
                price: 197,
                originalPrice: 297,
                imageUrl: 'https://example.com/course-image.jpg',
                shopName: 'Kingdom Collective',
                rating: 4.8,
                reviewCount: 127,
                affiliateLink: 'https://tiktok.com/shop/product/faith-business-course',
                shortLink: 'tiktok.com/shop/faith-course',
                clicks: 1247,
                conversions: 23,
                revenue: 4531,
                commission: 906.2,
                isActive: true,
                createdAt: new Date('2024-01-15')
            },
            {
                id: '2',
                name: 'Prayer Journal Planner',
                description: 'Beautiful prayer journal with guided prompts and scripture',
                price: 29.99,
                originalPrice: 39.99,
                imageUrl: 'https://example.com/journal-image.jpg',
                shopName: 'Faith Essentials',
                rating: 4.9,
                reviewCount: 89,
                affiliateLink: 'https://tiktok.com/shop/product/prayer-journal',
                shortLink: 'tiktok.com/shop/journal',
                clicks: 892,
                conversions: 15,
                revenue: 449.85,
                commission: 89.97,
                isActive: true,
                createdAt: new Date('2024-01-10')
            }
        ]);

        setAffiliateLinks([
            {
                id: '1',
                name: 'Faith Course - Main Link',
                originalUrl: 'https://tiktok.com/shop/product/faith-business-course',
                shortUrl: 'tiktok.com/shop/faith-course',
                productId: '1',
                clicks: 1247,
                conversions: 23,
                revenue: 4531,
                isActive: true,
                createdAt: new Date('2024-01-15')
            },
            {
                id: '2',
                name: 'Prayer Journal - Instagram',
                originalUrl: 'https://tiktok.com/shop/product/prayer-journal',
                shortUrl: 'tiktok.com/shop/journal',
                productId: '2',
                clicks: 892,
                conversions: 15,
                revenue: 449.85,
                isActive: true,
                createdAt: new Date('2024-01-10')
            }
        ]);

        setContentTemplates([
            {
                id: '1',
                name: 'Faith Course Hook',
                type: 'hook',
                content: 'Want to build a business that honors God? This course changed everything for me! #faithbusiness #christianentrepreneur',
                productId: '1',
                isActive: true,
                createdAt: new Date('2024-01-15')
            },
            {
                id: '2',
                name: 'Prayer Journal Caption',
                type: 'caption',
                content: 'Transform your prayer life with this beautiful journal! Perfect for daily devotions and spiritual growth. #prayerjournal #faith',
                productId: '2',
                isActive: true,
                createdAt: new Date('2024-01-10')
            }
        ]);

        setTrendAnalysis([
            {
                id: '1',
                niche: 'Faith-Based Business',
                trendingProducts: ['Business courses', 'Prayer journals', 'Devotional books'],
                hashtagSuggestions: ['#faithbusiness', '#christianentrepreneur', '#kingdombusiness'],
                contentIdeas: ['Before/after business transformation', 'Scripture-based business tips', 'Prayer for business success'],
                estimatedRevenue: 15000,
                lastUpdated: new Date('2024-01-20')
            }
        ]);
    }, []);

    const addProduct = () => {
        if (!newProduct.name || !newProduct.affiliateLink) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const product: TikTokProduct = {
            id: Date.now().toString(),
            name: newProduct.name,
            description: newProduct.description || '',
            price: newProduct.price || 0,
            originalPrice: newProduct.originalPrice || 0,
            imageUrl: newProduct.imageUrl || 'https://example.com/product.jpg',
            shopName: newProduct.shopName || '',
            rating: newProduct.rating || 0,
            reviewCount: newProduct.reviewCount || 0,
            affiliateLink: newProduct.affiliateLink,
            shortLink: newProduct.shortLink || newProduct.affiliateLink,
            clicks: 0,
            conversions: 0,
            revenue: 0,
            commission: 0,
            isActive: true,
            createdAt: new Date()
        };

        setProducts([...products, product]);
        setNewProduct({});
        setShowProductModal(false);
        Alert.alert('Success', 'Product added successfully!');
    };

    const addAffiliateLink = () => {
        if (!newLink.name || !newLink.originalUrl) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const link: AffiliateLink = {
            id: Date.now().toString(),
            name: newLink.name,
            originalUrl: newLink.originalUrl,
            shortUrl: newLink.shortUrl || newLink.originalUrl,
            productId: newLink.productId || '',
            clicks: 0,
            conversions: 0,
            revenue: 0,
            isActive: true,
            createdAt: new Date()
        };

        setAffiliateLinks([...affiliateLinks, link]);
        setNewLink({});
        setShowLinkModal(false);
        Alert.alert('Success', 'Affiliate link added successfully!');
    };

    const addContentTemplate = () => {
        if (!newTemplate.name || !newTemplate.content || !newTemplate.type) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const template: ContentTemplate = {
            id: Date.now().toString(),
            name: newTemplate.name,
            type: newTemplate.type,
            content: newTemplate.content,
            productId: newTemplate.productId || '',
            isActive: true,
            createdAt: new Date()
        };

        setContentTemplates([...contentTemplates, template]);
        setNewTemplate({});
        setShowTemplateModal(false);
        Alert.alert('Success', 'Content template added successfully!');
    };

    const getConversionRate = (clicks: number, conversions: number) => {
        return clicks > 0 ? ((conversions / clicks) * 100).toFixed(2) : '0.00';
    };

    const renderProducts = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>🛍️ TikTok Shop Products ({products.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowProductModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Add Product</Text>
                </TouchableOpacity>
            </View>

            {products.map(product => (
                <View key={product.id} style={styles.productCard}>
                    <View style={styles.productHeader}>
                        <Text style={styles.productName}>{product.name}</Text>
                        <View style={[styles.activeBadge, { backgroundColor: product.isActive ? '#4CAF50' : '#f44336' }]}>
                            <Text style={styles.activeBadgeText}>{product.isActive ? 'Active' : 'Inactive'}</Text>
                        </View>
                    </View>
                    <Text style={styles.productDescription}>{product.description}</Text>
                    <View style={styles.productMeta}>
                        <Text style={styles.productPrice}>${product.price}</Text>
                        {product.originalPrice > product.price && (
                            <Text style={styles.originalPrice}>${product.originalPrice}</Text>
                        )}
                        <Text style={styles.productShop}>{product.shopName}</Text>
                        <View style={styles.ratingContainer}>
                            <Ionicons name="star" size={12} color="#FFD700" />
                            <Text style={styles.ratingText}>{product.rating} ({product.reviewCount})</Text>
                        </View>
                    </View>
                    <View style={styles.productStats}>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>{product.clicks}</Text>
                            <Text style={styles.statLabel}>Clicks</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>{product.conversions}</Text>
                            <Text style={styles.statLabel}>Sales</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>{getConversionRate(product.clicks, product.conversions)}%</Text>
                            <Text style={styles.statLabel}>Conv. Rate</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>${product.revenue}</Text>
                            <Text style={styles.statLabel}>Revenue</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>${product.commission}</Text>
                            <Text style={styles.statLabel}>Commission</Text>
                        </View>
                    </View>
                    <Text style={styles.productLink}>{product.shortLink}</Text>
                </View>
            ))}
        </View>
    );

    const renderLinks = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>🔗 Affiliate Links ({affiliateLinks.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowLinkModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Add Link</Text>
                </TouchableOpacity>
            </View>

            {affiliateLinks.map(link => {
                const product = products.find(p => p.id === link.productId);
                return (
                    <View key={link.id} style={styles.linkCard}>
                        <View style={styles.linkHeader}>
                            <Text style={styles.linkName}>{link.name}</Text>
                            <View style={[styles.activeBadge, { backgroundColor: link.isActive ? '#4CAF50' : '#f44336' }]}>
                                <Text style={styles.activeBadgeText}>{link.isActive ? 'Active' : 'Inactive'}</Text>
                            </View>
                        </View>
                        <Text style={styles.linkProduct}>{product?.name || 'Unknown Product'}</Text>
                        <Text style={styles.linkUrl}>{link.shortUrl}</Text>
                        <View style={styles.linkStats}>
                            <View style={styles.stat}>
                                <Text style={styles.statNumber}>{link.clicks}</Text>
                                <Text style={styles.statLabel}>Clicks</Text>
                            </View>
                            <View style={styles.stat}>
                                <Text style={styles.statNumber}>{link.conversions}</Text>
                                <Text style={styles.statLabel}>Sales</Text>
                            </View>
                            <View style={styles.stat}>
                                <Text style={styles.statNumber}>{getConversionRate(link.clicks, link.conversions)}%</Text>
                                <Text style={styles.statLabel}>Conv. Rate</Text>
                            </View>
                            <View style={styles.stat}>
                                <Text style={styles.statNumber}>${link.revenue}</Text>
                                <Text style={styles.statLabel}>Revenue</Text>
                            </View>
                        </View>
                    </View>
                );
            })}
        </View>
    );

    const renderContent = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>📝 Content Templates ({contentTemplates.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowTemplateModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Add Template</Text>
                </TouchableOpacity>
            </View>

            {contentTemplates.map(template => {
                const product = products.find(p => p.id === template.productId);
                return (
                    <View key={template.id} style={styles.templateCard}>
                        <View style={styles.templateHeader}>
                            <Text style={styles.templateName}>{template.name}</Text>
                            <View style={[styles.typeBadge, { backgroundColor: getTypeColor(template.type) }]}>
                                <Text style={styles.typeBadgeText}>{template.type}</Text>
                            </View>
                        </View>
                        <Text style={styles.templateProduct}>{product?.name || 'Unknown Product'}</Text>
                        <Text style={styles.templateContent}>{template.content}</Text>
                        <View style={styles.templateMeta}>
                            <Text style={styles.templateDate}>{template.createdAt.toLocaleDateString()}</Text>
                            <View style={[styles.activeBadge, { backgroundColor: template.isActive ? '#4CAF50' : '#f44336' }]}>
                                <Text style={styles.activeBadgeText}>{template.isActive ? 'Active' : 'Inactive'}</Text>
                            </View>
                        </View>
                    </View>
                );
            })}
        </View>
    );

    const renderTrends = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>📈 Trend Analysis</Text>
            <Text style={styles.sectionDescription}>
                AI-powered trend predictions and content suggestions
            </Text>

            {trendAnalysis.map(trend => (
                <View key={trend.id} style={styles.trendCard}>
                    <View style={styles.trendHeader}>
                        <Text style={styles.trendNiche}>{trend.niche}</Text>
                        <Text style={styles.trendRevenue}>${trend.estimatedRevenue.toLocaleString()}</Text>
                    </View>

                    <View style={styles.trendSection}>
                        <Text style={styles.trendSectionTitle}>🔥 Trending Products</Text>
                        {trend.trendingProducts.map((product, index) => (
                            <Text key={index} style={styles.trendItem}>• {product}</Text>
                        ))}
                    </View>

                    <View style={styles.trendSection}>
                        <Text style={styles.trendSectionTitle}>🏷️ Hashtag Suggestions</Text>
                        {trend.hashtagSuggestions.map((hashtag, index) => (
                            <Text key={index} style={styles.trendItem}>• {hashtag}</Text>
                        ))}
                    </View>

                    <View style={styles.trendSection}>
                        <Text style={styles.trendSectionTitle}>💡 Content Ideas</Text>
                        {trend.contentIdeas.map((idea, index) => (
                            <Text key={index} style={styles.trendItem}>• {idea}</Text>
                        ))}
                    </View>

                    <Text style={styles.trendDate}>
                        Last updated: {trend.lastUpdated.toLocaleDateString()}
                    </Text>
                </View>
            ))}
        </View>
    );

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'hook': return '#FF9800';
            case 'caption': return '#2196F3';
            case 'script': return '#9C27B0';
            case 'hashtags': return '#4CAF50';
            default: return '#666';
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>🛍️ TikTok Shop Affiliate</Text>
                <Text style={styles.headerSubtitle}>Manage affiliate links, product embeds, and revenue tracking</Text>
            </LinearGradient>

            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'products' && styles.activeTab]}
                    onPress={() => setSelectedTab('products')}
                >
                    <Ionicons name="bag" size={20} color={selectedTab === 'products' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'products' && styles.activeTabText]}>
                        Products
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'links' && styles.activeTab]}
                    onPress={() => setSelectedTab('links')}
                >
                    <Ionicons name="link" size={20} color={selectedTab === 'links' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'links' && styles.activeTabText]}>
                        Links
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'content' && styles.activeTab]}
                    onPress={() => setSelectedTab('content')}
                >
                    <Ionicons name="document-text" size={20} color={selectedTab === 'content' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'content' && styles.activeTabText]}>
                        Content
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'trends' && styles.activeTab]}
                    onPress={() => setSelectedTab('trends')}
                >
                    <Ionicons name="trending-up" size={20} color={selectedTab === 'trends' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'trends' && styles.activeTabText]}>
                        Trends
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {/* Stats Overview */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{products.length}</Text>
                        <Text style={styles.statLabel}>Products</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{affiliateLinks.length}</Text>
                        <Text style={styles.statLabel}>Links</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>
                            ${products.reduce((sum, p) => sum + p.revenue, 0).toLocaleString()}
                        </Text>
                        <Text style={styles.statLabel}>Revenue</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>
                            ${products.reduce((sum, p) => sum + p.commission, 0).toLocaleString()}
                        </Text>
                        <Text style={styles.statLabel}>Commission</Text>
                    </View>
                </View>

                {/* Tab Content */}
                {selectedTab === 'products' && renderProducts()}
                {selectedTab === 'links' && renderLinks()}
                {selectedTab === 'content' && renderContent()}
                {selectedTab === 'trends' && renderTrends()}

                {/* Product Modal */}
                <Modal
                    visible={showProductModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowProductModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <ScrollView style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add TikTok Shop Product</Text>

                            <Text style={styles.inputLabel}>Product Name</Text>
                            <TextInput
                                style={styles.input}
                                value={newProduct.name}
                                onChangeText={(text) => setNewProduct({ ...newProduct, name: text })}
                                placeholder="Enter product name"
                            />

                            <Text style={styles.inputLabel}>Description</Text>
                            <TextInput
                                style={[styles.input, { height: 80 }]}
                                value={newProduct.description}
                                onChangeText={(text) => setNewProduct({ ...newProduct, description: text })}
                                placeholder="Enter product description..."
                                multiline
                                textAlignVertical="top"
                            />

                            <Text style={styles.inputLabel}>Price ($)</Text>
                            <TextInput
                                style={styles.input}
                                value={newProduct.price?.toString()}
                                onChangeText={(text) => setNewProduct({ ...newProduct, price: parseFloat(text) || 0 })}
                                placeholder="Enter price"
                                keyboardType="numeric"
                            />

                            <Text style={styles.inputLabel}>Original Price ($)</Text>
                            <TextInput
                                style={styles.input}
                                value={newProduct.originalPrice?.toString()}
                                onChangeText={(text) => setNewProduct({ ...newProduct, originalPrice: parseFloat(text) || 0 })}
                                placeholder="Enter original price"
                                keyboardType="numeric"
                            />

                            <Text style={styles.inputLabel}>Shop Name</Text>
                            <TextInput
                                style={styles.input}
                                value={newProduct.shopName}
                                onChangeText={(text) => setNewProduct({ ...newProduct, shopName: text })}
                                placeholder="Enter shop name"
                            />

                            <Text style={styles.inputLabel}>Affiliate Link</Text>
                            <TextInput
                                style={styles.input}
                                value={newProduct.affiliateLink}
                                onChangeText={(text) => setNewProduct({ ...newProduct, affiliateLink: text })}
                                placeholder="Enter TikTok Shop affiliate link"
                            />

                            <Text style={styles.inputLabel}>Short Link (Optional)</Text>
                            <TextInput
                                style={styles.input}
                                value={newProduct.shortLink}
                                onChangeText={(text) => setNewProduct({ ...newProduct, shortLink: text })}
                                placeholder="Enter shortened link"
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={addProduct}
                                >
                                    <Text style={styles.modalButtonText}>Add Product</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowProductModal(false)}
                                >
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </Modal>

                {/* Link Modal */}
                <Modal
                    visible={showLinkModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowLinkModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add Affiliate Link</Text>

                            <Text style={styles.inputLabel}>Link Name</Text>
                            <TextInput
                                style={styles.input}
                                value={newLink.name}
                                onChangeText={(text) => setNewLink({ ...newLink, name: text })}
                                placeholder="Enter link name"
                            />

                            <Text style={styles.inputLabel}>Original URL</Text>
                            <TextInput
                                style={styles.input}
                                value={newLink.originalUrl}
                                onChangeText={(text) => setNewLink({ ...newLink, originalUrl: text })}
                                placeholder="Enter original URL"
                            />

                            <Text style={styles.inputLabel}>Short URL (Optional)</Text>
                            <TextInput
                                style={styles.input}
                                value={newLink.shortUrl}
                                onChangeText={(text) => setNewLink({ ...newLink, shortUrl: text })}
                                placeholder="Enter shortened URL"
                            />

                            <Text style={styles.inputLabel}>Product (Optional)</Text>
                            <View style={styles.dropdown}>
                                {products.map(product => (
                                    <TouchableOpacity
                                        key={product.id}
                                        style={[
                                            styles.dropdownOption,
                                            newLink.productId === product.id && styles.dropdownOptionSelected
                                        ]}
                                        onPress={() => setNewLink({ ...newLink, productId: product.id })}
                                    >
                                        <Text style={styles.dropdownOptionText}>{product.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={addAffiliateLink}
                                >
                                    <Text style={styles.modalButtonText}>Add Link</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowLinkModal(false)}
                                >
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Template Modal */}
                <Modal
                    visible={showTemplateModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowTemplateModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <ScrollView style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add Content Template</Text>

                            <Text style={styles.inputLabel}>Template Name</Text>
                            <TextInput
                                style={styles.input}
                                value={newTemplate.name}
                                onChangeText={(text) => setNewTemplate({ ...newTemplate, name: text })}
                                placeholder="Enter template name"
                            />

                            <Text style={styles.inputLabel}>Type</Text>
                            <View style={styles.radioGroup}>
                                {['hook', 'caption', 'script', 'hashtags'].map(type => (
                                    <TouchableOpacity
                                        key={type}
                                        style={[
                                            styles.radioButton,
                                            newTemplate.type === type && styles.radioButtonActive
                                        ]}
                                        onPress={() => setNewTemplate({ ...newTemplate, type: type as any })}
                                    >
                                        <Text style={styles.radioLabel}>{type}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.inputLabel}>Content</Text>
                            <TextInput
                                style={[styles.input, { height: 120 }]}
                                value={newTemplate.content}
                                onChangeText={(text) => setNewTemplate({ ...newTemplate, content: text })}
                                placeholder="Enter content template..."
                                multiline
                                textAlignVertical="top"
                            />

                            <Text style={styles.inputLabel}>Product (Optional)</Text>
                            <View style={styles.dropdown}>
                                {products.map(product => (
                                    <TouchableOpacity
                                        key={product.id}
                                        style={[
                                            styles.dropdownOption,
                                            newTemplate.productId === product.id && styles.dropdownOptionSelected
                                        ]}
                                        onPress={() => setNewTemplate({ ...newTemplate, productId: product.id })}
                                    >
                                        <Text style={styles.dropdownOptionText}>{product.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={addContentTemplate}
                                >
                                    <Text style={styles.modalButtonText}>Add Template</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowTemplateModal(false)}
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
    productCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    productHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    activeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    activeBadgeText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: 'bold',
    },
    productDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    productMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 12,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    originalPrice: {
        fontSize: 14,
        color: '#999',
        textDecorationLine: 'line-through',
    },
    productShop: {
        fontSize: 12,
        color: '#666',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontSize: 12,
        color: '#666',
    },
    productStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    stat: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#667eea',
    },
    statLabel: {
        fontSize: 10,
        color: '#666',
    },
    productLink: {
        fontSize: 12,
        color: '#999',
    },
    linkCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    linkHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    linkName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    linkProduct: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    linkUrl: {
        fontSize: 12,
        color: '#999',
        marginBottom: 8,
    },
    linkStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    templateCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    templateHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    templateName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    typeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    typeBadgeText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
    templateProduct: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    templateContent: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
    },
    templateMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    templateDate: {
        fontSize: 12,
        color: '#999',
    },
    trendCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    trendHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    trendNiche: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    trendRevenue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    trendSection: {
        marginBottom: 12,
    },
    trendSectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    trendItem: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    trendDate: {
        fontSize: 12,
        color: '#999',
        textAlign: 'right',
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
        flexWrap: 'wrap',
        marginBottom: 16,
        gap: 8,
    },
    radioButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
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
        textTransform: 'capitalize',
    },
    dropdown: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 16,
    },
    dropdownOption: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    dropdownOptionSelected: {
        backgroundColor: '#667eea10',
    },
    dropdownOptionText: {
        fontSize: 14,
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

export default TikTokShopAffiliateScreen; 
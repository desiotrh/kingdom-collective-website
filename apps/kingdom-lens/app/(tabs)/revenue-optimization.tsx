import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Modal,
    TextInput,
    Alert,
    FlatList,
    Dimensions,
} from 'react-native';
import { useFaithMode } from '../../hooks/useFaithMode';
import { LightTheme, FaithModeTheme, EncouragementModeTheme } from '../../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface PricingPackage {
    id: string;
    name: string;
    basePrice: number;
    dynamicPrice: number;
    description: string;
    features: string[];
    demand: 'High' | 'Medium' | 'Low';
    season: string;
    location: string;
    aiRecommendation: string;
}

interface UpsellItem {
    id: string;
    name: string;
    description: string;
    price: number;
    category: 'Print' | 'Digital' | 'Album' | 'Video' | 'Rush';
    conversionRate: number;
    profitMargin: number;
    aiRecommendation: string;
}

interface RevenueMetrics {
    totalRevenue: number;
    monthlyGrowth: number;
    averagePackageValue: number;
    conversionRate: number;
    topPerformingPackage: string;
    seasonalityTrend: string;
    aiInsights: string[];
}

export default function RevenueOptimizationScreen() {
    const { faithMode, encouragementMode } = useFaithMode();
    const theme = LightTheme;
    const faithTheme = faithMode ? FaithModeTheme : EncouragementModeTheme;

    const [activeTab, setActiveTab] = useState<'pricing' | 'packages' | 'upsells' | 'analytics'>('pricing');
    const [showPackageBuilder, setShowPackageBuilder] = useState(false);
    const [newPackage, setNewPackage] = useState<Partial<PricingPackage>>({});

    // Mock data
    const [pricingPackages, setPricingPackages] = useState<PricingPackage[]>([
        {
            id: '1',
            name: 'Wedding Collection',
            basePrice: 2500,
            dynamicPrice: 2800,
            description: 'Full wedding coverage with engagement session',
            features: ['8 hours coverage', 'Engagement session', 'Online gallery', '50 edited photos'],
            demand: 'High',
            season: 'Spring',
            location: 'Downtown',
            aiRecommendation: 'Increase by 12% due to high demand and wedding season'
        },
        {
            id: '2',
            name: 'Family Portrait',
            basePrice: 350,
            dynamicPrice: 400,
            description: '1-hour family session with outdoor locations',
            features: ['1 hour session', '2 locations', 'Online gallery', '25 edited photos'],
            demand: 'Medium',
            season: 'Fall',
            location: 'Suburban',
            aiRecommendation: 'Increase by 15% for fall foliage season'
        },
        {
            id: '3',
            name: 'Senior Portrait',
            basePrice: 200,
            dynamicPrice: 225,
            description: 'Graduation portraits with multiple outfits',
            features: ['2 hour session', '3 outfit changes', 'Online gallery', '30 edited photos'],
            demand: 'Low',
            season: 'Spring',
            location: 'Urban',
            aiRecommendation: 'Maintain current pricing, focus on volume'
        }
    ]);

    const [upsellItems, setUpsellItems] = useState<UpsellItem[]>([
        {
            id: '1',
            name: 'Premium Album',
            description: 'High-quality printed album with custom design',
            price: 150,
            category: 'Album',
            conversionRate: 0.35,
            profitMargin: 0.65,
            aiRecommendation: 'Offer during wedding consultations - 35% conversion rate'
        },
        {
            id: '2',
            name: 'Rush Delivery',
            description: '24-hour photo delivery for urgent needs',
            price: 75,
            category: 'Rush',
            conversionRate: 0.25,
            profitMargin: 0.80,
            aiRecommendation: 'Perfect for last-minute events and urgent requests'
        },
        {
            id: '3',
            name: 'Video Highlights',
            description: 'Cinematic video compilation of the session',
            price: 200,
            category: 'Video',
            conversionRate: 0.20,
            profitMargin: 0.70,
            aiRecommendation: 'Offer for weddings and special events'
        }
    ]);

    const [revenueMetrics, setRevenueMetrics] = useState<RevenueMetrics>({
        totalRevenue: 15420,
        monthlyGrowth: 0.18,
        averagePackageValue: 1250,
        conversionRate: 0.68,
        topPerformingPackage: 'Wedding Collection',
        seasonalityTrend: 'Peak season approaching - increase pricing by 15%',
        aiInsights: [
            'Wedding season demand up 25% - consider premium packages',
            'Family sessions most profitable in fall months',
            'Upsell conversion highest during consultations',
            faithMode ? 'Kingdom investment: Your talent is a gift from God' : 'Your expertise has high market value'
        ]
    });

    const getScreenTitle = () => {
        if (faithMode) {
            return 'Kingdom Investment';
        } else if (encouragementMode) {
            return 'Revenue Optimization';
        }
        return 'Pricing & Revenue';
    };

    const getScreenSubtitle = () => {
        if (faithMode) {
            return 'Steward your gifts for Kingdom impact';
        } else if (encouragementMode) {
            return 'Maximize your creative value';
        }
        return 'Optimize pricing and revenue streams';
    };

    const getDemandColor = (demand: string) => {
        switch (demand) {
            case 'High':
                return theme.colors.success;
            case 'Medium':
                return theme.colors.warning;
            case 'Low':
                return theme.colors.error;
            default:
                return theme.colors.textSecondary;
        }
    };

    const formatCurrency = (amount: number) => {
        return `$${amount.toLocaleString()}`;
    };

    const renderPricingCard = ({ item }: { item: PricingPackage }) => (
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                    {item.name}
                </Text>
                <View style={[styles.demandBadge, { backgroundColor: getDemandColor(item.demand) }]}>
                    <Text style={[styles.demandText, { color: theme.colors.surface }]}>
                        {item.demand} Demand
                    </Text>
                </View>
            </View>

            <View style={styles.pricingRow}>
                <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>
                    Base Price:
                </Text>
                <Text style={[styles.basePrice, { color: theme.colors.textSecondary }]}>
                    {formatCurrency(item.basePrice)}
                </Text>
            </View>

            <View style={styles.pricingRow}>
                <Text style={[styles.priceLabel, { color: theme.colors.text }]}>
                    Dynamic Price:
                </Text>
                <Text style={[styles.dynamicPrice, { color: theme.colors.primary }]}>
                    {formatCurrency(item.dynamicPrice)}
                </Text>
            </View>

            <Text style={[styles.cardDescription, { color: theme.colors.textSecondary }]}>
                {item.description}
            </Text>

            <View style={styles.featuresContainer}>
                {item.features.map((feature, index) => (
                    <Text key={index} style={[styles.feature, { color: theme.colors.textSecondary }]}>
                        ✓ {feature}
                    </Text>
                ))}
            </View>

            <View style={styles.metaInfo}>
                <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
                    🌸 {item.season} • 📍 {item.location}
                </Text>
            </View>

            <View style={styles.aiRecommendation}>
                <Text style={[styles.aiTitle, { color: theme.colors.primary }]}>
                    🤖 AI Recommendation:
                </Text>
                <Text style={[styles.aiText, { color: theme.colors.textSecondary }]}>
                    {item.aiRecommendation}
                </Text>
            </View>

            <View style={styles.cardActions}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                    onPress={() => Alert.alert('Update Pricing', `Updating ${item.name} pricing...`)}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        Update Pricing
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
                    onPress={() => Alert.alert('View Analytics', `Opening analytics for ${item.name}...`)}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        View Analytics
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderUpsellCard = ({ item }: { item: UpsellItem }) => (
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                    {item.name}
                </Text>
                <View style={[styles.categoryBadge, { backgroundColor: theme.colors.info }]}>
                    <Text style={[styles.categoryText, { color: theme.colors.surface }]}>
                        {item.category}
                    </Text>
                </View>
            </View>

            <Text style={[styles.cardDescription, { color: theme.colors.textSecondary }]}>
                {item.description}
            </Text>

            <View style={styles.pricingRow}>
                <Text style={[styles.priceLabel, { color: theme.colors.text }]}>
                    Price:
                </Text>
                <Text style={[styles.dynamicPrice, { color: theme.colors.primary }]}>
                    {formatCurrency(item.price)}
                </Text>
            </View>

            <View style={styles.metricsRow}>
                <View style={styles.metric}>
                    <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
                        Conversion
                    </Text>
                    <Text style={[styles.metricValue, { color: theme.colors.success }]}>
                        {(item.conversionRate * 100).toFixed(1)}%
                    </Text>
                </View>
                <View style={styles.metric}>
                    <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
                        Profit Margin
                    </Text>
                    <Text style={[styles.metricValue, { color: theme.colors.success }]}>
                        {(item.profitMargin * 100).toFixed(1)}%
                    </Text>
                </View>
            </View>

            <View style={styles.aiRecommendation}>
                <Text style={[styles.aiTitle, { color: theme.colors.primary }]}>
                    🤖 AI Recommendation:
                </Text>
                <Text style={[styles.aiText, { color: theme.colors.textSecondary }]}>
                    {item.aiRecommendation}
                </Text>
            </View>

            <View style={styles.cardActions}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                    onPress={() => Alert.alert('Auto-Offer', `Setting up auto-offer for ${item.name}...`)}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        Auto-Offer
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
                    onPress={() => Alert.alert('Track Performance', `Opening performance metrics for ${item.name}...`)}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        Track Performance
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderAnalyticsCard = () => (
        <View style={[styles.analyticsCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.analyticsTitle, { color: theme.colors.text }]}>
                Revenue Analytics
            </Text>

            <View style={styles.metricsGrid}>
                <View style={styles.metricCard}>
                    <Text style={[styles.metricCardLabel, { color: theme.colors.textSecondary }]}>
                        Total Revenue
                    </Text>
                    <Text style={[styles.metricCardValue, { color: theme.colors.primary }]}>
                        {formatCurrency(revenueMetrics.totalRevenue)}
                    </Text>
                    <Text style={[styles.metricCardChange, { color: theme.colors.success }]}>
                        +{(revenueMetrics.monthlyGrowth * 100).toFixed(1)}%
                    </Text>
                </View>

                <View style={styles.metricCard}>
                    <Text style={[styles.metricCardLabel, { color: theme.colors.textSecondary }]}>
                        Avg Package Value
                    </Text>
                    <Text style={[styles.metricCardValue, { color: theme.colors.primary }]}>
                        {formatCurrency(revenueMetrics.averagePackageValue)}
                    </Text>
                </View>

                <View style={styles.metricCard}>
                    <Text style={[styles.metricCardLabel, { color: theme.colors.textSecondary }]}>
                        Conversion Rate
                    </Text>
                    <Text style={[styles.metricCardValue, { color: theme.colors.primary }]}>
                        {(revenueMetrics.conversionRate * 100).toFixed(1)}%
                    </Text>
                </View>

                <View style={styles.metricCard}>
                    <Text style={[styles.metricCardLabel, { color: theme.colors.textSecondary }]}>
                        Top Package
                    </Text>
                    <Text style={[styles.metricCardValue, { color: theme.colors.primary }]}>
                        {revenueMetrics.topPerformingPackage}
                    </Text>
                </View>
            </View>

            <View style={styles.seasonalityContainer}>
                <Text style={[styles.seasonalityTitle, { color: theme.colors.text }]}>
                    📈 Seasonality Trend
                </Text>
                <Text style={[styles.seasonalityText, { color: theme.colors.textSecondary }]}>
                    {revenueMetrics.seasonalityTrend}
                </Text>
            </View>

            <View style={styles.aiInsightsContainer}>
                <Text style={[styles.aiInsightsTitle, { color: theme.colors.primary }]}>
                    🤖 AI Insights
                </Text>
                {revenueMetrics.aiInsights.map((insight, index) => (
                    <Text key={index} style={[styles.aiInsight, { color: theme.colors.textSecondary }]}>
                        • {insight}
                    </Text>
                ))}
            </View>

            {faithMode && (
                <View style={styles.kingdomInvestmentContainer}>
                    <Text style={[styles.kingdomInvestmentTitle, { color: faithTheme.colors.primary }]}>
                        💎 Kingdom Investment
                    </Text>
                    <Text style={[styles.kingdomInvestmentText, { color: faithTheme.colors.textSecondary }]}>
                        "Each of you should use whatever gift you have received to serve others, as faithful stewards of God's grace." - 1 Peter 4:10
                    </Text>
                    <Text style={[styles.kingdomInvestmentText, { color: faithTheme.colors.textSecondary }]}>
                        Your photography talent is a gift from God. Price it accordingly to honor both your calling and your clients.
                    </Text>
                </View>
            )}
        </View>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'pricing':
                return (
                    <FlatList
                        data={pricingPackages}
                        renderItem={renderPricingCard}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                    />
                );
            case 'packages':
                return (
                    <View style={styles.packageBuilderContainer}>
                        <Text style={[styles.packageBuilderTitle, { color: theme.colors.text }]}>
                            Package Builder
                        </Text>
                        <Text style={[styles.packageBuilderSubtitle, { color: theme.colors.textSecondary }]}>
                            Create custom packages with AI pricing recommendations
                        </Text>

                        <TouchableOpacity
                            style={[styles.createPackageButton, { backgroundColor: theme.colors.primary }]}
                            onPress={() => setShowPackageBuilder(true)}
                        >
                            <Text style={[styles.createPackageButtonText, { color: theme.colors.surface }]}>
                                Create New Package
                            </Text>
                        </TouchableOpacity>

                        <FlatList
                            data={pricingPackages}
                            renderItem={renderPricingCard}
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.listContainer}
                        />
                    </View>
                );
            case 'upsells':
                return (
                    <FlatList
                        data={upsellItems}
                        renderItem={renderUpsellCard}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                    />
                );
            case 'analytics':
                return (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContainer}>
                        {renderAnalyticsCard()}
                    </ScrollView>
                );
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.colors.text }]}>
                    {getScreenTitle()}
                </Text>
                <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                    {getScreenSubtitle()}
                </Text>
            </View>

            <View style={styles.tabContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'pricing' && { backgroundColor: theme.colors.primary }]}
                        onPress={() => setActiveTab('pricing')}
                    >
                        <Text style={[styles.tabText, activeTab === 'pricing' && { color: theme.colors.surface }]}>
                            💰 Dynamic Pricing
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'packages' && { backgroundColor: theme.colors.primary }]}
                        onPress={() => setActiveTab('packages')}
                    >
                        <Text style={[styles.tabText, activeTab === 'packages' && { color: theme.colors.surface }]}>
                            📦 Package Builder
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'upsells' && { backgroundColor: theme.colors.primary }]}
                        onPress={() => setActiveTab('upsells')}
                    >
                        <Text style={[styles.tabText, activeTab === 'upsells' && { color: theme.colors.surface }]}>
                            🎯 Upsells
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'analytics' && { backgroundColor: theme.colors.primary }]}
                        onPress={() => setActiveTab('analytics')}
                    >
                        <Text style={[styles.tabText, activeTab === 'analytics' && { color: theme.colors.surface }]}>
                            📊 Analytics
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            <View style={styles.content}>
                {renderTabContent()}
            </View>
        </SafeAreaView>
    );
}

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
        marginBottom: 10,
    },
    tabContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    tab: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginRight: 10,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    listContainer: {
        paddingBottom: 20,
    },
    card: {
        padding: 20,
        borderRadius: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
    },
    cardDescription: {
        fontSize: 14,
        marginBottom: 15,
        lineHeight: 20,
    },
    pricingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    priceLabel: {
        fontSize: 14,
        fontWeight: '600',
    },
    basePrice: {
        fontSize: 14,
        textDecorationLine: 'line-through',
    },
    dynamicPrice: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    featuresContainer: {
        marginBottom: 15,
    },
    feature: {
        fontSize: 13,
        marginBottom: 5,
    },
    metaInfo: {
        marginBottom: 15,
    },
    metaText: {
        fontSize: 13,
    },
    aiRecommendation: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: 'rgba(0, 122, 255, 0.1)',
        borderRadius: 8,
    },
    aiTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    aiText: {
        fontSize: 13,
        lineHeight: 18,
    },
    demandBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    demandText: {
        fontSize: 12,
        fontWeight: '600',
    },
    categoryBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '600',
    },
    metricsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    metric: {
        alignItems: 'center',
        flex: 1,
    },
    metricLabel: {
        fontSize: 12,
        marginBottom: 2,
    },
    metricValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    actionButtonText: {
        fontSize: 12,
        fontWeight: '600',
    },
    packageBuilderContainer: {
        flex: 1,
    },
    packageBuilderTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    packageBuilderSubtitle: {
        fontSize: 14,
        marginBottom: 20,
    },
    createPackageButton: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    createPackageButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    analyticsCard: {
        padding: 20,
        borderRadius: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    analyticsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    metricsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    metricCard: {
        width: '48%',
        padding: 15,
        backgroundColor: '#f8f9fa',
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    metricCardLabel: {
        fontSize: 12,
        marginBottom: 5,
        textAlign: 'center',
    },
    metricCardValue: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    metricCardChange: {
        fontSize: 12,
        fontWeight: '600',
    },
    seasonalityContainer: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#f8f9fa',
        borderRadius: 10,
    },
    seasonalityTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    seasonalityText: {
        fontSize: 14,
        lineHeight: 20,
    },
    aiInsightsContainer: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: 'rgba(0, 122, 255, 0.1)',
        borderRadius: 10,
    },
    aiInsightsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    aiInsight: {
        fontSize: 14,
        marginBottom: 8,
        lineHeight: 20,
    },
    kingdomInvestmentContainer: {
        padding: 15,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        borderRadius: 10,
    },
    kingdomInvestmentTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    kingdomInvestmentText: {
        fontSize: 14,
        marginBottom: 8,
        lineHeight: 20,
        fontStyle: 'italic',
    },
}); 
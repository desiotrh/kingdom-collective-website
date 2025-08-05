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

interface CompetitorAnalysis {
    id: string;
    competitorName: string;
    location: string;
    averagePrice: number;
    volume: number;
    shootTypes: string[];
    strengths: string[];
    weaknesses: string[];
    marketShare: number;
    recommendation: string;
}

interface MarketReport {
    id: string;
    market: string;
    trend: 'Growing' | 'Stable' | 'Declining';
    growthRate: number;
    averagePrice: number;
    demand: 'High' | 'Medium' | 'Low';
    seasonality: string;
    opportunities: string[];
    threats: string[];
}

interface FinancialForecast {
    id: string;
    period: string;
    projectedRevenue: number;
    growthRate: number;
    targetRevenue: number;
    keyDrivers: string[];
    risks: string[];
    aiRecommendation: string;
    kingdomStewardship?: string;
}

interface KingdomStewardship {
    id: string;
    principle: string;
    description: string;
    application: string;
    scripture: string;
    impact: string;
}

export default function BusinessIntelligenceScreen() {
    const { faithMode, encouragementMode } = useFaithMode();
    const theme = LightTheme;
    const faithTheme = faithMode ? FaithModeTheme : EncouragementModeTheme;

    const [activeTab, setActiveTab] = useState<'competitors' | 'markets' | 'forecasting' | 'stewardship'>('competitors');
    const [selectedTimeframe, setSelectedTimeframe] = useState<'3months' | '6months' | '1year'>('6months');

    // Mock data
    const [competitorAnalysis, setCompetitorAnalysis] = useState<CompetitorAnalysis[]>([
        {
            id: '1',
            competitorName: 'Grace Photography',
            location: 'Nashville, TN',
            averagePrice: 1200,
            volume: 45,
            shootTypes: ['Wedding', 'Portrait', 'Event'],
            strengths: ['Strong social media presence', 'Excellent client reviews', 'Diverse portfolio'],
            weaknesses: ['Limited availability', 'Higher pricing', 'No ministry focus'],
            marketShare: 0.25,
            recommendation: 'Focus on ministry differentiation and competitive pricing'
        },
        {
            id: '2',
            competitorName: 'Elite Studios',
            location: 'Nashville, TN',
            averagePrice: 1800,
            volume: 30,
            shootTypes: ['Wedding', 'Commercial', 'Portrait'],
            strengths: ['Premium positioning', 'High-end equipment', 'Exclusive clientele'],
            weaknesses: ['Limited accessibility', 'No faith-based services', 'High overhead'],
            marketShare: 0.15,
            recommendation: 'Emphasize Kingdom value and accessibility'
        }
    ]);

    const [marketReports, setMarketReports] = useState<MarketReport[]>([
        {
            id: '1',
            market: 'Wedding Photography',
            trend: 'Growing',
            growthRate: 0.12,
            averagePrice: 1500,
            demand: 'High',
            seasonality: 'Peak in spring/summer',
            opportunities: ['Ministry-focused weddings', 'Destination weddings', 'Elopement packages'],
            threats: ['Economic uncertainty', 'Increased competition', 'Changing preferences']
        },
        {
            id: '2',
            market: 'Portrait Photography',
            trend: 'Stable',
            growthRate: 0.05,
            averagePrice: 350,
            demand: 'Medium',
            seasonality: 'Year-round with fall peak',
            opportunities: ['Family sessions', 'Senior portraits', 'Corporate headshots'],
            threats: ['Mobile phone competition', 'Economic pressure', 'Seasonal fluctuations']
        }
    ]);

    const [financialForecasts, setFinancialForecasts] = useState<FinancialForecast[]>([
        {
            id: '1',
            period: 'Q2 2025',
            projectedRevenue: 45000,
            growthRate: 0.25,
            targetRevenue: 50000,
            keyDrivers: ['Wedding season peak', 'Ministry event bookings', 'Referral growth'],
            risks: ['Economic downturn', 'Weather impact', 'Competition increase'],
            aiRecommendation: 'Focus on premium wedding packages and ministry events',
            kingdomStewardship: 'Invest 10% in ministry photography scholarships'
        },
        {
            id: '2',
            period: 'Q3 2025',
            projectedRevenue: 38000,
            growthRate: 0.15,
            targetRevenue: 40000,
            keyDrivers: ['Fall portrait sessions', 'Corporate events', 'Holiday bookings'],
            risks: ['Seasonal slowdown', 'Client budget constraints', 'Weather challenges'],
            aiRecommendation: 'Develop fall marketing campaigns and corporate partnerships',
            kingdomStewardship: 'Offer discounted rates for church events and ministry families'
        }
    ]);

    const [kingdomStewardship, setKingdomStewardship] = useState<KingdomStewardship[]>([
        {
            id: '1',
            principle: 'Faithful Stewardship',
            description: 'Manage God\'s gifts with wisdom and generosity',
            application: 'Invest profits in ministry photography and community outreach',
            scripture: '1 Peter 4:10 - "Each of you should use whatever gift you have received to serve others"',
            impact: 'Providing free photography for church events and ministry families'
        },
        {
            id: '2',
            principle: 'Kingdom Investment',
            description: 'Use business success to advance God\'s Kingdom',
            application: 'Allocate resources for faith-based photography initiatives',
            scripture: 'Matthew 6:33 - "Seek first his kingdom and his righteousness"',
            impact: 'Creating opportunities for ministry photography and faith-based content'
        },
        {
            id: '3',
            principle: 'Generous Giving',
            description: 'Give generously from your business blessings',
            application: 'Set aside portion of profits for charitable photography work',
            scripture: '2 Corinthians 9:7 - "God loves a cheerful giver"',
            impact: 'Supporting mission trips and ministry organizations with photography'
        }
    ]);

    const getScreenTitle = () => {
        if (faithMode) {
            return 'Kingdom Intelligence';
        } else if (encouragementMode) {
            return 'Business Intelligence';
        }
        return 'Market Intelligence';
    };

    const getScreenSubtitle = () => {
        if (faithMode) {
            return 'Steward your business with Kingdom wisdom';
        } else if (encouragementMode) {
            return 'Data-driven business insights';
        }
        return 'Comprehensive market and competitor analysis';
    };

    const formatCurrency = (amount: number) => {
        return `$${amount.toLocaleString()}`;
    };

    const getTrendColor = (trend: string) => {
        switch (trend) {
            case 'Growing':
                return theme.colors.success;
            case 'Stable':
                return theme.colors.primary;
            case 'Declining':
                return theme.colors.error;
            default:
                return theme.colors.textSecondary;
        }
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

    const renderCompetitorCard = ({ item }: { item: CompetitorAnalysis }) => (
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                    {item.competitorName}
                </Text>
                <View style={[styles.marketShareBadge, { backgroundColor: theme.colors.info }]}>
                    <Text style={[styles.marketShareText, { color: theme.colors.surface }]}>
                        {(item.marketShare * 100).toFixed(1)}% Market Share
                    </Text>
                </View>
            </View>

            <Text style={[styles.cardInfo, { color: theme.colors.textSecondary }]}>
                📍 {item.location}
            </Text>
            <Text style={[styles.cardInfo, { color: theme.colors.textSecondary }]}>
                💰 Avg Price: {formatCurrency(item.averagePrice)}
            </Text>
            <Text style={[styles.cardInfo, { color: theme.colors.textSecondary }]}>
                📸 Volume: {item.volume} shoots/year
            </Text>

            <View style={styles.shootTypesContainer}>
                <Text style={[styles.shootTypesTitle, { color: theme.colors.text }]}>
                    📷 Shoot Types:
                </Text>
                {item.shootTypes.map((type, index) => (
                    <Text key={index} style={[styles.shootType, { color: theme.colors.textSecondary }]}>
                        • {type}
                    </Text>
                ))}
            </View>

            <View style={styles.analysisContainer}>
                <View style={styles.analysisSection}>
                    <Text style={[styles.analysisTitle, { color: theme.colors.success }]}>
                        ✅ Strengths:
                    </Text>
                    {item.strengths.map((strength, index) => (
                        <Text key={index} style={[styles.analysisItem, { color: theme.colors.textSecondary }]}>
                            • {strength}
                        </Text>
                    ))}
                </View>

                <View style={styles.analysisSection}>
                    <Text style={[styles.analysisTitle, { color: theme.colors.error }]}>
                        ❌ Weaknesses:
                    </Text>
                    {item.weaknesses.map((weakness, index) => (
                        <Text key={index} style={[styles.analysisItem, { color: theme.colors.textSecondary }]}>
                            • {weakness}
                        </Text>
                    ))}
                </View>
            </View>

            <View style={styles.recommendationContainer}>
                <Text style={[styles.recommendationTitle, { color: theme.colors.primary }]}>
                    💡 Recommendation:
                </Text>
                <Text style={[styles.recommendationText, { color: theme.colors.textSecondary }]}>
                    {item.recommendation}
                </Text>
            </View>

            <View style={styles.cardActions}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                    onPress={() => Alert.alert('View Details', `Opening ${item.competitorName} analysis...`)}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        View Details
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
                    onPress={() => Alert.alert('Compare', `Comparing with ${item.competitorName}...`)}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        Compare
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderMarketCard = ({ item }: { item: MarketReport }) => (
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                    {item.market}
                </Text>
                <View style={[styles.trendBadge, { backgroundColor: getTrendColor(item.trend) }]}>
                    <Text style={[styles.trendText, { color: theme.colors.surface }]}>
                        {item.trend}
                    </Text>
                </View>
            </View>

            <View style={styles.marketMetrics}>
                <View style={styles.marketMetric}>
                    <Text style={[styles.marketMetricLabel, { color: theme.colors.textSecondary }]}>
                        Growth Rate
                    </Text>
                    <Text style={[styles.marketMetricValue, { color: theme.colors.primary }]}>
                        {(item.growthRate * 100).toFixed(1)}%
                    </Text>
                </View>
                <View style={styles.marketMetric}>
                    <Text style={[styles.marketMetricLabel, { color: theme.colors.textSecondary }]}>
                        Avg Price
                    </Text>
                    <Text style={[styles.marketMetricValue, { color: theme.colors.primary }]}>
                        {formatCurrency(item.averagePrice)}
                    </Text>
                </View>
                <View style={styles.marketMetric}>
                    <Text style={[styles.marketMetricLabel, { color: theme.colors.textSecondary }]}>
                        Demand
                    </Text>
                    <Text style={[styles.marketMetricValue, { color: getDemandColor(item.demand) }]}>
                        {item.demand}
                    </Text>
                </View>
            </View>

            <Text style={[styles.cardInfo, { color: theme.colors.textSecondary }]}>
                📅 Seasonality: {item.seasonality}
            </Text>

            <View style={styles.opportunitiesContainer}>
                <Text style={[styles.opportunitiesTitle, { color: theme.colors.success }]}>
                    🎯 Opportunities:
                </Text>
                {item.opportunities.map((opportunity, index) => (
                    <Text key={index} style={[styles.opportunity, { color: theme.colors.textSecondary }]}>
                        • {opportunity}
                    </Text>
                ))}
            </View>

            <View style={styles.threatsContainer}>
                <Text style={[styles.threatsTitle, { color: theme.colors.error }]}>
                    ⚠️ Threats:
                </Text>
                {item.threats.map((threat, index) => (
                    <Text key={index} style={[styles.threat, { color: theme.colors.textSecondary }]}>
                        • {threat}
                    </Text>
                ))}
            </View>

            <View style={styles.cardActions}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                    onPress={() => Alert.alert('View Report', `Opening ${item.market} report...`)}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        View Report
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
                    onPress={() => Alert.alert('Market Strategy', `Developing strategy for ${item.market}...`)}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        Market Strategy
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderForecastCard = ({ item }: { item: FinancialForecast }) => (
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                    {item.period}
                </Text>
                <View style={[styles.growthBadge, { backgroundColor: theme.colors.success }]}>
                    <Text style={[styles.growthText, { color: theme.colors.surface }]}>
                        +{(item.growthRate * 100).toFixed(1)}%
                    </Text>
                </View>
            </View>

            <View style={styles.forecastMetrics}>
                <View style={styles.forecastMetric}>
                    <Text style={[styles.forecastMetricLabel, { color: theme.colors.textSecondary }]}>
                        Projected Revenue
                    </Text>
                    <Text style={[styles.forecastMetricValue, { color: theme.colors.primary }]}>
                        {formatCurrency(item.projectedRevenue)}
                    </Text>
                </View>
                <View style={styles.forecastMetric}>
                    <Text style={[styles.forecastMetricLabel, { color: theme.colors.textSecondary }]}>
                        Target Revenue
                    </Text>
                    <Text style={[styles.forecastMetricValue, { color: theme.colors.success }]}>
                        {formatCurrency(item.targetRevenue)}
                    </Text>
                </View>
            </View>

            <View style={styles.driversContainer}>
                <Text style={[styles.driversTitle, { color: theme.colors.success }]}>
                    🚀 Key Drivers:
                </Text>
                {item.keyDrivers.map((driver, index) => (
                    <Text key={index} style={[styles.driver, { color: theme.colors.textSecondary }]}>
                        • {driver}
                    </Text>
                ))}
            </View>

            <View style={styles.risksContainer}>
                <Text style={[styles.risksTitle, { color: theme.colors.error }]}>
                    ⚠️ Risks:
                </Text>
                {item.risks.map((risk, index) => (
                    <Text key={index} style={[styles.risk, { color: theme.colors.textSecondary }]}>
                        • {risk}
                    </Text>
                ))}
            </View>

            <View style={styles.aiRecommendationContainer}>
                <Text style={[styles.aiRecommendationTitle, { color: theme.colors.primary }]}>
                    🤖 AI Recommendation:
                </Text>
                <Text style={[styles.aiRecommendationText, { color: theme.colors.textSecondary }]}>
                    {item.aiRecommendation}
                </Text>
            </View>

            {faithMode && item.kingdomStewardship && (
                <View style={styles.stewardshipContainer}>
                    <Text style={[styles.stewardshipTitle, { color: faithTheme.colors.primary }]}>
                        💎 Kingdom Stewardship:
                    </Text>
                    <Text style={[styles.stewardshipText, { color: faithTheme.colors.textSecondary }]}>
                        {item.kingdomStewardship}
                    </Text>
                </View>
            )}

            <View style={styles.cardActions}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                    onPress={() => Alert.alert('View Forecast', `Opening ${item.period} forecast...`)}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        View Forecast
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
                    onPress={() => Alert.alert('Set Targets', `Setting targets for ${item.period}...`)}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        Set Targets
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderStewardshipCard = ({ item }: { item: KingdomStewardship }) => (
        <View style={[styles.card, { backgroundColor: faithTheme.colors.surface }]}>
            <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: faithTheme.colors.text }]}>
                    {item.principle}
                </Text>
            </View>

            <Text style={[styles.cardDescription, { color: faithTheme.colors.textSecondary }]}>
                {item.description}
            </Text>

            <View style={styles.applicationContainer}>
                <Text style={[styles.applicationTitle, { color: faithTheme.colors.primary }]}>
                    📋 Application:
                </Text>
                <Text style={[styles.applicationText, { color: faithTheme.colors.textSecondary }]}>
                    {item.application}
                </Text>
            </View>

            <Text style={[styles.scriptureText, { color: faithTheme.colors.primary }]}>
                📖 {item.scripture}
            </Text>

            <View style={styles.impactContainer}>
                <Text style={[styles.impactTitle, { color: faithTheme.colors.success }]}>
                    ✨ Impact:
                </Text>
                <Text style={[styles.impactText, { color: faithTheme.colors.textSecondary }]}>
                    {item.impact}
                </Text>
            </View>

            <View style={styles.cardActions}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: faithTheme.colors.primary }]}
                    onPress={() => Alert.alert('Learn More', `Opening ${item.principle} details...`)}
                >
                    <Text style={[styles.actionButtonText, { color: faithTheme.colors.surface }]}>
                        Learn More
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: faithTheme.colors.success }]}
                    onPress={() => Alert.alert('Apply Principle', `Applying ${item.principle}...`)}
                >
                    <Text style={[styles.actionButtonText, { color: faithTheme.colors.surface }]}>
                        Apply Principle
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'competitors':
                return (
                    <FlatList
                        data={competitorAnalysis}
                        renderItem={renderCompetitorCard}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                    />
                );
            case 'markets':
                return (
                    <FlatList
                        data={marketReports}
                        renderItem={renderMarketCard}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                    />
                );
            case 'forecasting':
                return (
                    <FlatList
                        data={financialForecasts}
                        renderItem={renderForecastCard}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                    />
                );
            case 'stewardship':
                return faithMode ? (
                    <FlatList
                        data={kingdomStewardship}
                        renderItem={renderStewardshipCard}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                    />
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
                            Kingdom stewardship principles are available in Faith Mode
                        </Text>
                    </View>
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
                        style={[styles.tab, activeTab === 'competitors' && { backgroundColor: theme.colors.primary }]}
                        onPress={() => setActiveTab('competitors')}
                    >
                        <Text style={[styles.tabText, activeTab === 'competitors' && { color: theme.colors.surface }]}>
                            🏆 Competitors
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'markets' && { backgroundColor: theme.colors.primary }]}
                        onPress={() => setActiveTab('markets')}
                    >
                        <Text style={[styles.tabText, activeTab === 'markets' && { color: theme.colors.surface }]}>
                            📊 Markets
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'forecasting' && { backgroundColor: theme.colors.primary }]}
                        onPress={() => setActiveTab('forecasting')}
                    >
                        <Text style={[styles.tabText, activeTab === 'forecasting' && { color: theme.colors.surface }]}>
                            📈 Forecasting
                        </Text>
                    </TouchableOpacity>
                    {faithMode && (
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'stewardship' && { backgroundColor: faithTheme.colors.primary }]}
                            onPress={() => setActiveTab('stewardship')}
                        >
                            <Text style={[styles.tabText, activeTab === 'stewardship' && { color: faithTheme.colors.surface }]}>
                                💎 Stewardship
                            </Text>
                        </TouchableOpacity>
                    )}
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
    cardInfo: {
        fontSize: 14,
        marginBottom: 5,
    },
    marketShareBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    marketShareText: {
        fontSize: 12,
        fontWeight: '600',
    },
    shootTypesContainer: {
        marginBottom: 15,
    },
    shootTypesTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    shootType: {
        fontSize: 13,
        marginBottom: 3,
        paddingLeft: 10,
    },
    analysisContainer: {
        marginBottom: 15,
    },
    analysisSection: {
        marginBottom: 10,
    },
    analysisTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    analysisItem: {
        fontSize: 13,
        marginBottom: 3,
        paddingLeft: 10,
    },
    recommendationContainer: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: 'rgba(0, 122, 255, 0.1)',
        borderRadius: 8,
    },
    recommendationTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    recommendationText: {
        fontSize: 13,
        lineHeight: 18,
    },
    trendBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    trendText: {
        fontSize: 12,
        fontWeight: '600',
    },
    marketMetrics: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    marketMetric: {
        alignItems: 'center',
        flex: 1,
    },
    marketMetricLabel: {
        fontSize: 12,
        marginBottom: 2,
    },
    marketMetricValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    opportunitiesContainer: {
        marginBottom: 15,
    },
    opportunitiesTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    opportunity: {
        fontSize: 13,
        marginBottom: 3,
        paddingLeft: 10,
    },
    threatsContainer: {
        marginBottom: 15,
    },
    threatsTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    threat: {
        fontSize: 13,
        marginBottom: 3,
        paddingLeft: 10,
    },
    growthBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    growthText: {
        fontSize: 12,
        fontWeight: '600',
    },
    forecastMetrics: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    forecastMetric: {
        alignItems: 'center',
        flex: 1,
    },
    forecastMetricLabel: {
        fontSize: 12,
        marginBottom: 2,
    },
    forecastMetricValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    driversContainer: {
        marginBottom: 15,
    },
    driversTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    driver: {
        fontSize: 13,
        marginBottom: 3,
        paddingLeft: 10,
    },
    risksContainer: {
        marginBottom: 15,
    },
    risksTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    risk: {
        fontSize: 13,
        marginBottom: 3,
        paddingLeft: 10,
    },
    aiRecommendationContainer: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: 'rgba(0, 122, 255, 0.1)',
        borderRadius: 8,
    },
    aiRecommendationTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    aiRecommendationText: {
        fontSize: 13,
        lineHeight: 18,
    },
    stewardshipContainer: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        borderRadius: 8,
    },
    stewardshipTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    stewardshipText: {
        fontSize: 13,
        lineHeight: 18,
    },
    applicationContainer: {
        marginBottom: 15,
    },
    applicationTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    applicationText: {
        fontSize: 13,
        lineHeight: 18,
    },
    scriptureText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    impactContainer: {
        marginBottom: 15,
    },
    impactTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    impactText: {
        fontSize: 13,
        lineHeight: 18,
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
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyStateText: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
}); 
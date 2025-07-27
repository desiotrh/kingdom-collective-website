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

interface PredictiveInsight {
    id: string;
    type: 'Revenue' | 'Bookings' | 'Growth' | 'Seasonal';
    title: string;
    prediction: string;
    confidence: number;
    timeframe: string;
    actionItems: string[];
    faithInsight?: string;
}

interface ClientLifetimeValue {
    id: string;
    name: string;
    totalRevenue: number;
    sessionsCount: number;
    averageSessionValue: number;
    lastSession: string;
    engagementScore: number;
    referralCount: number;
    ministryImpact?: string;
}

interface SeasonalTrend {
    month: string;
    bookings: number;
    revenue: number;
    averagePackageValue: number;
    peakTimes: string[];
    prepSuggestions: string[];
}

interface KingdomImpact {
    id: string;
    metric: string;
    value: number;
    description: string;
    scripture?: string;
}

export default function AdvancedAnalyticsScreen() {
    const { faithMode, encouragementMode } = useFaithMode();
    const theme = LightTheme;
    const faithTheme = faithMode ? FaithModeTheme : EncouragementModeTheme;

    const [activeTab, setActiveTab] = useState<'predictions' | 'clients' | 'seasonal' | 'kingdom'>('predictions');
    const [selectedTimeframe, setSelectedTimeframe] = useState<'3months' | '6months' | '1year'>('6months');

    // Mock data
    const [predictiveInsights, setPredictiveInsights] = useState<PredictiveInsight[]>([
        {
            id: '1',
            type: 'Revenue',
            title: 'Revenue Growth Prediction',
            prediction: 'Expected 25% increase in Q2 due to wedding season',
            confidence: 0.85,
            timeframe: '3 months',
            actionItems: ['Increase wedding package prices by 15%', 'Hire second shooter for peak season', 'Launch engagement session promotion'],
            faithInsight: 'God is opening doors for your ministry through photography'
        },
        {
            id: '2',
            type: 'Bookings',
            title: 'Booking Forecast',
            prediction: '45% more bookings expected in spring months',
            confidence: 0.78,
            timeframe: '6 months',
            actionItems: ['Prepare additional equipment', 'Update portfolio with spring themes', 'Network with wedding planners'],
            faithInsight: 'Trust in the Lord's timing for your business growth'
        },
        {
            id: '3',
            type: 'Growth',
            title: 'Business Expansion',
            prediction: 'Ready to expand to commercial photography within 8 months',
            confidence: 0.72,
            timeframe: '8 months',
            actionItems: ['Develop commercial portfolio', 'Research commercial rates', 'Network with local businesses'],
            faithInsight: 'Your gifts are being multiplied for greater Kingdom impact'
        }
    ]);

    const [clientLifetimeValues, setClientLifetimeValues] = useState<ClientLifetimeValue[]>([
        {
            id: '1',
            name: 'Sarah Johnson',
            totalRevenue: 8500,
            sessionsCount: 4,
            averageSessionValue: 2125,
            lastSession: '2024-01-15',
            engagementScore: 0.92,
            referralCount: 3,
            ministryImpact: 'Prayed for during each session, shared faith journey'
        },
        {
            id: '2',
            name: 'Michael Chen',
            totalRevenue: 4200,
            sessionsCount: 3,
            averageSessionValue: 1400,
            lastSession: '2024-01-10',
            engagementScore: 0.78,
            referralCount: 1,
            ministryImpact: 'Discussed faith during family session'
        },
        {
            id: '3',
            name: 'Emily Rodriguez',
            totalRevenue: 6800,
            sessionsCount: 5,
            averageSessionValue: 1360,
            lastSession: '2024-01-20',
            engagementScore: 0.95,
            referralCount: 5,
            ministryImpact: 'Church member, regular ministry event coverage'
        }
    ]);

    const [seasonalTrends, setSeasonalTrends] = useState<SeasonalTrend[]>([
        {
            month: 'March',
            bookings: 12,
            revenue: 18000,
            averagePackageValue: 1500,
            peakTimes: ['Weekends', 'Golden Hour'],
            prepSuggestions: ['Update spring portfolio', 'Prepare outdoor equipment', 'Network with wedding planners']
        },
        {
            month: 'April',
            bookings: 15,
            revenue: 22500,
            averagePackageValue: 1500,
            peakTimes: ['Weekends', 'Golden Hour', 'Sunset'],
            prepSuggestions: ['Hire second shooter', 'Stock up on memory cards', 'Prepare backup equipment']
        },
        {
            month: 'May',
            bookings: 18,
            revenue: 27000,
            averagePackageValue: 1500,
            peakTimes: ['Weekends', 'Golden Hour', 'Sunset', 'Blue Hour'],
            prepSuggestions: ['Consider assistant photographer', 'Update pricing for peak season', 'Prepare for high volume']
        }
    ]);

    const [kingdomImpact, setKingdomImpact] = useState<KingdomImpact[]>([
        {
            id: '1',
            metric: 'Prayers Shared',
            value: 47,
            description: 'Number of prayer requests received and prayed for',
            scripture: 'Philippians 4:6'
        },
        {
            id: '2',
            metric: 'Ministry Shoots',
            value: 23,
            description: 'Church events, baptisms, and ministry coverage',
            scripture: '1 Peter 4:10'
        },
        {
            id: '3',
            metric: 'Faith Conversations',
            value: 89,
            description: 'Meaningful faith discussions during sessions',
            scripture: 'Colossians 4:6'
        },
        {
            id: '4',
            metric: 'Kingdom Connections',
            value: 34,
            description: 'New relationships formed through photography ministry',
            scripture: 'Matthew 5:16'
        }
    ]);

    const getScreenTitle = () => {
        if (faithMode) {
            return 'Kingdom Analytics';
        } else if (encouragementMode) {
            return 'Advanced Analytics';
        }
        return 'Business Analytics';
    };

    const getScreenSubtitle = () => {
        if (faithMode) {
            return 'Track your impact for the Kingdom';
        } else if (encouragementMode) {
            return 'Data-driven business insights';
        }
        return 'Comprehensive business analytics';
    };

    const formatCurrency = (amount: number) => {
        return `$${amount.toLocaleString()}`;
    };

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 0.8) return theme.colors.success;
        if (confidence >= 0.6) return theme.colors.warning;
        return theme.colors.error;
    };

    const renderPredictionCard = ({ item }: { item: PredictiveInsight }) => (
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                    {item.title}
                </Text>
                <View style={[styles.confidenceBadge, { backgroundColor: getConfidenceColor(item.confidence) }]}>
                    <Text style={[styles.confidenceText, { color: theme.colors.surface }]}>
                        {(item.confidence * 100).toFixed(0)}%
                    </Text>
                </View>
            </View>

            <Text style={[styles.predictionText, { color: theme.colors.textSecondary }]}>
                {item.prediction}
            </Text>

            <Text style={[styles.timeframeText, { color: theme.colors.textSecondary }]}>
                ⏰ {item.timeframe}
            </Text>

            <View style={styles.actionItemsContainer}>
                <Text style={[styles.actionItemsTitle, { color: theme.colors.text }]}>
                    📋 Action Items:
                </Text>
                {item.actionItems.map((action, index) => (
                    <Text key={index} style={[styles.actionItem, { color: theme.colors.textSecondary }]}>
                        • {action}
                    </Text>
                ))}
            </View>

            {faithMode && item.faithInsight && (
                <View style={styles.faithInsightContainer}>
                    <Text style={[styles.faithInsightTitle, { color: faithTheme.colors.primary }]}>
                        🙏 Kingdom Insight:
                    </Text>
                    <Text style={[styles.faithInsightText, { color: faithTheme.colors.textSecondary }]}>
                        {item.faithInsight}
                    </Text>
                </View>
            )}

            <View style={styles.cardActions}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                    onPress={() => Alert.alert('View Details', `Opening detailed analysis for ${item.title}...`)}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        View Details
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
                    onPress={() => Alert.alert('Set Reminder', `Setting reminder for ${item.title}...`)}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        Set Reminder
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderClientCard = ({ item }: { item: ClientLifetimeValue }) => (
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                    {item.name}
                </Text>
                <View style={[styles.engagementBadge, { backgroundColor: getEngagementColor(item.engagementScore) }]}>
                    <Text style={[styles.engagementText, { color: theme.colors.surface }]}>
                        {(item.engagementScore * 100).toFixed(0)}%
                    </Text>
                </View>
            </View>

            <View style={styles.clientMetrics}>
                <View style={styles.metricItem}>
                    <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
                        Total Revenue
                    </Text>
                    <Text style={[styles.metricValue, { color: theme.colors.primary }]}>
                        {formatCurrency(item.totalRevenue)}
                    </Text>
                </View>
                <View style={styles.metricItem}>
                    <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
                        Sessions
                    </Text>
                    <Text style={[styles.metricValue, { color: theme.colors.primary }]}>
                        {item.sessionsCount}
                    </Text>
                </View>
                <View style={styles.metricItem}>
                    <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
                        Avg Value
                    </Text>
                    <Text style={[styles.metricValue, { color: theme.colors.primary }]}>
                        {formatCurrency(item.averageSessionValue)}
                    </Text>
                </View>
                <View style={styles.metricItem}>
                    <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
                        Referrals
                    </Text>
                    <Text style={[styles.metricValue, { color: theme.colors.primary }]}>
                        {item.referralCount}
                    </Text>
                </View>
            </View>

            <Text style={[styles.lastSessionText, { color: theme.colors.textSecondary }]}>
                📅 Last Session: {item.lastSession}
            </Text>

            {faithMode && item.ministryImpact && (
                <View style={styles.ministryImpactContainer}>
                    <Text style={[styles.ministryImpactTitle, { color: faithTheme.colors.primary }]}>
                        ✨ Ministry Impact:
                    </Text>
                    <Text style={[styles.ministryImpactText, { color: faithTheme.colors.textSecondary }]}>
                        {item.ministryImpact}
                    </Text>
                </View>
            )}

            <View style={styles.cardActions}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                    onPress={() => Alert.alert('View History', `Opening session history for ${item.name}...`)}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        View History
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
                    onPress={() => Alert.alert('Send Follow-up', `Sending follow-up to ${item.name}...`)}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        Follow-up
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderSeasonalCard = ({ item }: { item: SeasonalTrend }) => (
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                    {item.month}
                </Text>
                <View style={[styles.revenueBadge, { backgroundColor: theme.colors.success }]}>
                    <Text style={[styles.revenueText, { color: theme.colors.surface }]}>
                        {formatCurrency(item.revenue)}
                    </Text>
                </View>
            </View>

            <View style={styles.seasonalMetrics}>
                <View style={styles.seasonalMetric}>
                    <Text style={[styles.seasonalMetricLabel, { color: theme.colors.textSecondary }]}>
                        Bookings
                    </Text>
                    <Text style={[styles.seasonalMetricValue, { color: theme.colors.primary }]}>
                        {item.bookings}
                    </Text>
                </View>
                <View style={styles.seasonalMetric}>
                    <Text style={[styles.seasonalMetricLabel, { color: theme.colors.textSecondary }]}>
                        Avg Package
                    </Text>
                    <Text style={[styles.seasonalMetricValue, { color: theme.colors.primary }]}>
                        {formatCurrency(item.averagePackageValue)}
                    </Text>
                </View>
            </View>

            <View style={styles.peakTimesContainer}>
                <Text style={[styles.peakTimesTitle, { color: theme.colors.text }]}>
                    ⏰ Peak Times:
                </Text>
                {item.peakTimes.map((time, index) => (
                    <Text key={index} style={[styles.peakTime, { color: theme.colors.textSecondary }]}>
                        • {time}
                    </Text>
                ))}
            </View>

            <View style={styles.prepSuggestionsContainer}>
                <Text style={[styles.prepSuggestionsTitle, { color: theme.colors.text }]}>
                    📋 Prep Suggestions:
                </Text>
                {item.prepSuggestions.map((suggestion, index) => (
                    <Text key={index} style={[styles.prepSuggestion, { color: theme.colors.textSecondary }]}>
                        • {suggestion}
                    </Text>
                ))}
            </View>

            <View style={styles.cardActions}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                    onPress={() => Alert.alert('View Details', `Opening detailed analysis for ${item.month}...`)}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        View Details
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
                    onPress={() => Alert.alert('Set Prep Reminder', `Setting prep reminder for ${item.month}...`)}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        Set Prep Reminder
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderKingdomImpactCard = () => (
        <View style={[styles.kingdomCard, { backgroundColor: faithTheme.colors.surface }]}>
            <Text style={[styles.kingdomCardTitle, { color: faithTheme.colors.text }]}>
                ✨ Kingdom Impact Metrics
            </Text>
            <Text style={[styles.kingdomCardSubtitle, { color: faithTheme.colors.textSecondary }]}>
                Track your ministry impact through photography
            </Text>

            <View style={styles.kingdomMetrics}>
                {kingdomImpact.map((impact) => (
                    <View key={impact.id} style={styles.kingdomMetricCard}>
                        <Text style={[styles.kingdomMetricValue, { color: faithTheme.colors.primary }]}>
                            {impact.value}
                        </Text>
                        <Text style={[styles.kingdomMetricLabel, { color: faithTheme.colors.text }]}>
                            {impact.metric}
                        </Text>
                        <Text style={[styles.kingdomMetricDescription, { color: faithTheme.colors.textSecondary }]}>
                            {impact.description}
                        </Text>
                        {impact.scripture && (
                            <Text style={[styles.kingdomScripture, { color: faithTheme.colors.primary }]}>
                                "{impact.scripture}"
                            </Text>
                        )}
                    </View>
                ))}
            </View>

            <View style={styles.kingdomSummary}>
                <Text style={[styles.kingdomSummaryTitle, { color: faithTheme.colors.text }]}>
                    🎯 Ministry Summary
                </Text>
                <Text style={[styles.kingdomSummaryText, { color: faithTheme.colors.textSecondary }]}>
                    Your photography ministry has touched {kingdomImpact.reduce((sum, impact) => sum + impact.value, 0)} lives this year.
                </Text>
                <Text style={[styles.kingdomSummaryText, { color: faithTheme.colors.textSecondary }]}>
                    Continue to let your light shine through your lens for God's glory.
                </Text>
            </View>

            <TouchableOpacity
                style={[styles.kingdomActionButton, { backgroundColor: faithTheme.colors.primary }]}
                onPress={() => Alert.alert('Share Impact', 'Sharing Kingdom impact report...')}
            >
                <Text style={[styles.kingdomActionButtonText, { color: faithTheme.colors.surface }]}>
                    Share Kingdom Impact
                </Text>
            </TouchableOpacity>
        </View>
    );

    const getEngagementColor = (score: number) => {
        if (score >= 0.9) return theme.colors.success;
        if (score >= 0.7) return theme.colors.warning;
        return theme.colors.error;
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'predictions':
                return (
                    <FlatList
                        data={predictiveInsights}
                        renderItem={renderPredictionCard}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                    />
                );
            case 'clients':
                return (
                    <FlatList
                        data={clientLifetimeValues}
                        renderItem={renderClientCard}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                    />
                );
            case 'seasonal':
                return (
                    <FlatList
                        data={seasonalTrends}
                        renderItem={renderSeasonalCard}
                        keyExtractor={(item) => item.month}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                    />
                );
            case 'kingdom':
                return faithMode ? (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContainer}>
                        {renderKingdomImpactCard()}
                    </ScrollView>
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
                            Kingdom impact metrics are available in Faith Mode
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
                        style={[styles.tab, activeTab === 'predictions' && { backgroundColor: theme.colors.primary }]}
                        onPress={() => setActiveTab('predictions')}
                    >
                        <Text style={[styles.tabText, activeTab === 'predictions' && { color: theme.colors.surface }]}>
                            🔮 Predictions
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'clients' && { backgroundColor: theme.colors.primary }]}
                        onPress={() => setActiveTab('clients')}
                    >
                        <Text style={[styles.tabText, activeTab === 'clients' && { color: theme.colors.surface }]}>
                            👥 Client Value
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'seasonal' && { backgroundColor: theme.colors.primary }]}
                        onPress={() => setActiveTab('seasonal')}
                    >
                        <Text style={[styles.tabText, activeTab === 'seasonal' && { color: theme.colors.surface }]}>
                            📈 Seasonal
                        </Text>
                    </TouchableOpacity>
                    {faithMode && (
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'kingdom' && { backgroundColor: faithTheme.colors.primary }]}
                            onPress={() => setActiveTab('kingdom')}
                        >
                            <Text style={[styles.tabText, activeTab === 'kingdom' && { color: faithTheme.colors.surface }]}>
                                ✨ Kingdom
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
    predictionText: {
        fontSize: 16,
        marginBottom: 10,
        lineHeight: 22,
    },
    timeframeText: {
        fontSize: 14,
        marginBottom: 15,
    },
    actionItemsContainer: {
        marginBottom: 15,
    },
    actionItemsTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    actionItem: {
        fontSize: 13,
        marginBottom: 5,
        paddingLeft: 10,
    },
    faithInsightContainer: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        borderRadius: 8,
    },
    faithInsightTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    faithInsightText: {
        fontSize: 13,
        lineHeight: 18,
    },
    confidenceBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    confidenceText: {
        fontSize: 12,
        fontWeight: '600',
    },
    clientMetrics: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    metricItem: {
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
    lastSessionText: {
        fontSize: 14,
        marginBottom: 15,
    },
    ministryImpactContainer: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        borderRadius: 8,
    },
    ministryImpactTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    ministryImpactText: {
        fontSize: 13,
        lineHeight: 18,
    },
    engagementBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    engagementText: {
        fontSize: 12,
        fontWeight: '600',
    },
    seasonalMetrics: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    seasonalMetric: {
        alignItems: 'center',
        flex: 1,
    },
    seasonalMetricLabel: {
        fontSize: 12,
        marginBottom: 2,
    },
    seasonalMetricValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    peakTimesContainer: {
        marginBottom: 15,
    },
    peakTimesTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    peakTime: {
        fontSize: 13,
        marginBottom: 3,
        paddingLeft: 10,
    },
    prepSuggestionsContainer: {
        marginBottom: 15,
    },
    prepSuggestionsTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    prepSuggestion: {
        fontSize: 13,
        marginBottom: 3,
        paddingLeft: 10,
    },
    revenueBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    revenueText: {
        fontSize: 12,
        fontWeight: '600',
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
    kingdomCard: {
        padding: 20,
        borderRadius: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    kingdomCardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    kingdomCardSubtitle: {
        fontSize: 14,
        marginBottom: 20,
    },
    kingdomMetrics: {
        marginBottom: 20,
    },
    kingdomMetricCard: {
        padding: 15,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    kingdomMetricValue: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    kingdomMetricLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
    },
    kingdomMetricDescription: {
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 5,
    },
    kingdomScripture: {
        fontSize: 12,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    kingdomSummary: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: 'rgba(0, 122, 255, 0.1)',
        borderRadius: 10,
    },
    kingdomSummaryTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    kingdomSummaryText: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 5,
    },
    kingdomActionButton: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    kingdomActionButtonText: {
        fontSize: 16,
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
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { useDualMode } from '../../contexts/DualModeContext';

const { width } = Dimensions.get('window');

interface AnalyticsData {
    period: string;
    revenue: number;
    projects: number;
    clients: number;
    faithProjects: number;
    averageProjectValue: number;
    clientSatisfaction: number;
    topServices: Array<{ name: string; revenue: number; percentage: number }>;
    faithMetrics: Array<{ metric: string; value: number; change: number }>;
}

const mockAnalytics: AnalyticsData = {
    period: 'Last 30 Days',
    revenue: 12500,
    projects: 24,
    clients: 18,
    faithProjects: 12,
    averageProjectValue: 520,
    clientSatisfaction: 4.8,
    topServices: [
        { name: 'Wedding Photography', revenue: 4800, percentage: 38 },
        { name: 'Portrait Sessions', revenue: 3200, percentage: 26 },
        { name: 'Event Coverage', revenue: 2800, percentage: 22 },
        { name: 'Faith-Based Projects', revenue: 1700, percentage: 14 },
    ],
    faithMetrics: [
        { metric: 'Faith-Focused Clients', value: 12, change: 15 },
        { metric: 'Spiritual Impact Score', value: 4.9, change: 8 },
        { metric: 'Community Engagement', value: 85, change: 12 },
        { metric: 'Ministry Opportunities', value: 6, change: 20 },
    ],
};

export default function AnalyticsScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const { isFaithMode } = useDualMode();

    const [selectedPeriod, setSelectedPeriod] = useState('30d');
    const [analytics] = useState<AnalyticsData>(mockAnalytics);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const getChangeColor = (change: number) => {
        return change >= 0 ? '#27AE60' : '#E74C3C';
    };

    const getChangeIcon = (change: number) => {
        return change >= 0 ? 'trending-up' : 'trending-down';
    };

    const renderMetricCard = (title: string, value: string | number, subtitle?: string, change?: number) => (
        <View style={styles.metricCard}>
            <Text style={styles.metricTitle}>{title}</Text>
            <Text style={styles.metricValue}>{value}</Text>
            {subtitle && <Text style={styles.metricSubtitle}>{subtitle}</Text>}
            {change !== undefined && (
                <View style={styles.changeContainer}>
                    <Ionicons
                        name={getChangeIcon(change) as any}
                        size={12}
                        color={getChangeColor(change)}
                    />
                    <Text style={[styles.changeText, { color: getChangeColor(change) }]}>
                        {change >= 0 ? '+' : ''}{change}%
                    </Text>
                </View>
            )}
        </View>
    );

    const renderServiceBar = (service: any, index: number) => (
        <View key={index} style={styles.serviceBar}>
            <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceRevenue}>{formatCurrency(service.revenue)}</Text>
            </View>
            <View style={styles.serviceBarContainer}>
                <View style={[styles.serviceBarFill, { width: `${service.percentage}%` }]} />
            </View>
            <Text style={styles.servicePercentage}>{service.percentage}%</Text>
        </View>
    );

    const renderFaithMetric = (metric: any, index: number) => (
        <View key={index} style={styles.faithMetricCard}>
            <View style={styles.faithMetricHeader}>
                <Ionicons name="heart" size={16} color="#E74C3C" />
                <Text style={styles.faithMetricName}>{metric.metric}</Text>
            </View>
            <Text style={styles.faithMetricValue}>{metric.value}</Text>
            <View style={styles.faithMetricChange}>
                <Ionicons
                    name={getChangeIcon(metric.change) as any}
                    size={12}
                    color={getChangeColor(metric.change)}
                />
                <Text style={[styles.faithMetricChangeText, { color: getChangeColor(metric.change) }]}>
                    {metric.change >= 0 ? '+' : ''}{metric.change}%
                </Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={isFaithMode ? ['#4A90E2', '#7B68EE'] : ['#2C3E50', '#34495E']}
                style={styles.header}
            >
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Analytics</Text>
                <TouchableOpacity style={styles.exportButton}>
                    <Ionicons name="download" size={24} color="#fff" />
                </TouchableOpacity>
            </LinearGradient>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Period Selector */}
                <View style={styles.periodContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {[
                            { key: '7d', label: '7 Days' },
                            { key: '30d', label: '30 Days' },
                            { key: '90d', label: '90 Days' },
                            { key: '1y', label: '1 Year' },
                        ].map((period) => (
                            <TouchableOpacity
                                key={period.key}
                                style={[
                                    styles.periodButton,
                                    selectedPeriod === period.key && styles.activePeriodButton
                                ]}
                                onPress={() => setSelectedPeriod(period.key)}
                            >
                                <Text style={[
                                    styles.periodText,
                                    selectedPeriod === period.key && styles.activePeriodText
                                ]}>
                                    {period.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Key Metrics */}
                <View style={styles.metricsGrid}>
                    <View style={styles.metricsRow}>
                        {renderMetricCard(
                            'Total Revenue',
                            formatCurrency(analytics.revenue),
                            analytics.period,
                            12
                        )}
                        {renderMetricCard(
                            'Projects',
                            analytics.projects.toString(),
                            'Completed',
                            8
                        )}
                    </View>
                    <View style={styles.metricsRow}>
                        {renderMetricCard(
                            'Active Clients',
                            analytics.clients.toString(),
                            'Engaged',
                            15
                        )}
                        {renderMetricCard(
                            'Avg. Project Value',
                            formatCurrency(analytics.averageProjectValue),
                            'Per Project',
                            5
                        )}
                    </View>
                </View>

                {/* Faith Mode Metrics */}
                {isFaithMode && (
                    <View style={styles.faithMetricsSection}>
                        <Text style={styles.sectionTitle}>Faith-Based Impact</Text>
                        <View style={styles.faithMetricsGrid}>
                            {analytics.faithMetrics.map(renderFaithMetric)}
                        </View>
                    </View>
                )}

                {/* Revenue Breakdown */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Revenue Breakdown</Text>
                    <View style={styles.servicesContainer}>
                        {analytics.topServices.map(renderServiceBar)}
                    </View>
                </View>

                {/* Performance Insights */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Performance Insights</Text>
                    <View style={styles.insightsGrid}>
                        <View style={styles.insightCard}>
                            <Ionicons name="star" size={24} color="#F39C12" />
                            <Text style={styles.insightTitle}>Client Satisfaction</Text>
                            <Text style={styles.insightValue}>{analytics.clientSatisfaction}/5.0</Text>
                            <Text style={styles.insightSubtitle}>Excellent rating</Text>
                        </View>
                        <View style={styles.insightCard}>
                            <Ionicons name="trending-up" size={24} color="#27AE60" />
                            <Text style={styles.insightTitle}>Growth Rate</Text>
                            <Text style={styles.insightValue}>+15%</Text>
                            <Text style={styles.insightSubtitle}>This period</Text>
                        </View>
                        <View style={styles.insightCard}>
                            <Ionicons name="people" size={24} color="#4A90E2" />
                            <Text style={styles.insightTitle}>New Clients</Text>
                            <Text style={styles.insightValue}>8</Text>
                            <Text style={styles.insightSubtitle}>This month</Text>
                        </View>
                        <View style={styles.insightCard}>
                            <Ionicons name="repeat" size={24} color="#9B59B6" />
                            <Text style={styles.insightTitle}>Repeat Rate</Text>
                            <Text style={styles.insightValue}>75%</Text>
                            <Text style={styles.insightSubtitle}>Client retention</Text>
                        </View>
                    </View>
                </View>

                {/* Faith Mode Insights */}
                {isFaithMode && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Spiritual Impact</Text>
                        <View style={styles.spiritualInsights}>
                            <View style={styles.spiritualCard}>
                                <Ionicons name="heart" size={24} color="#E74C3C" />
                                <Text style={styles.spiritualTitle}>Faith-Focused Projects</Text>
                                <Text style={styles.spiritualValue}>{analytics.faithProjects}</Text>
                                <Text style={styles.spiritualSubtitle}>50% of total projects</Text>
                            </View>
                            <View style={styles.spiritualCard}>
                                <Ionicons name="globe" size={24} color="#3498DB" />
                                <Text style={styles.spiritualTitle}>Community Impact</Text>
                                <Text style={styles.spiritualValue}>85%</Text>
                                <Text style={styles.spiritualSubtitle}>Engagement score</Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Quick Actions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.actionsGrid}>
                        <TouchableOpacity style={styles.actionCard}>
                            <Ionicons name="document-text" size={24} color="#4A90E2" />
                            <Text style={styles.actionTitle}>Generate Report</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionCard}>
                            <Ionicons name="share" size={24} color="#27AE60" />
                            <Text style={styles.actionTitle}>Share Insights</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionCard}>
                            <Ionicons name="settings" size={24} color="#F39C12" />
                            <Text style={styles.actionTitle}>Analytics Settings</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionCard}>
                            <Ionicons name="calendar" size={24} color="#9B59B6" />
                            <Text style={styles.actionTitle}>Schedule Review</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        paddingBottom: 20,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    exportButton: {
        padding: 8,
    },
    content: {
        flex: 1,
    },
    periodContainer: {
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    periodButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#fff',
        borderRadius: 20,
        marginRight: 8,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    activePeriodButton: {
        backgroundColor: '#4A90E2',
    },
    periodText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    activePeriodText: {
        color: '#fff',
    },
    metricsGrid: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    metricsRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    metricCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 4,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    metricTitle: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    metricValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    metricSubtitle: {
        fontSize: 10,
        color: '#999',
        marginBottom: 4,
    },
    changeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    changeText: {
        fontSize: 10,
        marginLeft: 2,
    },
    faithMetricsSection: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    faithMetricsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    faithMetricCard: {
        width: (width - 52) / 2,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    faithMetricHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    faithMetricName: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
    faithMetricValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    faithMetricChange: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    faithMetricChangeText: {
        fontSize: 10,
        marginLeft: 2,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    servicesContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    serviceBar: {
        marginBottom: 16,
    },
    serviceInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    serviceName: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    serviceRevenue: {
        fontSize: 14,
        color: '#666',
    },
    serviceBarContainer: {
        height: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 4,
        marginBottom: 4,
    },
    serviceBarFill: {
        height: '100%',
        backgroundColor: '#4A90E2',
        borderRadius: 4,
    },
    servicePercentage: {
        fontSize: 12,
        color: '#666',
        textAlign: 'right',
    },
    insightsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    insightCard: {
        width: (width - 52) / 2,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    insightTitle: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 4,
    },
    insightValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    insightSubtitle: {
        fontSize: 10,
        color: '#999',
        textAlign: 'center',
    },
    spiritualInsights: {
        flexDirection: 'row',
        gap: 12,
    },
    spiritualCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    spiritualTitle: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 4,
    },
    spiritualValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    spiritualSubtitle: {
        fontSize: 10,
        color: '#999',
        textAlign: 'center',
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    actionCard: {
        width: (width - 52) / 2,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    actionTitle: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        marginTop: 8,
    },
}); 
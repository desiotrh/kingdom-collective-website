import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useDualMode } from '../../contexts/DualModeContext';
import { useTierSystem, TierType } from '../../contexts/TierSystemContext';

const { width } = Dimensions.get('window');

interface AnalyticsData {
  revenue: {
    daily: number[];
    weekly: number[];
    monthly: number[];
    labels: string[];
  };
  users: {
    newSignups: number[];
    activeUsers: number[];
    churnRate: number[];
    conversionRate: number[];
    labels: string[];
  };
  tiers: {
    distribution: Record<TierType, number>;
    transitions: {
      fromTier: TierType;
      toTier: TierType;
      count: number;
      revenue: number;
    }[];
  };
  trials: {
    started: number[];
    converted: number[];
    expired: number[];
    conversionRate: number[];
    labels: string[];
  };
  performance: {
    topFeatures: { name: string; usage: number; tier: TierType }[];
    supportTickets: { tier: TierType; count: number; avgResolutionTime: number }[];
    nps: number;
    satisfaction: number;
  };
}

const AdminAnalyticsScreen: React.FC = () => {
  const { currentMode, colors } = useDualMode();
  const { availableTiers } = useTierSystem();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedPeriod]);

  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true);
      
      // TODO: Replace with actual API calls
      // Mock data for demonstration
      const mockData: AnalyticsData = {
        revenue: {
          daily: [1200, 1580, 2100, 1890, 2340, 2890, 3200],
          weekly: [8500, 12400, 15600, 18900],
          monthly: [45000, 52000, 61000],
          labels: selectedPeriod === '7d' 
            ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            : selectedPeriod === '30d'
            ? ['Week 1', 'Week 2', 'Week 3', 'Week 4']
            : ['Jan', 'Feb', 'Mar'],
        },
        users: {
          newSignups: [45, 67, 89, 123, 98, 145, 167],
          activeUsers: [2340, 2567, 2789, 2890, 3120, 3456, 3678],
          churnRate: [2.1, 1.8, 2.3, 1.9, 1.7, 1.5, 1.4],
          conversionRate: [23.5, 25.2, 28.9, 31.2, 29.8, 32.1, 34.5],
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        tiers: {
          distribution: {
            seed: 6234,
            rooted: 2143,
            commissioned: 987,
            mantled_pro: 234,
            kingdom_enterprise: 57,
          },
          transitions: [
            { fromTier: 'seed', toTier: 'rooted', count: 45, revenue: 1350 },
            { fromTier: 'rooted', toTier: 'commissioned', count: 23, revenue: 1150 },
            { fromTier: 'commissioned', toTier: 'mantled_pro', count: 12, revenue: 960 },
            { fromTier: 'commissioned', toTier: 'rooted', count: 8, revenue: -400 },
          ],
        },
        trials: {
          started: [25, 34, 45, 38, 52, 41, 67],
          converted: [6, 8, 12, 9, 14, 11, 18],
          expired: [19, 26, 33, 29, 38, 30, 49],
          conversionRate: [24, 23.5, 26.7, 23.7, 26.9, 26.8, 26.9],
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        performance: {
          topFeatures: [
            { name: 'AI Content Generation', usage: 89, tier: 'commissioned' },
            { name: 'Template Library', usage: 76, tier: 'rooted' },
            { name: 'Analytics Dashboard', usage: 65, tier: 'mantled_pro' },
            { name: 'Team Collaboration', usage: 54, tier: 'mantled_pro' },
            { name: 'API Access', usage: 43, tier: 'kingdom_enterprise' },
          ],
          supportTickets: [
            { tier: 'seed', count: 45, avgResolutionTime: 24 },
            { tier: 'rooted', count: 23, avgResolutionTime: 18 },
            { tier: 'commissioned', count: 12, avgResolutionTime: 12 },
            { tier: 'mantled_pro', count: 8, avgResolutionTime: 6 },
            { tier: 'kingdom_enterprise', count: 3, avgResolutionTime: 2 },
          ],
          nps: 8.7,
          satisfaction: 94.2,
        },
      };

      setAnalyticsData(mockData);
      
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAnalyticsData();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getTierColor = (tier: TierType) => {
    switch (tier) {
      case 'seed': return '#6B7280';
      case 'rooted': return '#059669';
      case 'commissioned': return '#DC2626';
      case 'mantled_pro': return '#7C3AED';
      case 'kingdom_enterprise': return '#1F2937';
      default: return colors.primary;
    }
  };

  const renderChart = (data: number[], labels: string[], title: string, color: string = colors.primary) => {
    const maxValue = Math.max(...data);
    const chartHeight = 120;
    
    return (
      <View style={[styles.chartContainer, { backgroundColor: colors.surface }]}>
        <Text style={[styles.chartTitle, { color: colors.text }]}>{title}</Text>
        <View style={styles.chart}>
          {data.map((value, index) => {
            const height = (value / maxValue) * chartHeight;
            return (
              <View key={index} style={styles.chartColumn}>
                <View style={styles.chartBar}>
                  <View
                    style={[
                      styles.chartBarFill,
                      {
                        height,
                        backgroundColor: color,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.chartLabel, { color: colors.textSecondary }]}>
                  {labels[index]}
                </Text>
                <Text style={[styles.chartValue, { color: colors.text }]}>
                  {title.includes('Revenue') ? formatCurrency(value) : value.toLocaleString()}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  if (isLoading && !analyticsData) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading analytics...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={currentMode === 'faith' ? ['#1E3A8A', '#3B82F6'] : ['#065F46', '#10B981']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Analytics Dashboard</Text>
        <Text style={styles.headerSubtitle}>Kingdom Studios Insights</Text>
      </LinearGradient>

      {/* Period Selector */}
      <View style={[styles.periodSelector, { backgroundColor: colors.surface }]}>
        {(['7d', '30d', '90d', '1y'] as const).map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              {
                backgroundColor: selectedPeriod === period ? colors.primary : 'transparent',
              },
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text
              style={[
                styles.periodButtonText,
                {
                  color: selectedPeriod === period ? 'white' : colors.text,
                },
              ]}
            >
              {period === '7d' ? '7 Days' : period === '30d' ? '30 Days' : period === '90d' ? '90 Days' : '1 Year'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Revenue Analytics */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Revenue Analytics</Text>
          {analyticsData && renderChart(
            selectedPeriod === '7d' ? analyticsData.revenue.daily : analyticsData.revenue.weekly,
            analyticsData.revenue.labels,
            'Daily Revenue',
            '#10B981'
          )}
        </View>

        {/* User Growth */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>User Growth</Text>
          {analyticsData && (
            <View style={styles.metricsGrid}>
              {renderChart(
                analyticsData.users.newSignups,
                analyticsData.users.labels,
                'New Signups',
                '#3B82F6'
              )}
              {renderChart(
                analyticsData.users.conversionRate,
                analyticsData.users.labels,
                'Conversion Rate (%)',
                '#F59E0B'
              )}
            </View>
          )}
        </View>

        {/* Tier Distribution */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Tier Distribution</Text>
          <View style={[styles.tierDistribution, { backgroundColor: colors.surface }]}>
            {analyticsData && Object.entries(analyticsData.tiers.distribution).map(([tierKey, count]) => {
              const tier = availableTiers[tierKey as TierType];
              if (!tier) return null;
              
              const total = Object.values(analyticsData.tiers.distribution).reduce((sum, val) => sum + val, 0);
              const percentage = ((count / total) * 100).toFixed(1);
              
              return (
                <View key={tierKey} style={styles.tierRow}>
                  <View style={styles.tierInfo}>
                    <View style={styles.tierHeader}>
                      <View
                        style={[
                          styles.tierColorDot,
                          { backgroundColor: getTierColor(tierKey as TierType) },
                        ]}
                      />
                      <Text style={[styles.tierName, { color: colors.text }]}>
                        {tier.biblicalName}
                      </Text>
                    </View>
                    <Text style={[styles.tierCount, { color: colors.textSecondary }]}>
                      {count.toLocaleString()} users ({percentage}%)
                    </Text>
                  </View>
                  <View style={[styles.tierBar, { backgroundColor: colors.border }]}>
                    <View
                      style={[
                        styles.tierBarFill,
                        {
                          backgroundColor: getTierColor(tierKey as TierType),
                          width: `${percentage}%` as any,
                        },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Trial Analytics */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Trial Performance</Text>
          {analyticsData && (
            <View style={styles.trialMetrics}>
              <View style={[styles.trialCard, { backgroundColor: colors.surface }]}>
                <View style={styles.trialCardHeader}>
                  <MaterialIcons name="play-circle-filled" size={24} color="#3B82F6" />
                  <Text style={[styles.trialCardTitle, { color: colors.text }]}>
                    Trials Started
                  </Text>
                </View>
                <Text style={[styles.trialCardValue, { color: '#3B82F6' }]}>
                  {analyticsData.trials.started.reduce((sum, val) => sum + val, 0)}
                </Text>
                <Text style={[styles.trialCardSubtext, { color: colors.textSecondary }]}>
                  This period
                </Text>
              </View>

              <View style={[styles.trialCard, { backgroundColor: colors.surface }]}>
                <View style={styles.trialCardHeader}>
                  <MaterialIcons name="check-circle" size={24} color="#10B981" />
                  <Text style={[styles.trialCardTitle, { color: colors.text }]}>
                    Converted
                  </Text>
                </View>
                <Text style={[styles.trialCardValue, { color: '#10B981' }]}>
                  {analyticsData.trials.converted.reduce((sum, val) => sum + val, 0)}
                </Text>
                <Text style={[styles.trialCardSubtext, { color: colors.textSecondary }]}>
                  {formatPercentage(
                    (analyticsData.trials.converted.reduce((sum, val) => sum + val, 0) /
                    analyticsData.trials.started.reduce((sum, val) => sum + val, 0)) * 100
                  )} conversion rate
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Top Features */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Feature Usage</Text>
          <View style={[styles.featureList, { backgroundColor: colors.surface }]}>
            {analyticsData?.performance.topFeatures.map((feature, index) => (
              <View key={feature.name} style={styles.featureItem}>
                <View style={styles.featureInfo}>
                  <Text style={[styles.featureName, { color: colors.text }]}>
                    {feature.name}
                  </Text>
                  <Text style={[styles.featureTier, { color: getTierColor(feature.tier) }]}>
                    {availableTiers[feature.tier]?.name || feature.tier}
                  </Text>
                </View>
                <View style={styles.featureUsage}>
                  <Text style={[styles.featureUsageText, { color: colors.text }]}>
                    {feature.usage}%
                  </Text>
                  <View style={[styles.featureUsageBar, { backgroundColor: colors.border }]}>
                    <View
                      style={[
                        styles.featureUsageBarFill,
                        {
                          backgroundColor: colors.primary,
                          width: `${feature.usage}%`,
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Performance Metrics */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Performance Metrics</Text>
          <View style={styles.performanceGrid}>
            <View style={[styles.performanceCard, { backgroundColor: colors.surface }]}>
              <Feather name="star" size={24} color="#F59E0B" />
              <Text style={[styles.performanceValue, { color: colors.text }]}>
                {analyticsData?.performance.nps || 0}
              </Text>
              <Text style={[styles.performanceLabel, { color: colors.textSecondary }]}>
                NPS Score
              </Text>
            </View>

            <View style={[styles.performanceCard, { backgroundColor: colors.surface }]}>
              <Feather name="heart" size={24} color="#EF4444" />
              <Text style={[styles.performanceValue, { color: colors.text }]}>
                {formatPercentage(analyticsData?.performance.satisfaction || 0)}
              </Text>
              <Text style={[styles.performanceLabel, { color: colors.textSecondary }]}>
                Satisfaction
              </Text>
            </View>

            <View style={[styles.performanceCard, { backgroundColor: colors.surface }]}>
              <Feather name="headphones" size={24} color="#10B981" />
              <Text style={[styles.performanceValue, { color: colors.text }]}>
                {analyticsData?.performance.supportTickets.reduce((sum, ticket) => sum + ticket.count, 0) || 0}
              </Text>
              <Text style={[styles.performanceLabel, { color: colors.textSecondary }]}>
                Support Tickets
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    padding: 24,
    paddingTop: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  periodSelector: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  metricsGrid: {
    gap: 16,
  },
  chartContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 160,
  },
  chartColumn: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  chartBar: {
    width: '100%',
    height: 120,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  chartBarFill: {
    width: '80%',
    alignSelf: 'center',
    borderRadius: 2,
    minHeight: 2,
  },
  chartLabel: {
    fontSize: 10,
    marginBottom: 2,
    textAlign: 'center',
  },
  chartValue: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  tierDistribution: {
    padding: 16,
    borderRadius: 12,
  },
  tierRow: {
    marginBottom: 16,
  },
  tierInfo: {
    marginBottom: 8,
  },
  tierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  tierColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  tierName: {
    fontSize: 16,
    fontWeight: '600',
  },
  tierCount: {
    fontSize: 14,
  },
  tierBar: {
    height: 6,
    borderRadius: 3,
  },
  tierBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  trialMetrics: {
    flexDirection: 'row',
    gap: 12,
  },
  trialCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
  },
  trialCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  trialCardTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  trialCardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  trialCardSubtext: {
    fontSize: 12,
  },
  featureList: {
    padding: 16,
    borderRadius: 12,
  },
  featureItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureInfo: {
    flex: 1,
  },
  featureName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  featureTier: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  featureUsage: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  featureUsageText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureUsageBar: {
    width: 60,
    height: 4,
    borderRadius: 2,
  },
  featureUsageBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  performanceGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  performanceCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  performanceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  performanceLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default AdminAnalyticsScreen;

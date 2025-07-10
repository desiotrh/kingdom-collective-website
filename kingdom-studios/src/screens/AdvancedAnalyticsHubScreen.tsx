import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useDualMode } from '../contexts/DualModeContext';
import { KingdomColors } from '../constants/KingdomColors';

const { width } = Dimensions.get('window');

interface MetricCard {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
  category: 'engagement' | 'revenue' | 'growth' | 'performance';
}

interface ChartData {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'pie' | 'funnel';
  timeframe: '7d' | '30d' | '90d' | '1y';
  data: any[];
}

const AdvancedAnalyticsHubScreen: React.FC = () => {
  const { currentMode } = useDualMode();
  const colors = currentMode === 'faith' ? KingdomColors.faith : KingdomColors.encouragement;
  
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'engagement' | 'revenue' | 'growth' | 'performance'>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [metrics, setMetrics] = useState<MetricCard[]>([]);
  const [charts, setCharts] = useState<ChartData[]>([]);

  // Mock data - in real app, this would come from analytics API
  useEffect(() => {
    loadAnalyticsData();
  }, [selectedTimeframe, currentMode]);

  const loadAnalyticsData = () => {
    // Mock metrics data
    const mockMetrics: MetricCard[] = [
      {
        id: '1',
        title: currentMode === 'faith' ? 'Kingdom Impact' : 'Total Reach',
        value: '847K',
        change: '+23.4%',
        trend: 'up',
        icon: 'trending-up',
        category: 'engagement'
      },
      {
        id: '2',
        title: currentMode === 'faith' ? 'Lives Transformed' : 'Engagement Rate',
        value: '12.8%',
        change: '+5.2%',
        trend: 'up',
        icon: 'favorite',
        category: 'engagement'
      },
      {
        id: '3',
        title: currentMode === 'faith' ? 'Blessings Received' : 'Revenue Generated',
        value: '$24,567',
        change: '+18.9%',
        trend: 'up',
        icon: 'attach-money',
        category: 'revenue'
      },
      {
        id: '4',
        title: currentMode === 'faith' ? 'Community Growth' : 'Follower Growth',
        value: '4,923',
        change: '+12.1%',
        trend: 'up',
        icon: 'group-add',
        category: 'growth'
      },
      {
        id: '5',
        title: 'Content Performance',
        value: '8.4/10',
        change: '+0.8',
        trend: 'up',
        icon: 'star',
        category: 'performance'
      },
      {
        id: '6',
        title: currentMode === 'faith' ? 'Prayer Requests' : 'Support Requests',
        value: '156',
        change: '-8.3%',
        trend: 'down',
        icon: 'support',
        category: 'engagement'
      }
    ];

    setMetrics(mockMetrics);

    // Mock charts data
    const mockCharts: ChartData[] = [
      {
        id: '1',
        title: currentMode === 'faith' ? 'Kingdom Impact Over Time' : 'Engagement Trends',
        type: 'line',
        timeframe: selectedTimeframe,
        data: []
      },
      {
        id: '2',
        title: 'Revenue Breakdown',
        type: 'pie',
        timeframe: selectedTimeframe,
        data: []
      },
      {
        id: '3',
        title: 'Content Performance',
        type: 'bar',
        timeframe: selectedTimeframe,
        data: []
      },
      {
        id: '4',
        title: currentMode === 'faith' ? 'Discipleship Funnel' : 'Conversion Funnel',
        type: 'funnel',
        timeframe: selectedTimeframe,
        data: []
      }
    ];

    setCharts(mockCharts);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadAnalyticsData();
      setRefreshing(false);
    }, 1000);
  };

  const filteredMetrics = selectedCategory === 'all' 
    ? metrics 
    : metrics.filter(metric => metric.category === selectedCategory);

  const timeframes = [
    { key: '7d', label: '7 Days' },
    { key: '30d', label: '30 Days' },
    { key: '90d', label: '90 Days' },
    { key: '1y', label: '1 Year' }
  ];

  const categories = [
    { key: 'all', label: 'All', icon: 'dashboard' },
    { key: 'engagement', label: currentMode === 'faith' ? 'Impact' : 'Engagement', icon: 'favorite' },
    { key: 'revenue', label: currentMode === 'faith' ? 'Blessings' : 'Revenue', icon: 'attach-money' },
    { key: 'growth', label: 'Growth', icon: 'trending-up' },
    { key: 'performance', label: 'Performance', icon: 'speed' }
  ];

  const renderMetricCard = (metric: MetricCard) => (
    <View key={metric.id} style={[styles.metricCard, { backgroundColor: colors.surface }]}>
      <View style={styles.metricHeader}>
        <MaterialIcons 
          name={metric.icon as any} 
          size={24} 
          color={colors.primary} 
        />
        <View style={[
          styles.trendIndicator,
          { backgroundColor: metric.trend === 'up' ? colors.success : 
                             metric.trend === 'down' ? colors.error : colors.textSecondary }
        ]}>
          <MaterialIcons 
            name={metric.trend === 'up' ? 'arrow-upward' : 
                  metric.trend === 'down' ? 'arrow-downward' : 'remove'} 
            size={12} 
            color="#FFFFFF" 
          />
        </View>
      </View>
      <Text style={[styles.metricValue, { color: colors.text }]}>
        {metric.value}
      </Text>
      <Text style={[styles.metricTitle, { color: colors.textSecondary }]}>
        {metric.title}
      </Text>
      <Text style={[
        styles.metricChange, 
        { color: metric.trend === 'up' ? colors.success : 
                metric.trend === 'down' ? colors.error : colors.textSecondary }
      ]}>
        {metric.change}
      </Text>
    </View>
  );

  const renderChart = (chart: ChartData) => (
    <View key={chart.id} style={[styles.chartCard, { backgroundColor: colors.surface }]}>
      <Text style={[styles.chartTitle, { color: colors.text }]}>
        {chart.title}
      </Text>
      <View style={[styles.chartPlaceholder, { backgroundColor: colors.background }]}>
        <MaterialCommunityIcons 
          name="chart-line" 
          size={48} 
          color={colors.textSecondary} 
        />
        <Text style={[styles.chartPlaceholderText, { color: colors.textSecondary }]}>
          Chart visualization would appear here
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {currentMode === 'faith' ? '📊 Kingdom Analytics' : '📊 Advanced Analytics'}
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          {currentMode === 'faith' 
            ? 'Track your kingdom impact and spiritual growth' 
            : 'Deep insights into your content performance'}
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Timeframe Selector */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Time Period
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeframeContainer}>
            {timeframes.map((timeframe) => (
              <TouchableOpacity
                key={timeframe.key}
                style={[
                  styles.timeframeButton,
                  { backgroundColor: selectedTimeframe === timeframe.key ? colors.primary : colors.surface }
                ]}
                onPress={() => setSelectedTimeframe(timeframe.key as any)}
              >
                <Text style={[
                  styles.timeframeText,
                  { color: selectedTimeframe === timeframe.key ? '#FFFFFF' : colors.textSecondary }
                ]}>
                  {timeframe.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Category Filter */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Categories
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.key}
                style={[
                  styles.categoryButton,
                  { backgroundColor: selectedCategory === category.key ? colors.primary : colors.surface }
                ]}
                onPress={() => setSelectedCategory(category.key as any)}
              >
                <MaterialIcons 
                  name={category.icon as any} 
                  size={16} 
                  color={selectedCategory === category.key ? '#FFFFFF' : colors.textSecondary} 
                />
                <Text style={[
                  styles.categoryText,
                  { color: selectedCategory === category.key ? '#FFFFFF' : colors.textSecondary }
                ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Metrics Grid */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Key Metrics
          </Text>
          <View style={styles.metricsGrid}>
            {filteredMetrics.map(renderMetricCard)}
          </View>
        </View>

        {/* Charts Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Detailed Analytics
          </Text>
          {charts.map(renderChart)}
        </View>

        {/* Export & Reports */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Reports & Export
          </Text>
          
          <TouchableOpacity style={[styles.exportButton, { backgroundColor: colors.primary }]}>
            <MaterialIcons name="file-download" size={20} color="#FFFFFF" />
            <Text style={styles.exportButtonText}>
              Export Full Report
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.reportButton, { backgroundColor: colors.surface }]}>
            <MaterialIcons name="schedule-send" size={20} color={colors.primary} />
            <Text style={[styles.reportButtonText, { color: colors.text }]}>
              Schedule Weekly Reports
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  timeframeContainer: {
    flexDirection: 'row',
  },
  timeframeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  timeframeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoryContainer: {
    flexDirection: 'row',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: (width - 50) / 2,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  trendIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricTitle: {
    fontSize: 12,
    marginBottom: 4,
  },
  metricChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  chartCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
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
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  exportButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  reportButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  bottomSpacer: {
    height: 100,
  },
});

export default React.memo(AdvancedAnalyticsHubScreen);

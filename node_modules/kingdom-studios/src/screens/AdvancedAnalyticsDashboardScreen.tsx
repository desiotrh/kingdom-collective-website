import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { KingdomColors } from '../constants/KingdomColors';
import { useFaithMode } from '../contexts/FaithModeContext';
import AnalyticsService from '../services/AnalyticsService';
import {
  MetricCard,
  ChartData,
  ContentPerformance,
  AudienceInsight,
  SpiritualMetrics,
  BusinessMetrics,
  GoalTracking,
  AnalyticsFilter,
  AnalyticsAlert,
  PlatformAnalytics,
  HashtagAnalytics,
  AIInsight,
} from '../types/analytics';

const { width } = Dimensions.get('window');

const AdvancedAnalyticsDashboardScreen: React.FC = () => {
  const { faithMode } = useFaithMode();
  const isDualMode = true; // Always enable dual mode for this analytics dashboard
  const currentMode = faithMode ? 'faith' : 'encouragement';
  const [selectedPeriod, setSelectedPeriod] = useState<string>('30d');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string>('overview');
  const [filters, setFilters] = useState<AnalyticsFilter>({
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      end: new Date().toISOString(),
      preset: '30d',
    },
    mood: isDualMode ? 'both' : (currentMode as 'faith' | 'encouragement'),
  });
  
  const analyticsService = AnalyticsService.getInstance();

  // Load data based on filters
  const [metricCards, setMetricCards] = useState<MetricCard[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [aiInsights, setAIInsights] = useState<AIInsight[]>([]);

  useEffect(() => {
    // Load analytics data when filters change
    const loadAnalyticsData = () => {
      const metrics = analyticsService.calculateMetricCards(filters);
      const charts = analyticsService.generateChartData(filters);
      const insights = analyticsService.generateAIInsights(filters);
      
      setMetricCards(metrics);
      setChartData(charts);
      setAIInsights(insights);
    };

    loadAnalyticsData();
  }, [filters, analyticsService]);

  // Update filters when period changes
  const updatePeriod = (period: string) => {
    setSelectedPeriod(period);
    
    let startDate: Date;
    const endDate = new Date();
    
    switch (period) {
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }
    
    setFilters(prev => ({
      ...prev,
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        preset: period as any,
      },
    }));
  };

  // Mock alerts - would come from real alert system
  const [alerts] = useState<AnalyticsAlert[]>([
    {
      id: '1',
      type: 'goal',
      title: 'Monthly Goal Achievement',
      message: 'You\'re 85% towards your monthly revenue goal. Keep going!',
      severity: 'info',
      actionRequired: false,
      dismissed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      type: 'opportunity',
      title: 'High-Performing Content',
      message: 'Your testimony posts are performing 40% better than average.',
      severity: 'success',
      actionRequired: true,
      dismissed: false,
      createdAt: new Date().toISOString(),
    },
  ]);

  const getDisplayTitle = (item: { title: string; faithModeTitle?: string; encouragementModeTitle?: string }) => {
    if (!isDualMode) return item.title;
    if (currentMode === 'faith' && item.faithModeTitle) return item.faithModeTitle;
    if (currentMode === 'encouragement' && item.encouragementModeTitle) return item.encouragementModeTitle;
    return item.title;
  };

  const formatValue = (value: number, format: 'number' | 'currency' | 'percentage') => {
    switch (format) {
      case 'currency':
        return `$${value.toLocaleString()}`;
      case 'percentage':
        return `${value}%`;
      default:
        return value.toLocaleString();
    }
  };

  const renderMetricCard = (metric: MetricCard) => (
    <View key={metric.id} style={styles.metricCard}>
      <View style={styles.metricHeader}>
        <MaterialIcons name={metric.icon as any} size={24} color={metric.color} />
        <View style={[styles.trendIndicator, { backgroundColor: metric.trend === 'up' ? KingdomColors.accent.success : metric.trend === 'down' ? KingdomColors.accent.error : KingdomColors.text.muted }]}>
          <MaterialIcons 
            name={metric.trend === 'up' ? 'trending-up' : metric.trend === 'down' ? 'trending-down' : 'trending-flat'} 
            size={16} 
            color={KingdomColors.white} 
          />
        </View>
      </View>
      <Text style={styles.metricValue}>{formatValue(metric.value, metric.format)}</Text>
      <Text style={styles.metricTitle}>{getDisplayTitle(metric)}</Text>
      <View style={styles.metricChange}>
        <Text style={[styles.changeText, { color: metric.trend === 'up' ? KingdomColors.accent.success : metric.trend === 'down' ? KingdomColors.accent.error : KingdomColors.text.muted }]}>
          {metric.change > 0 ? '+' : ''}{metric.change}%
        </Text>
        <Text style={styles.periodText}>{metric.period}</Text>
      </View>
    </View>
  );

  const renderChart = (chart: ChartData) => (
    <View key={chart.id} style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{getDisplayTitle(chart)}</Text>
      <View style={styles.chartContent}>
        {chart.type === 'bar' && (
          <View style={styles.barChart}>
            {chart.data.map((item, index) => (
              <View key={index} style={styles.barItem}>
                <View style={[styles.bar, { height: (item.value / Math.max(...chart.data.map(d => d.value))) * 100, backgroundColor: item.color || KingdomColors.primary.royalPurple }]} />
                <Text style={styles.barLabel}>{item.label}</Text>
                <Text style={styles.barValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        )}
        {chart.type === 'line' && (
          <View style={styles.lineChart}>
            <Text style={styles.chartPlaceholder}>Line Chart: {chart.data.length} data points</Text>
            {chart.data.map((item, index) => (
              <Text key={index} style={styles.dataPoint}>
                {item.label}: {chart.unit}{item.value}
              </Text>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  const renderAlert = (alert: AnalyticsAlert) => (
    <View key={alert.id} style={[styles.alertCard, { borderLeftColor: 
      alert.severity === 'error' ? KingdomColors.accent.error :
      alert.severity === 'warning' ? KingdomColors.accent.warning :
      alert.severity === 'success' ? KingdomColors.accent.success :
      KingdomColors.primary.royalPurple
    }]}>
      <View style={styles.alertHeader}>
        <MaterialIcons 
          name={
            alert.severity === 'error' ? 'error' :
            alert.severity === 'warning' ? 'warning' :
            alert.severity === 'success' ? 'check-circle' :
            'info'
          } 
          size={20} 
          color={
            alert.severity === 'error' ? KingdomColors.accent.error :
            alert.severity === 'warning' ? KingdomColors.accent.warning :
            alert.severity === 'success' ? KingdomColors.accent.success :
            KingdomColors.primary.royalPurple
          } 
        />
        <Text style={styles.alertTitle}>{alert.title}</Text>
      </View>
      <Text style={styles.alertMessage}>{alert.message}</Text>
      {alert.actionRequired && (
        <TouchableOpacity style={styles.alertAction}>
          <Text style={styles.alertActionText}>Take Action</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderAIInsight = (insight: AIInsight) => (
    <View key={insight.id} style={styles.insightCard}>
      <View style={styles.insightHeader}>
        <MaterialCommunityIcons name="brain" size={20} color={KingdomColors.primary.royalPurple} />
        <Text style={styles.insightTitle}>{insight.title}</Text>
        <View style={styles.confidenceScore}>
          <Text style={styles.confidenceText}>{Math.round(insight.confidence * 100)}%</Text>
        </View>
      </View>
      <Text style={styles.insightDescription}>{insight.description}</Text>
      {insight.estimatedBenefit && (
        <View style={styles.insightBenefit}>
          <MaterialIcons name="trending-up" size={16} color={KingdomColors.accent.success} />
          <Text style={styles.benefitText}>{insight.estimatedBenefit}</Text>
        </View>
      )}
      {insight.actionable && (
        <TouchableOpacity style={styles.insightAction}>
          <Text style={styles.insightActionText}>Apply Suggestion</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'overview':
        return (
          <>
            <View style={styles.metricsGrid}>
              {metricCards.map(renderMetricCard)}
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Performance Charts</Text>
              {chartData.map(renderChart)}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {isDualMode ? (currentMode === 'faith' ? 'Divine Insights' : 'Encouraging Insights') : 'AI Insights'}
              </Text>
              {aiInsights.map(renderAIInsight)}
            </View>
          </>
        );
      
      case 'alerts':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Alerts</Text>
            {alerts.map(renderAlert)}
          </View>
        );
      
      case 'goals':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Goal Tracking</Text>
            <Text style={styles.placeholder}>Goal tracking coming soon...</Text>
          </View>
        );
      
      default:
        return <Text style={styles.placeholder}>Content coming soon...</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isDualMode ? (currentMode === 'faith' ? 'Kingdom Analytics' : 'Impact Analytics') : 'Analytics Dashboard'}
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(true)}
          >
            <MaterialIcons name="filter-list" size={24} color={KingdomColors.primary.royalPurple} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.exportButton}>
            <MaterialIcons name="file-download" size={24} color={KingdomColors.primary.royalPurple} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.periodSelector}>
        {['7d', '30d', '90d', '1y'].map((period) => (
          <TouchableOpacity
            key={period}
            style={[styles.periodButton, selectedPeriod === period && styles.selectedPeriod]}
            onPress={() => updatePeriod(period)}
          >
            <Text style={[styles.periodText, selectedPeriod === period && styles.selectedPeriodText]}>
              {period}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.tabContainer}>
        {[
          { id: 'overview', label: 'Overview', icon: 'dashboard' },
          { id: 'alerts', label: 'Alerts', icon: 'notifications' },
          { id: 'goals', label: 'Goals', icon: 'flag' },
          { id: 'export', label: 'Export', icon: 'file-download' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, selectedTab === tab.id && styles.selectedTab]}
            onPress={() => setSelectedTab(tab.id)}
          >
            <MaterialIcons 
              name={tab.icon as any} 
              size={20} 
              color={selectedTab === tab.id ? KingdomColors.white : KingdomColors.text.muted} 
            />
            <Text style={[styles.tabText, selectedTab === tab.id && styles.selectedTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderTabContent()}
      </ScrollView>

      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Analytics</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <MaterialIcons name="close" size={24} color={KingdomColors.text.inverse} />
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.placeholder}>Advanced filters coming soon...</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: KingdomColors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: KingdomColors.white,
    shadowColor: KingdomColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.text.inverse,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 15,
  },
  filterButton: {
    padding: 8,
  },
  exportButton: {
    padding: 8,
  },
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: KingdomColors.white,
    gap: 10,
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: KingdomColors.silver.platinum,
  },
  selectedPeriod: {
    backgroundColor: KingdomColors.primary.royalPurple,
  },
  periodText: {
    fontSize: 14,
    color: KingdomColors.text.muted,
    fontWeight: '500',
  },
  selectedPeriodText: {
    color: KingdomColors.white,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: KingdomColors.white,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 6,
  },
  selectedTab: {
    backgroundColor: KingdomColors.primary.royalPurple,
  },
  tabText: {
    fontSize: 12,
    color: KingdomColors.text.muted,
    fontWeight: '500',
  },
  selectedTabText: {
    color: KingdomColors.white,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 25,
  },
  metricCard: {
    width: (width - 55) / 2,
    backgroundColor: KingdomColors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: KingdomColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  trendIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.text.inverse,
    marginBottom: 4,
  },
  metricTitle: {
    fontSize: 12,
    color: KingdomColors.text.muted,
    marginBottom: 8,
  },
  metricChange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 15,
  },
  chartContainer: {
    backgroundColor: KingdomColors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: KingdomColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.text.inverse,
    marginBottom: 12,
  },
  chartContent: {
    minHeight: 120,
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 120,
    paddingBottom: 30,
  },
  barItem: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 24,
    minHeight: 20,
    borderRadius: 4,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 10,
    color: KingdomColors.text.muted,
    textAlign: 'center',
    marginBottom: 2,
  },
  barValue: {
    fontSize: 12,
    fontWeight: '600',
    color: KingdomColors.text.inverse,
  },
  lineChart: {
    padding: 10,
  },
  chartPlaceholder: {
    fontSize: 14,
    color: KingdomColors.text.muted,
    textAlign: 'center',
    marginBottom: 10,
  },
  dataPoint: {
    fontSize: 12,
    color: KingdomColors.text.muted,
    marginBottom: 5,
  },
  alertCard: {
    backgroundColor: KingdomColors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: KingdomColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.text.inverse,
    flex: 1,
  },
  alertMessage: {
    fontSize: 13,
    color: KingdomColors.text.muted,
    lineHeight: 18,
    marginBottom: 12,
  },
  alertAction: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: KingdomColors.primary.royalPurple,
    borderRadius: 6,
  },
  alertActionText: {
    fontSize: 12,
    color: KingdomColors.white,
    fontWeight: '500',
  },
  insightCard: {
    backgroundColor: KingdomColors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: KingdomColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.text.inverse,
    flex: 1,
  },
  confidenceScore: {
    backgroundColor: KingdomColors.primary.royalPurple,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  confidenceText: {
    fontSize: 10,
    color: KingdomColors.white,
    fontWeight: '500',
  },
  insightDescription: {
    fontSize: 13,
    color: KingdomColors.text.muted,
    lineHeight: 18,
    marginBottom: 12,
  },
  insightBenefit: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 4,
  },
  benefitText: {
    fontSize: 12,
    color: KingdomColors.accent.success,
    fontWeight: '500',
  },
  insightAction: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: KingdomColors.primary.royalPurple,
    borderRadius: 6,
  },
  insightActionText: {
    fontSize: 12,
    color: KingdomColors.white,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: KingdomColors.background.primary,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: KingdomColors.white,
    shadowColor: KingdomColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.text.inverse,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  placeholder: {
    fontSize: 16,
    color: KingdomColors.text.muted,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 40,
  },
});

export default React.memo(AdvancedAnalyticsDashboardScreen);

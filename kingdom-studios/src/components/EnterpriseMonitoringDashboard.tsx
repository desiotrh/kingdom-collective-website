import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { KingdomColors } from '../constants/KingdomColors';
import { apiClient } from '../services/apiClient';

const { width } = Dimensions.get('window');

interface MonitoringData {
  status: 'healthy' | 'warning' | 'critical';
  alerts: {
    active: number;
    critical: number;
    warning: number;
  };
  performance: {
    responseTime: number;
    errorRate: number;
    throughput: number;
    uptime: number;
  };
  system: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  };
  business: {
    activeUsers: number;
    conversions: number;
    revenue: number;
    contentGeneration: number;
  };
}

interface AnalyticsData {
  realtime: {
    activeUsers: number;
    currentSessions: number;
  };
  insights: {
    userInsights: any[];
    contentInsights: any[];
    performanceInsights: any[];
    businessInsights: any[];
  };
}

const EnterpriseMonitoringDashboard: React.FC = () => {
  const [monitoringData, setMonitoringData] = useState<MonitoringData | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'analytics' | 'alerts'>('overview');

  useEffect(() => {
    loadMonitoringData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadMonitoringData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadMonitoringData = async () => {
    try {
      const [monitoringResponse, analyticsResponse] = await Promise.all([
        apiClient.get('/monitoring/dashboard'),
        apiClient.get('/monitoring/analytics')
      ]);

      if (monitoringResponse.success) {
        setMonitoringData(monitoringResponse.data.performance);
      }

      if (analyticsResponse.success) {
        setAnalyticsData(analyticsResponse.data);
      }
    } catch (error) {
      console.error('Error loading monitoring data:', error);
      Alert.alert('Error', 'Failed to load monitoring data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadMonitoringData();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return KingdomColors.success.main;
      case 'warning': return KingdomColors.warning.main;
      case 'critical': return KingdomColors.error.main;
      default: return KingdomColors.neutral.medium;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return '✅';
      case 'warning': return '⚠️';
      case 'critical': return '🚨';
      default: return '⚪';
    }
  };

  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      {/* System Status */}
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <Text style={styles.statusIcon}>
            {getStatusIcon(monitoringData?.status || 'healthy')}
          </Text>
          <Text style={styles.statusTitle}>System Status</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(monitoringData?.status || 'healthy') }]}>
            <Text style={styles.statusBadgeText}>
              {(monitoringData?.status || 'healthy').toUpperCase()}
            </Text>
          </View>
        </View>
        
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{monitoringData?.performance.uptime.toFixed(1) || '99.9'}%</Text>
            <Text style={styles.metricLabel}>Uptime</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{analyticsData?.realtime.activeUsers || '0'}</Text>
            <Text style={styles.metricLabel}>Active Users</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{monitoringData?.performance.responseTime.toFixed(0) || '0'}ms</Text>
            <Text style={styles.metricLabel}>Response Time</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{monitoringData?.alerts.active || '0'}</Text>
            <Text style={styles.metricLabel}>Active Alerts</Text>
          </View>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{monitoringData?.business.activeUsers || '0'}</Text>
          <Text style={styles.statLabel}>Active Users</Text>
          <Text style={styles.statChange}>+12%</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{monitoringData?.business.conversions || '0'}</Text>
          <Text style={styles.statLabel}>Conversions</Text>
          <Text style={styles.statChange}>+8%</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>${(monitoringData?.business.revenue || 0).toFixed(0)}</Text>
          <Text style={styles.statLabel}>Revenue</Text>
          <Text style={styles.statChange}>+15%</Text>
        </View>
      </View>
    </View>
  );

  const renderPerformanceTab = () => (
    <View style={styles.tabContent}>
      {/* Performance Metrics */}
      <View style={styles.performanceCard}>
        <Text style={styles.cardTitle}>Performance Metrics</Text>
        <View style={styles.performanceGrid}>
          <View style={styles.performanceItem}>
            <Text style={styles.performanceLabel}>Response Time</Text>
            <Text style={styles.performanceValue}>
              {monitoringData?.performance.responseTime.toFixed(0) || '0'}ms
            </Text>
            <View style={[styles.performanceBar, { width: `${Math.min((monitoringData?.performance.responseTime || 0) / 10, 100)}%` }]} />
          </View>
          
          <View style={styles.performanceItem}>
            <Text style={styles.performanceLabel}>Error Rate</Text>
            <Text style={styles.performanceValue}>
              {monitoringData?.performance.errorRate.toFixed(2) || '0.00'}%
            </Text>
            <View style={[styles.performanceBar, { 
              width: `${Math.min((monitoringData?.performance.errorRate || 0) * 10, 100)}%`,
              backgroundColor: (monitoringData?.performance.errorRate || 0) > 2 ? KingdomColors.error.main : KingdomColors.success.main
            }]} />
          </View>
          
          <View style={styles.performanceItem}>
            <Text style={styles.performanceLabel}>Throughput</Text>
            <Text style={styles.performanceValue}>
              {monitoringData?.performance.throughput.toFixed(0) || '0'} req/min
            </Text>
            <View style={[styles.performanceBar, { width: `${Math.min((monitoringData?.performance.throughput || 0) / 5, 100)}%` }]} />
          </View>
        </View>
      </View>

      {/* System Resources */}
      <View style={styles.systemCard}>
        <Text style={styles.cardTitle}>System Resources</Text>
        <View style={styles.systemGrid}>
          <View style={styles.systemItem}>
            <Text style={styles.systemLabel}>CPU Usage</Text>
            <Text style={styles.systemValue}>{monitoringData?.system.cpu.toFixed(1) || '0'}%</Text>
            <View style={styles.systemBarContainer}>
              <View style={[styles.systemBar, { 
                width: `${monitoringData?.system.cpu || 0}%`,
                backgroundColor: (monitoringData?.system.cpu || 0) > 80 ? KingdomColors.error.main : 
                                (monitoringData?.system.cpu || 0) > 60 ? KingdomColors.warning.main : 
                                KingdomColors.success.main
              }]} />
            </View>
          </View>
          
          <View style={styles.systemItem}>
            <Text style={styles.systemLabel}>Memory Usage</Text>
            <Text style={styles.systemValue}>{monitoringData?.system.memory.toFixed(1) || '0'}%</Text>
            <View style={styles.systemBarContainer}>
              <View style={[styles.systemBar, { 
                width: `${monitoringData?.system.memory || 0}%`,
                backgroundColor: (monitoringData?.system.memory || 0) > 85 ? KingdomColors.error.main : 
                                (monitoringData?.system.memory || 0) > 70 ? KingdomColors.warning.main : 
                                KingdomColors.success.main
              }]} />
            </View>
          </View>
          
          <View style={styles.systemItem}>
            <Text style={styles.systemLabel}>Disk Usage</Text>
            <Text style={styles.systemValue}>{monitoringData?.system.disk.toFixed(1) || '0'}%</Text>
            <View style={styles.systemBarContainer}>
              <View style={[styles.systemBar, { 
                width: `${monitoringData?.system.disk || 0}%`,
                backgroundColor: (monitoringData?.system.disk || 0) > 90 ? KingdomColors.error.main : 
                                (monitoringData?.system.disk || 0) > 75 ? KingdomColors.warning.main : 
                                KingdomColors.success.main
              }]} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderAnalyticsTab = () => (
    <View style={styles.tabContent}>
      {/* Real-time Analytics */}
      <View style={styles.analyticsCard}>
        <Text style={styles.cardTitle}>Real-time Analytics</Text>
        <View style={styles.analyticsGrid}>
          <View style={styles.analyticsItem}>
            <Text style={styles.analyticsValue}>{analyticsData?.realtime.activeUsers || '0'}</Text>
            <Text style={styles.analyticsLabel}>Active Users</Text>
          </View>
          <View style={styles.analyticsItem}>
            <Text style={styles.analyticsValue}>{analyticsData?.realtime.currentSessions || '0'}</Text>
            <Text style={styles.analyticsLabel}>Active Sessions</Text>
          </View>
          <View style={styles.analyticsItem}>
            <Text style={styles.analyticsValue}>{monitoringData?.business.contentGeneration || '0'}</Text>
            <Text style={styles.analyticsLabel}>Content Generated</Text>
          </View>
        </View>
      </View>

      {/* Insights */}
      <View style={styles.insightsCard}>
        <Text style={styles.cardTitle}>Key Insights</Text>
        {analyticsData?.insights.userInsights.map((insight, index) => (
          <View key={index} style={styles.insightItem}>
            <Text style={styles.insightTitle}>{insight.title}</Text>
            <Text style={styles.insightValue}>{insight.value}</Text>
            <Text style={styles.insightDescription}>{insight.description}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderAlertsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.alertsCard}>
        <Text style={styles.cardTitle}>Active Alerts</Text>
        {monitoringData?.alerts.active === 0 ? (
          <View style={styles.noAlertsContainer}>
            <Text style={styles.noAlertsIcon}>✅</Text>
            <Text style={styles.noAlertsText}>No active alerts</Text>
            <Text style={styles.noAlertsSubtext}>System is running smoothly</Text>
          </View>
        ) : (
          <View style={styles.alertsList}>
            <View style={styles.alertSummary}>
              <View style={styles.alertSummaryItem}>
                <Text style={styles.alertSummaryCount}>{monitoringData?.alerts.critical || '0'}</Text>
                <Text style={styles.alertSummaryLabel}>Critical</Text>
              </View>
              <View style={styles.alertSummaryItem}>
                <Text style={styles.alertSummaryCount}>{monitoringData?.alerts.warning || '0'}</Text>
                <Text style={styles.alertSummaryLabel}>Warning</Text>
              </View>
              <View style={styles.alertSummaryItem}>
                <Text style={styles.alertSummaryCount}>{monitoringData?.alerts.active || '0'}</Text>
                <Text style={styles.alertSummaryLabel}>Total</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={KingdomColors.primary.main} />
        <Text style={styles.loadingText}>Loading monitoring data...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[KingdomColors.primary.midnight, KingdomColors.primary.deepNavy]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Enterprise Monitoring</Text>
        <Text style={styles.headerSubtitle}>Real-time system health & analytics</Text>
      </LinearGradient>

      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'overview' && styles.activeTabButton]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'overview' && styles.activeTabButtonText]}>
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'performance' && styles.activeTabButton]}
          onPress={() => setActiveTab('performance')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'performance' && styles.activeTabButtonText]}>
            Performance
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'analytics' && styles.activeTabButton]}
          onPress={() => setActiveTab('analytics')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'analytics' && styles.activeTabButtonText]}>
            Analytics
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'alerts' && styles.activeTabButton]}
          onPress={() => setActiveTab('alerts')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'alerts' && styles.activeTabButtonText]}>
            Alerts
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'performance' && renderPerformanceTab()}
        {activeTab === 'analytics' && renderAnalyticsTab()}
        {activeTab === 'alerts' && renderAlertsTab()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: KingdomColors.background.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: KingdomColors.background.primary,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: KingdomColors.text.secondary,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: KingdomColors.neutral.light,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeTabButton: {
    backgroundColor: KingdomColors.primary.main,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.text.secondary,
  },
  activeTabButtonText: {
    color: 'white',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  statusCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    backgroundColor: KingdomColors.background.secondary,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.primary.main,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: KingdomColors.text.secondary,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: KingdomColors.text.secondary,
    marginBottom: 4,
  },
  statChange: {
    fontSize: 12,
    color: KingdomColors.success.main,
    fontWeight: '600',
  },
  performanceCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 16,
  },
  performanceGrid: {
    gap: 16,
  },
  performanceItem: {
    marginBottom: 16,
  },
  performanceLabel: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    marginBottom: 4,
  },
  performanceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 8,
  },
  performanceBar: {
    height: 4,
    backgroundColor: KingdomColors.primary.main,
    borderRadius: 2,
  },
  systemCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  systemGrid: {
    gap: 16,
  },
  systemItem: {
    marginBottom: 16,
  },
  systemLabel: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    marginBottom: 4,
  },
  systemValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 8,
  },
  systemBarContainer: {
    height: 6,
    backgroundColor: KingdomColors.neutral.light,
    borderRadius: 3,
    overflow: 'hidden',
  },
  systemBar: {
    height: '100%',
    borderRadius: 3,
  },
  analyticsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  analyticsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  analyticsItem: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  analyticsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.primary.main,
    marginBottom: 4,
  },
  analyticsLabel: {
    fontSize: 12,
    color: KingdomColors.text.secondary,
    textAlign: 'center',
  },
  insightsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: KingdomColors.neutral.light,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.text.primary,
    marginBottom: 4,
  },
  insightValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.primary.main,
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
  },
  alertsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noAlertsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noAlertsIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  noAlertsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 8,
  },
  noAlertsSubtext: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
  },
  alertsList: {
    marginTop: 16,
  },
  alertSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  alertSummaryItem: {
    alignItems: 'center',
  },
  alertSummaryCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 4,
  },
  alertSummaryLabel: {
    fontSize: 12,
    color: KingdomColors.text.secondary,
  },
});

export default React.memo(EnterpriseMonitoringDashboard);

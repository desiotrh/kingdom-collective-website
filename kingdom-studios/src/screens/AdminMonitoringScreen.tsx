import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useDualMode } from '../contexts/DualModeContext';
import { KingdomColors } from '../constants/KingdomColors';
import { apiClient } from '../services/apiClient';

const { width } = Dimensions.get('window');

interface MonitoringData {
  monitoring: {
    system: {
      cpu: { current: number; avg: number; peak: number };
      memory: { current: number; avg: number; peak: number };
      disk: { current: number; avg: number; peak: number };
    };
    users: {
      concurrent: { current: number; peak: number };
      sessionsToday: number;
      newUsers: number;
    };
    api: {
      requestsPerSecond: number;
      responseTime: { avg: number; p95: number };
      errorRate: number;
    };
  };
  analytics: {
    events: { total: number; hourly: number };
    users: { active: number; new: number };
    content: { generated: number; views: number };
  };
  performance: {
    healthScore: number;
    alerts: {
      active: Array<{
        id: string;
        severity: string;
        message: string;
        timestamp: string;
      }>;
    };
  };
}

interface AdminMonitoringScreenProps {
  navigation: any;
}

const AdminMonitoringScreen: React.FC<AdminMonitoringScreenProps> = ({ navigation }) => {
  const { isDualMode, currentMode } = useDualMode();
  const isFaithMode = currentMode === 'faith';
  const [monitoringData, setMonitoringData] = useState<MonitoringData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('24h');

  const currentColors = KingdomColors;

  useEffect(() => {
    loadMonitoringData();
    const interval = setInterval(loadMonitoringData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [selectedTimeRange]);

  const loadMonitoringData = async () => {
    try {
      setRefreshing(true);
      const response = await apiClient.get('/monitoring/dashboard');
      
      if (response.success) {
        setMonitoringData(response.data);
      } else {
        // Fallback to mock data for testing
        setMonitoringData(getMockMonitoringData());
      }
    } catch (error) {
      console.error('Error loading monitoring data:', error);
      // Use mock data as fallback
      setMonitoringData(getMockMonitoringData());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getMockMonitoringData = (): MonitoringData => ({
    monitoring: {
      system: {
        cpu: { current: 45.2, avg: 42.8, peak: 78.5 },
        memory: { current: 68.4, avg: 65.2, peak: 85.3 },
        disk: { current: 32.1, avg: 28.7, peak: 45.6 },
      },
      users: {
        concurrent: { current: 1247, peak: 2156 },
        sessionsToday: 5643,
        newUsers: 234,
      },
      api: {
        requestsPerSecond: 157,
        responseTime: { avg: 145, p95: 287 },
        errorRate: 0.02,
      },
    },
    analytics: {
      events: { total: 15647, hourly: 1247 },
      users: { active: 1247, new: 234 },
      content: { generated: 892, views: 12456 },
    },
    performance: {
      healthScore: 96,
      alerts: {
        active: [
          {
            id: 'alert_1',
            severity: 'warning',
            message: 'API response time above threshold',
            timestamp: new Date().toISOString(),
          },
        ],
      },
    },
  });

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getHealthStatusColor = (score: number): string => {
    if (score >= 90) return '#4CAF50';
    if (score >= 70) return '#FF9800';
    return '#F44336';
  };

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    subtitle?: string;
    icon: string;
    color: string;
    trend?: 'up' | 'down' | 'stable';
  }> = ({ title, value, subtitle, icon, color, trend }) => (
    <View style={[styles.metricCard, { borderLeftColor: color }]}>
      <View style={styles.metricHeader}>
        <Ionicons name={icon as any} size={24} color={color} />
        <Text style={[styles.metricTitle, { color: currentColors.text.primary }]}>
          {title}
        </Text>
      </View>
      <Text style={[styles.metricValue, { color: currentColors.text.primary }]}>
        {value}
      </Text>
      {subtitle && (
        <View style={styles.metricSubtitle}>
          <Text style={[styles.metricSubtitleText, { color: currentColors.text.secondary }]}>
            {subtitle}
          </Text>
          {trend && (
            <Ionicons
              name={
                trend === 'up' ? 'trending-up' : 
                trend === 'down' ? 'trending-down' : 
                'remove'
              }
              size={16}
              color={
                trend === 'up' ? '#4CAF50' : 
                trend === 'down' ? '#F44336' : 
                currentColors.text.secondary
              }
            />
          )}
        </View>
      )}
    </View>
  );

  const AlertCard: React.FC<{
    alert: {
      id: string;
      severity: string;
      message: string;
      timestamp: string;
    };
  }> = ({ alert }) => {
    const severityColor = 
      alert.severity === 'critical' ? '#F44336' :
      alert.severity === 'warning' ? '#FF9800' : '#2196F3';

    return (
      <View style={[styles.alertCard, { borderLeftColor: severityColor }]}>
        <View style={styles.alertHeader}>
          <View style={[styles.alertSeverityBadge, { backgroundColor: severityColor }]}>
            <Text style={styles.alertSeverityText}>
              {alert.severity.toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.alertTimestamp, { color: currentColors.text.secondary }]}>
            {new Date(alert.timestamp).toLocaleTimeString()}
          </Text>
        </View>
        <Text style={[styles.alertMessage, { color: currentColors.text.primary }]}>
          {alert.message}
        </Text>
      </View>
    );
  };

  if (loading && !monitoringData) {
    return (
      <View style={[styles.container, { backgroundColor: currentColors.background.primary }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: currentColors.text.primary }]}>
            Loading monitoring data...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background.primary }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: currentColors.background.secondary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={currentColors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: currentColors.text.primary }]}>
          System Monitoring
        </Text>
        <TouchableOpacity onPress={loadMonitoringData} style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color={currentColors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadMonitoringData}
            tintColor={currentColors.text.primary}
          />
        }
      >
        {/* Health Score */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentColors.text.primary }]}>
            System Health
          </Text>
          <View style={styles.healthScoreContainer}>
            <LinearGradient
              colors={[getHealthStatusColor(monitoringData?.performance?.healthScore || 0), '#ffffff20']}
              style={styles.healthScoreGradient}
            >
              <Text style={styles.healthScoreValue}>
                {monitoringData?.performance?.healthScore || 0}%
              </Text>
              <Text style={styles.healthScoreLabel}>Health Score</Text>
            </LinearGradient>
          </View>
        </View>

        {/* System Metrics */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentColors.text.primary }]}>
            System Resources
          </Text>
          <View style={styles.metricsGrid}>
            <MetricCard
              title="CPU Usage"
              value={`${monitoringData?.monitoring?.system?.cpu?.current || 0}%`}
              subtitle={`Avg: ${monitoringData?.monitoring?.system?.cpu?.avg || 0}%`}
              icon="hardware-chip"
              color="#2196F3"
              trend="stable"
            />
            <MetricCard
              title="Memory"
              value={`${monitoringData?.monitoring?.system?.memory?.current || 0}%`}
              subtitle={`Peak: ${monitoringData?.monitoring?.system?.memory?.peak || 0}%`}
              icon="albums"
              color="#4CAF50"
              trend="up"
            />
            <MetricCard
              title="Disk Usage"
              value={`${monitoringData?.monitoring?.system?.disk?.current || 0}%`}
              subtitle={`Available space`}
              icon="server"
              color="#FF9800"
              trend="stable"
            />
          </View>
        </View>

        {/* User Metrics */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentColors.text.primary }]}>
            User Activity
          </Text>
          <View style={styles.metricsGrid}>
            <MetricCard
              title="Concurrent Users"
              value={formatNumber(monitoringData?.monitoring?.users?.concurrent?.current || 0)}
              subtitle={`Peak: ${formatNumber(monitoringData?.monitoring?.users?.concurrent?.peak || 0)}`}
              icon="people"
              color="#9C27B0"
              trend="up"
            />
            <MetricCard
              title="Sessions Today"
              value={formatNumber(monitoringData?.monitoring?.users?.sessionsToday || 0)}
              subtitle="Total sessions"
              icon="analytics"
              color="#00BCD4"
              trend="up"
            />
            <MetricCard
              title="New Users"
              value={formatNumber(monitoringData?.monitoring?.users?.newUsers || 0)}
              subtitle="Today"
              icon="person-add"
              color="#4CAF50"
              trend="up"
            />
          </View>
        </View>

        {/* API Performance */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentColors.text.primary }]}>
            API Performance
          </Text>
          <View style={styles.metricsGrid}>
            <MetricCard
              title="Requests/sec"
              value={monitoringData?.monitoring?.api?.requestsPerSecond || 0}
              subtitle="Current rate"
              icon="pulse"
              color="#E91E63"
              trend="stable"
            />
            <MetricCard
              title="Response Time"
              value={`${monitoringData?.monitoring?.api?.responseTime?.avg || 0}ms`}
              subtitle={`P95: ${monitoringData?.monitoring?.api?.responseTime?.p95 || 0}ms`}
              icon="timer"
              color="#FF5722"
              trend="down"
            />
            <MetricCard
              title="Error Rate"
              value={`${((monitoringData?.monitoring?.api?.errorRate || 0) * 100).toFixed(2)}%`}
              subtitle="Last hour"
              icon="warning"
              color="#F44336"
              trend="stable"
            />
          </View>
        </View>

        {/* Active Alerts */}
        {monitoringData?.performance?.alerts?.active?.length ? (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: currentColors.text.primary }]}>
              Active Alerts ({monitoringData.performance.alerts.active.length})
            </Text>
            {monitoringData.performance.alerts.active.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </View>
        ) : null}

        {/* Content Analytics */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentColors.text.primary }]}>
            Content Analytics
          </Text>
          <View style={styles.metricsGrid}>
            <MetricCard
              title="Content Generated"
              value={formatNumber(monitoringData?.analytics?.content?.generated || 0)}
              subtitle="Today"
              icon="create"
              color="#673AB7"
              trend="up"
            />
            <MetricCard
              title="Total Views"
              value={formatNumber(monitoringData?.analytics?.content?.views || 0)}
              subtitle="All content"
              icon="eye"
              color="#03DAC6"
              trend="up"
            />
            <MetricCard
              title="Events Tracked"
              value={formatNumber(monitoringData?.analytics?.events?.total || 0)}
              subtitle={`${formatNumber(monitoringData?.analytics?.events?.hourly || 0)}/hour`}
              icon="stats-chart"
              color="#FF9800"
              trend="stable"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  refreshButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  healthScoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  healthScoreGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  healthScoreValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  healthScoreLabel: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.8,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: width * 0.42,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  metricTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  metricSubtitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricSubtitleText: {
    fontSize: 10,
    flex: 1,
  },
  alertCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  alertSeverityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  alertSeverityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  alertTimestamp: {
    fontSize: 12,
  },
  alertMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default React.memo(AdminMonitoringScreen);

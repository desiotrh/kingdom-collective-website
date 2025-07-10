import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSystemMonitoring } from '../hooks/useSystemMonitoring';
import { useAnalytics } from '../hooks/useAnalytics';

export const SystemMonitoringScreen: React.FC = () => {
  const {
    metrics,
    healthScore,
    usageInsights,
    isLoading,
    error,
    refreshMetrics,
    clearOldData,
  } = useSystemMonitoring();

  const { trackScreenView, trackUserAction } = useAnalytics();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    trackScreenView('SystemMonitoring');
  }, [trackScreenView]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshMetrics();
      await trackUserAction('system_monitoring_refresh', {});
    } catch (err) {
      Alert.alert('Error', 'Failed to refresh metrics');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleClearOldData = async () => {
    Alert.alert(
      'Clear Old Data',
      'Are you sure you want to clear monitoring data older than 30 days?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            setIsClearing(true);
            try {
              await clearOldData(30);
              await trackUserAction('system_monitoring_clear_data', { daysToKeep: 30 });
              Alert.alert('Success', 'Old monitoring data cleared successfully');
            } catch (err) {
              Alert.alert('Error', 'Failed to clear old data');
            } finally {
              setIsClearing(false);
            }
          },
        },
      ]
    );
  };

  const getHealthScoreColor = (score: number): string => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FF9800';
    return '#f44336';
  };

  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const formatMemory = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.loadingContainer}
        >
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Loading system metrics...</Text>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.errorContainer}
        >
          <Ionicons name="alert-circle" size={64} color="#ffffff" />
          <Text style={styles.errorTitle}>Monitoring Error</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.background}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={['#ffffff']}
              tintColor="#ffffff"
            />
          }
        >
          {/* Header */}
          <View style={styles.header}>
            <Ionicons name="speedometer" size={32} color="#ffffff" />
            <Text style={styles.title}>System Monitoring</Text>
          </View>

          {/* Health Score Card */}
          <View style={styles.card}>
            <View style={styles.healthScoreContainer}>
              <View style={styles.healthScoreCircle}>
                <Text style={[styles.healthScoreText, { color: getHealthScoreColor(healthScore) }]}>
                  {healthScore}
                </Text>
                <Text style={styles.healthScoreLabel}>Health Score</Text>
              </View>
              <View style={styles.healthScoreInfo}>
                <Text style={styles.healthScoreTitle}>System Health</Text>
                <Text style={styles.healthScoreDescription}>
                  {healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Good' : 'Needs Attention'}
                </Text>
                <View style={styles.healthIndicators}>
                  <View style={[styles.healthIndicator, { backgroundColor: getHealthScoreColor(healthScore) }]} />
                  <Text style={styles.healthIndicatorText}>
                    {healthScore >= 80 ? 'All systems running smoothly' : 
                     healthScore >= 60 ? 'Minor issues detected' : 
                     'Performance issues detected'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Performance Metrics */}
          {metrics && (
            <>
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Performance Metrics</Text>
                
                <View style={styles.metricsGrid}>
                  <View style={styles.metricItem}>
                    <Ionicons name="time" size={24} color="#667eea" />
                    <Text style={styles.metricValue}>{formatDuration(metrics.screenRenderTime)}</Text>
                    <Text style={styles.metricLabel}>Avg Render Time</Text>
                  </View>
                  
                  <View style={styles.metricItem}>
                    <Ionicons name="cloud" size={24} color="#667eea" />
                    <Text style={styles.metricValue}>{formatDuration(metrics.apiCallDuration)}</Text>
                    <Text style={styles.metricLabel}>Avg API Time</Text>
                  </View>
                  
                  <View style={styles.metricItem}>
                    <Ionicons name="hardware-chip" size={24} color="#667eea" />
                    <Text style={styles.metricValue}>{formatMemory(metrics.memoryUsage)}</Text>
                    <Text style={styles.metricLabel}>Memory Usage</Text>
                  </View>
                  
                  <View style={styles.metricItem}>
                    <Ionicons name="warning" size={24} color="#f44336" />
                    <Text style={styles.metricValue}>{metrics.crashReports.length}</Text>
                    <Text style={styles.metricLabel}>Recent Crashes</Text>
                  </View>
                </View>
              </View>

              {/* Usage Insights */}
              {usageInsights && (
                <View style={styles.card}>
                  <Text style={styles.sectionTitle}>Usage Insights</Text>
                  
                  <View style={styles.insightItem}>
                    <Ionicons name="star" size={20} color="#667eea" />
                    <View style={styles.insightContent}>
                      <Text style={styles.insightLabel}>Most Used Feature</Text>
                      <Text style={styles.insightValue}>{usageInsights.mostUsedFeature}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.insightItem}>
                    <Ionicons name="analytics" size={20} color="#667eea" />
                    <View style={styles.insightContent}>
                      <Text style={styles.insightLabel}>Total Sessions</Text>
                      <Text style={styles.insightValue}>{usageInsights.totalSessions}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.insightItem}>
                    <Ionicons name="time" size={20} color="#667eea" />
                    <View style={styles.insightContent}>
                      <Text style={styles.insightLabel}>Avg Session Duration</Text>
                      <Text style={styles.insightValue}>{formatDuration(usageInsights.averageSessionDuration)}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.insightItem}>
                    <Ionicons name="pulse" size={20} color="#667eea" />
                    <View style={styles.insightContent}>
                      <Text style={styles.insightLabel}>Total Actions</Text>
                      <Text style={styles.insightValue}>{usageInsights.totalActions}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.insightItem}>
                    <Ionicons name="bug" size={20} color="#f44336" />
                    <View style={styles.insightContent}>
                      <Text style={styles.insightLabel}>Error Rate</Text>
                      <Text style={styles.insightValue}>{usageInsights.crashRate.toFixed(2)}%</Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Feature Usage */}
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Feature Usage</Text>
                
                <View style={styles.featureList}>
                  {Object.entries(metrics.featureUsage).map(([feature, count]) => (
                    <View key={feature} style={styles.featureItem}>
                      <Text style={styles.featureName}>
                        {feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </Text>
                      <View style={styles.featureCount}>
                        <Text style={styles.featureCountText}>{count}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              {/* Recent Sessions */}
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Recent Sessions</Text>
                
                {metrics.userSessions.slice(-5).reverse().map((session, index) => (
                  <View key={session.sessionId} style={styles.sessionItem}>
                    <View style={styles.sessionHeader}>
                      <Text style={styles.sessionId}>Session {index + 1}</Text>
                      <Text style={styles.sessionDuration}>{formatDuration(session.duration)}</Text>
                    </View>
                    <Text style={styles.sessionDetails}>
                      {session.screensViewed.length} screens • {session.actionsPerformed} actions
                      {session.errorsEncountered > 0 && ` • ${session.errorsEncountered} errors`}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.clearButton]}
              onPress={handleClearOldData}
              disabled={isClearing}
            >
              {isClearing ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <Ionicons name="trash" size={20} color="#ffffff" />
                  <Text style={styles.actionButtonText}>Clear Old Data</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 18,
    marginTop: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.9,
  },
  retryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  healthScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  healthScoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  healthScoreText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  healthScoreLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  healthScoreInfo: {
    flex: 1,
  },
  healthScoreTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  healthScoreDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  healthIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  healthIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  healthIndicatorText: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  insightContent: {
    flex: 1,
    marginLeft: 12,
  },
  insightLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  insightValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  featureList: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  featureName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  featureCount: {
    backgroundColor: '#667eea',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 40,
    alignItems: 'center',
  },
  featureCountText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  sessionItem: {
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sessionId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  sessionDuration: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '500',
  },
  sessionDetails: {
    fontSize: 12,
    color: '#666',
  },
  actionContainer: {
    marginTop: 8,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  clearButton: {
    backgroundColor: '#f44336',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default React.memo(SystemMonitoringScreen);

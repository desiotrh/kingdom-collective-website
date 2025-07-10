import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Platform,
} from 'react-native';
import { useDualMode } from '../contexts/DualModeContext';
import { KingdomColors } from '../constants/KingdomColors';
import {
  AdminDashboardData,
  SafetyMetrics,
  Flag,
  ModerationAlert,
  AdminAction,
} from '../types/admin';
import { AdminService } from '../services/AdminService';

interface AdminDashboardScreenProps {
  navigation: any;
}

const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({ navigation }) => {
  const { isDualMode, currentMode } = useDualMode();
  const isFaithMode = currentMode === 'faith';
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d');

  const currentColors = isDualMode 
    ? (isFaithMode ? KingdomColors.faith : KingdomColors.encouragement)
    : KingdomColors.default;

  useEffect(() => {
    loadDashboardData();
  }, [selectedTimeRange]);

  const loadDashboardData = async () => {
    try {
      // Mock dashboard data
      const mockDashboardData: AdminDashboardData = {
        metrics: {
          totalUsers: 15247,
          activeUsers: 8932,
          bannedUsers: 34,
          suspendedUsers: 89,
          totalContent: 45821,
          flaggedContent: 127,
          removedContent: 892,
          pendingReviews: 23,
          avgResponseTime: 2.4,
          communityHealthScore: 87,
        },
        recentFlags: [
          {
            id: '1',
            reporterId: 'user1',
            reporterName: 'John Doe',
            targetId: 'content1',
            targetType: 'content',
            reason: 'inappropriateContent',
            description: 'Content contains inappropriate language',
            severity: 'medium',
            status: 'pending',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          },
        ],
        pendingReviews: [],
        recentActions: [
          {
            id: '1',
            adminId: 'admin1',
            adminName: 'Admin User',
            action: 'contentRemoved',
            targetId: 'content3',
            targetType: 'content',
            reason: 'Violated community guidelines',
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          },
        ],
        alerts: [
          {
            id: '1',
            type: 'highFlagVolume',
            priority: 'high',
            title: 'High Flag Volume Detected',
            description: 'Unusual spike in content flags in the last hour',
            actionRequired: true,
            createdAt: new Date(Date.now() - 30 * 60 * 1000),
            isRead: false,
          },
        ],
        trendsData: {
          userGrowth: [],
          contentVolume: [],
          flagTrends: [],
          communityHealth: [],
        },
      };
      
      setDashboardData(mockDashboardData);
    } catch (error) {
      console.error('Error loading admin dashboard:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const handleQuickAction = async (action: string, targetId?: string) => {
    try {
      switch (action) {
        case 'reviewFlags':
          navigation.navigate('FlagReview');
          break;
        case 'moderateContent':
          navigation.navigate('ContentModeration');
          break;
        case 'manageUsers':
          navigation.navigate('UserManagement');
          break;
        case 'viewAlerts':
          navigation.navigate('ModerationAlerts');
          break;
        case 'settings':
          navigation.navigate('AdminSettings');
          break;
        case 'monitoring':
          navigation.navigate('AdminMonitoring');
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error performing quick action:', error);
      Alert.alert('Error', 'Failed to perform action');
    }
  };

  const renderMetricCard = (
    title: string,
    value: number | string,
    subtitle?: string,
    trend?: number,
    isAlert?: boolean
  ) => (
    <View style={[styles.metricCard, { borderColor: currentColors.border }]}>
      <View style={styles.metricHeader}>
        <Text style={[styles.metricTitle, { color: currentColors.text }]}>{title}</Text>
        {isAlert && (
          <View style={[styles.alertBadge, { backgroundColor: currentColors.error }]}>
            <Text style={styles.alertText}>!</Text>
          </View>
        )}
      </View>
      <Text style={[styles.metricValue, { color: currentColors.primary }]}>{value}</Text>
      {subtitle && (
        <Text style={[styles.metricSubtitle, { color: currentColors.textSecondary }]}>
          {subtitle}
        </Text>
      )}
      {trend !== undefined && (
        <Text style={[
          styles.trendText,
          { color: trend >= 0 ? currentColors.success : currentColors.error }
        ]}>
          {trend >= 0 ? '↗' : '↘'} {Math.abs(trend)}%
        </Text>
      )}
    </View>
  );

  const renderQuickActionCard = (title: string, description: string, action: string, icon: string) => (
    <TouchableOpacity
      style={[styles.actionCard, { borderColor: currentColors.border }]}
      onPress={() => handleQuickAction(action)}
    >
      <View style={styles.actionHeader}>
        <Text style={[styles.actionIcon, { color: currentColors.primary }]}>{icon}</Text>
        <Text style={[styles.actionTitle, { color: currentColors.text }]}>{title}</Text>
      </View>
      <Text style={[styles.actionDescription, { color: currentColors.textSecondary }]}>
        {description}
      </Text>
    </TouchableOpacity>
  );

  const renderRecentItem = (item: Flag | AdminAction | ModerationAlert, type: string) => (
    <View key={item.id} style={[styles.recentItem, { borderColor: currentColors.border }]}>
      <View style={styles.recentItemHeader}>
        <Text style={[styles.recentItemType, { color: currentColors.primary }]}>{type}</Text>
        <Text style={[styles.recentItemTime, { color: currentColors.textSecondary }]}>
          {new Date(
            (item as Flag | ModerationAlert).createdAt || 
            (item as AdminAction).timestamp
          ).toLocaleDateString()}
        </Text>
      </View>
      <Text style={[styles.recentItemTitle, { color: currentColors.text }]} numberOfLines={2}>
        {(item as any).reason || (item as any).title || `${type} Action`}
      </Text>
      {(item as Flag).severity && (
        <View style={[
          styles.severityBadge,
          { backgroundColor: getSeverityColor((item as Flag).severity) }
        ]}>
          <Text style={styles.severityText}>{(item as Flag).severity.toUpperCase()}</Text>
        </View>
      )}
    </View>
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return currentColors.error;
      case 'high': return '#FF6B35';
      case 'medium': return '#FFA500';
      case 'low': return currentColors.warning;
      default: return currentColors.textSecondary;
    }
  };

  const renderTimeRangeSelector = () => (
    <View style={styles.timeRangeContainer}>
      {(['24h', '7d', '30d', '90d'] as const).map((range) => (
        <TouchableOpacity
          key={range}
          style={[
            styles.timeRangeButton,
            {
              backgroundColor: selectedTimeRange === range ? currentColors.primary : 'transparent',
              borderColor: currentColors.primary,
            }
          ]}
          onPress={() => setSelectedTimeRange(range)}
        >
          <Text style={[
            styles.timeRangeText,
            { color: selectedTimeRange === range ? currentColors.surface : currentColors.primary }
          ]}>
            {range}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer, { backgroundColor: currentColors.background }]}>
        <Text style={[styles.loadingText, { color: currentColors.text }]}>Loading Admin Dashboard...</Text>
      </View>
    );
  }

  if (!dashboardData) {
    return (
      <View style={[styles.container, styles.errorContainer, { backgroundColor: currentColors.background }]}>
        <Text style={[styles.errorText, { color: currentColors.error }]}>Failed to load dashboard data</Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: currentColors.primary }]}
          onPress={loadDashboardData}
        >
          <Text style={[styles.retryButtonText, { color: currentColors.surface }]}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { metrics, recentFlags, recentActions, alerts } = dashboardData;

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: currentColors.text }]}>
            {isDualMode && isFaithMode ? '✝️ Kingdom Admin' : '💪 Admin Dashboard'}
          </Text>
          <Text style={[styles.subtitle, { color: currentColors.textSecondary }]}>
            Community Safety & Management
          </Text>
        </View>

        {/* Time Range Selector */}
        {renderTimeRangeSelector()}

        {/* Key Metrics */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentColors.text }]}>
            Community Health Overview
          </Text>
          <View style={styles.metricsGrid}>
            {renderMetricCard(
              'Active Users',
              metrics.activeUsers.toLocaleString(),
              `${metrics.totalUsers.toLocaleString()} total`,
              5.2
            )}
            {renderMetricCard(
              'Community Score',
              `${metrics.communityHealthScore}/100`,
              'Health Rating',
              metrics.communityHealthScore >= 80 ? 2.1 : -1.3,
              metrics.communityHealthScore < 70
            )}
            {renderMetricCard(
              'Pending Reviews',
              metrics.pendingReviews.toString(),
              'Requiring attention',
              undefined,
              metrics.pendingReviews > 10
            )}
            {renderMetricCard(
              'Response Time',
              `${metrics.avgResponseTime}h`,
              'Average',
              -15.5
            )}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentColors.text }]}>
            Quick Actions
          </Text>
          <View style={styles.actionsGrid}>
            {renderQuickActionCard(
              'Review Flags',
              `${recentFlags.length} pending flags`,
              'reviewFlags',
              '🚩'
            )}
            {renderQuickActionCard(
              'Content Moderation',
              'Review flagged content',
              'moderateContent',
              '📋'
            )}
            {renderQuickActionCard(
              'User Management',
              'Manage user accounts',
              'manageUsers',
              '👥'
            )}
            {renderQuickActionCard(
              'Safety Settings',
              'Configure moderation',
              'settings',
              '⚙️'
            )}
            {renderQuickActionCard(
              'System Monitoring',
              'Real-time system health',
              'monitoring',
              '📊'
            )}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentColors.text }]}>
            Recent Activity
          </Text>
          
          {/* Recent Flags */}
          <View style={styles.subsection}>
            <Text style={[styles.subsectionTitle, { color: currentColors.textSecondary }]}>
              Recent Flags ({recentFlags.length})
            </Text>
            {recentFlags.slice(0, 3).map(flag => renderRecentItem(flag, 'Flag'))}
          </View>

          {/* Recent Actions */}
          <View style={styles.subsection}>
            <Text style={[styles.subsectionTitle, { color: currentColors.textSecondary }]}>
              Recent Admin Actions ({recentActions.length})
            </Text>
            {recentActions.slice(0, 3).map(action => renderRecentItem(action, 'Action'))}
          </View>

          {/* Alerts */}
          {alerts.length > 0 && (
            <View style={styles.subsection}>
              <Text style={[styles.subsectionTitle, { color: currentColors.error }]}>
                Active Alerts ({alerts.length})
              </Text>
              {alerts.slice(0, 3).map(alert => renderRecentItem(alert, 'Alert'))}
            </View>
          )}
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollView: {
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
  },
  timeRangeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  timeRangeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  timeRangeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  subsection: {
    marginBottom: 20,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricSubtitle: {
    fontSize: 12,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  alertBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  actionDescription: {
    fontSize: 14,
  },
  recentItem: {
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  recentItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recentItemType: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  recentItemTime: {
    fontSize: 12,
  },
  recentItemTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  severityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 50,
  },
});

export default React.memo(AdminDashboardScreen);

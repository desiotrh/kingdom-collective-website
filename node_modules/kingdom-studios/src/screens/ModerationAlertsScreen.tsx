import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDualMode } from '../contexts/DualModeContext';
import { KingdomColors } from '../constants/KingdomColors';
import { ModerationAlert, AlertPriority, AlertType } from '../types/admin';
// import { AdminService } from '../services/AdminService'; // Commented until proper integration

interface ModerationAlertsScreenProps {
  navigation: any;
}

export const ModerationAlertsScreen: React.FC<ModerationAlertsScreenProps> = ({ navigation }) => {
  const { currentMode } = useDualMode();
  const [alerts, setAlerts] = useState<ModerationAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const colors = KingdomColors[currentMode];

  // Mock data for development
  const mockAlerts: ModerationAlert[] = [
    {
      id: '1',
      type: 'contentViolation',
      priority: 'high',
      title: 'Inappropriate Content Detected',
      description: 'AI detected potentially harmful content in testimony post',
      createdAt: new Date('2024-01-20T10:30:00Z'),
      isRead: false,
      actionRequired: true,
      relatedUserId: 'user123',
      relatedContentId: 'content456',
      metadata: {
        confidenceScore: 0.87,
        violationType: 'harassment',
      },
    },
    {
      id: '2',
      type: 'massReporting',
      priority: 'high',
      title: 'Mass Reporting Event',
      description: 'User received 15+ reports in the last hour',
      createdAt: new Date('2024-01-20T09:15:00Z'),
      isRead: false,
      actionRequired: true,
      relatedUserId: 'user789',
      metadata: {
        reportCount: 18,
        timeframe: '1 hour',
      },
    },
    {
      id: '3',
      type: 'suspiciousActivity',
      priority: 'medium',
      title: 'Unusual Account Activity',
      description: 'Account shows signs of potential bot behavior',
      createdAt: new Date('2024-01-20T08:45:00Z'),
      isRead: true,
      actionRequired: false,
      relatedUserId: 'user456',
      metadata: {
        activityScore: 0.23,
        indicators: ['rapid_posting', 'generic_comments'],
      },
    },
    {
      id: '4',
      type: 'systemAlert',
      priority: 'low',
      title: 'Content Review Backlog',
      description: 'Review queue has grown beyond normal threshold',
      createdAt: new Date('2024-01-20T08:00:00Z'),
      isRead: true,
      actionRequired: false,
      metadata: {
        queueSize: 47,
        threshold: 30,
      },
    },
  ];

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual AdminService call
      // const alertsData = await AdminService.getModerationAlerts();
      setAlerts(mockAlerts);
    } catch (error) {
      Alert.alert(
        currentMode === 'faith' ? 'Prayer Needed' : 'Error',
        currentMode === 'faith' 
          ? 'Lord, we need Your guidance in loading alerts. Please try again.'
          : 'Failed to load moderation alerts. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAlerts();
    setRefreshing(false);
  };

  const markAsRead = async (alertId: string) => {
    try {
      // TODO: Replace with actual AdminService call
      // await AdminService.markAlertAsRead(alertId);
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId ? { ...alert, isRead: true } : alert
      ));
    } catch (error) {
      Alert.alert('Error', 'Failed to mark alert as read');
    }
  };

  const handleAlertAction = (alert: ModerationAlert) => {
    if (alert.relatedContentId) {
      navigation.navigate('ContentModeration', { contentId: alert.relatedContentId });
    } else if (alert.relatedUserId) {
      navigation.navigate('UserManagement', { userId: alert.relatedUserId });
    }
  };

  const getPriorityColor = (priority: AlertPriority) => {
    switch (priority) {
      case 'high':
        return '#FF4444';
      case 'medium':
        return '#FF8800';
      case 'low':
        return '#4CAF50';
      default:
        return colors.text;
    }
  };

  const getAlertIcon = (type: AlertType) => {
    switch (type) {
      case 'contentViolation':
        return 'warning';
      case 'massReporting':
        return 'flag';
      case 'suspiciousActivity':
        return 'eye';
      case 'systemAlert':
        return 'information-circle';
      default:
        return 'alert-circle';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const renderAlert = (alert: ModerationAlert) => (
    <TouchableOpacity
      key={alert.id}
      style={[
        styles.alertCard,
        { 
          backgroundColor: colors.surface,
          borderLeftColor: getPriorityColor(alert.priority),
          opacity: alert.isRead ? 0.7 : 1,
        }
      ]}
      onPress={() => {
        if (!alert.isRead) markAsRead(alert.id);
        if (alert.actionRequired) handleAlertAction(alert);
      }}
    >
      <View style={styles.alertHeader}>
        <View style={styles.alertTitleRow}>
          <Ionicons
            name={getAlertIcon(alert.type) as any}
            size={20}
            color={getPriorityColor(alert.priority)}
          />
          <Text style={[styles.alertTitle, { color: colors.text }]}>
            {alert.title}
          </Text>
          {!alert.isRead && (
            <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
          )}
        </View>
        <Text style={[styles.alertTime, { color: colors.textSecondary }]}>
          {formatTimeAgo(alert.createdAt)}
        </Text>
      </View>

      <Text style={[styles.alertDescription, { color: colors.textSecondary }]}>
        {alert.description}
      </Text>

      {alert.actionRequired && (
        <View style={[styles.actionBadge, { backgroundColor: colors.primary }]}>
          <Text style={[styles.actionText, { color: colors.surface }]}>
            Action Required
          </Text>
        </View>
      )}

      <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(alert.priority) }]}>
        <Text style={[styles.priorityText, { color: '#FFFFFF' }]}>
          {alert.priority.toUpperCase()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {currentMode === 'faith' ? 'Divine Alerts' : 'Moderation Alerts'}
        </Text>
        <TouchableOpacity style={styles.headerAction} onPress={onRefresh}>
          <Ionicons name="refresh" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <View style={styles.alertsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {currentMode === 'faith' ? 'Recent Divine Alerts' : 'Recent Alerts'}
          </Text>
          
          {alerts.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="checkmark-circle" size={64} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {currentMode === 'faith' 
                  ? 'All is well in His Kingdom! No alerts at this time.'
                  : 'No alerts at this time. Great job keeping the community safe!'
                }
              </Text>
            </View>
          ) : (
            alerts.map(renderAlert)
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
  },
  headerAction: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  alertsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  alertCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  alertTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  alertTime: {
    fontSize: 12,
  },
  alertDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  actionBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  priorityBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 24,
  },
});

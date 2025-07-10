import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDualMode } from '../contexts/DualModeContext';
import { KingdomColors } from '../constants/KingdomColors';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'content' | 'engagement' | 'community' | 'spiritual' | 'system' | 'collaboration';
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
}

interface NotificationSettings {
  id: string;
  title: string;
  description: string;
  category: 'content' | 'engagement' | 'community' | 'spiritual' | 'system' | 'collaboration';
  enabled: boolean;
  icon: string;
  faithModeTitle?: string;
  faithModeDescription?: string;
}

const NotificationCenterScreen: React.FC = () => {
  const { currentMode } = useDualMode();
  const colors = currentMode === 'faith' ? KingdomColors.faith : KingdomColors.encouragement;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings[]>([]);
  const [activeTab, setActiveTab] = useState<'notifications' | 'settings'>('notifications');

  useEffect(() => {
    loadNotifications();
    loadSettings();
  }, [currentMode]);

  const loadNotifications = () => {
    const mockNotifications: Notification[] = currentMode === 'faith' ? [
      {
        id: '1',
        title: 'Daily Scripture Posted',
        message: 'Your daily scripture verse has been automatically shared across platforms 🙏',
        type: 'content',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        isRead: false,
        priority: 'medium',
      },
      {
        id: '2',
        title: 'Prayer Request Response',
        message: 'Sarah responded to your prayer request in The Forge community',
        type: 'community',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        isRead: false,
        priority: 'high',
      },
      {
        id: '3',
        title: 'Kingdom Engagement Milestone',
        message: 'Praise God! Your faith-based content reached 1,000 souls this week ✨',
        type: 'engagement',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        isRead: true,
        priority: 'high',
      },
      {
        id: '4',
        title: 'Team Collaboration Invite',
        message: 'Michael invited you to collaborate on "Kingdom Business Launch" project',
        type: 'collaboration',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        isRead: false,
        priority: 'high',
      },
      {
        id: '5',
        title: 'Spiritual Growth Reminder',
        message: 'Time for your daily devotional and business planning session 📖',
        type: 'spiritual',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        isRead: true,
        priority: 'medium',
      },
    ] : [
      {
        id: '1',
        title: 'Content Performance Update',
        message: 'Your motivational post gained 500+ engagements in the last hour! 🚀',
        type: 'engagement',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        isRead: false,
        priority: 'high',
      },
      {
        id: '2',
        title: 'Team Member Added',
        message: 'Emma joined your content creation team and is ready to collaborate',
        type: 'collaboration',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        isRead: false,
        priority: 'medium',
      },
      {
        id: '3',
        title: 'Scheduled Content Ready',
        message: 'Your 5 PM Instagram post is ready to publish automatically',
        type: 'content',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        isRead: true,
        priority: 'low',
      },
      {
        id: '4',
        title: 'Community Highlight',
        message: 'Your success story was featured in the creator spotlight!',
        type: 'community',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        isRead: true,
        priority: 'medium',
      },
    ];

    setNotifications(mockNotifications);
  };

  const loadSettings = () => {
    const mockSettings: NotificationSettings[] = [
      {
        id: 'content_published',
        title: 'Content Published',
        description: 'When your scheduled content goes live',
        faithModeTitle: 'Kingdom Content Shared',
        faithModeDescription: 'When your faith-based content blesses others',
        category: 'content',
        enabled: true,
        icon: '📤',
      },
      {
        id: 'engagement_milestones',
        title: 'Engagement Milestones',
        description: 'Follower growth and interaction achievements',
        faithModeTitle: 'Souls Reached Milestones',
        faithModeDescription: 'When your ministry touches more hearts',
        category: 'engagement',
        enabled: true,
        icon: '🎯',
      },
      {
        id: 'community_activity',
        title: 'Community Activity',
        description: 'New messages and interactions in The Forge',
        faithModeTitle: 'Fellowship Updates',
        faithModeDescription: 'When brothers and sisters connect in The Forge',
        category: 'community',
        enabled: true,
        icon: '👥',
      },
      {
        id: 'collaboration_invites',
        title: 'Team Collaboration',
        description: 'Team invites and project updates',
        faithModeTitle: 'Kingdom Partnerships',
        faithModeDescription: 'Collaborative ministry opportunities',
        category: 'collaboration',
        enabled: true,
        icon: '🤝',
      },
      {
        id: 'spiritual_reminders',
        title: 'Daily Reminders',
        description: 'Productivity and goal reminders',
        faithModeTitle: 'Spiritual Growth Reminders',
        faithModeDescription: 'Daily devotions and prayer prompts',
        category: 'spiritual',
        enabled: currentMode === 'faith',
        icon: '🙏',
      },
      {
        id: 'system_updates',
        title: 'System Updates',
        description: 'App updates and maintenance notifications',
        category: 'system',
        enabled: true,
        icon: '🔧',
      },
    ];

    setSettings(mockSettings);
  };

  const getCurrentPrompt = () => {
    const faithPrompts = [
      "🔔 Stay connected to God's work through timely updates",
      "✨ Never miss a Kingdom moment or divine appointment",
      "🙏 Let notifications guide your spiritual productivity",
      "💝 Stay blessed with updates that matter to your ministry",
    ];

    const encouragementPrompts = [
      "🚀 Stay on top of your success with smart notifications",
      "💪 Never miss an opportunity to grow and thrive",
      "🌟 Keep your momentum going with timely updates",
      "⚡ Turn notifications into your competitive advantage",
    ];

    const prompts = currentMode === 'faith' ? faithPrompts : encouragementPrompts;
    return prompts[Math.floor(Math.random() * prompts.length)];
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isRead: true }
        : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));
    Alert.alert('Success', 'All notifications marked as read');
  };

  const clearAllNotifications = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: () => setNotifications([])
        },
      ]
    );
  };

  const toggleNotificationSetting = (settingId: string) => {
    setSettings(prev => prev.map(setting => 
      setting.id === settingId 
        ? { ...setting, enabled: !setting.enabled }
        : setting
    ));
  };

  const testNotification = () => {
    Alert.alert(
      'Test Notification',
      currentMode === 'faith' 
        ? 'Kingdom notification system is working perfectly! 🙏'
        : 'Notification system is ready to keep you on track! 🚀'
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return colors.error;
      case 'medium': return colors.warning;
      case 'low': return colors.textSecondary;
      default: return colors.textSecondary;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'content': return '📝';
      case 'engagement': return '❤️';
      case 'community': return '👥';
      case 'spiritual': return '🙏';
      case 'collaboration': return '🤝';
      case 'system': return '⚙️';
      default: return '🔔';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - timestamp.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return timestamp.toLocaleDateString();
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        { 
          backgroundColor: colors.surface,
          borderLeftColor: getPriorityColor(item.priority),
          opacity: item.isRead ? 0.7 : 1,
        }
      ]}
      onPress={() => markAsRead(item.id)}
    >
      <View style={styles.notificationHeader}>
        <View style={styles.notificationTitleRow}>
          <Text style={styles.typeIcon}>{getTypeIcon(item.type)}</Text>
          <Text style={[styles.notificationTitle, { color: colors.text }]}>
            {item.title}
          </Text>
          {!item.isRead && (
            <View style={[styles.unreadDot, { backgroundColor: colors.accent }]} />
          )}
        </View>
        <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
          {formatTimeAgo(item.timestamp)}
        </Text>
      </View>
      <Text style={[styles.notificationMessage, { color: colors.textSecondary }]}>
        {item.message}
      </Text>
    </TouchableOpacity>
  );

  const renderSetting = ({ item }: { item: NotificationSettings }) => (
    <View style={[styles.settingCard, { backgroundColor: colors.surface }]}>
      <View style={styles.settingInfo}>
        <View style={styles.settingTitleRow}>
          <Text style={styles.settingIcon}>{item.icon}</Text>
          <Text style={[styles.settingTitle, { color: colors.text }]}>
            {currentMode === 'faith' && item.faithModeTitle ? item.faithModeTitle : item.title}
          </Text>
        </View>
        <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
          {currentMode === 'faith' && item.faithModeDescription ? item.faithModeDescription : item.description}
        </Text>
      </View>
      <Switch
        value={item.enabled}
        onValueChange={() => toggleNotificationSetting(item.id)}
        trackColor={{ false: colors.border, true: colors.accent + '50' }}
        thumbColor={item.enabled ? colors.accent : colors.textSecondary}
      />
    </View>
  );

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          {currentMode === 'faith' ? 'Kingdom Notifications' : 'Notification Center'}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {getCurrentPrompt()}
        </Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'notifications' && [styles.activeTab, { backgroundColor: colors.accent }]
          ]}
          onPress={() => setActiveTab('notifications')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'notifications' ? styles.activeTabText : { color: colors.textSecondary }
          ]}>
            🔔 Notifications {unreadCount > 0 && `(${unreadCount})`}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'settings' && [styles.activeTab, { backgroundColor: colors.accent }]
          ]}
          onPress={() => setActiveTab('settings')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'settings' ? styles.activeTabText : { color: colors.textSecondary }
          ]}>
            ⚙️ Settings
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'notifications' ? (
        <View style={styles.content}>
          {/* Action Bar */}
          {notifications.length > 0 && (
            <View style={styles.actionBar}>
              <TouchableOpacity
                style={[styles.actionButton, { borderColor: colors.accent }]}
                onPress={markAllAsRead}
              >
                <Text style={[styles.actionButtonText, { color: colors.accent }]}>
                  Mark All Read
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { borderColor: colors.error }]}
                onPress={clearAllNotifications}
              >
                <Text style={[styles.actionButtonText, { color: colors.error }]}>
                  Clear All
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Notifications List */}
          <FlatList
            data={notifications}
            renderItem={renderNotification}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.notificationsList}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateIcon}>🔔</Text>
                <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
                  No Notifications
                </Text>
                <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                  {currentMode === 'faith' 
                    ? "God's timing is perfect - you're all caught up!"
                    : "You're all caught up! Keep being awesome."}
                </Text>
              </View>
            }
          />
        </View>
      ) : (
        <View style={styles.content}>
          {/* Test Button */}
          <TouchableOpacity
            style={[styles.testButton, { backgroundColor: colors.accent }]}
            onPress={testNotification}
          >
            <Text style={styles.testButtonText}>Test Notifications</Text>
          </TouchableOpacity>

          {/* Settings List */}
          <FlatList
            data={settings}
            renderItem={renderSetting}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.settingsList}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

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
    fontStyle: 'italic',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeTab: {
    // backgroundColor applied dynamically
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  actionBar: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  notificationsList: {
    gap: 12,
    paddingBottom: 20,
  },
  notificationCard: {
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  notificationHeader: {
    marginBottom: 8,
  },
  notificationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  typeIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  timestamp: {
    fontSize: 12,
  },
  notificationMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
  settingsList: {
    gap: 12,
    paddingBottom: 20,
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  settingIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  testButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default React.memo(NotificationCenterScreen);

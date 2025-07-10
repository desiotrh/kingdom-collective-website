import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useNotifications, useNotificationPermissions } from '../hooks/useNotifications';
import { useAuth } from '../contexts/FirebaseAuthContext';

/**
 * 🔔 NOTIFICATION SETTINGS SCREEN
 * Allows users to configure their notification preferences
 */

interface NotificationPreference {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  category: 'ai' | 'social' | 'products' | 'mentorship' | 'general';
}

export const NotificationSettingsScreen: React.FC = () => {
  const { user } = useAuth();
  const {
    expoPushToken,
    scheduledReminders,
    sendNotification,
    isLoading,
    error,
  } = useNotifications();
  
  const {
    permissionStatus,
    isChecking,
    requestPermissions,
    isGranted,
    canAskAgain,
  } = useNotificationPermissions();

  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    {
      id: 'ai_generation_complete',
      title: 'AI Content Ready',
      description: 'Get notified when your AI-generated content is ready',
      enabled: true,
      category: 'ai',
    },
    {
      id: 'ai_usage_warnings',
      title: 'Usage Limit Warnings',
      description: 'Alerts when approaching your tier limits',
      enabled: true,
      category: 'ai',
    },
    {
      id: 'post_scheduled',
      title: 'Post Scheduled',
      description: 'Confirmation when posts are scheduled successfully',
      enabled: true,
      category: 'social',
    },
    {
      id: 'post_published',
      title: 'Post Published',
      description: 'Notification when scheduled posts go live',
      enabled: false,
      category: 'social',
    },
    {
      id: 'product_sold',
      title: 'Product Sales',
      description: 'Instant alerts for new sales and purchases',
      enabled: true,
      category: 'products',
    },
    {
      id: 'inventory_low',
      title: 'Low Inventory',
      description: 'Warnings when product inventory is running low',
      enabled: true,
      category: 'products',
    },
    {
      id: 'mentorship_requests',
      title: 'Mentorship Requests',
      description: 'New mentorship requests and responses',
      enabled: true,
      category: 'mentorship',
    },
    {
      id: 'mentorship_sessions',
      title: 'Session Reminders',
      description: 'Upcoming mentorship session reminders',
      enabled: true,
      category: 'mentorship',
    },
    {
      id: 'daily_inspiration',
      title: 'Daily Inspiration',
      description: 'Daily biblical inspiration and encouragement',
      enabled: false,
      category: 'general',
    },
    {
      id: 'weekly_analytics',
      title: 'Weekly Reports',
      description: 'Weekly performance and analytics summaries',
      enabled: true,
      category: 'general',
    },
  ]);

  const [quietHours, setQuietHours] = useState({
    enabled: false,
    startTime: '22:00',
    endTime: '08:00',
  });

  useEffect(() => {
    loadPreferences();
  }, [user]);

  const loadPreferences = async () => {
    // Load user preferences from AsyncStorage or Firestore
    // For now, using default preferences
  };

  const savePreferences = async () => {
    // Save preferences to AsyncStorage or Firestore
    // Implementation depends on your storage choice
  };

  const togglePreference = (preferenceId: string) => {
    setPreferences(prev => prev.map(pref => 
      pref.id === preferenceId 
        ? { ...pref, enabled: !pref.enabled }
        : pref
    ));
    savePreferences();
  };

  const handleRequestPermissions = async () => {
    try {
      const status = await requestPermissions();
      if (status.status === 'granted') {
        Alert.alert(
          '✅ Permissions Granted',
          'You will now receive push notifications from Kingdom Studios.'
        );
      } else {
        Alert.alert(
          '❌ Permissions Denied',
          'You won\'t receive push notifications. You can enable them in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => {
              // Open device settings (platform-specific implementation needed)
            }},
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to request notification permissions.');
    }
  };

  const testNotification = async () => {
    try {
      await sendNotification(
        '🔔 Test Notification',
        'This is a test notification from Kingdom Studios!',
        { type: 'test' }
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send test notification.');
    }
  };

  const renderPermissionSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>📱 Notification Permissions</Text>
      
      <View style={styles.permissionCard}>
        <View style={styles.permissionInfo}>
          <Text style={styles.permissionStatus}>
            Status: {isGranted ? '✅ Enabled' : '❌ Disabled'}
          </Text>
          <Text style={styles.permissionDescription}>
            {isGranted 
              ? 'You\'ll receive push notifications from Kingdom Studios.'
              : 'Enable notifications to stay updated with your content and sales.'
            }
          </Text>
          {expoPushToken && (
            <Text style={styles.tokenInfo}>
              Device Token: {expoPushToken.substring(0, 20)}...
            </Text>
          )}
        </View>
        
        <View style={styles.permissionActions}>
          {!isGranted && canAskAgain && (
            <TouchableOpacity
              style={styles.enableButton}
              onPress={handleRequestPermissions}
              disabled={isChecking}
            >
              <Text style={styles.enableButtonText}>
                {isChecking ? 'Checking...' : 'Enable Notifications'}
              </Text>
            </TouchableOpacity>
          )}
          
          {isGranted && (
            <TouchableOpacity
              style={styles.testButton}
              onPress={testNotification}
            >
              <Text style={styles.testButtonText}>Send Test</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  const renderPreferenceCategory = (category: string, title: string, icon: string) => {
    const categoryPrefs = preferences.filter(pref => pref.category === category);
    
    return (
      <View key={category} style={styles.section}>
        <Text style={styles.sectionTitle}>{icon} {title}</Text>
        
        {categoryPrefs.map(preference => (
          <View key={preference.id} style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceTitle}>{preference.title}</Text>
              <Text style={styles.preferenceDescription}>{preference.description}</Text>
            </View>
            <Switch
              value={preference.enabled}
              onValueChange={() => togglePreference(preference.id)}
              trackColor={{ false: '#374151', true: '#F97316' }}
              thumbColor={preference.enabled ? '#FFFFFF' : '#9CA3AF'}
              ios_backgroundColor="#374151"
            />
          </View>
        ))}
      </View>
    );
  };

  const renderQuietHours = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>🌙 Quiet Hours</Text>
      
      <View style={styles.preferenceItem}>
        <View style={styles.preferenceInfo}>
          <Text style={styles.preferenceTitle}>Do Not Disturb</Text>
          <Text style={styles.preferenceDescription}>
            Pause non-urgent notifications during specified hours
          </Text>
        </View>
        <Switch
          value={quietHours.enabled}
          onValueChange={(enabled) => setQuietHours(prev => ({ ...prev, enabled }))}
          trackColor={{ false: '#374151', true: '#F97316' }}
          thumbColor={quietHours.enabled ? '#FFFFFF' : '#9CA3AF'}
          ios_backgroundColor="#374151"
        />
      </View>
      
      {quietHours.enabled && (
        <View style={styles.timeSelectors}>
          <View style={styles.timeSelector}>
            <Text style={styles.timeLabel}>From</Text>
            <TouchableOpacity style={styles.timeButton}>
              <Text style={styles.timeText}>{quietHours.startTime}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.timeSelector}>
            <Text style={styles.timeLabel}>To</Text>
            <TouchableOpacity style={styles.timeButton}>
              <Text style={styles.timeText}>{quietHours.endTime}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  const renderScheduledReminders = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>⏰ Scheduled Reminders</Text>
      
      {scheduledReminders.length > 0 ? (
        scheduledReminders.map(reminder => (
          <View key={reminder.id} style={styles.reminderItem}>
            <View style={styles.reminderInfo}>
              <Text style={styles.reminderTitle}>{reminder.title}</Text>
              <Text style={styles.reminderTime}>
                {reminder.scheduledFor.toLocaleDateString()} at {reminder.scheduledFor.toLocaleTimeString()}
              </Text>
            </View>
            <Switch
              value={reminder.isActive}
              onValueChange={(isActive) => {
                // toggleReminder(reminder.id, isActive);
              }}
              trackColor={{ false: '#374151', true: '#F97316' }}
              thumbColor={reminder.isActive ? '#FFFFFF' : '#9CA3AF'}
              ios_backgroundColor="#374151"
            />
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>No scheduled reminders</Text>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.title}>🔔 Notification Settings</Text>
        <Text style={styles.subtitle}>
          Customize your notifications to stay informed without being overwhelmed
        </Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {renderPermissionSection()}
      {renderPreferenceCategory('ai', 'AI Content Generation', '🤖')}
      {renderPreferenceCategory('social', 'Social Media', '📱')}
      {renderPreferenceCategory('products', 'Products & Sales', '💰')}
      {renderPreferenceCategory('mentorship', 'Mentorship', '🤝')}
      {renderPreferenceCategory('general', 'General', '📢')}
      {renderQuietHours()}
      {renderScheduledReminders()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    lineHeight: 22,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  permissionCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  permissionInfo: {
    marginBottom: 16,
  },
  permissionStatus: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  permissionDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
    marginBottom: 8,
  },
  tokenInfo: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  permissionActions: {
    flexDirection: 'row' as const,
    gap: 12,
  },
  enableButton: {
    backgroundColor: '#F97316',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
  },
  enableButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600' as const,
    textAlign: 'center' as const,
  },
  testButton: {
    backgroundColor: '#374151',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  testButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500' as const,
  },
  preferenceItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  preferenceInfo: {
    flex: 1,
    marginRight: 16,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  preferenceDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 18,
  },
  timeSelectors: {
    flexDirection: 'row' as const,
    gap: 16,
    marginTop: 16,
  },
  timeSelector: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  timeButton: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center' as const,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500' as const,
  },
  reminderItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  reminderInfo: {
    flex: 1,
    marginRight: 16,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  reminderTime: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center' as const,
    padding: 20,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
  },
});

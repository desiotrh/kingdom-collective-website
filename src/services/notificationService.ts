import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface NotificationData {
  id: string;
  title: string;
  body: string;
  data?: any;
  scheduledFor?: Date;
  type: 'content_ready' | 'social_post_success' | 'email_sent' | 'collaboration_update' | 'analytics_report' | 'general';
  priority: 'default' | 'high' | 'max';
  category?: string;
}

export interface NotificationPreferences {
  enabled: boolean;
  contentReady: boolean;
  socialMedia: boolean;
  emailMarketing: boolean;
  collaboration: boolean;
  analytics: boolean;
  general: boolean;
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM format
    end: string; // HH:MM format
  };
}

class NotificationService {
  private isInitialized = false;
  private token: string | null = null;
  private preferences: NotificationPreferences = {
    enabled: true,
    contentReady: true,
    socialMedia: true,
    emailMarketing: true,
    collaboration: true,
    analytics: true,
    general: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00',
    },
  };

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Configure notification handling
      Notifications.setNotificationHandler({
        handleNotification: async (notification) => {
          const shouldShow = await this.shouldShowNotification(notification);
          return {
            shouldShowAlert: shouldShow,
            shouldPlaySound: shouldShow,
            shouldSetBadge: shouldShow,
            shouldShowBanner: shouldShow,
            shouldShowList: shouldShow,
          };
        },
      });

      // Load preferences
      await this.loadPreferences();

      // Request permissions
      await this.requestPermissions();

      // Get push token
      this.token = await this.getExpoPushToken();

      this.isInitialized = true;
      console.log('Notification service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize notification service:', error);
      throw error;
    }
  }

  private async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus === 'granted') {
        console.log('Notification permissions granted');
        return true;
      } else {
        console.warn('Notification permissions denied');
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  private async getExpoPushToken(): Promise<string | null> {
    try {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      const { data: token } = await Notifications.getExpoPushTokenAsync();
      console.log('Push token obtained:', token);
      return token;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }

  async sendLocalNotification(notification: Omit<NotificationData, 'id'>): Promise<string> {
    try {
      if (!this.preferences.enabled) {
        console.log('Notifications disabled');
        return '';
      }

      if (!this.shouldSendForType(notification.type)) {
        console.log(`Notifications disabled for type: ${notification.type}`);
        return '';
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          categoryIdentifier: notification.category,
        },
        trigger: notification.scheduledFor ? {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: Math.max(1, Math.floor((notification.scheduledFor.getTime() - Date.now()) / 1000))
        } : null,
      });

      console.log('Local notification scheduled:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('Error sending local notification:', error);
      throw error;
    }
  }

  async sendPushNotification(notification: NotificationData, userId?: string): Promise<void> {
    try {
      if (!this.token) {
        console.warn('No push token available');
        return;
      }

      // In a real app, this would send to your backend server
      // which would then send to Expo's push notification service
      const message = {
        to: this.token,
        sound: 'default',
        title: notification.title,
        body: notification.body,
        data: {
          ...notification.data,
          type: notification.type,
          notificationId: notification.id,
        },
        priority: notification.priority,
        categoryId: notification.category,
      };

      console.log('Push notification prepared:', message);
      // TODO: Send to backend service
    } catch (error) {
      console.error('Error sending push notification:', error);
      throw error;
    }
  }

  async scheduleNotification(notification: Omit<NotificationData, 'id'>, scheduledFor: Date): Promise<string> {
    const notificationWithSchedule = {
      ...notification,
      scheduledFor,
    };

    return this.sendLocalNotification(notificationWithSchedule);
  }

  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log('Notification cancelled:', notificationId);
    } catch (error) {
      console.error('Error cancelling notification:', error);
      throw error;
    }
  }

  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('All notifications cancelled');
    } catch (error) {
      console.error('Error cancelling all notifications:', error);
      throw error;
    }
  }

  async getPreferences(): Promise<NotificationPreferences> {
    return { ...this.preferences };
  }

  async updatePreferences(newPreferences: Partial<NotificationPreferences>): Promise<void> {
    try {
      this.preferences = { ...this.preferences, ...newPreferences };
      await AsyncStorage.setItem('notification_preferences', JSON.stringify(this.preferences));
      console.log('Notification preferences updated');
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  }

  private async loadPreferences(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('notification_preferences');
      if (stored) {
        this.preferences = { ...this.preferences, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Error loading notification preferences:', error);
    }
  }

  private shouldSendForType(type: NotificationData['type']): boolean {
    switch (type) {
      case 'content_ready':
        return this.preferences.contentReady;
      case 'social_post_success':
        return this.preferences.socialMedia;
      case 'email_sent':
        return this.preferences.emailMarketing;
      case 'collaboration_update':
        return this.preferences.collaboration;
      case 'analytics_report':
        return this.preferences.analytics;
      case 'general':
        return this.preferences.general;
      default:
        return this.preferences.general;
    }
  }

  private async shouldShowNotification(notification: any): Promise<boolean> {
    if (!this.preferences.enabled) return false;

    // Check quiet hours
    if (this.preferences.quietHours.enabled) {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      const start = this.preferences.quietHours.start;
      const end = this.preferences.quietHours.end;
      
      if (start > end) {
        // Quiet hours span midnight
        if (currentTime >= start || currentTime <= end) {
          return false;
        }
      } else {
        // Quiet hours within same day
        if (currentTime >= start && currentTime <= end) {
          return false;
        }
      }
    }

    return true;
  }

  private getPriority(priority: NotificationData['priority']): Notifications.AndroidImportance {
    switch (priority) {
      case 'max':
        return Notifications.AndroidImportance.MAX;
      case 'high':
        return Notifications.AndroidImportance.HIGH;
      case 'default':
      default:
        return Notifications.AndroidImportance.DEFAULT;
    }
  }

  // Convenience methods for common notifications
  async notifyContentReady(contentTitle: string, contentType: string): Promise<string> {
    return this.sendLocalNotification({
      title: 'Content Ready! 🎉',
      body: `Your ${contentType} "${contentTitle}" is ready for review`,
      type: 'content_ready',
      priority: 'high',
      data: { contentTitle, contentType },
    });
  }

  async notifySocialPostSuccess(platform: string, postTitle: string): Promise<string> {
    return this.sendLocalNotification({
      title: 'Post Published! 📱',
      body: `Successfully posted "${postTitle}" to ${platform}`,
      type: 'social_post_success',
      priority: 'default',
      data: { platform, postTitle },
    });
  }

  async notifyEmailSent(campaignName: string, recipientCount: number): Promise<string> {
    return this.sendLocalNotification({
      title: 'Email Campaign Sent! 📧',
      body: `"${campaignName}" sent to ${recipientCount} recipients`,
      type: 'email_sent',
      priority: 'default',
      data: { campaignName, recipientCount },
    });
  }

  async notifyCollaborationUpdate(projectName: string, updateType: string): Promise<string> {
    return this.sendLocalNotification({
      title: 'Team Update 👥',
      body: `${updateType} in project "${projectName}"`,
      type: 'collaboration_update',
      priority: 'default',
      data: { projectName, updateType },
    });
  }

  async notifyAnalyticsReport(reportType: string, insights: string): Promise<string> {
    return this.sendLocalNotification({
      title: 'Analytics Insights 📊',
      body: `New ${reportType}: ${insights}`,
      type: 'analytics_report',
      priority: 'default',
      data: { reportType, insights },
    });
  }

  public getPushToken(): string | null {
    return this.token;
  }

  isServiceInitialized(): boolean {
    return this.isInitialized;
  }
}

export const notificationService = new NotificationService();
export default notificationService;

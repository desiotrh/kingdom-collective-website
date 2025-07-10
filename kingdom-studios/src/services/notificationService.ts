import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationData {
  id: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  trigger?: {
    type: 'time' | 'interval';
    value: number | Date;
    repeats?: boolean;
  };
  categoryId?: string;
}

export interface ScheduledReminder {
  id: string;
  type: 'content_post' | 'product_sync' | 'analytics_review' | 'faith_encouragement' | 'custom';
  title: string;
  message: string;
  scheduledFor: Date;
  userId: string;
  isActive: boolean;
  metadata?: Record<string, any>;
}

class NotificationService {
  private static instance: NotificationService;
  private expoPushToken: string | null = null;
  private scheduledReminders: ScheduledReminder[] = [];

  private constructor() {
    this.initializeNotifications();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Initialize notification system
  private async initializeNotifications(): Promise<void> {
    try {
      // Register for push notifications if on a physical device
      if (Device.isDevice) {
        await this.registerForPushNotificationsAsync();
      }

      // Set up notification categories
      await this.setupNotificationCategories();

      // Load scheduled reminders
      await this.loadScheduledReminders();

      // Setup notification response listener
      this.setupNotificationListeners();
    } catch (error) {
      console.error('Notification initialization error:', error);
    }
  }

  // Public initialize method for external initialization
  async initialize(): Promise<void> {
    await this.initializeNotifications();
  }

  // Register for push notifications
  private async registerForPushNotificationsAsync(): Promise<void> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Push notification permission not granted');
        return;
      }

      // Get the Expo push token
      const token = (await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      })).data;

      this.expoPushToken = token;
      if (__DEV__) {
        console.log('Expo push token obtained successfully');
      }

      // Configure platform-specific settings
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('kingdom-studios', {
          name: 'Kingdom Studios',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#6B46C1', // Kingdom purple
          sound: 'default',
          enableVibrate: true,
        });
      }
    } catch (error) {
      console.error('Push notification registration error:', error);
    }
  }

  // Setup notification categories for interactive notifications
  private async setupNotificationCategories(): Promise<void> {
    await Notifications.setNotificationCategoryAsync('CONTENT_REMINDER', [
      {
        identifier: 'POST_NOW',
        buttonTitle: 'Post Now',
        options: { opensAppToForeground: true },
      },
      {
        identifier: 'RESCHEDULE',
        buttonTitle: 'Reschedule',
        options: { opensAppToForeground: true },
      },
    ]);

    await Notifications.setNotificationCategoryAsync('FAITH_ENCOURAGEMENT', [
      {
        identifier: 'READ_SCRIPTURE',
        buttonTitle: 'Read Scripture',
        options: { opensAppToForeground: true },
      },
      {
        identifier: 'SHARE_TESTIMONY',
        buttonTitle: 'Share Testimony',
        options: { opensAppToForeground: true },
      },
    ]);

    await Notifications.setNotificationCategoryAsync('ANALYTICS_REVIEW', [
      {
        identifier: 'VIEW_ANALYTICS',
        buttonTitle: 'View Analytics',
        options: { opensAppToForeground: true },
      },
      {
        identifier: 'OPTIMIZE_CONTENT',
        buttonTitle: 'Optimize Content',
        options: { opensAppToForeground: true },
      },
    ]);
  }

  // Setup notification response listeners
  private setupNotificationListeners(): void {
    // Handle notification responses
    Notifications.addNotificationResponseReceivedListener(response => {
      const { notification, actionIdentifier } = response;
      
      switch (actionIdentifier) {
        case 'POST_NOW':
          this.handlePostNowAction(notification.request.content.data);
          break;
        case 'RESCHEDULE':
          this.handleRescheduleAction(notification.request.content.data);
          break;
        case 'READ_SCRIPTURE':
          this.handleReadScriptureAction();
          break;
        case 'VIEW_ANALYTICS':
          this.handleViewAnalyticsAction();
          break;
        default:
          // Handle default notification tap
          this.handleDefaultNotificationTap(notification.request.content.data);
      }
    });

    // Handle notification received while app is in foreground
    Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received in foreground:', notification);
    });
  }

  // Schedule local notification
  async scheduleNotification(notificationData: NotificationData): Promise<string> {
    try {    // Configure trigger based on type
    let trigger: any = null;
    if (notificationData.trigger) {
      if (notificationData.trigger.type === 'time') {
        trigger = notificationData.trigger.value; // Date object
      } else {
        trigger = { seconds: notificationData.trigger.value as number };
      }
    }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notificationData.title,
          body: notificationData.body,
          data: notificationData.data || {},
          categoryIdentifier: notificationData.categoryId,
          sound: 'default',
        },
        trigger,
      });

      return notificationId;
    } catch (error) {
      console.error('Schedule notification error:', error);
      throw error;
    }
  }

  // Send local notification immediately
  async sendLocalNotification(notification: NotificationData): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: 'default',
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.error('Send local notification error:', error);
    }
  }

  // Schedule content posting reminder
  async scheduleContentReminder(
    contentTitle: string,
    scheduledTime: Date,
    platform: string,
    userId: string
  ): Promise<string> {
    const reminder: ScheduledReminder = {
      id: `content_${Date.now()}`,
      type: 'content_post',
      title: `Time to post: ${contentTitle}`,
      message: `Your content "${contentTitle}" is scheduled to post on ${platform}`,
      scheduledFor: scheduledTime,
      userId,
      isActive: true,
      metadata: { contentTitle, platform }
    };

    // Schedule 15 minutes before the actual post time
    const reminderTime = new Date(scheduledTime.getTime() - 15 * 60 * 1000);

    const notificationId = await this.scheduleNotification({
      id: reminder.id,
      title: reminder.title,
      body: reminder.message,
      trigger: {
        type: 'time',
        value: reminderTime,
      },
      categoryId: 'CONTENT_REMINDER',
      data: {
        reminderId: reminder.id,
        type: 'content_post',
        platform,
        contentTitle,
      }
    });

    this.scheduledReminders.push(reminder);
    await this.saveScheduledReminders();

    return notificationId;
  }

  // Schedule daily faith encouragement
  async scheduleFaithEncouragement(userId: string, time: Date): Promise<string> {
    const faithMessages = [
      "God has equipped you with everything you need for today's Kingdom work! 🙏",
      "Remember: You're not just building a business, you're building His Kingdom! ✨",
      "Every step of faith you take today impacts eternity. Keep going! 💜",
      "His plans for you are good. Trust the process and trust His timing! 🌟",
      "You are chosen, equipped, and anointed for this season. Walk boldly! 👑"
    ];

    const message = faithMessages[Math.floor(Math.random() * faithMessages.length)];

    const reminder: ScheduledReminder = {
      id: `faith_${Date.now()}`,
      type: 'faith_encouragement',
      title: 'Kingdom Encouragement',
      message,
      scheduledFor: time,
      userId,
      isActive: true
    };

    const notificationId = await this.scheduleNotification({
      id: reminder.id,
      title: reminder.title,
      body: reminder.message,
      trigger: {
        type: 'time',
        value: time,
        repeats: true,
      },
      categoryId: 'FAITH_ENCOURAGEMENT',
      data: {
        reminderId: reminder.id,
        type: 'faith_encouragement',
      }
    });

    this.scheduledReminders.push(reminder);
    await this.saveScheduledReminders();

    return notificationId;
  }

  // Schedule analytics review reminder
  async scheduleAnalyticsReview(userId: string, frequency: 'daily' | 'weekly' | 'monthly'): Promise<string> {
    const intervals = {
      daily: 24 * 60 * 60, // 1 day in seconds
      weekly: 7 * 24 * 60 * 60, // 1 week in seconds
      monthly: 30 * 24 * 60 * 60, // 30 days in seconds
    };

    const reminder: ScheduledReminder = {
      id: `analytics_${Date.now()}`,
      type: 'analytics_review',
      title: 'Analytics Review Time',
      message: `Time for your ${frequency} analytics review! See how your Kingdom impact is growing! 📊`,
      scheduledFor: new Date(Date.now() + intervals[frequency] * 1000),
      userId,
      isActive: true,
      metadata: { frequency }
    };

    const notificationId = await this.scheduleNotification({
      id: reminder.id,
      title: reminder.title,
      body: reminder.message,
      trigger: {
        type: 'interval',
        value: intervals[frequency],
        repeats: true,
      },
      categoryId: 'ANALYTICS_REVIEW',
      data: {
        reminderId: reminder.id,
        type: 'analytics_review',
        frequency,
      }
    });

    this.scheduledReminders.push(reminder);
    await this.saveScheduledReminders();

    return notificationId;
  }

  // Send push notification to specific user
  async sendPushNotification(
    expoPushToken: string,
    title: string,
    body: string,
    data?: Record<string, any>
  ): Promise<boolean> {
    try {
      const message = {
        to: expoPushToken,
        sound: 'default',
        title,
        body,
        data,
      };

      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      const result = await response.json();
      return result.data?.[0]?.status === 'ok';
    } catch (error) {
      console.error('Push notification send error:', error);
      return false;
    }
  }

  // Handle notification action responses
  private handlePostNowAction(data: any): void {
    // Navigate to content posting screen
    console.log('Post now action triggered:', data);
  }

  private handleRescheduleAction(data: any): void {
    // Navigate to content scheduler
    console.log('Reschedule action triggered:', data);
  }

  private handleReadScriptureAction(): void {
    // Navigate to scripture reading or open external app
    console.log('Read scripture action triggered');
  }

  private handleViewAnalyticsAction(): void {
    // Navigate to analytics screen
    console.log('View analytics action triggered');
  }

  private handleDefaultNotificationTap(data: any): void {
    // Handle default notification tap based on type
    console.log('Default notification tap:', data);
  }

  // Cancel scheduled notification
  async cancelNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  // Cancel all notifications
  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
    this.scheduledReminders = [];
    await this.saveScheduledReminders();
  }

  // Get all scheduled notifications
  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    return await Notifications.getAllScheduledNotificationsAsync();
  }

  // Load scheduled reminders from storage
  private async loadScheduledReminders(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('scheduledReminders');
      if (stored) {
        this.scheduledReminders = JSON.parse(stored).map((reminder: any) => ({
          ...reminder,
          scheduledFor: new Date(reminder.scheduledFor),
        }));
      }
    } catch (error) {
      console.error('Error loading scheduled reminders:', error);
    }
  }

  // Save scheduled reminders to storage
  private async saveScheduledReminders(): Promise<void> {
    try {
      await AsyncStorage.setItem('scheduledReminders', JSON.stringify(this.scheduledReminders));
    } catch (error) {
      console.error('Error saving scheduled reminders:', error);
    }
  }

  // Get user's reminders
  getUserReminders(userId: string): ScheduledReminder[] {
    return this.scheduledReminders.filter(reminder => 
      reminder.userId === userId && reminder.isActive
    );
  }

  // Disable/enable reminder
  async toggleReminder(reminderId: string, isActive: boolean): Promise<void> {
    const reminder = this.scheduledReminders.find(r => r.id === reminderId);
    if (reminder) {
      reminder.isActive = isActive;
      await this.saveScheduledReminders();
    }
  }

  // Get push token for external services
  getPushToken(): string | null {
    return this.expoPushToken;
  }

  // Check notification permissions
  async checkPermissions(): Promise<Notifications.NotificationPermissionsStatus> {
    return await Notifications.getPermissionsAsync();
  }

  // Request notification permissions
  async requestPermissions(): Promise<Notifications.NotificationPermissionsStatus> {
    return await Notifications.requestPermissionsAsync();
  }
}

export default NotificationService.getInstance();

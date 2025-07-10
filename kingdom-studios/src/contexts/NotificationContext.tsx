import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

// ==============================
// 🔔 Kingdom Studios Notification System
// Handles tier, trial, payment notifications
// ==============================

export type NotificationType = 
  | 'trial_starting' 
  | 'trial_ending' 
  | 'trial_expired'
  | 'payment_success'
  | 'payment_failed'
  | 'subscription_upgraded'
  | 'subscription_downgraded'
  | 'subscription_canceled'
  | 'feature_limit_reached'
  | 'admin_message'
  | 'system_maintenance';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  priority: NotificationPriority;
  data?: Record<string, any>;
  scheduledFor?: Date;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
  actionText?: string;
}

interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  trialReminders: boolean;
  paymentAlerts: boolean;
  featureUpdates: boolean;
  adminMessages: boolean;
  marketingEmails: boolean;
}

interface NotificationContextType {
  // Notification Management
  notifications: NotificationData[];
  unreadCount: number;
  settings: NotificationSettings;
  
  // Actions
  sendNotification: (notification: Omit<NotificationData, 'id' | 'isRead' | 'createdAt'>) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
  
  // Settings
  updateSettings: (settings: Partial<NotificationSettings>) => Promise<void>;
  
  // Scheduled Notifications
  scheduleTrialReminder: (daysUntilExpiry: number) => Promise<void>;
  schedulePaymentReminder: (daysUntilDue: number) => Promise<void>;
  cancelScheduledNotifications: (type: NotificationType) => Promise<void>;
  
  // Permission Management
  requestPermissions: () => Promise<boolean>;
  hasPermissions: boolean;
  
  // Loading State
  isLoading: boolean;
}

const defaultSettings: NotificationSettings = {
  pushEnabled: true,
  emailEnabled: true,
  trialReminders: true,
  paymentAlerts: true,
  featureUpdates: true,
  adminMessages: true,
  marketingEmails: false,
};

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

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeNotifications();
    loadNotifications();
    loadSettings();
  }, []);

  const initializeNotifications = async () => {
    try {
      // Request permissions
      const hasPerms = await requestPermissions();
      setHasPermissions(hasPerms);

      // Set up notification response listener
      const subscription = Notifications.addNotificationResponseReceivedListener(
        (response) => {
          const notificationData = response.notification.request.content.data;
          handleNotificationResponse(notificationData);
        }
      );

      return () => subscription.remove();
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  };

  const requestPermissions = async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      return finalStatus === 'granted';
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  };

  const loadNotifications = async () => {
    try {
      const saved = await AsyncStorage.getItem('notifications');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Convert date strings back to Date objects
        const notificationsWithDates = parsed.map((notif: any) => ({
          ...notif,
          createdAt: new Date(notif.createdAt),
          scheduledFor: notif.scheduledFor ? new Date(notif.scheduledFor) : undefined,
        }));
        setNotifications(notificationsWithDates);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem('notificationSettings');
      if (saved) {
        setSettings({ ...defaultSettings, ...JSON.parse(saved) });
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveNotifications = async (newNotifications: NotificationData[]) => {
    try {
      await AsyncStorage.setItem('notifications', JSON.stringify(newNotifications));
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  };

  const saveSettings = async (newSettings: NotificationSettings) => {
    try {
      await AsyncStorage.setItem('notificationSettings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  };

  const handleNotificationResponse = (data: any) => {
    // Handle notification tap/interaction
    if (data?.actionUrl) {
      // Navigate to specific screen based on actionUrl
      // This would integrate with your navigation system
      console.log('Navigate to:', data.actionUrl);
    }
  };

  const sendNotification = async (
    notification: Omit<NotificationData, 'id' | 'isRead' | 'createdAt'>
  ): Promise<void> => {
    try {
      const newNotification: NotificationData = {
        ...notification,
        id: Date.now().toString(),
        isRead: false,
        createdAt: new Date(),
      };

      // Check if this type of notification is enabled
      if (!shouldSendNotification(notification.type)) {
        return;
      }

      // Add to local notifications
      const updatedNotifications = [newNotification, ...notifications];
      setNotifications(updatedNotifications);
      await saveNotifications(updatedNotifications);

      // Send push notification if enabled and permissions granted
      if (settings.pushEnabled && hasPermissions) {
        await sendPushNotification(newNotification);
      }

      // TODO: Send email notification if enabled
      if (settings.emailEnabled) {
        await sendEmailNotification(newNotification);
      }

    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const shouldSendNotification = (type: NotificationType): boolean => {
    switch (type) {
      case 'trial_starting':
      case 'trial_ending':
      case 'trial_expired':
        return settings.trialReminders;
      case 'payment_success':
      case 'payment_failed':
        return settings.paymentAlerts;
      case 'feature_limit_reached':
        return settings.featureUpdates;
      case 'admin_message':
        return settings.adminMessages;
      default:
        return true;
    }
  };

  const sendPushNotification = async (notification: NotificationData) => {
    try {
      if (notification.scheduledFor) {
        // Schedule notification
        await Notifications.scheduleNotificationAsync({
          content: {
            title: notification.title,
            body: notification.body,
            data: notification.data || {},
          },
          trigger: {
            type: 'date',
            date: notification.scheduledFor,
          },
        });
      } else {
        // Send immediately
        await Notifications.scheduleNotificationAsync({
          content: {
            title: notification.title,
            body: notification.body,
            data: notification.data || {},
          },
          trigger: null,
        });
      }
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  };

  const sendEmailNotification = async (notification: NotificationData) => {
    try {
      // TODO: Implement email notification via backend API
      console.log('Would send email notification:', notification);
    } catch (error) {
      console.error('Error sending email notification:', error);
    }
  };

  const getPushPriority = (priority: NotificationPriority) => {
    switch (priority) {
      case 'urgent': return Notifications.AndroidImportance.MAX;
      case 'high': return Notifications.AndroidImportance.HIGH;
      case 'normal': return Notifications.AndroidImportance.DEFAULT;
      case 'low': return Notifications.AndroidImportance.LOW;
      default: return Notifications.AndroidImportance.DEFAULT;
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const updatedNotifications = notifications.map(notif =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      );
      setNotifications(updatedNotifications);
      await saveNotifications(updatedNotifications);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const updatedNotifications = notifications.map(notif => ({ ...notif, isRead: true }));
      setNotifications(updatedNotifications);
      await saveNotifications(updatedNotifications);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const updatedNotifications = notifications.filter(notif => notif.id !== notificationId);
      setNotifications(updatedNotifications);
      await saveNotifications(updatedNotifications);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      setNotifications([]);
      await saveNotifications([]);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const updateSettings = async (newSettings: Partial<NotificationSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      await saveSettings(updatedSettings);
      
      // If push notifications were disabled, cancel all scheduled notifications
      if (newSettings.pushEnabled === false) {
        await Notifications.cancelAllScheduledNotificationsAsync();
      }
    } catch (error) {
      console.error('Error updating notification settings:', error);
    }
  };

  const scheduleTrialReminder = async (daysUntilExpiry: number) => {
    try {
      const scheduledFor = new Date();
      scheduledFor.setDate(scheduledFor.getDate() + daysUntilExpiry - 3); // 3 days before expiry

      await sendNotification({
        type: 'trial_ending',
        title: '⏰ Trial Ending Soon',
        body: `Your trial expires in ${daysUntilExpiry} days. Upgrade now to continue your Kingdom journey!`,
        priority: 'high',
        scheduledFor,
        actionUrl: '/tier-selection',
        actionText: 'Upgrade Now',
        data: { daysRemaining: daysUntilExpiry },
      });
    } catch (error) {
      console.error('Error scheduling trial reminder:', error);
    }
  };

  const schedulePaymentReminder = async (daysUntilDue: number) => {
    try {
      const scheduledFor = new Date();
      scheduledFor.setDate(scheduledFor.getDate() + daysUntilDue - 2); // 2 days before due

      await sendNotification({
        type: 'payment_failed',
        title: '💳 Payment Due Soon',
        body: `Your subscription payment is due in ${daysUntilDue} days. Update your payment method to avoid interruption.`,
        priority: 'high',
        scheduledFor,
        actionUrl: '/billing',
        actionText: 'Update Payment',
        data: { daysUntilDue },
      });
    } catch (error) {
      console.error('Error scheduling payment reminder:', error);
    }
  };

  const cancelScheduledNotifications = async (type: NotificationType) => {
    try {
      // This would require tracking notification IDs to cancel specific ones
      // For now, we'll implement basic cancellation
      const updatedNotifications = notifications.filter(notif => 
        notif.type !== type || !notif.scheduledFor || notif.scheduledFor < new Date()
      );
      setNotifications(updatedNotifications);
      await saveNotifications(updatedNotifications);
    } catch (error) {
      console.error('Error canceling scheduled notifications:', error);
    }
  };

  // Helper function to send common tier-related notifications
  const sendTierNotifications = {
    trialStarted: (tierName: string) => sendNotification({
      type: 'trial_starting',
      title: '🎉 Trial Activated!',
      body: `Welcome to your ${tierName} trial! Explore all premium features for the next 14 days.`,
      priority: 'normal',
      actionUrl: '/dashboard',
      actionText: 'Get Started',
    }),

    trialConverted: (tierName: string, amount: number) => sendNotification({
      type: 'subscription_upgraded',
      title: '✨ Welcome to Premium!',
      body: `Your ${tierName} subscription is now active. Thank you for supporting Kingdom Studios!`,
      priority: 'normal',
      data: { tier: tierName, amount },
    }),

    paymentSuccess: (amount: number, tierName: string) => sendNotification({
      type: 'payment_success',
      title: '✅ Payment Successful',
      body: `Your ${tierName} subscription has been renewed for $${amount}. Your Kingdom journey continues!`,
      priority: 'normal',
      data: { amount, tier: tierName },
    }),

    paymentFailed: (amount: number) => sendNotification({
      type: 'payment_failed',
      title: '❌ Payment Failed',
      body: `We couldn't process your payment of $${amount}. Please update your payment method to avoid service interruption.`,
      priority: 'urgent',
      actionUrl: '/billing',
      actionText: 'Update Payment',
      data: { amount },
    }),

    featureLimitReached: (featureName: string) => sendNotification({
      type: 'feature_limit_reached',
      title: `📊 ${featureName} Limit Reached`,
      body: `You've reached your monthly ${featureName} limit. Upgrade your tier for unlimited access!`,
      priority: 'normal',
      actionUrl: '/tier-selection',
      actionText: 'Upgrade Now',
      data: { feature: featureName },
    }),
  };

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  const contextValue: NotificationContextType = {
    notifications,
    unreadCount,
    settings,
    sendNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    updateSettings,
    scheduleTrialReminder,
    schedulePaymentReminder,
    cancelScheduledNotifications,
    requestPermissions,
    hasPermissions,
    isLoading,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Export helper function for easy tier notification sending
export const TierNotifications = {
  trialStarted: (tierName: string) => ({ 
    type: 'trial_starting' as NotificationType,
    title: '🎉 Trial Activated!',
    body: `Welcome to your ${tierName} trial! Explore all premium features for the next 14 days.`,
    priority: 'normal' as NotificationPriority,
    actionUrl: '/dashboard',
    actionText: 'Get Started',
  }),
  // Add more helper functions as needed
};

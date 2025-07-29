import React, { useState, useEffect, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import NotificationService, { ScheduledReminder } from '../services/notificationService';
import { useAuth } from '../contexts/UnifiedAuthContext';

/**
 * 🔔 NOTIFICATION HOOK
 * React hook for managing push notifications and scheduled reminders
 */

export interface UseNotificationsReturn {
  // State
  expoPushToken: string | null;
  notifications: Notifications.Notification[];
  scheduledReminders: ScheduledReminder[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  sendNotification: (title: string, body: string, data?: Record<string, any>) => Promise<void>;
  scheduleNotification: (title: string, body: string, date: Date, data?: Record<string, any>) => Promise<string>;
  cancelNotification: (notificationId: string) => Promise<void>;
  scheduleReminder: (type: ScheduledReminder['type'], title: string, message: string, date: Date, metadata?: Record<string, any>) => Promise<void>;
  toggleReminder: (reminderId: string, isActive: boolean) => Promise<void>;
  clearError: () => void;
  
  // Notification templates
  sendAIGenerationComplete: (contentType: string) => Promise<void>;
  sendUsageLimitWarning: (remaining: number) => Promise<void>;
  sendPostScheduled: (platform: string, date: string) => Promise<void>;
  sendProductSold: (productName: string, amount: string) => Promise<void>;
}

export const useNotifications = (): UseNotificationsReturn => {
  const { user } = useAuth();
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notifications.Notification[]>([]);
  const [scheduledReminders, setScheduledReminders] = useState<ScheduledReminder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize notifications on mount
  useEffect(() => {
    initializeNotifications();
    setupNotificationListeners();
    loadUserReminders();
  }, [user]);

  const initializeNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Request permissions and get push token
      const token = await NotificationService.registerForPushNotifications();
      setExpoPushToken(token);
      
      // Set up notification categories
      await NotificationService.setupNotificationCategories();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize notifications');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setupNotificationListeners = useCallback(() => {
    // Listen for notifications received while app is foregrounded
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotifications(prev => [notification, ...prev]);
      }
    );

    // Listen for user tapping on notifications
    const responseListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        handleNotificationTap(response);
      }
    );

    // Listen for notifications received while app is backgrounded
    const backgroundListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        handleNotificationTap(response);
      }
    );

    return () => {
      notificationListener.remove();
      responseListener.remove();
      backgroundListener.remove();
    };
  }, []);

  const handleNotificationTap = useCallback((response: Notifications.NotificationResponse) => {
    const data = response.notification.request.content.data;
    
    // Handle different notification types
    if (data.type === 'ai_generation_complete') {
      // Navigate to AI results or content library
      console.log('Navigate to AI content:', data);
    } else if (data.type === 'post_scheduled') {
      // Navigate to scheduled posts
      console.log('Navigate to scheduled posts:', data);
    } else if (data.type === 'product_sold') {
      // Navigate to sales dashboard
      console.log('Navigate to sales dashboard:', data);
    } else if (data.type === 'mentorship_request') {
      // Navigate to mentorship requests
      console.log('Navigate to mentorship:', data);
    }
  }, []);

  const loadUserReminders = useCallback(async () => {
    if (!user) return;
    
    try {
      const reminders = NotificationService.getUserReminders(user.uid);
      setScheduledReminders(reminders);
    } catch (err) {
      console.error('Error loading user reminders:', err);
    }
  }, [user]);

  const sendNotification = useCallback(async (
    title: string,
    body: string,
    data?: Record<string, any>
  ) => {
    try {
      setError(null);
      await NotificationService.sendImmediateNotification(title, body, data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send notification');
      throw err;
    }
  }, []);

  const scheduleNotification = useCallback(async (
    title: string,
    body: string,
    date: Date,
    data?: Record<string, any>
  ): Promise<string> => {
    try {
      setError(null);
      return await NotificationService.scheduleNotification(title, body, date, data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to schedule notification');
      throw err;
    }
  }, []);

  const cancelNotification = useCallback(async (notificationId: string) => {
    try {
      setError(null);
      await NotificationService.cancelNotification(notificationId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel notification');
      throw err;
    }
  }, []);

  const scheduleReminder = useCallback(async (
    type: ScheduledReminder['type'],
    title: string,
    message: string,
    date: Date,
    metadata?: Record<string, any>
  ) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      setError(null);
      await NotificationService.scheduleReminder(
        user.uid,
        type,
        title,
        message,
        date,
        metadata
      );
      await loadUserReminders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to schedule reminder');
      throw err;
    }
  }, [user, loadUserReminders]);

  const toggleReminder = useCallback(async (reminderId: string, isActive: boolean) => {
    try {
      setError(null);
      await NotificationService.toggleReminder(reminderId, isActive);
      await loadUserReminders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle reminder');
      throw err;
    }
  }, [loadUserReminders]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Notification template methods
  const sendAIGenerationComplete = useCallback(async (contentType: string) => {
    await sendNotification(
      '🤖 AI Content Ready!',
      `Your ${contentType} has been generated and is ready to use.`,
      { type: 'ai_generation_complete', contentType }
    );
  }, [sendNotification]);

  const sendUsageLimitWarning = useCallback(async (remaining: number) => {
    await sendNotification(
      '⚠️ Usage Limit Warning',
      `You have ${remaining} AI generations remaining this month.`,
      { type: 'usage_limit_warning', remaining }
    );
  }, [sendNotification]);

  const sendPostScheduled = useCallback(async (platform: string, date: string) => {
    await sendNotification(
      '📅 Post Scheduled',
      `Your ${platform} post is scheduled for ${date}.`,
      { type: 'post_scheduled', platform, date }
    );
  }, [sendNotification]);

  const sendProductSold = useCallback(async (productName: string, amount: string) => {
    await sendNotification(
      '💰 Product Sold!',
      `Your "${productName}" was purchased for ${amount}.`,
      { type: 'product_sold', productName, amount }
    );
  }, [sendNotification]);

  return {
    // State
    expoPushToken,
    notifications,
    scheduledReminders,
    isLoading,
    error,
    
    // Actions
    sendNotification,
    scheduleNotification,
    cancelNotification,
    scheduleReminder,
    toggleReminder,
    clearError,
    
    // Templates
    sendAIGenerationComplete,
    sendUsageLimitWarning,
    sendPostScheduled,
    sendProductSold,
  };
};

/**
 * 🔔 NOTIFICATION PERMISSION HOOK
 * Separate hook for managing notification permissions
 */
export const useNotificationPermissions = () => {
  const [permissionStatus, setPermissionStatus] = useState<Notifications.NotificationPermissionsStatus | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = useCallback(async () => {
    try {
      setIsChecking(true);
      const status = await NotificationService.checkPermissions();
      setPermissionStatus(status);
    } catch (error) {
      console.error('Error checking notification permissions:', error);
    } finally {
      setIsChecking(false);
    }
  }, []);

  const requestPermissions = useCallback(async () => {
    try {
      setIsChecking(true);
      const status = await NotificationService.requestPermissions();
      setPermissionStatus(status);
      return status;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      throw error;
    } finally {
      setIsChecking(false);
    }
  }, []);

  return {
    permissionStatus,
    isChecking,
    checkPermissions,
    requestPermissions,
    isGranted: permissionStatus?.status === 'granted',
    canAskAgain: permissionStatus?.canAskAgain ?? true,
  };
};

import { useState, useEffect, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import { notificationService, NotificationData, NotificationPreferences } from '../services/notificationService';

// Mock analytics for standalone functionality
const useAnalytics = () => ({
  trackNotification: async (event: string, data: any) => {
    console.log('Analytics tracking:', event, data);
  }
});

export interface UseNotificationsReturn {
  // State
  isInitialized: boolean;
  hasPermissions: boolean;
  preferences: NotificationPreferences | null;
  pushToken: string | null;
  lastNotification: Notifications.Notification | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  sendNotification: (notification: Omit<NotificationData, 'id'>) => Promise<string>;
  scheduleNotification: (notification: Omit<NotificationData, 'id'>, scheduledFor: Date) => Promise<string>;
  cancelNotification: (id: string) => Promise<void>;
  cancelAllNotifications: () => Promise<void>;
  updatePreferences: (preferences: Partial<NotificationPreferences>) => Promise<void>;
  
  // Convenience methods
  notifyContentReady: (contentTitle: string, contentType: string) => Promise<string>;
  notifySocialPostSuccess: (platform: string, postTitle: string) => Promise<string>;
  notifyEmailSent: (campaignName: string, recipientCount: number) => Promise<string>;
  notifyCollaborationUpdate: (projectName: string, updateType: string) => Promise<string>;
  notifyAnalyticsReport: (reportType: string, insights: string) => Promise<string>;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [lastNotification, setLastNotification] = useState<Notifications.Notification | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { trackNotification } = useAnalytics();

  // Initialize notification service
  const initialize = useCallback(async () => {
    if (isInitialized) return;

    setIsLoading(true);
    setError(null);

    try {
      await notificationService.initialize();
      
      const perms = await Notifications.getPermissionsAsync();
      setHasPermissions(perms.status === 'granted');
      
      const prefs = await notificationService.getPreferences();
      setPreferences(prefs);
      
      const token = notificationService.getPushToken();
      setPushToken(token);
      
      setIsInitialized(true);

      await trackNotification('notification_service_initialized', {
        hasPermissions: perms.status === 'granted',
        pushToken: !!token,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize notifications';
      setError(errorMessage);
      console.error('Notification initialization failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized, trackNotification]);

  // Send notification
  const sendNotification = useCallback(async (notification: Omit<NotificationData, 'id'>): Promise<string> => {
    setError(null);
    
    try {
      const id = await notificationService.sendLocalNotification(notification);
      
      await trackNotification('notification_sent', {
        type: notification.type,
        priority: notification.priority,
        scheduled: !!notification.scheduledFor,
      });
      
      return id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send notification';
      setError(errorMessage);
      throw err;
    }
  }, [trackNotification]);

  // Schedule notification
  const scheduleNotification = useCallback(async (
    notification: Omit<NotificationData, 'id'>, 
    scheduledFor: Date
  ): Promise<string> => {
    setError(null);
    
    try {
      const id = await notificationService.scheduleNotification(notification, scheduledFor);
      
      await trackNotification('notification_scheduled', {
        type: notification.type,
        priority: notification.priority,
        scheduledFor: scheduledFor.toISOString(),
      });
      
      return id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to schedule notification';
      setError(errorMessage);
      throw err;
    }
  }, [trackNotification]);

  // Cancel notification
  const cancelNotification = useCallback(async (id: string): Promise<void> => {
    setError(null);
    
    try {
      await notificationService.cancelNotification(id);
      
      await trackNotification('notification_cancelled', { notificationId: id });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel notification';
      setError(errorMessage);
      throw err;
    }
  }, [trackNotification]);

  // Cancel all notifications
  const cancelAllNotifications = useCallback(async (): Promise<void> => {
    setError(null);
    
    try {
      await notificationService.cancelAllNotifications();
      
      await trackNotification('all_notifications_cancelled', {});
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel all notifications';
      setError(errorMessage);
      throw err;
    }
  }, [trackNotification]);

  // Update preferences
  const updatePreferences = useCallback(async (newPreferences: Partial<NotificationPreferences>): Promise<void> => {
    setError(null);
    
    try {
      await notificationService.updatePreferences(newPreferences);
      const updatedPrefs = await notificationService.getPreferences();
      setPreferences(updatedPrefs);
      
      await trackNotification('notification_preferences_updated', {
        changes: Object.keys(newPreferences),
        enabled: updatedPrefs.enabled,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update preferences';
      setError(errorMessage);
      throw err;
    }
  }, [trackNotification]);

  // Convenience methods
  const notifyContentReady = useCallback(async (contentTitle: string, contentType: string): Promise<string> => {
    const id = await notificationService.notifyContentReady(contentTitle, contentType);
    await trackNotification('content_ready_notification', { contentType });
    return id;
  }, [trackNotification]);

  const notifySocialPostSuccess = useCallback(async (platform: string, postTitle: string): Promise<string> => {
    const id = await notificationService.notifySocialPostSuccess(platform, postTitle);
    await trackNotification('social_post_success_notification', { platform });
    return id;
  }, [trackNotification]);

  const notifyEmailSent = useCallback(async (campaignName: string, recipientCount: number): Promise<string> => {
    const id = await notificationService.notifyEmailSent(campaignName, recipientCount);
    await trackNotification('email_sent_notification', { recipientCount });
    return id;
  }, [trackNotification]);

  const notifyCollaborationUpdate = useCallback(async (projectName: string, updateType: string): Promise<string> => {
    const id = await notificationService.notifyCollaborationUpdate(projectName, updateType);
    await trackNotification('collaboration_update_notification', { updateType });
    return id;
  }, [trackNotification]);

  const notifyAnalyticsReport = useCallback(async (reportType: string, insights: string): Promise<string> => {
    const id = await notificationService.notifyAnalyticsReport(reportType, insights);
    await trackNotification('analytics_report_notification', { reportType });
    return id;
  }, [trackNotification]);

  // Set up notification listeners
  useEffect(() => {
    let notificationListener: Notifications.Subscription;
    let responseListener: Notifications.Subscription;

    const setupListeners = async () => {
      // Listen for notifications that are received while app is foregrounded
      notificationListener = Notifications.addNotificationReceivedListener(notification => {
        setLastNotification(notification);
        
        trackNotification('notification_received', {
          type: notification.request.content.data?.type || 'unknown',
          foreground: true,
        });
      });

      // Listen for user interactions with notifications
      responseListener = Notifications.addNotificationResponseReceivedListener(response => {
        const notification = response.notification;
        setLastNotification(notification);
        
        trackNotification('notification_interaction', {
          type: notification.request.content.data?.type || 'unknown',
          actionIdentifier: response.actionIdentifier,
        });
      });
    };

    setupListeners();

    return () => {
      if (notificationListener) {
        Notifications.removeNotificationSubscription(notificationListener);
      }
      if (responseListener) {
        Notifications.removeNotificationSubscription(responseListener);
      }
    };
  }, [trackNotification]);

  // Auto-initialize on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  return {
    // State
    isInitialized,
    hasPermissions,
    preferences,
    pushToken,
    lastNotification,
    isLoading,
    error,

    // Actions
    initialize,
    sendNotification,
    scheduleNotification,
    cancelNotification,
    cancelAllNotifications,
    updatePreferences,

    // Convenience methods
    notifyContentReady,
    notifySocialPostSuccess,
    notifyEmailSent,
    notifyCollaborationUpdate,
    notifyAnalyticsReport,
  };
};


import { useComprehensiveActivityLogger } from './useComprehensiveActivityLogger';

export function useNotificationActivityTracking() {
  const { logNotificationActivity } = useComprehensiveActivityLogger();

  const trackNotificationDismissed = (notificationTitle: string, notificationId?: string) => {
    logNotificationActivity(
      'notification_dismissed',
      `Dismissed notification: "${notificationTitle}"`,
      {
        notificationTitle,
        notificationId
      }
    );
  };

  const trackNotificationPreferencesChanged = (preferences: any) => {
    logNotificationActivity(
      'preferences_changed',
      'Notification preferences updated',
      {
        preferences
      }
    );
  };

  const trackNotificationSent = (notificationTitle: string, recipient: string, type: string) => {
    logNotificationActivity(
      'notification_sent',
      `Sent ${type} notification "${notificationTitle}" to ${recipient}`,
      {
        notificationTitle,
        recipient,
        type
      }
    );
  };

  const trackNotificationRead = (notificationTitle: string, notificationId?: string) => {
    logNotificationActivity(
      'notification_read',
      `Read notification: "${notificationTitle}"`,
      {
        notificationTitle,
        notificationId
      }
    );
  };

  const trackBulkNotificationAction = (action: string, count: number) => {
    logNotificationActivity(
      'bulk_action',
      `${action} ${count} notifications`,
      {
        action,
        count
      }
    );
  };

  return {
    trackNotificationDismissed,
    trackNotificationPreferencesChanged,
    trackNotificationSent,
    trackNotificationRead,
    trackBulkNotificationAction
  };
}

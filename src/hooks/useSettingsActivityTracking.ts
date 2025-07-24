
import { useComprehensiveActivityLogger } from './useComprehensiveActivityLogger';

export function useSettingsActivityTracking() {
  const { logSettingsActivity } = useComprehensiveActivityLogger();

  const trackProfileUpdated = (changedFields: string[]) => {
    logSettingsActivity(
      'profile_updated',
      `Profile updated - Modified: ${changedFields.join(', ')}`,
      {
        changedFields
      }
    );
  };

  const trackPasswordChanged = () => {
    logSettingsActivity(
      'password_changed',
      'Password changed successfully',
      {}
    );
  };

  const trackNotificationSettingsChanged = (settings: any) => {
    logSettingsActivity(
      'notification_settings_changed',
      'Notification settings updated',
      {
        settings
      }
    );
  };

  const trackSecuritySettingsChanged = (setting: string, value: any) => {
    logSettingsActivity(
      'security_settings_changed',
      `Security setting "${setting}" changed`,
      {
        setting,
        value
      }
    );
  };

  const trackLeadSourceConfigured = (sourceName: string, action: 'created' | 'updated' | 'deleted') => {
    logSettingsActivity(
      'lead_source_configured',
      `Lead source "${sourceName}" ${action}`,
      {
        sourceName,
        action
      }
    );
  };

  return {
    trackProfileUpdated,
    trackPasswordChanged,
    trackNotificationSettingsChanged,
    trackSecuritySettingsChanged,
    trackLeadSourceConfigured
  };
}

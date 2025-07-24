
import { useComprehensiveActivityLogger } from './useComprehensiveActivityLogger';

export function useOrganizationActivityTracking() {
  const { logOrganizationActivity } = useComprehensiveActivityLogger();

  const trackUserInvited = (email: string, role: string) => {
    logOrganizationActivity(
      'user_invited',
      `Invited user ${email} with role ${role}`,
      undefined,
      {
        email,
        role
      }
    );
  };

  const trackUserRoleChanged = (email: string, oldRole: string, newRole: string) => {
    logOrganizationActivity(
      'user_role_changed',
      `Changed user ${email} role from ${oldRole} to ${newRole}`,
      undefined,
      {
        email,
        oldRole,
        newRole
      }
    );
  };

  const trackUserRemoved = (email: string, role: string) => {
    logOrganizationActivity(
      'user_removed',
      `Removed user ${email} (${role})`,
      undefined,
      {
        email,
        role
      }
    );
  };

  const trackOrganizationCreated = (orgName: string) => {
    logOrganizationActivity(
      'organization_created',
      `Created organization "${orgName}"`,
      undefined,
      {
        orgName
      }
    );
  };

  const trackOrganizationUpdated = (orgName: string, changedFields: string[]) => {
    logOrganizationActivity(
      'organization_updated',
      `Updated organization "${orgName}" - Modified: ${changedFields.join(', ')}`,
      undefined,
      {
        orgName,
        changedFields
      }
    );
  };

  const trackOrganizationDeleted = (orgName: string) => {
    logOrganizationActivity(
      'organization_deleted',
      `Deleted organization "${orgName}"`,
      undefined,
      {
        orgName
      }
    );
  };

  return {
    trackUserInvited,
    trackUserRoleChanged,
    trackUserRemoved,
    trackOrganizationCreated,
    trackOrganizationUpdated,
    trackOrganizationDeleted
  };
}

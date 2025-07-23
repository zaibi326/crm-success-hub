
import { useAuth } from '@/contexts/AuthContext';
import { 
  canManageUsers, 
  canManageTeam, 
  canViewAllLeads, 
  canCreateCampaigns, 
  canViewAnalytics,
  canCreateApps,
  hasPermission
} from '@/utils/roleRedirect';

export const useRoleAccess = () => {
  const { profile } = useAuth();
  const userRole = profile?.role || 'Employee';

  return {
    userRole,
    isAdmin: userRole === 'Admin',
    isManager: userRole === 'Manager',
    isLeadManager: userRole === 'Lead Manager',
    isEmployee: userRole === 'Employee',
    // Legacy support for existing code
    isMember: userRole === 'Manager' || userRole === 'Lead Manager' || userRole === 'Employee',
    isClient: userRole === 'Guest',
    isGuest: userRole === 'Guest',
    canManageUsers: canManageUsers(userRole),
    canManageTeam: canManageTeam(userRole),
    canViewAllLeads: canViewAllLeads(userRole),
    canCreateCampaigns: canCreateCampaigns(userRole),
    canViewAnalytics: canViewAnalytics(userRole),
    canCreateApps: canCreateApps(userRole),
    hasPermission: (requiredRoles: string[]) => hasPermission(userRole, requiredRoles)
  };
};


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
  const userRole = profile?.role || 'Guest';

  return {
    userRole,
    isAdmin: userRole === 'Admin',
    isMember: userRole === 'Manager' || userRole === 'Employee', // Map existing roles to Member concept
    isClient: userRole === 'Guest', // Map Guest to Client for now
    isGuest: userRole === 'Guest',
    // Legacy support
    isManager: userRole === 'Admin' || userRole === 'Manager',
    isEmployee: userRole === 'Employee',
    canManageUsers: canManageUsers(userRole),
    canManageTeam: canManageTeam(userRole),
    canViewAllLeads: canViewAllLeads(userRole),
    canCreateCampaigns: canCreateCampaigns(userRole),
    canViewAnalytics: canViewAnalytics(userRole),
    canCreateApps: canCreateApps(userRole),
    hasPermission: (requiredRoles: string[]) => hasPermission(userRole, requiredRoles)
  };
};

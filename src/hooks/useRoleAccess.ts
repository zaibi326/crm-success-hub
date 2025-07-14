
import { useAuth } from '@/contexts/AuthContext';
import { 
  canManageUsers, 
  canManageTeam, 
  canViewAllLeads, 
  canCreateCampaigns, 
  canViewAnalytics,
  hasPermission
} from '@/utils/roleRedirect';

export const useRoleAccess = () => {
  const { profile } = useAuth();
  const userRole = profile?.role || 'Guest';

  return {
    userRole,
    isAdmin: userRole === 'Admin',
    isMember: userRole === 'Member',
    isClient: userRole === 'Client',
    isGuest: userRole === 'Guest',
    // Legacy support
    isManager: userRole === 'Admin' || userRole === 'Member',
    isEmployee: userRole === 'Member',
    canManageUsers: canManageUsers(userRole),
    canManageTeam: canManageTeam(userRole),
    canViewAllLeads: canViewAllLeads(userRole),
    canCreateCampaigns: canCreateCampaigns(userRole),
    canViewAnalytics: canViewAnalytics(userRole),
    hasPermission: (requiredRoles: string[]) => hasPermission(userRole, requiredRoles)
  };
};

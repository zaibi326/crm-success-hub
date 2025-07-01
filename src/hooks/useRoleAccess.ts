
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
  const userRole = profile?.role || 'Employee';

  return {
    userRole,
    isAdmin: userRole === 'Admin',
    isManager: userRole === 'Manager',
    isEmployee: userRole === 'Employee',
    canManageUsers: canManageUsers(userRole),
    canManageTeam: canManageTeam(userRole),
    canViewAllLeads: canViewAllLeads(userRole),
    canCreateCampaigns: canCreateCampaigns(userRole),
    canViewAnalytics: canViewAnalytics(userRole),
    hasPermission: (requiredRoles: string[]) => hasPermission(userRole, requiredRoles)
  };
};


import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
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
  const context = useContext(AuthContext);
  
  // If AuthProvider is not available, return default values
  if (!context) {
    console.warn('useRoleAccess called outside of AuthProvider, returning default values');
    const defaultRole = 'Employee';
    
    return {
      userRole: defaultRole,
      isAdmin: false,
      isManager: false,
      isLeadManager: false,
      isEmployee: true,
      isMember: true,
      isClient: false,
      isGuest: false,
      canManageUsers: canManageUsers(defaultRole),
      canManageTeam: canManageTeam(defaultRole),
      canViewAllLeads: canViewAllLeads(defaultRole),
      canCreateCampaigns: canCreateCampaigns(defaultRole),
      canViewAnalytics: canViewAnalytics(defaultRole),
      canCreateApps: canCreateApps(defaultRole),
      hasPermission: (requiredRoles: string[]) => hasPermission(defaultRole, requiredRoles)
    };
  }

  const { profile } = context;
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


export const getRoleBasedRedirect = (role: string): string => {
  switch (role) {
    case 'Admin':
      return '/dashboard';
    case 'Manager':
      return '/campaigns';
    case 'Employee':
      return '/leads';
    default:
      return '/dashboard';
  }
};

export const getRoleDashboardTitle = (role: string): string => {
  switch (role) {
    case 'Admin':
      return 'Admin Dashboard';
    case 'Manager':
      return 'Manager Dashboard';
    case 'Employee':
      return 'Employee Dashboard';
    default:
      return 'Dashboard';
  }
};

export const hasPermission = (userRole: string, requiredRoles: string[]): boolean => {
  return requiredRoles.includes(userRole);
};

export const canAccessRoute = (userRole: string, route: string): boolean => {
  const routePermissions: Record<string, string[]> = {
    '/dashboard': ['Admin'],
    '/campaigns': ['Admin', 'Manager'],
    '/leads': ['Admin', 'Manager', 'Employee'],
    '/settings': ['Admin', 'Manager', 'Employee'],
    '/notifications': ['Admin', 'Manager', 'Employee'],
    '/calendar': ['Admin', 'Manager', 'Employee']
  };

  const allowedRoles = routePermissions[route];
  return allowedRoles ? allowedRoles.includes(userRole) : false;
};

export const getVisibleNavigationItems = (userRole: string) => {
  const allItems = [
    { title: "Dashboard", url: "/dashboard", requiredRoles: ['Admin'] },
    { title: "Campaigns", url: "/campaigns", requiredRoles: ['Admin', 'Manager'] },
    { title: "Leads", url: "/leads", requiredRoles: ['Admin', 'Manager', 'Employee'] },
    { title: "Calendar", url: "/calendar", requiredRoles: ['Admin', 'Manager', 'Employee'] },
    { title: "Notifications", url: "/notifications", requiredRoles: ['Admin', 'Manager', 'Employee'] },
    { title: "Settings", url: "/settings", requiredRoles: ['Admin', 'Manager', 'Employee'] }
  ];

  return allItems.filter(item => hasPermission(userRole, item.requiredRoles));
};

export const canManageUsers = (userRole: string): boolean => {
  return userRole === 'Admin';
};

export const canManageTeam = (userRole: string): boolean => {
  return ['Admin', 'Manager'].includes(userRole);
};

export const canViewAllLeads = (userRole: string): boolean => {
  return ['Admin', 'Manager'].includes(userRole);
};

export const canCreateCampaigns = (userRole: string): boolean => {
  return ['Admin', 'Manager'].includes(userRole);
};

export const canViewAnalytics = (userRole: string): boolean => {
  return ['Admin', 'Manager'].includes(userRole);
};

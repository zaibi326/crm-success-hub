
export const getRoleBasedRedirect = (role: string): string => {
  switch (role) {
    case 'Admin':
      return '/dashboard';
    case 'Member':
      return '/campaigns';
    case 'Client':
      return '/leads';
    case 'Guest':
      return '/leads';
    default:
      return '/dashboard';
  }
};

export const getRoleDashboardTitle = (role: string): string => {
  switch (role) {
    case 'Admin':
      return 'Admin Dashboard';
    case 'Member':
      return 'Member Dashboard';
    case 'Client':
      return 'Client Dashboard';
    case 'Guest':
      return 'Guest Dashboard';
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
    '/campaigns': ['Admin', 'Member'],
    '/leads': ['Admin', 'Member', 'Client', 'Guest'],
    '/communication': ['Admin', 'Member', 'Client'],
    '/organizations': ['Admin'],
    '/organization-management': ['Admin'],
    '/app-builder': ['Admin', 'Member'],
    '/admin-users': ['Admin'],
    '/settings': ['Admin', 'Member', 'Client'],
    '/notifications': ['Admin', 'Member', 'Client', 'Guest'],
    '/calendar': ['Admin', 'Member', 'Client']
  };

  const allowedRoles = routePermissions[route];
  return allowedRoles ? allowedRoles.includes(userRole) : false;
};

export const getVisibleNavigationItems = (userRole: string) => {
  const allItems = [
    { title: "Dashboard", url: "/dashboard", requiredRoles: ['Admin'] },
    { title: "Campaigns", url: "/campaigns", requiredRoles: ['Admin', 'Member'] },
    { title: "Leads", url: "/leads", requiredRoles: ['Admin', 'Member', 'Client', 'Guest'] },
    { title: "Communication", url: "/communication", requiredRoles: ['Admin', 'Member', 'Client'] },
    { title: "Organizations", url: "/organizations", requiredRoles: ['Admin'] },
    { title: "App Builder", url: "/app-builder", requiredRoles: ['Admin', 'Member'] },
    { title: "Calendar", url: "/calendar", requiredRoles: ['Admin', 'Member', 'Client'] },
    { title: "Notifications", url: "/notifications", requiredRoles: ['Admin', 'Member', 'Client', 'Guest'] },
    { title: "Settings", url: "/settings", requiredRoles: ['Admin', 'Member', 'Client'] }
  ];

  return allItems.filter(item => hasPermission(userRole, item.requiredRoles));
};

export const canManageUsers = (userRole: string): boolean => {
  return userRole === 'Admin';
};

export const canManageTeam = (userRole: string): boolean => {
  return ['Admin', 'Member'].includes(userRole);
};

export const canViewAllLeads = (userRole: string): boolean => {
  return ['Admin', 'Member'].includes(userRole);
};

export const canCreateCampaigns = (userRole: string): boolean => {
  return ['Admin', 'Member'].includes(userRole);
};

export const canViewAnalytics = (userRole: string): boolean => {
  return ['Admin', 'Member'].includes(userRole);
};

export const canManageOrganizations = (userRole: string): boolean => {
  return userRole === 'Admin';
};

export const canCreateApps = (userRole: string): boolean => {
  return ['Admin', 'Member'].includes(userRole);
};


export const getRoleBasedRedirect = (role: string): string => {
  switch (role) {
    case 'Admin':
      return '/dashboard';
    case 'Manager':
      return '/campaigns';
    case 'Employee':
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
    case 'Manager':
      return 'Manager Dashboard';
    case 'Employee':
      return 'Employee Dashboard';
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
    '/campaigns': ['Admin', 'Manager'],
    '/leads': ['Admin', 'Manager', 'Employee', 'Guest'],
    '/communication': ['Admin', 'Manager', 'Employee'],
    '/organizations': ['Admin'],
    '/organization-management': ['Admin'],
    '/app-builder': ['Admin', 'Manager'],
    '/admin-users': ['Admin'],
    '/settings': ['Admin', 'Manager', 'Employee'],
    '/notifications': ['Admin', 'Manager', 'Employee', 'Guest'],
    '/calendar': ['Admin', 'Manager', 'Employee']
  };

  const allowedRoles = routePermissions[route];
  return allowedRoles ? allowedRoles.includes(userRole) : false;
};

export const getVisibleNavigationItems = (userRole: string) => {
  const allItems = [
    { title: "Dashboard", url: "/dashboard", requiredRoles: ['Admin'] },
    { title: "Campaigns", url: "/campaigns", requiredRoles: ['Admin', 'Manager'] },
    { title: "Leads", url: "/leads", requiredRoles: ['Admin', 'Manager', 'Employee', 'Guest'] },
    { title: "Communication", url: "/communication", requiredRoles: ['Admin', 'Manager', 'Employee'] },
    { title: "Organizations", url: "/organizations", requiredRoles: ['Admin'] },
    { title: "App Builder", url: "/app-builder", requiredRoles: ['Admin', 'Manager'] },
    { title: "Calendar", url: "/calendar", requiredRoles: ['Admin', 'Manager', 'Employee'] },
    { title: "Notifications", url: "/notifications", requiredRoles: ['Admin', 'Manager', 'Employee', 'Guest'] },
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

export const canManageOrganizations = (userRole: string): boolean => {
  return userRole === 'Admin';
};

export const canCreateApps = (userRole: string): boolean => {
  return ['Admin', 'Manager'].includes(userRole);
};

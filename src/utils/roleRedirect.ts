
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

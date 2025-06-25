
export const getRoleBasedRedirect = (role: string): string => {
  switch (role.toLowerCase()) {
    case 'admin':
      return '/dashboard'; // Admin Dashboard
    case 'manager':
      return '/campaigns'; // Manager Dashboard (Campaign focused)
    case 'employee':
      return '/leads'; // Employee Dashboard (Leads focused)
    default:
      return '/dashboard';
  }
};

export const getRoleDashboardTitle = (role: string): string => {
  switch (role.toLowerCase()) {
    case 'admin':
      return 'Admin Dashboard';
    case 'manager':
      return 'Manager Dashboard';
    case 'employee':
      return 'Employee Dashboard';
    default:
      return 'Dashboard';
  }
};

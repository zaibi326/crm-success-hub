
export const getRoleBasedRedirect = (role: string): string => {
  switch (role.toLowerCase()) {
    case 'admin':
      return '/dashboard'; // Admin Dashboard - using existing dashboard for now
    case 'manager':
      return '/campaigns'; // Campaign Dashboard
    case 'employee':
      return '/leads'; // Assigned Leads
    default:
      return '/dashboard';
  }
};

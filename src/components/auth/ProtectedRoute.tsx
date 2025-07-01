
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'Admin' | 'Manager' | 'Employee';
  allowedRoles?: ('Admin' | 'Manager' | 'Employee')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole, 
  allowedRoles 
}) => {
  const { user, profile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-crm-gradient-start via-white to-crm-gradient-end">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-crm-primary"></div>
            <span className="text-gray-700 font-medium">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  if (requiredRole && profile.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user role
    const roleRoutes = {
      'Admin': '/dashboard',
      'Manager': '/campaigns',
      'Employee': '/leads'
    };
    return <Navigate to={roleRoutes[profile.role] || '/dashboard'} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    const roleRoutes = {
      'Admin': '/dashboard',
      'Manager': '/campaigns',
      'Employee': '/leads'
    };
    return <Navigate to={roleRoutes[profile.role] || '/dashboard'} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;


import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { canAccessRoute, getRoleBasedRedirect } from '@/utils/roleRedirect';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'Admin' | 'Manager' | 'Lead Manager' | 'Employee' | 'Guest';
  allowedRoles?: ('Admin' | 'Manager' | 'Lead Manager' | 'Employee' | 'Guest')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole, 
  allowedRoles 
}) => {
  const { user, profile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            <span className="text-gray-700 font-medium">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!profile) {
    // If user exists but profile is still loading, show loading state
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            <span className="text-gray-700 font-medium">Loading profile...</span>
          </div>
        </div>
      </div>
    );
  }

  const userRole = profile.role;
  const currentPath = window.location.pathname;

  // Check if user can access current route
  if (!canAccessRoute(userRole, currentPath)) {
    const redirectPath = getRoleBasedRedirect(userRole);
    return <Navigate to={redirectPath} replace />;
  }

  // Check specific role requirements
  if (requiredRole && userRole !== requiredRole) {
    const redirectPath = getRoleBasedRedirect(userRole);
    return <Navigate to={redirectPath} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    const redirectPath = getRoleBasedRedirect(userRole);
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

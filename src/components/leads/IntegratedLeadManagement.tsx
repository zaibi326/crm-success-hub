
import React from 'react';
import { useContext } from 'react';
import { EnhancedLeadsContent } from './EnhancedLeadsContent';
import { AuthContext } from '@/contexts/AuthContext';

export function IntegratedLeadManagement() {
  const context = useContext(AuthContext);
  
  // If AuthProvider is not available, don't show loading state
  if (!context) {
    console.warn('IntegratedLeadManagement used outside of AuthProvider, proceeding without auth');
    return <EnhancedLeadsContent />;
  }

  const { isLoading } = context;

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <EnhancedLeadsContent />;
}


import React, { useState } from 'react';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { AppBuilderContent } from '@/components/app-builder/AppBuilderContent';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const AppBuilder = () => {
  const { canManageTeam } = useRoleAccess();

  if (!canManageTeam) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the App Builder.</p>
        </div>
      </div>
    );
  }

  return <AppBuilderContent />;
};

export default AppBuilder;

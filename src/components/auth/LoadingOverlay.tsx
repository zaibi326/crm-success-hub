
import React from 'react';

interface LoadingOverlayProps {
  isLoading: boolean;
  isSignUp: boolean;
}

const LoadingOverlay = ({ isLoading, isSignUp }: LoadingOverlayProps) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-crm-primary"></div>
          <span className="text-gray-700 font-medium">
            {isSignUp ? 'Creating your account...' : 'Signing you in...'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;

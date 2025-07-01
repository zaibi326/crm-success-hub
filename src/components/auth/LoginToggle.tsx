
import React from 'react';

interface LoginToggleProps {
  isSignUp: boolean;
  isLoading: boolean;
  onToggleMode: (e?: React.MouseEvent) => void;
}

const LoginToggle = ({ isSignUp, isLoading, onToggleMode }: LoginToggleProps) => {
  const handleToggleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Toggle button clicked, current mode:', isSignUp ? 'signup' : 'signin');
    console.log('About to call onToggleMode');
    onToggleMode(e);
  };

  console.log('LoginToggle rendering, isSignUp:', isSignUp);

  return (
    <div className="text-center pt-4 border-t border-white/20">
      <p className="text-gray-600">
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
      </p>
      <button
        type="button"
        onClick={handleToggleClick}
        className="mt-2 text-crm-primary hover:text-blue-700 font-semibold transition-colors duration-200 hover:underline disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-md hover:bg-white/10"
        disabled={isLoading}
      >
        {isSignUp ? 'Sign In Instead' : 'Create New Account'}
      </button>
    </div>
  );
};

export default LoginToggle;

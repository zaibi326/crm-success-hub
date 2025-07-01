
import React from 'react';

interface LoginToggleProps {
  isSignUp: boolean;
  isLoading: boolean;
  onToggleMode: () => void;
}

const LoginToggle = ({ isSignUp, isLoading, onToggleMode }: LoginToggleProps) => {
  console.log('LoginToggle render - isSignUp:', isSignUp);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('LoginToggle button clicked, current mode:', isSignUp ? 'signup' : 'signin');
    
    if (isLoading) {
      console.log('Click ignored - currently loading');
      return;
    }
    
    onToggleMode();
  };

  return (
    <div className="text-center pt-4 border-t border-white/20">
      <p className="text-gray-600">
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
      </p>
      <button
        type="button"
        onClick={handleClick}
        className="mt-2 text-crm-primary hover:text-blue-700 font-semibold transition-colors duration-200 hover:underline disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-md hover:bg-white/10"
        disabled={isLoading}
      >
        {isSignUp ? 'Sign In Instead' : 'Create New Account'}
      </button>
    </div>
  );
};

export default LoginToggle;

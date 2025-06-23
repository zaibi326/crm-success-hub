
import React from 'react';

interface LoginHeaderProps {
  isSignUp: boolean;
}

const LoginHeader = ({ isSignUp }: LoginHeaderProps) => {
  return (
    <div className="text-center space-y-2">
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 bg-crm-primary rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-xl">C</span>
        </div>
      </div>
      <h1 className="text-2xl font-bold text-gray-900">
        {isSignUp ? 'Create Account' : 'Welcome Back'}
      </h1>
      <p className="text-gray-600">
        {isSignUp ? 'Join SmartCRM today' : 'Sign in to your SmartCRM account'}
      </p>
    </div>
  );
};

export default LoginHeader;

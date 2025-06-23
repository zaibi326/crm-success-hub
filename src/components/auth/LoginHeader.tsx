
import React from 'react';

interface LoginHeaderProps {
  isSignUp: boolean;
}

const LoginHeader = ({ isSignUp }: LoginHeaderProps) => {
  return (
    <div className="text-center space-y-3">
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-crm-primary to-blue-700 rounded-2xl flex items-center justify-center shadow-xl hover:scale-105 transition-transform duration-300">
          <span className="text-white font-bold text-2xl">C</span>
        </div>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
        {isSignUp ? 'Create Account' : 'Welcome Back'}
      </h1>
      <p className="text-gray-600 text-lg">
        {isSignUp ? 'Join SmartCRM and transform your business' : 'Sign in to your SmartCRM account'}
      </p>
      
      {/* Trust indicators */}
      <div className="flex justify-center items-center space-x-6 mt-4 text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Trusted by 10k+ teams</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>99.9% uptime</span>
        </div>
      </div>
    </div>
  );
};

export default LoginHeader;


import React from 'react';
import { Activity } from 'lucide-react';

interface LoginHeaderProps {
  title?: string;
  subtitle?: string;
}

const LoginHeader = ({ title, subtitle }: LoginHeaderProps) => {
  return (
    <div className="text-center space-y-4">
      <div className="flex items-center justify-center">
        <div className="w-16 h-16 bg-gradient-to-br from-crm-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl hover:scale-105 transition-transform duration-300">
          <Activity className="w-8 h-8 text-white drop-shadow-lg" />
        </div>
      </div>
      
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          {title || 'Welcome Back'}
        </h1>
        <p className="text-gray-600 text-lg">
          {subtitle || 'Sign in to your account'}
        </p>
      </div>
    </div>
  );
};

export default LoginHeader;

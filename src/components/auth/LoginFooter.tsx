
import React from 'react';

const LoginFooter = () => {
  return (
    <div className="text-center mt-8">
      <p className="text-gray-500 text-sm animate-fade-in">
        🔒 Secure authentication powered by Heirlogic
      </p>
      <div className="flex justify-center mt-3 space-x-4 text-xs text-gray-400">
        <span>256-bit SSL</span>
        <span>•</span>
        <span>SOC 2 Compliant</span>
        <span>•</span>
        <span>GDPR Ready</span>
      </div>
    </div>
  );
};

export default LoginFooter;

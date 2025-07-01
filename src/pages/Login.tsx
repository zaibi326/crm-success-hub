
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRoleBasedRedirect } from '@/utils/roleRedirect';
import { useAuth } from '@/contexts/AuthContext';
import { useLoginLogic } from '@/hooks/useLoginLogic';
import ModernLoginForm from '@/components/auth/ModernLoginForm';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';
import { Toaster } from '@/components/ui/toaster';

const Login = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  
  const {
    isSignUp,
    showPassword,
    showConfirmPassword,
    isLoading,
    formData,
    handleInputChange,
    handleToggleMode,
    handleSubmit,
    setShowPassword,
    setShowConfirmPassword
  } = useLoginLogic();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user && profile) {
      const redirectPath = getRoleBasedRedirect(profile.role);
      navigate(redirectPath);
    }
  }, [user, profile, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EFF6FF] via-[#DBEAFE] to-[#BFDBFE] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/20 rounded-full blur-xl"></div>
        <div className="absolute top-1/4 -right-16 w-32 h-32 bg-blue-300/30 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-indigo-200/40 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-36 h-36 bg-white/10 rounded-full blur-2xl"></div>
      </div>

      {/* Main login container */}
      <div className="w-full max-w-md relative z-10">
        {/* Glass morphism card */}
        <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-3xl shadow-2xl p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h1>
              <p className="text-gray-600">
                {isSignUp ? 'Join our platform today' : 'Sign in to your account'}
              </p>
            </div>
          </div>

          {/* Login Form */}
          <ModernLoginForm
            isSignUp={isSignUp}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            formData={formData}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onToggleConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />

          {/* Social Login */}
          <SocialLoginButtons isLoading={isLoading} />

          {/* Toggle between login/signup */}
          <div className="text-center pt-6 border-t border-white/20">
            <p className="text-gray-600 mb-3">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </p>
            <button
              type="button"
              onClick={handleToggleMode}
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 hover:underline disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg hover:bg-white/10"
              disabled={isLoading}
            >
              {isSignUp ? 'Sign In Instead' : 'Create New Account'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 space-y-3">
          <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Secure authentication powered by SmartCRM
          </p>
          <div className="flex justify-center items-center space-x-4 text-xs text-gray-400">
            <span>256-bit SSL</span>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <span>SOC 2 Compliant</span>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <span>GDPR Ready</span>
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  );
};

export default Login;

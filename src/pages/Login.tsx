
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
  const { user, profile, isLoading } = useAuth();
  
  const {
    isSignUp,
    showPassword,
    showConfirmPassword,
    isLoading: formLoading,
    formData,
    handleInputChange,
    handleToggleMode,
    handleSubmit,
    setShowPassword,
    setShowConfirmPassword
  } = useLoginLogic();

  // Redirect if user is already logged in and profile is loaded
  useEffect(() => {
    if (user && profile && !isLoading) {
      console.log('User authenticated with profile:', profile.role);
      const redirectPath = getRoleBasedRedirect(profile.role);
      console.log('Redirecting to:', redirectPath);
      navigate(redirectPath, { replace: true });
    } else if (user && !profile && !isLoading) {
      // If user exists but profile failed to load, try redirecting to dashboard anyway
      console.log('User authenticated but no profile loaded, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [user, profile, isLoading, navigate]);

  // Show loading while auth state is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            <span className="text-gray-700 font-medium">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-200/30 rounded-full blur-xl"></div>
        <div className="absolute top-1/4 -right-16 w-32 h-32 bg-blue-300/40 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-indigo-200/50 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-36 h-36 bg-purple-100/20 rounded-full blur-2xl"></div>
      </div>

      {/* Main login container */}
      <div className="w-full max-w-md relative z-10">
        {/* Glass morphism card */}
        <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-3xl shadow-2xl p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 rounded-2xl shadow-lg">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {isSignUp ? 'Join Heirlogic' : 'Welcome Back'}
              </h1>
              <p className="text-gray-600">
                {isSignUp ? 'Create your account today' : 'Sign in to your Heirlogic CRM'}
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
            isLoading={formLoading}
          />

          {/* Social Login */}
          <SocialLoginButtons isLoading={formLoading} />

          {/* Toggle between login/signup */}
          <div className="text-center pt-6 border-t border-white/20">
            <p className="text-gray-600 mb-3">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </p>
            <button
              type="button"
              onClick={handleToggleMode}
              className="text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-200 hover:underline disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg hover:bg-white/10"
              disabled={formLoading}
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
            Secure authentication powered by Heirlogic
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

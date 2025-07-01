
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRoleBasedRedirect } from '@/utils/roleRedirect';
import { useAuth } from '@/contexts/AuthContext';
import { useLoginLogic } from '@/hooks/useLoginLogic';
import BackgroundDecoration from '@/components/auth/BackgroundDecoration';
import LoginHeader from '@/components/auth/LoginHeader';
import LoginForm from '@/components/auth/LoginForm';
import LoginToggle from '@/components/auth/LoginToggle';
import LoadingOverlay from '@/components/auth/LoadingOverlay';
import LoginFooter from '@/components/auth/LoginFooter';

const Login = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
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
    if (user) {
      const redirectPath = getRoleBasedRedirect(user.role);
      navigate(redirectPath);
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-crm-gradient-start via-blue-50 to-crm-gradient-end flex items-center justify-center p-4 relative overflow-hidden">
      <BackgroundDecoration />
      
      <div className="w-full max-w-md">
        <div className="bg-white/25 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 p-8 space-y-6 animate-fade-in">
          <LoginHeader isSignUp={isSignUp} />

          <LoginForm
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

          <LoginToggle
            isSignUp={isSignUp}
            isLoading={isLoading}
            onToggleMode={handleToggleMode}
          />
        </div>

        <LoginFooter />
      </div>

      <LoadingOverlay isLoading={isLoading} isSignUp={isSignUp} />
    </div>
  );
};

export default Login;

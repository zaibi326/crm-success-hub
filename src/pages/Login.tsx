
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { getRoleBasedRedirect } from '@/utils/roleRedirect';
import BackgroundDecoration from '@/components/auth/BackgroundDecoration';
import LoginHeader from '@/components/auth/LoginHeader';
import LoginForm from '@/components/auth/LoginForm';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Employee'
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (isSignUp && formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    // Simulate authentication success with role-based redirect
    const redirectPath = getRoleBasedRedirect(formData.role);
    
    toast({
      title: isSignUp ? "Account Created Successfully! 🎉" : "Welcome Back! 👋",
      description: `Successfully ${isSignUp ? 'created account and signed in' : 'logged in'} as ${formData.role}. Redirecting to your ${formData.role.toLowerCase()} dashboard...`,
      className: "animate-fade-in"
    });

    // Redirect based on role after a short delay
    setTimeout(() => {
      setIsLoading(false);
      navigate(redirectPath);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-crm-gradient-start via-blue-50 to-crm-gradient-end flex items-center justify-center p-4 relative overflow-hidden">
      <BackgroundDecoration />
      
      {/* Enhanced glassmorphic login form */}
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
          />

          {/* Toggle between sign in and sign up */}
          <div className="text-center">
            <p className="text-gray-600">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="ml-2 text-crm-primary hover:text-blue-700 font-semibold transition-colors duration-200 hover:underline"
                disabled={isLoading}
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm animate-fade-in">
            🔒 Secure authentication powered by SmartCRM
          </p>
          <div className="flex justify-center mt-3 space-x-4 text-xs text-gray-400">
            <span>256-bit SSL</span>
            <span>•</span>
            <span>SOC 2 Compliant</span>
            <span>•</span>
            <span>GDPR Ready</span>
          </div>
        </div>
      </div>

      {/* Loading overlay */}
      {isLoading && (
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
      )}
    </div>
  );
};

export default Login;

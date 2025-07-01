
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { getRoleBasedRedirect } from '@/utils/roleRedirect';
import { useAuth } from '@/contexts/AuthContext';

export const useLoginLogic = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'Employee'
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login, signup, resetPassword } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleToggleMode = () => {
    if (isLoading) return;
    
    setIsSignUp(!isSignUp);
    setIsResetMode(false);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      role: 'Employee'
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleResetMode = () => {
    if (isLoading) return;
    
    setIsResetMode(!isResetMode);
    setIsSignUp(false);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      role: 'Employee'
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const validateForm = () => {
    if (isResetMode) {
      if (!formData.email) {
        toast({
          title: "Missing Email",
          description: "Please enter your email address.",
          variant: "destructive"
        });
        return false;
      }
      return true;
    }

    if (!formData.email || !formData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return false;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return false;
    }

    if (isSignUp) {
      if (!formData.confirmPassword) {
        toast({
          title: "Missing Confirmation",
          description: "Please confirm your password.",
          variant: "destructive"
        });
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Password Mismatch",
          description: "Passwords do not match. Please try again.",
          variant: "destructive"
        });
        return false;
      }

      if (!formData.role) {
        toast({
          title: "Missing Role",
          description: "Please select your role.",
          variant: "destructive"
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!validateForm()) {
        return;
      }

      if (isResetMode) {
        const result = await resetPassword(formData.email);
        
        if (result.success) {
          toast({
            title: "Reset Email Sent! 📧",
            description: "Please check your email for password reset instructions.",
          });
          setIsResetMode(false);
          setFormData(prev => ({ ...prev, email: '' }));
        } else {
          toast({
            title: "Reset Failed",
            description: result.error || "Please try again.",
            variant: "destructive"
          });
        }
        return;
      }

      const result = isSignUp 
        ? await signup(formData.email, formData.password, formData.role, formData.firstName, formData.lastName)
        : await login(formData.email, formData.password);

      if (result.success) {
        if (isSignUp && result.error) {
          // Email confirmation required
          toast({
            title: "Account Created! 🎉",
            description: result.error,
            className: "animate-fade-in"
          });
        } else {
          const redirectPath = getRoleBasedRedirect(formData.role);
          
          toast({
            title: isSignUp ? "Account Created Successfully! 🎉" : "Welcome Back! 👋",
            description: `Successfully ${isSignUp ? 'created account' : 'logged in'}. Redirecting to your dashboard...`,
            className: "animate-fade-in"
          });

          setTimeout(() => {
            navigate(redirectPath);
          }, 1500);
        }
      } else {
        toast({
          title: "Authentication Failed",
          description: result.error || "Please check your credentials and try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isSignUp,
    isResetMode,
    showPassword,
    showConfirmPassword,
    isLoading,
    formData,
    handleInputChange,
    handleToggleMode,
    handleResetMode,
    handleSubmit,
    setShowPassword,
    setShowConfirmPassword
  };
};

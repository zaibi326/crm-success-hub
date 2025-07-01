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
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Employee'
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleToggleMode = () => {
    console.log('Toggle clicked, current mode:', isSignUp ? 'signup' : 'signin');
    
    if (isLoading) {
      console.log('Toggle blocked - currently loading');
      return;
    }
    
    // Simply toggle the mode
    setIsSignUp(!isSignUp);
    
    // Clear form data when switching modes
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      role: 'Employee'
    });
    
    // Reset password visibility
    setShowPassword(false);
    setShowConfirmPassword(false);
    
    console.log('Mode toggled to:', !isSignUp ? 'signup' : 'signin');
  };

  const validateForm = () => {
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

      console.log('Attempting authentication with:', { 
        email: formData.email, 
        role: formData.role, 
        isSignUp 
      });

      const result = isSignUp 
        ? await signup(formData.email, formData.password, formData.role)
        : await login(formData.email, formData.password, formData.role);

      console.log('Authentication result:', result);

      if (result.success) {
        const redirectPath = getRoleBasedRedirect(formData.role);
        
        toast({
          title: isSignUp ? "Account Created Successfully! 🎉" : "Welcome Back! 👋",
          description: `Successfully ${isSignUp ? 'created account and signed in' : 'logged in'} as ${formData.role}. Redirecting to your ${formData.role.toLowerCase()} dashboard...`,
          className: "animate-fade-in"
        });

        setTimeout(() => {
          navigate(redirectPath);
        }, 1500);
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
    showPassword,
    showConfirmPassword,
    isLoading,
    formData,
    handleInputChange,
    handleToggleMode,
    handleSubmit,
    setShowPassword,
    setShowConfirmPassword
  };
};

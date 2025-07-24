
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthActivityTracking } from '@/hooks/useAuthActivityTracking';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  firstName: string;
  lastName: string;
}

export function useLoginLogic() {
  const { login, signup } = useAuth();
  const { trackUserLogin, trackUserRegistered } = useAuthActivityTracking();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Employee',
    firstName: '',
    lastName: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggleMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      role: 'Employee',
      firstName: '',
      lastName: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        
        const result = await signup(
          formData.email,
          formData.password,
          formData.role,
          formData.firstName,
          formData.lastName
        );
        
        if (result.success) {
          // Track successful registration
          trackUserRegistered(formData.email, formData.role);
        }
      } else {
        const result = await login(formData.email, formData.password);
        
        if (result.success) {
          // Track successful login
          trackUserLogin(formData.email);
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
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
}


import { useComprehensiveActivityLogger } from './useComprehensiveActivityLogger';
import { useAuth } from '@/contexts/AuthContext';

export function useAuthActivityTracking() {
  const { logAuthActivity } = useComprehensiveActivityLogger();
  const { user, isLoading } = useAuth();

  const trackUserRegistered = (email: string, role: string) => {
    if (!user?.id || isLoading) return;
    
    logAuthActivity(
      'registered',
      `New user registered with email ${email}`,
      {
        email,
        role,
        registrationMethod: 'email'
      }
    );
  };

  const trackUserLogin = (email: string) => {
    if (!user?.id || isLoading) return;
    
    logAuthActivity(
      'login',
      `User logged in: ${email}`,
      {
        email,
        loginMethod: 'email'
      }
    );
  };

  const trackUserLogout = (email: string) => {
    if (!user?.id || isLoading) return;
    
    logAuthActivity(
      'logout',
      `User logged out: ${email}`,
      {
        email
      }
    );
  };

  const trackPasswordReset = (email: string) => {
    if (!user?.id || isLoading) return;
    
    logAuthActivity(
      'password_reset',
      `Password reset requested for ${email}`,
      {
        email
      }
    );
  };

  const trackEmailVerification = (email: string) => {
    if (!user?.id || isLoading) return;
    
    logAuthActivity(
      'email_verified',
      `Email verified for ${email}`,
      {
        email
      }
    );
  };

  return {
    trackUserRegistered,
    trackUserLogin,
    trackUserLogout,
    trackPasswordReset,
    trackEmailVerification
  };
}


import { useComprehensiveActivityLogger } from './useComprehensiveActivityLogger';

export function useAuthActivityTracking() {
  const { logAuthActivity } = useComprehensiveActivityLogger();

  const trackUserRegistered = (email: string, role: string) => {
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
    logAuthActivity(
      'logout',
      `User logged out: ${email}`,
      {
        email
      }
    );
  };

  const trackPasswordReset = (email: string) => {
    logAuthActivity(
      'password_reset',
      `Password reset requested for ${email}`,
      {
        email
      }
    );
  };

  const trackEmailVerification = (email: string) => {
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

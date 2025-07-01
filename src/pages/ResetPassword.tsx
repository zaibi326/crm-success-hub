
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Eye, EyeClosed } from 'lucide-react';
import BackgroundDecoration from '@/components/auth/BackgroundDecoration';
import LoginHeader from '@/components/auth/LoginHeader';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');

    if (accessToken && refreshToken) {
      // Set the session with the tokens from the URL
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      });
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (password.length < 6) {
        toast({
          title: "Password Too Short",
          description: "Password must be at least 6 characters long.",
          variant: "destructive"
        });
        return;
      }

      if (password !== confirmPassword) {
        toast({
          title: "Password Mismatch",
          description: "Passwords do not match. Please try again.",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        toast({
          title: "Reset Failed",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Password Updated! 🎉",
        description: "Your password has been successfully updated. You can now sign in with your new password.",
      });

      // Redirect to login after success
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-crm-gradient-start via-blue-50 to-crm-gradient-end flex items-center justify-center p-4 relative overflow-hidden">
      <BackgroundDecoration />
      
      <div className="w-full max-w-md">
        <div className="bg-white/25 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 p-8 space-y-6 animate-fade-in">
          <LoginHeader 
            title="Set New Password"
            subtitle="Enter your new password below"
          />

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-white/50 border-white/30 backdrop-blur-sm focus:bg-white/70 transition-all shadow-lg hover:shadow-xl focus:shadow-xl rounded-xl h-12"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeClosed className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10 bg-white/50 border-white/30 backdrop-blur-sm focus:bg-white/70 transition-all shadow-lg hover:shadow-xl focus:shadow-xl rounded-xl h-12"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeClosed className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-crm-primary to-blue-700 hover:from-blue-700 hover:to-crm-primary text-white font-semibold py-3 rounded-xl transition-all hover:scale-105 shadow-lg hover:shadow-xl duration-300 transform h-12 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Updating Password...
                </div>
              ) : (
                'Update Password'
              )}
            </Button>

            {/* Back to login */}
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/login')}
              disabled={isLoading}
              className="w-full"
            >
              Back to Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeClosed, Lock, Mail, User } from 'lucide-react';
import SocialLogin from './SocialLogin';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface LoginFormProps {
  isSignUp: boolean;
  isResetMode: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
  formData: FormData;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onResetMode: () => void;
  isLoading: boolean;
}

const LoginForm = ({
  isSignUp,
  isResetMode,
  showPassword,
  showConfirmPassword,
  formData,
  onTogglePassword,
  onToggleConfirmPassword,
  onInputChange,
  onSubmit,
  onResetMode,
  isLoading
}: LoginFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Email field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            className="pl-10 bg-white/50 border-white/30 backdrop-blur-sm focus:bg-white/70 transition-all shadow-lg hover:shadow-xl focus:shadow-xl rounded-xl h-12"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Name fields for signup */}
      {isSignUp && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-gray-700 font-medium">First Name</Label>
            <Input
              id="firstName"
              type="text"
              placeholder="First name"
              value={formData.firstName}
              onChange={(e) => onInputChange('firstName', e.target.value)}
              className="bg-white/50 border-white/30 backdrop-blur-sm focus:bg-white/70 transition-all shadow-lg hover:shadow-xl focus:shadow-xl rounded-xl h-12"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-gray-700 font-medium">Last Name</Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Last name"
              value={formData.lastName}
              onChange={(e) => onInputChange('lastName', e.target.value)}
              className="bg-white/50 border-white/30 backdrop-blur-sm focus:bg-white/70 transition-all shadow-lg hover:shadow-xl focus:shadow-xl rounded-xl h-12"
              disabled={isLoading}
            />
          </div>
        </div>
      )}

      {/* Password field (hidden in reset mode) */}
      {!isResetMode && (
        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => onInputChange('password', e.target.value)}
              className="pl-10 pr-10 bg-white/50 border-white/30 backdrop-blur-sm focus:bg-white/70 transition-all shadow-lg hover:shadow-xl focus:shadow-xl rounded-xl h-12"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isLoading}
            >
              {showPassword ? <EyeClosed className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Confirm Password field (only for sign up) */}
      {isSignUp && !isResetMode && (
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => onInputChange('confirmPassword', e.target.value)}
              className="pl-10 pr-10 bg-white/50 border-white/30 backdrop-blur-sm focus:bg-white/70 transition-all shadow-lg hover:shadow-xl focus:shadow-xl rounded-xl h-12"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={onToggleConfirmPassword}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isLoading}
            >
              {showConfirmPassword ? <EyeClosed className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Role selection (only for sign up) */}
      {isSignUp && !isResetMode && (
        <div className="space-y-2">
          <Label htmlFor="role" className="text-gray-700 font-medium">Role</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
            <Select
              value={formData.role}
              onValueChange={(value) => onInputChange('role', value)}
              disabled={isLoading}
            >
              <SelectTrigger className="pl-10 bg-white/50 border-white/30 backdrop-blur-sm focus:bg-white/70 transition-all shadow-lg hover:shadow-xl focus:shadow-xl rounded-xl h-12">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-xl border-white/40 shadow-2xl">
                <SelectItem value="Employee">Employee</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Forgot password link */}
      {!isSignUp && !isResetMode && (
        <div className="text-right">
          <button
            type="button"
            onClick={onResetMode}
            className="text-sm text-crm-primary hover:text-blue-700 transition-colors"
            disabled={isLoading}
          >
            Forgot Password?
          </button>
        </div>
      )}

      {/* Submit button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-crm-primary to-blue-700 hover:from-blue-700 hover:to-crm-primary text-white font-semibold py-3 rounded-xl transition-all hover:scale-105 shadow-lg hover:shadow-xl duration-300 transform h-12 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            {isResetMode ? 'Sending Reset Email...' : isSignUp ? 'Creating Account...' : 'Signing In...'}
          </div>
        ) : (
          isResetMode ? 'Send Reset Email' : isSignUp ? 'Create Account' : 'Sign In'
        )}
      </Button>

      {/* Back to login from reset mode */}
      {isResetMode && (
        <Button
          type="button"
          variant="outline"
          onClick={onResetMode}
          disabled={isLoading}
          className="w-full"
        >
          Back to Sign In
        </Button>
      )}

      {/* Social Login (only if not in reset mode) */}
      {!isResetMode && <SocialLogin isLoading={isLoading} />}
    </form>
  );
};

export default LoginForm;

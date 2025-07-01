
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
  role: string;
}

interface LoginFormProps {
  isSignUp: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
  formData: FormData;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const LoginForm = ({
  isSignUp,
  showPassword,
  showConfirmPassword,
  formData,
  onTogglePassword,
  onToggleConfirmPassword,
  onInputChange,
  onSubmit,
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

      {/* Password field */}
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

      {/* Confirm Password field (only for sign up) */}
      {isSignUp && (
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

      {/* Role selection */}
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

      {/* Submit button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-crm-primary to-blue-700 hover:from-blue-700 hover:to-crm-primary text-white font-semibold py-3 rounded-xl transition-all hover:scale-105 shadow-lg hover:shadow-xl duration-300 transform h-12 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            {isSignUp ? 'Creating Account...' : 'Signing In...'}
          </div>
        ) : (
          isSignUp ? 'Create Account' : 'Sign In'
        )}
      </Button>

      {/* Social Login */}
      <SocialLogin isLoading={isLoading} />
    </form>
  );
};

export default LoginForm;

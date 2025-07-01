
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface ModernLoginFormProps {
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

const ModernLoginForm = ({
  isSignUp,
  showPassword,
  showConfirmPassword,
  formData,
  onTogglePassword,
  onToggleConfirmPassword,
  onInputChange,
  onSubmit,
  isLoading
}: ModernLoginFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Email field */}
      <div className="space-y-2">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
          <Input
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            className="pl-12 h-14 bg-white/40 backdrop-blur-sm border-white/30 rounded-2xl shadow-lg hover:shadow-xl focus:shadow-xl focus:bg-white/60 transition-all duration-300 text-gray-800 placeholder-gray-500"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Name fields for signup */}
      {isSignUp && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
              <Input
                type="text"
                placeholder="First name"
                value={formData.firstName}
                onChange={(e) => onInputChange('firstName', e.target.value)}
                className="pl-12 h-14 bg-white/40 backdrop-blur-sm border-white/30 rounded-2xl shadow-lg hover:shadow-xl focus:shadow-xl focus:bg-white/60 transition-all duration-300 text-gray-800 placeholder-gray-500"
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
              <Input
                type="text"
                placeholder="Last name"
                value={formData.lastName}
                onChange={(e) => onInputChange('lastName', e.target.value)}
                className="pl-12 h-14 bg-white/40 backdrop-blur-sm border-white/30 rounded-2xl shadow-lg hover:shadow-xl focus:shadow-xl focus:bg-white/60 transition-all duration-300 text-gray-800 placeholder-gray-500"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      )}

      {/* Password field */}
      <div className="space-y-2">
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => onInputChange('password', e.target.value)}
            className="pl-12 pr-12 h-14 bg-white/40 backdrop-blur-sm border-white/30 rounded-2xl shadow-lg hover:shadow-xl focus:shadow-xl focus:bg-white/60 transition-all duration-300 text-gray-800 placeholder-gray-500"
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
            disabled={isLoading}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Confirm Password field (only for sign up) */}
      {isSignUp && (
        <div className="space-y-2">
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => onInputChange('confirmPassword', e.target.value)}
              className="pl-12 pr-12 h-14 bg-white/40 backdrop-blur-sm border-white/30 rounded-2xl shadow-lg hover:shadow-xl focus:shadow-xl focus:bg-white/60 transition-all duration-300 text-gray-800 placeholder-gray-500"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={onToggleConfirmPassword}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
              disabled={isLoading}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
      )}

      {/* Role selection (only for sign up) */}
      {isSignUp && (
        <div className="space-y-2">
          <div className="relative">
            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
            <Select
              value={formData.role}
              onValueChange={(value) => onInputChange('role', value)}
              disabled={isLoading}
            >
              <SelectTrigger className="pl-12 h-14 bg-white/40 backdrop-blur-sm border-white/30 rounded-2xl shadow-lg hover:shadow-xl focus:shadow-xl focus:bg-white/60 transition-all duration-300 text-gray-800">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-xl border-white/40 shadow-2xl rounded-xl">
                <SelectItem value="Employee">Employee</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Submit button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            {isSignUp ? 'Creating Account...' : 'Signing In...'}
          </div>
        ) : (
          isSignUp ? 'Create Account' : 'Sign In'
        )}
      </Button>
    </form>
  );
};

export default ModernLoginForm;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeClosed, Lock, Mail } from 'lucide-react';

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
}

const LoginForm = ({
  isSignUp,
  showPassword,
  showConfirmPassword,
  formData,
  onTogglePassword,
  onToggleConfirmPassword,
  onInputChange,
  onSubmit
}: LoginFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
            className="pl-10 bg-white/50 border-white/30 backdrop-blur-sm focus:bg-white/70 transition-all"
            required
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
            className="pl-10 pr-10 bg-white/50 border-white/30 backdrop-blur-sm focus:bg-white/70 transition-all"
            required
          />
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
              className="pl-10 pr-10 bg-white/50 border-white/30 backdrop-blur-sm focus:bg-white/70 transition-all"
              required
            />
            <button
              type="button"
              onClick={onToggleConfirmPassword}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeClosed className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Role selection */}
      <div className="space-y-2">
        <Label htmlFor="role" className="text-gray-700 font-medium">Role</Label>
        <select
          id="role"
          value={formData.role}
          onChange={(e) => onInputChange('role', e.target.value)}
          className="w-full px-3 py-2 bg-white/50 border border-white/30 rounded-md backdrop-blur-sm focus:bg-white/70 focus:outline-none focus:ring-2 focus:ring-crm-primary transition-all"
        >
          <option value="Employee">Employee</option>
          <option value="Manager">Manager</option>
          <option value="Admin">Admin</option>
        </select>
      </div>

      {/* Submit button */}
      <Button
        type="submit"
        className="w-full bg-crm-primary hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-all hover:scale-105 shadow-lg"
      >
        {isSignUp ? 'Create Account' : 'Sign In'}
      </Button>
    </form>
  );
};

export default LoginForm;

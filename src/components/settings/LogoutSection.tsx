
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LogoutSection = () => {
  const { logout, profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <LogOut className="w-5 h-5" />
          Logout
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-800">Sign Out of Your Account</h3>
            <p className="text-sm text-red-700 mt-1">
              You will be signed out of your account and redirected to the login page. 
              Any unsaved changes will be lost.
            </p>
          </div>
        </div>

        {profile && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Current Session</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium">User:</span> {profile.first_name} {profile.last_name}</p>
              <p><span className="font-medium">Email:</span> {profile.email}</p>
              <p><span className="font-medium">Role:</span> {profile.role}</p>
            </div>
          </div>
        )}

        <div className="pt-4 border-t">
          <Button 
            onClick={handleLogout}
            variant="destructive"
            className="w-full sm:w-auto"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LogoutSection;

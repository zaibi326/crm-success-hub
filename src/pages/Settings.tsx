
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import ProfileSection from '@/components/settings/ProfileSection';
import SecuritySection from '@/components/settings/SecuritySection';
import RoleBasedSettings from '@/components/settings/RoleBasedSettings';
import AdminUsersSection from '@/components/settings/AdminUsersSection';
import { LogOut, User, Shield, Settings as SettingsIcon, Crown } from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, logout } = useAuth();

  const handleLogout = () => {
    logout();
    
    toast({
      title: "Logged Out Successfully",
      description: "You have been securely logged out of your account.",
    });

    // Redirect to login page
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  const getUserRole = (): 'Admin' | 'Manager' | 'Employee' => {
    const role = profile?.role || 'Employee';
    if (role === 'Admin' || role === 'Manager' || role === 'Employee') {
      return role;
    }
    return 'Employee';
  };

  const isAdmin = getUserRole() === 'Admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-crm-gradient-start via-white to-crm-gradient-end">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset className="flex-1 overflow-auto bg-gradient-to-br from-crm-gradient-start via-white to-crm-gradient-end">
            <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-6 py-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg transition-all duration-200" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                    <p className="text-sm text-gray-600 mt-0.5">
                      Manage your account and preferences - {getUserRole()} Dashboard
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={handleLogout}
                  variant="outline" 
                  className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </header>
            
            <main className="p-6">
              <div className="max-w-6xl mx-auto">
                <Tabs defaultValue="profile" className="space-y-6">
                  <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-4' : 'grid-cols-3'} lg:w-auto bg-white shadow-sm`}>
                    <TabsTrigger value="profile" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Profile
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Security
                    </TabsTrigger>
                    <TabsTrigger value="role-settings" className="flex items-center gap-2">
                      <SettingsIcon className="w-4 h-4" />
                      Role Settings
                    </TabsTrigger>
                    {isAdmin && (
                      <TabsTrigger value="admin" className="flex items-center gap-2">
                        <Crown className="w-4 h-4" />
                        Admin
                      </TabsTrigger>
                    )}
                  </TabsList>

                  <TabsContent value="profile" className="space-y-6">
                    <ProfileSection />
                  </TabsContent>

                  <TabsContent value="security" className="space-y-6">
                    <SecuritySection />
                  </TabsContent>

                  <TabsContent value="role-settings" className="space-y-6">
                    <RoleBasedSettings userRole={getUserRole()} />
                  </TabsContent>

                  {isAdmin && (
                    <TabsContent value="admin" className="space-y-6">
                      <AdminUsersSection />
                    </TabsContent>
                  )}
                </Tabs>

                {/* Quick Actions Card */}
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      <Button variant="outline" onClick={() => navigate('/dashboard')}>
                        Back to Dashboard
                      </Button>
                      <Button variant="outline" onClick={() => navigate('/leads')}>
                        Manage Leads
                      </Button>
                      <Button variant="outline" onClick={() => navigate('/campaigns')}>
                        View Campaigns
                      </Button>
                      <Button variant="outline" onClick={() => navigate('/lead-source')}>
                        Lead Sources
                      </Button>
                      {(getUserRole() === 'Admin' || getUserRole() === 'Manager') && (
                        <Button variant="outline" onClick={() => navigate('/notifications')}>
                          Team Notifications
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Settings;


import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import ProfileSection from '@/components/settings/ProfileSection';
import SecuritySection from '@/components/settings/SecuritySection';
import RoleBasedSettings from '@/components/settings/RoleBasedSettings';
import LeadSourceSection from '@/components/settings/LeadSourceSection';
import AdminUsersSection from '@/components/settings/AdminUsersSection';
import LogoutSection from '@/components/settings/LogoutSection';
import { User, Shield, Settings as SettingsIcon, Database, Crown, LogOut } from 'lucide-react';

const Settings = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const canAccessAdminTab = profile?.role === 'Admin';

  // Type-safe role casting
  const getUserRole = (): 'Admin' | 'Manager' | 'Lead Manager' | 'Employee' | 'Guest' => {
    const role = profile?.role;
    if (role === 'Admin' || role === 'Manager' || role === 'Lead Manager' || role === 'Employee' || role === 'Guest') {
      return role;
    }
    return 'Employee'; // Default fallback
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-crm-gradient-start via-white to-crm-gradient-end">
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset className="flex-1 overflow-auto bg-gradient-to-br from-crm-gradient-start via-white to-crm-gradient-end">
            <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-6 py-4 shadow-sm">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg transition-all duration-200" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                  <p className="text-sm text-gray-600 mt-0.5">Manage your account and application settings</p>
                </div>
              </div>
            </header>
            
            <main className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-6 mb-6">
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
                  <TabsTrigger value="lead-source" className="flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Lead Source
                  </TabsTrigger>
                  {canAccessAdminTab && (
                    <TabsTrigger value="admin" className="flex items-center gap-2">
                      <Crown className="w-4 h-4" />
                      Admin
                    </TabsTrigger>
                  )}
                  <TabsTrigger value="logout" className="flex items-center gap-2 text-red-600">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="mt-6">
                  <ProfileSection />
                </TabsContent>

                <TabsContent value="security" className="mt-6">
                  <SecuritySection />
                </TabsContent>

                <TabsContent value="role-settings" className="mt-6">
                  <RoleBasedSettings userRole={getUserRole()} />
                </TabsContent>

                <TabsContent value="lead-source" className="mt-6">
                  <LeadSourceSection />
                </TabsContent>

                {canAccessAdminTab && (
                  <TabsContent value="admin" className="mt-6">
                    <AdminUsersSection />
                  </TabsContent>
                )}

                <TabsContent value="logout" className="mt-6">
                  <LogoutSection />
                </TabsContent>
              </Tabs>
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Settings;

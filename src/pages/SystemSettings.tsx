
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Settings, Shield, Database, Mail, Bell, Globe } from 'lucide-react';

const SystemSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const { toast } = useToast();

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "System settings have been updated successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-crm-gradient-start via-white to-crm-gradient-end">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset className="flex-1 overflow-auto">
            <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-6 py-4 shadow-sm">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg transition-all duration-200" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Settings className="w-6 h-6" />
                    System Settings
                  </h1>
                  <p className="text-sm text-gray-600 mt-0.5">
                    Configure system-wide settings and preferences
                  </p>
                </div>
              </div>
            </header>
            
            <main className="p-6">
              <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
                  <TabsTrigger value="general" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    General
                  </TabsTrigger>
                  <TabsTrigger value="security" className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Security
                  </TabsTrigger>
                  <TabsTrigger value="database" className="flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Database
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Notifications
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        General Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="company-name">Company Name</Label>
                          <Input id="company-name" defaultValue="Heirlogic" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="timezone">Timezone</Label>
                          <Input id="timezone" defaultValue="UTC" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company-address">Company Address</Label>
                        <Input id="company-address" placeholder="Enter company address" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base">Maintenance Mode</Label>
                          <p className="text-sm text-gray-600">Enable maintenance mode to restrict access</p>
                        </div>
                        <Switch 
                          checked={maintenanceMode} 
                          onCheckedChange={setMaintenanceMode}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Security Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                        <Input id="session-timeout" type="number" defaultValue="30" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="max-login-attempts">Maximum Login Attempts</Label>
                        <Input id="max-login-attempts" type="number" defaultValue="5" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base">Two-Factor Authentication</Label>
                          <p className="text-sm text-gray-600">Require 2FA for all admin users</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base">Password Complexity</Label>
                          <p className="text-sm text-gray-600">Enforce strong password requirements</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="database" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Database className="w-5 h-5" />
                        Database Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base">Automatic Backups</Label>
                          <p className="text-sm text-gray-600">Enable daily automatic backups</p>
                        </div>
                        <Switch 
                          checked={autoBackup} 
                          onCheckedChange={setAutoBackup}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="backup-retention">Backup Retention (days)</Label>
                        <Input id="backup-retention" type="number" defaultValue="30" />
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline">
                          <Database className="w-4 h-4 mr-2" />
                          Backup Now
                        </Button>
                        <Button variant="outline">
                          <Database className="w-4 h-4 mr-2" />
                          Restore Backup
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        Notification Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base">Email Notifications</Label>
                          <p className="text-sm text-gray-600">Send system notifications via email</p>
                        </div>
                        <Switch 
                          checked={emailNotifications} 
                          onCheckedChange={setEmailNotifications}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="admin-email">Admin Email</Label>
                        <Input id="admin-email" type="email" placeholder="admin@heirlogic.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtp-server">SMTP Server</Label>
                        <Input id="smtp-server" placeholder="smtp.gmail.com" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="smtp-port">SMTP Port</Label>
                          <Input id="smtp-port" defaultValue="587" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="smtp-username">SMTP Username</Label>
                          <Input id="smtp-username" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <div className="flex justify-end">
                  <Button onClick={handleSaveSettings} className="px-8">
                    Save Settings
                  </Button>
                </div>
              </Tabs>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default SystemSettings;

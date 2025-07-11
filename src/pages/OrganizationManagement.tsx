
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { OrganizationManager } from '@/components/organization/OrganizationManager';
import { UserInvitationManager } from '@/components/organization/UserInvitationManager';
import { Building2, Users, Settings2, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const OrganizationManagement = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-crm-gradient-start via-white to-crm-gradient-end">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset className="flex-1 overflow-auto">
            <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-200/60 px-6 py-4 shadow-sm">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg transition-all duration-200" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-blue-600" />
                    Organization Management
                  </h1>
                  <p className="text-sm text-gray-600 mt-0.5">
                    Manage organizations, users, and workspaces
                  </p>
                </div>
              </div>
            </header>
            
            <main className="p-6">
              <div className="max-w-7xl mx-auto">
                <Tabs defaultValue="organizations" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="organizations" className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Organizations
                    </TabsTrigger>
                    <TabsTrigger value="users" className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      User Management
                    </TabsTrigger>
                    <TabsTrigger value="permissions" className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Permissions
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="organizations" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Building2 className="w-5 h-5" />
                          Organization Overview
                        </CardTitle>
                        <CardDescription>
                          Manage your organization settings and structure
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <OrganizationManager />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="users" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="w-5 h-5" />
                          User Invitations & Management
                        </CardTitle>
                        <CardDescription>
                          Invite new users and manage existing team members
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <UserInvitationManager />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="permissions" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="w-5 h-5" />
                          Role Permissions
                        </CardTitle>
                        <CardDescription>
                          Configure access levels and permissions for different roles
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">Admin</CardTitle>
                                <CardDescription>Full system access</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <ul className="text-sm space-y-1">
                                  <li>• Manage organizations</li>
                                  <li>• User management</li>
                                  <li>• System settings</li>
                                  <li>• All CRM features</li>
                                </ul>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">Manager</CardTitle>
                                <CardDescription>Team management access</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <ul className="text-sm space-y-1">
                                  <li>• Manage team leads</li>
                                  <li>• Campaign management</li>
                                  <li>• Reports & analytics</li>
                                  <li>• Communication tools</li>
                                </ul>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">Employee</CardTitle>
                                <CardDescription>Standard user access</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <ul className="text-sm space-y-1">
                                  <li>• View assigned leads</li>
                                  <li>• Basic communication</li>
                                  <li>• Update lead status</li>
                                  <li>• Personal dashboard</li>
                                </ul>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default OrganizationManagement;

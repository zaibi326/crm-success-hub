import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Users, Settings, Plus, Mail, Shield, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UserInvitationManager } from './UserInvitationManager';

export function OrganizationManager() {
  const [newOrgName, setNewOrgName] = useState('');
  const { toast } = useToast();

  const mockOrganizations = [
    {
      id: 1,
      name: 'Heirlogic Real Estate',
      identifier: 'HRE-001',
      adminCount: 2,
      memberCount: 15,
      workspaces: 3,
      status: 'active'
    },
    {
      id: 2,
      name: 'Property Solutions Inc',
      identifier: 'PSI-002',
      adminCount: 1,
      memberCount: 8,
      workspaces: 2,
      status: 'active'
    }
  ];

  const mockUsers = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john@heirlogic.com',
      role: 'Admin',
      organization: 'Heirlogic Real Estate',
      lastLogin: '2024-01-15 10:30',
      status: 'active'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@heirlogic.com',
      role: 'Manager',
      organization: 'Heirlogic Real Estate',
      lastLogin: '2024-01-14 15:45',
      status: 'active'
    },
    {
      id: 3,
      name: 'Mike Davis',
      email: 'mike@propertysolutions.com',
      role: 'Employee',
      organization: 'Property Solutions Inc',
      lastLogin: '2024-01-13 09:15',
      status: 'invited'
    }
  ];

  const mockWorkspaces = [
    {
      id: 1,
      name: 'Tax Lien Division',
      organization: 'Heirlogic Real Estate',
      members: 8,
      campaigns: 5,
      leads: 120
    },
    {
      id: 2,
      name: 'Probate Team',
      organization: 'Heirlogic Real Estate',
      members: 4,
      campaigns: 3,
      leads: 85
    },
    {
      id: 3,
      name: 'Commercial Properties',
      organization: 'Property Solutions Inc',
      members: 6,
      campaigns: 2,
      leads: 45
    }
  ];

  const handleCreateOrganization = () => {
    if (newOrgName.trim()) {
      toast({
        title: "Organization Created",
        description: `${newOrgName} has been created successfully.`,
      });
      setNewOrgName('');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-red-100 text-red-800';
      case 'Manager': return 'bg-blue-100 text-blue-800';
      case 'Employee': return 'bg-green-100 text-green-800';
      case 'External Client': return 'bg-purple-100 text-purple-800';
      case 'Guest': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="organizations" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="workspaces">Workspaces</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="organizations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Create New Organization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Input
                  placeholder="Organization name..."
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleCreateOrganization}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockOrganizations.map((org) => (
              <Card key={org.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{org.name}</span>
                    <Badge variant="outline">{org.identifier}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{org.adminCount}</p>
                      <p className="text-sm text-gray-600">Admins</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">{org.memberCount}</p>
                      <p className="text-sm text-gray-600">Members</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-600">{org.workspaces}</p>
                      <p className="text-sm text-gray-600">Workspaces</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Settings className="w-4 h-4 mr-1" />
                      Manage
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Users className="w-4 h-4 mr-1" />
                      Members
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-500">{user.organization}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Last login:</p>
                        <p className="text-xs text-gray-500">{user.lastLogin}</p>
                      </div>
                      <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workspaces" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockWorkspaces.map((workspace) => (
              <Card key={workspace.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{workspace.name}</CardTitle>
                  <p className="text-sm text-gray-600">{workspace.organization}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-lg font-bold text-blue-600">{workspace.members}</p>
                      <p className="text-xs text-gray-600">Members</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-green-600">{workspace.campaigns}</p>
                      <p className="text-xs text-gray-600">Campaigns</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-purple-600">{workspace.leads}</p>
                      <p className="text-xs text-gray-600">Leads</p>
                    </div>
                  </div>
                  <Button size="sm" className="w-full">
                    Manage Workspace
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="invitations" className="space-y-6">
          <UserInvitationManager />
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Role Permissions Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { 
                      role: 'Admin', 
                      permissions: [
                        'Full System Access',
                        'User Management', 
                        'Organization Management',
                        'System Settings', 
                        'All Campaigns & Leads',
                        'Financial Data Access',
                        'Integration Management'
                      ] 
                    },
                    { 
                      role: 'Manager', 
                      permissions: [
                        'Team Management', 
                        'Campaign Creation & Management',
                        'Lead Assignment & Oversight', 
                        'Reporting & Analytics',
                        'Workspace Administration',
                        'User Activity Monitoring'
                      ] 
                    },
                    { 
                      role: 'Employee', 
                      permissions: [
                        'Lead Management (Assigned)',
                        'Campaign Participation', 
                        'Basic Reporting',
                        'Profile Management',
                        'Communication Tools',
                        'Task Management'
                      ] 
                    },
                    { 
                      role: 'External Client', 
                      permissions: [
                        'View Assigned Leads Only',
                        'Limited Lead Updates',
                        'Communication History',
                        'Basic Profile Access'
                      ] 
                    },
                    { 
                      role: 'Guest', 
                      permissions: [
                        'View-Only Access',
                        'Limited Data Visibility',
                        'No Modification Rights',
                        'Basic Navigation'
                      ] 
                    }
                  ].map((roleInfo) => (
                    <Card key={roleInfo.role}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          {roleInfo.role}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1">
                          {roleInfo.permissions.map((permission, index) => (
                            <li key={index} className="text-xs text-gray-600 flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                              {permission}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

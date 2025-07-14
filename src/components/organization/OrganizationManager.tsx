
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Users, Settings, Plus, Mail, Shield, Activity, Briefcase, Hash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UserInvitationManager } from './UserInvitationManager';

export function OrganizationManager() {
  const [newOrgName, setNewOrgName] = useState('');
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [selectedOrgForWorkspace, setSelectedOrgForWorkspace] = useState('');
  const { toast } = useToast();

  const mockOrganizations = [
    {
      id: 1,
      name: 'Heirlogic Real Estate',
      identifier: 'HRE-001',
      adminCount: 2,
      memberCount: 15,
      clientCount: 8,
      guestCount: 3,
      workspaces: 3,
      status: 'active',
      createdAt: '2024-01-01',
      plan: 'Enterprise'
    },
    {
      id: 2,
      name: 'Property Solutions Inc',
      identifier: 'PSI-002',
      adminCount: 1,
      memberCount: 8,
      clientCount: 12,
      guestCount: 5,
      workspaces: 2,
      status: 'active',
      createdAt: '2024-01-15',
      plan: 'Professional'
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
      status: 'active',
      joinedAt: '2023-12-01'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@heirlogic.com',
      role: 'Member',
      organization: 'Heirlogic Real Estate',
      lastLogin: '2024-01-14 15:45',
      status: 'active',
      joinedAt: '2023-12-15'
    },
    {
      id: 3,
      name: 'Mike Davis',
      email: 'mike@propertysolutions.com',
      role: 'Client',
      organization: 'Property Solutions Inc',
      lastLogin: '2024-01-13 09:15',
      status: 'active',
      joinedAt: '2024-01-01'
    },
    {
      id: 4,
      name: 'Lisa Wong',
      email: 'lisa@heirlogic.com',
      role: 'Guest',
      organization: 'Heirlogic Real Estate',
      lastLogin: '2024-01-12 14:20',
      status: 'active',
      joinedAt: '2024-01-10'
    }
  ];

  const mockWorkspaces = [
    {
      id: 1,
      name: 'Tax Lien Division',
      organization: 'Heirlogic Real Estate',
      members: 8,
      campaigns: 5,
      leads: 120,
      apps: 3,
      createdAt: '2023-12-01'
    },
    {
      id: 2,
      name: 'Probate Team',
      organization: 'Heirlogic Real Estate',
      members: 4,
      campaigns: 3,
      leads: 85,
      apps: 2,
      createdAt: '2023-12-15'
    },
    {
      id: 3,
      name: 'Commercial Properties',
      organization: 'Property Solutions Inc',
      members: 6,
      campaigns: 2,
      leads: 45,
      apps: 1,
      createdAt: '2024-01-01'
    }
  ];

  const handleCreateOrganization = () => {
    if (newOrgName.trim()) {
      const identifier = `${newOrgName.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      toast({
        title: "Organization Created",
        description: `${newOrgName} has been created with ID: ${identifier}.`,
      });
      setNewOrgName('');
    }
  };

  const handleCreateWorkspace = () => {
    if (newWorkspaceName.trim() && selectedOrgForWorkspace) {
      toast({
        title: "Workspace Created",
        description: `${newWorkspaceName} workspace has been created in ${selectedOrgForWorkspace}.`,
      });
      setNewWorkspaceName('');
      setSelectedOrgForWorkspace('');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-red-100 text-red-800';
      case 'Member': return 'bg-blue-100 text-blue-800';
      case 'Client': return 'bg-green-100 text-green-800';
      case 'Guest': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="organizations" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="workspaces">Workspaces</TabsTrigger>
          <TabsTrigger value="invitations">Management</TabsTrigger>
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
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        {org.identifier}
                      </Badge>
                      <Badge variant="outline">{org.plan}</Badge>
                    </div>
                  </CardTitle>
                  <p className="text-sm text-gray-600">Created: {org.createdAt}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold text-red-600">{org.adminCount}</p>
                      <p className="text-xs text-gray-600">Admins</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-blue-600">{org.memberCount}</p>
                      <p className="text-xs text-gray-600">Members</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-green-600">{org.clientCount}</p>
                      <p className="text-xs text-gray-600">Clients</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-600">{org.guestCount}</p>
                      <p className="text-xs text-gray-600">Guests</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Workspaces: {org.workspaces}</span>
                      <Badge className={getStatusColor(org.status)}>
                        {org.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Settings className="w-4 h-4 mr-1" />
                      Manage
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Users className="w-4 h-4 mr-1" />
                      Users
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
                      <div className="text-right">
                        <Badge className={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">Joined: {user.joinedAt}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Last login:</p>
                        <p className="text-xs text-gray-500">{user.lastLogin}</p>
                      </div>
                      <Badge className={getStatusColor(user.status)}>
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Create New Workspace
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Input
                  placeholder="Workspace name..."
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  className="flex-1"
                />
                <Select value={selectedOrgForWorkspace} onValueChange={setSelectedOrgForWorkspace}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockOrganizations.map((org) => (
                      <SelectItem key={org.name} value={org.name}>{org.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleCreateWorkspace}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockWorkspaces.map((workspace) => (
              <Card key={workspace.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{workspace.name}</CardTitle>
                  <p className="text-sm text-gray-600">{workspace.organization}</p>
                  <p className="text-xs text-gray-500">Created: {workspace.createdAt}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-center">
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
                    <div>
                      <p className="text-lg font-bold text-orange-600">{workspace.apps}</p>
                      <p className="text-xs text-gray-600">Apps</p>
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
      </Tabs>
    </div>
  );
}

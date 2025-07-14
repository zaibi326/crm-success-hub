
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Crown, UserPlus, Users, Settings, Shield, Search, Filter, Activity } from 'lucide-react';

const AdminUsersSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'Guest'
  });
  
  const { toast } = useToast();

  // Updated mock users data with new role structure
  const mockUsers = [
    { id: '1', email: 'john.doe@company.com', firstName: 'John', lastName: 'Doe', role: 'Admin', status: 'Active', lastLogin: '2024-01-10', organization: 'Heirlogic Real Estate' },
    { id: '2', email: 'jane.smith@company.com', firstName: 'Jane', lastName: 'Smith', role: 'Member', status: 'Active', lastLogin: '2024-01-11', organization: 'Heirlogic Real Estate' },
    { id: '3', email: 'bob.wilson@company.com', firstName: 'Bob', lastName: 'Wilson', role: 'Client', status: 'Active', lastLogin: '2024-01-09', organization: 'Property Solutions Inc' },
    { id: '4', email: 'alice.brown@company.com', firstName: 'Alice', lastName: 'Brown', role: 'Guest', status: 'Inactive', lastLogin: '2024-01-05', organization: 'Heirlogic Real Estate' },
  ];

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = () => {
    if (!newUser.email || !newUser.firstName || !newUser.lastName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "User Added",
      description: `${newUser.firstName} ${newUser.lastName} has been added successfully.`,
    });

    setNewUser({ email: '', firstName: '', lastName: '', role: 'Guest' });
    setIsAddingUser(false);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'Member': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Client': return 'bg-green-100 text-green-800 border-green-200';
      case 'Guest': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    return status === 'Active' 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getRolePermissions = (role: string) => {
    switch (role) {
      case 'Admin':
        return ['Full system access', 'User management', 'Organization management', 'App builder access'];
      case 'Member':
        return ['Campaign management', 'Lead management', 'App builder access', 'Team collaboration'];
      case 'Client':
        return ['Assigned leads only', 'Basic communication', 'Limited reporting'];
      case 'Guest':
        return ['View-only access', 'Limited navigation', 'No data modification'];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Member">Member</SelectItem>
                  <SelectItem value="Client">Client</SelectItem>
                  <SelectItem value="Guest">Guest</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => setIsAddingUser(true)} className="bg-crm-primary hover:bg-blue-700">
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>

          {/* Add User Form */}
          {isAddingUser && (
            <Card className="mb-6 border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">Add New User</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={newUser.firstName}
                      onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={newUser.lastName}
                      onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Guest">Guest</SelectItem>
                        <SelectItem value="Client">Client</SelectItem>
                        <SelectItem value="Member">Member</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleAddUser} className="bg-crm-primary hover:bg-blue-700">
                    Add User
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddingUser(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Users List */}
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.firstName[0]}{user.lastName[0]}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{user.firstName} {user.lastName}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-500">{user.organization}</p>
                        <p className="text-xs text-gray-500">Last login: {user.lastLogin}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {user.role}
                        </Badge>
                        <Badge className={getStatusBadgeColor(user.status)} variant="outline">
                          {user.status}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Role Permissions */}
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs font-medium text-gray-700 mb-1">Permissions:</p>
                    <div className="flex flex-wrap gap-1">
                      {getRolePermissions(user.role).map((permission, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No users found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Role Overview & Permissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                role: 'Admin',
                count: mockUsers.filter(u => u.role === 'Admin').length,
                color: 'bg-red-100 border-red-200 text-red-800',
                permissions: getRolePermissions('Admin')
              },
              {
                role: 'Member',
                count: mockUsers.filter(u => u.role === 'Member').length,
                color: 'bg-blue-100 border-blue-200 text-blue-800',
                permissions: getRolePermissions('Member')
              },
              {
                role: 'Client',
                count: mockUsers.filter(u => u.role === 'Client').length,
                color: 'bg-green-100 border-green-200 text-green-800',
                permissions: getRolePermissions('Client')
              },
              {
                role: 'Guest',
                count: mockUsers.filter(u => u.role === 'Guest').length,
                color: 'bg-gray-100 border-gray-200 text-gray-800',
                permissions: getRolePermissions('Guest')
              }
            ].map((roleInfo) => (
              <Card key={roleInfo.role} className="border">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{roleInfo.role}</CardTitle>
                    <Badge className={roleInfo.color}>
                      {roleInfo.count} users
                    </Badge>
                  </div>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsersSection;


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, MapPin, Briefcase, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  department: string;
  joinDate: string;
  bio: string;
  role: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
}

const ProfileSection = () => {
  const { user, profile } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    department: '',
    joinDate: '',
    bio: '',
    role: '',
    firstName: '',
    lastName: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user && profile) {
      setProfileData({
        name: profile.first_name && profile.last_name 
          ? `${profile.first_name} ${profile.last_name}` 
          : user.email || '',
        email: user.email || '',
        phone: localStorage.getItem('userPhone') || '',
        address: localStorage.getItem('userAddress') || '',
        department: localStorage.getItem('userDepartment') || 'Sales',
        joinDate: profile.created_at || new Date().toISOString(),
        bio: localStorage.getItem('userBio') || 'Professional team member',
        role: profile.role || 'Employee',
        firstName: profile.first_name || '',
        lastName: profile.last_name || ''
      });
    }
  }, [user, profile]);

  const handleSave = async () => {
    if (!user || !profile) return;

    setIsLoading(true);
    try {
      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profileData.firstName,
          last_name: profileData.lastName,
        })
        .eq('id', user.id);

      if (error) throw error;

      // Save additional data to localStorage
      localStorage.setItem('userPhone', profileData.phone);
      localStorage.setItem('userAddress', profileData.address);
      localStorage.setItem('userDepartment', profileData.department);
      localStorage.setItem('userBio', profileData.bio);

      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    
    // Update name when firstName or lastName changes
    if (field === 'firstName' || field === 'lastName') {
      const firstName = field === 'firstName' ? value : profileData.firstName;
      const lastName = field === 'lastName' ? value : profileData.lastName;
      setProfileData(prev => ({ 
        ...prev, 
        [field]: value,
        name: firstName && lastName ? `${firstName} ${lastName}` : prev.email
      }));
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'manager': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'lead manager': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (!user || !profile) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading profile...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={profileData.avatar} alt={profileData.name} />
            <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {getInitials(profileData.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{profileData.name || profileData.email}</CardTitle>
            <Badge className={`mt-1 ${getRoleBadgeColor(profileData.role)}`}>
              {profileData.role}
            </Badge>
          </div>
        </div>
        <Button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          disabled={isLoading}
          className="bg-crm-primary hover:bg-blue-700"
        >
          {isLoading ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </h3>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</Label>
                {isEditing ? (
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{profileData.firstName || 'Not set'}</p>
                )}
              </div>

              <div>
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</Label>
                {isEditing ? (
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{profileData.lastName || 'Not set'}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <p className="mt-1 text-gray-900">{profileData.email}</p>
              </div>
              
              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  Phone
                </Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{profileData.phone || 'Not set'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Work Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Work Information
            </h3>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="department" className="text-sm font-medium text-gray-700">Department</Label>
                {isEditing ? (
                  <Input
                    id="department"
                    value={profileData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{profileData.department}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="joinDate" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Join Date
                </Label>
                <p className="mt-1 text-gray-900">{new Date(profileData.joinDate).toLocaleDateString()}</p>
              </div>
              
              <div>
                <Label htmlFor="address" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Address
                </Label>
                {isEditing ? (
                  <Textarea
                    id="address"
                    value={profileData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="mt-1"
                    rows={2}
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{profileData.address || 'Not set'}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="space-y-3">
          <Label htmlFor="bio" className="text-sm font-medium text-gray-700">Bio</Label>
          {isEditing ? (
            <Textarea
              id="bio"
              value={profileData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              className="mt-1"
              rows={3}
              placeholder="Tell us about yourself..."
            />
          ) : (
            <p className="mt-1 text-gray-900 bg-gray-50 p-3 rounded-lg">{profileData.bio}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSection;

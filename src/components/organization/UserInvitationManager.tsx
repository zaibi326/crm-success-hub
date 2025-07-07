
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Mail, Send, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PendingInvitation {
  id: string;
  email: string;
  role: string;
  organization: string;
  sentDate: string;
  status: 'pending' | 'accepted' | 'expired';
  expiresAt: string;
}

export function UserInvitationManager() {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('');
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const mockPendingInvitations: PendingInvitation[] = [
    {
      id: '1',
      email: 'new.user@example.com',
      role: 'Employee',
      organization: 'Heirlogic Real Estate',
      sentDate: '2024-01-10',
      status: 'pending',
      expiresAt: '2024-01-17'
    },
    {
      id: '2',
      email: 'contractor@external.com',
      role: 'External Client',
      organization: 'Property Solutions Inc',
      sentDate: '2024-01-08',
      status: 'accepted',
      expiresAt: '2024-01-15'
    },
    {
      id: '3',
      email: 'expired@test.com',
      role: 'Manager',
      organization: 'Heirlogic Real Estate',
      sentDate: '2024-01-01',
      status: 'expired',
      expiresAt: '2024-01-08'
    }
  ];

  const mockOrganizations = [
    'Heirlogic Real Estate',
    'Property Solutions Inc'
  ];

  const handleSendInvitation = async () => {
    if (!inviteEmail.trim() || !inviteRole || !selectedOrganization) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Invitation Sent",
        description: `Invitation sent to ${inviteEmail} as ${inviteRole} for ${selectedOrganization}.`,
      });
      setInviteEmail('');
      setInviteRole('');
      setSelectedOrganization('');
      setIsLoading(false);
    }, 1000);
  };

  const handleResendInvitation = (invitation: PendingInvitation) => {
    toast({
      title: "Invitation Resent",
      description: `Invitation resent to ${invitation.email}.`,
    });
  };

  const handleCancelInvitation = (invitation: PendingInvitation) => {
    toast({
      title: "Invitation Cancelled",
      description: `Invitation to ${invitation.email} has been cancelled.`,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'expired':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Send New Invitation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Send User Invitation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Email address..."
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
            <Select value={inviteRole} onValueChange={setInviteRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="Employee">Employee</SelectItem>
                <SelectItem value="External Client">External Client</SelectItem>
                <SelectItem value="Guest">Guest</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedOrganization} onValueChange={setSelectedOrganization}>
              <SelectTrigger>
                <SelectValue placeholder="Select organization" />
              </SelectTrigger>
              <SelectContent>
                {mockOrganizations.map((org) => (
                  <SelectItem key={org} value={org}>{org}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleSendInvitation} disabled={isLoading}>
              <Send className="w-4 h-4 mr-2" />
              {isLoading ? 'Sending...' : 'Send Invite'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Invitations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockPendingInvitations.map((invitation) => (
              <div key={invitation.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(invitation.status)}
                    <Badge className={getStatusColor(invitation.status)}>
                      {invitation.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-medium">{invitation.email}</p>
                    <p className="text-sm text-gray-600">
                      {invitation.role} • {invitation.organization}
                    </p>
                    <p className="text-xs text-gray-500">
                      Sent: {invitation.sentDate} • Expires: {invitation.expiresAt}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {invitation.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResendInvitation(invitation)}
                      >
                        Resend
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancelInvitation(invitation)}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                  {invitation.status === 'expired' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleResendInvitation(invitation)}
                    >
                      Resend
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

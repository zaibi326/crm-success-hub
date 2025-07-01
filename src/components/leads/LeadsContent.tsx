
import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { EnhancedCsvUploader } from './EnhancedCsvUploader';
import { LeadDetailsForm } from './LeadDetailsForm';
import { OwnershipBreakdown } from './OwnershipBreakdown';
import { LeadReviewSystem } from './LeadReviewSystem';
import { LeadsHeader } from './LeadsHeader';
import { LeadsTabNavigation } from './LeadsTabNavigation';
import { LeadsOverview } from './LeadsOverview';
import { LeadsEmptyState } from './LeadsEmptyState';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Eye, Edit } from 'lucide-react';

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  status: 'HOT' | 'WARM' | 'COLD' | 'PASS';
  score: number;
  notes: string;
  avatar?: string;
  tags: string[];
  taxId?: string;
  ownerName?: string;
  propertyAddress?: string;
  taxLawsuitNumber?: string;
  currentArrears?: number;
  assignedTo?: string; // For role-based filtering
}

const mockLeads: Lead[] = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '(555) 123-4567',
    company: 'Smith & Associates',
    position: 'Business Owner',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    status: 'HOT',
    score: 95,
    notes: 'High-value prospect with immediate estate planning needs.',
    tags: ['High Priority', 'Estate Planning', 'Business Owner'],
    taxId: 'TX123456789',
    ownerName: 'John Smith',
    propertyAddress: '123 Main St, New York, NY 10001',
    taxLawsuitNumber: 'TL-2024-001',
    currentArrears: 15000,
    assignedTo: 'current-user' // Simulating assigned to current user
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '(555) 987-6543',
    company: 'Johnson Enterprises',
    position: 'CEO',
    address: '456 Oak Ave',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90210',
    status: 'WARM',
    score: 78,
    notes: 'Interested in trust services, follow up in 2 weeks.',
    tags: ['Trust Services', 'CEO', 'Follow-up'],
    taxId: 'TX987654321',
    ownerName: 'Sarah Johnson',
    propertyAddress: '456 Oak Ave, Los Angeles, CA 90210',
    taxLawsuitNumber: 'TL-2024-002',
    currentArrears: 8500,
    assignedTo: 'other-user' // Simulating assigned to different user
  }
];

export function LeadsContent() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const { canViewAllLeads, userRole, canManageTeam } = useRoleAccess();
  
  // Filter leads based on role
  const getFilteredLeads = () => {
    if (canViewAllLeads) {
      return mockLeads; // Admin and Manager see all leads
    }
    // Employee only sees assigned leads
    return mockLeads.filter(lead => lead.assignedTo === 'current-user');
  };

  const [leads] = useState(getFilteredLeads());

  const handleLeadUpdate = (updatedLead: Lead) => {
    // Only allow updates if user can view all leads or if lead is assigned to them
    if (canViewAllLeads || updatedLead.assignedTo === 'current-user') {
      setSelectedLead(updatedLead);
    }
  };

  const handleUploadComplete = () => {
    setActiveTab('review');
  };

  const getAccessLevel = () => {
    if (userRole === 'Admin') return 'Full Access';
    if (userRole === 'Manager') return 'Team Access';
    return 'Assigned Leads Only';
  };

  const getAccessBadgeColor = () => {
    if (userRole === 'Admin') return 'bg-red-100 text-red-800 border-red-200';
    if (userRole === 'Manager') return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Role-based access indicator */}
      <div className="mb-6">
        <Card className="border-gray-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Lead Access Level
              </CardTitle>
              <Badge className={getAccessBadgeColor()}>
                {getAccessLevel()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>Can view: {canViewAllLeads ? 'All leads' : 'Assigned leads only'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                <span>Can edit: {canViewAllLeads ? 'All leads' : 'Assigned leads only'}</span>
              </div>
            </div>
            {userRole === 'Employee' && (
              <p className="text-yellow-700 text-sm mt-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                You can only view and edit leads assigned to you. Contact your manager to access other leads or request new assignments.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <LeadsHeader />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <LeadsTabNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          canUpload={canManageTeam}
        />

        <TabsContent value="overview" className="space-y-6">
          <LeadsOverview
            leads={leads}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onLeadSelect={setSelectedLead}
            onTabChange={setActiveTab}
            canViewAll={canViewAllLeads}
          />
        </TabsContent>

        {canManageTeam && (
          <TabsContent value="upload">
            <EnhancedCsvUploader onUploadComplete={handleUploadComplete} />
          </TabsContent>
        )}

        {canManageTeam && (
          <TabsContent value="review">
            <LeadReviewSystem />
          </TabsContent>
        )}

        <TabsContent value="details">
          {selectedLead ? (
            <LeadDetailsForm
              lead={selectedLead}
              onSave={handleLeadUpdate}
              canEdit={canViewAllLeads || selectedLead.assignedTo === 'current-user'}
            />
          ) : (
            <LeadsEmptyState onNavigateToOverview={() => setActiveTab('overview')} />
          )}
        </TabsContent>

        {canViewAllLeads && (
          <TabsContent value="ownership">
            <OwnershipBreakdown />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

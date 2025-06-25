
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
    currentArrears: 15000
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
    currentArrears: 8500
  }
];

export function LeadsContent() {
  const [leads, setLeads] = useState(mockLeads);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const handleLeadUpdate = (updatedLead: Lead) => {
    setLeads(leads.map(lead => 
      lead.id === updatedLead.id ? updatedLead : lead
    ));
    setSelectedLead(updatedLead);
  };

  const handleUploadComplete = () => {
    setActiveTab('review');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <LeadsHeader />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <LeadsTabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        <TabsContent value="overview" className="space-y-6">
          <LeadsOverview
            leads={leads}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onLeadSelect={setSelectedLead}
            onTabChange={setActiveTab}
          />
        </TabsContent>

        <TabsContent value="upload">
          <EnhancedCsvUploader onUploadComplete={handleUploadComplete} />
        </TabsContent>

        <TabsContent value="review">
          <LeadReviewSystem />
        </TabsContent>

        <TabsContent value="details">
          {selectedLead ? (
            <LeadDetailsForm
              lead={selectedLead}
              onSave={handleLeadUpdate}
            />
          ) : (
            <LeadsEmptyState onNavigateToOverview={() => setActiveTab('overview')} />
          )}
        </TabsContent>

        <TabsContent value="ownership">
          <OwnershipBreakdown />
        </TabsContent>
      </Tabs>
    </div>
  );
}

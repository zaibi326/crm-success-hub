
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LeadSearchFilters } from './LeadSearchFilters';
import { LeadReviewCard } from './LeadReviewCard';
import { ReviewActions } from './ReviewActions';

interface Lead {
  id: number;
  taxId: string;
  ownerName: string;
  propertyAddress: string;
  taxLawsuitNumber?: string;
  currentArrears?: number;
  status: 'HOT' | 'WARM' | 'COLD' | 'PASS';
  notes?: string;
  phone?: string;
  email?: string;
}

const mockLeads: Lead[] = [
  {
    id: 1,
    taxId: 'TX123456789',
    ownerName: 'John Smith',
    propertyAddress: '123 Main St, Dallas, TX 75201',
    taxLawsuitNumber: 'TL-2024-001',
    currentArrears: 15000,
    status: 'HOT',
    notes: 'High-value property with significant arrears',
    phone: '(555) 123-4567',
    email: 'john.smith@email.com'
  },
  {
    id: 2,
    taxId: 'TX987654321',
    ownerName: 'Sarah Johnson',
    propertyAddress: '456 Oak Ave, Houston, TX 77001',
    taxLawsuitNumber: 'TL-2024-002',
    currentArrears: 8500,
    status: 'WARM',
    notes: 'Property owner contacted previously',
    phone: '(555) 987-6543',
    email: 'sarah.j@email.com'
  },
  {
    id: 3,
    taxId: 'TX456789123',
    ownerName: 'Mike Rodriguez',
    propertyAddress: '789 Pine Rd, Austin, TX 73301',
    taxLawsuitNumber: 'TL-2024-003',
    currentArrears: 3200,
    status: 'COLD',
    notes: 'Small arrears, low priority',
    phone: '(555) 456-7890'
  }
];

export function LeadReviewSystem() {
  const [leads, setLeads] = useState(mockLeads);
  const [currentLeadIndex, setCurrentLeadIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const { toast } = useToast();

  const currentLead = leads[currentLeadIndex];

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.taxId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAction = (action: 'pass' | 'keep') => {
    if (!currentLead) return;

    if (action === 'pass') {
      const updatedLeads = leads.map(lead =>
        lead.id === currentLead.id ? { ...lead, status: 'PASS' as const } : lead
      );
      setLeads(updatedLeads);
      
      toast({
        title: "Lead Passed",
        description: `${currentLead.ownerName} has been marked as passed.`,
      });
    } else {
      toast({
        title: "Lead Kept! 🎉",
        description: `${currentLead.ownerName} has been added to your pipeline.`,
      });
    }

    // Move to next lead
    if (currentLeadIndex < filteredLeads.length - 1) {
      setCurrentLeadIndex(currentLeadIndex + 1);
    } else {
      toast({
        title: "Review Complete! ✅",
        description: "You've reviewed all available leads!",
      });
    }
  };

  const handleLeadUpdate = (updatedLead: Lead) => {
    const updatedLeads = leads.map(lead =>
      lead.id === updatedLead.id ? updatedLead : lead
    );
    setLeads(updatedLeads);
  };

  if (!currentLead) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No leads to review</h3>
        <p className="text-gray-600">Upload a CSV file to start reviewing leads.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <LeadSearchFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* Lead Review Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Information */}
        <div className="lg:col-span-2">
          <LeadReviewCard
            lead={currentLead}
            onLeadUpdate={handleLeadUpdate}
          />
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <ReviewActions
            onAction={handleAction}
            isLoading={false}
            leadsRemaining={filteredLeads.length - currentLeadIndex - 1}
          />

          {/* Progress Card */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-crm-primary to-crm-accent text-white">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  {currentLeadIndex + 1} / {filteredLeads.length}
                </div>
                <div className="text-sm opacity-90">
                  Leads Progress
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { LeadSearchFilters } from './LeadSearchFilters';
import { LeadReviewCard } from './LeadReviewCard';
import { ReviewActions } from './ReviewActions';
import { TaxLeadDetailsForm } from './TaxLeadDetailsForm';
import { TaxLead } from '@/types/taxLead';

const mockLeads: TaxLead[] = [
  {
    id: 1,
    taxId: 'TX123456789',
    ownerName: 'John Smith',
    firstName: 'John',
    lastName: 'Smith',
    propertyAddress: '123 Main St, Dallas, TX 75201',
    sellerContactAddress: '123 Main St, Dallas, TX 75201',
    taxLawsuitNumber: 'TL-2024-001',
    currentArrears: 15000,
    status: 'HOT',
    temperature: 'HOT',
    occupancyStatus: 'OWNER_OCCUPIED',
    disposition: 'UNDECIDED',
    notes: 'High-value property with significant arrears',
    phone: '(555) 123-4567',
    email: 'john.smith@email.com',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    leadSource: 'Website',
    agentName: 'Jane Doe',
    askingPrice: 250000,
    mortgagePrice: 180000,
    campaignId: 'campaign-1',
    hasDeath: false,
    hasProbate: false,
    hasLawsuit: true,
    hasAdditionalTaxingEntities: false,
    ownerOfRecord: 'John Smith',
    leadManager: 'Jane Doe',
    createdVia: 'Website Form',
    tags: ['Hot Lead']
  },
  {
    id: 2,
    taxId: 'TX987654321',
    ownerName: 'Sarah Johnson',
    firstName: 'Sarah',
    lastName: 'Johnson',
    propertyAddress: '456 Oak Ave, Houston, TX 77001',
    sellerContactAddress: '456 Oak Ave, Houston, TX 77001',
    taxLawsuitNumber: 'TL-2024-002',
    currentArrears: 8500,
    status: 'WARM',
    temperature: 'WARM',
    occupancyStatus: 'TENANT_OCCUPIED',
    disposition: 'UNDECIDED',
    notes: 'Property owner contacted previously',
    phone: '(555) 987-6543',
    email: 'sarah.j@email.com',
    createdAt: '2024-01-10T14:20:00Z',
    updatedAt: '2024-01-10T14:20:00Z',
    leadSource: 'Cold Call',
    agentName: 'Mike Smith',
    askingPrice: 180000,
    mortgagePrice: 120000,
    campaignId: 'campaign-2',
    hasDeath: false,
    hasProbate: false,
    hasLawsuit: false,
    hasAdditionalTaxingEntities: false,
    ownerOfRecord: 'Sarah Johnson',
    leadManager: 'Mike Smith',
    createdVia: 'Cold Call',
    tags: ['Warm Lead']
  },
  {
    id: 3,
    taxId: 'TX456789123',
    ownerName: 'Mike Rodriguez',
    firstName: 'Mike',
    lastName: 'Rodriguez',
    propertyAddress: '789 Pine Rd, Austin, TX 73301',
    sellerContactAddress: '789 Pine Rd, Austin, TX 73301',
    taxLawsuitNumber: 'TL-2024-003',
    currentArrears: 3200,
    status: 'COLD',
    temperature: 'COLD',
    occupancyStatus: 'VACANT',
    disposition: 'UNDECIDED',
    notes: 'Small arrears, low priority',
    phone: '(555) 456-7890',
    email: 'mike.r@email.com',
    createdAt: '2024-01-05T09:15:00Z',
    updatedAt: '2024-01-05T09:15:00Z',
    leadSource: 'Referral',
    agentName: 'Lisa Wilson',
    askingPrice: 150000,
    mortgagePrice: 100000,
    campaignId: 'campaign-3',
    hasDeath: false,
    hasProbate: false,
    hasLawsuit: false,
    hasAdditionalTaxingEntities: false,
    ownerOfRecord: 'Mike Rodriguez',
    leadManager: 'Lisa Wilson',
    createdVia: 'Referral',
    tags: ['Cold Lead']
  }
];

export function LeadReviewSystem() {
  const [leads, setLeads] = useState(mockLeads);
  const [currentLeadIndex, setCurrentLeadIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showDetailForm, setShowDetailForm] = useState(false);
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
      // Show detailed form for "Keep" action
      setShowDetailForm(true);
      return; // Don't move to next lead yet
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

  const handleLeadUpdate = (updatedLead: TaxLead) => {
    const updatedLeads = leads.map(lead =>
      lead.id === updatedLead.id ? updatedLead : lead
    );
    setLeads(updatedLeads);
  };

  const handleDetailFormSave = (updatedLead: TaxLead) => {
    handleLeadUpdate(updatedLead);
    setShowDetailForm(false);
    
    toast({
      title: "Lead Kept! 🎉",
      description: `${updatedLead.ownerName} has been added to your pipeline with detailed information.`,
    });

    // Move to next lead after saving details
    if (currentLeadIndex < filteredLeads.length - 1) {
      setCurrentLeadIndex(currentLeadIndex + 1);
    } else {
      toast({
        title: "Review Complete! ✅",
        description: "You've reviewed all available leads!",
      });
    }
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
            onOpenDetailedForm={() => setShowDetailForm(true)}
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

      {/* Detailed Lead Form Dialog */}
      <Dialog open={showDetailForm} onOpenChange={setShowDetailForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detailed Lead Information - {currentLead.ownerName}</DialogTitle>
          </DialogHeader>
          <TaxLeadDetailsForm
            lead={currentLead}
            onSave={handleDetailFormSave}
            userRole="editor"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

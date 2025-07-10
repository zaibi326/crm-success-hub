
import React, { useState, memo } from 'react';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { useLeadsData } from '@/hooks/useLeadsData';
import { useLeadsFilter } from '@/hooks/useLeadsFilter';
import { useToast } from '@/hooks/use-toast';
import { LeadsHeader } from './LeadsHeader';
import { LeadsFilters } from './LeadsFilters';
import { LeadsList } from './LeadsList';
import { TaxLeadDetailView } from './TaxLeadDetailView';
import { TaxLead } from '@/types/taxLead';

export const LeadsContent = memo(function LeadsContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('ownerName');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedLead, setSelectedLead] = useState<TaxLead | null>(null);
  const { canViewAllLeads } = useRoleAccess();
  const { toast } = useToast();

  const { mockLeads, handleAddLead, handleLeadUpdate } = useLeadsData();
  const filteredLeads = useLeadsFilter({ 
    leads: mockLeads, 
    searchTerm, 
    filterStatus, 
    sortBy 
  });

  const onLeadUpdate = (updatedLead: TaxLead) => {
    handleLeadUpdate(updatedLead);
    setSelectedLead(updatedLead);
  };

  const handleExportData = () => {
    // Convert leads to CSV
    const csvContent = [
      ['Owner Name', 'Property Address', 'Status', 'Phone', 'Email', 'Current Arrears', 'Tax ID'].join(','),
      ...filteredLeads.map(lead => [
        lead.ownerName,
        `"${lead.propertyAddress}"`,
        lead.status,
        lead.phone || '',
        lead.email || '',
        lead.currentArrears || 0,
        lead.taxId || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'seller-leads.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export completed",
      description: `Exported ${filteredLeads.length} leads to CSV`,
    });
  };

  const handleTemplateClick = () => {
    toast({
      title: "Templates",
      description: "Template management feature coming soon",
    });
  };

  return (
    <div className="flex flex-col h-full">
      <LeadsHeader 
        onAddLead={handleAddLead}
        onExport={handleExportData}
        onTemplateClick={handleTemplateClick}
      />
      
      {!selectedLead && (
        <LeadsFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterStatus={filterStatus}
          onFilterStatusChange={setFilterStatus}
          sortBy={sortBy}
          onSortByChange={setSortBy}
        />
      )}

      <main className="flex-1 p-6 bg-gradient-to-br from-gray-50/30 to-white overflow-y-auto">
        {!selectedLead ? (
          <LeadsList 
            leads={filteredLeads}
            onLeadSelect={setSelectedLead}
            onLeadUpdate={onLeadUpdate}
          />
        ) : (
          <TaxLeadDetailView 
            selectedLead={selectedLead}
            onBack={() => setSelectedLead(null)}
          />
        )}
      </main>
    </div>
  );
});

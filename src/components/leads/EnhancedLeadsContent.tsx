
import React from 'react';
import { SidebarInset } from '@/components/ui/sidebar';
import { AdvancedFilters } from './AdvancedFilters';
import { EnhancedLeadDetailPage } from './EnhancedLeadDetailPage';
import { TemplateModificationDialog } from './TemplateModificationDialog';
import { LeadsHeader } from './LeadsHeader';
import { LeadsMainContent } from './LeadsMainContent';
import { useLeadsLogic } from './useLeadsLogic';

export function EnhancedLeadsContent() {
  const {
    currentView,
    sortBy,
    filterStatus,
    selectedLead,
    isTemplateDialogOpen,
    filters,
    availableFields,
    filteredLeads,
    mockLeads,
    setCurrentView,
    setSortBy,
    setFilterStatus,
    setSelectedLead,
    setIsTemplateDialogOpen,
    setFilters,
    getStatusBadge,
    handleSort,
    handleAddLead,
    handleLeadUpdate,
    handleBulkLeadsUpdate
  } = useLeadsLogic();

  const handleSellerAdded = (seller: any) => {
    setSelectedLead(seller);
  };

  if (selectedLead) {
    return (
      <EnhancedLeadDetailPage
        lead={selectedLead}
        onBack={() => setSelectedLead(null)}
        onLeadUpdate={(updatedLead) => {
          handleLeadUpdate(updatedLead);
          setSelectedLead(updatedLead);
        }}
      />
    );
  }

  return (
    <SidebarInset className="flex-1 overflow-auto bg-podio-surface">
      <LeadsHeader
        onAddLead={handleAddLead}
        onSellerAdded={handleSellerAdded}
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      <main className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar - Podio style */}
          <div className="lg:col-span-1 space-y-4">
            <div className="podio-container p-4">
              <AdvancedFilters
                filters={filters}
                onFiltersChange={setFilters}
                availableFields={availableFields}
              />
            </div>
          </div>

          {/* Main Content Area - Podio style */}
          <div className="lg:col-span-3">
            <div className="podio-container">
              <LeadsMainContent
                currentView={currentView}
                filteredLeads={filteredLeads}
                onLeadSelect={setSelectedLead}
                getStatusBadge={getStatusBadge}
                handleSort={handleSort}
                onLeadsUpdate={handleBulkLeadsUpdate}
              />
            </div>
          </div>
        </div>

        {/* Results Summary - Podio style */}
        <div className="podio-container p-4">
          <div className="text-sm text-podio-text-muted text-center">
            Showing <span className="font-medium text-podio-text">{filteredLeads.length}</span> of <span className="font-medium text-podio-text">{mockLeads.length}</span> seller leads
          </div>
        </div>
      </main>

      {/* Template Modification Dialog */}
      {isTemplateDialogOpen && mockLeads.length > 0 && (
        <TemplateModificationDialog
          isOpen={isTemplateDialogOpen}
          onClose={() => setIsTemplateDialogOpen(false)}
          lead={mockLeads[0]}
          onSave={(updatedLead) => {
            handleLeadUpdate(updatedLead);
            setIsTemplateDialogOpen(false);
          }}
        />
      )}
    </SidebarInset>
  );
}

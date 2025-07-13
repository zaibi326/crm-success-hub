
import React from 'react';
import { SidebarInset } from '@/components/ui/sidebar';
import { TaxLeadDetailsForm } from './TaxLeadDetailsForm';
import { TemplateModificationDialog } from './TemplateModificationDialog';
import { LeadsHeader } from './LeadsHeader';
import { LeadsMainContent } from './LeadsMainContent';
import { FilterChips } from './FilterChips';
import { useLeadsLogic } from './useLeadsLogic';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

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

  const handleRemoveFilter = (filterId: string) => {
    const updatedFilters = filters.filter(filter => filter.id !== filterId);
    setFilters(updatedFilters);
  };

  const handleClearAllFilters = () => {
    setFilters([]);
  };

  // If a lead is selected, show the enhanced detail view
  if (selectedLead) {
    return (
      <SidebarInset className="flex-1 overflow-auto bg-podio-surface">
        <div className="min-h-screen bg-gradient-to-br from-gray-50/30 to-white">
          {/* Header with back button */}
          <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-200/50 p-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => setSelectedLead(null)}
                className="flex items-center gap-2 text-crm-primary hover:text-crm-accent hover:bg-crm-primary/10"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Leads
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{selectedLead.ownerName}</h1>
                <p className="text-gray-600 mt-1">{selectedLead.propertyAddress}</p>
              </div>
            </div>
          </div>

          {/* Enhanced Lead Details Form */}
          <div className="pb-6">
            <TaxLeadDetailsForm
              lead={selectedLead}
              onSave={(updatedLead) => {
                handleLeadUpdate(updatedLead);
                setSelectedLead(updatedLead);
              }}
              userRole="editor"
            />
          </div>
        </div>
      </SidebarInset>
    );
  }

  return (
    <SidebarInset className="flex-1 overflow-auto bg-podio-surface">
      <LeadsHeader
        onAddLead={handleAddLead}
        onSellerAdded={handleSellerAdded}
        currentView={currentView}
        onViewChange={setCurrentView}
        filters={filters}
        onFiltersChange={setFilters}
        availableFields={availableFields}
      />

      {/* Filter Chips */}
      <FilterChips
        filters={filters}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={handleClearAllFilters}
      />

      <main className="p-6 space-y-6">
        {/* Full-width Main Content Area */}
        <div className="w-full">
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

        {/* Results Summary */}
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


import React from 'react';
import { SidebarInset } from '@/components/ui/sidebar';
import { AdvancedFilters } from './AdvancedFilters';
import { LeadDetailsPage } from './LeadDetailsPage';
import { TemplateModificationDialog } from './TemplateModificationDialog';
import { LeadsHeader } from './LeadsHeader';
import { LeadsFiltersSection } from './LeadsFiltersSection';
import { LeadsMainContent } from './LeadsMainContent';
import { useLeadsLogic } from './useLeadsLogic';

export function EnhancedLeadsContent() {
  const {
    currentView,
    searchTerm,
    sortBy,
    filterStatus,
    selectedLead,
    isTemplateDialogOpen,
    filters,
    availableFields,
    filteredLeads,
    mockLeads,
    setCurrentView,
    setSearchTerm,
    setSortBy,
    setFilterStatus,
    setSelectedLead,
    setIsTemplateDialogOpen,
    setFilters,
    getStatusBadge,
    handleSort,
    handleExportData,
    handleAddLead,
    handleLeadUpdate,
    handleBulkLeadsUpdate
  } = useLeadsLogic();

  if (selectedLead) {
    return (
      <LeadDetailsPage
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
    <SidebarInset className="flex-1 overflow-auto">
      <LeadsHeader
        onExport={handleExportData}
        onTemplateClick={() => setIsTemplateDialogOpen(true)}
        onAddLead={handleAddLead}
      />

      <div className="px-6 py-4">
        <LeadsFiltersSection
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterStatus={filterStatus}
          onFilterStatusChange={setFilterStatus}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          currentView={currentView}
          onViewChange={setCurrentView}
        />
      </div>

      <main className="p-6 bg-gradient-to-br from-gray-50/30 to-white space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <AdvancedFilters
              filters={filters}
              onFiltersChange={setFilters}
              availableFields={availableFields}
            />
          </div>

          {/* Main Content Area */}
          <LeadsMainContent
            currentView={currentView}
            filteredLeads={filteredLeads}
            onLeadSelect={setSelectedLead}
            getStatusBadge={getStatusBadge}
            handleSort={handleSort}
            onLeadsUpdate={handleBulkLeadsUpdate}
          />
        </div>

        {/* Results Summary */}
        <div className="text-sm text-gray-600 text-center py-4 border-t">
          Showing {filteredLeads.length} of {mockLeads.length} leads
          {searchTerm && ` matching "${searchTerm}"`}
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


import React from 'react';
import { SidebarInset } from '@/components/ui/sidebar';
import { TaxLeadDetailsForm } from './TaxLeadDetailsForm';
import { TemplateModificationDialog } from './TemplateModificationDialog';
import { LeadsHeader } from './LeadsHeader';
import { LeadsMainContent } from './LeadsMainContent';
import { FilterChips } from './FilterChips';
import { FilterSidebar } from './FilterSidebar';
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
    showFilterSidebar,
    sidebarCollapsed,
    setCurrentView,
    setSortBy,
    setFilterStatus,
    setSelectedLead,
    setIsTemplateDialogOpen,
    setFilters,
    setShowFilterSidebar,
    setSidebarCollapsed,
    getStatusBadge,
    handleSort,
    handleAddLead,
    handleLeadUpdate,
    handleBulkLeadsUpdate,
    handleFilterToggle
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
    setShowFilterSidebar(false);
  };

  // If a lead is selected, show the enhanced detail view
  if (selectedLead) {
    return (
      <SidebarInset className="flex-1 overflow-auto bg-white">
        <div className="min-h-screen bg-gradient-to-br from-agile-gray-50 to-white">
          {/* Header with back button */}
          <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-agile-gray-200 p-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => setSelectedLead(null)}
                className="flex items-center gap-2 text-agile-blue-600 hover:text-agile-blue-700 hover:bg-agile-blue-50"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Leads
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-agile-gray-900">{selectedLead.ownerName}</h1>
                <p className="text-agile-gray-600 mt-1">{selectedLead.propertyAddress}</p>
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
    <>
      <SidebarInset 
        className={`flex-1 overflow-auto bg-white transition-all duration-300 ${
          showFilterSidebar ? 'mr-80' : ''
        } ${sidebarCollapsed ? 'ml-0' : ''}`}
      >
        <LeadsHeader
          onAddLead={handleAddLead}
          onSellerAdded={handleSellerAdded}
          currentView={currentView}
          onViewChange={setCurrentView}
          filters={filters}
          onFiltersChange={setFilters}
          availableFields={availableFields}
          onFilterToggle={handleFilterToggle}
          showFilterSidebar={showFilterSidebar}
          sidebarCollapsed={sidebarCollapsed}
        />

        {/* Filter Chips - Show only when filters are active */}
        {filters.length > 0 && (
          <FilterChips
            filters={filters}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleClearAllFilters}
          />
        )}

        <main className="p-6 space-y-6">
          {/* Full-width Main Content Area */}
          <div className="w-full">
            <div className="bg-white rounded-lg shadow-sm border border-agile-gray-200">
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
          <div className="bg-white rounded-lg shadow-sm border border-agile-gray-200 p-4">
            <div className="text-sm text-agile-gray-600 text-center">
              Showing <span className="font-medium text-agile-gray-900">{filteredLeads.length}</span> of <span className="font-medium text-agile-gray-900">{mockLeads.length}</span> seller leads
              {filters.length > 0 && (
                <span className="ml-2 text-agile-blue-600">
                  ({filters.length} filter{filters.length !== 1 ? 's' : ''} applied)
                </span>
              )}
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

      {/* Filter Sidebar */}
      <FilterSidebar
        isOpen={showFilterSidebar}
        onClose={() => setShowFilterSidebar(false)}
        filters={filters}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={handleClearAllFilters}
        totalResults={mockLeads.length}
        filteredResults={filteredLeads.length}
      />
    </>
  );
}

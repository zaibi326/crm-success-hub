
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { TaxLeadDetailsForm } from './TaxLeadDetailsForm';
import { TemplateModificationDialog } from './TemplateModificationDialog';
import { LeadsHeader } from './LeadsHeader';
import { LeadsMainContent } from './LeadsMainContent';
import { FilterChips } from './FilterChips';
import { FilterSidebar } from './FilterSidebar';
import { PodioFilterPanel } from './PodioFilterPanel';
import { useLeadsLogic } from './useLeadsLogic';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { FilterCondition } from './filters/types';
import { FilterState, createEmptyFilterState } from './filters/FilterState';

export function EnhancedLeadsContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedLeadId = searchParams.get('leadId');
  
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
    isLoaded,
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
    handleDeleteSingleLead,
    handleDeleteMultipleLeads,
    handleFilterToggle
  } = useLeadsLogic();

  // Handle URL-based lead selection
  useEffect(() => {
    if (selectedLeadId && mockLeads.length > 0) {
      const lead = mockLeads.find(l => l.id.toString() === selectedLeadId);
      if (lead && lead !== selectedLead) {
        setSelectedLead(lead);
      }
    } else if (!selectedLeadId && selectedLead) {
      setSelectedLead(null);
    }
  }, [selectedLeadId, mockLeads, selectedLead, setSelectedLead]);

  const handleSellerAdded = (seller: any) => {
    setSelectedLead(seller);
    setSearchParams({ leadId: seller.id.toString() });
  };

  const handleLeadSelect = (lead: any) => {
    setSelectedLead(lead);
    setSearchParams({ leadId: lead.id.toString() });
  };

  const handleBackToLeads = () => {
    setSelectedLead(null);
    // Clear the URL parameters and navigate back to the leads page
    navigate('/leads', { replace: true });
  };

  const handleRemoveFilter = (filterId: string) => {
    const updatedFilters = filters.filter(filter => filter.id !== filterId);
    setFilters(updatedFilters);
  };

  const handleClearAllFilters = () => {
    setFilters([]);
    setShowFilterSidebar(false);
  };

  // Wrapper function to handle filter changes with proper typing
  const handleFiltersChange = (newFilters: FilterCondition[]) => {
    setFilters(newFilters);
  };

  // Create FilterState for PodioFilterPanel
  const [podioFilters, setPodioFilters] = React.useState<FilterState>(createEmptyFilterState());

  const handlePodioFiltersChange = (newFilters: FilterState) => {
    setPodioFilters(newFilters);
  };

  // Show loading state while data is being loaded
  if (!isLoaded) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leads...</p>
        </div>
      </div>
    );
  }

  // If a lead is selected, show the enhanced detail view
  if (selectedLead) {
    return (
      <div className="w-full min-h-screen overflow-auto bg-white">
        <div className="min-h-screen bg-gradient-to-br from-agile-gray-50 to-white">
          {/* Header with back button */}
          <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-agile-gray-200 p-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={handleBackToLeads}
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
      </div>
    );
  }

  return (
    <>
      <div 
        className={`w-full overflow-auto bg-white transition-all duration-300 ${
          showFilterSidebar ? 'mr-80' : ''
        }`}
      >
        <LeadsHeader
          onAddLead={handleAddLead}
          onSellerAdded={handleSellerAdded}
          currentView={currentView}
          onViewChange={setCurrentView}
          filters={filters}
          onFiltersChange={handleFiltersChange}
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
                onLeadSelect={handleLeadSelect}
                getStatusBadge={getStatusBadge}
                handleSort={handleSort}
                onLeadsUpdate={handleBulkLeadsUpdate}
                onDeleteSingleLead={handleDeleteSingleLead}
                onDeleteMultipleLeads={handleDeleteMultipleLeads}
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
      </div>

      {/* Enhanced Podio Filter Panel with Saved Filters */}
      <PodioFilterPanel
        isOpen={showFilterSidebar}
        onClose={() => setShowFilterSidebar(false)}
        filters={podioFilters}
        onFiltersChange={handlePodioFiltersChange}
        totalResults={mockLeads.length}
        filteredResults={filteredLeads.length}
        leads={mockLeads}
      />
    </>
  );
}


import React, { useState, useMemo } from 'react';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Settings, Download, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Import all the new view components
import { ViewSwitcher } from './ViewSwitcher';
import { SavedViewsManager } from './SavedViewsManager';
import { AdvancedFilters } from './AdvancedFilters';
import { LeadCardView } from './LeadCardView';
import { LeadCalendarView } from './LeadCalendarView';
import { LeadTimelineView } from './LeadTimelineView';
import { LeadBadgeView } from './LeadBadgeView';
import { LeadTableView } from './LeadTableView';
import { LeadDetailsPage } from './LeadDetailsPage';
import { AddSellerDialog } from './AddSellerDialog';
import { TemplateModificationDialog } from './TemplateModificationDialog';

// Import hooks and types
import { useLeadsData } from '@/hooks/useLeadsData';
import { TaxLead } from '@/types/taxLead';

interface FilterCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface SavedView {
  id: string;
  name: string;
  type: 'public' | 'private';
  filters: Record<string, any>;
  createdBy: string;
  createdAt: Date;
}

export function EnhancedLeadsContent() {
  const [currentView, setCurrentView] = useState<'table' | 'card' | 'calendar' | 'timeline' | 'badge'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('ownerName');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedLead, setSelectedLead] = useState<TaxLead | null>(null);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [savedViews, setSavedViews] = useState<SavedView[]>([]);
  
  const { mockLeads, handleAddLead, handleLeadUpdate } = useLeadsData();
  const { toast } = useToast();

  // Available fields for filtering
  const availableFields = [
    { key: 'ownerName', label: 'Owner Name', type: 'text' },
    { key: 'propertyAddress', label: 'Property Address', type: 'text' },
    { key: 'status', label: 'Status', type: 'select' },
    { key: 'currentArrears', label: 'Current Arrears', type: 'number' },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'taxId', label: 'Tax ID', type: 'text' },
  ];

  // Filter and search logic
  const filteredLeads = useMemo(() => {
    let result = mockLeads;

    // Apply search
    if (searchTerm) {
      result = result.filter(lead =>
        lead.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.taxId && lead.taxId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(lead => lead.status === filterStatus);
    }

    // Apply advanced filters
    filters.forEach(filter => {
      if (filter.field && filter.operator && (filter.value || ['is_empty', 'is_not_empty'].includes(filter.operator))) {
        result = result.filter(lead => {
          const fieldValue = (lead as any)[filter.field];
          
          switch (filter.operator) {
            case 'equals':
              return fieldValue === filter.value;
            case 'contains':
              return fieldValue && fieldValue.toString().toLowerCase().includes(filter.value.toLowerCase());
            case 'starts_with':
              return fieldValue && fieldValue.toString().toLowerCase().startsWith(filter.value.toLowerCase());
            case 'ends_with':
              return fieldValue && fieldValue.toString().toLowerCase().endsWith(filter.value.toLowerCase());
            case 'greater_than':
              return fieldValue && parseFloat(fieldValue) > parseFloat(filter.value);
            case 'less_than':
              return fieldValue && parseFloat(fieldValue) < parseFloat(filter.value);
            case 'is_empty':
              return !fieldValue || fieldValue === '';
            case 'is_not_empty':
              return fieldValue && fieldValue !== '';
            default:
              return true;
          }
        });
      }
    });

    // Apply sorting
    result.sort((a, b) => {
      const aValue = (a as any)[sortBy];
      const bValue = (b as any)[sortBy];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue);
      }
      
      return (aValue || 0) - (bValue || 0);
    });

    return result;
  }, [mockLeads, searchTerm, filterStatus, filters, sortBy]);

  const getStatusBadge = (status: string) => {
    const colors = {
      'HOT': 'bg-red-100 text-red-800 border-red-200',
      'WARM': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'COLD': 'bg-blue-100 text-blue-800 border-blue-200',
      'PASS': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status as keyof typeof colors] || colors.COLD;
  };

  const handleSort = (field: string) => {
    setSortBy(field);
  };

  const handleSaveView = (view: Omit<SavedView, 'id' | 'createdAt'>) => {
    const newView: SavedView = {
      ...view,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setSavedViews(prev => [...prev, newView]);
  };

  const handleDeleteView = (viewId: string) => {
    setSavedViews(prev => prev.filter(v => v.id !== viewId));
    toast({
      title: "View deleted",
      description: "The saved view has been removed",
    });
  };

  const handleApplyView = (view: SavedView) => {
    // Apply the saved view's filters
    // This would restore the state from the saved view
    toast({
      title: "View applied",
      description: `Applied view: ${view.name}`,
    });
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
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-200/60 px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <SidebarTrigger className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg transition-all duration-200" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Seller Leads</h1>
            <p className="text-sm text-gray-600 mt-0.5">
              Manage and track your seller leads with advanced filtering and multiple view options
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleExportData}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => setIsTemplateDialogOpen(true)} variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Templates
            </Button>
            <AddSellerDialog onAddSeller={handleAddLead} />
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="HOT">Hot</SelectItem>
                <SelectItem value="WARM">Warm</SelectItem>
                <SelectItem value="COLD">Cold</SelectItem>
                <SelectItem value="PASS">Pass</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ownerName">Owner Name</SelectItem>
                <SelectItem value="propertyAddress">Property Address</SelectItem>
                <SelectItem value="currentArrears">Current Arrears</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <ViewSwitcher currentView={currentView} onViewChange={setCurrentView} />
        </div>
      </header>

      <main className="p-6 bg-gradient-to-br from-gray-50/30 to-white space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters and Saved Views Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <AdvancedFilters
              filters={filters}
              onFiltersChange={setFilters}
              availableFields={availableFields}
            />
            <SavedViewsManager
              views={savedViews}
              onSaveView={handleSaveView}
              onDeleteView={handleDeleteView}
              onApplyView={handleApplyView}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {currentView === 'table' && (
              <LeadTableView
                leads={filteredLeads}
                onLeadSelect={setSelectedLead}
                getStatusBadge={getStatusBadge}
                handleSort={handleSort}
              />
            )}
            
            {currentView === 'card' && (
              <LeadCardView
                leads={filteredLeads}
                onLeadSelect={setSelectedLead}
                onLeadEdit={setSelectedLead}
                getStatusBadge={getStatusBadge}
              />
            )}
            
            {currentView === 'calendar' && (
              <LeadCalendarView
                leads={filteredLeads}
                onLeadSelect={setSelectedLead}
                getStatusBadge={getStatusBadge}
              />
            )}
            
            {currentView === 'timeline' && (
              <LeadTimelineView
                leads={filteredLeads}
                onLeadSelect={setSelectedLead}
                getStatusBadge={getStatusBadge}
              />
            )}
            
            {currentView === 'badge' && (
              <LeadBadgeView
                leads={filteredLeads}
                onLeadSelect={setSelectedLead}
                getStatusBadge={getStatusBadge}
              />
            )}
          </div>
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

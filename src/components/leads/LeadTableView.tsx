
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Download, Trash2, X } from 'lucide-react';
import { TaxLead } from '@/types/taxLead';
import { LeadTableRow } from './LeadTableRow';
import { PodioFilterPanel } from './PodioFilterPanel';
import { toast } from 'sonner';
import { FilterState, createEmptyFilterState } from './filters/FilterState';

interface LeadTableViewProps {
  leads: TaxLead[];
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  onLeadClick?: (lead: TaxLead) => void;
  onLeadSelect?: (lead: TaxLead) => void;
  onDeleteLead?: (leadId: number) => void;
  onBulkDelete?: (leadIds: number[]) => void;
  onDeleteSingleLead?: (leadId: number) => void;
  onDeleteMultipleLeads?: (leadIds: number[]) => void;
  getStatusBadge?: (status: string) => string;
  handleSort?: (field: string) => void;
}

export function LeadTableView({
  leads,
  searchTerm = '',
  onSearchChange,
  onLeadClick,
  onLeadSelect,
  onDeleteLead,
  onBulkDelete,
  onDeleteSingleLead,
  onDeleteMultipleLeads,
  getStatusBadge,
  handleSort
}: LeadTableViewProps) {
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [internalSearchTerm, setInternalSearchTerm] = useState(searchTerm);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(createEmptyFilterState());
  const checkboxRef = useRef<HTMLInputElement>(null);
  const effectiveSearchTerm = onSearchChange ? searchTerm : internalSearchTerm;

  // Apply filters to leads
  const applyFilters = (leadsToFilter: TaxLead[]) => {
    return leadsToFilter.filter(lead => {
      let passesFilter = true;
      
      if (filters.leadStatus && lead.status !== filters.leadStatus) {
        passesFilter = false;
      }
      
      if (filters.createdBy && !lead.ownerName.toLowerCase().includes(filters.createdBy.toLowerCase())) {
        passesFilter = false;
      }
      
      if (filters.sellerContact) {
        const contactSearch = filters.sellerContact.toLowerCase();
        const matchesContact = (lead.email && lead.email.toLowerCase().includes(contactSearch)) ||
                              (lead.phone && lead.phone.includes(filters.sellerContact)) ||
                              (lead.ownerName && lead.ownerName.toLowerCase().includes(contactSearch));
        if (!matchesContact) {
          passesFilter = false;
        }
      }
      
      if (filters.createdOnStart) {
        const leadDate = new Date(lead.createdAt || '');
        const startDate = new Date(filters.createdOnStart);
        if (leadDate < startDate) {
          passesFilter = false;
        }
      }
      
      if (filters.createdOnEnd) {
        const leadDate = new Date(lead.createdAt || '');
        const endDate = new Date(filters.createdOnEnd);
        if (leadDate > endDate) {
          passesFilter = false;
        }
      }
      
      if (filters.minArrears !== undefined && (lead.currentArrears || 0) < filters.minArrears) {
        passesFilter = false;
      }
      
      if (filters.maxArrears !== undefined && (lead.currentArrears || 0) > filters.maxArrears) {
        passesFilter = false;
      }
      
      return passesFilter;
    });
  };

  const searchFilteredLeads = leads.filter(lead => {
    const searchTermLower = effectiveSearchTerm.toLowerCase();
    return (
      (lead.ownerName || '').toLowerCase().includes(searchTermLower) ||
      (lead.propertyAddress || '').toLowerCase().includes(searchTermLower) ||
      (lead.taxId || '').toLowerCase().includes(searchTermLower) ||
      (lead.email || '').toLowerCase().includes(searchTermLower)
    );
  });

  const filteredLeads = applyFilters(searchFilteredLeads);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLeads(filteredLeads.map(lead => lead.id));
    } else {
      setSelectedLeads([]);
    }
  };

  const handleSelectLead = (leadId: number, checked: boolean) => {
    if (checked) {
      setSelectedLeads(prev => [...prev, leadId]);
    } else {
      setSelectedLeads(prev => prev.filter(id => id !== leadId));
    }
  };

  const handleBulkDelete = () => {
    if (selectedLeads.length === 0) return;

    const confirmed = window.confirm(`Are you sure you want to permanently delete ${selectedLeads.length} selected lead(s)?`);
    if (confirmed) {
      if (onBulkDelete) {
        onBulkDelete(selectedLeads);
      } else if (onDeleteMultipleLeads) {
        onDeleteMultipleLeads(selectedLeads);
      }
      setSelectedLeads([]);
      toast.success(`${selectedLeads.length} leads deleted successfully`);
    }
  };

  const handleBulkExport = () => {
    if (selectedLeads.length === 0) return;

    // Create CSV data for selected leads
    const selectedLeadsData = filteredLeads.filter(lead => selectedLeads.includes(lead.id));
    const csvContent = [
      'Owner Name,Property Address,Email Address,Tax ID,Current Arrears,Status,Created On',
      ...selectedLeadsData.map(lead => 
        `"${lead.ownerName}","${lead.propertyAddress}","${lead.email || ''}","${lead.taxId}","${lead.currentArrears || 0}","${lead.status}","${lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : ''}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `selected-leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success(`${selectedLeads.length} leads exported successfully`);
  };

  const handleLeadClick = (lead: TaxLead) => {
    if (onLeadClick) {
      onLeadClick(lead);
    } else if (onLeadSelect) {
      onLeadSelect(lead);
    }
  };

  const handleDeleteSingle = (leadId: number) => {
    if (onDeleteLead) {
      onDeleteLead(leadId);
    } else if (onDeleteSingleLead) {
      onDeleteSingleLead(leadId);
    }
  };

  const handleClearAllFilters = () => {
    setFilters(createEmptyFilterState());
  };

  const isAllSelected = selectedLeads.length === filteredLeads.length && filteredLeads.length > 0;
  const isPartiallySelected = selectedLeads.length > 0 && selectedLeads.length < filteredLeads.length;

  // Update checkbox ref when selection state changes
  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = isPartiallySelected;
    }
  }, [isPartiallySelected]);

  const defaultGetStatusBadge = (status: string) => {
    switch (status) {
      case 'HOT':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'WARM':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'COLD':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PASS':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleSearchChange = (value: string) => {
    if (onSearchChange) {
      onSearchChange(value);
    } else {
      setInternalSearchTerm(value);
    }
  };

  const getActiveFiltersCount = () => {
    return Object.entries(filters).filter(([key, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      return value && value !== '';
    }).length;
  };

  return (
    <div className="space-y-4">
      {/* Search and Action Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search leads..."
            value={effectiveSearchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          {/* Conditional Action Buttons - Only show when leads are selected */}
          {selectedLeads.length > 0 && (
            <>
              <Badge variant="secondary" className="text-sm bg-blue-50 text-blue-700 border-blue-200">
                {selectedLeads.length} selected
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkExport}
                className="flex items-center gap-2 text-green-600 border-green-200 hover:bg-green-50"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </>
          )}
          
          {/* Filter Button - Always visible */}
          {selectedLeads.length === 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFilterPanelOpen(true)}
              className="flex items-center gap-2 relative"
            >
              <Filter className="w-4 h-4" />
              Filter
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="ml-1 bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center">
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {getActiveFiltersCount() > 0 && (
        <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded-lg border">
          <span className="text-sm text-gray-600 font-medium">Active filters:</span>
          {Object.entries(filters).map(([key, value]) => {
            if (Array.isArray(value) && value.length > 0) {
              return (
                <Badge key={key} variant="secondary" className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                  {key}: {value.join(', ')}
                  <X className="w-3 h-3 cursor-pointer hover:text-blue-900" onClick={() => setFilters({...filters, [key]: []})} />
                </Badge>
              );
            } else if (value && value !== '') {
              return (
                <Badge key={key} variant="secondary" className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                  {key}: {value}
                  <X className="w-3 h-3 cursor-pointer hover:text-blue-900" onClick={() => setFilters({...filters, [key]: Array.isArray(value) ? [] : ''})} />
                </Badge>
              );
            }
            return null;
          })}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAllFilters}
            className="text-xs text-gray-600 hover:text-gray-800 px-2 py-1 h-auto"
          >
            Clear All
          </Button>
        </div>
      )}

      {/* Updated Table with Email as separate column */}
      <div className="border rounded-lg overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12">
                <input
                  ref={checkboxRef}
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300"
                />
              </TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Property Address</TableHead>
              <TableHead>Email Address</TableHead>
              <TableHead>Tax ID</TableHead>
              <TableHead>Arrears</TableHead>
              <TableHead>Lead Status</TableHead>
              <TableHead>Created On</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.length === 0 ? (
              <TableRow>
                <td colSpan={9} className="text-center py-8 text-gray-500">
                  {getActiveFiltersCount() > 0 
                    ? "No leads found matching your search criteria and filters"
                    : "No leads found matching your search criteria"
                  }
                </td>
              </TableRow>
            ) : (
              filteredLeads.map((lead) => (
                <LeadTableRow
                  key={lead.id}
                  lead={lead}
                  isSelected={selectedLeads.includes(lead.id)}
                  onSelect={(checked) => handleSelectLead(lead.id, checked)}
                  onLeadSelect={() => handleLeadClick(lead)}
                  onDelete={() => handleDeleteSingle(lead.id)}
                  getStatusBadge={getStatusBadge || defaultGetStatusBadge}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary Footer */}
      <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
        <div>
          Showing {filteredLeads.length} of {leads.length} leads
          {getActiveFiltersCount() > 0 && (
            <span className="ml-2 text-blue-600">
              ({getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? 's' : ''} applied)
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
            <span>Hot: {leads.filter(l => l.status === 'HOT').length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-100 border border-orange-200 rounded"></div>
            <span>Warm: {leads.filter(l => l.status === 'WARM').length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
            <span>Cold: {leads.filter(l => l.status === 'COLD').length}</span>
          </div>
        </div>
      </div>

      {/* Podio Filter Panel */}
      <PodioFilterPanel
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        totalResults={leads.length}
        filteredResults={filteredLeads.length}
        leads={leads}
      />
    </div>
  );
}


import { useState, useMemo, useEffect } from 'react';
import { TaxLead } from '@/types/taxLead';
import { mockTaxLeads } from '@/data/mockTaxLeads';
import { FilterCondition } from './filters/types';

const FILTERS_STORAGE_KEY = 'seller-leads-filters';

export function useLeadsLogic() {
  const [currentView, setCurrentView] = useState<'table' | 'card' | 'calendar' | 'timeline' | 'badge'>('table');
  const [sortBy, setSortBy] = useState('ownerName');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedLead, setSelectedLead] = useState<TaxLead | null>(null);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [leads, setLeads] = useState<TaxLead[]>(mockTaxLeads);

  // Load filters from session storage on mount
  useEffect(() => {
    const savedFilters = sessionStorage.getItem(FILTERS_STORAGE_KEY);
    if (savedFilters) {
      try {
        const parsedFilters = JSON.parse(savedFilters);
        setFilters(parsedFilters);
        if (parsedFilters.length > 0) {
          setShowFilterSidebar(true);
        }
      } catch (error) {
        console.error('Error loading saved filters:', error);
      }
    }
  }, []);

  // Save filters to session storage whenever they change
  useEffect(() => {
    sessionStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
  }, [filters]);

  const availableFields = [
    { key: 'status', label: 'Lead Status', type: 'select' },
    { key: 'createdBy', label: 'Created By', type: 'select' },
    { key: 'createdOn', label: 'Created On', type: 'date' },
    { key: 'createdVia', label: 'Created Via', type: 'select' },
    { key: 'lastEdited', label: 'Last Edited', type: 'select' },
    { key: 'tags', label: 'Tags', type: 'multiselect' },
    { key: 'currentArrears', label: 'Current Arrears', type: 'number' },
    { key: 'ownerName', label: 'Owner Name', type: 'text' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'moveTo', label: 'Move To', type: 'select' },
    { key: 'leadManager', label: 'Lead Manager', type: 'select' }
  ];

  const filteredLeads = useMemo(() => {
    let result = leads;

    // Apply filters
    filters.forEach(filter => {
      result = result.filter(lead => {
        const fieldValue = lead[filter.field as keyof TaxLead];
        if (!fieldValue && filter.value !== 'not_set') return false;
        
        switch (filter.operator) {
          case 'equals':
            if (filter.value === 'not_set') {
              return !fieldValue || fieldValue === '';
            }
            return String(fieldValue).toLowerCase() === filter.value.toLowerCase();
          case 'contains':
            return String(fieldValue).toLowerCase().includes(filter.value.toLowerCase());
          case 'starts_with':
            return String(fieldValue).toLowerCase().startsWith(filter.value.toLowerCase());
          case 'gte':
            return new Date(String(fieldValue)) >= new Date(filter.value);
          case 'lte':
            return new Date(String(fieldValue)) <= new Date(filter.value);
          default:
            return true;
        }
      });
    });

    // Apply status filter (legacy support)
    if (filterStatus !== 'all') {
      result = result.filter(lead => lead.status.toLowerCase() === filterStatus.toLowerCase());
    }

    return result;
  }, [leads, filters, filterStatus]);

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'HOT': 'bg-agile-red-100 text-agile-red-800 border-agile-red-200',
      'WARM': 'bg-agile-coral-100 text-agile-coral-800 border-agile-coral-200',
      'COLD': 'bg-agile-blue-100 text-agile-blue-800 border-agile-blue-200',
      'PASS': 'bg-agile-gray-100 text-agile-gray-800 border-agile-gray-200'
    };
    return statusColors[status as keyof typeof statusColors] || statusColors.COLD;
  };

  const handleSort = (field: string) => {
    setSortBy(field);
  };

  const handleAddLead = (lead: TaxLead) => {
    const newLead = { ...lead, id: Date.now() };
    setLeads(prevLeads => [...prevLeads, newLead]);
    console.log('Adding lead:', newLead);
  };

  const handleLeadUpdate = (updatedLead: TaxLead) => {
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === updatedLead.id ? updatedLead : lead
      )
    );
    console.log('Updating lead:', updatedLead);
  };

  const handleBulkLeadsUpdate = (updatedLeads: TaxLead[]) => {
    setLeads(updatedLeads);
    console.log('Bulk updating leads:', updatedLeads);
  };

  const handleFilterToggle = () => {
    if (filters.length > 0) {
      setShowFilterSidebar(true);
    }
  };

  const handleClearAllFilters = () => {
    setFilters([]);
    setShowFilterSidebar(false);
    sessionStorage.removeItem(FILTERS_STORAGE_KEY);
  };

  return {
    currentView,
    sortBy,
    filterStatus,
    selectedLead,
    isTemplateDialogOpen,
    filters,
    availableFields,
    filteredLeads,
    mockLeads: leads,
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
    handleFilterToggle,
    handleClearAllFilters
  };
}

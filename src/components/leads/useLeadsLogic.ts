
import { useState, useMemo, useEffect } from 'react';
import { TaxLead } from '@/types/taxLead';
import { useLeadsData } from '@/hooks/useLeadsData';
import { useComprehensiveLeadActivityTracker } from '@/hooks/useComprehensiveLeadActivityTracker';
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

  const {
    trackLeadCreated,
    trackLeadUpdated,
    trackLeadDeleted,
    trackStatusChanged,
    trackTemperatureChanged,
    trackBulkLeadsUpdated,
    trackBulkLeadsDeleted,
    trackLeadViewed
  } = useComprehensiveLeadActivityTracker();

  // Use the persistent data hook instead of local state
  const { 
    mockLeads, 
    setMockLeads, 
    handleAddLead: addLead, 
    handleLeadUpdate: updateLead,
    handleDeleteLead,
    handleBulkDeleteLeads,
    isLoaded
  } = useLeadsData();

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
    let result = mockLeads;

    // Apply filters
    filters.forEach(filter => {
      result = result.filter(lead => {
        let fieldValue: any;
        
        // Map filter fields to actual lead properties
        switch (filter.field) {
          case 'leadStatus':
            fieldValue = lead.status;
            break;
          case 'createdBy':
            fieldValue = lead.ownerName; // Using ownerName as proxy for createdBy
            break;
          case 'createdVia':
            fieldValue = lead.createdVia || 'Manual Entry';
            break;
          case 'createdOn':
            fieldValue = lead.createdAt;
            break;
          case 'tags':
            fieldValue = lead.tags || [];
            break;
          case 'leadManager':
            fieldValue = lead.leadManager || 'Unassigned';
            break;
          case 'email':
            fieldValue = lead.email;
            break;
          case 'phone':
            fieldValue = lead.phone;
            break;
          default:
            fieldValue = lead[filter.field as keyof TaxLead];
        }

        if (!fieldValue && filter.value !== 'not_set') return false;
        
        switch (filter.operator) {
          case 'equals':
            if (filter.value === 'not_set') {
              return !fieldValue || fieldValue === '';
            }
            return String(fieldValue).toLowerCase() === filter.value.toLowerCase();
          case 'contains':
            if (Array.isArray(fieldValue)) {
              return fieldValue.some(item => 
                String(item).toLowerCase().includes(filter.value.toLowerCase())
              );
            }
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
  }, [mockLeads, filters, filterStatus]);

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

  const handleAddLead = async (lead: TaxLead) => {
    const newLead = { ...lead, id: Date.now() };
    await addLead(newLead);
    
    // Track the activity
    trackLeadCreated(newLead);
    
    console.log('Adding lead:', newLead);
  };

  const handleLeadUpdate = async (updatedLead: TaxLead) => {
    const originalLead = mockLeads.find(lead => lead.id === updatedLead.id);
    
    // Determine changed fields
    const changedFields: string[] = [];
    if (originalLead) {
      Object.keys(updatedLead).forEach(key => {
        if (originalLead[key as keyof TaxLead] !== updatedLead[key as keyof TaxLead]) {
          changedFields.push(key);
        }
      });
    }

    await updateLead(updatedLead);
    
    // Track the activity with changed fields
    trackLeadUpdated(updatedLead, changedFields, originalLead);
    
    // Track specific status or temperature changes
    if (originalLead && originalLead.status !== updatedLead.status) {
      trackStatusChanged(updatedLead, originalLead.status, updatedLead.status);
    }
    
    if (originalLead && originalLead.temperature !== updatedLead.temperature) {
      trackTemperatureChanged(updatedLead, originalLead.temperature, updatedLead.temperature);
    }
    
    console.log('Updating lead:', updatedLead);
  };

  const handleBulkLeadsUpdate = async (updatedLeads: TaxLead[]) => {
    setMockLeads(updatedLeads);
    
    // Track bulk update activity
    trackBulkLeadsUpdated(updatedLeads, 'Updated');
    
    console.log('Bulk updating leads:', updatedLeads);
  };

  const handleDeleteSingleLead = async (leadId: number) => {
    const leadToDelete = mockLeads.find(lead => lead.id === leadId);
    await handleDeleteLead(leadId);
    
    // Track the activity
    if (leadToDelete) {
      trackLeadDeleted(leadToDelete);
    }
    
    console.log('Deleting single lead:', leadId);
  };

  const handleDeleteMultipleLeads = async (leadIds: number[]) => {
    const leadsToDelete = mockLeads.filter(lead => leadIds.includes(lead.id));
    await handleBulkDeleteLeads(leadIds);
    
    // Track the activity
    trackBulkLeadsDeleted(leadsToDelete);
    
    console.log('Deleting multiple leads:', leadIds);
  };

  const handleLeadView = (lead: TaxLead) => {
    setSelectedLead(lead);
    trackLeadViewed(lead);
  };

  const handleFilterToggle = () => {
    setShowFilterSidebar(!showFilterSidebar);
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
    mockLeads,
    showFilterSidebar,
    sidebarCollapsed,
    isLoaded,
    setCurrentView,
    setSortBy,
    setFilterStatus,
    setSelectedLead: handleLeadView,
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
    handleFilterToggle,
    handleClearAllFilters
  };
}

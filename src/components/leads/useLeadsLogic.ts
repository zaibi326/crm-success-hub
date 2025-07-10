
import { useState, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLeadsData } from '@/hooks/useLeadsData';
import { TaxLead } from '@/types/taxLead';

interface FilterCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

export function useLeadsLogic() {
  const [currentView, setCurrentView] = useState<'table' | 'card' | 'calendar' | 'timeline' | 'badge'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('ownerName');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedLead, setSelectedLead] = useState<TaxLead | null>(null);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  
  const { mockLeads, handleAddLead, handleLeadUpdate } = useLeadsData();
  const { toast } = useToast();

  // Available fields for filtering
  const availableFields = [
    { key: 'status', label: 'Status', type: 'select' },
    { key: 'currentArrears', label: 'Current Arrears', type: 'number' },
    { key: 'createdBy', label: 'Created By', type: 'text' },
    { key: 'createdOn', label: 'Created On', type: 'date' },
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

  return {
    // State
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
    
    // State setters
    setCurrentView,
    setSearchTerm,
    setSortBy,
    setFilterStatus,
    setSelectedLead,
    setIsTemplateDialogOpen,
    setFilters,
    
    // Functions
    getStatusBadge,
    handleSort,
    handleExportData,
    handleAddLead,
    handleLeadUpdate,
    
    // External dependencies
    toast
  };
}

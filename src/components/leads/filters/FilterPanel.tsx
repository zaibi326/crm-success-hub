
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { LeadStatusFilters } from './LeadStatusFilters';
import { DateRangeFilters } from './DateRangeFilters';
import { DropdownFilters } from './DropdownFilters';
import { TextInputFilters } from './TextInputFilters';
import { ActiveFilters } from './ActiveFilters';

interface FilterCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
  label?: string;
}

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterCondition[];
  onFiltersChange: (filters: FilterCondition[]) => void;
  onApplyFilters: () => void;
  onSaveView: () => void;
  onClearAll: () => void;
}

export function FilterPanel({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onApplyFilters,
  onSaveView,
  onClearAll
}: FilterPanelProps) {
  if (!isOpen) return null;

  const addFilter = (field: string, operator: string, value: string, label: string) => {
    const newFilter: FilterCondition = {
      id: `${field}-${Date.now()}`,
      field,
      operator,
      value,
      label
    };
    onFiltersChange([...filters, newFilter]);
  };

  const removeFilter = (id: string) => {
    onFiltersChange(filters.filter(f => f.id !== id));
  };

  const handleClear = () => {
    onFiltersChange([]);
    onClearAll();
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-[480px] bg-white border border-agile-gray-200 rounded-lg shadow-lg z-50 animate-fade-in">
      <div className="p-4 border-b border-agile-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-agile-gray-900">Filter Leads</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6 max-h-96 overflow-y-auto">
        <LeadStatusFilters onAddFilter={addFilter} />
        <DropdownFilters onAddFilter={addFilter} />
        <DateRangeFilters onAddFilter={addFilter} />
        <TextInputFilters onAddFilter={addFilter} />
        <ActiveFilters filters={filters} onRemoveFilter={removeFilter} />
      </div>

      <div className="p-4 border-t border-agile-gray-100 bg-agile-gray-50">
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="text-agile-red-600 border-agile-red-200 hover:bg-agile-red-50"
          >
            Clear All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onSaveView}
            className="text-agile-gray-700 border-agile-gray-300 hover:bg-agile-gray-50"
          >
            Save View
          </Button>
          <Button
            size="sm"
            onClick={() => {
              onApplyFilters();
              onClose();
            }}
            className="bg-agile-blue-600 hover:bg-agile-blue-700 text-white"
          >
            View Results
          </Button>
        </div>
      </div>
    </div>
  );
}

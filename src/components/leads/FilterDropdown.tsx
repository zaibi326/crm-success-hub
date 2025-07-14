
import React, { useState } from 'react';
import { FilterPanel } from './filters/FilterPanel';

interface FilterCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
  label?: string;
}

interface FilterDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterCondition[];
  onFiltersChange: (filters: FilterCondition[]) => void;
  onApplyFilters: () => void;
  onSaveView: () => void;
  onClearAll: () => void;
}

export function FilterDropdown({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onApplyFilters,
  onSaveView,
  onClearAll
}: FilterDropdownProps) {
  const [tempFilters, setTempFilters] = useState<FilterCondition[]>(filters);

  const handleApply = () => {
    onFiltersChange(tempFilters);
    onApplyFilters();
    onClose();
  };

  const handleSave = () => {
    onSaveView();
    // TODO: Implement save view functionality
  };

  const handleClear = () => {
    setTempFilters([]);
    onClearAll();
  };

  return (
    <FilterPanel
      isOpen={isOpen}
      onClose={onClose}
      filters={tempFilters}
      onFiltersChange={setTempFilters}
      onApplyFilters={handleApply}
      onSaveView={handleSave}
      onClearAll={handleClear}
    />
  );
}

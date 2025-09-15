
import React, { useState } from 'react';
import { FilterPanel } from './filters/FilterPanel';
import { FilterCondition } from './filters/types';
import { SaveViewDialog } from './SaveViewDialog';

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
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const handleApply = () => {
    onFiltersChange(tempFilters);
    onApplyFilters();
    onClose();
  };

  const handleSave = () => {
    setShowSaveDialog(true);
  };

  const handleClear = () => {
    setTempFilters([]);
    onClearAll();
  };

  return (
    <>
      <FilterPanel
        isOpen={isOpen}
        onClose={onClose}
        filters={tempFilters}
        onFiltersChange={setTempFilters}
        onApplyFilters={handleApply}
        onSaveView={handleSave}
        onClearAll={handleClear}
      />
      
      <SaveViewDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        filters={tempFilters}
      />
    </>
  );
}

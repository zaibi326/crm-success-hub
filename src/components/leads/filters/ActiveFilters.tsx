
import React from 'react';
import { X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { FilterCondition } from './types';

interface ActiveFiltersProps {
  filters: FilterCondition[];
  onRemoveFilter: (id: string) => void;
}

export function ActiveFilters({ filters, onRemoveFilter }: ActiveFiltersProps) {
  if (filters.length === 0) return null;

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-agile-gray-700">Active Filters</Label>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <div
            key={filter.id}
            className="flex items-center gap-1 px-2 py-1 bg-agile-blue-50 text-agile-blue-700 rounded-md text-xs border border-agile-blue-200"
          >
            <span>{filter.label || `${filter.field}: ${filter.value}`}</span>
            <button
              onClick={() => onRemoveFilter(filter.id)}
              className="text-agile-blue-500 hover:text-agile-red-600"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

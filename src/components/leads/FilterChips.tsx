
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FilterCondition } from './filters/types';

interface FilterChipsProps {
  filters: FilterCondition[];
  onRemoveFilter: (filterId: string) => void;
  onClearAll: () => void;
}

export function FilterChips({ filters, onRemoveFilter, onClearAll }: FilterChipsProps) {
  if (filters.length === 0) return null;

  const getFilterChipColor = (field: string) => {
    switch (field) {
      case 'leadStatus':
        return 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100';
      case 'createdBy':
      case 'leadManager':
        return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
      case 'createdOn':
      case 'lastEdited':
        return 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100';
      case 'createdVia':
        return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100';
      case 'tags':
        return 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100';
      case 'moveTo':
        return 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100';
      case 'email':
      case 'phone':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100';
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-gray-50/50 border-b border-gray-200">
      <span className="text-sm font-medium text-gray-700">Active filters:</span>
      
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Badge 
            key={filter.id} 
            variant="secondary" 
            className={`flex items-center gap-1 transition-colors ${getFilterChipColor(filter.field)}`}
          >
            <span className="text-xs font-medium">{filter.label}</span>
            <X 
              className="w-3 h-3 cursor-pointer hover:text-red-600 transition-colors" 
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFilter(filter.id);
              }}
            />
          </Badge>
        ))}
      </div>
      
      {filters.length > 1 && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClearAll}
          className="text-xs text-gray-600 hover:text-red-600 hover:bg-red-50 px-2 py-1 h-auto ml-2"
        >
          Clear All
        </Button>
      )}
    </div>
  );
}


import React from 'react';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FilterCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface FilterChipsProps {
  filters: FilterCondition[];
  onRemoveFilter: (filterId: string) => void;
  onClearAll: () => void;
}

export function FilterChips({ filters, onRemoveFilter, onClearAll }: FilterChipsProps) {
  if (filters.length === 0) return null;

  const getFilterLabel = (filter: FilterCondition) => {
    const fieldLabels: Record<string, string> = {
      status: 'Status',
      createdBy: 'Created By',
      createdOn: 'Created On',
      tags: 'Tags',
      currentArrears: 'Current Arrears',
      ownerName: 'Owner Name',
      email: 'Email',
      phone: 'Phone'
    };

    const fieldLabel = fieldLabels[filter.field] || filter.field;
    return `${fieldLabel}: ${filter.value}`;
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-podio-background border-b border-podio-border">
      <span className="text-sm text-podio-text-muted">Active filters:</span>
      
      {filters.map((filter) => (
        <Badge 
          key={filter.id} 
          variant="secondary" 
          className="flex items-center gap-1 bg-podio-primary/10 text-podio-primary border-podio-primary/20 hover:bg-podio-primary/20"
        >
          {getFilterLabel(filter)}
          <X 
            className="w-3 h-3 cursor-pointer hover:text-podio-primary" 
            onClick={() => onRemoveFilter(filter.id)}
          />
        </Badge>
      ))}
      
      {filters.length > 1 && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClearAll}
          className="text-xs text-podio-text-muted hover:text-podio-text hover:bg-podio-hover px-2 py-1 h-auto"
        >
          Clear All
        </Button>
      )}
    </div>
  );
}

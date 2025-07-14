
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface TextInputFiltersProps {
  onAddFilter: (field: string, operator: string, value: string, label: string) => void;
}

export function TextInputFilters({ onAddFilter }: TextInputFiltersProps) {
  return (
    <>
      {/* Tags Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-agile-gray-700">Tags</Label>
        <Input
          placeholder="Enter tag..."
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.currentTarget.value) {
              onAddFilter('tags', 'contains', e.currentTarget.value, `Tag: ${e.currentTarget.value}`);
              e.currentTarget.value = '';
            }
          }}
        />
      </div>

      {/* Seller Contact Filters */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-agile-gray-700">Seller Contact</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Email..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value) {
                onAddFilter('email', 'contains', e.currentTarget.value, `Email: ${e.currentTarget.value}`);
                e.currentTarget.value = '';
              }
            }}
          />
          <Input
            placeholder="Phone..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value) {
                onAddFilter('phone', 'contains', e.currentTarget.value, `Phone: ${e.currentTarget.value}`);
                e.currentTarget.value = '';
              }
            }}
          />
        </div>
      </div>
    </>
  );
}

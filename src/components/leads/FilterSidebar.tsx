
import React from 'react';
import { X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FilterCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterCondition[];
  onRemoveFilter: (filterId: string) => void;
  onClearAll: () => void;
}

export function FilterSidebar({ 
  isOpen, 
  onClose, 
  filters, 
  onRemoveFilter, 
  onClearAll 
}: FilterSidebarProps) {
  if (!isOpen) return null;

  const getFilterLabel = (filter: FilterCondition) => {
    const fieldLabels: Record<string, string> = {
      status: 'Lead Status',
      createdBy: 'Created By',
      createdOn: 'Created On',
      createdVia: 'Created Via',
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
    <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-agile-gray-200 shadow-lg z-40 animate-slide-in-right">
      <div className="flex items-center justify-between p-4 border-b border-agile-gray-200">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-agile-blue-600" />
          <h3 className="text-lg font-semibold text-agile-gray-900">Active Filters</h3>
          {filters.length > 0 && (
            <Badge variant="secondary" className="bg-agile-blue-50 text-agile-blue-700">
              {filters.length}
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        {filters.length === 0 ? (
          <div className="text-center py-8">
            <Filter className="w-12 h-12 text-agile-gray-400 mx-auto mb-4" />
            <p className="text-agile-gray-500">No active filters</p>
            <p className="text-sm text-agile-gray-400 mt-1">
              Use the filter button to add filters to your leads
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-agile-gray-700">
                Applied Filters ({filters.length})
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onClearAll}
                className="text-agile-red-600 border-agile-red-200 hover:bg-agile-red-50"
              >
                Clear All
              </Button>
            </div>

            <div className="space-y-3">
              {filters.map((filter) => (
                <div 
                  key={filter.id}
                  className="flex items-center justify-between p-3 bg-agile-gray-50 rounded-lg border border-agile-gray-200"
                >
                  <div className="flex-1">
                    <span className="text-sm text-agile-gray-900">
                      {getFilterLabel(filter)}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveFilter(filter.id)}
                    className="text-agile-gray-400 hover:text-agile-red-600 hover:bg-agile-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

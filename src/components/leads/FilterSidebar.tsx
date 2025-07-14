
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
  label?: string;
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

  const getFilterChipColor = (field: string) => {
    switch (field) {
      case 'status':
        return 'bg-agile-coral-100 text-agile-coral-800 border-agile-coral-200';
      case 'createdBy':
        return 'bg-agile-blue-100 text-agile-blue-800 border-agile-blue-200';
      case 'createdOn':
        return 'bg-agile-gray-100 text-agile-gray-800 border-agile-gray-200';
      case 'createdVia':
        return 'bg-agile-green-100 text-agile-green-800 border-agile-green-200';
      case 'tags':
        return 'bg-agile-purple-100 text-agile-purple-800 border-agile-purple-200';
      default:
        return 'bg-agile-gray-100 text-agile-gray-800 border-agile-gray-200';
    }
  };

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-agile-gray-200 shadow-xl z-40 animate-slide-in-right">
      <div className="flex items-center justify-between p-4 border-b border-agile-gray-200 bg-agile-gray-50">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-agile-blue-600" />
          <h3 className="text-lg font-semibold text-agile-gray-900">Applied Filters</h3>
          {filters.length > 0 && (
            <Badge variant="secondary" className="bg-agile-blue-50 text-agile-blue-700 border-agile-blue-200">
              {filters.length}
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-agile-gray-100">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        {filters.length === 0 ? (
          <div className="text-center py-12">
            <Filter className="w-12 h-12 text-agile-gray-400 mx-auto mb-4" />
            <p className="text-agile-gray-500 font-medium">No filters applied</p>
            <p className="text-sm text-agile-gray-400 mt-1">
              Use the filter button to add filters to your leads
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-agile-gray-700 uppercase tracking-wide">
                Active Filters ({filters.length})
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onClearAll}
                className="text-agile-red-600 border-agile-red-200 hover:bg-agile-red-50 hover:border-agile-red-300"
              >
                Clear All
              </Button>
            </div>

            <div className="space-y-3">
              {filters.map((filter) => (
                <div 
                  key={filter.id}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 hover:shadow-sm ${getFilterChipColor(filter.field)}`}
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium block truncate">
                      {filter.label || `${filter.field}: ${filter.value}`}
                    </span>
                    <span className="text-xs opacity-75 capitalize">
                      {filter.field.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveFilter(filter.id)}
                    className="text-agile-gray-400 hover:text-agile-red-600 hover:bg-agile-red-50 p-1 h-6 w-6 ml-2 flex-shrink-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Filter Summary */}
            <div className="mt-6 p-3 bg-agile-blue-50 rounded-lg border border-agile-blue-200">
              <div className="text-sm text-agile-blue-800">
                <div className="font-medium mb-1">Filter Summary</div>
                <div className="text-xs text-agile-blue-600">
                  {filters.length} filter{filters.length !== 1 ? 's' : ''} applied to your seller leads
                </div>
              </div>
            </div>
          </div>
        )}
      </ScrollArea>

      {/* Mobile collapse button */}
      <div className="md:hidden p-4 border-t border-agile-gray-200 bg-agile-gray-50">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onClose}
          className="w-full"
        >
          Hide Filters
        </Button>
      </div>
    </div>
  );
}

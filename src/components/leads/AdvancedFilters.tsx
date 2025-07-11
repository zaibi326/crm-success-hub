
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Filter } from 'lucide-react';

interface FilterCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface AdvancedFiltersProps {
  filters: FilterCondition[];
  onFiltersChange: (filters: FilterCondition[]) => void;
  availableFields: Array<{ key: string; label: string; type: string }>;
}

export function AdvancedFilters({ filters, onFiltersChange, availableFields }: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const operators = [
    { value: 'equals', label: 'Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'starts_with', label: 'Starts with' },
    { value: 'ends_with', label: 'Ends with' },
    { value: 'greater_than', label: 'Greater than' },
    { value: 'less_than', label: 'Less than' },
    { value: 'is_empty', label: 'Is empty' },
    { value: 'is_not_empty', label: 'Is not empty' },
  ];

  const addFilter = () => {
    const newFilter: FilterCondition = {
      id: Date.now().toString(),
      field: availableFields[0]?.key || '',
      operator: 'equals',
      value: ''
    };
    onFiltersChange([...filters, newFilter]);
  };

  const updateFilter = (id: string, updates: Partial<FilterCondition>) => {
    onFiltersChange(
      filters.map(filter => 
        filter.id === id ? { ...filter, ...updates } : filter
      )
    );
  };

  const removeFilter = (id: string) => {
    onFiltersChange(filters.filter(filter => filter.id !== id));
  };

  const clearAllFilters = () => {
    onFiltersChange([]);
  };

  return (
    <div>
      {/* Compact Filter Toggle Button */}
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="relative w-9 h-9 p-0 bg-white border-gray-200 hover:bg-gray-50"
        >
          <Filter className="w-4 h-4" />
          {filters.length > 0 && (
            <Badge 
              variant="secondary" 
              className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs"
            >
              {filters.length}
            </Badge>
          )}
        </Button>
        {filters.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs">
            Clear All
          </Button>
        )}
      </div>

      {/* Expanded Filter Panel */}
      {isExpanded && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Advanced Filters
                {filters.length > 0 && (
                  <Badge variant="secondary">{filters.length}</Badge>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsExpanded(false)}
              >
                Collapse
              </Button>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {filters.map((filter) => (
              <div key={filter.id} className="flex items-center gap-2 p-3 border rounded-lg">
                <Select
                  value={filter.field}
                  onValueChange={(value) => updateFilter(filter.id, { field: value })}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFields.map((field) => (
                      <SelectItem key={field.key} value={field.key}>
                        {field.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filter.operator}
                  onValueChange={(value) => updateFilter(filter.id, { operator: value })}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {operators.map((op) => (
                      <SelectItem key={op.value} value={op.value}>
                        {op.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {!['is_empty', 'is_not_empty'].includes(filter.operator) && (
                  <Input
                    value={filter.value}
                    onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                    placeholder="Enter value"
                    className="flex-1"
                  />
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFilter(filter.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}

            <Button onClick={addFilter} variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Filter Condition
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

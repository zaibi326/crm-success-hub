
import React, { useState } from 'react';
import { X, Calendar, ChevronDown, Tag, User, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  if (!isOpen) return null;

  const addFilter = (field: string, operator: string, value: string, label: string) => {
    const newFilter: FilterCondition = {
      id: `${field}-${Date.now()}`,
      field,
      operator,
      value,
      label
    };
    setTempFilters([...tempFilters, newFilter]);
  };

  const removeFilter = (id: string) => {
    setTempFilters(tempFilters.filter(f => f.id !== id));
  };

  const handleApply = () => {
    onFiltersChange(tempFilters);
    onApplyFilters();
    onClose();
  };

  const handleClear = () => {
    setTempFilters([]);
    onClearAll();
  };

  const handleSave = () => {
    onSaveView();
    // TODO: Implement save view functionality
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-96 bg-white border border-agile-gray-200 rounded-lg shadow-lg z-50 animate-fade-in">
      <div className="p-4 border-b border-agile-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-agile-gray-900">Filter Leads</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
        {/* Lead Status Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-agile-gray-700">Lead Status</Label>
          <Select onValueChange={(value) => addFilter('status', 'equals', value, `Status: ${value}`)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status..." />
            </SelectTrigger>
            <SelectContent className="bg-white border-agile-gray-200 z-50">
              <SelectItem value="HOT">🔥 HOT</SelectItem>
              <SelectItem value="WARM">🟡 WARM</SelectItem>
              <SelectItem value="COLD">❄️ COLD</SelectItem>
              <SelectItem value="PASS">⏭️ PASS</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Created By Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-agile-gray-700">Created By</Label>
          <Select onValueChange={(value) => addFilter('createdBy', 'equals', value, `Created By: ${value}`)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select creator..." />
            </SelectTrigger>
            <SelectContent className="bg-white border-agile-gray-200 z-50">
              <SelectItem value="John Doe">John Doe</SelectItem>
              <SelectItem value="Jane Smith">Jane Smith</SelectItem>
              <SelectItem value="Admin User">Admin User</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Created On Date Range */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-agile-gray-700">Created On</Label>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "flex-1 justify-start text-left font-normal",
                    !dateFrom && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFrom ? format(dateFrom, "PPP") : "From date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dateFrom}
                  onSelect={(date) => {
                    setDateFrom(date);
                    if (date) {
                      addFilter('createdOn', 'gte', date.toISOString(), `From: ${format(date, 'PPP')}`);
                    }
                  }}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "flex-1 justify-start text-left font-normal",
                    !dateTo && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateTo ? format(dateTo, "PPP") : "To date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dateTo}
                  onSelect={(date) => {
                    setDateTo(date);
                    if (date) {
                      addFilter('createdOn', 'lte', date.toISOString(), `To: ${format(date, 'PPP')}`);
                    }
                  }}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Created Via Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-agile-gray-700">Created Via</Label>
          <Select onValueChange={(value) => addFilter('createdVia', 'equals', value, `Via: ${value}`)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select source..." />
            </SelectTrigger>
            <SelectContent className="bg-white border-agile-gray-200 z-50">
              <SelectItem value="API">🔗 API</SelectItem>
              <SelectItem value="Manual">✋ Manual</SelectItem>
              <SelectItem value="Webform">🌐 Webform</SelectItem>
              <SelectItem value="Import">📊 Import</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tags Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-agile-gray-700">Tags</Label>
          <Input
            placeholder="Enter tag..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value) {
                addFilter('tags', 'contains', e.currentTarget.value, `Tag: ${e.currentTarget.value}`);
                e.currentTarget.value = '';
              }
            }}
          />
        </div>

        {/* Email/Phone Filters */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-agile-gray-700">Email</Label>
            <Input
              placeholder="Enter email..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value) {
                  addFilter('email', 'contains', e.currentTarget.value, `Email: ${e.currentTarget.value}`);
                  e.currentTarget.value = '';
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-agile-gray-700">Phone</Label>
            <Input
              placeholder="Enter phone..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value) {
                  addFilter('phone', 'contains', e.currentTarget.value, `Phone: ${e.currentTarget.value}`);
                  e.currentTarget.value = '';
                }
              }}
            />
          </div>
        </div>

        {/* Current Filters */}
        {tempFilters.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-agile-gray-700">Active Filters</Label>
            <div className="flex flex-wrap gap-2">
              {tempFilters.map((filter) => (
                <div
                  key={filter.id}
                  className="flex items-center gap-1 px-2 py-1 bg-agile-blue-50 text-agile-blue-700 rounded-md text-xs border border-agile-blue-200"
                >
                  <span>{filter.label || `${filter.field}: ${filter.value}`}</span>
                  <button
                    onClick={() => removeFilter(filter.id)}
                    className="text-agile-blue-500 hover:text-agile-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
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
            onClick={handleSave}
            className="text-agile-gray-700 border-agile-gray-300 hover:bg-agile-gray-50"
          >
            Save View
          </Button>
          <Button
            size="sm"
            onClick={handleApply}
            className="bg-agile-blue-600 hover:bg-agile-blue-700 text-white"
          >
            View Results
          </Button>
        </div>
      </div>
    </div>
  );
}

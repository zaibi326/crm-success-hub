
import React, { useState } from 'react';
import { X, Filter, ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface FilterCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
  label: string;
}

interface SavedFilter {
  id: string;
  name: string;
  filters: FilterCondition[];
  createdAt: Date;
}

interface PodioFilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterCondition[];
  onFiltersChange: (filters: FilterCondition[]) => void;
  totalResults?: number;
  filteredResults?: number;
}

const leadStatusOptions = [
  { value: 'HOT', label: 'Hot', color: 'bg-red-100 text-red-800 border-red-200' },
  { value: 'WARM', label: 'Warm', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { value: 'COLD', label: 'Cold', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { value: 'PASS', label: 'Pass', color: 'bg-gray-100 text-gray-800 border-gray-200' }
];

const createdByOptions = [
  'John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Chen', 'System Import'
];

const createdViaOptions = [
  'Manual Entry', 'Facebook Lead Ads', 'Google Ads', 'Website Form', 'Cold Calling', 'Referral', 'Email Campaign', 'Direct Mail'
];

const tagOptions = [
  'High Priority', 'Follow Up', 'Hot Lead', 'Qualified', 'Unqualified', 'Callback Required', 'Email Sent', 'Appointment Set'
];

const leadManagerOptions = [
  'John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Chen', 'Unassigned'
];

const moveToOptions = [
  'Hot Leads', 'Warm Leads', 'Cold Leads', 'Archive', 'Follow Up', 'Qualified', 'Disqualified'
];

export function PodioFilterPanel({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  totalResults,
  filteredResults
}: PodioFilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['leadStatus']));
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [showSavedFilters, setShowSavedFilters] = useState(false);
  const [filterName, setFilterName] = useState('');

  if (!isOpen) return null;

  const addFilter = (field: string, operator: string, value: string, label: string) => {
    const newFilter: FilterCondition = {
      id: `${field}-${value}-${Date.now()}`,
      field,
      operator,
      value,
      label
    };
    onFiltersChange([...filters, newFilter]);
  };

  const removeFilter = (id: string) => {
    onFiltersChange(filters.filter(f => f.id !== id));
  };

  const clearAllFilters = () => {
    onFiltersChange([]);
  };

  const handleSaveFilter = () => {
    if (filterName.trim() && filters.length > 0) {
      const newSavedFilter: SavedFilter = {
        id: `filter-${Date.now()}`,
        name: filterName.trim(),
        filters: [...filters],
        createdAt: new Date()
      };
      setSavedFilters(prev => [...prev, newSavedFilter]);
      setFilterName('');
      toast.success(`Filter "${newSavedFilter.name}" saved successfully!`);
    } else if (!filterName.trim()) {
      toast.error('Please enter a name for the filter');
    } else {
      toast.error('No filters to save');
    }
  };

  const handleLoadSavedFilter = (savedFilter: SavedFilter) => {
    onFiltersChange(savedFilter.filters);
    setShowSavedFilters(false);
    toast.success(`Filter "${savedFilter.name}" applied!`);
  };

  const handleDeleteSavedFilter = (filterId: string) => {
    setSavedFilters(prev => prev.filter(f => f.id !== filterId));
    toast.success('Saved filter deleted!');
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const isFilterActive = (field: string, value: string) => {
    return filters.some(f => f.field === field && f.value === value);
  };

  const getFilterChipColor = (field: string) => {
    switch (field) {
      case 'leadStatus':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'createdBy':
      case 'leadManager':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'createdOn':
      case 'lastEdited':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'createdVia':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'tags':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'moveTo':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const FilterSection = ({ title, field, options, expanded }: {
    title: string;
    field: string;
    options: Array<{ value: string; label: string; color?: string } | string>;
    expanded: boolean;
  }) => (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={() => toggleSection(field)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="font-medium text-gray-900">{title}</span>
          {filters.filter(f => f.field === field).length > 0 && (
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
              {filters.filter(f => f.field === field).length}
            </Badge>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      
      {expanded && (
        <div className="px-4 pb-4">
          <div className="space-y-2">
            {options.map((option) => {
              const optionValue = typeof option === 'string' ? option : option.value;
              const optionLabel = typeof option === 'string' ? option : option.label;
              const isActive = isFilterActive(field, optionValue);
              
              return (
                <div
                  key={optionValue}
                  className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-50"
                  onClick={() => {
                    if (isActive) {
                      const filterToRemove = filters.find(f => f.field === field && f.value === optionValue);
                      if (filterToRemove) removeFilter(filterToRemove.id);
                    } else {
                      addFilter(field, 'equals', optionValue, `${title}: ${optionLabel}`);
                    }
                  }}
                >
                  <Checkbox checked={isActive} />
                  <span className="text-sm text-gray-700">{optionLabel}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            {showSavedFilters ? 'Saved Filters' : 'Filters'}
          </h3>
          {!showSavedFilters && filters.length > 0 && (
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
              {filters.length}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {showSavedFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowSavedFilters(false)}
              className="text-blue-600 hover:bg-blue-50"
            >
              Back
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-100">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Results Summary */}
      {!showSavedFilters && filteredResults !== undefined && totalResults !== undefined && (
        <div className="p-4 bg-blue-50 border-b border-blue-200 flex-shrink-0">
          <div className="text-sm">
            <span className="font-semibold text-blue-900">{filteredResults}</span>
            <span className="text-blue-700"> of </span>
            <span className="font-semibold text-blue-900">{totalResults}</span>
            <span className="text-blue-700"> leads shown</span>
          </div>
        </div>
      )}

      {showSavedFilters ? (
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            {savedFilters.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No saved filters yet</p>
                <p className="text-sm mt-1">Create some filters and save them for quick access</p>
              </div>
            ) : (
              savedFilters.map((savedFilter) => (
                <div key={savedFilter.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{savedFilter.name}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSavedFilter(savedFilter.id)}
                      className="text-red-600 hover:bg-red-50 h-6 w-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {savedFilter.filters.slice(0, 3).map((filter) => (
                      <Badge
                        key={filter.id}
                        variant="secondary"
                        className="text-xs bg-gray-100 text-gray-700"
                      >
                        {filter.label}
                      </Badge>
                    ))}
                    {savedFilter.filters.length > 3 && (
                      <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                        +{savedFilter.filters.length - 3} more
                      </Badge>
                    )}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleLoadSavedFilter(savedFilter)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Apply Filter
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      ) : (
        <>
          {/* Active Filters */}
          {filters.length > 0 && (
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Active Filters ({filters.length})
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearAllFilters}
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 text-xs"
                >
                  Clear All
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <Badge
                    key={filter.id}
                    variant="secondary"
                    className={`flex items-center gap-1 ${getFilterChipColor(filter.field)}`}
                  >
                    <span className="text-xs">{filter.label}</span>
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-red-600" 
                      onClick={() => removeFilter(filter.id)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Scrollable Filter Sections */}
          <ScrollArea className="flex-1">
            <div className="divide-y divide-gray-100">
              <FilterSection
                title="Lead Status"
                field="leadStatus"
                options={leadStatusOptions}
                expanded={expandedSections.has('leadStatus')}
              />
              
              <FilterSection
                title="Created By"
                field="createdBy"
                options={createdByOptions.map(option => ({ value: option, label: option }))}
                expanded={expandedSections.has('createdBy')}
              />

              {/* Date Range Section - Created On */}
              <div className="border-b border-gray-100">
                <button
                  onClick={() => toggleSection('createdOn')}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900">Created On</span>
                    {filters.filter(f => f.field === 'createdOn').length > 0 && (
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                        {filters.filter(f => f.field === 'createdOn').length}
                      </Badge>
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${expandedSections.has('createdOn') ? 'rotate-180' : ''}`} />
                </button>
                
                {expandedSections.has('createdOn') && (
                  <div className="px-4 pb-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-gray-600 mb-1 block">From</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal text-xs",
                                !dateFrom && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-3 w-3" />
                              {dateFrom ? format(dateFrom, "MMM dd") : "Select"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-white" align="start">
                            <Calendar
                              mode="single"
                              selected={dateFrom}
                              onSelect={(date) => {
                                setDateFrom(date);
                                if (date) {
                                  addFilter('createdOn', 'gte', date.toISOString(), `From: ${format(date, 'MMM dd, yyyy')}`);
                                }
                              }}
                              initialFocus
                              className="p-3"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div>
                        <Label className="text-xs text-gray-600 mb-1 block">To</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal text-xs",
                                !dateTo && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-3 w-3" />
                              {dateTo ? format(dateTo, "MMM dd") : "Select"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-white" align="start">
                            <Calendar
                              mode="single"
                              selected={dateTo}
                              onSelect={(date) => {
                                setDateTo(date);
                                if (date) {
                                  addFilter('createdOn', 'lte', date.toISOString(), `To: ${format(date, 'MMM dd, yyyy')}`);
                                }
                              }}
                              initialFocus
                              className="p-3"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <FilterSection
                title="Created Via"
                field="createdVia"
                options={createdViaOptions.map(option => ({ value: option, label: option }))}
                expanded={expandedSections.has('createdVia')}
              />

              <FilterSection
                title="Tags"
                field="tags"
                options={tagOptions.map(option => ({ value: option, label: option }))}
                expanded={expandedSections.has('tags')}
              />

              {/* Seller Contact Section */}
              <div className="border-b border-gray-100">
                <button
                  onClick={() => toggleSection('sellerContact')}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900">Seller Contact</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${expandedSections.has('sellerContact') ? 'rotate-180' : ''}`} />
                </button>
                
                {expandedSections.has('sellerContact') && (
                  <div className="px-4 pb-4 space-y-3">
                    <div>
                      <Label className="text-xs text-gray-600 mb-1 block">Email</Label>
                      <Input
                        placeholder="Enter email..."
                        className="text-xs"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.currentTarget.value) {
                            addFilter('email', 'contains', e.currentTarget.value, `Email: ${e.currentTarget.value}`);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600 mb-1 block">Phone</Label>
                      <Input
                        placeholder="Enter phone..."
                        className="text-xs"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.currentTarget.value) {
                            addFilter('phone', 'contains', e.currentTarget.value, `Phone: ${e.currentTarget.value}`);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <FilterSection
                title="Move To"
                field="moveTo"
                options={moveToOptions.map(option => ({ value: option, label: option }))}
                expanded={expandedSections.has('moveTo')}
              />

              <FilterSection
                title="Lead Manager"
                field="leadManager"
                options={leadManagerOptions.map(option => ({ value: option, label: option }))}
                expanded={expandedSections.has('leadManager')}
              />
            </div>
          </ScrollArea>
        </>
      )}

      {/* Sticky Footer */}
      {!showSavedFilters && (
        <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-3 flex-shrink-0">
          {/* Save Filter Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Enter filter name..."
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSaveFilter();
                }
              }}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveFilter}
              disabled={!filterName.trim() || filters.length === 0}
              className="text-gray-700 border-gray-300 hover:bg-gray-50 whitespace-nowrap"
            >
              Save
            </Button>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSavedFilters(true)}
              className="text-gray-700 border-gray-300 hover:bg-gray-50"
            >
              View Saved ({savedFilters.length})
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

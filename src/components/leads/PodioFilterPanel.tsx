import React, { useState } from 'react';
import { X, Filter, ChevronDown, Check, Save, Trash2, Edit, Star, Calendar, User, Tag, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format, addDays } from 'date-fns';
import { FilterCondition } from './filters/types';
import { useSavedFilters } from '@/hooks/useSavedFilters';

interface PodioFilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterCondition[];
  onFiltersChange: (filters: FilterCondition[]) => void;
  totalResults: number;
  filteredResults: number;
}

export function PodioFilterPanel({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  totalResults,
  filteredResults
}: PodioFilterPanelProps) {
  const [activeTab, setActiveTab] = useState<'filters' | 'saved'>('filters');
  const [saveFilterName, setSaveFilterName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  
  // Filter state
  const [selectedLeadStatuses, setSelectedLeadStatuses] = useState<string[]>([]);
  const [selectedCreatedBy, setSelectedCreatedBy] = useState<string[]>([]);
  const [selectedCreatedVia, setSelectedCreatedVia] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedLeadManager, setSelectedLeadManager] = useState<string[]>([]);
  const [createdDateFrom, setCreatedDateFrom] = useState<Date>();
  const [createdDateTo, setCreatedDateTo] = useState<Date>();
  const [emailFilter, setEmailFilter] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');
  
  const {
    savedFilters,
    saveFilter,
    updateFilter,
    deleteFilter
  } = useSavedFilters();

  // Filter options
  const leadStatusOptions = [
    { value: 'not_set', label: 'Not set' },
    { value: 'HOT', label: 'Hot' },
    { value: 'WARM', label: 'Warm' },
    { value: 'COLD', label: 'Cold' },
    { value: 'PASS', label: 'Pass' }
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

  const applyFilters = () => {
    const newFilters: FilterCondition[] = [];

    // Lead Status filters
    selectedLeadStatuses.forEach(status => {
      const option = leadStatusOptions.find(opt => opt.value === status);
      newFilters.push({
        id: `leadStatus-${status}`,
        field: 'leadStatus',
        operator: 'equals',
        value: status,
        label: `Status: ${option?.label || status}`
      });
    });

    // Created By filters
    selectedCreatedBy.forEach(person => {
      newFilters.push({
        id: `createdBy-${person}`,
        field: 'createdBy',
        operator: 'equals',
        value: person,
        label: `Created by: ${person}`
      });
    });

    // Created Via filters
    selectedCreatedVia.forEach(via => {
      newFilters.push({
        id: `createdVia-${via}`,
        field: 'createdVia',
        operator: 'equals',
        value: via,
        label: `Created via: ${via}`
      });
    });

    // Tags filters
    selectedTags.forEach(tag => {
      newFilters.push({
        id: `tags-${tag}`,
        field: 'tags',
        operator: 'contains',
        value: tag,
        label: `Tag: ${tag}`
      });
    });

    // Lead Manager filters
    selectedLeadManager.forEach(manager => {
      newFilters.push({
        id: `leadManager-${manager}`,
        field: 'leadManager',
        operator: 'equals',
        value: manager,
        label: `Manager: ${manager}`
      });
    });

    // Date filters
    if (createdDateFrom) {
      newFilters.push({
        id: 'createdDateFrom',
        field: 'createdOn',
        operator: 'gte',
        value: createdDateFrom.toISOString(),
        label: `From: ${format(createdDateFrom, 'MMM d, yyyy')}`
      });
    }

    if (createdDateTo) {
      newFilters.push({
        id: 'createdDateTo',
        field: 'createdOn',
        operator: 'lte',
        value: createdDateTo.toISOString(),
        label: `To: ${format(createdDateTo, 'MMM d, yyyy')}`
      });
    }

    // Contact filters
    if (emailFilter.trim()) {
      newFilters.push({
        id: 'email',
        field: 'email',
        operator: 'contains',
        value: emailFilter.trim(),
        label: `Email: ${emailFilter.trim()}`
      });
    }

    if (phoneFilter.trim()) {
      newFilters.push({
        id: 'phone',
        field: 'phone',
        operator: 'contains',
        value: phoneFilter.trim(),
        label: `Phone: ${phoneFilter.trim()}`
      });
    }

    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    setSelectedLeadStatuses([]);
    setSelectedCreatedBy([]);
    setSelectedCreatedVia([]);
    setSelectedTags([]);
    setSelectedLeadManager([]);
    setCreatedDateFrom(undefined);
    setCreatedDateTo(undefined);
    setEmailFilter('');
    setPhoneFilter('');
    onFiltersChange([]);
  };

  const handleSaveCurrentFilters = () => {
    if (!saveFilterName.trim()) {
      toast.error('Please enter a name for the filter');
      return;
    }

    if (filters.length === 0) {
      toast.error('No filters to save');
      return;
    }

    // Check for duplicate names
    const existingFilter = savedFilters.find(f => f.name.toLowerCase() === saveFilterName.trim().toLowerCase());
    if (existingFilter) {
      toast.error('A filter with this name already exists');
      return;
    }

    try {
      saveFilter(saveFilterName.trim(), filters);
      setSaveFilterName('');
      setShowSaveDialog(false);
      toast.success(`Filter "${saveFilterName}" saved successfully`);
    } catch (error) {
      toast.error('Failed to save filter');
    }
  };

  const handleLoadSavedFilter = (savedFilter: any) => {
    onFiltersChange(savedFilter.filters);
    toast.success(`Filter "${savedFilter.name}" applied`);
  };

  const handleDeleteSavedFilter = (filterId: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the filter "${name}"?`)) {
      if (deleteFilter(filterId)) {
        toast.success(`Filter "${name}" deleted`);
      } else {
        toast.error('Failed to delete filter');
      }
    }
  };

  const MultiSelectSection = ({ 
    title, 
    options, 
    selected, 
    onSelectionChange, 
    icon: Icon 
  }: {
    title: string;
    options: string[] | { value: string; label: string }[];
    selected: string[];
    onSelectionChange: (selected: string[]) => void;
    icon: React.ComponentType<{ className?: string }>;
  }) => (
    <Card className="border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Icon className="w-4 h-4" />
          {title}
          {selected.length > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {selected.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-48 overflow-y-auto">
        {options.map((option) => {
          const value = typeof option === 'string' ? option : option.value;
          const label = typeof option === 'string' ? option : option.label;
          const isSelected = selected.includes(value);
          
          return (
            <div key={value} className="flex items-center space-x-2">
              <Checkbox
                id={`${title}-${value}`}
                checked={isSelected}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onSelectionChange([...selected, value]);
                  } else {
                    onSelectionChange(selected.filter(s => s !== value));
                  }
                }}
              />
              <Label
                htmlFor={`${title}-${value}`}
                className="text-sm cursor-pointer flex-1"
              >
                {label}
              </Label>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-80 bg-white border-l border-gray-200 shadow-xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900">Filters & Views</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('filters')}
          className={`flex-1 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'filters'
              ? 'border-blue-500 text-blue-600 bg-blue-50'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Filter className="w-4 h-4 inline mr-2" />
          Filters
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex-1 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'saved'
              ? 'border-blue-500 text-blue-600 bg-blue-50'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Star className="w-4 h-4 inline mr-2" />
          Saved ({savedFilters.length})
        </button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        {activeTab === 'filters' ? (
          <div className="p-4 space-y-4">
            {/* Active Filters */}
            {filters.length > 0 && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-blue-800">Active Filters ({filters.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {filters.map((filter) => (
                    <div key={filter.id} className="flex items-center justify-between p-2 bg-white rounded border">
                      <span className="text-sm text-blue-800">{filter.label}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const updatedFilters = filters.filter(f => f.id !== filter.id);
                          onFiltersChange(updatedFilters);
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Filter Controls */}
            <MultiSelectSection
              title="Lead Status"
              options={leadStatusOptions}
              selected={selectedLeadStatuses}
              onSelectionChange={setSelectedLeadStatuses}
              icon={Filter}
            />

            <MultiSelectSection
              title="Created By"
              options={createdByOptions}
              selected={selectedCreatedBy}
              onSelectionChange={setSelectedCreatedBy}
              icon={User}
            />

            <MultiSelectSection
              title="Created Via"
              options={createdViaOptions}
              selected={selectedCreatedVia}
              onSelectionChange={setSelectedCreatedVia}
              icon={Tag}
            />

            <MultiSelectSection
              title="Tags"
              options={tagOptions}
              selected={selectedTags}
              onSelectionChange={setSelectedTags}
              icon={Tag}
            />

            <MultiSelectSection
              title="Lead Manager"
              options={leadManagerOptions}
              selected={selectedLeadManager}
              onSelectionChange={setSelectedLeadManager}
              icon={User}
            />

            {/* Date Range */}
            <Card className="border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Created On
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal text-xs",
                          !createdDateFrom && "text-muted-foreground"
                        )}
                        size="sm"
                      >
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {createdDateFrom ? format(createdDateFrom, "MMM d") : "From"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={createdDateFrom}
                        onSelect={setCreatedDateFrom}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal text-xs",
                          !createdDateTo && "text-muted-foreground"
                        )}
                        size="sm"
                      >
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {createdDateTo ? format(createdDateTo, "MMM d") : "To"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={createdDateTo}
                        onSelect={setCreatedDateTo}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
            </Card>

            {/* Seller Contact */}
            <Card className="border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Seller Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="email-filter" className="text-xs">Email</Label>
                  <Input
                    id="email-filter"
                    placeholder="Enter email..."
                    value={emailFilter}
                    onChange={(e) => setEmailFilter(e.target.value)}
                    size="sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone-filter" className="text-xs">Phone</Label>
                  <Input
                    id="phone-filter"
                    placeholder="Enter phone..."
                    value={phoneFilter}
                    onChange={(e) => setPhoneFilter(e.target.value)}
                    size="sm"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Save Current Filters */}
            {(selectedLeadStatuses.length > 0 || selectedCreatedBy.length > 0 || selectedCreatedVia.length > 0 || 
              selectedTags.length > 0 || selectedLeadManager.length > 0 || createdDateFrom || createdDateTo || 
              emailFilter.trim() || phoneFilter.trim()) && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-green-800">Save Current View</CardTitle>
                </CardHeader>
                <CardContent>
                  {showSaveDialog ? (
                    <div className="space-y-3">
                      <Input
                        placeholder="Enter filter name..."
                        value={saveFilterName}
                        onChange={(e) => setSaveFilterName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveCurrentFilters()}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveCurrentFilters}>
                          <Save className="w-3 h-3 mr-1" />
                          Save
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setShowSaveDialog(false);
                            setSaveFilterName('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setShowSaveDialog(true)}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Current View
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {/* Saved Filters */}
            {savedFilters.length === 0 ? (
              <div className="text-center py-8">
                <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No saved filters yet</p>
                <p className="text-gray-400 text-xs mt-1">
                  Create and save filters to quickly access them later
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedFilters.map((savedFilter) => (
                  <Card key={savedFilter.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{savedFilter.name}</h4>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLoadSavedFilter(savedFilter)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            Apply
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSavedFilter(savedFilter.id, savedFilter.name)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {savedFilter.filters.map((filter, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {filter.label}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">
                        Created: {savedFilter.createdAt.toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      <div className="border-t bg-gray-50 p-4">
        <div className="text-sm text-gray-600 mb-3">
          Showing {filteredResults} of {totalResults} leads
          {filters.length > 0 && (
            <span className="text-blue-600 ml-1">
              ({filters.length} filter{filters.length !== 1 ? 's' : ''} active)
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              clearAllFilters();
              toast.success('All filters cleared');
            }}
            className="flex-1"
          >
            Clear All
          </Button>
          <Button
            size="sm"
            onClick={() => {
              applyFilters();
              onClose();
              toast.success('Filters applied');
            }}
            className="flex-1"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { X, Filter, ChevronDown, Check, Save, Trash2, Edit, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
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
  
  const {
    savedFilters,
    saveFilter,
    updateFilter,
    deleteFilter
  } = useSavedFilters();

  const handleSaveCurrentFilters = () => {
    if (!saveFilterName.trim()) {
      toast.error('Please enter a name for the filter');
      return;
    }

    if (filters.length === 0) {
      toast.error('No filters to save');
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

  const handleDeleteSavedFilter = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the filter "${name}"?`)) {
      if (deleteFilter(id)) {
        toast.success(`Filter "${name}" deleted`);
      } else {
        toast.error('Failed to delete filter');
      }
    }
  };

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
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'filters' ? (
          <div className="p-4 space-y-6">
            {/* Active Filters */}
            {filters.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Active Filters ({filters.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {filters.map((filter) => (
                    <div key={filter.id} className="flex items-center justify-between p-2 bg-blue-50 rounded">
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

            {/* Save Current Filters */}
            {filters.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Save Current View</CardTitle>
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

            {/* Filter Controls - Add your existing filter controls here */}
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
      </div>

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
              onFiltersChange([]);
              toast.success('All filters cleared');
            }}
            disabled={filters.length === 0}
            className="flex-1"
          >
            Clear All
          </Button>
          <Button
            size="sm"
            onClick={onClose}
            className="flex-1"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

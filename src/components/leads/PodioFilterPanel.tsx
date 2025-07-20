
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X, Save, Filter } from 'lucide-react';
import { TaxLead } from '@/types/taxLead';
import { FilterState, createEmptyFilterState } from './filters/FilterState';

interface SavedView {
  id: string;
  name: string;
  filters: FilterState;
}

interface PodioFilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  totalResults: number;
  filteredResults: number;
  onSaveView?: (name: string, filters: FilterState) => void;
  savedViews?: SavedView[];
  onLoadView?: (view: SavedView) => void;
  onDeleteView?: (viewId: string) => void;
  leads?: TaxLead[];
}

export function PodioFilterPanel({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  totalResults,
  filteredResults,
  onSaveView,
  savedViews = [],
  onLoadView,
  onDeleteView,
  leads = []
}: PodioFilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const [activeTab, setActiveTab] = useState<'filters' | 'saved'>('filters');
  const [saveViewName, setSaveViewName] = useState('');
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(filters);

  useEffect(() => {
    setLocalFilters(filters);
    setAppliedFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearAll = () => {
    const clearedFilters = createEmptyFilterState();
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    setAppliedFilters(clearedFilters);
  };

  const handleDone = () => {
    setAppliedFilters(localFilters);
    onClose();
  };

  const handleSaveView = () => {
    if (saveViewName.trim() && onSaveView) {
      onSaveView(saveViewName.trim(), localFilters);
      setSaveViewName('');
      setShowSaveInput(false);
    }
  };

  const getAppliedFiltersCount = () => {
    return Object.entries(appliedFilters).filter(([key, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      return value && value !== '';
    }).length;
  };

  const getAppliedFiltersDisplay = () => {
    const applied = [];
    if (appliedFilters.createdBy) applied.push(`Created By: ${appliedFilters.createdBy}`);
    if (appliedFilters.createdOnStart) applied.push(`From: ${appliedFilters.createdOnStart}`);
    if (appliedFilters.createdOnEnd) applied.push(`To: ${appliedFilters.createdOnEnd}`);
    if (appliedFilters.createdVia) applied.push(`Via: ${appliedFilters.createdVia}`);
    if (appliedFilters.leadStatus) applied.push(`Status: ${appliedFilters.leadStatus}`);
    if (appliedFilters.tags && appliedFilters.tags.length > 0) {
      applied.push(`Tags: ${appliedFilters.tags.join(', ')}`);
    }
    if (appliedFilters.sellerContact) applied.push(`Contact: ${appliedFilters.sellerContact}`);
    if (appliedFilters.leadManager) applied.push(`Manager: ${appliedFilters.leadManager}`);
    if (appliedFilters.minArrears !== undefined) applied.push(`Min Arrears: $${appliedFilters.minArrears}`);
    if (appliedFilters.maxArrears !== undefined) applied.push(`Max Arrears: $${appliedFilters.maxArrears}`);
    return applied;
  };

  // Get unique values from leads for filter options
  const getUniqueStringValues = (field: keyof TaxLead) => {
    const values = leads.map(lead => lead[field]).filter(Boolean);
    return [...new Set(values)].filter(v => typeof v === 'string') as string[];
  };

  if (!isOpen) {
    const appliedCount = getAppliedFiltersCount();
    if (appliedCount === 0) return null;

    return (
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-blue-800">Applied Filters ({appliedCount})</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="text-blue-600 hover:text-blue-800"
          >
            Clear All
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {getAppliedFiltersDisplay().map((filter, index) => (
            <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
              {filter}
            </Badge>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="w-80 bg-white shadow-xl border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('filters')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'filters'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Filters
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'saved'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Saved ({savedViews.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'filters' ? (
            <div className="space-y-6">
              {/* Created By */}
              <div className="space-y-2">
                <Label htmlFor="createdBy" className="text-sm font-medium text-gray-700">
                  Created By
                </Label>
                <Select 
                  value={localFilters.createdBy} 
                  onValueChange={(value) => handleFilterChange('createdBy', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select creator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All</SelectItem>
                    {getUniqueStringValues('createdVia').map((creator) => (
                      <SelectItem key={creator} value={creator}>
                        {creator}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Created On */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Created On</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="createdOnStart" className="text-xs text-gray-500">From</Label>
                    <Input
                      id="createdOnStart"
                      type="date"
                      value={localFilters.createdOnStart}
                      onChange={(e) => handleFilterChange('createdOnStart', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="createdOnEnd" className="text-xs text-gray-500">To</Label>
                    <Input
                      id="createdOnEnd"
                      type="date"
                      value={localFilters.createdOnEnd}
                      onChange={(e) => handleFilterChange('createdOnEnd', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Created Via */}
              <div className="space-y-2">
                <Label htmlFor="createdVia" className="text-sm font-medium text-gray-700">
                  Created Via
                </Label>
                <Select 
                  value={localFilters.createdVia} 
                  onValueChange={(value) => handleFilterChange('createdVia', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All</SelectItem>
                    {getUniqueStringValues('createdVia').map((source) => (
                      <SelectItem key={source} value={source}>
                        {source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Lead Status */}
              <div className="space-y-2">
                <Label htmlFor="leadStatus" className="text-sm font-medium text-gray-700">
                  Lead Status
                </Label>
                <Select 
                  value={localFilters.leadStatus} 
                  onValueChange={(value) => handleFilterChange('leadStatus', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All</SelectItem>
                    <SelectItem value="HOT">🔥 Hot</SelectItem>
                    <SelectItem value="WARM">🌤️ Warm</SelectItem>
                    <SelectItem value="COLD">❄️ Cold</SelectItem>
                    <SelectItem value="PASS">⏭️ Pass</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Tags</Label>
                <div className="space-y-2">
                  {['High Priority', 'Hot Lead', 'Follow Up', 'Qualified', 'Inherited Property', 'Out of State', 'Divorce Sale', 'Quick Sale Needed', 'Investment Property', 'Portfolio Sale', 'Not Interested', 'Working with Attorney'].map((tag) => (
                    <div key={tag} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tag-${tag}`}
                        checked={localFilters.tags?.includes(tag) || false}
                        onCheckedChange={(checked) => {
                          const currentTags = localFilters.tags || [];
                          const newTags = checked
                            ? [...currentTags, tag]
                            : currentTags.filter(t => t !== tag);
                          handleFilterChange('tags', newTags);
                        }}
                      />
                      <Label htmlFor={`tag-${tag}`} className="text-sm text-gray-600">
                        {tag}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seller Contact */}
              <div className="space-y-2">
                <Label htmlFor="sellerContact" className="text-sm font-medium text-gray-700">
                  Seller Contact
                </Label>
                <Input
                  id="sellerContact"
                  value={localFilters.sellerContact}
                  onChange={(e) => handleFilterChange('sellerContact', e.target.value)}
                  placeholder="Search by name, email, or phone"
                  className="text-sm"
                />
              </div>

              {/* Lead Manager */}
              <div className="space-y-2">
                <Label htmlFor="leadManager" className="text-sm font-medium text-gray-700">
                  Lead Manager
                </Label>
                <Select 
                  value={localFilters.leadManager} 
                  onValueChange={(value) => handleFilterChange('leadManager', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select manager" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All</SelectItem>
                    {getUniqueStringValues('leadManager').map((manager) => (
                      <SelectItem key={manager} value={manager}>
                        {manager}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Arrears Range */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Current Arrears</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="minArrears" className="text-xs text-gray-500">Min ($)</Label>
                    <Input
                      id="minArrears"
                      type="number"
                      value={localFilters.minArrears || ''}
                      onChange={(e) => handleFilterChange('minArrears', e.target.value ? parseInt(e.target.value) : undefined)}
                      placeholder="0"
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxArrears" className="text-xs text-gray-500">Max ($)</Label>
                    <Input
                      id="maxArrears"
                      type="number"
                      value={localFilters.maxArrears || ''}
                      onChange={(e) => handleFilterChange('maxArrears', e.target.value ? parseInt(e.target.value) : undefined)}
                      placeholder="999999"
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Move To */}
              <div className="space-y-2">
                <Label htmlFor="moveTo" className="text-sm font-medium text-gray-700">
                  Move To
                </Label>
                <Select 
                  value={localFilters.moveTo} 
                  onValueChange={(value) => handleFilterChange('moveTo', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    <SelectItem value="qualified">Qualified Leads</SelectItem>
                    <SelectItem value="followup">Follow Up</SelectItem>
                    <SelectItem value="archive">Archive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Save View */}
              <div className="pt-4 border-t border-gray-200">
                {showSaveInput ? (
                  <div className="space-y-2">
                    <Label htmlFor="saveViewName" className="text-sm font-medium text-gray-700">
                      Save Current View
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="saveViewName"
                        value={saveViewName}
                        onChange={(e) => setSaveViewName(e.target.value)}
                        placeholder="Enter view name"
                        className="text-sm flex-1"
                      />
                      <Button size="sm" onClick={handleSaveView} disabled={!saveViewName.trim()}>
                        <Save className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setShowSaveInput(false)}>
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSaveInput(true)}
                    className="w-full"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Current View
                  </Button>
                )}
              </div>
            </div>
          ) : (
            // Saved Views Tab
            <div className="space-y-3">
              {savedViews.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">No saved filters yet</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Apply filters and save them to create quick views
                  </p>
                </div>
              ) : (
                savedViews.map((view) => (
                  <div
                    key={view.id}
                    className="p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors cursor-pointer group"
                    onClick={() => onLoadView?.(view)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{view.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {Object.entries(view.filters).filter(([, value]) => {
                            if (Array.isArray(value)) return value.length > 0;
                            return value && value !== '';
                          }).length} filters applied
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteView?.(view.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-800"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClearAll} className="flex-1">
              Clear All
            </Button>
            <Button onClick={handleDone} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              Done
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div className="flex-1 bg-black bg-opacity-25" onClick={onClose} />
    </div>
  );
}

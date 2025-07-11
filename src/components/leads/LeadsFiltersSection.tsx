
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import { ViewSwitcherDropdown } from './ViewSwitcherDropdown';

interface LeadsFiltersSectionProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onFilterStatusChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  currentView: 'table' | 'card' | 'calendar' | 'timeline' | 'badge';
  onViewChange: (view: 'table' | 'card' | 'calendar' | 'timeline' | 'badge') => void;
}

export function LeadsFiltersSection({
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
  sortBy,
  onSortByChange,
  currentView,
  onViewChange
}: LeadsFiltersSectionProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
      <div className="flex-1 flex gap-4 min-w-0">
        {/* Podio-style search */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-podio-text-muted w-4 h-4" />
          <Input
            placeholder="Search seller leads..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 border-podio-border bg-podio-background focus:border-podio-primary focus:ring-podio-primary/20"
          />
        </div>
        
        {/* Podio-style filters */}
        <Select value={filterStatus} onValueChange={onFilterStatusChange}>
          <SelectTrigger className="w-[180px] flex-shrink-0 border-podio-border bg-podio-background">
            <Filter className="w-4 h-4 mr-2 text-podio-text-muted" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-podio-background border-podio-border">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="HOT">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Hot
              </div>
            </SelectItem>
            <SelectItem value="WARM">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                Warm
              </div>
            </SelectItem>
            <SelectItem value="COLD">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Cold
              </div>
            </SelectItem>
            <SelectItem value="PASS">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                Pass
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={onSortByChange}>
          <SelectTrigger className="w-[180px] flex-shrink-0 border-podio-border bg-podio-background">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-podio-background border-podio-border">
            <SelectItem value="ownerName">Owner Name</SelectItem>
            <SelectItem value="propertyAddress">Property Address</SelectItem>
            <SelectItem value="currentArrears">Current Arrears</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* View Switcher - Podio style */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <ViewSwitcherDropdown 
          currentView={currentView} 
          onViewChange={onViewChange}
        />
      </div>
    </div>
  );
}

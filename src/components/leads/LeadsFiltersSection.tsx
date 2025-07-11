
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
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
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterStatus} onValueChange={onFilterStatusChange}>
          <SelectTrigger className="w-[180px] flex-shrink-0">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="HOT">Hot</SelectItem>
            <SelectItem value="WARM">Warm</SelectItem>
            <SelectItem value="COLD">Cold</SelectItem>
            <SelectItem value="PASS">Pass</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={onSortByChange}>
          <SelectTrigger className="w-[180px] flex-shrink-0">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ownerName">Owner Name</SelectItem>
            <SelectItem value="propertyAddress">Property Address</SelectItem>
            <SelectItem value="currentArrears">Current Arrears</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* View Switcher - Positioned on the right */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <ViewSwitcherDropdown currentView={currentView} onViewChange={onViewChange} />
      </div>
    </div>
  );
}

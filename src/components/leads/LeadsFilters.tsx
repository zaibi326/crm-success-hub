
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, ChevronDown } from 'lucide-react';

interface LeadsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onFilterStatusChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
}

export function LeadsFilters({
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
  sortBy,
  onSortByChange
}: LeadsFiltersProps) {
  console.log('LeadsFilters filterStatus value:', filterStatus);
  console.log('LeadsFilters sortBy value:', sortBy);
  
  return (
    <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-200/60">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-white shadow-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>

          <Select value={filterStatus} onValueChange={onFilterStatusChange}>
            <SelectTrigger className="w-40 bg-white shadow-sm border-gray-200">
              <Filter className="w-4 h-4 mr-2 text-gray-400" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="hot">Hot</SelectItem>
              <SelectItem value="warm">Warm</SelectItem>
              <SelectItem value="cold">Cold</SelectItem>
              <SelectItem value="disqualified">Disqualified</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={onSortByChange}>
            <SelectTrigger className="w-40 bg-white shadow-sm border-gray-200">
              <ChevronDown className="w-4 h-4 mr-2 text-gray-400" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg">
              <SelectItem value="ownerName">Name</SelectItem>
              <SelectItem value="currentArrears">Score</SelectItem>
              <SelectItem value="createdAt">Date Created</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

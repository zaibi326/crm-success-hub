
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, ChevronDown } from 'lucide-react';

interface CampaignFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  filterStatus: string;
  onFilterChange: (value: string) => void;
}

export function CampaignFilters({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  filterStatus,
  onFilterChange
}: CampaignFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex flex-col sm:flex-row gap-3 flex-1">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-white/80 backdrop-blur-sm shadow-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 hover:shadow-xl transition-all duration-200"
          />
        </div>

        {/* Status Filter */}
        <Select value={filterStatus || "all"} onValueChange={onFilterChange}>
          <SelectTrigger className="w-40 bg-white/80 backdrop-blur-sm shadow-lg border-gray-200 hover:shadow-xl transition-all duration-200">
            <Filter className="w-4 h-4 mr-2 text-gray-400" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-xl backdrop-blur-sm">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={sortBy || "name"} onValueChange={onSortChange}>
          <SelectTrigger className="w-40 bg-white/80 backdrop-blur-sm shadow-lg border-gray-200 hover:shadow-xl transition-all duration-200">
            <ChevronDown className="w-4 h-4 mr-2 text-gray-400" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-xl backdrop-blur-sm">
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="progress">Progress</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

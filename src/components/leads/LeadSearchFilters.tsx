
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

interface LeadSearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

export function LeadSearchFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange
}: LeadSearchFiltersProps) {
  console.log('LeadSearchFilters statusFilter value:', statusFilter);
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search leads..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex gap-2 items-center">
        <Filter className="w-4 h-4 text-gray-500" />
        <Select value={statusFilter || "all"} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="hot">🔥 Hot</SelectItem>
            <SelectItem value="warm">🌤️ Warm</SelectItem>
            <SelectItem value="cold">❄️ Cold</SelectItem>
            <SelectItem value="keep">✅ Keep</SelectItem>
            <SelectItem value="pass">⏭️ Pass</SelectItem>
            <SelectItem value="disqualified">Disqualified</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

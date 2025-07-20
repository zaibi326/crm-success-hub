
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface LeadSearchControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

export function LeadSearchControls({ searchTerm, setSearchTerm, sortBy, setSortBy }: LeadSearchControlsProps) {
  console.log('LeadSearchControls sortBy value:', sortBy);
  
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search leads by name, address, tax ID, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ownerName">Seller Name</SelectItem>
          <SelectItem value="propertyAddress">Property Address</SelectItem>
          <SelectItem value="createdAt">Date Created</SelectItem>
          <SelectItem value="currentArrears">Arrears Amount</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

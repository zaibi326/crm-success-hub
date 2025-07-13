
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Grid, List, Calendar, Activity, Badge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LeadsFiltersSectionProps {
  filterStatus: string;
  onFilterStatusChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  currentView: 'table' | 'card' | 'calendar' | 'timeline' | 'badge';
  onViewChange: (view: 'table' | 'card' | 'calendar' | 'timeline' | 'badge') => void;
}

export function LeadsFiltersSection({
  filterStatus,
  onFilterStatusChange,
  sortBy,
  onSortByChange,
  currentView,
  onViewChange
}: LeadsFiltersSectionProps) {
  const getViewIcon = (view: string) => {
    switch (view) {
      case 'table': return Grid;
      case 'card': return List;
      case 'calendar': return Calendar;
      case 'timeline': return Activity;
      case 'badge': return Badge;
      default: return Grid;
    }
  };

  const CurrentViewIcon = getViewIcon(currentView);

  return (
    <div className="flex items-center gap-3">
      {/* View Switcher Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 px-2 border-podio-border bg-podio-background hover:bg-podio-hover"
          >
            <CurrentViewIcon className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="start" 
          className="w-48 bg-podio-background border-podio-border"
        >
          {['table', 'card', 'calendar', 'timeline', 'badge'].map((view) => {
            const ViewIcon = getViewIcon(view);
            return (
              <DropdownMenuItem
                key={view}
                onClick={() => onViewChange(view as any)}
                className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-podio-hover cursor-pointer"
              >
                <ViewIcon className="w-4 h-4" />
                <span className="capitalize">{view}</span>
                {currentView === view && (
                  <div className="w-2 h-2 bg-podio-primary rounded-full ml-auto" />
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Filter Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 px-2 border-podio-border bg-podio-background hover:bg-podio-hover"
          >
            <Filter className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="start" 
          className="w-48 bg-podio-background border-podio-border"
        >
          <DropdownMenuItem 
            onClick={() => onFilterStatusChange('all')}
            className="hover:bg-podio-hover cursor-pointer"
          >
            All Status
            {filterStatus === 'all' && (
              <div className="w-2 h-2 bg-podio-primary rounded-full ml-auto" />
            )}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onFilterStatusChange('HOT')}
            className="hover:bg-podio-hover cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Hot
            </div>
            {filterStatus === 'HOT' && (
              <div className="w-2 h-2 bg-podio-primary rounded-full ml-auto" />
            )}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onFilterStatusChange('WARM')}
            className="hover:bg-podio-hover cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              Warm
            </div>
            {filterStatus === 'WARM' && (
              <div className="w-2 h-2 bg-podio-primary rounded-full ml-auto" />
            )}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onFilterStatusChange('COLD')}
            className="hover:bg-podio-hover cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Cold
            </div>
            {filterStatus === 'COLD' && (
              <div className="w-2 h-2 bg-podio-primary rounded-full ml-auto" />
            )}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onFilterStatusChange('PASS')}
            className="hover:bg-podio-hover cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              Pass
            </div>
            {filterStatus === 'PASS' && (
              <div className="w-2 h-2 bg-podio-primary rounded-full ml-auto" />
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Sort by Owner Name */}
      <Select value={sortBy} onValueChange={onSortByChange}>
        <SelectTrigger className="w-[140px] h-8 border-podio-border bg-podio-background text-sm">
          <SelectValue placeholder="Owner Name" />
        </SelectTrigger>
        <SelectContent className="bg-podio-background border-podio-border">
          <SelectItem value="ownerName">Owner Name</SelectItem>
          <SelectItem value="propertyAddress">Property Address</SelectItem>
          <SelectItem value="currentArrears">Current Arrears</SelectItem>
          <SelectItem value="status">Status</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

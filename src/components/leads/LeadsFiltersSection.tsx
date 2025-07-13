
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Grid, List, Calendar, Timeline, Badge } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      case 'table': return <Grid className="w-4 h-4" />;
      case 'card': return <List className="w-4 h-4" />;
      case 'calendar': return <Calendar className="w-4 h-4" />;
      case 'timeline': return <Timeline className="w-4 h-4" />;
      case 'badge': return <Badge className="w-4 h-4" />;
      default: return <Grid className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex items-center gap-4 justify-between">
      <div className="flex items-center gap-4">
        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-podio-surface border border-podio-border rounded-md p-1">
          {['table', 'card', 'calendar', 'timeline', 'badge'].map((view) => (
            <Button
              key={view}
              size="sm"
              variant={currentView === view ? "default" : "ghost"}
              onClick={() => onViewChange(view as any)}
              className={`h-8 px-2 ${
                currentView === view 
                  ? 'bg-podio-primary text-white' 
                  : 'text-podio-text-muted hover:text-podio-text hover:bg-podio-hover'
              }`}
            >
              {getViewIcon(view)}
            </Button>
          ))}
        </div>

        {/* Filter Status */}
        <Select value={filterStatus} onValueChange={onFilterStatusChange}>
          <SelectTrigger className="w-[180px] border-podio-border bg-podio-background">
            <Filter className="w-4 h-4 mr-2 text-podio-text-muted" />
            <SelectValue placeholder="All Status" />
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

        {/* Sort by Owner Name */}
        <Select value={sortBy} onValueChange={onSortByChange}>
          <SelectTrigger className="w-[180px] border-podio-border bg-podio-background">
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
    </div>
  );
}

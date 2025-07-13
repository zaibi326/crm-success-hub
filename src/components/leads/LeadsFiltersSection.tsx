
import React from 'react';
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

      {/* Advanced Filter Button */}
      <Button 
        variant="outline" 
        size="sm" 
        className="h-8 px-3 border-podio-border bg-podio-background hover:bg-podio-hover text-sm"
      >
        <Filter className="w-4 h-4 mr-2" />
        Advanced Filter
      </Button>
    </div>
  );
}

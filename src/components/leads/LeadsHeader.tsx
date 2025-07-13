
import React, { useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Plus, Grid, List, Calendar, Activity, Badge, ChevronDown, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ComprehensiveAddSellerDialog } from './ComprehensiveAddSellerDialog';
import { AdvancedFilters } from './AdvancedFilters';
import { TaxLead } from '@/types/taxLead';

interface FilterCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface LeadsHeaderProps {
  onAddLead: (lead: TaxLead) => void;
  onSellerAdded?: (seller: TaxLead) => void;
  currentView?: 'table' | 'card' | 'calendar' | 'timeline' | 'badge';
  onViewChange?: (view: 'table' | 'card' | 'calendar' | 'timeline' | 'badge') => void;
  filters?: FilterCondition[];
  onFiltersChange?: (filters: FilterCondition[]) => void;
  availableFields?: Array<{ key: string; label: string; type: string }>;
}

export function LeadsHeader({ 
  onAddLead, 
  onSellerAdded, 
  currentView = 'table', 
  onViewChange,
  filters = [],
  onFiltersChange,
  availableFields = []
}: LeadsHeaderProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
    <header className="sticky top-0 z-10 bg-podio-background border-b border-podio-border px-6 py-4">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-podio-text-muted hover:text-podio-text hover:bg-podio-hover p-2 rounded-md transition-colors duration-200" />
        
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-podio-text">Seller Leads</h1>
          <p className="text-sm text-podio-text-muted mt-1">
            Manage and track your seller leads with advanced filtering and multiple view options
          </p>
        </div>

        {/* Top Bar Controls */}
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
              className="w-48 bg-podio-background border-podio-border z-50"
            >
              {['table', 'card', 'calendar', 'timeline', 'badge'].map((view) => {
                const ViewIcon = getViewIcon(view);
                return (
                  <DropdownMenuItem
                    key={view}
                    onClick={() => onViewChange?.(view as any)}
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

          {/* Filter Sheet */}
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 px-3 border-podio-border bg-podio-background hover:bg-podio-hover text-sm flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
                {filters.length > 0 && (
                  <span className="bg-podio-primary text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                    {filters.length}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[400px] sm:w-[540px] bg-podio-background">
              <SheetHeader>
                <SheetTitle className="text-podio-text">Advanced Filters</SheetTitle>
                <SheetDescription className="text-podio-text-muted">
                  Apply multiple filters to narrow down your seller leads.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <AdvancedFilters
                  filters={filters}
                  onFiltersChange={onFiltersChange || (() => {})}
                  availableFields={availableFields}
                />
              </div>
            </SheetContent>
          </Sheet>

          {/* Add Seller Button */}
          <ComprehensiveAddSellerDialog 
            onAddSeller={onAddLead}
            onSellerAdded={onSellerAdded}
            trigger={
              <Button className="podio-button-primary flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Seller
              </Button>
            }
          />
        </div>
      </div>
    </header>
  );
}

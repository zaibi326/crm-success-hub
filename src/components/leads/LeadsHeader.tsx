
import React, { useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Plus, Grid, List, Calendar, Activity, Badge, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ComprehensiveAddSellerDialog } from './ComprehensiveAddSellerDialog';
import { FilterDropdown } from './FilterDropdown';
import { TaxLead } from '@/types/taxLead';

interface FilterCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
  label?: string;
}

interface LeadsHeaderProps {
  onAddLead: (lead: TaxLead) => void;
  onSellerAdded?: (seller: TaxLead) => void;
  currentView?: 'table' | 'card' | 'calendar' | 'timeline' | 'badge';
  onViewChange?: (view: 'table' | 'card' | 'calendar' | 'timeline' | 'badge') => void;
  filters?: FilterCondition[];
  onFiltersChange?: (filters: FilterCondition[]) => void;
  availableFields?: Array<{ key: string; label: string; type: string }>;
  onAllSellerLeadsClick?: () => void;
  onFilterToggle?: () => void;
  showFilterSidebar?: boolean;
  sidebarCollapsed?: boolean;
}

export function LeadsHeader({ 
  onAddLead, 
  onSellerAdded, 
  currentView = 'table', 
  onViewChange,
  filters = [],
  onFiltersChange,
  availableFields = [],
  onAllSellerLeadsClick,
  onFilterToggle,
  showFilterSidebar = false,
  sidebarCollapsed = false
}: LeadsHeaderProps) {
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

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

  const handleApplyFilters = () => {
    onFilterToggle?.();
  };

  const handleSaveView = () => {
    // TODO: Implement save view functionality
    console.log('Save view functionality to be implemented');
  };

  const handleClearAllFilters = () => {
    onFiltersChange?.([]);
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-agile-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Show sidebar trigger only when sidebar is not collapsed */}
        {!sidebarCollapsed && (
          <SidebarTrigger className="text-agile-gray-600 hover:text-agile-gray-900 hover:bg-agile-gray-100 p-2 rounded-md transition-colors duration-200" />
        )}
        
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold text-agile-gray-900">Seller Leads</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={onAllSellerLeadsClick}
              className={`text-agile-blue-600 hover:text-agile-blue-700 hover:bg-agile-blue-50 border border-agile-blue-200 transition-all duration-200 ${
                sidebarCollapsed ? 'bg-agile-blue-50 border-agile-blue-300' : ''
              }`}
            >
              All Seller Leads
            </Button>
          </div>
          <p className="text-sm text-agile-gray-600 mt-1">
            Manage and track your seller leads with advanced filtering and multiple view options
          </p>
        </div>

        {/* Top Bar Controls */}
        <div className="flex items-center gap-3 relative">
          {/* View Switcher Dropdown - Only show when sidebar is not collapsed */}
          {!sidebarCollapsed && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 px-2 border-agile-gray-300 bg-white hover:bg-agile-gray-50"
                >
                  <CurrentViewIcon className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start" 
                className="w-48 bg-white border-agile-gray-200 z-50"
              >
                {['table', 'card', 'calendar', 'timeline', 'badge'].map((view) => {
                  const ViewIcon = getViewIcon(view);
                  return (
                    <DropdownMenuItem
                      key={view}
                      onClick={() => onViewChange?.(view as any)}
                      className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-agile-gray-50 cursor-pointer"
                    >
                      <ViewIcon className="w-4 h-4" />
                      <span className="capitalize">{view}</span>
                      {currentView === view && (
                        <div className="w-2 h-2 bg-agile-blue-600 rounded-full ml-auto" />
                      )}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Filter Button with Dropdown */}
          <div className="relative">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className={`h-8 px-3 border-agile-gray-300 text-sm flex items-center gap-2 transition-all duration-200 ${
                isFilterDropdownOpen || showFilterSidebar
                  ? 'bg-agile-blue-50 border-agile-blue-300 text-agile-blue-700' 
                  : 'bg-white hover:bg-agile-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
              {filters.length > 0 && (
                <span className="bg-agile-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                  {filters.length}
                </span>
              )}
            </Button>

            {/* Filter Dropdown */}
            <FilterDropdown
              isOpen={isFilterDropdownOpen}
              onClose={() => setIsFilterDropdownOpen(false)}
              filters={filters}
              onFiltersChange={onFiltersChange || (() => {})}
              onApplyFilters={handleApplyFilters}
              onSaveView={handleSaveView}
              onClearAll={handleClearAllFilters}
            />
          </div>

          {/* Add Seller Button */}
          <ComprehensiveAddSellerDialog 
            onAddSeller={onAddLead}
            onSellerAdded={onSellerAdded}
            trigger={
              <Button className="bg-agile-blue-600 hover:bg-agile-blue-700 text-white flex items-center gap-2 shadow-sm transition-all duration-200">
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

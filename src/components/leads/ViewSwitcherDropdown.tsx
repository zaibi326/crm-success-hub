
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Badge, 
  Table as TableIcon, 
  LayoutGrid, 
  Activity, 
  Calendar,
  Sparkles
} from 'lucide-react';

interface ViewSwitcherDropdownProps {
  currentView: 'table' | 'card' | 'calendar' | 'timeline' | 'badge';
  onViewChange: (view: 'table' | 'card' | 'calendar' | 'timeline' | 'badge') => void;
}

export function ViewSwitcherDropdown({ currentView, onViewChange }: ViewSwitcherDropdownProps) {
  const viewOptions = [
    { id: 'badge', label: 'Badge', icon: Badge },
    { id: 'table', label: 'Table', icon: TableIcon },
    { id: 'table-enhanced', label: 'Table (New Features)', icon: Sparkles },
    { id: 'card', label: 'Card', icon: LayoutGrid },
    { id: 'timeline', label: 'Activity', icon: Activity },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
  ] as const;

  const handleViewSelect = (viewId: string) => {
    const actualView = viewId === 'table-enhanced' ? 'table' : viewId;
    onViewChange(actualView as 'table' | 'card' | 'calendar' | 'timeline' | 'badge');
  };

  const getCurrentViewIcon = () => {
    const view = viewOptions.find(v => v.id === currentView || (v.id === 'table-enhanced' && currentView === 'table'));
    return view ? view.icon : TableIcon;
  };

  const CurrentIcon = getCurrentViewIcon();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-9 h-9 p-0 bg-white border-gray-200 hover:bg-gray-50"
        >
          <CurrentIcon className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start" 
        className="w-56 bg-white border border-gray-200 shadow-lg rounded-md"
      >
        {viewOptions.map(({ id, label, icon: Icon }) => (
          <DropdownMenuItem
            key={id}
            onClick={() => handleViewSelect(id)}
            className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer"
          >
            <Icon className="w-4 h-4 text-gray-500" />
            <span>{label}</span>
            {(id === currentView || (id === 'table-enhanced' && currentView === 'table')) && (
              <div className="w-2 h-2 bg-blue-500 rounded-full ml-auto" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

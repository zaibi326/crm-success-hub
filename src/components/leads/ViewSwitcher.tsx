
import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List, Calendar, Activity, Badge } from 'lucide-react';

interface ViewSwitcherProps {
  currentView: 'table' | 'card' | 'calendar' | 'timeline' | 'badge';
  onViewChange: (view: 'table' | 'card' | 'calendar' | 'timeline' | 'badge') => void;
}

export function ViewSwitcher({ currentView, onViewChange }: ViewSwitcherProps) {
  const views = [
    { id: 'table', label: 'Table', icon: List },
    { id: 'card', label: 'Card', icon: LayoutGrid },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'timeline', label: 'Timeline', icon: Activity },
    { id: 'badge', label: 'Badge', icon: Badge },
  ] as const;

  return (
    <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
      {views.map(({ id, label, icon: Icon }) => (
        <Button
          key={id}
          variant={currentView === id ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewChange(id)}
          className="flex items-center gap-2"
        >
          <Icon className="w-4 h-4" />
          <span className="hidden sm:inline">{label}</span>
        </Button>
      ))}
    </div>
  );
}

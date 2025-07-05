
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface LeadsHeaderProps {
  onAddLead?: () => void;
}

export function LeadsHeader({ onAddLead }: LeadsHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-200/60 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Current Deals</h1>
            <p className="text-sm text-gray-600 mt-0.5">
              Manage and view your current leads and opportunities
            </p>
          </div>
        </div>
        <Button 
          onClick={onAddLead}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Lead
        </Button>
      </div>
    </header>
  );
}

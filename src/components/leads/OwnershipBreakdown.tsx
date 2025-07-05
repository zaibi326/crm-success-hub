
import React from 'react';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { OwnershipBreakdownChart } from './OwnershipBreakdownChart';

export function OwnershipBreakdown() {
  const handleSave = (heirs: any[]) => {
    console.log('Saved heirs:', heirs);
    // Here you would typically save to your backend
  };

  return (
    <SidebarInset className="flex-1 overflow-auto bg-gradient-to-br from-crm-gradient-start via-white to-crm-gradient-end">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg transition-all duration-200" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ownership Breakdown</h1>
            <p className="text-sm text-gray-600 mt-0.5">
              Manage heir ownership percentages and view distribution
            </p>
          </div>
        </div>
      </header>
      
      <main className="p-6">
        <OwnershipBreakdownChart onSave={handleSave} />
      </main>
    </SidebarInset>
  );
}

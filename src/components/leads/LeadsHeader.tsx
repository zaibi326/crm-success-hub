
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Download, Settings } from 'lucide-react';
import { ComprehensiveAddSellerDialog } from './ComprehensiveAddSellerDialog';
import { TaxLead } from '@/types/taxLead';

interface LeadsHeaderProps {
  onExport: () => void;
  onTemplateClick: () => void;
  onAddLead: (lead: TaxLead) => void;
  onSellerAdded?: (seller: TaxLead) => void;
}

export function LeadsHeader({ onExport, onTemplateClick, onAddLead, onSellerAdded }: LeadsHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-200/60 px-6 py-4 shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <SidebarTrigger className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg transition-all duration-200" />
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Seller Leads</h1>
          <p className="text-sm text-gray-600 mt-0.5">
            Manage and track your seller leads with advanced filtering and multiple view options
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={onTemplateClick} variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Templates
          </Button>
          <ComprehensiveAddSellerDialog 
            onAddSeller={onAddLead}
            onSellerAdded={onSellerAdded}
          />
        </div>
      </div>
    </header>
  );
}

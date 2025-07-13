
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ComprehensiveAddSellerDialog } from './ComprehensiveAddSellerDialog';
import { TaxLead } from '@/types/taxLead';

interface LeadsHeaderProps {
  onAddLead: (lead: TaxLead) => void;
  onSellerAdded?: (seller: TaxLead) => void;
}

export function LeadsHeader({ onAddLead, onSellerAdded }: LeadsHeaderProps) {
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

        <div className="flex items-center gap-3">
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

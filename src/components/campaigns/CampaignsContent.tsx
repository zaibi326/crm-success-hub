
import React from 'react';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CampaignGrid } from './CampaignGrid';

export function CampaignsContent() {
  return (
    <SidebarInset className="flex-1 overflow-auto">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-gray-600 hover:text-gray-900" />
            <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
          </div>
          <Button className="bg-crm-primary hover:bg-crm-primary/90 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </header>
      
      <main className="p-6">
        <CampaignGrid />
      </main>
    </SidebarInset>
  );
}

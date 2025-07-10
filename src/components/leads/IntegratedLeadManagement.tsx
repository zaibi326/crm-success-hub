
import React, { useState } from 'react';
import { SidebarInset } from '@/components/ui/sidebar';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { TaxLeadOverview } from './TaxLeadOverview';
import { TaxLead } from '@/types/taxLead';
import { mockTaxLeads } from '@/data/mockTaxLeads';
import { LeadManagementHeader } from './LeadManagementHeader';
import { LeadManagementTabs } from './LeadManagementTabs';
import { UploadTabContent } from './UploadTabContent';
import { ProcessingTabContent } from './ProcessingTabContent';

export function IntegratedLeadManagement() {
  const [activeTab, setActiveTab] = useState('overview');
  const [leads, setLeads] = useState<TaxLead[]>(mockTaxLeads);
  const [processingQueue, setProcessingQueue] = useState<TaxLead[]>([]);

  const handleLeadUpdate = (updatedLead: TaxLead) => {
    setLeads(prev => prev.map(lead => 
      lead.id === updatedLead.id ? updatedLead : lead
    ));
    
    // Also update processing queue if the lead is there
    setProcessingQueue(prev => prev.map(lead => 
      lead.id === updatedLead.id ? updatedLead : lead
    ));
  };

  const handleCsvUpload = (uploadedLeads: TaxLead[]) => {
    const newLeads = uploadedLeads.map((lead, index) => ({
      ...lead,
      id: Math.max(...leads.map(l => l.id)) + index + 1,
      status: 'WARM' as const
    }));
    
    setLeads(prev => [...prev, ...newLeads]);
    setProcessingQueue(newLeads);
    setActiveTab('processing');
  };

  const handleStartProcessing = (selectedLeads: TaxLead[]) => {
    setProcessingQueue(selectedLeads);
    setActiveTab('processing');
  };

  const stats = {
    totalLeads: leads.length,
    hotLeads: leads.filter(l => l.status === 'HOT').length,
    processedLeads: leads.filter(l => l.status === 'PASS').length,
    inQueue: processingQueue.length
  };

  return (
    <SidebarInset className="flex-1 overflow-auto">
      <LeadManagementHeader 
        totalLeads={stats.totalLeads}
        hotLeads={stats.hotLeads}
        processedLeads={stats.processedLeads}
      />

      <main className="p-6 bg-gradient-to-br from-gray-50/30 to-white">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <LeadManagementTabs 
            activeTab={activeTab}
            onActiveTabChange={setActiveTab}
            processingQueueLength={processingQueue.length}
          />

          <TabsContent value="overview" className="space-y-6">
            <TaxLeadOverview 
              leads={leads} 
              onStartProcessing={handleStartProcessing}
              onLeadUpdate={handleLeadUpdate}
            />
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <UploadTabContent onCsvUpload={handleCsvUpload} />
          </TabsContent>

          <TabsContent value="processing" className="space-y-6">
            <ProcessingTabContent
              processingQueue={processingQueue}
              onLeadUpdate={handleLeadUpdate}
              onComplete={() => {
                setProcessingQueue([]);
                setActiveTab('overview');
              }}
              onSetActiveTab={setActiveTab}
            />
          </TabsContent>

          <TabsContent value="review" className="space-y-6">
            <TaxLeadOverview 
              leads={leads} 
              onStartProcessing={handleStartProcessing}
              onLeadUpdate={handleLeadUpdate}
              showAllLeads={true}
            />
          </TabsContent>
        </Tabs>
      </main>
    </SidebarInset>
  );
}


import React, { useState } from 'react';
import { SidebarInset } from '@/components/ui/sidebar';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { TaxLeadOverview } from './TaxLeadOverview';
import { TaxLeadDetailsForm } from './TaxLeadDetailsForm';
import { TaxLead } from '@/types/taxLead';
import { mockTaxLeads } from '@/data/mockTaxLeads';
import { LeadManagementHeader } from './LeadManagementHeader';
import { LeadManagementTabs } from './LeadManagementTabs';
import { UploadTabContent } from './UploadTabContent';
import { ProcessingTabContent } from './ProcessingTabContent';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function IntegratedLeadManagement() {
  const [activeTab, setActiveTab] = useState('overview');
  const [leads, setLeads] = useState<TaxLead[]>(mockTaxLeads);
  const [processingQueue, setProcessingQueue] = useState<TaxLead[]>([]);
  const [selectedLead, setSelectedLead] = useState<TaxLead | null>(null);

  const handleLeadUpdate = (updatedLead: TaxLead) => {
    setLeads(prev => prev.map(lead => 
      lead.id === updatedLead.id ? updatedLead : lead
    ));
    
    // Also update processing queue if the lead is there
    setProcessingQueue(prev => prev.map(lead => 
      lead.id === updatedLead.id ? updatedLead : lead
    ));

    // Update selected lead if it's the same one
    if (selectedLead && selectedLead.id === updatedLead.id) {
      setSelectedLead(updatedLead);
    }
  };

  const handleLeadSelect = (lead: TaxLead) => {
    setSelectedLead(lead);
  };

  const handleBackToOverview = () => {
    setSelectedLead(null);
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

  // If a lead is selected, show the detailed view
  if (selectedLead) {
    return (
      <SidebarInset className="flex-1 overflow-auto">
        <div className="min-h-screen bg-gradient-to-br from-gray-50/30 to-white">
          {/* Header with back button */}
          <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-200/50 p-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={handleBackToOverview}
                className="flex items-center gap-2 text-crm-primary hover:text-crm-accent hover:bg-crm-primary/10"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Leads
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{selectedLead.ownerName}</h1>
                <p className="text-gray-600 mt-1">{selectedLead.propertyAddress}</p>
              </div>
            </div>
          </div>

          {/* Lead Details Form */}
          <div className="pb-6">
            <TaxLeadDetailsForm
              lead={selectedLead}
              onSave={handleLeadUpdate}
              userRole="editor"
            />
          </div>
        </div>
      </SidebarInset>
    );
  }

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
              onLeadSelect={handleLeadSelect}
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
              onLeadSelect={handleLeadSelect}
              showAllLeads={true}
            />
          </TabsContent>
        </Tabs>
      </main>
    </SidebarInset>
  );
}


import React, { useState } from 'react';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Eye, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  Clock,
  FileSpreadsheet,
  Search
} from 'lucide-react';
import { EnhancedCsvUploader } from './EnhancedCsvUploader';
import { LeadProcessingWorkflow } from './LeadProcessingWorkflow';
import { LeadsOverview } from './LeadsOverview';
import { TaxLead } from '@/types/taxLead';

// Mock data for demonstration
const mockLeads: TaxLead[] = [
  {
    id: 1,
    taxId: 'TX123456789',
    ownerName: 'John Smith',
    propertyAddress: '123 Main St, Dallas, TX 75201',
    taxLawsuitNumber: 'TL-2024-001',
    currentArrears: 15000,
    status: 'HOT',
    notes: 'High-value property with significant arrears',
    phone: '(555) 123-4567',
    email: 'john.smith@email.com',
    ownerOfRecord: 'John Smith'
  },
  {
    id: 2,
    taxId: 'TX987654321',
    ownerName: 'Sarah Johnson',
    propertyAddress: '456 Oak Ave, Houston, TX 77001',
    taxLawsuitNumber: 'TL-2024-002',
    currentArrears: 8500,
    status: 'WARM',
    notes: 'Property owner contacted previously',
    phone: '(555) 987-6543',
    email: 'sarah.j@email.com',
    ownerOfRecord: 'Sarah Johnson Estate'
  },
  {
    id: 3,
    taxId: 'TX456789123',
    ownerName: 'Mike Rodriguez',
    propertyAddress: '789 Pine Rd, Austin, TX 73301',
    taxLawsuitNumber: 'TL-2024-003',
    currentArrears: 3200,
    status: 'COLD',
    notes: 'Small arrears, low priority',
    phone: '(555) 456-7890',
    ownerOfRecord: 'Mike Rodriguez'
  }
];

export function IntegratedLeadManagement() {
  const [activeTab, setActiveTab] = useState('overview');
  const [leads, setLeads] = useState<TaxLead[]>(mockLeads);
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
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-200/60 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg transition-all duration-200" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Lead Management System</h1>
              <p className="text-sm text-gray-600 mt-0.5">
                Upload, process, and manage your tax lead pipeline
              </p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">{stats.totalLeads} Total</span>
            </div>
            <div className="flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg">
              <TrendingUp className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-700">{stats.hotLeads} Hot</span>
            </div>
            <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">{stats.processedLeads} Processed</span>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6 bg-gradient-to-br from-gray-50/30 to-white">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload CSV
            </TabsTrigger>
            <TabsTrigger value="processing" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Processing
              {processingQueue.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {processingQueue.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="review" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Review All
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <LeadsOverview 
              leads={leads} 
              onStartProcessing={handleStartProcessing}
              onLeadUpdate={handleLeadUpdate}
            />
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <Card className="max-w-4xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-3 text-2xl">
                  <FileSpreadsheet className="w-8 h-8 text-crm-primary" />
                  Upload Lead Data
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Upload your CSV file containing lead information. The system will automatically map fields and create lead entries.
                </p>
              </CardHeader>
              <CardContent>
                <EnhancedCsvUploader 
                  onUploadComplete={handleCsvUpload}
                  expectedColumns={[
                    'Tax ID',
                    'Owner Name', 
                    'Property Address',
                    'Tax Lawsuit Number',
                    'Current Arrears',
                    'Phone',
                    'Email'
                  ]}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="processing" className="space-y-6">
            {processingQueue.length > 0 ? (
              <LeadProcessingWorkflow
                leads={processingQueue}
                onLeadUpdate={handleLeadUpdate}
                onComplete={() => {
                  setProcessingQueue([]);
                  setActiveTab('overview');
                }}
              />
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Leads in Processing Queue</h3>
                  <p className="text-gray-600 mb-6">
                    Upload a CSV file or select leads from the overview to start processing.
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button onClick={() => setActiveTab('upload')} className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Upload CSV
                    </Button>
                    <Button variant="outline" onClick={() => setActiveTab('overview')} className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      View All Leads
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="review" className="space-y-6">
            <LeadsOverview 
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

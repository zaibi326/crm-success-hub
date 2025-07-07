
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EnhancedLeadWorkflow } from './EnhancedLeadWorkflow';
import { LeadsList } from './LeadsList';
import { 
  Users, 
  FileText, 
  BarChart3, 
  Settings,
  Plus,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TaxLead {
  id: number;
  taxId: string;
  ownerName: string;
  propertyAddress: string;
  taxLawsuitNumber?: string;
  currentArrears?: number;
  status: 'HOT' | 'WARM' | 'COLD' | 'PASS';
  notes?: string;
  phone?: string;
  email?: string;
  ownerOfRecord?: string;
  hasDeath?: boolean;
  deathNotes?: string;
  hasProbate?: boolean;
  probateNotes?: string;
  hasLawsuit?: boolean;
  lawsuitNotes?: string;
  hasAdditionalTaxingEntities?: boolean;
  additionalTaxingNotes?: string;
  vestingDeedNotes?: string;
}

const sampleLeads: TaxLead[] = [
  {
    id: 1,
    taxId: "TX-2024-001",
    ownerName: "John Smith",
    propertyAddress: "123 Main St, Austin, TX 78701",
    currentArrears: 25000,
    status: "HOT",
    phone: "(555) 123-4567",
    email: "john.smith@email.com",
    notes: "High value property with clear ownership structure. Contact made - very interested in selling. See https://example.com/property-details for more info."
  },
  {
    id: 2,
    taxId: "TX-2024-002", 
    ownerName: "Estate of Mary Johnson",
    propertyAddress: "456 Oak Ave, Houston, TX 77001",
    currentArrears: 18500,
    status: "WARM",
    hasDeath: true,
    deathNotes: "Owner deceased 2023, estate in probate",
    hasProbate: true,
    probateNotes: "Probate case #PR-2023-456, heirs identified"
  },
  {
    id: 3,
    taxId: "TX-2024-003",
    ownerName: "ABC Holdings LLC",
    propertyAddress: "789 Pine Rd, Dallas, TX 75201", 
    currentArrears: 42000,
    status: "COLD",
    hasLawsuit: true,
    lawsuitNotes: "Active lawsuit pending, awaiting court decision"
  }
];

export function IntegratedLeadManagement() {
  const [selectedLead, setSelectedLead] = useState<TaxLead | null>(null);
  const [leads, setLeads] = useState<TaxLead[]>(sampleLeads);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const handleLeadSelect = (lead: TaxLead) => {
    setSelectedLead(lead);
    setActiveTab('workflow');
  };

  const handleLeadUpdate = (updatedLead: TaxLead) => {
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === updatedLead.id ? updatedLead : lead
      )
    );
    setSelectedLead(updatedLead);
  };

  const filteredLeads = leads.filter(lead =>
    lead.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.taxId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const leadStats = {
    total: leads.length,
    hot: leads.filter(l => l.status === 'HOT').length,
    warm: leads.filter(l => l.status === 'WARM').length,
    cold: leads.filter(l => l.status === 'COLD').length,
    pass: leads.filter(l => l.status === 'PASS').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Lead Management System</h1>
                <p className="text-gray-600">Comprehensive tax lead workflow management</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search leads..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button className="bg-crm-primary hover:bg-crm-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Lead
                </Button>
              </div>
            </div>
            
            <TabsList className="grid w-full grid-cols-4 max-w-md">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="leads" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Leads
              </TabsTrigger>
              <TabsTrigger value="workflow" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Workflow
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card className="shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Leads</p>
                      <p className="text-2xl font-bold text-gray-900">{leadStats.total}</p>
                    </div>
                    <Users className="w-8 h-8 text-crm-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">HOT Leads</p>
                      <p className="text-2xl font-bold text-red-600">{leadStats.hot}</p>
                    </div>
                    <Badge className="bg-red-100 text-red-800">HOT</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">WARM Leads</p>
                      <p className="text-2xl font-bold text-yellow-600">{leadStats.warm}</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">WARM</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">COLD Leads</p>
                      <p className="text-2xl font-bold text-blue-600">{leadStats.cold}</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">COLD</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">PASS Leads</p>
                      <p className="text-2xl font-bold text-gray-600">{leadStats.pass}</p>
                    </div>
                    <Badge className="bg-gray-100 text-gray-800">PASS</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium">Lead status updated to HOT</p>
                      <p className="text-sm text-gray-600">John Smith - 2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium">Ownership breakdown completed</p>
                      <p className="text-sm text-gray-600">Estate of Mary Johnson - 15 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium">Probate documents uploaded</p>
                      <p className="text-sm text-gray-600">Estate of Mary Johnson - 1 hour ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leads" className="space-y-6">
            <LeadsList 
              leads={filteredLeads}
              onLeadSelect={handleLeadSelect}
              onLeadUpdate={handleLeadUpdate}
            />
          </TabsContent>

          <TabsContent value="workflow" className="space-y-6">
            {selectedLead ? (
              <EnhancedLeadWorkflow 
                lead={selectedLead}
                onLeadUpdate={handleLeadUpdate}
                userRole="editor"
              />
            ) : (
              <Card className="shadow-lg border-0">
                <CardContent className="p-12 text-center">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Lead Selected</h3>
                  <p className="text-gray-600 mb-4">
                    Select a lead from the leads tab to start the workflow process.
                  </p>
                  <Button 
                    onClick={() => setActiveTab('leads')}
                    className="bg-crm-primary hover:bg-crm-primary/90"
                  >
                    View Leads
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Integration Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Gmail Integration</h4>
                    <p className="text-sm text-gray-600 mb-3">Connect your Gmail account for automated email workflows.</p>
                    <Button variant="outline" size="sm">Configure Gmail</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Mailchimp Integration</h4>
                    <p className="text-sm text-gray-600 mb-3">Sync leads with your Mailchimp campaigns.</p>
                    <Button variant="outline" size="sm">Configure Mailchimp</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Stripe Integration</h4>
                    <p className="text-sm text-gray-600 mb-3">Process payments and track revenue.</p>
                    <Button variant="outline" size="sm">Configure Stripe</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Google Analytics</h4>
                    <p className="text-sm text-gray-600 mb-3">Track lead conversion and performance metrics.</p>
                    <Button variant="outline" size="sm">Configure Analytics</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

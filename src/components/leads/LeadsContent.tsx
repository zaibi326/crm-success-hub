
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EnhancedCsvUploader } from './EnhancedCsvUploader';
import { LeadDetailsForm } from './LeadDetailsForm';
import { OwnershipBreakdown } from './OwnershipBreakdown';
import { LeadReviewSystem } from './LeadReviewSystem';
import { Upload, Users, FileText, Search, Filter, Plus, BarChart3, Eye } from 'lucide-react';

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  status: 'HOT' | 'WARM' | 'COLD' | 'PASS';
  score: number;
  notes: string;
  avatar?: string;
  tags: string[];
  // Enhanced fields for tax lien leads
  taxId?: string;
  ownerName?: string;
  propertyAddress?: string;
  taxLawsuitNumber?: string;
  currentArrears?: number;
}

const mockLeads: Lead[] = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '(555) 123-4567',
    company: 'Smith & Associates',
    position: 'Business Owner',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    status: 'HOT',
    score: 95,
    notes: 'High-value prospect with immediate estate planning needs.',
    tags: ['High Priority', 'Estate Planning', 'Business Owner'],
    taxId: 'TX123456789',
    ownerName: 'John Smith',
    propertyAddress: '123 Main St, New York, NY 10001',
    taxLawsuitNumber: 'TL-2024-001',
    currentArrears: 15000
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '(555) 987-6543',
    company: 'Johnson Enterprises',
    position: 'CEO',
    address: '456 Oak Ave',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90210',
    status: 'WARM',
    score: 78,
    notes: 'Interested in trust services, follow up in 2 weeks.',
    tags: ['Trust Services', 'CEO', 'Follow-up'],
    taxId: 'TX987654321',
    ownerName: 'Sarah Johnson',
    propertyAddress: '456 Oak Ave, Los Angeles, CA 90210',
    taxLawsuitNumber: 'TL-2024-002',
    currentArrears: 8500
  }
];

export function LeadsContent() {
  const [leads, setLeads] = useState(mockLeads);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const handleLeadUpdate = (updatedLead: Lead) => {
    setLeads(leads.map(lead => 
      lead.id === updatedLead.id ? updatedLead : lead
    ));
    setSelectedLead(updatedLead);
  };

  const handleUploadComplete = () => {
    // Switch to review tab after successful upload
    setActiveTab('review');
  };

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lead.taxId && lead.taxId.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (lead.propertyAddress && lead.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HOT': return 'bg-red-100 text-red-800';
      case 'WARM': return 'bg-yellow-100 text-yellow-800';
      case 'COLD': return 'bg-blue-100 text-blue-800';
      case 'PASS': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lead Management System</h1>
        <p className="text-gray-600">Manage tax lien leads through CSV import, review, and detailed processing</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            CSV Import
          </TabsTrigger>
          <TabsTrigger value="review" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Lead Review
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Lead Details
          </TabsTrigger>
          <TabsTrigger value="ownership" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button size="sm" className="bg-crm-primary hover:bg-crm-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Lead
              </Button>
            </div>
          </div>

          {/* Leads Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLeads.map((lead) => (
              <Card key={lead.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{lead.name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{lead.position}</p>
                      <p className="text-sm text-gray-500">{lead.company}</p>
                      {lead.taxId && (
                        <p className="text-xs text-blue-600 mt-1 font-mono">Tax ID: {lead.taxId}</p>
                      )}
                    </div>
                    <Badge className={getStatusColor(lead.status)}>
                      {lead.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">{lead.email}</p>
                    <p className="text-sm text-gray-600">{lead.phone}</p>
                    {lead.propertyAddress && (
                      <p className="text-sm text-gray-500 truncate" title={lead.propertyAddress}>
                        📍 {lead.propertyAddress}
                      </p>
                    )}
                    {lead.currentArrears && (
                      <p className="text-sm font-semibold text-red-600">
                        Arrears: ${lead.currentArrears.toLocaleString()}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium">Score:</span>
                        <Badge variant="outline" className="text-xs">
                          {lead.score}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedLead(lead);
                          setActiveTab('details');
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upload">
          <EnhancedCsvUploader onUploadComplete={handleUploadComplete} />
        </TabsContent>

        <TabsContent value="review">
          <LeadReviewSystem />
        </TabsContent>

        <TabsContent value="details">
          {selectedLead ? (
            <LeadDetailsForm
              lead={selectedLead}
              onSave={handleLeadUpdate}
            />
          ) : (
            <Card className="p-12 text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Lead Selected</h3>
              <p className="text-gray-600 mb-4">
                Please select a lead from the overview tab to view and edit details.
              </p>
              <Button onClick={() => setActiveTab('overview')}>
                Browse Leads
              </Button>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="ownership">
          <OwnershipBreakdown />
        </TabsContent>
      </Tabs>
    </div>
  );
}

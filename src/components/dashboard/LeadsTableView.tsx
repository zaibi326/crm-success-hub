
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Grid, List, User } from 'lucide-react';
import { TaxLead } from '@/types/taxLead';
import { AddSellerDialog } from '@/components/leads/AddSellerDialog';
import { LeadTableView } from '@/components/leads/LeadTableView';
import { LeadListView } from '@/components/leads/LeadListView';
import { LeadSearchControls } from '@/components/leads/LeadSearchControls';
import { LeadEmptyState } from '@/components/leads/LeadEmptyState';

interface LeadsTableViewProps {
  leads: TaxLead[];
  onLeadSelect: (lead: TaxLead) => void;
}

export function LeadsTableView({ leads: initialLeads, onLeadSelect }: LeadsTableViewProps) {
  const [leads, setLeads] = useState(initialLeads);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('ownerName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isTableView, setIsTableView] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Filter leads based on search term
  const filteredLeads = leads.filter(lead => 
    lead.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lead.taxId && lead.taxId.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Filter by category
  const categorizedLeads = filteredLeads.filter(lead => {
    switch (activeTab) {
      case 'charles-response':
        return lead.status === 'HOT' || lead.notes?.toLowerCase().includes('response needed') || lead.notes?.toLowerCase().includes('charles');
      case 'untouched':
        return lead.status === 'COLD' || !lead.notes || lead.notes.trim() === '';
      default:
        return true;
    }
  });

  // Sort leads
  const sortedLeads = [...categorizedLeads].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'ownerName':
        aValue = a.ownerName;
        bValue = b.ownerName;
        break;
      case 'propertyAddress':
        aValue = a.propertyAddress;
        bValue = b.propertyAddress;
        break;
      case 'currentArrears':
        aValue = a.currentArrears || 0;
        bValue = b.currentArrears || 0;
        break;
      case 'createdAt':
        aValue = new Date();
        bValue = new Date();
        break;
      default:
        aValue = a.ownerName;
        bValue = b.ownerName;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    
    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleAddSeller = (newSeller: TaxLead) => {
    setLeads(prev => [...prev, newSeller]);
  };

  const handleLeadUpdate = (updatedLead: TaxLead) => {
    setLeads(prev => prev.map(lead => 
      lead.id === updatedLead.id ? updatedLead : lead
    ));
  };

  const handleLeadDelete = (leadId: number) => {
    setLeads(prev => prev.filter(lead => lead.id !== leadId));
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      'HOT': 'bg-red-100 text-red-800 border-red-200',
      'WARM': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'COLD': 'bg-blue-100 text-blue-800 border-blue-200',
      'PASS': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status as keyof typeof colors] || colors.COLD;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="text-xl font-bold text-gray-900">Seller Leads</CardTitle>
            <div className="flex items-center gap-4">
              <AddSellerDialog onAddSeller={handleAddSeller} />
              <div className="flex items-center gap-2">
                <Grid className={`w-4 h-4 ${isTableView ? 'text-blue-600' : 'text-gray-400'}`} />
                <Switch
                  checked={!isTableView}
                  onCheckedChange={(checked) => setIsTableView(!checked)}
                />
                <List className={`w-4 h-4 ${!isTableView ? 'text-blue-600' : 'text-gray-400'}`} />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <LeadSearchControls
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100">
              <TabsTrigger value="all" className="flex items-center gap-2 data-[state=active]:bg-white">
                <User className="w-4 h-4" />
                All Seller Leads ({leads.length})
              </TabsTrigger>
              <TabsTrigger value="charles-response" className="flex items-center gap-2 data-[state=active]:bg-white">
                Charles Response Needed
              </TabsTrigger>
              <TabsTrigger value="untouched" className="flex items-center gap-2 data-[state=active]:bg-white">
                Untouched Leads
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {isTableView ? (
                <LeadTableView 
                  leads={sortedLeads}
                  onLeadSelect={onLeadSelect}
                  getStatusBadge={getStatusBadge}
                  handleSort={handleSort}
                />
              ) : (
                <LeadListView 
                  leads={sortedLeads}
                  onLeadSelect={onLeadSelect}
                  onLeadUpdate={handleLeadUpdate}
                  onLeadDelete={handleLeadDelete}
                  getStatusBadge={getStatusBadge}
                />
              )}
            </TabsContent>

            <TabsContent value="charles-response" className="mt-6">
              {isTableView ? (
                <LeadTableView 
                  leads={sortedLeads}
                  onLeadSelect={onLeadSelect}
                  getStatusBadge={getStatusBadge}
                  handleSort={handleSort}
                />
              ) : (
                <LeadListView 
                  leads={sortedLeads}
                  onLeadSelect={onLeadSelect}
                  onLeadUpdate={handleLeadUpdate}
                  onLeadDelete={handleLeadDelete}
                  getStatusBadge={getStatusBadge}
                />
              )}
            </TabsContent>

            <TabsContent value="untouched" className="mt-6">
              {isTableView ? (
                <LeadTableView 
                  leads={sortedLeads}
                  onLeadSelect={onLeadSelect}
                  getStatusBadge={getStatusBadge}
                  handleSort={handleSort}
                />
              ) : (
                <LeadListView 
                  leads={sortedLeads}
                  onLeadSelect={onLeadSelect}
                  onLeadUpdate={handleLeadUpdate}
                  onLeadDelete={handleLeadDelete}
                  getStatusBadge={getStatusBadge}
                />
              )}
            </TabsContent>
          </Tabs>

          {sortedLeads.length === 0 && (
            <LeadEmptyState searchTerm={searchTerm} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

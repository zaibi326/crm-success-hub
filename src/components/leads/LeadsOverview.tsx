
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Plus } from 'lucide-react';

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
  taxId?: string;
  ownerName?: string;
  propertyAddress?: string;
  taxLawsuitNumber?: string;
  currentArrears?: number;
}

interface LeadsOverviewProps {
  leads: Lead[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onLeadSelect: (lead: Lead) => void;
  onTabChange: (tab: string) => void;
  canViewAll: boolean;
}

export function LeadsOverview({ leads, searchTerm, onSearchChange, onLeadSelect, onTabChange, canViewAll }: LeadsOverviewProps) {
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
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          {canViewAll && (
            <Button size="sm" className="bg-crm-primary hover:bg-crm-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Lead
            </Button>
          )}
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
                      onLeadSelect(lead);
                      onTabChange('details');
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
    </div>
  );
}

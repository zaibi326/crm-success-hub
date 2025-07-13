import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TaxLead } from '@/types/taxLead';
import { 
  Search, 
  Filter, 
  Play, 
  MapPin, 
  DollarSign, 
  Phone, 
  Mail,
  FileText,
  TrendingUp,
  Users,
  CheckCircle,
  Eye
} from 'lucide-react';

interface TaxLeadOverviewProps {
  leads: TaxLead[];
  onStartProcessing: (selectedLeads: TaxLead[]) => void;
  onLeadUpdate: (updatedLead: TaxLead) => void;
  onLeadSelect?: (lead: TaxLead) => void;
  showAllLeads?: boolean;
}

export function TaxLeadOverview({ 
  leads, 
  onStartProcessing, 
  onLeadUpdate, 
  onLeadSelect,
  showAllLeads = false 
}: TaxLeadOverviewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);

  // Filter leads based on search and status
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = searchTerm === '' || 
      lead.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.taxId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: leads.length,
    hot: leads.filter(l => l.status === 'HOT').length,
    warm: leads.filter(l => l.status === 'WARM').length,
    cold: leads.filter(l => l.status === 'COLD').length,
    passed: leads.filter(l => l.status === 'PASS').length,
    totalArrears: leads.reduce((sum, lead) => sum + (lead.currentArrears || 0), 0)
  };

  const handleLeadSelection = (leadId: number) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(lead => lead.id));
    }
  };

  const handleStartProcessing = () => {
    const selectedLeadObjects = leads.filter(lead => selectedLeads.includes(lead.id));
    onStartProcessing(selectedLeadObjects);
  };

  const handleLeadClick = (lead: TaxLead) => {
    if (onLeadSelect) {
      onLeadSelect(lead);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'HOT': return 'bg-red-100 text-red-800 border-red-200';
      case 'WARM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'COLD': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PASS': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hot Leads</p>
                <p className="text-3xl font-bold text-red-600">{stats.hot}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Processed</p>
                <p className="text-3xl font-bold text-green-600">{stats.passed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Arrears</p>
                <p className="text-3xl font-bold text-green-600">
                  ${stats.totalArrears.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Lead Management
            {selectedLeads.length > 0 && (
              <Button onClick={handleStartProcessing} className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Process {selectedLeads.length} Lead{selectedLeads.length > 1 ? 's' : ''}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search leads by name, address, or tax ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="HOT">Hot</SelectItem>
                <SelectItem value="WARM">Warm</SelectItem>
                <SelectItem value="COLD">Cold</SelectItem>
                <SelectItem value="PASS">Passed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Select All Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
              onChange={handleSelectAll}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">
              Select All ({filteredLeads.length} leads)
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Leads List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredLeads.map((lead) => (
          <Card 
            key={lead.id} 
            className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            onClick={() => handleLeadClick(lead)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedLeads.includes(lead.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleLeadSelection(lead.id);
                    }}
                    className="rounded border-gray-300"
                  />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 hover:text-crm-primary transition-colors">
                      {lead.ownerName}
                    </h3>
                    <p className="text-sm text-gray-600">Tax ID: {lead.taxId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${getStatusBadgeColor(lead.status)} border`}>
                    {lead.status}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLeadClick(lead);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{lead.propertyAddress}</span>
                </div>

                {lead.currentArrears && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      ${lead.currentArrears.toLocaleString()} in arrears
                    </span>
                  </div>
                )}

                {lead.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{lead.phone}</span>
                  </div>
                )}

                {lead.email && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{lead.email}</span>
                  </div>
                )}

                {lead.notes && (
                  <div className="flex items-start gap-2 text-gray-600">
                    <FileText className="w-4 h-4 mt-0.5" />
                    <span className="text-sm">{lead.notes}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLeads.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No leads found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters to find leads.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

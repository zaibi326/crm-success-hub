
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Grid, List, Calendar, MapPin, User, Tag, ArrowUpDown } from 'lucide-react';
import { TaxLead } from '@/types/taxLead';
import { AddSellerDialog } from '@/components/leads/AddSellerDialog';

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

  const getStatusBadge = (status: string) => {
    const colors = {
      'HOT': 'bg-red-100 text-red-800 border-red-200',
      'WARM': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'COLD': 'bg-blue-100 text-blue-800 border-blue-200',
      'PASS': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status as keyof typeof colors] || colors.COLD;
  };

  const SortableHeader = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <Button 
      variant="ghost" 
      onClick={() => handleSort(field)}
      className="h-auto p-0 font-semibold text-gray-700 hover:text-gray-900 flex items-center gap-1"
    >
      {children}
      <ArrowUpDown className="w-3 h-3" />
    </Button>
  );

  const TableViewComponent = () => (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 border-b">
            <TableHead className="font-semibold w-8">
              <input 
                type="checkbox" 
                className="rounded border-gray-300"
                onChange={(e) => {
                  // Handle select all functionality
                }}
              />
            </TableHead>
            <TableHead className="font-semibold">
              <SortableHeader field="ownerName">Seller</SortableHeader>
            </TableHead>
            <TableHead className="font-semibold">
              <SortableHeader field="propertyAddress">Property Address</SortableHeader>
            </TableHead>
            <TableHead className="font-semibold">Lead Source</TableHead>
            <TableHead className="font-semibold">
              <SortableHeader field="createdAt">Date Lead Created</SortableHeader>
            </TableHead>
            <TableHead className="font-semibold">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedLeads.map((lead, index) => (
            <TableRow 
              key={lead.id} 
              className="hover:bg-gray-50 cursor-pointer border-b"
              onClick={() => onLeadSelect(lead)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300"
                />
              </TableCell>
              <TableCell className="font-medium text-blue-600 hover:text-blue-800">
                {lead.ownerName}
              </TableCell>
              <TableCell className="text-gray-600 max-w-xs truncate">
                {lead.propertyAddress}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                  Streamlinerz
                </Badge>
              </TableCell>
              <TableCell className="text-gray-600 text-sm">
                {new Date().toLocaleDateString('en-US', { 
                  month: '2-digit', 
                  day: '2-digit', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </TableCell>
              <TableCell>
                <Badge className={`${getStatusBadge(lead.status)} border text-xs`}>
                  {lead.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const ListViewComponent = () => (
    <div className="space-y-3">
      {sortedLeads.map((lead) => (
        <Card 
          key={lead.id} 
          className="hover:shadow-md transition-shadow cursor-pointer border"
          onClick={() => onLeadSelect(lead)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300"
                  onClick={(e) => e.stopPropagation()}
                />
                <h3 className="font-semibold text-blue-600 hover:text-blue-800">{lead.ownerName}</h3>
              </div>
              <Badge className={`${getStatusBadge(lead.status)} border text-xs`}>
                {lead.status}
              </Badge>
            </div>
            <div className="space-y-1 text-sm text-gray-600 ml-7">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{lead.propertyAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                  Streamlinerz
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              {lead.currentArrears && (
                <div className="text-green-600 font-medium">
                  ${lead.currentArrears.toLocaleString()} in arrears
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

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
          {/* Search and Sort Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search leads by name, address, tax ID, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ownerName">Seller Name</SelectItem>
                <SelectItem value="propertyAddress">Property Address</SelectItem>
                <SelectItem value="createdAt">Date Created</SelectItem>
                <SelectItem value="currentArrears">Arrears Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabs Navigation */}
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
              {isTableView ? <TableViewComponent /> : <ListViewComponent />}
            </TabsContent>

            <TabsContent value="charles-response" className="mt-6">
              {isTableView ? <TableViewComponent /> : <ListViewComponent />}
            </TabsContent>

            <TabsContent value="untouched" className="mt-6">
              {isTableView ? <TableViewComponent /> : <ListViewComponent />}
            </TabsContent>
          </Tabs>

          {sortedLeads.length === 0 && (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search terms.' : 'Start by adding your first seller lead.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

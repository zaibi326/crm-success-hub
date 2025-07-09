
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Grid, List, Calendar, MapPin, User, Tag } from 'lucide-react';
import { TaxLead } from '@/types/taxLead';

interface LeadsTableViewProps {
  leads: TaxLead[];
  onLeadSelect: (lead: TaxLead) => void;
}

export function LeadsTableView({ leads, onLeadSelect }: LeadsTableViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('ownerName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isTableView, setIsTableView] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Filter leads based on search term
  const filteredLeads = leads.filter(lead => 
    lead.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lead.taxId && lead.taxId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Filter by category
  const categorizedLeads = filteredLeads.filter(lead => {
    switch (activeTab) {
      case 'response-needed':
        return lead.status === 'HOT' || lead.notes?.toLowerCase().includes('response needed');
      case 'untouched':
        return lead.status === 'COLD' || !lead.notes;
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
      default:
        aValue = a.ownerName;
        bValue = b.ownerName;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    
    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

  const getStatusBadge = (status: string) => {
    const colors = {
      'HOT': 'bg-red-100 text-red-800 border-red-200',
      'WARM': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'COLD': 'bg-blue-100 text-blue-800 border-blue-200',
      'PASS': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status as keyof typeof colors] || colors.COLD;
  };

  const TableViewComponent = () => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">
              <Button 
                variant="ghost" 
                onClick={() => {
                  setSortBy('ownerName');
                  setSortOrder(sortBy === 'ownerName' && sortOrder === 'asc' ? 'desc' : 'asc');
                }}
                className="h-auto p-0 font-semibold text-gray-700 hover:text-gray-900"
              >
                Seller
              </Button>
            </TableHead>
            <TableHead className="font-semibold">
              <Button 
                variant="ghost" 
                onClick={() => {
                  setSortBy('propertyAddress');
                  setSortOrder(sortBy === 'propertyAddress' && sortOrder === 'asc' ? 'desc' : 'asc');
                }}
                className="h-auto p-0 font-semibold text-gray-700 hover:text-gray-900"
              >
                Property Address
              </Button>
            </TableHead>
            <TableHead className="font-semibold">Lead Source</TableHead>
            <TableHead className="font-semibold">Date Lead Created</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedLeads.map((lead, index) => (
            <TableRow 
              key={lead.id} 
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => onLeadSelect(lead)}
            >
              <TableCell className="font-medium">{lead.ownerName}</TableCell>
              <TableCell className="text-gray-600">{lead.propertyAddress}</TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Streamlinerz
                </Badge>
              </TableCell>
              <TableCell className="text-gray-600">
                {new Date().toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Badge className={`${getStatusBadge(lead.status)} border`}>
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
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onLeadSelect(lead)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">{lead.ownerName}</h3>
              <Badge className={`${getStatusBadge(lead.status)} border`}>
                {lead.status}
              </Badge>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{lead.propertyAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
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
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-900">Current Deals</CardTitle>
            <div className="flex items-center gap-4">
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
                  placeholder="Search leads by name, address, or tax ID..."
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
                <SelectItem value="currentArrears">Arrears Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                All Seller Leads ({leads.length})
              </TabsTrigger>
              <TabsTrigger value="response-needed" className="flex items-center gap-2">
                Charles Response Needed
              </TabsTrigger>
              <TabsTrigger value="untouched" className="flex items-center gap-2">
                Untouched Leads
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {isTableView ? <TableViewComponent /> : <ListViewComponent />}
            </TabsContent>

            <TabsContent value="response-needed" className="mt-6">
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
                Try adjusting your search terms or filters.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

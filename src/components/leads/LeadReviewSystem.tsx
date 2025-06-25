
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, X, Search, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Lead {
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
}

const mockLeads: Lead[] = [
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
    email: 'john.smith@email.com'
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
    email: 'sarah.j@email.com'
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
    phone: '(555) 456-7890'
  }
];

export function LeadReviewSystem() {
  const [leads, setLeads] = useState(mockLeads);
  const [currentLeadIndex, setCurrentLeadIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');
  const { toast } = useToast();

  const currentLead = leads[currentLeadIndex];

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.taxId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAction = (action: 'pass' | 'keep') => {
    if (!currentLead) return;

    if (action === 'pass') {
      const updatedLeads = leads.map(lead =>
        lead.id === currentLead.id ? { ...lead, status: 'PASS' as const } : lead
      );
      setLeads(updatedLeads);
      
      toast({
        title: "Lead Passed",
        description: `${currentLead.ownerName} has been marked as passed.`,
      });
    } else {
      toast({
        title: "Lead Kept! 🎉",
        description: `${currentLead.ownerName} has been added to your pipeline.`,
      });
    }

    // Move to next lead
    if (currentLeadIndex < filteredLeads.length - 1) {
      setCurrentLeadIndex(currentLeadIndex + 1);
    } else {
      toast({
        title: "Review Complete! ✅",
        description: "You've reviewed all available leads!",
      });
    }
  };

  const handleInlineEdit = (field: string, value: string) => {
    setEditingField(field);
    setTempValue(value);
  };

  const saveInlineEdit = () => {
    if (!currentLead || !editingField) return;

    const updatedLeads = leads.map(lead =>
      lead.id === currentLead.id 
        ? { ...lead, [editingField]: tempValue }
        : lead
    );
    setLeads(updatedLeads);
    setEditingField(null);
    setTempValue('');

    toast({
      title: "Field Updated",
      description: "Lead information has been updated successfully.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HOT': return 'bg-red-100 text-red-800';
      case 'WARM': return 'bg-yellow-100 text-yellow-800';
      case 'COLD': return 'bg-blue-100 text-blue-800';
      case 'PASS': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!currentLead) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No leads to review</h3>
        <p className="text-gray-600">Upload a CSV file to start reviewing leads.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
        <div className="flex gap-2 items-center">
          <Filter className="w-4 h-4 text-gray-500" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="HOT">Hot</SelectItem>
              <SelectItem value="WARM">Warm</SelectItem>
              <SelectItem value="COLD">Cold</SelectItem>
              <SelectItem value="PASS">Pass</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lead Review Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Information */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{currentLead.ownerName}</CardTitle>
                  <p className="text-gray-600 mt-1">Tax ID: {currentLead.taxId}</p>
                </div>
                <Badge className={getStatusColor(currentLead.status)}>
                  {currentLead.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Property Address */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Property Address</Label>
                {editingField === 'propertyAddress' ? (
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="flex-1"
                    />
                    <Button size="sm" onClick={saveInlineEdit}>Save</Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingField(null)}>Cancel</Button>
                  </div>
                ) : (
                  <p 
                    className="text-gray-900 cursor-pointer hover:bg-gray-50 p-2 rounded border mt-1"
                    onClick={() => handleInlineEdit('propertyAddress', currentLead.propertyAddress)}
                  >
                    {currentLead.propertyAddress}
                  </p>
                )}
              </div>

              {/* Tax Lawsuit Number */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Tax Lawsuit Number</Label>
                {editingField === 'taxLawsuitNumber' ? (
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="flex-1"
                    />
                    <Button size="sm" onClick={saveInlineEdit}>Save</Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingField(null)}>Cancel</Button>
                  </div>
                ) : (
                  <p 
                    className="text-gray-900 cursor-pointer hover:bg-gray-50 p-2 rounded border mt-1"
                    onClick={() => handleInlineEdit('taxLawsuitNumber', currentLead.taxLawsuitNumber || '')}
                  >
                    {currentLead.taxLawsuitNumber || 'Not specified'}
                  </p>
                )}
              </div>

              {/* Current Arrears */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Current Arrears</Label>
                {editingField === 'currentArrears' ? (
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="number"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="flex-1"
                    />
                    <Button size="sm" onClick={saveInlineEdit}>Save</Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingField(null)}>Cancel</Button>
                  </div>
                ) : (
                  <p 
                    className="text-gray-900 cursor-pointer hover:bg-gray-50 p-2 rounded border mt-1 font-semibold"
                    onClick={() => handleInlineEdit('currentArrears', currentLead.currentArrears?.toString() || '0')}
                  >
                    ${currentLead.currentArrears?.toLocaleString() || '0'}
                  </p>
                )}
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Phone</Label>
                  <p className="text-gray-900 mt-1">{currentLead.phone || 'Not available'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Email</Label>
                  <p className="text-gray-900 mt-1">{currentLead.email || 'Not available'}</p>
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Notes</Label>
                {editingField === 'notes' ? (
                  <div className="flex flex-col gap-2 mt-1">
                    <Textarea
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={saveInlineEdit}>Save</Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingField(null)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="text-gray-900 cursor-pointer hover:bg-gray-50 p-3 rounded border mt-1 min-h-[80px]"
                    onClick={() => handleInlineEdit('notes', currentLead.notes || '')}
                  >
                    {currentLead.notes || 'Click to add notes...'}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
            <CardHeader>
              <CardTitle className="text-xl text-center text-gray-900">Review Actions</CardTitle>
              <p className="text-center text-gray-600 text-sm">Make your decision on this lead</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => handleAction('keep')}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white h-16 text-lg font-semibold shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
              >
                <CheckCircle className="w-6 h-6 mr-3" />
                KEEP LEAD
              </Button>
              
              <Button
                onClick={() => handleAction('pass')}
                variant="outline"
                className="w-full border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 h-16 text-lg font-semibold shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
              >
                <X className="w-6 h-6 mr-3" />
                PASS ON LEAD
              </Button>
            </CardContent>
          </Card>

          {/* Progress Card */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-crm-primary to-crm-accent text-white">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  {currentLeadIndex + 1} / {filteredLeads.length}
                </div>
                <div className="text-sm opacity-90">
                  Leads Progress
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

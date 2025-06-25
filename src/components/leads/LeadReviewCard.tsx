
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

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

interface LeadReviewCardProps {
  lead: Lead;
  onLeadUpdate: (updatedLead: Lead) => void;
}

export function LeadReviewCard({ lead, onLeadUpdate }: LeadReviewCardProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');
  const { toast } = useToast();

  const handleInlineEdit = (field: string, value: string) => {
    setEditingField(field);
    setTempValue(value);
  };

  const saveInlineEdit = () => {
    if (!lead || !editingField) return;

    const updatedLead = { ...lead, [editingField]: tempValue };
    onLeadUpdate(updatedLead);
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

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl">{lead.ownerName}</CardTitle>
            <p className="text-gray-600 mt-1">Tax ID: {lead.taxId}</p>
          </div>
          <Badge className={getStatusColor(lead.status)}>
            {lead.status}
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
              onClick={() => handleInlineEdit('propertyAddress', lead.propertyAddress)}
            >
              {lead.propertyAddress}
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
              onClick={() => handleInlineEdit('taxLawsuitNumber', lead.taxLawsuitNumber || '')}
            >
              {lead.taxLawsuitNumber || 'Not specified'}
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
              onClick={() => handleInlineEdit('currentArrears', lead.currentArrears?.toString() || '0')}
            >
              ${lead.currentArrears?.toLocaleString() || '0'}
            </p>
          )}
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-700">Phone</Label>
            <p className="text-gray-900 mt-1">{lead.phone || 'Not available'}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700">Email</Label>
            <p className="text-gray-900 mt-1">{lead.email || 'Not available'}</p>
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
              onClick={() => handleInlineEdit('notes', lead.notes || '')}
            >
              {lead.notes || 'Click to add notes...'}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

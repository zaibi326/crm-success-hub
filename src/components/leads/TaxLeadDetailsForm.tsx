import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, X } from 'lucide-react';
import { TaxLead } from '@/types/taxLead';

interface TaxLeadDetailsFormProps {
  lead: TaxLead;
  onSave: (updatedLead: TaxLead) => void;
  userRole: 'admin' | 'editor' | 'viewer';
}

export function TaxLeadDetailsForm({ lead, onSave, userRole }: TaxLeadDetailsFormProps) {
  const handleInputChange = (field: keyof TaxLead, value: any) => {
    onSave({ ...lead, [field]: value });
  };

  const handleStatusChange = (status: TaxLead['status']) => {
    onSave({ ...lead, status: status });
  };

  const handleTemperatureChange = (temperature: TaxLead['temperature']) => {
    onSave({ ...lead, temperature: temperature });
  };

  const formatCurrency = (amount: number | undefined) => {
    if (!amount) return 'N/A';
    return `$${amount.toLocaleString()}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Lead Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Owner Name and Property Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ownerName">Owner Name</Label>
              <Input
                type="text"
                id="ownerName"
                value={lead.ownerName}
                onChange={(e) => handleInputChange('ownerName', e.target.value)}
                disabled={userRole === 'viewer'}
              />
            </div>
            <div>
              <Label htmlFor="propertyAddress">Property Address</Label>
              <Input
                type="text"
                id="propertyAddress"
                value={lead.propertyAddress}
                onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
                disabled={userRole === 'viewer'}
              />
            </div>
          </div>

          {/* Tax ID and Lawsuit Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="taxId">Tax ID</Label>
              <Input
                type="text"
                id="taxId"
                value={lead.taxId}
                onChange={(e) => handleInputChange('taxId', e.target.value)}
                disabled={userRole === 'viewer'}
              />
            </div>
            <div>
              <Label htmlFor="taxLawsuitNumber">Tax Lawsuit Number</Label>
              <Input
                type="text"
                id="taxLawsuitNumber"
                value={lead.taxLawsuitNumber}
                onChange={(e) => handleInputChange('taxLawsuitNumber', e.target.value)}
                disabled={userRole === 'viewer'}
              />
            </div>
          </div>

          {/* Current Arrears */}
          <div>
            <Label htmlFor="currentArrears">Current Arrears</Label>
            <Input
              type="text"
              id="currentArrears"
              value={formatCurrency(lead.currentArrears)}
              onChange={(e) => {
                const numValue = parseFloat(e.target.value.replace(/[$,]/g, ''));
                if (!isNaN(numValue)) {
                  handleInputChange('currentArrears', numValue);
                }
              }}
              disabled={userRole === 'viewer'}
            />
          </div>

          {/* Status and Temperature */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={handleStatusChange} defaultValue={lead.status}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HOT">HOT</SelectItem>
                  <SelectItem value="WARM">WARM</SelectItem>
                  <SelectItem value="COLD">COLD</SelectItem>
                  <SelectItem value="PASS">PASS</SelectItem>
                  <SelectItem value="KEEP">KEEP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="temperature">Temperature</Label>
              <Select onValueChange={handleTemperatureChange} defaultValue={lead.temperature}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select temperature" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HOT">HOT</SelectItem>
                  <SelectItem value="WARM">WARM</SelectItem>
                  <SelectItem value="COLD">COLD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={lead.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              disabled={userRole === 'viewer'}
              className="resize-none"
            />
          </div>

          {/* Attachments */}
          <div>
            <Label>Attachments</Label>
            <div className="space-y-2">
              {(lead.attachedFiles || []).map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="font-medium">{file.name}</div>
                      {file.type && <div className="text-sm text-gray-500">Type: {file.type}</div>}
                      {file.size && <div className="text-sm text-gray-500">Size: {formatFileSize(file.size)}</div>}
                    </div>
                  </div>
                  {userRole === 'editor' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const updatedFiles = (lead.attachedFiles || []).filter(f => f.id !== file.id);
                        onSave({ ...lead, attachedFiles: updatedFiles });
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

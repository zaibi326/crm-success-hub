
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FileUploadSection } from '../FileUploadSection';
import { TaxLead } from '@/types/taxLead';
import { Calendar, User, FileText } from 'lucide-react';

interface ConditionalFieldsSectionProps {
  lead: TaxLead | undefined;
  onLeadUpdate: (updatedLead: TaxLead) => void;
  canEdit: boolean;
}

export function ConditionalFieldsSection({ lead, onLeadUpdate, canEdit }: ConditionalFieldsSectionProps) {
  if (!lead) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Conditional Fields
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading conditional fields...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Map attachedFiles to include category for vesting_deed files
  const files = lead.attachedFiles?.filter(f => f.type === 'vesting_deed').map(f => ({
    ...f,
    category: 'vesting_deed' as const,
    type: f.type || 'unknown'
  })) || [];

  const handleFieldChange = (field: keyof TaxLead, value: any) => {
    const updatedLead = { ...lead, [field]: value };
    onLeadUpdate(updatedLead);
  };

  const handleFileUpload = (uploadedFiles: File[], category: string) => {
    // Handle file upload logic here
    console.log('Files uploaded:', uploadedFiles, 'Category:', category);
  };

  const handleRemoveFile = (fileId: string) => {
    const updatedFiles = lead.attachedFiles?.filter(f => f.id !== fileId) || [];
    const updatedLead = { ...lead, attachedFiles: updatedFiles };
    onLeadUpdate(updatedLead);
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Conditional Fields
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Owner of Record */}
        <div className="space-y-2">
          <Label htmlFor="ownerOfRecord" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Owner of Record
          </Label>
          <Input
            id="ownerOfRecord"
            value={lead.ownerOfRecord || ''}
            onChange={(e) => handleFieldChange('ownerOfRecord', e.target.value)}
            placeholder="Enter owner of record"
            disabled={!canEdit}
          />
        </div>

        {/* Vesting Deed Date */}
        <div className="space-y-2">
          <Label htmlFor="vestingDeedDate" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Vesting Deed Date
          </Label>
          <Input
            id="vestingDeedDate"
            type="date"
            value={lead.vestingDeedDate || ''}
            onChange={(e) => handleFieldChange('vestingDeedDate', e.target.value)}
            disabled={!canEdit}
          />
        </div>

        {/* Grantor/Grantee Name */}
        <div className="space-y-2">
          <Label htmlFor="grantorGranteeName">Grantor/Grantee Name</Label>
          <Input
            id="grantorGranteeName"
            value={lead.grantorGranteeName || ''}
            onChange={(e) => handleFieldChange('grantorGranteeName', e.target.value)}
            placeholder="Enter grantor/grantee name"
            disabled={!canEdit}
          />
        </div>

        {/* Vesting Deed Documents */}
        <div className="space-y-4">
          <Label>Vesting Deed Documents</Label>
          <FileUploadSection
            title="Vesting Deed Documents"
            category="vesting_deed"
            files={files}
            onFileUpload={(files) => handleFileUpload(files, 'vesting_deed')}
            onRemoveFile={handleRemoveFile}
            acceptedTypes=".pdf,.docx,.png,.jpg,.jpeg"
            disabled={!canEdit}
          />
        </div>
      </CardContent>
    </Card>
  );
}

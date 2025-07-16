
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileUp, AlertTriangle } from 'lucide-react';
import { TaxLead } from '@/types/taxLead';
import { AttachmentsSection } from './AttachmentsSection';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  url: string;
  category: 'probate' | 'vesting_deed' | 'other' | 'death' | 'lawsuit' | 'taxing_entities';
}

interface ConditionalFieldsSectionProps {
  formData: TaxLead;
  files: UploadedFile[];
  onInputChange: (field: keyof TaxLead, value: any) => void;
  onFileUpload: (files: File[], category: 'probate' | 'vesting_deed' | 'other' | 'death' | 'lawsuit' | 'taxing_entities') => void;
  onRemoveFile: (fileId: string) => void;
  canEdit: boolean;
}

export function ConditionalFieldsSection({ 
  formData, 
  files,
  onInputChange, 
  onFileUpload,
  onRemoveFile,
  canEdit 
}: ConditionalFieldsSectionProps) {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          Conditional Fields
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Vesting Deed Information */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <FileUp className="w-4 h-4 text-blue-500" />
            Vesting Deed Information
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vestingDeedDate">Vesting Deed Date</Label>
              <Input
                id="vestingDeedDate"
                type="date"
                value={formData.vestingDeedDate || ''}
                onChange={(e) => onInputChange('vestingDeedDate', e.target.value)}
                disabled={!canEdit}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="grantorGranteeName">Grantor/Grantee Name</Label>
              <Input
                id="grantorGranteeName"
                value={formData.grantorGranteeName || ''}
                onChange={(e) => onInputChange('grantorGranteeName', e.target.value)}
                placeholder="Enter grantor/grantee name"
                disabled={!canEdit}
              />
            </div>
          </div>

          {/* Vesting Deed File Upload */}
          <AttachmentsSection
            files={files}
            onRemoveFile={onRemoveFile}
            onFileUpload={(uploadedFiles) => onFileUpload(uploadedFiles, 'vesting_deed')}
            canEdit={canEdit}
            title="Vesting Deed Documents"
            description="Upload vesting deed related documents"
          />
        </div>
      </CardContent>
    </Card>
  );
}

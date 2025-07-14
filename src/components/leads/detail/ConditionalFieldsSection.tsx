
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileUploadSection } from '../FileUploadSection';
import { TaxLead } from '@/types/taxLead';

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
        <CardTitle>Conditional Fields</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Probate Documents */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="probateNotes">Probate Notes</Label>
            <Textarea
              id="probateNotes"
              value={formData.probateNotes || ''}
              onChange={(e) => onInputChange('probateNotes', e.target.value)}
              placeholder="Enter probate information..."
              className="min-h-[100px]"
              disabled={!canEdit}
            />
          </div>
          
          <FileUploadSection
            title="Probate Documents"
            category="probate"
            files={files.filter(f => f.category === 'probate')}
            onFileUpload={(files) => onFileUpload(files, 'probate')}
            onRemoveFile={onRemoveFile}
            acceptedTypes=".pdf,.docx,.png,.jpg,.jpeg"
            disabled={!canEdit}
          />
        </div>

        {/* Vesting Deed Documents */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vestingDeedNotes">Vesting Deed Notes</Label>
            <Textarea
              id="vestingDeedNotes"
              value={formData.vestingDeedNotes || ''}
              onChange={(e) => onInputChange('vestingDeedNotes', e.target.value)}
              placeholder="Enter vesting deed information..."
              className="min-h-[100px]"
              disabled={!canEdit}
            />
          </div>
          
          <FileUploadSection
            title="Vesting Deed Documents"
            category="vesting_deed"
            files={files.filter(f => f.category === 'vesting_deed')}
            onFileUpload={(files) => onFileUpload(files, 'vesting_deed')}
            onRemoveFile={onRemoveFile}
            acceptedTypes=".pdf,.docx,.png,.jpg,.jpeg"
            disabled={!canEdit}
          />
        </div>
      </CardContent>
    </Card>
  );
}

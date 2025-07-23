
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FileText, Upload, X } from 'lucide-react';
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
  canEdit: boolean;
  onInputChange: (field: keyof TaxLead, value: any) => void;
  onFileUpload: (files: File[], category: 'probate' | 'vesting_deed' | 'other' | 'death' | 'lawsuit' | 'taxing_entities') => void;
  onRemoveFile: (fileId: string) => void;
}

export function ConditionalFieldsSection({
  formData,
  files,
  canEdit,
  onInputChange,
  onFileUpload,
  onRemoveFile
}: ConditionalFieldsSectionProps) {
  // Filter files specifically for vesting deed category
  const vestingDeedFiles = files.filter(file => file.category === 'vesting_deed');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || []);
    if (uploadedFiles.length > 0) {
      onFileUpload(uploadedFiles, 'vesting_deed');
    }
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-crm-primary" />
          Conditional Fields
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Vesting Deed Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Label htmlFor="vestingDeed" className="text-sm font-medium">
              Vesting Deed
            </Label>
            <Badge variant="outline" className="text-xs">
              Optional
            </Badge>
          </div>
          
          <Input
            id="vestingDeed"
            value={formData.vestingDeed || ''}
            onChange={(e) => onInputChange('vestingDeed', e.target.value)}
            placeholder="Enter vesting deed information"
            disabled={!canEdit}
            className="w-full"
          />

          {/* Vesting Deed File Upload */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Vesting Deed Documents</Label>
            
            {canEdit && (
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  id="vestingDeedUpload"
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('vestingDeedUpload')?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload Vesting Deed
                </Button>
              </div>
            )}

            {/* Display uploaded vesting deed files */}
            {vestingDeedFiles.length > 0 && (
              <div className="space-y-2">
                {vestingDeedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium">{file.name}</span>
                    </div>
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveFile(file.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

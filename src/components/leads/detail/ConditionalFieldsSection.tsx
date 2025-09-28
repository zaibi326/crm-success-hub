
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FileText, Upload, X, ChevronDown } from 'lucide-react';
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
    <Card className="shadow-sm border border-gray-200">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="conditional-fields" className="border-none">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="text-lg font-semibold">Conditional Fields</span>
              <Badge variant="outline" className="ml-2">
                Optional
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="space-y-4">
              {/* Vesting Deed Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vestingDeedDate" className="text-sm font-medium">
                    Vesting Deed Date
                  </Label>
                  <Input
                    id="vestingDeedDate"
                    value={formData.vestingDeedDate || ''}
                    onChange={(e) => onInputChange('vestingDeedDate', e.target.value)}
                    placeholder="Enter vesting deed date"
                    disabled={!canEdit}
                    className="h-9"
                  />
                </div>

                {/* Grantor/Grantee Name */}
                <div className="space-y-2">
                  <Label htmlFor="grantorGranteeName" className="text-sm font-medium">
                    Grantor/Grantee Name
                  </Label>
                  <Input
                    id="grantorGranteeName"
                    value={formData.grantorGranteeName || ''}
                    onChange={(e) => onInputChange('grantorGranteeName', e.target.value)}
                    placeholder="Enter grantor/grantee name"
                    disabled={!canEdit}
                    className="h-9"
                  />
                </div>
              </div>

              {/* Owner of Record */}
              <div className="space-y-2">
                <Label htmlFor="ownerOfRecord" className="text-sm font-medium">
                  Owner of Record
                </Label>
                <Input
                  id="ownerOfRecord"
                  value={formData.ownerOfRecord || ''}
                  onChange={(e) => onInputChange('ownerOfRecord', e.target.value)}
                  placeholder="Enter owner of record"
                  disabled={!canEdit}
                  className="h-9"
                />
              </div>

              {/* Vesting Deed File Upload */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Vesting Deed Documents</Label>
                
                {/* Upload Area - Always show if can edit */}
                {canEdit && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary transition-colors">
                    <input
                      type="file"
                      id="vestingDeedUpload"
                      accept=".pdf,.jpg,.jpeg,.png,.docx"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label 
                      htmlFor="vestingDeedUpload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <Upload className="w-6 h-6 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {vestingDeedFiles.length > 0 ? 'Upload more documents' : 'Click to upload documents'}
                      </span>
                      <span className="text-xs text-gray-500">PDF, DOCX, JPG, PNG supported</span>
                    </label>
                  </div>
                )}

                {/* Display uploaded vesting deed files */}
                {vestingDeedFiles.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-600">Uploaded Files:</Label>
                    {vestingDeedFiles.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium truncate">{file.name}</span>
                        </div>
                        {canEdit && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveFile(file.id)}
                            className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}

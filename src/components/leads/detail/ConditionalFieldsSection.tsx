
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FileUp, AlertTriangle, Upload, Eye, Trash2, Link, Plus } from 'lucide-react';
import { TaxLead } from '@/types/taxLead';
import { useToast } from '@/hooks/use-toast';
import { FilesList } from './attachments/FilesList';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  url: string;
  size?: number;
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
  const { toast } = useToast();
  
  // Filter files for vesting deed category
  const vestingDeedFiles = files.filter(file => file.category === 'vesting_deed');

  const handleVestingDeedUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length > 0) {
      onFileUpload(selectedFiles, 'vesting_deed');
      toast({
        title: "Vesting Deed Files Added",
        description: `${selectedFiles.length} file(s) added. Click "Save Changes" to persist.`
      });
    }
    // Reset input
    event.target.value = '';
  };

  const handleVestingDeedPdfLink = () => {
    const pdfUrl = prompt('Enter PDF URL:');
    if (pdfUrl && pdfUrl.includes('http')) {
      const fileName = pdfUrl.split('/').pop() || 'vesting_deed.pdf';
      const mockFile = Object.create(File.prototype, {
        name: { value: fileName, writable: false },
        type: { value: 'application/pdf', writable: false },
        size: { value: 0, writable: false },
        lastModified: { value: Date.now(), writable: false },
        webkitRelativePath: { value: pdfUrl, writable: false }
      }) as File;
      
      onFileUpload([mockFile], 'vesting_deed');
      toast({
        title: "PDF Link Added",
        description: "Vesting deed PDF link added successfully"
      });
    }
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          Conditional Fields
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Vesting Deed Information with Integrated Document Upload */}
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

          {/* Integrated PDF Document Attachment */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium text-gray-700">
                Vesting Deed Documents
              </Label>
              {canEdit && (
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleVestingDeedUpload}
                    className="hidden"
                    id="vesting-deed-upload"
                    multiple
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => document.getElementById('vesting-deed-upload')?.click()}
                    className="flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload PDF
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleVestingDeedPdfLink}
                    className="flex items-center gap-2"
                  >
                    <Link className="w-4 h-4" />
                    Add Link
                  </Button>
                </div>
              )}
            </div>

            {/* Display uploaded vesting deed files */}
            {vestingDeedFiles.length > 0 ? (
              <div className="space-y-2">
                {vestingDeedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-white rounded border">
                    <div className="flex items-center gap-3">
                      <FileUp className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {file.type === 'application/pdf' ? 'PDF' : file.type.split('/')[1]?.toUpperCase()}
                          {file.size && ` • ${(file.size / 1024).toFixed(1)} KB`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(file.url, '_blank')}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {canEdit && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onRemoveFile(file.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <FileUp className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No vesting deed documents uploaded</p>
                {canEdit && (
                  <p className="text-xs mt-1">Click "Upload PDF" or "Add Link" to add documents</p>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

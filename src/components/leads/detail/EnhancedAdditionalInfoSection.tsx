
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { FileText, Upload, X, Save } from 'lucide-react';
import { TaxLead } from '@/types/taxLead';

interface UploadedFile {
  id: string;
  name: string;
  size?: number;
  type: string;
  url?: string;
  category: 'probate' | 'vesting_deed' | 'other' | 'death' | 'lawsuit' | 'taxing_entities';
}

interface EnhancedAdditionalInfoSectionProps {
  formData: TaxLead;
  onInputChange: (field: keyof TaxLead, value: any) => void;
  canEdit: boolean;
  files: UploadedFile[];
  onFileUpload: (files: File[], category: 'probate' | 'vesting_deed' | 'other' | 'death' | 'lawsuit' | 'taxing_entities') => void;
  onRemoveFile: (fileId: string) => void;
}

interface InfoSection {
  key: keyof TaxLead;
  notesKey: keyof TaxLead;
  label: string;
  icon: React.ReactNode;
}

const infoSections: InfoSection[] = [
  {
    key: 'hasDeath',
    notesKey: 'deathNotes',
    label: 'Death Information',
    icon: <FileText className="w-4 h-4" />
  },
  {
    key: 'hasProbate',
    notesKey: 'probateNotes',
    label: 'Probate Information',
    icon: <FileText className="w-4 h-4" />
  },
  {
    key: 'hasLawsuit',
    notesKey: 'lawsuitNotes',
    label: 'Lawsuit Details',
    icon: <FileText className="w-4 h-4" />
  },
  {
    key: 'hasAdditionalTaxingEntities',
    notesKey: 'additionalTaxingNotes',
    label: 'Additional Taxing Entities',
    icon: <FileText className="w-4 h-4" />
  }
];

export function EnhancedAdditionalInfoSection({ 
  formData, 
  onInputChange, 
  canEdit,
  files,
  onFileUpload,
  onRemoveFile
}: EnhancedAdditionalInfoSectionProps) {
  const [hasChanges, setHasChanges] = useState(false);

  // Group files by category for display
  const getFilesForSection = (category: 'death' | 'probate' | 'lawsuit' | 'taxing_entities') => {
    return files.filter(file => file.category === category);
  };

  // Early return if formData is not available
  if (!formData) {
    return (
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-xl">
            <FileText className="w-6 h-6 text-green-600" />
            Additional Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  const handleToggle = (key: keyof TaxLead, value: boolean) => {
    onInputChange(key, value);
    setHasChanges(true);
  };

  const handleNotesChange = (notesKey: keyof TaxLead, value: string) => {
    onInputChange(notesKey, value);
    setHasChanges(true);
  };

  const handleFileUpload = (sectionKey: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles) return;

    const fileArray = Array.from(uploadedFiles);
    const categoryMap: Record<string, 'death' | 'probate' | 'lawsuit' | 'taxing_entities'> = {
      'hasDeath': 'death',
      'hasProbate': 'probate', 
      'hasLawsuit': 'lawsuit',
      'hasAdditionalTaxingEntities': 'taxing_entities'
    };
    
    const category = categoryMap[sectionKey] || 'other';
    onFileUpload(fileArray, category);
    setHasChanges(true);
  };

  const handleRemoveFile = (fileId: string) => {
    onRemoveFile(fileId);
    setHasChanges(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSave = () => {
    // Changes are automatically saved through onInputChange
    setHasChanges(false);
    console.log('Additional information saved automatically');
  };

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xl">
            <FileText className="w-6 h-6 text-green-600" />
            Additional Information
          </div>
          {hasChanges && (
            <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {infoSections.map((section) => {
          const isEnabled = Boolean(formData[section.key]);
          const notesValue = (formData[section.notesKey] as string) || '';
          const categoryMap: Record<string, 'death' | 'probate' | 'lawsuit' | 'taxing_entities'> = {
            'hasDeath': 'death',
            'hasProbate': 'probate', 
            'hasLawsuit': 'lawsuit',
            'hasAdditionalTaxingEntities': 'taxing_entities'
          };
          const sectionFiles = getFilesForSection(categoryMap[section.key] || 'death');

          return (
            <div key={section.key} className="border border-gray-200 rounded-lg p-4 space-y-4">
              {/* Toggle Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {section.icon}
                  <Label htmlFor={section.key} className="font-medium cursor-pointer">
                    {section.label}
                  </Label>
                </div>
                <Switch
                  id={section.key}
                  checked={isEnabled}
                  onCheckedChange={(checked) => handleToggle(section.key, checked)}
                  disabled={!canEdit}
                />
              </div>

              {/* Content when enabled */}
              {isEnabled && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pl-7">
                  {/* Notes Section */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Notes</Label>
                    <Textarea
                      value={notesValue}
                      onChange={(e) => handleNotesChange(section.notesKey, e.target.value)}
                      placeholder={`Enter ${section.label.toLowerCase()} details...`}
                      className="min-h-[100px] resize-none"
                      disabled={!canEdit}
                    />
                  </div>

                  {/* File Upload Section */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">Attachments</Label>
                    
                    {/* Upload Button */}
                    <div className="relative">
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.docx,.png,.jpg,.jpeg"
                        onChange={(e) => handleFileUpload(section.key, e)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={!canEdit}
                      />
                      <Button 
                        variant="outline" 
                        className="w-full h-20 border-2 border-dashed border-gray-300 hover:border-gray-400"
                        disabled={!canEdit}
                      >
                        <div className="text-center">
                          <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                          <div className="text-sm text-gray-600">
                            Upload Files
                          </div>
                          <div className="text-xs text-gray-400">
                            PDF, DOCX, PNG, JPG
                          </div>
                        </div>
                      </Button>
                    </div>

                    {/* Files List */}
                    {sectionFiles.length > 0 && (
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {sectionFiles.map((file) => (
                          <div key={file.id} className="flex items-center justify-between bg-gray-50 p-2 rounded border">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {file.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatFileSize(file.size)}
                              </div>
                            </div>
                            {canEdit && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveFile(file.id)}
                                className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 h-auto"
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
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

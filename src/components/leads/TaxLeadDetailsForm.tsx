
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Save, DollarSign, Home, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FileUploadSection } from './FileUploadSection';
import { LeadStatusButtons } from './LeadStatusButtons';
import { LinkifiedText } from '../common/LinkifiedText';

interface TaxLead {
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
  // Enhanced fields for detailed lead information
  ownerOfRecord?: string;
  hasDeath?: boolean;
  deathNotes?: string;
  hasProbate?: boolean;
  probateNotes?: string;
  hasLawsuit?: boolean;
  lawsuitNotes?: string;
  hasAdditionalTaxingEntities?: boolean;
  additionalTaxingNotes?: string;
  vestingDeedNotes?: string;
}

interface TaxLeadDetailsFormProps {
  lead: TaxLead;
  onSave: (updatedLead: TaxLead) => void;
  userRole?: 'admin' | 'editor' | 'viewer';
}

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  url: string;
  category: 'probate' | 'vesting_deed' | 'other';
}

export function TaxLeadDetailsForm({ lead, onSave, userRole = 'editor' }: TaxLeadDetailsFormProps) {
  const [formData, setFormData] = useState<TaxLead>(lead);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const canEdit = userRole === 'admin' || userRole === 'editor';

  const handleInputChange = (field: keyof TaxLead, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStatusChange = (status: 'HOT' | 'WARM' | 'COLD' | 'PASS') => {
    setFormData(prev => ({ ...prev, status }));
    toast({
      title: "Status Updated",
      description: `Lead status changed to ${status}`,
    });
  };

  const handleFileUpload = (uploadedFiles: File[], category: 'probate' | 'vesting_deed' | 'other') => {
    const validTypes = ['application/pdf'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    uploadedFiles.forEach(file => {
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload PDF files only.",
          variant: "destructive",
        });
        return;
      }

      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Please upload files smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }

      const fileUrl = URL.createObjectURL(file);
      const newFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        url: fileUrl,
        category
      };
      
      setFiles(prev => [...prev, newFile]);
    });

    toast({
      title: "Files uploaded",
      description: `${uploadedFiles.length} file(s) added successfully`,
    });
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    toast({
      title: "File removed",
      description: "File has been removed from the lead",
    });
  };

  const handleSave = async () => {
    if (!canEdit) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to edit this lead.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSave(formData);
    
    toast({
      title: "Lead Updated! ✅",
      description: "All changes have been saved successfully.",
    });
    
    setIsSaving(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Lead Information */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <Home className="w-6 h-6 text-crm-primary" />
                Lead Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID</Label>
                <Input
                  id="taxId"
                  value={formData.taxId}
                  onChange={(e) => handleInputChange('taxId', e.target.value)}
                  disabled={!canEdit}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerName">Owner Name</Label>
                <Input
                  id="ownerName"
                  value={formData.ownerName}
                  onChange={(e) => handleInputChange('ownerName', e.target.value)}
                  disabled={!canEdit}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentArrears">Current Arrears ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="currentArrears"
                    type="number"
                    value={formData.currentArrears || ''}
                    onChange={(e) => handleInputChange('currentArrears', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className="pl-10"
                    disabled={!canEdit}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerOfRecord">Owner of Record</Label>
                <Input
                  id="ownerOfRecord"
                  value={formData.ownerOfRecord || ''}
                  onChange={(e) => handleInputChange('ownerOfRecord', e.target.value)}
                  placeholder="Enter owner of record"
                  disabled={!canEdit}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="propertyAddress">Property Address</Label>
                <Input
                  id="propertyAddress"
                  value={formData.propertyAddress}
                  onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
                  placeholder="Enter complete property address"
                  disabled={!canEdit}
                />
              </div>
            </CardContent>
          </Card>

          {/* Conditional Fields */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <FileText className="w-6 h-6 text-crm-primary" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Death Information */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasDeath"
                    checked={formData.hasDeath || false}
                    onCheckedChange={(checked) => handleInputChange('hasDeath', checked)}
                    disabled={!canEdit}
                  />
                  <Label htmlFor="hasDeath" className="font-medium">Is there a death?</Label>
                </div>
                
                {formData.hasDeath && (
                  <div className="ml-6 space-y-2">
                    <Label htmlFor="deathNotes">Death Information Notes</Label>
                    <Textarea
                      id="deathNotes"
                      value={formData.deathNotes || ''}
                      onChange={(e) => handleInputChange('deathNotes', e.target.value)}
                      placeholder="Enter details about the death..."
                      className="min-h-[100px]"
                      disabled={!canEdit}
                    />
                    {formData.deathNotes && (
                      <div className="p-3 bg-gray-50 rounded-lg border">
                        <LinkifiedText text={formData.deathNotes} />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Probate Information */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasProbate"
                    checked={formData.hasProbate || false}
                    onCheckedChange={(checked) => handleInputChange('hasProbate', checked)}
                    disabled={!canEdit}
                  />
                  <Label htmlFor="hasProbate" className="font-medium">Any probate information?</Label>
                </div>
                
                {formData.hasProbate && (
                  <div className="ml-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="probateNotes">Probate Notes</Label>
                      <Textarea
                        id="probateNotes"
                        value={formData.probateNotes || ''}
                        onChange={(e) => handleInputChange('probateNotes', e.target.value)}
                        placeholder="Enter probate information..."
                        className="min-h-[100px]"
                        disabled={!canEdit}
                      />
                    </div>
                    
                    <FileUploadSection
                      title="Probate Documents"
                      category="probate"
                      files={files.filter(f => f.category === 'probate')}
                      onFileUpload={(files) => handleFileUpload(files, 'probate')}
                      onRemoveFile={removeFile}
                      acceptedTypes=".pdf"
                      disabled={!canEdit}
                    />
                  </div>
                )}
              </div>

              {/* Lawsuit Information */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasLawsuit"
                    checked={formData.hasLawsuit || false}
                    onCheckedChange={(checked) => handleInputChange('hasLawsuit', checked)}
                    disabled={!canEdit}
                  />
                  <Label htmlFor="hasLawsuit" className="font-medium">Is there a lawsuit?</Label>
                </div>
                
                {formData.hasLawsuit && (
                  <div className="ml-6 space-y-2">
                    <Label htmlFor="lawsuitNotes">Lawsuit Information</Label>
                    <Textarea
                      id="lawsuitNotes"
                      value={formData.lawsuitNotes || ''}
                      onChange={(e) => handleInputChange('lawsuitNotes', e.target.value)}
                      placeholder="Enter lawsuit details..."
                      className="min-h-[100px]"
                      disabled={!canEdit}
                    />
                  </div>
                )}
              </div>

              {/* Additional Taxing Entities */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasAdditionalTaxingEntities"
                    checked={formData.hasAdditionalTaxingEntities || false}
                    onCheckedChange={(checked) => handleInputChange('hasAdditionalTaxingEntities', checked)}
                    disabled={!canEdit}
                  />
                  <Label htmlFor="hasAdditionalTaxingEntities" className="font-medium">Additional taxing entities?</Label>
                </div>
                
                {formData.hasAdditionalTaxingEntities && (
                  <div className="ml-6 space-y-2">
                    <Label htmlFor="additionalTaxingNotes">Additional Taxing Entities Notes</Label>
                    <Textarea
                      id="additionalTaxingNotes"
                      value={formData.additionalTaxingNotes || ''}
                      onChange={(e) => handleInputChange('additionalTaxingNotes', e.target.value)}
                      placeholder="Enter details about additional taxing entities..."
                      className="min-h-[100px]"
                      disabled={!canEdit}
                    />
                  </div>
                )}
              </div>

              {/* Vesting Deed Upload */}
              <div className="space-y-4">
                <FileUploadSection
                  title="Upload Last Known Vesting Deed"
                  category="vesting_deed"
                  files={files.filter(f => f.category === 'vesting_deed')}
                  onFileUpload={(files) => handleFileUpload(files, 'vesting_deed')}
                  onRemoveFile={removeFile}
                  acceptedTypes=".pdf"
                  disabled={!canEdit}
                />
                
                <div className="space-y-2">
                  <Label htmlFor="vestingDeedNotes">Vesting Deed Notes</Label>
                  <Textarea
                    id="vestingDeedNotes"
                    value={formData.vestingDeedNotes || ''}
                    onChange={(e) => handleInputChange('vestingDeedNotes', e.target.value)}
                    placeholder="Enter notes about the vesting deed..."
                    className="min-h-[80px]"
                    disabled={!canEdit}
                  />
                </div>
              </div>

              {/* Notes with linkified text */}
              <div className="space-y-2">
                <Label htmlFor="notes">General Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Enter any additional notes..."
                  className="min-h-[100px]"
                  disabled={!canEdit}
                />
                {formData.notes && (
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <LinkifiedText text={formData.notes} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Classification Sidebar */}
        <div className="space-y-6">
          <LeadStatusButtons
            currentStatus={formData.status}
            onStatusChange={handleStatusChange}
            disabled={!canEdit}
          />
        </div>
      </div>

      {/* Role-based Save Button */}
      {canEdit && (
        <div className="sticky bottom-6 z-10 flex justify-center">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-crm-primary to-crm-accent hover:from-crm-primary/90 hover:to-crm-accent/90 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105"
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </div>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Lead Details
              </>
            )}
          </Button>
        </div>
      )}

      {!canEdit && (
        <div className="text-center py-4">
          <p className="text-gray-600">You have view-only access to this lead.</p>
        </div>
      )}
    </div>
  );
}


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FileUploadSection } from '../FileUploadSection';
import { LinkifiedText } from '@/components/common/LinkifiedText';
import { TaxLead } from '@/types/taxLead';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  url: string;
  category: 'probate' | 'vesting_deed' | 'other';
}

interface ConditionalFieldsSectionProps {
  formData: TaxLead;
  files: UploadedFile[];
  onInputChange: (field: keyof TaxLead, value: any) => void;
  onFileUpload: (files: File[], category: 'probate' | 'vesting_deed' | 'other') => void;
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
        <CardTitle>Additional Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Death Information */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasDeath"
              checked={formData.hasDeath || false}
              onCheckedChange={(checked) => onInputChange('hasDeath', checked)}
              disabled={!canEdit}
            />
            <Label htmlFor="hasDeath" className="font-medium">Death Information</Label>
          </div>
          
          {formData.hasDeath && (
            <div className="ml-6 space-y-2">
              <Label htmlFor="deathNotes">Death Details</Label>
              <Textarea
                id="deathNotes"
                value={formData.deathNotes || ''}
                onChange={(e) => onInputChange('deathNotes', e.target.value)}
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
              onCheckedChange={(checked) => onInputChange('hasProbate', checked)}
              disabled={!canEdit}
            />
            <Label htmlFor="hasProbate" className="font-medium">Probate Information</Label>
          </div>
          
          {formData.hasProbate && (
            <div className="ml-6 space-y-4">
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
              onCheckedChange={(checked) => onInputChange('hasLawsuit', checked)}
              disabled={!canEdit}
            />
            <Label htmlFor="hasLawsuit" className="font-medium">Lawsuit Details</Label>
          </div>
          
          {formData.hasLawsuit && (
            <div className="ml-6 space-y-2">
              <Label htmlFor="lawsuitNotes">Lawsuit Information</Label>
              <Textarea
                id="lawsuitNotes"
                value={formData.lawsuitNotes || ''}
                onChange={(e) => onInputChange('lawsuitNotes', e.target.value)}
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
              onCheckedChange={(checked) => onInputChange('hasAdditionalTaxingEntities', checked)}
              disabled={!canEdit}
            />
            <Label htmlFor="hasAdditionalTaxingEntities" className="font-medium">Additional Taxing Entities</Label>
          </div>
          
          {formData.hasAdditionalTaxingEntities && (
            <div className="ml-6 space-y-2">
              <Label htmlFor="additionalTaxingNotes">Additional Taxing Entities Notes</Label>
              <Textarea
                id="additionalTaxingNotes"
                value={formData.additionalTaxingNotes || ''}
                onChange={(e) => onInputChange('additionalTaxingNotes', e.target.value)}
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
            title="Vesting Deed Upload"
            category="vesting_deed"
            files={files.filter(f => f.category === 'vesting_deed')}
            onFileUpload={(files) => onFileUpload(files, 'vesting_deed')}
            onRemoveFile={onRemoveFile}
            acceptedTypes=".pdf"
            disabled={!canEdit}
          />
          
          <div className="space-y-2">
            <Label htmlFor="vestingDeedNotes">Vesting Deed Notes</Label>
            <Textarea
              id="vestingDeedNotes"
              value={formData.vestingDeedNotes || ''}
              onChange={(e) => onInputChange('vestingDeedNotes', e.target.value)}
              placeholder="Enter notes about the vesting deed..."
              className="min-h-[80px]"
              disabled={!canEdit}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

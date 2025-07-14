
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FileUploadSection } from '../FileUploadSection';
import { TaxLead } from '@/types/taxLead';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  url: string;
  category: 'probate' | 'vesting_deed' | 'other' | 'death' | 'lawsuit' | 'taxing_entities';
}

interface AdditionalInformationSectionProps {
  formData: TaxLead;
  files: UploadedFile[];
  onInputChange: (field: keyof TaxLead, value: any) => void;
  onFileUpload: (files: File[], category: 'probate' | 'vesting_deed' | 'other' | 'death' | 'lawsuit' | 'taxing_entities') => void;
  onRemoveFile: (fileId: string) => void;
  canEdit: boolean;
}

export function AdditionalInformationSection({ 
  formData, 
  files, 
  onInputChange, 
  onFileUpload, 
  onRemoveFile, 
  canEdit 
}: AdditionalInformationSectionProps) {
  const [deathOpen, setDeathOpen] = React.useState(false);
  const [probateOpen, setProbateOpen] = React.useState(false);
  const [lawsuitOpen, setLawsuitOpen] = React.useState(false);
  const [taxingOpen, setTaxingOpen] = React.useState(false);

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle>Additional Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Death Information */}
        <Collapsible open={deathOpen} onOpenChange={setDeathOpen}>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasDeath"
                checked={formData.hasDeath || false}
                onCheckedChange={(checked) => onInputChange('hasDeath', checked)}
                disabled={!canEdit}
              />
              <CollapsibleTrigger className="flex items-center gap-2 hover:text-primary">
                {deathOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <Label htmlFor="hasDeath" className="font-medium cursor-pointer">Death Information</Label>
              </CollapsibleTrigger>
            </div>
            
            <CollapsibleContent className="space-y-4">
              {formData.hasDeath && (
                <div className="ml-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="deathNotes">Death Details</Label>
                    <Textarea
                      id="deathNotes"
                      value={formData.deathNotes || ''}
                      onChange={(e) => onInputChange('deathNotes', e.target.value)}
                      placeholder="Enter details about the death..."
                      className="min-h-[100px]"
                      disabled={!canEdit}
                    />
                  </div>
                  
                  <FileUploadSection
                    title="Death Information Documents"
                    category="death"
                    files={files.filter(f => f.category === 'death')}
                    onFileUpload={(files) => onFileUpload(files, 'death')}
                    onRemoveFile={onRemoveFile}
                    acceptedTypes=".pdf,.docx,.png,.jpg,.jpeg"
                    disabled={!canEdit}
                  />
                </div>
              )}
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Probate Information */}
        <Collapsible open={probateOpen} onOpenChange={setProbateOpen}>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasProbate"
                checked={formData.hasProbate || false}
                onCheckedChange={(checked) => onInputChange('hasProbate', checked)}
                disabled={!canEdit}
              />
              <CollapsibleTrigger className="flex items-center gap-2 hover:text-primary">
                {probateOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <Label htmlFor="hasProbate" className="font-medium cursor-pointer">Probate Information</Label>
              </CollapsibleTrigger>
            </div>
            
            <CollapsibleContent className="space-y-4">
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
                    acceptedTypes=".pdf,.docx,.png,.jpg,.jpeg"
                    disabled={!canEdit}
                  />
                </div>
              )}
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Lawsuit Details */}
        <Collapsible open={lawsuitOpen} onOpenChange={setLawsuitOpen}>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasLawsuit"
                checked={formData.hasLawsuit || false}
                onCheckedChange={(checked) => onInputChange('hasLawsuit', checked)}
                disabled={!canEdit}
              />
              <CollapsibleTrigger className="flex items-center gap-2 hover:text-primary">
                {lawsuitOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <Label htmlFor="hasLawsuit" className="font-medium cursor-pointer">Lawsuit Details</Label>
              </CollapsibleTrigger>
            </div>
            
            <CollapsibleContent className="space-y-4">
              {formData.hasLawsuit && (
                <div className="ml-6 space-y-4">
                  <div className="space-y-2">
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
                  
                  <FileUploadSection
                    title="Lawsuit Documents"
                    category="lawsuit"
                    files={files.filter(f => f.category === 'lawsuit')}
                    onFileUpload={(files) => onFileUpload(files, 'lawsuit')}
                    onRemoveFile={onRemoveFile}
                    acceptedTypes=".pdf,.docx,.png,.jpg,.jpeg"
                    disabled={!canEdit}
                  />
                </div>
              )}
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Additional Taxing Entities */}
        <Collapsible open={taxingOpen} onOpenChange={setTaxingOpen}>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasAdditionalTaxingEntities"
                checked={formData.hasAdditionalTaxingEntities || false}
                onCheckedChange={(checked) => onInputChange('hasAdditionalTaxingEntities', checked)}
                disabled={!canEdit}
              />
              <CollapsibleTrigger className="flex items-center gap-2 hover:text-primary">
                {taxingOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <Label htmlFor="hasAdditionalTaxingEntities" className="font-medium cursor-pointer">Additional Taxing Entities</Label>
              </CollapsibleTrigger>
            </div>
            
            <CollapsibleContent className="space-y-4">
              {formData.hasAdditionalTaxingEntities && (
                <div className="ml-6 space-y-4">
                  <div className="space-y-2">
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
                  
                  <FileUploadSection
                    title="Additional Taxing Entities Documents"
                    category="taxing_entities"
                    files={files.filter(f => f.category === 'taxing_entities')}
                    onFileUpload={(files) => onFileUpload(files, 'taxing_entities')}
                    onRemoveFile={onRemoveFile}
                    acceptedTypes=".pdf,.docx,.png,.jpg,.jpeg"
                    disabled={!canEdit}
                  />
                </div>
              )}
            </CollapsibleContent>
          </div>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

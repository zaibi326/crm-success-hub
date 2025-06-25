
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FileText, ChevronDown } from 'lucide-react';
import { FileUploadArea } from './FileUploadArea';
import { FilePreview } from './FilePreview';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  url: string;
  preview?: string;
}

interface LegalInfoSectionProps {
  isOpen: boolean;
  onToggle: (open: boolean) => void;
  files: UploadedFile[];
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (fileId: string) => void;
}

export function LegalInfoSection({ isOpen, onToggle, files, onFileUpload, onRemoveFile }: LegalInfoSectionProps) {
  return (
    <Card className="shadow-lg border-0">
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-crm-primary" />
                Legal Information & Documents
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="gdpr-consent" />
                <Label htmlFor="gdpr-consent" className="text-sm">
                  GDPR consent obtained
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="marketing-consent" />
                <Label htmlFor="marketing-consent" className="text-sm">
                  Marketing communications consent
                </Label>
              </div>
            </div>
            
            <FileUploadArea onFileUpload={onFileUpload} />
            <FilePreview files={files} onRemoveFile={onRemoveFile} />
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

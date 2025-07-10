
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSpreadsheet } from 'lucide-react';
import { EnhancedCsvUploader } from './EnhancedCsvUploader';
import { TaxLead } from '@/types/taxLead';

interface UploadTabContentProps {
  onCsvUpload: (uploadedLeads: TaxLead[]) => void;
}

export function UploadTabContent({ onCsvUpload }: UploadTabContentProps) {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-3 text-2xl">
          <FileSpreadsheet className="w-8 h-8 text-crm-primary" />
          Upload Lead Data
        </CardTitle>
        <p className="text-gray-600 mt-2">
          Upload your CSV file containing lead information. The system will automatically map fields and create lead entries.
        </p>
      </CardHeader>
      <CardContent>
        <EnhancedCsvUploader 
          onUploadComplete={onCsvUpload}
          expectedColumns={[
            'Tax ID',
            'Owner Name', 
            'Property Address',
            'Tax Lawsuit Number',
            'Current Arrears',
            'Phone',
            'Email'
          ]}
        />
      </CardContent>
    </Card>
  );
}

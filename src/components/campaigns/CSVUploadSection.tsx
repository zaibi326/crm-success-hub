
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Upload, FileText, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCampaignLeads, CampaignLead } from '@/hooks/useCampaignLeads';

interface CSVUploadSectionProps {
  campaignId: string;
  onUploadComplete?: () => void;
  onSkip?: () => void;
}

interface CSVData {
  headers: string[];
  rows: string[][];
}

const FIELD_MAPPINGS = {
  'Tax ID': 'tax_id',
  'Owner Name': 'owner_name',
  'Property Address': 'property_address',
  'Tax Lawsuit Number': 'tax_lawsuit_number',
  'Current Arrears': 'current_arrears',
  'Phone': 'phone',
  'Email': 'email',
  'Notes': 'notes'
};

export function CSVUploadSection({ campaignId, onUploadComplete, onSkip }: CSVUploadSectionProps) {
  const [csvData, setCsvData] = useState<CSVData | null>(null);
  const [fieldMappings, setFieldMappings] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const { toast } = useToast();
  const { createLeadsFromCSV, uploading } = useCampaignLeads();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        toast({
          title: "Invalid CSV",
          description: "CSV file must have at least a header row and one data row.",
          variant: "destructive"
        });
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const rows = lines.slice(1).map(line => 
        line.split(',').map(cell => cell.trim().replace(/"/g, ''))
      );

      setCsvData({ headers, rows });
      
      // Auto-map fields if possible
      const autoMappings: Record<string, string> = {};
      headers.forEach(header => {
        const normalizedHeader = header.toLowerCase().replace(/[^a-z0-9]/g, '');
        Object.entries(FIELD_MAPPINGS).forEach(([displayName, fieldName]) => {
          const normalizedDisplay = displayName.toLowerCase().replace(/[^a-z0-9]/g, '');
          if (normalizedHeader.includes(normalizedDisplay) || normalizedDisplay.includes(normalizedHeader)) {
            autoMappings[header] = fieldName;
          }
        });
      });
      setFieldMappings(autoMappings);
    };
    
    reader.readAsText(file);
  };

  const handleImportLeads = async () => {
    if (!csvData || !csvData.rows.length) return;

    setIsUploading(true);
    try {
      const leads: CampaignLead[] = csvData.rows.map(row => {
        const lead: any = { campaign_id: campaignId };
        
        csvData.headers.forEach((header, index) => {
          const fieldName = fieldMappings[header];
          if (fieldName && row[index]) {
            if (fieldName === 'current_arrears') {
              const numericValue = parseFloat(row[index].replace(/[^0-9.-]/g, ''));
              if (!isNaN(numericValue)) {
                lead[fieldName] = numericValue;
              }
            } else {
              lead[fieldName] = row[index];
            }
          }
        });

        // Ensure required fields
        if (!lead.owner_name) lead.owner_name = 'Unknown Owner';
        if (!lead.property_address) lead.property_address = 'Unknown Address';

        return lead;
      });

      await createLeadsFromCSV(campaignId, leads);
      setUploadComplete(true);
      
      setTimeout(() => {
        onUploadComplete?.();
      }, 2000);
      
    } catch (error) {
      console.error('Error importing leads:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const headers = Object.keys(FIELD_MAPPINGS);
    const csvContent = headers.join(',') + '\n' + 
      'TAX123,John Doe,"123 Main St, City, State",LAW456,5000.00,555-0123,john@example.com,Sample note';
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'campaign_leads_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (uploadComplete) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Leads Imported Successfully!</h3>
        <p className="text-gray-600 mb-4">Your campaign leads have been imported and are ready for processing.</p>
        <Button onClick={onUploadComplete}>Continue to Campaign</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!csvData ? (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload CSV File</h3>
            <p className="text-gray-600 mb-4">Select a CSV file containing your campaign leads</p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload">
              <Button asChild className="cursor-pointer">
                <span>Choose CSV File</span>
              </Button>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={downloadTemplate} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download Template
            </Button>
            
            {onSkip && (
              <Button variant="ghost" onClick={onSkip}>
                Skip for now
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Map CSV Fields
              </CardTitle>
              <p className="text-sm text-gray-600">
                Map your CSV columns to the appropriate lead fields. Required fields: Owner Name, Property Address.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {csvData.headers.map((header, index) => (
                <div key={index} className="grid grid-cols-2 gap-4 items-center">
                  <div>
                    <Label className="text-sm font-medium">{header}</Label>
                    <p className="text-xs text-gray-500">
                      Sample: {csvData.rows[0]?.[index] || 'No data'}
                    </p>
                  </div>
                  <Select
                    value={fieldMappings[header] || ''}
                    onValueChange={(value) => 
                      setFieldMappings(prev => ({ ...prev, [header]: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select field..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Skip this field</SelectItem>
                      {Object.entries(FIELD_MAPPINGS).map(([displayName, fieldName]) => (
                        <SelectItem key={fieldName} value={fieldName}>
                          {displayName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Preview</h4>
                <p className="text-sm text-blue-700">
                  Ready to import <strong>{csvData.rows.length}</strong> leads from your CSV file.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={handleImportLeads} 
              disabled={isUploading || uploading || !Object.values(fieldMappings).includes('owner_name') || !Object.values(fieldMappings).includes('property_address')}
              className="flex-1"
            >
              {isUploading || uploading ? 'Importing...' : 'Import Leads'}
            </Button>
            <Button variant="outline" onClick={() => setCsvData(null)}>
              Upload Different File
            </Button>
            {onSkip && (
              <Button variant="ghost" onClick={onSkip}>
                Skip
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

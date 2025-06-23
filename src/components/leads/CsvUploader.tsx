
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Cloud, Upload, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

interface CsvUploaderProps {
  onUploadComplete: () => void;
}

const fieldOptions = [
  { value: 'name', label: 'Name' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'company', label: 'Company' },
  { value: 'position', label: 'Position' },
  { value: 'ignore', label: 'Ignore Column' }
];

export function CsvUploader({ onUploadComplete }: CsvUploaderProps) {
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [fieldMapping, setFieldMapping] = useState<Record<number, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csv = e.target?.result as string;
        const rows = csv.split('\n').map(row => row.split(',').map(cell => cell.trim()));
        setCsvData(rows.slice(0, 6)); // Show first 6 rows for preview
        
        // Initialize field mapping
        const initialMapping: Record<number, string> = {};
        rows[0].forEach((_, index) => {
          initialMapping[index] = 'ignore';
        });
        setFieldMapping(initialMapping);
      };
      reader.readAsText(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv']
    },
    multiple: false
  });

  const handleUpload = async () => {
    setIsUploading(true);
    
    // Simulate upload process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Upload Successful",
      description: `Successfully uploaded ${csvData.length - 1} leads for review.`,
    });
    
    setIsUploading(false);
    onUploadComplete();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-crm-primary" />
            CSV Upload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-crm-primary bg-blue-50' : 'border-gray-300 hover:border-crm-primary'
            }`}
          >
            <input {...getInputProps()} />
            <Cloud className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            {isDragActive ? (
              <p className="text-crm-primary">Drop the CSV file here...</p>
            ) : (
              <div>
                <p className="text-gray-600 mb-2">Drag & drop a CSV file here, or click to select</p>
                <p className="text-sm text-gray-500">Supports CSV files up to 10MB</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {csvData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Preview & Field Mapping</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {csvData[0]?.map((header, index) => (
                  <div key={index} className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Column: {header}
                    </label>
                    <Select
                      value={fieldMapping[index] || 'ignore'}
                      onValueChange={(value) => 
                        setFieldMapping(prev => ({ ...prev, [index]: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fieldOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {csvData[0]?.map((header, index) => (
                        <TableHead key={index}>{header}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {csvData.slice(1).map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <TableCell key={cellIndex}>{cell}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="bg-crm-primary hover:bg-crm-primary/90"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Leads
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

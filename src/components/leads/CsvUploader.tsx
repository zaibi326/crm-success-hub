
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Cloud, Upload, CheckCircle, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface CsvUploaderProps {
  onUploadComplete: () => void;
}

const fieldOptions = [
  { value: 'name', label: 'Full Name' },
  { value: 'firstName', label: 'First Name' },
  { value: 'lastName', label: 'Last Name' },
  { value: 'email', label: 'Email Address' },
  { value: 'phone', label: 'Phone Number' },
  { value: 'company', label: 'Company' },
  { value: 'position', label: 'Job Title' },
  { value: 'industry', label: 'Industry' },
  { value: 'website', label: 'Website' },
  { value: 'notes', label: 'Notes' },
  { value: 'ignore', label: 'Ignore Column' }
];

export function CsvUploader({ onUploadComplete }: CsvUploaderProps) {
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [fieldMapping, setFieldMapping] = useState<Record<number, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState<string>('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const csv = e.target?.result as string;
        const rows = csv.split('\n')
          .filter(row => row.trim() !== '')
          .map(row => row.split(',').map(cell => cell.trim().replace(/^"(.*)"$/, '$1')));
        
        setCsvData(rows.slice(0, 11)); // Show header + first 10 rows
        
        // Auto-detect field mapping based on common headers
        const initialMapping: Record<number, string> = {};
        rows[0].forEach((header, index) => {
          const lowerHeader = header.toLowerCase();
          if (lowerHeader.includes('name') && !lowerHeader.includes('company')) {
            initialMapping[index] = lowerHeader.includes('first') ? 'firstName' : 
                                   lowerHeader.includes('last') ? 'lastName' : 'name';
          } else if (lowerHeader.includes('email')) {
            initialMapping[index] = 'email';
          } else if (lowerHeader.includes('phone') || lowerHeader.includes('mobile')) {
            initialMapping[index] = 'phone';
          } else if (lowerHeader.includes('company') || lowerHeader.includes('organization')) {
            initialMapping[index] = 'company';
          } else if (lowerHeader.includes('position') || lowerHeader.includes('title') || lowerHeader.includes('job')) {
            initialMapping[index] = 'position';
          } else if (lowerHeader.includes('industry')) {
            initialMapping[index] = 'industry';
          } else if (lowerHeader.includes('website') || lowerHeader.includes('url')) {
            initialMapping[index] = 'website';
          } else {
            initialMapping[index] = 'ignore';
          }
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
      'application/vnd.ms-excel': ['.csv'],
      'text/plain': ['.csv']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const handleConfirmImport = () => {
    setShowConfirmModal(true);
  };

  const handleUpload = async () => {
    setShowConfirmModal(false);
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate progressive upload
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
    
    // Simulate upload process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    clearInterval(progressInterval);
    setUploadProgress(100);
    setIsUploading(false);
    setShowSuccessModal(true);
    
    toast({
      title: "Upload Successful",
      description: `Successfully processed ${csvData.length - 1} leads from ${fileName}`,
    });
  };

  const resetUploader = () => {
    setCsvData([]);
    setFieldMapping({});
    setFileName('');
    setUploadProgress(0);
    setShowSuccessModal(false);
  };

  const getMappedFieldsCount = () => {
    return Object.values(fieldMapping).filter(value => value !== 'ignore').length;
  };

  const getValidLeadsCount = () => {
    return csvData.length > 1 ? csvData.length - 1 : 0;
  };

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Import Leads from CSV</h2>
          <p className="text-gray-600">Upload your CSV file and map the columns to import leads into your CRM</p>
        </div>

        <Card className="bg-white shadow-lg border-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Cloud className="w-6 h-6 text-blue-600" />
              CSV File Upload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
                isDragActive 
                  ? 'border-blue-500 bg-blue-50 scale-105' 
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <div className="space-y-4">
                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${
                  isDragActive ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Cloud className={`w-10 h-10 transition-colors duration-300 ${
                    isDragActive ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                </div>
                {isDragActive ? (
                  <div>
                    <p className="text-lg font-medium text-blue-600">Drop your CSV file here</p>
                    <p className="text-sm text-blue-500">Release to upload</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      Drag & drop your CSV file here, or click to browse
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      Supports CSV files up to 10MB
                    </p>
                    <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        .csv files only
                      </span>
                      <span>•</span>
                      <span>Max 10MB</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {fileName && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">{fileName}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetUploader}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {csvData.length > 0 && (
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Preview & Field Mapping</CardTitle>
              <p className="text-sm text-gray-600">
                Map your CSV columns to CRM fields. Preview shows first 10 rows.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {csvData[0]?.map((header, index) => (
                  <div key={index} className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">
                      {header}
                    </label>
                    <Select
                      value={fieldMapping[index] || 'ignore'}
                      onValueChange={(value) => 
                        setFieldMapping(prev => ({ ...prev, [index]: value }))
                      }
                    >
                      <SelectTrigger className="w-full">
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

              <div className="border rounded-lg overflow-hidden bg-white">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        {csvData[0]?.map((header, index) => (
                          <TableHead key={index} className="font-semibold text-gray-700">
                            {header}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {csvData.slice(1).map((row, rowIndex) => (
                        <TableRow key={rowIndex} className="hover:bg-gray-50">
                          {row.map((cell, cellIndex) => (
                            <TableCell key={cellIndex} className="text-sm">
                              {cell || '-'}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-900">
                    {getValidLeadsCount()} leads ready to import
                  </p>
                  <p className="text-xs text-blue-700">
                    {getMappedFieldsCount()} fields mapped
                  </p>
                </div>
                <Button 
                  onClick={handleConfirmImport}
                  disabled={getMappedFieldsCount() === 0}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Confirm Import
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Importing Leads...</h3>
                  <span className="text-sm text-gray-600">{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} className="h-3" />
                <p className="text-sm text-gray-600">
                  Processing {getValidLeadsCount()} leads from {fileName}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Confirmation Modal */}
        <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" />
                Confirm Lead Import
              </DialogTitle>
              <DialogDescription className="space-y-2">
                <p>You're about to import <strong>{getValidLeadsCount()} leads</strong> from {fileName}.</p>
                <p>This will add new records to your CRM with {getMappedFieldsCount()} mapped fields.</p>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpload} className="bg-blue-600 hover:bg-blue-700">
                Import Leads
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Success Modal */}
        <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Import Successful!
              </DialogTitle>
              <DialogDescription className="space-y-2">
                <p>Successfully imported <strong>{getValidLeadsCount()} leads</strong> to your CRM.</p>
                <p>You can now review and manage these leads in the Lead Review section.</p>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={resetUploader}>
                Import More
              </Button>
              <Button onClick={() => {
                setShowSuccessModal(false);
                onUploadComplete();
              }} className="bg-green-600 hover:bg-green-700">
                Review Leads
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

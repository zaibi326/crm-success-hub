import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Cloud, Upload, CheckCircle, FileText, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { TaxLead } from '@/types/taxLead';

interface EnhancedCsvUploaderProps {
  onUploadComplete: (uploadedLeads: TaxLead[]) => void;
  expectedColumns?: string[];
}

const fieldOptions = [
  { value: 'taxId', label: 'Tax ID' },
  { value: 'ownerName', label: 'Owner Name' },
  { value: 'propertyAddress', label: 'Property Address' },
  { value: 'taxLawsuitNumber', label: 'Tax Lawsuit Number' },
  { value: 'currentArrears', label: 'Current Arrears' },
  { value: 'phone', label: 'Phone Number' },
  { value: 'email', label: 'Email Address' },
  { value: 'notes', label: 'Notes' },
  { value: 'ignore', label: 'Ignore Column' }
];

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

export function EnhancedCsvUploader({ onUploadComplete, expectedColumns }: EnhancedCsvUploaderProps) {
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [fieldMapping, setFieldMapping] = useState<Record<number, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState<string>('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
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
          if (lowerHeader.includes('tax') && lowerHeader.includes('id')) {
            initialMapping[index] = 'taxId';
          } else if (lowerHeader.includes('owner') || lowerHeader.includes('name')) {
            initialMapping[index] = 'ownerName';
          } else if (lowerHeader.includes('address') || lowerHeader.includes('property')) {
            initialMapping[index] = 'propertyAddress';
          } else if (lowerHeader.includes('lawsuit') || lowerHeader.includes('case')) {
            initialMapping[index] = 'taxLawsuitNumber';
          } else if (lowerHeader.includes('arrears') || lowerHeader.includes('amount') || lowerHeader.includes('debt')) {
            initialMapping[index] = 'currentArrears';
          } else if (lowerHeader.includes('phone') || lowerHeader.includes('mobile')) {
            initialMapping[index] = 'phone';
          } else if (lowerHeader.includes('email')) {
            initialMapping[index] = 'email';
          } else if (lowerHeader.includes('notes') || lowerHeader.includes('comment')) {
            initialMapping[index] = 'notes';
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

  const validateData = (): ValidationError[] => {
    const errors: ValidationError[] = [];
    const requiredFields = ['taxId', 'ownerName', 'propertyAddress'];
    
    // Check if required fields are mapped
    const mappedFields = Object.values(fieldMapping);
    requiredFields.forEach(field => {
      if (!mappedFields.includes(field)) {
        errors.push({
          row: 0,
          field,
          message: `Required field "${field}" is not mapped`
        });
      }
    });

    // Validate data rows
    csvData.slice(1).forEach((row, rowIndex) => {
      Object.entries(fieldMapping).forEach(([colIndex, fieldName]) => {
        const cellValue = row[parseInt(colIndex)] || '';
        
        if (requiredFields.includes(fieldName) && !cellValue.trim()) {
          errors.push({
            row: rowIndex + 2, // +2 because we start from row 1 and skip header
            field: fieldName,
            message: `Required field "${fieldName}" is empty`
          });
        }

        // Validate specific field formats
        if (fieldName === 'currentArrears' && cellValue.trim()) {
          const numValue = parseFloat(cellValue.replace(/[$,]/g, ''));
          if (isNaN(numValue) || numValue < 0) {
            errors.push({
              row: rowIndex + 2,
              field: fieldName,
              message: 'Current Arrears must be a valid positive number'
            });
          }
        }

        if (fieldName === 'email' && cellValue.trim()) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(cellValue)) {
            errors.push({
              row: rowIndex + 2,
              field: fieldName,
              message: 'Invalid email format'
            });
          }
        }
      });
    });

    return errors;
  };

  const handleConfirmImport = () => {
    const errors = validateData();
    setValidationErrors(errors);
    
    if (errors.length === 0) {
      setShowConfirmModal(true);
    } else {
      toast({
        title: "Validation Errors Found",
        description: `Found ${errors.length} validation error(s). Please fix them before importing.`,
        variant: "destructive"
      });
    }
  };

  const convertToTaxLeads = (): TaxLead[] => {
    const leads: TaxLead[] = [];
    
    csvData.slice(1).forEach((row, index) => {
      const lead: Partial<TaxLead> = {
        id: Date.now() + index, // Temporary ID
        status: 'WARM' as const
      };

      Object.entries(fieldMapping).forEach(([colIndex, fieldName]) => {
        const cellValue = row[parseInt(colIndex)]?.trim() || '';
        
        if (fieldName !== 'ignore' && cellValue) {
          switch (fieldName) {
            case 'taxId':
              lead.taxId = cellValue;
              break;
            case 'ownerName':
              lead.ownerName = cellValue;
              break;
            case 'propertyAddress':
              lead.propertyAddress = cellValue;
              break;
            case 'taxLawsuitNumber':
              lead.taxLawsuitNumber = cellValue;
              break;
            case 'currentArrears':
              lead.currentArrears = parseFloat(cellValue.replace(/[$,]/g, '')) || 0;
              break;
            case 'phone':
              lead.phone = cellValue;
              break;
            case 'email':
              lead.email = cellValue;
              break;
            case 'notes':
              lead.notes = cellValue;
              break;
          }
        }
      });

      // Only add if we have required fields
      if (lead.taxId && lead.ownerName && lead.propertyAddress) {
        leads.push(lead as TaxLead);
      }
    });

    return leads;
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
    
    // Convert CSV data to TaxLead objects
    const taxLeads = convertToTaxLeads();
    
    toast({
      title: "Upload Successful",
      description: `Successfully processed ${taxLeads.length} leads from ${fileName}`,
    });
  };

  const resetUploader = () => {
    setCsvData([]);
    setFieldMapping({});
    setFileName('');
    setUploadProgress(0);
    setShowSuccessModal(false);
    setValidationErrors([]);
  };

  const getMappedFieldsCount = () => {
    return Object.values(fieldMapping).filter(value => value !== 'ignore').length;
  };

  const getValidLeadsCount = () => {
    return csvData.length > 1 ? csvData.length - 1 : 0;
  };

  const getRequiredFieldsCount = () => {
    const requiredFields = ['taxId', 'ownerName', 'propertyAddress'];
    const mappedFields = Object.values(fieldMapping);
    return requiredFields.filter(field => mappedFields.includes(field)).length;
  };

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Import Leads from CSV</h2>
          <p className="text-gray-600">Upload your CSV file and map the columns to import tax lien leads into your system</p>
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
          <>
            <Card className="bg-white shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Field Mapping & Preview</CardTitle>
                <p className="text-sm text-gray-600">
                  Map your CSV columns to system fields. Required fields: Tax ID, Owner Name, Property Address
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

                {/* Validation Errors */}
                {validationErrors.length > 0 && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      <div className="font-semibold mb-2">Validation Errors ({validationErrors.length}):</div>
                      <ul className="space-y-1 text-sm">
                        {validationErrors.slice(0, 5).map((error, index) => (
                          <li key={index}>
                            Row {error.row}: {error.message}
                          </li>
                        ))}
                        {validationErrors.length > 5 && (
                          <li className="font-medium">...and {validationErrors.length - 5} more errors</li>
                        )}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="border rounded-lg overflow-hidden bg-white">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          {csvData[0]?.map((header, index) => (
                            <TableHead key={index} className="font-semibold text-gray-700">
                              <div>
                                <div>{header}</div>
                                <div className="text-xs text-blue-600 mt-1">
                                  → {fieldOptions.find(opt => opt.value === fieldMapping[index])?.label || 'Ignore'}
                                </div>
                              </div>
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
                      {getRequiredFieldsCount()}/3 required fields mapped • {getMappedFieldsCount()} total fields mapped
                    </p>
                  </div>
                  <Button 
                    onClick={handleConfirmImport}
                    disabled={getRequiredFieldsCount() < 3}
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Validate & Import
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
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
                <p>This will create new lead records with {getMappedFieldsCount()} mapped fields.</p>
                <div className="text-sm bg-gray-50 p-3 rounded mt-3">
                  <div className="font-medium mb-1">Mapped Fields:</div>
                  <ul className="text-xs space-y-1">
                    {Object.values(fieldMapping).filter(field => field !== 'ignore').map((field, index) => (
                      <li key={index}>• {fieldOptions.find(opt => opt.value === field)?.label}</li>
                    ))}
                  </ul>
                </div>
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
                <p>Successfully imported <strong>{getValidLeadsCount()} leads</strong> to your system.</p>
                <p>You can now review and process these leads in the Lead Review section.</p>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={resetUploader}>
                Import More
              </Button>
              <Button onClick={() => {
                const taxLeads = convertToTaxLeads();
                setShowSuccessModal(false);
                onUploadComplete(taxLeads);
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

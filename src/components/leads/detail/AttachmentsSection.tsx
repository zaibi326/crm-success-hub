
import React, { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Paperclip, 
  Upload, 
  File, 
  Image, 
  FileText,
  Download,
  Trash2,
  Plus,
  FolderOpen,
  Link,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { AttachmentsSectionProps } from './attachments/types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';

export function AttachmentsSection({ 
  files = [], 
  onRemoveFile, 
  onFileUpload,
  canEdit,
  title = "Attachments",
  description
}: AttachmentsSectionProps & { title?: string; description?: string }) {
  const [isOpen, setIsOpen] = useState(true);
  const [pdfUrl, setPdfUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length > 0 && onFileUpload) {
      onFileUpload(selectedFiles, 'other');
      toast.success(`${selectedFiles.length} file(s) uploaded successfully`);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddPdfLink = () => {
    if (!pdfUrl.trim()) {
      toast.error('Please enter a valid PDF URL');
      return;
    }

    if (!pdfUrl.includes('http')) {
      toast.error('Please enter a valid URL starting with http:// or https://');
      return;
    }

    // Create a mock file object for the PDF link
    const fileName = pdfUrl.split('/').pop() || 'document.pdf';
    const mockFile = Object.create(File.prototype, {
      name: { value: fileName, writable: false },
      type: { value: 'application/pdf', writable: false },
      size: { value: 0, writable: false },
      lastModified: { value: Date.now(), writable: false },
      webkitRelativePath: { value: pdfUrl, writable: false }
    }) as File;
    
    if (onFileUpload) {
      onFileUpload([mockFile], 'other');
    }
    
    setPdfUrl('');
    toast.success('PDF link added successfully');
  };

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return <Image className="w-4 h-4 text-green-600" />;
    if (type.includes('pdf') || type.includes('doc')) return <FileText className="w-4 h-4 text-red-600" />;
    return <File className="w-4 h-4 text-gray-600" />;
  };

  const formatFileSize = (bytes: number | undefined) => {
    if (!bytes || bytes === 0) return 'N/A';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="bg-white shadow-sm border border-gray-200 rounded-lg">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors rounded-t-lg pb-4">
            <CardTitle className="flex items-center justify-between text-lg font-semibold text-gray-900">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Paperclip className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <span>{title}</span>
                  {description && (
                    <p className="text-sm text-gray-500 font-normal mt-1">{description}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-sm bg-gray-50 text-gray-700 border-gray-300">
                  {files.length} files
                </Badge>
                {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
              </div>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="p-6 pt-0 space-y-6">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.gif,.bmp,.webp"
            />

            {canEdit && (
              <div className="space-y-6">
                {/* Add PDF Link Section */}
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Link className="w-4 h-4 text-green-600" />
                    Add PDF Link
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="pdfUrl" className="text-sm text-gray-700">PDF URL</Label>
                      <Input
                        id="pdfUrl"
                        type="url"
                        value={pdfUrl}
                        onChange={(e) => setPdfUrl(e.target.value)}
                        placeholder="https://example.com/document.pdf"
                        className="w-full border-gray-300 focus:border-green-500 focus:ring-green-500 bg-white"
                      />
                    </div>
                    
                    <Button
                      onClick={handleAddPdfLink}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      disabled={!pdfUrl.trim()}
                      size="sm"
                    >
                      <Link className="w-4 h-4 mr-2" />
                      Add PDF Link
                    </Button>
                  </div>
                </div>

                {/* Upload Files Section */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-blue-600" />
                    Upload Files
                  </h4>
                  
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer bg-white"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <div className="text-sm text-gray-600 mb-2">
                      <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                    </div>
                    <div className="text-xs text-gray-500">
                      PDF, JPG, PNG, DOC (max 10MB each)
                    </div>
                  </div>

                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="w-full mt-3 border-blue-300 text-blue-700 hover:bg-blue-50"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Select Files
                  </Button>
                </div>
              </div>
            )}

            {/* Files List */}
            <div className="space-y-4">
              {files.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h4 className="text-sm font-medium text-gray-900 mb-2">No files attached</h4>
                  <p className="text-sm text-gray-500 mb-4">
                    Upload documents or add PDF links to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900">
                      Attached Files ({files.length})
                    </h4>
                  </div>
                  
                  <div className="space-y-2">
                    {files.map((file) => (
                      <div 
                        key={file.id} 
                        className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {getFileIcon(file.type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(file.url, '_blank')}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1 h-8 w-8"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          
                          {canEdit && onRemoveFile && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onRemoveFile(file.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 h-8 w-8"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

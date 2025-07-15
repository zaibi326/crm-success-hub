
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
  Eye,
  Plus,
  FolderOpen,
  Link,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import { AttachmentsSectionProps } from './attachments/types';
import { FilesList } from './attachments/FilesList';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';

export function AttachmentsSection({ 
  files = [], 
  onRemoveFile, 
  onFileUpload,
  canEdit 
}: AttachmentsSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [pdfUrl, setPdfUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length > 0 && onFileUpload) {
      onFileUpload(selectedFiles, 'other');
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
    const mockFile = new File([], fileName, {
      type: 'application/pdf'
    });
    
    if (onFileUpload) {
      onFileUpload([mockFile], 'other');
    }
    
    setPdfUrl('');
    toast.success('PDF link added successfully');
  };

  const getFileTypeStats = () => {
    const stats = {
      total: files.length,
      documents: files.filter(f => f.type.includes('pdf') || f.type.includes('doc')).length,
      images: files.filter(f => f.type.includes('image')).length,
      other: files.filter(f => !f.type.includes('pdf') && !f.type.includes('doc') && !f.type.includes('image')).length
    };
    return stats;
  };

  const stats = getFileTypeStats();

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
                Attachments
              </div>
              
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-sm bg-gray-50 text-gray-700 border-gray-300">
                  {stats.total} files
                </Badge>
                {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
              </div>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="p-6 pt-0">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.gif,.bmp,.webp"
            />

            {/* File Statistics */}
            {stats.total > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
                  <FileText className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                  <div className="text-lg font-semibold text-blue-900">{stats.documents}</div>
                  <div className="text-xs text-blue-700">Documents</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center border border-green-200">
                  <Image className="w-5 h-5 text-green-600 mx-auto mb-2" />
                  <div className="text-lg font-semibold text-green-900">{stats.images}</div>
                  <div className="text-xs text-green-700">Images</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-3 text-center border border-orange-200">
                  <File className="w-5 h-5 text-orange-600 mx-auto mb-2" />
                  <div className="text-lg font-semibold text-orange-900">{stats.other}</div>
                  <div className="text-xs text-orange-700">Other</div>
                </div>
              </div>
            )}

            {/* Upload and PDF Link Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              {/* Upload Files Panel */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-gray-600" />
                  Upload Files
                </h3>
                
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer"
                  onClick={() => canEdit && fileInputRef.current?.click()}
                >
                  <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-600 mb-1">
                    <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                  </div>
                  <div className="text-xs text-gray-500">
                    PDF, JPG, PNG, DOC (max 10MB each)
                  </div>
                </div>

                {canEdit && (
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Select Files
                  </Button>
                )}
              </div>

              {/* Add PDF Link Panel */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <Link className="w-4 h-4 text-gray-600" />
                  Add PDF Link
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="pdfUrl" className="text-sm text-gray-700">PDF URL</Label>
                    <Input
                      id="pdfUrl"
                      type="url"
                      value={pdfUrl}
                      onChange={(e) => setPdfUrl(e.target.value)}
                      placeholder="https://example.com/document.pdf"
                      className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      disabled={!canEdit}
                    />
                  </div>
                  
                  {canEdit && (
                    <Button
                      onClick={handleAddPdfLink}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      disabled={!pdfUrl.trim()}
                      size="sm"
                    >
                      <Link className="w-4 h-4 mr-2" />
                      Add PDF Link
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Files List */}
            <div className="space-y-4">
              {files.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <FolderOpen className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <h4 className="text-sm font-medium text-gray-900 mb-2">No files attached</h4>
                  <p className="text-sm text-gray-500 mb-4">
                    Upload documents or add PDF links to get started
                  </p>
                  {canEdit && (
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="border-blue-300 text-blue-700 hover:bg-blue-50"
                      size="sm"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Your First File
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">Attached Files ({files.length})</h4>
                    {files.length > 1 && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs border-gray-300 text-gray-700 hover:bg-gray-50"
                        onClick={() => console.log('Download all files')}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download All
                      </Button>
                    )}
                  </div>
                  <FilesList files={files} onRemoveFile={onRemoveFile} canEdit={canEdit} />
                </div>
              )}
            </div>

            {/* Quick Actions */}
            {canEdit && files.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50"
                    size="sm"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload More
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    onClick={() => console.log('Preview files')}
                    size="sm"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

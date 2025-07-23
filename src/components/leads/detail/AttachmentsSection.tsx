
import React, { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Paperclip, Upload, File, Image, FileText, Download, Trash2, Plus, FolderOpen, Link, ChevronDown, ChevronUp, Save } from 'lucide-react';
import { AttachmentsSectionProps } from './attachments/types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';

export function AttachmentsSection({
  files = [],
  onRemoveFile,
  onFileUpload,
  canEdit,
  title = "Attachments",
  description
}: AttachmentsSectionProps & {
  title?: string;
  description?: string;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [pdfUrl, setPdfUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length > 0 && onFileUpload) {
      onFileUpload(selectedFiles, 'other');
      toast({
        title: "Success",
        description: `${selectedFiles.length} file(s) uploaded successfully`
      });
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddPdfLink = () => {
    if (!pdfUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid PDF URL",
        variant: "destructive"
      });
      return;
    }

    if (!pdfUrl.includes('http')) {
      toast({
        title: "Error",
        description: "Please enter a valid URL starting with http:// or https://",
        variant: "destructive"
      });
      return;
    }

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
      setPdfUrl('');
      toast({
        title: "Success",
        description: "PDF link added successfully"
      });
    }
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
      <Card className="shadow-lg border-0">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Paperclip className="w-5 h-5 text-purple-500" />
                {title}
                <Badge variant="secondary" className="ml-2">
                  {files.length} files
                </Badge>
              </div>
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </CardTitle>
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            {/* PDF Link Input */}
            {canEdit && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Link className="w-4 h-4" />
                  Add PDF Link
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="url"
                    placeholder="https://example.com/document.pdf"
                    value={pdfUrl}
                    onChange={(e) => setPdfUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    onClick={handleAddPdfLink}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Link
                  </Button>
                </div>
              </div>
            )}

            {/* File Upload */}
            {canEdit && (
              <div className="mb-4">
                <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Upload className="w-4 h-4" />
                  Upload Files
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, JPG, PNG, DOC (max 10MB each)
                    </p>
                  </label>
                </div>
                <div className="mt-2 text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Select Files
                  </Button>
                </div>
              </div>
            )}

            {/* Files List */}
            {files.length === 0 ? (
              <div className="text-center py-8">
                <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No files attached</p>
                {canEdit && (
                  <p className="text-gray-400 text-xs mt-1">
                    Click the Upload Files button or add a PDF link
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors group"
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
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(file.url, '_blank')}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      {canEdit && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onRemoveFile(file.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

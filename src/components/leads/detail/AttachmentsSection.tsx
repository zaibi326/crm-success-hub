
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
import { FilesList } from './attachments/FilesList';
import { PdfLinkInput } from './attachments/PdfLinkInput';

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
              <div className="flex items-center gap-2">
                <Paperclip className="w-5 h-5 text-crm-primary" />
                {title}
                {files.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {files.length}
                  </Badge>
                )}
              </div>
              {isOpen ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </CardTitle>
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {/* PDF Link Input */}
              {canEdit && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                  <Label htmlFor="pdf-link" className="text-sm font-medium text-gray-700 mb-2 block">
                    Add PDF Link
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="pdf-link"
                      type="url"
                      placeholder="https://example.com/document.pdf"
                      value={pdfUrl}
                      onChange={(e) => setPdfUrl(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      onClick={handleAddPdfLink}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Link className="w-4 h-4" />
                      Add Link
                    </Button>
                  </div>
                </div>
              )}

              {/* File Upload Area */}
              {canEdit && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-crm-primary transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-1">
                      Click to upload files or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, DOCX, JPG, PNG up to 10MB each
                    </p>
                  </label>
                </div>
              )}

              {/* Files List */}
              <FilesList
                files={files}
                onRemoveFile={onRemoveFile}
                canEdit={canEdit}
              />
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

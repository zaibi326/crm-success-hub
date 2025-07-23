
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
  title = "Lead Documents",
  description = "Attach multiple PDF/image files (e.g., title deeds, legal docs, correspondence)"
}: AttachmentsSectionProps & {
  title?: string;
  description?: string;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [pdfUrl, setPdfUrl] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length > 0 && onFileUpload) {
      onFileUpload(selectedFiles, 'other');
      toast({
        title: "Files Added",
        description: `${selectedFiles.length} file(s) added. Click "Save Changes" to persist.`
      });
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0 && onFileUpload) {
      onFileUpload(droppedFiles, 'other');
      toast({
        title: "Files Added",
        description: `${droppedFiles.length} file(s) added. Click "Save Changes" to persist.`
      });
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
        title: "PDF Link Added",
        description: "PDF link added. Click \"Save Changes\" to persist."
      });
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="shadow-lg border-0">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-crm-primary" />
                {title}
                <Badge variant="secondary" className="ml-2">
                  {files.length}
                </Badge>
              </div>
              {isOpen ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </CardTitle>
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-6">
            {canEdit && (
              <>
                {/* PDF Link Input */}
                <div className="p-4 bg-blue-50 rounded-lg border-2 border-dashed border-blue-200">
                  <Label className="text-sm font-medium text-blue-700 mb-2 block">
                    Add PDF Link
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="url"
                      value={pdfUrl}
                      onChange={(e) => setPdfUrl(e.target.value)}
                      placeholder="https://example.com/document.pdf"
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

                {/* File Upload Area */}
                <div
                  className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    isDragOver 
                      ? 'border-crm-primary bg-crm-primary/5' 
                      : 'border-gray-300 hover:border-crm-primary'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
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
                    <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      Drop files here or click to upload
                    </p>
                    <p className="text-sm text-gray-500">
                      PDF, DOC, DOCX, JPG, PNG, GIF up to 10MB each
                    </p>
                  </label>
                  
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Plus className="w-4 h-4" />
                      Add Attachment
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Files List */}
            <FilesList
              files={files}
              onRemoveFile={onRemoveFile}
              canEdit={canEdit}
            />

            {/* Save Reminder */}
            {canEdit && files.length > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-2 text-amber-700">
                  <Save className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Remember to click "Save Changes" to persist your attachments
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

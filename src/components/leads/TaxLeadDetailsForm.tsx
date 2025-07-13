
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { TaxLead } from '@/types/taxLead';
import { MainContent } from './detail/MainContent';
import { Sidebar } from './detail/Sidebar';
import { SaveButton } from './detail/SaveButton';
import { ViewOnlyMessage } from './detail/ViewOnlyMessage';

interface TaxLeadDetailsFormProps {
  lead: TaxLead;
  onSave: (updatedLead: TaxLead) => void;
  userRole?: 'admin' | 'editor' | 'viewer';
}

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  url: string;
  category: 'probate' | 'vesting_deed' | 'other';
}

interface NoteEntry {
  id: string;
  text: string;
  timestamp: Date;
  userName: string;
}

export function TaxLeadDetailsForm({ lead, onSave, userRole = 'editor' }: TaxLeadDetailsFormProps) {
  const [formData, setFormData] = useState<TaxLead>({
    ...lead,
    firstName: lead.firstName || lead.ownerName?.split(' ')[0] || '',
    lastName: lead.lastName || lead.ownerName?.split(' ').slice(1).join(' ') || '',
    temperature: lead.temperature || 'WARM',
    occupancyStatus: lead.occupancyStatus || 'OWNER_OCCUPIED'
  });
  
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [disposition, setDisposition] = useState<'keep' | 'pass' | null>(null);
  const [passReason, setPassReason] = useState('');
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes setNotes] = useState<NoteEntry[]>([
    {
      id: '1',
      text: 'Initial lead imported from campaign',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      userName: 'System'
    }
  ]);
  const { toast } = useToast();
  const { canManageUsers, userRole: currentUserRole } = useRoleAccess();

  const canEdit = userRole === 'admin' || userRole === 'editor';
  const canViewSensitive = canManageUsers || userRole === 'admin';

  const handleInputChange = (field: keyof TaxLead, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStatusChange = (status: 'HOT' | 'WARM' | 'COLD' | 'PASS') => {
    setFormData(prev => ({ 
      ...prev, 
      status,
      temperature: status as 'HOT' | 'WARM' | 'COLD'
    }));
    if (status === 'PASS') {
      setDisposition('pass');
    }
    toast({
      title: "Status Updated",
      description: `Lead status changed to ${status}`,
    });
  };

  const handleDisposition = (disp: 'keep' | 'pass') => {
    setDisposition(disp);
    if (disp === 'pass') {
      setFormData(prev => ({ ...prev, status: 'PASS' }));
    }
    toast({
      title: "Disposition Set",
      description: `Lead marked as ${disp}`,
    });
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    const note: NoteEntry = {
      id: Date.now().toString(),
      text: newNote,
      timestamp: new Date(),
      userName: 'Current User'
    };
    
    setNotes(prev => [note, ...prev]);
    setNewNote('');
    
    toast({
      title: "Note Added",
      description: "Your note has been saved",
    });
  };

  const handleFileUpload = (uploadedFiles: File[], category: 'probate' | 'vesting_deed' | 'other') => {
    const validTypes = ['application/pdf'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    uploadedFiles.forEach(file => {
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload PDF files only.",
          variant: "destructive",
        });
        return;
      }

      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Please upload files smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }

      const fileUrl = URL.createObjectURL(file);
      const newFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        url: fileUrl,
        category
      };
      
      setFiles(prev => [...prev, newFile]);
    });

    toast({
      title: "Files uploaded",
      description: `${uploadedFiles.length} file(s) added successfully`,
    });
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    toast({
      title: "File removed",
      description: "File has been removed from the lead",
    });
  };

  const handleSave = async () => {
    if (!canEdit) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to edit this lead.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSave(formData);
    
    toast({
      title: "Lead Updated! ✅",
      description: "All changes have been saved successfully.",
    });
    
    setIsSaving(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <MainContent
          formData={formData}
          disposition={disposition}
          passReason={passReason}
          notes={notes}
          newNote={newNote}
          files={files}
          canEdit={canEdit}
          onInputChange={handleInputChange}
          onDisposition={handleDisposition}
          onPassReasonChange={setPassReason}
          onNewNoteChange={setNewNote}
          onAddNote={handleAddNote}
          onFileUpload={handleFileUpload}
          onRemoveFile={removeFile}
        />

        <Sidebar
          currentStatus={formData.status}
          files={files}
          canEdit={canEdit}
          onStatusChange={handleStatusChange}
          onRemoveFile={removeFile}
        />
      </div>

      <SaveButton
        onSave={handleSave}
        isSaving={isSaving}
        canEdit={canEdit}
        disposition={disposition}
      />

      <ViewOnlyMessage canEdit={canEdit} />
    </div>
  );
}

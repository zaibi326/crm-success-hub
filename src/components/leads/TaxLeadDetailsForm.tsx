
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { TaxLead } from '@/types/taxLead';
import { MainContent } from './detail/MainContent';
import { Sidebar } from './detail/Sidebar';
import { ViewOnlyMessage } from './detail/ViewOnlyMessage';
import { useAuth } from '@/contexts/AuthContext';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  url: string;
  category: 'probate' | 'vesting_deed' | 'other' | 'death' | 'lawsuit' | 'taxing_entities';
}

interface NoteEntry {
  id: string;
  text: string;
  timestamp: Date;
  userName: string;
}

interface TaxLeadDetailsFormProps {
  lead: TaxLead;
  onSave: (updatedLead: TaxLead) => void;
  userRole: 'admin' | 'editor' | 'viewer';
}

export function TaxLeadDetailsForm({ lead, onSave, userRole }: TaxLeadDetailsFormProps) {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<TaxLead>(lead);
  const [disposition, setDisposition] = useState<'keep' | 'pass' | null>(null);
  const [passReason, setPassReason] = useState('');
  const [notes, setNotes] = useState<NoteEntry[]>([]);
  const [newNote, setNewNote] = useState('');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [loading, setLoading] = useState(false);

  // User role and permissions
  const canEdit = ['admin', 'editor'].includes(userRole);

  useEffect(() => {
    setFormData(lead);
  }, [lead]);

  const handleInputChange = (field: keyof TaxLead, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleDisposition = (disp: 'keep' | 'pass') => {
    setDisposition(disp);
    setHasUnsavedChanges(true);
  };

  const handlePassReasonChange = (reason: string) => {
    setPassReason(reason);
    setHasUnsavedChanges(true);
  };

  const handleNewNoteChange = (note: string) => {
    setNewNote(note);
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note: NoteEntry = {
        id: Date.now().toString(),
        text: newNote.trim(),
        timestamp: new Date(),
        userName: user?.email ? `${user.email}` : 'Current User'
      };
      setNotes(prev => [note, ...prev]);
      setNewNote('');
      setHasUnsavedChanges(true);
    }
  };

  const handleFileUpload = (newFiles: File[], category: 'probate' | 'vesting_deed' | 'other' | 'death' | 'lawsuit' | 'taxing_entities') => {
    const uploadedFiles: UploadedFile[] = newFiles.map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
      category
    }));
    
    setFiles(prev => [...prev, ...uploadedFiles]);
    setHasUnsavedChanges(true);
  };

  const handleRemoveFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Save logic here - API call to update lead
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
      
      onSave(formData);
      toast.success('Lead details saved successfully');
      setHasUnsavedChanges(false);
    } catch (error) {
      toast.error('Failed to save lead details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/80 to-purple-50/60">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Lead Details
            </h1>
            <p className="text-sm text-gray-600">
              {formData.ownerName} - {formData.propertyAddress}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {!canEdit && (
              <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1 rounded-lg">
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">View Only</span>
              </div>
            )}
            
            {canEdit && hasUnsavedChanges && (
              <Button
                onClick={handleSave}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            )}
          </div>
        </div>

        <ViewOnlyMessage canEdit={canEdit} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
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
              onPassReasonChange={handlePassReasonChange}
              onNewNoteChange={handleNewNoteChange}
              onAddNote={handleAddNote}
              onFileUpload={handleFileUpload}
              onRemoveFile={handleRemoveFile}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar
              currentStatus={formData.status}
              files={files}
              canEdit={canEdit}
              onStatusChange={(status) => handleInputChange('status', status)}
              onRemoveFile={handleRemoveFile}
              onFileUpload={handleFileUpload}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

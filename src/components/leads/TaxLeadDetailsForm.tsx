import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LeadStatusButtons } from './LeadStatusButtons';
import { OwnershipBreakdownChart } from './OwnershipBreakdownChart';
import { LeadActivityTimeline } from './LeadActivityTimeline';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { ImportedDataSection } from './detail/ImportedDataSection';
import { DispositionSection, PassReasonSection } from './detail/DispositionSection';
import { NotesSection } from './detail/NotesSection';
import { EditableFieldsSection } from './detail/EditableFieldsSection';
import { ConditionalFieldsSection } from './detail/ConditionalFieldsSection';
import { AttachmentsSection } from './detail/AttachmentsSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TaxLead {
  id: number;
  taxId: string;
  ownerName: string;
  propertyAddress: string;
  taxLawsuitNumber?: string;
  currentArrears?: number;
  status: 'HOT' | 'WARM' | 'COLD' | 'PASS';
  notes?: string;
  phone?: string;
  email?: string;
  ownerOfRecord?: string;
  hasDeath?: boolean;
  deathNotes?: string;
  hasProbate?: boolean;
  probateNotes?: string;
  hasLawsuit?: boolean;
  lawsuitNotes?: string;
  hasAdditionalTaxingEntities?: boolean;
  additionalTaxingNotes?: string;
  vestingDeedNotes?: string;
  firstName: string;
  lastName: string;
  temperature: 'HOT' | 'WARM' | 'COLD';
  occupancyStatus: 'OWNER_OCCUPIED' | 'TENANT_OCCUPIED' | 'VACANT';
  leadSource?: string;
  agentName?: string;
  askingPrice?: number;
  mortgagePrice?: number;
  campaignId?: string;
  createdAt?: string;
  updatedAt?: string;
  attachedFiles?: File[];
}

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
  const [notes, setNotes] = useState<NoteEntry[]>([
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
        {/* Main Content - 3 columns */}
        <div className="lg:col-span-3 space-y-6">
          <ImportedDataSection lead={formData} />

          <DispositionSection
            disposition={disposition}
            passReason={passReason}
            onDisposition={handleDisposition}
            onPassReasonChange={setPassReason}
            canEdit={canEdit}
          />

          {disposition === 'pass' && (
            <PassReasonSection
              passReason={passReason}
              onPassReasonChange={setPassReason}
              canEdit={canEdit}
            />
          )}

          <NotesSection
            notes={notes}
            newNote={newNote}
            onNewNoteChange={setNewNote}
            onAddNote={handleAddNote}
            canEdit={canEdit}
          />

          {disposition === 'keep' && (
            <>
              <EditableFieldsSection
                formData={formData}
                onInputChange={handleInputChange}
                canEdit={canEdit}
              />

              <ConditionalFieldsSection
                formData={formData}
                files={files}
                onInputChange={handleInputChange}
                onFileUpload={handleFileUpload}
                onRemoveFile={removeFile}
                canEdit={canEdit}
              />

              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-crm-primary" />
                    Ownership Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <OwnershipBreakdownChart onSave={(heirs) => console.log('Heirs saved:', heirs)} />
                </CardContent>
              </Card>
            </>
          )}

          <LeadActivityTimeline leadId={lead.id} />
        </div>

        {/* Status Classification Sidebar - 1 column */}
        <div className="space-y-6">
          <LeadStatusButtons
            currentStatus={formData.status}
            onStatusChange={handleStatusChange}
            disabled={!canEdit}
          />

          <AttachmentsSection
            files={files}
            onRemoveFile={removeFile}
            canEdit={canEdit}
          />
        </div>
      </div>

      {/* Save Button */}
      {canEdit && disposition && (
        <div className="sticky bottom-6 z-10 flex justify-center">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-crm-primary to-crm-accent hover:from-crm-primary/90 hover:to-crm-accent/90 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105"
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </div>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Lead Details
              </>
            )}
          </Button>
        </div>
      )}

      {!canEdit && (
        <div className="text-center py-4">
          <p className="text-gray-600">You have view-only access to this lead.</p>
        </div>
      )}
    </div>
  );
}

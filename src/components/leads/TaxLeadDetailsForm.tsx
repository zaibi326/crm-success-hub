
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { TaxLead } from '@/types/taxLead';
import { MainContent } from './detail/MainContent';
import { Sidebar } from './detail/Sidebar';
import { SaveButton } from './detail/SaveButton';
import { ViewOnlyMessage } from './detail/ViewOnlyMessage';
import { PropertyMapSection } from './detail/PropertyMapSection';
import { EditableLeadInfoSection } from './detail/EditableLeadInfoSection';
import { ContactSection } from './detail/ContactSection';
import { CallStatusPanel } from '@/components/communication/CallStatusPanel';
import { SMSPanel } from '@/components/communication/SMSPanel';
import { CommunicationSidebar } from '@/components/communication/CommunicationSidebar';
import { LeadActivityTimeline } from './LeadActivityTimeline';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Activity } from 'lucide-react';

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
  category: 'probate' | 'vesting_deed' | 'other' | 'death' | 'lawsuit' | 'taxing_entities';
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
  const [callStatus, setCallStatus] = useState({ isActive: false, phoneNumber: '', leadName: '' });
  const [smsPanel, setSmsPanel] = useState({ isOpen: false, phoneNumber: '', leadName: '' });
  const [commSidebar, setCommSidebar] = useState(false);

  const canEdit = userRole === 'admin' || userRole === 'editor';
  const canViewSensitive = canManageUsers || userRole === 'admin';

  const handleInputChange = (field: keyof TaxLead, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLeadUpdate = (field: keyof TaxLead, value: string) => {
    const updatedLead = { ...formData, [field]: value };
    setFormData(updatedLead);
    onSave(updatedLead);
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

  const handleFileUpload = (uploadedFiles: File[], category: 'probate' | 'vesting_deed' | 'other' | 'death' | 'lawsuit' | 'taxing_entities') => {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    uploadedFiles.forEach(file => {
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload PDF, DOCX, JPG, or PNG files only.",
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

  const handleCall = (phoneNumber: string) => {
    setCallStatus({
      isActive: true,
      phoneNumber,
      leadName: formData.ownerName
    });
    
    // Add call activity to timeline
    const callActivity = {
      id: Date.now().toString(),
      text: `Call initiated to ${phoneNumber}`,
      timestamp: new Date(),
      userName: 'Current User'
    };
    setNotes(prev => [callActivity, ...prev]);
  };

  const handleSendText = (phoneNumber: string) => {
    setSmsPanel({
      isOpen: true,
      phoneNumber,
      leadName: formData.ownerName
    });
  };

  const handleEmail = (email: string) => {
    window.open(`mailto:${email}`, '_self');
  };

  const handleEndCall = () => {
    setCallStatus({ isActive: false, phoneNumber: '', leadName: '' });
  };

  const handleCloseSMS = () => {
    setSmsPanel({ isOpen: false, phoneNumber: '', leadName: '' });
  };

  return (
    <>
      <div className="max-w-7xl mx-auto p-6">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Main Content with Tabs */}
          <div className="xl:col-span-2 space-y-6">
            {/* Contact Section with Communication Buttons */}
            <ContactSection
              lead={formData}
              onCall={handleCall}
              onSendText={handleSendText}
              onEmail={handleEmail}
              onLeadUpdate={handleLeadUpdate}
            />

            {/* Tabbed Content */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="details" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Lead Details
                </TabsTrigger>
                <TabsTrigger value="activity" className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Activity & History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                <EditableLeadInfoSection
                  formData={formData}
                  onInputChange={handleInputChange}
                  canEdit={canEdit}
                />

                <PropertyMapSection address={formData.propertyAddress} />

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
              </TabsContent>

              <TabsContent value="activity" className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <LeadActivityTimeline leadId={formData.id} />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Sidebar */}
          <div className="xl:col-span-1">
            <div className="sticky top-6 space-y-4">
              <Sidebar
                currentStatus={formData.status}
                files={files}
                canEdit={canEdit}
                onStatusChange={handleStatusChange}
                onRemoveFile={removeFile}
                onFileUpload={handleFileUpload}
              />

              {/* Communication Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h3 className="font-semibold mb-3">Quick Actions</h3>
                <button
                  onClick={() => setCommSidebar(true)}
                  className="w-full text-left p-2 rounded hover:bg-gray-50 text-sm"
                >
                  📞 View Communication Log
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <SaveButton
          onSave={handleSave}
          isSaving={isSaving}
          canEdit={canEdit}
          disposition={disposition}
        />

        <ViewOnlyMessage canEdit={canEdit} />
      </div>

      {/* Communication Panels */}
      <CallStatusPanel
        isVisible={callStatus.isActive}
        phoneNumber={callStatus.phoneNumber}
        leadName={callStatus.leadName}
        onEndCall={handleEndCall}
      />

      <SMSPanel
        isVisible={smsPanel.isOpen}
        phoneNumber={smsPanel.phoneNumber}
        leadName={smsPanel.leadName}
        leadId={formData.id.toString()}
        onClose={handleCloseSMS}
      />

      <CommunicationSidebar
        isOpen={commSidebar}
        onClose={() => setCommSidebar(false)}
        leadId={formData.id.toString()}
      />
    </>
  );
}

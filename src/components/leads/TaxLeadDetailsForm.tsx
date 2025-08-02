import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, Eye, Activity, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TaxLead } from '@/types/taxLead';
import { MainContent } from './detail/MainContent';
import { Sidebar } from './detail/Sidebar';
import { ViewOnlyMessage } from './detail/ViewOnlyMessage';
import { SellerContactSection } from './detail/SellerContactSection';
import { EnhancedLeadDetailsSection } from './detail/EnhancedLeadDetailsSection';
import { DispositionSection } from './detail/DispositionSection';
import { EnhancedOwnershipSection } from './detail/EnhancedOwnershipSection';
import { ConditionalFieldsSection } from './detail/ConditionalFieldsSection';
import { NotesSection } from './detail/NotesSection';
import { PropertyMapSection } from './detail/PropertyMapSection';
import { NotesDisplaySection } from './detail/NotesDisplaySection';
import { useAuth } from '@/contexts/AuthContext';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  url: string;
  size?: number;
  category: 'probate' | 'vesting_deed' | 'other' | 'death' | 'lawsuit' | 'taxing_entities';
}

interface NoteEntry {
  id: string;
  text: string;
  timestamp: Date;
  userName: string;
}

interface ActivityItem {
  id: number;
  type: 'created' | 'note' | 'status_change' | 'field_update' | 'file_upload' | 'comment';
  title: string;
  description: string;
  timestamp: Date;
  user: string;
  userInitials: string;
  mentions?: string[];
}

interface TaxLeadDetailsFormProps {
  lead: TaxLead;
  onSave: (updatedLead: TaxLead) => void;
  userRole: 'admin' | 'editor' | 'viewer';
}

export function TaxLeadDetailsForm({
  lead,
  onSave,
  userRole
}: TaxLeadDetailsFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<TaxLead>(lead);
  const [disposition, setDisposition] = useState<'keep' | 'pass' | null>(
    lead.disposition === 'QUALIFIED' ? 'keep' : 
    lead.disposition === 'DISQUALIFIED' ? 'pass' : null
  );
  const [passReason, setPassReason] = useState('');
  const [notes, setNotes] = useState<NoteEntry[]>([]);
  const [newNote, setNewNote] = useState('');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const { toast } = useToast();

  // Mock activity data
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: 1,
      type: 'created',
      title: 'Lead Created',
      description: `Lead for ${formData.ownerName} was created`,
      timestamp: new Date(formData.createdAt || Date.now() - 2 * 24 * 60 * 60 * 1000),
      user: 'System',
      userInitials: 'SY'
    },
    {
      id: 2,
      type: 'field_update',
      title: 'Status Updated',
      description: `Status set to ${formData.status}`,
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      user: 'John Doe',
      userInitials: 'JD'
    },
    {
      id: 3,
      type: 'note',
      title: 'Note Added',
      description: formData.notes || 'Initial assessment completed',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      user: 'Jane Smith',
      userInitials: 'JS'
    }
  ]);

  const canEdit = ['admin', 'editor'].includes(userRole);

  useEffect(() => {
    setFormData(lead);
    setDisposition(
      lead.disposition === 'QUALIFIED' ? 'keep' : 
      lead.disposition === 'DISQUALIFIED' ? 'pass' : null
    );
    
    // Initialize files from lead data if available
    if (lead.attachedFiles) {
      const convertedFiles: UploadedFile[] = lead.attachedFiles.map((file, index) => ({
        id: `existing-${index}`,
        name: file.name,
        type: file.type || 'application/octet-stream',
        url: file.url,
        size: file.size,
        category: 'other' as const
      }));
      setFiles(convertedFiles);
    }
  }, [lead]);

  const handleInputChange = (field: keyof TaxLead, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleDisposition = async (disp: 'keep' | 'pass' | null) => {
    setDisposition(disp);
    
    // If resetting disposition to null, don't auto-save
    if (disp === null) {
      // Reset to original state
      const updatedFormData: TaxLead = {
        ...formData,
        disposition: lead.disposition || 'UNDECIDED',
        status: lead.status
      };
      setFormData(updatedFormData);
      setHasUnsavedChanges(true);
      return;
    }
    
    // Update the lead's disposition and status with proper typing
    const newDisposition: 'QUALIFIED' | 'DISQUALIFIED' = disp === 'keep' ? 'QUALIFIED' : 'DISQUALIFIED';
    const newStatus: 'KEEP' | 'PASS' = disp === 'keep' ? 'KEEP' : 'PASS';
    
    const updatedFormData: TaxLead = {
      ...formData,
      disposition: newDisposition,
      status: newStatus
    };
    
    setFormData(updatedFormData);
    
    // Automatically save the disposition change to the database
    try {
      setLoading(true);
      console.log('Auto-saving disposition change:', { disposition: newDisposition, status: newStatus });
      
      onSave(updatedFormData);
      
      toast({
        title: "Disposition Updated",
        description: `Lead has been marked as ${disp === 'keep' ? 'Keep' : 'Pass'}`,
      });
      
      // Add activity for disposition change
      const newActivity: ActivityItem = {
        id: activities.length + 1,
        type: 'status_change',
        title: 'Disposition Changed',
        description: `Lead disposition changed to ${disp === 'keep' ? 'Keep' : 'Pass'}`,
        timestamp: new Date(),
        user: user?.email ? `${user.email}` : 'Current User',
        userInitials: user?.email ? user.email.substring(0, 2).toUpperCase() : 'CU'
      };
      setActivities(prev => [newActivity, ...prev]);
      
    } catch (error) {
      console.error('Error saving disposition:', error);
      toast({
        title: "Error",
        description: "Failed to save disposition change",
        variant: "destructive",
      });
      
      // Revert the changes on error
      setDisposition(
        lead.disposition === 'QUALIFIED' ? 'keep' : 
        lead.disposition === 'DISQUALIFIED' ? 'pass' : null
      );
      setFormData(lead);
    } finally {
      setLoading(false);
    }
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

  const handleAddComment = (comment: string) => {
    const newActivity: ActivityItem = {
      id: activities.length + 1,
      type: 'comment',
      title: 'Comment Added',
      description: comment,
      timestamp: new Date(),
      user: 'Current User',
      userInitials: 'CU',
      mentions: comment.match(/@\w+/g) || []
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const handleFileUpload = (newFiles: File[], category: 'probate' | 'vesting_deed' | 'other' | 'death' | 'lawsuit' | 'taxing_entities') => {
    const uploadedFiles: UploadedFile[] = newFiles.map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
      size: file.size,
      category
    }));
    setFiles(prev => [...prev, ...uploadedFiles]);
    setHasUnsavedChanges(true);
    
    toast({
      title: "Files uploaded",
      description: `${newFiles.length} file(s) added successfully`,
    });
  };

  const handleRemoveFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
    setHasUnsavedChanges(true);
    
    toast({
      title: "File removed",
      description: "File has been removed successfully",
    });
  };

  const handleSave = async () => {
    if (!canEdit) return;
    
    setLoading(true);
    try {
      console.log('Saving lead with data:', formData);
      
      // Combine notes into the main notes field
      const combinedNotes = notes.length > 0 
        ? notes.map(note => `${note.userName} (${note.timestamp.toLocaleDateString()}): ${note.text}`).join('\n\n')
        : formData.notes || '';

      // Convert files back to the expected format
      const attachedFiles = files.map(file => ({
        id: file.id,
        name: file.name,
        url: file.url,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString()
      }));

      const updatedLead = {
        ...formData,
        notes: combinedNotes,
        attachedFiles,
        updatedAt: new Date().toISOString()
      };

      onSave(updatedLead);
      toast({
        title: "Success",
        description: "✅ Lead details saved successfully",
      });
      setHasUnsavedChanges(false);
      setNotes([]); // Clear notes after saving
    } catch (error) {
      console.error('Error saving lead:', error);
      toast({
        title: "Error",
        description: "Failed to save lead details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOwnershipSave = (heirs: any[]) => {
    console.log('Heirs saved:', heirs);
    // Here you would typically save the heirs data to your backend
    // For now, we'll just log it
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Lead Details
            </h1>
            <p className="text-sm text-gray-600 mt-0.5">
              {formData.ownerName} - {formData.propertyAddress}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {!canEdit && (
              <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-md border border-amber-200">
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">View Only</span>
              </div>
            )}
            
            {canEdit && hasUnsavedChanges && (
              <Button
                onClick={handleSave}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 h-8"
                size="sm"
              >
                <Save className="w-4 h-4 mr-1" />
                {loading ? 'Saving...' : 'Save'}
              </Button>
            )}
          </div>
        </div>

        <ViewOnlyMessage canEdit={canEdit} />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 bg-white border border-gray-200 p-1 rounded-md h-9">
            <TabsTrigger value="details" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded text-sm">
              <FileText className="w-4 h-4" />
              Details
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded text-sm">
              <Activity className="w-4 h-4" />
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            {/* Responsive 2-Column Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Seller Contact Section */}
                <Card className="shadow-sm border border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Seller Contact Details</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <SellerContactSection 
                      lead={formData} 
                      onFieldUpdate={handleInputChange} 
                      canEdit={canEdit} 
                    />
                  </CardContent>
                </Card>

                {/* Lead Disposition Section */}
                <DispositionSection
                  disposition={disposition}
                  passReason={passReason}
                  canEdit={canEdit}
                  onDisposition={handleDisposition}
                  onPassReasonChange={handlePassReasonChange}
                />

                {/* Conditional rendering based on disposition */}
                {disposition === 'keep' && (
                  <>
                    {/* Collapsible Conditional Fields Section */}
                    <ConditionalFieldsSection
                      formData={formData}
                      files={files}
                      canEdit={canEdit}
                      onInputChange={handleInputChange}
                      onFileUpload={handleFileUpload}
                      onRemoveFile={handleRemoveFile}
                    />

                    {/* Collapsible Heirs & Ownership Section */}
                    <EnhancedOwnershipSection
                      lead={formData}
                      canEdit={canEdit}
                      onSave={handleOwnershipSave}
                    />
                  </>
                )}

                {/* Notes Section (for pass disposition or general notes) */}
                {(disposition === 'pass' || disposition === null) && (
                  <NotesSection
                    notes={notes}
                    newNote={newNote}
                    canEdit={canEdit}
                    onNewNoteChange={handleNewNoteChange}
                    onAddNote={handleAddNote}
                  />
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Lead Details Section */}
                <Card className="shadow-sm border border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Lead Details</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <EnhancedLeadDetailsSection 
                      lead={formData} 
                      onFieldUpdate={handleInputChange} 
                      canEdit={canEdit} 
                    />
                  </CardContent>
                </Card>

                {/* Property Map */}
                <Card className="shadow-sm border border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Property Map</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <PropertyMapSection address={formData.propertyAddress} />
                  </CardContent>
                </Card>

                {/* Notes Display */}
                {formData.notes && (
                  <Card className="shadow-sm border border-gray-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Notes</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <NotesDisplaySection notes={formData.notes} />
                    </CardContent>
                  </Card>
                )}

                {/* Attachments Summary */}
                {files.length > 0 && (
                  <Card className="shadow-sm border border-gray-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Attachments ({files.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {files.slice(0, 3).map((file) => (
                          <div key={file.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <span className="truncate">{file.name}</span>
                          </div>
                        ))}
                        {files.length > 3 && (
                          <div className="text-sm text-gray-500 text-center py-2">
                            +{files.length - 3} more files
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            
            <Card className="bg-white shadow-sm border border-gray-200 rounded-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-4 h-4 text-blue-600" />
                  </div>
                  Lead Activity Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map(activity => (
                    <div key={activity.id} className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0">
                      <div className="w-8 h-8 rounded-full bg-crm-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-crm-primary">
                          {activity.userInitials}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-gray-900">{activity.title}</h4>
                          <span className="text-xs text-gray-500">
                            {activity.timestamp.toLocaleDateString()} at {activity.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
                        <p className="text-xs text-gray-500">by {activity.user}</p>
                        {activity.mentions && activity.mentions.length > 0 && (
                          <div className="mt-2">
                            {activity.mentions.map((mention, index) => (
                              <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1">
                                {mention}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Comment Section */}
                {canEdit && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-gray-600">CU</span>
                      </div>
                      <div className="flex-1">
                        <textarea
                          placeholder="Add a comment..."
                          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-crm-primary focus:border-transparent"
                          rows={3}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              const comment = e.currentTarget.value.trim();
                              if (comment) {
                                handleAddComment(comment);
                                e.currentTarget.value = '';
                              }
                            }
                          }}
                        />
                        <div className="flex justify-end mt-2">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              const textarea = e.currentTarget.parentElement?.parentElement?.querySelector('textarea');
                              const comment = textarea?.value.trim();
                              if (comment) {
                                handleAddComment(comment);
                                textarea.value = '';
                              }
                            }}
                          >
                            Add Comment
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

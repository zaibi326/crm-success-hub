
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, Eye, Activity, FileText } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('details');

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

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="details" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Details
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Main Content - All Sections */}
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
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-crm-primary" />
                  Lead Activity Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity) => (
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

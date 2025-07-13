import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Save, DollarSign, Home, FileText, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FileUploadSection } from './FileUploadSection';
import { LeadStatusButtons } from './LeadStatusButtons';
import { LinkifiedText } from '../common/LinkifiedText';
import { OwnershipBreakdownChart } from './OwnershipBreakdownChart';
import { LeadActivityTimeline } from './LeadActivityTimeline';
import { useRoleAccess } from '@/hooks/useRoleAccess';

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
  const [formData, setFormData] = useState<TaxLead>(lead);
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
    setFormData(prev => ({ ...prev, status }));
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
          {/* Read-only Imported Data */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <Home className="w-6 h-6 text-crm-primary" />
                Imported Lead Data
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Tax ID</Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span className="font-mono text-gray-900">{formData.taxId}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Owner Name</Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span className="text-gray-900">{formData.ownerName}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Lawsuit Number</Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span className="font-mono text-gray-900">{formData.taxLawsuitNumber || 'N/A'}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Property Address</Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span className="text-gray-900">{formData.propertyAddress}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Disposition Buttons */}
          {!disposition && (
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Lead Disposition</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button
                    onClick={() => handleDisposition('pass')}
                    variant="outline"
                    className="flex-1 h-12 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Pass
                  </Button>
                  <Button
                    onClick={() => handleDisposition('keep')}
                    className="flex-1 h-12 bg-green-600 hover:bg-green-700"
                  >
                    Keep
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pass Reason */}
          {disposition === 'pass' && (
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Pass Reason</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={passReason}
                  onChange={(e) => setPassReason(e.target.value)}
                  placeholder="Optional: Why are you passing on this lead?"
                  className="min-h-[80px]"
                  disabled={!canEdit}
                />
              </CardContent>
            </Card>
          )}

          {/* Notes Section */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-crm-primary" />
                Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {canEdit && (
                <div className="flex gap-2">
                  <Input
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note..."
                    onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
                  />
                  <Button onClick={handleAddNote} disabled={!newNote.trim()}>
                    Add
                  </Button>
                </div>
              )}
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {notes.map((note) => (
                  <div key={note.id} className="p-3 bg-gray-50 rounded-lg border">
                    <LinkifiedText text={note.text} />
                    <div className="mt-2 text-xs text-gray-500">
                      {note.userName} • {note.timestamp.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Editable Fields (shown after "Keep") */}
          {disposition === 'keep' && (
            <>
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-crm-primary" />
                    Editable Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentArrears">Current Arrears ($)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="currentArrears"
                        type="number"
                        value={formData.currentArrears || ''}
                        onChange={(e) => handleInputChange('currentArrears', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        className="pl-10"
                        disabled={!canEdit}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ownerOfRecord">Owner of Record</Label>
                    <Input
                      id="ownerOfRecord"
                      value={formData.ownerOfRecord || ''}
                      onChange={(e) => handleInputChange('ownerOfRecord', e.target.value)}
                      placeholder="Enter owner of record"
                      disabled={!canEdit}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="propertyAddressEdit">Property Address (Editable)</Label>
                    <Input
                      id="propertyAddressEdit"
                      value={formData.propertyAddress}
                      onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
                      placeholder="Enter complete property address"
                      disabled={!canEdit}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Conditional Fields */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Death Information */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hasDeath"
                        checked={formData.hasDeath || false}
                        onCheckedChange={(checked) => handleInputChange('hasDeath', checked)}
                        disabled={!canEdit}
                      />
                      <Label htmlFor="hasDeath" className="font-medium">Death Information</Label>
                    </div>
                    
                    {formData.hasDeath && (
                      <div className="ml-6 space-y-2">
                        <Label htmlFor="deathNotes">Death Details</Label>
                        <Textarea
                          id="deathNotes"
                          value={formData.deathNotes || ''}
                          onChange={(e) => handleInputChange('deathNotes', e.target.value)}
                          placeholder="Enter details about the death..."
                          className="min-h-[100px]"
                          disabled={!canEdit}
                        />
                        {formData.deathNotes && (
                          <div className="p-3 bg-gray-50 rounded-lg border">
                            <LinkifiedText text={formData.deathNotes} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Probate Information */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hasProbate"
                        checked={formData.hasProbate || false}
                        onCheckedChange={(checked) => handleInputChange('hasProbate', checked)}
                        disabled={!canEdit}
                      />
                      <Label htmlFor="hasProbate" className="font-medium">Probate Information</Label>
                    </div>
                    
                    {formData.hasProbate && (
                      <div className="ml-6 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="probateNotes">Probate Notes</Label>
                          <Textarea
                            id="probateNotes"
                            value={formData.probateNotes || ''}
                            onChange={(e) => handleInputChange('probateNotes', e.target.value)}
                            placeholder="Enter probate information..."
                            className="min-h-[100px]"
                            disabled={!canEdit}
                          />
                        </div>
                        
                        <FileUploadSection
                          title="Probate Documents"
                          category="probate"
                          files={files.filter(f => f.category === 'probate')}
                          onFileUpload={(files) => handleFileUpload(files, 'probate')}
                          onRemoveFile={removeFile}
                          acceptedTypes=".pdf"
                          disabled={!canEdit}
                        />
                      </div>
                    )}
                  </div>

                  {/* Lawsuit Information */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hasLawsuit"
                        checked={formData.hasLawsuit || false}
                        onCheckedChange={(checked) => handleInputChange('hasLawsuit', checked)}
                        disabled={!canEdit}
                      />
                      <Label htmlFor="hasLawsuit" className="font-medium">Lawsuit Details</Label>
                    </div>
                    
                    {formData.hasLawsuit && (
                      <div className="ml-6 space-y-2">
                        <Label htmlFor="lawsuitNotes">Lawsuit Information</Label>
                        <Textarea
                          id="lawsuitNotes"
                          value={formData.lawsuitNotes || ''}
                          onChange={(e) => handleInputChange('lawsuitNotes', e.target.value)}
                          placeholder="Enter lawsuit details..."
                          className="min-h-[100px]"
                          disabled={!canEdit}
                        />
                      </div>
                    )}
                  </div>

                  {/* Additional Taxing Entities */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hasAdditionalTaxingEntities"
                        checked={formData.hasAdditionalTaxingEntities || false}
                        onCheckedChange={(checked) => handleInputChange('hasAdditionalTaxingEntities', checked)}
                        disabled={!canEdit}
                      />
                      <Label htmlFor="hasAdditionalTaxingEntities" className="font-medium">Additional Taxing Entities</Label>
                    </div>
                    
                    {formData.hasAdditionalTaxingEntities && (
                      <div className="ml-6 space-y-2">
                        <Label htmlFor="additionalTaxingNotes">Additional Taxing Entities Notes</Label>
                        <Textarea
                          id="additionalTaxingNotes"
                          value={formData.additionalTaxingNotes || ''}
                          onChange={(e) => handleInputChange('additionalTaxingNotes', e.target.value)}
                          placeholder="Enter details about additional taxing entities..."
                          className="min-h-[100px]"
                          disabled={!canEdit}
                        />
                      </div>
                    )}
                  </div>

                  {/* Vesting Deed Upload */}
                  <div className="space-y-4">
                    <FileUploadSection
                      title="Vesting Deed Upload"
                      category="vesting_deed"
                      files={files.filter(f => f.category === 'vesting_deed')}
                      onFileUpload={(files) => handleFileUpload(files, 'vesting_deed')}
                      onRemoveFile={removeFile}
                      acceptedTypes=".pdf"
                      disabled={!canEdit}
                    />
                    
                    <div className="space-y-2">
                      <Label htmlFor="vestingDeedNotes">Vesting Deed Notes</Label>
                      <Textarea
                        id="vestingDeedNotes"
                        value={formData.vestingDeedNotes || ''}
                        onChange={(e) => handleInputChange('vestingDeedNotes', e.target.value)}
                        placeholder="Enter notes about the vesting deed..."
                        className="min-h-[80px]"
                        disabled={!canEdit}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ownership Breakdown */}
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

          {/* Activity Timeline */}
          <LeadActivityTimeline leadId={lead.id} />
        </div>

        {/* Status Classification Sidebar - 1 column */}
        <div className="space-y-6">
          <LeadStatusButtons
            currentStatus={formData.status}
            onStatusChange={handleStatusChange}
            disabled={!canEdit}
          />

          {/* Attachments Section */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-lg">Attachments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {files.length === 0 ? (
                  <p className="text-gray-500 text-sm">No files uploaded</p>
                ) : (
                  files.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                      <span className="text-sm truncate flex-1">{file.name}</span>
                      {canEdit && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFile(file.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
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

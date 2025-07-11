
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  MapPin, 
  ExternalLink,
  Edit,
  ArrowLeft,
  Home,
  User,
  FileText,
  Activity,
  DollarSign,
  Calendar,
  Building,
  Tag,
  Send,
  Paperclip,
  AtSign
} from 'lucide-react';
import { TaxLead } from '@/types/taxLead';
import { PropertyMap } from './PropertyMap';
import { TemplateModificationDialog } from './TemplateModificationDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EditableField } from './EditableField';
import { useToast } from '@/hooks/use-toast';

interface EnhancedLeadDetailPageProps {
  lead: TaxLead;
  onBack: () => void;
  onLeadUpdate: (updatedLead: TaxLead) => void;
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

export function EnhancedLeadDetailPage({ lead, onBack, onLeadUpdate }: EnhancedLeadDetailPageProps) {
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [leadData, setLeadData] = useState(lead);
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: 1,
      type: 'created',
      title: 'Lead Created',
      description: `Lead for ${lead.firstName} ${lead.lastName} was created`,
      timestamp: new Date(lead.createdAt || Date.now() - 2 * 24 * 60 * 60 * 1000),
      user: 'System',
      userInitials: 'SY'
    },
    {
      id: 2,
      type: 'field_update',
      title: 'Temperature Updated',
      description: `Temperature set to ${lead.temperature}`,
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      user: 'John Doe',
      userInitials: 'JD'
    },
    {
      id: 3,
      type: 'note',
      title: 'Note Added',
      description: lead.notes || 'Initial contact attempted - very interested in selling',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      user: 'Jane Smith',
      userInitials: 'JS'
    }
  ]);

  const { toast } = useToast();
  
  const handleCall = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const handleSendText = (phoneNumber: string) => {
    window.open(`sms:${phoneNumber}`, '_self');
  };

  const handleEmail = (email: string) => {
    window.open(`mailto:${email}`, '_self');
  };

  const handleFieldUpdate = (field: keyof TaxLead, value: string) => {
    const updatedLead = { ...leadData, [field]: value };
    setLeadData(updatedLead);
    onLeadUpdate(updatedLead);
    
    toast({
      title: "Field Updated",
      description: `${field} has been updated successfully`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HOT': return 'bg-red-100 text-red-800 border-red-200';
      case 'WARM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'COLD': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PASS': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTemperatureIcon = (temp: string) => {
    switch (temp) {
      case 'HOT': return '🔥';
      case 'WARM': return '🌤️';
      case 'COLD': return '❄️';
      default: return '📊';
    }
  };

  const getOccupancyLabel = (status: string) => {
    switch (status) {
      case 'OWNER_OCCUPIED': return 'Owner Occupied';
      case 'TENANT_OCCUPIED': return 'Tenant Occupied';
      case 'VACANT': return 'Vacant';
      default: return status;
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const newActivity: ActivityItem = {
      id: activities.length + 1,
      type: 'comment',
      title: 'Comment Added',
      description: newComment,
      timestamp: new Date(),
      user: 'Current User',
      userInitials: 'CU',
      mentions: newComment.match(/@\w+/g) || []
    };

    setActivities(prev => [newActivity, ...prev]);
    setNewComment('');

    toast({
      title: "Comment Added",
      description: "Your comment has been added to the activity timeline",
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'created': return <User className="w-4 h-4" />;
      case 'note': return <FileText className="w-4 h-4" />;
      case 'status_change': return <Tag className="w-4 h-4" />;
      case 'field_update': return <Edit className="w-4 h-4" />;
      case 'file_upload': return <Paperclip className="w-4 h-4" />;
      case 'comment': return <MessageSquare className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number | undefined) => {
    if (!amount) return 'N/A';
    return `$${amount.toLocaleString()}`;
  };

  const temperatureOptions = [
    { value: 'HOT', label: '🔥 HOT' },
    { value: 'WARM', label: '🌤️ WARM' },
    { value: 'COLD', label: '❄️ COLD' }
  ];

  const occupancyOptions = [
    { value: 'OWNER_OCCUPIED', label: 'Owner Occupied' },
    { value: 'TENANT_OCCUPIED', label: 'Tenant Occupied' },
    { value: 'VACANT', label: 'Vacant' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-crm-gradient-start via-white to-crm-gradient-end">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="flex items-center gap-2 text-crm-primary hover:text-crm-accent"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Leads
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {leadData.firstName} {leadData.lastName}
              </h1>
              <p className="text-gray-600">{leadData.propertyAddress}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={getStatusColor(leadData.temperature)}>
              {getTemperatureIcon(leadData.temperature)} {leadData.temperature}
            </Badge>
            <Button 
              variant="outline"
              onClick={() => setIsTemplateDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Lead
            </Button>
          </div>
        </div>

        {/* Tabs for Details and Activity only */}
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Personal Information */}
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-crm-primary" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <EditableField
                      label="Full Name"
                      value={`${leadData.firstName} ${leadData.lastName}`}
                      onSave={(value) => {
                        const [firstName, ...lastNameParts] = value.split(' ');
                        handleFieldUpdate('firstName', firstName || '');
                        handleFieldUpdate('lastName', lastNameParts.join(' ') || '');
                      }}
                    />
                    
                    {leadData.phone && (
                      <EditableField
                        label="Phone"
                        value={leadData.phone}
                        onSave={(value) => handleFieldUpdate('phone', value)}
                        type="tel"
                      />
                    )}
                    
                    {leadData.email && (
                      <EditableField
                        label="Email"
                        value={leadData.email}
                        onSave={(value) => handleFieldUpdate('email', value)}
                        type="email"
                      />
                    )}

                    {leadData.agentName && (
                      <EditableField
                        label="Agent"
                        value={leadData.agentName}
                        onSave={(value) => handleFieldUpdate('agentName', value)}
                      />
                    )}
                  </CardContent>
                </Card>

                {/* Property Information */}
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="w-5 h-5 text-crm-primary" />
                      Property Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <EditableField
                      label="Address"
                      value={leadData.propertyAddress}
                      onSave={(value) => handleFieldUpdate('propertyAddress', value)}
                    />
                    
                    <EditableField
                      label="Occupancy"
                      value={leadData.occupancyStatus}
                      onSave={(value) => handleFieldUpdate('occupancyStatus', value)}
                      type="select"
                      options={occupancyOptions}
                    />

                    {leadData.taxId && (
                      <EditableField
                        label="Tax ID"
                        value={leadData.taxId}
                        onSave={(value) => handleFieldUpdate('taxId', value)}
                      />
                    )}

                    {/* Property Links */}
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="font-medium text-gray-700">Quick Links</div>
                      <div className="col-span-2 flex gap-2">
                        <Button
                          variant="link"
                          className="p-0 h-auto text-crm-primary hover:text-crm-accent"
                          onClick={() => window.open(`https://www.zillow.com/homes/${encodeURIComponent(leadData.propertyAddress)}/`, '_blank')}
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Zillow
                        </Button>
                        <Button
                          variant="link"
                          className="p-0 h-auto text-crm-primary hover:text-crm-accent"
                          onClick={() => window.open(`https://www.homes.com/property/${encodeURIComponent(leadData.propertyAddress)}/`, '_blank')}
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Homes.com
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Financial Information */}
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-crm-primary" />
                      Financial Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {leadData.askingPrice && (
                      <EditableField
                        label="Asking Price"
                        value={formatCurrency(leadData.askingPrice)}
                        onSave={(value) => {
                          const numValue = parseFloat(value.replace(/[$,]/g, ''));
                          if (!isNaN(numValue)) {
                            handleFieldUpdate('askingPrice', numValue.toString());
                          }
                        }}
                      />
                    )}
                    
                    {leadData.mortgagePrice && (
                      <EditableField
                        label="Mortgage Price"
                        value={formatCurrency(leadData.mortgagePrice)}
                        onSave={(value) => {
                          const numValue = parseFloat(value.replace(/[$,]/g, ''));
                          if (!isNaN(numValue)) {
                            handleFieldUpdate('mortgagePrice', numValue.toString());
                          }
                        }}
                      />
                    )}
                    
                    {leadData.currentArrears && (
                      <EditableField
                        label="Current Arrears"
                        value={formatCurrency(leadData.currentArrears)}
                        onSave={(value) => {
                          const numValue = parseFloat(value.replace(/[$,]/g, ''));
                          if (!isNaN(numValue)) {
                            handleFieldUpdate('currentArrears', numValue.toString());
                          }
                        }}
                      />
                    )}
                  </CardContent>
                </Card>

                {/* Lead Information */}
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-crm-primary" />
                      Lead Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {leadData.leadSource && (
                      <EditableField
                        label="Lead Source"
                        value={leadData.leadSource}
                        onSave={(value) => handleFieldUpdate('leadSource', value)}
                      />
                    )}
                    
                    <EditableField
                      label="Temperature"
                      value={leadData.temperature}
                      onSave={(value) => handleFieldUpdate('temperature', value)}
                      type="select"
                      options={temperatureOptions}
                    />

                    {leadData.campaignId && (
                      <EditableField
                        label="Campaign"
                        value={leadData.campaignId}
                        onSave={(value) => handleFieldUpdate('campaignId', value)}
                      />
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Map */}
              <div className="space-y-6">
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-crm-primary" />
                      Property Map
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PropertyMap address={leadData.propertyAddress} />
                  </CardContent>
                </Card>

                {/* Notes */}
                {leadData.notes && (
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle>Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <EditableField
                        label=""
                        value={leadData.notes}
                        onSave={(value) => handleFieldUpdate('notes', value)}
                        multiline={true}
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Attached Files */}
                {leadData.attachedFiles && leadData.attachedFiles.length > 0 && (
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Paperclip className="w-5 h-5 text-crm-primary" />
                        Attached Files
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {leadData.attachedFiles.map((file, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                            <Paperclip className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">{file.name}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6 mt-6">
            {/* Comment Input */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-crm-primary" />
                  Add Comment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment... Use @username to mention team members"
                    rows={3}
                    className="w-full"
                  />
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      <AtSign className="w-3 h-3 inline mr-1" />
                      Mention users with @username
                    </div>
                    <Button 
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Add Comment
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-crm-primary" />
                  Activity Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity, index) => (
                    <div key={activity.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-b-0">
                      <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                          {activity.userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                              {getActivityIcon(activity.type)}
                            </div>
                            <h4 className="font-semibold text-gray-900 text-sm">{activity.title}</h4>
                          </div>
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            {activity.timestamp.toLocaleDateString()} {activity.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-1 break-words">{activity.description}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500">by {activity.user}</p>
                          {activity.mentions && activity.mentions.length > 0 && (
                            <div className="flex gap-1">
                              {activity.mentions.map((mention, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {mention}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Template Modification Dialog */}
      <TemplateModificationDialog
        isOpen={isTemplateDialogOpen}
        onClose={() => setIsTemplateDialogOpen(false)}
        lead={leadData}
        onSave={onLeadUpdate}
      />
    </div>
  );
}

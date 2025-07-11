
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Activity
} from 'lucide-react';
import { TaxLead } from '@/types/taxLead';
import { PropertyMap } from './PropertyMap';
import { TemplateModificationDialog } from './TemplateModificationDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LeadDetailsPageProps {
  lead: TaxLead;
  onBack: () => void;
  onLeadUpdate: (updatedLead: TaxLead) => void;
}

export function LeadDetailsPage({ lead, onBack, onLeadUpdate }: LeadDetailsPageProps) {
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  
  const handleCall = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const handleSendText = (phoneNumber: string) => {
    window.open(`sms:${phoneNumber}`, '_self');
  };

  const handleEmail = (email: string) => {
    window.open(`mailto:${email}`, '_self');
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

  const activities = [
    {
      id: 1,
      type: 'created',
      title: 'Lead Created',
      description: `Lead for ${lead.ownerName} was created`,
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      user: 'System'
    },
    {
      id: 2,
      type: 'note',
      title: 'Note Added',
      description: lead.notes || 'Initial contact attempted',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      user: 'John Doe'
    },
    {
      id: 3,
      type: 'status_change',
      title: 'Status Updated',
      description: `Status changed to ${lead.status}`,
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      user: 'Jane Smith'
    }
  ];

  return (
    <div className="min-h-screen bg-podio-surface">
      <div className="max-w-7xl mx-auto">
        {/* Podio-style sticky header */}
        <div className="sticky top-0 z-20 bg-podio-background border-b border-podio-border p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={onBack}
                className="podio-button-secondary flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Leads
              </Button>
              <div>
                <h1 className="text-2xl font-semibold text-podio-text">{lead.ownerName}</h1>
                <p className="text-sm text-podio-text-muted">{lead.propertyAddress}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={getStatusColor(lead.status)}>
                {lead.status}
              </Badge>
              <Button 
                variant="outline"
                onClick={() => setIsTemplateDialogOpen(true)}
                className="podio-button-secondary flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Modify Template
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Podio-style tabs */}
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-podio-background border border-podio-border rounded-lg p-1">
              <TabsTrigger 
                value="details" 
                className="data-[state=active]:bg-podio-primary data-[state=active]:text-white rounded-md"
              >
                Lead Details
              </TabsTrigger>
              <TabsTrigger 
                value="activity"
                className="data-[state=active]:bg-podio-primary data-[state=active]:text-white rounded-md"
              >
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Podio style fields */}
                <div className="space-y-6">
                  {/* Seller Contact - Podio style */}
                  <div className="podio-container p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <User className="w-5 h-5 text-podio-primary" />
                      <h3 className="font-semibold text-podio-text">Seller Contact</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="podio-field-row">
                        <div className="podio-field-label">Seller Name</div>
                        <div className="podio-field-value font-medium">{lead.ownerName}</div>
                      </div>
                      
                      {lead.phone && (
                        <div className="podio-field-row">
                          <div className="podio-field-label">Seller Phone</div>
                          <div className="podio-field-value flex items-center gap-2">
                            <span>{lead.phone}</span>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                onClick={() => handleCall(lead.phone!)}
                                className="h-7 px-2 bg-green-600 hover:bg-green-700 text-white"
                              >
                                <Phone className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleSendText(lead.phone!)}
                                className="h-7 px-2 bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                <MessageSquare className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {lead.email && (
                        <div className="podio-field-row">
                          <div className="podio-field-label">Seller Email</div>
                          <div className="podio-field-value flex items-center gap-2">
                            <span>{lead.email}</span>
                            <Button
                              size="sm"
                              onClick={() => handleEmail(lead.email!)}
                              className="h-7 px-2 bg-podio-primary hover:bg-blue-600 text-white"
                            >
                              <Mail className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Property Information - Podio style */}
                  <div className="podio-container p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Home className="w-5 h-5 text-podio-primary" />
                      <h3 className="font-semibold text-podio-text">Property Information</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="podio-field-row">
                        <div className="podio-field-label">Tax ID</div>
                        <div className="podio-field-value font-mono">{lead.taxId}</div>
                      </div>
                      
                      <div className="podio-field-row">
                        <div className="podio-field-label">Property Address</div>
                        <div className="podio-field-value">{lead.propertyAddress}</div>
                      </div>
                      
                      {lead.currentArrears && (
                        <div className="podio-field-row">
                          <div className="podio-field-label">Current Arrears</div>
                          <div className="podio-field-value font-semibold text-green-600">
                            ${lead.currentArrears.toLocaleString()}
                          </div>
                        </div>
                      )}
                      
                      {lead.taxLawsuitNumber && (
                        <div className="podio-field-row">
                          <div className="podio-field-label">Tax Lawsuit Number</div>
                          <div className="podio-field-value font-mono">{lead.taxLawsuitNumber}</div>
                        </div>
                      )}

                      {/* External Links - Podio style */}
                      <div className="podio-field-row">
                        <div className="podio-field-label">External Links</div>
                        <div className="podio-field-value flex flex-col gap-2">
                          <Button
                            variant="link"
                            className="p-0 h-auto text-podio-primary hover:text-blue-600 justify-start"
                            onClick={() => window.open(`https://www.zillow.com/homes/${encodeURIComponent(lead.propertyAddress)}/`, '_blank')}
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View on Zillow
                          </Button>
                          <Button
                            variant="link"
                            className="p-0 h-auto text-podio-primary hover:text-blue-600 justify-start"
                            onClick={() => window.open(`https://www.homes.com/property/${encodeURIComponent(lead.propertyAddress)}/`, '_blank')}
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View on Homes.com
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Map and Notes */}
                <div className="space-y-6">
                  {/* Property Map - Podio style */}
                  <div className="podio-container p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="w-5 h-5 text-podio-primary" />
                      <h3 className="font-semibold text-podio-text">Property Location</h3>
                    </div>
                    <PropertyMap address={lead.propertyAddress} />
                  </div>

                  {/* Notes - Podio style */}
                  {lead.notes && (
                    <div className="podio-container p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <FileText className="w-5 h-5 text-podio-primary" />
                        <h3 className="font-semibold text-podio-text">Notes</h3>
                      </div>
                      <div className="bg-podio-surface border border-podio-border rounded-lg p-4">
                        <p className="text-sm text-podio-text leading-relaxed">{lead.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6 mt-6">
              <div className="podio-container p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Activity className="w-5 h-5 text-podio-primary" />
                  <h3 className="font-semibold text-podio-text">Lead Activity</h3>
                </div>
                <div className="space-y-4">
                  {activities.map((activity, index) => (
                    <div key={activity.id} className="flex gap-4 pb-4 border-b border-podio-border last:border-b-0">
                      <div className="w-8 h-8 rounded-full bg-podio-primary/10 flex items-center justify-center flex-shrink-0">
                        <Activity className="w-4 h-4 text-podio-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-podio-text">{activity.title}</h4>
                          <span className="text-xs text-podio-text-muted">
                            {activity.timestamp.toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-podio-text-muted mb-1">{activity.description}</p>
                        <p className="text-xs text-podio-text-muted">by {activity.user}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Template Modification Dialog */}
      <TemplateModificationDialog
        isOpen={isTemplateDialogOpen}
        onClose={() => setIsTemplateDialogOpen(false)}
        lead={lead}
        onSave={onLeadUpdate}
      />
    </div>
  );
}

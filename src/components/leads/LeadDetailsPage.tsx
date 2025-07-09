
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  FileText
} from 'lucide-react';
import { TaxLead } from '@/types/taxLead';
import { PropertyMap } from './PropertyMap';
import { TemplateModificationDialog } from './TemplateModificationDialog';

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
              <h1 className="text-3xl font-bold text-gray-900">{lead.ownerName}</h1>
              <p className="text-gray-600">{lead.propertyAddress}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={getStatusColor(lead.status)}>
              {lead.status}
            </Badge>
            <Button 
              variant="outline"
              onClick={() => setIsTemplateDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Modify Template
            </Button>
          </div>
        </div>

        {/* Lead Status Navigation */}
        <Tabs defaultValue="details" className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Lead Details</TabsTrigger>
            <TabsTrigger value="all">All Leads</TabsTrigger>
            <TabsTrigger value="untouched">Untouched Leads</TabsTrigger>
            <TabsTrigger value="followup">Follow-up Needed</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Seller Contact */}
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-crm-primary" />
                      Seller Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="font-medium text-gray-700">Seller Name</div>
                      <div className="col-span-2 text-gray-900">{lead.ownerName}</div>
                    </div>
                    
                    {lead.phone && (
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="font-medium text-gray-700">Seller Phone</div>
                        <div className="col-span-2 flex items-center gap-2">
                          <span className="text-gray-900">{lead.phone}</span>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCall(lead.phone!)}
                              className="h-8 px-2"
                            >
                              <Phone className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSendText(lead.phone!)}
                              className="h-8 px-2"
                            >
                              <MessageSquare className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {lead.email && (
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="font-medium text-gray-700">Seller Email</div>
                        <div className="col-span-2 flex items-center gap-2">
                          <span className="text-gray-900">{lead.email}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEmail(lead.email!)}
                            className="h-8 px-2"
                          >
                            <Mail className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
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
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="font-medium text-gray-700">Tax ID</div>
                      <div className="col-span-2 text-gray-900 font-mono">{lead.taxId}</div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="font-medium text-gray-700">Property Address</div>
                      <div className="col-span-2 text-gray-900">{lead.propertyAddress}</div>
                    </div>
                    
                    {lead.currentArrears && (
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="font-medium text-gray-700">Current Arrears</div>
                        <div className="col-span-2 text-green-600 font-bold">
                          ${lead.currentArrears.toLocaleString()}
                        </div>
                      </div>
                    )}
                    
                    {lead.taxLawsuitNumber && (
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="font-medium text-gray-700">Tax Lawsuit Number</div>
                        <div className="col-span-2 text-gray-900 font-mono">{lead.taxLawsuitNumber}</div>
                      </div>
                    )}

                    {/* Property Links */}
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="font-medium text-gray-700">Zillow Link</div>
                      <div className="col-span-2">
                        <Button
                          variant="link"
                          className="p-0 h-auto text-crm-primary hover:text-crm-accent"
                          onClick={() => window.open(`https://www.zillow.com/homes/${encodeURIComponent(lead.propertyAddress)}/`, '_blank')}
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View on Zillow
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="font-medium text-gray-700">Homes Link</div>
                      <div className="col-span-2">
                        <Button
                          variant="link"
                          className="p-0 h-auto text-crm-primary hover:text-crm-accent"
                          onClick={() => window.open(`https://www.homes.com/property/${encodeURIComponent(lead.propertyAddress)}/`, '_blank')}
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View on Homes.com
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Lead Status */}
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-crm-primary" />
                      Lead Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        #New Untouched#
                      </Badge>
                      <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                        Discovery
                      </Badge>
                      <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                        Check Phone Number
                      </Badge>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Already Listed
                      </Badge>
                      <Badge className="bg-red-100 text-red-800 border-red-200">
                        Price Too High
                      </Badge>
                      <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                        Low Motivation
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Map */}
              <div className="space-y-6">
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-crm-primary" />
                      Property Address Map
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PropertyMap address={lead.propertyAddress} />
                  </CardContent>
                </Card>

                {/* Notes */}
                {lead.notes && (
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle>Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-gray-700 text-sm leading-relaxed">{lead.notes}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="all">
            <div className="text-center py-8">
              <p className="text-gray-600">Navigate to All Leads view</p>
            </div>
          </TabsContent>

          <TabsContent value="untouched">
            <div className="text-center py-8">
              <p className="text-gray-600">Navigate to Untouched Leads view</p>
            </div>
          </TabsContent>

          <TabsContent value="followup">
            <div className="text-center py-8">
              <p className="text-gray-600">Navigate to Follow-up Needed view</p>
            </div>
          </TabsContent>
        </Tabs>
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

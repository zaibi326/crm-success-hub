
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ExternalLink, DollarSign, FileText, Building, User, Hash } from 'lucide-react';
import { TaxLead } from '@/types/taxLead';
import { EditableField } from '../EditableField';

interface PropertyDetailsSectionProps {
  lead: TaxLead;
  onLeadUpdate: (field: keyof TaxLead, value: string) => void;
}

export function PropertyDetailsSection({ lead, onLeadUpdate }: PropertyDetailsSectionProps) {
  const handleCurrentArrearsUpdate = (value: string) => {
    // Convert string to number for currentArrears field
    const numericValue = parseFloat(value) || 0;
    onLeadUpdate('currentArrears', numericValue.toString());
  };

  const formatCurrency = (amount: number | undefined) => {
    if (!amount) return 'N/A';
    return `$${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="w-5 h-5 text-crm-primary" />
          Imported Lead Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Owner Information Section */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-700 flex items-center gap-2 border-b pb-2">
            <User className="w-4 h-4" />
            Owner Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-600">Owner Name</div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <EditableField
                  label=""
                  value={lead.ownerName || 'N/A'}
                  onSave={(value) => onLeadUpdate('ownerName', value)}
                  className="bg-transparent border-none p-0 font-medium text-blue-800"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-600">Owner of Record</div>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <EditableField
                  label=""
                  value={lead.ownerOfRecord || 'N/A'}
                  onSave={(value) => onLeadUpdate('ownerOfRecord', value)}
                  className="bg-transparent border-none p-0 font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tax Information Section */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-700 flex items-center gap-2 border-b pb-2">
            <Hash className="w-4 h-4" />
            Tax Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-600">Tax ID</div>
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <EditableField
                  label=""
                  value={lead.taxId || 'N/A'}
                  onSave={(value) => onLeadUpdate('taxId', value)}
                  className="bg-transparent border-none p-0 font-mono text-yellow-800"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-600">Tax Lawsuit Number</div>
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <EditableField
                  label=""
                  value={lead.taxLawsuitNumber || 'N/A'}
                  onSave={(value) => onLeadUpdate('taxLawsuitNumber', value)}
                  className="bg-transparent border-none p-0 font-mono text-red-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Property Information Section */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-700 flex items-center gap-2 border-b pb-2">
            <Building className="w-4 h-4" />
            Property Information
          </h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-600">Property Address</div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <EditableField
                  label=""
                  value={lead.propertyAddress || 'N/A'}
                  onSave={(value) => onLeadUpdate('propertyAddress', value)}
                  className="bg-transparent border-none p-0 font-medium text-green-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Financial Information Section */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-700 flex items-center gap-2 border-b pb-2">
            <DollarSign className="w-4 h-4" />
            Financial Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-600">Current Arrears</div>
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <EditableField
                  label=""
                  value={lead.currentArrears ? formatCurrency(lead.currentArrears) : 'N/A'}
                  onSave={handleCurrentArrearsUpdate}
                  className="bg-transparent border-none p-0 font-semibold text-red-700"
                />
              </div>
            </div>

            {lead.askingPrice && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-600">Asking Price</div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="font-semibold text-blue-700">
                    {formatCurrency(lead.askingPrice)}
                  </span>
                </div>
              </div>
            )}

            {lead.mortgagePrice && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-600">Mortgage Price</div>
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <span className="font-semibold text-orange-700">
                    {formatCurrency(lead.mortgagePrice)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Lead Data Section */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-700 flex items-center gap-2 border-b pb-2">
            <FileText className="w-4 h-4" />
            Additional Lead Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Lead Source */}
            {lead.leadSource && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-600">Lead Source</div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <span className="text-purple-800 font-medium">{lead.leadSource}</span>
                </div>
              </div>
            )}

            {/* Campaign ID */}
            {lead.campaignId && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-600">Campaign ID</div>
                <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                  <span className="font-mono text-indigo-800">{lead.campaignId}</span>
                </div>
              </div>
            )}

            {/* Agent Name */}
            {lead.agentName && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-600">Agent Name</div>
                <div className="p-3 bg-teal-50 rounded-lg border border-teal-200">
                  <span className="text-teal-800 font-medium">{lead.agentName}</span>
                </div>
              </div>
            )}

            {/* Lead Status */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-600">Lead Status</div>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  lead.status === 'HOT' ? 'bg-red-100 text-red-800' :
                  lead.status === 'WARM' ? 'bg-yellow-100 text-yellow-800' :
                  lead.status === 'COLD' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {lead.status}
                </span>
              </div>
            </div>

            {/* Created Date */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-600">Created Date</div>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <span className="text-gray-800">{formatDate(lead.createdAt)}</span>
              </div>
            </div>

            {/* Last Updated */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-600">Last Updated</div>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <span className="text-gray-800">{formatDate(lead.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        {(lead.email || lead.phone) && (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700 flex items-center gap-2 border-b pb-2">
              <User className="w-4 h-4" />
              Contact Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lead.email && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-600">Email Address</div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <EditableField
                      label=""
                      value={lead.email}
                      onSave={(value) => onLeadUpdate('email', value)}
                      className="bg-transparent border-none p-0 text-blue-800"
                    />
                  </div>
                </div>
              )}

              {lead.phone && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-600">Phone Number</div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <EditableField
                      label=""
                      value={lead.phone}
                      onSave={(value) => onLeadUpdate('phone', value)}
                      className="bg-transparent border-none p-0 text-green-800"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* External Property Links */}
        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-semibold text-gray-700">External Property Links</h4>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => window.open(`https://www.zillow.com/homes/${encodeURIComponent(lead.propertyAddress)}/`, '_blank')}
            >
              <ExternalLink className="w-3 h-3" />
              View on Zillow
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => window.open(`https://www.homes.com/property/${encodeURIComponent(lead.propertyAddress)}/`, '_blank')}
            >
              <ExternalLink className="w-3 h-3" />
              View on Homes.com
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => window.open(`https://www.realtor.com/realestateandhomes-search/${encodeURIComponent(lead.propertyAddress)}`, '_blank')}
            >
              <ExternalLink className="w-3 h-3" />
              View on Realtor.com
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

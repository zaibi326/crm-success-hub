
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ExternalLink, DollarSign, FileText, Building } from 'lucide-react';
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

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="w-5 h-5 text-crm-primary" />
          Imported Lead Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Owner Information */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-700 flex items-center gap-2">
            <Building className="w-4 h-4" />
            Owner Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-600">Owner Name</div>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <EditableField
                  label=""
                  value={lead.ownerName}
                  onSave={(value) => onLeadUpdate('ownerName', value)}
                  className="bg-transparent border-none p-0 font-medium"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-600">Tax ID</div>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <EditableField
                  label=""
                  value={lead.taxId || ''}
                  onSave={(value) => onLeadUpdate('taxId', value)}
                  className="bg-transparent border-none p-0 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Property Information */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-700 flex items-center gap-2">
            <Home className="w-4 h-4" />
            Property Information
          </h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-600">Property Address</div>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <EditableField
                  label=""
                  value={lead.propertyAddress}
                  onSave={(value) => onLeadUpdate('propertyAddress', value)}
                  className="bg-transparent border-none p-0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Financial Information */}
        {lead.currentArrears && (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Financial Details
            </h4>
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-600">Current Arrears</div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <EditableField
                  label=""
                  value={lead.currentArrears.toString()}
                  onSave={handleCurrentArrearsUpdate}
                  className="bg-transparent border-none p-0 font-semibold text-green-700"
                />
              </div>
            </div>
          </div>
        )}

        {/* Legal Information */}
        {lead.taxLawsuitNumber && (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Legal Information
            </h4>
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-600">Tax Lawsuit Number</div>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <EditableField
                  label=""
                  value={lead.taxLawsuitNumber}
                  onSave={(value) => onLeadUpdate('taxLawsuitNumber', value)}
                  className="bg-transparent border-none p-0 font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* Additional Lead Data */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-700">Additional Lead Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Lead Source */}
            {lead.leadSource && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-600">Lead Source</div>
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <span className="text-gray-900">{lead.leadSource}</span>
                </div>
              </div>
            )}

            {/* Campaign ID */}
            {lead.campaignId && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-600">Campaign ID</div>
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <span className="font-mono text-gray-900">{lead.campaignId}</span>
                </div>
              </div>
            )}

            {/* Agent Name */}
            {lead.agentName && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-600">Agent Name</div>
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <span className="text-gray-900">{lead.agentName}</span>
                </div>
              </div>
            )}

            {/* Asking Price */}
            {lead.askingPrice && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-600">Asking Price</div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="font-semibold text-blue-700">
                    ${lead.askingPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* Mortgage Price */}
            {lead.mortgagePrice && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-600">Mortgage Price</div>
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <span className="font-semibold text-orange-700">
                    ${lead.mortgagePrice.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* Created Date */}
            {lead.createdAt && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-600">Created Date</div>
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <span className="text-gray-900">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}

            {/* Last Updated */}
            {lead.updatedAt && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-600">Last Updated</div>
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <span className="text-gray-900">
                    {new Date(lead.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* External Links */}
        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-semibold text-gray-700">External Links</h4>
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

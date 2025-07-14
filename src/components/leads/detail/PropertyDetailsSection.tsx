
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, ExternalLink } from 'lucide-react';
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
    <div className="podio-container p-6">
      <div className="flex items-center gap-2 mb-4">
        <Home className="w-5 h-5 text-podio-primary" />
        <h3 className="font-semibold text-podio-text">Property Information</h3>
      </div>
      <div className="space-y-4">
        <div className="podio-field-row">
          <div className="podio-field-label">Tax ID</div>
          <div className="podio-field-value">
            <EditableField
              label=""
              value={lead.taxId || ''}
              onSave={(value) => onLeadUpdate('taxId', value)}
              className="font-mono"
            />
          </div>
        </div>
        
        <div className="podio-field-row">
          <div className="podio-field-label">Property Address</div>
          <div className="podio-field-value">
            <EditableField
              label=""
              value={lead.propertyAddress}
              onSave={(value) => onLeadUpdate('propertyAddress', value)}
            />
          </div>
        </div>
        
        {lead.currentArrears && (
          <div className="podio-field-row">
            <div className="podio-field-label">Current Arrears</div>
            <div className="podio-field-value">
              <EditableField
                label=""
                value={lead.currentArrears.toString()}
                onSave={handleCurrentArrearsUpdate}
                className="font-semibold text-green-600"
              />
            </div>
          </div>
        )}
        
        {lead.taxLawsuitNumber && (
          <div className="podio-field-row">
            <div className="podio-field-label">Tax Lawsuit Number</div>
            <div className="podio-field-value">
              <EditableField
                label=""
                value={lead.taxLawsuitNumber}
                onSave={(value) => onLeadUpdate('taxLawsuitNumber', value)}
                className="font-mono"
              />
            </div>
          </div>
        )}

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
          </div>
        </div>
      </div>
    </div>
  );
}

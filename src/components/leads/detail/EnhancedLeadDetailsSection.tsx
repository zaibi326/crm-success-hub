
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { TaxLead } from '@/types/taxLead';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { InlineEditField } from './InlineEditField';

interface EnhancedLeadDetailsSectionProps {
  lead: TaxLead;
  onFieldUpdate: (field: keyof TaxLead, value: string) => void;
  canEdit?: boolean;
}

const leadStatusOptions = [{
  value: 'HOT',
  label: '🔥 Hot Lead',
  color: 'text-red-600 bg-red-50 border-red-200'
}, {
  value: 'WARM',
  label: '🌤️ Warm Lead',
  color: 'text-orange-600 bg-orange-50 border-orange-200'
}, {
  value: 'COLD',
  label: '❄️ Cold Lead',
  color: 'text-blue-600 bg-blue-50 border-blue-200'
}, {
  value: 'PASS',
  label: '❌ Pass',
  color: 'text-gray-600 bg-gray-50 border-gray-200'
}, {
  value: 'KEEP',
  label: '✅ Keep',
  color: 'text-green-600 bg-green-50 border-green-200'
}];

const occupancyOptions = [{
  value: 'OWNER_OCCUPIED',
  label: '🏠 Owner Occupied',
  color: 'text-blue-600 bg-blue-50'
}, {
  value: 'TENANT_OCCUPIED',
  label: '🏘️ Tenant Occupied',
  color: 'text-purple-600 bg-purple-50'
}, {
  value: 'VACANT',
  label: '🏚️ Vacant',
  color: 'text-gray-600 bg-gray-50'
}, {
  value: 'UNKNOWN',
  label: '❓ Unknown',
  color: 'text-amber-600 bg-amber-50'
}];

export function EnhancedLeadDetailsSection({
  lead,
  onFieldUpdate,
  canEdit = true
}: EnhancedLeadDetailsSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleFieldUpdate = (field: keyof TaxLead, value: string) => {
    if (canEdit) {
      onFieldUpdate(field, value);
    }
  };

  const formatCurrency = (amount: number | undefined) => {
    if (!amount) return '';
    return amount.toString();
  };

  const handleCurrencyUpdate = (field: keyof TaxLead, value: string) => {
    const numValue = parseFloat(value.replace(/[$,]/g, ''));
    if (!isNaN(numValue)) {
      onFieldUpdate(field, numValue.toString());
    } else if (value === '') {
      onFieldUpdate(field, '');
    }
  };

  const getCurrentStatusColor = () => {
    const status = leadStatusOptions.find(option => option.value === lead.status);
    return status?.color || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  return (
    <Card className="bg-white shadow-lg border-0 rounded-xl overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 rounded-t-xl bg-gradient-to-r from-slate-50 to-gray-50">
            <CardTitle className="flex items-center justify-between text-xl font-bold text-gray-800">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-xl">Lead Details</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-3 py-1 rounded-full border font-medium ${getCurrentStatusColor()}`}>
                      {leadStatusOptions.find(option => option.value === lead.status)?.label || lead.status}
                    </span>
                  </div>
                </div>
              </div>
              {isOpen ? 
                <ChevronUp className="w-6 h-6 text-gray-500 transition-transform" /> : 
                <ChevronDown className="w-6 h-6 text-gray-500 transition-transform" />
              }
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="p-8 bg-gradient-to-br from-white to-slate-50">
            {!canEdit && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 mb-8 text-amber-800 text-sm shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔒</span>
                  <span className="font-medium">You don't have permission to edit lead details.</span>
                </div>
              </div>
            )}

            {/* 2-Column Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <InlineEditField
                  label="💎 Lead Status"
                  value={lead.status || ''}
                  onSave={(value) => handleFieldUpdate('status', value)}
                  type="select"
                  options={leadStatusOptions}
                  canEdit={canEdit}
                />

                <InlineEditField
                  label="🏷️ Tax ID"
                  value={lead.taxId || ''}
                  onSave={(value) => handleFieldUpdate('taxId', value)}
                  placeholder="Enter tax ID"
                  required
                  canEdit={canEdit}
                />

                <InlineEditField
                  label="👤 Owner Name"
                  value={lead.ownerName || ''}
                  onSave={(value) => handleFieldUpdate('ownerName', value)}
                  placeholder="Enter owner name"
                  required
                  canEdit={canEdit}
                />

                <InlineEditField
                  label="⚖️ Tax Lawsuit Number"
                  value={lead.taxLawsuitNumber || ''}
                  onSave={(value) => handleFieldUpdate('taxLawsuitNumber', value)}
                  placeholder="Enter lawsuit number"
                  canEdit={canEdit}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <InlineEditField
                  label="🏠 Occupancy Status"
                  value={lead.occupancyStatus || ''}
                  onSave={(value) => handleFieldUpdate('occupancyStatus', value)}
                  type="select"
                  options={occupancyOptions}
                  canEdit={canEdit}
                />

                <InlineEditField
                  label="💰 Current Arrears"
                  value={formatCurrency(lead.currentArrears)}
                  onSave={(value) => handleCurrencyUpdate('currentArrears', value)}
                  placeholder="Enter amount"
                  canEdit={canEdit}
                />

                <InlineEditField
                  label="🏡 Property Value"
                  value={formatCurrency(lead.propertyValue)}
                  onSave={(value) => handleCurrencyUpdate('propertyValue', value)}
                  placeholder="Enter property value"
                  canEdit={canEdit}
                />

                <InlineEditField
                  label="💵 Asking Price"
                  value={formatCurrency(lead.askingPrice)}
                  onSave={(value) => handleCurrencyUpdate('askingPrice', value)}
                  placeholder="Enter asking price"
                  canEdit={canEdit}
                />
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

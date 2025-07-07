
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LeadReviewCard } from './LeadReviewCard';
import { Eye, Edit, DollarSign } from 'lucide-react';

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

interface LeadsListProps {
  leads: TaxLead[];
  onLeadSelect: (lead: TaxLead) => void;
  onLeadUpdate: (lead: TaxLead) => void;
}

export function LeadsList({ leads, onLeadSelect, onLeadUpdate }: LeadsListProps) {
  const totalArrears = leads.reduce((sum, lead) => sum + (lead.currentArrears || 0), 0);

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-crm-primary to-crm-accent text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Portfolio Summary</h3>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-sm opacity-90">Total Leads</p>
                  <p className="text-2xl font-bold">{leads.length}</p>
                </div>
                <div>
                  <p className="text-sm opacity-90">Total Arrears</p>
                  <p className="text-2xl font-bold">${totalArrears.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <DollarSign className="w-12 h-12 opacity-20" />
          </div>
        </CardContent>
      </Card>

      {/* Leads Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {leads.map((lead) => (
          <div key={lead.id} className="relative">
            <LeadReviewCard
              lead={lead}
              onLeadUpdate={onLeadUpdate}
              onOpenDetailedForm={() => onLeadSelect(lead)}
            />
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="ghost"
                className="bg-white/90 hover:bg-white shadow-md"
                onClick={() => onLeadSelect(lead)}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {leads.length === 0 && (
        <Card className="shadow-lg border-0">
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Edit className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Leads Found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or add new leads to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

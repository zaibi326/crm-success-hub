
export type TaxLeadStatus = 'HOT' | 'WARM' | 'COLD' | 'PASS';
export type OccupancyStatus = 'VACANT' | 'OCCUPIED' | 'UNKNOWN' | 'OWNER_OCCUPIED' | 'TENANT_OCCUPIED';

export interface TaxLead {
  id: number;
  taxId: string;
  ownerName: string;
  propertyAddress: string;
  taxLawsuitNumber: string;
  currentArrears: number;
  status: TaxLeadStatus;
  notes: string;
  phone: string;
  email: string;
  firstName: string;
  lastName: string;
  temperature: 'HOT' | 'WARM' | 'COLD';
  occupancyStatus: OccupancyStatus;
  createdAt?: string;
  updatedAt?: string;
  supabaseId?: string;
  leadSource?: string;
  campaignId?: string;
  agentName?: string;
  askingPrice?: number;
  mortgagePrice?: number;
  ownerOfRecord?: string;
  attachedFiles?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
    uploadedAt: string;
  }>;
  hasDeath?: boolean;
  deathNotes?: string;
  hasProbate?: boolean;
  probateNotes?: string;
  hasLawsuit?: boolean;
  lawsuitNotes?: string;
  hasAdditionalTaxingEntities?: boolean;
  additionalTaxingNotes?: string;
  vestingDeedNotes?: string;
  vestingDeedDate?: string;
  grantorGranteeName?: string;
  disposition?: 'KEEP' | 'PASS' | 'UNDECIDED';
}


export interface TaxLead {
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
  // Enhanced fields for detailed lead information
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
  // File uploads
  probateDocuments?: File[];
  vestingDeedDocuments?: File[];
  // New comprehensive fields
  firstName: string;
  lastName: string;
  leadSource?: string;
  temperature: 'HOT' | 'WARM' | 'COLD';
  occupancyStatus: 'OWNER_OCCUPIED' | 'TENANT_OCCUPIED' | 'VACANT';
  agentName?: string;
  askingPrice?: number;
  mortgagePrice?: number;
  campaignId?: string;
  createdAt?: string;
  updatedAt?: string;
  attachedFiles?: File[];
}

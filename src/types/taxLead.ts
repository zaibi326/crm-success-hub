
export interface TaxLead {
  id: number;
  taxId: string;
  ownerName: string;
  firstName: string;
  lastName: string;
  propertyAddress: string;
  taxLawsuitNumber: string;
  currentArrears: number;
  status: 'HOT' | 'WARM' | 'COLD' | 'PASS';
  temperature: 'HOT' | 'WARM' | 'COLD';
  occupancyStatus: 'VACANT' | 'OWNER_OCCUPIED' | 'TENANT_OCCUPIED' | 'UNKNOWN';
  notes: string;
  phone: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
  supabaseId?: string; // For database operations
  
  // Additional properties used throughout the app
  leadSource?: string;
  agentName?: string;
  askingPrice?: number;
  mortgagePrice?: number;
  campaignId?: string;
  ownerOfRecord?: string;
  attachedFiles?: File[];
  
  // Conditional fields for additional information
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


export interface TaxLead {
  id: number;
  supabaseId?: string;
  firstName?: string;
  lastName?: string;
  ownerName: string;
  propertyAddress: string;
  sellerMailingAddress?: string; // Added separate field for seller's mailing address
  phone?: string;
  email?: string;
  leadSource?: string;
  status: 'HOT' | 'WARM' | 'COLD' | 'PASS' | 'KEEP';
  temperature: 'HOT' | 'WARM' | 'COLD';
  occupancyStatus: 'OWNER_OCCUPIED' | 'TENANT_OCCUPIED' | 'VACANT' | 'UNKNOWN';
  agentName?: string;
  notes?: string;
  askingPrice?: number;
  mortgagePrice?: number;
  currentArrears?: number;
  taxId?: string;
  campaignId?: string;
  taxLawsuitNumber?: string;
  attachedFiles?: AttachedFile[];
  createdAt?: string;
  updatedAt?: string;
  disposition?: 'UNDECIDED' | 'INTERESTED' | 'NOT_INTERESTED' | 'CALLBACK' | 'SOLD' | 'PASSED' | 'QUALIFIED' | 'DISQUALIFIED';
  vestingDeedDate?: string;
  grantorGranteeName?: string;
  createdVia?: string;
  tags?: string[];
  leadManager?: string;
  
  // Additional properties that were missing
  ownerOfRecord?: string;
  hasDeath?: boolean;
  deathNotes?: string;
  hasProbate?: boolean;
  probateNotes?: string;
  hasLawsuit?: boolean;
  lawsuitNotes?: string;
  hasAdditionalTaxingEntities?: boolean;
  additionalTaxingNotes?: string;
}

export interface AttachedFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
}

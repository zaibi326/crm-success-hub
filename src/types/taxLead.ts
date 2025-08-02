export interface TaxLead {
  id: number;
  taxId: string;
  ownerName: string;
  propertyAddress: string;
  taxLawsuitNumber?: string;
  currentArrears?: number;
  status: 'HOT' | 'WARM' | 'COLD' | 'PASS' | 'KEEP';
  email?: string;
  phone?: string;
  notes?: string;
  firstName?: string;
  lastName?: string;
  temperature: 'HOT' | 'WARM' | 'COLD';
  occupancyStatus: 'OCCUPIED' | 'VACANT' | 'OWNER_OCCUPIED' | 'TENANT_OCCUPIED' | 'UNKNOWN';
  disposition: 'UNDECIDED' | 'QUALIFIED' | 'DISQUALIFIED';
  passReason?: string;
  createdAt?: string;
  updatedAt?: string;
  propertyType?: string;
  yearBuilt?: string;
  squareFootage?: string;
  lotSize?: string;
  propertyValue?: number;
  heirs?: Heir[];
  attachedFiles?: AttachedFile[];
  tags?: string[];
  leadManager?: string;
  createdVia?: string;
  
  // Additional Information fields
  hasDeath?: boolean;
  deathNotes?: string;
  hasProbate?: boolean;
  probateNotes?: string;
  hasLawsuit?: boolean;
  lawsuitNotes?: string;
  hasAdditionalTaxingEntities?: boolean;
  additionalTaxingNotes?: string;
  
  // Property ownership fields
  vestingDeedDate?: string;
  grantorGranteeName?: string;
  ownerOfRecord?: string;
  
  // Financial fields
  askingPrice?: number;
  mortgagePrice?: number;
  
  // Lead information fields
  leadSource?: string;
  campaignId?: string;
  agentName?: string;
}

export interface Heir {
  id: string;
  name: string;
  relationship: string;
  percentage: number;
  address?: string;
  phone?: string;
  email?: string;
  dateOfBirth?: string;
  ssn?: string;
}

export interface AttachedFile {
  id: string;
  name: string;
  url: string;
  type?: string;
  size?: number;
  uploadedAt: string;
}

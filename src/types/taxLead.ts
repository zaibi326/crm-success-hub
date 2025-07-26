

export interface TaxLead {
  id: number;
  taxId: string;
  ownerName: string;
  propertyAddress: string; // Main property address for lead details
  sellerPropertyAddress?: string; // Separate field for seller contact section
  taxLawsuitNumber: string;
  currentArrears: number;
  status: 'HOT' | 'WARM' | 'COLD' | 'PASS' | 'KEEP';
  notes: string;
  phone: string;
  email: string;
  firstName: string;
  lastName: string;
  temperature: 'HOT' | 'WARM' | 'COLD';
  occupancyStatus: 'OWNER_OCCUPIED' | 'TENANT_OCCUPIED' | 'VACANT' | 'UNKNOWN';
  disposition: 'UNDECIDED' | 'QUALIFIED' | 'DISQUALIFIED';
  createdAt: string;
  updatedAt: string;
  createdVia?: string;
  tags?: string[];
  leadManager?: string;
  ownerOfRecord?: string;
  attachedFiles?: { id: string; name: string; url: string; type?: string; size?: number }[];
  
  // Financial fields
  askingPrice?: number;
  mortgagePrice?: number;
  
  // Lead source and campaign fields
  leadSource?: string;
  campaignId?: string;
  agentName?: string;
  
  // Additional information fields
  hasDeath?: boolean;
  deathNotes?: string;
  hasProbate?: boolean;
  probateNotes?: string;
  hasLawsuit?: boolean;
  lawsuitNotes?: string;
  hasAdditionalTaxingEntities?: boolean;
  additionalTaxingNotes?: string;
  
  // Conditional fields
  vestingDeedDate?: string;
  grantorGranteeName?: string;
}


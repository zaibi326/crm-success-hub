
export interface TaxLead {
  id: number;
  taxId: string;
  ownerName: string;
  firstName?: string;
  lastName?: string;
  propertyAddress: string;
  sellerContactAddress?: string;
  currentArrears?: number;
  status: 'HOT' | 'WARM' | 'COLD' | 'PASS' | 'KEEP';
  temperature?: 'HOT' | 'WARM' | 'COLD' | 'PASS';
  email?: string;
  phone?: string;
  taxLawsuitNumber?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  createdVia?: string;
  createdBy?: string; // UUID of the user who created the lead
  leadManager?: string; // UUID of the lead manager
  tags?: string[];
  occupancyStatus?: string;
  
  // Lead Information
  leadSource?: string;
  campaignId?: string;
  agentName?: string;
  disposition?: 'UNDECIDED' | 'QUALIFIED' | 'DISQUALIFIED';
  
  // Financial Information
  askingPrice?: number;
  mortgagePrice?: number;
  propertyValue?: number;
  taxAmount?: number;
  
  // Location Information
  county?: string;
  state?: string;
  
  // Property Information
  propertyType?: string;
  yearBuilt?: string;
  squareFootage?: string;
  lotSize?: string;
  
  // Additional Information Fields
  hasDeath?: boolean;
  deathNotes?: string;
  hasProbate?: boolean;
  probateNotes?: string;
  hasLawsuit?: boolean;
  lawsuitNotes?: string;
  hasAdditionalTaxingEntities?: boolean;
  additionalTaxingNotes?: string;
  
  // Conditional Fields
  vestingDeedDate?: string;
  grantorGranteeName?: string;
  ownerOfRecord?: string;
  
  // Attachments - Updated with size property
  attachedFiles?: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    preview?: string;
    size?: number;
  }>;
}

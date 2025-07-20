
export interface TaxLead {
  id: number;
  taxId: string;
  ownerName: string;
  firstName?: string;
  lastName?: string;
  propertyAddress: string;
  currentArrears?: number;
  status: 'HOT' | 'WARM' | 'COLD' | 'PASS';
  temperature?: 'HOT' | 'WARM' | 'COLD' | 'PASS';
  email?: string;
  phone?: string;
  taxLawsuitNumber?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  createdVia?: string;
  leadManager?: string;
  tags?: string[];
  occupancyStatus?: string;
  
  // Financial Information
  askingPrice?: number;
  mortgagePrice?: number;
  
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
  
  // Attachments
  attachedFiles?: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    preview?: string;
  }>;
}


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

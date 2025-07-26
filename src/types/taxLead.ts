
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
  attachedFiles?: { id: string; name: string; url: string }[];
}

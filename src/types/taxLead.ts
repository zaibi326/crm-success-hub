
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
  occupancyStatus: 'VACANT' | 'OCCUPIED' | 'UNKNOWN';
  notes: string;
  phone: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
  supabaseId?: string; // For database operations
}


export interface TaxLead {
  id: number;
  taxId: string;
  ownerName: string;
  propertyAddress: string;
  currentArrears?: number;
  status: string;
  email?: string;
  phone?: string;
  taxLawsuitNumber?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  createdVia?: string;
  leadManager?: string;
  tags?: string[];
}

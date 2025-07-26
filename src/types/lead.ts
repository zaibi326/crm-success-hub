// Lead type definitions
export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  status: 'HOT' | 'WARM' | 'COLD' | 'PASS' | 'KEEP';
  score: number;
  notes: string;
  avatar?: string;
  tags: string[];
}

// Add compatibility type for TaxLead status
export type CompatibleLeadStatus = 'HOT' | 'WARM' | 'COLD' | 'PASS';

// Helper function to convert TaxLead status to Lead status
export const convertTaxLeadStatusToLeadStatus = (status: 'HOT' | 'WARM' | 'COLD' | 'PASS' | 'KEEP'): CompatibleLeadStatus => {
  if (status === 'KEEP') {
    return 'WARM'; // Default fallback for KEEP status
  }
  return status as CompatibleLeadStatus;
};

// Helper function to convert TaxLead to Lead for compatibility
export const convertTaxLeadToLead = (taxLead: any): Lead => {
  return {
    id: taxLead.id,
    name: taxLead.ownerName,
    email: taxLead.email,
    phone: taxLead.phone,
    company: '',
    position: '',
    address: taxLead.propertyAddress,
    city: '',
    state: '',
    zip: '',
    status: convertTaxLeadStatusToLeadStatus(taxLead.status),
    score: 0,
    notes: taxLead.notes,
    avatar: '',
    tags: taxLead.tags || []
  };
};

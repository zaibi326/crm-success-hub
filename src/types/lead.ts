
export interface Lead {
  id: number;
  taxId: string;
  ownerName: string;
  propertyAddress: string;
  taxLawsuitNumber: string;
  currentArrears: number;
  status: 'HOT' | 'WARM' | 'COLD' | 'PASS' | 'KEEP';
  notes: string;
  phone: string;
  email: string;
  firstName: string;
  lastName: string;
  temperature: 'HOT' | 'WARM' | 'COLD';
  occupancyStatus: 'OWNER_OCCUPIED' | 'TENANT_OCCUPIED' | 'VACANT';
  disposition: 'UNDECIDED' | 'QUALIFIED' | 'DISQUALIFIED';
  createdAt?: string;
  updatedAt?: string;
  leadSource?: string;
  agentName?: string;
  campaignId?: string;
  askingPrice?: number;
  mortgagePrice?: number;
  sellerContactAddress?: string;
  
  // Additional properties that were missing
  attachedFiles?: Array<{
    id: string;
    name: string;
    url: string;
    type?: string;
    size?: number;
    uploadedAt?: string;
  }>;
  
  // Death-related fields
  hasDeath?: boolean;
  deathNotes?: string;
  
  // Probate-related fields
  hasProbate?: boolean;
  probateNotes?: string;
  
  // Lawsuit-related fields
  hasLawsuit?: boolean;
  lawsuitNotes?: string;
  
  // Additional taxing entities
  hasAdditionalTaxingEntities?: boolean;
  additionalTaxingNotes?: string;
  
  // Ownership details
  ownerOfRecord?: string;
  vestingDeedDate?: string;
  grantorGranteeName?: string;
  
  // Lead management
  leadManager?: string;
  createdVia?: string;
  tags?: string[];
}

export interface LeadActivity {
  id: string;
  leadId: number;
  actionType: 'created' | 'updated' | 'contacted' | 'note_added' | 'status_changed';
  description: string;
  timestamp: Date;
  userName: string;
  metadata?: any;
}

export interface LeadFilters {
  status?: string;
  temperature?: string;
  occupancyStatus?: string;
  disposition?: string;
  leadSource?: string;
  agentName?: string;
  dateRange?: {
    start?: Date;
    end?: Date;
  };
  arrearsRange?: {
    min?: number;
    max?: number;
  };
}

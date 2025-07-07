import React, { useState, useEffect } from 'react';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { LeadsHeader } from './LeadsHeader';
import { LeadsFilters } from './LeadsFilters';
import { LeadsList } from './LeadsList';
import { LeadDetailView } from './LeadDetailView';

interface TaxLead {
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

const initialMockLeads: TaxLead[] = [
  {
    id: 1,
    taxId: "TAX-2024-001",
    ownerName: "John Smith",
    propertyAddress: "123 Main St, Anytown, CA 91234",
    email: "john.123@gmail.com",
    phone: "555-123-4567",
    status: "HOT",
    currentArrears: 15000,
    taxLawsuitNumber: "LS-2024-001",
    notes: "Property has significant arrears. Owner interested in quick sale.",
    ownerOfRecord: "John Smith",
    hasDeath: false,
    hasProbate: false,
    hasLawsuit: true,
    lawsuitNotes: "Tax lawsuit filed in January 2024",
    hasAdditionalTaxingEntities: false,
    vestingDeedNotes: "Clear title, no liens"
  },
  {
    id: 2,
    taxId: "TAX-2024-002",
    ownerName: "Emily Johnson Estate",
    propertyAddress: "456 Oak Ave, Springfield, IL 62704",
    email: "emily.j@yahoo.com",
    phone: "555-987-6543",
    status: "WARM",
    currentArrears: 8500,
    notes: "Estate property, heirs need to resolve tax issues.",
    ownerOfRecord: "Emily Johnson (Deceased)",
    hasDeath: true,
    deathNotes: "Owner deceased in 2023, estate in probate",
    hasProbate: true,
    probateNotes: "Probate case #PR-2023-456",
    hasLawsuit: false,
    hasAdditionalTaxingEntities: true,
    additionalTaxingNotes: "School district taxes also delinquent",
    vestingDeedNotes: "Inherited property, deed needs updating"
  },
  {
    id: 3,
    taxId: "TAX-2024-003",
    ownerName: "Michael Brown",
    propertyAddress: "789 Pine Ln, Hill Valley, GA 30303",
    email: "mike.brown@test.com",
    phone: "555-555-1212",
    status: "COLD",
    currentArrears: 3200,
    notes: "Small arrears amount, owner not responsive.",
    ownerOfRecord: "Michael Brown",
    hasDeath: false,
    hasProbate: false,
    hasLawsuit: false,
    hasAdditionalTaxingEntities: false,
    vestingDeedNotes: "Standard residential property"
  },
  {
    id: 4,
    taxId: "TAX-2024-004",
    ownerName: "Alice Williams Trust",
    propertyAddress: "101 Elm St, Gotham, NY 10001",
    email: "alice.w@example.com",
    phone: "555-444-5555",
    status: "PASS",
    currentArrears: 1200,
    notes: "Trust property, minimal arrears, not pursuing.",
    ownerOfRecord: "Alice Williams Family Trust",
    hasDeath: false,
    hasProbate: false,
    hasLawsuit: false,
    hasAdditionalTaxingEntities: false,
    vestingDeedNotes: "Trust-owned property"
  },
  {
    id: 5,
    taxId: "TAX-2024-005",
    ownerName: "David Garcia",
    propertyAddress: "222 Maple Dr, Metropolis, FL 33101",
    email: "d.garcia@sample.com",
    phone: "555-222-3333",
    status: "HOT",
    currentArrears: 22000,
    taxLawsuitNumber: "LS-2024-089",
    notes: "High-value property with substantial arrears. Good investment opportunity.",
    ownerOfRecord: "David Garcia",
    hasDeath: false,
    hasProbate: false,
    hasLawsuit: true,
    lawsuitNotes: "Lawsuit filed, foreclosure proceedings started",
    hasAdditionalTaxingEntities: true,
    additionalTaxingNotes: "Multiple taxing entities involved",
    vestingDeedNotes: "Commercial property, complex ownership structure"
  }
];

// Key for localStorage
const LEADS_STORAGE_KEY = 'tax-leads-data';

export function LeadsContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('ownerName');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedLead, setSelectedLead] = useState<TaxLead | null>(null);
  const [mockLeads, setMockLeads] = useState<TaxLead[]>([]);
  const { canViewAllLeads } = useRoleAccess();

  // Load leads from localStorage on component mount
  useEffect(() => {
    const savedLeads = localStorage.getItem(LEADS_STORAGE_KEY);
    if (savedLeads) {
      try {
        const parsedLeads = JSON.parse(savedLeads);
        setMockLeads(parsedLeads);
      } catch (error) {
        console.error('Error parsing saved leads:', error);
        setMockLeads(initialMockLeads);
      }
    } else {
      setMockLeads(initialMockLeads);
    }
  }, []);

  // Save leads to localStorage whenever mockLeads changes
  useEffect(() => {
    if (mockLeads.length > 0) {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(mockLeads));
    }
  }, [mockLeads]);

  const handleAddLead = (newLead: TaxLead) => {
    setMockLeads(prev => {
      const updatedLeads = [...prev, newLead];
      return updatedLeads;
    });
  };

  const filteredLeads = mockLeads.filter(lead => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      lead.ownerName.toLowerCase().includes(searchTermLower) ||
      lead.taxId.toLowerCase().includes(searchTermLower) ||
      lead.propertyAddress.toLowerCase().includes(searchTermLower) ||
      (lead.email && lead.email.toLowerCase().includes(searchTermLower))
    );
  }).filter(lead => {
    if (filterStatus === 'all') return true;
    return lead.status.toLowerCase() === filterStatus.toLowerCase();
  }).sort((a, b) => {
    switch (sortBy) {
      case 'ownerName':
        return a.ownerName.localeCompare(b.ownerName);
      case 'currentArrears':
        return (b.currentArrears || 0) - (a.currentArrears || 0);
      case 'taxId':
        return a.taxId.localeCompare(b.taxId);
      default:
        return 0;
    }
  });

  const handleLeadUpdate = (updatedLead: TaxLead) => {
    setMockLeads(prev => prev.map(lead => 
      lead.id === updatedLead.id ? updatedLead : lead
    ));
    setSelectedLead(updatedLead);
  };

  return (
    <div className="flex flex-col h-full">
      <LeadsHeader onAddLead={handleAddLead} />
      
      {!selectedLead && (
        <LeadsFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterStatus={filterStatus}
          onFilterStatusChange={setFilterStatus}
          sortBy={sortBy}
          onSortByChange={setSortBy}
        />
      )}

      <main className="flex-1 p-6 bg-gradient-to-br from-gray-50/30 to-white overflow-y-auto">
        {!selectedLead ? (
          <LeadsList 
            leads={filteredLeads}
            onLeadSelect={setSelectedLead}
            onLeadUpdate={handleLeadUpdate}
          />
        ) : (
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => setSelectedLead(null)}
              className="mb-4 text-crm-primary hover:text-crm-primary/80 flex items-center gap-2"
            >
              ← Back to Leads
            </button>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">{selectedLead.ownerName}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p><strong>Tax ID:</strong> {selectedLead.taxId}</p>
                  <p><strong>Property:</strong> {selectedLead.propertyAddress}</p>
                  <p><strong>Status:</strong> {selectedLead.status}</p>
                </div>
                <div>
                  <p><strong>Current Arrears:</strong> ${selectedLead.currentArrears?.toLocaleString() || 'N/A'}</p>
                  <p><strong>Phone:</strong> {selectedLead.phone || 'N/A'}</p>
                  <p><strong>Email:</strong> {selectedLead.email || 'N/A'}</p>
                </div>
              </div>
              {selectedLead.notes && (
                <div className="mt-4">
                  <p><strong>Notes:</strong> {selectedLead.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

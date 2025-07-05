
import React, { useState } from 'react';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { LeadsHeader } from './LeadsHeader';
import { LeadsFilters } from './LeadsFilters';
import { LeadsList } from './LeadsList';
import { LeadDetailView } from './LeadDetailView';

interface Lead {
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
  status: 'HOT' | 'WARM' | 'COLD' | 'PASS';
  score: number;
  notes: string;
  avatar?: string;
  tags: string[];
}

const initialMockLeads: Lead[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john.123@gmail.com",
    phone: "555-123-4567",
    company: "ABC Corp",
    position: "CEO",
    address: "123 Main St",
    city: "Anytown",
    state: "CA",
    zip: "91234",
    status: "HOT",
    score: 95,
    notes: "Interested in expanding their business.",
    avatar: "https://github.com/shadcn.png",
    tags: ["Tax Lien", "Real Estate", "Investor"]
  },
  {
    id: 2,
    name: "Emily Johnson",
    email: "emily.j@yahoo.com",
    phone: "555-987-6543",
    company: "XYZ Inc",
    position: "Marketing Manager",
    address: "456 Oak Ave",
    city: "Springfield",
    state: "IL",
    zip: "62704",
    status: "WARM",
    score: 78,
    notes: "Needs more information on our services.",
    avatar: "https://avatars.githubusercontent.com/u/88843?v=4",
    tags: ["Probate", "Estate Planning"]
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "mike.brown@test.com",
    phone: "555-555-1212",
    company: "123 Corp",
    position: "Sales Director",
    address: "789 Pine Ln",
    city: "Hill Valley",
    state: "GA",
    zip: "30303",
    status: "COLD",
    score: 32,
    notes: "Not currently interested.",
    tags: ["Bankruptcy", "Debt Relief"]
  },
  {
    id: 4,
    name: "Alice Williams",
    email: "alice.w@example.com",
    phone: "555-444-5555",
    company: "Acme Co",
    position: "CTO",
    address: "101 Elm St",
    city: "Gotham",
    state: "NY",
    zip: "10001",
    status: "PASS",
    score: 12,
    notes: "Already has a solution in place.",
    tags: ["Tax Lien", "Real Estate"]
  },
  {
    id: 5,
    name: "David Garcia",
    email: "d.garcia@sample.com",
    phone: "555-222-3333",
    company: "Sample Inc",
    position: "Project Manager",
    address: "222 Maple Dr",
    city: "Metropolis",
    state: "FL",
    zip: "33101",
    status: "HOT",
    score: 88,
    notes: "Looking for a long-term partnership.",
    tags: ["Probate", "Estate Planning", "Investor"]
  },
  {
    id: 6,
    name: "Linda Rodriguez",
    email: "linda.r@domain.com",
    phone: "555-777-8888",
    company: "Domain Corp",
    position: "HR Manager",
    address: "333 Oak St",
    city: "Smallville",
    state: "KS",
    zip: "66601",
    status: "WARM",
    score: 65,
    notes: "Evaluating different options.",
    tags: ["Bankruptcy", "Debt Relief"]
  }
];

export function LeadsContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [mockLeads, setMockLeads] = useState<Lead[]>(initialMockLeads);
  const { canViewAllLeads } = useRoleAccess();

  const filteredLeads = mockLeads.filter(lead => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      lead.name.toLowerCase().includes(searchTermLower) ||
      lead.email.toLowerCase().includes(searchTermLower) ||
      lead.company.toLowerCase().includes(searchTermLower)
    );
  }).filter(lead => {
    if (filterStatus === 'all') return true;
    return lead.status.toLowerCase() === filterStatus.toLowerCase();
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'score':
        return b.score - a.score;
      default:
        return 0;
    }
  });

  const handleStatusChange = (status: 'HOT' | 'WARM' | 'COLD' | 'PASS') => {
    if (selectedLead) {
      setMockLeads(prev => prev.map(l => 
        l.id === selectedLead.id ? { ...l, status } : l
      ));
      setSelectedLead(prev => prev ? { ...prev, status } : null);
    }
  };

  const handleSave = (updatedLead: Lead) => {
    setMockLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
    setSelectedLead(updatedLead);
  };

  return (
    <div className="flex flex-col h-full">
      <LeadsHeader />
      
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
            onSelectLead={setSelectedLead} 
          />
        ) : (
          <LeadDetailView
            lead={selectedLead}
            onBack={() => setSelectedLead(null)}
            onStatusChange={handleStatusChange}
            onSave={handleSave}
            canEdit={canViewAllLeads}
          />
        )}
      </main>
    </div>
  );
}

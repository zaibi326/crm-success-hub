import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Filter, ChevronDown, MoreVertical } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LeadHeader } from './LeadHeader';
import { LeadInsights } from './LeadInsights';
import { LeadDetailsForm } from './LeadDetailsForm';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { Badge } from '@/components/ui/badge';
import { LeadStatusButtons } from './LeadStatusButtons';
import { EnhancedLeadContactInfo } from './EnhancedLeadContactInfo';

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

const mockLeads: Lead[] = [
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
  const [mockLeads, setMockLeads] = useState<Lead[]>(mockLeads);
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

  const renderLeadItem = (lead: Lead) => (
    <Card key={lead.id} className="bg-white/95 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow duration-200 border-0">
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={lead.avatar} />
            <AvatarFallback>{lead.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg font-semibold">{lead.name}</CardTitle>
            <div className="text-sm text-gray-500">{lead.company}</div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setSelectedLead(lead)}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Edit Lead
            </DropdownMenuItem>
            <DropdownMenuItem>
              Delete Lead
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">Status</div>
          <Badge variant="secondary">{lead.status}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">Score</div>
          <div className="font-medium">{lead.score}</div>
        </div>
      </CardContent>
    </Card>
  );

  const renderLeadDetails = (lead: Lead) => (
    <div className="space-y-6">
      <LeadHeader lead={lead} onBack={() => setSelectedLead(null)} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <EnhancedLeadContactInfo lead={lead} />
        </div>
        
        <div className="space-y-6">
          <LeadInsights lead={lead} />
          <LeadStatusButtons 
            leadId={lead.id}
            currentStatus={lead.status}
            onStatusChange={(status) => {
              setMockLeads(prev => prev.map(l => 
                l.id === lead.id ? { ...l, status } : l
              ));
              setSelectedLead(prev => prev ? { ...prev, status } : null);
            }}
          />
        </div>
      </div>
      
      <LeadDetailsForm 
        lead={lead} 
        onSave={(updatedLead) => {
          setMockLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
          setSelectedLead(updatedLead);
        }}
        canEdit={canViewAllLeads}
      />
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-200/60 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Current Deals</h1>
              <p className="text-sm text-gray-600 mt-0.5">
                Manage and view your current leads and opportunities
              </p>
            </div>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
            <Plus className="w-4 h-4 mr-2" />
            Add New Lead
          </Button>
        </div>
      </header>

      <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-200/60">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white shadow-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40 bg-white shadow-sm border-gray-200">
                <Filter className="w-4 h-4 mr-2 text-gray-400" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="hot">Hot</SelectItem>
                <SelectItem value="warm">Warm</SelectItem>
                <SelectItem value="cold">Cold</SelectItem>
                <SelectItem value="pass">Pass</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 bg-white shadow-sm border-gray-200">
                <ChevronDown className="w-4 h-4 mr-2 text-gray-400" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg">
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="score">Score</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <main className="flex-1 p-6 bg-gradient-to-br from-gray-50/30 to-white overflow-y-auto">
        {!selectedLead ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLeads.map(lead => renderLeadItem(lead))}
          </div>
        ) : (
          renderLeadDetails(selectedLead)
        )}
      </main>
    </div>
  );
}


import React, { useState } from 'react';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardStats } from './DashboardStats';
import { ActivityFeed } from './ActivityFeed';
import { LeadsPieChart } from './LeadsPieChart';
import { TaxLeadDetailView } from '@/components/leads/TaxLeadDetailView';
import { TaxLead } from '@/types/taxLead';
import { BarChart3, Users, Activity } from 'lucide-react';

interface DashboardContentProps {
  userRole: string;
  showLeadsInDashboard?: boolean;
}

// Mock data for demonstration
const mockLeads: TaxLead[] = [
  {
    id: 1,
    taxId: 'TX123456789',
    ownerName: 'Mario Rojas',
    propertyAddress: '10445 W Palmer Ave, Melrose Park, IL 60164',
    taxLawsuitNumber: 'TL-2024-001',
    currentArrears: 15000,
    status: 'HOT',
    notes: 'High-value property with significant arrears',
    phone: '(555) 123-4567',
    email: 'mario.rojas@email.com',
    ownerOfRecord: 'Mario Rojas'
  },
  {
    id: 2,
    taxId: 'TX987654321',
    ownerName: 'Jose Martinez',
    propertyAddress: '5023 149th St, Oak Forest, IL 60452',
    taxLawsuitNumber: 'TL-2024-002',
    currentArrears: 8500,
    status: 'WARM',
    notes: 'Property owner contacted previously',
    phone: '(555) 987-6543',
    email: 'jose.martinez@email.com',
    ownerOfRecord: 'Jose Martinez Estate'
  },
  {
    id: 3,
    taxId: 'TX456789123',
    ownerName: 'Nasreen Khan',
    propertyAddress: '9256 KILPATRICK AVE, Skokie, IL 60076',
    taxLawsuitNumber: 'TL-2024-003',
    currentArrears: 3200,
    status: 'COLD',
    notes: 'Small arrears, low priority',
    phone: '(555) 456-7890',
    ownerOfRecord: 'Nasreen Khan'
  },
  {
    id: 4,
    taxId: 'TX789123456',
    ownerName: 'Arthur Dejong',
    propertyAddress: '15645 State St, South Holland, IL 60473',
    taxLawsuitNumber: 'TL-2024-004',
    currentArrears: 12000,
    status: 'WARM',
    notes: 'Response needed from Charles',
    phone: '(555) 789-1234',
    ownerOfRecord: 'Arthur Dejong'
  },
  {
    id: 5,
    taxId: 'TX321654987',
    ownerName: 'Michael Moody',
    propertyAddress: '1819 Oak Park Ave APT 1, Berwyn, IL 60402',
    taxLawsuitNumber: 'TL-2024-005',
    currentArrears: 6500,
    status: 'HOT',
    notes: 'Hot lead, immediate attention required',
    phone: '(555) 321-6549',
    ownerOfRecord: 'Michael Moody Jr.'
  }
];

export function DashboardContent({ userRole, showLeadsInDashboard = false }: DashboardContentProps) {
  const [selectedLead, setSelectedLead] = useState<TaxLead | null>(null);

  if (selectedLead) {
    return (
      <SidebarInset className="flex-1 overflow-auto">
        <TaxLeadDetailView 
          selectedLead={selectedLead}
          onBack={() => setSelectedLead(null)}
        />
      </SidebarInset>
    );
  }

  return (
    <SidebarInset className="flex-1 overflow-auto">
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-200/60 px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg transition-all duration-200" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-600 mt-0.5">
              Welcome back! Here's what's happening with your business today.
            </p>
          </div>
        </div>
      </header>

      <main className="p-6 bg-gradient-to-br from-gray-50/30 to-white">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="leads" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Leads
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <DashboardStats userRole={userRole} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LeadsPieChart />
              <ActivityFeed userRole={userRole} />
            </div>
          </TabsContent>

          <TabsContent value="leads" className="space-y-6">
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Lead Management</h3>
              <p className="text-gray-600">
                Access lead management features through the dedicated Current Deals section.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <ActivityFeed userRole={userRole} />
          </TabsContent>
        </Tabs>
      </main>
    </SidebarInset>
  );
}

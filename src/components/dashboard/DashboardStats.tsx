
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Flame, 
  Thermometer, 
  Snowflake,
  X
} from 'lucide-react';

interface DashboardStatsProps {
  userRole: string;
}

export function DashboardStats({ userRole }: DashboardStatsProps) {
  // Mock data - replace with actual API calls
  const stats = {
    activeCampaigns: 12,
    hotDeals: 45,
    warmDeals: 78,
    coldDeals: 123,
    passedLeads: 34,
    totalLeads: 280,
    passPercentage: Math.round((34 / 280) * 100)
  };

  const activeCampaigns = [
    {
      id: 1,
      name: "Q4 Tax Lien Campaign",
      progress: 78,
      signedDeals: 12,
      equityPurchased: "$450,000",
      expenditure: "$125,000",
      status: "active"
    },
    {
      id: 2,
      name: "Commercial Properties Drive",
      progress: 45,
      signedDeals: 8,
      equityPurchased: "$320,000",
      expenditure: "$89,000",
      status: "active"
    },
    {
      id: 3,
      name: "Residential Tax Recovery",
      progress: 92,
      signedDeals: 23,
      equityPurchased: "$780,000",
      expenditure: "$210,000",
      status: "completing"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Deal Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800">HOT Deals</CardTitle>
            <Flame className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">{stats.hotDeals}</div>
            <p className="text-xs text-red-600 mt-1">Ready to close</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">WARM Deals</CardTitle>
            <Thermometer className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{stats.warmDeals}</div>
            <p className="text-xs text-orange-600 mt-1">In progress</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">COLD Deals</CardTitle>
            <Snowflake className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats.coldDeals}</div>
            <p className="text-xs text-blue-600 mt-1">Need attention</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-800">Pass Rate</CardTitle>
            <X className="h-5 w-5 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.passPercentage}%</div>
            <p className="text-xs text-gray-600 mt-1">{stats.passedLeads} of {stats.totalLeads} leads</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Campaigns */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-crm-primary" />
            Active Campaigns ({stats.activeCampaigns})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeCampaigns.map((campaign) => (
              <div key={campaign.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{campaign.name}</h3>
                    <Badge variant={campaign.status === 'completing' ? 'default' : 'secondary'}>
                      {campaign.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    Progress: {campaign.progress}%
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className="bg-gradient-to-r from-crm-primary to-crm-accent h-2 rounded-full transition-all duration-300"
                    style={{ width: `${campaign.progress}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-green-600" />
                    <span className="text-gray-600">Signed Deals:</span>
                    <span className="font-semibold">{campaign.signedDeals}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-600">Equity:</span>
                    <span className="font-semibold text-green-700">{campaign.equityPurchased}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-red-600" />
                    <span className="text-gray-600">Expenditure:</span>
                    <span className="font-semibold text-red-700">{campaign.expenditure}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

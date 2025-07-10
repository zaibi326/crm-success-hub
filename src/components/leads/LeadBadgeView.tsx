
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Users, DollarSign, Phone, Mail } from 'lucide-react';
import { TaxLead } from '@/types/taxLead';

interface LeadBadgeViewProps {
  leads: TaxLead[];
  onLeadSelect: (lead: TaxLead) => void;
  getStatusBadge: (status: string) => string;
}

export function LeadBadgeView({ leads, onLeadSelect, getStatusBadge }: LeadBadgeViewProps) {
  // Calculate statistics
  const stats = {
    total: leads.length,
    hot: leads.filter(l => l.status === 'HOT').length,
    warm: leads.filter(l => l.status === 'WARM').length,
    cold: leads.filter(l => l.status === 'COLD').length,
    pass: leads.filter(l => l.status === 'PASS').length,
    totalArrears: leads.reduce((sum, lead) => sum + (lead.currentArrears || 0), 0),
    withPhone: leads.filter(l => l.phone).length,
    withEmail: leads.filter(l => l.email).length,
    avgArrears: leads.length > 0 ? leads.reduce((sum, lead) => sum + (lead.currentArrears || 0), 0) / leads.length : 0
  };

  const statusStats = [
    { status: 'HOT', count: stats.hot, color: 'bg-red-100 text-red-800 border-red-200', icon: TrendingUp },
    { status: 'WARM', count: stats.warm, color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: TrendingUp },
    { status: 'COLD', count: stats.cold, color: 'bg-blue-100 text-blue-800 border-blue-200', icon: TrendingDown },
    { status: 'PASS', count: stats.pass, color: 'bg-gray-100 text-gray-800 border-gray-200', icon: TrendingDown }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Leads</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">${stats.totalArrears.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Arrears</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Phone className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{stats.withPhone}</p>
                <p className="text-sm text-gray-600">With Phone</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Mail className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{stats.withEmail}</p>
                <p className="text-sm text-gray-600">With Email</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statusStats.map(({ status, count, color, icon: Icon }) => (
              <div key={status} className={`p-4 rounded-lg border-2 ${color}`}>
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-6 h-6" />
                  <Badge variant="secondary">{status}</Badge>
                </div>
                <div className="text-3xl font-bold mb-1">{count}</div>
                <div className="text-sm opacity-75">
                  {stats.total > 0 ? Math.round((count / stats.total) * 100) : 0}% of total
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Leads by Arrears */}
      <Card>
        <CardHeader>
          <CardTitle>Top Leads by Arrears</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leads
              .filter(lead => lead.currentArrears && lead.currentArrears > 0)
              .sort((a, b) => (b.currentArrears || 0) - (a.currentArrears || 0))
              .slice(0, 10)
              .map((lead, index) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => onLeadSelect(lead)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold">{lead.ownerName}</div>
                      <div className="text-sm text-gray-600 truncate max-w-[300px]">
                        {lead.propertyAddress}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusBadge(lead.status)}>
                      {lead.status}
                    </Badge>
                    <div className="text-right">
                      <div className="font-bold text-green-600">
                        ${lead.currentArrears?.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">Arrears</div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {leads.slice(0, 5).map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                onClick={() => onLeadSelect(lead)}
              >
                <div className="flex items-center gap-3">
                  <div className="font-medium">{lead.ownerName}</div>
                  <Badge className={getStatusBadge(lead.status)} variant="secondary">
                    {lead.status}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm">
                  View →
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

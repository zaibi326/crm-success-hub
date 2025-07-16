
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Users, Edit } from 'lucide-react';
import { TaxLead } from '@/types/taxLead';
import { InlineEditField } from './InlineEditField';
import { useToast } from '@/hooks/use-toast';

interface SimplifiedOwnershipSectionProps {
  lead: TaxLead;
  onFieldUpdate: (field: keyof TaxLead, value: string) => void;
  canEdit?: boolean;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export function SimplifiedOwnershipSection({ lead, onFieldUpdate, canEdit = true }: SimplifiedOwnershipSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleFieldUpdate = (field: keyof TaxLead, value: string) => {
    if (canEdit) {
      onFieldUpdate(field, value);
    }
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';
  };

  // Create chart data with the lead owner
  const chartData = [
    {
      name: lead.ownerName || 'Owner',
      value: 100,
      relationship: 'Primary Owner'
    }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p className="text-sm text-gray-600">{data.relationship}</p>
          <p className="text-sm font-medium">{data.value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Owner Details Card */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-lg">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xl">
              <Users className="w-6 h-6 text-purple-600" />
              Owner & Ownership Details
            </div>
            {canEdit && (
              <Button 
                onClick={() => setIsEditing(!isEditing)} 
                size="sm" 
                variant="outline"
                className="border-purple-300 text-purple-600 hover:bg-purple-50"
              >
                <Edit className="w-4 h-4 mr-2" />
                {isEditing ? 'Save' : 'Edit'}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Owner Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4 space-y-3">
                {/* Header with Avatar and Ownership */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {getInitials(lead.ownerName || '')}
                    </div>
                    <div className="flex-1">
                      <div className="text-lg font-semibold text-gray-900">
                        <InlineEditField 
                          label=""
                          value={lead.ownerName || ''}
                          onSave={(value) => handleFieldUpdate('ownerName', value)}
                          placeholder="Enter owner name"
                          className="font-semibold text-lg"
                        />
                      </div>
                      <div className="text-sm text-gray-600">Primary Owner</div>
                    </div>
                  </div>
                  
                  {/* Ownership Percentage Badge */}
                  <div className="flex items-center gap-2">
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      100%
                    </div>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="font-medium">Property:</span>
                    <InlineEditField 
                      label=""
                      value={lead.propertyAddress || ''}
                      onSave={(value) => handleFieldUpdate('propertyAddress', value)}
                      placeholder="Property address"
                      className="flex-1"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="font-medium">Phone:</span>
                    <InlineEditField 
                      label=""
                      value={lead.phone || ''}
                      onSave={(value) => handleFieldUpdate('phone', value)}
                      type="tel"
                      placeholder="Phone number"
                      className="flex-1"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="font-medium">Email:</span>
                    <InlineEditField 
                      label=""
                      value={lead.email || ''}
                      onSave={(value) => handleFieldUpdate('email', value)}
                      type="email"
                      placeholder="Email address"
                      className="flex-1"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="font-medium">Tax ID:</span>
                    <InlineEditField 
                      label=""
                      value={lead.taxId || ''}
                      onSave={(value) => handleFieldUpdate('taxId', value)}
                      placeholder="Tax ID"
                      className="flex-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Ownership Distribution Chart */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-6 h-6 bg-emerald-600 rounded flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            Ownership Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  formatter={(value, entry) => (
                    <span style={{ color: entry.color }}>
                      {value} ({entry.payload?.value}%)
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

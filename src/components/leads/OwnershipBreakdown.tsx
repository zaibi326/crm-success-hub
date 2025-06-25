
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Plus, Trash2, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Heir {
  id: string;
  name: string;
  relationship: string;
  percentage: number;
}

interface OwnershipBreakdownProps {
  onSave?: (heirs: Heir[]) => void;
}

const CHART_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Violet
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#84CC16', // Lime
  '#EC4899', // Pink
  '#6B7280'  // Gray
];

export function OwnershipBreakdown({ onSave }: OwnershipBreakdownProps) {
  const [heirs, setHeirs] = useState<Heir[]>([
    { id: '1', name: 'John Smith', relationship: 'Spouse', percentage: 50 },
    { id: '2', name: 'Sarah Smith', relationship: 'Child', percentage: 25 },
    { id: '3', name: 'Michael Smith', relationship: 'Child', percentage: 25 }
  ]);
  const [totalPercentage, setTotalPercentage] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const total = heirs.reduce((sum, heir) => sum + heir.percentage, 0);
    setTotalPercentage(total);
  }, [heirs]);

  const addHeir = () => {
    const newHeir: Heir = {
      id: Date.now().toString(),
      name: '',
      relationship: '',
      percentage: 0
    };
    setHeirs([...heirs, newHeir]);
  };

  const removeHeir = (id: string) => {
    setHeirs(heirs.filter(heir => heir.id !== id));
    toast({
      title: "Heir Removed",
      description: "The heir has been removed from the ownership breakdown.",
    });
  };

  const updateHeir = (id: string, field: keyof Heir, value: string | number) => {
    setHeirs(heirs.map(heir => 
      heir.id === id ? { ...heir, [field]: value } : heir
    ));
  };

  const handleSave = () => {
    if (totalPercentage !== 100) {
      toast({
        title: "Invalid Ownership Total",
        description: "The total ownership percentage must equal 100%.",
        variant: "destructive"
      });
      return;
    }

    if (heirs.some(heir => !heir.name.trim() || !heir.relationship.trim())) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all heir names and relationships.",
        variant: "destructive"
      });
      return;
    }

    onSave?.(heirs);
    toast({
      title: "Ownership Saved! ✅",
      description: "The ownership breakdown has been saved successfully.",
    });
  };

  const getValidationStatus = () => {
    if (totalPercentage === 100) return 'valid';
    if (totalPercentage > 100) return 'over';
    return 'under';
  };

  const getStatusColor = () => {
    const status = getValidationStatus();
    if (status === 'valid') return 'text-green-600';
    if (status === 'over') return 'text-red-600';
    return 'text-yellow-600';
  };

  const getStatusIcon = () => {
    const status = getValidationStatus();
    if (status === 'valid') return <CheckCircle className="w-4 h-4 text-green-600" />;
    return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
  };

  const chartData = heirs
    .filter(heir => heir.percentage > 0 && heir.name.trim())
    .map(heir => ({
      name: heir.name,
      value: heir.percentage,
      relationship: heir.relationship
    }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">{data.relationship}</p>
          <p className="text-sm font-medium text-blue-600">{data.value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <Users className="w-6 h-6 text-crm-primary" />
            Ownership Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Heirs Table */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Heirs & Beneficiaries</Label>
                <Button onClick={addHeir} size="sm" className="bg-crm-primary hover:bg-crm-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Heir
                </Button>
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Relationship</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">%</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {heirs.map((heir, index) => (
                      <tr key={heir.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3">
                          <Input
                            value={heir.name}
                            onChange={(e) => updateHeir(heir.id, 'name', e.target.value)}
                            placeholder="Enter name"
                            className="border-0 bg-transparent focus:ring-1 focus:ring-crm-primary"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Input
                            value={heir.relationship}
                            onChange={(e) => updateHeir(heir.id, 'relationship', e.target.value)}
                            placeholder="e.g., Spouse, Child"
                            className="border-0 bg-transparent focus:ring-1 focus:ring-crm-primary"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={heir.percentage}
                            onChange={(e) => updateHeir(heir.id, 'percentage', parseFloat(e.target.value) || 0)}
                            className="border-0 bg-transparent focus:ring-1 focus:ring-crm-primary w-20"
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Button
                            onClick={() => removeHeir(heir.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Total Validation */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon()}
                  <span className="font-medium">Total Ownership:</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={getValidationStatus() === 'valid' ? 'default' : 'destructive'}
                    className={`text-lg px-3 py-1 ${getStatusColor()}`}
                  >
                    {totalPercentage}%
                  </Badge>
                  {getValidationStatus() !== 'valid' && (
                    <span className="text-sm text-gray-600">
                      {getValidationStatus() === 'over' ? '(Over 100%)' : '(Under 100%)'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Ownership Distribution</Label>
              
              {chartData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={800}
                      >
                        {chartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={CHART_COLORS[index % CHART_COLORS.length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        formatter={(value, entry) => (
                          <span style={{ color: entry.color }}>
                            {value} ({entry.payload.value}%)
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>Add heirs with ownership percentages to see the chart</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Save Button */}
          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleSave}
              disabled={getValidationStatus() !== 'valid'}
              className="bg-gradient-to-r from-crm-primary to-crm-accent hover:from-crm-primary/90 hover:to-crm-accent/90 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105"
            >
              Save Ownership Breakdown
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Plus, Trash2, Users, PieChart as PieChartIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Heir {
  id: string;
  name: string;
  percentage: number;
}

interface OwnershipBreakdownChartProps {
  onSave: (heirs: Heir[]) => void;
  initialHeirs?: Heir[];
  readOnly?: boolean;
}

const COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#06B6D4', '#F97316', '#84CC16', '#EC4899', '#6366F1'
];

export function OwnershipBreakdownChart({ 
  onSave, 
  initialHeirs = [], 
  readOnly = false 
}: OwnershipBreakdownChartProps) {
  const [heirs, setHeirs] = useState<Heir[]>(
    initialHeirs.length > 0 ? initialHeirs : [
      { id: '1', name: 'John Smith', percentage: 50 },
      { id: '2', name: 'Jane Smith', percentage: 50 }
    ]
  );
  const { toast } = useToast();

  const addHeir = () => {
    const newHeir: Heir = {
      id: Date.now().toString(),
      name: '',
      percentage: 0
    };
    setHeirs(prev => [...prev, newHeir]);
  };

  const removeHeir = (id: string) => {
    if (heirs.length <= 1) {
      toast({
        title: "Cannot Remove",
        description: "At least one heir must remain",
        variant: "destructive"
      });
      return;
    }
    setHeirs(prev => prev.filter(heir => heir.id !== id));
  };

  const updateHeir = (id: string, field: 'name' | 'percentage', value: string | number) => {
    setHeirs(prev => prev.map(heir => 
      heir.id === id 
        ? { ...heir, [field]: field === 'percentage' ? Number(value) : value }
        : heir
    ));
  };

  const normalizePercentages = () => {
    const total = heirs.reduce((sum, heir) => sum + heir.percentage, 0);
    if (total === 0) return;

    const normalizedHeirs = heirs.map(heir => ({
      ...heir,
      percentage: Math.round((heir.percentage / total) * 100 * 100) / 100
    }));

    setHeirs(normalizedHeirs);
    toast({
      title: "Percentages Normalized",
      description: "All percentages have been adjusted to total 100%"
    });
  };

  const getTotalPercentage = () => {
    return heirs.reduce((sum, heir) => sum + heir.percentage, 0);
  };

  const handleSave = () => {
    const total = getTotalPercentage();
    const hasEmptyNames = heirs.some(heir => !heir.name.trim());

    if (hasEmptyNames) {
      toast({
        title: "Validation Error",
        description: "All heirs must have names",
        variant: "destructive"
      });
      return;
    }

    if (Math.abs(total - 100) > 0.01) {
      toast({
        title: "Percentage Error",
        description: `Total percentage is ${total.toFixed(1)}%. Must equal 100%`,
        variant: "destructive"
      });
      return;
    }

    onSave(heirs);
    toast({
      title: "Ownership Saved",
      description: "Ownership breakdown has been saved successfully"
    });
  };

  const chartData = heirs
    .filter(heir => heir.percentage > 0 && heir.name.trim())
    .map(heir => ({
      name: heir.name,
      value: heir.percentage
    }));

  const totalPercentage = getTotalPercentage();
  const isValidTotal = Math.abs(totalPercentage - 100) < 0.01;

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-crm-primary" />
            Heirs & Ownership
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {heirs.map((heir, index) => (
            <div key={heir.id} className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-6">
                <Label htmlFor={`heir-name-${heir.id}`} className="sr-only">
                  Heir {index + 1} Name
                </Label>
                <Input
                  id={`heir-name-${heir.id}`}
                  value={heir.name}
                  onChange={(e) => updateHeir(heir.id, 'name', e.target.value)}
                  placeholder={`Heir ${index + 1} name`}
                  disabled={readOnly}
                />
              </div>
              <div className="col-span-4">
                <div className="relative">
                  <Input
                    type="number"
                    value={heir.percentage}
                    onChange={(e) => updateHeir(heir.id, 'percentage', e.target.value)}
                    placeholder="0"
                    min="0"
                    max="100"
                    step="0.01"
                    disabled={readOnly}
                    className="pr-6"
                  />
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                    %
                  </span>
                </div>
              </div>
              <div className="col-span-2">
                {!readOnly && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeHeir(heir.id)}
                    disabled={heirs.length <= 1}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}

          {!readOnly && (
            <div className="flex gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={addHeir}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Heir
              </Button>
              <Button
                variant="outline"
                onClick={normalizePercentages}
                disabled={totalPercentage === 0}
              >
                Normalize %
              </Button>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Total:</span>
              <span className={`text-sm font-bold ${isValidTotal ? 'text-green-600' : 'text-red-600'}`}>
                {totalPercentage.toFixed(1)}%
              </span>
            </div>
            {!readOnly && (
              <Button 
                onClick={handleSave}
                disabled={!isValidTotal || heirs.some(h => !h.name.trim())}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Save Ownership
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pie Chart Visualization */}
      {chartData.length > 0 && (
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-crm-primary" />
              Ownership Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
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
                  <Tooltip 
                    formatter={(value: number) => [`${value.toFixed(1)}%`, 'Ownership']}
                  />
                  <Legend 
                    formatter={(value, entry) => (
                      <span style={{ color: entry.color }}>
                        {value} ({entry.payload?.value?.toFixed(1)}%)
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

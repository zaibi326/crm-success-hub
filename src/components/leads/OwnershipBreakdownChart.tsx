
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Plus, Trash2, Users, PieChart as PieChartIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Heir {
  id: string;
  name: string;
  percentage: number;
}

interface OwnershipBreakdownChartProps {
  onSave?: (heirs: Heir[]) => void;
}

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe',
  '#00c49f', '#ffbb28', '#ff8042', '#8dd1e1', '#d084d0'
];

export function OwnershipBreakdownChart({ onSave }: OwnershipBreakdownChartProps) {
  const [heirs, setHeirs] = useState<Heir[]>([
    { id: '1', name: '', percentage: 0 }
  ]);
  const { toast } = useToast();

  const addHeir = () => {
    const newHeir: Heir = {
      id: Date.now().toString(),
      name: '',
      percentage: 0
    };
    setHeirs([...heirs, newHeir]);
  };

  const removeHeir = (id: string) => {
    if (heirs.length > 1) {
      setHeirs(heirs.filter(heir => heir.id !== id));
    }
  };

  const updateHeir = (id: string, field: keyof Heir, value: string | number) => {
    setHeirs(heirs.map(heir => 
      heir.id === id ? { ...heir, [field]: value } : heir
    ));
  };

  const totalPercentage = heirs.reduce((sum, heir) => sum + heir.percentage, 0);
  const isValidTotal = totalPercentage === 100;

  const chartData = heirs
    .filter(heir => heir.name && heir.percentage > 0)
    .map(heir => ({
      name: heir.name,
      value: heir.percentage
    }));

  const handleSave = () => {
    if (!isValidTotal) {
      toast({
        title: "Invalid Ownership",
        description: "Total ownership must equal 100%",
        variant: "destructive",
      });
      return;
    }

    const validHeirs = heirs.filter(heir => heir.name && heir.percentage > 0);
    if (validHeirs.length === 0) {
      toast({
        title: "No Heirs Added",
        description: "Please add at least one heir with ownership percentage",
        variant: "destructive",
      });
      return;
    }

    onSave?.(validHeirs);
    toast({
      title: "Ownership Saved! ✅",
      description: `Saved ownership breakdown for ${validHeirs.length} heirs`,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-crm-primary" />
            Ownership Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {heirs.map((heir, index) => (
            <div key={heir.id} className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`heir-name-${heir.id}`}>Heir Name</Label>
                  <Input
                    id={`heir-name-${heir.id}`}
                    value={heir.name}
                    onChange={(e) => updateHeir(heir.id, 'name', e.target.value)}
                    placeholder="Enter heir name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`heir-percentage-${heir.id}`}>Ownership %</Label>
                  <Input
                    id={`heir-percentage-${heir.id}`}
                    type="number"
                    min="0"
                    max="100"
                    value={heir.percentage || ''}
                    onChange={(e) => updateHeir(heir.id, 'percentage', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
              </div>
              {heirs.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeHeir(heir.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={addHeir}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Heir
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Total:</span>
              <Badge 
                variant={isValidTotal ? "default" : "destructive"}
                className={isValidTotal ? "bg-green-100 text-green-800" : ""}
              >
                {totalPercentage}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pie Chart */}
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
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center">
        <Button
          onClick={handleSave}
          disabled={!isValidTotal}
          className="bg-gradient-to-r from-crm-primary to-crm-accent hover:from-crm-primary/90 hover:to-crm-accent/90 text-white px-8 py-3"
        >
          Save Ownership Breakdown
        </Button>
      </div>
    </div>
  );
}

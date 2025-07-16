
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Users, Plus, Trash2, Phone, Mail, MapPin, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Heir {
  id: string;
  name: string;
  relationship: string;
  percentage: number;
  propertyAddress: string;
  phoneNumber: string;
  email: string;
}

interface EnhancedOwnershipSectionProps {
  onSave: (heirs: Heir[]) => void;
  canEdit?: boolean;
}

const RELATIONSHIP_OPTIONS = [
  'Mother', 'Father', 'Son', 'Daughter', 'Brother', 'Sister',
  'Husband', 'Wife', 'Grandfather', 'Grandmother', 'Uncle',
  'Aunt', 'Cousin', 'Other'
];

const COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#06B6D4', '#F97316', '#84CC16', '#EC4899', '#6366F1'
];

export function EnhancedOwnershipSection({ onSave, canEdit = true }: EnhancedOwnershipSectionProps) {
  const [heirs, setHeirs] = useState<Heir[]>([
    {
      id: '1',
      name: 'John Smith',
      relationship: 'Father',
      percentage: 50,
      propertyAddress: '123 Main St, City, State',
      phoneNumber: '(555) 123-4567',
      email: 'john@example.com'
    },
    {
      id: '2',
      name: 'Jane Smith',
      relationship: 'Mother',
      percentage: 50,
      propertyAddress: '123 Main St, City, State',
      phoneNumber: '(555) 123-4568',
      email: 'jane@example.com'
    }
  ]);
  
  const [editingField, setEditingField] = useState<{ heirId: string; field: string } | null>(null);
  const { toast } = useToast();

  const addHeir = () => {
    const newHeir: Heir = {
      id: Date.now().toString(),
      name: '',
      relationship: 'Other',
      percentage: 0,
      propertyAddress: '',
      phoneNumber: '',
      email: ''
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

  const updateHeir = (id: string, field: keyof Heir, value: string | number) => {
    setHeirs(prev => prev.map(heir => 
      heir.id === id ? { ...heir, [field]: value } : heir
    ));
    setEditingField(null);
  };

  const getTotalPercentage = () => {
    return heirs.reduce((sum, heir) => sum + heir.percentage, 0);
  };

  const handleSave = () => {
    const total = getTotalPercentage();
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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 50) return 'bg-green-500';
    if (percentage >= 25) return 'bg-blue-500';
    if (percentage >= 10) return 'bg-amber-500';
    return 'bg-gray-500';
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
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p className="text-sm text-gray-600">{data.relationship}</p>
          <p className="text-sm font-medium">{data.value.toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  const InlineEditableField = ({ 
    heir, 
    field, 
    type = 'text', 
    placeholder,
    className = ""
  }: {
    heir: Heir;
    field: keyof Heir;
    type?: string;
    placeholder?: string;
    className?: string;
  }) => {
    const isEditing = editingField?.heirId === heir.id && editingField?.field === field;
    const value = heir[field];

    if (field === 'relationship') {
      return (
        <Select
          value={value as string}
          onValueChange={(newValue) => updateHeir(heir.id, field, newValue)}
          disabled={!canEdit}
        >
          <SelectTrigger className="w-full border-none bg-transparent p-0 h-auto text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RELATIONSHIP_OPTIONS.map(option => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (isEditing) {
      return (
        <Input
          type={type}
          value={value}
          onChange={(e) => updateHeir(heir.id, field, type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
          onBlur={() => setEditingField(null)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') setEditingField(null);
            if (e.key === 'Escape') setEditingField(null);
          }}
          className="border-none bg-transparent p-0 h-auto text-sm focus:ring-0"
          placeholder={placeholder}
          autoFocus
        />
      );
    }

    return (
      <div
        onClick={() => canEdit && setEditingField({ heirId: heir.id, field })}
        className={`cursor-pointer hover:bg-gray-50 rounded px-1 py-0.5 ${className} ${!value && 'text-gray-400 italic'}`}
      >
        {value || placeholder || 'Click to edit'}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Heirs Cards */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-lg">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xl">
              <Users className="w-6 h-6 text-purple-600" />
              Heirs & Ownership Details
            </div>
            {canEdit && (
              <Button onClick={addHeir} size="sm" className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Heir
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Total Percentage Indicator */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Total Ownership:</span>
              <Badge 
                variant="outline" 
                className={`text-sm font-bold ${
                  Math.abs(getTotalPercentage() - 100) < 0.01 
                    ? 'border-green-500 text-green-700 bg-green-50' 
                    : 'border-red-500 text-red-700 bg-red-50'
                }`}
              >
                {getTotalPercentage().toFixed(1)}%
              </Badge>
            </div>
          </div>

          {/* Heirs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {heirs.map((heir, index) => (
              <Card key={heir.id} className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-4 space-y-3">
                  {/* Header with Avatar and Actions */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {getInitials(heir.name)}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-900">
                          <InlineEditableField 
                            heir={heir} 
                            field="name" 
                            placeholder="Enter name"
                            className="font-semibold"
                          />
                        </div>
                        <div className="text-xs text-gray-600">
                          <InlineEditableField 
                            heir={heir} 
                            field="relationship" 
                            placeholder="Select relationship"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Percentage Badge */}
                    <div className="flex items-center gap-2">
                      <Badge className={`${getPercentageColor(heir.percentage)} text-white`}>
                        <InlineEditableField 
                          heir={heir} 
                          field="percentage" 
                          type="number"
                          placeholder="0"
                          className="bg-transparent text-white font-semibold"
                        />%
                      </Badge>
                      {canEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeHeir(heir.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 h-auto"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <InlineEditableField 
                        heir={heir} 
                        field="propertyAddress" 
                        placeholder="Property address"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-3 h-3 flex-shrink-0" />
                      <InlineEditableField 
                        heir={heir} 
                        field="phoneNumber" 
                        type="tel"
                        placeholder="Phone number"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-3 h-3 flex-shrink-0" />
                      <InlineEditableField 
                        heir={heir} 
                        field="email" 
                        type="email"
                        placeholder="Email address"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Save Button */}
          {canEdit && (
            <div className="flex justify-end">
              <Button 
                onClick={handleSave}
                disabled={Math.abs(getTotalPercentage() - 100) > 0.01 || heirs.some(h => !h.name.trim())}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Save Ownership
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pie Chart */}
      {chartData.length > 0 && (
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

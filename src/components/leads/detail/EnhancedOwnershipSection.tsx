
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Users, Plus, Trash2, Phone, Mail, MapPin, AlertTriangle, Edit2, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TaxLead } from '@/types/taxLead';

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
  lead: TaxLead;
  onSave: (heirs: Heir[]) => void;
  canEdit?: boolean;
}

const RELATIONSHIP_OPTIONS = [
  { value: 'Mother', label: 'Mother' },
  { value: 'Father', label: 'Father' },
  { value: 'Son', label: 'Son' },
  { value: 'Daughter', label: 'Daughter' },
  { value: 'Brother', label: 'Brother' },
  { value: 'Sister', label: 'Sister' },
  { value: 'Husband', label: 'Husband' },
  { value: 'Wife', label: 'Wife' },
  { value: 'Grandfather', label: 'Grandfather' },
  { value: 'Grandmother', label: 'Grandmother' },
  { value: 'Uncle', label: 'Uncle' },
  { value: 'Aunt', label: 'Aunt' },
  { value: 'Cousin', label: 'Cousin' },
  { value: 'Other', label: 'Other' }
];

const COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#06B6D4', '#F97316', '#84CC16', '#EC4899', '#6366F1'
];

export function EnhancedOwnershipSection({ lead, onSave, canEdit = true }: EnhancedOwnershipSectionProps) {
  const [heirs, setHeirs] = useState<Heir[]>([]);
  const [editingHeir, setEditingHeir] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHeir, setNewHeir] = useState<Heir>({
    id: '',
    name: '',
    relationship: 'Other',
    percentage: 0,
    propertyAddress: '',
    phoneNumber: '',
    email: ''
  });
  const { toast } = useToast();

  const addHeir = () => {
    if (!newHeir.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Name is required",
        variant: "destructive"
      });
      return;
    }

    const heir: Heir = {
      ...newHeir,
      id: Date.now().toString(),
    };
    
    setHeirs(prev => [...prev, heir]);
    setNewHeir({
      id: '',
      name: '',
      relationship: 'Other',
      percentage: 0,
      propertyAddress: '',
      phoneNumber: '',
      email: ''
    });
    setShowAddForm(false);
    
    toast({
      title: "Heir Added",
      description: "New heir has been added successfully",
    });
  };

  const removeHeir = (id: string) => {
    setHeirs(prev => prev.filter(heir => heir.id !== id));
    toast({
      title: "Heir Removed",
      description: "Heir has been removed successfully",
    });
  };

  const startEdit = (heirId: string, field: string, currentValue: string) => {
    setEditingHeir(heirId);
    setEditingField(field);
    setEditValue(currentValue);
  };

  const saveEdit = (heirId: string, field: string) => {
    setHeirs(prev => prev.map(heir => 
      heir.id === heirId 
        ? { ...heir, [field]: field === 'percentage' ? parseFloat(editValue) || 0 : editValue }
        : heir
    ));
    setEditingHeir(null);
    setEditingField(null);
    setEditValue('');
    
    toast({
      title: "Field Updated",
      description: "Heir information has been updated successfully",
    });
  };

  const cancelEdit = () => {
    setEditingHeir(null);
    setEditingField(null);
    setEditValue('');
  };

  const getHeirsTotalPercentage = () => {
    return heirs.reduce((sum, heir) => sum + heir.percentage, 0);
  };

  const getPrimaryOwnerPercentage = () => {
    const heirsTotal = getHeirsTotalPercentage();
    return Math.max(0, 100 - heirsTotal);
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

  const renderEditableField = (heir: Heir, field: keyof Heir, label: string, type: string = 'text') => {
    const isEditing = editingHeir === heir.id && editingField === field;
    const value = heir[field];

    if (isEditing) {
      return (
        <div className="flex items-center gap-2">
          {field === 'relationship' ? (
            <Select value={editValue} onValueChange={setEditValue}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RELATIONSHIP_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              type={type}
              className="h-8 text-xs"
              placeholder={`Enter ${label.toLowerCase()}`}
            />
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => saveEdit(heir.id, field)}
            className="text-green-600 hover:text-green-800 hover:bg-green-50 p-1 h-6 w-6 flex-shrink-0"
          >
            <Check className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={cancelEdit}
            className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 h-6 w-6 flex-shrink-0"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-900 truncate flex-1">{value || '-'}</span>
        {canEdit && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => startEdit(heir.id, field, value.toString())}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-50 p-1 h-5 w-5 flex-shrink-0"
          >
            <Edit2 className="w-2.5 h-2.5" />
          </Button>
        )}
      </div>
    );
  };

  // Create chart data with Primary Owner and Heirs
  const primaryOwnerPercentage = getPrimaryOwnerPercentage();
  const chartData = [];
  
  // Add Primary Owner if they have ownership
  if (primaryOwnerPercentage > 0) {
    chartData.push({
      name: lead.ownerName || 'Primary Owner',
      value: primaryOwnerPercentage,
      relationship: 'Primary Owner'
    });
  }
  
  // Add Heirs with ownership
  heirs
    .filter(heir => heir.percentage > 0 && heir.name.trim())
    .forEach(heir => {
      chartData.push({
        name: heir.name,
        value: heir.percentage,
        relationship: heir.relationship
      });
    });

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

  const heirsTotalPercentage = getHeirsTotalPercentage();
  const totalPercentage = heirsTotalPercentage + primaryOwnerPercentage;
  const isValidTotal = Math.abs(totalPercentage - 100) < 0.01;

  return (
    <div className="space-y-6">
      {/* Primary Owner and Heirs Cards */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-lg">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xl">
              <Users className="w-6 h-6 text-purple-600" />
              Heirs & Ownership Details
            </div>
            {canEdit && (
              <Button 
                onClick={() => setShowAddForm(true)} 
                size="sm" 
                className="bg-purple-600 hover:bg-purple-700"
              >
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
                  isValidTotal 
                    ? 'border-green-500 text-green-700 bg-green-50' 
                    : 'border-red-500 text-red-700 bg-red-50'
                }`}
              >
                {totalPercentage.toFixed(1)}%
              </Badge>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Primary Owner: {primaryOwnerPercentage.toFixed(1)}% | Heirs: {heirsTotalPercentage.toFixed(1)}%
            </div>
          </div>

          {/* Primary Owner Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Primary Owner</h3>
            <Card className="shadow-sm border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {getInitials(lead.ownerName || '')}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{lead.ownerName || 'Owner'}</h4>
                      <p className="text-sm text-gray-600">Primary Owner</p>
                    </div>
                  </div>
                  <Badge className={`${getPercentageColor(primaryOwnerPercentage)} text-white`}>
                    {primaryOwnerPercentage.toFixed(1)}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Add Heir Form */}
          {showAddForm && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Heir</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Name</Label>
                  <Input
                    value={newHeir.name}
                    onChange={(e) => setNewHeir(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter heir name"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Relationship</Label>
                  <Select
                    value={newHeir.relationship}
                    onValueChange={(value) => setNewHeir(prev => ({ ...prev, relationship: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RELATIONSHIP_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Ownership %</Label>
                  <Input
                    type="number"
                    value={newHeir.percentage}
                    onChange={(e) => setNewHeir(prev => ({ ...prev, percentage: parseFloat(e.target.value) || 0 }))}
                    placeholder="0"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <Input
                    type="email"
                    value={newHeir.email}
                    onChange={(e) => setNewHeir(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <Input
                    type="tel"
                    value={newHeir.phoneNumber}
                    onChange={(e) => setNewHeir(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    placeholder="Phone number"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Address</Label>
                  <Input
                    value={newHeir.propertyAddress}
                    onChange={(e) => setNewHeir(prev => ({ ...prev, propertyAddress: e.target.value }))}
                    placeholder="Property address"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={addHeir} className="bg-green-600 hover:bg-green-700">
                  <Check className="w-4 h-4 mr-2" />
                  Add Heir
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Heirs Horizontal Layout */}
          {heirs.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Heirs</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {heirs.map((heir) => (
                  <Card key={heir.id} className="shadow-sm border border-gray-200">
                    <CardContent className="p-4">
                      {/* Header with Avatar and Remove Button */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {getInitials(heir.name)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm">{heir.name}</h4>
                            <p className="text-xs text-gray-600">{heir.relationship}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge className={`${getPercentageColor(heir.percentage)} text-white text-xs`}>
                            {heir.percentage}%
                          </Badge>
                          {canEdit && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeHeir(heir.id)}
                              className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 h-6 w-6"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {/* Heir Details in Compact Form */}
                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="text-gray-500 font-medium block mb-1">Name</span>
                          {renderEditableField(heir, 'name', 'Name')}
                        </div>
                        <div>
                          <span className="text-gray-500 font-medium block mb-1">Relationship</span>
                          {renderEditableField(heir, 'relationship', 'Relationship')}
                        </div>
                        <div>
                          <span className="text-gray-500 font-medium block mb-1">Ownership %</span>
                          {renderEditableField(heir, 'percentage', 'Percentage', 'number')}
                        </div>
                        {heir.email && (
                          <div>
                            <span className="text-gray-500 font-medium block mb-1 flex items-center gap-1">
                              <Mail className="w-3 h-3" /> Email
                            </span>
                            {renderEditableField(heir, 'email', 'Email', 'email')}
                          </div>
                        )}
                        {heir.phoneNumber && (
                          <div>
                            <span className="text-gray-500 font-medium block mb-1 flex items-center gap-1">
                              <Phone className="w-3 h-3" /> Phone
                            </span>
                            {renderEditableField(heir, 'phoneNumber', 'Phone', 'tel')}
                          </div>
                        )}
                        {heir.propertyAddress && (
                          <div>
                            <span className="text-gray-500 font-medium block mb-1 flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> Address
                            </span>
                            {renderEditableField(heir, 'propertyAddress', 'Address')}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Save Button */}
          {canEdit && heirs.length > 0 && (
            <div className="flex justify-end">
              <Button 
                onClick={() => onSave(heirs)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Save Ownership
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ownership Distribution Chart */}
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
                    animationBegin={0}
                    animationDuration={800}
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

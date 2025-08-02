
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Users, Plus, Trash2, Phone, Mail, MapPin, Check, X } from 'lucide-react';
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingHeir, setEditingHeir] = useState<Heir | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
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

  const openEditModal = (heir: Heir) => {
    setEditingHeir({ ...heir });
    setIsAddingNew(false);
    setIsEditModalOpen(true);
  };

  const openAddModal = () => {
    setEditingHeir({
      id: '',
      name: '',
      relationship: 'Other',
      percentage: 0,
      propertyAddress: '',
      phoneNumber: '',
      email: ''
    });
    setIsAddingNew(true);
    setIsEditModalOpen(true);
  };

  const saveHeirChanges = () => {
    if (!editingHeir) return;

    if (!editingHeir.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Name is required",
        variant: "destructive"
      });
      return;
    }

    if (isAddingNew) {
      const newHeirWithId = {
        ...editingHeir,
        id: Date.now().toString()
      };
      setHeirs(prev => [...prev, newHeirWithId]);
      toast({
        title: "Heir Added",
        description: "New heir has been added successfully",
      });
    } else {
      setHeirs(prev => prev.map(heir => 
        heir.id === editingHeir.id ? editingHeir : heir
      ));
      toast({
        title: "Heir Updated",
        description: "Heir information has been updated successfully",
      });
    }

    setIsEditModalOpen(false);
    setEditingHeir(null);
    setIsAddingNew(false);
  };

  const removeHeir = (id: string) => {
    setHeirs(prev => prev.filter(heir => heir.id !== id));
    toast({
      title: "Heir Removed",
      description: "Heir has been removed successfully",
    });
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
                onClick={openAddModal} 
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

          {/* Heirs Horizontal Layout - Simplified Cards */}
          {heirs.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Heirs</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {heirs.map((heir) => (
                  <Card 
                    key={heir.id} 
                    className="shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => canEdit && openEditModal(heir)}
                  >
                    <CardContent className="p-4">
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
                              onClick={(e) => {
                                e.stopPropagation();
                                removeHeir(heir.id);
                              }}
                              className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 h-6 w-6"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
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

      {/* Edit/Add Heir Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isAddingNew ? 'Add New Heir' : 'Edit Heir Details'}</DialogTitle>
          </DialogHeader>
          {editingHeir && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Name *</Label>
                  <Input
                    id="edit-name"
                    value={editingHeir.name}
                    onChange={(e) => setEditingHeir({ ...editingHeir, name: e.target.value })}
                    placeholder="Enter heir name"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-relationship">Relationship</Label>
                  <Select
                    value={editingHeir.relationship}
                    onValueChange={(value) => setEditingHeir({ ...editingHeir, relationship: value })}
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
              </div>

              <div>
                <Label htmlFor="edit-percentage">Ownership Percentage</Label>
                <div className="relative">
                  <Input
                    id="edit-percentage"
                    type="number"
                    value={editingHeir.percentage}
                    onChange={(e) => setEditingHeir({ ...editingHeir, percentage: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                    min="0"
                    max="100"
                    step="0.01"
                    className="pr-6"
                  />
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                    %
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-email">Email Address</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editingHeir.email}
                    onChange={(e) => setEditingHeir({ ...editingHeir, email: e.target.value })}
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-phone">Phone Number</Label>
                  <Input
                    id="edit-phone"
                    type="tel"
                    value={editingHeir.phoneNumber}
                    onChange={(e) => setEditingHeir({ ...editingHeir, phoneNumber: e.target.value })}
                    placeholder="Phone number"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-address">Property Address</Label>
                <Input
                  id="edit-address"
                  value={editingHeir.propertyAddress}
                  onChange={(e) => setEditingHeir({ ...editingHeir, propertyAddress: e.target.value })}
                  placeholder="Property address"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={saveHeirChanges} className="bg-blue-600 hover:bg-blue-700">
                  <Check className="w-4 h-4 mr-2" />
                  {isAddingNew ? 'Add Heir' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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

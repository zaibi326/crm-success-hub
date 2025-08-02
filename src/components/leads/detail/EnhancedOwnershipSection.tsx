import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
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
    <Card className="shadow-sm border border-gray-200">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="ownership" className="border-none">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center justify-between w-full mr-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="text-lg font-semibold">Heirs & Ownership</span>
                {heirs.length > 0 && (
                  <Badge variant="outline">
                    {heirs.length} heir{heirs.length !== 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
              {canEdit && (
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    openAddModal();
                  }}
                  size="sm" 
                  className="bg-purple-600 hover:bg-purple-700 h-8"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Heir
                </Button>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            {/* Total Percentage Indicator */}
            <div className="mb-4 p-3 bg-gray-50 rounded-md border">
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
              <div className="mt-1 text-xs text-gray-500">
                Primary Owner: {primaryOwnerPercentage.toFixed(1)}% | Heirs: {heirsTotalPercentage.toFixed(1)}%
              </div>
            </div>

            {/* Primary Owner Section */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Primary Owner</h4>
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-md">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {getInitials(lead.ownerName || '')}
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 text-sm">{lead.ownerName || 'Owner'}</h5>
                    <p className="text-xs text-gray-600">Primary Owner</p>
                  </div>
                </div>
                <Badge className={`${getPercentageColor(primaryOwnerPercentage)} text-white text-xs`}>
                  {primaryOwnerPercentage.toFixed(1)}%
                </Badge>
              </div>
            </div>

            {/* Heirs List */}
            {heirs.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Heirs</h4>
                
                <div className="grid grid-cols-1 gap-2">
                  {heirs.map((heir) => (
                    <div 
                      key={heir.id} 
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => canEdit && openEditModal(heir)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                          {getInitials(heir.name)}
                        </div>
                        <div>
                          <h6 className="font-medium text-gray-900 text-sm">{heir.name}</h6>
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
                  ))}
                </div>
              </div>
            )}

            {/* Save Button */}
            {canEdit && heirs.length > 0 && (
              <div className="flex justify-end">
                <Button 
                  onClick={() => onSave(heirs)}
                  className="bg-blue-600 hover:bg-blue-700 h-8"
                  size="sm"
                >
                  Save Ownership
                </Button>
              </div>
            )}

            {/* Ownership Distribution Chart */}
            {chartData.length > 0 && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <h4 className="font-medium text-gray-900 mb-3 text-center">Ownership Distribution</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
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
                          <span style={{ color: entry.color, fontSize: '12px' }}>
                            {value} ({entry.payload?.value?.toFixed(1)}%)
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Edit/Add Heir Modal - keep existing modal code the same */}
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
    </Card>
  );
}

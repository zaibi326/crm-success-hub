
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Plus, Trash2, Users, PieChart as PieChartIcon, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useComprehensiveActivityLogger } from '@/hooks/useComprehensiveActivityLogger';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Heir {
  id: string;
  name: string;
  relationship: string;
  customRelationship?: string;
  email: string;
  propertyAddress: string;
  phoneNumber: string;
  percentage: number;
  notes?: string;
  documents?: File[];
}

interface OwnershipBreakdownChartProps {
  onSave: (heirs: Heir[]) => void;
  initialHeirs?: Heir[];
  readOnly?: boolean;
  leadId?: string;
  leadName?: string;
}

const COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#06B6D4', '#F97316', '#84CC16', '#EC4899', '#6366F1'
];

const RELATIONSHIP_OPTIONS = [
  'Mother', 'Father', 'Son', 'Daughter', 'Brother', 'Sister',
  'Husband', 'Wife', 'Grandfather', 'Grandmother', 'Uncle',
  'Aunt', 'Cousin', 'Other'
];

export function OwnershipBreakdownChart({ 
  onSave, 
  initialHeirs = [], 
  readOnly = false,
  leadId,
  leadName
}: OwnershipBreakdownChartProps) {
  const [heirs, setHeirs] = useState<Heir[]>(() => {
    // Always start with initialHeirs if provided, otherwise empty array for new entries
    if (initialHeirs && initialHeirs.length > 0) {
      return initialHeirs;
    }
    // For new ownership breakdown, start with empty state
    return [];
  });
  const [editingHeir, setEditingHeir] = useState<Heir | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();
  const { logHeirAddition, logLeadFieldUpdate } = useComprehensiveActivityLogger();

  const addHeir = () => {
    const newHeir: Heir = {
      id: Date.now().toString(),
      name: '',
      relationship: 'Other',
      email: '',
      propertyAddress: '',
      phoneNumber: '',
      percentage: 0,
      notes: ''
    };
    const updatedHeirs = [...heirs, newHeir];
    setHeirs(updatedHeirs);
    
    // Auto-save to prevent data loss
    if (onSave) {
      onSave(updatedHeirs);
    }
    
    // Log heir addition activity
    if (leadId && leadName) {
      logHeirAddition(
        leadId,
        leadName,
        'New Heir (pending details)',
        'Other'
      );
    }
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
    const updatedHeirs = heirs.filter(heir => heir.id !== id);
    setHeirs(updatedHeirs);
    
    // Auto-save changes to prevent data loss
    if (onSave) {
      onSave(updatedHeirs);
    }
  };

  const updateHeir = (id: string, field: keyof Heir, value: string | number) => {
    const updatedHeirs = heirs.map(heir => 
      heir.id === id 
        ? { ...heir, [field]: value }
        : heir
    );
    setHeirs(updatedHeirs);
    
    // Auto-save changes to parent component to prevent data loss
    if (onSave) {
      onSave(updatedHeirs);
    }
  };

  const openEditModal = (heir: Heir) => {
    setEditingHeir({ ...heir });
    setIsEditModalOpen(true);
  };

  const saveHeirChanges = () => {
    if (editingHeir) {
      setHeirs(prev => prev.map(heir => 
        heir.id === editingHeir.id ? editingHeir : heir
      ));
      setIsEditModalOpen(false);
      setEditingHeir(null);
    }
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
      value: heir.percentage,
      relationship: heir.relationship === 'Other' ? heir.customRelationship : heir.relationship,
      email: heir.email
    }));

  const totalPercentage = getTotalPercentage();
  const isValidTotal = Math.abs(totalPercentage - 100) < 0.01;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p className="text-sm text-gray-600">{data.relationship}</p>
          <p className="text-sm font-medium">{data.value.toFixed(1)}%</p>
          {data.email && <p className="text-xs text-gray-500">{data.email}</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-crm-primary" />
            Heirs & Ownership Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Heir Name</TableHead>
                  <TableHead>Relationship</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Property Address</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Ownership %</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {heirs.map((heir) => (
                  <TableRow key={heir.id}>
                    <TableCell>
                      <Input
                        value={heir.name}
                        onChange={(e) => updateHeir(heir.id, 'name', e.target.value)}
                        placeholder="Enter name"
                        disabled={readOnly}
                        className="min-w-[120px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={heir.relationship}
                        onValueChange={(value) => updateHeir(heir.id, 'relationship', value)}
                        disabled={readOnly}
                      >
                        <SelectTrigger className="min-w-[120px]">
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
                    </TableCell>
                    <TableCell>
                      <Input
                        type="email"
                        value={heir.email}
                        onChange={(e) => updateHeir(heir.id, 'email', e.target.value)}
                        placeholder="Email address"
                        disabled={readOnly}
                        className="min-w-[160px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={heir.propertyAddress}
                        onChange={(e) => updateHeir(heir.id, 'propertyAddress', e.target.value)}
                        placeholder="Property address"
                        disabled={readOnly}
                        className="min-w-[180px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="tel"
                        value={heir.phoneNumber}
                        onChange={(e) => updateHeir(heir.id, 'phoneNumber', e.target.value)}
                        placeholder="Phone number"
                        disabled={readOnly}
                        className="min-w-[140px]"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="relative">
                        <Input
                          type="number"
                          value={heir.percentage}
                          onChange={(e) => updateHeir(heir.id, 'percentage', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          min="0"
                          max="100"
                          step="0.01"
                          disabled={readOnly}
                          className="pr-6 min-w-[80px]"
                        />
                        <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                          %
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditModal(heir)}
                              disabled={readOnly}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                        </Dialog>
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {!readOnly && (
            <div className="flex gap-2 pt-4 border-t mt-4">
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

          <div className="flex items-center justify-between pt-4 border-t mt-4">
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

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Heir Details</DialogTitle>
          </DialogHeader>
          {editingHeir && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={editingHeir.name}
                    onChange={(e) => setEditingHeir({ ...editingHeir, name: e.target.value })}
                    placeholder="Enter name"
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
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {editingHeir.relationship === 'Other' && (
                <div>
                  <Label htmlFor="edit-custom-relationship">Custom Relationship</Label>
                  <Input
                    id="edit-custom-relationship"
                    value={editingHeir.customRelationship || ''}
                    onChange={(e) => setEditingHeir({ ...editingHeir, customRelationship: e.target.value })}
                    placeholder="Specify relationship"
                  />
                </div>
              )}

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

              <div>
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={editingHeir.notes || ''}
                  onChange={(e) => setEditingHeir({ ...editingHeir, notes: e.target.value })}
                  placeholder="Additional notes about this heir"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={saveHeirChanges}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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

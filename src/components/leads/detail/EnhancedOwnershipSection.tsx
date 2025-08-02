import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { TaxLead } from '@/types/taxLead';
import { useToast } from '@/hooks/use-toast';
import { useComprehensiveLeadActivityTracker } from '@/hooks/useComprehensiveActivityLogger';

interface Heir {
  id: string;
  name: string;
  relationship: string;
  percentage: number;
  address?: string;
  phone?: string;
  email?: string;
  dateOfBirth?: string;
  ssn?: string;
}

interface EnhancedOwnershipSectionProps {
  lead: TaxLead;
  onFieldUpdate: (field: keyof TaxLead, value: any) => void;
  canEdit: boolean;
}

export function EnhancedOwnershipSection({ lead, onFieldUpdate, canEdit }: EnhancedOwnershipSectionProps) {
  const [heirs, setHeirs] = useState<Heir[]>([]);
  const [isAddHeirDialogOpen, setIsAddHeirDialogOpen] = useState(false);
  const [editingHeir, setEditingHeir] = useState<Heir | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  const { trackHeirDataModified } = useComprehensiveLeadActivityTracker();

  // Initialize heirs from lead data
  useEffect(() => {
    if (lead.heirs && lead.heirs.length > 0) {
      console.log('Loading heirs from lead data:', lead.heirs);
      setHeirs(lead.heirs);
    }
  }, [lead.heirs]);

  // Update lead data whenever heirs change
  useEffect(() => {
    console.log('Updating lead heirs data:', heirs);
    onFieldUpdate('heirs', heirs);
  }, [heirs, onFieldUpdate]);

  const [newHeir, setNewHeir] = useState<Heir>({
    id: '',
    name: '',
    relationship: '',
    percentage: 0,
    address: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    ssn: ''
  });

  const resetNewHeir = () => {
    setNewHeir({
      id: '',
      name: '',
      relationship: '',
      percentage: 0,
      address: '',
      phone: '',
      email: '',
      dateOfBirth: '',
      ssn: ''
    });
  };

  const handleAddHeir = () => {
    if (!newHeir.name || !newHeir.relationship || newHeir.percentage <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in name, relationship, and percentage",
        variant: "destructive",
      });
      return;
    }

    const heirToAdd = {
      ...newHeir,
      id: `heir-${Date.now()}-${Math.random()}`,
      percentage: Number(newHeir.percentage)
    };

    setHeirs(prev => {
      const updated = [...prev, heirToAdd];
      console.log('Adding heir, updated heirs:', updated);
      return updated;
    });

    // Track the activity
    trackHeirDataModified(lead, 'added', heirToAdd);

    resetNewHeir();
    setIsAddHeirDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Heir added successfully",
    });
  };

  const handleEditHeir = (heir: Heir) => {
    setEditingHeir({ ...heir });
    setIsEditDialogOpen(true);
  };

  const handleUpdateHeir = () => {
    if (!editingHeir) return;

    if (!editingHeir.name || !editingHeir.relationship || editingHeir.percentage <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in name, relationship, and percentage",
        variant: "destructive",
      });
      return;
    }

    setHeirs(prev => {
      const updated = prev.map(heir => 
        heir.id === editingHeir.id 
          ? { ...editingHeir, percentage: Number(editingHeir.percentage) }
          : heir
      );
      console.log('Updating heir, updated heirs:', updated);
      return updated;
    });

    // Track the activity
    trackHeirDataModified(lead, 'updated', editingHeir);

    setEditingHeir(null);
    setIsEditDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Heir updated successfully",
    });
  };

  const handleDeleteHeir = (heirId: string) => {
    const heirToDelete = heirs.find(h => h.id === heirId);
    
    setHeirs(prev => {
      const updated = prev.filter(heir => heir.id !== heirId);
      console.log('Deleting heir, updated heirs:', updated);
      return updated;
    });

    // Track the activity
    if (heirToDelete) {
      trackHeirDataModified(lead, 'deleted', heirToDelete);
    }

    toast({
      title: "Success",
      description: "Heir deleted successfully",
    });
  };

  const totalPercentage = heirs.reduce((sum, heir) => sum + heir.percentage, 0);

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Heirs & Ownership Details</span>
          {canEdit && (
            <Dialog open={isAddHeirDialogOpen} onOpenChange={setIsAddHeirDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Heir
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Heir</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="heir-name">Full Name *</Label>
                    <Input
                      id="heir-name"
                      value={newHeir.name}
                      onChange={(e) => setNewHeir(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heir-relationship">Relationship *</Label>
                    <Select value={newHeir.relationship} onValueChange={(value) => setNewHeir(prev => ({ ...prev, relationship: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Spouse">Spouse</SelectItem>
                        <SelectItem value="Child">Child</SelectItem>
                        <SelectItem value="Parent">Parent</SelectItem>
                        <SelectItem value="Sibling">Sibling</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heir-percentage">Ownership % *</Label>
                    <Input
                      id="heir-percentage"
                      type="number"
                      min="0"
                      max="100"
                      value={newHeir.percentage}
                      onChange={(e) => setNewHeir(prev => ({ ...prev, percentage: Number(e.target.value) }))}
                      placeholder="Enter percentage"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heir-phone">Phone</Label>
                    <Input
                      id="heir-phone"
                      value={newHeir.phone}
                      onChange={(e) => setNewHeir(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="heir-email">Email</Label>
                    <Input
                      id="heir-email"
                      type="email"
                      value={newHeir.email}
                      onChange={(e) => setNewHeir(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="heir-address">Address</Label>
                    <Input
                      id="heir-address"
                      value={newHeir.address}
                      onChange={(e) => setNewHeir(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Enter full address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heir-dob">Date of Birth</Label>
                    <Input
                      id="heir-dob"
                      type="date"
                      value={newHeir.dateOfBirth}
                      onChange={(e) => setNewHeir(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heir-ssn">SSN (Last 4 digits)</Label>
                    <Input
                      id="heir-ssn"
                      value={newHeir.ssn}
                      onChange={(e) => setNewHeir(prev => ({ ...prev, ssn: e.target.value }))}
                      placeholder="****"
                      maxLength={4}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={() => setIsAddHeirDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddHeir}>
                    Add Heir
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Heirs Display */}
        {heirs.length > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {heirs.map((heir) => (
                <div key={heir.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm text-gray-900 truncate">{heir.name}</h4>
                      {canEdit && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditHeir(heir)}
                            className="h-7 w-7 p-0"
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteHeir(heir.id)}
                            className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{heir.relationship}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-600">{heir.percentage}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Total Percentage Display */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium text-blue-900">Total Ownership:</span>
                <span className={`font-bold text-lg ${totalPercentage === 100 ? 'text-green-600' : totalPercentage > 100 ? 'text-red-600' : 'text-orange-600'}`}>
                  {totalPercentage}%
                </span>
              </div>
              {totalPercentage !== 100 && (
                <p className="text-sm text-blue-700 mt-1">
                  {totalPercentage > 100 
                    ? `Ownership exceeds 100% by ${totalPercentage - 100}%` 
                    : `Remaining ownership: ${100 - totalPercentage}%`}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-2">No heirs added yet</p>
            {canEdit && (
              <p className="text-sm">Click "Add Heir" to start adding ownership details</p>
            )}
          </div>
        )}

        {/* Edit Heir Dialog */}
        {editingHeir && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Heir</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-heir-name">Full Name *</Label>
                  <Input
                    id="edit-heir-name"
                    value={editingHeir.name}
                    onChange={(e) => setEditingHeir(prev => prev ? { ...prev, name: e.target.value } : null)}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-heir-relationship">Relationship *</Label>
                  <Select value={editingHeir.relationship} onValueChange={(value) => setEditingHeir(prev => prev ? { ...prev, relationship: value } : null)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Spouse">Spouse</SelectItem>
                      <SelectItem value="Child">Child</SelectItem>
                      <SelectItem value="Parent">Parent</SelectItem>
                      <SelectItem value="Sibling">Sibling</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-heir-percentage">Ownership % *</Label>
                  <Input
                    id="edit-heir-percentage"
                    type="number"
                    min="0"
                    max="100"
                    value={editingHeir.percentage}
                    onChange={(e) => setEditingHeir(prev => prev ? { ...prev, percentage: Number(e.target.value) } : null)}
                    placeholder="Enter percentage"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-heir-phone">Phone</Label>
                  <Input
                    id="edit-heir-phone"
                    value={editingHeir.phone}
                    onChange={(e) => setEditingHeir(prev => prev ? { ...prev, phone: e.target.value } : null)}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="edit-heir-email">Email</Label>
                  <Input
                    id="edit-heir-email"
                    type="email"
                    value={editingHeir.email}
                    onChange={(e) => setEditingHeir(prev => prev ? { ...prev, email: e.target.value } : null)}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="edit-heir-address">Address</Label>
                  <Input
                    id="edit-heir-address"
                    value={editingHeir.address}
                    onChange={(e) => setEditingHeir(prev => prev ? { ...prev, address: e.target.value } : null)}
                    placeholder="Enter full address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-heir-dob">Date of Birth</Label>
                  <Input
                    id="edit-heir-dob"
                    type="date"
                    value={editingHeir.dateOfBirth}
                    onChange={(e) => setEditingHeir(prev => prev ? { ...prev, dateOfBirth: e.target.value } : null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-heir-ssn">SSN (Last 4 digits)</Label>
                  <Input
                    id="edit-heir-ssn"
                    value={editingHeir.ssn}
                    onChange={(e) => setEditingHeir(prev => prev ? { ...prev, ssn: e.target.value } : null)}
                    placeholder="****"
                    maxLength={4}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateHeir}>
                  Update Heir
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}

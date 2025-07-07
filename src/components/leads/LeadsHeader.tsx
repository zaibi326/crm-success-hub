
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TaxLead {
  id: number;
  taxId: string;
  ownerName: string;
  propertyAddress: string;
  taxLawsuitNumber?: string;
  currentArrears?: number;
  status: 'HOT' | 'WARM' | 'COLD' | 'PASS';
  notes?: string;
  phone?: string;
  email?: string;
  ownerOfRecord?: string;
  hasDeath?: boolean;
  deathNotes?: string;
  hasProbate?: boolean;
  probateNotes?: string;
  hasLawsuit?: boolean;
  lawsuitNotes?: string;
  hasAdditionalTaxingEntities?: boolean;
  additionalTaxingNotes?: string;
  vestingDeedNotes?: string;
}

interface LeadsHeaderProps {
  onAddLead?: (lead: TaxLead) => void;
}

export function LeadsHeader({ onAddLead }: LeadsHeaderProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newLead, setNewLead] = useState({
    ownerName: '',
    propertyAddress: '',
    email: '',
    phone: '',
    status: 'WARM' as 'HOT' | 'WARM' | 'COLD' | 'PASS',
    currentArrears: '',
    notes: ''
  });
  const { toast } = useToast();

  // Reset form when dialog closes
  useEffect(() => {
    if (!isDialogOpen) {
      setNewLead({
        ownerName: '',
        propertyAddress: '',
        email: '',
        phone: '',
        status: 'WARM',
        currentArrears: '',
        notes: ''
      });
    }
  }, [isDialogOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newLead.ownerName || !newLead.propertyAddress) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least the owner name and property address.",
        variant: "destructive"
      });
      return;
    }

    const leadToAdd: TaxLead = {
      id: Date.now(),
      taxId: `TAX-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      ownerName: newLead.ownerName,
      propertyAddress: newLead.propertyAddress,
      email: newLead.email || undefined,
      phone: newLead.phone || undefined,
      status: newLead.status,
      currentArrears: newLead.currentArrears ? parseFloat(newLead.currentArrears) : undefined,
      notes: newLead.notes || undefined,
      ownerOfRecord: newLead.ownerName,
      hasDeath: false,
      hasProbate: false,
      hasLawsuit: false,
      hasAdditionalTaxingEntities: false,
      vestingDeedNotes: 'New lead - needs review'
    };

    if (onAddLead) {
      onAddLead(leadToAdd);
    }

    toast({
      title: "Lead Added",
      description: `${newLead.ownerName} has been added to your leads.`,
    });

    // Close dialog and reset form
    setIsDialogOpen(false);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
  };

  return (
    <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-200/60 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Current Deals</h1>
            <p className="text-sm text-gray-600 mt-0.5">
              Manage and view your current leads and opportunities
            </p>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
              <Plus className="w-4 h-4 mr-2" />
              Add New Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Lead</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ownerName">Owner Name *</Label>
                <Input
                  id="ownerName"
                  value={newLead.ownerName}
                  onChange={(e) => setNewLead(prev => ({ ...prev, ownerName: e.target.value }))}
                  placeholder="Enter owner name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="propertyAddress">Property Address *</Label>
                <Input
                  id="propertyAddress"
                  value={newLead.propertyAddress}
                  onChange={(e) => setNewLead(prev => ({ ...prev, propertyAddress: e.target.value }))}
                  placeholder="Enter property address"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newLead.email}
                    onChange={(e) => setNewLead(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newLead.phone}
                    onChange={(e) => setNewLead(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter phone"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={newLead.status} onValueChange={(value: 'HOT' | 'WARM' | 'COLD' | 'PASS') => setNewLead(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HOT">HOT</SelectItem>
                      <SelectItem value="WARM">WARM</SelectItem>
                      <SelectItem value="COLD">COLD</SelectItem>
                      <SelectItem value="PASS">PASS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currentArrears">Current Arrears ($)</Label>
                  <Input
                    id="currentArrears"
                    type="number"
                    value={newLead.currentArrears}
                    onChange={(e) => setNewLead(prev => ({ ...prev, currentArrears: e.target.value }))}
                    placeholder="Enter amount"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newLead.notes}
                  onChange={(e) => setNewLead(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Enter any notes about this lead"
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Add Lead
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}


import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddSellerDialogProps {
  onAddSeller: (seller: any) => void;
}

export function AddSellerDialog({ onAddSeller }: AddSellerDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    ownerName: '',
    propertyAddress: '',
    phone: '',
    email: '',
    taxId: '',
    currentArrears: '',
    status: 'COLD',
    notes: '',
    ownerOfRecord: '',
  });

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.ownerName || !formData.propertyAddress) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newSeller = {
      id: Date.now(),
      ...formData,
      currentArrears: formData.currentArrears ? parseFloat(formData.currentArrears) : 0,
      taxLawsuitNumber: `TL-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`
    };

    onAddSeller(newSeller);
    setOpen(false);
    setFormData({
      ownerName: '',
      propertyAddress: '',
      phone: '',
      email: '',
      taxId: '',
      currentArrears: '',
      status: 'COLD',
      notes: '',
      ownerOfRecord: '',
    });

    toast({
      title: "Success",
      description: "Seller lead added successfully",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Seller
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Add New Seller Lead
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ownerName">Seller Name *</Label>
              <Input
                id="ownerName"
                value={formData.ownerName}
                onChange={(e) => handleInputChange('ownerName', e.target.value)}
                placeholder="Enter seller name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="ownerOfRecord">Owner of Record</Label>
              <Input
                id="ownerOfRecord"
                value={formData.ownerOfRecord}
                onChange={(e) => handleInputChange('ownerOfRecord', e.target.value)}
                placeholder="Enter owner of record"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="propertyAddress">Property Address *</Label>
            <Input
              id="propertyAddress"
              value={formData.propertyAddress}
              onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
              placeholder="Enter full property address"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="seller@email.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="taxId">Tax ID</Label>
              <Input
                id="taxId"
                value={formData.taxId}
                onChange={(e) => handleInputChange('taxId', e.target.value)}
                placeholder="TX123456789"
              />
            </div>
            
            <div>
              <Label htmlFor="currentArrears">Current Arrears ($)</Label>
              <Input
                id="currentArrears"
                type="number"
                step="0.01"
                value={formData.currentArrears}
                onChange={(e) => handleInputChange('currentArrears', e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="status">Lead Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HOT">Hot</SelectItem>
                <SelectItem value="WARM">Warm</SelectItem>
                <SelectItem value="COLD">Cold</SelectItem>
                <SelectItem value="PASS">Pass</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Add any additional notes about this lead..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Add Seller
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

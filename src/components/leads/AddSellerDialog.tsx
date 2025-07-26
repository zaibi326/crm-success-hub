import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { TaxLead } from '@/types/taxLead';

interface AddSellerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSellerAdded: (seller: TaxLead) => void;
}

export function AddSellerDialog({ isOpen, onClose, onSellerAdded }: AddSellerDialogProps) {
  const [formData, setFormData] = useState({
    taxId: '',
    ownerName: '',
    propertyAddress: '',
    taxLawsuitNumber: '',
    currentArrears: 0,
    phone: '',
    email: '',
    firstName: '',
    lastName: '',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newSeller: TaxLead = {
      id: Date.now(),
      taxId: formData.taxId,
      ownerName: formData.ownerName,
      propertyAddress: formData.propertyAddress,
      sellerPropertyAddress: formData.propertyAddress, // Initialize with same value
      taxLawsuitNumber: formData.taxLawsuitNumber,
      currentArrears: formData.currentArrears,
      status: 'COLD',
      notes: formData.notes,
      phone: formData.phone,
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      temperature: 'COLD',
      occupancyStatus: 'UNKNOWN',
      disposition: 'UNDECIDED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdVia: 'Manual Entry',
      tags: []
    };

    onSellerAdded(newSeller);
    
    setFormData({
      taxId: '',
      ownerName: '',
      propertyAddress: '',
      taxLawsuitNumber: '',
      currentArrears: 0,
      phone: '',
      email: '',
      firstName: '',
      lastName: '',
      notes: ''
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Seller Lead</DialogTitle>
          <DialogDescription>
            Create a new seller lead to track potential deals.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="taxId" className="text-right">
              Tax ID
            </Label>
            <Input
              type="text"
              id="taxId"
              name="taxId"
              value={formData.taxId}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ownerName" className="text-right">
              Owner Name
            </Label>
            <Input
              type="text"
              id="ownerName"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="propertyAddress" className="text-right">
              Property Address
            </Label>
            <Input
              type="text"
              id="propertyAddress"
              name="propertyAddress"
              value={formData.propertyAddress}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="taxLawsuitNumber" className="text-right">
              Tax Lawsuit Number
            </Label>
            <Input
              type="text"
              id="taxLawsuitNumber"
              name="taxLawsuitNumber"
              value={formData.taxLawsuitNumber}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="currentArrears" className="text-right">
              Current Arrears
            </Label>
            <Input
              type="number"
              id="currentArrears"
              name="currentArrears"
              value={formData.currentArrears}
              onChange={handleChange as any}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone
            </Label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="firstName" className="text-right">
              First Name
            </Label>
            <Input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastName" className="text-right">
              Last Name
            </Label>
            <Input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">
              Notes
            </Label>
            <Input
              type="text"
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit">Add Seller</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

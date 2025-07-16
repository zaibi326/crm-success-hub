
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, CheckCircle, ExternalLink } from 'lucide-react';
import { useAddSellerForm } from './dialog/useAddSellerForm';
import { AddSellerForm } from './dialog/AddSellerForm';
import { TaxLead } from '@/types/taxLead';
import { toast } from 'sonner';

interface AddSellerDialogProps {
  onAddSeller: (seller: TaxLead) => void;
}

export function AddSellerDialog({ onAddSeller }: AddSellerDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [addedLead, setAddedLead] = useState<TaxLead | null>(null);
  
  const { formData, errors, setFormData, validateForm, resetForm } = useAddSellerForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }

    try {
      // Convert File[] to the expected format
      const formattedFiles = formData.attachedFiles.map((file, index) => ({
        id: `${Date.now()}-${index}`,
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      }));

      const newSeller: TaxLead = {
        id: Date.now(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        ownerName: `${formData.firstName} ${formData.lastName}`.trim(),
        propertyAddress: formData.propertyAddress,
        phone: formData.phone,
        email: formData.email,
        leadSource: formData.leadSource,
        temperature: formData.temperature,
        occupancyStatus: formData.occupancyStatus as 'OWNER_OCCUPIED' | 'TENANT_OCCUPIED' | 'VACANT',
        agentName: formData.agentName,
        notes: formData.notes,
        askingPrice: formData.askingPrice ? parseFloat(formData.askingPrice) : undefined,
        mortgagePrice: formData.mortgagePrice ? parseFloat(formData.mortgagePrice) : undefined,
        currentArrears: formData.currentArrears ? parseFloat(formData.currentArrears) : undefined,
        taxId: formData.taxId,
        campaignId: formData.campaignId,
        status: formData.temperature,
        taxLawsuitNumber: `TL-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
        attachedFiles: formattedFiles,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        disposition: 'UNDECIDED' as const,
      };

      onAddSeller(newSeller);
      setAddedLead(newSeller);
      setShowSuccess(true);
      
      toast.success('Seller Lead successfully added');
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
        setIsOpen(false);
        resetForm();
        setAddedLead(null);
      }, 3000);

    } catch (error) {
      console.error('Error adding seller:', error);
      toast.error('Failed to add seller lead');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setShowSuccess(false);
    resetForm();
    setAddedLead(null);
  };

  const handleViewLead = () => {
    if (addedLead) {
      // This would typically navigate to the lead details page
      // You can implement navigation logic here if needed
      window.open(`/leads/${addedLead.id}`, '_blank');
    }
  };

  const handleFieldChange = (field: string, value: string | File[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-crm-primary hover:bg-crm-primary/90 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Seller
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {showSuccess ? 'Success!' : 'Add New Seller Lead'}
          </DialogTitle>
        </DialogHeader>
        
        {showSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Seller Lead successfully added
            </h3>
            <p className="text-gray-600 text-center">
              Your new seller lead has been created and added to the system.
            </p>
            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleViewLead}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <ExternalLink className="w-4 h-4" />
                View Lead Details
              </Button>
              <Button
                onClick={handleClose}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Stay on Leads Page
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <AddSellerForm
              formData={formData}
              errors={errors}
              onFieldChange={handleFieldChange}
            />
            
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-crm-primary hover:bg-crm-primary/90 text-white"
              >
                Add Seller Lead
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}


import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, User } from 'lucide-react';
import { TaxLead } from '@/types/taxLead';
import { useAddSellerForm } from './dialog/useAddSellerForm';
import { PersonalInfoSection } from './dialog/PersonalInfoSection';
import { ContactInfoSection } from './dialog/ContactInfoSection';
import { PropertyInfoSection } from './dialog/PropertyInfoSection';
import { LeadInfoSection } from './dialog/LeadInfoSection';
import { FinancialInfoSection } from './dialog/FinancialInfoSection';
import { FileUploadSection } from './dialog/FileUploadSection';
import { NotesSection } from './dialog/NotesSection';

interface ComprehensiveAddSellerDialogProps {
  onAddSeller: (seller: TaxLead) => void;
  onSellerAdded?: (seller: TaxLead) => void;
  trigger?: React.ReactNode;
}

export function ComprehensiveAddSellerDialog({ onAddSeller, onSellerAdded, trigger }: ComprehensiveAddSellerDialogProps) {
  const [open, setOpen] = useState(false);
  
  const {
    formData,
    attachedFiles,
    setAttachedFiles,
    handleInputChange,
    handleSubmit,
    resetForm,
  } = useAddSellerForm(onAddSeller, undefined, () => setOpen(false)); // Remove onSellerAdded to prevent redirect

  const onOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Seller
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <User className="w-6 h-6" />
            Add New Seller Lead
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <PersonalInfoSection
            firstName={formData.firstName}
            lastName={formData.lastName}
            onInputChange={handleInputChange}
          />

          <ContactInfoSection
            phone={formData.phone}
            email={formData.email}
            onInputChange={handleInputChange}
          />

          <PropertyInfoSection
            propertyAddress={formData.propertyAddress}
            occupancyStatus={formData.occupancyStatus}
            taxId={formData.taxId}
            onInputChange={handleInputChange}
          />

          <LeadInfoSection
            leadSource={formData.leadSource}
            temperature={formData.temperature}
            agentName={formData.agentName}
            campaignId={formData.campaignId}
            onInputChange={handleInputChange}
          />

          <FinancialInfoSection
            askingPrice={formData.askingPrice}
            mortgagePrice={formData.mortgagePrice}
            currentArrears={formData.currentArrears}
            onInputChange={handleInputChange}
          />

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-4 text-gray-800">Additional Information</h3>
            <div className="space-y-4">
              <NotesSection
                notes={formData.notes}
                onInputChange={handleInputChange}
              />

              <FileUploadSection
                attachedFiles={attachedFiles}
                onFilesChange={setAttachedFiles}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6">
              Add Seller Lead
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

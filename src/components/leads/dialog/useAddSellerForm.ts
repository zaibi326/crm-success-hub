
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TaxLead } from '@/types/taxLead';

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  propertyAddress: string;
  leadSource: string;
  temperature: 'HOT' | 'WARM' | 'COLD';
  occupancyStatus: 'OWNER_OCCUPIED' | 'TENANT_OCCUPIED' | 'VACANT';
  agentName: string;
  notes: string;
  askingPrice: string;
  mortgagePrice: string;
  currentArrears: string;
  taxId: string;
  campaignId: string;
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  propertyAddress: '',
  leadSource: '',
  temperature: 'COLD',
  occupancyStatus: 'OWNER_OCCUPIED',
  agentName: '',
  notes: '',
  askingPrice: '',
  mortgagePrice: '',
  currentArrears: '',
  taxId: '',
  campaignId: '',
};

export function useAddSellerForm(
  onAddSeller: (seller: TaxLead) => void,
  onSellerAdded?: (seller: TaxLead) => void,
  onSuccess?: () => void
) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.firstName || !formData.propertyAddress || (!formData.phone && !formData.email)) {
      toast({
        title: "Validation Error",
        description: "Please fill in First Name, Property Address, and at least Phone or Email",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setAttachedFiles([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Convert File[] to the expected format
    const formattedFiles = attachedFiles.map((file, index) => ({
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
    };

    onAddSeller(newSeller);
    resetForm();

    toast({
      title: "Success! ✅",
      description: "Seller lead added successfully",
    });

    if (onSellerAdded) {
      onSellerAdded(newSeller);
    }

    if (onSuccess) {
      onSuccess();
    }
  };

  return {
    formData,
    attachedFiles,
    setAttachedFiles,
    handleInputChange,
    handleSubmit,
    resetForm,
  };
}

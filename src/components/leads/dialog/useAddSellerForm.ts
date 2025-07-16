
import { useState } from 'react';
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
  attachedFiles: File[];
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
  attachedFiles: [],
};

export function useAddSellerForm(
  onAddSeller?: (seller: TaxLead) => void,
  onSellerAdded?: (seller: TaxLead) => void,
  onClose?: () => void
) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.propertyAddress.trim()) {
      newErrors.propertyAddress = 'Property address is required';
    }

    if (!formData.phone.trim() && !formData.email.trim()) {
      newErrors.phone = 'Either phone or email is required';
      newErrors.email = 'Either phone or email is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
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
        occupancyStatus: formData.occupancyStatus,
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
        vestingDeedDate: '',
        grantorGranteeName: '',
      };

      if (onAddSeller) {
        onAddSeller(newSeller);
      }
      
      if (onSellerAdded) {
        onSellerAdded(newSeller);
      }

      if (onClose) {
        onClose();
      }

    } catch (error) {
      console.error('Error adding seller:', error);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setAttachedFiles([]);
    setErrors({});
  };

  return {
    formData,
    attachedFiles,
    setAttachedFiles,
    errors,
    setFormData,
    validateForm,
    handleInputChange,
    handleSubmit,
    resetForm,
  };
}

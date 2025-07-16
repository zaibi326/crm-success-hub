
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

export function useAddSellerForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
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

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  return {
    formData,
    errors,
    setFormData,
    validateForm,
    resetForm,
  };
}

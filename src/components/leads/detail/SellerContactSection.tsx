
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, Save, X, ChevronDown, ChevronUp } from 'lucide-react';
import { TaxLead } from '@/types/taxLead';
import { toast } from 'sonner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface SellerContactSectionProps {
  lead: TaxLead;
  onFieldUpdate: (field: keyof TaxLead, value: string) => void;
  canEdit?: boolean;
}

export function SellerContactSection({ lead, onFieldUpdate, canEdit = true }: SellerContactSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    sellerName: lead.ownerName || '',
    sellerEmail: lead.email || '',
    sellerPhone: lead.phone || ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.sellerName.trim()) {
      newErrors.sellerName = 'Seller name is required';
    }
    
    if (formData.sellerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.sellerEmail)) {
      newErrors.sellerEmail = 'Please enter a valid email address';
    }
    
    if (formData.sellerPhone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.sellerPhone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.sellerPhone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }

    onFieldUpdate('ownerName', formData.sellerName);
    onFieldUpdate('email', formData.sellerEmail);
    onFieldUpdate('phone', formData.sellerPhone);
    
    setIsEditing(false);
    toast.success('Seller contact details updated successfully');
  };

  const handleCancel = () => {
    setFormData({
      sellerName: lead.ownerName || '',
      sellerEmail: lead.email || '',
      sellerPhone: lead.phone || ''
    });
    setErrors({});
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="bg-white shadow-sm border border-gray-200 rounded-lg">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors rounded-t-lg">
            <CardTitle className="flex items-center justify-between text-lg font-semibold text-gray-900">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                Seller Contact Details
              </div>
              {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="p-6 pt-0">
            {!canEdit && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6 text-amber-700 text-sm">
                You don't have permission to edit seller contact details.
              </div>
            )}

            <div className="space-y-6">
              {/* Seller Name */}
              <div className="space-y-2">
                <Label htmlFor="sellerName" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  Seller Name *
                </Label>
                {isEditing ? (
                  <div>
                    <Input
                      id="sellerName"
                      value={formData.sellerName}
                      onChange={(e) => handleInputChange('sellerName', e.target.value)}
                      placeholder="Enter seller name"
                      className={`w-full ${errors.sellerName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                    />
                    {errors.sellerName && (
                      <p className="text-red-500 text-xs mt-1">{errors.sellerName}</p>
                    )}
                  </div>
                ) : (
                  <div className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                    {formData.sellerName || 'Not provided'}
                  </div>
                )}
              </div>

              {/* Seller Email */}
              <div className="space-y-2">
                <Label htmlFor="sellerEmail" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  Seller Email
                </Label>
                {isEditing ? (
                  <div>
                    <Input
                      id="sellerEmail"
                      type="email"
                      value={formData.sellerEmail}
                      onChange={(e) => handleInputChange('sellerEmail', e.target.value)}
                      placeholder="Enter seller email"
                      className={`w-full ${errors.sellerEmail ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                    />
                    {errors.sellerEmail && (
                      <p className="text-red-500 text-xs mt-1">{errors.sellerEmail}</p>
                    )}
                  </div>
                ) : (
                  <div className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                    {formData.sellerEmail || 'Not provided'}
                  </div>
                )}
              </div>

              {/* Seller Phone */}
              <div className="space-y-2">
                <Label htmlFor="sellerPhone" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  Seller Phone Number
                </Label>
                {isEditing ? (
                  <div>
                    <Input
                      id="sellerPhone"
                      type="tel"
                      value={formData.sellerPhone}
                      onChange={(e) => handleInputChange('sellerPhone', e.target.value)}
                      placeholder="Enter seller phone number"
                      className={`w-full ${errors.sellerPhone ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                    />
                    {errors.sellerPhone && (
                      <p className="text-red-500 text-xs mt-1">{errors.sellerPhone}</p>
                    )}
                  </div>
                ) : (
                  <div className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                    {formData.sellerPhone || 'Not provided'}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {canEdit && (
              <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-100">
                {isEditing ? (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={handleCancel} 
                      className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSave} 
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={() => setIsEditing(true)} 
                    variant="outline" 
                    className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    <User className="w-4 h-4" />
                    Edit Contact Details
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

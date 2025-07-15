
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

    // Update the lead with new seller contact information
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
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CollapsibleTrigger asChild>
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg cursor-pointer hover:from-blue-100 hover:to-blue-150 transition-colors">
            <CardTitle className="flex items-center justify-between text-xl">
              <div className="flex items-center gap-3">
                <User className="w-6 h-6 text-blue-600" />
                Seller Contact Details
              </div>
              {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="p-6 space-y-4">
            {!canEdit && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                <p className="text-amber-700 text-sm">You don't have permission to edit seller contact details.</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Seller Name */}
              <div className="space-y-2">
                <Label htmlFor="sellerName" className="flex items-center gap-2">
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
                      className={errors.sellerName ? 'border-red-500' : ''}
                    />
                    {errors.sellerName && (
                      <p className="text-red-500 text-xs mt-1">{errors.sellerName}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-900 font-medium p-2 bg-gray-50 rounded border">
                    {formData.sellerName || 'Not provided'}
                  </p>
                )}
              </div>

              {/* Seller Email */}
              <div className="space-y-2">
                <Label htmlFor="sellerEmail" className="flex items-center gap-2">
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
                      className={errors.sellerEmail ? 'border-red-500' : ''}
                    />
                    {errors.sellerEmail && (
                      <p className="text-red-500 text-xs mt-1">{errors.sellerEmail}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-900 font-medium p-2 bg-gray-50 rounded border">
                    {formData.sellerEmail || 'Not provided'}
                  </p>
                )}
              </div>

              {/* Seller Phone */}
              <div className="space-y-2">
                <Label htmlFor="sellerPhone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  Seller Phone
                </Label>
                {isEditing ? (
                  <div>
                    <Input
                      id="sellerPhone"
                      type="tel"
                      value={formData.sellerPhone}
                      onChange={(e) => handleInputChange('sellerPhone', e.target.value)}
                      placeholder="Enter seller phone"
                      className={errors.sellerPhone ? 'border-red-500' : ''}
                    />
                    {errors.sellerPhone && (
                      <p className="text-red-500 text-xs mt-1">{errors.sellerPhone}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-900 font-medium p-2 bg-gray-50 rounded border">
                    {formData.sellerPhone || 'Not provided'}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {canEdit && (
              <div className="flex justify-end gap-3 pt-4 border-t">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2">
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                    <Button onClick={handleSave} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                      <Save className="w-4 h-4" />
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)} variant="outline" className="flex items-center gap-2">
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

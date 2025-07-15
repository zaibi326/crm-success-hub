
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Save, X, ChevronDown, ChevronUp, MapPin, ExternalLink } from 'lucide-react';
import { TaxLead } from '@/types/taxLead';
import { toast } from 'sonner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface EnhancedLeadDetailsSectionProps {
  lead: TaxLead;
  onFieldUpdate: (field: keyof TaxLead, value: string) => void;
  canEdit?: boolean;
}

export function EnhancedLeadDetailsSection({ lead, onFieldUpdate, canEdit = true }: EnhancedLeadDetailsSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    ownerName: lead.ownerName || '',
    taxId: lead.taxId || '',
    taxLawsuitNumber: lead.taxLawsuitNumber || '',
    phone: lead.phone || '',
    status: lead.status || 'WARM',
    propertyAddress: lead.propertyAddress || ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.ownerName.trim()) {
      newErrors.ownerName = 'Owner name is required';
    }
    
    if (!formData.propertyAddress.trim()) {
      newErrors.propertyAddress = 'Property address is required';
    }
    
    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }

    // Update the lead with new details
    Object.entries(formData).forEach(([key, value]) => {
      onFieldUpdate(key as keyof TaxLead, value);
    });
    
    setIsEditing(false);
    toast.success('Lead details updated successfully');
  };

  const handleCancel = () => {
    setFormData({
      ownerName: lead.ownerName || '',
      taxId: lead.taxId || '',
      taxLawsuitNumber: lead.taxLawsuitNumber || '',
      phone: lead.phone || '',
      status: lead.status || 'WARM',
      propertyAddress: lead.propertyAddress || ''
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HOT': return 'bg-red-100 text-red-800 border-red-200';
      case 'WARM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'COLD': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PASS': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const openZillow = () => {
    if (formData.propertyAddress) {
      const encodedAddress = encodeURIComponent(formData.propertyAddress);
      window.open(`https://www.zillow.com/homes/${encodedAddress}/`, '_blank');
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CollapsibleTrigger asChild>
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 rounded-t-lg cursor-pointer hover:from-green-100 hover:to-green-150 transition-colors">
            <CardTitle className="flex items-center justify-between text-xl">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-green-600" />
                Lead Details
              </div>
              {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="p-6 space-y-6">
            {!canEdit && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                <p className="text-amber-700 text-sm">You don't have permission to edit lead details.</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Owner Name */}
              <div className="space-y-2">
                <Label htmlFor="ownerName">Owner Name *</Label>
                {isEditing ? (
                  <div>
                    <Input
                      id="ownerName"
                      value={formData.ownerName}
                      onChange={(e) => handleInputChange('ownerName', e.target.value)}
                      placeholder="Enter owner name"
                      className={errors.ownerName ? 'border-red-500' : ''}
                    />
                    {errors.ownerName && (
                      <p className="text-red-500 text-xs mt-1">{errors.ownerName}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-900 font-medium p-2 bg-gray-50 rounded border">
                    {formData.ownerName || 'Not provided'}
                  </p>
                )}
              </div>

              {/* Tax ID */}
              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID</Label>
                {isEditing ? (
                  <Input
                    id="taxId"
                    value={formData.taxId}
                    onChange={(e) => handleInputChange('taxId', e.target.value)}
                    placeholder="Enter tax ID"
                  />
                ) : (
                  <p className="text-gray-900 font-medium p-2 bg-gray-50 rounded border">
                    {formData.taxId || 'Not provided'}
                  </p>
                )}
              </div>

              {/* Lawsuit Number */}
              <div className="space-y-2">
                <Label htmlFor="taxLawsuitNumber">Lawsuit Number</Label>
                {isEditing ? (
                  <Input
                    id="taxLawsuitNumber"
                    value={formData.taxLawsuitNumber}
                    onChange={(e) => handleInputChange('taxLawsuitNumber', e.target.value)}
                    placeholder="Enter lawsuit number"
                  />
                ) : (
                  <p className="text-gray-900 font-medium p-2 bg-gray-50 rounded border">
                    {formData.taxLawsuitNumber || 'Not provided'}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                {isEditing ? (
                  <div>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter phone number"
                      className={errors.phone ? 'border-red-500' : ''}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-900 font-medium p-2 bg-gray-50 rounded border">
                    {formData.phone || 'Not provided'}
                  </p>
                )}
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                {isEditing ? (
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HOT">🔥 Hot</SelectItem>
                      <SelectItem value="WARM">🌤️ Warm</SelectItem>
                      <SelectItem value="COLD">❄️ Cold</SelectItem>
                      <SelectItem value="PASS">⏭️ Pass</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(formData.status)}`}>
                    {formData.status === 'HOT' && '🔥'} 
                    {formData.status === 'WARM' && '🌤️'} 
                    {formData.status === 'COLD' && '❄️'} 
                    {formData.status === 'PASS' && '⏭️'} 
                    {formData.status}
                  </span>
                )}
              </div>
            </div>

            {/* Property Address Section */}
            <div className="space-y-4 border-t pt-4">
              <div className="space-y-2">
                <Label htmlFor="propertyAddress" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  Property Address *
                </Label>
                {isEditing ? (
                  <div>
                    <Input
                      id="propertyAddress"
                      value={formData.propertyAddress}
                      onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
                      placeholder="Enter property address"
                      className={errors.propertyAddress ? 'border-red-500' : ''}
                    />
                    {errors.propertyAddress && (
                      <p className="text-red-500 text-xs mt-1">{errors.propertyAddress}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-900 font-medium p-2 bg-gray-50 rounded border">
                    {formData.propertyAddress || 'Not provided'}
                  </p>
                )}
              </div>

              {/* Zillow Map Widget */}
              {formData.propertyAddress && (
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MapPin className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Property Location</h3>
                    <p className="text-blue-700 text-sm mb-4">{formData.propertyAddress}</p>
                    <Button
                      onClick={openZillow}
                      className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View on Zillow
                    </Button>
                  </div>
                </div>
              )}
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
                    <Button onClick={handleSave} className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
                      <Save className="w-4 h-4" />
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)} variant="outline" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Edit Lead Details
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

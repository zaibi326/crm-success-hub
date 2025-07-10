
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, User, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TaxLead } from '@/types/taxLead';

interface ComprehensiveAddSellerDialogProps {
  onAddSeller: (seller: TaxLead) => void;
  onSellerAdded?: (seller: TaxLead) => void;
}

export function ComprehensiveAddSellerDialog({ onAddSeller, onSellerAdded }: ComprehensiveAddSellerDialogProps) {
  const [open, setOpen] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    propertyAddress: '',
    leadSource: '',
    temperature: 'COLD' as 'HOT' | 'WARM' | 'COLD',
    occupancyStatus: 'OWNER_OCCUPIED' as 'OWNER_OCCUPIED' | 'TENANT_OCCUPIED' | 'VACANT',
    agentName: '',
    notes: '',
    askingPrice: '',
    mortgagePrice: '',
    currentArrears: '',
    taxId: '',
    campaignId: '',
  });

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation for required fields
    if (!formData.firstName || !formData.propertyAddress || (!formData.phone && !formData.email)) {
      toast({
        title: "Validation Error",
        description: "Please fill in First Name, Property Address, and at least Phone or Email",
        variant: "destructive",
      });
      return;
    }

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
      attachedFiles: attachedFiles,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddSeller(newSeller);
    setOpen(false);
    
    // Reset form
    setFormData({
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
    });
    setAttachedFiles([]);

    toast({
      title: "Success! ✅",
      description: "Seller lead added successfully",
    });

    // Redirect to seller detail page if callback provided
    if (onSellerAdded) {
      onSellerAdded(newSeller);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachedFiles(prev => [...prev, ...files]);
    toast({
      title: "Files attached",
      description: `${files.length} file(s) attached successfully`,
    });
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getOccupancyLabel = (value: string) => {
    switch (value) {
      case 'OWNER_OCCUPIED': return 'Owner Occupied';
      case 'TENANT_OCCUPIED': return 'Tenant Occupied';
      case 'VACANT': return 'Vacant';
      default: return value;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Seller
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <User className="w-6 h-6" />
            Add New Seller Lead
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-4 text-gray-800">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="firstName" className="w-24 text-right font-medium">
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Enter first name"
                  className="flex-1"
                  required
                />
              </div>
              
              <div className="flex items-center gap-4">
                <Label htmlFor="lastName" className="w-24 text-right font-medium">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter last name"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-4 text-gray-800">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="phone" className="w-24 text-right font-medium">
                  Phone *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                  className="flex-1"
                />
              </div>
              
              <div className="flex items-center gap-4">
                <Label htmlFor="email" className="w-24 text-right font-medium">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="seller@email.com"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* Property Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-4 text-gray-800">Property Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="propertyAddress" className="w-24 text-right font-medium">
                  Property Address *
                </Label>
                <Input
                  id="propertyAddress"
                  value={formData.propertyAddress}
                  onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
                  placeholder="Enter full property address"
                  className="flex-1"
                  required
                />
              </div>

              <div className="flex items-center gap-4">
                <Label htmlFor="occupancyStatus" className="w-24 text-right font-medium">
                  Occupancy Status
                </Label>
                <Select value={formData.occupancyStatus} onValueChange={(value) => handleInputChange('occupancyStatus', value)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select occupancy status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OWNER_OCCUPIED">Owner Occupied</SelectItem>
                    <SelectItem value="TENANT_OCCUPIED">Tenant Occupied</SelectItem>
                    <SelectItem value="VACANT">Vacant</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-4">
                <Label htmlFor="taxId" className="w-24 text-right font-medium">
                  Tax ID
                </Label>
                <Input
                  id="taxId"
                  value={formData.taxId}
                  onChange={(e) => handleInputChange('taxId', e.target.value)}
                  placeholder="TX123456789"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* Lead Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-4 text-gray-800">Lead Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="leadSource" className="w-24 text-right font-medium">
                  Lead Source
                </Label>
                <Input
                  id="leadSource"
                  value={formData.leadSource}
                  onChange={(e) => handleInputChange('leadSource', e.target.value)}
                  placeholder="e.g., Website, Referral, Cold Call"
                  className="flex-1"
                />
              </div>

              <div className="flex items-center gap-4">
                <Label htmlFor="temperature" className="w-24 text-right font-medium">
                  Temperature
                </Label>
                <Select value={formData.temperature} onValueChange={(value) => handleInputChange('temperature', value)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select temperature" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HOT">🔥 Hot</SelectItem>
                    <SelectItem value="WARM">🌤️ Warm</SelectItem>
                    <SelectItem value="COLD">❄️ Cold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-4">
                <Label htmlFor="agentName" className="w-24 text-right font-medium">
                  Agent Name
                </Label>
                <Input
                  id="agentName"
                  value={formData.agentName}
                  onChange={(e) => handleInputChange('agentName', e.target.value)}
                  placeholder="Enter agent name"
                  className="flex-1"
                />
              </div>

              <div className="flex items-center gap-4">
                <Label htmlFor="campaignId" className="w-24 text-right font-medium">
                  Campaign
                </Label>
                <Input
                  id="campaignId"
                  value={formData.campaignId}
                  onChange={(e) => handleInputChange('campaignId', e.target.value)}
                  placeholder="Link to campaign"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-4 text-gray-800">Financial Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="askingPrice" className="w-24 text-right font-medium">
                  Asking Price ($)
                </Label>
                <Input
                  id="askingPrice"
                  type="number"
                  step="0.01"
                  value={formData.askingPrice}
                  onChange={(e) => handleInputChange('askingPrice', e.target.value)}
                  placeholder="0.00"
                  className="flex-1"
                />
              </div>
              
              <div className="flex items-center gap-4">
                <Label htmlFor="mortgagePrice" className="w-24 text-right font-medium">
                  Mortgage Price ($)
                </Label>
                <Input
                  id="mortgagePrice"
                  type="number"
                  step="0.01"
                  value={formData.mortgagePrice}
                  onChange={(e) => handleInputChange('mortgagePrice', e.target.value)}
                  placeholder="0.00"
                  className="flex-1"
                />
              </div>
              
              <div className="flex items-center gap-4">
                <Label htmlFor="currentArrears" className="w-24 text-right font-medium">
                  Current Arrears ($)
                </Label>
                <Input
                  id="currentArrears"
                  type="number"
                  step="0.01"
                  value={formData.currentArrears}
                  onChange={(e) => handleInputChange('currentArrears', e.target.value)}
                  placeholder="0.00"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* Notes and Files */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-4 text-gray-800">Additional Information</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Label htmlFor="notes" className="w-24 text-right font-medium mt-2">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Add any additional notes about this lead..."
                  rows={4}
                  className="flex-1"
                />
              </div>

              <div className="flex gap-4">
                <Label className="w-24 text-right font-medium mt-2">
                  Attach Files
                </Label>
                <div className="flex-1">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                      <Upload className="w-8 h-8 text-gray-400" />
                      <span className="text-sm text-gray-600">Click to upload files</span>
                      <span className="text-xs text-gray-400">PDF, DOC, JPG, PNG supported</span>
                    </label>
                  </div>
                  
                  {attachedFiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {attachedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
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

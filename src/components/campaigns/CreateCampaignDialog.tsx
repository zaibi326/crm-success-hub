
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Target, DollarSign, Upload, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EnhancedCsvUploader } from '@/components/leads/EnhancedCsvUploader';

interface CreateCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCampaignCreated: () => void;
}

export function CreateCampaignDialog({ open, onOpenChange, onCampaignCreated }: CreateCampaignDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: '',
    targetDeals: '',
    status: 'draft'
  });
  const [currentTab, setCurrentTab] = useState('details');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateCampaign = async () => {
    if (!formData.name || !formData.startDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Name and Start Date).",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate campaign creation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Campaign Created",
      description: `Campaign "${formData.name}" has been created successfully.`,
    });
    
    setIsSubmitting(false);
    onCampaignCreated();
    onOpenChange(false);
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      budget: '',
      targetDeals: '',
      status: 'draft'
    });
    setCurrentTab('details');
  };

  const handleCsvUploadComplete = () => {
    toast({
      title: "Leads Imported",
      description: "CSV leads have been successfully imported to this campaign.",
    });
    setCurrentTab('details');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Target className="w-5 h-5 text-blue-600" />
            Create New Campaign
          </DialogTitle>
          <DialogDescription>
            Set up a new marketing campaign with leads import and tracking capabilities.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Campaign Details
            </TabsTrigger>
            <TabsTrigger value="leads" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Import Leads
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Campaign Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter campaign name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your campaign objectives"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Initial Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Timeline & Targets
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget ($)</Label>
                    <Input
                      id="budget"
                      type="number"
                      placeholder="0"
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetDeals">Target Deals</Label>
                    <Input
                      id="targetDeals"
                      type="number"
                      placeholder="0"
                      value={formData.targetDeals}
                      onChange={(e) => handleInputChange('targetDeals', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCampaign} disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Campaign'}
              </Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="leads" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Import Campaign Leads</CardTitle>
                <p className="text-sm text-gray-600">
                  Upload a CSV file with your campaign leads. The system will map the fields automatically.
                </p>
              </CardHeader>
              <CardContent>
                <EnhancedCsvUploader onUploadComplete={handleCsvUploadComplete} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}


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
import { CSVUploadSection } from './CSVUploadSection';

interface CreateCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCampaignCreated: (campaignData: any) => Promise<any>;
}

export function CreateCampaignDialog({ open, onOpenChange, onCampaignCreated }: CreateCampaignDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    budget: '',
    target_deals: '',
    status: 'draft'
  });
  const [currentTab, setCurrentTab] = useState('details');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdCampaignId, setCreatedCampaignId] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateCampaign = async () => {
    if (!formData.name || !formData.start_date) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const campaignData = {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        target_deals: formData.target_deals ? parseInt(formData.target_deals) : null,
      };
      
      const createdCampaign = await onCampaignCreated(campaignData);
      if (createdCampaign && createdCampaign.id) {
        setCreatedCampaignId(createdCampaign.id);
        setCurrentTab('leads');
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCSVUploadComplete = () => {
    onOpenChange(false);
    // Reset form
    setFormData({
      name: '',
      description: '',
      start_date: '',
      end_date: '',
      budget: '',
      target_deals: '',
      status: 'draft'
    });
    setCurrentTab('details');
    setCreatedCampaignId(null);
  };

  const handleSkipCSV = () => {
    onOpenChange(false);
    // Reset form
    setFormData({
      name: '',
      description: '',
      start_date: '',
      end_date: '',
      budget: '',
      target_deals: '',
      status: 'draft'
    });
    setCurrentTab('details');
    setCreatedCampaignId(null);
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
            <TabsTrigger value="leads" className="flex items-center gap-2" disabled={!createdCampaignId}>
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
                    <Label htmlFor="start_date">Start Date *</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => handleInputChange('start_date', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => handleInputChange('end_date', e.target.value)}
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
                    <Label htmlFor="target_deals">Target Deals</Label>
                    <Input
                      id="target_deals"
                      type="number"
                      placeholder="0"
                      value={formData.target_deals}
                      onChange={(e) => handleInputChange('target_deals', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateCampaign} 
                disabled={isSubmitting || !formData.name || !formData.start_date}
              >
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
                {createdCampaignId && (
                  <CSVUploadSection 
                    campaignId={createdCampaignId}
                    onUploadComplete={handleCSVUploadComplete}
                    onSkip={handleSkipCSV}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

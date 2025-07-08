
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Target, Edit } from 'lucide-react';
import { Campaign } from '@/hooks/useCampaigns';

interface EditCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: Campaign;
  onCampaignUpdated: (campaignData: any) => void;
}

export function EditCampaignDialog({ open, onOpenChange, campaign, onCampaignUpdated }: EditCampaignDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    budget: '',
    target_deals: '',
    status: 'draft',
    progress: '',
    signed_deals: '',
    equity_purchased: '',
    expenditure: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (campaign && open) {
      setFormData({
        name: campaign.name || '',
        description: campaign.description || '',
        start_date: campaign.start_date || '',
        end_date: campaign.end_date || '',
        budget: campaign.budget?.toString() || '',
        target_deals: campaign.target_deals?.toString() || '',
        status: campaign.status || 'draft',
        progress: campaign.progress?.toString() || '0',
        signed_deals: campaign.signed_deals?.toString() || '0',
        equity_purchased: campaign.equity_purchased?.toString() || '0',
        expenditure: campaign.expenditure?.toString() || '0'
      });
    }
  }, [campaign, open]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateCampaign = async () => {
    if (!formData.name || !formData.start_date) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const campaignData = {
        name: formData.name,
        description: formData.description || null,
        start_date: formData.start_date,
        end_date: formData.end_date || null,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        target_deals: formData.target_deals ? parseInt(formData.target_deals) : null,
        status: formData.status,
        progress: parseInt(formData.progress) || 0,
        signed_deals: parseInt(formData.signed_deals) || 0,
        equity_purchased: parseFloat(formData.equity_purchased) || 0,
        expenditure: parseFloat(formData.expenditure) || 0
      };
      
      await onCampaignUpdated(campaignData);
    } catch (error) {
      console.error('Error updating campaign:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Edit className="w-5 h-5 text-blue-600" />
            Edit Campaign
          </DialogTitle>
          <DialogDescription>
            Update campaign details and track progress.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Campaign Name *</Label>
                  <Input
                    id="edit-name"
                    placeholder="Enter campaign name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    placeholder="Describe your campaign objectives"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
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
                  <Label htmlFor="edit-start-date">Start Date *</Label>
                  <Input
                    id="edit-start-date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => handleInputChange('start_date', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-end-date">End Date</Label>
                  <Input
                    id="edit-end-date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => handleInputChange('end_date', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-budget">Budget ($)</Label>
                  <Input
                    id="edit-budget"
                    type="number"
                    placeholder="0"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-target-deals">Target Deals</Label>
                  <Input
                    id="edit-target-deals"
                    type="number"
                    placeholder="0"
                    value={formData.target_deals}
                    onChange={(e) => handleInputChange('target_deals', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5" />
                Campaign Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-progress">Progress (%)</Label>
                <Input
                  id="edit-progress"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0"
                  value={formData.progress}
                  onChange={(e) => handleInputChange('progress', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-signed-deals">Signed Deals</Label>
                <Input
                  id="edit-signed-deals"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.signed_deals}
                  onChange={(e) => handleInputChange('signed_deals', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-equity-purchased">Equity Purchased ($)</Label>
                <Input
                  id="edit-equity-purchased"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.equity_purchased}
                  onChange={(e) => handleInputChange('equity_purchased', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-expenditure">Expenditure ($)</Label>
                <Input
                  id="edit-expenditure"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.expenditure}
                  onChange={(e) => handleInputChange('expenditure', e.target.value)}
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
            onClick={handleUpdateCampaign} 
            disabled={isSubmitting || !formData.name || !formData.start_date}
          >
            {isSubmitting ? 'Updating...' : 'Update Campaign'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

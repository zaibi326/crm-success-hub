
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LeadInfoSectionProps {
  leadSource: string;
  temperature: 'HOT' | 'WARM' | 'COLD';
  agentName: string;
  campaignId: string;
  onInputChange: (field: string, value: string) => void;
}

export function LeadInfoSection({ leadSource, temperature, agentName, campaignId, onInputChange }: LeadInfoSectionProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="font-semibold text-lg mb-4 text-gray-800">Lead Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-4">
          <Label htmlFor="leadSource" className="w-24 text-right font-medium">
            Lead Source
          </Label>
          <Input
            id="leadSource"
            value={leadSource}
            onChange={(e) => onInputChange('leadSource', e.target.value)}
            placeholder="e.g., Website, Referral, Cold Call"
            className="flex-1"
          />
        </div>

        <div className="flex items-center gap-4">
          <Label htmlFor="temperature" className="w-24 text-right font-medium">
            Temperature
          </Label>
          <Select value={temperature} onValueChange={(value) => onInputChange('temperature', value)}>
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
            value={agentName}
            onChange={(e) => onInputChange('agentName', e.target.value)}
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
            value={campaignId}
            onChange={(e) => onInputChange('campaignId', e.target.value)}
            placeholder="Link to campaign"
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}

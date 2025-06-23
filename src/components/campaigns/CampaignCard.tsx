
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar, DollarSign, Target, TrendingUp } from 'lucide-react';

interface Campaign {
  id: number;
  name: string;
  date: string;
  status: string;
  progress: number;
  deals: number;
  equity: string;
  spend: string;
}

interface CampaignCardProps {
  campaign: Campaign;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Planning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className="hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-crm-primary transition-colors">
            {campaign.name}
          </CardTitle>
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(campaign.status)}`}>
            {campaign.status}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          {formatDate(campaign.date)}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Progress</span>
            <span className="text-sm font-semibold text-gray-900">{campaign.progress}%</span>
          </div>
          <Progress value={campaign.progress} className="h-2" />
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center p-2 bg-blue-50 rounded-lg">
            <Target className="w-4 h-4 text-blue-600 mb-1" />
            <span className="text-xs text-gray-600">Deals</span>
            <span className="text-sm font-semibold text-gray-900">{campaign.deals}</span>
          </div>
          
          <div className="flex flex-col items-center p-2 bg-green-50 rounded-lg">
            <TrendingUp className="w-4 h-4 text-green-600 mb-1" />
            <span className="text-xs text-gray-600">Equity</span>
            <span className="text-sm font-semibold text-gray-900">{campaign.equity}</span>
          </div>
          
          <div className="flex flex-col items-center p-2 bg-orange-50 rounded-lg">
            <DollarSign className="w-4 h-4 text-orange-600 mb-1" />
            <span className="text-xs text-gray-600">Spend</span>
            <span className="text-sm font-semibold text-gray-900">{campaign.spend}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

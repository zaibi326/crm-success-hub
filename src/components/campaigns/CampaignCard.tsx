
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar, DollarSign, Target, TrendingUp, Clock, Eye, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRoleAccess } from '@/hooks/useRoleAccess';

interface Campaign {
  id: number;
  name: string;
  date: string;
  endDate?: string;
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
  const { canCreateCampaigns } = useRoleAccess();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Planning':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Draft':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-gradient-to-r from-emerald-500 to-green-600';
    if (progress >= 50) return 'bg-gradient-to-r from-blue-500 to-cyan-600';
    if (progress >= 25) return 'bg-gradient-to-r from-amber-500 to-orange-600';
    return 'bg-gradient-to-r from-red-500 to-pink-600';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isActive = campaign.status === 'Active';
  const isCompleted = campaign.status === 'Completed';

  return (
    <Card className="group hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-blue-100/50 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2 flex-1">
            {campaign.name}
          </CardTitle>
          <div className="flex items-center gap-2 ml-2">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all duration-200 ${getStatusColor(campaign.status)}`}>
              {campaign.status}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(campaign.date)}</span>
          </div>
          {campaign.endDate && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatDate(campaign.endDate)}</span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 relative z-10">
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-gray-700">Progress</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">{campaign.progress}%</span>
              {isCompleted && <span className="text-xs text-green-600 font-medium">Complete</span>}
            </div>
          </div>
          <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ease-out ${getProgressColor(campaign.progress)}`}
              style={{ width: `${campaign.progress}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse" />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="group/stat flex flex-col items-center p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl hover:shadow-md transition-all duration-200">
            <div className="p-2 bg-blue-500 rounded-lg group-hover/stat:scale-110 transition-transform duration-200">
              <Target className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs text-gray-600 mt-2 font-medium">Signed Deals</span>
            <span className="text-lg font-bold text-gray-900">{campaign.deals}</span>
          </div>
          
          <div className="group/stat flex flex-col items-center p-3 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl hover:shadow-md transition-all duration-200">
            <div className="p-2 bg-emerald-500 rounded-lg group-hover/stat:scale-110 transition-transform duration-200">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs text-gray-600 mt-2 font-medium">Equity Purchased</span>
            <span className="text-lg font-bold text-gray-900">{campaign.equity}</span>
          </div>
          
          <div className="group/stat flex flex-col items-center p-3 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl hover:shadow-md transition-all duration-200">
            <div className="p-2 bg-orange-500 rounded-lg group-hover/stat:scale-110 transition-transform duration-200">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs text-gray-600 mt-2 font-medium">Expenditure</span>
            <span className="text-lg font-bold text-gray-900">{campaign.spend}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 border-t border-gray-100">
          <Button variant="outline" size="sm" className="flex-1">
            <Eye className="w-4 h-4 mr-1" />
            View Details
          </Button>
          {canCreateCampaigns && (
            <Button variant="outline" size="sm" className="flex-1">
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

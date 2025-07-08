
import React, { useMemo } from 'react';
import { Search, Plus } from 'lucide-react';
import { CampaignCard } from './CampaignCard';
import { Button } from '@/components/ui/button';
import { Campaign } from '@/hooks/useCampaigns';

interface CampaignGridProps {
  campaigns: Campaign[];
  searchTerm: string;
  sortBy: string;
  filterStatus: string;
  canEdit: boolean;
  onCreateCampaign?: () => void;
  onEditCampaign?: (campaign: Campaign) => void;
  onDeleteCampaign?: (campaignId: string) => void;
}

export function CampaignGrid({ 
  campaigns, 
  searchTerm, 
  sortBy, 
  filterStatus, 
  canEdit, 
  onCreateCampaign,
  onEditCampaign,
  onDeleteCampaign 
}: CampaignGridProps) {
  const filteredAndSortedCampaigns = useMemo(() => {
    let filtered = campaigns;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(campaign =>
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(campaign =>
        campaign.status.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    // Sort campaigns - default to newest first (by created_at descending)
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'progress':
          return b.progress - a.progress;
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          // Default sort by created_at descending (newest first)
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return filtered;
  }, [campaigns, searchTerm, sortBy, filterStatus]);

  if (filteredAndSortedCampaigns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
        <p className="text-gray-500 mb-4">Try adjusting your search or filters to find what you're looking for.</p>
        {canEdit && (
          <Button onClick={onCreateCampaign} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Campaign
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {filteredAndSortedCampaigns.map((campaign, index) => (
        <div 
          key={campaign.id} 
          className="animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CampaignCard 
            campaign={campaign} 
            onEdit={canEdit ? onEditCampaign : undefined}
            onDelete={canEdit ? onDeleteCampaign : undefined}
          />
        </div>
      ))}
    </div>
  );
}

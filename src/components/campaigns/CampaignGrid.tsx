
import React, { useMemo } from 'react';
import { Search, Plus } from 'lucide-react';
import { CampaignCard } from './CampaignCard';
import { Button } from '@/components/ui/button';

const campaigns = [
  {
    id: 1,
    name: "Holiday Campaign 2024",
    date: "2024-12-15",
    endDate: "2024-12-31",
    status: "Active",
    progress: 85,
    deals: 32,
    equity: "$180,000",
    spend: "$12,500"
  },
  {
    id: 2,
    name: "Customer Retention Drive",
    date: "2024-11-10",
    endDate: "2024-12-31",
    status: "Active",
    progress: 70,
    deals: 28,
    equity: "$150,000",
    spend: "$9,800"
  },
  {
    id: 3,
    name: "New Market Expansion",
    date: "2024-10-05",
    endDate: "2024-11-30",
    status: "Planning",
    progress: 45,
    deals: 15,
    equity: "$85,000",
    spend: "$6,200"
  },
  {
    id: 4,
    name: "Q3 Brand Awareness",
    date: "2024-08-01",
    endDate: "2024-09-30",
    status: "Completed",
    progress: 100,
    deals: 42,
    equity: "$220,000",
    spend: "$15,000"
  },
  {
    id: 5,
    name: "Summer Product Launch",
    date: "2024-07-15",
    endDate: "2024-08-15",
    status: "Completed",
    progress: 100,
    deals: 38,
    equity: "$195,000",
    spend: "$11,200"
  },
  {
    id: 6,
    name: "Spring Collection Launch",
    date: "2024-03-20",
    endDate: "2024-05-20",
    status: "Draft",
    progress: 10,
    deals: 3,
    equity: "$30,000",
    spend: "$1,800"
  }
];

interface CampaignGridProps {
  searchTerm: string;
  sortBy: string;
  filterStatus: string;
  canEdit: boolean;
  onCreateCampaign?: () => void;
}

export function CampaignGrid({ searchTerm, sortBy, filterStatus, canEdit, onCreateCampaign }: CampaignGridProps) {
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

    // Sort campaigns - default to newest first (by date descending)
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime(); // Newest first
        case 'progress':
          return b.progress - a.progress;
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          // Default sort by date descending (newest first)
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    return filtered;
  }, [searchTerm, sortBy, filterStatus]);

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
          <CampaignCard campaign={campaign} />
        </div>
      ))}
    </div>
  );
}


import React, { useMemo } from 'react';
import { Search } from 'lucide-react';
import { CampaignCard } from './CampaignCard';

const campaigns = [
  {
    id: 1,
    name: "Summer Product Launch",
    date: "2024-07-15",
    endDate: "2024-08-15",
    status: "Active",
    progress: 75,
    deals: 24,
    equity: "$125,000",
    spend: "$8,500"
  },
  {
    id: 2,
    name: "Q3 Brand Awareness",
    date: "2024-08-01",
    endDate: "2024-09-30",
    status: "Planning",
    progress: 35,
    deals: 12,
    equity: "$75,000",
    spend: "$4,200"
  },
  {
    id: 3,
    name: "Holiday Campaign 2024",
    date: "2024-11-15",
    endDate: "2024-12-31",
    status: "Draft",
    progress: 15,
    deals: 6,
    equity: "$45,000",
    spend: "$2,100"
  },
  {
    id: 4,
    name: "Customer Retention Drive",
    date: "2024-09-10",
    endDate: "2024-10-31",
    status: "Active",
    progress: 60,
    deals: 18,
    equity: "$95,000",
    spend: "$6,800"
  },
  {
    id: 5,
    name: "New Market Expansion",
    date: "2024-10-05",
    endDate: "2024-11-30",
    status: "Planning",
    progress: 25,
    deals: 8,
    equity: "$60,000",
    spend: "$3,500"
  },
  {
    id: 6,
    name: "Spring Collection Launch",
    date: "2024-12-20",
    endDate: "2025-03-20",
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
}

export function CampaignGrid({ searchTerm, sortBy, filterStatus, canEdit }: CampaignGridProps) {
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

    // Sort campaigns
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'progress':
          return b.progress - a.progress;
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
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
        <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
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

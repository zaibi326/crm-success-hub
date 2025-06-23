
import React from 'react';
import { CampaignCard } from './CampaignCard';

const campaigns = [
  {
    id: 1,
    name: "Summer Product Launch",
    date: "2024-07-15",
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
    status: "Draft",
    progress: 10,
    deals: 3,
    equity: "$30,000",
    spend: "$1,800"
  }
];

export function CampaignGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((campaign) => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
}

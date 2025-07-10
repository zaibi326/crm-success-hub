
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Upload, Eye, Clock, Search } from 'lucide-react';

interface LeadManagementTabsProps {
  activeTab: string;
  onActiveTabChange: (tab: string) => void;
  processingQueueLength: number;
}

export function LeadManagementTabs({ activeTab, onActiveTabChange, processingQueueLength }: LeadManagementTabsProps) {
  return (
    <TabsList className="grid w-full grid-cols-4 mb-6">
      <TabsTrigger value="overview" className="flex items-center gap-2">
        <Eye className="w-4 h-4" />
        Overview
      </TabsTrigger>
      <TabsTrigger value="upload" className="flex items-center gap-2">
        <Upload className="w-4 h-4" />
        Upload CSV
      </TabsTrigger>
      <TabsTrigger value="processing" className="flex items-center gap-2">
        <Clock className="w-4 h-4" />
        Processing
        {processingQueueLength > 0 && (
          <Badge variant="secondary" className="ml-1">
            {processingQueueLength}
          </Badge>
        )}
      </TabsTrigger>
      <TabsTrigger value="review" className="flex items-center gap-2">
        <Search className="w-4 h-4" />
        Review All
      </TabsTrigger>
    </TabsList>
  );
}

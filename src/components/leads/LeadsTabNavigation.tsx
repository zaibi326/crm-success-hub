
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Users, FileText, Eye, BarChart3 } from 'lucide-react';

interface LeadsTabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function LeadsTabNavigation({ activeTab, onTabChange }: LeadsTabNavigationProps) {
  return (
    <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
      <TabsTrigger value="overview" className="flex items-center gap-2">
        <Users className="w-4 h-4" />
        Overview
      </TabsTrigger>
      <TabsTrigger value="upload" className="flex items-center gap-2">
        <Upload className="w-4 h-4" />
        CSV Import
      </TabsTrigger>
      <TabsTrigger value="review" className="flex items-center gap-2">
        <Eye className="w-4 h-4" />
        Lead Review
      </TabsTrigger>
      <TabsTrigger value="details" className="flex items-center gap-2">
        <FileText className="w-4 h-4" />
        Lead Details
      </TabsTrigger>
      <TabsTrigger value="ownership" className="flex items-center gap-2">
        <BarChart3 className="w-4 h-4" />
        Analytics
      </TabsTrigger>
    </TabsList>
  );
}

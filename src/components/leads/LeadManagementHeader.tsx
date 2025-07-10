
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Users, TrendingUp, CheckCircle } from 'lucide-react';

interface LeadManagementHeaderProps {
  totalLeads: number;
  hotLeads: number;
  processedLeads: number;
}

export function LeadManagementHeader({ totalLeads, hotLeads, processedLeads }: LeadManagementHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-200/60 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg transition-all duration-200" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lead Management System</h1>
            <p className="text-sm text-gray-600 mt-0.5">
              Upload, process, and manage your tax lead pipeline
            </p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">{totalLeads} Total</span>
          </div>
          <div className="flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg">
            <TrendingUp className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-red-700">{hotLeads} Hot</span>
          </div>
          <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">{processedLeads} Processed</span>
          </div>
        </div>
      </div>
    </header>
  );
}

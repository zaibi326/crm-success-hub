
import React, { useState } from 'react';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Filter, ChevronDown, Lock } from 'lucide-react';
import { CampaignGrid } from './CampaignGrid';
import { CreateCampaignDialog } from './CreateCampaignDialog';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function CampaignsContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date'); // Default to date for newest first
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { canCreateCampaigns, userRole } = useRoleAccess();

  const handleCreateCampaign = () => {
    setShowCreateDialog(true);
  };

  const handleCampaignCreated = () => {
    // Refresh campaigns list or handle success
    console.log('Campaign created successfully');
  };

  return (
    <SidebarInset className="flex-1 overflow-auto">
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-200/60 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg transition-all duration-200" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Campaign Management</h1>
              <p className="text-sm text-gray-600 mt-0.5">
                {canCreateCampaigns 
                  ? 'Create, manage and track your marketing campaigns with lead imports' 
                  : 'View assigned campaigns - Contact your manager to create new campaigns'
                }
              </p>
            </div>
          </div>
          {canCreateCampaigns ? (
            <Button 
              onClick={handleCreateCampaign}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          ) : (
            <div className="flex items-center gap-2 text-gray-500 bg-gray-100 px-4 py-2 rounded-lg">
              <Lock className="w-4 h-4" />
              <span className="text-sm">View Only Access</span>
            </div>
          )}
        </div>
      </header>

      {/* Role-based access notice for Employees */}
      {userRole === 'Employee' && (
        <div className="p-6 bg-yellow-50/50 border-b border-yellow-200/60">
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-yellow-800 text-lg">Limited Access</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-700 text-sm">
                As an Employee, you have view-only access to campaigns. You can see campaign details, progress, and metrics but cannot create, edit, or delete campaigns. 
                Contact your Manager or Admin for campaign modifications.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Filters and Search Bar */}
      <div className="p-6 bg-gray-50/50 border-b border-gray-200/60">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white shadow-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>

            {/* Status Filter */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40 bg-white shadow-sm border-gray-200">
                <Filter className="w-4 h-4 mr-2 text-gray-400" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 bg-white shadow-sm border-gray-200">
                <ChevronDown className="w-4 h-4 mr-2 text-gray-400" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg">
                <SelectItem value="date">Newest First</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="progress">Progress</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <main className="p-6 bg-gradient-to-br from-gray-50/30 to-white">
        <CampaignGrid 
          searchTerm={searchTerm} 
          sortBy={sortBy} 
          filterStatus={filterStatus}
          canEdit={canCreateCampaigns}
          onCreateCampaign={handleCreateCampaign}
        />
      </main>

      {/* Create Campaign Dialog */}
      <CreateCampaignDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCampaignCreated={handleCampaignCreated}
      />
    </SidebarInset>
  );
}

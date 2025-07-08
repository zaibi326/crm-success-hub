import React, { useState } from 'react';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Filter, ChevronDown, Lock } from 'lucide-react';
import { CampaignGrid } from './CampaignGrid';
import { CreateCampaignDialog } from './CreateCampaignDialog';
import { EditCampaignDialog } from './EditCampaignDialog';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCampaigns, Campaign } from '@/hooks/useCampaigns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export function CampaignsContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<string | null>(null);
  
  const { canCreateCampaigns, userRole } = useRoleAccess();
  const { campaigns, loading, createCampaign, updateCampaign, deleteCampaign } = useCampaigns();

  const handleCreateCampaign = () => {
    setShowCreateDialog(true);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowEditDialog(true);
  };

  const handleDeleteCampaign = (campaignId: string) => {
    setCampaignToDelete(campaignId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (campaignToDelete) {
      await deleteCampaign(campaignToDelete);
      setShowDeleteDialog(false);
      setCampaignToDelete(null);
    }
  };

  const handleCampaignCreated = async (campaignData: any) => {
    const createdCampaign = await createCampaign(campaignData);
    return createdCampaign;
  };

  const handleCampaignUpdated = async (campaignData: any) => {
    if (selectedCampaign) {
      await updateCampaign(selectedCampaign.id, campaignData);
      setShowEditDialog(false);
      setSelectedCampaign(null);
    }
  };

  if (loading) {
    return (
      <SidebarInset className="flex-1 overflow-auto">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading campaigns...</p>
          </div>
        </div>
      </SidebarInset>
    );
  }

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
      
      <div className="p-6 bg-gray-50/50 border-b border-gray-200/60">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white shadow-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>

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
          campaigns={campaigns}
          searchTerm={searchTerm} 
          sortBy={sortBy} 
          filterStatus={filterStatus}
          canEdit={canCreateCampaigns}
          onCreateCampaign={handleCreateCampaign}
          onEditCampaign={handleEditCampaign}
          onDeleteCampaign={handleDeleteCampaign}
        />
      </main>

      <CreateCampaignDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCampaignCreated={handleCampaignCreated}
      />

      {selectedCampaign && (
        <EditCampaignDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          campaign={selectedCampaign}
          onCampaignUpdated={handleCampaignUpdated}
        />
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this campaign? This action cannot be undone and will also delete all associated leads.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarInset>
  );
}

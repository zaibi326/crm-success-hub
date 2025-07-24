
import { useComprehensiveActivityLogger } from './useComprehensiveActivityLogger';
import { Campaign } from './useCampaigns';

export function useCampaignActivityTracking() {
  const { logCampaignActivity } = useComprehensiveActivityLogger();

  const trackCampaignCreated = (campaign: Campaign) => {
    logCampaignActivity(
      'created',
      `Created new campaign "${campaign.name}"`,
      campaign.id,
      {
        campaignName: campaign.name,
        description: campaign.description,
        budget: campaign.budget,
        targetDeals: campaign.target_deals,
        status: campaign.status
      }
    );
  };

  const trackCampaignUpdated = (campaign: Campaign, changedFields: string[]) => {
    logCampaignActivity(
      'updated',
      `Updated campaign "${campaign.name}" - Modified: ${changedFields.join(', ')}`,
      campaign.id,
      {
        campaignName: campaign.name,
        changedFields,
        status: campaign.status
      }
    );
  };

  const trackCampaignDeleted = (campaign: Campaign) => {
    logCampaignActivity(
      'deleted',
      `Deleted campaign "${campaign.name}"`,
      campaign.id,
      {
        campaignName: campaign.name,
        deletedStatus: campaign.status
      }
    );
  };

  const trackCampaignStatusChanged = (campaign: Campaign, oldStatus: string, newStatus: string) => {
    logCampaignActivity(
      'status_change',
      `Changed campaign "${campaign.name}" status from ${oldStatus} to ${newStatus}`,
      campaign.id,
      {
        campaignName: campaign.name,
        oldStatus,
        newStatus
      }
    );
  };

  return {
    trackCampaignCreated,
    trackCampaignUpdated,
    trackCampaignDeleted,
    trackCampaignStatusChanged
  };
}

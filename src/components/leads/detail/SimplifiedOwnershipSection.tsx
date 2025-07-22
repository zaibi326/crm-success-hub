
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Calendar,
  FileText,
  ChevronDown,
  ChevronUp,
  Save
} from 'lucide-react';
import { TaxLead } from '@/types/taxLead';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';

interface SimplifiedOwnershipSectionProps {
  leadData: TaxLead;
  onFieldUpdate: (field: keyof TaxLead, value: string | number | boolean) => void;
  canEdit: boolean;
}

export function SimplifiedOwnershipSection({ 
  leadData, 
  onFieldUpdate, 
  canEdit 
}: SimplifiedOwnershipSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Early return if leadData is not provided
  if (!leadData) {
    return null;
  }
  
  const [localData, setLocalData] = useState({
    ownerOfRecord: leadData.ownerOfRecord || '',
    vestingDeedDate: leadData.vestingDeedDate || '',
    grantorGranteeName: leadData.grantorGranteeName || '',
    occupancyStatus: leadData.occupancyStatus || 'UNKNOWN'
  });
  const { toast } = useToast();

  const handleLocalUpdate = (field: string, value: string) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (!hasChanges) return;

    Object.entries(localData).forEach(([field, value]) => {
      onFieldUpdate(field as keyof TaxLead, value);
    });

    setHasChanges(false);
    toast({
      title: "Ownership Details Saved",
      description: "Property ownership information has been updated successfully",
    });
  };

  const getOccupancyBadgeColor = (status: string) => {
    switch (status) {
      case 'OWNER_OCCUPIED': return 'bg-green-100 text-green-800 border-green-200';
      case 'TENANT_OCCUPIED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'VACANT': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'UNKNOWN': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatOccupancyLabel = (status: string) => {
    return status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="bg-white shadow-sm border border-gray-200 rounded-lg">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors rounded-t-lg pb-4">
            <CardTitle className="flex items-center justify-between text-lg font-semibold text-gray-900">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Home className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <span>Property Ownership Details</span>
                  <p className="text-sm text-gray-500 font-normal mt-1">
                    Owner information and property occupancy status
                  </p>
                </div>
                {hasChanges && (
                  <span className="text-sm text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                    Unsaved changes
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <Badge className={getOccupancyBadgeColor(localData.occupancyStatus)}>
                  {formatOccupancyLabel(localData.occupancyStatus)}
                </Badge>
                {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
              </div>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="p-6 pt-0 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Owner of Record */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  Owner of Record
                </Label>
                <Input
                  value={localData.ownerOfRecord}
                  onChange={(e) => handleLocalUpdate('ownerOfRecord', e.target.value)}
                  placeholder="Enter owner of record name"
                  disabled={!canEdit}
                  className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500">
                  Legal owner name as recorded in public records
                </p>
              </div>

              {/* Occupancy Status */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Home className="w-4 h-4 text-gray-500" />
                  Occupancy Status
                </Label>
                <Select
                  value={localData.occupancyStatus}
                  onValueChange={(value) => handleLocalUpdate('occupancyStatus', value)}
                  disabled={!canEdit}
                >
                  <SelectTrigger className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select occupancy status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OWNER_OCCUPIED">Owner Occupied</SelectItem>
                    <SelectItem value="TENANT_OCCUPIED">Tenant Occupied</SelectItem>
                    <SelectItem value="VACANT">Vacant</SelectItem>
                    <SelectItem value="UNKNOWN">Unknown</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Current occupancy status of the property
                </p>
              </div>

              {/* Vesting Deed Date */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  Vesting Deed Date
                </Label>
                <Input
                  type="date"
                  value={localData.vestingDeedDate}
                  onChange={(e) => handleLocalUpdate('vestingDeedDate', e.target.value)}
                  disabled={!canEdit}
                  className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500">
                  Date when the property was vested to current owner
                </p>
              </div>

              {/* Grantor/Grantee Name */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  Grantor/Grantee Name
                </Label>
                <Input
                  value={localData.grantorGranteeName}
                  onChange={(e) => handleLocalUpdate('grantorGranteeName', e.target.value)}
                  placeholder="Enter grantor/grantee name"
                  disabled={!canEdit}
                  className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500">
                  Name of the party transferring/receiving the property
                </p>
              </div>
            </div>

            {/* Save Button */}
            {canEdit && hasChanges && (
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <Button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Ownership Details
                </Button>
              </div>
            )}

            {/* Information Summary */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Property Overview</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Current Owner:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {localData.ownerOfRecord || leadData.ownerName || 'Not specified'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Occupancy:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {formatOccupancyLabel(localData.occupancyStatus)}
                  </span>
                </div>
                {localData.vestingDeedDate && (
                  <div>
                    <span className="text-gray-600">Vested:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {new Date(localData.vestingDeedDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {localData.grantorGranteeName && (
                  <div>
                    <span className="text-gray-600">From/To:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {localData.grantorGranteeName}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

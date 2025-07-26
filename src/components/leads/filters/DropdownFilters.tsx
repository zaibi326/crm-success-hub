
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FilterComponentProps } from './types';
import { useRealUsers } from '@/hooks/useRealUsers';

export function DropdownFilters({ onAddFilter }: FilterComponentProps) {
  const { data: users = [], isLoading: isLoadingUsers } = useRealUsers();

  return (
    <>
      {/* Created By Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-agile-gray-700">Created By</Label>
        <Select onValueChange={(value) => {
          if (value && value !== "placeholder") {
            const selectedUser = users.find(user => user.id === value);
            const displayName = selectedUser?.display_name || value;
            onAddFilter('createdBy', 'equals', value, `Created By: ${displayName}`);
          }
        }}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={isLoadingUsers ? "Loading users..." : "Select creator..."} />
          </SelectTrigger>
          <SelectContent className="bg-white border-agile-gray-200 z-50">
            {users.map(user => (
              <SelectItem key={user.id} value={user.id || `user_${user.id}`}>
                {user.display_name || 'Unknown User'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Created Via Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-agile-gray-700">Created Via</Label>
        <Select onValueChange={(value) => {
          if (value && value !== "placeholder") {
            onAddFilter('createdVia', 'equals', value, `Via: ${value}`);
          }
        }}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select source..." />
          </SelectTrigger>
          <SelectContent className="bg-white border-agile-gray-200 z-50">
            <SelectItem value="api">🔗 API</SelectItem>
            <SelectItem value="manual">✋ Manual</SelectItem>
            <SelectItem value="webform">🌐 Webform</SelectItem>
            <SelectItem value="import">📊 Import</SelectItem>
            <SelectItem value="csv_upload">📄 CSV Upload</SelectItem>
            <SelectItem value="form_submission">📝 Form Submission</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Last Edited Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-agile-gray-700">Last Edited</Label>
        <Select onValueChange={(value) => {
          if (value && value !== "placeholder") {
            onAddFilter('lastEdited', 'equals', value, `Last Edited: ${value}`);
          }
        }}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select timeframe..." />
          </SelectTrigger>
          <SelectContent className="bg-white border-agile-gray-200 z-50">
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="last_7_days">Last 7 days</SelectItem>
            <SelectItem value="last_30_days">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Move To Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-agile-gray-700">Move To</Label>
        <Select onValueChange={(value) => {
          if (value && value !== "placeholder") {
            onAddFilter('moveTo', 'equals', value, `Move To: ${value}`);
          }
        }}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select destination..." />
          </SelectTrigger>
          <SelectContent className="bg-white border-agile-gray-200 z-50">
            <SelectItem value="hot_leads">Hot Leads</SelectItem>
            <SelectItem value="warm_leads">Warm Leads</SelectItem>
            <SelectItem value="cold_leads">Cold Leads</SelectItem>
            <SelectItem value="keep_leads">Keep Leads</SelectItem>
            <SelectItem value="archive">Archive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lead Manager Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-agile-gray-700">Lead Manager</Label>
        <Select onValueChange={(value) => {
          if (value && value !== "placeholder") {
            const selectedUser = users.find(user => user.id === value);
            const displayName = selectedUser?.display_name || value;
            onAddFilter('leadManager', 'equals', value, `Manager: ${displayName}`);
          }
        }}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={isLoadingUsers ? "Loading managers..." : "Select manager..."} />
          </SelectTrigger>
          <SelectContent className="bg-white border-agile-gray-200 z-50">
            {users.map(user => (
              <SelectItem key={user.id} value={user.id || `manager_${user.id}`}>
                {user.display_name || 'Unknown Manager'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}


import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FilterComponentProps } from './types';

export function DropdownFilters({ onAddFilter }: FilterComponentProps) {
  return (
    <>
      {/* Created By Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-agile-gray-700">Created By</Label>
        <Select onValueChange={(value) => onAddFilter('createdBy', 'equals', value, `Created By: ${value}`)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select creator..." />
          </SelectTrigger>
          <SelectContent className="bg-white border-agile-gray-200 z-50">
            <SelectItem value="john_doe">John Doe</SelectItem>
            <SelectItem value="jane_smith">Jane Smith</SelectItem>
            <SelectItem value="admin_user">Admin User</SelectItem>
            <SelectItem value="lead_manager">Lead Manager</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Created Via Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-agile-gray-700">Created Via</Label>
        <Select onValueChange={(value) => onAddFilter('createdVia', 'equals', value, `Via: ${value}`)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select source..." />
          </SelectTrigger>
          <SelectContent className="bg-white border-agile-gray-200 z-50">
            <SelectItem value="api">🔗 API</SelectItem>
            <SelectItem value="manual">✋ Manual</SelectItem>
            <SelectItem value="webform">🌐 Webform</SelectItem>
            <SelectItem value="import">📊 Import</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Last Edited Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-agile-gray-700">Last Edited</Label>
        <Select onValueChange={(value) => onAddFilter('lastEdited', 'equals', value, `Last Edited: ${value}`)}>
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
        <Select onValueChange={(value) => onAddFilter('moveTo', 'equals', value, `Move To: ${value}`)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select destination..." />
          </SelectTrigger>
          <SelectContent className="bg-white border-agile-gray-200 z-50">
            <SelectItem value="hot_leads">Hot Leads</SelectItem>
            <SelectItem value="warm_leads">Warm Leads</SelectItem>
            <SelectItem value="cold_leads">Cold Leads</SelectItem>
            <SelectItem value="archive">Archive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lead Manager Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-agile-gray-700">Lead Manager</Label>
        <Select onValueChange={(value) => onAddFilter('leadManager', 'equals', value, `Manager: ${value}`)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select manager..." />
          </SelectTrigger>
          <SelectContent className="bg-white border-agile-gray-200 z-50">
            <SelectItem value="sarah_johnson">Sarah Johnson</SelectItem>
            <SelectItem value="mike_davis">Mike Davis</SelectItem>
            <SelectItem value="lisa_chen">Lisa Chen</SelectItem>
            <SelectItem value="david_wilson">David Wilson</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}

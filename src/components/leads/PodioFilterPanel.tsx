import React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from "@/components/ui/slider"
import { FilterState } from './filters/FilterState';

interface PodioFilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  totalResults: number;
  filteredResults: number;
	leads: any[];
}

export function PodioFilterPanel({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  totalResults,
  filteredResults,
	leads
}: PodioFilterPanelProps) {
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="w-80">
        <DrawerHeader>
          <DrawerTitle>Filter Leads</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              value={filters.name}
              onChange={(e) => onFiltersChange({ ...filters, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              type="text"
              id="address"
              value={filters.address}
              onChange={(e) => onFiltersChange({ ...filters, address: e.target.value })}
            />
          </div>
					<div>
						<Label>Score</Label>
						<Slider
							defaultValue={[filters.score]}
							max={100}
							step={1}
							onValueChange={(value) => onFiltersChange({ ...filters, score: value[0] })}
						/>
						<div className="text-sm text-gray-500">Value: {filters.score}</div>
					</div>
          <div className="py-2 text-center">
            <p className="text-sm text-gray-500">
              Showing {filteredResults} of {totalResults} Results
            </p>
          </div>
					<div className="mt-4">
						<h3 className="text-sm font-medium text-gray-700">Sample Leads</h3>
						<div className="mt-2 max-h-40 overflow-y-auto">
          {leads.map((lead) => (
            <div key={lead.id} className="p-3 bg-gray-50 rounded border text-sm">
              <div className="font-medium">{lead.ownerName}</div>
              <div className="text-gray-600">{lead.propertyAddress}</div>
              {lead.agentName && <div className="text-gray-500">Agent: {lead.agentName}</div>}
            </div>
          ))}
						</div>
					</div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

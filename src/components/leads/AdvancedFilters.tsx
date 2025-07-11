
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X, Plus, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface FilterCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface AdvancedFiltersProps {
  filters: FilterCondition[];
  onFiltersChange: (filters: FilterCondition[]) => void;
  availableFields: Array<{ key: string; label: string; type: string }>;
}

export function AdvancedFilters({ filters, onFiltersChange, availableFields }: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [leadStatusOpen, setLeadStatusOpen] = useState(false);
  const [createdByOpen, setCreatedByOpen] = useState(false);
  const [createdOnOpen, setCreatedOnOpen] = useState(false);
  const [createdViaOpen, setCreatedViaOpen] = useState(false);
  const [lastEditedOpen, setLastEditedOpen] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [sellerContactOpen, setSellerContactOpen] = useState(false);
  const [leadManagerOpen, setLeadManagerOpen] = useState(false);

  const [selectedLeadStatuses, setSelectedLeadStatuses] = useState<string[]>([]);
  const [selectedCreatedBy, setSelectedCreatedBy] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedLeadManager, setSelectedLeadManager] = useState<string[]>([]);
  const [createdDateFrom, setCreatedDateFrom] = useState('');
  const [createdDateTo, setCreatedDateTo] = useState('');
  const [lastEditedFrom, setLastEditedFrom] = useState('');
  const [lastEditedTo, setLastEditedTo] = useState('');

  const leadStatusOptions = [
    'Not set',
    '#New Untouched#',
    'Discovery',
    'Already Listed',
    'Price Too High',
    'Low Motivation',
    'Add to Followup',
    'Inquiry',
    'Interested - Listing',
    'Appointment Completed',
    'Interested - Add to Followup',
    'Interested - Set Offer Status',
    'Contract Sent Out - Set Contract Status',
    'In Contract - Set Manually'
  ];

  const createdByOptions = [
    'John Doe',
    'Jane Smith',
    'Mike Johnson',
    'Sarah Wilson',
    'David Chen',
    'System Import'
  ];

  const createdViaOptions = [
    'Manual Entry',
    'Facebook Lead Ads',
    'Google Ads',
    'Website Form',
    'Cold Calling',
    'Referral',
    'Email Campaign',
    'Direct Mail'
  ];

  const tagOptions = [
    'High Priority',
    'Follow Up',
    'Hot Lead',
    'Qualified',
    'Unqualified',
    'Callback Required',
    'Email Sent',
    'Appointment Set'
  ];

  const leadManagerOptions = [
    'John Doe',
    'Jane Smith',
    'Mike Johnson',
    'Sarah Wilson',
    'David Chen',
    'Unassigned'
  ];

  const handleLeadStatusToggle = (status: string) => {
    setSelectedLeadStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const handleCreatedByToggle = (person: string) => {
    setSelectedCreatedBy(prev => 
      prev.includes(person) 
        ? prev.filter(p => p !== person)
        : [...prev, person]
    );
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleLeadManagerToggle = (manager: string) => {
    setSelectedLeadManager(prev => 
      prev.includes(manager) 
        ? prev.filter(m => m !== manager)
        : [...prev, manager]
    );
  };

  const clearAllFilters = () => {
    setSelectedLeadStatuses([]);
    setSelectedCreatedBy([]);
    setSelectedTags([]);
    setSelectedLeadManager([]);
    setCreatedDateFrom('');
    setCreatedDateTo('');
    setLastEditedFrom('');
    setLastEditedTo('');
    onFiltersChange([]);
  };

  const getActiveFiltersCount = () => {
    return selectedLeadStatuses.length + 
           selectedCreatedBy.length + 
           selectedTags.length + 
           selectedLeadManager.length +
           (createdDateFrom ? 1 : 0) +
           (createdDateTo ? 1 : 0) +
           (lastEditedFrom ? 1 : 0) +
           (lastEditedTo ? 1 : 0);
  };

  const StatusButton = ({ status, isSelected, onClick }: { status: string, isSelected: boolean, onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
        isSelected 
          ? 'bg-blue-100 text-blue-800 border-blue-300' 
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
      }`}
    >
      {status}
    </button>
  );

  return (
    <div>
      {/* Compact Filter Toggle Button */}
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="relative bg-white border-gray-200 hover:bg-gray-50 flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          <span className="text-sm">Filter</span>
          {getActiveFiltersCount() > 0 && (
            <Badge 
              variant="secondary" 
              className="ml-1 bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center"
            >
              {getActiveFiltersCount()}
            </Badge>
          )}
        </Button>
        {getActiveFiltersCount() > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs text-gray-600 hover:text-gray-800">
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {getActiveFiltersCount() > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {selectedLeadStatuses.map(status => (
            <Badge key={status} variant="secondary" className="flex items-center gap-1">
              Lead Status: {status}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => handleLeadStatusToggle(status)}
              />
            </Badge>
          ))}
          {selectedCreatedBy.map(person => (
            <Badge key={person} variant="secondary" className="flex items-center gap-1">
              Created by: {person}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => handleCreatedByToggle(person)}
              />
            </Badge>
          ))}
          {selectedTags.map(tag => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              Tag: {tag}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => handleTagToggle(tag)}
              />
            </Badge>
          ))}
          {selectedLeadManager.map(manager => (
            <Badge key={manager} variant="secondary" className="flex items-center gap-1">
              Manager: {manager}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => handleLeadManagerToggle(manager)}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Expanded Filter Panel */}
      {isExpanded && (
        <Card className="border-gray-200 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Advanced Filters
                {getActiveFiltersCount() > 0 && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {getActiveFiltersCount()}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearAllFilters}
                  className="text-sm"
                >
                  Clear All
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsExpanded(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Lead Status Filter */}
            <Collapsible open={leadStatusOpen} onOpenChange={setLeadStatusOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Lead Status</span>
                  {selectedLeadStatuses.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {selectedLeadStatuses.length}
                    </Badge>
                  )}
                </div>
                {leadStatusOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3">
                <div className="grid grid-cols-2 gap-2">
                  {leadStatusOptions.map(status => (
                    <StatusButton
                      key={status}
                      status={status}
                      isSelected={selectedLeadStatuses.includes(status)}
                      onClick={() => handleLeadStatusToggle(status)}
                    />
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Separator />

            {/* Created By Filter */}
            <Collapsible open={createdByOpen} onOpenChange={setCreatedByOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Created By</span>
                  {selectedCreatedBy.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {selectedCreatedBy.length}
                    </Badge>
                  )}
                </div>
                {createdByOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3">
                <div className="grid grid-cols-2 gap-2">
                  {createdByOptions.map(person => (
                    <StatusButton
                      key={person}
                      status={person}
                      isSelected={selectedCreatedBy.includes(person)}
                      onClick={() => handleCreatedByToggle(person)}
                    />
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Separator />

            {/* Created On Filter */}
            <Collapsible open={createdOnOpen} onOpenChange={setCreatedOnOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Created On</span>
                  {(createdDateFrom || createdDateTo) && (
                    <Badge variant="secondary" className="text-xs">
                      {createdDateFrom && createdDateTo ? '2' : '1'}
                    </Badge>
                  )}
                </div>
                {createdOnOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date-from" className="text-sm font-medium">From</Label>
                    <Input
                      id="date-from"
                      type="date"
                      value={createdDateFrom}
                      onChange={(e) => setCreatedDateFrom(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="date-to" className="text-sm font-medium">To</Label>
                    <Input
                      id="date-to"
                      type="date"
                      value={createdDateTo}
                      onChange={(e) => setCreatedDateTo(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Separator />

            {/* Created Via Filter */}
            <Collapsible open={createdViaOpen} onOpenChange={setCreatedViaOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="font-medium">Created Via</span>
                {createdViaOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3">
                <div className="grid grid-cols-2 gap-2">
                  {createdViaOptions.map(option => (
                    <button
                      key={option}
                      className="px-3 py-1.5 text-sm rounded-md border bg-white text-gray-700 border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Separator />

            {/* Last Edited Filter */}
            <Collapsible open={lastEditedOpen} onOpenChange={setLastEditedOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Last Edited</span>
                  {(lastEditedFrom || lastEditedTo) && (
                    <Badge variant="secondary" className="text-xs">
                      {lastEditedFrom && lastEditedTo ? '2' : '1'}
                    </Badge>
                  )}
                </div>
                {lastEditedOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edited-from" className="text-sm font-medium">From</Label>
                    <Input
                      id="edited-from"
                      type="date"
                      value={lastEditedFrom}
                      onChange={(e) => setLastEditedFrom(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edited-to" className="text-sm font-medium">To</Label>
                    <Input
                      id="edited-to"
                      type="date"
                      value={lastEditedTo}
                      onChange={(e) => setLastEditedTo(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Separator />

            {/* Tags Filter */}
            <Collapsible open={tagsOpen} onOpenChange={setTagsOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Tags</span>
                  {selectedTags.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {selectedTags.length}
                    </Badge>
                  )}
                </div>
                {tagsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3">
                <div className="grid grid-cols-2 gap-2">
                  {tagOptions.map(tag => (
                    <StatusButton
                      key={tag}
                      status={tag}
                      isSelected={selectedTags.includes(tag)}
                      onClick={() => handleTagToggle(tag)}
                    />
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Separator />

            {/* Lead Manager Filter */}
            <Collapsible open={leadManagerOpen} onOpenChange={setLeadManagerOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Lead Manager</span>
                  {selectedLeadManager.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {selectedLeadManager.length}
                    </Badge>
                  )}
                </div>
                {leadManagerOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3">
                <div className="grid grid-cols-2 gap-2">
                  {leadManagerOptions.map(manager => (
                    <StatusButton
                      key={manager}
                      status={manager}
                      isSelected={selectedLeadManager.includes(manager)}
                      onClick={() => handleLeadManagerToggle(manager)}
                    />
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Separator />

            {/* Seller Contact Filter */}
            <Collapsible open={sellerContactOpen} onOpenChange={setSellerContactOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="font-medium">Seller Contact</span>
                {sellerContactOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3">
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="phone-filter" className="text-sm font-medium">Phone Number</Label>
                    <Input
                      id="phone-filter"
                      type="tel"
                      placeholder="Enter phone number"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email-filter" className="text-sm font-medium">Email Address</Label>
                    <Input
                      id="email-filter"
                      type="email"
                      placeholder="Enter email address"
                      className="mt-1"
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

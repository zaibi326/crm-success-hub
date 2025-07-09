
import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { LeadTableRow } from './LeadTableRow';
import { TaxLead } from '@/types/taxLead';

interface LeadTableViewProps {
  leads: TaxLead[];
  onLeadSelect: (lead: TaxLead) => void;
  getStatusBadge: (status: string) => string;
  handleSort: (field: string) => void;
}

export function LeadTableView({ leads, onLeadSelect, getStatusBadge, handleSort }: LeadTableViewProps) {
  const SortableHeader = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <Button 
      variant="ghost" 
      onClick={() => handleSort(field)}
      className="h-auto p-0 font-semibold text-gray-700 hover:text-gray-900 flex items-center gap-1"
    >
      {children}
      <ArrowUpDown className="w-3 h-3" />
    </Button>
  );

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 border-b">
            <TableHead className="font-semibold w-8">
              <input 
                type="checkbox" 
                className="rounded border-gray-300"
                onChange={(e) => {
                  // Handle select all functionality
                }}
              />
            </TableHead>
            <TableHead className="font-semibold">
              <SortableHeader field="ownerName">Seller</SortableHeader>
            </TableHead>
            <TableHead className="font-semibold">
              <SortableHeader field="propertyAddress">Property Address</SortableHeader>
            </TableHead>
            <TableHead className="font-semibold">Lead Source</TableHead>
            <TableHead className="font-semibold">
              <SortableHeader field="createdAt">Date Lead Created</SortableHeader>
            </TableHead>
            <TableHead className="font-semibold">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead, index) => (
            <LeadTableRow
              key={lead.id}
              lead={lead}
              index={index}
              onLeadSelect={onLeadSelect}
              getStatusBadge={getStatusBadge}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

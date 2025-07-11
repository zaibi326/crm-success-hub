
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TaxLead } from '@/types/taxLead';

interface LeadTableRowProps {
  lead: TaxLead;
  index: number;
  onLeadSelect: (lead: TaxLead) => void;
  getStatusBadge: (status: string) => string;
  isSelected: boolean;
  onSelectChange: (checked: boolean) => void;
}

export function LeadTableRow({ 
  lead, 
  index, 
  onLeadSelect, 
  getStatusBadge, 
  isSelected, 
  onSelectChange 
}: LeadTableRowProps) {
  const handleRowClick = (e: React.MouseEvent) => {
    // Don't trigger row click if clicking on checkbox
    if ((e.target as HTMLElement).closest('input[type="checkbox"]')) {
      return;
    }
    onLeadSelect(lead);
  };

  return (
    <TableRow 
      className={`hover:bg-gray-50 cursor-pointer ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
      onClick={handleRowClick}
    >
      <TableCell>
        <input 
          type="checkbox" 
          className="rounded border-gray-300"
          checked={isSelected}
          onChange={(e) => onSelectChange(e.target.checked)}
          onClick={(e) => e.stopPropagation()}
        />
      </TableCell>
      <TableCell className="font-medium text-blue-600 hover:text-blue-800">
        {lead.ownerName}
      </TableCell>
      <TableCell className="max-w-xs truncate">{lead.propertyAddress}</TableCell>
      <TableCell>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
          Streamlinerz
        </Badge>
      </TableCell>
      <TableCell className="text-gray-600">
        {new Date(lead.createdAt || Date.now()).toLocaleDateString()}
      </TableCell>
      <TableCell>
        <Badge className={`${getStatusBadge(lead.status)} border text-xs`}>
          {lead.status}
        </Badge>
      </TableCell>
    </TableRow>
  );
}

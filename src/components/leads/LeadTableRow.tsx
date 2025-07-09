
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TaxLead } from '@/types/taxLead';

interface LeadTableRowProps {
  lead: TaxLead;
  index: number;
  onLeadSelect: (lead: TaxLead) => void;
  getStatusBadge: (status: string) => string;
}

export function LeadTableRow({ lead, index, onLeadSelect, getStatusBadge }: LeadTableRowProps) {
  return (
    <TableRow 
      key={lead.id} 
      className="hover:bg-gray-50 cursor-pointer border-b"
      onClick={() => onLeadSelect(lead)}
    >
      <TableCell onClick={(e) => e.stopPropagation()}>
        <input 
          type="checkbox" 
          className="rounded border-gray-300"
        />
      </TableCell>
      <TableCell className="font-medium text-blue-600 hover:text-blue-800">
        {lead.ownerName}
      </TableCell>
      <TableCell className="text-gray-600 max-w-xs truncate">
        {lead.propertyAddress}
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
          Streamlinerz
        </Badge>
      </TableCell>
      <TableCell className="text-gray-600 text-sm">
        {new Date().toLocaleDateString('en-US', { 
          month: '2-digit', 
          day: '2-digit', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </TableCell>
      <TableCell>
        <Badge className={`${getStatusBadge(lead.status)} border text-xs`}>
          {lead.status}
        </Badge>
      </TableCell>
    </TableRow>
  );
}

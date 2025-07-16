
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { TaxLead } from '@/types/taxLead';
import { Eye, Trash2, Phone, Mail } from 'lucide-react';

interface LeadTableRowProps {
  lead: TaxLead;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onLeadSelect: (lead: TaxLead) => void;
  onDelete: () => void;
  getStatusBadge: (status: string) => string;
}

export function LeadTableRow({
  lead,
  isSelected,
  onSelect,
  onLeadSelect,
  onDelete,
  getStatusBadge
}: LeadTableRowProps) {
  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
        />
      </TableCell>
      <TableCell className="font-medium">
        <div>
          <div className="font-semibold">{lead.ownerName}</div>
          {lead.taxId && (
            <div className="text-xs text-gray-500 font-mono">Tax ID: {lead.taxId}</div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="max-w-xs truncate" title={lead.propertyAddress}>
          {lead.propertyAddress}
        </div>
      </TableCell>
      <TableCell>
        <Badge className={getStatusBadge(lead.status)}>
          {lead.status}
        </Badge>
      </TableCell>
      <TableCell>
        {lead.currentArrears ? (
          <span className="font-semibold text-red-600">
            ${lead.currentArrears.toLocaleString()}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          {lead.phone && (
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Phone className="w-3 h-3" />
              {lead.phone}
            </div>
          )}
          {lead.email && (
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Mail className="w-3 h-3" />
              {lead.email}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLeadSelect(lead)}
            className="hover:bg-blue-50"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="hover:bg-red-50 text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

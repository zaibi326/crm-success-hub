
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TaxLead } from '@/types/taxLead';

interface LeadTableRowProps {
  lead: TaxLead;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onLeadSelect: () => void;
  onDelete?: (leadId: number) => void;
  getStatusBadge: (status: string) => string;
}

export function LeadTableRow({ 
  lead, 
  isSelected, 
  onSelect, 
  onLeadSelect,
  getStatusBadge 
}: LeadTableRowProps) {
  
  const formatCurrency = (amount: number | undefined) => {
    if (!amount) return 'N/A';
    return `$${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const handleRowClick = (e: React.MouseEvent) => {
    // Don't trigger row click if clicking on checkbox
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' && (target as HTMLInputElement).type === 'checkbox') {
      return;
    }
    onLeadSelect();
  };

  return (
    <TableRow 
      className="hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={handleRowClick}
    >
      <TableCell onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(e.target.checked)}
          className="rounded border-gray-300"
        />
      </TableCell>
      <TableCell className="font-medium">
        <div>
          <div className="font-semibold text-gray-900">{lead.ownerName || 'N/A'}</div>
          {lead.firstName && lead.lastName && (
            <div className="text-sm text-gray-500">
              {lead.firstName} {lead.lastName}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="max-w-xs">
          <div className="truncate font-medium text-gray-900">
            {lead.propertyAddress || 'N/A'}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="font-mono text-sm text-gray-700">
          {lead.taxId || 'N/A'}
        </div>
      </TableCell>
      <TableCell>
        <div className="font-semibold text-gray-900">
          {formatCurrency(lead.currentArrears)}
        </div>
      </TableCell>
      <TableCell>
        <Badge className={getStatusBadge(lead.status || 'COLD')}>
          {lead.status || 'COLD'}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          {lead.phone && (
            <div className="text-sm text-gray-600">{lead.phone}</div>
          )}
          {lead.email && (
            <div className="text-sm text-gray-500 truncate max-w-xs">{lead.email}</div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm text-gray-500">
          {formatDate(lead.createdAt)}
        </div>
      </TableCell>
      <TableCell>
        {/* Removed action buttons - entire row is now clickable */}
      </TableCell>
    </TableRow>
  );
}


import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, Trash2, Phone, Mail } from 'lucide-react';
import { TaxLead } from '@/types/taxLead';

interface LeadTableRowProps {
  lead: TaxLead;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onLeadSelect: () => void;
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
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmed = window.confirm(`Are you sure you want to delete the lead for ${lead.ownerName}?`);
    if (confirmed) {
      onDelete();
    }
  };

  const formatCurrency = (amount: number | undefined) => {
    if (!amount) return 'N/A';
    return `$${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <TableRow 
      className="hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={onLeadSelect}
    >
      <TableCell onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
        />
      </TableCell>
      
      {/* Owner */}
      <TableCell>
        <div className="font-medium text-gray-900">
          {lead.ownerName}
        </div>
      </TableCell>
      
      {/* Property Address */}
      <TableCell>
        <div className="max-w-xs">
          <p className="text-sm text-gray-700 truncate" title={lead.propertyAddress}>
            {lead.propertyAddress}
          </p>
        </div>
      </TableCell>
      
      {/* Email Address - New separate column */}
      <TableCell>
        <div className="flex items-center gap-2">
          {lead.email ? (
            <>
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-700 truncate max-w-[200px]" title={lead.email}>
                {lead.email}
              </span>
            </>
          ) : (
            <span className="text-sm text-gray-400">No email</span>
          )}
        </div>
      </TableCell>
      
      {/* Tax ID */}
      <TableCell>
        <span className="font-mono text-sm text-gray-700">
          {lead.taxId}
        </span>
      </TableCell>
      
      {/* Arrears */}
      <TableCell>
        <span className={`font-semibold ${lead.currentArrears ? 'text-red-600' : 'text-gray-400'}`}>
          {formatCurrency(lead.currentArrears)}
        </span>
      </TableCell>
      
      {/* Lead Status */}
      <TableCell>
        <Badge className={`${getStatusBadge(lead.status)} border`}>
          {lead.status}
        </Badge>
      </TableCell>
      
      {/* Created On */}
      <TableCell>
        <span className="text-sm text-gray-600">
          {formatDate(lead.createdAt)}
        </span>
      </TableCell>
      
      {/* Actions */}
      <TableCell onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onLeadSelect}
            className="h-8 w-8 p-0"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteClick}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            title="Delete Lead"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

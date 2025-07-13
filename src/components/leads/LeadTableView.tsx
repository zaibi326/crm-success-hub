
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowUpDown, Phone, Mail, MapPin, DollarSign, Eye, Trash2 } from 'lucide-react';
import { TaxLead } from '@/types/taxLead';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface LeadTableViewProps {
  leads: TaxLead[];
  onLeadSelect: (lead: TaxLead) => void;
  getStatusBadge: (status: string) => string;
  handleSort: (field: string) => void;
  onLeadsUpdate?: (leads: TaxLead[]) => void;
}

export function LeadTableView({
  leads,
  onLeadSelect,
  getStatusBadge,
  handleSort,
  onLeadsUpdate
}: LeadTableViewProps) {
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleSelectAll = () => {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leads.map(lead => lead.id));
    }
  };

  const handleSelectLead = (leadId: number) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleDeleteSelected = () => {
    if (onLeadsUpdate) {
      const updatedLeads = leads.filter(lead => !selectedLeads.includes(lead.id));
      onLeadsUpdate(updatedLeads);
    }
    setSelectedLeads([]);
    setShowDeleteDialog(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HOT': return 'text-red-600 bg-red-50';
      case 'WARM': return 'text-yellow-600 bg-yellow-50';
      case 'COLD': return 'text-blue-600 bg-blue-50';
      case 'PASS': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-podio-background">
      {/* Podio-style table header with selection count */}
      {selectedLeads.length > 0 && (
        <div className="bg-podio-primary/10 border-b border-podio-border px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-podio-primary">
              {selectedLeads.length} lead{selectedLeads.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Selected
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-podio-border bg-podio-surface/50">
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedLeads.length === leads.length && leads.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-podio-hover text-podio-text font-medium"
                onClick={() => handleSort('ownerName')}
              >
                <div className="flex items-center gap-2">
                  Seller Name
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-podio-hover text-podio-text font-medium"
                onClick={() => handleSort('propertyAddress')}
              >
                <div className="flex items-center gap-2">
                  Property Address
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </TableHead>
              <TableHead className="text-podio-text font-medium">Contact</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-podio-hover text-podio-text font-medium"
                onClick={() => handleSort('currentArrears')}
              >
                <div className="flex items-center gap-2">
                  Arrears
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-podio-hover text-podio-text font-medium"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-2">
                  Status
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </TableHead>
              <TableHead className="text-podio-text font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead, index) => (
              <TableRow 
                key={lead.id} 
                className={`podio-table-row cursor-pointer ${index % 2 === 0 ? 'bg-white' : 'bg-podio-surface/30'}`}
                onClick={() => onLeadSelect(lead)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedLeads.includes(lead.id)}
                    onCheckedChange={() => handleSelectLead(lead.id)}
                  />
                </TableCell>
                <TableCell className="font-medium text-podio-text">
                  <div>
                    <div className="font-semibold">{lead.ownerName}</div>
                    {lead.taxId && (
                      <div className="text-xs text-podio-text-muted font-mono">
                        Tax ID: {lead.taxId}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-podio-text-muted mt-0.5" />
                    <span className="text-sm text-podio-text">{lead.propertyAddress}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {lead.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-3 h-3 text-podio-text-muted" />
                        <span className="text-podio-text">{lead.phone}</span>
                      </div>
                    )}
                    {lead.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-3 h-3 text-podio-text-muted" />
                        <span className="text-podio-text">{lead.email}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {lead.currentArrears ? (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-green-600">
                        ${lead.currentArrears.toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <span className="text-podio-text-muted">N/A</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(lead.status)} border-0 font-medium`}>
                    {lead.status}
                  </Badge>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onLeadSelect(lead)}
                    className="h-8 px-2 text-podio-primary hover:bg-podio-primary/10"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {leads.length === 0 && (
        <div className="text-center py-12">
          <div className="text-podio-text-muted mb-2">No seller leads found</div>
          <div className="text-sm text-podio-text-muted">
            Try adjusting your search or filter criteria
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Leads Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedLeads.length} selected lead{selectedLeads.length > 1 ? 's' : ''}? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteSelected}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

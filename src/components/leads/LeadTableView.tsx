
import React, { useState } from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { LeadTableRow } from './LeadTableRow';
import { TaxLead } from '@/types/taxLead';
import { Trash2, ArrowUpDown } from 'lucide-react';

interface LeadTableViewProps {
  leads: TaxLead[];
  onLeadSelect: (lead: TaxLead) => void;
  getStatusBadge: (status: string) => string;
  handleSort: (field: string) => void;
  onDeleteSingleLead?: (leadId: number) => void;
  onDeleteMultipleLeads?: (leadIds: number[]) => void;
}

export function LeadTableView({
  leads,
  onLeadSelect,
  getStatusBadge,
  handleSort,
  onDeleteSingleLead,
  onDeleteMultipleLeads
}: LeadTableViewProps) {
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [leadToDelete, setLeadToDelete] = useState<TaxLead | null>(null);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLeads(leads.map(lead => lead.id));
    } else {
      setSelectedLeads([]);
    }
  };

  const handleSelectLead = (leadId: number, checked: boolean) => {
    if (checked) {
      setSelectedLeads(prev => [...prev, leadId]);
    } else {
      setSelectedLeads(prev => prev.filter(id => id !== leadId));
    }
  };

  const handleDeleteSingle = (lead: TaxLead) => {
    setLeadToDelete(lead);
  };

  const confirmDeleteSingle = () => {
    if (leadToDelete && onDeleteSingleLead) {
      onDeleteSingleLead(leadToDelete.id);
    }
    setLeadToDelete(null);
  };

  const handleDeleteMultiple = () => {
    if (onDeleteMultipleLeads && selectedLeads.length > 0) {
      onDeleteMultipleLeads(selectedLeads);
      setSelectedLeads([]);
    }
  };

  const isAllSelected = leads.length > 0 && selectedLeads.length === leads.length;
  const isSomeSelected = selectedLeads.length > 0 && selectedLeads.length < leads.length;

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedLeads.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <span className="text-sm font-medium text-blue-800">
            {selectedLeads.length} lead{selectedLeads.length > 1 ? 's' : ''} selected
          </span>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to permanently delete {selectedLeads.length} lead{selectedLeads.length > 1 ? 's' : ''}? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteMultiple} className="bg-red-600 hover:bg-red-700">
                  Delete Permanently
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isSomeSelected;
                  }}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('ownerName')} className="p-0 h-auto font-semibold">
                  Owner Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('propertyAddress')} className="p-0 h-auto font-semibold">
                  Property Address
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('status')} className="p-0 h-auto font-semibold">
                  Status
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('currentArrears')} className="p-0 h-auto font-semibold">
                  Arrears
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <LeadTableRow
                key={lead.id}
                lead={lead}
                isSelected={selectedLeads.includes(lead.id)}
                onSelect={(checked) => handleSelectLead(lead.id, checked)}
                onLeadSelect={onLeadSelect}
                onDelete={() => handleDeleteSingle(lead)}
                getStatusBadge={getStatusBadge}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Single Delete Confirmation Dialog */}
      <AlertDialog open={!!leadToDelete} onOpenChange={() => setLeadToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete the lead for "{leadToDelete?.ownerName}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteSingle} className="bg-red-600 hover:bg-red-700">
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {leads.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg font-medium">No leads found</p>
          <p className="text-sm">Add some leads to get started</p>
        </div>
      )}
    </div>
  );
}


import React, { useState } from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Trash2 } from 'lucide-react';
import { LeadTableRow } from './LeadTableRow';
import { TaxLead } from '@/types/taxLead';
import { useToast } from '@/hooks/use-toast';
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

export function LeadTableView({ leads, onLeadSelect, getStatusBadge, handleSort, onLeadsUpdate }: LeadTableViewProps) {
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

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

  const handleDeleteConfirm = () => {
    if (selectedLeads.length === 0) return;
    
    const remainingLeads = leads.filter(lead => !selectedLeads.includes(lead.id));
    onLeadsUpdate?.(remainingLeads);
    setSelectedLeads([]);
    setShowDeleteDialog(false);
    
    toast({
      title: "Leads deleted",
      description: `Successfully deleted ${selectedLeads.length} lead(s)`,
    });
  };

  const allSelected = selectedLeads.length === leads.length && leads.length > 0;
  const someSelected = selectedLeads.length > 0;

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {someSelected && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <span className="text-sm text-blue-700 font-medium">
            {selectedLeads.length} lead(s) selected
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowDeleteDialog(true)}
              className="text-red-600 border-red-200 hover:bg-red-100"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 border-b">
              <TableHead className="font-semibold w-8">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300"
                  checked={allSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
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
                isSelected={selectedLeads.includes(lead.id)}
                onSelectChange={(checked) => handleSelectLead(lead.id, checked)}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {selectedLeads.length} selected lead(s)? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

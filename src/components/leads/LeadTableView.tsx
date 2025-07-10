
import React, { useState } from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Trash2, Edit, Download } from 'lucide-react';
import { LeadTableRow } from './LeadTableRow';
import { TaxLead } from '@/types/taxLead';
import { useToast } from '@/hooks/use-toast';

interface LeadTableViewProps {
  leads: TaxLead[];
  onLeadSelect: (lead: TaxLead) => void;
  getStatusBadge: (status: string) => string;
  handleSort: (field: string) => void;
  onLeadsUpdate?: (leads: TaxLead[]) => void;
}

export function LeadTableView({ leads, onLeadSelect, getStatusBadge, handleSort, onLeadsUpdate }: LeadTableViewProps) {
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
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

  const handleBulkDelete = () => {
    if (selectedLeads.length === 0) return;
    
    const remainingLeads = leads.filter(lead => !selectedLeads.includes(lead.id));
    onLeadsUpdate?.(remainingLeads);
    setSelectedLeads([]);
    
    toast({
      title: "Leads deleted",
      description: `Successfully deleted ${selectedLeads.length} lead(s)`,
    });
  };

  const handleBulkExport = () => {
    if (selectedLeads.length === 0) return;
    
    const selectedLeadsData = leads.filter(lead => selectedLeads.includes(lead.id));
    
    const csvContent = [
      ['Owner Name', 'Property Address', 'Status', 'Phone', 'Email', 'Current Arrears', 'Tax ID'].join(','),
      ...selectedLeadsData.map(lead => [
        lead.ownerName,
        `"${lead.propertyAddress}"`,
        lead.status,
        lead.phone || '',
        lead.email || '',
        lead.currentArrears || 0,
        lead.taxId || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'selected-leads.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export completed",
      description: `Exported ${selectedLeads.length} selected lead(s) to CSV`,
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
              onClick={handleBulkExport}
              className="text-blue-600 border-blue-200 hover:bg-blue-100"
            >
              <Download className="w-4 h-4 mr-1" />
              Export CSV
            </Button>
            <Button
              size="sm"
              variant="outline" 
              onClick={() => {
                const firstSelectedLead = leads.find(lead => selectedLeads.includes(lead.id));
                if (firstSelectedLead) {
                  onLeadSelect(firstSelectedLead);
                }
              }}
              className="text-blue-600 border-blue-200 hover:bg-blue-100"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleBulkDelete}
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
    </div>
  );
}

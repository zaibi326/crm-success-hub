
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Search, 
  Filter, 
  Download, 
  Trash2,
  Eye,
  UserPlus,
  MoreHorizontal
} from 'lucide-react';
import { TaxLead } from '@/types/taxLead';
import { LeadTableRow } from './LeadTableRow';
import { toast } from 'sonner';

interface LeadTableViewProps {
  leads: TaxLead[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onLeadClick: (lead: TaxLead) => void;
  onDeleteLead: (leadId: number) => void;
  onBulkDelete?: (leadIds: number[]) => void;
}

export function LeadTableView({ 
  leads, 
  searchTerm, 
  onSearchChange, 
  onLeadClick,
  onDeleteLead,
  onBulkDelete
}: LeadTableViewProps) {
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const checkboxRef = useRef<HTMLInputElement>(null);

  const filteredLeads = leads.filter(lead =>
    lead.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.taxId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLeads(filteredLeads.map(lead => lead.id));
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
    
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete ${selectedLeads.length} selected lead(s)?`
    );
    
    if (confirmed && onBulkDelete) {
      onBulkDelete(selectedLeads);
      setSelectedLeads([]);
      toast.success(`${selectedLeads.length} leads deleted successfully`);
    }
  };

  const isAllSelected = selectedLeads.length === filteredLeads.length && filteredLeads.length > 0;
  const isPartiallySelected = selectedLeads.length > 0 && selectedLeads.length < filteredLeads.length;

  // Update checkbox ref when selection state changes
  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = isPartiallySelected;
    }
  }, [isPartiallySelected]);

  useEffect(() => {
    setShowBulkActions(selectedLeads.length > 0);
  }, [selectedLeads]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HOT': return 'bg-red-100 text-red-800 border-red-200';
      case 'WARM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'COLD': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PASS': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          {showBulkActions && (
            <>
              <Badge variant="secondary" className="text-sm">
                {selectedLeads.length} selected
              </Badge>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Selected
              </Button>
            </>
          )}
          
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12">
                <input
                  ref={checkboxRef}
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300"
                />
              </TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Property Address</TableHead>
              <TableHead>Tax ID</TableHead>
              <TableHead>Arrears</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.length === 0 ? (
              <TableRow>
                <td colSpan={9} className="text-center py-8 text-gray-500">
                  No leads found matching your search criteria
                </td>
              </TableRow>
            ) : (
              filteredLeads.map((lead) => (
                <LeadTableRow
                  key={lead.id}
                  lead={lead}
                  isSelected={selectedLeads.includes(lead.id)}
                  onSelect={(checked) => handleSelectLead(lead.id, checked)}
                  onClick={() => onLeadClick(lead)}
                  onDelete={() => onDeleteLead(lead.id)}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary Footer */}
      <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
        <div>
          Showing {filteredLeads.length} of {leads.length} leads
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
            <span>Hot: {leads.filter(l => l.status === 'HOT').length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded"></div>
            <span>Warm: {leads.filter(l => l.status === 'WARM').length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
            <span>Cold: {leads.filter(l => l.status === 'COLD').length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

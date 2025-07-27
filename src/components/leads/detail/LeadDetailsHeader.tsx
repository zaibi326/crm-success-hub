
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit } from 'lucide-react';
import { TaxLead } from '@/types/taxLead';
import { useNavigate } from 'react-router-dom';

interface LeadDetailsHeaderProps {
  lead: TaxLead;
  onBack: () => void;
  onEditClick: () => void;
  getStatusColor: (status: string) => string;
}

export function LeadDetailsHeader({ lead, onBack, onEditClick, getStatusColor }: LeadDetailsHeaderProps) {
  const navigate = useNavigate();

  const handleBackClick = () => {
    // Call the onBack function first
    onBack();
    // Then navigate to the leads page, replacing the current history entry
    navigate('/leads', { replace: true });
  };

  return (
    <div className="sticky top-0 z-20 bg-podio-background border-b border-podio-border p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={handleBackClick}
            className="podio-button-secondary flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Leads
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-podio-text">{lead.ownerName}</h1>
            <p className="text-sm text-podio-text-muted">{lead.propertyAddress}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={getStatusColor(lead.status)}>
            {lead.status}
          </Badge>
          <Button 
            variant="outline"
            onClick={onEditClick}
            className="podio-button-secondary flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Modify Template
          </Button>
        </div>
      </div>
    </div>
  );
}

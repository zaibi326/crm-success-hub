
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  DollarSign, 
  Edit, 
  Trash2,
  Eye
} from 'lucide-react';
import { TaxLead } from '@/types/taxLead';

interface LeadListItemProps {
  lead: TaxLead;
  isSelected?: boolean;
  onClick: () => void;
  onUpdate: (lead: TaxLead) => void;
  onDelete: () => void;
}

export function LeadListItem({ 
  lead, 
  isSelected = false,
  onClick, 
  onUpdate, 
  onDelete 
}: LeadListItemProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HOT': return 'bg-red-100 text-red-800 border-red-200';
      case 'WARM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'COLD': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'KEEP': return 'bg-green-100 text-green-800 border-green-200';
      case 'PASS': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleQuickStatusUpdate = (newStatus: 'HOT' | 'WARM' | 'COLD' | 'PASS' | 'KEEP') => {
    const updatedLead = { ...lead, status: newStatus };
    onUpdate(updatedLead);
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected ? 'ring-2 ring-crm-primary border-crm-primary' : 'border-gray-200'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-crm-primary/10 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-crm-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{lead.ownerName}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-3 h-3" />
                <span className="truncate max-w-[200px]">{lead.propertyAddress}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(lead.status)}>
              {lead.status}
            </Badge>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
                className="p-1 h-8 w-8"
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-1 h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          {lead.phone && (
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{lead.phone}</span>
            </div>
          )}
          
          {lead.email && (
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="w-4 h-4" />
              <span className="truncate">{lead.email}</span>
            </div>
          )}
          
          {lead.currentArrears && (
            <div className="flex items-center gap-2 text-gray-600">
              <DollarSign className="w-4 h-4" />
              <span>${lead.currentArrears.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Quick Status Update Buttons */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {['HOT', 'WARM', 'COLD', 'KEEP', 'PASS'].map((status) => (
            <Button
              key={status}
              size="sm"
              variant={lead.status === status ? "default" : "outline"}
              onClick={(e) => {
                e.stopPropagation();
                handleQuickStatusUpdate(status as 'HOT' | 'WARM' | 'COLD' | 'PASS' | 'KEEP');
              }}
              className="text-xs px-3 py-1"
            >
              {status}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Phone, 
  Mail, 
  MapPin, 
  MoreVertical,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { TaxLead } from '@/types/taxLead';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'HOT':
        return <Badge className="bg-red-100 text-red-800">🔥 Hot</Badge>;
      case 'WARM':
        return <Badge className="bg-yellow-100 text-yellow-800">☀️ Warm</Badge>;
      case 'COLD':
        return <Badge className="bg-blue-100 text-blue-800">❄️ Cold</Badge>;
      case 'KEEP':
        return <Badge className="bg-green-100 text-green-800">✅ Keep</Badge>;
      case 'PASS':
        return <Badge className="bg-gray-100 text-gray-800">❌ Pass</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-gray-900">{lead.ownerName}</h3>
              {getStatusBadge(lead.status)}
            </div>
            
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{lead.propertyAddress}</span>
              </div>
              
              {lead.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{lead.phone}</span>
                </div>
              )}
              
              {lead.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{lead.email}</span>
                </div>
              )}
            </div>
            
            {lead.currentArrears && (
              <div className="mt-2">
                <span className="text-sm font-medium text-green-600">
                  Arrears: ${lead.currentArrears.toLocaleString()}
                </span>
              </div>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onClick(); }}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); /* Handle edit */ }}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Lead
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Lead
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}

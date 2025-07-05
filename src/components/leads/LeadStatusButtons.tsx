
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Thermometer, Snowflake, X, TrendingUp } from 'lucide-react';

interface LeadStatusButtonsProps {
  leadId: number;
  currentStatus: 'HOT' | 'WARM' | 'COLD' | 'PASS';
  onStatusChange: (status: 'HOT' | 'WARM' | 'COLD' | 'PASS') => void;
  disabled?: boolean;
}

export function LeadStatusButtons({ leadId, currentStatus, onStatusChange, disabled = false }: LeadStatusButtonsProps) {
  const statusOptions = [
    {
      status: 'HOT' as const,
      label: 'HOT',
      icon: Flame,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
      description: 'Ready to close'
    },
    {
      status: 'WARM' as const,
      label: 'WARM',
      icon: Thermometer,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      borderColor: 'border-orange-200',
      description: 'In progress'
    },
    {
      status: 'COLD' as const,
      label: 'COLD',
      icon: Snowflake,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
      description: 'Needs attention'
    },
    {
      status: 'PASS' as const,
      label: 'PASS',
      icon: X,
      color: 'from-gray-500 to-gray-600',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-700',
      borderColor: 'border-gray-200',
      description: 'Not suitable'
    }
  ];

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-crm-primary" />
          Lead Status Classification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-gray-600">Current Status:</span>
          <Badge 
            className={`${statusOptions.find(opt => opt.status === currentStatus)?.bgColor} ${statusOptions.find(opt => opt.status === currentStatus)?.textColor} ${statusOptions.find(opt => opt.status === currentStatus)?.borderColor}`}
          >
            {currentStatus}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {statusOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = currentStatus === option.status;
            
            return (
              <Button
                key={option.status}
                onClick={() => onStatusChange(option.status)}
                disabled={disabled}
                variant={isSelected ? "default" : "outline"}
                className={`h-auto p-4 flex flex-col items-center gap-2 transition-all duration-200 ${
                  isSelected 
                    ? `bg-gradient-to-r ${option.color} text-white shadow-lg transform scale-105` 
                    : `${option.bgColor} ${option.textColor} ${option.borderColor} hover:${option.bgColor} hover:shadow-md`
                }`}
              >
                <Icon className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-semibold">{option.label}</div>
                  <div className="text-xs opacity-75">{option.description}</div>
                </div>
              </Button>
            );
          })}
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Use HOT for leads ready to close, WARM for those in progress, 
            COLD for leads needing attention, and PASS for unsuitable leads.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

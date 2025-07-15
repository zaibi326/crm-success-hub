
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Flame, 
  Sun, 
  Snowflake, 
  X,
  TrendingUp,
  Activity
} from 'lucide-react';

interface LeadStatusButtonsProps {
  currentStatus: 'HOT' | 'WARM' | 'COLD' | 'PASS';
  onStatusChange: (status: 'HOT' | 'WARM' | 'COLD' | 'PASS') => void;
  disabled?: boolean;
}

export function LeadStatusButtons({ currentStatus, onStatusChange, disabled = false }: LeadStatusButtonsProps) {
  const statusOptions = [
    {
      value: 'HOT' as const,
      label: 'Hot Lead',
      icon: Flame,
      color: 'bg-red-500 hover:bg-red-600 text-white',
      badgeColor: 'bg-red-100 text-red-800 border-red-200',
      description: 'High priority, immediate action required'
    },
    {
      value: 'WARM' as const,
      label: 'Warm Lead',
      icon: Sun,
      color: 'bg-yellow-500 hover:bg-yellow-600 text-white',
      badgeColor: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      description: 'Good potential, follow up soon'
    },
    {
      value: 'COLD' as const,
      label: 'Cold Lead',
      icon: Snowflake,
      color: 'bg-blue-500 hover:bg-blue-600 text-white',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      description: 'Low priority, periodic follow-up'
    },
    {
      value: 'PASS' as const,
      label: 'Pass',
      icon: X,
      color: 'bg-gray-500 hover:bg-gray-600 text-white',
      badgeColor: 'bg-gray-100 text-gray-800 border-gray-200',
      description: 'Not pursuing this lead'
    }
  ];

  const currentStatusInfo = statusOptions.find(option => option.value === currentStatus);

  return (
    <Card className="shadow-md border bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <span className="text-gray-900 font-medium">Lead Status</span>
          </div>
          
          {currentStatusInfo && (
            <Badge className={`${currentStatusInfo.badgeColor} px-2 py-1 text-xs font-medium`}>
              <currentStatusInfo.icon className="w-3 h-3 mr-1" />
              {currentStatusInfo.label}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Status Selection Grid */}
        <div className="grid grid-cols-2 gap-2">
          {statusOptions.map((option) => {
            const IconComponent = option.icon;
            const isActive = currentStatus === option.value;
            
            return (
              <Button
                key={option.value}
                onClick={() => onStatusChange(option.value)}
                disabled={disabled}
                variant={isActive ? "default" : "outline"}
                size="sm"
                className={`
                  h-auto p-3 justify-start text-left transition-all duration-200
                  ${isActive 
                    ? `${option.color} shadow-md` 
                    : 'hover:shadow-sm hover:border-blue-300 border'
                  }
                `}
              >
                <div className="flex items-center gap-2 w-full">
                  <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-medium ${isActive ? 'text-white' : 'text-gray-900'}`}>
                      {option.label}
                    </div>
                  </div>
                  {isActive && (
                    <TrendingUp className="w-3 h-3 text-white" />
                  )}
                </div>
              </Button>
            );
          })}
        </div>

        {/* Current Status Info */}
        {currentStatusInfo && (
          <div className="mt-3 p-2 bg-blue-50 rounded border-l-2 border-blue-500">
            <p className="text-xs text-blue-700">
              {currentStatusInfo.description}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

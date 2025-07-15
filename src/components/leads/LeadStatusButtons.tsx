
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
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-t-lg pb-4">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-blue-900 font-semibold">Lead Status Classification</h3>
              <p className="text-sm text-blue-700 font-normal mt-1">
                Set the priority level for this lead
              </p>
            </div>
          </div>
          
          {currentStatusInfo && (
            <Badge className={`${currentStatusInfo.badgeColor} px-3 py-1 font-medium`}>
              <currentStatusInfo.icon className="w-4 h-4 mr-1" />
              {currentStatusInfo.label}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Current Status Display */}
        {currentStatusInfo && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
            <div className="flex items-center gap-3 mb-2">
              <currentStatusInfo.icon className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-900">Current Status: {currentStatusInfo.label}</span>
            </div>
            <p className="text-sm text-gray-600 ml-8">{currentStatusInfo.description}</p>
          </div>
        )}

        {/* Status Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {statusOptions.map((option) => {
            const IconComponent = option.icon;
            const isActive = currentStatus === option.value;
            
            return (
              <Button
                key={option.value}
                onClick={() => onStatusChange(option.value)}
                disabled={disabled}
                variant={isActive ? "default" : "outline"}
                className={`
                  h-auto p-4 justify-start text-left transition-all duration-200
                  ${isActive 
                    ? `${option.color} shadow-lg transform scale-105` 
                    : 'hover:shadow-md hover:scale-102 border-2 hover:border-blue-300'
                  }
                `}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-gray-100'}`}>
                    <IconComponent className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <div className="flex-1">
                    <div className={`font-semibold ${isActive ? 'text-white' : 'text-gray-900'}`}>
                      {option.label}
                    </div>
                    <div className={`text-sm ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                      {option.description}
                    </div>
                  </div>
                  {isActive && (
                    <div className="flex items-center justify-center w-6 h-6 bg-white/20 rounded-full">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </Button>
            );
          })}
        </div>

        {/* Status Change Note */}
        <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Status changes are automatically saved and tracked in the activity timeline
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

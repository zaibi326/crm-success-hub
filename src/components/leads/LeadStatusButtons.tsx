
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
  Activity,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useState } from 'react';

interface LeadStatusButtonsProps {
  currentStatus: 'HOT' | 'WARM' | 'COLD' | 'PASS';
  onStatusChange: (status: 'HOT' | 'WARM' | 'COLD' | 'PASS') => void;
  disabled?: boolean;
}

export function LeadStatusButtons({ currentStatus, onStatusChange, disabled = false }: LeadStatusButtonsProps) {
  const [isOpen, setIsOpen] = useState(true);

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
      color: 'bg-orange-500 hover:bg-orange-600 text-white',
      badgeColor: 'bg-orange-100 text-orange-800 border-orange-200',
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
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="bg-white shadow-sm border border-gray-200 rounded-lg">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors rounded-t-lg">
            <CardTitle className="flex items-center justify-between text-lg font-semibold text-gray-900">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4 text-purple-600" />
                </div>
                Lead Status
              </div>
              <div className="flex items-center gap-3">
                {currentStatusInfo && (
                  <Badge className={`${currentStatusInfo.badgeColor} px-3 py-1 text-sm font-medium`}>
                    <currentStatusInfo.icon className="w-4 h-4 mr-2" />
                    {currentStatusInfo.label}
                  </Badge>
                )}
                {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
              </div>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="p-6 pt-0">
            {/* Status Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {statusOptions.map((option) => {
                const IconComponent = option.icon;
                const isActive = currentStatus === option.value;
                
                return (
                  <Button
                    key={option.value}
                    onClick={() => onStatusChange(option.value)}
                    disabled={disabled}
                    variant={isActive ? "default" : "outline"}
                    size="lg"
                    className={`
                      h-auto p-4 justify-start text-left transition-all duration-200 min-h-[80px]
                      ${isActive 
                        ? `${option.color} shadow-md transform scale-105` 
                        : 'hover:shadow-sm hover:border-blue-300 border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <IconComponent className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                      <div className="flex-1 min-w-0 text-left">
                        <div className={`text-sm font-medium leading-tight mb-1 ${isActive ? 'text-white' : 'text-gray-900'}`}>
                          {option.label}
                        </div>
                        <div className={`text-xs leading-relaxed break-words ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                          {option.description}
                        </div>
                      </div>
                      {isActive && (
                        <TrendingUp className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
                      )}
                    </div>
                  </Button>
                );
              })}
            </div>

            {/* Priority Message */}
            {currentStatusInfo && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <currentStatusInfo.icon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-blue-900 mb-1">
                      Current Status: {currentStatusInfo.label}
                    </h4>
                    <p className="text-sm text-blue-700">
                      {currentStatusInfo.description}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

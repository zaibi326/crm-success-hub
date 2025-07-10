
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { TaxLead } from '@/types/taxLead';

interface LeadCalendarViewProps {
  leads: TaxLead[];
  onLeadSelect: (lead: TaxLead) => void;
  getStatusBadge: (status: string) => string;
}

export function LeadCalendarView({ leads, onLeadSelect, getStatusBadge }: LeadCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getLeadsForDate = (day: number) => {
    // For demo purposes, randomly assign some leads to dates
    // In real implementation, this would filter by actual date fields
    const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`;
    return leads.filter((_, index) => 
      (index + day) % 7 === 0 || // Some logic to distribute leads
      (index % 5 === day % 5)
    ).slice(0, 3); // Limit to 3 leads per day for display
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Leads Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="font-semibold min-w-[150px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {dayNames.map(day => (
            <div key={day} className="p-2 text-center font-semibold text-gray-600 border-b">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {days.map((day, index) => {
            const leadsForDay = day ? getLeadsForDate(day) : [];
            
            return (
              <div
                key={index}
                className={`min-h-[120px] p-1 border border-gray-200 ${
                  day ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                }`}
              >
                {day && (
                  <>
                    <div className="font-medium text-sm text-gray-900 mb-1">
                      {day}
                    </div>
                    <div className="space-y-1">
                      {leadsForDay.map((lead, leadIndex) => (
                        <div
                          key={lead.id}
                          onClick={() => onLeadSelect(lead)}
                          className="text-xs p-1 rounded cursor-pointer hover:shadow-sm transition-shadow"
                          style={{ backgroundColor: getStatusColor(lead.status) }}
                        >
                          <div className="font-medium text-white truncate">
                            {lead.ownerName}
                          </div>
                          <div className="text-white/80 truncate">
                            {lead.propertyAddress.split(',')[0]}
                          </div>
                        </div>
                      ))}
                      {leadsForDay.length === 3 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{Math.max(0, getLeadsForDate(day).length - 3)} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to get color for status
function getStatusColor(status: string): string {
  switch (status) {
    case 'HOT': return '#ef4444';
    case 'WARM': return '#f59e0b';
    case 'COLD': return '#3b82f6';
    case 'PASS': return '#6b7280';
    default: return '#3b82f6';
  }
}

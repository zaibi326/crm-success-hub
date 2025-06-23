
import React from 'react';

interface ReviewProgressProps {
  currentIndex: number;
  totalLeads: number;
}

export function ReviewProgress({ currentIndex, totalLeads }: ReviewProgressProps) {
  const progressPercentage = Math.round(((currentIndex + 1) / totalLeads) * 100);

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-xl border shadow-sm">
      <span className="text-sm font-medium text-gray-600">
        Lead {currentIndex + 1} of {totalLeads}
      </span>
      <div className="flex-1 mx-4">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-crm-primary to-crm-accent h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
      <span className="text-sm font-medium text-crm-primary">
        {progressPercentage}%
      </span>
    </div>
  );
}

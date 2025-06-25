
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

interface LeadsEmptyStateProps {
  onNavigateToOverview: () => void;
}

export function LeadsEmptyState({ onNavigateToOverview }: LeadsEmptyStateProps) {
  return (
    <Card className="p-12 text-center">
      <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Lead Selected</h3>
      <p className="text-gray-600 mb-4">
        Please select a lead from the overview tab to view and edit details.
      </p>
      <Button onClick={onNavigateToOverview}>
        Browse Leads
      </Button>
    </Card>
  );
}

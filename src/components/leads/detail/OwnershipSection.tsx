
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { OwnershipBreakdownChart } from '../OwnershipBreakdownChart';

interface OwnershipSectionProps {
  onSave: (heirs: any[]) => void;
}

export function OwnershipSection({ onSave }: OwnershipSectionProps) {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Users className="w-5 h-5 text-crm-primary" />
          Ownership Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <OwnershipBreakdownChart onSave={onSave} />
      </CardContent>
    </Card>
  );
}

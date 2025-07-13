
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface DispositionSectionProps {
  disposition: 'keep' | 'pass' | null;
  passReason: string;
  onDisposition: (disp: 'keep' | 'pass') => void;
  onPassReasonChange: (reason: string) => void;
  canEdit: boolean;
}

export function DispositionSection({ 
  disposition, 
  passReason, 
  onDisposition, 
  onPassReasonChange, 
  canEdit 
}: DispositionSectionProps) {
  if (disposition) return null;

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle>Lead Disposition</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <Button
            onClick={() => onDisposition('pass')}
            variant="outline"
            className="flex-1 h-12 text-red-600 border-red-200 hover:bg-red-50"
            disabled={!canEdit}
          >
            Pass
          </Button>
          <Button
            onClick={() => onDisposition('keep')}
            className="flex-1 h-12 bg-green-600 hover:bg-green-700"
            disabled={!canEdit}
          >
            Keep
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function PassReasonSection({ 
  passReason, 
  onPassReasonChange, 
  canEdit 
}: { 
  passReason: string; 
  onPassReasonChange: (reason: string) => void; 
  canEdit: boolean; 
}) {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle>Pass Reason</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={passReason}
          onChange={(e) => onPassReasonChange(e.target.value)}
          placeholder="Optional: Why are you passing on this lead?"
          className="min-h-[80px]"
          disabled={!canEdit}
        />
      </CardContent>
    </Card>
  );
}

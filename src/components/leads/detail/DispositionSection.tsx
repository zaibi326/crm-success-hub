
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
  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle>Lead Disposition</CardTitle>
      </CardHeader>
      <CardContent>
        {!disposition ? (
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
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">
                Lead Status: <span className={disposition === 'keep' ? 'text-green-600' : 'text-red-600'}>
                  {disposition === 'keep' ? 'Kept' : 'Passed'}
                </span>
              </span>
              {canEdit && (
                <Button
                  onClick={() => onDisposition(null as any)}
                  variant="outline"
                  size="sm"
                >
                  Change Decision
                </Button>
              )}
            </div>
            
            {disposition === 'pass' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Pass Reason (Optional)</label>
                <Textarea
                  value={passReason}
                  onChange={(e) => onPassReasonChange(e.target.value)}
                  placeholder="Why are you passing on this lead?"
                  className="min-h-[80px]"
                  disabled={!canEdit}
                />
              </div>
            )}
          </div>
        )}
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

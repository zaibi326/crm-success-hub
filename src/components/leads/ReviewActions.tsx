
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, X } from 'lucide-react';

interface ReviewActionsProps {
  onAction: (action: 'keep' | 'pass') => void;
  isLoading: boolean;
  leadsRemaining: number;
}

export function ReviewActions({ onAction, isLoading, leadsRemaining }: ReviewActionsProps) {
  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
      <CardHeader>
        <CardTitle className="text-xl text-center text-gray-900">Review Actions</CardTitle>
        <p className="text-center text-gray-600 text-sm">Make your decision on this lead</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={() => onAction('keep')}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white h-16 text-lg font-semibold shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            <>
              <CheckCircle className="w-6 h-6 mr-3" />
              KEEP LEAD
            </>
          )}
        </Button>
        
        <Button
          onClick={() => onAction('pass')}
          disabled={isLoading}
          variant="outline"
          className="w-full border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 h-16 text-lg font-semibold shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
        >
          <X className="w-6 h-6 mr-3" />
          PASS ON LEAD
        </Button>
      </CardContent>
    </Card>
  );
}

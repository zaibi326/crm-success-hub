
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FinancialInfoSectionProps {
  askingPrice: string;
  mortgagePrice: string;
  currentArrears: string;
  onInputChange: (field: string, value: string) => void;
}

export function FinancialInfoSection({ askingPrice, mortgagePrice, currentArrears, onInputChange }: FinancialInfoSectionProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="font-semibold text-lg mb-4 text-gray-800">Financial Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-4">
          <Label htmlFor="askingPrice" className="w-24 text-right font-medium">
            Asking Price ($)
          </Label>
          <Input
            id="askingPrice"
            type="number"
            step="0.01"
            value={askingPrice}
            onChange={(e) => onInputChange('askingPrice', e.target.value)}
            placeholder="0.00"
            className="flex-1"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <Label htmlFor="mortgagePrice" className="w-24 text-right font-medium">
            Mortgage Price ($)
          </Label>
          <Input
            id="mortgagePrice"
            type="number"
            step="0.01"
            value={mortgagePrice}
            onChange={(e) => onInputChange('mortgagePrice', e.target.value)}
            placeholder="0.00"
            className="flex-1"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <Label htmlFor="currentArrears" className="w-24 text-right font-medium">
            Current Arrears ($)
          </Label>
          <Input
            id="currentArrears"
            type="number"
            step="0.01"
            value={currentArrears}
            onChange={(e) => onInputChange('currentArrears', e.target.value)}
            placeholder="0.00"
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { StickyNote, ChevronDown } from 'lucide-react';

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  status: 'HOT' | 'WARM' | 'COLD' | 'PASS';
  score: number;
  notes: string;
  avatar?: string;
  tags: string[];
}

interface NotesSectionProps {
  formData: Lead;
  isOpen: boolean;
  onToggle: (open: boolean) => void;
  onInputChange: (field: keyof Lead, value: any) => void;
}

export function NotesSection({ formData, isOpen, onToggle, onInputChange }: NotesSectionProps) {
  return (
    <Card className="shadow-lg border-0">
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center gap-3">
                <StickyNote className="w-5 h-5 text-crm-primary" />
                Lead Notes
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="notes" className="flex items-center gap-2">
                <StickyNote className="w-4 h-4" />
                Additional Notes
              </Label>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-1">
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => onInputChange('notes', e.target.value)}
                  placeholder="Add any additional notes about this lead..."
                  className="min-h-[120px] bg-transparent border-none focus:ring-0 resize-none"
                />
              </div>
            </div>
            
            {/* Tags Section */}
            <div className="mt-4 space-y-2">
              <Label>Lead Tags</Label>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

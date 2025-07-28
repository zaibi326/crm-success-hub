
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { TaxLead } from '@/types/taxLead';
import { LeadDetailsForm } from './LeadDetailsForm';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  DollarSign,
  FileText,
  Star
} from 'lucide-react';

interface LeadReviewSystemProps {
  leads: TaxLead[];
  onLeadUpdate: (updatedLead: TaxLead) => void;
  userRole: 'admin' | 'editor' | 'viewer';
}

export function LeadReviewSystem({ leads, onLeadUpdate, userRole }: LeadReviewSystemProps) {
  const [currentLeadIndex, setCurrentLeadIndex] = useState(0);
  const [reviewedLeads, setReviewedLeads] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  const currentLead = leads[currentLeadIndex];
  const progress = (reviewedLeads.size / leads.length) * 100;

  const handleLeadDisposition = (disposition: 'QUALIFIED' | 'DISQUALIFIED') => {
    if (!currentLead) return;
    
    const updatedLead: TaxLead = {
      ...currentLead,
      disposition,
      updatedAt: new Date().toISOString()
    };
    
    onLeadUpdate(updatedLead);
    setReviewedLeads(prev => new Set(prev).add(currentLead.id));
    
    toast({
      title: disposition === 'QUALIFIED' ? 'Lead Qualified' : 'Lead Disqualified',
      description: `${currentLead.ownerName} has been ${disposition.toLowerCase()}`,
    });
    
    // Move to next lead
    if (currentLeadIndex < leads.length - 1) {
      setCurrentLeadIndex(prev => prev + 1);
    }
  };

  const handlePreviousLead = () => {
    if (currentLeadIndex > 0) {
      setCurrentLeadIndex(prev => prev - 1);
    }
  };

  const handleNextLead = () => {
    if (currentLeadIndex < leads.length - 1) {
      setCurrentLeadIndex(prev => prev + 1);
    }
  };

  const handleSkipLead = () => {
    if (currentLeadIndex < leads.length - 1) {
      setCurrentLeadIndex(prev => prev + 1);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HOT': return 'bg-red-100 text-red-800';
      case 'WARM': return 'bg-orange-100 text-orange-800';
      case 'COLD': return 'bg-blue-100 text-blue-800';
      case 'PASS': return 'bg-gray-100 text-gray-800';
      case 'KEEP': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!currentLead) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="text-center py-12">
          <CardContent>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Complete!</h2>
            <p className="text-gray-600">You have reviewed all available leads.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Lead Review System
            </CardTitle>
            <Badge variant="outline" className="text-sm">
              {currentLeadIndex + 1} of {leads.length}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Current Lead Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{currentLead.ownerName}</h2>
                <p className="text-gray-600 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {currentLead.propertyAddress}
                </p>
              </div>
            </div>
            <Badge className={getStatusColor(currentLead.status)}>
              {currentLead.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{currentLead.phone || 'No phone'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{currentLead.email || 'No email'}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <span className="text-sm">${currentLead.currentArrears?.toLocaleString() || '0'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lead Details Form */}
      <LeadDetailsForm
        lead={currentLead}
        onSave={onLeadUpdate}
        canEdit={userRole === 'admin' || userRole === 'editor'}
      />

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handlePreviousLead}
                disabled={currentLeadIndex === 0}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={handleSkipLead}
                disabled={currentLeadIndex === leads.length - 1}
              >
                Skip
              </Button>
              <Button
                variant="outline"
                onClick={handleNextLead}
                disabled={currentLeadIndex === leads.length - 1}
              >
                Next
              </Button>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="destructive"
                onClick={() => handleLeadDisposition('DISQUALIFIED')}
                className="flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Disqualify
              </Button>
              <Button
                onClick={() => handleLeadDisposition('QUALIFIED')}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4" />
                Qualify
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

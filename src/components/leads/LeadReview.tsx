
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, X, Phone, Mail, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  status: 'HOT' | 'WARM' | 'COLD';
  score: number;
  notes: string;
}

const mockLeads: Lead[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@techcorp.com",
    phone: "+1 (555) 123-4567",
    company: "TechCorp Solutions",
    position: "VP of Marketing",
    status: "HOT",
    score: 92,
    notes: "Recently visited pricing page multiple times. Showed high engagement with product demo."
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "m.chen@innovate.co",
    phone: "+1 (555) 987-6543",
    company: "Innovate Co",
    position: "Director of Sales",
    status: "WARM",
    score: 78,
    notes: "Downloaded whitepaper and attended webinar. Medium company size, good fit for enterprise plan."
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    email: "emma@startup.io",
    phone: "+1 (555) 456-7890",
    company: "StartupIO",
    position: "Founder",
    status: "COLD",
    score: 45,
    notes: "Early stage startup, limited budget. May be good for basic plan in future."
  }
];

export function LeadReview() {
  const [currentLeadIndex, setCurrentLeadIndex] = useState(0);
  const [leads, setLeads] = useState(mockLeads);
  const { toast } = useToast();

  const currentLead = leads[currentLeadIndex];

  const handleAction = (action: 'keep' | 'pass') => {
    if (!currentLead) return;

    toast({
      title: action === 'keep' ? "Lead Kept" : "Lead Passed",
      description: `${currentLead.name} has been ${action === 'keep' ? 'added to your pipeline' : 'marked as passed'}.`,
    });

    // Move to next lead
    if (currentLeadIndex < leads.length - 1) {
      setCurrentLeadIndex(currentLeadIndex + 1);
    } else {
      toast({
        title: "Review Complete",
        description: "You've reviewed all available leads!",
      });
    }
  };

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'HOT':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'WARM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'COLD':
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusIcon = (status: Lead['status']) => {
    switch (status) {
      case 'HOT':
        return '🔥';
      case 'WARM':
        return '🟡';
      case 'COLD':
        return '❄️';
    }
  };

  if (!currentLead) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No leads to review</h3>
        <p className="text-gray-600">Upload a CSV file to start reviewing leads.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Lead Summary Card - Left Side */}
      <div className="lg:col-span-2">
        <Card className="h-fit">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl">{currentLead.name}</CardTitle>
                <p className="text-gray-600 mt-1">{currentLead.position}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={`${getStatusColor(currentLead.status)} font-medium`}>
                  {getStatusIcon(currentLead.status)} {currentLead.status}
                </Badge>
                <div className="text-right">
                  <div className="text-2xl font-bold text-crm-primary">{currentLead.score}</div>
                  <div className="text-sm text-gray-500">Score</div>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium">{currentLead.email}</div>
                  <div className="text-sm text-gray-500">Email</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium">{currentLead.phone}</div>
                  <div className="text-sm text-gray-500">Phone</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Building className="w-5 h-5 text-gray-600" />
              <div>
                <div className="font-medium">{currentLead.company}</div>
                <div className="text-sm text-gray-500">Company</div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Notes</h4>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{currentLead.notes}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <span className="text-sm text-gray-500">
                Lead {currentLeadIndex + 1} of {leads.length}
              </span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-crm-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentLeadIndex + 1) / leads.length) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons - Right Side */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Review Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => handleAction('keep')}
              className="w-full bg-green-600 hover:bg-green-700 text-white h-16 text-lg"
            >
              <CheckCircle className="w-6 h-6 mr-3" />
              KEEP
            </Button>
            
            <Button
              onClick={() => handleAction('pass')}
              variant="outline"
              className="w-full border-red-300 text-red-600 hover:bg-red-50 h-16 text-lg"
            >
              <X className="w-6 h-6 mr-3" />
              PASS
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Lead Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Engagement Score</span>
                <span className="font-medium">{currentLead.score}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Priority Level</span>
                <Badge className={`${getStatusColor(currentLead.status)} text-xs`}>
                  {currentLead.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Company Size</span>
                <span className="font-medium">Enterprise</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

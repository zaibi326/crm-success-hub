
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle, X, Phone, MessageSquare, Mail, MapPin, Building, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

const mockLeads: Lead[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@techcorp.com",
    phone: "+1 (555) 123-4567",
    company: "TechCorp Solutions",
    position: "VP of Marketing",
    address: "123 Innovation Drive",
    city: "San Francisco",
    state: "CA",
    zip: "94105",
    status: "HOT",
    score: 92,
    notes: "Recently visited pricing page multiple times. Showed high engagement with product demo. Ready for enterprise package discussion.",
    tags: ["Enterprise", "Decision Maker", "High Intent"],
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "m.chen@innovate.co",
    phone: "+1 (555) 987-6543",
    company: "Innovate Co",
    position: "Director of Sales",
    address: "456 Business Blvd",
    city: "Austin",
    state: "TX",
    zip: "73301",
    status: "WARM",
    score: 78,
    notes: "Downloaded whitepaper and attended webinar. Medium company size, good fit for professional plan. Interested in team features.",
    tags: ["Professional Plan", "Team Features", "Engaged"],
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    email: "emma@startup.io",
    phone: "+1 (555) 456-7890",
    company: "StartupIO",
    position: "Founder",
    address: "789 Startup Street",
    city: "Denver",
    state: "CO",
    zip: "80202",
    status: "COLD",
    score: 45,
    notes: "Early stage startup, limited budget. May be good for basic plan in future. Keep for nurturing campaign.",
    tags: ["Startup", "Budget Conscious", "Future Potential"],
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  }
];

export function LeadReview() {
  const [currentLeadIndex, setCurrentLeadIndex] = useState(0);
  const [leads, setLeads] = useState(mockLeads);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const currentLead = leads[currentLeadIndex];

  const handleAction = async (action: 'keep' | 'pass') => {
    if (!currentLead) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Update lead status if passed
    if (action === 'pass') {
      const updatedLeads = leads.map(lead =>
        lead.id === currentLead.id ? { ...lead, status: 'PASS' as const } : lead
      );
      setLeads(updatedLeads);
    }

    toast({
      title: action === 'keep' ? "Lead Kept! 🎉" : "Lead Passed",
      description: `${currentLead.name} has been ${action === 'keep' ? 'added to your pipeline' : 'marked as passed'}.`,
    });

    // Move to next lead with animation
    if (currentLeadIndex < leads.length - 1) {
      setCurrentLeadIndex(currentLeadIndex + 1);
    } else {
      toast({
        title: "Review Complete! ✅",
        description: "You've reviewed all available leads! Great work!",
      });
    }

    setIsLoading(false);
  };

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'HOT':
        return 'bg-red-500 text-white border-red-500 hover:bg-red-600';
      case 'WARM':
        return 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600';
      case 'COLD':
        return 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600';
      case 'PASS':
        return 'bg-gray-500 text-white border-gray-500 hover:bg-gray-600';
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
      case 'PASS':
        return '⏭️';
    }
  };

  const handleCall = () => {
    window.open(`tel:${currentLead.phone}`, '_self');
    toast({
      title: "Calling...",
      description: `Initiating call to ${currentLead.name}`,
    });
  };

  const handleSMS = () => {
    window.open(`sms:${currentLead.phone}`, '_self');
    toast({
      title: "Opening SMS",
      description: `Preparing message to ${currentLead.name}`,
    });
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
    <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 transition-all duration-500 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
      {/* Left Column - Lead Information */}
      <div className="lg:col-span-2 space-y-6">
        {/* Header Card with Avatar and Basic Info */}
        <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-r from-white to-gray-50">
          <CardHeader className="pb-4">
            <div className="flex items-start gap-4">
              <Avatar className="w-16 h-16 border-4 border-white shadow-lg">
                <AvatarImage src={currentLead.avatar} alt={currentLead.name} />
                <AvatarFallback className="bg-crm-primary text-white text-lg font-semibold">
                  {currentLead.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl text-gray-900">{currentLead.name}</CardTitle>
                    <p className="text-lg text-gray-600 font-medium">{currentLead.position}</p>
                    <p className="text-gray-500 flex items-center gap-1 mt-1">
                      <Building className="w-4 h-4" />
                      {currentLead.company}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-crm-primary mb-1">{currentLead.score}</div>
                    <div className="text-sm text-gray-500">Lead Score</div>
                    <Badge className={`${getStatusColor(currentLead.status)} mt-2 font-semibold text-sm px-3 py-1`}>
                      {getStatusIcon(currentLead.status)} {currentLead.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Contact Information Card */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-crm-primary" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <Mail className="w-5 h-5 text-crm-primary" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{currentLead.email}</div>
                  <div className="text-sm text-gray-500">Email Address</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <Phone className="w-5 h-5 text-crm-primary" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{currentLead.phone}</div>
                  <div className="text-sm text-gray-500">Phone Number</div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <MapPin className="w-5 h-5 text-crm-primary mt-0.5" />
              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  {currentLead.address}, {currentLead.city}, {currentLead.state} {currentLead.zip}
                </div>
                <div className="text-sm text-gray-500">Business Address</div>
              </div>
            </div>

            {/* Contact Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button 
                onClick={handleCall}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Now
              </Button>
              <Button 
                onClick={handleSMS}
                variant="outline"
                className="flex-1 border-green-600 text-green-600 hover:bg-green-50 h-12"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Send SMS
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tags and Notes Card */}
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  🏷️ Lead Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentLead.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 font-medium"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  📝 Lead Notes
                </h4>
                <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-crm-primary">
                  <p className="text-gray-700 leading-relaxed">{currentLead.notes}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between bg-white p-4 rounded-xl border shadow-sm">
          <span className="text-sm font-medium text-gray-600">
            Lead {currentLeadIndex + 1} of {leads.length}
          </span>
          <div className="flex-1 mx-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-crm-primary to-crm-accent h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentLeadIndex + 1) / leads.length) * 100}%` }}
              />
            </div>
          </div>
          <span className="text-sm font-medium text-crm-primary">
            {Math.round(((currentLeadIndex + 1) / leads.length) * 100)}%
          </span>
        </div>
      </div>

      {/* Right Column - Action Buttons */}
      <div className="space-y-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
          <CardHeader>
            <CardTitle className="text-xl text-center text-gray-900">Review Actions</CardTitle>
            <p className="text-center text-gray-600 text-sm">Make your decision on this lead</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => handleAction('keep')}
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
              onClick={() => handleAction('pass')}
              disabled={isLoading}
              variant="outline"
              className="w-full border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 h-16 text-lg font-semibold shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
            >
              <X className="w-6 h-6 mr-3" />
              PASS ON LEAD
            </Button>
          </CardContent>
        </Card>

        {/* Lead Insights Card */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              📊 Lead Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600 font-medium">Engagement Score</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-crm-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${currentLead.score}%` }}
                    />
                  </div>
                  <span className="font-bold text-crm-primary">{currentLead.score}/100</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600 font-medium">Priority Level</span>
                <Badge className={`${getStatusColor(currentLead.status)} text-sm font-semibold`}>
                  {currentLead.status}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600 font-medium">Company Type</span>
                <span className="font-semibold text-gray-900">
                  {currentLead.score > 80 ? 'Enterprise' : currentLead.score > 60 ? 'Mid-Market' : 'SMB'}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600 font-medium">Tags Count</span>
                <span className="font-semibold text-gray-900">{currentLead.tags.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-crm-primary to-crm-accent text-white">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">
                {leads.length - currentLeadIndex - 1}
              </div>
              <div className="text-sm opacity-90">
                Leads Remaining
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { LeadHeader } from './LeadHeader';
import { LeadContactInfo } from './LeadContactInfo';
import { LeadDetails } from './LeadDetails';
import { LeadInsights } from './LeadInsights';
import { ReviewActions } from './ReviewActions';
import { ReviewProgress } from './ReviewProgress';

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
        <LeadHeader lead={currentLead} />
        <LeadContactInfo lead={currentLead} />
        <LeadDetails lead={currentLead} />
        <ReviewProgress currentIndex={currentLeadIndex} totalLeads={leads.length} />
      </div>

      {/* Right Column - Action Buttons */}
      <div className="space-y-6">
        <ReviewActions 
          onAction={handleAction}
          isLoading={isLoading}
          leadsRemaining={leads.length - currentLeadIndex - 1}
        />
        <LeadInsights lead={currentLead} />
      </div>
    </div>
  );
}

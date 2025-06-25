
import React, { useState } from 'react';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CsvUploader } from './CsvUploader';
import { LeadReview } from './LeadReview';
import { LeadDetailsForm } from './LeadDetailsForm';

const mockLead = {
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
  status: "HOT" as const,
  score: 92,
  notes: "Recently visited pricing page multiple times. Showed high engagement with product demo. Ready for enterprise package discussion.",
  tags: ["Enterprise", "Decision Maker", "High Intent"],
  avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face"
};

export function LeadsContent() {
  const [activeTab, setActiveTab] = useState('upload');

  const handleLeadSave = (updatedLead: any) => {
    console.log('Lead saved:', updatedLead);
    // Here you would typically save to your backend
  };

  return (
    <SidebarInset className="flex-1 overflow-auto bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-gray-600 hover:text-gray-900" />
          <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
        </div>
      </header>
      
      <main className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <TabsList className="grid w-full max-w-lg grid-cols-3">
              <TabsTrigger value="upload">CSV Upload</TabsTrigger>
              <TabsTrigger value="review">Lead Review</TabsTrigger>
              <TabsTrigger value="details">Lead Details</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="upload" className="mt-0">
            <CsvUploader onUploadComplete={() => setActiveTab('review')} />
          </TabsContent>
          
          <TabsContent value="review" className="mt-0 p-6">
            <LeadReview />
          </TabsContent>
          
          <TabsContent value="details" className="mt-0 p-6">
            <LeadDetailsForm lead={mockLead} onSave={handleLeadSave} />
          </TabsContent>
        </Tabs>
      </main>
    </SidebarInset>
  );
}

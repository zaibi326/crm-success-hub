
import React, { useState } from 'react';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CsvUploader } from './CsvUploader';
import { LeadReview } from './LeadReview';

export function LeadsContent() {
  const [activeTab, setActiveTab] = useState('upload');

  return (
    <SidebarInset className="flex-1 overflow-auto">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-gray-600 hover:text-gray-900" />
          <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
        </div>
      </header>
      
      <main className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">CSV Upload</TabsTrigger>
            <TabsTrigger value="review">Lead Review</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="mt-6">
            <CsvUploader onUploadComplete={() => setActiveTab('review')} />
          </TabsContent>
          
          <TabsContent value="review" className="mt-6">
            <LeadReview />
          </TabsContent>
        </Tabs>
      </main>
    </SidebarInset>
  );
}

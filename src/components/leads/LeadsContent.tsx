
import React, { useState } from 'react';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CsvUploader } from './CsvUploader';
import { LeadReview } from './LeadReview';

export function LeadsContent() {
  const [activeTab, setActiveTab] = useState('upload');

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
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="upload">CSV Upload</TabsTrigger>
              <TabsTrigger value="review">Lead Review</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="upload" className="mt-0">
            <CsvUploader onUploadComplete={() => setActiveTab('review')} />
          </TabsContent>
          
          <TabsContent value="review" className="mt-0 p-6">
            <LeadReview />
          </TabsContent>
        </Tabs>
      </main>
    </SidebarInset>
  );
}

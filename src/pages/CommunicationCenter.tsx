
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { CommunicationPanel } from '@/components/communication/CommunicationPanel';
import { Phone } from 'lucide-react';

const CommunicationCenter = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-crm-gradient-start via-white to-crm-gradient-end">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset className="flex-1 overflow-auto">
            <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-200/60 px-6 py-4 shadow-sm">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg transition-all duration-200" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Phone className="w-6 h-6 text-blue-600" />
                    Communication Center
                  </h1>
                  <p className="text-sm text-gray-600 mt-0.5">
                    Integrated calling and messaging via SmrtPhone.io
                  </p>
                </div>
              </div>
            </header>
            
            <main className="p-6">
              <div className="max-w-4xl mx-auto">
                <CommunicationPanel 
                  leadId="demo-lead-1"
                  phoneNumber="+1-555-123-4567"
                  leadName="John Smith"
                />
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default CommunicationCenter;

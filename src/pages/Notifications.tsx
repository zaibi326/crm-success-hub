
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';

const Notifications = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-crm-gradient-start via-white to-crm-gradient-end">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset className="flex-1 overflow-auto bg-gradient-to-br from-crm-gradient-start via-white to-crm-gradient-end">
            <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-6 py-4 shadow-sm">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg transition-all duration-200" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                  <p className="text-sm text-gray-600 mt-0.5">Stay updated with latest activities</p>
                </div>
              </div>
            </header>
            
            <main className="p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Recent Notifications</h2>
                  <p className="text-gray-600">Notifications system coming soon...</p>
                </div>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Notifications;

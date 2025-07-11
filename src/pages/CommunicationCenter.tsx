
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { CommunicationPanel } from '@/components/communication/CommunicationPanel';
import { Phone, MessageSquare, Users, PhoneCall } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
              <div className="max-w-7xl mx-auto space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
                      <PhoneCall className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">1,234</div>
                      <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">856</div>
                      <p className="text-xs text-muted-foreground">+15.3% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Contacts</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">342</div>
                      <p className="text-xs text-muted-foreground">+8.2% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                      <Phone className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">78%</div>
                      <p className="text-xs text-muted-foreground">+2.4% from last month</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Communication Panel */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="w-5 h-5" />
                      SmrtPhone.io Integration
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Active
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Make calls and send messages directly from your CRM
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CommunicationPanel 
                      leadId="demo-lead-1"
                      phoneNumber="+1-555-123-4567"
                      leadName="John Smith"
                    />
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Communication Activity</CardTitle>
                    <CardDescription>Latest calls and messages</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <PhoneCall className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="font-medium">Called John Smith</p>
                            <p className="text-sm text-gray-600">+1-555-123-4567 • 2 minutes ago</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Completed
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <MessageSquare className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium">SMS to Jane Doe</p>
                            <p className="text-sm text-gray-600">+1-555-987-6543 • 15 minutes ago</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-blue-600 border-blue-600">
                          Delivered
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <PhoneCall className="w-5 h-5 text-orange-600" />
                          <div>
                            <p className="font-medium">Missed call from Bob Wilson</p>
                            <p className="text-sm text-gray-600">+1-555-456-7890 • 1 hour ago</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                          Missed
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default CommunicationCenter;

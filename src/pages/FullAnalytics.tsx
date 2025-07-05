
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, TrendingUp, Users, Activity, DollarSign, Target } from 'lucide-react';

const FullAnalytics = () => {
  // Sample data for charts
  const monthlyData = [
    { month: 'Jan', leads: 65, conversions: 28, revenue: 12000 },
    { month: 'Feb', leads: 78, conversions: 35, revenue: 15000 },
    { month: 'Mar', leads: 90, conversions: 42, revenue: 18000 },
    { month: 'Apr', leads: 85, conversions: 38, revenue: 16500 },
    { month: 'May', leads: 95, conversions: 45, revenue: 20000 },
    { month: 'Jun', leads: 110, conversions: 52, revenue: 23000 },
  ];

  const leadSourceData = [
    { name: 'Website', value: 35, color: '#8884d8' },
    { name: 'Social Media', value: 25, color: '#82ca9d' },
    { name: 'Email', value: 20, color: '#ffc658' },
    { name: 'Referral', value: 15, color: '#ff7c7c' },
    { name: 'Direct', value: 5, color: '#8dd1e1' },
  ];

  const teamPerformanceData = [
    { name: 'Alice Johnson', leads: 45, conversions: 18, revenue: 25000 },
    { name: 'Bob Smith', leads: 38, conversions: 15, revenue: 20000 },
    { name: 'Carol Davis', leads: 52, conversions: 22, revenue: 30000 },
    { name: 'David Wilson', leads: 41, conversions: 16, revenue: 22000 },
    { name: 'Eva Brown', leads: 47, conversions: 19, revenue: 26000 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-crm-gradient-start via-white to-crm-gradient-end">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset className="flex-1 overflow-auto">
            <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-6 py-4 shadow-sm">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg transition-all duration-200" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <BarChart3 className="w-6 h-6" />
                    Full Analytics Dashboard
                  </h1>
                  <p className="text-sm text-gray-600 mt-0.5">
                    Complete analytics and insights for your CRM system
                  </p>
                </div>
              </div>
            </header>
            
            <main className="p-6">
              {/* Key Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Leads</p>
                        <p className="text-2xl font-bold text-gray-900">523</p>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          +12% from last month
                        </p>
                      </div>
                      <Users className="w-8 h-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Conversions</p>
                        <p className="text-2xl font-bold text-gray-900">230</p>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          +8% from last month
                        </p>
                      </div>
                      <Target className="w-8 h-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">$124.5K</p>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          +15% from last month
                        </p>
                      </div>
                      <DollarSign className="w-8 h-8 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                        <p className="text-2xl font-bold text-gray-900">44%</p>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          +3% from last month
                        </p>
                      </div>
                      <Activity className="w-8 h-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="leads">Lead Analytics</TabsTrigger>
                  <TabsTrigger value="performance">Team Performance</TabsTrigger>
                  <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Monthly Lead Trends</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="leads" stroke="#8884d8" strokeWidth={2} />
                            <Line type="monotone" dataKey="conversions" stroke="#82ca9d" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Lead Sources</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={leadSourceData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {leadSourceData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="leads" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Lead Generation & Conversion</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="leads" fill="#8884d8" />
                          <Bar dataKey="conversions" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="performance" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Team Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={teamPerformanceData} layout="horizontal">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" width={100} />
                          <Tooltip />
                          <Bar dataKey="leads" fill="#8884d8" />
                          <Bar dataKey="conversions" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="revenue" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                          <Line type="monotone" dataKey="revenue" stroke="#ffc658" strokeWidth={3} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default FullAnalytics;

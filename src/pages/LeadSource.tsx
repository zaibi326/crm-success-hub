
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Database, Plus, Search, Edit, Trash2, Globe, Facebook, Mail, Phone } from 'lucide-react';

const LeadSource = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingSource, setIsAddingSource] = useState(false);
  const [newSource, setNewSource] = useState({
    name: '',
    type: 'Website',
    description: ''
  });
  
  const { toast } = useToast();

  // Mock lead sources data
  const mockSources = [
    { id: '1', name: 'Website Contact Form', type: 'Website', leads: 145, status: 'Active', description: 'Main website contact form' },
    { id: '2', name: 'Facebook Ads', type: 'Social Media', leads: 89, status: 'Active', description: 'Facebook advertising campaigns' },
    { id: '3', name: 'Google Ads', type: 'Search Engine', leads: 203, status: 'Active', description: 'Google search advertising' },
    { id: '4', name: 'Email Campaign', type: 'Email', leads: 67, status: 'Active', description: 'Email marketing campaigns' },
    { id: '5', name: 'Cold Calling', type: 'Phone', leads: 34, status: 'Active', description: 'Outbound phone calls' },
    { id: '6', name: 'LinkedIn', type: 'Social Media', leads: 23, status: 'Inactive', description: 'LinkedIn outreach' },
  ];

  const filteredSources = mockSources.filter(source =>
    source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    source.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSource = () => {
    if (!newSource.name || !newSource.type) {
      toast({
        title: "Missing Information",
        description: "Please fill in the source name and type.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Lead Source Added",
      description: `${newSource.name} has been added successfully.`,
    });

    setNewSource({ name: '', type: 'Website', description: '' });
    setIsAddingSource(false);
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'Website': return Globe;
      case 'Social Media': return Facebook;
      case 'Email': return Mail;
      case 'Phone': return Phone;
      default: return Database;
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'Active' 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-crm-gradient-start via-white to-crm-gradient-end">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset className="flex-1 overflow-auto">
            <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-6 py-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg transition-all duration-200" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Lead Sources</h1>
                    <p className="text-sm text-gray-600 mt-0.5">
                      Manage and track your lead generation sources
                    </p>
                  </div>
                </div>
                <Button onClick={() => setIsAddingSource(true)} className="bg-crm-primary hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Source
                </Button>
              </div>
            </header>

            <main className="p-6">
              <div className="max-w-6xl mx-auto space-y-6">
                {/* Search and Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search lead sources..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-crm-primary">{mockSources.length}</div>
                      <div className="text-sm text-gray-600">Total Sources</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Add Source Form */}
                {isAddingSource && (
                  <Card className="border-2 border-blue-200">
                    <CardHeader>
                      <CardTitle>Add New Lead Source</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="sourceName">Source Name</Label>
                          <Input
                            id="sourceName"
                            value={newSource.name}
                            onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                            placeholder="e.g., Website Contact Form"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="sourceType">Source Type</Label>
                          <select
                            id="sourceType"
                            value={newSource.type}
                            onChange={(e) => setNewSource({ ...newSource, type: e.target.value })}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="Website">Website</option>
                            <option value="Social Media">Social Media</option>
                            <option value="Search Engine">Search Engine</option>
                            <option value="Email">Email</option>
                            <option value="Phone">Phone</option>
                            <option value="Referral">Referral</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="sourceDescription">Description</Label>
                          <Input
                            id="sourceDescription"
                            value={newSource.description}
                            onChange={(e) => setNewSource({ ...newSource, description: e.target.value })}
                            placeholder="Brief description of this lead source"
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button onClick={handleAddSource} className="bg-crm-primary hover:bg-blue-700">
                          Add Source
                        </Button>
                        <Button variant="outline" onClick={() => setIsAddingSource(false)}>
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Lead Sources Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSources.map((source) => {
                    const IconComponent = getSourceIcon(source.type);
                    return (
                      <Card key={source.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
                                <IconComponent className="w-5 h-5" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{source.name}</h3>
                                <p className="text-sm text-gray-600">{source.type}</p>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Total Leads</span>
                              <span className="font-semibold text-crm-primary">{source.leads}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Status</span>
                              <Badge className={getStatusColor(source.status)}>
                                {source.status}
                              </Badge>
                            </div>
                            
                            {source.description && (
                              <p className="text-sm text-gray-600 mt-2">{source.description}</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {filteredSources.length === 0 && (
                  <div className="text-center py-12">
                    <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No lead sources found</h3>
                    <p className="text-gray-600 mb-4">
                      {searchTerm ? 'No sources match your search criteria.' : 'Get started by adding your first lead source.'}
                    </p>
                    {!searchTerm && (
                      <Button onClick={() => setIsAddingSource(true)} className="bg-crm-primary hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Source
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default LeadSource;

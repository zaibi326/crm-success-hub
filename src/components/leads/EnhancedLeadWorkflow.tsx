
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaxLead } from '@/types/taxLead';
import { LeadProcessingWorkflow } from './LeadProcessingWorkflow';
import { TaxLeadOverview } from './TaxLeadOverview';
import { 
  Play, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  XCircle,
  Clock,
  Target,
  BarChart3
} from 'lucide-react';

interface EnhancedLeadWorkflowProps {
  leads: TaxLead[];
  onLeadUpdate: (updatedLead: TaxLead) => void;
  onLeadSelect?: (lead: TaxLead) => void;
}

export function EnhancedLeadWorkflow({ leads, onLeadUpdate, onLeadSelect }: EnhancedLeadWorkflowProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'processing'>('overview');
  const [selectedLeads, setSelectedLeads] = useState<TaxLead[]>([]);

  // Calculate workflow statistics
  const stats = {
    total: leads.length,
    hot: leads.filter(l => l.status === 'HOT').length,
    warm: leads.filter(l => l.status === 'WARM').length,
    cold: leads.filter(l => l.status === 'COLD').length,
    kept: leads.filter(l => l.status === 'KEEP' || l.disposition === 'QUALIFIED').length,
    passed: leads.filter(l => l.status === 'PASS' || l.disposition === 'DISQUALIFIED').length,
    pending: leads.filter(l => !l.disposition || l.disposition === 'UNDECIDED').length
  };

  const processedCount = stats.kept + stats.passed;
  const progressPercentage = stats.total > 0 ? (processedCount / stats.total) * 100 : 0;

  const handleStartProcessing = (leadsToProcess: TaxLead[]) => {
    setSelectedLeads(leadsToProcess);
    setActiveTab('processing');
  };

  const handleProcessingComplete = () => {
    setSelectedLeads([]);
    setActiveTab('overview');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HOT': return 'bg-red-100 text-red-800';
      case 'WARM': return 'bg-yellow-100 text-yellow-800';
      case 'COLD': return 'bg-blue-100 text-blue-800';
      case 'KEEP': return 'bg-green-100 text-green-800';
      case 'PASS': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header with Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lead Processing Workflow</h1>
              <p className="text-gray-600 mt-1">Efficiently review and process your tax leads</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-crm-primary">{processedCount}/{stats.total}</div>
              <div className="text-sm text-gray-600">Leads Processed</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-sm text-gray-600">{progressPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Hot</p>
                  <p className="text-2xl font-bold text-red-600">{stats.hot}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Warm</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.warm}</p>
                </div>
                <Target className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Cold</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.cold}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Kept</p>
                  <p className="text-2xl font-bold text-green-600">{stats.kept}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Passed</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.passed}</p>
                </div>
                <XCircle className="w-8 h-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'overview' | 'processing')}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="processing" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Processing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <TaxLeadOverview
              leads={leads}
              onStartProcessing={handleStartProcessing}
              onLeadUpdate={onLeadUpdate}
              onLeadSelect={onLeadSelect}
              showAllLeads={true}
            />
          </TabsContent>

          <TabsContent value="processing" className="space-y-6">
            {selectedLeads.length > 0 ? (
              <LeadProcessingWorkflow
                leads={selectedLeads}
                onLeadUpdate={onLeadUpdate}
                onComplete={handleProcessingComplete}
              />
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No leads selected for processing</h3>
                  <p className="text-gray-600 mb-4">
                    Go to the Overview tab to select leads for processing.
                  </p>
                  <Button 
                    onClick={() => setActiveTab('overview')}
                    className="bg-crm-primary hover:bg-crm-primary/90"
                  >
                    Go to Overview
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Code, Book, Zap, Shield, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ApiDocumentation = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const endpoints = [
    {
      method: "GET",
      endpoint: "/api/leads",
      description: "Retrieve all leads",
      example: `curl -X GET "https://api.heirlogic.com/v1/leads" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`
    },
    {
      method: "POST",
      endpoint: "/api/leads",
      description: "Create a new lead",
      example: `curl -X POST "https://api.heirlogic.com/v1/leads" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "status": "warm"
  }'`
    },
    {
      method: "PUT",
      endpoint: "/api/leads/{id}",
      description: "Update an existing lead",
      example: `curl -X PUT "https://api.heirlogic.com/v1/leads/123" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "status": "hot",
    "notes": "Follow up scheduled"
  }'`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            API Documentation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Build powerful integrations with Heirlogic CRM using our comprehensive REST API. Access leads, manage campaigns, and automate workflows programmatically.
          </p>
        </div>

        {/* Quick Start */}
        <div className="mb-16">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-blue-600" />
                Quick Start
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Get started with the Heirlogic API in minutes:</p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Sign up for a Heirlogic account</li>
                <li>Generate your API key in the settings</li>
                <li>Make your first API call</li>
                <li>Start building amazing integrations</li>
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* API Reference */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">API Reference</h2>
          
          <Tabs defaultValue="authentication" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="authentication">Authentication</TabsTrigger>
              <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
              <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            </TabsList>
            
            <TabsContent value="authentication" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-6 h-6 text-green-600" />
                    API Authentication
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    All API requests must include your API key in the Authorization header:
                  </p>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm relative">
                    <button
                      onClick={() => copyToClipboard('Authorization: Bearer YOUR_API_KEY', 'auth')}
                      className="absolute top-2 right-2 p-1 hover:bg-gray-800 rounded"
                    >
                      {copiedCode === 'auth' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                    Authorization: Bearer YOUR_API_KEY
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="endpoints" className="space-y-6">
              {endpoints.map((endpoint, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-sm font-mono ${
                        endpoint.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                        endpoint.method === 'POST' ? 'bg-green-100 text-green-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="text-gray-700">{endpoint.endpoint}</code>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{endpoint.description}</p>
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm relative overflow-x-auto">
                      <button
                        onClick={() => copyToClipboard(endpoint.example, `endpoint-${index}`)}
                        className="absolute top-2 right-2 p-1 hover:bg-gray-800 rounded"
                      >
                        {copiedCode === `endpoint-${index}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <pre className="whitespace-pre-wrap">{endpoint.example}</pre>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="webhooks" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-6 h-6 text-purple-600" />
                    Webhook Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Subscribe to real-time events in your Heirlogic account:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li>• <code className="bg-gray-100 px-2 py-1 rounded">lead.created</code> - New lead added</li>
                    <li>• <code className="bg-gray-100 px-2 py-1 rounded">lead.updated</code> - Lead status changed</li>
                    <li>• <code className="bg-gray-100 px-2 py-1 rounded">campaign.completed</code> - Campaign finished</li>
                    <li>• <code className="bg-gray-100 px-2 py-1 rounded">deal.closed</code> - Deal successfully closed</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* SDKs Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="border-0 shadow-lg text-center">
            <CardHeader>
              <CardTitle>JavaScript SDK</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Official JavaScript/Node.js SDK</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Install SDK
              </button>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg text-center">
            <CardHeader>
              <CardTitle>Python SDK</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Official Python SDK</p>
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Install SDK
              </button>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg text-center">
            <CardHeader>
              <CardTitle>PHP SDK</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Official PHP SDK</p>
              <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                Install SDK
              </button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ApiDocumentation;


import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const FeaturesSection = () => {
  const features = [
    {
      title: "Smart Pipelines",
      description: "Intelligent pipeline management with automated stage transitions and predictive analytics to close deals faster.",
      icon: "📊",
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "Click-to-Call Integration",
      description: "Seamlessly connect with leads through integrated calling system with automatic call logging and follow-up reminders.",
      icon: "📞",
      color: "bg-green-50 text-green-600"
    },
    {
      title: "Lead Tagging",
      description: "Organize and categorize leads with smart tagging system for better segmentation and personalized outreach.",
      icon: "🏷️",
      color: "bg-purple-50 text-purple-600"
    },
    {
      title: "Custom Apps",
      description: "Build custom workflows and integrations tailored to your unique business processes and requirements.",
      icon: "🔧",
      color: "bg-orange-50 text-orange-600"
    }
  ];

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Modern Sales Teams
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to streamline your sales process, nurture leads, and close more deals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 rounded-xl border-0 shadow-lg"
            >
              <CardContent className="p-8 text-center">
                <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Features Grid */}
        <div className="mt-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-gray-900">
              Advanced Analytics & Reporting
            </h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 bg-crm-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Real-time Performance Tracking</h4>
                  <p className="text-gray-600">Monitor your team's performance with live dashboards and KPI tracking.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 bg-crm-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Predictive Sales Forecasting</h4>
                  <p className="text-gray-600">AI-powered forecasting to predict revenue and identify potential risks.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 bg-crm-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Custom Report Builder</h4>
                  <p className="text-gray-600">Create detailed reports with drag-and-drop interface and export options.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-800">Sales Performance</h4>
                <span className="text-sm text-gray-600">This Month</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Conversion Rate</span>
                    <span className="text-sm font-semibold">68%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-crm-primary h-2 rounded-full" style={{width: '68%'}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Pipeline Health</span>
                    <span className="text-sm font-semibold">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-crm-accent h-2 rounded-full" style={{width: '85%'}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Goal Achievement</span>
                    <span className="text-sm font-semibold">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{width: '92%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;

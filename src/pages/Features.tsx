
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Check, Star, Zap, Shield, Users, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Features = () => {
  const features = [
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Lead Management",
      description: "Comprehensive lead tracking and management system with advanced filtering and sorting capabilities.",
      benefits: ["Real-time lead tracking", "Advanced search filters", "Lead status management", "Contact information storage"]
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-green-600" />,
      title: "Analytics & Reporting",
      description: "Powerful analytics dashboard with detailed insights into your sales performance and lead conversion rates.",
      benefits: ["Performance dashboards", "Conversion tracking", "Revenue analytics", "Custom reports"]
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      title: "Automation",
      description: "Automate repetitive tasks and workflows to increase productivity and reduce manual work.",
      benefits: ["Workflow automation", "Email sequences", "Task automation", "Follow-up reminders"]
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-600" />,
      title: "Security & Compliance",
      description: "Enterprise-grade security with role-based access control and data protection measures.",
      benefits: ["Role-based permissions", "Data encryption", "Secure authentication", "Compliance ready"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Modern Sales Teams
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how Heirlogic CRM can transform your sales process with cutting-edge features designed to boost productivity and close more deals.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-4">
                  {feature.icon}
                  <CardTitle className="text-2xl">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8">Join thousands of sales teams already using Heirlogic CRM</p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Start Free Trial
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Features;

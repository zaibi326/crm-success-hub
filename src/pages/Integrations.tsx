
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Calendar, Database, Phone, FileText, Users, Zap, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Integrations = () => {
  const integrations = [
    {
      icon: <Mail className="w-12 h-12 text-blue-600" />,
      title: "Email Platforms",
      description: "Connect with Gmail, Outlook, and other email providers",
      platforms: ["Gmail", "Outlook", "Yahoo Mail", "Apple Mail"]
    },
    {
      icon: <Calendar className="w-12 h-12 text-green-600" />,
      title: "Calendar Apps",
      description: "Sync your meetings and appointments seamlessly",
      platforms: ["Google Calendar", "Outlook Calendar", "Apple Calendar", "Calendly"]
    },
    {
      icon: <Phone className="w-12 h-12 text-purple-600" />,
      title: "Communication Tools",
      description: "Integrate with calling and messaging platforms",
      platforms: ["SmrtPhone.io", "Twilio", "Slack", "WhatsApp"]
    },
    {
      icon: <Database className="w-12 h-12 text-orange-600" />,
      title: "Database Systems",
      description: "Connect to your existing database infrastructure",
      platforms: ["Supabase", "PostgreSQL", "MySQL", "MongoDB"]
    },
    {
      icon: <FileText className="w-12 h-12 text-red-600" />,
      title: "Document Management",
      description: "Sync with document storage and management systems",
      platforms: ["Google Drive", "Dropbox", "OneDrive", "Box"]
    },
    {
      icon: <Users className="w-12 h-12 text-indigo-600" />,
      title: "Team Collaboration",
      description: "Work together with your favorite collaboration tools",
      platforms: ["Microsoft Teams", "Slack", "Discord", "Zoom"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Seamless Integrations
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect Heirlogic CRM with your favorite tools and platforms. Our extensive integration library ensures your workflow remains uninterrupted.
          </p>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {integrations.map((integration, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  {integration.icon}
                </div>
                <CardTitle className="text-xl">{integration.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">{integration.description}</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {integration.platforms.map((platform, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {platform}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">100+</div>
            <div className="text-gray-600">Available Integrations</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">99.9%</div>
            <div className="text-gray-600">Uptime Guarantee</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
            <div className="text-gray-600">Integration Support</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <Zap className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Ready to Connect Everything?</h2>
          <p className="text-xl mb-8">Start integrating your tools with Heirlogic CRM today</p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Explore Integrations
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Integrations;

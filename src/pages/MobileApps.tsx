
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Smartphone, Tablet, Download, Star, Users, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MobileApps = () => {
  const features = [
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Manage Leads On-the-Go",
      description: "Access and update your leads from anywhere, anytime. Never miss an opportunity."
    },
    {
      icon: <Zap className="w-8 h-8 text-green-600" />,
      title: "Real-time Sync",
      description: "All your data syncs in real-time across all devices. Stay updated instantly."
    },
    {
      icon: <Star className="w-8 h-8 text-yellow-600" />,
      title: "Offline Mode",
      description: "Continue working even without internet. Data syncs when you're back online."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Heirlogic Mobile Apps
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Take your CRM with you wherever you go. Our mobile apps provide full functionality with a native, optimized experience for iOS and Android.
          </p>
        </div>

        {/* App Preview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Your CRM in Your Pocket
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Access all your leads, manage campaigns, and close deals from your mobile device. Our apps are designed for productivity on the go.
            </p>
            
            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button className="flex items-center justify-center gap-3 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                <Download className="w-5 h-5" />
                Download for iOS
              </button>
              <button className="flex items-center justify-center gap-3 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                <Download className="w-5 h-5" />
                Download for Android
              </button>
            </div>

            {/* Ratings */}
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600">4.8/5 on App Store</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600">4.7/5 on Google Play</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center items-center gap-8">
            <Smartphone className="w-32 h-32 text-gray-400" />
            <Tablet className="w-40 h-40 text-gray-400" />
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Mobile-First Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">500K+</div>
            <div className="text-gray-600">Downloads</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-600 mb-2">4.8★</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-600 mb-2">99%</div>
            <div className="text-gray-600">Uptime</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
            <div className="text-gray-600">Support</div>
          </div>
        </div>

        {/* Requirements Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-6 h-6 text-blue-600" />
                iOS Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-700">
                <li>• iOS 14.0 or later</li>
                <li>• iPhone 7 or newer</li>
                <li>• iPad (6th generation) or newer</li>
                <li>• 100MB available storage</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-6 h-6 text-green-600" />
                Android Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-700">
                <li>• Android 8.0 (API level 26) or higher</li>
                <li>• 2GB RAM minimum</li>
                <li>• 150MB available storage</li>
                <li>• Internet connection required</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <Smartphone className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Ready to Go Mobile?</h2>
          <p className="text-xl mb-8">Download the Heirlogic mobile app and take your CRM everywhere</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Download for iOS
            </button>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Download for Android
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MobileApps;

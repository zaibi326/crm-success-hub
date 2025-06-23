
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-br from-crm-gradient-start via-crm-gradient-end to-blue-50 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                The{' '}
                <span className="text-crm-primary">Smarter CRM</span>
                {' '}for Lead Success
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed animate-slide-in-right">
                Transform your sales process with intelligent pipelines, automated workflows, 
                and powerful insights that turn prospects into loyal customers.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-crm-primary hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                Start Free Trial
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-gray-300 text-gray-700 hover:border-crm-primary hover:text-crm-primary px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-200"
              >
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-crm-accent rounded-full"></span>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-crm-accent rounded-full"></span>
                <span>14-day free trial</span>
              </div>
            </div>
          </div>

          {/* Right Column - Dashboard Preview */}
          <div className="relative animate-float">
            <div className="bg-white rounded-2xl shadow-2xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-300">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <h3 className="font-semibold text-gray-800">Sales Dashboard</h3>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-crm-primary">147</div>
                    <div className="text-xs text-gray-600">Active Leads</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-crm-accent">23</div>
                    <div className="text-xs text-gray-600">Closed Deals</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">$47K</div>
                    <div className="text-xs text-gray-600">Revenue</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-crm-primary rounded-full"></div>
                      <div>
                        <div className="font-medium text-sm">John Smith</div>
                        <div className="text-xs text-gray-600">Enterprise Deal</div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-crm-accent">$12K</div>
                  </div>
                  
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-crm-accent rounded-full"></div>
                      <div>
                        <div className="font-medium text-sm">Sarah Wilson</div>
                        <div className="text-xs text-gray-600">SaaS Subscription</div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-crm-accent">$8.5K</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="flex justify-center mt-16">
          <ArrowDown className="w-6 h-6 text-gray-400 animate-bounce" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

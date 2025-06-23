
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Sales Director",
      company: "TechFlow Inc.",
      avatar: "SJ",
      quote: "SmartCRM transformed our sales process completely. We've seen a 45% increase in conversion rates since implementing their intelligent pipeline system.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "VP of Sales",
      company: "GrowthLabs",
      avatar: "MC",
      quote: "The click-to-call integration and automated follow-ups have saved our team countless hours. Our productivity has never been higher.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Business Development Manager",
      company: "InnovateCorp",
      avatar: "ER",
      quote: "The analytics and reporting features give us insights we never had before. Data-driven decisions have become our competitive advantage.",
      rating: 5
    }
  ];

  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Trusted by Sales Teams Worldwide
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of sales professionals who have transformed their results with SmartCRM.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl border-0">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
                
                <blockquote className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-crm-primary rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-sm text-crm-primary font-medium">{testimonial.company}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-white rounded-2xl p-12 shadow-lg">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-crm-primary mb-2">10,000+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-crm-primary mb-2">45%</div>
              <div className="text-gray-600">Average Conversion Increase</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-crm-primary mb-2">2.5x</div>
              <div className="text-gray-600">Faster Deal Closure</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-crm-primary mb-2">99.9%</div>
              <div className="text-gray-600">Uptime Guarantee</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;

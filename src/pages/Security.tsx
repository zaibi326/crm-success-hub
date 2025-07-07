
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Shield, Lock, Eye, Server, CheckCircle, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Security = () => {
  const securityFeatures = [
    {
      icon: <Lock className="w-8 h-8 text-blue-600" />,
      title: "End-to-End Encryption",
      description: "All data is encrypted in transit and at rest using industry-standard AES-256 encryption."
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Multi-Factor Authentication",
      description: "Secure your account with MFA including SMS, email, and authenticator app options."
    },
    {
      icon: <Eye className="w-8 h-8 text-purple-600" />,
      title: "Role-Based Access Control",
      description: "Granular permissions ensure users only access data they need for their role."
    },
    {
      icon: <Server className="w-8 h-8 text-orange-600" />,
      title: "Secure Infrastructure",
      description: "Hosted on enterprise-grade infrastructure with 99.99% uptime guarantee."
    }
  ];

  const certifications = [
    {
      icon: <Award className="w-12 h-12 text-blue-600" />,
      title: "SOC 2 Type II",
      description: "Audited security controls for availability, confidentiality, and processing integrity."
    },
    {
      icon: <Shield className="w-12 h-12 text-green-600" />,
      title: "GDPR Compliant",
      description: "Full compliance with European data protection regulations."
    },
    {
      icon: <Lock className="w-12 h-12 text-purple-600" />,
      title: "ISO 27001",
      description: "International standard for information security management systems."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Shield className="w-16 h-16 mx-auto text-blue-600 mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Enterprise-Grade Security
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your data security is our top priority. Heirlogic CRM implements multiple layers of protection to keep your business information safe and secure.
          </p>
        </div>

        {/* Security Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Security Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {securityFeatures.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    {feature.icon}
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Data Protection */}
        <div className="mb-16">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Data Protection Principles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Data Minimization
                  </h3>
                  <p className="text-gray-600">We only collect and process data that's necessary for providing our services.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Purpose Limitation
                  </h3>
                  <p className="text-gray-600">Your data is used only for the purposes you've explicitly consented to.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Data Retention
                  </h3>
                  <p className="text-gray-600">We retain data only as long as necessary and provide easy deletion options.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Transparency
                  </h3>
                  <p className="text-gray-600">Clear information about how we collect, use, and protect your data.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Certifications */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Certifications & Compliance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {certifications.map((cert, index) => (
              <Card key={index} className="border-0 shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {cert.icon}
                  </div>
                  <CardTitle className="text-xl">{cert.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{cert.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Security Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">256-bit</div>
            <div className="text-gray-600">Encryption</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-600 mb-2">99.99%</div>
            <div className="text-gray-600">Uptime</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
            <div className="text-gray-600">Monitoring</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-orange-600 mb-2">0</div>
            <div className="text-gray-600">Data Breaches</div>
          </div>
        </div>

        {/* Security Practices */}
        <div className="mb-16">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Our Security Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Technical Safeguards</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Regular security audits and penetration testing</li>
                    <li>• Automated vulnerability scanning</li>
                    <li>• Secure development lifecycle (SDLC)</li>
                    <li>• Real-time threat monitoring</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Operational Security</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Employee security training programs</li>
                    <li>• Incident response procedures</li>
                    <li>• Regular backup and disaster recovery testing</li>
                    <li>• Vendor security assessments</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <Shield className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Your Data is Safe with Us</h2>
          <p className="text-xl mb-8">Experience peace of mind with enterprise-grade security</p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Learn More About Our Security
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Security;

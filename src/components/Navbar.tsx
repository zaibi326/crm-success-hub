
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">H</span>
                </div>
                <span className="font-bold text-xl text-gray-900">Heirlogic</span>
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/" className="text-gray-900 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors">
                Home
              </Link>
              <a href="#" className="text-gray-600 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors">
                CRM
              </a>
              <a href="#" className="text-gray-600 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors">
                Features
              </a>
              <Link to="/pricing" className="text-gray-600 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors">
                Pricing
              </Link>
              <a href="#" className="text-gray-600 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors">
                Contact
              </a>
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link to="/login">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link to="/" className="text-gray-900 block px-3 py-2 text-base font-medium">Home</Link>
              <a href="#" className="text-gray-600 block px-3 py-2 text-base font-medium">CRM</a>
              <a href="#" className="text-gray-600 block px-3 py-2 text-base font-medium">Features</a>
              <Link to="/pricing" className="text-gray-600 block px-3 py-2 text-base font-medium">Pricing</Link>
              <a href="#" className="text-gray-600 block px-3 py-2 text-base font-medium">Contact</a>
              <Link to="/login">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white w-full mt-4">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

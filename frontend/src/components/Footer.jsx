import React from 'react';
import { Gavel } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Gavel className="text-bid-purple" size={32} />
              <span className="text-2xl font-bold tracking-tight">BidPulse</span>
            </div>
            <p className="text-gray-400 max-w-sm">
              The premium real-time auction marketplace. 
              Secure transactions, verified sellers, and exclusive finds.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-200">Platform</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/about" className="hover:text-bid-purple transition">About Us</a></li>
              <li><a href="#" className="hover:text-bid-purple transition">How it Works</a></li>
              <li><a href="#" className="hover:text-bid-purple transition">Safety & Trust</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-200">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-bid-purple transition">Help Center</a></li>
              <li><a href="#" className="hover:text-bid-purple transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-bid-purple transition">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} BidPulse Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
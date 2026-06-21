import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import MailPopup from './MailPopup';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isMailOpen, setIsMailOpen] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-primary-dark dark:bg-[#0f0a12] text-white pt-16 pb-8 border-t border-[var(--border-color)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Info Column */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold font-serif text-secondary tracking-wide">
            Country Side Cafe
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed font-light">
            Bringing the rustic charm, golden hospitality, and rich flavors of Rajasthan blended with modern global culinary art. Experience culinary heritage in every bite.
          </p>
          <div className="flex space-x-4 pt-2">
            <a href="https://facebook.com" className="p-2 bg-[#2d1d2b] dark:bg-[#1a111e] rounded-full hover:bg-secondary text-gray-300 hover:text-white transition-colors duration-300">
              <FiFacebook className="w-5 h-5" />
            </a>
            <a href="https://instagram.com" className="p-2 bg-[#2d1d2b] dark:bg-[#1a111e] rounded-full hover:bg-secondary text-gray-300 hover:text-white transition-colors duration-300">
              <FiInstagram className="w-5 h-5" />
            </a>
            <a href="https://twitter.com" className="p-2 bg-[#2d1d2b] dark:bg-[#1a111e] rounded-full hover:bg-secondary text-gray-300 hover:text-white transition-colors duration-300">
              <FiTwitter className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold font-serif border-b border-[#5c3c52] pb-2 mb-4 text-primary-light">
            Quick Navigation
          </h3>
          <ul className="space-y-3.5 text-sm text-gray-300 font-light">
            <li>
              <Link to="/" className="hover:text-secondary hover:underline transition-colors duration-200">Home</Link>
            </li>
            <li>
              <Link to="/menu" className="hover:text-secondary hover:underline transition-colors duration-200">Our Menu</Link>
            </li>
            <li>
              <Link to="/wishlist" className="hover:text-secondary hover:underline transition-colors duration-200">My Wishlist</Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-secondary hover:underline transition-colors duration-200">Customer Portal</Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold font-serif border-b border-[#5c3c52] pb-2 mb-4 text-primary-light">
            Cafe Info
          </h3>
          <ul className="space-y-3.5 text-sm text-gray-300 font-light">
            <li className="flex items-start space-x-2">
              <FiMapPin className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
              <span>Plot 108 , RK Residency , Ganesh Nagar 17, Niwaru Road, Jhotwara, Jaipur.</span>
            </li>
            <li className="flex items-center space-x-2">
              <FiPhone className="w-5 h-5 text-secondary flex-shrink-0" />
              <span>9216464345</span>
            </li>
            <li className="flex items-center space-x-2 relative">
              <FiMail className="w-5 h-5 text-secondary flex-shrink-0" />
              <button 
                onClick={() => setIsMailOpen(!isMailOpen)}
                className="hover:text-secondary hover:underline transition-colors focus:outline-none"
              >
                rajankumawat123@gmail.com
              </button>
              <MailPopup isOpen={isMailOpen} onClose={() => setIsMailOpen(false)} />
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold font-serif border-b border-[#5c3c52] pb-2 mb-4 text-primary-light">
            Padharo Mhare Desh
          </h3>
          <p className="text-xs text-gray-300 font-light mb-4">
            Subscribe to receive exclusive recipes, culinary updates, and festive royal invitations.
          </p>
          <form onSubmit={handleSubscribe} className="space-y-2">
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full px-4 py-3 bg-[#2d1d2b] dark:bg-[#1a111e] border border-[#5c3c52] focus:border-secondary focus:outline-none rounded-xl text-sm placeholder-gray-400 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-secondary hover:bg-yellow-600 text-white font-medium py-3 px-4 rounded-xl text-sm transition-all duration-300 hover:shadow-lg active:scale-95"
            >
              Subscribe
            </button>
            {subscribed && (
              <p className="text-xs text-green-400 text-center animate-bounce mt-2">
                Thank you! Welcome to the royal family.
              </p>
            )}
          </form>
        </div>

      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-[#3d2035] text-center text-xs text-gray-400 font-light">
        <p>© {new Date().getFullYear()} Country Side Cafe. Made with ♥ for Rajasthan heritage. All rights reserved.</p>
      </div>
    </footer>
  );
}

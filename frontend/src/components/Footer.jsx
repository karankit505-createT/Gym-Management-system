import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter, Youtube, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0A0A12] border-t border-gym-border/60 text-gym-muted pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gym-orange/20 p-2 rounded-xl border border-gym-orange/40">
                <Dumbbell className="h-6 w-6 text-gym-orange" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white uppercase font-sans">
                IRON<span className="text-gym-orange">PULSE</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Transform your mind, body, and lifestyle with world-class gym facilities, certified elite trainers, and customized fitness programs.
            </p>
            <div className="flex space-x-2.5 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram" className="p-2.5 bg-gym-card hover:bg-gym-orange hover:text-white rounded-lg text-slate-400 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" title="Facebook" className="p-2.5 bg-gym-card hover:bg-gym-orange hover:text-white rounded-lg text-slate-400 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" title="Twitter" className="p-2.5 bg-gym-card hover:bg-gym-orange hover:text-white rounded-lg text-slate-400 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" title="YouTube Channel" className="p-2.5 bg-gym-card hover:bg-gym-orange hover:text-white rounded-lg text-slate-400 transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="https://maps.google.com/?q=123+Fitness+Boulevard+Metro+City" target="_blank" rel="noopener noreferrer" title="Google Maps Location" className="p-2.5 bg-gym-card hover:bg-gym-orange hover:text-white rounded-lg text-slate-400 transition-colors">
                <MapPin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold uppercase tracking-wider text-sm border-b border-gym-orange/30 pb-2 inline-block">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="hover:text-gym-orange transition-colors">About IronPulse</Link></li>
              <li><Link to="/membership" className="hover:text-gym-orange transition-colors">Membership Plans</Link></li>
              <li><Link to="/facilities" className="hover:text-gym-orange transition-colors">Facilities & Amenities</Link></li>
              <li><Link to="/testimonials" className="hover:text-gym-orange transition-colors">Member Testimonials</Link></li>
            </ul>
          </div>

          {/* Col 3: Operating Hours */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold uppercase tracking-wider text-sm border-b border-gym-orange/30 pb-2 inline-block">
              Gym Timings
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gym-orange" />
                <span>Monday - Friday: 5:00 AM - 11:00 PM</span>
              </li>
              <li className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gym-orange" />
                <span>Saturday: 6:00 AM - 10:00 PM</span>
              </li>
              <li className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gym-orange" />
                <span>Sunday: 7:00 AM - 8:00 PM</span>
              </li>
              <li className="flex items-center space-x-2 text-gym-orange font-semibold pt-1">
                <ShieldCheck className="w-4 h-4" />
                <span>VIP 24/7 Access for Annual Members</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Info */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold uppercase tracking-wider text-sm border-b border-gym-orange/30 pb-2 inline-block">
              Contact & Location
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-gym-orange shrink-0 mt-1" />
                <span>123 Fitness Boulevard, Tech District, Metro City 560001</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gym-orange shrink-0" />
                <span>+1 (800) 555-IRON / +91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gym-orange shrink-0" />
                <span>support@ironpulse.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-gym-border/40 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} IronPulse Gym Management System. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link to="/about" className="hover:text-slate-400">Privacy Policy</Link>
            <Link to="/about" className="hover:text-slate-400">Terms of Service</Link>
            <Link to="/about" className="hover:text-slate-400">Refund Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

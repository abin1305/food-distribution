import React from 'react';
import { UtensilsCrossed, Heart, Shield, FileText, AlertCircle, Users, Mail, Phone, MapPin } from 'lucide-react';
import { PolicyType } from './PolicyModals';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onOpenPolicy: (type: PolicyType) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenPolicy }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white font-['Playfair_Display']">
                Nourish<span className="text-emerald-500">Bridge</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Connecting hotels, catering services, restaurants, and event hosts with orphanages, homeless shelters, and community centers to eliminate food waste and feed people in need.
            </p>

            <div className="pt-2 flex flex-col gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Global Redistribution Network • Metro City HQ</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Toll Free Support: +1 800 555 0199</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>support@nourishbridge.org</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-emerald-400 transition">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('how-it-works')} className="hover:text-emerald-400 transition">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('providers')} className="hover:text-emerald-400 transition">
                  Food Providers
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('receivers')} className="hover:text-emerald-400 transition">
                  Food Receivers
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('impact')} className="hover:text-emerald-400 transition">
                  Impact & Analytics
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Support & Policies */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">Policies & Safety</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => onOpenPolicy('foodSafety')} className="hover:text-emerald-400 transition flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-emerald-500" /> Food Safety Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('donation')} className="hover:text-emerald-400 transition flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-emerald-500" /> Donation Guidelines
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('community')} className="hover:text-emerald-400 transition flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-500" /> Community Guidelines
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('privacy')} className="hover:text-emerald-400 transition flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-500" /> Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('terms')} className="hover:text-emerald-400 transition flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-500" /> Terms & Conditions
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Help & FAQ */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">Help & Support</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => setActiveTab('faq')} className="hover:text-emerald-400 transition">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('contact')} className="hover:text-emerald-400 transition">
                  Contact Customer Support
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('contact')} className="hover:text-emerald-400 transition">
                  Report Unsafe Food / Issue
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('contact')} className="hover:text-emerald-400 transition">
                  Partnership Requests
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 NourishBridge Redistribution Platform. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for Zero Food Waste and Hunger Reduction.
          </p>
        </div>
      </div>
    </footer>
  );
};

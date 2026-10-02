import React, { useState } from 'react';
import { UtensilsCrossed, Menu, X, HeartHandshake, User, LogOut, LayoutDashboard, Shield } from 'lucide-react';
import { User as UserType } from '../types';
import { NotificationBell } from './NotificationBell';

interface NavbarProps {
  user: UserType | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onSignOut,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'providers', label: 'Providers' },
    { id: 'receivers', label: 'Receivers' },
    { id: 'impact', label: 'Impact' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1 font-['Playfair_Display']">
                Nourish<span className="text-emerald-600">Bridge</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block -mt-1">
                Food Redistribution Platform
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3 py-2 rounded-xl text-sm font-semibold transition ${activeTab === link.id
                    ? 'text-emerald-600 bg-emerald-50/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <NotificationBell userId={user.id} />

                <button
                  onClick={() =>
                    setActiveTab(
                      user.role === 'admin'
                        ? 'admin-dashboard'
                        : user.role === 'provider'
                          ? 'provider-dashboard'
                          : 'receiver-dashboard'
                    )
                  }
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition shadow-md shadow-emerald-600/20"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </button>

                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900 line-clamp-1">{user.name}</p>
                    <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {user.role}
                    </span>
                  </div>
                  <button
                    onClick={onSignOut}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-4 py-2 text-slate-700 hover:text-emerald-600 font-semibold text-xs rounded-xl hover:bg-slate-100 transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition shadow-md shadow-emerald-600/20"
                >
                  <HeartHandshake className="w-4 h-4" />
                  Register Now
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            {user && <NotificationBell userId={user.id} />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 animate-fade-in">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition ${activeTab === link.id
                  ? 'text-emerald-600 bg-emerald-50 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
                }`}
            >
              {link.label}
            </button>
          ))}

          <div className="pt-4 border-t border-slate-100 space-y-2">
            {user ? (
              <>
                <button
                  onClick={() => {
                    setActiveTab(
                      user.role === 'admin'
                        ? 'admin-dashboard'
                        : user.role === 'provider'
                          ? 'provider-dashboard'
                          : 'receiver-dashboard'
                    );
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
                </button>
                <button
                  onClick={() => {
                    onSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-red-600 bg-red-50 font-semibold rounded-xl text-xs flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out ({user.name})
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onOpenAuth('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-xl text-xs"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    onOpenAuth('register');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-sm"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

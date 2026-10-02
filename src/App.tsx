import React, { useState, useEffect } from 'react';
import { User, ProviderProfile, ReceiverProfile } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './pages/AuthModal';
import { LandingPage } from './pages/LandingPage';
import { AboutPage } from './pages/AboutPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { ImpactPage } from './pages/ImpactPage';
import { FAQPage } from './pages/FAQPage';
import { ContactPage } from './pages/ContactPage';
import { ProviderDashboard } from './pages/ProviderDashboard';
import { ReceiverDashboard } from './pages/ReceiverDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { PolicyModals } from './components/PolicyModals';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [providerProfile, setProviderProfile] = useState<ProviderProfile | null>(null);
  const [receiverProfile, setReceiverProfile] = useState<ReceiverProfile | null>(null);

  const [activeTab, setActiveTab] = useState<string>('home');
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Policy Modal States
  const [policyModalType, setPolicyModalType] = useState<'privacy' | 'terms' | 'safety' | null>(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('nourish_token');
    const storedUser = localStorage.getItem('nourish_user');
    if (token && storedUser) {
      try {
        const u: User = JSON.parse(storedUser);
        setUser(u);
        loadProfiles(u);
      } catch (e) {
        console.error('Session restore failed', e);
      }
    }
  }, []);

  const loadProfiles = async (u: User) => {
    try {
      if (u.role === 'provider') {
        const res = await fetch(`/api/providers?userId=${u.id}`);
        if (res.ok) {
          const list = await res.json();
          if (list && list.length > 0) setProviderProfile(list[0]);
        }
      } else if (u.role === 'receiver') {
        const res = await fetch(`/api/receivers?userId=${u.id}`);
        if (res.ok) {
          const list = await res.json();
          if (list && list.length > 0) setReceiverProfile(list[0]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLoginSuccess = (loggedInUser: User, profile?: any, token?: string) => {
    setUser(loggedInUser);
    localStorage.setItem('nourish_user', JSON.stringify(loggedInUser));
    if (token) {
      localStorage.setItem('nourish_token', token);
    }
    if (profile) {
      if (loggedInUser.role === 'provider') setProviderProfile(profile);
      else if (loggedInUser.role === 'receiver') setReceiverProfile(profile);
    }
    loadProfiles(loggedInUser);

    // Redirect to relevant dashboard automatically
    if (loggedInUser.role === 'provider') {
      setActiveTab('provider-dashboard');
    } else if (loggedInUser.role === 'receiver') {
      setActiveTab('receiver-dashboard');
    } else if (loggedInUser.role === 'admin') {
      setActiveTab('admin-dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setProviderProfile(null);
    setReceiverProfile(null);
    localStorage.removeItem('nourish_token');
    localStorage.removeItem('nourish_user');
    setActiveTab('home');
  };

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const openPolicy = (type: 'privacy' | 'terms' | 'safety') => {
    setPolicyModalType(type);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={openAuth}
        onLogout={handleLogout}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <LandingPage onOpenAuth={openAuth} setActiveTab={setActiveTab} />
        )}

        {activeTab === 'about' && <AboutPage />}
        {activeTab === 'how-it-works' && <HowItWorksPage />}
        {activeTab === 'impact' && <ImpactPage />}
        {activeTab === 'faq' && <FAQPage />}
        {activeTab === 'contact' && <ContactPage />}

        {/* Dashboards */}
        {activeTab === 'provider-dashboard' && user && (
          <ProviderDashboard user={user} profile={providerProfile} />
        )}

        {activeTab === 'receiver-dashboard' && user && (
          <ReceiverDashboard user={user} profile={receiverProfile} />
        )}

        {activeTab === 'admin-dashboard' && user && <AdminDashboard />}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} onOpenPolicy={openPolicy} />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        mode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleLoginSuccess}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Policy Modals */}
      <PolicyModals modalType={policyModalType} onClose={() => setPolicyModalType(null)} />
    </div>
  );
}

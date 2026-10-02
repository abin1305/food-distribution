import React, { useState, useEffect } from 'react';
import {
  Utensils,
  HeartHandshake,
  ShieldCheck,
  Building2,
  Users,
  MapPin,
  TrendingUp,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Send,
  CheckCircle,
  HelpCircle,
  Clock,
  Award,
} from 'lucide-react';
import { GlobalImpactStats } from '../types';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
  setActiveTab: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth, setActiveTab }) => {
  const [stats, setStats] = useState<GlobalImpactStats>({
    mealsServed: 5570,
    foodSavedKg: 1950,
    activeProviders: 18,
    verifiedReceivers: 24,
    successfulDonations: 128,
    citiesCovered: 8,
  });

  const [activeStepTab, setActiveStepTab] = useState<'providers' | 'receivers'>('providers');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);

  useEffect(() => {
    fetch('/api/impact')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.mealsServed) setStats(data);
      })
      .catch((e) => console.error('Error loading impact stats', e));
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          phone: contactPhone,
          subject: contactSubject,
          message: contactMessage,
        }),
      });
      if (res.ok) {
        setContactSubmitted(true);
        setContactName('');
        setContactEmail('');
        setContactPhone('');
        setContactSubject('');
        setContactMessage('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setContactLoading(false);
    }
  };

  const faqs = [
    {
      q: 'Who can donate food on NourishBridge?',
      a: 'Any commercial food entity or organization with wholesome surplus food can register as a provider: hotels, restaurants, marriage/wedding halls, hostels, catering services, canteens, bakeries, corporate cafeterias, and event hosts.',
    },
    {
      q: 'Who can request and receive food?',
      a: 'Verified non-profit organizations and care centers can receive food: orphanages, homeless shelters, old age homes, NGOs, community kitchens, charity organizations, and emergency relief camps.',
    },
    {
      q: 'How are receivers and providers verified?',
      a: 'All registering organizations submit verification documentation (FSSAI licenses, non-profit registration certificates, address proof) which are reviewed and approved by platform administrators before active food exchanges occur.',
    },
    {
      q: 'How does location-based matching work?',
      a: 'When surplus food is listed, our algorithm uses real-time geographical coordinates (Haversine formula) to calculate distances and match nearby verified receivers within optimal radius for fast delivery/pickup.',
    },
    {
      q: 'How does partial food fulfillment work?',
      a: 'If an orphanage requests 100 meals and a hotel has 60 surplus meals, the hotel can fulfill 60 meals. The platform automatically updates the remaining requirement (40 meals) so other nearby providers can contribute the rest!',
    },
    {
      q: 'Is NourishBridge free of charge?',
      a: 'Yes, NourishBridge is 100% free of charge for both donors and receivers. Our mission is pure social impact: zero food waste and zero hunger.',
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-900 text-white pt-12 pb-24 rounded-b-[2.5rem]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/15 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                Zero Food Waste • Zero Hunger
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight font-['Playfair_Display']">
                Don't Waste Food.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
                  Share It With Someone Who Needs It.
                </span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Bridge the gap between surplus food from hotels, catering services, events, and restaurants with orphanages, shelters, NGOs, and communities fighting hunger.
              </p>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => onOpenAuth('register')}
                  className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold rounded-2xl text-sm transition shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 group"
                >
                  <Utensils className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Donate Surplus Food
                </button>

                <button
                  onClick={() => onOpenAuth('register')}
                  className="w-full sm:w-auto px-8 py-4 bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-white font-bold rounded-2xl text-sm transition flex items-center justify-center gap-2"
                >
                  <HeartHandshake className="w-5 h-5 text-emerald-400" />
                  Request Food
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 font-medium border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>100% Admin Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Real-time Matching</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>Partial Fulfillment</span>
                </div>
              </div>
            </div>

            {/* Right Column Illustration Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-slate-800/60 border border-slate-700/80 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
                <div className="relative rounded-2xl overflow-hidden aspect-4/3 mb-4 group">
                  <img
                    src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80"
                    alt="Community Food Distribution"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                    <p className="text-xs font-semibold text-white">
                      "Together, we turn surplus banquet meals into nourishing smiles for children."
                    </p>
                  </div>
                </div>

                {/* Floating Metric Pill */}
                <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Meals Served To Date</p>
                      <p className="text-xl font-bold text-white font-mono">
                        {stats.mealsServed.toLocaleString()} +
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-1 rounded-full border border-emerald-500/30">
                    Live Impact
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC IMPACT STATISTICS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Playfair_Display']">
            Our Collective Social & Environmental Impact
          </h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto">
            Real-time metric breakdown driven directly by our provider-receiver redistribution database.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-1 hover:border-emerald-500/50 transition">
            <p className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
              {stats.mealsServed.toLocaleString()}
            </p>
            <p className="text-xs font-bold text-slate-700">Meals Served</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-1 hover:border-emerald-500/50 transition">
            <p className="text-2xl sm:text-3xl font-black text-teal-600 font-mono">
              {stats.foodSavedKg.toLocaleString()} kg
            </p>
            <p className="text-xs font-bold text-slate-700">Food Saved</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-1 hover:border-emerald-500/50 transition">
            <p className="text-2xl sm:text-3xl font-black text-blue-600 font-mono">
              {stats.activeProviders}
            </p>
            <p className="text-xs font-bold text-slate-700">Active Donors</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-1 hover:border-emerald-500/50 transition">
            <p className="text-2xl sm:text-3xl font-black text-purple-600 font-mono">
              {stats.verifiedReceivers}
            </p>
            <p className="text-xs font-bold text-slate-700">Verified Shelters</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-1 hover:border-emerald-500/50 transition">
            <p className="text-2xl sm:text-3xl font-black text-amber-600 font-mono">
              {stats.successfulDonations}
            </p>
            <p className="text-xs font-bold text-slate-700">Successful Gifts</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-1 hover:border-emerald-500/50 transition">
            <p className="text-2xl sm:text-3xl font-black text-indigo-600 font-mono">
              {stats.citiesCovered}
            </p>
            <p className="text-xs font-bold text-slate-700">Cities Covered</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-100/70 py-16 rounded-3xl border border-slate-200/60">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            Simple 3-Step Process
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-['Playfair_Display']">
            How NourishBridge Works
          </h2>

          <div className="inline-flex p-1 bg-white rounded-2xl border border-slate-200 shadow-xs mt-4">
            <button
              onClick={() => setActiveStepTab('providers')}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition ${
                activeStepTab === 'providers'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              For Food Providers
            </button>
            <button
              onClick={() => setActiveStepTab('receivers')}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition ${
                activeStepTab === 'receivers'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              For Food Receivers
            </button>
          </div>
        </div>

        {activeStepTab === 'providers' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-black flex items-center justify-center text-lg">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base">Add Available Surplus Food</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Enter details such as food name, quantity, category, preparation time, best-before window, and photos.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-black flex items-center justify-center text-lg">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base">Match Nearby Receivers</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                The system automatically lists verified nearby orphanages and shelters sorted by geographical distance.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-black flex items-center justify-center text-lg">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base">Handover & Track Impact</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Deliver or coordinate pickup, confirm handover, and receive heartwarming thank-you notes from care centers.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-black flex items-center justify-center text-lg">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base">Register & Get Verified</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Register your orphanage, shelter, or NGO with operating details and get approved by admins.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-black flex items-center justify-center text-lg">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base">Submit Meal Requirement</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Specify people count, meal time (Breakfast/Lunch/Dinner), urgency, and preference (pickup/delivery).
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-black flex items-center justify-center text-lg">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base">Receive Food & Give Feedback</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Accept offers, track delivery, confirm food arrival, and leave ratings and thank-you messages for donors.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ABOUT THE PLATFORM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              The Mission & Challenge
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Playfair_Display']">
              Bridging the Paradox of Food Waste and Hunger
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Every single day, thousands of kilograms of wholesome, freshly prepared food are wasted after wedding banquets, corporate conferences, hotel buffets, and restaurant service. Simultaneously, thousands of children in orphanages, unhoused shelter residents, and seniors face severe food insecurity.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              NourishBridge provides a smart, location-aware full-stack technological bridge that connects both sides in real time, featuring partial fulfillment algorithms, food safety protocols, and transparent verification workflows.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <p className="font-bold text-emerald-900 text-sm">Social Impact</p>
                <p className="text-xs text-emerald-700 mt-1">Directly feeds children and vulnerable shelter occupants.</p>
              </div>
              <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100">
                <p className="font-bold text-teal-900 text-sm">Environmental Goal</p>
                <p className="text-xs text-teal-700 mt-1">Prevents methane emission from decomposing landfill organic waste.</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80"
              alt="Food Security Impact"
              className="rounded-3xl shadow-xl border border-slate-200 object-cover w-full h-[400px]"
            />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            Community Voices
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Playfair_Display']">
            Stories of Impact from Providers & Receivers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex text-amber-400">★★★★★</div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              "As a banquet hotel manager, throwing away 100 surplus dinner meals after a wedding crushed us. NourishBridge transformed our daily operations! Now meals reach local orphanages within 45 minutes."
            </p>
            <div className="flex items-center gap-3 pt-2">
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=100&q=80"
                alt="Chef Vance"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Chef Marcus Vance</p>
                <p className="text-[10px] text-slate-500">Grand Palace Hotel & Banquets</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex text-amber-400">★★★★★</div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              "We care for 65 children at Hope Home. The partial matching feature is amazing — two nearby catering companies fulfilled our dinner requirements together seamlessly!"
            </p>
            <div className="flex items-center gap-3 pt-2">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80"
                alt="Sister Mary"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Sister Mary Angela</p>
                <p className="text-[10px] text-slate-500">Hope Children Home</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex text-amber-400">★★★★★</div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              "Our homeless shelter serves 120 night residents. Knowing we can rely on verified food donors through this platform gives us peace of mind every single day."
            </p>
            <div className="flex items-center gap-3 pt-2">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                alt="Robert Chen"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Robert Chen</p>
                <p className="text-[10px] text-slate-500">Care NGO Shelter</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Playfair_Display']">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs"
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between font-bold text-slate-900 text-sm hover:bg-slate-50 transition"
              >
                <span>{faq.q}</span>
                {expandedFaq === idx ? (
                  <ChevronUp className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                )}
              </button>
              {expandedFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-slate-600 text-xs leading-relaxed border-t border-slate-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-800">
          <div className="text-center space-y-3 mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-['Playfair_Display']">
              Get in Touch with Our Team
            </h2>
            <p className="text-slate-400 text-xs max-w-lg mx-auto">
              Have a partnership request, feedback, or need assistance? Send us a message and our support admins will respond promptly.
            </p>
          </div>

          {contactSubmitted ? (
            <div className="p-6 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-center space-y-3">
              <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="font-bold text-white text-base">Message Sent Successfully!</h3>
              <p className="text-xs text-slate-300">
                Thank you for contacting NourishBridge. Our admin team will get back to you shortly.
              </p>
              <button
                onClick={() => setContactSubmitted(false)}
                className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Your Email *</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+1 555 000 0000"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Subject *</label>
                  <input
                    type="text"
                    required
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    placeholder="Partnership / Support / General Query"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Message *</label>
                <textarea
                  required
                  rows={4}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="How can we help you?"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={contactLoading}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {contactLoading ? 'Sending Message...' : 'Submit Contact Inquiry'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

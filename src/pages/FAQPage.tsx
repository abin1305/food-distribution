import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export const FAQPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const categories = ['All', 'General', 'Providers', 'Receivers', 'Food Safety', 'Donations'];

  const allFaqs = [
    {
      category: 'General',
      q: 'What is NourishBridge?',
      a: 'NourishBridge is a full-stack surplus food redistribution platform connecting commercial food providers (hotels, restaurants, catering services, marriage halls) with verified food receivers (orphanages, shelters, NGOs, community centers) to eliminate food waste.',
    },
    {
      category: 'General',
      q: 'Is NourishBridge free to use?',
      a: 'Yes, 100% free of charge. Donors cannot charge for donated food, and receivers cannot resell donated food.',
    },
    {
      category: 'Providers',
      q: 'Who can donate food?',
      a: 'Hotels, restaurants, function/wedding halls, hostels, catering services, bakeries, corporate canteens, event organizers, and individual donors.',
    },
    {
      category: 'Providers',
      q: 'How is food safety maintained?',
      a: 'Providers must declare preparation time, best-before guidance, storage condition (hot/cold), and allergen information before posting.',
    },
    {
      category: 'Receivers',
      q: 'How are receiver organizations verified?',
      a: 'Receivers submit registration certificates, contact person details, and address documentation. Admin reviews and approves each account.',
    },
    {
      category: 'Donations',
      q: 'How does partial food fulfillment work?',
      a: 'If a receiver requests 100 meals and a donor offers 60 meals, the remaining 40 meals stay open for other nearby providers to fulfill!',
    },
    {
      category: 'Donations',
      q: 'Can receivers arrange pickup or do providers deliver?',
      a: 'Both options are supported! Donors specify if they offer delivery or require receiver pickup, and coordinate directly.',
    },
  ];

  const filteredFaqs = allFaqs.filter((faq) => {
    const matchesCat = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch =
      faq.q.toLowerCase().includes(search.toLowerCase()) ||
      faq.a.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Knowledge Base
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Playfair_Display']">
          Frequently Asked Questions
        </h1>
        <p className="text-slate-600 text-sm max-w-lg mx-auto">
          Find answers to common questions about food donation, verification, and safety.
        </p>
      </div>

      {/* Search & Category Tabs */}
      <div className="space-y-4">
        <div className="relative max-w-md mx-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions (e.g. safety, verification, delivery)..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-xs bg-white shadow-xs focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm bg-white rounded-2xl border border-slate-200">
            No matching questions found for "{search}".
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between font-bold text-slate-900 text-sm hover:bg-slate-50 transition"
              >
                <span className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    {faq.category}
                  </span>
                  {faq.q}
                </span>
                {openIdx === idx ? (
                  <ChevronUp className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                )}
              </button>
              {openIdx === idx && (
                <div className="px-5 pb-5 text-slate-600 text-xs leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { Heart, Globe, Shield, Award, Target, Sparkles, CheckCircle } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          About NourishBridge
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-['Playfair_Display']">
          Ending Food Waste. Feeding Hope.
        </h1>
        <p className="text-slate-600 text-sm max-w-2xl mx-auto leading-relaxed">
          NourishBridge is a full-stack social impact platform built to redirect surplus food from hotels, banquets, restaurants, and catering services to local orphanages, shelters, and care organizations.
        </p>
      </div>

      {/* Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Our Core Mission</h3>
          <p className="text-slate-600 text-xs leading-relaxed">
            Our mission is to establish a zero-waste redistribution network where no edible surplus food ends up in landfills while families and children in local shelters lack nutritious meals.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Environmental Benefit</h3>
          <p className="text-slate-600 text-xs leading-relaxed">
            Decomposing food waste in landfills is responsible for approximately 8% of global greenhouse gas emissions. Rescuing meals actively combats climate change.
          </p>
        </div>
      </div>

      {/* Key Values */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-6">
        <h2 className="text-2xl font-bold font-['Playfair_Display']">Core Platform Principles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-300">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle className="w-4 h-4" /> 100% Free Service
            </div>
            <p>No fees charged to donors or care facilities. Built strictly for public good.</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle className="w-4 h-4" /> Food Safety First
            </div>
            <p>Rigorous preparation time, allergen disclosure, and thermal storage protocols.</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle className="w-4 h-4" /> Admin Verified
            </div>
            <p>Every provider and receiver account undergoes document check before approval.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

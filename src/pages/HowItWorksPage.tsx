import React from 'react';
import { Building2, ShieldCheck, Truck, HeartHandshake, CheckCircle2, ArrowRight } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Step-by-Step Architecture
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Playfair_Display']">
          How Food Redistribution Works
        </h1>
        <p className="text-slate-600 text-sm max-w-xl mx-auto">
          From surplus listing to delivery verification, see how NourishBridge safely connects food donors with care facilities.
        </p>
      </div>

      {/* Provider Workflow */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <Building2 className="w-6 h-6 text-emerald-600" />
          <h2 className="text-xl font-bold text-slate-900">Food Provider Journey</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs text-slate-600">
          <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="font-extrabold text-emerald-600 text-sm">Step 1</span>
            <p className="font-bold text-slate-900">List Surplus Food</p>
            <p>Enter meal details, quantity, prep time, best-before window, and thermal packaging.</p>
          </div>

          <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="font-extrabold text-emerald-600 text-sm">Step 2</span>
            <p className="font-bold text-slate-900">Location Matching</p>
            <p>System automatically finds nearby verified receivers sorted by distance.</p>
          </div>

          <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="font-extrabold text-emerald-600 text-sm">Step 3</span>
            <p className="font-bold text-slate-900">Send Offer</p>
            <p>Offer specific quantities (full or partial fulfillment) to local orphanages/shelters.</p>
          </div>

          <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="font-extrabold text-emerald-600 text-sm">Step 4</span>
            <p className="font-bold text-slate-900">Handover & Feedback</p>
            <p>Deliver or hand over food, receive digital confirmation and thank-you notes.</p>
          </div>
        </div>
      </div>

      {/* Receiver Workflow */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <ShieldCheck className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-slate-900">Food Receiver Journey</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs text-slate-600">
          <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="font-extrabold text-blue-600 text-sm">Step 1</span>
            <p className="font-bold text-slate-900">Admin Verification</p>
            <p>Register orphanage/NGO documents to receive verified receiver status badge.</p>
          </div>

          <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="font-extrabold text-blue-600 text-sm">Step 2</span>
            <p className="font-bold text-slate-900">Submit Request</p>
            <p>Post meal requirements (people count, meal time, urgency level).</p>
          </div>

          <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="font-extrabold text-blue-600 text-sm">Step 3</span>
            <p className="font-bold text-slate-900">Accept Offers</p>
            <p>Review incoming offers from nearby providers (supports partial fulfillment).</p>
          </div>

          <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="font-extrabold text-blue-600 text-sm">Step 4</span>
            <p className="font-bold text-slate-900">Confirm & Rate</p>
            <p>Inspect food quality, confirm arrival, and rate donor 1 to 5 stars.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

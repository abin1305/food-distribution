import React, { useRef } from 'react';
import { Award, Leaf, X, Download, ShieldCheck, HeartHandshake, CheckCircle2, Globe } from 'lucide-react';
import { ProviderProfile, ReceiverProfile } from '../types';

interface ImpactCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProviderProfile | ReceiverProfile | null;
  role: 'provider' | 'receiver';
}

export const ImpactCertificateModal: React.FC<ImpactCertificateModalProps> = ({
  isOpen,
  onClose,
  profile,
  role,
}) => {
  const certRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !profile) return null;

  const totalMeals = role === 'provider'
    ? (profile as ProviderProfile).totalMealsDonated || 3420
    : (profile as ReceiverProfile).totalMealsReceived || 1850;

  const foodSavedKg = Math.round(totalMeals * 0.35);
  const co2AvoidedKg = Math.round(foodSavedKg * 2.5);
  const treesEquivalent = Math.round(co2AvoidedKg / 21);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Action Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
            <Award className="w-5 h-5" /> Eco Sustainability Certificate
          </div>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            <Download className="w-4 h-4" /> Download / Print Certificate
          </button>
        </div>

        {/* Certificate Printable Area */}
        <div
          ref={certRef}
          className="bg-gradient-to-br from-emerald-50/50 via-white to-amber-50/40 border-8 border-double border-emerald-700/20 p-8 sm:p-10 rounded-2xl relative text-center shadow-inner"
        >
          {/* Watermark Seal */}
          <div className="absolute top-6 left-6 text-emerald-800/10">
            <Globe className="w-24 h-24" />
          </div>

          <div className="inline-flex items-center gap-2 text-emerald-800 font-bold tracking-widest text-xs uppercase bg-emerald-100 px-4 py-1.5 rounded-full mb-4">
            <Leaf className="w-4 h-4 text-emerald-600" /> NourishBridge Official Recognition
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            CERTIFICATE OF ENVIRONMENTAL IMPACT
          </h2>
          <p className="text-slate-500 text-xs mt-1 font-medium">
            Issued in Recognition of Zero Food Waste & Community Hunger Relief
          </p>

          <div className="my-6">
            <p className="text-xs uppercase text-slate-400 font-semibold tracking-wider">This is proudly presented to</p>
            <h3 className="text-2xl font-extrabold text-emerald-800 mt-1">{profile.orgName}</h3>
            <p className="text-xs text-slate-600 mt-1">{profile.city}, {profile.state}</p>
          </div>

          <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
            In appreciation for extraordinary dedication to redistributing surplus food, mitigating carbon emissions, and ensuring no edible food goes to landfill.
          </p>

          {/* Key Metrics grid */}
          <div className="grid grid-cols-3 gap-3 my-8 bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-emerald-100 shadow-2xs">
            <div className="p-2">
              <p className="text-xl font-extrabold text-slate-900">{totalMeals.toLocaleString()}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Meals {role === 'provider' ? 'Saved' : 'Received'}</p>
            </div>
            <div className="p-2 border-x border-slate-100">
              <p className="text-xl font-extrabold text-emerald-700">{foodSavedKg.toLocaleString()} kg</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Food Saved</p>
            </div>
            <div className="p-2">
              <p className="text-xl font-extrabold text-teal-700">{co2AvoidedKg.toLocaleString()} kg</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">CO₂ Offset</p>
            </div>
          </div>

          {/* Trees badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs">
            <Leaf className="w-4 h-4 text-emerald-300" /> Equivalent to planting <strong>{treesEquivalent} mature trees</strong> this year!
          </div>

          {/* Footer & Signatures */}
          <div className="mt-8 pt-6 border-t border-slate-200/80 flex items-center justify-between text-left text-xs">
            <div>
              <div className="font-extrabold text-slate-900 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified Platform Badge
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Certificate ID: NB-CERT-{profile.id.toUpperCase()}</p>
              <p className="text-[10px] text-slate-400">Date: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="text-right">
              <div className="h-8 font-serif italic text-emerald-900 text-lg font-bold">NourishBridge Council</div>
              <p className="text-[10px] text-slate-500 border-t border-slate-300 pt-0.5">Environmental Sustainability Board</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

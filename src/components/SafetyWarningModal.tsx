import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, ShieldCheck } from 'lucide-react';

interface SafetyWarningModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const SafetyWarningModal: React.FC<SafetyWarningModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(false);

  if (!isOpen) return null;

  const allChecked = checked1 && checked2 && checked3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-6">
        <div className="flex items-center gap-3 text-amber-600">
          <div className="p-3 bg-amber-100 rounded-2xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Food Safety & Quality Pledge</h3>
            <p className="text-xs text-slate-500">Please verify food safety compliance before posting.</p>
          </div>
        </div>

        <div className="bg-amber-50/80 border border-amber-200/60 rounded-2xl p-4 text-xs text-amber-900 leading-relaxed font-medium">
          ⚠️ "Only safe and suitable food should be donated. Providers hold responsibility for providing accurate preparation time, best-before guidance, and allergen disclosures."
        </div>

        <div className="space-y-3">
          <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
            <input
              type="checkbox"
              checked={checked1}
              onChange={(e) => setChecked1(e.target.checked)}
              className="mt-1 text-emerald-600 rounded focus:ring-emerald-500 w-4 h-4"
            />
            <span className="text-xs text-slate-700">
              This surplus food was prepared in a hygienic environment and stored in food-grade clean thermal containers.
            </span>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
            <input
              type="checkbox"
              checked={checked2}
              onChange={(e) => setChecked2(e.target.checked)}
              className="mt-1 text-emerald-600 rounded focus:ring-emerald-500 w-4 h-4"
            />
            <span className="text-xs text-slate-700">
              The food is fresh, unexpired, and safe for consumption within the specified best-before window.
            </span>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
            <input
              type="checkbox"
              checked={checked3}
              onChange={(e) => setChecked3(e.target.checked)}
              className="mt-1 text-emerald-600 rounded focus:ring-emerald-500 w-4 h-4"
            />
            <span className="text-xs text-slate-700">
              I have accurately declared dietary category (Vegetarian / Non-Vegetarian) and potential allergen components.
            </span>
          </label>
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            disabled={!allChecked}
            onClick={onConfirm}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs text-white flex items-center gap-2 transition ${
              allChecked
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-md'
                : 'bg-slate-300 cursor-not-allowed'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Confirm & Post Surplus Food
          </button>
        </div>
      </div>
    </div>
  );
};

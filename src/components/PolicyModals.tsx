import React from 'react';
import { X, Shield, FileText, AlertCircle, HeartHandshake, Users } from 'lucide-react';

export type PolicyType = 'privacy' | 'terms' | 'foodSafety' | 'donation' | 'community' | null;

interface PolicyModalsProps {
  activePolicy: PolicyType;
  onClose: () => void;
}

export const PolicyModals: React.FC<PolicyModalsProps> = ({ activePolicy, onClose }) => {
  if (!activePolicy) return null;

  const getContent = () => {
    switch (activePolicy) {
      case 'privacy':
        return {
          title: 'Privacy Policy',
          icon: <Shield className="w-6 h-6 text-emerald-600" />,
          sections: [
            {
              heading: '1. Information We Collect',
              text: 'NourishBridge collects essential account details such as organization name, contact email, phone number, address, geographic location (latitude/longitude), and verification documentation strictly for food redistribution matching and verification.',
            },
            {
              heading: '2. Use of Location & Contact Data',
              text: 'Location coordinates are used solely to calculate physical distance between food providers and food receivers. Exact contact information is only displayed to verified counterparties when a donation offer or request is accepted.',
            },
            {
              heading: '3. Data Security & Storage',
              text: 'All account passwords are encrypted using industry-standard hashing. We never sell or expose personal data to commercial third parties.',
            },
          ],
        };
      case 'terms':
        return {
          title: 'Terms & Conditions',
          icon: <FileText className="w-6 h-6 text-emerald-600" />,
          sections: [
            {
              heading: '1. Platform Acceptance',
              text: 'By registering as a Food Provider or Food Receiver, you agree to comply with all local food safety codes, verification procedures, and community standards.',
            },
            {
              heading: '2. Free Non-Profit Service',
              text: 'NourishBridge is 100% free of charge. No food provider may charge fees for surplus food donated through this platform, and no receiver may resell donated food.',
            },
            {
              heading: '3. Admin Authorization',
              text: 'All new accounts remain in Pending status until approved by platform administrators following verification document checks.',
            },
          ],
        };
      case 'foodSafety':
        return {
          title: 'Food Safety & Handling Policy',
          icon: <AlertCircle className="w-6 h-6 text-emerald-600" />,
          sections: [
            {
              heading: '1. Freshness & Hygiene Standards',
              text: 'Only wholesome, unexpired, safe-to-consume surplus food should be donated. Food must be prepared, packaged, and stored under proper thermal conditions (Hot >65°C, Cold <4°C).',
            },
            {
              heading: '2. Provider Responsibility',
              text: 'Providers must accurately disclose preparation time, best-before expiration, vegetarian/non-vegetarian status, and potential allergens (dairy, nuts, gluten).',
            },
            {
              heading: '3. Mandatory Rejection of Unsafe Food',
              text: 'Receivers hold the full right to inspect and reject food upon pickup/delivery if smell, temperature, or packaging fails hygiene standards.',
            },
          ],
        };
      case 'donation':
        return {
          title: 'Donation Guidelines',
          icon: <HeartHandshake className="w-6 h-6 text-emerald-600" />,
          sections: [
            {
              heading: '1. Timely Handover',
              text: 'Providers should list surplus food as soon as possible after event or meal conclusion to allow sufficient window for matching and delivery before expiry.',
            },
            {
              heading: '2. Clean Packaging',
              text: 'Use food-grade disposable containers or request receivers to bring clean insulated stainless steel vessels for transport.',
            },
            {
              heading: '3. Mutual Rating & Respect',
              text: 'Upon delivery completion, receivers submit feedback and star ratings to build community trust and celebrate social impact.',
            },
          ],
        };
      case 'community':
        return {
          title: 'Community Code of Conduct',
          icon: <Users className="w-6 h-6 text-emerald-600" />,
          sections: [
            {
              heading: '1. Respect & Dignity',
              text: 'All interactions between food donors, volunteers, orphanages, shelters, and platform admins must be treated with dignity and compassion.',
            },
            {
              heading: '2. Zero Waste Commitment',
              text: 'We strive for 100% waste prevention. In case of leftover unfulfilled portions, communicate early so alternative nearby shelters can benefit.',
            },
          ],
        };
      default:
        return null;
    }
  };

  const content = getContent();
  if (!content) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100/80 rounded-2xl">{content.icon}</div>
            <h2 className="text-xl font-bold text-slate-900">{content.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-sm leading-relaxed">
          {content.sections.map((sec, idx) => (
            <div key={idx} className="space-y-1.5">
              <h3 className="font-bold text-slate-900 text-base">{sec.heading}</h3>
              <p className="text-slate-600">{sec.text}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition shadow-md"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};

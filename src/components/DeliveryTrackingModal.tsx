import React, { useState } from 'react';
import { Truck, CheckCircle2, MapPin, Phone, ShieldCheck, Clock, AlertTriangle, Key, X, ChevronRight } from 'lucide-react';
import { Donation } from '../types';
import { calculateDistance } from '../server/db';

interface DeliveryTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  donation: Donation | null;
  onStatusUpdate: (donationId: string, newStatus: string) => void;
}

export const DeliveryTrackingModal: React.FC<DeliveryTrackingModalProps> = ({
  isOpen,
  onClose,
  donation,
  onStatusUpdate,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [pinVerified, setPinVerified] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !donation) return null;

  const steps = [
    { key: 'Offer Sent', label: 'Offer Sent', desc: 'Provider submitted food offer' },
    { key: 'Accepted', label: 'Offer Accepted', desc: 'Receiver accepted & matched' },
    { key: 'Preparing', label: 'Packaging & Prep', desc: 'Sealed in thermal containers' },
    { key: 'Ready for Pickup', label: 'Ready for Pickup', desc: 'Packed and waiting at location' },
    { key: 'Out for Delivery', label: 'Out for Delivery', desc: 'En route to destination' },
    { key: 'Food Received', label: 'Handover & PIN', desc: 'Received & verified by receiver' },
    { key: 'Completed', label: 'Completed & Logged', desc: 'Saved to environmental records' },
  ];

  const currentIdx = steps.findIndex((s) => s.key === donation.status);
  const dist = calculateDistance(
    donation.providerLat || 37.7749,
    donation.providerLng || -122.4194,
    donation.receiverLat || 37.7811,
    donation.receiverLng || -122.4285
  );

  const mockPin = '4829'; // 4-digit verification code

  const handleVerifyPin = () => {
    if (pinInput.trim() === mockPin) {
      setPinVerified(true);
      setErrorMsg('');
      onStatusUpdate(donation.id, 'Food Received');
    } else {
      setErrorMsg('Invalid PIN. Please ask receiver for 4-digit security code (Demo PIN: 4829).');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">Smart Delivery & Verification Engine</h3>
            <p className="text-xs text-slate-500">Order ID: #{donation.id}</p>
          </div>
        </div>

        {/* Order Details */}
        <div className="my-6 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-800 text-sm">{donation.foodName}</span>
            <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
              {donation.offeredQuantity} {donation.quantityUnit}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-slate-600 pt-2 border-t border-slate-200/60">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Pickup</p>
              <p className="font-semibold text-slate-800">{donation.providerName}</p>
              <p className="text-slate-500 truncate">{donation.pickupAddress}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Delivery</p>
              <p className="font-semibold text-slate-800">{donation.receiverName}</p>
              <p className="text-slate-500 truncate">{donation.deliveryAddress}</p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-slate-600">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Distance: <strong>{dist} km</strong>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-600" /> Est. Transit: <strong>{Math.round(dist * 4 + 10)} mins</strong>
            </span>
          </div>
        </div>

        {/* Timeline Steps */}
        <div className="space-y-3 mb-6">
          <h4 className="font-bold text-xs uppercase text-slate-400 tracking-wider">Status Timeline</h4>
          <div className="relative pl-6 space-y-3 border-l-2 border-slate-200 ml-2">
            {steps.map((step, idx) => {
              const isPast = idx < currentIdx;
              const isCurrent = idx === currentIdx;
              return (
                <div key={step.key} className="relative">
                  <div
                    className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                      isPast || isCurrent
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-slate-300'
                    }`}
                  >
                    {(isPast || isCurrent) && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={`text-xs font-bold ${isCurrent ? 'text-emerald-700' : isPast ? 'text-slate-900' : 'text-slate-400'}`}>
                        {step.label} {isCurrent && <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-extrabold ml-1">Current State</span>}
                      </p>
                      <p className="text-[11px] text-slate-500">{step.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Controls */}
        <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200/80 space-y-3">
          <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Advance Order Status
          </h4>

          {donation.status === 'Offer Sent' && (
            <button
              onClick={() => onStatusUpdate(donation.id, 'Accepted')}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-1"
            >
              Accept Surplus Offer <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {donation.status === 'Accepted' && (
            <button
              onClick={() => onStatusUpdate(donation.id, 'Preparing')}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-1"
            >
              Mark as Preparing & Packaging <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {donation.status === 'Preparing' && (
            <button
              onClick={() => onStatusUpdate(donation.id, 'Ready for Pickup')}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-1"
            >
              Mark Ready for Pickup <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {donation.status === 'Ready for Pickup' && (
            <button
              onClick={() => onStatusUpdate(donation.id, 'Out for Delivery')}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-1"
            >
              Dispatch (Out for Delivery) <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {/* PIN Verification Step */}
          {donation.status === 'Out for Delivery' && (
            <div className="space-y-2">
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs">
                <p className="font-bold text-amber-900 flex items-center gap-1">
                  <Key className="w-4 h-4 text-amber-600" /> Digital Handover PIN Verification
                </p>
                <p className="text-amber-800 text-[11px] mt-0.5">Enter the 4-digit handover code provided by the receiver (Demo PIN: <strong>4829</strong>).</p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter 4-digit PIN (e.g. 4829)"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <button
                  onClick={handleVerifyPin}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition"
                >
                  Verify & Handover
                </button>
              </div>
              {errorMsg && <p className="text-xs font-bold text-red-600 mt-1">{errorMsg}</p>}
            </div>
          )}

          {donation.status === 'Food Received' && (
            <button
              onClick={() => onStatusUpdate(donation.id, 'Completed')}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-1"
            >
              Complete Order & Archive <CheckCircle2 className="w-4 h-4" />
            </button>
          )}

          {donation.status === 'Completed' && (
            <div className="text-center py-2 text-xs font-bold text-emerald-800 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Order Completed & Impact Recorded!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

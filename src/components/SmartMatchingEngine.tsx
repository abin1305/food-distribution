import React, { useState } from 'react';
import { Sparkles, MapPin, Clock, ArrowRight, ShieldCheck, CheckCircle2, Zap, HeartHandshake } from 'lucide-react';
import { FoodListing, FoodRequest, ProviderProfile, ReceiverProfile } from '../types';
import { calculateDistance } from '../server/db';

interface SmartMatchingEngineProps {
  listings: FoodListing[];
  requests: FoodRequest[];
  onInstantOffer?: (listing: FoodListing, request: FoodRequest, distanceKm: number) => void;
}

export const SmartMatchingEngine: React.FC<SmartMatchingEngineProps> = ({
  listings,
  requests,
  onInstantOffer,
}) => {
  const [filterRadius, setFilterRadius] = useState<number>(15); // max km

  // Compute matches
  const matches = listings.flatMap((listing) => {
    return requests
      .filter((req) => req.status === 'active')
      .map((req) => {
        const dist = calculateDistance(listing.lat, listing.lng, req.lat, req.lng);

        // Match algorithm criteria
        let score = 50; // base score

        // Proximity score
        if (dist <= 3) score += 35;
        else if (dist <= 8) score += 25;
        else if (dist <= 15) score += 15;
        else score += 5;

        // Dietary & type match
        if (listing.isVegetarian) score += 10;
        if (listing.category.toLowerCase().includes(req.foodType.toLowerCase()) || req.foodType.toLowerCase().includes(listing.category.toLowerCase())) {
          score += 15;
        }

        // Capacity match ratio
        const qtyRatio = Math.min(listing.remainingQuantity / req.remainingQuantity, 1);
        score += Math.round(qtyRatio * 15);

        // Cap at 99%
        const finalScore = Math.min(score, 99);

        return {
          listing,
          request: req,
          distanceKm: dist,
          matchScore: finalScore,
        };
      });
  })
  .filter((m) => m.distanceKm <= filterRadius)
  .sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200/80 mb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg text-slate-900">AI Surplus Matching Engine</h3>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-semibold">
                Live Dynamic
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated logistics pairing based on distance, quantity needed, and dietary preferences
            </p>
          </div>
        </div>

        {/* Distance Filter Slider */}
        <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span className="font-medium text-slate-700">Radius Filter:</span>
          <input
            type="range"
            min="2"
            max="30"
            value={filterRadius}
            onChange={(e) => setFilterRadius(Number(e.target.value))}
            className="w-24 accent-emerald-600 cursor-pointer"
          />
          <span className="font-bold text-emerald-700 bg-white px-2 py-0.5 rounded shadow-xs border border-slate-200">
            Within {filterRadius} km
          </span>
        </div>
      </div>

      {/* Match Results */}
      {matches.length === 0 ? (
        <div className="text-center py-10">
          <Zap className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-500 font-medium">No automated matches within {filterRadius} km radius.</p>
          <p className="text-xs text-slate-400 mt-1">Try expanding the distance radius slider above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {matches.slice(0, 4).map((m, idx) => (
            <div
              key={`${m.listing.id}-${m.request.id}-${idx}`}
              className="p-4 rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/20 hover:border-emerald-300 transition shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md">
                    <Sparkles className="w-3 h-3" /> {m.matchScore}% Optimal Match
                  </span>
                  <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" /> {m.distanceKm} km away
                  </span>
                </div>

                {/* Pairing Info */}
                <div className="space-y-2 text-xs">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/60 shadow-2xs">
                    <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Surplus Food</span>
                    <p className="font-bold text-slate-800 text-sm">{m.listing.foodName}</p>
                    <p className="text-slate-500">{m.listing.providerName} &bull; <strong className="text-emerald-700">{m.listing.remainingQuantity} {m.listing.quantityUnit}</strong> available</p>
                  </div>

                  <div className="flex justify-center my-1">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                      ↓
                    </div>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/60 shadow-2xs">
                    <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">Receiver Request</span>
                    <p className="font-bold text-slate-800 text-sm">{m.request.receiverName}</p>
                    <p className="text-slate-500">Needs {m.request.requiredQuantity} meals &bull; Urgency: <strong className={m.request.urgency === 'urgent' ? 'text-red-600 font-bold' : 'text-slate-700'}>{m.request.urgency.toUpperCase()}</strong></p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" /> Transit ~{Math.round(m.distanceKm * 4 + 10)} mins
                </span>

                {onInstantOffer && (
                  <button
                    onClick={() => onInstantOffer(m.listing, m.request, m.distanceKm)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition"
                  >
                    <HeartHandshake className="w-3.5 h-3.5" /> Instant Dispatch
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

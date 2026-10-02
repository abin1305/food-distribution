import React, { useState, useEffect } from 'react';
import {
  PlusCircle,
  Utensils,
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  HeartHandshake,
  Star,
  AlertTriangle,
  Send,
  Building,
  Calendar,
  X,
  Sparkles,
} from 'lucide-react';
import {
  User as UserType,
  ReceiverProfile,
  FoodListing,
  FoodRequest,
  Donation,
  MealTime,
} from '../types';
import { LeafletMap } from '../components/LeafletMap';
import { SmartMatchingEngine } from '../components/SmartMatchingEngine';
import { ImpactCertificateModal } from '../components/ImpactCertificateModal';
import { DeliveryTrackingModal } from '../components/DeliveryTrackingModal';
import { Award } from 'lucide-react';

interface ReceiverDashboardProps {
  user: UserType;
  profile: ReceiverProfile | null;
}

export const ReceiverDashboard: React.FC<ReceiverDashboardProps> = ({ user, profile }) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'add_req' | 'available_food' | 'donations' | 'feedback'>('requests');

  const [requests, setRequests] = useState<FoodRequest[]>([]);
  const [availableListings, setAvailableListings] = useState<FoodListing[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(false);

  // Submit Food Request Form State
  const [foodType, setFoodType] = useState('Dinner Meals (Rice, Dal, Veg Curry, Roti)');
  const [peopleCount, setPeopleCount] = useState('65');
  const [requiredQuantity, setRequiredQuantity] = useState('65');
  const [mealTime, setMealTime] = useState<MealTime>('Night');
  const [requiredDate, setRequiredDate] = useState('2026-08-09');
  const [requiredTime, setRequiredTime] = useState('20:00');
  const [urgency, setUrgency] = useState<'normal' | 'urgent'>('urgent');
  const [preference, setPreference] = useState<'pickup' | 'delivery' | 'both'>('delivery');
  const [isRecurring, setIsRecurring] = useState(true);
  const [recurringFrequency, setRecurringFrequency] = useState('Daily Dinner');
  const [specialRequirements, setSpecialRequirements] = useState('Nutritious meals for young children');
  const [notes, setNotes] = useState('Serving 65 orphaned children');

  // Feedback Modal State
  const [feedbackDonation, setFeedbackDonation] = useState<Donation | null>(null);
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [thankYouMessage, setThankYouMessage] = useState('Thank you for helping us provide dinner for our children!');

  // Advanced Feature Modals
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [selectedDonationForTracking, setSelectedDonationForTracking] = useState<Donation | null>(null);

  const receiverId = profile?.id || 'rcv_1';

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resReq, resFood, resDon] = await Promise.all([
        fetch(`/api/requests?receiverId=${receiverId}`),
        fetch(`/api/food?lat=${profile?.lat || 37.7811}&lng=${profile?.lng || -122.4285}`),
        fetch(`/api/donations?receiverId=${receiverId}`),
      ]);

      if (resReq.ok) setRequests(await resReq.json());
      if (resFood.ok) setAvailableListings(await resFood.json());
      if (resDon.ok) setDonations(await resDon.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [receiverId]);

  const handleCreateRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId,
          foodType,
          peopleCount: Number(peopleCount),
          requiredQuantity: Number(requiredQuantity),
          mealTime,
          requiredDate,
          requiredTime,
          urgency,
          preference,
          isRecurring,
          recurringFrequency,
          specialRequirements,
          notes,
        }),
      });

      if (res.ok) {
        alert('Food request published! Nearby verified providers have been notified.');
        setActiveTab('requests');
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAcceptDonation = async (donationId: string) => {
    try {
      const res = await fetch(`/api/donations/${donationId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Accepted' }),
      });
      if (res.ok) {
        alert('Donation offer accepted! Delivery/pickup coordinates are now visible.');
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleConfirmReceived = async (donation: Donation) => {
    try {
      const res = await fetch(`/api/donations/${donation.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Food Received' }),
      });
      if (res.ok) {
        setFeedbackDonation(donation);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackDonation) return;
    try {
      const res = await fetch(`/api/donations/${feedbackDonation.id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          feedbackText,
          thankYouMessage,
        }),
      });
      if (res.ok) {
        alert('Thank you note and rating sent to donor!');
        setFeedbackDonation(null);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome & Verification Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold font-['Playfair_Display']">
              {profile?.orgName || user.name}
            </h1>
            <span
              className={`text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1 ${
                profile?.status === 'approved'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              {profile?.status === 'approved' ? 'Verified Receiver ✓' : 'Pending Verification'}
            </span>
          </div>
          <p className="text-slate-400 text-xs">
            {profile?.address}, {profile?.city} • {profile?.receiverType} • Capacity: {profile?.peopleServedNormally} People
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => setCertModalOpen(true)}
            className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-blue-400 font-extrabold rounded-2xl text-xs flex items-center gap-2 border border-slate-700 transition"
          >
            <Award className="w-4 h-4 text-blue-400" /> Eco Impact Certificate
          </button>
          <button
            onClick={() => setActiveTab('add_req')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl text-xs flex items-center gap-2 transition shadow-md shadow-blue-600/20"
          >
            <PlusCircle className="w-4 h-4" /> Request Food
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Total Meals Received</p>
          <p className="text-2xl font-black text-slate-900 font-mono mt-1">
            {profile?.totalMealsReceived || 1850}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Donations Received</p>
          <p className="text-2xl font-black text-blue-600 font-mono mt-1">
            {profile?.totalDonationsReceived || 28}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Active Requests</p>
          <p className="text-2xl font-black text-amber-600 font-mono mt-1">
            {requests.filter((r) => r.status === 'active' || r.status === 'partially_fulfilled').length}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase">People Served</p>
          <p className="text-2xl font-black text-emerald-600 font-mono mt-1">
            {profile?.peopleServedNormally || 65}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'requests'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Utensils className="w-4 h-4" /> My Requests & Partial Fulfillment
        </button>

        <button
          onClick={() => setActiveTab('add_req')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'add_req'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <PlusCircle className="w-4 h-4" /> Submit Food Request
        </button>

        <button
          onClick={() => setActiveTab('available_food')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'available_food'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4" /> Surplus Food Available Nearby
        </button>

        <button
          onClick={() => setActiveTab('donations')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'donations'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Truck className="w-4 h-4" /> Donations Received & Delivery
        </button>
      </div>

      {/* TAB 1: MY REQUESTS & PARTIAL FULFILLMENT */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Active Food Requests</h3>
              <p className="text-xs text-slate-500">
                Supports partial fulfillment — multiple providers can fulfill portions of a single request!
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {requests.map((req) => {
              const pct = Math.min(100, Math.round((req.fulfilledQuantity / req.requiredQuantity) * 100));
              return (
                <div key={req.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          req.urgency === 'urgent'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {req.urgency} • {req.mealTime} Meal
                      </span>
                      <h4 className="font-bold text-slate-900 text-base mt-1">{req.foodType}</h4>
                      <p className="text-xs text-slate-500">{req.notes}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-800">
                        {req.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Partial Fulfillment Progress Bar */}
                  <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-700">Fulfillment Progress:</span>
                      <span className="text-emerald-600 font-mono">
                        {req.fulfilledQuantity} / {req.requiredQuantity} {req.quantityUnit} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Fulfilled: {req.fulfilledQuantity} meals</span>
                      <span className="font-bold text-amber-600">
                        Remaining Needed: {req.remainingQuantity} meals
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: SUBMIT FOOD REQUEST */}
      {activeTab === 'add_req' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs max-w-3xl space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold text-slate-900">Submit Food Requirement Request</h3>
            <p className="text-xs text-slate-500 mt-1">
              Specify your meal requirement so nearby hotel & catering donors can offer food.
            </p>
          </div>

          <form onSubmit={handleCreateRequestSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Requested Food / Meal Type *
              </label>
              <input
                type="text"
                required
                value={foodType}
                onChange={(e) => setFoodType(e.target.value)}
                placeholder="e.g. Cooked Dinner Meals (Rice, Dal, Veggies, Rotis)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">People Count *</label>
                <input
                  type="number"
                  required
                  value={peopleCount}
                  onChange={(e) => {
                    setPeopleCount(e.target.value);
                    setRequiredQuantity(e.target.value);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Required Servings *
                </label>
                <input
                  type="number"
                  required
                  value={requiredQuantity}
                  onChange={(e) => setRequiredQuantity(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Meal Time *</label>
                <select
                  value={mealTime}
                  onChange={(e: any) => setMealTime(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                >
                  <option value="Morning">Morning Breakfast</option>
                  <option value="Afternoon">Afternoon Lunch</option>
                  <option value="Evening">Evening Snacks</option>
                  <option value="Night">Night Dinner</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Urgency Level</label>
                <select
                  value={urgency}
                  onChange={(e: any) => setUrgency(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                >
                  <option value="normal">Normal Priority</option>
                  <option value="urgent">Urgent Needed Today</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Recurring Requirement
                </label>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="text-blue-600 rounded"
                  />
                  <span className="text-xs text-slate-700 font-semibold">
                    Set as Daily Recurring Request
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Additional Notes</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Serving 65 children at orphanage..."
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-blue-600/20"
            >
              Publish Food Request to Nearby Donors
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: AVAILABLE SURPLUS FOOD */}
      {activeTab === 'available_food' && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-lg">Surplus Food Posted Nearby</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableListings.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs p-5 space-y-3">
                <div className="h-36 rounded-2xl overflow-hidden relative">
                  <img src={item.imageUrl} alt={item.foodName} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                    {item.remainingQuantity} Servings
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{item.foodName}</h4>
                <p className="text-xs text-slate-500">{item.providerName} • {item.address}</p>
                <p className="text-xs text-amber-600 font-semibold">Best before: {item.bestBeforeTime}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: DONATIONS RECEIVED & FEEDBACK */}
      {activeTab === 'donations' && (
        <div className="space-y-6">
          <h3 className="font-bold text-slate-900 text-lg">Donations Received</h3>
          <div className="space-y-4">
            {donations.map((don) => (
              <div key={don.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{don.foodName}</h4>
                    <p className="text-xs text-slate-500">From: {don.providerName} ({don.offeredQuantity} servings)</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    {don.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <div className="flex flex-wrap items-center gap-2">
                    {don.status === 'Offer Sent' && (
                      <button
                        onClick={() => handleAcceptDonation(don.id)}
                        className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition"
                      >
                        Accept Donation Offer
                      </button>
                    )}
                    {don.status === 'Accepted' || don.status === 'Out for Delivery' ? (
                      <button
                        onClick={() => handleConfirmReceived(don)}
                        className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition"
                      >
                        Confirm Food Received & Send Thank You
                      </button>
                    ) : null}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedDonationForTracking(don);
                      setTrackingModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-xs transition flex items-center gap-1 shadow-xs"
                  >
                    <Truck className="w-3.5 h-3.5" /> Interactive Delivery Tracker
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Eco Sustainability Certificate Modal */}
      <ImpactCertificateModal
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        profile={profile}
        role="receiver"
      />

      {/* Delivery Tracking & Verification Modal */}
      <DeliveryTrackingModal
        isOpen={trackingModalOpen}
        onClose={() => setTrackingModalOpen(false)}
        donation={selectedDonationForTracking}
        onStatusUpdate={(id, newStatus) => {
          fetchData();
          if (selectedDonationForTracking) {
            setSelectedDonationForTracking({ ...selectedDonationForTracking, status: newStatus as any });
          }
        }}
      />

      {/* Thank You Feedback Modal */}
      {feedbackDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">
              Send Thank You & Rate {feedbackDonation.providerName}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Rating (1 to 5 Stars)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onClick={() => setRating(s)}
                      className={`p-2 rounded-xl border ${
                        rating >= s ? 'bg-amber-100 text-amber-500 border-amber-300' : 'text-slate-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Thank You Note *</label>
                <textarea
                  rows={3}
                  value={thankYouMessage}
                  onChange={(e) => setThankYouMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <button
                onClick={handleSubmitFeedback}
                className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl text-xs"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

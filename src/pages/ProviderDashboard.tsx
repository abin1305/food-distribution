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
  FileText,
} from 'lucide-react';
import {
  User as UserType,
  ProviderProfile,
  FoodListing,
  FoodRequest,
  Donation,
  ReceiverProfile,
  ReviewFeedback,
} from '../types';
import { LeafletMap, MapMarker } from '../components/LeafletMap';
import { SafetyWarningModal } from '../components/SafetyWarningModal';
import { SmartMatchingEngine } from '../components/SmartMatchingEngine';
import { ImpactCertificateModal } from '../components/ImpactCertificateModal';
import { DeliveryTrackingModal } from '../components/DeliveryTrackingModal';
import { Award, Sparkles } from 'lucide-react';

interface ProviderDashboardProps {
  user: UserType;
  profile: ProviderProfile | null;
}

export const ProviderDashboard: React.FC<ProviderDashboardProps> = ({ user, profile }) => {
  const [activeTab, setActiveTab] = useState<'add' | 'listings' | 'matching' | 'donations' | 'reviews'>('listings');

  const [listings, setListings] = useState<FoodListing[]>([]);
  const [requests, setRequests] = useState<FoodRequest[]>([]);
  const [receivers, setReceivers] = useState<ReceiverProfile[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [reviews, setReviews] = useState<ReviewFeedback[]>([]);
  const [loading, setLoading] = useState(false);

  // Add Surplus Food Form State
  const [foodName, setFoodName] = useState('');
  const [category, setCategory] = useState('Meals');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('50');
  const [quantityUnit, setQuantityUnit] = useState<'servings' | 'kg' | 'boxes'>('servings');
  const [estimatedServings, setEstimatedServings] = useState('50');
  const [isVegetarian, setIsVegetarian] = useState(true);
  const [bestBeforeTime, setBestBeforeTime] = useState('2026-08-10 02:00');
  const [pickupOrDelivery, setPickupOrDelivery] = useState<'pickup' | 'delivery' | 'both'>('both');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Safety Warning Modal
  const [safetyModalOpen, setSafetyModalOpen] = useState(false);

  // Offer Surplus Food Modal
  const [selectedReceiver, setSelectedReceiver] = useState<ReceiverProfile | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<FoodRequest | null>(null);
  const [offerQty, setOfferQty] = useState('30');
  const [offerDeliveryOption, setOfferDeliveryOption] = useState<'provider_delivery' | 'receiver_pickup'>('provider_delivery');
  const [offerModalOpen, setOfferModalOpen] = useState(false);

  // Advanced Feature Modals
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [selectedDonationForTracking, setSelectedDonationForTracking] = useState<Donation | null>(null);

  const providerId = profile?.id || 'prv_1';

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resList, resReq, resRcv, resDon] = await Promise.all([
        fetch(`/api/food?providerId=${providerId}`),
        fetch(`/api/requests?lat=${profile?.lat || 37.7749}&lng=${profile?.lng || -122.4194}`),
        fetch(`/api/receivers?status=approved&lat=${profile?.lat || 37.7749}&lng=${profile?.lng || -122.4194}`),
        fetch(`/api/donations?providerId=${providerId}`),
      ]);

      if (resList.ok) setListings(await resList.json());
      if (resReq.ok) setRequests(await resReq.json());
      if (resRcv.ok) setReceivers(await resRcv.json());
      if (resDon.ok) setDonations(await resDon.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [providerId]);

  const handleAddFoodSubmit = () => {
    setSafetyModalOpen(true);
  };

  const confirmAddFood = async () => {
    setSafetyModalOpen(false);
    try {
      const res = await fetch('/api/food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId,
          foodName,
          category,
          description,
          quantity: Number(quantity),
          quantityUnit,
          estimatedServings: Number(estimatedServings),
          isVegetarian,
          bestBeforeTime,
          pickupOrDelivery,
          specialInstructions,
          imageUrl: imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
        }),
      });

      if (res.ok) {
        alert('Surplus food successfully listed! Nearby receivers have been notified.');
        setFoodName('');
        setDescription('');
        setActiveTab('listings');
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOfferSubmit = async () => {
    if (!selectedReceiver) return;
    try {
      const res = await fetch('/api/donations/offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId,
          receiverId: selectedReceiver.id,
          requestId: selectedRequest?.id,
          offeredQuantity: Number(offerQty),
          deliveryOption: offerDeliveryOption,
        }),
      });

      if (res.ok) {
        alert(`Offer for ${offerQty} servings sent to ${selectedReceiver.orgName}!`);
        setOfferModalOpen(false);
        setSelectedReceiver(null);
        setSelectedRequest(null);
        fetchData();
        setActiveTab('donations');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateDonationStatus = async (donationId: string, nextStatus: string) => {
    try {
      const res = await fetch(`/api/donations/${donationId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Map markers for nearby receivers
  const mapMarkers: MapMarker[] = receivers.map((r: any) => ({
    id: r.id,
    lat: r.lat,
    lng: r.lng,
    title: r.orgName,
    type: 'receiver',
    subtitle: `${r.peopleServedNormally} people • ${r.distanceKm || 0} km away`,
    details: r.foodRequirements,
    status: r.status,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome & Verification Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold font-['Playfair_Display']">
              Welcome back, {profile?.orgName || user.name}
            </h1>
            <span
              className={`text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1 ${
                profile?.status === 'approved'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              {profile?.status === 'approved' ? 'Verified Provider ✓' : 'Pending Verification'}
            </span>
          </div>
          <p className="text-slate-400 text-xs">
            {profile?.address}, {profile?.city} • {profile?.providerType}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => setCertModalOpen(true)}
            className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-extrabold rounded-2xl text-xs flex items-center gap-2 border border-slate-700 transition"
          >
            <Award className="w-4 h-4 text-emerald-400" /> Eco Impact Certificate
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold rounded-2xl text-xs flex items-center gap-2 transition shadow-md shadow-emerald-500/20"
          >
            <PlusCircle className="w-4 h-4" /> Add Surplus Food
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Total Meals Donated</p>
          <p className="text-2xl font-black text-slate-900 font-mono mt-1">
            {profile?.totalMealsDonated || 3420}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Total Food Saved</p>
          <p className="text-2xl font-black text-emerald-600 font-mono mt-1">
            {profile?.totalFoodSavedKg || 1250} kg
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Active Listings</p>
          <p className="text-2xl font-black text-blue-600 font-mono mt-1">
            {listings.filter((l) => l.status === 'active').length}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Average Rating</p>
          <p className="text-2xl font-black text-amber-500 font-mono mt-1 flex items-center gap-1">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            {profile?.ratingAverage || 4.9}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'listings'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Utensils className="w-4 h-4" /> My Food Listings
        </button>

        <button
          onClick={() => setActiveTab('add')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'add'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <PlusCircle className="w-4 h-4" /> Add Surplus Food
        </button>

        <button
          onClick={() => setActiveTab('matching')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'matching'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MapPin className="w-4 h-4" /> Nearby Receivers & Requests
        </button>

        <button
          onClick={() => setActiveTab('donations')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'donations'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Truck className="w-4 h-4" /> Donations & Delivery Status
        </button>
      </div>

      {/* TAB 1: MY FOOD LISTINGS */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Active Surplus Food Listings</h3>
          {listings.length === 0 ? (
            <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
              <Utensils className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-slate-600 text-xs">No active surplus food listed currently.</p>
              <button
                onClick={() => setActiveTab('add')}
                className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl"
              >
                Post First Surplus Food
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:border-emerald-500/50 transition flex flex-col"
                >
                  <div className="h-40 relative">
                    <img
                      src={item.imageUrl}
                      alt={item.foodName}
                      className="w-full h-full object-cover"
                    />
                    <span
                      className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase text-white shadow-xs ${
                        item.isVegetarian ? 'bg-emerald-600' : 'bg-red-600'
                      }`}
                    >
                      {item.isVegetarian ? '🥬 Vegetarian' : '🍗 Non-Veg'}
                    </span>
                    <span className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-900/80 text-white backdrop-blur-xs">
                      {item.remainingQuantity} {item.quantityUnit} left
                    </span>
                  </div>

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{item.foodName}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Category:</span>
                        <span className="font-semibold text-slate-800">{item.category}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Best Before:</span>
                        <span className="font-semibold text-amber-600">{item.bestBeforeTime}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab('matching')}
                      className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl transition"
                    >
                      Find Receivers for this Food
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ADD SURPLUS FOOD */}
      {activeTab === 'add' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs max-w-3xl space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold text-slate-900">Add Available Surplus Food</h3>
            <p className="text-xs text-slate-500 mt-1">
              Provide food details so nearby verified orphanages and shelters can receive it.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Food Item Name *</label>
              <input
                type="text"
                required
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                placeholder="e.g. Banquet Buffet Meals (Rice, Dal, Veg Curry & Roti)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                >
                  <option value="Meals">Meals / Combo</option>
                  <option value="Rice">Rice / Biryani</option>
                  <option value="Curry">Curry / Gravy</option>
                  <option value="Bread">Roti / Bread</option>
                  <option value="Snacks">Snacks / Appetizers</option>
                  <option value="Fruits">Fresh Fruits</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Bakery">Bakery Items</option>
                  <option value="Packaged Food">Packaged Food</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Quantity *</label>
                <input
                  type="number"
                  required
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(e.target.value);
                    setEstimatedServings(e.target.value);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Unit *</label>
                <select
                  value={quantityUnit}
                  onChange={(e: any) => setQuantityUnit(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                >
                  <option value="servings">Servings / Persons</option>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="boxes">Boxes / Containers</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Food Type *</label>
                <div className="flex gap-4 pt-1">
                  <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                    <input
                      type="radio"
                      checked={isVegetarian}
                      onChange={() => setIsVegetarian(true)}
                      className="text-emerald-600"
                    />
                    🥬 Vegetarian
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                    <input
                      type="radio"
                      checked={!isVegetarian}
                      onChange={() => setIsVegetarian(false)}
                      className="text-emerald-600"
                    />
                    🍗 Non-Vegetarian
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Best Before Time *</label>
                <input
                  type="text"
                  value={bestBeforeTime}
                  onChange={(e) => setBestBeforeTime(e.target.value)}
                  placeholder="e.g. Today 11:00 PM"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Description & Storage Notes</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Untouched surplus food kept in hot thermal containers..."
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <button
              onClick={handleAddFoodSubmit}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-emerald-600/20"
            >
              Verify Food Safety & Post Surplus Listing
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: LOCATION-BASED MATCHING & NEARBY RECEIVERS */}
      {activeTab === 'matching' && (
        <div className="space-y-6">
          {/* Smart AI Matching Engine */}
          <SmartMatchingEngine
            listings={listings}
            requests={requests}
            onInstantOffer={(listing, request) => {
              const rcv = receivers.find((r) => r.id === request.receiverId);
              if (rcv) setSelectedReceiver(rcv);
              setSelectedRequest(request);
              setOfferQty(String(Math.min(listing.remainingQuantity, request.remainingQuantity)));
              setOfferModalOpen(true);
            }}
          />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Nearby Verified Receivers & Requests</h3>
              <p className="text-xs text-slate-500">
                Sorted by distance from your location ({profile?.city})
              </p>
            </div>
          </div>

          {/* Leaflet Map Preview */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-700 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" /> Interactive Map of Nearby Care Facilities
            </h4>
            <LeafletMap
              markers={mapMarkers}
              centerLat={profile?.lat || 37.7749}
              centerLng={profile?.lng || -122.4194}
              height="300px"
            />
          </div>

          {/* Table of Receivers */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold text-xs text-slate-700">
              Nearby Approved Organizations
            </div>
            <div className="divide-y divide-slate-100 overflow-x-auto">
              {receivers.map((rcv: any) => (
                <div key={rcv.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition">
                  <div className="flex items-center gap-3">
                    <img
                      src={rcv.logoUrl || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=100&q=80'}
                      alt={rcv.orgName}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{rcv.orgName}</h4>
                      <p className="text-xs text-slate-500">{rcv.receiverType} • {rcv.peopleServedNormally} People Served Daily</p>
                      <p className="text-[11px] text-emerald-600 font-medium">
                        📍 {rcv.address} ({rcv.distanceKm || 1.2} km away)
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedReceiver(rcv);
                      setOfferModalOpen(true);
                    }}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shrink-0"
                  >
                    Offer Surplus Food
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DONATIONS & WORKFLOW */}
      {activeTab === 'donations' && (
        <div className="space-y-6">
          <h3 className="font-bold text-slate-900 text-lg">Donation Workflow Tracker</h3>
          {donations.length === 0 ? (
            <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
              No donation offers sent yet.
            </div>
          ) : (
            <div className="space-y-4">
              {donations.map((don) => (
                <div key={don.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{don.foodName}</h4>
                      <p className="text-xs text-slate-500">
                        Receiver: <span className="font-bold text-slate-800">{don.receiverName}</span> ({don.offeredQuantity} {don.quantityUnit})
                      </p>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                      Status: {don.status}
                    </span>
                  </div>

                  {/* Status & Tracking buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleUpdateDonationStatus(don.id, 'Preparing')}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                      >
                        Set Preparing
                      </button>
                      <button
                        onClick={() => handleUpdateDonationStatus(don.id, 'Out for Delivery')}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold"
                      >
                        Out for Delivery
                      </button>
                      <button
                        onClick={() => handleUpdateDonationStatus(don.id, 'Completed')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                      >
                        Mark Completed
                      </button>
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
          )}
        </div>
      )}

      {/* Safety Pledge Modal */}
      <SafetyWarningModal
        isOpen={safetyModalOpen}
        onConfirm={confirmAddFood}
        onCancel={() => setSafetyModalOpen(false)}
      />

      {/* Eco Sustainability Certificate Modal */}
      <ImpactCertificateModal
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        profile={profile}
        role="provider"
      />

      {/* Delivery Tracking & Verification Modal */}
      <DeliveryTrackingModal
        isOpen={trackingModalOpen}
        onClose={() => setTrackingModalOpen(false)}
        donation={selectedDonationForTracking}
        onStatusUpdate={(id, newStatus) => {
          handleUpdateDonationStatus(id, newStatus);
          if (selectedDonationForTracking) {
            setSelectedDonationForTracking({ ...selectedDonationForTracking, status: newStatus as any });
          }
        }}
      />

      {/* Offer Modal */}
      {offerModalOpen && selectedReceiver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                Offer Surplus Food to {selectedReceiver.orgName}
              </h3>
              <button onClick={() => setOfferModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Offered Quantity (Servings)
                </label>
                <input
                  type="number"
                  value={offerQty}
                  onChange={(e) => setOfferQty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Delivery Preference
                </label>
                <select
                  value={offerDeliveryOption}
                  onChange={(e: any) => setOfferDeliveryOption(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                >
                  <option value="provider_delivery">Provider Delivers to Care Center</option>
                  <option value="receiver_pickup">Receiver Collects from Donor Address</option>
                </select>
              </div>

              <button
                onClick={handleOfferSubmit}
                className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl text-xs"
              >
                Send Donation Offer Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

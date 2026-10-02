import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, MapPin, Building, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { User as UserType, ProviderType, ReceiverType } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  mode?: 'login' | 'register';
  onClose: () => void;
  onSuccess?: (user: UserType, profile: any, token: string) => void;
  onLoginSuccess?: (user: UserType, profile: any, token: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  mode: propMode,
  onClose,
  onSuccess,
  onLoginSuccess,
}) => {
  const effectiveInitialMode = propMode || initialMode;
  const effectiveOnSuccess = onSuccess || onLoginSuccess;

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(effectiveInitialMode);
  const [role, setRole] = useState<'provider' | 'receiver'>('provider');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      setMode(propMode || initialMode || 'login');
      setError('');
      setSuccessMsg('');
    }
  }, [isOpen, initialMode, propMode]);

  // Common Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [orgName, setOrgName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Metro City');
  const [district, setDistrict] = useState('Central');
  const [state, setState] = useState('CA');
  const [pincode, setPincode] = useState('90001');

  // Role specific state
  const [providerType, setProviderType] = useState<ProviderType>('Hotel');
  const [foodHandlingLicense, setFoodHandlingLicense] = useState('');
  const [availableFoodTypesStr, setAvailableFoodTypesStr] = useState('Buffet Meals, Cooked Rice, Curries');

  const [receiverType, setReceiverType] = useState<ReceiverType>('Orphanage');
  const [peopleServedNormally, setPeopleServedNormally] = useState('65');
  const [operatingHours, setOperatingHours] = useState('7:00 AM - 9:00 PM');
  const [foodRequirements, setFoodRequirements] = useState('Balanced vegetarian/non-veg dinner meals');
  const [description, setDescription] = useState('Registered charity home providing care and nutrition.');

  if (!isOpen) return null;

  // Demo direct login helpers
  const handleQuickDemoLogin = async (demoEmail: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail, password: 'demo' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      if (effectiveOnSuccess) {
        effectiveOnSuccess(data.user, data.profile, data.token);
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (mode === 'login') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Invalid credentials');
        if (effectiveOnSuccess) {
          effectiveOnSuccess(data.user, data.profile, data.token);
        }
        onClose();
      } else if (mode === 'register') {
        const availableFoodTypes = availableFoodTypesStr
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);

        const payload = {
          email,
          password,
          name,
          phone,
          role,
          orgName,
          address,
          city,
          district,
          state,
          pincode,
          lat: role === 'provider' ? 37.7749 : 37.7811,
          lng: role === 'provider' ? -122.4194 : -122.4285,
          providerType,
          foodHandlingLicense,
          availableFoodTypes,
          receiverType,
          peopleServedNormally,
          operatingHours,
          foodRequirements,
          description,
        };

        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed');

        setSuccessMsg(data.message || 'Registration completed!');
        setTimeout(() => {
          if (effectiveOnSuccess) {
            effectiveOnSuccess(data.user, data.profile, data.token);
          }
          onClose();
        }, 1500);
      } else if (mode === 'forgot') {
        const res = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        setSuccessMsg(data.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full my-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-['Playfair_Display']">
              {mode === 'login'
                ? 'Sign In to NourishBridge'
                : mode === 'register'
                ? 'Join NourishBridge Platform'
                : 'Reset Your Password'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {mode === 'login'
                ? 'Access your provider, receiver, or admin portal'
                : mode === 'register'
                ? 'Register your organization to donate or receive surplus food'
                : 'Enter your account email to receive a password reset link'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs text-emerald-800 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* MODE: LOGIN */}
          {mode === 'login' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@organization.org"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-xs text-emerald-600 hover:underline font-semibold"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-emerald-600/20"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>

              {/* Demo Schnell-Login Buttons */}
              <div className="pt-4 border-t border-slate-100">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
                  Quick Demo Access
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('grandpalace@hotel.com')}
                    className="px-2 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold"
                  >
                    🏨 Provider Demo
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('hope@childrenshome.org')}
                    className="px-2 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-xl text-xs font-semibold"
                  >
                    🏠 Receiver Demo
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('admin@nourishbridge.org')}
                    className="px-2 py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-xl text-xs font-semibold"
                  >
                    🛡️ Admin Demo
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* MODE: REGISTER */}
          {mode === 'register' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection Tabs */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  I want to register as a:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('provider')}
                    className={`py-3 px-4 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
                      role === 'provider'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-800 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building className="w-5 h-5 text-emerald-600" />
                    <span>Food Provider</span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      (Hotel, Restaurant, Catering, Hostel, Event)
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('receiver')}
                    className={`py-3 px-4 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
                      role === 'receiver'
                        ? 'bg-blue-50 border-blue-600 text-blue-800 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                    <span>Food Receiver</span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      (Orphanage, NGO, Shelter, Elder Care)
                    </span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Marcus Vance"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder={
                      role === 'provider'
                        ? 'e.g. Grand Palace Hotel'
                        : 'e.g. Hope Children Home'
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@org.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555 123 4567"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {role === 'provider' ? 'Provider Type *' : 'Organization Type *'}
                  </label>
                  {role === 'provider' ? (
                    <select
                      value={providerType}
                      onChange={(e) => setProviderType(e.target.value as ProviderType)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                    >
                      <option value="Hotel">Hotel</option>
                      <option value="Restaurant">Restaurant</option>
                      <option value="Function Hall">Function / Marriage Hall</option>
                      <option value="Hostel">Hostel / Canteen</option>
                      <option value="Catering Service">Catering Service</option>
                      <option value="Bakery">Bakery</option>
                      <option value="Event Organizer">Event Organizer</option>
                      <option value="Individual">Individual Donor</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <select
                      value={receiverType}
                      onChange={(e) => setReceiverType(e.target.value as ReceiverType)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                    >
                      <option value="Orphanage">Orphanage / Children Home</option>
                      <option value="NGO">NGO / Non-Profit</option>
                      <option value="Shelter">Homeless Shelter</option>
                      <option value="Community Center">Community Center</option>
                      <option value="Old Age Home">Elder Care / Old Age Home</option>
                      <option value="Charity Organization">Charity Organization</option>
                      <option value="Relief Camp">Relief Camp</option>
                      <option value="Food Distribution Group">Food Distribution Group</option>
                      <option value="Other">Other</option>
                    </select>
                  )}
                </div>
              </div>

              {/* Address details */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900">Address & Location Details</h4>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street Address / Premises"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="District"
                    className="px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="State"
                    className="px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="Pincode"
                    className="px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              {/* Specific fields */}
              {role === 'provider' ? (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Food Safety License / Registration # (Optional)
                    </label>
                    <input
                      type="text"
                      value={foodHandlingLicense}
                      onChange={(e) => setFoodHandlingLicense(e.target.value)}
                      placeholder="e.g. FSSAI / Food License # 12345678"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Available Surplus Food Types
                    </label>
                    <input
                      type="text"
                      value={availableFoodTypesStr}
                      onChange={(e) => setAvailableFoodTypesStr(e.target.value)}
                      placeholder="e.g. Cooked Rice, Buffet Meals, Breads, Fruits"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        People Served Daily
                      </label>
                      <input
                        type="number"
                        value={peopleServedNormally}
                        onChange={(e) => setPeopleServedNormally(e.target.value)}
                        placeholder="e.g. 60"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Operating Hours
                      </label>
                      <input
                        type="text"
                        value={operatingHours}
                        onChange={(e) => setOperatingHours(e.target.value)}
                        placeholder="e.g. 24/7 or 8 AM - 9 PM"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Food Requirements Summary
                    </label>
                    <input
                      type="text"
                      value={foodRequirements}
                      onChange={(e) => setFoodRequirements(e.target.value)}
                      placeholder="e.g. Rice, Dal, Vegetables, Breads, Milk"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-emerald-600/20"
                >
                  {loading ? 'Submitting Registration...' : 'Complete Registration (Pending Verification)'}
                </button>
              </div>
            </form>
          )}

          {/* MODE: FORGOT PASSWORD */}
          {mode === 'forgot' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Registered Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.org"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl text-xs"
              >
                Send Password Reset Link
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs text-slate-600 hover:underline"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer Switcher */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-600 shrink-0">
          {mode === 'login' ? (
            <p>
              Don't have an account yet?{' '}
              <button
                onClick={() => setMode('register')}
                className="text-emerald-600 font-bold hover:underline ml-1"
              >
                Register as Provider / Receiver
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-emerald-600 font-bold hover:underline ml-1"
              >
                Sign In to Your Account
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Building,
  HeartHandshake,
  Utensils,
  Search,
  Trash2,
  Lock,
  Unlock,
  FileText,
  Activity,
  BarChart2,
  Mail,
  Send,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { User, ProviderProfile, ReceiverProfile, FoodListing, FoodRequest, ActivityLog } from '../types';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'providers' | 'receivers' | 'listings' | 'users' | 'messages' | 'logs'>('overview');

  const [overview, setOverview] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [providers, setProviders] = useState<ProviderProfile[]>([]);
  const [receivers, setReceivers] = useState<ReceiverProfile[]>([]);
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [requests, setRequests] = useState<FoodRequest[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [search, setSearch] = useState('');

  // Rejection Modal State
  const [rejectingUserId, setRejectingUserId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Verification documents could not be validated.');

  const fetchData = async () => {
    try {
      const [resO, resU, resP, resR, resF, resReq, resM, resL] = await Promise.all([
        fetch('/api/admin/overview'),
        fetch('/api/admin/users'),
        fetch('/api/providers'),
        fetch('/api/receivers'),
        fetch('/api/food'),
        fetch('/api/requests'),
        fetch('/api/contact'),
        fetch('/api/admin/logs'),
      ]);

      if (resO.ok) setOverview(await resO.json());
      if (resU.ok) setUsers(await resU.json());
      if (resP.ok) setProviders(await resP.json());
      if (resR.ok) setReceivers(await resR.json());
      if (resF.ok) setListings(await resF.json());
      if (resReq.ok) setRequests(await resReq.json());
      if (resM.ok) setMessages(await resM.json());
      if (resL.ok) setLogs(await resL.json());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateUserStatus = async (userId: string, status: string, reason?: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, rejectionReason: reason }),
      });
      if (res.ok) {
        alert(`User status updated to ${status}.`);
        setRejectingUserId(null);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const chartData = [
    { month: 'May', meals: 1800 },
    { month: 'Jun', meals: 2400 },
    { month: 'Jul', meals: 3900 },
    { month: 'Aug', meals: overview?.mealsServed || 5570 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex items-center justify-between border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-['Playfair_Display']">Admin Platform Portal</h1>
            <p className="text-xs text-slate-400">
              Manage providers, receivers, food verification, safety reports, and platform analytics
            </p>
          </div>
        </div>

        {overview?.pendingApprovals > 0 && (
          <span className="px-3 py-1.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs rounded-xl animate-pulse">
            ⚠️ {overview.pendingApprovals} Pending Verification Approvals
          </span>
        )}
      </div>

      {/* Admin Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 text-center space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Total Users</p>
          <p className="text-xl font-bold text-slate-900 font-mono">{overview?.totalUsers || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 text-center space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Pending Approvals</p>
          <p className="text-xl font-bold text-amber-600 font-mono">{overview?.pendingApprovals || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 text-center space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Active Donors</p>
          <p className="text-xl font-bold text-emerald-600 font-mono">{overview?.activeProviders || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 text-center space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Verified Shelters</p>
          <p className="text-xl font-bold text-blue-600 font-mono">{overview?.verifiedReceivers || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 text-center space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Meals Served</p>
          <p className="text-xl font-bold text-purple-600 font-mono">{overview?.mealsServed || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 text-center space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Food Saved</p>
          <p className="text-xl font-bold text-teal-600 font-mono">{overview?.foodSavedKg || 0} kg</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'overview' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart2 className="w-4 h-4 inline mr-1" /> Analytics & Overview
        </button>
        <button
          onClick={() => setActiveTab('providers')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'providers' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building className="w-4 h-4 inline mr-1" /> Food Providers ({providers.length})
        </button>
        <button
          onClick={() => setActiveTab('receivers')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'receivers' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <HeartHandshake className="w-4 h-4 inline mr-1" /> Food Receivers ({receivers.length})
        </button>
        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'listings' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Utensils className="w-4 h-4 inline mr-1" /> Food & Requests
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'messages' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Mail className="w-4 h-4 inline mr-1" /> Contact Submissions ({messages.length})
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'logs' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-4 h-4 inline mr-1" /> Activity Audit Logs
        </button>
      </div>

      {/* TAB: OVERVIEW & ANALYTICS */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Monthly Meal Rescue Chart</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Area type="monotone" dataKey="meals" stroke="#8b5cf6" fill="#c4b5fd" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Pending Verification Requests</h3>
            <div className="space-y-3">
              {users.filter((u) => u.status === 'pending').length === 0 ? (
                <p className="text-xs text-slate-500">No pending accounts waiting for verification.</p>
              ) : (
                users
                  .filter((u) => u.status === 'pending')
                  .map((u) => (
                    <div key={u.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                      <div className="flex justify-between">
                        <span className="font-bold">{u.name}</span>
                        <span className="uppercase text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                          {u.role}
                        </span>
                      </div>
                      <p className="text-slate-500">{u.email}</p>
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleUpdateUserStatus(u.id, 'approved')}
                          className="px-3 py-1 bg-emerald-600 text-white rounded font-bold text-[10px]"
                        >
                          Approve ✓
                        </button>
                        <button
                          onClick={() => setRejectingUserId(u.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded font-bold text-[10px]"
                        >
                          Reject ✕
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB: PROVIDERS */}
      {activeTab === 'providers' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold text-xs text-slate-700">
            Registered Food Providers ({providers.length})
          </div>
          <div className="divide-y divide-slate-100 overflow-x-auto">
            {providers.map((p) => (
              <div key={p.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                <div>
                  <p className="font-bold text-slate-900 text-sm">{p.orgName}</p>
                  <p className="text-slate-500">{p.providerType} • {p.email} • {p.phone}</p>
                  <p className="text-emerald-600 font-medium">📍 {p.address}, {p.city}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      p.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {p.status}
                  </span>
                  {p.status === 'pending' && (
                    <button
                      onClick={() => handleUpdateUserStatus(p.userId, 'approved')}
                      className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg"
                    >
                      Approve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: RECEIVERS */}
      {activeTab === 'receivers' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold text-xs text-slate-700">
            Registered Food Receivers ({receivers.length})
          </div>
          <div className="divide-y divide-slate-100 overflow-x-auto">
            {receivers.map((r) => (
              <div key={r.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                <div>
                  <p className="font-bold text-slate-900 text-sm">{r.orgName}</p>
                  <p className="text-slate-500">{r.receiverType} • Contact: {r.contactPerson} • {r.phone}</p>
                  <p className="text-blue-600 font-medium">📍 {r.address}, {r.city} (Serves {r.peopleServedNormally} people)</p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      r.status === 'approved'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {r.status}
                  </span>
                  {r.status === 'pending' && (
                    <button
                      onClick={() => handleUpdateUserStatus(r.userId, 'approved')}
                      className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg"
                    >
                      Approve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: CONTACT SUBMISSIONS */}
      {activeTab === 'messages' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold text-xs text-slate-700">
            Contact & Support Messages
          </div>
          <div className="divide-y divide-slate-100">
            {messages.map((m) => (
              <div key={m.id} className="p-4 text-xs space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{m.name} ({m.email})</span>
                  <span className="text-slate-400">{m.createdAt}</span>
                </div>
                <p className="font-semibold text-emerald-700">{m.subject}</p>
                <p className="text-slate-600">{m.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectingUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Reject Account Registration</h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Rejection *</label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setRejectingUserId(null)}
                className="px-4 py-2 rounded-xl border text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateUserStatus(rejectingUserId, 'rejected', rejectionReason)}
                className="px-4 py-2 bg-red-600 text-white font-bold rounded-xl text-xs"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

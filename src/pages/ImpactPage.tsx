import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { GlobalImpactStats } from '../types';
import { TrendingUp, Utensils, HeartHandshake, ShieldCheck, MapPin } from 'lucide-react';

export const ImpactPage: React.FC = () => {
  const [stats, setStats] = useState<GlobalImpactStats>({
    mealsServed: 5570,
    foodSavedKg: 1950,
    activeProviders: 18,
    verifiedReceivers: 24,
    successfulDonations: 128,
    citiesCovered: 8,
  });

  useEffect(() => {
    fetch('/api/impact')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.mealsServed) setStats(data);
      })
      .catch((e) => console.error(e));
  }, []);

  const timeSeriesData = [
    { month: 'Jan', meals: 650, foodKg: 230 },
    { month: 'Feb', meals: 820, foodKg: 290 },
    { month: 'Mar', meals: 1100, foodKg: 385 },
    { month: 'Apr', meals: 1350, foodKg: 470 },
    { month: 'May', meals: 1800, foodKg: 630 },
    { month: 'Jun', meals: 2400, foodKg: 840 },
    { month: 'Jul', meals: 3900, foodKg: 1360 },
    { month: 'Aug', meals: stats.mealsServed, foodKg: stats.foodSavedKg },
  ];

  const categoryData = [
    { name: 'Buffet Meals', value: 42 },
    { name: 'Rice & Biryani', value: 28 },
    { name: 'Curries & Dal', value: 15 },
    { name: 'Bakery & Bread', value: 10 },
    { name: 'Fruits & Veggies', value: 5 },
  ];

  const COLORS = ['#059669', '#0d9488', '#2563eb', '#d97706', '#8b5cf6'];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Live Impact & Analytics
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-['Playfair_Display']">
          Measuring Every Meal Saved
        </h1>
        <p className="text-slate-600 text-sm max-w-xl mx-auto">
          Transparent real-time analytics tracking total meals distributed, food saved from landfills, and community coverage.
        </p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs text-center space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase">Meals Distributed</p>
          <p className="text-3xl font-extrabold text-emerald-600 font-mono">
            {stats.mealsServed.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs text-center space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase">Landfill Waste Saved</p>
          <p className="text-3xl font-extrabold text-teal-600 font-mono">
            {stats.foodSavedKg.toLocaleString()} kg
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs text-center space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase">Registered Donors</p>
          <p className="text-3xl font-extrabold text-blue-600 font-mono">
            {stats.activeProviders}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs text-center space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase">Verified Shelters</p>
          <p className="text-3xl font-extrabold text-purple-600 font-mono">
            {stats.verifiedReceivers}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Monthly Growth Area Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Monthly Meal Rescue Trajectory</h3>
              <p className="text-xs text-slate-500">Cumulative meals saved over time</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              +48% MoM
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData}>
                <defs>
                  <linearGradient id="colorMeals" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="meals"
                  stroke="#059669"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorMeals)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Pie Chart */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Food Category Share (%)</h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 text-xs">
            {categoryData.map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                  {cat.name}
                </span>
                <span className="font-bold">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

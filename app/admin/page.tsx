'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Mouse, FileText } from 'lucide-react';

export default function AdminDashboard() {
  // Mock data - replace with real analytics later
  const visitData = [
    { name: 'Mon', visits: 120, events: 4 },
    { name: 'Tue', visits: 150, events: 3 },
    { name: 'Wed', visits: 180, events: 5 },
    { name: 'Thu', visits: 220, events: 6 },
    { name: 'Fri', visits: 280, events: 8 },
    { name: 'Sat', visits: 250, events: 7 },
    { name: 'Sun', visits: 320, events: 10 },
  ];

  const pageClicksData = [
    { name: 'Home', value: 350, color: '#ef4444' },
    { name: 'Events', value: 280, color: '#3b82f6' },
    { name: 'Videos', value: 210, color: '#10b981' },
    { name: 'About', value: 140, color: '#f59e0b' },
    { name: 'Other', value: 95, color: '#8b5cf6' },
  ];

  const stats = [
    {
      label: 'Total Visits',
      value: '1,540',
      icon: Users,
      change: '+12%',
      color: 'bg-blue-600/20 border-blue-500/30',
    },
    {
      label: 'Page Clicks',
      value: '1,075',
      icon: Mouse,
      change: '+8%',
      color: 'bg-green-600/20 border-green-500/30',
    },
    {
      label: 'Events Posted',
      value: '43',
      icon: FileText,
      change: '+5',
      color: 'bg-red-600/20 border-red-500/30',
    },
    {
      label: 'Avg. Session',
      value: '4m 32s',
      icon: TrendingUp,
      change: '+1m 20s',
      color: 'bg-purple-600/20 border-purple-500/30',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Welcome back! Here's your website statistics for this week.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`${stat.color} border border-white/10 rounded-[1.5rem] p-6 shadow-lg`}>
              <div className="flex items-center justify-between mb-4">
                <Icon size={24} className="text-white/60" />
                <span className="text-xs font-semibold text-emerald-400">{stat.change}</span>
              </div>
              <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visits & Events Chart */}
        <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-6 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-6">Visits & Events This Week</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={visitData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #ffffff20',
                  borderRadius: '0.75rem',
                  color: '#fff'
                }}
              />
              <Legend />
              <Bar dataKey="visits" fill="#ef4444" radius={[8, 8, 0, 0]} />
              <Bar dataKey="events" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Page Clicks Distribution */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-6 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-6">Page Clicks</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pageClicksData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pageClicksData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #ffffff20',
                  borderRadius: '0.75rem',
                  color: '#fff'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-6 shadow-lg">
        <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { action: 'New event posted', details: 'Sunday Worship Service', time: '2 hours ago' },
            { action: 'User visited', details: 'From Events page', time: '1 hour ago' },
            { action: 'New event posted', details: 'Midweek Prayer Gathering', time: '4 hours ago' },
            { action: 'User clicked', details: 'Facebook posts section', time: '30 mins ago' },
            { action: 'User visited', details: 'From Home page', time: '15 mins ago' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-white/5 hover:border-white/10 transition">
              <div>
                <p className="text-white font-medium">{activity.action}</p>
                <p className="text-sm text-slate-400">{activity.details}</p>
              </div>
              <span className="text-xs text-slate-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="bg-amber-900/20 border border-amber-500/30 rounded-[1.5rem] p-6">
        <p className="text-amber-200 text-sm">
          <strong>Note:</strong> Analytics are currently showing mock data. To enable real-time tracking, we can integrate Google Analytics or a similar service. Let me know if you'd like to set that up!
        </p>
      </div>
    </div>
  );
}

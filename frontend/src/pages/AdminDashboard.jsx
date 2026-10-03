import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/api';
import StatCard from '../components/StatCard';
import { 
  Users, 
  UserCheck, 
  AlertTriangle, 
  DollarSign, 
  TrendingUp, 
  Award, 
  ArrowRight,
  ShieldCheck,
  UserX
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await adminAPI.getDashboardStats();
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      setError('Failed to load admin dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gym-muted">Loading Admin Analytics...</div>;
  }

  const {
    totalUsers,
    totalActiveMembers,
    totalExpiredMembers,
    expiringSoonCount,
    expiringSoonMemberships,
    newSignupsThisMonth,
    totalRevenue,
    monthlyRevenue,
    monthlyTrend
  } = stats || {};

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
      
      {/* Header */}
      <div className="border-b border-gym-border pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-gym-orange text-[10px] sm:text-xs font-bold uppercase tracking-widest">Gym Control Center</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">ADMIN DASHBOARD</h1>
        </div>
        <div className="flex flex-wrap gap-2.5 sm:gap-3 w-full sm:w-auto">
          <Link
            to="/admin/members"
            className="flex-1 sm:flex-none text-center px-4 py-2.5 bg-gym-orange hover:bg-gym-orangeHover text-white text-xs font-bold rounded-xl transition-all shadow-md min-h-[44px] flex items-center justify-center"
          >
            Manage Members
          </Link>
          <Link
            to="/admin/plans"
            className="flex-1 sm:flex-none text-center px-4 py-2.5 bg-gym-card hover:bg-gym-cardHover border border-gym-border text-slate-200 text-xs font-bold rounded-xl transition-all min-h-[44px] flex items-center justify-center"
          >
            Manage Plans
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-300 text-xs p-3.5 rounded-xl">
          {error}
        </div>
      )}

      {/* METRIC STAT CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Registered Users"
          value={totalUsers ?? 0}
          subtext={`${newSignupsThisMonth ?? 0} new signups this month`}
          icon={Users}
          color="blue"
        />

        <StatCard
          title="Total Active Members"
          value={totalActiveMembers ?? 0}
          subtext="Valid membership plans"
          icon={UserCheck}
          color="green"
        />

        <StatCard
          title="Expired Memberships"
          value={totalExpiredMembers ?? 0}
          subtext="Requires renewal callout"
          icon={UserX}
          color="red"
        />

        <StatCard
          title="Total Revenue"
          value={`₹${parseFloat(totalRevenue || 0).toFixed(2)}`}
          subtext={`₹${parseFloat(monthlyRevenue || 0).toFixed(2)} this month`}
          icon={DollarSign}
          color="orange"
        />
      </div>

      {/* REVENUE TREND GRAPH & EXPIRING SOON MEMBERS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Monthly Revenue Trend Chart (2 cols) */}
        <div className="lg:col-span-2 bg-gym-card border border-gym-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-4 min-w-0 overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-gym-orange shrink-0" />
              <span>Monthly Revenue Trend (₹)</span>
            </h3>
            <span className="text-xs text-gym-muted">Last 6 Months</span>
          </div>

          <div className="h-56 sm:h-64 w-full pt-2 sm:pt-4 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2E2E48" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={10} interval={0} />
                <YAxis stroke="#94A3B8" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#161626', borderColor: '#FF4500', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#FF4500' }}
                />
                <Bar dataKey="revenue" fill="#FF4500" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Members Expiring in 7 Days (1 col) */}
        <div className="bg-gym-card border border-gym-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gym-border/60 pb-3 mb-4">
              <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Expiring in 7 Days ({expiringSoonCount ?? 0})</span>
              </h3>
              <Link to="/admin/members?status=expiring_soon" className="text-xs text-gym-orange hover:underline font-semibold whitespace-nowrap">
                View All
              </Link>
            </div>

            {expiringSoonMemberships && expiringSoonMemberships.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {expiringSoonMemberships.map((m) => (
                  <div key={m.id} className="p-3 bg-gym-dark/60 rounded-xl border border-gym-border/50 flex items-center justify-between text-xs gap-2">
                    <div className="min-w-0">
                      <h4 className="font-bold text-white truncate">{m.User?.name}</h4>
                      <p className="text-[11px] text-gym-muted truncate">{m.Plan?.name}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-amber-400 font-bold block text-[11px]">{m.end_date}</span>
                      <span className="text-[10px] text-gym-muted">Expires Soon</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gym-muted py-8 text-center">No member plans expiring in the next 7 days.</p>
            )}
          </div>

          <Link
            to="/admin/members"
            className="w-full py-3 bg-gym-dark hover:bg-gym-cardHover text-slate-200 border border-gym-border rounded-xl text-xs font-bold text-center transition-colors block min-h-[44px] flex items-center justify-center"
          >
            Manage All Members
          </Link>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;

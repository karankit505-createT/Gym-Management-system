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
  UserX,
  MessageSquare
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
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-orange-600 text-xs sm:text-sm font-bold uppercase tracking-wider">Gym Control Center</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 uppercase tracking-tight mt-1">ADMIN DASHBOARD</h1>
        </div>
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <Link
            to="/admin/members"
            className="flex-1 sm:flex-none text-center px-5 h-11 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-md transition-colors shadow-xs flex items-center justify-center"
          >
            Manage Members
          </Link>
          <Link
            to="/admin/plans"
            className="flex-1 sm:flex-none text-center px-5 h-11 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-sm font-semibold rounded-md transition-colors flex items-center justify-center"
          >
            Manage Plans
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-md font-medium">
          {error}
        </div>
      )}

      {/* METRIC STAT CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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

      {/* INQUIRIES & LEADS SUMMARY CARDS */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold font-heading text-slate-900 flex items-center space-x-2.5 uppercase">
              <MessageSquare className="w-6 h-6 text-orange-600" />
              <span>Inquiry & Lead Conversion Summary</span>
            </h3>
            <p className="text-sm text-slate-500 mt-1">Real-time status of landing page contact submissions</p>
          </div>
          <Link
            to="/admin/inquiries"
            className="px-4 h-11 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-md transition-colors shadow-xs flex items-center space-x-2"
          >
            <span>Manage All Inquiries</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-1">
          <div className="p-5 bg-slate-50 rounded-md border border-orange-200">
            <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">New Inquiries</span>
            <p className="text-3xl font-black font-sans text-slate-900 mt-1">{stats?.newInquiriesCount ?? 0}</p>
            <p className="text-xs text-slate-500 mt-1">Awaiting initial follow-up</p>
          </div>

          <div className="p-5 bg-slate-50 rounded-md border border-slate-200">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">This Month Total</span>
            <p className="text-3xl font-black font-sans text-slate-900 mt-1">{stats?.totalInquiriesThisMonth ?? 0}</p>
            <p className="text-xs text-slate-500 mt-1">Total received this month</p>
          </div>

          <div className="p-5 bg-slate-50 rounded-md border border-emerald-200">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Conversion Rate</span>
            <p className="text-3xl font-black font-sans text-emerald-700 mt-1">{stats?.inquiryConversionRate ?? 0}%</p>
            <p className="text-xs text-slate-500 mt-1">Joined vs Total Inquiries</p>
          </div>

          <div className="p-5 bg-slate-50 rounded-md border border-amber-200">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Pending (3+ Days)</span>
            <p className="text-3xl font-black font-sans text-amber-700 mt-1">{stats?.pendingFollowUpCount ?? 0}</p>
            <p className="text-xs text-amber-800 mt-1">Overdue for follow-up</p>
          </div>
        </div>
      </div>

      {/* REVENUE TREND GRAPH & EXPIRING SOON MEMBERS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Monthly Revenue Trend Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-6 sm:p-8 space-y-4 shadow-xs min-w-0 overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <h3 className="text-lg font-bold font-heading text-slate-900 flex items-center space-x-2.5 uppercase">
              <TrendingUp className="w-6 h-6 text-orange-600 shrink-0" />
              <span>Monthly Revenue Trend (₹)</span>
            </h3>
            <span className="text-xs sm:text-sm text-slate-500 font-medium">Last 6 Months</span>
          </div>

          <div className="h-64 sm:h-72 w-full pt-3 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrend || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" fontSize={11} interval={0} />
                <YAxis stroke="#6B7280" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', borderRadius: '6px', fontSize: '13px', color: '#1F2937' }}
                  itemStyle={{ color: '#EA580C' }}
                />
                <Bar dataKey="revenue" fill="#EA580C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Members Expiring in 7 Days (1 col) */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 space-y-4 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base sm:text-lg font-bold font-heading text-slate-900 flex items-center space-x-2 uppercase">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <span>Expiring in 7 Days ({expiringSoonCount ?? 0})</span>
              </h3>
              <Link to="/admin/members?status=expiring_soon" className="text-xs sm:text-sm text-orange-600 hover:underline font-bold whitespace-nowrap">
                View All
              </Link>
            </div>

            {expiringSoonMemberships && expiringSoonMemberships.length > 0 ? (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {expiringSoonMemberships.map((m) => (
                  <div key={m.id} className="p-3.5 bg-slate-50 rounded-md border border-slate-200 flex items-center justify-between text-sm gap-2">
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 truncate">{m.User?.name}</h4>
                      <p className="text-xs text-slate-500 truncate">{m.Plan?.name}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-amber-700 font-bold block text-xs">{m.end_date}</span>
                      <span className="text-[11px] text-slate-500">Expires Soon</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 py-10 text-center">No member plans expiring in the next 7 days.</p>
            )}
          </div>

          <Link
            to="/admin/members"
            className="w-full h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-md text-sm font-semibold text-center transition-colors flex items-center justify-center mt-4"
          >
            Manage All Members
          </Link>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;

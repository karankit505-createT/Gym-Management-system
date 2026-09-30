import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { membershipAPI } from '../services/api';
import { 
  Award, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Calendar, 
  CreditCard, 
  User, 
  Bell, 
  ArrowRight,
  Flame,
  ShieldAlert
} from 'lucide-react';

const MemberDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await membershipAPI.getStatus();
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load membership status:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gym-muted">Loading your membership dashboard...</div>;
  }

  const { status, membership, daysRemaining, expiringSoon, announcements } = data || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner Greeting */}
      <div className="bg-gym-card border border-gym-border/80 rounded-3xl p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center space-x-2 bg-gym-orange/15 px-3 py-1 rounded-full text-gym-orange text-xs font-semibold">
            <Flame className="w-4 h-4" />
            <span>Member Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Welcome Back, {user?.name}!</h1>
          <p className="text-xs sm:text-sm text-gym-muted">
            Track your active plan, membership validity, announcements, and payment receipts.
          </p>
        </div>

        {/* Action Button */}
        <div>
          {status === 'active' ? (
            <Link
              to="/member/choose-plan"
              className="px-6 py-3 bg-gym-orange/20 border border-gym-orange text-gym-orange hover:bg-gym-orange hover:text-white font-bold text-xs rounded-xl transition-all inline-flex items-center space-x-2"
            >
              <Award className="w-4 h-4" />
              <span>Renew / Upgrade Plan</span>
            </Link>
          ) : (
            <Link
              to="/member/choose-plan"
              className="px-6 py-3.5 bg-gym-orange hover:bg-gym-orangeHover text-white font-bold text-xs rounded-xl shadow-lg shadow-gym-orange/30 transition-all inline-flex items-center space-x-2"
            >
              <span>Get Gym Membership</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {/* 7-DAY EXPIRY ALERT BANNER */}
      {expiringSoon && (
        <div className="bg-amber-500/15 border-2 border-amber-500/60 p-4 rounded-2xl flex items-center justify-between space-x-4 animate-pulse">
          <div className="flex items-center space-x-3 text-amber-300">
            <AlertTriangle className="w-6 h-6 shrink-0 text-amber-400" />
            <div>
              <h4 className="font-bold text-sm">Membership Expiring Soon!</h4>
              <p className="text-xs">Your plan expires in <b>{daysRemaining} day(s)</b>. Renew now to avoid interruption of gym access.</p>
            </div>
          </div>
          <Link
            to="/member/choose-plan"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs rounded-xl shrink-0 transition-colors"
          >
            Renew Now
          </Link>
        </div>
      )}

      {/* MAIN STATUS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Status Card */}
        <div className="bg-gym-card border border-gym-border/80 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase text-gym-muted tracking-wider">Current Status</span>
            {status === 'active' ? (
              <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>ACTIVE MEMBER</span>
              </span>
            ) : status === 'expired' ? (
              <span className="bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>EXPIRED</span>
              </span>
            ) : (
              <span className="bg-gym-muted/20 border border-gym-muted/40 text-gym-muted text-xs font-bold px-3 py-1 rounded-full">
                NOT A MEMBER YET
              </span>
            )}
          </div>

          <div className="my-2">
            <h3 className="text-2xl font-black text-white">
              {membership ? membership.Plan?.name : 'No Active Membership'}
            </h3>
            <p className="text-xs text-gym-muted mt-1">
              {membership ? `₹${parseFloat(membership.Plan?.price).toFixed(2)} / ${membership.Plan?.duration_days} Days` : 'Choose a plan to get full gym access'}
            </p>
          </div>

          <div className="pt-4 border-t border-gym-border/40 text-xs text-slate-400 flex items-center justify-between">
            <span>Access Type: <b>All Equipment & Locker</b></span>
          </div>
        </div>

        {/* Validity Period Card */}
        <div className="bg-gym-card border border-gym-border/80 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase text-gym-muted tracking-wider">Validity Period</span>
            <Calendar className="w-5 h-5 text-gym-orange" />
          </div>

          <div className="space-y-2 my-2">
            <div className="flex justify-between text-xs">
              <span className="text-gym-muted">Start Date:</span>
              <span className="font-semibold text-white">{membership ? membership.start_date : 'N/A'}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gym-muted">Expiry Date:</span>
              <span className="font-semibold text-white">{membership ? membership.end_date : 'N/A'}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-gym-border/40 text-xs text-slate-400 flex items-center justify-between">
            <span>Remaining Days:</span>
            <span className="text-gym-orange font-bold text-sm">{daysRemaining ?? 0} Days</span>
          </div>
        </div>

        {/* Quick Links Card */}
        <div className="bg-gym-card border border-gym-border/80 rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <span className="text-xs font-semibold uppercase text-gym-muted tracking-wider">Quick Actions</span>

          <div className="space-y-2">
            <Link
              to="/member/choose-plan"
              className="flex items-center justify-between p-3 bg-gym-dark hover:bg-gym-cardHover rounded-xl border border-gym-border text-xs text-slate-200 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-gym-orange" />
                <span>Browse Membership Plans</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gym-muted" />
            </Link>

            <Link
              to="/member/payments"
              className="flex items-center justify-between p-3 bg-gym-dark hover:bg-gym-cardHover rounded-xl border border-gym-border text-xs text-slate-200 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-gym-orange" />
                <span>View Receipts & Invoices</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gym-muted" />
            </Link>

            <Link
              to="/member/profile"
              className="flex items-center justify-between p-3 bg-gym-dark hover:bg-gym-cardHover rounded-xl border border-gym-border text-xs text-slate-200 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gym-orange" />
                <span>Edit Profile Details</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gym-muted" />
            </Link>
          </div>
        </div>

      </div>

      {/* ANNOUNCEMENTS & NOTICES SECTION */}
      <div className="bg-gym-card border border-gym-border/80 rounded-3xl p-6 space-y-4">
        <div className="flex items-center space-x-2 border-b border-gym-border/60 pb-4">
          <Bell className="w-5 h-5 text-gym-orange" />
          <h3 className="text-lg font-extrabold text-white">Gym Notices & Announcements</h3>
        </div>

        {announcements && announcements.length > 0 ? (
          <div className="space-y-3">
            {announcements.map((ann) => (
              <div key={ann.id} className="bg-gym-dark/60 border border-gym-border/50 rounded-2xl p-4 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-gym-orange">{ann.title}</h4>
                  <span className="text-[10px] text-gym-muted">{new Date(ann.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{ann.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gym-muted">No announcements posted currently.</p>
        )}
      </div>

    </div>
  );
};

export default MemberDashboard;

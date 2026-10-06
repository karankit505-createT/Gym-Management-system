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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner Greeting */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-5 shadow-sm">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center space-x-1.5 bg-red-50 border border-red-200 px-3 py-1 rounded-md text-red-700 text-xs font-semibold">
            <Flame className="w-3.5 h-3.5" />
            <span>Member Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 uppercase">Welcome Back, {user?.name}!</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Track your active plan, membership validity, announcements, and payment receipts.
          </p>
        </div>

        {/* Action Button */}
        <div className="w-full sm:w-auto">
          {status === 'active' ? (
            <Link
              to="/member/choose-plan"
              className="w-full sm:w-auto px-5 py-2.5 bg-white border border-red-600 text-red-600 hover:bg-red-50 font-semibold text-xs rounded-md transition-colors inline-flex items-center justify-center space-x-2 min-h-[42px]"
            >
              <Award className="w-4 h-4" />
              <span>Renew / Upgrade Plan</span>
            </Link>
          ) : (
            <Link
              to="/member/choose-plan"
              className="w-full sm:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-md shadow-sm transition-colors inline-flex items-center justify-center space-x-2 min-h-[42px]"
            >
              <span>Get Gym Membership</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {/* 7-DAY EXPIRY ALERT BANNER */}
      {expiringSoon && (
        <div className="bg-amber-50 border border-amber-300 p-4 rounded-md flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left shadow-sm">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 text-amber-900">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600" />
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wide">Membership Expiring Soon!</h4>
              <p className="text-xs text-amber-800">Your plan expires in <b className="font-bold">{daysRemaining} day(s)</b>. Renew now to avoid interruption of gym access.</p>
            </div>
          </div>
          <Link
            to="/member/choose-plan"
            className="w-full sm:w-auto px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-md shrink-0 transition-colors text-center min-h-[38px] flex items-center justify-center"
          >
            Renew Now
          </Link>
        </div>
      )}

      {/* MAIN STATUS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Status Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Current Status</span>
            {status === 'active' ? (
              <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-md flex items-center space-x-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>ACTIVE MEMBER</span>
              </span>
            ) : status === 'expired' ? (
              <span className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-2.5 py-1 rounded-md flex items-center space-x-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>EXPIRED</span>
              </span>
            ) : (
              <span className="bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-md">
                NOT A MEMBER YET
              </span>
            )}
          </div>

          <div className="my-2">
            <h3 className="text-2xl font-bold font-heading text-slate-900">
              {membership ? membership.Plan?.name : 'No Active Membership'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {membership ? `₹${parseFloat(membership.Plan?.price).toFixed(2)} / ${membership.Plan?.duration_days} Days` : 'Choose a plan to get full gym access'}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Access Type: <b className="text-slate-700">All Equipment & Locker</b></span>
          </div>
        </div>

        {/* Validity Period Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Validity Period</span>
            <Calendar className="w-5 h-5 text-red-600" />
          </div>

          <div className="space-y-2 my-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Start Date:</span>
              <span className="font-semibold text-slate-800">{membership ? membership.start_date : 'N/A'}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Expiry Date:</span>
              <span className="font-semibold text-slate-800">{membership ? membership.end_date : 'N/A'}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Remaining Days:</span>
            <span className="text-red-600 font-bold text-sm">{daysRemaining ?? 0} Days</span>
          </div>
        </div>

        {/* Quick Links Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between space-y-4 shadow-sm">
          <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Quick Actions</span>

          <div className="space-y-2">
            <Link
              to="/member/choose-plan"
              className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-md border border-slate-200 text-xs text-slate-700 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-red-600" />
                <span>Browse Membership Plans</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              to="/member/payments"
              className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-md border border-slate-200 text-xs text-slate-700 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-red-600" />
                <span>View Receipts & Invoices</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              to="/member/profile"
              className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-md border border-slate-200 text-xs text-slate-700 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-red-600" />
                <span>Edit Profile Details</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>
        </div>

      </div>

      {/* ANNOUNCEMENTS & NOTICES SECTION */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4 shadow-sm">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-4">
          <Bell className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-bold font-heading text-slate-900 uppercase">Gym Notices & Announcements</h3>
        </div>

        {announcements && announcements.length > 0 ? (
          <div className="space-y-3">
            {announcements.map((ann) => (
              <div key={ann.id} className="bg-slate-50 border border-slate-200 rounded-md p-4 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase text-red-700">{ann.title}</h4>
                  <span className="text-[10px] text-slate-400">{new Date(ann.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{ann.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500">No announcements posted currently.</p>
        )}
      </div>

    </div>
  );
};

export default MemberDashboard;

import React, { useState, useEffect } from 'react';
import { adminAPI, attendanceAPI } from '../services/api';
import { 
  Search, 
  Calendar, 
  CheckCircle2, 
  LogOut, 
  Clock, 
  UserCheck, 
  ShieldCheck, 
  Loader2, 
  Users, 
  Activity, 
  AlertTriangle, 
  AlertCircle,
  Filter,
  UserX,
  Sparkles,
  BookOpen,
  Download
} from 'lucide-react';

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState('check_in'); // 'check_in', 'schedule', 'lookup'
  const [search, setSearch] = useState('');
  const [members, setMembers] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const handleExportAttendanceCsv = async () => {
    try {
      setExporting(true);
      await attendanceAPI.exportAttendanceCsv({ date: todayStr, search });
    } catch (err) {
      setError('Failed to export attendance CSV report.');
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    fetchAllMembers();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await attendanceAPI.getLogs({ date: todayStr });
      if (res.data.success) {
        setAttendanceLogs(res.data.logs);
      }
    } catch (err) {
      console.error('Failed to load logs:', err);
    }
  };

  const fetchAllMembers = async () => {
    try {
      const res = await adminAPI.getMembers({});
      if (res.data.success) {
        setAllMembers(res.data.members);
      }
    } catch (err) {
      console.error('Failed to load all members:', err);
    }
  };

  const handleSearchMembers = async (e) => {
    if (e) e.preventDefault();
    if (!search.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await adminAPI.getMembers({ search });
      if (res.data.success) {
        setMembers(res.data.members);
      }
    } catch (err) {
      setError('Member search failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async (userId, action) => {
    setMsg('');
    setError('');

    try {
      const res = await attendanceAPI.markAttendance({ user_id: userId, action });
      if (res.data.success) {
        setMsg(res.data.message);
        fetchLogs();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Attendance action failed.');
    }
  };

  // Helper to evaluate member subscription status
  const getMemberStatusInfo = (member) => {
    const latestMem = member.Memberships && member.Memberships[0];
    if (!latestMem) {
      return {
        status: 'expired',
        label: 'No Active Plan',
        badgeClass: 'bg-red-500/20 text-red-400 border-red-500/30',
        planName: 'None',
        expiryDate: 'N/A',
        isExpired: true,
        isExpiringSoon: false
      };
    }

    const now = new Date();
    const endDate = new Date(latestMem.end_date);
    const diffDays = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

    if (latestMem.status === 'expired' || diffDays < 0) {
      return {
        status: 'expired',
        label: 'Expired',
        badgeClass: 'bg-red-500/20 text-red-400 border-red-500/30',
        planName: latestMem.Plan?.name || 'Standard Plan',
        expiryDate: latestMem.end_date,
        isExpired: true,
        isExpiringSoon: false
      };
    } else if (diffDays <= 7) {
      return {
        status: 'expiring_soon',
        label: `Expiring Soon (${diffDays} Days)`,
        badgeClass: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        planName: latestMem.Plan?.name || 'Standard Plan',
        expiryDate: latestMem.end_date,
        isExpired: false,
        isExpiringSoon: true
      };
    }

    return {
      status: 'active',
      label: 'Active',
      badgeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      planName: latestMem.Plan?.name || 'Standard Plan',
      expiryDate: latestMem.end_date,
      isExpired: false,
      isExpiringSoon: false
    };
  };

  // Quick Stats Calculations
  const currentlyActiveInGym = attendanceLogs.filter(log => !log.check_out || log.check_out === 'In Gym').length;
  
  const expiringSoonCount = allMembers.filter(m => {
    const info = getMemberStatusInfo(m);
    return info.isExpiringSoon;
  }).length;

  // Class Schedule Mock Data for Today
  const classSchedule = [
    {
      id: 1,
      name: 'Morning HIIT & Fat Burn',
      time: '07:00 AM - 08:00 AM',
      trainer: 'Priya Sharma',
      filled: 12,
      capacity: 15,
      isFull: false
    },
    {
      id: 2,
      name: 'Heavy Powerlifting Clinic',
      time: '09:30 AM - 10:30 AM',
      trainer: 'Alex Rivera',
      filled: 10,
      capacity: 10,
      isFull: true
    },
    {
      id: 3,
      name: 'Core & Functional Mobility',
      time: '05:00 PM - 06:00 PM',
      trainer: 'Elena Rostova',
      filled: 8,
      capacity: 12,
      isFull: false
    },
    {
      id: 4,
      name: 'Evening Hypertrophy Bulk',
      time: '07:30 PM - 08:30 PM',
      trainer: 'Marcus Vance',
      filled: 15,
      capacity: 15,
      isFull: true
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
      
      {/* HEADER PORTAL BANNER */}
      <div className="bg-gym-card border border-gym-border/80 rounded-2xl sm:rounded-3xl p-5 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <span className="text-gym-orange text-[10px] sm:text-xs font-bold uppercase tracking-widest flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-gym-orange inline" />
            <span>IronPulse Staff Operations Portal</span>
          </span>
          <h1 className="text-xl sm:text-3xl font-black text-white mt-1">STAFF DASHBOARD & CHECK-IN</h1>
          <p className="text-xs text-gym-muted mt-1">Today's Date: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="flex items-center space-x-3 bg-gym-dark/60 border border-gym-border px-4 py-2.5 rounded-2xl w-full sm:w-auto">
          <Clock className="w-5 h-5 text-gym-orange shrink-0" />
          <div>
            <p className="text-[10px] text-gym-muted font-bold uppercase">System Status</p>
            <p className="text-xs font-extrabold text-emerald-400">Live Attendance Sync Active</p>
          </div>
        </div>
      </div>

      {/* 1. NAVIGATION MENU (HORIZONTAL TABS) */}
      <div className="bg-gym-card border border-gym-border/80 rounded-2xl p-2 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('check_in')}
          className={`flex-1 min-w-[140px] px-5 py-3 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-2 transition-all ${
            activeTab === 'check_in'
              ? 'bg-gym-orange text-white shadow-lg shadow-gym-orange/30'
              : 'text-gym-muted hover:text-white hover:bg-gym-dark/60'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Check-In & Attendance</span>
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex-1 min-w-[140px] px-5 py-3 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-2 transition-all ${
            activeTab === 'schedule'
              ? 'bg-gym-orange text-white shadow-lg shadow-gym-orange/30'
              : 'text-gym-muted hover:text-white hover:bg-gym-dark/60'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Class Schedule</span>
        </button>

        <button
          onClick={() => setActiveTab('lookup')}
          className={`flex-1 min-w-[140px] px-5 py-3 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-2 transition-all ${
            activeTab === 'lookup'
              ? 'bg-gym-orange text-white shadow-lg shadow-gym-orange/30'
              : 'text-gym-muted hover:text-white hover:bg-gym-dark/60'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Member Directory Lookup</span>
        </button>
      </div>

      {/* 2. QUICK STATS SECTION (3-COLUMN GRID) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Total Members Today */}
        <div className="bg-gym-card border border-gym-border/80 rounded-3xl p-6 flex items-center justify-between shadow-lg hover:border-gym-orange/40 transition-colors">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-gym-muted uppercase tracking-wider">Total Members Today</span>
            <p className="text-3xl font-black text-white">{attendanceLogs.length}</p>
            <p className="text-[11px] text-slate-400">Total check-in entries logged</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gym-orange/15 border border-gym-orange/30 flex items-center justify-center">
            <Users className="w-7 h-7 text-gym-orange" />
          </div>
        </div>

        {/* Card 2: Currently Active */}
        <div className="bg-gym-card border border-gym-border/80 rounded-3xl p-6 flex items-center justify-between shadow-lg hover:border-emerald-500/40 transition-colors">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-gym-muted uppercase tracking-wider">Currently Active</span>
            <p className="text-3xl font-black text-emerald-400">{currentlyActiveInGym}</p>
            <p className="text-[11px] text-slate-400">In gym right now (Not checked-out)</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
            <Activity className="w-7 h-7 text-emerald-400" />
          </div>
        </div>

        {/* Card 3: Expiring Soon */}
        <div className="bg-gym-card border border-amber-500/30 rounded-3xl p-6 flex items-center justify-between shadow-lg bg-gradient-to-br from-gym-card to-amber-950/20">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Expiring Soon (7 Days)</span>
            <p className="text-3xl font-black text-amber-400">{expiringSoonCount}</p>
            <p className="text-[11px] text-amber-300/70">Memberships requiring renewal</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-amber-400" />
          </div>
        </div>

      </div>

      {/* NOTIFICATIONS / ALERTS */}
      {msg && (
        <div className="bg-emerald-500/15 border border-emerald-500/50 text-emerald-300 text-xs p-4 rounded-2xl flex items-center space-x-3 shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="font-semibold">{msg}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-500/15 border border-red-500/50 text-red-300 text-xs p-4 rounded-2xl flex items-center space-x-3 shadow-lg">
          <ShieldCheck className="w-5 h-5 text-red-400 flex-shrink-0" />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {/* TAB 1: CHECK-IN & MEMBER QUICK INFO */}
      {(activeTab === 'check_in' || activeTab === 'lookup') && (
        <div className="bg-gym-card border border-gym-border/80 rounded-3xl p-6 lg:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gym-border/60 pb-4">
            <div>
              <h3 className="text-lg font-extrabold text-white flex items-center space-x-2">
                <Search className="w-5 h-5 text-gym-orange" />
                <span>Search Member for Check-in & Lookup</span>
              </h3>
              <p className="text-xs text-gym-muted mt-0.5">Enter member name, registered email address, or 10-digit mobile number</p>
            </div>
          </div>

          <form onSubmit={handleSearchMembers} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gym-muted absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Member Name, Email, or Phone..."
                className="w-full bg-gym-dark border border-gym-border rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-gym-orange"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gym-orange hover:bg-gym-orangeHover text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Search Member</span></>}
            </button>
          </form>

          {/* 4. EXPANDED MEMBER QUICK INFO CARDS */}
          {members.length > 0 && (
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-gym-muted uppercase tracking-wider">Search Results ({members.length})</h4>
              
              <div className="grid grid-cols-1 gap-4">
                {members.map((m) => {
                  const statusInfo = getMemberStatusInfo(m);
                  return (
                    <div 
                      key={m.id} 
                      className={`bg-gym-dark/70 border rounded-2xl p-5 sm:p-6 space-y-4 transition-all ${
                        statusInfo.isExpired 
                          ? 'border-red-500/40 bg-red-950/10' 
                          : statusInfo.isExpiringSoon 
                          ? 'border-amber-500/40 bg-amber-950/10' 
                          : 'border-gym-border hover:border-gym-orange/50'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        
                        {/* Member Identity & Avatar */}
                        <div className="flex items-start space-x-4">
                          <div className="w-14 h-14 rounded-2xl bg-gym-orange/20 border border-gym-orange/40 text-gym-orange font-black flex items-center justify-center text-xl uppercase flex-shrink-0 overflow-hidden">
                            {m.photo ? (
                              <img src={`http://localhost:5000/uploads/${m.photo}`} alt={m.name} className="w-full h-full object-cover" />
                            ) : (
                              m.name.charAt(0)
                            )}
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="font-extrabold text-base text-white">{m.name}</h4>
                              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border ${statusInfo.badgeClass}`}>
                                {statusInfo.label}
                              </span>
                            </div>
                            <p className="text-xs text-gym-muted">{m.email} | Phone: <span className="text-white font-mono">{m.phone}</span></p>
                            
                            <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                              <div>
                                <span className="text-gym-muted">Plan: </span>
                                <strong className="text-gym-orange font-bold">{statusInfo.planName}</strong>
                              </div>
                              <div>
                                <span className="text-gym-muted">Expiry Date: </span>
                                <strong className="text-slate-200 font-mono">{statusInfo.expiryDate}</strong>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Attendance Actions */}
                        <div className="flex items-center space-x-3 pt-2 md:pt-0">
                          {statusInfo.isExpired ? (
                            <div className="flex flex-col items-end space-y-1">
                              <button
                                disabled={true}
                                title="Check-in disabled because membership is expired"
                                className="px-4 py-2.5 bg-slate-800 text-slate-500 border border-slate-700 font-bold text-xs rounded-xl cursor-not-allowed flex items-center space-x-1.5 opacity-60"
                              >
                                <UserX className="w-4 h-4" />
                                <span>Check-In Disabled</span>
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleMarkAttendance(m.id, 'check_in')}
                              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center space-x-1.5"
                            >
                              <UserCheck className="w-4 h-4" />
                              <span>Check-In</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleMarkAttendance(m.id, 'check_out')}
                            className="px-4 py-2.5 bg-gym-card hover:bg-gym-cardHover border border-gym-border text-slate-300 font-bold text-xs rounded-xl transition-colors flex items-center space-x-1.5"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Check-Out</span>
                          </button>
                        </div>

                      </div>

                      {/* Clear Warning Banner for Expired Memberships */}
                      {statusInfo.isExpired && (
                        <div className="bg-red-500/15 border border-red-500/40 text-red-300 text-xs p-3 rounded-xl flex items-center space-x-2">
                          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                          <span className="font-semibold">Membership expired - renewal required before gym check-in.</span>
                        </div>
                      )}

                      {/* Warning Banner for Expiring Soon */}
                      {statusInfo.isExpiringSoon && (
                        <div className="bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs p-3 rounded-xl flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                          <span className="font-semibold">Membership expiring soon! Remind member to renew before {statusInfo.expiryDate}.</span>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. CLASS SCHEDULE SECTION (Tab 2 View or Section) */}
      {activeTab === 'schedule' && (
        <div className="bg-gym-card border border-gym-border/80 rounded-3xl p-6 lg:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gym-border/60 pb-4">
            <div>
              <h3 className="text-lg font-extrabold text-white flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-gym-orange" />
                <span>Today's Group Training & Class Schedule</span>
              </h3>
              <p className="text-xs text-gym-muted mt-0.5">Live slot availability and coach schedules for today</p>
            </div>
            <span className="text-xs bg-gym-dark px-3 py-1.5 rounded-xl border border-gym-border font-bold text-gym-orange">
              4 Classes Scheduled Today
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-gym-dark/80 text-xs text-gym-muted uppercase border-b border-gym-border">
                <tr>
                  <th className="py-3.5 px-4">Class Name</th>
                  <th className="py-3.5 px-4">Time Slot</th>
                  <th className="py-3.5 px-4">Assigned Trainer</th>
                  <th className="py-3.5 px-4">Capacity / Slots</th>
                  <th className="py-3.5 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gym-border/50">
                {classSchedule.map((cls) => (
                  <tr key={cls.id} className="hover:bg-gym-dark/40 transition-colors">
                    <td className="py-4 px-4 font-bold text-white flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-gym-orange" />
                      <span>{cls.name}</span>
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-slate-300 font-semibold">{cls.time}</td>
                    <td className="py-4 px-4 text-xs font-bold text-gym-orange">{cls.trainer}</td>
                    <td className="py-4 px-4 text-xs font-bold text-white">
                      <span>{cls.filled} / {cls.capacity} filled</span>
                      <div className="w-32 bg-gym-dark h-1.5 rounded-full mt-1.5 overflow-hidden border border-gym-border">
                        <div 
                          className={`h-full rounded-full ${cls.isFull ? 'bg-red-500' : 'bg-emerald-400'}`} 
                          style={{ width: `${(cls.filled / cls.capacity) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      {cls.isFull ? (
                        <span className="px-3 py-1 bg-red-500/20 border border-red-500/40 text-red-400 font-extrabold text-[11px] rounded-full uppercase">
                          Full
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-extrabold text-[11px] rounded-full uppercase">
                          Available
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TODAY'S ATTENDANCE LOG TABLE */}
      <div className="bg-gym-card border border-gym-border/80 rounded-3xl p-6 lg:p-8 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gym-border/60 pb-3">
          <h3 className="text-lg font-extrabold text-white flex items-center space-x-2">
            <Clock className="w-5 h-5 text-gym-orange" />
            <span>Today's Gym Check-ins Log ({attendanceLogs.length})</span>
          </h3>
          <button
            onClick={handleExportAttendanceCsv}
            disabled={exporting}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 min-h-[40px] disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{exporting ? 'Exporting...' : 'Export Attendance CSV'}</span>
          </button>
        </div>

        {attendanceLogs.length === 0 ? (
          <p className="text-xs text-gym-muted py-8 text-center">No member check-ins recorded yet today.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-gym-dark/80 text-xs text-gym-muted uppercase border-b border-gym-border">
                <tr>
                  <th className="py-3 px-4">Member Name</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Check-In Time</th>
                  <th className="py-3 px-4">Check-Out Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gym-border/50">
                {attendanceLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gym-dark/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-full bg-gym-orange/20 text-gym-orange text-xs font-bold flex items-center justify-center">
                        {log.User?.name?.charAt(0) || 'U'}
                      </div>
                      <span>{log.User?.name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono text-gym-muted">{log.User?.phone}</td>
                    <td className="py-3.5 px-4 font-mono text-xs text-emerald-400 font-bold">{log.check_in || 'N/A'}</td>
                    <td className="py-3.5 px-4 font-mono text-xs text-amber-400 font-bold">
                      {!log.check_out || log.check_out === 'In Gym' ? (
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-md text-[10px] font-extrabold uppercase">
                          In Gym Now
                        </span>
                      ) : (
                        log.check_out
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default StaffDashboard;

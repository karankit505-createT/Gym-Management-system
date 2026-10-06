import React, { useState, useEffect } from 'react';
import { adminAPI, attendanceAPI, contactAPI } from '../services/api';
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
  Download,
  MessageSquare,
  Save,
  PhoneCall,
  Mail
} from 'lucide-react';

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState('check_in'); // 'check_in', 'inquiries', 'schedule', 'lookup'
  const [search, setSearch] = useState('');
  const [inquirySearch, setInquirySearch] = useState('');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('ALL');
  const [members, setMembers] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [inquiriesList, setInquiriesList] = useState([]);
  const [editingNotesId, setEditingNotesId] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [savingInquiryId, setSavingInquiryId] = useState(null);
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
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await contactAPI.getInquiries();
      if (res.data.success) {
        setInquiriesList(res.data.inquiries);
      }
    } catch (err) {
      console.error('Failed to load inquiries:', err);
    }
  };

  const handleStaffInquiryStatusChange = async (id, newStatus) => {
    try {
      setSavingInquiryId(id);
      setMsg('');
      setError('');
      const res = await contactAPI.updateInquiry(id, { status: newStatus });
      if (res.data.success) {
        setInquiriesList(prev => prev.map(item => item.id === id ? { ...item, status: newStatus, updatedAt: new Date().toISOString() } : item));
        setMsg(`Inquiry status updated to "${newStatus}".`);
        setTimeout(() => setMsg(''), 4000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update inquiry status.');
    } finally {
      setSavingInquiryId(null);
    }
  };

  const handleStaffSaveNotes = async (id) => {
    try {
      setSavingInquiryId(id);
      setMsg('');
      setError('');
      const res = await contactAPI.updateInquiry(id, { notes: noteText });
      if (res.data.success) {
        setInquiriesList(prev => prev.map(item => item.id === id ? { ...item, notes: noteText } : item));
        setEditingNotesId(null);
        setMsg('Inquiry notes saved successfully.');
        setTimeout(() => setMsg(''), 4000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save notes.');
    } finally {
      setSavingInquiryId(null);
    }
  };

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* HEADER PORTAL BANNER */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-red-600 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-red-600 inline" />
            <span>IronPulse Staff Operations Portal</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 uppercase mt-1">STAFF DASHBOARD & CHECK-IN</h1>
          <p className="text-xs text-slate-500 mt-1">Today's Date: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-md w-full sm:w-auto">
          <Clock className="w-5 h-5 text-red-600 shrink-0" />
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase">System Status</p>
            <p className="text-xs font-bold text-emerald-700">Live Attendance Sync Active</p>
          </div>
        </div>
      </div>

      {/* 1. NAVIGATION MENU (HORIZONTAL TABS) */}
      <div className="bg-white border border-slate-200 rounded-lg p-1.5 flex flex-wrap gap-2 shadow-sm">
        <button
          onClick={() => setActiveTab('check_in')}
          className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-md text-xs font-semibold flex items-center justify-center space-x-2 transition-colors ${
            activeTab === 'check_in'
              ? 'bg-red-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Check-In & Attendance</span>
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-md text-xs font-semibold flex items-center justify-center space-x-2 transition-colors ${
            activeTab === 'inquiries'
              ? 'bg-red-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Inquiries Management</span>
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-md text-xs font-semibold flex items-center justify-center space-x-2 transition-colors ${
            activeTab === 'schedule'
              ? 'bg-red-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Class Schedule</span>
        </button>

        <button
          onClick={() => setActiveTab('lookup')}
          className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-md text-xs font-semibold flex items-center justify-center space-x-2 transition-colors ${
            activeTab === 'lookup'
              ? 'bg-red-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Member Directory Lookup</span>
        </button>
      </div>

      {/* 2. QUICK STATS SECTION (3-COLUMN GRID) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Total Members Today */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Members Today</span>
            <p className="text-3xl font-bold font-sans text-slate-900">{attendanceLogs.length}</p>
            <p className="text-[11px] text-slate-500">Total check-in entries logged</p>
          </div>
          <div className="w-12 h-12 rounded-md bg-red-50 border border-red-100 flex items-center justify-center">
            <Users className="w-6 h-6 text-red-600" />
          </div>
        </div>

        {/* Card 2: Currently Active */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Currently Active</span>
            <p className="text-3xl font-bold font-sans text-emerald-700">{currentlyActiveInGym}</p>
            <p className="text-[11px] text-slate-500">In gym right now (Not checked-out)</p>
          </div>
          <div className="w-12 h-12 rounded-md bg-emerald-50 border border-emerald-100 flex items-center justify-center">
            <Activity className="w-6 h-6 text-emerald-600" />
          </div>
        </div>

        {/* Card 3: Expiring Soon */}
        <div className="bg-white border border-amber-300 rounded-lg p-6 flex items-center justify-between shadow-sm bg-amber-50/50">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">Expiring Soon (7 Days)</span>
            <p className="text-3xl font-bold font-sans text-amber-700">{expiringSoonCount}</p>
            <p className="text-[11px] text-amber-800">Memberships requiring renewal</p>
          </div>
          <div className="w-12 h-12 rounded-md bg-amber-100 border border-amber-200 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
        </div>

      </div>

      {/* NOTIFICATIONS / ALERTS */}
      {msg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-4 rounded-md flex items-center space-x-3 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="font-semibold">{msg}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-4 rounded-md flex items-center space-x-3 shadow-sm">
          <ShieldCheck className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {/* TAB 1: CHECK-IN & MEMBER QUICK INFO */}
      {(activeTab === 'check_in' || activeTab === 'lookup') && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold font-heading text-slate-900 flex items-center space-x-2 uppercase">
                <Search className="w-5 h-5 text-red-600" />
                <span>Search Member for Check-in & Lookup</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Enter member name, registered email address, or 10-digit mobile number</p>
            </div>
          </div>

          <form onSubmit={handleSearchMembers} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Member Name, Email, or Phone..."
                className="w-full bg-slate-50 border border-slate-300 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-md pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none transition-all min-h-[42px]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-md shadow-sm transition-colors flex items-center justify-center space-x-2 min-h-[42px]"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Search Member</span>}
            </button>
          </form>

          {/* 4. EXPANDED MEMBER QUICK INFO CARDS */}
          {members.length > 0 && (
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Search Results ({members.length})</h4>
              
              <div className="grid grid-cols-1 gap-4">
                {members.map((m) => {
                  const statusInfo = getMemberStatusInfo(m);
                  return (
                    <div 
                      key={m.id} 
                      className={`bg-slate-50 border rounded-md p-5 space-y-4 ${
                        statusInfo.isExpired 
                          ? 'border-red-300 bg-red-50/50' 
                          : statusInfo.isExpiringSoon 
                          ? 'border-amber-300 bg-amber-50/50' 
                          : 'border-slate-200'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        
                        {/* Member Identity & Avatar */}
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 text-red-600 font-bold flex items-center justify-center text-lg uppercase flex-shrink-0 overflow-hidden font-heading">
                            {m.photo ? (
                              <img src={`http://localhost:5000/uploads/${m.photo}`} alt={m.name} className="w-full h-full object-cover" />
                            ) : (
                              m.name.charAt(0)
                            )}
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="font-bold text-slate-900 text-base">{m.name}</h4>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase border ${
                                statusInfo.isExpired ? 'bg-red-100 text-red-700 border-red-200' :
                                statusInfo.isExpiringSoon ? 'bg-amber-100 text-amber-800 border-amber-200' :
                                'bg-emerald-100 text-emerald-800 border-emerald-200'
                              }`}>
                                {statusInfo.label}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500">{m.email} | Phone: <span className="text-slate-900 font-mono font-semibold">{m.phone}</span></p>
                            
                            <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                              <div>
                                <span className="text-slate-500">Plan: </span>
                                <strong className="text-red-600 font-semibold">{statusInfo.planName}</strong>
                              </div>
                              <div>
                                <span className="text-slate-500">Expiry Date: </span>
                                <strong className="text-slate-700 font-mono">{statusInfo.expiryDate}</strong>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Attendance Actions */}
                        <div className="flex items-center space-x-3 pt-2 md:pt-0">
                          {statusInfo.isExpired ? (
                            <button
                              disabled={true}
                              title="Check-in disabled because membership is expired"
                              className="px-4 py-2 bg-slate-200 text-slate-500 border border-slate-300 font-semibold text-xs rounded-md cursor-not-allowed flex items-center space-x-1.5 opacity-70"
                            >
                              <UserX className="w-4 h-4" />
                              <span>Check-In Disabled</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleMarkAttendance(m.id, 'check_in')}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-md shadow-sm transition-colors flex items-center space-x-1.5"
                            >
                              <UserCheck className="w-4 h-4" />
                              <span>Check-In</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleMarkAttendance(m.id, 'check_out')}
                            className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold text-xs rounded-md transition-colors flex items-center space-x-1.5"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Check-Out</span>
                          </button>
                        </div>

                      </div>

                      {/* Clear Warning Banner for Expired Memberships */}
                      {statusInfo.isExpired && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-2.5 rounded-md flex items-center space-x-2">
                          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                          <span className="font-semibold">Membership expired - renewal required before gym check-in.</span>
                        </div>
                      )}

                      {/* Warning Banner for Expiring Soon */}
                      {statusInfo.isExpiringSoon && (
                        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-2.5 rounded-md flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
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
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold font-heading text-slate-900 flex items-center space-x-2 uppercase">
                <Calendar className="w-5 h-5 text-red-600" />
                <span>Today's Group Training & Class Schedule</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Live slot availability and coach schedules for today</p>
            </div>
            <span className="text-xs bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200 font-semibold text-red-600">
              4 Classes Scheduled Today
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 table-clean">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] tracking-wider border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-3 px-4">Class Name</th>
                  <th className="py-3 px-4">Time Slot</th>
                  <th className="py-3 px-4">Assigned Trainer</th>
                  <th className="py-3 px-4">Capacity / Slots</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classSchedule.map((cls) => (
                  <tr key={cls.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-red-600" />
                      <span>{cls.name}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-600">{cls.time}</td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-red-600">{cls.trainer}</td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-800">
                      <span>{cls.filled} / {cls.capacity} filled</span>
                      <div className="w-32 bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden border border-slate-200">
                        <div 
                          className={`h-full rounded-full ${cls.isFull ? 'bg-red-600' : 'bg-emerald-600'}`} 
                          style={{ width: `${(cls.filled / cls.capacity) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {cls.isFull ? (
                        <span className="px-2.5 py-0.5 bg-red-50 border border-red-200 text-red-700 font-semibold text-[10px] rounded-md uppercase">
                          Full
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold text-[10px] rounded-md uppercase">
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

      {/* TAB: INQUIRIES MANAGEMENT (STAFF VIEW) */}
      {activeTab === 'inquiries' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold font-heading text-slate-900 flex items-center space-x-2 uppercase">
                <MessageSquare className="w-5 h-5 text-red-600" />
                <span>Inquiries Management</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Manage member inquiries, follow-up calls, and update status notes</p>
            </div>
            <span className="text-xs bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200 font-semibold text-red-600">
              Total Inquiries: {inquiriesList.length}
            </span>
          </div>

          {/* Filter controls */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50 p-4 rounded-md border border-slate-200">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by name, phone, message..."
                value={inquirySearch}
                onChange={(e) => setInquirySearch(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-md pl-10 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
              />
            </div>

            <div className="flex items-center space-x-2 w-full md:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-600 font-semibold">Status Filter:</span>
              <select
                value={inquiryStatusFilter}
                onChange={(e) => setInquiryStatusFilter(e.target.value)}
                className="bg-white border border-slate-300 text-xs text-slate-900 rounded-md px-3 py-2 focus:outline-none focus:border-red-600 font-semibold"
              >
                <option value="ALL">All Inquiries ({inquiriesList.length})</option>
                <option value="New">New Inquiries</option>
                <option value="Contacted">Contacted</option>
                <option value="Visited">Visited Gym</option>
                <option value="Joined">Joined</option>
                <option value="Not Interested">Not Interested</option>
              </select>
            </div>
          </div>

          {/* Inquiries List Table / Cards */}
          {inquiriesList.filter(item => {
            const q = inquirySearch.toLowerCase();
            const matchesSearch = item.name.toLowerCase().includes(q) || item.phone.includes(q) || item.message.toLowerCase().includes(q) || (item.notes && item.notes.toLowerCase().includes(q));
            const matchesStatus = inquiryStatusFilter === 'ALL' || item.status === inquiryStatusFilter;
            return matchesSearch && matchesStatus;
          }).length === 0 ? (
            <p className="text-xs text-slate-500 py-8 text-center">No inquiries match the current filter.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {inquiriesList.filter(item => {
                const q = inquirySearch.toLowerCase();
                const matchesSearch = item.name.toLowerCase().includes(q) || item.phone.includes(q) || item.message.toLowerCase().includes(q) || (item.notes && item.notes.toLowerCase().includes(q));
                const matchesStatus = inquiryStatusFilter === 'ALL' || item.status === inquiryStatusFilter;
                return matchesSearch && matchesStatus;
              }).map((inquiry) => (
                <div
                  key={inquiry.id}
                  className={`bg-slate-50 border rounded-md p-5 space-y-3 ${
                    inquiry.status === 'New' ? 'border-red-300 bg-red-50/30' : 'border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-red-50 border border-red-200 text-red-600 font-bold flex items-center justify-center text-sm font-heading">
                        {inquiry.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                          <span>{inquiry.name}</span>
                          {inquiry.status === 'New' && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-600 text-white">
                              NEW
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-slate-500 font-mono">{new Date(inquiry.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>

                    {/* Status Selector for Staff */}
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-600 font-semibold">Status:</span>
                      <select
                        disabled={savingInquiryId === inquiry.id}
                        value={inquiry.status || 'New'}
                        onChange={(e) => handleStaffInquiryStatusChange(inquiry.id, e.target.value)}
                        className="bg-white border border-slate-300 text-xs text-slate-900 rounded-md px-3 py-1.5 font-semibold focus:outline-none focus:border-red-600 disabled:opacity-50"
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Visited">Visited Gym</option>
                        <option value="Joined">Joined</option>
                        <option value="Not Interested">Not Interested</option>
                      </select>
                    </div>
                  </div>

                  {/* Contact info & Message */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="bg-white p-3 rounded-md border border-slate-200 space-y-1">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase">Phone / Email</span>
                      <p className="text-slate-900 font-semibold font-mono flex items-center space-x-1.5">
                        <PhoneCall className="w-3.5 h-3.5 text-red-600" />
                        <a href={`tel:${inquiry.phone}`} className="hover:underline">{inquiry.phone}</a>
                      </p>
                      <p className="text-slate-600 truncate flex items-center space-x-1.5">
                        <Mail className="w-3.5 h-3.5 text-red-600" />
                        <a href={`mailto:${inquiry.email}`} className="hover:underline">{inquiry.email}</a>
                      </p>
                    </div>
                    <div className="md:col-span-2 bg-white p-3 rounded-md border border-slate-200 space-y-1">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase">Message</span>
                      <p className="text-slate-700 leading-relaxed text-xs">"{inquiry.message}"</p>
                    </div>
                  </div>

                  {/* Notes Editing for Staff */}
                  <div className="pt-1 text-xs border-t border-slate-200">
                    {editingNotesId === inquiry.id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          placeholder="Enter follow-up notes..."
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          className="flex-1 bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-red-600"
                        />
                        <button
                          onClick={() => handleStaffSaveNotes(inquiry.id)}
                          disabled={savingInquiryId === inquiry.id}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md text-xs flex items-center space-x-1"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={() => setEditingNotesId(null)}
                          className="px-3 py-1.5 bg-white border border-slate-300 text-slate-600 hover:text-slate-900 rounded-md text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-slate-500">
                        <div>
                          <strong className="text-slate-700">Notes: </strong>
                          {inquiry.notes ? (
                            <span className="text-slate-800 italic">{inquiry.notes}</span>
                          ) : (
                            <span className="italic text-slate-400">No notes added yet</span>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setEditingNotesId(inquiry.id);
                            setNoteText(inquiry.notes || '');
                          }}
                          className="text-red-600 hover:underline font-semibold text-xs"
                        >
                          {inquiry.notes ? 'Edit Notes' : '+ Add Note'}
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TODAY'S ATTENDANCE LOG TABLE */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <h3 className="text-lg font-bold font-heading text-slate-900 flex items-center space-x-2 uppercase">
            <Clock className="w-5 h-5 text-red-600" />
            <span>Today's Gym Check-ins Log ({attendanceLogs.length})</span>
          </h3>
          <button
            onClick={handleExportAttendanceCsv}
            disabled={exporting}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-md shadow-sm transition-colors flex items-center space-x-2 min-h-[38px] disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{exporting ? 'Exporting...' : 'Export Attendance CSV'}</span>
          </button>
        </div>

        {attendanceLogs.length === 0 ? (
          <p className="text-xs text-slate-500 py-8 text-center">No member check-ins recorded yet today.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 table-clean">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] tracking-wider border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-3 px-4">Member Name</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Check-In Time</th>
                  <th className="py-3 px-4">Check-Out Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendanceLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-full bg-red-50 text-red-600 text-xs font-bold flex items-center justify-center font-heading">
                        {log.User?.name?.charAt(0) || 'U'}
                      </div>
                      <span>{log.User?.name}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">{log.User?.phone}</td>
                    <td className="py-3.5 px-4 font-mono text-emerald-700 font-semibold">{log.check_in || 'N/A'}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-700 font-semibold">
                      {!log.check_out || log.check_out === 'In Gym' ? (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[10px] font-semibold uppercase">
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

import React, { useState, useEffect } from 'react';
import { contactAPI, adminAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { 
  MessageSquare, 
  Search, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  PhoneCall, 
  Mail, 
  User, 
  AlertCircle,
  Filter,
  Calendar,
  MessageCircle,
  UserCheck,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Save,
  Loader2
} from 'lucide-react';

const ManageInquiries = () => {
  const { role } = useAuth();
  const isAdmin = role === 'admin';

  const [inquiries, setInquiries] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  const [editingNotesId, setEditingNotesId] = useState(null);
  const [noteText, setNoteText] = useState('');

  // Delete Modal States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [inquiryToDelete, setInquiryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    fetchInquiriesAndData();
  }, [statusFilter]);

  const fetchInquiriesAndData = async () => {
    try {
      setLoading(true);
      setError('');

      const params = {};
      if (statusFilter !== 'ALL') {
        params.status = statusFilter;
      }

      const res = await contactAPI.getInquiries(params);
      if (res.data.success) {
        setInquiries(res.data.inquiries);
      }

      // Fetch stats if admin
      if (isAdmin) {
        try {
          const statsRes = await contactAPI.getStats();
          if (statsRes.data.success) {
            setStats(statsRes.data.stats);
          }
        } catch (stErr) {
          console.warn('Stats fetch notice:', stErr.message);
        }

        try {
          const staffRes = await adminAPI.getStaffList();
          if (staffRes.data.success) {
            setStaffList(staffRes.data.staff || []);
          }
        } catch (stfErr) {
          console.warn('Staff list fetch notice:', stfErr.message);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load contact inquiries.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      const res = await contactAPI.updateInquiry(id, { status: newStatus });
      if (res.data.success) {
        setInquiries(prev => prev.map(item => item.id === id ? { ...item, status: newStatus, updatedAt: new Date().toISOString() } : item));
        setSuccess(`Inquiry status updated to "${newStatus}".`);
        setTimeout(() => setSuccess(''), 3000);
        if (isAdmin) {
          contactAPI.getStats().then(s => s.data.success && setStats(s.data.stats)).catch(() => {});
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAssignStaff = async (id, staffId) => {
    try {
      setUpdatingId(id);
      const targetStaffId = staffId ? parseInt(staffId) : null;
      const res = await contactAPI.assignInquiry(id, { assigned_to: targetStaffId });
      if (res.data.success) {
        setInquiries(prev => prev.map(item => item.id === id ? res.data.inquiry : item));
        setSuccess(targetStaffId ? 'Inquiry assigned to staff successfully.' : 'Inquiry unassigned.');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign staff member.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveNotes = async (id) => {
    try {
      setUpdatingId(id);
      const res = await contactAPI.updateInquiry(id, { notes: noteText });
      if (res.data.success) {
        setInquiries(prev => prev.map(item => item.id === id ? { ...item, notes: noteText } : item));
        setEditingNotesId(null);
        setSuccess('Notes saved successfully.');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save notes.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleOpenDeleteModal = (inquiry) => {
    setInquiryToDelete(inquiry);
    setDeleteError('');
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!inquiryToDelete) return;
    setIsDeleting(true);
    setDeleteError('');
    try {
      const res = await contactAPI.deleteInquiry(inquiryToDelete.id);
      if (res.data.success) {
        setInquiries(prev => prev.filter(item => item.id !== inquiryToDelete.id));
        setShowDeleteModal(false);
        setInquiryToDelete(null);
        setSuccess('Inquiry deleted successfully.');
        setTimeout(() => setSuccess(''), 3000);
        if (isAdmin) {
          contactAPI.getStats().then(s => s.data.success && setStats(s.data.stats)).catch(() => {});
        }
      }
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Failed to delete inquiry. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Client-side Search Filtering
  const filteredInquiries = inquiries.filter(item => {
    const q = search.toLowerCase();
    const matchesSearch = 
      item.name.toLowerCase().includes(q) ||
      item.phone.includes(q) ||
      item.email.toLowerCase().includes(q) ||
      item.message.toLowerCase().includes(q) ||
      (item.notes && item.notes.toLowerCase().includes(q)) ||
      (item.AssignedStaff && item.AssignedStaff.name.toLowerCase().includes(q));

    return matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'New':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            New Inquiry
          </span>
        );
      case 'Contacted':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <PhoneCall className="w-3.5 h-3.5 mr-1.5" />
            Contacted
          </span>
        );
      case 'Visited':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <UserCheck className="w-3.5 h-3.5 mr-1.5" />
            Visited Gym
          </span>
        );
      case 'Joined':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
            Joined Member
          </span>
        );
      case 'Not Interested':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            Not Interested
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 mr-1.5" />
            Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-orange-600 text-xs sm:text-sm font-bold uppercase tracking-wider">
            {isAdmin ? 'Admin Management Portal' : 'Staff Workspace'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 uppercase tracking-tight flex items-center gap-3 mt-1">
            <MessageSquare className="w-8 h-8 text-orange-600 shrink-0" />
            <span>CONTACT INQUIRIES & LEADS</span>
          </h1>
        </div>
        <div className="text-sm text-slate-700 bg-white px-4 py-2.5 rounded-lg border border-slate-200 font-semibold shadow-xs h-11 flex items-center">
          Total Inquiries: <span className="text-slate-900 font-extrabold ml-1.5">{inquiries.length}</span>
        </div>
      </div>

      {/* ADMIN SUMMARY METRIC CARDS */}
      {isAdmin && stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">New Inquiries</p>
                <h3 className="text-4xl font-black text-slate-900 mt-1">{stats.newCount || 0}</h3>
                <p className="text-xs text-slate-500 mt-1">Requires initial contact</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
                <Sparkles className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total This Month</p>
                <h3 className="text-4xl font-black text-slate-900 mt-1">{stats.totalThisMonth || 0}</h3>
                <p className="text-xs text-slate-500 mt-1">Received in current month</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Conversion Rate</p>
                <h3 className="text-4xl font-black text-slate-900 mt-1">{stats.conversionRate || 0}%</h3>
                <p className="text-xs text-slate-500 mt-1">{stats.joinedCount || 0} Joined Members</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Pending Follow-up (3+ Days)</p>
                <h3 className="text-4xl font-black text-amber-700 mt-1">{stats.pendingFollowUpCount || 0}</h3>
                <p className="text-xs text-slate-500 mt-1">Requires staff attention</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICATIONS */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-lg flex items-center justify-between font-medium">
          <span>{error}</span>
          <button onClick={() => setError('')} className="font-bold text-lg hover:text-red-900 ml-2">✕</button>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm p-4 rounded-lg flex items-center justify-between font-medium">
          <span>{success}</span>
          <button onClick={() => setSuccess('')} className="font-bold text-lg hover:text-emerald-900 ml-2">✕</button>
        </div>
      )}

      {/* CONTROLS (SEARCH & FILTER) */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by name, phone, email, message, notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-md pl-11 pr-4 h-11 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600 font-medium"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <Filter className="w-5 h-5 text-slate-500" />
          <span className="text-sm text-slate-700 font-semibold">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-sm text-slate-900 rounded-md px-3.5 h-11 focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600 font-semibold"
          >
            <option value="ALL">All Statuses ({inquiries.length})</option>
            <option value="New">New Inquiries</option>
            <option value="Contacted">Contacted</option>
            <option value="Visited">Visited Gym</option>
            <option value="Joined">Joined (Member)</option>
            <option value="Not Interested">Not Interested</option>
          </select>
        </div>
      </div>

      {/* LIST OF INQUIRIES */}
      {loading ? (
        <div className="text-center py-20 text-slate-600 text-base flex items-center justify-center space-x-3 bg-white rounded-lg border border-slate-200 font-medium">
          <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
          <span>Loading contact inquiries...</span>
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-16 text-center space-y-3 shadow-xs">
          <MessageCircle className="w-14 h-14 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No inquiries found</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">When visitors fill out the contact form on the landing page, their inquiries will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {filteredInquiries.map((inquiry) => {
            const isUpdating = updatingId === inquiry.id;
            return (
              <div
                key={inquiry.id}
                className={`bg-white border rounded-lg p-6 transition-colors space-y-4 shadow-xs ${
                  inquiry.status === 'New' 
                    ? 'border-orange-300 bg-orange-50/15' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-11 h-11 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-700 font-bold text-base">
                      {inquiry.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                        <span>{inquiry.name}</span>
                      </h3>
                      <div className="flex items-center space-x-3 text-xs sm:text-sm text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1.5 font-mono">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {new Date(inquiry.createdAt).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {getStatusBadge(inquiry.status)}

                    {/* Change Status Dropdown */}
                    <div className="flex items-center space-x-2">
                      <span className="text-xs sm:text-sm text-slate-600 font-semibold">Status:</span>
                      <select
                        disabled={isUpdating}
                        value={inquiry.status || 'New'}
                        onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                        className="bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-900 rounded-md px-3 h-10 focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600 font-semibold disabled:opacity-50"
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Visited">Visited Gym</option>
                        <option value="Joined">Joined (Member)</option>
                        <option value="Not Interested">Not Interested</option>
                      </select>
                    </div>

                    {/* Delete Button (ADMIN ONLY) */}
                    {isAdmin && (
                      <button
                        onClick={() => handleOpenDeleteModal(inquiry)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete Inquiry"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* CONTACT DETAILS & MESSAGE BODY */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
                  
                  {/* Contact info column */}
                  <div className="space-y-2.5 bg-slate-50 p-4 rounded-md border border-slate-200">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Details</span>
                    <div className="flex items-center space-x-2.5 text-slate-900">
                      <PhoneCall className="w-4 h-4 text-orange-600 shrink-0" />
                      <a href={`tel:${inquiry.phone}`} className="hover:underline hover:text-orange-600 font-bold font-mono text-sm sm:text-base">
                        {inquiry.phone}
                      </a>
                    </div>
                    <div className="flex items-center space-x-2.5 text-slate-900">
                      <Mail className="w-4 h-4 text-orange-600 shrink-0" />
                      <a href={`mailto:${inquiry.email}`} className="hover:underline hover:text-orange-600 font-medium text-sm">
                        {inquiry.email}
                      </a>
                    </div>
                  </div>

                  {/* Inquiry message column */}
                  <div className="lg:col-span-2 space-y-2.5 bg-slate-50 p-4 rounded-md border border-slate-200">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Inquiry Message</span>
                    <p className="text-slate-800 leading-relaxed text-sm sm:text-base whitespace-pre-wrap font-normal">
                      "{inquiry.message}"
                    </p>
                  </div>

                </div>

                {/* NOTES SECTION */}
                <div className="pt-3 text-sm border-t border-slate-100">
                  {editingNotesId === inquiry.id ? (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                      <input
                        type="text"
                        placeholder="Add internal follow-up notes (e.g., Called customer, scheduled trial session)..."
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-300 rounded-md px-3.5 h-11 text-sm text-slate-900 focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600"
                      />
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleSaveNotes(inquiry.id)}
                          disabled={isUpdating}
                          className="px-4 h-11 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-md text-sm flex items-center space-x-1.5"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save Notes</span>
                        </button>
                        <button
                          onClick={() => setEditingNotesId(null)}
                          className="px-3.5 h-11 bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-md text-sm font-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-slate-600">
                      <div>
                        <strong className="text-slate-900 font-bold">Follow-up Notes: </strong>
                        {inquiry.notes ? (
                          <span className="text-slate-800 font-medium italic">{inquiry.notes}</span>
                        ) : (
                          <span className="italic text-slate-400">No notes added yet</span>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setEditingNotesId(inquiry.id);
                          setNoteText(inquiry.notes || '');
                        }}
                        className="text-orange-600 hover:underline font-bold text-sm shrink-0"
                      >
                        {inquiry.notes ? 'Edit Notes' : '+ Add Note'}
                      </button>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* CONFIRM DELETE MODAL (ADMIN ONLY) */}
      {isAdmin && (
        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          itemName={inquiryToDelete ? `inquiry from ${inquiryToDelete.name}` : 'this inquiry'}
          itemType="Inquiry"
          isDeleting={isDeleting}
          error={deleteError}
        />
      )}

    </div>
  );
};

export default ManageInquiries;

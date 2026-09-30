import React, { useState, useEffect } from 'react';
import { contactAPI } from '../services/api';
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
  MessageCircle
} from 'lucide-react';

const ManageInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
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
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await contactAPI.getInquiries();
      if (res.data.success) {
        setInquiries(res.data.inquiries);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load inquiries.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await contactAPI.updateInquiry(id, { status: newStatus });
      if (res.data.success) {
        setInquiries(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
        setSuccess(`Inquiry #${id} marked as ${newStatus}.`);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to update status.');
    }
  };

  const handleSaveNotes = async (id) => {
    try {
      const res = await contactAPI.updateInquiry(id, { notes: noteText });
      if (res.data.success) {
        setInquiries(prev => prev.map(item => item.id === id ? { ...item, notes: noteText } : item));
        setEditingNotesId(null);
        setSuccess('Notes updated successfully.');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to save notes.');
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
      }
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Failed to delete inquiry. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtering
  const filteredInquiries = inquiries.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.phone.includes(search) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      item.message.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 border border-amber-500/40 text-amber-400">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case 'Contacted':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 border border-blue-500/40 text-blue-400">
            <PhoneCall className="w-3 h-3 mr-1" />
            Contacted
          </span>
        );
      case 'Resolved':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 border border-emerald-500/40 text-emerald-400">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Resolved
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* HEADER */}
      <div className="border-b border-gym-border pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-gym-orange text-xs font-bold uppercase tracking-widest">Admin Control</span>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-gym-orange" />
            CONTACT INQUIRIES & MESSAGES
          </h1>
        </div>
        <div className="text-xs text-gym-muted bg-gym-card px-4 py-2 rounded-xl border border-gym-border">
          Total Received: <span className="text-white font-bold">{inquiries.length}</span>
        </div>
      </div>

      {/* NOTIFICATIONS */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/40 text-red-300 text-xs p-3.5 rounded-xl flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="font-bold">✕</button>
        </div>
      )}

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs p-3.5 rounded-xl flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess('')} className="font-bold">✕</button>
        </div>
      )}

      {/* CONTROLS (SEARCH & FILTER) */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-gym-card p-4 rounded-2xl border border-gym-border">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gym-muted absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by name, phone, email, message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gym-dark border border-gym-border rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-gym-muted focus:outline-none focus:border-gym-orange"
          />
        </div>

        {/* Filter */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-gym-muted" />
          <span className="text-xs text-gym-muted font-semibold">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gym-dark border border-gym-border text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-gym-orange"
          >
            <option value="ALL">All Inquiries ({inquiries.length})</option>
            <option value="Pending">Pending ({inquiries.filter(i => i.status === 'Pending').length})</option>
            <option value="Contacted">Contacted ({inquiries.filter(i => i.status === 'Contacted').length})</option>
            <option value="Resolved">Resolved ({inquiries.filter(i => i.status === 'Resolved').length})</option>
          </select>
        </div>
      </div>

      {/* LIST OF INQUIRIES */}
      {loading ? (
        <div className="text-center py-20 text-gym-muted text-sm">Loading contact inquiries...</div>
      ) : filteredInquiries.length === 0 ? (
        <div className="bg-gym-card border border-gym-border/60 rounded-3xl p-12 text-center space-y-3">
          <MessageCircle className="w-12 h-12 text-gym-muted mx-auto" />
          <h3 className="text-lg font-bold text-white">No inquiries found</h3>
          <p className="text-xs text-gym-muted">When visitors fill out the contact form on the home page, their inquiries will appear here in real-time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredInquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className="bg-gym-card border border-gym-border/80 hover:border-gym-orange/40 rounded-2xl p-6 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gym-border/50 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gym-orange/20 border border-gym-orange/50 flex items-center justify-center text-gym-orange font-black text-sm">
                    {inquiry.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center space-x-2">
                      <span>{inquiry.name}</span>
                    </h3>
                    <div className="flex items-center space-x-3 text-xs text-gym-muted mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gym-orange" />
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

                <div className="flex items-center space-x-3">
                  {getStatusBadge(inquiry.status)}

                  {/* Change Status Dropdown */}
                  <select
                    value={inquiry.status}
                    onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                    className="bg-gym-dark border border-gym-border text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-gym-orange font-medium"
                  >
                    <option value="Pending">Set Pending</option>
                    <option value="Contacted">Set Contacted</option>
                    <option value="Resolved">Set Resolved</option>
                  </select>

                  <button
                    onClick={() => handleOpenDeleteModal(inquiry)}
                    className="p-2 text-gym-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete Inquiry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* CONTACT DETAILS & MESSAGE BODY */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
                
                {/* Contact info column */}
                <div className="space-y-2 bg-gym-dark/50 p-3.5 rounded-xl border border-gym-border/40">
                  <span className="text-[10px] font-bold text-gym-muted uppercase tracking-wider">Contact Info</span>
                  <div className="flex items-center space-x-2 text-slate-200">
                    <PhoneCall className="w-3.5 h-3.5 text-gym-orange shrink-0" />
                    <a href={`tel:${inquiry.phone}`} className="hover:underline hover:text-gym-orange font-semibold">
                      {inquiry.phone}
                    </a>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-200">
                    <Mail className="w-3.5 h-3.5 text-gym-orange shrink-0" />
                    <a href={`mailto:${inquiry.email}`} className="hover:underline hover:text-gym-orange">
                      {inquiry.email}
                    </a>
                  </div>
                </div>

                {/* Inquiry message column */}
                <div className="lg:col-span-2 space-y-2 bg-gym-dark/50 p-3.5 rounded-xl border border-gym-border/40">
                  <span className="text-[10px] font-bold text-gym-muted uppercase tracking-wider">Message</span>
                  <p className="text-slate-200 leading-relaxed text-xs whitespace-pre-wrap">
                    "{inquiry.message}"
                  </p>
                </div>

              </div>

              {/* NOTES SECTION */}
              <div className="pt-1 text-xs border-t border-gym-border/40">
                {editingNotesId === inquiry.id ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Add internal follow-up notes (e.g., Called user on 30 Sept, agreed to visit tomorrow)..."
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      className="flex-1 bg-gym-dark border border-gym-border rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-gym-orange"
                    />
                    <button
                      onClick={() => handleSaveNotes(inquiry.id)}
                      className="px-3 py-1.5 bg-gym-orange hover:bg-gym-orangeHover text-white font-bold rounded-xl text-xs"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingNotesId(null)}
                      className="px-3 py-1.5 bg-gym-dark border border-gym-border text-gym-muted hover:text-white rounded-xl text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-gym-muted">
                    <span>
                      <strong className="text-slate-300">Admin Notes: </strong>
                      {inquiry.notes ? (
                        <span className="text-slate-200 italic">{inquiry.notes}</span>
                      ) : (
                        <span className="italic text-slate-500">No notes added yet</span>
                      )}
                    </span>
                    <button
                      onClick={() => {
                        setEditingNotesId(inquiry.id);
                        setNoteText(inquiry.notes || '');
                      }}
                      className="text-gym-orange hover:underline font-bold text-[11px]"
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

      {/* CONFIRM DELETE MODAL */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        itemName={inquiryToDelete ? `inquiry from ${inquiryToDelete.name}` : 'this inquiry'}
        itemType="Inquiry"
        isDeleting={isDeleting}
        error={deleteError}
      />

    </div>
  );
};

export default ManageInquiries;

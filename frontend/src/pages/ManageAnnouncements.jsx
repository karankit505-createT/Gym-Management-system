import React, { useState, useEffect } from 'react';
import { adminAPI, membershipAPI } from '../services/api';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { Megaphone, Plus, Trash2, CheckCircle, ShieldAlert } from 'lucide-react';

const ManageAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  // Delete Modal States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await membershipAPI.getStatus();
      if (res.data.success && res.data.announcements) {
        setAnnouncements(res.data.announcements);
      }
    } catch (err) {}
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');
    setLoading(true);

    try {
      const res = await adminAPI.createAnnouncement({ title, message });
      if (res.data.success) {
        setMsg('Announcement posted to member dashboards!');
        setTitle('');
        setMessage('');
        fetchAnnouncements();
      }
    } catch (err) {
      setError('Failed to post announcement.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteModal = (announcement) => {
    setItemToDelete(announcement);
    setDeleteError('');
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    setDeleteError('');
    setError('');
    setMsg('');
    try {
      const res = await adminAPI.deleteAnnouncement(itemToDelete.id);
      if (res.data.success) {
        setMsg('Announcement deleted.');
        setShowDeleteModal(false);
        setItemToDelete(null);
        fetchAnnouncements();
      }
    } catch (err) {
      setDeleteError('Failed to delete announcement.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="border-b border-slate-200 pb-5">
        <span className="text-orange-600 text-xs sm:text-sm font-bold uppercase tracking-wider block mb-1">
          Admin Control
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 uppercase tracking-tight">
          GYM ANNOUNCEMENTS & NOTICES
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-1">
          Post important notices, holiday hours, or new class schedules for all member dashboards.
        </p>
      </div>

      {msg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm p-4 rounded-lg flex items-center space-x-2.5 font-medium">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-lg font-medium">
          {error}
        </div>
      )}

      {/* CREATE ANNOUNCEMENT FORM */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5 shadow-xs">
        <h3 className="font-bold text-slate-900 text-base uppercase font-heading flex items-center space-x-2.5 border-b border-slate-100 pb-4">
          <Megaphone className="w-5 h-5 text-orange-600" />
          <span>Post New Announcement</span>
        </h3>

        <form onSubmit={handlePostSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Notice Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. New Cardio Equipment Installed"
              className="w-full h-11 bg-slate-50 border border-slate-300 rounded-lg px-3.5 text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Message Content</label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write notice details here..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-600"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="h-11 px-6 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm rounded-lg shadow-xs transition-colors flex items-center justify-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>{loading ? 'Posting Notice...' : 'Post Announcement'}</span>
          </button>
        </form>
      </div>

      {/* ANNOUNCEMENT LIST */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5 shadow-xs">
        <h3 className="font-bold text-slate-900 text-base uppercase font-heading border-b border-slate-100 pb-4">
          Active Notices ({announcements.length})
        </h3>

        {announcements.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">No announcements posted currently.</p>
        ) : (
          <div className="space-y-4">
            {announcements.map((a) => (
              <div key={a.id} className="p-5 bg-slate-50 border border-slate-200 rounded-lg flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-bold text-base text-orange-600">{a.title}</h4>
                  <p className="text-sm sm:text-base text-slate-700 mt-1.5 leading-relaxed">{a.message}</p>
                  <span className="text-xs text-slate-500 block mt-2.5 font-mono">{new Date(a.createdAt).toLocaleString()}</span>
                </div>
                <button
                  onClick={() => handleOpenDeleteModal(a)}
                  className="h-10 w-10 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                  title="Delete Notice"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CONFIRM DELETE MODAL */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.title || 'Notice'}
        itemType="Notice"
        isDeleting={isDeleting}
        error={deleteError}
      />

    </div>
  );
};

export default ManageAnnouncements;

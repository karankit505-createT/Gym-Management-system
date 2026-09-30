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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      <div className="border-b border-gym-border pb-4">
        <h1 className="text-3xl font-black text-white uppercase tracking-tight">GYM ANNOUNCEMENTS</h1>
        <p className="text-xs text-gym-muted">Post important notices, holiday hours, or new class schedules for members</p>
      </div>

      {msg && (
        <div className="bg-emerald-500/15 border border-emerald-500/50 text-emerald-300 text-xs p-3.5 rounded-xl flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{msg}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-300 text-xs p-3.5 rounded-xl">
          {error}
        </div>
      )}

      {/* CREATE ANNOUNCEMENT FORM */}
      <div className="bg-gym-card border border-gym-border/80 rounded-3xl p-6 lg:p-8 space-y-4">
        <h3 className="font-extrabold text-white text-base flex items-center space-x-2">
          <Megaphone className="w-5 h-5 text-gym-orange" />
          <span>Post New Announcement</span>
        </h3>

        <form onSubmit={handlePostSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gym-muted mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 🏋️ New Cardio Machines Arrived!"
              className="w-full bg-gym-dark border border-gym-border rounded-xl p-2.5 text-sm text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gym-muted mb-1">Message</label>
            <textarea
              rows={3}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write notice details here..."
              className="w-full bg-gym-dark border border-gym-border rounded-xl p-2.5 text-sm text-white focus:outline-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="py-3 px-6 bg-gym-orange hover:bg-gym-orangeHover text-white font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            Post Announcement
          </button>
        </form>
      </div>

      {/* ANNOUNCEMENT LIST */}
      <div className="bg-gym-card border border-gym-border/80 rounded-3xl p-6 space-y-4">
        <h3 className="font-extrabold text-white text-base">Active Notices ({announcements.length})</h3>

        {announcements.length === 0 ? (
          <p className="text-xs text-gym-muted text-center py-6">No announcements posted currently.</p>
        ) : (
          <div className="space-y-3">
            {announcements.map((a) => (
              <div key={a.id} className="p-4 bg-gym-dark/50 border border-gym-border/40 rounded-2xl flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-gym-orange">{a.title}</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{a.message}</p>
                  <span className="text-[10px] text-gym-muted block mt-2">{new Date(a.createdAt).toLocaleString()}</span>
                </div>
                <button
                  onClick={() => handleOpenDeleteModal(a)}
                  className="p-1.5 text-gym-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
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

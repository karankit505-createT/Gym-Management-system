import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { Plus, Trash2, Edit3, CheckCircle, ShieldAlert, Eye, EyeOff, X, Download } from 'lucide-react';

const ManageStaff = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  // Add / Edit Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Delete Modal States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Alerts
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    designation: 'Fitness Trainer',
    permissions: 'attendance,members_view'
  });

  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    designation: '',
    permissions: 'attendance,members_view'
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await adminAPI.getStaffList();
      if (res.data.success) {
        setStaffList(res.data.staff);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load staff members.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaffSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');

    try {
      const res = await adminAPI.addStaff(formData);
      if (res.data.success) {
        setMsg('Staff member added successfully!');
        setShowAddModal(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          password: '',
          designation: 'Fitness Trainer',
          permissions: 'attendance,members_view'
        });
        fetchStaff();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add staff.');
    }
  };

  const handleOpenEditModal = (st) => {
    setEditingStaff(st);
    setEditFormData({
      name: st.User?.name || '',
      email: st.User?.email || '',
      phone: st.User?.phone || '',
      password: '',
      designation: st.designation || '',
      permissions: st.permissions || 'attendance,members_view'
    });
    setShowEditModal(true);
  };

  const handleEditStaffSubmit = async (e) => {
    e.preventDefault();
    if (!editingStaff) return;
    setError('');
    setMsg('');

    try {
      const res = await adminAPI.updateStaff(editingStaff.id, editFormData);
      if (res.data.success) {
        setMsg('Staff details updated successfully!');
        setShowEditModal(false);
        setEditingStaff(null);
        fetchStaff();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update staff member.');
    }
  };

  // Delete Handler
  const handleOpenDeleteModal = (st) => {
    setStaffToDelete(st);
    setDeleteError('');
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!staffToDelete) return;
    setIsDeleting(true);
    setDeleteError('');

    try {
      const res = await adminAPI.deleteStaff(staffToDelete.id);
      if (res.data.success) {
        setMsg('Staff deleted successfully');
        setShowDeleteModal(false);
        setStaffToDelete(null);
        // Remove item from state or refetch
        setStaffList(prev => prev.filter(s => s.id !== staffToDelete.id));
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete staff member. Please try again.';
      setDeleteError(errorMsg);
      setError(errorMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      setExporting(true);
      await adminAPI.exportStaffCsv({});
    } catch (err) {
      setError('Failed to export staff CSV report.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gym-border pb-4">
        <div>
          <span className="text-gym-orange text-[10px] sm:text-xs font-bold uppercase tracking-widest">Admin Control</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">STAFF MANAGEMENT</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleExportCsv}
            disabled={exporting}
            className="w-full sm:w-auto px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 min-h-[44px] disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{exporting ? 'Exporting...' : 'Export Staff CSV'}</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto px-5 py-3 bg-gym-orange hover:bg-gym-orangeHover text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Staff</span>
          </button>
        </div>
      </div>

      {msg && (
        <div className="bg-emerald-500/15 border border-emerald-500/50 text-emerald-300 text-xs p-3.5 rounded-xl flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-300 text-xs p-3.5 rounded-xl flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-gym-muted">Loading staff list...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staffList.map((st) => (
            <div key={st.id} className="bg-gym-card border border-gym-border/80 rounded-3xl p-6 relative flex flex-col justify-between space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gym-orange/20 border border-gym-orange text-gym-orange font-bold text-base flex items-center justify-center">
                    {st.User?.name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{st.User?.name}</h3>
                    <p className="text-xs text-gym-orange font-semibold">{st.designation}</p>
                  </div>
                </div>

                <div className="flex space-x-1">
                  <button
                    onClick={() => handleOpenEditModal(st)}
                    className="p-1.5 text-gym-muted hover:text-gym-orange hover:bg-gym-orange/10 rounded-lg transition-colors"
                    title="Edit Staff"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenDeleteModal(st)}
                    className="p-1.5 text-gym-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete Staff"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-1 text-xs text-gym-muted border-t border-gym-border/40 pt-3">
                <p>Email: <b className="text-slate-200">{st.User?.email}</b></p>
                <p>Phone: <b className="text-slate-200">{st.User?.phone}</b></p>
                <p>Permissions: <b className="text-slate-200">{st.permissions}</b></p>
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
        itemName={staffToDelete?.User?.name || 'Staff Member'}
        itemType="staff member"
        isDeleting={isDeleting}
        error={deleteError}
      />

      {/* ADD STAFF MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#161626] border border-gym-orange/50 rounded-2xl max-w-md w-[95%] sm:w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gym-border pb-3">
              <h3 className="font-bold text-white text-base sm:text-lg">Add New Staff Account</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gym-muted hover:text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStaffSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gym-muted mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gym-dark border border-gym-border rounded-xl p-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gym-muted mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-gym-dark border border-gym-border rounded-xl p-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gym-muted mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  placeholder="10-digit mobile number"
                  className="w-full bg-gym-dark border border-gym-border rounded-xl p-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gym-muted mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-gym-dark border border-gym-border rounded-xl p-2.5 pr-10 text-sm text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gym-muted hover:text-white transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gym-muted mb-1">Designation</label>
                <input
                  type="text"
                  required
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full bg-gym-dark border border-gym-border rounded-xl p-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gym-card text-gym-muted text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gym-orange hover:bg-gym-orangeHover text-white text-xs font-bold rounded-xl shadow-lg"
                >
                  Create Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STAFF MODAL */}
      {showEditModal && editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#161626] border border-gym-orange/50 rounded-2xl max-w-md w-[95%] sm:w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gym-border pb-3">
              <h3 className="font-bold text-white text-base sm:text-lg">Edit Staff Account</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gym-muted hover:text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditStaffSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gym-muted mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full bg-gym-dark border border-gym-border rounded-xl p-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gym-muted mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full bg-gym-dark border border-gym-border rounded-xl p-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gym-muted mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  className="w-full bg-gym-dark border border-gym-border rounded-xl p-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gym-muted mb-1">New Password (Leave blank to keep unchanged)</label>
                <input
                  type="password"
                  value={editFormData.password}
                  onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                  placeholder="Enter new password"
                  className="w-full bg-gym-dark border border-gym-border rounded-xl p-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gym-muted mb-1">Designation</label>
                <input
                  type="text"
                  required
                  value={editFormData.designation}
                  onChange={(e) => setEditFormData({ ...editFormData, designation: e.target.value })}
                  className="w-full bg-gym-dark border border-gym-border rounded-xl p-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gym-card text-gym-muted text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gym-orange hover:bg-gym-orangeHover text-white text-xs font-bold rounded-xl shadow-lg"
                >
                  Update Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageStaff;

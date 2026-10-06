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
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-orange-600 text-xs sm:text-sm font-bold uppercase tracking-wider">Admin Control</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 uppercase tracking-tight mt-1">STAFF MANAGEMENT</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={handleExportCsv}
            disabled={exporting}
            className="w-full sm:w-auto px-5 h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-md shadow-xs transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{exporting ? 'Exporting...' : 'Export Staff CSV'}</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto px-5 h-11 bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm rounded-md shadow-xs transition-colors flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Staff</span>
          </button>
        </div>
      </div>

      {msg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm p-4 rounded-md flex items-center space-x-2.5 font-medium">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-md flex items-center space-x-2.5 font-medium">
          <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-slate-600 font-medium text-base">Loading staff list...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staffList.map((st) => (
            <div key={st.id} className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between space-y-4 shadow-xs">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-full bg-orange-100 border border-orange-200 text-orange-700 font-bold text-lg flex items-center justify-center font-heading">
                    {st.User?.name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg">{st.User?.name}</h3>
                    <p className="text-xs sm:text-sm text-orange-600 font-bold">{st.designation}</p>
                  </div>
                </div>

                <div className="flex space-x-1">
                  <button
                    onClick={() => handleOpenEditModal(st)}
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                    title="Edit Staff"
                  >
                    <Edit3 className="w-4.5 h-4.5" />
                  </button>
                  <button
                    onClick={() => handleOpenDeleteModal(st)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete Staff"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 text-xs sm:text-sm text-slate-600 border-t border-slate-100 pt-3.5">
                <p>Email: <b className="text-slate-900 font-medium">{st.User?.email}</b></p>
                <p>Phone: <b className="text-slate-900 font-mono font-medium">{st.User?.phone}</b></p>
                <p>Permissions: <b className="text-slate-900 font-medium">{st.permissions}</b></p>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-lg max-w-md w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base uppercase font-heading">Add New Staff Account</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStaffSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3.5 h-11 text-sm text-slate-900 focus:outline-none focus:border-orange-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3.5 h-11 text-sm text-slate-900 focus:outline-none focus:border-orange-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Phone</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  placeholder="10-digit mobile number"
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3.5 h-11 text-sm text-slate-900 focus:outline-none focus:border-orange-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-md pl-3.5 pr-11 h-11 text-sm text-slate-900 focus:outline-none focus:border-orange-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Designation</label>
                <input
                  type="text"
                  required
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3.5 h-11 text-sm text-slate-900 focus:outline-none focus:border-orange-600"
                />
              </div>

              <div className="flex justify-end space-x-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 h-11 bg-slate-100 text-slate-700 text-sm font-semibold rounded-md border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 h-11 bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold rounded-md shadow-xs"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-lg max-w-md w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base uppercase font-heading">Edit Staff Account</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditStaffSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3.5 h-11 text-sm text-slate-900 focus:outline-none focus:border-orange-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  required
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3.5 h-11 text-sm text-slate-900 focus:outline-none focus:border-orange-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Phone</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3.5 h-11 text-sm text-slate-900 focus:outline-none focus:border-orange-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">New Password (Optional)</label>
                <input
                  type="password"
                  value={editFormData.password}
                  onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                  placeholder="Enter new password"
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3.5 h-11 text-sm text-slate-900 focus:outline-none focus:border-orange-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Designation</label>
                <input
                  type="text"
                  required
                  value={editFormData.designation}
                  onChange={(e) => setEditFormData({ ...editFormData, designation: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3.5 h-11 text-sm text-slate-900 focus:outline-none focus:border-orange-600"
                />
              </div>

              <div className="flex justify-end space-x-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 h-11 bg-slate-100 text-slate-700 text-sm font-semibold rounded-md border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 h-11 bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold rounded-md shadow-xs transition-colors"
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

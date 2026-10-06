import React, { useState, useEffect } from 'react';
import { adminAPI, planAPI } from '../services/api';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { Search, ShieldAlert, Trash2, Edit3, CheckCircle, X, Download } from 'lucide-react';

const ManageMembers = () => {
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  // General Alerts
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  // Modals State
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [showEditMemberModal, setShowEditMemberModal] = useState(false);

  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Membership Form State
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [modalAction, setModalAction] = useState('activate'); // 'activate', 'extend', 'deactivate'
  const [extensionDays, setExtensionDays] = useState(30);

  // Edit Member Profile Form State
  const [editMemberForm, setEditMemberForm] = useState({
    name: '',
    email: '',
    phone: '',
    gender: 'male',
    address: ''
  });

  useEffect(() => {
    fetchMembers();
    fetchPlans();
  }, [statusFilter]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getMembers({ search, status: statusFilter });
      if (res.data.success) {
        setMembers(res.data.members);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load members.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const res = await planAPI.getPublicPlans();
      if (res.data.success) {
        setPlans(res.data.plans);
        if (res.data.plans.length > 0) setSelectedPlanId(res.data.plans[0].id);
      }
    } catch (err) {}
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMembers();
  };

  const handleUpdateMembership = async (e) => {
    e.preventDefault();
    if (!selectedMember) return;
    setError('');
    setMsg('');

    try {
      const payload = {
        action: modalAction,
        plan_id: selectedPlanId,
        extension_days: extensionDays
      };

      const res = await adminAPI.updateMemberMembership(selectedMember.id, payload);
      if (res.data.success) {
        setMsg(res.data.message);
        setShowMembershipModal(false);
        fetchMembers();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed.');
    }
  };

  const handleOpenEditModal = (m) => {
    setSelectedMember(m);
    setEditMemberForm({
      name: m.name || '',
      email: m.email || '',
      phone: m.phone || '',
      gender: m.gender || 'male',
      address: m.address || ''
    });
    setShowEditMemberModal(true);
  };

  const handleUpdateMemberProfile = async (e) => {
    e.preventDefault();
    if (!selectedMember) return;
    setError('');
    setMsg('');

    try {
      const res = await adminAPI.updateMember(selectedMember.id, editMemberForm);
      if (res.data.success) {
        setMsg('Member profile updated successfully!');
        setShowEditMemberModal(false);
        setSelectedMember(null);
        fetchMembers();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update member profile.');
    }
  };

  // Delete Handlers
  const handleOpenDeleteModal = (m) => {
    setMemberToDelete(m);
    setDeleteError('');
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;
    setIsDeleting(true);
    setDeleteError('');

    try {
      const res = await adminAPI.deleteMember(memberToDelete.id);
      if (res.data.success) {
        setMsg('Member deleted successfully');
        setShowDeleteModal(false);
        setMemberToDelete(null);
        // Remove item from state
        setMembers(prev => prev.filter(m => m.id !== memberToDelete.id));
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete member. Please try again.';
      setDeleteError(errorMsg);
      setError(errorMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      setExporting(true);
      await adminAPI.exportMembersCsv({ search, status: statusFilter });
    } catch (err) {
      setError('Failed to export members CSV report.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-orange-600 text-xs sm:text-sm font-bold uppercase tracking-wider">Admin Control</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 uppercase tracking-tight mt-1">MEMBER MANAGEMENT</h1>
        </div>

        <button
          onClick={handleExportCsv}
          disabled={exporting}
          className="w-full sm:w-auto px-5 h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-md shadow-xs transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{exporting ? 'Exporting CSV...' : 'Export Members CSV'}</span>
        </button>
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

      {/* FILTER & SEARCH STRIP */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 w-full flex gap-2.5">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Name, Email, or Phone..."
              className="w-full bg-slate-50 border border-slate-300 rounded-md pl-11 pr-4 h-11 text-sm text-slate-900 focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600 font-medium"
            />
          </div>
          <button
            type="submit"
            className="px-5 h-11 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm rounded-md transition-colors shadow-xs"
          >
            Search
          </button>
        </form>

        {/* Status Filter Buttons */}
        <div className="flex space-x-1.5 bg-slate-100 p-1.5 rounded-md border border-slate-200 text-xs sm:text-sm w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setStatusFilter('')}
            className={`px-3.5 h-9 rounded-md font-semibold transition-colors ${
              statusFilter === '' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Members
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3.5 h-9 rounded-md font-semibold transition-colors ${
              statusFilter === 'active' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setStatusFilter('expiring_soon')}
            className={`px-3.5 h-9 rounded-md font-semibold transition-colors ${
              statusFilter === 'expiring_soon' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Expiring Soon
          </button>
          <button
            onClick={() => setStatusFilter('expired')}
            className={`px-3.5 h-9 rounded-md font-semibold transition-colors ${
              statusFilter === 'expired' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Expired
          </button>
        </div>

      </div>

      {/* MEMBERS TABLE */}
      {loading ? (
        <div className="text-center py-20 text-slate-600 font-medium text-base">Loading members list...</div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-800 table-clean">
              <thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wider border-b border-slate-200 font-bold">
                <tr>
                  <th className="py-4 px-6">Member</th>
                  <th className="py-4 px-6">Contact Info</th>
                  <th className="py-4 px-6">Active Plan</th>
                  <th className="py-4 px-6">End Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {members.map((m) => {
                  const latestMem = m.Memberships && m.Memberships[0];
                  const isActive = latestMem && latestMem.status === 'active';

                  return (
                    <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3.5">
                          <div className="w-10 h-10 rounded-full bg-orange-100 border border-orange-200 text-orange-700 font-bold flex items-center justify-center text-sm font-heading">
                            {m.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm sm:text-base">{m.name}</p>
                            <span className="text-xs text-slate-400 font-mono">ID: #{m.id}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-sm">
                        <p className="text-slate-900 font-medium">{m.email}</p>
                        <p className="text-slate-500 font-mono text-xs mt-0.5">{m.phone}</p>
                      </td>

                      <td className="py-4 px-6 font-bold text-slate-900 text-sm">
                        {latestMem ? latestMem.Plan?.name : 'No Plan'}
                      </td>

                      <td className="py-4 px-6 text-sm font-mono text-slate-600">
                        {latestMem ? latestMem.end_date : 'N/A'}
                      </td>

                      <td className="py-4 px-6">
                        {isActive ? (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-3 py-1 rounded-md uppercase">
                            ACTIVE
                          </span>
                        ) : (
                          <span className="bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold px-3 py-1 rounded-md uppercase">
                            EXPIRED
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(m)}
                          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                          title="Edit Member Details"
                        >
                          <Edit3 className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedMember(m);
                            setModalAction('activate');
                            setShowMembershipModal(true);
                          }}
                          className="py-1.5 px-3 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded-md text-xs font-bold transition-colors"
                        >
                          Manual Action
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(m)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete Member"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        itemName={memberToDelete?.name || 'Member Account'}
        itemType="member account"
        isDeleting={isDeleting}
        error={deleteError}
      />

      {/* MANUAL MEMBERSHIP MODAL */}
      {showMembershipModal && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-lg max-w-md w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base uppercase font-heading">Membership Control: {selectedMember.name}</h3>
              <button onClick={() => setShowMembershipModal(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateMembership} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Select Action</label>
                <select
                  value={modalAction}
                  onChange={(e) => setModalAction(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3.5 h-11 text-sm text-slate-900 focus:outline-none focus:border-orange-600 font-semibold"
                >
                  <option value="activate">Activate / Assign Plan</option>
                  <option value="extend">Extend Existing Plan (Days)</option>
                  <option value="deactivate">Deactivate Membership</option>
                </select>
              </div>

              {modalAction === 'activate' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Choose Plan</label>
                  <select
                    value={selectedPlanId}
                    onChange={(e) => setSelectedPlanId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-md px-3.5 h-11 text-sm text-slate-900 focus:outline-none focus:border-orange-600 font-semibold"
                  >
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} - ₹{parseFloat(p.price).toFixed(2)} ({p.duration_days} Days)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {modalAction === 'extend' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Extension Days</label>
                  <input
                    type="number"
                    value={extensionDays}
                    onChange={(e) => setExtensionDays(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-md px-3.5 h-11 text-sm text-slate-900 focus:outline-none focus:border-orange-600 font-medium"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full h-11 bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm rounded-md shadow-xs transition-colors"
              >
                Apply Membership Update
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MEMBER PROFILE MODAL */}
      {showEditMemberModal && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-lg max-w-md w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base uppercase font-heading">Edit Member Profile</h3>
              <button onClick={() => setShowEditMemberModal(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateMemberProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  value={editMemberForm.name}
                  onChange={(e) => setEditMemberForm({ ...editMemberForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3.5 h-11 text-sm text-slate-900 focus:outline-none focus:border-orange-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  required
                  value={editMemberForm.email}
                  onChange={(e) => setEditMemberForm({ ...editMemberForm, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3.5 h-11 text-sm text-slate-900 focus:outline-none focus:border-orange-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Phone</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={editMemberForm.phone}
                  onChange={(e) => setEditMemberForm({ ...editMemberForm, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3.5 h-11 text-sm text-slate-900 focus:outline-none focus:border-orange-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Gender</label>
                <select
                  value={editMemberForm.gender}
                  onChange={(e) => setEditMemberForm({ ...editMemberForm, gender: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3.5 h-11 text-sm text-slate-900 focus:outline-none focus:border-orange-600"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Address</label>
                <textarea
                  rows={2}
                  value={editMemberForm.address}
                  onChange={(e) => setEditMemberForm({ ...editMemberForm, address: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md p-3 text-sm text-slate-900 focus:outline-none focus:border-orange-600"
                />
              </div>

              <div className="flex justify-end space-x-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditMemberModal(false)}
                  className="px-4 h-11 bg-slate-100 text-slate-700 text-sm font-semibold rounded-md border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 h-11 bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold rounded-md shadow-xs transition-colors"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageMembers;

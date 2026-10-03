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
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gym-border pb-4">
        <div>
          <span className="text-gym-orange text-[10px] sm:text-xs font-bold uppercase tracking-widest">Admin Control</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">MEMBER MANAGEMENT</h1>
        </div>

        <button
          onClick={handleExportCsv}
          disabled={exporting}
          className="w-full sm:w-auto px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 min-h-[44px] disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{exporting ? 'Exporting CSV...' : 'Export Members CSV'}</span>
        </button>
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

      {/* FILTER & SEARCH STRIP */}
      <div className="bg-gym-card border border-gym-border/80 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 w-full flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gym-muted absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Name, Email, or Phone..."
              className="w-full bg-gym-dark border border-gym-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-gym-orange"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-gym-orange hover:bg-gym-orangeHover text-white font-bold text-xs rounded-xl"
          >
            Search
          </button>
        </form>

        {/* Status Filter Buttons */}
        <div className="flex space-x-1.5 bg-gym-dark p-1 rounded-xl border border-gym-border text-xs w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setStatusFilter('')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              statusFilter === '' ? 'bg-gym-orange text-white' : 'text-gym-muted hover:text-white'
            }`}
          >
            All Members
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              statusFilter === 'active' ? 'bg-gym-orange text-white' : 'text-gym-muted hover:text-white'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setStatusFilter('expiring_soon')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              statusFilter === 'expiring_soon' ? 'bg-gym-orange text-white' : 'text-gym-muted hover:text-white'
            }`}
          >
            Expiring Soon
          </button>
          <button
            onClick={() => setStatusFilter('expired')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              statusFilter === 'expired' ? 'bg-gym-orange text-white' : 'text-gym-muted hover:text-white'
            }`}
          >
            Expired
          </button>
        </div>

      </div>

      {/* MEMBERS TABLE */}
      {loading ? (
        <div className="text-center py-20 text-gym-muted">Loading members list...</div>
      ) : (
        <div className="bg-gym-card border border-gym-border/80 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-gym-dark/80 text-xs text-gym-muted uppercase border-b border-gym-border">
                <tr>
                  <th className="py-4 px-6">Member</th>
                  <th className="py-4 px-6">Contact Info</th>
                  <th className="py-4 px-6">Active Plan</th>
                  <th className="py-4 px-6">End Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gym-border/50">
                {members.map((m) => {
                  const latestMem = m.Memberships && m.Memberships[0];
                  const isActive = latestMem && latestMem.status === 'active';

                  return (
                    <tr key={m.id} className="hover:bg-gym-cardHover">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-full bg-gym-orange/20 text-gym-orange font-bold flex items-center justify-center text-xs">
                            {m.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-white">{m.name}</p>
                            <span className="text-[10px] text-gym-muted">ID: #{m.id}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-xs">
                        <p className="text-slate-200">{m.email}</p>
                        <p className="text-gym-muted">{m.phone}</p>
                      </td>

                      <td className="py-4 px-6 font-semibold text-white text-xs">
                        {latestMem ? latestMem.Plan?.name : 'No Plan'}
                      </td>

                      <td className="py-4 px-6 text-xs font-mono text-gym-muted">
                        {latestMem ? latestMem.end_date : 'N/A'}
                      </td>

                      <td className="py-4 px-6">
                        {isActive ? (
                          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase">
                            ACTIVE
                          </span>
                        ) : (
                          <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase">
                            EXPIRED
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(m)}
                          className="p-1.5 text-gym-muted hover:text-gym-orange hover:bg-gym-orange/10 rounded-lg transition-colors"
                          title="Edit Member Details"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedMember(m);
                            setModalAction('activate');
                            setShowMembershipModal(true);
                          }}
                          className="py-1 px-2.5 bg-gym-orange/20 hover:bg-gym-orange text-gym-orange hover:text-white border border-gym-orange/30 rounded-lg text-xs font-semibold transition-colors"
                        >
                          Manual Action
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(m)}
                          className="p-1.5 text-gym-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete Member"
                        >
                          <Trash2 className="w-4 h-4" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#161626] border border-gym-orange/50 rounded-2xl max-w-md w-[95%] sm:w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gym-border pb-3">
              <h3 className="font-bold text-white text-sm sm:text-base">Membership Control: {selectedMember.name}</h3>
              <button onClick={() => setShowMembershipModal(false)} className="text-gym-muted hover:text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateMembership} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gym-muted mb-1">Select Action</label>
                <select
                  value={modalAction}
                  onChange={(e) => setModalAction(e.target.value)}
                  className="w-full bg-gym-dark border border-gym-border rounded-xl p-3 text-sm text-white focus:outline-none min-h-[44px]"
                >
                  <option value="activate">Activate / Assign Plan</option>
                  <option value="extend">Extend Existing Plan (Days)</option>
                  <option value="deactivate">Deactivate Membership</option>
                </select>
              </div>

              {modalAction === 'activate' && (
                <div>
                  <label className="block text-xs font-medium text-gym-muted mb-1">Choose Plan</label>
                  <select
                    value={selectedPlanId}
                    onChange={(e) => setSelectedPlanId(e.target.value)}
                    className="w-full bg-gym-dark border border-gym-border rounded-xl p-3 text-sm text-white focus:outline-none min-h-[44px]"
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
                  <label className="block text-xs font-medium text-gym-muted mb-1">Extension Days</label>
                  <input
                    type="number"
                    value={extensionDays}
                    onChange={(e) => setExtensionDays(e.target.value)}
                    className="w-full bg-gym-dark border border-gym-border rounded-xl p-3 text-sm text-white focus:outline-none min-h-[44px]"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gym-orange hover:bg-gym-orangeHover text-white font-bold rounded-xl shadow-lg transition-all min-h-[44px]"
              >
                Apply Membership Update
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MEMBER PROFILE MODAL */}
      {showEditMemberModal && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#161626] border border-gym-orange/50 rounded-2xl max-w-md w-[95%] sm:w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gym-border pb-3">
              <h3 className="font-bold text-white text-sm sm:text-base">Edit Member Profile</h3>
              <button onClick={() => setShowEditMemberModal(false)} className="text-gym-muted hover:text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateMemberProfile} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gym-muted mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editMemberForm.name}
                  onChange={(e) => setEditMemberForm({ ...editMemberForm, name: e.target.value })}
                  className="w-full bg-gym-dark border border-gym-border rounded-xl p-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gym-muted mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={editMemberForm.email}
                  onChange={(e) => setEditMemberForm({ ...editMemberForm, email: e.target.value })}
                  className="w-full bg-gym-dark border border-gym-border rounded-xl p-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gym-muted mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={editMemberForm.phone}
                  onChange={(e) => setEditMemberForm({ ...editMemberForm, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  className="w-full bg-gym-dark border border-gym-border rounded-xl p-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gym-muted mb-1">Gender</label>
                <select
                  value={editMemberForm.gender}
                  onChange={(e) => setEditMemberForm({ ...editMemberForm, gender: e.target.value })}
                  className="w-full bg-gym-dark border border-gym-border rounded-xl p-2.5 text-sm text-white focus:outline-none"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gym-muted mb-1">Address</label>
                <textarea
                  rows={2}
                  value={editMemberForm.address}
                  onChange={(e) => setEditMemberForm({ ...editMemberForm, address: e.target.value })}
                  className="w-full bg-gym-dark border border-gym-border rounded-xl p-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditMemberModal(false)}
                  className="px-4 py-2 bg-gym-card text-gym-muted text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gym-orange hover:bg-gym-orangeHover text-white text-xs font-bold rounded-xl shadow-lg"
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

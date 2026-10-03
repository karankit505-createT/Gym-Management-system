import React, { useState, useEffect } from 'react';
import { planAPI } from '../services/api';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { Award, Plus, Edit3, Trash2, CheckCircle, X, ShieldAlert } from 'lucide-react';

const ManagePlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  // Delete Modal States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    duration_days: 30,
    price: '',
    description: '',
    is_active: true
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await planAPI.getAdminPlans();
      if (res.data.success) {
        setPlans(res.data.plans);
      }
    } catch (err) {
      setError('Failed to load plans.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingPlan(null);
    setFormData({ name: '', duration_days: 30, price: '', description: '', is_active: true });
    setShowModal(true);
  };

  const handleOpenEditModal = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      duration_days: plan.duration_days,
      price: plan.price,
      description: plan.description || '',
      is_active: plan.is_active
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');

    try {
      if (editingPlan) {
        const res = await planAPI.updatePlan(editingPlan.id, formData);
        if (res.data.success) setMsg('Plan updated successfully!');
      } else {
        const res = await planAPI.createPlan(formData);
        if (res.data.success) setMsg('New plan created!');
      }
      setShowModal(false);
      fetchPlans();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save plan.');
    }
  };

  const handleOpenDeleteModal = (plan) => {
    setPlanToDelete(plan);
    setDeleteError('');
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!planToDelete) return;
    setIsDeleting(true);
    setDeleteError('');
    setError('');
    setMsg('');
    try {
      const res = await planAPI.deletePlan(planToDelete.id);
      if (res.data.success) {
        setMsg(res.data.message || 'Plan deleted successfully.');
        setShowDeleteModal(false);
        setPlanToDelete(null);
        fetchPlans();
      }
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Failed to delete plan.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gym-border pb-4">
        <div>
          <span className="text-gym-orange text-[10px] sm:text-xs font-bold uppercase tracking-widest">Admin Control</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">MEMBERSHIP PLAN CRUD</h1>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="w-full sm:w-auto px-5 py-3 bg-gym-orange hover:bg-gym-orangeHover text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Plan</span>
        </button>
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

      {loading ? (
        <div className="text-center py-20 text-gym-muted">Loading plans...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {plans.map((p) => (
            <div key={p.id} className="bg-gym-card border border-gym-border/80 rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-extrabold text-white text-base sm:text-lg">{p.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    p.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {p.is_active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>

                <div className="my-3">
                  <span className="text-2xl sm:text-3xl font-black text-white">₹{parseFloat(p.price).toFixed(2)}</span>
                  <span className="text-xs text-gym-muted ml-1">/ {p.duration_days} Days</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-gym-dark/50 p-3 rounded-xl border border-gym-border/40">
                  {p.description}
                </p>
              </div>

              <div className="flex space-x-2 pt-2 border-t border-gym-border/40">
                <button
                  onClick={() => handleOpenEditModal(p)}
                  className="flex-1 py-2.5 bg-gym-dark hover:bg-gym-cardHover text-slate-200 border border-gym-border rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1 min-h-[44px]"
                >
                  <Edit3 className="w-3.5 h-3.5 text-gym-orange" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => handleOpenDeleteModal(p)}
                  className="p-2.5 text-gym-muted hover:text-red-400 hover:bg-red-500/10 rounded-xl border border-gym-border transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT PLAN MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#161626] border border-gym-orange/50 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-white text-lg border-b border-gym-border pb-3">
              {editingPlan ? 'Edit Membership Plan' : 'Create New Membership Plan'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gym-muted mb-1">Plan Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gym-dark border border-gym-border rounded-xl p-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gym-muted mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    required
                    value={formData.duration_days}
                    onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
                    className="w-full bg-gym-dark border border-gym-border rounded-xl p-2.5 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gym-muted mb-1">Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-gym-dark border border-gym-border rounded-xl p-2.5 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gym-muted mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-gym-dark border border-gym-border rounded-xl p-2.5 text-sm text-white focus:outline-none"
                ></textarea>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-gym-orange bg-gym-dark rounded focus:ring-0"
                />
                <label htmlFor="is_active" className="text-xs text-slate-200">Plan Is Active & Visible Publicly</label>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gym-card text-gym-muted text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gym-orange hover:bg-gym-orangeHover text-white text-xs font-bold rounded-xl shadow-lg"
                >
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        itemName={planToDelete?.name || 'Plan'}
        itemType="Plan"
        isDeleting={isDeleting}
        error={deleteError}
      />

    </div>
  );
};

export default ManagePlans;

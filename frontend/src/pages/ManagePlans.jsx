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
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-orange-600 text-xs sm:text-sm font-bold uppercase tracking-wider">Admin Control</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 uppercase">MEMBERSHIP PLANS MANAGEMENT</h1>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="w-full sm:w-auto h-11 px-5 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm rounded-lg shadow-xs transition-colors flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Plan</span>
        </button>
      </div>

      {msg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm p-4 rounded-lg flex items-center space-x-2.5">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-medium">{msg}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-lg font-medium">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-slate-500 text-base font-medium">Loading membership plans...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {plans.map((p) => (
            <div key={p.id} className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col justify-between space-y-5 shadow-xs hover:border-slate-300 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold font-heading text-slate-900 text-xl uppercase tracking-tight">{p.name}</h3>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-md uppercase border ${
                    p.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {p.is_active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>

                <div className="my-4">
                  <span className="text-3xl sm:text-4xl font-black font-sans text-slate-900">₹{parseFloat(p.price).toFixed(2)}</span>
                  <span className="text-sm text-slate-500 font-medium ml-1.5">/ {p.duration_days} Days</span>
                </div>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
                  {p.description || 'No description provided.'}
                </p>
              </div>

              <div className="flex items-center space-x-3 pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleOpenEditModal(p)}
                  className="flex-1 h-11 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <Edit3 className="w-4 h-4 text-orange-600" />
                  <span>Edit Plan</span>
                </button>

                <button
                  onClick={() => handleOpenDeleteModal(p)}
                  className="h-11 w-11 flex items-center justify-center text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg border border-slate-200 transition-colors shrink-0"
                  title="Delete Plan"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT PLAN MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 sm:p-8 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-900 text-lg uppercase font-heading">
                {editingPlan ? 'Edit Membership Plan' : 'Create New Membership Plan'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-md">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Plan Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Gold Quarterly"
                  className="w-full h-11 bg-slate-50 border border-slate-300 rounded-lg px-3.5 text-sm text-slate-900 focus:outline-none focus:border-orange-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Duration (Days)</label>
                  <input
                    type="number"
                    required
                    value={formData.duration_days}
                    onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
                    className="w-full h-11 bg-slate-50 border border-slate-300 rounded-lg px-3.5 text-sm text-slate-900 focus:outline-none focus:border-orange-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full h-11 bg-slate-50 border border-slate-300 rounded-lg px-3.5 text-sm text-slate-900 focus:outline-none focus:border-orange-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter plan details and inclusions..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900 focus:outline-none focus:border-orange-600"
                ></textarea>
              </div>

              <div className="flex items-center space-x-2.5 pt-1">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-5 h-5 text-orange-600 bg-slate-50 rounded border-slate-300 focus:ring-orange-500 cursor-pointer"
                />
                <label htmlFor="is_active" className="text-sm text-slate-700 font-medium cursor-pointer">Plan Is Active & Visible Publicly</label>
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="h-11 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg border border-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-11 px-5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg shadow-xs transition-colors"
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

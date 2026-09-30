import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { User, Phone, MapPin, Upload, Lock, ShieldCheck, CheckCircle2, Loader2, Eye, EyeOff } from 'lucide-react';

const MemberProfile = () => {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    gender: 'male',
    dob: ''
  });

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const [loading, setLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');
  const [passMsg, setPassMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        gender: user.gender || 'male',
        dob: user.dob || ''
      });
      if (user.photo) {
        setPhotoPreview(`http://localhost:5000/uploads/${user.photo}`);
      }
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setProfileMsg('');
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      if (photo) {
        data.append('photo', photo);
      }

      const res = await userAPI.updateProfile(data);
      if (res.data.success) {
        updateUser(res.data.user);
        setProfileMsg('Profile details updated successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPassMsg('');
    setPassLoading(true);

    try {
      const res = await userAPI.changePassword({ currentPassword, newPassword });
      if (res.data.success) {
        setPassMsg('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="border-b border-gym-border pb-4">
        <h1 className="text-3xl font-black text-white uppercase tracking-tight">MY PROFILE</h1>
        <p className="text-xs text-gym-muted">Update your contact details, profile picture, or security password</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-300 text-xs p-3.5 rounded-xl flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* EDIT PROFILE DETAILS */}
      <div className="bg-gym-card border border-gym-border/80 rounded-3xl p-6 lg:p-8">
        <h3 className="text-lg font-extrabold text-white mb-6 border-b border-gym-border/50 pb-3">Personal Information</h3>

        {profileMsg && (
          <div className="mb-4 bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs p-3 rounded-xl flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{profileMsg}</span>
          </div>
        )}

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          
          {/* Avatar upload */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-gym-orange/20 border-2 border-gym-orange overflow-hidden flex items-center justify-center text-gym-orange font-bold text-xl uppercase">
              {photoPreview ? (
                <img src={photoPreview} alt={user?.name} className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0) || 'U'
              )}
            </div>
            <div>
              <label className="cursor-pointer bg-gym-dark hover:bg-gym-cardHover text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold border border-gym-border inline-flex items-center space-x-2">
                <Upload className="w-4 h-4 text-gym-orange" />
                <span>Upload New Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      setPhoto(e.target.files[0]);
                      setPhotoPreview(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-gym-muted mt-1">Supports JPG, PNG, WEBP (Max 5MB)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gym-muted mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-gym-dark border border-gym-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gym-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gym-muted mb-1">Email Address (Read-only)</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full bg-gym-dark/50 border border-gym-border/40 rounded-xl px-4 py-2.5 text-sm text-gym-muted cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gym-muted mb-1">Phone Number</label>
              <input
                type="tel"
                maxLength={10}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                placeholder="10-digit mobile number"
                className="w-full bg-gym-dark border border-gym-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gym-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gym-muted mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full bg-gym-dark border border-gym-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gym-orange"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gym-muted mb-1">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-gym-dark border border-gym-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gym-orange"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="py-3 px-6 bg-gym-orange hover:bg-gym-orangeHover text-white font-bold rounded-xl shadow-lg transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Save Profile Changes</span>}
          </button>
        </form>

      </div>

      {/* CHANGE PASSWORD */}
      <div className="bg-gym-card border border-gym-border/80 rounded-3xl p-6 lg:p-8">
        <h3 className="text-lg font-extrabold text-white mb-6 border-b border-gym-border/50 pb-3">Security & Password</h3>

        {passMsg && (
          <div className="mb-4 bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs p-3 rounded-xl flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{passMsg}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-medium text-gym-muted mb-1">Current Password</label>
            <div className="relative">
              <input
                type={showCurrentPass ? 'text' : 'password'}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gym-dark border border-gym-border rounded-xl pl-4 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-gym-orange"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                className="absolute right-3.5 top-3 text-gym-muted hover:text-white transition-colors focus:outline-none"
                title={showCurrentPass ? 'Hide password' : 'Show password'}
              >
                {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gym-muted mb-1">New Password</label>
            <div className="relative">
              <input
                type={showNewPass ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gym-dark border border-gym-border rounded-xl pl-4 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-gym-orange"
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-3.5 top-3 text-gym-muted hover:text-white transition-colors focus:outline-none"
                title={showNewPass ? 'Hide password' : 'Show password'}
              >
                {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={passLoading}
            className="py-3 px-6 bg-gym-card hover:bg-gym-cardHover border border-gym-border text-white font-bold rounded-xl transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            {passLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Update Password</span>}
          </button>
        </form>
      </div>

    </div>
  );
};

export default MemberProfile;

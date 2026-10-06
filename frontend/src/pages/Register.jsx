import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { Dumbbell, User, Mail, Phone, Lock, Calendar, MapPin, Upload, Loader2, ShieldCheck, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: 'male',
    dob: '',
    address: ''
  });

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 10);
    }
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    if (formData.phone.length !== 10) {
      return setError('Please enter a valid 10-digit mobile number');
    }

    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key !== 'confirmPassword') {
          data.append(key, formData[key]);
        }
      });
      if (photo) {
        data.append('photo', photo);
      }

      const res = await authAPI.register(data);
      if (res.data.success) {
        const { token, user } = res.data;
        loginUser(user, token);
        navigate('/member/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10 bg-slate-50">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-lg p-6 sm:p-10 shadow-sm space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex p-3 bg-red-50 rounded-md border border-red-100 mb-1">
            <Dumbbell className="w-7 h-7 text-red-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 uppercase tracking-wide">CREATE MEMBER ACCOUNT</h2>
          <p className="text-xs text-slate-500">Join IronPulse Gym today and activate your member privileges</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-md flex items-center space-x-2.5">
            <ShieldCheck className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          
          {/* Row 1: Name & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Vikram Malhotra"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-md pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none transition-all min-h-[42px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="vikram@gmail.com"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-md pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none transition-all min-h-[42px]"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Phone & Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Phone Number *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  name="phone"
                  required
                  maxLength={10}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210 (10 digits)"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-md pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none transition-all min-h-[42px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-md px-4 py-2.5 text-xs text-slate-900 focus:outline-none transition-all min-h-[42px]"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Row 3: Passwords */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-md pl-10 pr-10 py-2.5 text-xs text-slate-900 focus:outline-none transition-all min-h-[42px]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 transition-colors focus:outline-none"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Confirm Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-md pl-10 pr-10 py-2.5 text-xs text-slate-900 focus:outline-none transition-all min-h-[42px]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 transition-colors focus:outline-none"
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Row 4: DOB & Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Date of Birth</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="date"
                  name="dob"
                  max={todayStr}
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-md pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none transition-all min-h-[42px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Address</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="City, Street, Zip"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-md pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none transition-all min-h-[42px]"
                />
              </div>
            </div>
          </div>

          {/* Profile Photo Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Profile Photo (Optional)</label>
            <div className="flex items-center space-x-4 bg-slate-50 p-3.5 rounded-md border border-slate-200">
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-12 h-12 rounded-full object-cover border border-red-600" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                  <User className="w-6 h-6" />
                </div>
              )}
              <label className="cursor-pointer bg-white hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-md text-xs font-semibold border border-slate-300 flex items-center space-x-2 transition-colors">
                <Upload className="w-4 h-4 text-red-600" />
                <span>Upload Photo</span>
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold text-xs rounded-md shadow-sm transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 mt-4 min-h-[44px]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                <span>Register & Activate Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

        <div className="pt-2 text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="text-red-600 font-semibold hover:underline">
            Log in to your Portal
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;

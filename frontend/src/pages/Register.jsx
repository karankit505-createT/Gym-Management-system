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
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl bg-gym-card border border-gym-border/80 rounded-3xl p-8 shadow-2xl">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex p-3 bg-gym-orange/20 rounded-2xl border border-gym-orange/40 mb-2">
            <Dumbbell className="w-8 h-8 text-gym-orange" />
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">CREATE MEMBER ACCOUNT</h2>
          <p className="text-xs text-gym-muted">Join IronPulse Gym today and transform your fitness journey</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-300 text-xs p-3 rounded-xl flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          
          {/* Row 1: Name & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gym-muted mb-1">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-gym-muted absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full bg-gym-dark border border-gym-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-gym-orange"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gym-muted mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gym-muted absolute left-3.5 top-3" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full bg-gym-dark border border-gym-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-gym-orange"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Phone & Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gym-muted mb-1">Phone Number *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gym-muted absolute left-3.5 top-3" />
                <input
                  type="tel"
                  name="phone"
                  required
                  maxLength={10}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210 (10 digits)"
                  className="w-full bg-gym-dark border border-gym-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-gym-orange"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gym-muted mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-gym-dark border border-gym-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gym-orange"
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
              <label className="block text-xs font-medium text-gym-muted mb-1">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gym-muted absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-gym-dark border border-gym-border rounded-xl pl-10 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-gym-orange"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-gym-muted hover:text-white transition-colors focus:outline-none"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gym-muted mb-1">Confirm Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gym-muted absolute left-3.5 top-3" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-gym-dark border border-gym-border rounded-xl pl-10 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-gym-orange"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-3 text-gym-muted hover:text-white transition-colors focus:outline-none"
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
              <label className="block text-xs font-medium text-gym-muted mb-1">Date of Birth</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-gym-muted absolute left-3.5 top-3" />
                <input
                  type="date"
                  name="dob"
                  max={todayStr}
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full bg-gym-dark border border-gym-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-gym-orange"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gym-muted mb-1">Address</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-gym-muted absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="City, Street, Zip"
                  className="w-full bg-gym-dark border border-gym-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-gym-orange"
                />
              </div>
            </div>
          </div>

          {/* Profile Photo Upload */}
          <div>
            <label className="block text-xs font-medium text-gym-muted mb-1">Profile Photo (Optional)</label>
            <div className="flex items-center space-x-4 bg-gym-dark p-3 rounded-xl border border-gym-border">
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-12 h-12 rounded-full object-cover border border-gym-orange" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gym-card flex items-center justify-center text-gym-muted">
                  <User className="w-6 h-6" />
                </div>
              )}
              <label className="cursor-pointer bg-gym-card hover:bg-gym-cardHover text-slate-200 px-4 py-2 rounded-lg text-xs font-semibold border border-gym-border flex items-center space-x-2">
                <Upload className="w-4 h-4 text-gym-orange" />
                <span>Upload Photo</span>
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gym-orange hover:bg-gym-orangeHover text-white font-bold rounded-xl shadow-lg shadow-gym-orange/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 mt-4"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                <span>Register & Open Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

        <div className="mt-6 text-center text-xs text-gym-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-gym-orange font-bold hover:underline">
            Login Here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;

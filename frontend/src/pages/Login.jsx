import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { Dumbbell, Lock, Mail, Phone, Loader2, ArrowRight, ShieldCheck, KeyRound, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // OTP Verification state for unverified accounts
  const [otpRequired, setOtpRequired] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpDebugCode, setOtpDebugCode] = useState('');

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authAPI.login({ identifier, password });
      if (res.data.success) {
        const { token, user } = res.data;
        loginUser(user, token);

        // Redirect based on role
        if (user.role === 'admin') navigate('/admin/dashboard');
        else if (user.role === 'staff') navigate('/staff/dashboard');
        else navigate('/member/dashboard');
      }
    } catch (err) {
      if (err.response?.data?.requiresOtp) {
        setOtpRequired(true);
        setUnverifiedEmail(err.response.data.email);
        setOtpDebugCode(err.response.data.otpDebug || '');
      } else {
        setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authAPI.verifyOtp({ email: unverifiedEmail, otp_code: otpCode });
      if (res.data.success) {
        const { token, user } = res.data;
        loginUser(user, token);
        navigate('/member/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP code.');
    } finally {
      setLoading(false);
    }
  };

  // Quick helper to fill demo credentials
  const fillDemoAccount = (roleType) => {
    if (roleType === 'admin') {
      setIdentifier('admin@ironpulse.com');
      setPassword('admin123');
    } else if (roleType === 'staff') {
      setIdentifier('staff@ironpulse.com');
      setPassword('staff123');
    } else {
      setIdentifier('member@ironpulse.com');
      setPassword('member123');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10 bg-slate-50">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex p-3 bg-red-50 rounded-md border border-red-100 mb-1">
            <Dumbbell className="w-7 h-7 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-slate-900 uppercase tracking-wide">
            {otpRequired ? 'Verify OTP Code' : 'Portal Sign In'}
          </h2>
          <p className="text-xs text-slate-500">
            {otpRequired ? `Enter 6-digit code sent to ${unverifiedEmail}` : 'Sign in to access your gym membership dashboard'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-md flex items-center space-x-2.5">
            <ShieldCheck className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* OTP Input Form */}
        {otpRequired ? (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            {otpDebugCode && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-md text-center font-mono">
                Demo Dev OTP: <b>{otpDebugCode}</b>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Enter 6-Digit OTP</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-md pl-11 pr-4 py-2.5 text-center tracking-widest text-lg font-mono font-bold text-slate-900 focus:outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-medium text-xs rounded-md shadow-sm transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 min-h-[44px]"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Verify OTP & Sign In</span>}
            </button>
          </form>
        ) : (
          /* Standard Login Form */
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Email or Phone Number</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin@ironpulse.com or phone"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-md pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none transition-all min-h-[42px]"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Password</label>
                <Link to="/forgot-password" className="text-xs text-red-600 hover:text-red-700 hover:underline font-semibold">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold text-xs rounded-md shadow-sm transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 min-h-[44px]"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  <span>Sign In to Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Demo Account Quick Fill Helper */}
        <div className="pt-4 border-t border-slate-200 text-center space-y-2.5">
          <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Quick Demo Login Accounts</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount('member')}
              className="py-2 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-medium rounded-md transition-colors min-h-[38px] flex items-center justify-center"
            >
              Member
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('staff')}
              className="py-2 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-medium rounded-md transition-colors min-h-[38px] flex items-center justify-center"
            >
              Staff
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('admin')}
              className="py-2 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-medium rounded-md transition-colors min-h-[38px] flex items-center justify-center"
            >
              Admin
            </button>
          </div>
        </div>

        <div className="pt-2 text-center text-xs text-slate-500">
          Don't have a gym account yet?{' '}
          <Link to="/register" className="text-red-600 font-semibold hover:underline">
            Register Here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;

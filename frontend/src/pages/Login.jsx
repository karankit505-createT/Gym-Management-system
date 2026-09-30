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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-gym-card border border-gym-border/80 rounded-3xl p-8 shadow-2xl glow-orange">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex p-3 bg-gym-orange/20 rounded-2xl border border-gym-orange/40 mb-2">
            <Dumbbell className="w-8 h-8 text-gym-orange" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">
            {otpRequired ? 'Verify Your OTP' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-gym-muted">
            {otpRequired ? `Enter 6-digit code sent to ${unverifiedEmail}` : 'Sign in to access your gym membership dashboard'}
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/50 text-red-300 text-xs p-3 rounded-xl flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* OTP Input Form */}
        {otpRequired ? (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            {otpDebugCode && (
              <div className="bg-gym-orange/10 border border-gym-orange/30 text-gym-orange text-xs p-2.5 rounded-xl text-center">
                Demo Dev OTP: <b>{otpDebugCode}</b>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gym-muted mb-1">Enter 6-Digit OTP</label>
              <div className="relative">
                <KeyRound className="w-5 h-5 text-gym-muted absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  className="w-full bg-gym-dark border border-gym-border rounded-xl pl-11 pr-4 py-2.5 text-center tracking-widest text-lg font-bold text-white focus:outline-none focus:border-gym-orange"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gym-orange hover:bg-gym-orangeHover text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Verify OTP & Login</span>}
            </button>
          </form>
        ) : (
          /* Standard Login Form */
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gym-muted mb-1">Email or Phone Number</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gym-muted absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin@ironpulse.com or phone"
                  className="w-full bg-gym-dark border border-gym-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-gym-orange"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-gym-muted">Password</label>
                <Link to="/forgot-password" className="text-xs text-gym-orange hover:underline font-medium">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gym-muted absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gym-orange hover:bg-gym-orangeHover text-white font-bold rounded-xl shadow-lg shadow-gym-orange/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Demo Account Quick Fill Helper */}
        <div className="mt-6 pt-4 border-t border-gym-border/50 text-center space-y-2">
          <p className="text-[11px] text-gym-muted uppercase tracking-wider font-semibold">Quick Demo Login Accounts</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount('member')}
              className="py-1.5 px-2 bg-gym-dark hover:bg-gym-orange/20 text-slate-300 hover:text-gym-orange border border-gym-border text-[11px] font-semibold rounded-lg transition-colors"
            >
              Member Demo
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('staff')}
              className="py-1.5 px-2 bg-gym-dark hover:bg-gym-orange/20 text-slate-300 hover:text-gym-orange border border-gym-border text-[11px] font-semibold rounded-lg transition-colors"
            >
              Staff Demo
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('admin')}
              className="py-1.5 px-2 bg-gym-dark hover:bg-gym-orange/20 text-slate-300 hover:text-gym-orange border border-gym-border text-[11px] font-semibold rounded-lg transition-colors"
            >
              Admin Demo
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gym-muted">
          Don't have a gym account yet?{' '}
          <Link to="/register" className="text-gym-orange font-bold hover:underline">
            Register Here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;

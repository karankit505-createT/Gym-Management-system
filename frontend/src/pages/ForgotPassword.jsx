import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { KeyRound, Mail, Lock, Loader2, ShieldCheck, ArrowRight } from 'lucide-react';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Send OTP, 2: Reset Password
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [otpDebug, setOtpDebug] = useState('');

  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await authAPI.forgotPassword({ email });
      if (res.data.success) {
        setMessage('OTP sent to your email address!');
        setOtpDebug(res.data.otpDebug || '');
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await authAPI.resetPassword({ email, otp_code: otpCode, newPassword });
      if (res.data.success) {
        setMessage('Password reset successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-gym-card border border-gym-border/80 rounded-3xl p-8 shadow-2xl">
        
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex p-3 bg-gym-orange/20 rounded-2xl border border-gym-orange/40 mb-2">
            <KeyRound className="w-8 h-8 text-gym-orange" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase">Reset Password</h2>
          <p className="text-xs text-gym-muted">
            {step === 1 ? 'Enter your registered email to receive a password reset OTP' : 'Enter the OTP and your new password'}
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/50 text-red-300 text-xs p-3 rounded-xl flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="mb-4 bg-emerald-500/10 border border-emerald-500/50 text-emerald-300 text-xs p-3 rounded-xl">
            {message}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gym-muted mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gym-muted absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full bg-gym-dark border border-gym-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-gym-orange"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gym-orange hover:bg-gym-orangeHover text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Send Reset OTP</span>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            {otpDebug && (
              <div className="bg-gym-orange/10 border border-gym-orange/30 text-gym-orange text-xs p-2 rounded-lg text-center">
                Dev Test OTP: <b>{otpDebug}</b>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gym-muted mb-1">6-Digit OTP</label>
              <input
                type="text"
                required
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="123456"
                className="w-full bg-gym-dark border border-gym-border rounded-xl py-2.5 px-4 text-center font-bold tracking-widest text-lg text-white focus:outline-none focus:border-gym-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gym-muted mb-1">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gym-muted absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gym-dark border border-gym-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-gym-orange"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gym-orange hover:bg-gym-orangeHover text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Update Password</span>}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-xs text-gym-muted">
          Remember your password?{' '}
          <Link to="/login" className="text-gym-orange font-bold hover:underline">
            Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;

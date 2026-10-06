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
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10 bg-slate-50">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-sm space-y-6">
        
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex p-3 bg-red-50 rounded-md border border-red-100 mb-1">
            <KeyRound className="w-7 h-7 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-slate-900 uppercase tracking-wide">Reset Password</h2>
          <p className="text-xs text-slate-500">
            {step === 1 ? 'Enter your registered email to receive a password reset OTP' : 'Enter the OTP and your new password'}
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-md flex items-center space-x-2.5">
            <ShieldCheck className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3.5 rounded-md">
            {message}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded-md pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md shadow-sm transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 text-xs"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Send Reset OTP</span>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            {otpDebug && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-2.5 rounded-md text-center font-mono">
                Dev Test OTP: <b>{otpDebug}</b>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">6-Digit OTP</label>
              <input
                type="text"
                required
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="123456"
                className="w-full bg-slate-50 border border-slate-300 rounded-md py-2.5 px-4 text-center font-bold tracking-widest text-lg text-slate-900 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-300 rounded-md pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md shadow-sm transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 text-xs"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Update Password</span>}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-xs text-slate-500">
          Remember your password?{' '}
          <Link to="/login" className="text-red-600 font-semibold hover:underline">
            Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;

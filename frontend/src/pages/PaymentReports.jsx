import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { CreditCard, Download, CheckCircle, ShieldCheck, Filter } from 'lucide-react';

const PaymentReports = () => {
  const [payments, setPayments] = useState([]);
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPayments();
  }, [status, startDate, endDate]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getPayments({ status, startDate, endDate });
      if (res.data.success) {
        setPayments(res.data.payments);
      }
    } catch (err) {
      setError('Failed to load payment reports.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCsv = () => {
    const csvUrl = adminAPI.exportPaymentsCsv({ status, startDate, endDate });
    window.open(csvUrl, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gym-border pb-4">
        <div>
          <span className="text-gym-orange text-xs font-bold uppercase tracking-widest">Admin Control</span>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">PAYMENT AUDIT & REPORTS</h1>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-300 text-xs p-3.5 rounded-xl">
          {error}
        </div>
      )}

      {/* FILTER STRIP */}
      <div className="bg-gym-card border border-gym-border/80 rounded-3xl p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-gym-muted mb-1">Filter Payment Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-gym-dark border border-gym-border rounded-xl p-2.5 text-xs text-white focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gym-muted mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-gym-dark border border-gym-border rounded-xl p-2.5 text-xs text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gym-muted mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full bg-gym-dark border border-gym-border rounded-xl p-2.5 text-xs text-white focus:outline-none"
          />
        </div>
      </div>

      {/* TRANSACTIONS TABLE */}
      {loading ? (
        <div className="text-center py-20 text-gym-muted">Loading payments audit...</div>
      ) : (
        <div className="bg-gym-card border border-gym-border/80 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-gym-dark/80 text-xs text-gym-muted uppercase border-b border-gym-border">
                <tr>
                  <th className="py-4 px-6">Transaction ID</th>
                  <th className="py-4 px-6">Member Name</th>
                  <th className="py-4 px-6">Plan Name</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Method</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gym-border/50">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-gym-cardHover">
                    <td className="py-4 px-6 font-mono text-xs font-semibold text-gym-orange">
                      {p.transaction_id}
                    </td>
                    <td className="py-4 px-6 font-bold text-white">
                      {p.User?.name} <span className="text-[11px] text-gym-muted block">{p.User?.email}</span>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-200">
                      {p.Plan?.name}
                    </td>
                    <td className="py-4 px-6 font-black text-white">
                      ₹{parseFloat(p.amount).toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-xs uppercase text-gym-muted">
                      {p.payment_method}
                    </td>
                    <td className="py-4 px-6 text-xs text-gym-muted">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase">
                        {p.payment_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default PaymentReports;

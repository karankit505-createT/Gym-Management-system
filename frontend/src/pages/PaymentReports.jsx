import React, { useState, useEffect } from 'react';
import { adminAPI, contactAPI } from '../services/api';
import { CreditCard, Download, CheckCircle, ShieldCheck, Filter, RefreshCw, AlertCircle, FileText, MessageSquare, TrendingUp, Sparkles } from 'lucide-react';

const PaymentReports = () => {
  const [payments, setPayments] = useState([]);
  const [inquiryStats, setInquiryStats] = useState(null);
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPayments();
    fetchInquiryStats();
  }, [status, startDate, endDate]);

  const fetchInquiryStats = async () => {
    try {
      const res = await contactAPI.getStats();
      if (res.data.success) {
        setInquiryStats(res.data.stats);
      }
    } catch (e) {
      console.warn('Inquiry stats notice:', e.message);
    }
  };

  const fetchPayments = async () => {
    setLoading(true);
    setError('');
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

  const [exporting, setExporting] = useState(false);

  const handleExportCsv = async () => {
    try {
      setExporting(true);
      await adminAPI.exportPaymentsCsv({ status, startDate, endDate });
    } catch (err) {
      setError('Failed to export payments CSV report.');
    } finally {
      setExporting(false);
    }
  };

  const resetFilters = () => {
    setStatus('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-orange-600 text-xs sm:text-sm font-bold uppercase tracking-wider block mb-1">
            Admin Reports
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 uppercase tracking-tight">
            Payment Audit & Reports
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1">
            Real-time financial transactions ledger, payment status verification, and accounting CSV export.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          disabled={exporting || payments.length === 0}
          className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-md shadow-xs transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{exporting ? 'Exporting Report...' : 'Export Payments CSV'}</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* FILTER CONTROLS */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2 text-sm font-bold text-slate-900 uppercase tracking-wider">
            <Filter className="w-5 h-5 text-orange-600" />
            <span>Audit Filters</span>
          </div>
          {(status || startDate || endDate) && (
            <button
              onClick={resetFilters}
              className="text-xs sm:text-sm text-orange-600 hover:text-orange-700 flex items-center space-x-1.5 font-semibold"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Payment Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full h-11 bg-slate-50 border border-slate-300 focus:border-orange-600 rounded-lg px-3.5 text-sm sm:text-base text-slate-900 focus:outline-none"
            >
              <option value="">All Statuses (Success / Pending / Failed)</option>
              <option value="success">Success Only</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full h-11 bg-slate-50 border border-slate-300 focus:border-orange-600 rounded-lg px-3.5 text-sm sm:text-base text-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full h-11 bg-slate-50 border border-slate-300 focus:border-orange-600 rounded-lg px-3.5 text-sm sm:text-base text-slate-900 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* INQUIRY AUDIT & CONVERSION SUMMARY */}
      {inquiryStats && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-orange-600" />
              <span>Inquiry Audit & Lead Conversion Report</span>
            </h3>
            <span className="text-sm text-orange-600 font-bold font-mono">
              Conversion Rate: {inquiryStats.conversionRate}%
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Received</span>
              <p className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">{inquiryStats.totalInquiries}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-orange-200">
              <span className="text-xs text-orange-600 font-bold uppercase tracking-wider">New Leads</span>
              <p className="text-3xl sm:text-4xl font-black text-orange-600 mt-1">{inquiryStats.newCount}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-emerald-200">
              <span className="text-xs text-emerald-700 font-bold uppercase tracking-wider">Joined Members</span>
              <p className="text-3xl sm:text-4xl font-black text-emerald-700 mt-1">{inquiryStats.joinedCount}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-amber-200">
              <span className="text-xs text-amber-700 font-bold uppercase tracking-wider">Pending (3+ Days)</span>
              <p className="text-3xl sm:text-4xl font-black text-amber-700 mt-1">{inquiryStats.pendingFollowUpCount}</p>
            </div>
          </div>
        </div>
      )}

      {/* TRANSACTIONS TABLE / SKELETON */}
      {loading ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8 space-y-4 shadow-xs">
          <div className="h-5 bg-slate-100 rounded w-1/4 animate-pulse"></div>
          <div className="space-y-2 pt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 bg-slate-50 rounded animate-pulse w-full"></div>
            ))}
          </div>
        </div>
      ) : payments.length === 0 ? (
        /* COMPOSED EMPTY STATE */
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-xs space-y-4 max-w-xl mx-auto my-6">
          <div className="w-14 h-14 bg-orange-50 border border-orange-100 rounded-full flex items-center justify-center mx-auto text-orange-600">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Matching Transactions Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            There are no payment audit logs matching the current filter parameters.
          </p>
          {(status || startDate || endDate) && (
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-md transition-colors inline-flex items-center space-x-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Clear Filter Criteria</span>
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-red-600" />
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Transaction Ledger ({payments.length} Records)
              </span>
            </div>
            <span className="text-xs text-slate-700 font-mono font-bold">
              Total Revenue: ₹{payments.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0).toLocaleString()}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs table-clean">
              <thead>
                <tr>
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Member Details</th>
                  <th className="py-3 px-4">Plan Name</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 font-sans">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                      {p.transaction_id}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <span>{p.User?.name || 'Member Account'}</span>
                      <span className="text-[11px] text-slate-500 font-normal block font-mono">
                        {p.User?.email}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {p.Plan?.name || 'Subscription Plan'}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 text-sm">
                      ₹{parseFloat(p.amount).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 uppercase font-mono text-slate-500">
                      {p.payment_method || 'Razorpay'}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {new Date(p.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`inline-flex items-center space-x-1 text-[11px] font-semibold px-2.5 py-0.5 rounded uppercase border ${
                        p.payment_status === 'success'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : p.payment_status === 'pending'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        <ShieldCheck className="w-3 h-3" />
                        <span>{p.payment_status}</span>
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

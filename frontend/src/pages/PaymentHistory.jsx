import React, { useState, useEffect } from 'react';
import { paymentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { generateReceipt } from '../utils/generateReceipt';
import { CreditCard, Download, CheckCircle, ShieldCheck, Loader2 } from 'lucide-react';

const PaymentHistory = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await paymentAPI.getHistory();
      if (res.data.success) {
        setPayments(res.data.payments);
      }
    } catch (err) {
      setError('Failed to load payment history.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async (payment) => {
    try {
      setDownloadingId(payment.id);
      setError('');

      // Generate receipt PDF file directly for browser download
      await generateReceipt(payment, user);
    } catch (err) {
      console.error('Failed to generate receipt:', err);
      setError('Failed to generate PDF receipt. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 uppercase">PAYMENT HISTORY & INVOICES</h1>
        <p className="text-xs text-slate-500">View past subscription payments and download official PDF tax invoices</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-md flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-slate-500">Loading payment transactions...</div>
      ) : payments.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 mx-auto flex items-center justify-center border border-red-100">
            <CreditCard className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-heading uppercase">No Transactions Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't made any plan payments yet. Subscribe to a plan to start your membership!
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 table-clean">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] tracking-wider border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-3.5 px-5">Transaction ID</th>
                  <th className="py-3.5 px-5">Plan Name</th>
                  <th className="py-3.5 px-5">Amount</th>
                  <th className="py-3.5 px-5">Date</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Invoice PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-5 font-mono text-xs font-semibold text-red-600">
                      {p.transaction_id}
                    </td>
                    <td className="py-3.5 px-5 font-semibold text-slate-900">
                      {p.Plan?.name || 'Gym Plan'}
                    </td>
                    <td className="py-3.5 px-5 font-bold text-slate-900">
                      ₹{parseFloat(p.amount).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-5 text-slate-500">
                      {new Date(p.createdAt).toLocaleDateString()} {new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2.5 py-0.5 rounded-md uppercase inline-flex items-center space-x-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>SUCCESS</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => handleDownloadInvoice(p)}
                        disabled={downloadingId === p.id}
                        className="py-1.5 px-3 bg-white hover:bg-slate-50 text-slate-700 hover:text-red-600 border border-slate-300 rounded-md text-xs font-semibold transition-colors inline-flex items-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {downloadingId === p.id ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Generating...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5" />
                            <span>Download PDF</span>
                          </>
                        )}
                      </button>
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

export default PaymentHistory;

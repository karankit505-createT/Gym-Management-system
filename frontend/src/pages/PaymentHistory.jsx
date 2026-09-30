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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      <div className="border-b border-gym-border pb-4">
        <h1 className="text-3xl font-black text-white uppercase tracking-tight">PAYMENT HISTORY & INVOICES</h1>
        <p className="text-xs text-gym-muted">View past subscription payments and download official PDF tax invoices</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-300 text-xs p-3.5 rounded-xl flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-gym-muted">Loading payment transactions...</div>
      ) : payments.length === 0 ? (
        <div className="bg-gym-card border border-gym-border/80 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-gym-orange/15 text-gym-orange mx-auto flex items-center justify-center">
            <CreditCard className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No Transactions Yet</h3>
          <p className="text-xs text-gym-muted max-w-sm mx-auto">
            You haven't made any plan payments yet. Subscribe to a plan to start your membership!
          </p>
        </div>
      ) : (
        <div className="bg-gym-card border border-gym-border/80 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-gym-dark/80 text-xs text-gym-muted uppercase tracking-wider border-b border-gym-border">
                <tr>
                  <th className="py-4 px-6">Transaction ID</th>
                  <th className="py-4 px-6">Plan Name</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Invoice PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gym-border/50">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-gym-cardHover transition-colors">
                    <td className="py-4 px-6 font-mono text-xs font-semibold text-gym-orange">
                      {p.transaction_id}
                    </td>
                    <td className="py-4 px-6 font-bold text-white">
                      {p.Plan?.name || 'Gym Plan'}
                    </td>
                    <td className="py-4 px-6 font-black text-white">
                      ₹{parseFloat(p.amount).toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-xs text-gym-muted">
                      {new Date(p.createdAt).toLocaleDateString()} {new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase inline-flex items-center space-x-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>SUCCESS</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDownloadInvoice(p)}
                        disabled={downloadingId === p.id}
                        className="py-1.5 px-3 bg-gym-orange/20 hover:bg-gym-orange text-gym-orange hover:text-white border border-gym-orange/40 rounded-lg text-xs font-bold transition-all inline-flex items-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
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

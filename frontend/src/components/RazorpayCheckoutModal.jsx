import React, { useState } from 'react';
import { CreditCard, CheckCircle2, ShieldCheck, Lock, Smartphone, Building2, Loader2, X } from 'lucide-react';
import { paymentAPI } from '../services/api';

const RazorpayCheckoutModal = ({ isOpen, onClose, orderData, onSuccess }) => {
  const [activeTab, setActiveTab] = useState('card'); // 'card', 'upi', 'netbanking'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [cardName, setCardName] = useState('John Doe');
  const [upiId, setUpiId] = useState('member@okaxis');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  if (!isOpen || !orderData) return null;

  const { order, plan } = orderData;

  const handleSimulatedPayment = async () => {
    setLoading(true);
    setError('');

    try {
      const payload = {
        razorpay_order_id: order.id,
        razorpay_payment_id: `pay_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
        razorpay_signature: `sig_mock_${Date.now()}`,
        plan_id: plan.id,
        payment_method: activeTab
      };

      const res = await paymentAPI.verifyPayment(payload);
      if (res && res.data && res.data.success) {
        onSuccess(res.data);
      } else {
        setError(res.data?.message || 'Payment verification failed');
      }
    } catch (err) {
      console.error('Payment Error:', err);
      setError(err.response?.data?.message || err.message || 'Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#161626] border border-gym-orange/40 rounded-2xl max-w-lg w-[95%] sm:w-full overflow-hidden shadow-2xl glow-orange max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-[#1A1A2E] px-4 sm:px-6 py-3.5 sm:py-4 border-b border-gym-border flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gym-orange/20 border border-gym-orange flex items-center justify-center text-gym-orange font-bold text-xs">
              RZP
            </div>
            <div>
              <h3 className="text-white font-bold text-sm sm:text-base flex items-center space-x-1.5">
                <span>Razorpay Gateway</span>
                <span className="text-[9px] sm:text-[10px] bg-gym-orange/20 text-gym-orange px-2 py-0.5 rounded-full font-semibold">TEST MODE</span>
              </h3>
              <p className="text-[11px] sm:text-xs text-gym-muted">Secure 256-bit Encrypted Checkout</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gym-muted hover:text-white p-2 rounded-lg hover:bg-gym-border/50 min-w-[44px] min-h-[44px] flex items-center justify-center">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-4 sm:space-y-5">
        {/* Order Summary Strip */}
        <div className="bg-gym-orange/10 p-3.5 rounded-xl border border-gym-orange/20 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-gym-muted">Subscription Plan</p>
            <p className="text-xs sm:text-sm font-bold text-white">{plan.name} ({plan.duration_days} Days)</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-gym-muted">Total Payable</p>
            <p className="text-base sm:text-lg font-extrabold text-gym-orange">₹{parseFloat(plan.price).toFixed(2)}</p>
          </div>
        </div>
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-300 text-xs p-3 rounded-lg flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 bg-gym-card p-1 rounded-xl border border-gym-border">
            <button
              type="button"
              onClick={() => setActiveTab('card')}
              className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'card' ? 'bg-gym-orange text-white shadow-md' : 'text-gym-muted hover:text-white'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Card</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('upi')}
              className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'upi' ? 'bg-gym-orange text-white shadow-md' : 'text-gym-muted hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>UPI / QR</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('netbanking')}
              className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'netbanking' ? 'bg-gym-orange text-white shadow-md' : 'text-gym-muted hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Net Banking</span>
            </button>
          </div>

          {/* Card Form */}
          {activeTab === 'card' && (
            <div className="space-y-3.5 animate-fade-in">
              <div>
                <label className="block text-xs font-medium text-gym-muted mb-1">Cardholder Name</label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full bg-gym-card border border-gym-border rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-gym-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gym-muted mb-1">Card Number (Simulated)</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-gym-card border border-gym-border rounded-lg px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-gym-orange"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gym-muted mb-1">Expiry Date</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full bg-gym-card border border-gym-border rounded-lg px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-gym-orange"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gym-muted mb-1">CVV</label>
                  <input
                    type="password"
                    maxLength={3}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full bg-gym-card border border-gym-border rounded-lg px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-gym-orange"
                  />
                </div>
              </div>
            </div>
          )}

          {/* UPI Form */}
          {activeTab === 'upi' && (
            <div className="space-y-4 animate-fade-in text-center">
              <div className="bg-gym-card p-4 rounded-xl border border-gym-border flex flex-col items-center justify-center space-y-2">
                <div className="w-28 h-28 bg-white p-2 rounded-lg flex items-center justify-center shadow-lg">
                  {/* Simulated QR Code SVG */}
                  <svg className="w-full h-full text-black" viewBox="0 0 100 100">
                    <path d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z" fill="currentColor" />
                    <path d="M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z" fill="currentColor" />
                    <path d="M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z" fill="currentColor" />
                    <path d="M35,35 h30 v30 h-30 z M45,45 h10 v10 h-10 z" fill="currentColor" />
                  </svg>
                </div>
                <p className="text-xs text-gym-muted">Scan QR with GPay / PhonePe / Paytm or enter VPA ID below</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gym-muted mb-1 text-left">Virtual Payment Address (VPA)</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full bg-gym-card border border-gym-border rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-gym-orange"
                />
              </div>
            </div>
          )}

          {/* Netbanking Form */}
          {activeTab === 'netbanking' && (
            <div className="space-y-3 animate-fade-in">
              <label className="block text-xs font-medium text-gym-muted mb-1">Select Bank</label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full bg-gym-card border border-gym-border rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-gym-orange"
              >
                <option value="HDFC Bank">HDFC Bank</option>
                <option value="ICICI Bank">ICICI Bank</option>
                <option value="State Bank of India">State Bank of India</option>
                <option value="Axis Bank">Axis Bank</option>
                <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
              </select>
              <p className="text-xs text-gym-muted">You will be securely redirected to your bank's test simulator.</p>
            </div>
          )}

          {/* Pay Button */}
          <button
            type="button"
            disabled={loading}
            onClick={handleSimulatedPayment}
            className="w-full py-3.5 px-4 bg-gym-orange hover:bg-gym-orangeHover text-white font-bold rounded-xl shadow-lg shadow-gym-orange/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing Payment...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Pay ₹{parseFloat(plan.price).toFixed(2)} & Activate Plan</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-gym-muted flex items-center justify-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
            <span>Simulated Razorpay Test Gateway integration (Auto signature verification)</span>
          </p>

        </div>

      </div>
    </div>
  );
};

export default RazorpayCheckoutModal;

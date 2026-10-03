import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { planAPI, paymentAPI } from '../services/api';
import RazorpayCheckoutModal from '../components/RazorpayCheckoutModal';
import { Award, Check, ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';

const ChoosePlan = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasingPlanId, setPurchasingPlanId] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await planAPI.getPublicPlans();
      if (res.data.success) {
        setPlans(res.data.plans);
      }
    } catch (err) {
      setError('Failed to load membership plans.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = async (planId) => {
    setError('');
    const token = localStorage.getItem('gym_token');
    if (!token) {
      navigate('/login', { state: { message: 'Please sign in to select a membership plan.' } });
      return;
    }
    setPurchasingPlanId(planId);

    try {
      const res = await paymentAPI.createOrder(planId);
      if (res.data.success) {
        setOrderData(res.data);
        setIsModalOpen(true);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login', { state: { message: 'Session expired. Please sign in again.' } });
      } else {
        setError(err.response?.data?.message || 'Failed to initialize payment gateway.');
      }
    } finally {
      setPurchasingPlanId(null);
    }
  };

  const handlePaymentSuccess = (paymentResult) => {
    setIsModalOpen(false);
    setSuccessMessage('Payment successful! Your membership is now active.');
    setTimeout(() => {
      navigate('/member/dashboard');
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gym-border pb-6">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-xs text-gym-muted hover:text-white flex items-center space-x-1 mb-2 min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">CHOOSE YOUR MEMBERSHIP PLAN</h1>
          <p className="text-xs text-gym-muted">Select a plan duration to proceed to instant checkout with Razorpay</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-300 text-xs p-3.5 rounded-xl flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="bg-emerald-500/15 border-2 border-emerald-500/60 text-emerald-300 text-sm p-4 rounded-2xl text-center font-bold animate-bounce">
          🎉 {successMessage}
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-gym-muted">Loading available plans...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {plans.map((plan, index) => {
            const isHighlighted = index === 1;
            const isProcessing = purchasingPlanId === plan.id;

            return (
              <div
                key={plan.id}
                className={`bg-gym-card border rounded-2xl sm:rounded-3xl p-5 sm:p-6 relative flex flex-col justify-between transition-all duration-300 ${
                  isHighlighted ? 'border-gym-orange shadow-2xl glow-orange' : 'border-gym-border hover:border-gym-border/80'
                }`}
              >
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white mb-1">{plan.name}</h3>
                  <p className="text-xs text-gym-muted mb-4">{plan.duration_days} Days Unlimited Gym Access</p>

                  <div className="my-4">
                    <span className="text-3xl sm:text-4xl font-black text-white font-sans">₹{parseFloat(plan.price).toFixed(2)}</span>
                    <span className="text-xs text-gym-muted ml-1">/ total</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-6 bg-gym-dark/50 p-3 rounded-xl border border-gym-border/40">
                    {plan.description}
                  </p>

                  <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-gym-orange shrink-0" />
                      <span>Full Access to Gym Equipment</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-gym-orange shrink-0" />
                      <span>Free Digital PDF Invoice Receipt</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-gym-orange shrink-0" />
                      <span>Razorpay Secure Test Payment</span>
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 min-h-[44px] ${
                    isHighlighted
                      ? 'bg-gym-orange hover:bg-gym-orangeHover text-white shadow-lg shadow-gym-orange/30'
                      : 'bg-gym-dark hover:bg-gym-orange hover:text-white border border-gym-border text-slate-200'
                  }`}
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Award className="w-4 h-4" />
                      <span>Select & Pay ₹{parseFloat(plan.price).toFixed(2)}</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* RAZORPAY CHECKOUT SIMULATED MODAL */}
      <RazorpayCheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        orderData={orderData}
        onSuccess={handlePaymentSuccess}
      />

    </div>
  );
};

export default ChoosePlan;

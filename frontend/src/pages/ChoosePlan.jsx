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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center space-x-1 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 uppercase">CHOOSE YOUR MEMBERSHIP PLAN</h1>
          <p className="text-xs text-slate-500">Select a plan duration to proceed to instant checkout with Razorpay</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-md flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm p-4 rounded-md text-center font-bold">
          Payment successful! Your membership is now active.
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-slate-500">Loading available plans...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => {
            const isHighlighted = index === 1;
            const isProcessing = purchasingPlanId === plan.id;

            return (
              <div
                key={plan.id}
                className={`bg-white border rounded-lg p-6 flex flex-col justify-between shadow-sm relative ${
                  isHighlighted ? 'border-red-600 ring-1 ring-red-600' : 'border-slate-200'
                }`}
              >
                {isHighlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] uppercase font-bold tracking-wider px-3 py-0.5 rounded-full">
                    Most Popular
                  </span>
                )}
                <div>
                  <h3 className="text-lg font-bold font-heading text-slate-900 mb-1 uppercase">{plan.name}</h3>
                  <p className="text-xs text-slate-500 mb-4">{plan.duration_days} Days Unlimited Access</p>

                  <div className="my-4">
                    <span className="text-3xl font-bold font-sans text-slate-900">₹{parseFloat(plan.price).toFixed(2)}</span>
                    <span className="text-xs text-slate-500 ml-1">/ total</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-6 bg-slate-50 p-3 rounded-md border border-slate-200">
                    {plan.description}
                  </p>

                  <ul className="space-y-2.5 text-xs text-slate-700 mb-6">
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-red-600 shrink-0" />
                      <span>Full Access to Gym Equipment</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-red-600 shrink-0" />
                      <span>Free Digital PDF Invoice Receipt</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-red-600 shrink-0" />
                      <span>Razorpay Secure Test Payment</span>
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-3 px-4 rounded-md text-xs font-semibold transition-colors flex items-center justify-center space-x-2 min-h-[42px] ${
                    isHighlighted
                      ? 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
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

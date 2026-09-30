import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Check, X, HelpCircle, Award } from 'lucide-react';
import { planAPI } from '../services/api';

const Membership = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await planAPI.getPublicPlans();
      if (res.data.success) {
        setPlans(res.data.plans);
      }
    } catch (error) {
      console.error('Failed to load plans:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-20 pb-20 pt-6">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden py-16 bg-gradient-to-b from-gym-orange/10 via-transparent to-transparent text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight mb-4 font-sans">
            FLEXIBLE PLANS FOR <span className="gradient-text">EVERY GOAL</span>
          </h1>

          <p className="text-base sm:text-lg text-gym-muted max-w-2xl mx-auto font-normal leading-relaxed">
            Transparent pricing with zero hidden admission or maintenance fees. Upgrade, downgrade, or cancel anytime.
          </p>

        </div>
      </section>

      {/* PRICING CARDS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-12 text-gym-muted">Loading membership plans...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {plans.map((plan, index) => {
              const isPopular = index === 1;
              return (
                <div
                  key={plan.id}
                  className={`bg-gym-card border rounded-3xl p-6 relative flex flex-col justify-between transition-all duration-300 ${
                    isPopular 
                      ? 'border-gym-orange shadow-2xl glow-orange transform -translate-y-2' 
                      : 'border-gym-border/80 hover:border-gym-orange/50'
                  }`}
                >
                  {isPopular && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gym-orange text-white text-[11px] font-extrabold uppercase px-4 py-1 rounded-full tracking-wider shadow-lg flex items-center space-x-1">
                      <Flame className="w-3 h-3 fill-white" />
                      <span>MOST POPULAR</span>
                    </span>
                  )}

                  <div>
                    <div className="border-b border-gym-border/60 pb-4 mb-4">
                      <h3 className="text-xl font-black text-white mb-1">{plan.name}</h3>
                      <p className="text-xs text-gym-muted">{plan.duration_days} Days Full Access</p>
                    </div>

                    <div className="flex items-baseline space-x-1 my-4">
                      <span className="text-4xl font-black text-white font-sans">₹{parseFloat(plan.price).toFixed(0)}</span>
                      <span className="text-xs text-gym-muted font-semibold">/ {plan.duration_days} days</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-6 bg-gym-dark/50 p-3 rounded-xl border border-gym-border/40">
                      {plan.description}
                    </p>

                    <ul className="space-y-3 text-xs text-slate-300 mb-6">
                      <li className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-gym-orange shrink-0 mt-0.5" />
                        <span>Full Access to Gym Equipment</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-gym-orange shrink-0 mt-0.5" />
                        <span>Locker Room & Shower Access</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-gym-orange shrink-0 mt-0.5" />
                        <span>Digital PDF Receipt Invoice</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-gym-orange shrink-0 mt-0.5" />
                        <span>IronPulse App Account</span>
                      </li>
                    </ul>
                  </div>

                  <Link
                    to="/member/choose-plan"
                    className={`w-full py-3 px-4 rounded-xl text-xs font-bold text-center transition-all ${
                      isPopular
                        ? 'bg-gym-orange hover:bg-gym-orangeHover text-white shadow-lg shadow-gym-orange/30'
                        : 'bg-gym-dark border border-gym-border hover:bg-gym-orange hover:text-white text-slate-200'
                    }`}
                  >
                    Select Plan
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* MATRIX TABLE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 space-y-2">
          <h2 className="text-3xl font-black text-white uppercase">PLAN FEATURE COMPARISON</h2>
          <p className="text-gym-muted text-sm">Side-by-side breakdown of all membership benefits</p>
        </div>

        <div className="overflow-x-auto bg-gym-card border border-gym-border/80 rounded-3xl">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-gym-orange/10 text-xs font-bold uppercase text-white border-b border-gym-border">
              <tr>
                <th className="py-4 px-6">Features</th>
                <th className="py-4 px-6 text-center">Monthly (₹999)</th>
                <th className="py-4 px-6 text-center">Quarterly (₹2,499)</th>
                <th className="py-4 px-6 text-center">Half-Yearly (₹4,499)</th>
                <th className="py-4 px-6 text-center">Yearly VIP (₹7,999)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gym-border/40">
              <tr className="hover:bg-gym-dark/30">
                <td className="py-4 px-6 font-semibold text-white">Gym Floor & Equipment Access</td>
                <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-gym-orange mx-auto" /></td>
                <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-gym-orange mx-auto" /></td>
                <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-gym-orange mx-auto" /></td>
                <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-gym-orange mx-auto" /></td>
              </tr>
              <tr className="hover:bg-gym-dark/30">
                <td className="py-4 px-6 font-semibold text-white">Locker Room & Shower Access</td>
                <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-gym-orange mx-auto" /></td>
                <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-gym-orange mx-auto" /></td>
                <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-gym-orange mx-auto" /></td>
                <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-gym-orange mx-auto" /></td>
              </tr>
              <tr className="hover:bg-gym-dark/30">
                <td className="py-4 px-6 font-semibold text-white">Group HIIT & Yoga Classes</td>
                <td className="py-4 px-6 text-center"><X className="w-5 h-5 text-gym-muted/40 mx-auto" /></td>
                <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-gym-orange mx-auto" /></td>
                <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-gym-orange mx-auto" /></td>
                <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-gym-orange mx-auto" /></td>
              </tr>
              <tr className="hover:bg-gym-dark/30">
                <td className="py-4 px-6 font-semibold text-white">Complimentary PT Sessions</td>
                <td className="py-4 px-6 text-center"><X className="w-5 h-5 text-gym-muted/40 mx-auto" /></td>
                <td className="py-4 px-6 text-center text-xs font-semibold text-white">1 Session</td>
                <td className="py-4 px-6 text-center text-xs font-semibold text-white">5 Sessions</td>
                <td className="py-4 px-6 text-center text-xs font-semibold text-gym-orange">Unlimited Consults</td>
              </tr>
              <tr className="hover:bg-gym-dark/30">
                <td className="py-4 px-6 font-semibold text-white">Steam Room & Sauna Lounge</td>
                <td className="py-4 px-6 text-center"><X className="w-5 h-5 text-gym-muted/40 mx-auto" /></td>
                <td className="py-4 px-6 text-center"><X className="w-5 h-5 text-gym-muted/40 mx-auto" /></td>
                <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-gym-orange mx-auto" /></td>
                <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-gym-orange mx-auto" /></td>
              </tr>
              <tr className="hover:bg-gym-dark/30">
                <td className="py-4 px-6 font-semibold text-white">24/7 VIP Access</td>
                <td className="py-4 px-6 text-center"><X className="w-5 h-5 text-gym-muted/40 mx-auto" /></td>
                <td className="py-4 px-6 text-center"><X className="w-5 h-5 text-gym-muted/40 mx-auto" /></td>
                <td className="py-4 px-6 text-center"><X className="w-5 h-5 text-gym-muted/40 mx-auto" /></td>
                <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-gym-orange mx-auto" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-3xl font-black text-white uppercase">FREQUENTLY ASKED QUESTIONS</h2>
          <p className="text-gym-muted text-sm">Quick answers to common membership inquiries</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gym-card border border-gym-border/80 p-6 rounded-2xl space-y-2">
            <h4 className="text-base font-bold text-white flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-gym-orange shrink-0" />
              <span>Are there any hidden admission or maintenance fees?</span>
            </h4>
            <p className="text-xs text-gym-muted leading-relaxed">
              No! Our membership prices are 100% transparent. The price listed is all you pay for your plan duration.
            </p>
          </div>

          <div className="bg-gym-card border border-gym-border/80 p-6 rounded-2xl space-y-2">
            <h4 className="text-base font-bold text-white flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-gym-orange shrink-0" />
              <span>Can I pause my membership if I travel?</span>
            </h4>
            <p className="text-xs text-gym-muted leading-relaxed">
              Yes, Half-Yearly and Yearly VIP plans allow up to 30 days of membership freeze upon request.
            </p>
          </div>

          <div className="bg-gym-card border border-gym-border/80 p-6 rounded-2xl space-y-2">
            <h4 className="text-base font-bold text-white flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-gym-orange shrink-0" />
              <span>How do I pay using Razorpay?</span>
            </h4>
            <p className="text-xs text-gym-muted leading-relaxed">
              You can choose your plan and click 'Select Plan' to instantly pay via UPI, GPay, Credit/Debit cards, or NetBanking.
            </p>
          </div>

          <div className="bg-gym-card border border-gym-border/80 p-6 rounded-2xl space-y-2">
            <h4 className="text-base font-bold text-white flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-gym-orange shrink-0" />
              <span>Will I receive a receipt for my payment?</span>
            </h4>
            <p className="text-xs text-gym-muted leading-relaxed">
              Yes, an instant digital PDF receipt invoice is generated and available for download in your Member Dashboard.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Membership;

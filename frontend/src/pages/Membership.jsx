import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, HelpCircle } from 'lucide-react';
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
    <div className="space-y-12 pb-16 pt-6 font-sans bg-slate-50">
      
      {/* HERO SECTION */}
      <section className="bg-white border-b border-slate-200 py-10 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <span className="text-red-600 text-xs font-bold uppercase tracking-wider block mb-1">
            Simple Pricing Structure
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-slate-900 uppercase tracking-tight mb-2">
            GYM MEMBERSHIP <span className="text-red-600">PLANS</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Transparent pricing plans with no hidden charges. Select a plan to start your membership instantly.
          </p>

        </div>
      </section>

      {/* PRICING CARDS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-12 text-slate-500 text-xs">Loading membership plans...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {plans.map((plan, index) => {
              const isPopular = index === 1;
              return (
                <div
                  key={plan.id}
                  className={`bg-white border rounded-md p-5 relative flex flex-col justify-between transition-colors ${
                    isPopular 
                      ? 'border-red-600 shadow-sm' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {isPopular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-bold uppercase px-3 py-0.5 rounded-sm tracking-wider">
                      MOST POPULAR
                    </span>
                  )}

                  <div>
                    <div className="border-b border-slate-200 pb-3 mb-3">
                      <h3 className="text-lg font-heading font-black text-slate-900 uppercase">{plan.name}</h3>
                      <p className="text-xs text-slate-500">{plan.duration_days} Days Full Access</p>
                    </div>

                    <div className="flex items-baseline space-x-1 my-3">
                      <span className="text-3xl font-heading font-black text-slate-900">₹{parseFloat(plan.price).toFixed(0)}</span>
                      <span className="text-xs text-slate-500 font-medium">/ {plan.duration_days} days</span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4 bg-slate-50 p-2.5 rounded border border-slate-200">
                      {plan.description}
                    </p>

                    <ul className="space-y-2 text-xs text-slate-700 mb-6">
                      <li className="flex items-start space-x-2">
                        <Check className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                        <span>Full Access to Workout Floor</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Check className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                        <span>Locker & Change Room Access</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Check className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                        <span>Digital PDF Receipt Invoice</span>
                      </li>
                    </ul>
                  </div>

                  <Link
                    to="/member/choose-plan"
                    className={`w-full py-2 px-3 rounded-md text-xs font-bold text-center transition-colors ${
                      isPopular
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
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
        <div className="mb-4 border-b border-slate-200 pb-2">
          <h2 className="text-xl font-heading font-black text-slate-900 uppercase">PLAN COMPARISON TABLE</h2>
        </div>

        <div className="overflow-x-auto bg-white border border-slate-200 rounded-md">
          <table className="w-full text-left text-xs text-slate-700 table-clean">
            <thead>
              <tr>
                <th>Features</th>
                <th className="text-center">Monthly (₹999)</th>
                <th className="text-center">Quarterly (₹2,499)</th>
                <th className="text-center">Half-Yearly (₹4,499)</th>
                <th className="text-center">Yearly VIP (₹7,999)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-semibold text-slate-900">Equipment Access</td>
                <td className="text-center"><Check className="w-4 h-4 text-red-600 mx-auto" /></td>
                <td className="text-center"><Check className="w-4 h-4 text-red-600 mx-auto" /></td>
                <td className="text-center"><Check className="w-4 h-4 text-red-600 mx-auto" /></td>
                <td className="text-center"><Check className="w-4 h-4 text-red-600 mx-auto" /></td>
              </tr>
              <tr>
                <td className="font-semibold text-slate-900">Locker Room</td>
                <td className="text-center"><Check className="w-4 h-4 text-red-600 mx-auto" /></td>
                <td className="text-center"><Check className="w-4 h-4 text-red-600 mx-auto" /></td>
                <td className="text-center"><Check className="w-4 h-4 text-red-600 mx-auto" /></td>
                <td className="text-center"><Check className="w-4 h-4 text-red-600 mx-auto" /></td>
              </tr>
              <tr>
                <td className="font-semibold text-slate-900">Group Cardio Sessions</td>
                <td className="text-center"><X className="w-4 h-4 text-slate-300 mx-auto" /></td>
                <td className="text-center"><Check className="w-4 h-4 text-red-600 mx-auto" /></td>
                <td className="text-center"><Check className="w-4 h-4 text-red-600 mx-auto" /></td>
                <td className="text-center"><Check className="w-4 h-4 text-red-600 mx-auto" /></td>
              </tr>
              <tr>
                <td className="font-semibold text-slate-900">PT Consultation</td>
                <td className="text-center"><X className="w-4 h-4 text-slate-300 mx-auto" /></td>
                <td className="text-center font-bold text-slate-800">1 Session</td>
                <td className="text-center font-bold text-slate-800">5 Sessions</td>
                <td className="text-center font-bold text-red-600">Included</td>
              </tr>
              <tr>
                <td className="font-semibold text-slate-900">Steam Room</td>
                <td className="text-center"><X className="w-4 h-4 text-slate-300 mx-auto" /></td>
                <td className="text-center"><X className="w-4 h-4 text-slate-300 mx-auto" /></td>
                <td className="text-center"><Check className="w-4 h-4 text-red-600 mx-auto" /></td>
                <td className="text-center"><Check className="w-4 h-4 text-red-600 mx-auto" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 border-b border-slate-200 pb-2">
          <h2 className="text-xl font-heading font-black text-slate-900 uppercase">FREQUENTLY ASKED QUESTIONS</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 p-4 rounded-md space-y-1">
            <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>Are there admission or extra maintenance fees?</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              No extra admission fees. The plan price listed above is the final cost.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-md space-y-1">
            <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>How do I pay online?</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Click 'Select Plan' and proceed to pay securely via Razorpay (UPI, Google Pay, Cards, NetBanking).
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-md space-y-1">
            <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>Will I get a receipt?</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Yes, a downloadable PDF receipt invoice is immediately generated in your Member Dashboard.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-md space-y-1">
            <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>What are the gym operating hours?</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Monday through Friday 5:00 AM to 11:00 PM. Weekends 6:00 AM to 10:00 PM.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Membership;

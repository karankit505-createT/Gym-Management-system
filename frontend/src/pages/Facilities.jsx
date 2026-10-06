import React from 'react';
import { Dumbbell, HeartPulse, Users, ShieldCheck, SquareParking, Smartphone, Sparkles } from 'lucide-react';

const Facilities = () => {
  return (
    <div className="space-y-12 pb-16 pt-6 font-sans bg-slate-50">
      
      {/* HERO SECTION */}
      <section className="bg-white border-b border-slate-200 py-10 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <span className="text-red-600 text-xs font-bold uppercase tracking-wider block mb-1">
            Training Equipment & Amenities
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-slate-900 uppercase tracking-tight mb-2">
            GYM FACILITIES & <span className="text-red-600">ZONES</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            2,000 sq ft equipped with heavy-duty power racks, cardio units, steam room, and personal lockers.
          </p>

        </div>
      </section>

      {/* FACILITIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="bg-white border border-slate-200 p-6 rounded-md space-y-3">
            <div className="w-10 h-10 rounded-md bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <Dumbbell className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-heading font-bold text-slate-900 uppercase">Free Weights & Power Racks</h3>
            <p className="text-xs font-bold text-red-600 uppercase">Heavy Strength Section</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Olympic barbells, heavy dumbbells (2.5kg to 50kg), power cages, incline/decline benches, and cable crossover machines.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-semibold text-slate-700">Olympic Bars</span>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-semibold text-slate-700">Power Cages</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-md space-y-3">
            <div className="w-10 h-10 rounded-md bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <HeartPulse className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-heading font-bold text-slate-900 uppercase">Cardio & Stamina Zone</h3>
            <p className="text-xs font-bold text-red-600 uppercase">Endurance Section</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Treadmills, elliptical trainers, spin bikes, rowers, and stair climbers for high-calorie cardio conditioning.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-semibold text-slate-700">Treadmills</span>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-semibold text-slate-700">Spin Bikes</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-md space-y-3">
            <div className="w-10 h-10 rounded-md bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-heading font-bold text-slate-900 uppercase">Group Exercise Studio</h3>
            <p className="text-xs font-bold text-red-600 uppercase">Aerobics & HIIT</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dedicated studio area hosted by instructors for HIIT workshops, bodyweight conditioning, and stretching routines.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-semibold text-slate-700">Morning HIIT</span>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-semibold text-slate-700">Yoga Mats</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-md space-y-3">
            <div className="w-10 h-10 rounded-md bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-heading font-bold text-slate-900 uppercase">Steam Room & Sauna</h3>
            <p className="text-xs font-bold text-red-600 uppercase">Post-Workout Recovery</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Clean steam sauna room available for members to relax muscle soreness post training.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-semibold text-slate-700">Steam Room</span>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-semibold text-slate-700">Clean Showers</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-md space-y-3">
            <div className="w-10 h-10 rounded-md bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <SquareParking className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-heading font-bold text-slate-900 uppercase">Member Parking & Security</h3>
            <p className="text-xs font-bold text-red-600 uppercase">Convenience</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Spacious covered parking garage for cars and two-wheelers with CCTV camera monitoring.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-semibold text-slate-700">CCTV Monitored</span>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-semibold text-slate-700">Two-Wheeler Parking</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-md space-y-3">
            <div className="w-10 h-10 rounded-md bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-heading font-bold text-slate-900 uppercase">Digital Check-in Portal</h3>
            <p className="text-xs font-bold text-red-600 uppercase">System</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Track attendance, active subscription status, and download Razorpay payment receipts anytime.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-semibold text-slate-700">Digital Logs</span>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-semibold text-slate-700">PDF Invoices</span>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Facilities;

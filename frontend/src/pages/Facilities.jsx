import React from 'react';
import { Dumbbell, HeartPulse, Users, ShieldCheck, SquareParking, Smartphone, Sparkles } from 'lucide-react';

const Facilities = () => {
  return (
    <div className="space-y-20 pb-20 pt-6">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden py-16 bg-gradient-to-b from-gym-orange/10 via-transparent to-transparent text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight mb-4 font-sans">
            FACILITIES & <span className="gradient-text">EQUIPMENT ZONES</span>
          </h1>

          <p className="text-base sm:text-lg text-gym-muted max-w-2xl mx-auto font-normal leading-relaxed">
            2,000 sq ft of high-performance training ground engineered for champions. Discover our premium zones and luxury recovery suites.
          </p>

        </div>
      </section>

      {/* FACILITIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <div className="bg-gym-card border border-gym-border/80 p-8 rounded-3xl space-y-4 hover:border-gym-orange/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-gym-orange/20 border border-gym-orange/30 flex items-center justify-center text-gym-orange">
              <Dumbbell className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white">Free Weights & Power Racks</h3>
            <p className="text-xs font-bold text-gym-orange uppercase tracking-wider">Heavy Strength Zone</p>
            <p className="text-xs text-gym-muted leading-relaxed">
              Eleiko Olympic barbells, Hammer Strength plate-loaded machines, power cages, and rubber-coated dumbbells ranging from 2.5kg to 60kg.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-[11px] bg-gym-dark px-3 py-1 rounded-full border border-gym-border/60 text-slate-300">Olympic Bars</span>
              <span className="text-[11px] bg-gym-dark px-3 py-1 rounded-full border border-gym-border/60 text-slate-300">Power Cages</span>
              <span className="text-[11px] bg-gym-dark px-3 py-1 rounded-full border border-gym-border/60 text-slate-300">Up to 60kg</span>
            </div>
          </div>

          <div className="bg-gym-card border border-gym-border/80 p-8 rounded-3xl space-y-4 hover:border-gym-orange/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-gym-orange/20 border border-gym-orange/30 flex items-center justify-center text-gym-orange">
              <HeartPulse className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white">Cardio Cinema & Endurance</h3>
            <p className="text-xs font-bold text-gym-orange uppercase tracking-wider">Cardio & Stamina Zone</p>
            <p className="text-xs text-gym-muted leading-relaxed">
              Life Fitness treadmills, StairMasters, Concept2 rowers, SkiErgs, and assault bikes equipped with interactive screens and heart-rate monitoring.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-[11px] bg-gym-dark px-3 py-1 rounded-full border border-gym-border/60 text-slate-300">Interactive Screens</span>
              <span className="text-[11px] bg-gym-dark px-3 py-1 rounded-full border border-gym-border/60 text-slate-300">StairMasters</span>
              <span className="text-[11px] bg-gym-dark px-3 py-1 rounded-full border border-gym-border/60 text-slate-300">Concept2 Rowers</span>
            </div>
          </div>

          <div className="bg-gym-card border border-gym-border/80 p-8 rounded-3xl space-y-4 hover:border-gym-orange/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-gym-orange/20 border border-gym-orange/30 flex items-center justify-center text-gym-orange">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white">Group HIIT & Yoga Studio</h3>
            <p className="text-xs font-bold text-gym-orange uppercase tracking-wider">Group Exercise Studio</p>
            <p className="text-xs text-gym-muted leading-relaxed">
              Sprung wooden flooring studio hosted by certified instructors for CrossFit, Zumba, Spin cycling, and Vinyasa Yoga.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-[11px] bg-gym-dark px-3 py-1 rounded-full border border-gym-border/60 text-slate-300">Daily HIIT</span>
              <span className="text-[11px] bg-gym-dark px-3 py-1 rounded-full border border-gym-border/60 text-slate-300">Spin Bikes</span>
              <span className="text-[11px] bg-gym-dark px-3 py-1 rounded-full border border-gym-border/60 text-slate-300">Yoga Mats</span>
            </div>
          </div>

          <div className="bg-gym-card border border-gym-border/80 p-8 rounded-3xl space-y-4 hover:border-gym-orange/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-gym-orange/20 border border-gym-orange/30 flex items-center justify-center text-gym-orange">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white">Steam Room & Finnish Sauna</h3>
            <p className="text-xs font-bold text-gym-orange uppercase tracking-wider">Post-Workout Recovery Spa</p>
            <p className="text-xs text-gym-muted leading-relaxed">
              Detoxify your body and soothe sore muscles in our temperature-controlled aromatic steam room and authentic cedarwood Finnish sauna.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-[11px] bg-gym-dark px-3 py-1 rounded-full border border-gym-border/60 text-slate-300">Steam Room</span>
              <span className="text-[11px] bg-gym-dark px-3 py-1 rounded-full border border-gym-border/60 text-slate-300">Cedar Sauna</span>
              <span className="text-[11px] bg-gym-dark px-3 py-1 rounded-full border border-gym-border/60 text-slate-300">Muscle Rehab</span>
            </div>
          </div>

          <div className="bg-gym-card border border-gym-border/80 p-8 rounded-3xl space-y-4 hover:border-gym-orange/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-gym-orange/20 border border-gym-orange/30 flex items-center justify-center text-gym-orange">
              <SquareParking className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white">On-Site Covered Parking</h3>
            <p className="text-xs font-bold text-gym-orange uppercase tracking-wider">Convenience & Security</p>
            <p className="text-xs text-gym-muted leading-relaxed">
              Dedicated multi-level covered parking garage for all gym members with 24/7 CCTV surveillance and valet assistance.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-[11px] bg-gym-dark px-3 py-1 rounded-full border border-gym-border/60 text-slate-300">24/7 CCTV</span>
              <span className="text-[11px] bg-gym-dark px-3 py-1 rounded-full border border-gym-border/60 text-slate-300">Covered Garage</span>
              <span className="text-[11px] bg-gym-dark px-3 py-1 rounded-full border border-gym-border/60 text-slate-300">Free for Members</span>
            </div>
          </div>

          <div className="bg-gym-card border border-gym-border/80 p-8 rounded-3xl space-y-4 hover:border-gym-orange/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-gym-orange/20 border border-gym-orange/30 flex items-center justify-center text-gym-orange">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white">IronPulse App & Biometrics</h3>
            <p className="text-xs font-bold text-gym-orange uppercase tracking-wider">Smart Digital Ecosystem</p>
            <p className="text-xs text-gym-muted leading-relaxed">
              Scan QR codes for keyless entry, view live gym crowd density meters, log workout logs, and download PDF payment invoices on the fly.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-[11px] bg-gym-dark px-3 py-1 rounded-full border border-gym-border/60 text-slate-300">QR Keyless Entry</span>
              <span className="text-[11px] bg-gym-dark px-3 py-1 rounded-full border border-gym-border/60 text-slate-300">Crowd Meter</span>
              <span className="text-[11px] bg-gym-dark px-3 py-1 rounded-full border border-gym-border/60 text-slate-300">PDF Invoices</span>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Facilities;

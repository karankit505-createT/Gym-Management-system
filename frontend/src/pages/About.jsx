import React from 'react';
import { 
  Award, 
  Users, 
  Dumbbell, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Target, 
  BookOpen,
  MapPin
} from 'lucide-react';

const About = () => {
  return (
    <div className="space-y-12 pb-16 pt-6 font-sans bg-slate-50">
      
      {/* HERO SECTION */}
      <section className="bg-white border-b border-slate-200 py-10 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <span className="text-red-600 text-xs font-bold uppercase tracking-wider block mb-1">
            Fitness & Training Facility
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-slate-900 uppercase tracking-tight mb-3">
            ABOUT <span className="text-red-600">IRONPULSE GYM</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed mb-8">
            IronPulse Gym is a dedicated fitness facility equipped with modern heavy strength machines, free weights, group cardio zones, and certified workout instructors.
          </p>

          {/* Key Facility Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-md text-center">
              <h3 className="text-3xl font-heading font-black text-red-600">2,000</h3>
              <p className="text-xs font-bold text-slate-700 uppercase mt-0.5">Sq Ft Training Area</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-md text-center">
              <h3 className="text-3xl font-heading font-black text-red-600">5+</h3>
              <p className="text-xs font-bold text-slate-700 uppercase mt-0.5">Certified Trainers</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-md text-center">
              <h3 className="text-3xl font-heading font-black text-red-600">5:00 AM</h3>
              <p className="text-xs font-bold text-slate-700 uppercase mt-0.5">Morning Opening</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-md text-center">
              <h3 className="text-3xl font-heading font-black text-red-600">24/7</h3>
              <p className="text-xs font-bold text-slate-700 uppercase mt-0.5">VIP Annual Access</p>
            </div>
          </div>

        </div>
      </section>

      {/* STORY & MISSION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 border-b border-slate-200 pb-3">
          <span className="text-red-600 text-xs font-bold uppercase tracking-wider block">Background & Goals</span>
          <h2 className="text-2xl font-heading font-black text-slate-900 uppercase">OUR GYM MISSION</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white border border-slate-200 p-6 rounded-md space-y-3">
            <div className="w-10 h-10 rounded-md bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-heading font-bold text-slate-900 uppercase">Our Story</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              IronPulse Gym was created to offer a clean, well-maintained workout space with proper equipment, structured guidance, and respectful gym culture.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              We focus on practical workout routines, progressive strength gains, and maintaining high hygiene standards across all training zones.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-md space-y-3">
            <div className="w-10 h-10 rounded-md bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-heading font-bold text-slate-900 uppercase">Our Mission</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong className="text-slate-900">Training Quality:</strong> Provide member-focused gym access with quality weightlifting gear, functional equipment, and qualified trainer support.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong className="text-slate-900">Consistency:</strong> Help members stay consistent through systematic attendance logging, routine assistance, and clear pricing plans.
            </p>
          </div>

        </div>
      </section>

      {/* TRAINERS LIST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 border-b border-slate-200 pb-3">
          <span className="text-red-600 text-xs font-bold uppercase tracking-wider block">Gym Instructors</span>
          <h2 className="text-2xl font-heading font-black text-slate-900 uppercase">CERTIFIED COACHES</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white border border-slate-200 rounded-md overflow-hidden p-4 space-y-3">
            <div className="h-48 bg-slate-100 border border-slate-200 rounded-md overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=600&q=80" 
                alt="Alex Rivera" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-heading font-bold text-slate-900 uppercase">Alex Rivera</h3>
              <p className="text-xs font-bold text-red-600 uppercase">Senior Strength Coach</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Specializes in barbell strength training, powerlifting form, and progressive overload.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-md overflow-hidden p-4 space-y-3">
            <div className="h-48 bg-slate-100 border border-slate-200 rounded-md overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80" 
                alt="Priya Sharma" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-heading font-bold text-slate-900 uppercase">Priya Sharma</h3>
              <p className="text-xs font-bold text-red-600 uppercase">HIIT & Conditioning Specialist</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Leads group cardio sessions, bodyweight conditioning, and endurance training.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-md overflow-hidden p-4 space-y-3">
            <div className="h-48 bg-slate-100 border border-slate-200 rounded-md overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=600&q=80" 
                alt="Marcus Vance" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-heading font-bold text-slate-900 uppercase">Marcus Vance</h3>
              <p className="text-xs font-bold text-red-600 uppercase">Bodybuilding & Hypertrophy</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Focuses on muscle hypertrophy, diet structuring, and customized gym routines.
              </p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default About;

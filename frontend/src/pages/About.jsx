import React from 'react';
import { 
  Award, 
  Users, 
  Dumbbell, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  HeartPulse, 
  Key, 
  Smartphone, 
  Target, 
  BookOpen 
} from 'lucide-react';

const About = () => {
  return (
    <div className="space-y-20 pb-20 pt-6">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden py-16 bg-gradient-to-b from-gym-orange/10 via-transparent to-transparent text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight mb-4 font-sans">
            ABOUT <span className="gradient-text">IRONPULSE GYM</span>
          </h1>

          <p className="text-base sm:text-lg text-gym-muted max-w-2xl mx-auto font-normal leading-relaxed mb-12">
            We are more than just a gym — we are a high-performance community dedicated to sculpting strength, fostering resilience, and delivering real body transformations.
          </p>

          {/* Key Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-gym-card border border-gym-border/80 p-6 rounded-2xl text-center hover:border-gym-orange/50 transition-all">
              <h3 className="text-3xl sm:text-4xl font-black text-gym-orange font-sans">250+</h3>
              <p className="text-xs font-semibold text-slate-300 mt-1 uppercase tracking-wider">Active Members</p>
            </div>
            <div className="bg-gym-card border border-gym-border/80 p-6 rounded-2xl text-center hover:border-gym-orange/50 transition-all">
              <h3 className="text-3xl sm:text-4xl font-black text-gym-orange font-sans">5+</h3>
              <p className="text-xs font-semibold text-slate-300 mt-1 uppercase tracking-wider">Expert Trainers</p>
            </div>
            <div className="bg-gym-card border border-gym-border/80 p-6 rounded-2xl text-center hover:border-gym-orange/50 transition-all">
              <h3 className="text-3xl sm:text-4xl font-black text-gym-orange font-sans">2,000</h3>
              <p className="text-xs font-semibold text-slate-300 mt-1 uppercase tracking-wider">Sq Ft Training Space</p>
            </div>
            <div className="bg-gym-card border border-gym-border/80 p-6 rounded-2xl text-center hover:border-gym-orange/50 transition-all">
              <h3 className="text-3xl sm:text-4xl font-black text-gym-orange font-sans">5+</h3>
              <p className="text-xs font-semibold text-slate-300 mt-1 uppercase tracking-wider">Years of Experience</p>
            </div>
          </div>

        </div>
      </section>

      {/* STORY & MISSION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-2">
          <span className="text-gym-orange text-xs font-extrabold uppercase tracking-widest">Who We Are</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase">OUR LEGACY & MISSION</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-gym-card border border-gym-border/80 p-8 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gym-orange/20 border border-gym-orange/30 flex items-center justify-center text-gym-orange mb-2">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white">Our Story</h3>
            <p className="text-sm text-gym-muted leading-relaxed">
              Founded in 2018, IronPulse Gym started with a simple belief: everyone deserves a world-class training environment equipped with cutting-edge machinery and expert guidance.
            </p>
            <p className="text-sm text-gym-muted leading-relaxed">
              Over the past years, we have expanded into a 10,000 sq ft fitness sanctuary serving over 5,000 active fitness enthusiasts, powerlifters, and athletes across the region.
            </p>
          </div>

          <div className="bg-gym-card border border-gym-border/80 p-8 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gym-orange/20 border border-gym-orange/30 flex items-center justify-center text-gym-orange mb-2">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white">Mission & Vision</h3>
            <p className="text-sm text-gym-muted leading-relaxed">
              <strong className="text-slate-100">Mission:</strong> To empower individuals of all fitness levels to unlock their maximum potential through science-backed training, structured nutrition, and an inspiring atmosphere.
            </p>
            <p className="text-sm text-gym-muted leading-relaxed">
              <strong className="text-slate-100">Vision:</strong> To remain the gold standard in physical fitness, known for producing extraordinary transformation stories and building an unbreakable fitness community.
            </p>
          </div>

        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-2">
          <span className="text-gym-orange text-xs font-extrabold uppercase tracking-widest">Why Choose Us</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase">WHAT MAKES US DIFFERENT</h2>
          <p className="text-gym-muted text-sm max-w-xl mx-auto">
            We combine elite equipment, luxury amenities, and personalized attention to give you an unparalleled fitness experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-gym-card border border-gym-border/80 p-6 rounded-2xl hover:border-gym-orange/50 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-gym-orange/20 text-gym-orange flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-white">24/7 Smart Access</h4>
            <p className="text-xs text-gym-muted leading-relaxed">
              Keyless QR biometric entry allowing seamless workouts around your busy schedule.
            </p>
          </div>

          <div className="bg-gym-card border border-gym-border/80 p-6 rounded-2xl hover:border-gym-orange/50 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-gym-orange/20 text-gym-orange flex items-center justify-center">
              <Dumbbell className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-white">Heavy-Duty Equipment</h4>
            <p className="text-xs text-gym-muted leading-relaxed">
              Hammer Strength, Eleiko Olympic bars, and premium machines for peak performance.
            </p>
          </div>

          <div className="bg-gym-card border border-gym-border/80 p-6 rounded-2xl hover:border-gym-orange/50 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-gym-orange/20 text-gym-orange flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-white">Recovery Spa & Sauna</h4>
            <p className="text-xs text-gym-muted leading-relaxed">
              Therapeutic steam room and Finnish sauna suites to accelerate muscle recovery post-workout.
            </p>
          </div>

          <div className="bg-gym-card border border-gym-border/80 p-6 rounded-2xl hover:border-gym-orange/50 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-gym-orange/20 text-gym-orange flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-white">Digital App Tracking</h4>
            <p className="text-xs text-gym-muted leading-relaxed">
              Log your workouts, track member attendance, and generate PDF invoices instantly.
            </p>
          </div>

        </div>
      </section>

      {/* MEET OUR TRAINERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-2">
          <span className="text-gym-orange text-xs font-extrabold uppercase tracking-widest">Expert Guidance</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase">MEET OUR MASTER TRAINERS</h2>
          <p className="text-gym-muted text-sm max-w-xl mx-auto">
            Our certified trainers bring decades of combined experience in strength conditioning, functional training, and nutrition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-gym-card border border-gym-border/80 rounded-3xl overflow-hidden group hover:border-gym-orange/50 transition-all">
            <div className="h-72 overflow-hidden relative">
              <img 
                src="/images/coach_alex_rivera.jpg" 
                alt="Alex Rivera" 
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gym-card via-transparent to-transparent"></div>
            </div>
            <div className="p-6 space-y-2">
              <h3 className="text-xl font-extrabold text-white">Alex Rivera</h3>
              <p className="text-xs font-bold text-gym-orange uppercase tracking-wider">Senior Strength Instructor</p>
              <p className="text-xs text-gym-muted leading-relaxed pt-1">
                Specializes in hypertrophy, powerlifting, and athletic performance with 8+ years experience.
              </p>
            </div>
          </div>

          <div className="bg-gym-card border border-gym-border/80 rounded-3xl overflow-hidden group hover:border-gym-orange/50 transition-all">
            <div className="h-72 overflow-hidden relative">
              <img 
                src="/images/coach_priya_sharma.jpg" 
                alt="Priya Sharma" 
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gym-card via-transparent to-transparent"></div>
            </div>
            <div className="p-6 space-y-2">
              <h3 className="text-xl font-extrabold text-white">Priya Sharma</h3>
              <p className="text-xs font-bold text-gym-orange uppercase tracking-wider">HIIT & Functional Expert</p>
              <p className="text-xs text-gym-muted leading-relaxed pt-1">
                Certified functional movement specialist focused on fat loss, stamina, and agility conditioning.
              </p>
            </div>
          </div>

          <div className="bg-gym-card border border-gym-border/80 rounded-3xl overflow-hidden group hover:border-gym-orange/50 transition-all">
            <div className="h-72 overflow-hidden relative">
              <img 
                src="/images/coach_marcus_vance.jpg" 
                alt="Marcus Vance" 
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gym-card via-transparent to-transparent"></div>
            </div>
            <div className="p-6 space-y-2">
              <h3 className="text-xl font-extrabold text-white">Marcus Vance</h3>
              <p className="text-xs font-bold text-gym-orange uppercase tracking-wider">Master Bodybuilding Coach</p>
              <p className="text-xs text-gym-muted leading-relaxed pt-1">
                Bodybuilding contest prep specialist with proven results in body recomposition and mass building.
              </p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default About;

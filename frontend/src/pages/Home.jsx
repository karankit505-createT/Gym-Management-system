import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { contactAPI } from '../services/api';
import { 
  ArrowRight, 
  Dumbbell, 
  Award, 
  Sparkles, 
  Star, 
  Send,
  Trophy,
  CheckCircle2,
  Loader2
} from 'lucide-react';

const Home = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactError, setContactError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setContactError('');
    setContactSubmitted(false);

    try {
      const res = await contactAPI.submitInquiry(formData);
      if (res.data.success) {
        setContactSubmitted(true);
        setFormData({ name: '', phone: '', email: '', message: '' });
        setTimeout(() => setContactSubmitted(false), 6000);
      }
    } catch (err) {
      setContactError(err.response?.data?.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. HERO BANNER SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-gym-orange/20 rounded-full filter blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-purple-600/10 rounded-full filter blur-[140px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight font-sans">
                UNLEASH YOUR <br />
                <span className="gradient-text">ULTIMATE POTENTIAL</span>
              </h1>

              <p className="text-base sm:text-lg text-gym-muted max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Welcome to IronPulse Gym — state-of-the-art strength arenas, certified personal coaches, dynamic aerobic zones, and premium wellness facilities built for real results.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-4 bg-gym-orange hover:bg-gym-orangeHover text-white font-bold rounded-xl shadow-xl shadow-gym-orange/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                >
                  <span>Start Your Membership</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  to="/membership"
                  className="w-full sm:w-auto px-8 py-4 bg-gym-card hover:bg-gym-cardHover border border-gym-border text-slate-200 font-semibold rounded-xl transition-all text-center"
                >
                  View Membership Plans
                </Link>
              </div>

              {/* Stats Counters */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gym-border/60">
                <div>
                  <h4 className="text-2xl lg:text-3xl font-extrabold text-white">250+</h4>
                  <p className="text-xs text-gym-muted">Active Members</p>
                </div>
                <div>
                  <h4 className="text-2xl lg:text-3xl font-extrabold text-white">5+</h4>
                  <p className="text-xs text-gym-muted">Expert Trainers</p>
                </div>
                <div>
                  <h4 className="text-2xl lg:text-3xl font-extrabold text-white">25+</h4>
                  <p className="text-xs text-gym-muted">Modern Machines</p>
                </div>
              </div>

            </div>

            {/* Hero Image Card */}
            <div className="relative">
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden border border-gym-border/80 shadow-2xl bg-gym-card">
                <img
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80"
                  alt="Gym Workout"
                  className="w-full h-[420px] lg:h-[480px] object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gym-dark via-transparent to-transparent"></div>
                
                {/* Floating Badge */}
                <div className="absolute bottom-6 left-6 right-6 p-4 glass-panel rounded-2xl border border-white/10 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gym-orange/20 text-gym-orange rounded-xl border border-gym-orange/30">
                      <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm">#1 Rated Gym 2026</h4>
                      <p className="text-xs text-gym-muted">Voted Top Fitness Facility</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gym-orange bg-gym-orange/10 px-3 py-1 rounded-full border border-gym-orange/30">
                    5.0 ★★★★★
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. EXPLORE OUR CLUB (QUICK NAV CARDS TO SPECIFIC PAGES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-gym-orange text-xs font-bold uppercase tracking-widest">Explore IronPulse</span>
          <h2 className="text-3xl lg:text-4xl font-black text-white">EVERYTHING AT YOUR FINGERTIPS</h2>
          <p className="text-gym-muted text-sm max-w-xl mx-auto">
            Click on any section below to view detailed information, amenities, membership pricing, and transformation stories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* About Card */}
          <div className="bg-gym-card border border-gym-border/80 rounded-2xl p-6 flex flex-col justify-between hover:border-gym-orange/60 transition-all duration-300 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gym-orange/20 border border-gym-orange/40 flex items-center justify-center text-gym-orange group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-white">About Us</h3>
              <p className="text-xs text-gym-muted leading-relaxed">
                Learn about our story, mission, certified coaches, and high-performance training culture.
              </p>
            </div>
            <Link
              to="/about"
              className="mt-6 inline-flex items-center text-xs font-bold text-gym-orange hover:text-white transition-colors space-x-1"
            >
              <span>Explore About Us</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Facilities Card */}
          <div className="bg-gym-card border border-gym-border/80 rounded-2xl p-6 flex flex-col justify-between hover:border-gym-orange/60 transition-all duration-300 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gym-orange/20 border border-gym-orange/40 flex items-center justify-center text-gym-orange group-hover:scale-110 transition-transform">
                <Dumbbell className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-white">Facilities & Equipment</h3>
              <p className="text-xs text-gym-muted leading-relaxed">
                Check out our 2,000 sq ft heavy strength arena, cardio studio, steam sauna, and smoothie bar.
              </p>
            </div>
            <Link
              to="/facilities"
              className="mt-6 inline-flex items-center text-xs font-bold text-gym-orange hover:text-white transition-colors space-x-1"
            >
              <span>View All Facilities</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Membership Plans Card */}
          <div className="bg-gym-card border border-gym-border/80 rounded-2xl p-6 flex flex-col justify-between hover:border-gym-orange/60 transition-all duration-300 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gym-orange/20 border border-gym-orange/40 flex items-center justify-center text-gym-orange group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-white">Membership Plans</h3>
              <p className="text-xs text-gym-muted leading-relaxed">
                Compare Monthly, Pro, Elite, and VIP yearly plans with instant online Razorpay payment & digital invoices.
              </p>
            </div>
            <Link
              to="/membership"
              className="mt-6 inline-flex items-center text-xs font-bold text-gym-orange hover:text-white transition-colors space-x-1"
            >
              <span>View Pricing Plans</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Testimonials Card */}
          <div className="bg-gym-card border border-gym-border/80 rounded-2xl p-6 flex flex-col justify-between hover:border-gym-orange/60 transition-all duration-300 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gym-orange/20 border border-gym-orange/40 flex items-center justify-center text-gym-orange group-hover:scale-110 transition-transform">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-white">Member Reviews</h3>
              <p className="text-xs text-gym-muted leading-relaxed">
                Read real transformation stories, member feedback, and continuous video success testimonials.
              </p>
            </div>
            <Link
              to="/testimonials"
              className="mt-6 inline-flex items-center text-xs font-bold text-gym-orange hover:text-white transition-colors space-x-1"
            >
              <span>Read Testimonials</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* 3. CONTACT FORM SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-gym-card border border-gym-border/80 rounded-3xl p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            <div className="space-y-4">
              <span className="text-gym-orange text-xs font-bold uppercase tracking-widest">Get In Touch</span>
              <h2 className="text-3xl font-black text-white">HAVE QUESTIONS? DROP US A MESSAGE!</h2>
              <p className="text-gym-muted text-sm leading-relaxed">
                Want to book a free 1-day trial pass or inquire about custom corporate packages? Fill out the form and our team will get back to you within 2 hours.
              </p>

              <div className="space-y-3 pt-4">
                <div className="flex items-center space-x-3 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-gym-orange shrink-0" />
                  <span>Free 1-Day Trial Access Pass</span>
                </div>
                <div className="flex items-center space-x-3 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-gym-orange shrink-0" />
                  <span>Personal Trainer Consultation Included</span>
                </div>
                <div className="flex items-center space-x-3 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-gym-orange shrink-0" />
                  <span>Instant Confirmation via Email</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              {contactSubmitted && (
                <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs p-3.5 rounded-xl flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>Thank you! Your inquiry has been saved. Our team will get back to you within 2 hours.</span>
                </div>
              )}

              {contactError && (
                <div className="bg-red-500/10 border border-red-500/40 text-red-300 text-xs p-3.5 rounded-xl">
                  {contactError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gym-muted mb-1">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="w-full bg-gym-dark border border-gym-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gym-orange"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gym-muted mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+91 98765 43210"
                    className="w-full bg-gym-dark border border-gym-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gym-orange"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gym-muted mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                  className="w-full bg-gym-dark border border-gym-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gym-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gym-muted mb-1">Message</label>
                <textarea
                  rows={3}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="How can we help you?"
                  className="w-full bg-gym-dark border border-gym-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gym-orange"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-gym-orange hover:bg-gym-orangeHover disabled:opacity-50 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Inquiry...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
